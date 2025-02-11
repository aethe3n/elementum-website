import * as admin from 'firebase-admin';
import { handleSubscriptionUpdated, cleanupDeletedUser } from './subscriptions';

// Initialize Firebase Admin
admin.initializeApp();

// Export all functions
export {
  handleSubscriptionUpdated,
  cleanupDeletedUser
}; 