import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth'

// Debug: Log config values (without exposing full key)
const debugConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? `${process.env.NEXT_PUBLIC_FIREBASE_API_KEY.slice(0, 5)}...` : 'not set',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'not set',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'not set',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'not set',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'not set',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'not set',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'not set'
};

console.log('Firebase Config (masked):', debugConfig);

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
} as const;

// Check if any required config is missing
const requiredConfig = ['apiKey', 'authDomain', 'projectId'] as const;
const missingConfig = requiredConfig.filter(key => !firebaseConfig[key]);

if (missingConfig.length > 0) {
  console.error('Missing required Firebase config:', missingConfig);
  throw new Error(`Missing required Firebase configuration: ${missingConfig.join(', ')}`);
}

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

try {
  // Initialize Firebase
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  console.log('Firebase initialized successfully');
  
  // Initialize services
  db = getFirestore(app);
  auth = getAuth(app);
  
  // Log auth state
  auth.onAuthStateChanged((user) => {
    console.log('Auth state changed:', user ? `User ${user.uid} logged in` : 'No user');
  });
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

export { app as default, db, auth }; 