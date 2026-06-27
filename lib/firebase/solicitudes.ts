// lib/firebase/solicitudes.ts
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
  Firestore
} from 'firebase/firestore';
import { Solicitud } from '@/types/marketplace';

// ✅ Función de seguridad para obtener db
const getDb = (): Firestore => {
  if (!db) {
    throw new Error('Firestore no está disponible. Asegúrate de estar en el cliente y tener conexión.');
  }
  return db;
};

export const crearSolicitud = async (data: Omit<Solicitud, 'id' | 'fechaSolicitud' | 'createdAt' | 'updatedAt'>) => {
  try {
    const firestore = getDb(); // ✅ Obtener db segura
    
    const docRef = await addDoc(collection(firestore, 'solicitudes'), {
      ...data,
      fechaSolicitud: new Date(),
      estado: 'pendiente',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('Error creando solicitud:', error);
    throw error;
  }
};

export const obtenerSolicitudesComoVendedor = async (vendedorUid: string) => {
  try {
    const firestore = getDb(); // ✅ Obtener db segura
    
    const q = query(
      collection(firestore, 'solicitudes'),
      where('vendedorUid', '==', vendedorUid),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      fechaSolicitud: doc.data().fechaSolicitud?.toDate?.() || new Date(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
    } as Solicitud));
  } catch (error) {
    console.error('Error obteniendo solicitudes como vendedor:', error);
    return [];
  }
};

export const obtenerSolicitudesComoComprador = async (compradorUid: string) => {
  try {
    const firestore = getDb(); // ✅ Obtener db segura
    
    const q = query(
      collection(firestore, 'solicitudes'),
      where('compradorUid', '==', compradorUid),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      fechaSolicitud: doc.data().fechaSolicitud?.toDate?.() || new Date(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
    } as Solicitud));
  } catch (error) {
    console.error('Error obteniendo solicitudes como comprador:', error);
    return [];
  }
};

export const obtenerSolicitudPorId = async (id: string) => {
  try {
    const firestore = getDb(); // ✅ Obtener db segura
    
    const docRef = doc(firestore, 'solicitudes', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { 
        id: docSnap.id, 
        ...docSnap.data(),
        fechaSolicitud: docSnap.data().fechaSolicitud?.toDate?.() || new Date(),
        createdAt: docSnap.data().createdAt?.toDate?.() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate?.() || new Date(),
      } as Solicitud;
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo solicitud:', error);
    return null;
  }
};

export const actualizarEstadoSolicitud = async (
  id: string, 
  estado: Solicitud['estado'], 
  comentario?: string
) => {
  try {
    const firestore = getDb(); // ✅ Obtener db segura
    
    await updateDoc(doc(firestore, 'solicitudes', id), {
      estado,
      comentarioVendedor: comentario || '',
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error actualizando estado de solicitud:', error);
    return { success: false, error: (error as Error).message };
  }
};

export const obtenerSolicitudesPorPublicacion = async (publicacionId: string) => {
  try {
    const firestore = getDb(); // ✅ Obtener db segura
    
    const q = query(
      collection(firestore, 'solicitudes'),
      where('publicacionId', '==', publicacionId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      fechaSolicitud: doc.data().fechaSolicitud?.toDate?.() || new Date(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
    } as Solicitud));
  } catch (error) {
    console.error('Error obteniendo solicitudes por publicación:', error);
    return [];
  }
};