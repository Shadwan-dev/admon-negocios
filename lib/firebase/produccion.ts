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

export interface OrdenProduccion {
  id?: string;
  uid: string;
  producto: string;
  productoId?: string;
  cantidad: number;
  estado: 'completada' | 'en_progreso' | 'pendiente' | 'cancelada';
  fecha: string;
  ingredientes?: Array<{
    productoId: string;
    nombre: string;
    cantidad: number;
  }>;
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

// ✅ Obtener todas las órdenes de producción
export const getOrdenesProduccion = async (uid: string): Promise<OrdenProduccion[]> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ getOrdenesProduccion ejecutado en el servidor - retornando vacío');
    return [];
  }

  try {
    const firestore = getDb();
    const ordenesRef = collection(firestore, 'negocios', uid, 'produccion');
    const q = query(ordenesRef, orderBy('fecha', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as OrdenProduccion));
  } catch (error) {
    console.error('Error obteniendo órdenes de producción:', error);
    return [];
  }
};

// ✅ Obtener una orden por ID
export const getOrdenProduccionById = async (uid: string, ordenId: string): Promise<OrdenProduccion | null> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ getOrdenProduccionById ejecutado en el servidor - retornando null');
    return null;
  }

  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'negocios', uid, 'produccion', ordenId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as OrdenProduccion;
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo orden de producción:', error);
    return null;
  }
};

// ✅ Crear una orden de producción
export const crearOrdenProduccion = async (
  uid: string,
  data: Omit<OrdenProduccion, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; id?: string; error?: string }> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ crearOrdenProduccion ejecutado en el servidor - simulando éxito');
    return { success: true, id: 'simulado-' + Date.now() };
  }

  try {
    const firestore = getDb();
    const ordenesRef = collection(firestore, 'negocios', uid, 'produccion');
    const docRef = await addDoc(ordenesRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log('✅ Orden de producción creada:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error creando orden de producción:', error);
    return { success: false, error: error.message };
  }
};

// ✅ Actualizar estado de orden
export const actualizarEstadoOrden = async (
  uid: string,
  ordenId: string,
  estado: 'completada' | 'en_progreso' | 'pendiente' | 'cancelada'
): Promise<{ success: boolean; error?: string }> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ actualizarEstadoOrden ejecutado en el servidor - simulando éxito');
    return { success: true };
  }

  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'negocios', uid, 'produccion', ordenId);
    await updateDoc(docRef, {
      estado,
      updatedAt: serverTimestamp(),
    });
    console.log('✅ Estado de orden actualizado');
    return { success: true };
  } catch (error: any) {
    console.error('Error actualizando estado de orden:', error);
    return { success: false, error: error.message };
  }
};

// ✅ Eliminar orden de producción
export const eliminarOrdenProduccion = async (uid: string, ordenId: string): Promise<{ success: boolean; error?: string }> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ eliminarOrdenProduccion ejecutado en el servidor - simulando éxito');
    return { success: true };
  }

  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'negocios', uid, 'produccion', ordenId);
    await deleteDoc(docRef);
    console.log('✅ Orden de producción eliminada');
    return { success: true };
  } catch (error: any) {
    console.error('Error eliminando orden de producción:', error);
    return { success: false, error: error.message };
  }
};