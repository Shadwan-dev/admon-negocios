// lib/firebase/fichasCosto.ts
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
import { getProductoById, Producto } from './productos';

// ✅ Ingrediente - SOLO guarda referencia al producto y cantidad
export interface IngredienteFicha {
  productoId: string;        // ID del producto (fuente de verdad)
  nombre: string;            // Nombre del producto (copia para mostrar)
  cantidad: number;          // Cantidad necesaria
  unidad: string;            // Unidad de medida
  esFicha: boolean;          // TRUE si es una ficha de costo anidada
  fichaId?: string;          // ID de la ficha si esFicha === true
}

// ✅ Ficha de costo - precios calculados en tiempo real
export interface FichaCosto {
  id?: string;
  uid: string;
  nombre: string;
  ingredientes: IngredienteFicha[];
  manoObra: number;
  margenGanancia: number;
  costoTotal?: number;       // Calculado en tiempo real
  precioSugerido?: number;   // Calculado en tiempo real
  esProductoFinal?: boolean; // TRUE si puede ser usado como ingrediente
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

// ==================== CRUD BÁSICO ====================

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

// ==================== PRECIOS EN TIEMPO REAL ====================

// ✅ Obtener una ficha con precios calculados en tiempo real
export const getFichaCostoConPrecios = async (uid: string, fichaId: string): Promise<FichaCosto | null> => {
  try {
    const ficha = await getFichaCostoById(uid, fichaId);
    if (!ficha) return null;

    let costoTotal = ficha.manoObra || 0;
    const ingredientesConPrecio = await Promise.all(
      ficha.ingredientes.map(async (ing) => {
        if (ing.esFicha && ing.fichaId) {
          // ✅ Es una ficha anidada, obtener su costo actual
          const fichaAnidada = await getFichaCostoConPrecios(uid, ing.fichaId);
          if (fichaAnidada) {
            const totalIngredientes = fichaAnidada.ingredientes?.length || 1;
            const costoUnitario = (fichaAnidada.costoTotal || 0) / totalIngredientes;
            const costoTotalIng = costoUnitario * ing.cantidad;
            costoTotal += costoTotalIng;
            return {
              ...ing,
              precioUnitario: costoUnitario,
              costoTotal: costoTotalIng,
              ingredientes: fichaAnidada.ingredientes,
            };
          }
          return ing;
        } else {
          // ✅ Es un producto, obtener precio actual desde la fuente de verdad
          const producto = await getProductoById(uid, ing.productoId);
          if (producto) {
            const precioUnitario = producto.precioLocal || (producto.precioUSD * 24.50);
            const costoTotalIng = precioUnitario * ing.cantidad;
            costoTotal += costoTotalIng;
            return {
              ...ing,
              precioUnitario,
              costoTotal: costoTotalIng,
            };
          }
          return ing;
        }
      })
    );

    // ✅ Calcular precio sugerido
    const precioSugerido = costoTotal * (1 + (ficha.margenGanancia || 30) / 100);

    return {
      ...ficha,
      ingredientes: ingredientesConPrecio,
      costoTotal: Math.round(costoTotal * 100) / 100,
      precioSugerido: Math.round(precioSugerido * 100) / 100,
    };
  } catch (error) {
    console.error('Error calculando precios de ficha:', error);
    return null;
  }
};

// ✅ Obtener todas las fichas con precios calculados
export const getFichasCostoConPrecios = async (uid: string): Promise<FichaCosto[]> => {
  try {
    const fichas = await getFichasCosto(uid);
    const fichasConPrecios = await Promise.all(
      fichas.map(async (ficha) => {
        if (!ficha.id) return ficha;
        const fichaConPrecios = await getFichaCostoConPrecios(uid, ficha.id);
        return fichaConPrecios || ficha;
      })
    );
    return fichasConPrecios;
  } catch (error) {
    console.error('Error obteniendo fichas con precios:', error);
    return [];
  }
};

// ==================== DEPENDENCIAS Y VERIFICACIONES ====================

// ✅ Obtener fichas de costo que son productos finales (para usar como ingredientes)
export const getFichasProductoFinal = async (uid: string): Promise<FichaCosto[]> => {
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
      const data = doc.data() as FichaCosto;
      // ✅ Filtramos en memoria para evitar índice compuesto
      if (data.esProductoFinal === true) {
        fichas.push({ id: doc.id, ...data });
      }
    });
    return fichas;
  } catch (error) {
    console.error('Error obteniendo fichas producto final:', error);
    return [];
  }
};

// ✅ Verificar si un producto es usado en alguna ficha
export const getFichasQueUsanProducto = async (uid: string, productoId: string): Promise<string[]> => {
  try {
    const firestore = getDb();
    const q = query(
      collection(firestore, 'fichas_costo'),
      where('uid', '==', uid)
    );
    const querySnapshot = await getDocs(q);
    const fichasQueUsan: string[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as FichaCosto;
      const usaProducto = data.ingredientes?.some(
        (ing: IngredienteFicha) => !ing.esFicha && ing.productoId === productoId
      );
      if (usaProducto) {
        fichasQueUsan.push(data.nombre);
      }
    });
    return fichasQueUsan;
  } catch (error) {
    console.error('Error verificando uso de producto:', error);
    return [];
  }
};

// ✅ Verificar si una ficha es usada por otra ficha
export const getFichasQueUsanFicha = async (uid: string, fichaId: string): Promise<string[]> => {
  try {
    const firestore = getDb();
    const q = query(
      collection(firestore, 'fichas_costo'),
      where('uid', '==', uid)
    );
    const querySnapshot = await getDocs(q);
    const fichasQueUsan: string[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as FichaCosto;
      const usaFicha = data.ingredientes?.some(
        (ing: IngredienteFicha) => ing.esFicha && ing.fichaId === fichaId
      );
      if (usaFicha) {
        fichasQueUsan.push(data.nombre);
      }
    });
    return fichasQueUsan;
  } catch (error) {
    console.error('Error verificando uso de ficha:', error);
    return [];
  }
};

// ==================== UTILIDADES ====================

// ✅ Calcular costo total de una ficha (sin precios, solo estructura)
export const calcularCostoTotalEstructura = (ingredientes: IngredienteFicha[], manoObra: number): number => {
  const costoSinManoObra = ingredientes.reduce((total, ing) => {
    // Solo sumamos la estructura, los precios se calculan en tiempo real
    return total + (ing.cantidad || 0);
  }, 0);
  return costoSinManoObra + manoObra;
};

// ✅ Calcular precio sugerido (sin precios, solo estructura)
export const calcularPrecioSugeridoEstructura = (costoTotal: number, margen: number): number => {
  return Math.round((costoTotal * (1 + margen / 100)) * 100) / 100;
};