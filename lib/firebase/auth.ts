import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth, db, checkFirebaseConnection, isFirestoreAvailable } from './config';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// Verificar conexión al inicio
if (typeof window !== 'undefined') {
  checkFirebaseConnection().then(result => {
    if (!result.success) {
      console.warn('⚠️ Firebase no está conectado correctamente');
    } else {
      console.log('✅ Firebase conectado correctamente');
    }
  });
}

const saveToFirestore = async (path: string, data: any) => {
  if (!isFirestoreAvailable()) {
    console.warn(`⚠️ Firestore no disponible. No se guardó: ${path}`);
    return { success: false, error: 'Firestore no disponible' };
  }
  try {
    await setDoc(doc(db!, path), data);
    return { success: true };
  } catch (error) {
    console.error(`Error guardando en Firestore (${path}):`, error);
    return { success: false, error };
  }
};

export const registerUser = async (email: string, password: string, nombre: string, negocio: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await updateProfile(user, { displayName: nombre });
    
    if (isFirestoreAvailable()) {
      try {
        await saveToFirestore(`usuarios/${user.uid}`, {
          uid: user.uid,
          email,
          nombre,
          negocio,
          rol: 'admin',
          emailVerified: user.emailVerified || false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          config: { monedaLocal: 'Peso', tasaCambioDefecto: 24.50 }
        });

        await saveToFirestore(`tasa_cambio/${user.uid}`, {
          uid: user.uid,
          fecha: new Date().toISOString().split('T')[0],
          valorCompra: 24.50,
          valorVenta: 25.00,
          monedaLocal: 'Peso',
          actualizadoPor: user.uid,
          updatedAt: serverTimestamp(),
        });
      } catch (firestoreError) {
        console.warn('⚠️ Error guardando en Firestore:', firestoreError);
      }
    }
    
    return { success: true, user };
  } catch (error: any) {
    let errorMessage = 'Error al crear la cuenta';
    if (error.code === 'auth/email-already-in-use') errorMessage = 'Este correo ya está registrado';
    else if (error.code === 'auth/weak-password') errorMessage = 'La contraseña es muy débil (mínimo 6 caracteres)';
    else if (error.code === 'auth/invalid-email') errorMessage = 'Correo electrónico inválido';
    return { success: false, error: errorMessage };
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    let errorMessage = 'Error al iniciar sesión';
    if (error.code === 'auth/user-not-found') errorMessage = 'Usuario no encontrado';
    else if (error.code === 'auth/wrong-password') errorMessage = 'Contraseña incorrecta';
    else if (error.code === 'auth/invalid-email') errorMessage = 'Correo electrónico inválido';
    else if (error.code === 'auth/too-many-requests') errorMessage = 'Demasiados intentos fallidos';
    return { success: false, error: errorMessage };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    if (isFirestoreAvailable() && user) {
      const userDoc = await getDoc(doc(db!, 'usuarios', user.uid));
      if (!userDoc.exists()) {
        await saveToFirestore(`usuarios/${user.uid}`, {
          uid: user.uid,
          email: user.email,
          nombre: user.displayName || 'Usuario',
          negocio: 'Mi Negocio',
          rol: 'admin',
          emailVerified: user.emailVerified || false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          config: { monedaLocal: 'Peso', tasaCambioDefecto: 24.50 }
        });
      }
    }
    
    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};