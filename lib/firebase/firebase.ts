import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth'

// Debug: Log all environment variables (masked)
console.log('Environment Variables Check:', {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Set' : 'Not Set',
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Not Set',
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'Set' : 'Not Set'
});

// Force log the actual API key first 10 characters to verify it's the new one
console.log('API Key Check (first 10 chars):', process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 10));

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
} as const;

// Log the full config for debugging
console.log('Full Firebase Config:', {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : undefined
});

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
  // Check if Firebase is already initialized
  const existingApps = getApps();
  console.log('Existing Firebase apps:', existingApps.length);

  // Initialize Firebase
  app = existingApps.length === 0 ? initializeApp(firebaseConfig) : existingApps[0];
  console.log('Firebase app initialized:', app.name);
  
  // Initialize services
  db = getFirestore(app);
  auth = getAuth(app);
  
  // Log auth state
  auth.onAuthStateChanged((user) => {
    console.log('Auth state changed:', user ? `User ${user.uid} logged in` : 'No user');
  });

  // Verify auth configuration
  console.log('Auth configuration:', {
    currentUser: auth.currentUser ? 'Set' : 'Not Set',
    apiKey: auth.app.options.apiKey ? `${auth.app.options.apiKey.substring(0, 10)}...` : 'Not Set'
  });

} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

export { app as default, db, auth }; 