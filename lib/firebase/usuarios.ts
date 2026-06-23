import { db } from './config';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  DocumentData
} from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail, fetchSignInMethodsForEmail } from 'firebase/auth';
import { getNegocioConfig } from '../modules/modules';

export interface Permisos {
  inventario: boolean;
  ventas: boolean;
  produccion: boolean;
  caja: boolean;
  empleados: boolean;
  clientes: boolean;
  proveedores: boolean;
  compras: boolean;
  reportes: boolean;
  fichas_costo: boolean;
}

export interface Usuario {
  uid: string;
  email: string;
  nombre: string;
  rol: 'admin' | 'gerente' | 'empleado' | 'invitado';
  negocioUid: string;
  permisos: Permisos;
  activo: boolean;
  creadoPor: string;
  createdAt?: any;
  updatedAt?: any;
}

// ✅ Verificar disponibilidad de Firestore
const getDb = () => {
  if (typeof window === 'undefined') {
    throw new Error('Firestore solo está disponible en el cliente');
  }
  if (!db) {
    throw new Error('Firestore no está disponible');
  }
  return db;
};

// ✅ Restablecer contraseña de un usuario (envía email de recuperación)
export const resetearContraseña = async (email: string): Promise<{ success: boolean; error?: string }> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ resetearContraseña ejecutado en el servidor - simulando éxito');
    return { success: true };
  }

  try {
    const auth = getAuth();
    
    // Verificar que el email existe en Firebase Auth
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length === 0) {
        return { success: false, error: 'El usuario no existe en el sistema' };
      }
    } catch (fetchError) {
      // Si no se puede verificar, igual intentamos enviar
      console.warn('No se pudo verificar email, intentando enviar:', fetchError);
    }
    
    // ✅ Enviar email de restablecimiento
    await sendPasswordResetEmail(auth, email, {
      url: `${window.location.origin}/login`,
      handleCodeInApp: false,
    });
    
    console.log('✅ Email de restablecimiento enviado a:', email);
    return { success: true };
  } catch (error: any) {
    console.error('Error enviando email de restablecimiento:', error);
    let errorMessage = 'Error al enviar el correo de restablecimiento';
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'El usuario no existe en el sistema';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'El correo electrónico es inválido';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Demasiados intentos. Intenta más tarde';
    }
    
    return { success: false, error: errorMessage };
  }
};

// ✅ Restablecer contraseña por UID (primero obtener email)
export const resetearContraseñaPorUid = async (uid: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Obtener el usuario de Firestore
    const usuario = await getUsuarioById(uid);
    if (!usuario) {
      return { success: false, error: 'Usuario no encontrado' };
    }
    
    if (!usuario.email) {
      return { success: false, error: 'El usuario no tiene correo electrónico registrado' };
    }
    
    // Enviar restablecimiento
    return await resetearContraseña(usuario.email);
  } catch (error: any) {
    console.error('Error restableciendo contraseña por UID:', error);
    return { success: false, error: error.message };
  }
};

// ✅ Obtener todos los usuarios de un negocio
export const getUsuariosByNegocio = async (negocioUid: string): Promise<Usuario[]> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ getUsuariosByNegocio ejecutado en el servidor - retornando vacío');
    return [];
  }

  try {
    const firestore = getDb();
    const q = query(
      collection(firestore, 'usuarios'),
      where('negocioUid', '==', negocioUid),
      orderBy('nombre', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    } as Usuario));
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    return [];
  }
};

// ✅ Obtener un usuario por ID
export const getUsuarioById = async (uid: string): Promise<Usuario | null> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ getUsuarioById ejecutado en el servidor - retornando null');
    return null;
  }

  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'usuarios', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { uid: docSnap.id, ...docSnap.data() } as Usuario;
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    return null;
  }
};

// ✅ Crear un nuevo usuario (con autenticación)
export const crearUsuario = async (
  email: string,
  password: string,
  nombre: string,
  rol: string,
  negocioUid: string,
  permisos: Permisos,
  creadoPor: string
): Promise<{ success: boolean; uid?: string; error?: string }> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ crearUsuario ejecutado en el servidor - simulando éxito');
    return { success: true, uid: 'simulado-' + Date.now() };
  }

  try {
    const firestore = getDb();
    const auth = getAuth();
    
    // ✅ Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // ✅ Guardar datos en Firestore
    const usuarioData: Omit<Usuario, 'uid'> = {
      email,
      nombre,
      rol: rol as any,
      negocioUid,
      permisos,
      activo: true,
      creadoPor,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(firestore, 'usuarios', user.uid), usuarioData);
    
    console.log('✅ Usuario creado:', user.uid);
    return { success: true, uid: user.uid };
  } catch (error: any) {
    console.error('Error creando usuario:', error);
    let errorMessage = 'Error al crear usuario';
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Este correo ya está registrado';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'La contraseña es muy débil (mínimo 6 caracteres)';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Correo electrónico inválido';
    }
    return { success: false, error: errorMessage };
  }
};

// ✅ Actualizar un usuario
export const actualizarUsuario = async (
  uid: string,
  data: Partial<Omit<Usuario, 'uid' | 'negocioUid' | 'creadoPor' | 'createdAt'>>
): Promise<{ success: boolean; error?: string }> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ actualizarUsuario ejecutado en el servidor - simulando éxito');
    return { success: true };
  }

  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'usuarios', uid);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    console.log('✅ Usuario actualizado');
    return { success: true };
  } catch (error: any) {
    console.error('Error actualizando usuario:', error);
    return { success: false, error: error.message };
  }
};

// ✅ Desactivar/Activar un usuario
export const toggleUsuarioActivo = async (
  uid: string,
  activo: boolean
): Promise<{ success: boolean; error?: string }> => {
  return await actualizarUsuario(uid, { activo });
};

// ✅ Eliminar un usuario (soft delete - solo desactivar)
export const eliminarUsuario = async (uid: string): Promise<{ success: boolean; error?: string }> => {
  return await toggleUsuarioActivo(uid, false);
};

// ✅ Obtener todos los negocios de un usuario (incluyendo invitaciones)
// ✅ Obtener todos los negocios de un usuario (incluyendo invitaciones)
export const getNegociosDeUsuario = async (uid: string): Promise<{
  uid: string;
  nombre: string;
  tipo: string;
  rol: 'admin' | 'gerente' | 'empleado' | 'invitado';
  activo: boolean;
}[]> => {
  try {
    const firestore = getDb();
    
    // 1. Obtener el usuario
    const userDoc = await getDoc(doc(firestore, 'usuarios', uid));
    if (!userDoc.exists()) return [];
    
    const userData = userDoc.data();
    
    // 2. Si el usuario tiene múltiples negocios (nueva estructura)
    if (userData.negocios && Array.isArray(userData.negocios)) {
      const negociosInfo = await Promise.all(
        userData.negocios.map(async (n: any) => {
          const negocio = await getNegocioConfig(n.uid);
          return {
            uid: n.uid,
            nombre: negocio?.nombre || 'Sin nombre',
            tipo: negocio?.tipo || 'otros',
            rol: n.rol || 'invitado',
            activo: n.activo !== false,
          };
        })
      );
      return negociosInfo.filter(n => n.activo);
    }
    
    // 3. Si solo tiene un negocio (estructura anterior)
    if (userData.negocioUid) {
      const negocio = await getNegocioConfig(userData.negocioUid);
      if (negocio) {
        return [{
          uid: userData.negocioUid,
          nombre: negocio.nombre,
          tipo: negocio.tipo,
          rol: userData.rol || 'empleado',
          activo: true,
        }];
      }
    }
    
    // 4. Si no tiene ningún negocio
    return [];
  } catch (error) {
    console.error('Error obteniendo negocios del usuario:', error);
    return [];
  }
};

// ✅ Agregar usuario existente a un negocio (sin crear nuevo usuario)
export const agregarUsuarioExistente = async (
  uid: string,
  rol: string,
  permisos: Permisos,
  negocioUid: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const firestore = getDb();
    const usuarioRef = doc(firestore, 'usuarios', uid);
    const usuarioDoc = await getDoc(usuarioRef);
    
    if (!usuarioDoc.exists()) {
      return { success: false, error: 'Usuario no encontrado' };
    }
    
    const userData = usuarioDoc.data();
    
    // ✅ Si el usuario ya tiene negocios, agregar a la lista
    if (userData.negocios && Array.isArray(userData.negocios)) {
      // Verificar si ya pertenece a este negocio
      const yaExiste = userData.negocios.some((n: any) => n.uid === negocioUid);
      if (yaExiste) {
        return { success: false, error: 'El usuario ya pertenece a este negocio' };
      }
      
      // Agregar nuevo negocio
      await updateDoc(usuarioRef, {
        negocios: [...userData.negocios, { uid: negocioUid, rol, activo: true }],
        updatedAt: serverTimestamp(),
      });
    } else {
      // ✅ Migrar a la nueva estructura con múltiples negocios
      const negociosExistentes = [];
      
      // Si tenía un negocio anterior, mantenerlo
      if (userData.negocioUid) {
        negociosExistentes.push({
          uid: userData.negocioUid,
          rol: userData.rol || 'empleado',
          activo: true
        });
      }
      
      // Agregar el nuevo negocio
      negociosExistentes.push({ uid: negocioUid, rol, activo: true });
      
      await updateDoc(usuarioRef, {
        negocios: negociosExistentes,
        negocioUid: null, // Limpiar campo antiguo
        rol: null,
        updatedAt: serverTimestamp(),
      });
    }
    
    console.log(`✅ Usuario ${uid} agregado al negocio ${negocioUid}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error agregando usuario existente:', error);
    return { success: false, error: error.message };
  }
};

// ✅ Cambiar negocio activo
export const cambiarNegocioActivo = async (uid: string, negocioUid: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const firestore = getDb();
    await updateDoc(doc(firestore, 'usuarios', uid), {
      negocioActivo: negocioUid,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// ✅ Obtener negocio activo del usuario
export const getNegocioActivo = async (uid: string): Promise<string | null> => {
  try {
    const firestore = getDb();
    const userDoc = await getDoc(doc(firestore, 'usuarios', uid));
    if (!userDoc.exists()) return null;
    const data = userDoc.data();
    return data.negocioActivo || data.negocioUid || null;
  } catch (error) {
    console.error('Error obteniendo negocio activo:', error);
    return null;
  }
};

// ✅ Obtener permisos por defecto según rol
export const getPermisosPorRol = (rol: string): Permisos => {
  const defaultPermisos: Permisos = {
    inventario: false,
    ventas: false,
    produccion: false,
    caja: false,
    empleados: false,
    clientes: false,
    proveedores: false,
    compras: false,
    reportes: false,
    fichas_costo: false,
  };

  const rolesPermisos: Record<string, Partial<Permisos>> = {
    admin: {
      inventario: true,
      ventas: true,
      produccion: true,
      caja: true,
      empleados: true,
      clientes: true,
      proveedores: true,
      compras: true,
      reportes: true,
      fichas_costo: true,
    },
    gerente: {
      inventario: true,
      ventas: true,
      produccion: true,
      caja: true,
      clientes: true,
      proveedores: true,
      reportes: true,
    },
    empleado: {
      inventario: true,
      ventas: true,
      caja: true,
    },
    invitado: {
      ventas: true,
    },
  };

  return { ...defaultPermisos, ...rolesPermisos[rol] };
};