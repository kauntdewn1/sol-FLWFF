

// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: "G-8EC2WMZ43M"
};

// Initialize Firebase

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;
let firebaseInitialized = false;

// Tries to initialize Firebase services.
// Returns true on success, false on failure (e.g., missing config or SDK error).
function tryInitializeFirebaseServices(): boolean {
  if (firebaseInitialized) return true; // Already successfully initialized

  if (!firebaseConfig.apiKey) {
    console.error( // This console error will still appear if the key is missing.
      "CRITICAL: Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing. Firebase will not initialize correctly. Please check your environment variables."
    );
    return false; // Indicate failure due to missing API key
  }

  if (!firebaseConfig.projectId) {
    console.error(
      "CRITICAL: Firebase Project ID (NEXT_PUBLIC_FIREBASE_PROJECT_ID) is missing. Firebase will not initialize correctly. Please check your environment variables."
    );
    return false; // Indicate failure due to missing Project ID
  }

  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    // These can throw errors if config is provided but invalid (e.g., auth/invalid-api-key)
    db = getFirestore(app);
    auth = getAuth(app);
    return true; // Successfully initialized
  } catch (error) {
    console.error("Error during Firebase core SDK initialization (initializeApp, getFirestore, getAuth):", error);
    // Reset instances if SDK initialization itself fails (e.g. invalid API key if provided)
    app = undefined;
    db = undefined;
    auth = undefined;
    return false; // Indicate failure
  }
}

// Attempt initialization when this module is loaded.
if (tryInitializeFirebaseServices()) {
  firebaseInitialized = true;
} else {
  // Log that module-level init failed. The app might still run, but Firebase features will fail
  // until ensureFirebaseInitialized() is called and succeeds.
  console.warn("Firebase initialization failed at module load. This could be due to missing configuration (API Key, Project ID) or an SDK error. Features requiring Firebase will be unavailable or may cause runtime errors until properly configured. Check previous CRITICAL error messages for details.");
}

export const ensureFirebaseInitialized = (): { app: FirebaseApp; db: Firestore; auth: Auth } => {
  if (!firebaseInitialized) {
    // Attempt to initialize again if not already done or if initial attempt failed
    console.warn("Firebase was not initialized at module load. Attempting re-initialization via ensureFirebaseInitialized().");
    if (tryInitializeFirebaseServices()) {
      firebaseInitialized = true;
    }
  }

  // After all attempts, check if core instances are available.
  // If not, Firebase is unrecoverable for this session/context.
  if (!app || !db || !auth) {
    throw new Error(
      "Firebase services are critically unavailable. This usually means essential Firebase configuration (API Key, Project ID) is missing or incorrect, or that Firebase services (like Auth, Firestore) are not enabled in your Firebase project console. Please verify your environment variables (NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_PROJECT_ID) and your Firebase project setup."
    );
  }
  
  // Type assertion is safe here due to the check above.
  return { app: app!, db: db!, auth: auth! };
};

// Export the potentially undefined instances for direct use (less safe).
// Also export the initialization status flag.
export { app, db, auth, firebaseInitialized as isFirebaseInitialized };
