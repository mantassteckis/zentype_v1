import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

let app: App;
let db: ReturnType<typeof getFirestore>;

if (getApps().length === 0) {
  try {
    if (process.env.NODE_ENV === 'production') {
      // Production: Firebase App Hosting provides Application Default Credentials (ADC)
      // No service account JSON needed - credentials are automatically available
      console.log('🚀 Initializing Firebase Admin SDK in production with ADC');
      
      app = initializeApp({
        // Firebase App Hosting automatically provides credentials via ADC
        // No credential parameter needed - it uses the built-in service account
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "solotype-23c1f",
      });
      
      console.log('✅ Firebase Admin SDK initialized with Application Default Credentials');
    } else {
      // Development: Try multiple approaches
      const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
      let serviceAccount = null;
      
      if (serviceAccountKey) {
        if (serviceAccountKey.startsWith('{')) {
          // It's JSON content
          try {
            serviceAccount = JSON.parse(serviceAccountKey);
          } catch (error) {
            console.warn('⚠️ Invalid JSON in FIREBASE_SERVICE_ACCOUNT_KEY');
          }
        } else {
          // It's a file path
          const serviceAccountPath = path.isAbsolute(serviceAccountKey) 
            ? serviceAccountKey 
            : path.join(process.cwd(), serviceAccountKey);
          
          if (fs.existsSync(serviceAccountPath)) {
            serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
          }
        }
      }
      
      if (serviceAccount) {
        app = initializeApp({
          credential: cert(serviceAccount),
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "solotype-23c1f",
        });
      } else {
        // Fallback to default credentials (Firebase CLI or Google Cloud SDK)
        console.warn('⚠️ Service account not found, using default credentials');
        app = initializeApp({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "solotype-23c1f",
        });
      }
    }
    
    db = getFirestore(app);
    console.log('✅ Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('❌ Firebase Admin SDK initialization failed:', error);
    // Don't throw error in development, allow graceful degradation
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Firebase Admin SDK initialization failed');
    } else {
      console.warn('⚠️ Continuing without Firebase Admin SDK in development mode');
      // Create a mock app for development
      app = initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "solotype-23c1f",
      });
      db = getFirestore(app);
    }
  }
} else {
  app = getApps()[0];
  db = getFirestore(app);
}

export { app, db };