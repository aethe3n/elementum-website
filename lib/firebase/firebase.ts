import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getAuth, connectAuthEmulator, Auth, browserLocalPersistence, setPersistence } from 'firebase/auth'

// Force immediate environment check
const ENV_CHECK = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  timestamp: new Date().toISOString(),
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server'
};

// Immediately log environment check
console.warn('IMMEDIATE ENV CHECK:', {
  ...ENV_CHECK,
  apiKeyPrefix: ENV_CHECK.apiKey ? ENV_CHECK.apiKey.substring(0, 10) + '...' : 'NOT SET'
});

// Debug: Log initialization context
console.log('Firebase Initialization Context:', {
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
  environment: process.env.NODE_ENV,
  timestamp: new Date().toISOString()
});

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
} as const;

// Enhanced validation with immediate feedback
const validateConfig = () => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId'] as const;
  const missingFields = requiredFields.filter(field => !firebaseConfig[field]);
  
  // Immediate API key validation
  if (firebaseConfig.apiKey?.includes('AIzaSyDSUFobiJZhmYiNLE')) {
    console.error('CRITICAL: Old API key still in use. Please check environment variables.');
    throw new Error('Old API key detected');
  }

  if (missingFields.length > 0) {
    throw new Error(`Missing required Firebase configuration: ${missingFields.join(', ')}`);
  }

  // Log sanitized config for debugging
  console.log('Firebase Config Validation:', {
    apiKeyPresent: !!firebaseConfig.apiKey,
    apiKeyPrefix: firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(0, 10) + '...' : 'missing',
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    configComplete: missingFields.length === 0,
    timestamp: new Date().toISOString()
  });
};

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

try {
  // Validate configuration before initialization
  validateConfig();

  // Check for existing Firebase instances
  const existingApps = getApps();
  console.log('Existing Firebase apps:', existingApps.length);

  // Initialize or get existing Firebase app
  app = existingApps.length === 0 ? initializeApp(firebaseConfig) : existingApps[0];
  
  // Initialize Firestore
  db = getFirestore(app);
  
  // Initialize Auth with persistence
  auth = getAuth(app);
  
  // Set persistence to LOCAL
  if (typeof window !== 'undefined') {
    setPersistence(auth, browserLocalPersistence)
      .then(() => console.log('Auth persistence set to LOCAL'))
      .catch(error => console.error('Error setting auth persistence:', error));
  }

  // Enhanced auth state monitoring
  auth.onAuthStateChanged((user) => {
    console.log('Auth State Change:', {
      timestamp: new Date().toISOString(),
      userId: user?.uid,
      isAuthenticated: !!user,
      emailVerified: user?.emailVerified,
      provider: user?.providerData[0]?.providerId
    });
  });

  // Verify initialization
  console.log('Firebase Initialization Success:', {
    appName: app.name,
    authDomain: auth.app.options.authDomain,
    currentUser: auth.currentUser ? 'Authenticated' : 'Not Authenticated'
  });

} catch (error) {
  console.error('Firebase Initialization Error:', {
    error,
    config: {
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId,
      apiKeyPrefix: firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(0, 10) + '...' : 'missing'
    }
  });
  throw error;
}

export { app as default, db, auth }; 