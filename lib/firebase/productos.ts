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
  serverTimestamp
} from 'firebase/firestore';
import { getTasaCambio } from './tasaCambio';

export interface Producto {
  id?: string;
  uid: string;
  nombre: string;
  categoria: 'materia_prima' | 'listo_venta';
  // Precios
  precioUSD: number;           // Precio en USD (siempre guardado)
  precioLocal?: number;         // Precio en moneda local (si se compró en local)
  monedaCompra: 'USD' | 'local'; // Moneda en la que se compró
  precioCompraOriginal?: number; // Precio original en la moneda de compra
  // Conversión
  unidad: 'kg' | 'litro' | 'unidad' | 'lb';
  factorConversion?: number;
  createdAt?: any;
  updatedAt?: any;
}

const getDb = () => {
  if (!db) {
    throw new Error('Firestore no está disponible');
  }
  return db;
};

// Obtener todos los productos con precio local calculado
export const getProductos = async (uid: string): Promise<Producto[]> => {
  try {
    const firestore = getDb();
    const q = query(
      collection(firestore, 'productos_usuario'),
      where('uid', '==', uid),
      orderBy('nombre', 'asc')
    );
    const querySnapshot = await getDocs(q);
    const productos: Producto[] = [];
    querySnapshot.forEach((doc) => {
      productos.push({ id: doc.id, ...doc.data() } as Producto);
    });
    
    // Obtener tasa de cambio para calcular precios
    const tasa = await getTasaCambio(uid);
    if (tasa) {
      productos.forEach(p => {
        // Si el producto se compró en local, calcular su equivalente en USD
        if (p.monedaCompra === 'local' && p.precioCompraOriginal) {
          p.precioUSD = p.precioCompraOriginal / tasa.valorCompra;
        }
        // Calcular precio local actual
        p.precioLocal = calcularPrecioLocal(p.precioUSD, tasa.valorCompra);
      });
    }
    
    return productos;
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return [];
  }
};

// Obtener un producto por ID
export const getProductoById = async (uid: string, productoId: string): Promise<Producto | null> => {
  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'productos_usuario', productoId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().uid === uid) {
      return { id: docSnap.id, ...docSnap.data() } as Producto;
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    return null;
  }
};

// Crear un nuevo producto
export const crearProducto = async (
  producto: Omit<Producto, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const firestore = getDb();
    const docRef = doc(collection(firestore, 'productos_usuario'));
    
    // Si se compró en local, guardar el precio original y calcular USD
    let nuevoProducto: any = {
      ...producto,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Si la moneda de compra es local, guardar el precio original
    if (producto.monedaCompra === 'local' && producto.precioCompraOriginal) {
      nuevoProducto.precioCompraOriginal = producto.precioCompraOriginal;
      // El precioUSD ya se calculó en el frontend
    }

    await setDoc(docRef, nuevoProducto);
    console.log('✅ Producto creado:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error creando producto:', error);
    return { success: false, error: error.message };
  }
};

// Actualizar un producto existente
export const actualizarProducto = async (
  productoId: string, 
  data: Partial<Omit<Producto, 'id' | 'uid' | 'createdAt' | 'updatedAt'>>
): Promise<{ success: boolean; error?: string }> => {
  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'productos_usuario', productoId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    console.log('✅ Producto actualizado:', productoId);
    return { success: true };
  } catch (error: any) {
    console.error('Error actualizando producto:', error);
    return { success: false, error: error.message };
  }
};

// Eliminar un producto
export const eliminarProducto = async (productoId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const firestore = getDb();
    await deleteDoc(doc(firestore, 'productos_usuario', productoId));
    console.log('✅ Producto eliminado:', productoId);
    return { success: true };
  } catch (error: any) {
    console.error('Error eliminando producto:', error);
    return { success: false, error: error.message };
  }
};

// Calcular precio local basado en tasa de cambio
export const calcularPrecioLocal = (precioUSD: number, tasaCambio: number): number => {
  return Math.round((precioUSD * tasaCambio) * 100) / 100;
};

// Convertir precio local a USD
export const convertirLocalToUSD = (precioLocal: number, tasaCambio: number): number => {
  return Math.round((precioLocal / tasaCambio) * 100) / 100;
};