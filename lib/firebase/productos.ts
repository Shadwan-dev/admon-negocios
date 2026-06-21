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
  precioUSD: number;           // ✅ SIEMPRE se guarda en USD
  precioLocal?: number;         // ✅ Se calcula en tiempo real
  monedaCompra: 'USD' | 'local';
  precioCompraOriginal?: number;
  unidad: 'kg' | 'litro' | 'unidad' | 'lb';
  factorConversion?: number;
  createdAt?: any;
  updatedAt?: any;
}

// ✅ Función para obtener db
const getDb = () => {
  if (typeof window === 'undefined') {
    throw new Error('Firestore solo está disponible en el cliente');
  }
  if (!db) {
    throw new Error('Firestore no está disponible');
  }
  return db;
};

// ✅ Obtener productos con precios calculados en tiempo real
export const getProductos = async (uid: string): Promise<Producto[]> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ getProductos ejecutado en el servidor - retornando vacío');
    return [];
  }

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
    
    // ✅ Obtener tasa de cambio actual
    const tasa = await getTasaCambio(uid);
    if (tasa) {
      productos.forEach(p => {
        // ✅ Calcular precio local con la tasa ACTUAL
        p.precioLocal = calcularPrecioLocal(p.precioUSD, tasa.valorCompra);
      });
    }
    
    return productos;
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return [];
  }
};

// ✅ Obtener un producto con precio local calculado
export const getProductoById = async (uid: string, productoId: string): Promise<Producto | null> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ getProductoById ejecutado en el servidor - retornando null');
    return null;
  }

  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'productos_usuario', productoId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().uid === uid) {
      const producto = { id: docSnap.id, ...docSnap.data() } as Producto;
      
      // ✅ Calcular precio local con tasa actual
      const tasa = await getTasaCambio(uid);
      if (tasa) {
        producto.precioLocal = calcularPrecioLocal(producto.precioUSD, tasa.valorCompra);
      }
      
      return producto;
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    return null;
  }
};

// ✅ Crear producto - SOLO guarda el precio en USD
export const crearProducto = async (
  producto: Omit<Producto, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; id?: string; error?: string }> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ crearProducto ejecutado en el servidor - simulando éxito');
    return { success: true, id: 'simulado-' + Date.now() };
  }

  try {
    const firestore = getDb();
    const docRef = doc(collection(firestore, 'productos_usuario'));
    
    // ✅ Obtener tasa actual para convertir si es necesario
    const tasa = await getTasaCambio(producto.uid);
    let precioUSD = producto.precioUSD;
    
    // ✅ Si se compró en local, convertir a USD con la tasa ACTUAL
    if (producto.monedaCompra === 'local' && producto.precioCompraOriginal) {
      precioUSD = producto.precioCompraOriginal / (tasa?.valorCompra || 24.50);
    }
    
    const nuevoProducto = {
      ...producto,
      precioUSD: Math.round(precioUSD * 100) / 100, // Redondear a 2 decimales
      precioLocal: null, // ✅ Se calculará en tiempo real
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(docRef, nuevoProducto);
    console.log('✅ Producto creado con precio USD:', nuevoProducto.precioUSD);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error creando producto:', error);
    return { success: false, error: error.message };
  }
};

// ✅ Actualizar producto - SOLO actualiza el precio en USD
export const actualizarProducto = async (
  productoId: string, 
  data: Partial<Omit<Producto, 'id' | 'uid' | 'createdAt' | 'updatedAt'>>
): Promise<{ success: boolean; error?: string }> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ actualizarProducto ejecutado en el servidor - simulando éxito');
    return { success: true };
  }

  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'productos_usuario', productoId);
    
    // ✅ Si se actualiza el precio local, convertirlo a USD
    let updateData = { ...data };
    
    if (data.precioUSD !== undefined) {
      // ✅ Ya está en USD, solo redondear
      updateData.precioUSD = Math.round(data.precioUSD * 100) / 100;
    }
    
    // ✅ No guardar precioLocal (se calcula en tiempo real)
    delete updateData.precioLocal;
    
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
    console.log('✅ Producto actualizado');
    return { success: true };
  } catch (error: any) {
    console.error('Error actualizando producto:', error);
    return { success: false, error: error.message };
  }
};

// ✅ Eliminar producto
export const eliminarProducto = async (productoId: string): Promise<{ success: boolean; error?: string }> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ eliminarProducto ejecutado en el servidor - simulando éxito');
    return { success: true };
  }

  try {
    const firestore = getDb();
    await deleteDoc(doc(firestore, 'productos_usuario', productoId));
    console.log('✅ Producto eliminado');
    return { success: true };
  } catch (error: any) {
    console.error('Error eliminando producto:', error);
    return { success: false, error: error.message };
  }
};

// ✅ Calcular precio local basado en tasa de cambio ACTUAL
export const calcularPrecioLocal = (precioUSD: number, tasaCambio: number): number => {
  return Math.round((precioUSD * tasaCambio) * 100) / 100;
};

// ✅ Convertir precio local a USD con tasa ACTUAL
export const convertirLocalToUSD = (precioLocal: number, tasaCambio: number): number => {
  return Math.round((precioLocal / tasaCambio) * 100) / 100;
};

// ✅ Función para recalcular todos los precios locales (cuando cambia la tasa)
export const recalcularPreciosLocales = async (uid: string): Promise<Producto[]> => {
  const productos = await getProductos(uid);
  const tasa = await getTasaCambio(uid);
  
  if (tasa) {
    productos.forEach(p => {
      p.precioLocal = calcularPrecioLocal(p.precioUSD, tasa.valorCompra);
    });
  }
  
  return productos;
};