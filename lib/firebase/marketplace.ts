// lib/firebase/marketplace.ts
import { db } from './config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Firestore
} from 'firebase/firestore';
import { Publicacion, Resena } from '@/types/marketplace';
import { uploadImage } from './storage';

// ✅ Función de seguridad para obtener db
const getDb = (): Firestore => {
  if (!db) {
    throw new Error('Firestore no está disponible. Asegúrate de estar en el cliente y tener conexión.');
  }
  return db;
};

// ==================== PUBLICACIONES ====================

export const crearPublicacion = async (
  data: Omit<Publicacion, 'id' | 'createdAt' | 'updatedAt' | 'valoracionPromedio' | 'totalReseñas'>
) => {
  try {
    const firestore = getDb(); // ✅ Obtener db segura
    
    // Subir imágenes primero
    const imagenesUrls = await Promise.all(
      (data.imagenes || []).map(async (img) => {
        if (img.startsWith('data:image')) {
          return await uploadImage(img, `publicaciones/${data.uid}`);
        }
        return img;
      })
    );

    const docRef = await addDoc(collection(firestore, 'publicaciones'), {
      ...data,
      imagenes: imagenesUrls,
      activo: true,
      destacado: false,
      valoracionPromedio: 0,
      totalReseñas: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('Error creando publicación:', error);
    throw error;
  }
};

export const obtenerPublicaciones = async (filtros?: {
  categoria?: string;
  tipo?: string;
  search?: string;
  destacados?: boolean;
  limit?: number;
}) => {
  try {
    const firestore = getDb(); // ✅ Obtener db segura
    
    let q = query(
      collection(firestore, 'publicaciones'),
      where('activo', '==', true),
      orderBy('createdAt', 'desc')
    );

    if (filtros?.categoria && filtros.categoria !== 'todos') {
      q = query(q, where('categoria', '==', filtros.categoria));
    }
    if (filtros?.tipo && filtros.tipo !== 'todos') {
      q = query(q, where('tipo', '==', filtros.tipo));
    }
    if (filtros?.destacados) {
      q = query(q, where('destacado', '==', true));
    }
    if (filtros?.limit) {
      q = query(q, limit(filtros.limit));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
    } as Publicacion));
  } catch (error) {
    console.error('Error obteniendo publicaciones:', error);
    return [];
  }
};

export const obtenerPublicacionPorId = async (id: string) => {
  try {
    const firestore = getDb(); // ✅ Obtener db segura
    
    const docRef = doc(firestore, 'publicaciones', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { 
        id: docSnap.id, 
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate?.() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate?.() || new Date(),
      } as Publicacion;
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo publicación:', error);
    return null;
  }
};

export const obtenerPublicacionesPorVendedor = async (uid: string) => {
  try {
    const firestore = getDb(); // ✅ Obtener db segura
    
    const q = query(
      collection(firestore, 'publicaciones'),
      where('uid', '==', uid),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
    } as Publicacion));
  } catch (error) {
    console.error('Error obteniendo publicaciones del vendedor:', error);
    return [];
  }
};

export const actualizarPublicacion = async (id: string, data: Partial<Publicacion>) => {
  try {
    const firestore = getDb(); // ✅ Obtener db segura
    
    await updateDoc(doc(firestore, 'publicaciones', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error actualizando publicación:', error);
    return { success: false, error: (error as Error).message };
  }
};

export const togglePublicacionActiva = async (id: string, activo: boolean) => {
  try {
    const firestore = getDb(); // ✅ Obtener db segura
    
    await updateDoc(doc(firestore, 'publicaciones', id), {
      activo,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error cambiando estado de publicación:', error);
    return { success: false, error: (error as Error).message };
  }
};

// ==================== RESEÑAS ====================

export const crearResena = async (data: Omit<Resena, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const firestore = getDb(); // ✅ Obtener db segura
    
    const docRef = await addDoc(collection(firestore, 'resenas'), {
      ...data,
      fecha: new Date(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Actualizar valoración promedio de la publicación
    const publicacionRef = doc(firestore, 'publicaciones', data.publicacionId);
    const publicacionSnap = await getDoc(publicacionRef);
    if (publicacionSnap.exists()) {
      const publicacionData = publicacionSnap.data();
      const totalReseñas = (publicacionData.totalReseñas || 0) + 1;
      const valoracionPromedio = 
        ((publicacionData.valoracionPromedio || 0) * (totalReseñas - 1) + data.calificacion) / totalReseñas;
      
      await updateDoc(publicacionRef, {
        totalReseñas,
        valoracionPromedio,
        updatedAt: serverTimestamp(),
      });
    }

    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('Error creando reseña:', error);
    throw error;
  }
};

export const obtenerResenasPorPublicacion = async (publicacionId: string) => {
  try {
    const firestore = getDb(); // ✅ Obtener db segura
    
    const q = query(
      collection(firestore, 'resenas'),
      where('publicacionId', '==', publicacionId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
    } as Resena));
  } catch (error) {
    console.error('Error obteniendo reseñas:', error);
    return [];
  }
};