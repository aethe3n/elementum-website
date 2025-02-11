import { db } from '@/lib/firebase/firebase';
import { collection, doc, getDoc, setDoc, updateDoc, increment, query, where, getDocs, orderBy, limit as firestoreLimit } from 'firebase/firestore';

export interface UsageMetrics {
  apiCalls: number;
  storageUsed: number;
  activeUsers: number;
  lastUpdated: string;
}

export interface UsageLimit {
  maxApiCalls: number;
  maxStorage: number;
  maxUsers: number;
}

const PLAN_LIMITS: Record<string, UsageLimit> = {
  'BASIC': {
    maxApiCalls: 1000,
    maxStorage: 5 * 1024 * 1024 * 1024, // 5GB
    maxUsers: 5
  },
  'PRO': {
    maxApiCalls: 10000,
    maxStorage: 20 * 1024 * 1024 * 1024, // 20GB
    maxUsers: 20
  },
  'ENTERPRISE': {
    maxApiCalls: 100000,
    maxStorage: 100 * 1024 * 1024 * 1024, // 100GB
    maxUsers: 100
  }
};

export async function trackUsage(userId: string, metric: keyof UsageMetrics, value: number = 1) {
  try {
    const usageRef = doc(db, 'usage', userId);
    const usageDoc = await getDoc(usageRef);

    if (!usageDoc.exists()) {
      await setDoc(usageRef, {
        apiCalls: 0,
        storageUsed: 0,
        activeUsers: 0,
        lastUpdated: new Date().toISOString()
      });
    }

    await updateDoc(usageRef, {
      [metric]: increment(value),
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error tracking usage:', error);
    throw error;
  }
}

export async function getUserUsage(userId: string): Promise<UsageMetrics> {
  try {
    const usageRef = doc(db, 'usage', userId);
    const usageDoc = await getDoc(usageRef);

    if (!usageDoc.exists()) {
      return {
        apiCalls: 0,
        storageUsed: 0,
        activeUsers: 0,
        lastUpdated: new Date().toISOString()
      };
    }

    return usageDoc.data() as UsageMetrics;
  } catch (error) {
    console.error('Error getting user usage:', error);
    throw error;
  }
}

export async function checkUsageLimit(userId: string, planId: string): Promise<boolean> {
  try {
    const usage = await getUserUsage(userId);
    const limits = PLAN_LIMITS[planId];

    if (!limits) {
      console.error('Unknown plan ID:', planId);
      return false;
    }

    return (
      usage.apiCalls <= limits.maxApiCalls &&
      usage.storageUsed <= limits.maxStorage &&
      usage.activeUsers <= limits.maxUsers
    );
  } catch (error) {
    console.error('Error checking usage limit:', error);
    return false;
  }
}

export async function getTopUsers(limitCount: number = 10): Promise<Array<{ userId: string; usage: UsageMetrics }>> {
  try {
    const usageRef = collection(db, 'usage');
    const usageQuery = query(
      usageRef,
      orderBy('apiCalls', 'desc'),
      firestoreLimit(limitCount)
    );

    const snapshot = await getDocs(usageQuery);
    return snapshot.docs.map(doc => ({
      userId: doc.id,
      usage: doc.data() as UsageMetrics
    }));
  } catch (error) {
    console.error('Error getting top users:', error);
    return [];
  }
}

export async function resetUsageMetrics(userId: string) {
  try {
    const usageRef = doc(db, 'usage', userId);
    await setDoc(usageRef, {
      apiCalls: 0,
      storageUsed: 0,
      activeUsers: 0,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error resetting usage metrics:', error);
    throw error;
  }
} 