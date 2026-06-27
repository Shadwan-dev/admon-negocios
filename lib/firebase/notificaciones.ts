// lib/firebase/notificaciones.ts
import { db } from './config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  deleteDoc,
  Firestore
} from 'firebase/firestore';
import { Notificacion } from '@/types/marketplace';

// ✅ Función de seguridad para obtener db
const getDb = (): Firestore => {
  if (!db) {
    throw new Error('Firestore no está disponible. Asegúrate de estar en el cliente y tener conexión.');
  }
  return db;
};

export const crearNotificacion = async (data: Omit<Notificacion, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const firestore = getDb(); // ✅ Obtener db segura
    
    const docRef = await addDoc(collection(firestore, 'notificaciones'), {
      ...data,
      leido: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('Error creando notificación:', error);
    throw error;
  }
};

export const obtenerNotificaciones = async (uid: string) => {
  try {
    const firestore = getDb(); // ✅ Obtener db segura
    
    const q = query(
      collection(firestore, 'notificaciones'),
      where('uid', '==', uid),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
    } as Notificacion));
  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    return [];
  }
};

export const marcarNotificacionComoLeida = async (id: string) => {
  try {
    const firestore = getDb(); // ✅ Obtener db segura
    
    await updateDoc(doc(firestore, 'notificaciones', id), {
      leido: true,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error marcando notificación como leída:', error);
    return { success: false, error: (error as Error).message };
  }
};

export const marcarTodasComoLeidas = async (uid: string) => {
  try {
    const notificaciones = await obtenerNotificaciones(uid);
    const pendientes = notificaciones.filter(n => !n.leido);
    
    await Promise.all(
      pendientes.map(n => marcarNotificacionComoLeida(n.id!))
    );
    return { success: true };
  } catch (error) {
    console.error('Error marcando todas como leídas:', error);
    return { success: false, error: (error as Error).message };
  }
};

export const eliminarNotificacion = async (id: string) => {
  try {
    const firestore = getDb(); // ✅ Obtener db segura
    
    await deleteDoc(doc(firestore, 'notificaciones', id));
    return { success: true };
  } catch (error) {
    console.error('Error eliminando notificación:', error);
    return { success: false, error: (error as Error).message };
  }
};