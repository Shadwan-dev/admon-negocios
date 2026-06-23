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
  where,
  serverTimestamp
} from 'firebase/firestore';

export interface Cliente {
  id?: string;
  uid: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  compras: number;
  totalGastado: number;
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

// ✅ Obtener todos los clientes
export const getClientes = async (uid: string): Promise<Cliente[]> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ getClientes ejecutado en el servidor - retornando vacío');
    return [];
  }

  try {
    const firestore = getDb();
    const clientesRef = collection(firestore, 'negocios', uid, 'clientes');
    const q = query(clientesRef, orderBy('nombre', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Cliente));
  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    return [];
  }
};

// ✅ Obtener un cliente por ID
export const getClienteById = async (uid: string, clienteId: string): Promise<Cliente | null> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ getClienteById ejecutado en el servidor - retornando null');
    return null;
  }

  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'negocios', uid, 'clientes', clienteId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Cliente;
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo cliente:', error);
    return null;
  }
};

// ✅ Crear un cliente
export const crearCliente = async (
  uid: string,
  data: Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; id?: string; error?: string }> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ crearCliente ejecutado en el servidor - simulando éxito');
    return { success: true, id: 'simulado-' + Date.now() };
  }

  try {
    const firestore = getDb();
    const clientesRef = collection(firestore, 'negocios', uid, 'clientes');
    const docRef = await addDoc(clientesRef, {
      ...data,
      compras: data.compras || 0,
      totalGastado: data.totalGastado || 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log('✅ Cliente creado:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error creando cliente:', error);
    return { success: false, error: error.message };
  }
};

// ✅ Actualizar cliente
export const actualizarCliente = async (
  uid: string,
  clienteId: string,
  data: Partial<Omit<Cliente, 'id' | 'uid' | 'createdAt' | 'updatedAt'>>
): Promise<{ success: boolean; error?: string }> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ actualizarCliente ejecutado en el servidor - simulando éxito');
    return { success: true };
  }

  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'negocios', uid, 'clientes', clienteId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    console.log('✅ Cliente actualizado');
    return { success: true };
  } catch (error: any) {
    console.error('Error actualizando cliente:', error);
    return { success: false, error: error.message };
  }
};

// ✅ Eliminar cliente
export const eliminarCliente = async (uid: string, clienteId: string): Promise<{ success: boolean; error?: string }> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ eliminarCliente ejecutado en el servidor - simulando éxito');
    return { success: true };
  }

  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'negocios', uid, 'clientes', clienteId);
    await deleteDoc(docRef);
    console.log('✅ Cliente eliminado');
    return { success: true };
  } catch (error: any) {
    console.error('Error eliminando cliente:', error);
    return { success: false, error: error.message };
  }
};