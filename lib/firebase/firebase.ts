import { initializeApp, getApps, FirebaseApp, deleteApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getAuth, connectAuthEmulator, Auth, browserLocalPersistence, setPersistence } from 'firebase/auth'

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

// Check if we're running on the server
const isServer = typeof window === 'undefined';

// Production domain check (only run on client)
const PRODUCTION_DOMAINS = ['www.elementumglobal.com', 'elementumglobal.com'];
const isProductionDomain = !isServer && PRODUCTION_DOMAINS.includes(window.location.hostname);

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: isProductionDomain ? 'elementumglobal.com' : process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
} as const;

function initializeFirebase() {
  if (isServer) {
    console.log('Server-side Firebase initialization skipped');
    return;
  }

  try {
    // Log initialization attempt
    console.log('Initializing Firebase on client:', {
      domain: window.location.hostname,
      isProduction: isProductionDomain,
      apiKeyStatus: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Present' : 'Missing',
      environment: process.env.NODE_ENV
    });

    // Clean up existing instances
    getApps().forEach(app => {
      console.log('Cleaning up existing Firebase app:', app.name);
      deleteApp(app);
    });

    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    console.log('New Firebase app initialized:', app.name);

    // Initialize Firestore
    db = getFirestore(app);

    // Initialize Auth
    auth = getAuth(app);

    // Set persistence (client-side only)
    setPersistence(auth, browserLocalPersistence)
      .then(() => console.log('Auth persistence set to LOCAL'))
      .catch(error => console.error('Error setting auth persistence:', error));

    // Enhanced auth state monitoring
    auth.onAuthStateChanged((user) => {
      console.log('Auth State Change:', {
        timestamp: new Date().toISOString(),
        userId: user?.uid,
        isAuthenticated: !!user,
        emailVerified: user?.emailVerified,
        provider: user?.providerData[0]?.providerId,
        domain: window.location.hostname,
        isProductionDomain
      });
    });

    return { app, db, auth };
  } catch (error) {
    console.error('Firebase Initialization Error:', {
      error,
      config: {
        authDomain: firebaseConfig.authDomain,
        projectId: firebaseConfig.projectId,
        apiKeyPrefix: firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(0, 10) + '...' : 'missing',
        isProductionDomain
      }
    });
    throw error;
  }
}

// Initialize Firebase if we're on the client
if (!isServer) {
  initializeFirebase();
}

export { app as default, db, auth }; 