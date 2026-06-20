import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore, persistentLocalCache } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDGLMnfZazFD9rBxfZFWjpSwwOAdAy1jgo",
  authDomain: "tinker-b.firebaseapp.com",
  projectId: "tinker-b",
  storageBucket: "tinker-b.firebasestorage.app",
  messagingSenderId: "214883948592",
  appId: "1:214883948592:web:c1c3d54d3c8645d31d75f5",
  measurementId: "G-DM2YS43W8D"
};

console.log('📋 Configuración Firebase:');
console.log('📁 Project ID:', firebaseConfig.projectId);

// Inicializar Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// ✅ INICIALIZAR FIRESTORE CON FALLBACK
let db = null;
let storage = null;

try {
  // Intentar getFirestore (método estándar)
  db = getFirestore(app);
  console.log('✅ Firestore inicializado con getFirestore');
} catch (error) {
  console.warn('⚠️ getFirestore falló, intentando con initializeFirestore...');
  try {
    // Intentar con initializeFirestore (alternativa)
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({})
    });
    console.log('✅ Firestore inicializado con initializeFirestore');
  } catch (error2) {
    console.error('❌ Error inicializando Firestore:', error2);
    db = null;
  }
}

try {
  storage = getStorage(app);
  console.log('✅ Storage inicializado');
} catch (error) {
  console.warn('⚠️ Storage no disponible:', error);
  storage = null;
}

// ✅ FUNCIÓN PARA VERIFICAR CONEXIÓN
export const checkFirebaseConnection = async () => {
  try {
    const user = auth.currentUser;
    return { 
      success: true, 
      user,
      firestoreAvailable: !!db,
      storageAvailable: !!storage,
      projectId: firebaseConfig.projectId
    };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Error desconocido' };
  }
};

// ✅ FUNCIÓN PARA VERIFICAR FIRESTORE (AGREGADA)
export const isFirestoreAvailable = (): boolean => {
  return db !== null;
};

export { app, auth, db, storage };