import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';
import { Change, EventContext } from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-admin/firestore';
import { UserRecord } from 'firebase-admin/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia'
});

interface SubscriptionData {
  id: string;
  status: 'active' | 'past_due' | 'canceled' | 'unpaid';
  items: Array<{
    price: {
      id: string;
      product: {
        name: string;
        metadata: {
          features?: string;
        };
      };
    };
  }>;
  current_period_end: number;
}

interface UserData {
  email: string;
  displayName?: string;
}

interface CustomerData {
  stripeId: string;
}

export const handleSubscriptionUpdated = functions.firestore
  .document('customers/{userId}/subscriptions/{subscriptionId}')
  .onWrite(async (change: Change<DocumentSnapshot>, context: EventContext) => {
    const { userId, subscriptionId } = context.params;
    const subscription = change.after.data() as SubscriptionData | undefined;
    const previousSubscription = change.before.data() as SubscriptionData | undefined;

    if (!subscription) {
      console.log('Subscription was deleted');
      return null;
    }

    try {
      // Get user data
      const userDoc = await admin.firestore()
        .collection('users')
        .doc(userId)
        .get();

      if (!userDoc.exists) {
        console.error('User not found:', userId);
        return null;
      }

      const user = userDoc.data() as UserData;

      // Handle different subscription states
      switch (subscription.status) {
        case 'active':
          if (!previousSubscription || previousSubscription.status !== 'active') {
            // New subscription or reactivation
            await handleNewSubscription(userId, user, subscription);
          }
          break;

        case 'past_due':
          await handlePastDueSubscription(userId, user, subscription);
          break;

        case 'canceled':
          await handleCanceledSubscription(userId, user, subscription);
          break;

        case 'unpaid':
          await handleUnpaidSubscription(userId, user, subscription);
          break;
      }

      // Update user's subscription status
      await admin.firestore()
        .collection('users')
        .doc(userId)
        .update({
          subscriptionStatus: subscription.status,
          subscriptionPlan: subscription.items[0].price.id,
          subscriptionUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

      return null;
    } catch (error) {
      console.error('Error handling subscription update:', error);
      return null;
    }
  });

async function handleNewSubscription(
  userId: string,
  user: UserData,
  subscription: SubscriptionData
) {
  // Send welcome email
  await admin.firestore().collection('mail').add({
    to: user.email,
    template: {
      name: 'SUBSCRIPTION_CREATED',
      data: {
        userName: user.displayName || 'Valued Customer',
        planName: subscription.items[0].price.product.name,
        features: subscription.items[0].price.product.metadata.features?.split(',') || []
      }
    }
  });

  // Initialize usage metrics
  await admin.firestore()
    .collection('usage')
    .doc(userId)
    .set({
      apiCalls: 0,
      storageUsed: 0,
      activeUsers: 0,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });
}

async function handlePastDueSubscription(
  userId: string,
  user: UserData,
  subscription: SubscriptionData
) {
  // Send payment failed email
  await admin.firestore().collection('mail').add({
    to: user.email,
    template: {
      name: 'PAYMENT_FAILED',
      data: {
        userName: user.displayName || 'Valued Customer',
        planName: subscription.items[0].price.product.name,
        updatePaymentLink: `${process.env.NEXT_PUBLIC_APP_URL}/profile`
      }
    }
  });
}

async function handleCanceledSubscription(
  userId: string,
  user: UserData,
  subscription: SubscriptionData
) {
  // Send cancellation email
  await admin.firestore().collection('mail').add({
    to: user.email,
    template: {
      name: 'SUBSCRIPTION_CANCELLED',
      data: {
        userName: user.displayName || 'Valued Customer',
        endDate: new Date(subscription.current_period_end * 1000).toLocaleDateString()
      }
    }
  });
}

async function handleUnpaidSubscription(
  userId: string,
  user: UserData,
  subscription: SubscriptionData
) {
  // Attempt to retry payment
  try {
    await stripe.subscriptions.update(subscription.id, {
      payment_behavior: 'pending_if_incomplete',
      proration_behavior: 'create_prorations'
    });
  } catch (error) {
    console.error('Error retrying payment:', error);
  }

  // Send payment failed email
  await admin.firestore().collection('mail').add({
    to: user.email,
    template: {
      name: 'PAYMENT_FAILED',
      data: {
        userName: user.displayName || 'Valued Customer',
        planName: subscription.items[0].price.product.name,
        updatePaymentLink: `${process.env.NEXT_PUBLIC_APP_URL}/profile`
      }
    }
  });
}

// Cleanup function for when a user is deleted
export const cleanupDeletedUser = functions.auth.user().onDelete(async (user: UserRecord) => {
  try {
    const customersRef = admin.firestore().collection('customers');
    const customerDoc = await customersRef.doc(user.uid).get();

    if (customerDoc.exists) {
      const customer = customerDoc.data() as CustomerData;
      if (customer?.stripeId) {
        // Cancel all subscriptions
        const subscriptions = await stripe.subscriptions.list({
          customer: customer.stripeId
        });

        await Promise.all(
          subscriptions.data.map(sub =>
            stripe.subscriptions.cancel(sub.id)
          )
        );

        // Delete the customer in Stripe
        await stripe.customers.del(customer.stripeId);
      }
    }

    // Delete Firestore data
    await Promise.all([
      customersRef.doc(user.uid).delete(),
      admin.firestore().collection('usage').doc(user.uid).delete(),
      admin.firestore().collection('users').doc(user.uid).delete()
    ]);

    return null;
  } catch (error) {
    console.error('Error cleaning up deleted user:', error);
    return null;
  }
}); 