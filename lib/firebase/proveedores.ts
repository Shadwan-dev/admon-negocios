import { db } from './config';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

export interface Proveedor {
  id?: string;
  uid: string;
  nombre: string;
  email: string;
  telefono: string;
  telefono2?: string;
  direccion: string;
  productos: number;
  notas?: string;
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

// ✅ Obtener todos los proveedores
export const getProveedores = async (uid: string): Promise<Proveedor[]> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ getProveedores ejecutado en el servidor - retornando vacío');
    return [];
  }

  try {
    const firestore = getDb();
    const proveedoresRef = collection(firestore, 'negocios', uid, 'proveedores');
    const q = query(proveedoresRef, orderBy('nombre', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Proveedor));
  } catch (error) {
    console.error('Error obteniendo proveedores:', error);
    return [];
  }
};

// ✅ Obtener un proveedor por ID
export const getProveedorById = async (uid: string, proveedorId: string): Promise<Proveedor | null> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ getProveedorById ejecutado en el servidor - retornando null');
    return null;
  }

  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'negocios', uid, 'proveedores', proveedorId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Proveedor;
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo proveedor:', error);
    return null;
  }
};

// ✅ Crear un proveedor
export const crearProveedor = async (
  uid: string,
  data: Omit<Proveedor, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; id?: string; error?: string }> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ crearProveedor ejecutado en el servidor - simulando éxito');
    return { success: true, id: 'simulado-' + Date.now() };
  }

  try {
    const firestore = getDb();
    const proveedoresRef = collection(firestore, 'negocios', uid, 'proveedores');
    const docRef = await addDoc(proveedoresRef, {
      ...data,
      productos: data.productos || 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log('✅ Proveedor creado:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error creando proveedor:', error);
    return { success: false, error: error.message };
  }
};

// ✅ Actualizar proveedor
export const actualizarProveedor = async (
  uid: string,
  proveedorId: string,
  data: Partial<Omit<Proveedor, 'id' | 'uid' | 'createdAt' | 'updatedAt'>>
): Promise<{ success: boolean; error?: string }> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ actualizarProveedor ejecutado en el servidor - simulando éxito');
    return { success: true };
  }

  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'negocios', uid, 'proveedores', proveedorId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    console.log('✅ Proveedor actualizado');
    return { success: true };
  } catch (error: any) {
    console.error('Error actualizando proveedor:', error);
    return { success: false, error: error.message };
  }
};

// ✅ Eliminar proveedor
export const eliminarProveedor = async (uid: string, proveedorId: string): Promise<{ success: boolean; error?: string }> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ eliminarProveedor ejecutado en el servidor - simulando éxito');
    return { success: true };
  }

  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'negocios', uid, 'proveedores', proveedorId);
    await deleteDoc(docRef);
    console.log('✅ Proveedor eliminado');
    return { success: true };
  } catch (error: any) {
    console.error('Error eliminando proveedor:', error);
    return { success: false, error: error.message };
  }
};