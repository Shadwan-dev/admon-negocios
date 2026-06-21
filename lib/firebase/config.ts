import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, initializeFirestore, persistentLocalCache, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Inicializar Firebase
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = getAuth(app);

// ✅ Inicializar Firestore correctamente
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (typeof window !== 'undefined') {
  try {
    // ✅ Usar initializeFirestore en lugar de getFirestore
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({})
    });
    console.log('✅ Firestore inicializado con initializeFirestore');
  } catch (error) {
    console.warn('⚠️ Error inicializando Firestore:', error);
    db = null;
  }

  try {
    storage = getStorage(app);
    console.log('✅ Storage inicializado');
  } catch (error) {
    console.warn('⚠️ Storage no disponible:', error);
    storage = null;
  }
} else {
  console.log('ℹ️ Ejecutando en el servidor - Firestore no inicializado');
}

export const checkFirebaseConnection = async () => {
  try {
    const user = auth.currentUser;
    return { 
      success: true, 
      user,
      firestoreAvailable: !!db,
      storageAvailable: !!storage
    };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Error desconocido' };
  }
};

export const isFirestoreAvailable = (): boolean => {
  return db !== null;
};

export { app, auth, db, storage };