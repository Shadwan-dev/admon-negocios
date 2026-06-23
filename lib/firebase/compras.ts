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
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

export interface Compra {
  id?: string;
  uid: string;
  proveedor: string;
  proveedorId?: string;
  fecha: string;
  total: number;
  items: Array<{
    productoId: string;
    nombre: string;
    cantidad: number;
    precio: number;
  }>;
  estado: 'recibido' | 'pendiente' | 'cancelado';
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

// ✅ Obtener todas las compras
export const getCompras = async (uid: string): Promise<Compra[]> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ getCompras ejecutado en el servidor - retornando vacío');
    return [];
  }

  try {
    const firestore = getDb();
    const comprasRef = collection(firestore, 'negocios', uid, 'compras');
    const q = query(comprasRef, orderBy('fecha', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Compra));
  } catch (error) {
    console.error('Error obteniendo compras:', error);
    return [];
  }
};

// ✅ Obtener una compra por ID
export const getCompraById = async (uid: string, compraId: string): Promise<Compra | null> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ getCompraById ejecutado en el servidor - retornando null');
    return null;
  }

  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'negocios', uid, 'compras', compraId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Compra;
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo compra:', error);
    return null;
  }
};

// ✅ Crear una compra
export const crearCompra = async (
  uid: string,
  data: Omit<Compra, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; id?: string; error?: string }> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ crearCompra ejecutado en el servidor - simulando éxito');
    return { success: true, id: 'simulado-' + Date.now() };
  }

  try {
    const firestore = getDb();
    const comprasRef = collection(firestore, 'negocios', uid, 'compras');
    const docRef = await addDoc(comprasRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log('✅ Compra creada:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error creando compra:', error);
    return { success: false, error: error.message };
  }
};

// ✅ Actualizar estado de compra
export const actualizarEstadoCompra = async (
  uid: string,
  compraId: string,
  estado: 'recibido' | 'pendiente' | 'cancelado'
): Promise<{ success: boolean; error?: string }> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ actualizarEstadoCompra ejecutado en el servidor - simulando éxito');
    return { success: true };
  }

  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'negocios', uid, 'compras', compraId);
    await updateDoc(docRef, {
      estado,
      updatedAt: serverTimestamp(),
    });
    console.log('✅ Estado de compra actualizado');
    return { success: true };
  } catch (error: any) {
    console.error('Error actualizando estado de compra:', error);
    return { success: false, error: error.message };
  }
};

// ✅ Eliminar compra
export const eliminarCompra = async (uid: string, compraId: string): Promise<{ success: boolean; error?: string }> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ eliminarCompra ejecutado en el servidor - simulando éxito');
    return { success: true };
  }

  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'negocios', uid, 'compras', compraId);
    await deleteDoc(docRef);
    console.log('✅ Compra eliminada');
    return { success: true };
  } catch (error: any) {
    console.error('Error eliminando compra:', error);
    return { success: false, error: error.message };
  }
};