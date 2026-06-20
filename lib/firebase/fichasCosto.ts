import { db } from './config';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Firestore
} from 'firebase/firestore';

export interface IngredienteFicha {
  productoId: string;
  nombre: string;
  cantidad: number;
  unidad: string;
  precioUnitario: number;
  costoTotal: number;
}

export interface FichaCosto {
  id?: string;
  uid: string;
  nombre: string;
  ingredientes: IngredienteFicha[];
  manoObra: number;
  margenGanancia: number;
  costoTotal: number;
  precioSugerido: number;
  createdAt?: any;
  updatedAt?: any;
}

// Unidades de medida disponibles
export const UNIDADES_MEDIDA = [
  { value: 'kg', label: 'Kilogramo (kg)' },
  { value: 'g', label: 'Gramo (g)' },
  { value: 'lb', label: 'Libra (lb)' },
  { value: 'oz', label: 'Onza (oz)' },
  { value: 'litro', label: 'Litro (L)' },
  { value: 'ml', label: 'Mililitro (ml)' },
  { value: 'taza', label: 'Taza' },
  { value: 'cucharada', label: 'Cucharada (sopera)' },
  { value: 'cucharadita', label: 'Cucharadita (café)' },
  { value: 'jarra', label: 'Jarra' },
  { value: 'vaso', label: 'Vaso' },
  { value: 'unidad', label: 'Unidad' },
  { value: 'pizca', label: 'Pizca' },
  { value: 'paquete', label: 'Paquete' },
  { value: 'botella', label: 'Botella' },
  { value: 'lata', label: 'Lata' },
];

const getDb = (): Firestore => {
  if (!db) {
    throw new Error('Firestore no está disponible');
  }
  return db;
};

// Obtener todas las fichas de costo de un usuario
export const getFichasCosto = async (uid: string): Promise<FichaCosto[]> => {
  try {
    const firestore = getDb();
    const q = query(
      collection(firestore, 'fichas_costo'),
      where('uid', '==', uid),
      orderBy('nombre', 'asc')
    );
    const querySnapshot = await getDocs(q);
    const fichas: FichaCosto[] = [];
    querySnapshot.forEach((doc) => {
      fichas.push({ id: doc.id, ...doc.data() } as FichaCosto);
    });
    return fichas;
  } catch (error) {
    console.error('Error obteniendo fichas de costo:', error);
    return [];
  }
};

// Obtener una ficha por ID
export const getFichaCostoById = async (uid: string, fichaId: string): Promise<FichaCosto | null> => {
  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'fichas_costo', fichaId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().uid === uid) {
      return { id: docSnap.id, ...docSnap.data() } as FichaCosto;
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo ficha:', error);
    return null;
  }
};

// Crear una nueva ficha de costo
export const crearFichaCosto = async (
  ficha: Omit<FichaCosto, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const firestore = getDb();
    const docRef = doc(collection(firestore, 'fichas_costo'));
    const nuevaFicha = {
      ...ficha,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(docRef, nuevaFicha);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error creando ficha:', error);
    return { success: false, error: error.message };
  }
};

// Actualizar una ficha existente
export const actualizarFichaCosto = async (
  fichaId: string,
  data: Partial<Omit<FichaCosto, 'id' | 'uid' | 'createdAt' | 'updatedAt'>>
): Promise<{ success: boolean; error?: string }> => {
  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'fichas_costo', fichaId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error: any) {
    console.error('Error actualizando ficha:', error);
    return { success: false, error: error.message };
  }
};

// Eliminar una ficha
export const eliminarFichaCosto = async (fichaId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const firestore = getDb();
    await deleteDoc(doc(firestore, 'fichas_costo', fichaId));
    return { success: true };
  } catch (error: any) {
    console.error('Error eliminando ficha:', error);
    return { success: false, error: error.message };
  }
};

// Calcular costo total de una ficha
export const calcularCostoTotal = (ingredientes: IngredienteFicha[], manoObra: number): number => {
  const costoSinManoObra = ingredientes.reduce((total, ing) => total + ing.costoTotal, 0);
  return costoSinManoObra + manoObra;
};

// Calcular precio sugerido con margen
export const calcularPrecioSugerido = (costoTotal: number, margen: number): number => {
  return Math.round((costoTotal * (1 + margen / 100)) * 100) / 100;
};