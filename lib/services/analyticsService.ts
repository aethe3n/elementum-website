import { db } from '@/lib/firebase/firebase';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';

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

// Temporarily return dummy data until subscription system is implemented
export async function getSubscriptionMetrics(startDate: Date, endDate: Date): Promise<SubscriptionMetrics> {
  return {
    totalRevenue: 0,
    activeSubscriptions: 0,
    churnRate: 0,
    averageRevenue: 0
  };
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
  // Return dummy data until subscription system is implemented
  return {
    'Free Plan': 0
  };
} 