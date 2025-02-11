import { db } from './firebase';
import { collection, doc, getDoc, onSnapshot, addDoc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

// Stripe checkout session function
const createCheckoutSession = httpsCallable(functions, 'ext-firestore-stripe-payments-createCheckoutSession');
const createPortalLink = httpsCallable(functions, 'ext-firestore-stripe-payments-createPortalLink');

export interface Price {
  id: string;
  active: boolean;
  description: string | null;
  unit_amount: number;
  currency: string;
  type: 'one_time' | 'recurring';
  interval: 'month' | 'year' | null;
  interval_count: number | null;
  trial_period_days: number | null;
  metadata: Record<string, string>;
  products: Record<string, string>;
}

export interface Subscription {
  id: string;
  cancel_at_period_end: boolean;
  created: number;
  current_period_end: number;
  current_period_start: number;
  description: string | null;
  ended_at: number | null;
  cancel_at: number | null;
  canceled_at: number | null;
  status: string;
  items: {
    data: {
      price: Price;
    }[];
  };
  metadata: Record<string, string>;
}

export interface Customer {
  id: string;
  stripeId: string;
  stripeLink: string;
}

export async function getStripeCustomer(userId: string): Promise<Customer | null> {
  try {
    const customerDoc = await getDoc(doc(db, 'customers', userId));
    return customerDoc.exists() ? customerDoc.data() as Customer : null;
  } catch (error) {
    console.error('Error getting Stripe customer:', error);
    return null;
  }
}

export async function getSubscription(userId: string): Promise<Subscription | null> {
  try {
    const subscriptionsRef = collection(db, 'customers', userId, 'subscriptions');
    const snapshot = await getDoc(doc(subscriptionsRef, 'sub_id')); // You'll need to store the subscription ID
    return snapshot.exists() ? snapshot.data() as Subscription : null;
  } catch (error) {
    console.error('Error getting subscription:', error);
    return null;
  }
}

export function onSubscriptionUpdate(userId: string, callback: (subscription: Subscription | null) => void) {
  return onSnapshot(
    collection(db, 'customers', userId, 'subscriptions'),
    (snapshot) => {
      // Get the first active subscription
      const subscription = snapshot.docs
        .filter(doc => doc.data().status === 'active' || doc.data().status === 'trialing')
        .sort((a, b) => b.data().created - a.data().created)[0];
      
      callback(subscription ? subscription.data() as Subscription : null);
    },
    (error) => {
      console.error('Error on subscription update:', error);
      callback(null);
    }
  );
}

export async function createStripeCheckoutSession(userId: string, priceId: string, successUrl: string, cancelUrl: string) {
  try {
    const response = await createCheckoutSession({
      price: priceId,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
      },
    });

    const { sessionId } = response.data as { sessionId: string };
    return sessionId;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

export async function createCustomerPortalLink(returnUrl: string) {
  try {
    const response = await createPortalLink({
      returnUrl,
    });

    const { url } = response.data as { url: string };
    return url;
  } catch (error) {
    console.error('Error creating portal link:', error);
    throw error;
  }
} 