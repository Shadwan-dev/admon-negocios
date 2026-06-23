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
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

export interface Venta {
  id?: string;
  uid: string;
  cliente: string;
  clienteId?: string;
  fecha: string;
  total: number;
  items: Array<{
    productoId: string;
    nombre: string;
    cantidad: number;
    precio: number;
  }>;
  metodoPago?: string;
  estado: 'completada' | 'pendiente' | 'cancelada';
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

// ✅ Obtener todas las ventas
export const getVentas = async (uid: string): Promise<Venta[]> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ getVentas ejecutado en el servidor - retornando vacío');
    return [];
  }

  try {
    const firestore = getDb();
    const ventasRef = collection(firestore, 'negocios', uid, 'ventas');
    const q = query(ventasRef, orderBy('fecha', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Venta));
  } catch (error) {
    console.error('Error obteniendo ventas:', error);
    return [];
  }
};

// ✅ Obtener una venta por ID
export const getVentaById = async (uid: string, ventaId: string): Promise<Venta | null> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ getVentaById ejecutado en el servidor - retornando null');
    return null;
  }

  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'negocios', uid, 'ventas', ventaId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Venta;
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo venta:', error);
    return null;
  }
};

// ✅ Obtener ventas por fecha
export const getVentasPorFecha = async (uid: string, fechaInicio: string, fechaFin: string): Promise<Venta[]> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ getVentasPorFecha ejecutado en el servidor - retornando vacío');
    return [];
  }

  try {
    const firestore = getDb();
    const ventasRef = collection(firestore, 'negocios', uid, 'ventas');
    const q = query(
      ventasRef,
      where('fecha', '>=', fechaInicio),
      where('fecha', '<=', fechaFin),
      orderBy('fecha', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Venta));
  } catch (error) {
    console.error('Error obteniendo ventas por fecha:', error);
    return [];
  }
};

// ✅ Crear una nueva venta
export const crearVenta = async (
  uid: string, 
  data: Omit<Venta, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; id?: string; error?: string }> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ crearVenta ejecutado en el servidor - simulando éxito');
    return { success: true, id: 'simulado-' + Date.now() };
  }

  try {
    const firestore = getDb();
    const ventasRef = collection(firestore, 'negocios', uid, 'ventas');
    const docRef = await addDoc(ventasRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log('✅ Venta creada:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error creando venta:', error);
    return { success: false, error: error.message };
  }
};

// ✅ Actualizar estado de venta
export const actualizarEstadoVenta = async (
  uid: string, 
  ventaId: string, 
  estado: 'completada' | 'pendiente' | 'cancelada'
): Promise<{ success: boolean; error?: string }> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ actualizarEstadoVenta ejecutado en el servidor - simulando éxito');
    return { success: true };
  }

  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'negocios', uid, 'ventas', ventaId);
    await updateDoc(docRef, {
      estado,
      updatedAt: serverTimestamp(),
    });
    console.log('✅ Estado de venta actualizado');
    return { success: true };
  } catch (error: any) {
    console.error('Error actualizando estado de venta:', error);
    return { success: false, error: error.message };
  }
};

// ✅ Eliminar una venta
export const eliminarVenta = async (uid: string, ventaId: string): Promise<{ success: boolean; error?: string }> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ eliminarVenta ejecutado en el servidor - simulando éxito');
    return { success: true };
  }

  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'negocios', uid, 'ventas', ventaId);
    await deleteDoc(docRef);
    console.log('✅ Venta eliminada');
    return { success: true };
  } catch (error: any) {
    console.error('Error eliminando venta:', error);
    return { success: false, error: error.message };
  }
};

// ✅ Obtener resumen de ventas
export const getResumenVentas = async (uid: string): Promise<{ total: number; cantidad: number; promedio: number }> => {
  try {
    const ventas = await getVentas(uid);
    const completadas = ventas.filter(v => v.estado === 'completada');
    const total = completadas.reduce((sum, v) => sum + v.total, 0);
    const cantidad = completadas.length;
    return {
      total,
      cantidad,
      promedio: cantidad > 0 ? total / cantidad : 0
    };
  } catch (error) {
    console.error('Error obteniendo resumen de ventas:', error);
    return { total: 0, cantidad: 0, promedio: 0 };
  }
};