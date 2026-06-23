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

export interface Empleado {
  id?: string;
  uid: string;
  nombre: string;
  cargo: string;
  email: string;
  telefono: string;
  salario: number;
  estado: 'activo' | 'inactivo';
  fechaContratacion: string;
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

// ✅ Obtener todos los empleados
export const getEmpleados = async (uid: string): Promise<Empleado[]> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ getEmpleados ejecutado en el servidor - retornando vacío');
    return [];
  }

  try {
    const firestore = getDb();
    const empleadosRef = collection(firestore, 'negocios', uid, 'empleados');
    const q = query(empleadosRef, orderBy('nombre', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Empleado));
  } catch (error) {
    console.error('Error obteniendo empleados:', error);
    return [];
  }
};

// ✅ Obtener un empleado por ID
export const getEmpleadoById = async (uid: string, empleadoId: string): Promise<Empleado | null> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ getEmpleadoById ejecutado en el servidor - retornando null');
    return null;
  }

  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'negocios', uid, 'empleados', empleadoId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Empleado;
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo empleado:', error);
    return null;
  }
};

// ✅ Crear un empleado
export const crearEmpleado = async (
  uid: string,
  data: Omit<Empleado, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; id?: string; error?: string }> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ crearEmpleado ejecutado en el servidor - simulando éxito');
    return { success: true, id: 'simulado-' + Date.now() };
  }

  try {
    const firestore = getDb();
    const empleadosRef = collection(firestore, 'negocios', uid, 'empleados');
    const docRef = await addDoc(empleadosRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log('✅ Empleado creado:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error creando empleado:', error);
    return { success: false, error: error.message };
  }
};

// ✅ Actualizar empleado
export const actualizarEmpleado = async (
  uid: string,
  empleadoId: string,
  data: Partial<Omit<Empleado, 'id' | 'uid' | 'createdAt' | 'updatedAt'>>
): Promise<{ success: boolean; error?: string }> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ actualizarEmpleado ejecutado en el servidor - simulando éxito');
    return { success: true };
  }

  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'negocios', uid, 'empleados', empleadoId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    console.log('✅ Empleado actualizado');
    return { success: true };
  } catch (error: any) {
    console.error('Error actualizando empleado:', error);
    return { success: false, error: error.message };
  }
};

// ✅ Eliminar empleado
export const eliminarEmpleado = async (uid: string, empleadoId: string): Promise<{ success: boolean; error?: string }> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ eliminarEmpleado ejecutado en el servidor - simulando éxito');
    return { success: true };
  }

  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'negocios', uid, 'empleados', empleadoId);
    await deleteDoc(docRef);
    console.log('✅ Empleado eliminado');
    return { success: true };
  } catch (error: any) {
    console.error('Error eliminando empleado:', error);
    return { success: false, error: error.message };
  }
};