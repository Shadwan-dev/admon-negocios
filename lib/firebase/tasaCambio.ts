import { db } from './config';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export interface TasaCambio {
  uid: string;
  fecha: string;
  valorCompra: number;
  valorVenta: number;
  monedaLocal: string;
  actualizadoPor: string;
  updatedAt?: any;
}

// ✅ Verificar que estamos en el cliente antes de usar Firestore
const getDb = () => {
  if (typeof window === 'undefined') {
    throw new Error('Firestore solo está disponible en el cliente');
  }
  if (!db) {
    throw new Error('Firestore no está disponible');
  }
  return db;
};

// Obtener tasa de cambio
export const getTasaCambio = async (uid: string): Promise<TasaCambio | null> => {
  // ✅ Si estamos en el servidor, devolver valores por defecto
  if (typeof window === 'undefined') {
    console.log('ℹ️ getTasaCambio ejecutado en el servidor - retornando valores por defecto');
    return {
      uid,
      fecha: new Date().toISOString().split('T')[0],
      valorCompra: 24.50,
      valorVenta: 25.00,
      monedaLocal: 'Peso',
      actualizadoPor: uid,
    };
  }

  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'tasa_cambio', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as TasaCambio;
    }
    // Si no existe, crear valores por defecto
    const defaultTasa: TasaCambio = {
      uid,
      fecha: new Date().toISOString().split('T')[0],
      valorCompra: 24.50,
      valorVenta: 25.00,
      monedaLocal: 'Peso',
      actualizadoPor: uid,
    };
    await setDoc(docRef, {
      ...defaultTasa,
      updatedAt: serverTimestamp(),
    });
    return defaultTasa;
  } catch (error) {
    console.error('Error obteniendo tasa de cambio:', error);
    return null;
  }
};

// Actualizar tasa de cambio
export const actualizarTasaCambio = async (
  uid: string,
  data: Partial<Omit<TasaCambio, 'uid' | 'actualizadoPor' | 'updatedAt'>>
): Promise<{ success: boolean; error?: string }> => {
  // ✅ Si estamos en el servidor, simular éxito
  if (typeof window === 'undefined') {
    console.log('ℹ️ actualizarTasaCambio ejecutado en el servidor - simulando éxito');
    return { success: true };
  }

  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'tasa_cambio', uid);
    await setDoc(docRef, {
      ...data,
      uid,
      actualizadoPor: uid,
      updatedAt: serverTimestamp(),
      fecha: new Date().toISOString().split('T')[0],
    }, { merge: true });
    return { success: true };
  } catch (error: any) {
    console.error('Error actualizando tasa de cambio:', error);
    return { success: false, error: error.message };
  }
};