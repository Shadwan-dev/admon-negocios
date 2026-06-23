import { db } from '../firebase/config';
import { 
  collection, 
  query, 
  where, 
  getDocs,
  limit,
  getCountFromServer,
  doc,
  updateDoc,        
  serverTimestamp
} from 'firebase/firestore';
import { ModuleId } from './types';

// ✅ Verificar disponibilidad de Firestore
const getDb = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  if (!db) {
    console.warn('Firestore no está disponible');
    return null;
  }
  return db;
};

// ✅ Mapeo de módulos a sus colecciones y campos de referencia
const MODULE_COLLECTIONS: Record<ModuleId, { 
  collection: string; 
  field?: string; 
  check: (uid: string, moduleId: ModuleId) => Promise<{ hasData: boolean; count: number; message: string }>
}> = {
  inventario: {
    collection: 'productos',
    check: async (uid, moduleId) => {
      const firestore = getDb();
      if (!firestore) return { hasData: false, count: 0, message: '' };
      
      const q = query(
        collection(firestore, 'negocios', uid, 'productos'),
        where('categoria', '==', 'materia_prima')
      );
      const snapshot = await getCountFromServer(q);
      const count = snapshot.data().count;
      return {
        hasData: count > 0,
        count,
        message: `Tienes ${count} productos de materia prima registrados`
      };
    }
  },
  ventas: {
    collection: 'ventas',
    check: async (uid, moduleId) => {
      const firestore = getDb();
      if (!firestore) return { hasData: false, count: 0, message: '' };
      
      const q = query(
        collection(firestore, 'negocios', uid, 'ventas'),
        where('estado', '==', 'completada')
      );
      const snapshot = await getCountFromServer(q);
      const count = snapshot.data().count;
      return {
        hasData: count > 0,
        count,
        message: `Tienes ${count} ventas registradas`
      };
    }
  },
  produccion: {
    collection: 'produccion',
    check: async (uid, moduleId) => {
      const firestore = getDb();
      if (!firestore) return { hasData: false, count: 0, message: '' };
      
      const q = query(
        collection(firestore, 'negocios', uid, 'produccion'),
        where('estado', 'in', ['completada', 'en_progreso'])
      );
      const snapshot = await getCountFromServer(q);
      const count = snapshot.data().count;
      return {
        hasData: count > 0,
        count,
        message: `Tienes ${count} órdenes de producción`
      };
    }
  },
  caja: {
    collection: 'caja',
    check: async (uid, moduleId) => {
      const firestore = getDb();
      if (!firestore) return { hasData: false, count: 0, message: '' };
      
      const q = query(
        collection(firestore, 'negocios', uid, 'caja'),
        where('estado', '==', 'completado')
      );
      const snapshot = await getCountFromServer(q);
      const count = snapshot.data().count;
      return {
        hasData: count > 0,
        count,
        message: `Tienes ${count} movimientos de caja registrados`
      };
    }
  },
  empleados: {
    collection: 'empleados',
    check: async (uid, moduleId) => {
      const firestore = getDb();
      if (!firestore) return { hasData: false, count: 0, message: '' };
      
      const q = query(
        collection(firestore, 'negocios', uid, 'empleados'),
        where('estado', '==', 'activo')
      );
      const snapshot = await getCountFromServer(q);
      const count = snapshot.data().count;
      return {
        hasData: count > 0,
        count,
        message: `Tienes ${count} empleados activos`
      };
    }
  },
  clientes: {
    collection: 'clientes',
    check: async (uid, moduleId) => {
      const firestore = getDb();
      if (!firestore) return { hasData: false, count: 0, message: '' };
      
      const q = query(
        collection(firestore, 'negocios', uid, 'clientes'),
        where('compras', '>', 0)
      );
      const snapshot = await getCountFromServer(q);
      const count = snapshot.data().count;
      return {
        hasData: count > 0,
        count,
        message: `Tienes ${count} clientes con compras registradas`
      };
    }
  },
  proveedores: {
    collection: 'proveedores',
    check: async (uid, moduleId) => {
      const firestore = getDb();
      if (!firestore) return { hasData: false, count: 0, message: '' };
      
      const q = query(
        collection(firestore, 'negocios', uid, 'proveedores'),
        where('productos', '>', 0)
      );
      const snapshot = await getCountFromServer(q);
      const count = snapshot.data().count;
      return {
        hasData: count > 0,
        count,
        message: `Tienes ${count} proveedores con productos asociados`
      };
    }
  },
  compras: {
    collection: 'compras',
    check: async (uid, moduleId) => {
      const firestore = getDb();
      if (!firestore) return { hasData: false, count: 0, message: '' };
      
      const q = query(
        collection(firestore, 'negocios', uid, 'compras'),
        where('estado', 'in', ['recibido', 'pendiente'])
      );
      const snapshot = await getCountFromServer(q);
      const count = snapshot.data().count;
      return {
        hasData: count > 0,
        count,
        message: `Tienes ${count} compras registradas`
      };
    }
  },
  reportes: {
    collection: 'reportes',
    check: async (uid, moduleId) => {
      // Los reportes no almacenan datos directamente
      return { hasData: false, count: 0, message: '' };
    }
  }
};

// ✅ Verificar si un módulo tiene datos
export const checkModuleHasData = async (
  uid: string,
  moduleId: ModuleId
): Promise<{ hasData: boolean; count: number; message: string }> => {
  const check = MODULE_COLLECTIONS[moduleId]?.check;
  if (!check) {
    return { hasData: false, count: 0, message: '' };
  }
  return await check(uid, moduleId);
};

// ✅ Verificar múltiples módulos
export const checkModulesData = async (
  uid: string,
  moduleIds: ModuleId[]
): Promise<Record<ModuleId, { hasData: boolean; count: number; message: string }>> => {
  const results: Record<ModuleId, { hasData: boolean; count: number; message: string }> = {} as any;
  
  for (const moduleId of moduleIds) {
    results[moduleId] = await checkModuleHasData(uid, moduleId);
  }
  
  return results;
};

// ✅ Verificar si un módulo se puede desactivar
export const canDeactivateModule = async (
  uid: string,
  moduleId: ModuleId
): Promise<{ 
  canDeactivate: boolean; 
  hasData: boolean; 
  count: number; 
  message: string;
  reason?: string;
}> => {
  const result = await checkModuleHasData(uid, moduleId);
  
  // ✅ Los módulos obligatorios no se pueden desactivar
  const MODULOS_OBLIGATORIOS = ['inventario'];
  if (MODULOS_OBLIGATORIOS.includes(moduleId)) {
    return {
      canDeactivate: false,
      hasData: true,
      count: 1,
      message: 'Este módulo es obligatorio y no puede desactivarse',
      reason: 'required'
    };
  }
  
  // ✅ Si tiene datos, no se puede desactivar
  if (result.hasData) {
    return {
      canDeactivate: false,
      ...result,
      reason: 'has_data'
    };
  }
  
  return {
    canDeactivate: true,
    ...result
  };
};

// ✅ Obtener módulos que se pueden desactivar
export const getDeactivatableModules = async (
  uid: string,
  activeModules: ModuleId[]
): Promise<{
  moduleId: ModuleId;
  canDeactivate: boolean;
  hasData: boolean;
  count: number;
  message: string;
  reason?: string;
}[]> => {
  const results = [];
  
  for (const moduleId of activeModules) {
    const result = await canDeactivateModule(uid, moduleId);
    results.push({ moduleId, ...result });
  }
  
  return results;
};

// ✅ Función para obtener mensaje de confirmación
export const getDeactivationWarning = (moduleId: ModuleId, count: number): string => {
  const moduleNames: Record<ModuleId, string> = {
    inventario: 'productos',
    ventas: 'ventas',
    produccion: 'órdenes de producción',
    caja: 'movimientos',
    empleados: 'empleados',
    clientes: 'clientes',
    proveedores: 'proveedores',
    compras: 'compras',
    reportes: 'reportes'
  };
  
  const name = moduleNames[moduleId] || 'datos';
  return `⚠️ Este módulo tiene ${count} ${name} registrados. 
  Si lo desactivas, los datos quedarán ocultos pero no se eliminarán.
  ¿Estás seguro de continuar?`;
};

// ✅ Forzar desactivación con confirmación
export const forceDeactivateModule = async (
  uid: string,
  moduleId: ModuleId,
  activeModules: ModuleId[]
): Promise<{ success: boolean; error?: string }> => {
  // Verificar si es obligatorio
  const MODULOS_OBLIGATORIOS = ['inventario'];
  if (MODULOS_OBLIGATORIOS.includes(moduleId)) {
    return { success: false, error: 'Este módulo es obligatorio y no puede desactivarse' };
  }
  
  // Verificar datos
  const { hasData, count } = await checkModuleHasData(uid, moduleId);
  
  // Si tiene datos, mostrar advertencia
  if (hasData) {
    const confirmMessage = getDeactivationWarning(moduleId, count);
    if (!confirm(confirmMessage)) {
      return { success: false, error: 'Operación cancelada por el usuario' };
    }
  }
  
  // Desactivar el módulo
  const nuevosModulos = activeModules.filter(id => id !== moduleId);
  
  try {
    const firestore = getDb();
    if (!firestore) return { success: false, error: 'Firestore no disponible' };
    
    await updateDoc(doc(firestore, 'negocios', uid), {
      modulosActivos: nuevosModulos,
      updatedAt: serverTimestamp(),
    });
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};