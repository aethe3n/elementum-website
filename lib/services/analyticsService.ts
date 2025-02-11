import { db } from '@/lib/firebase/firebase';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import type { Subscription } from '@/lib/firebase/stripe';

export interface SubscriptionEvent {
  userId: string;
  eventType: 'subscription_created' | 'subscription_updated' | 'subscription_cancelled' | 'payment_succeeded' | 'payment_failed';
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface SubscriptionMetrics {
  totalRevenue: number;
  activeSubscriptions: number;
  churnRate: number;
  averageRevenue: number;
}

export async function trackSubscriptionEvent(event: SubscriptionEvent) {
  try {
    await addDoc(collection(db, 'subscription_events'), {
      ...event,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error tracking subscription event:', error);
  }
}

export async function getSubscriptionMetrics(startDate: Date, endDate: Date): Promise<SubscriptionMetrics> {
  try {
    const eventsRef = collection(db, 'subscription_events');
    const eventsQuery = query(
      eventsRef,
      where('timestamp', '>=', startDate.toISOString()),
      where('timestamp', '<=', endDate.toISOString()),
      orderBy('timestamp', 'desc')
    );

    const snapshot = await getDocs(eventsQuery);
    const events = snapshot.docs.map(doc => doc.data() as SubscriptionEvent);

    // Calculate metrics
    const revenue = events
      .filter(e => e.eventType === 'payment_succeeded')
      .reduce((sum, event) => sum + event.amount, 0);

    const activeSubscriptions = new Set(
      events
        .filter(e => e.eventType === 'subscription_created')
        .map(e => e.userId)
    ).size;

    const cancelledSubscriptions = events
      .filter(e => e.eventType === 'subscription_cancelled')
      .length;

    const totalSubscriptions = activeSubscriptions + cancelledSubscriptions;
    const churnRate = totalSubscriptions > 0 ? 
      (cancelledSubscriptions / totalSubscriptions) * 100 : 0;

    const averageRevenue = activeSubscriptions > 0 ? 
      revenue / activeSubscriptions : 0;

    return {
      totalRevenue: revenue,
      activeSubscriptions,
      churnRate,
      averageRevenue,
    };
  } catch (error) {
    console.error('Error getting subscription metrics:', error);
    return {
      totalRevenue: 0,
      activeSubscriptions: 0,
      churnRate: 0,
      averageRevenue: 0,
    };
  }
}

export async function getUserSubscriptionHistory(userId: string) {
  try {
    const eventsRef = collection(db, 'subscription_events');
    const eventsQuery = query(
      eventsRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );

    const snapshot = await getDocs(eventsQuery);
    return snapshot.docs.map(doc => doc.data() as SubscriptionEvent);
  } catch (error) {
    console.error('Error getting user subscription history:', error);
    return [];
  }
}

export async function getRevenueByPlan() {
  try {
    const eventsRef = collection(db, 'subscription_events');
    const eventsQuery = query(
      eventsRef,
      where('eventType', '==', 'payment_succeeded'),
      orderBy('timestamp', 'desc')
    );

    const snapshot = await getDocs(eventsQuery);
    const events = snapshot.docs.map(doc => doc.data() as SubscriptionEvent);

    return events.reduce((acc, event) => {
      acc[event.planName] = (acc[event.planName] || 0) + event.amount;
      return acc;
    }, {} as Record<string, number>);
  } catch (error) {
    console.error('Error getting revenue by plan:', error);
    return {};
  }
} 