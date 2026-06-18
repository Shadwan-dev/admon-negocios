// lib/firebase/config.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// ✅ Tus credenciales de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCiOkw4Al9iHkFBOVkdqPixRttm2UrswDw",
  authDomain: "buildmaster-global.firebaseapp.com",
  projectId: "buildmaster-global",
  storageBucket: "buildmaster-global.firebasestorage.app",
  messagingSenderId: "595033974975",
  appId: "1:595033974975:web:0357e1aa090c618ae77e0a",
  measurementId: "G-548EY9BKSF"
};

// Inicializar Firebase (evitar reinicializar en SSR)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Servicios
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Proveedores de autenticación
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();

// Configurar proveedores
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

facebookProvider.setCustomParameters({
  display: 'popup'
});

export { app, auth, db, storage, googleProvider, facebookProvider, githubProvider };