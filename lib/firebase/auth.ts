// lib/firebase/auth.ts
import { 
  auth, 
  googleProvider, 
  facebookProvider, 
  githubProvider 
} from './config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  sendPasswordResetEmail,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  sendEmailVerification,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './config';

// Exportar auth y onAuthStateChange
export { auth };
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Interfaz de usuario
export interface UserData {
  uid: string;
  email: string | null;
  nombre: string | null;
  fotoURL?: string | null;
  rol: 'cliente' | 'contratista' | 'admin';
  telefono?: string;
  emailVerificado: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Registrar con email y contraseña
export const registerWithEmail = async (
  email: string,
  password: string,
  nombre: string,
  rol: 'cliente' | 'contratista' = 'cliente'
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: nombre });

    const userData: UserData = {
      uid: user.uid,
      email: user.email,
      nombre,
      fotoURL: user.photoURL,
      rol,
      emailVerificado: user.emailVerified,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'usuarios', user.uid), userData);
    await sendEmailVerification(user);

    return { user, userData };
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
};

// Iniciar sesión con email y contraseña
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

// Iniciar sesión con Google
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
    if (!userDoc.exists()) {
      const userData: UserData = {
        uid: user.uid,
        email: user.email,
        nombre: user.displayName,
        fotoURL: user.photoURL,
        rol: 'cliente',
        emailVerificado: user.emailVerified,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await setDoc(doc(db, 'usuarios', user.uid), userData);
    }
    
    return user;
  } catch (error) {
    console.error('Error en login con Google:', error);
    throw error;
  }
};

// Iniciar sesión con Facebook
export const loginWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    const user = result.user;
    
    const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
    if (!userDoc.exists()) {
      const userData: UserData = {
        uid: user.uid,
        email: user.email,
        nombre: user.displayName,
        fotoURL: user.photoURL,
        rol: 'cliente',
        emailVerificado: user.emailVerified,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await setDoc(doc(db, 'usuarios', user.uid), userData);
    }
    
    return user;
  } catch (error) {
    console.error('Error en login con Facebook:', error);
    throw error;
  }
};

export const loginWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;
    
    const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
    if (!userDoc.exists()) {
      const userData: UserData = {
        uid: user.uid,
        email: user.email,
        nombre: user.displayName,
        fotoURL: user.photoURL,
        rol: 'cliente',
        emailVerificado: user.emailVerified,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await setDoc(doc(db, 'usuarios', user.uid), userData);
    }
    
    return user;
  } catch (error) {
    console.error('Error en login con GitHub:', error);
    throw error;
  }
};

// Cerrar sesión
export const logoutUser = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
};

// Restablecer contraseña
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error al enviar email de restablecimiento:', error);
    throw error;
  }
};

// Obtener usuario actual
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Obtener datos del usuario desde Firestore
export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'usuarios', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    return null;
  }
};

// Actualizar datos del usuario
export const updateUserData = async (uid: string, data: Partial<UserData>) => {
  try {
    const userRef = doc(db, 'usuarios', uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
};