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

export interface MovimientoCaja {
  id?: string;
  uid: string;
  tipo: 'ingreso' | 'egreso';
  concepto: string;
  monto: number;
  fecha: string;
  categoria?: string;
  estado: 'completado' | 'pendiente' | 'cancelado';
  creadoPor?: string;
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

// ✅ Obtener todos los movimientos de caja
export const getMovimientosCaja = async (uid: string): Promise<MovimientoCaja[]> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ getMovimientosCaja ejecutado en el servidor - retornando vacío');
    return [];
  }

  try {
    const firestore = getDb();
    const cajaRef = collection(firestore, 'negocios', uid, 'caja');
    const q = query(cajaRef, orderBy('fecha', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as MovimientoCaja));
  } catch (error) {
    console.error('Error obteniendo movimientos de caja:', error);
    return [];
  }
};

// ✅ Obtener un movimiento por ID
export const getMovimientoCajaById = async (uid: string, movimientoId: string): Promise<MovimientoCaja | null> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ getMovimientoCajaById ejecutado en el servidor - retornando null');
    return null;
  }

  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'negocios', uid, 'caja', movimientoId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as MovimientoCaja;
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo movimiento de caja:', error);
    return null;
  }
};

// ✅ Obtener resumen de caja
export const getResumenCaja = async (uid: string): Promise<{ ingresos: number; egresos: number; balance: number }> => {
  try {
    const movimientos = await getMovimientosCaja(uid);
    const completados = movimientos.filter(m => m.estado === 'completado');
    const ingresos = completados.filter(m => m.tipo === 'ingreso')
      .reduce((sum, m) => sum + m.monto, 0);
    const egresos = completados.filter(m => m.tipo === 'egreso')
      .reduce((sum, m) => sum + m.monto, 0);
    return { 
      ingresos: Math.round(ingresos * 100) / 100,
      egresos: Math.round(egresos * 100) / 100,
      balance: Math.round((ingresos - egresos) * 100) / 100
    };
  } catch (error) {
    console.error('Error obteniendo resumen de caja:', error);
    return { ingresos: 0, egresos: 0, balance: 0 };
  }
};

// ✅ Crear un nuevo movimiento de caja
export const crearMovimientoCaja = async (
  uid: string, 
  data: Omit<MovimientoCaja, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; id?: string; error?: string }> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ crearMovimientoCaja ejecutado en el servidor - simulando éxito');
    return { success: true, id: 'simulado-' + Date.now() };
  }

  try {
    const firestore = getDb();
    const cajaRef = collection(firestore, 'negocios', uid, 'caja');
    const docRef = await addDoc(cajaRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log('✅ Movimiento de caja creado:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error creando movimiento de caja:', error);
    return { success: false, error: error.message };
  }
};

// ✅ Actualizar estado de movimiento
export const actualizarEstadoMovimiento = async (
  uid: string,
  movimientoId: string,
  estado: 'completado' | 'pendiente' | 'cancelado'
): Promise<{ success: boolean; error?: string }> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ actualizarEstadoMovimiento ejecutado en el servidor - simulando éxito');
    return { success: true };
  }

  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'negocios', uid, 'caja', movimientoId);
    await updateDoc(docRef, {
      estado,
      updatedAt: serverTimestamp(),
    });
    console.log('✅ Estado de movimiento actualizado');
    return { success: true };
  } catch (error: any) {
    console.error('Error actualizando estado de movimiento:', error);
    return { success: false, error: error.message };
  }
};

// ✅ Eliminar movimiento de caja
export const eliminarMovimientoCaja = async (uid: string, movimientoId: string): Promise<{ success: boolean; error?: string }> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ eliminarMovimientoCaja ejecutado en el servidor - simulando éxito');
    return { success: true };
  }

  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'negocios', uid, 'caja', movimientoId);
    await deleteDoc(docRef);
    console.log('✅ Movimiento de caja eliminado');
    return { success: true };
  } catch (error: any) {
    console.error('Error eliminando movimiento de caja:', error);
    return { success: false, error: error.message };
  }
};