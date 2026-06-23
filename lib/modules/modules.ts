import { db } from '../firebase/config';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { NegocioConfig, ModuleId, TipoNegocio } from './types';
import { 
  MODULOS_DISPONIBLES, 
  TIPOS_NEGOCIO, 
  MODULOS_OBLIGATORIOS,
  getModulosRecomendados 
} from './config';
import { 
  checkModuleHasData,
  canDeactivateModule,
  getDeactivatableModules,
  forceDeactivateModule
} from './moduleGuard'; // ✅ Punto y coma agregado

// ✅ Verificar que db está disponible
const checkDb = () => {
  if (!db) {
    throw new Error('Firestore no está disponible. Verifica tu conexión.');
  }
  return db;
};

// ✅ Obtener configuración del negocio
export const getNegocioConfig = async (uid: string): Promise<NegocioConfig | null> => {
  try {
    const firestore = checkDb();
    
    console.log('🔍 Buscando negocio para usuario:', uid);
    
    const docRef = doc(firestore, 'negocios', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as NegocioConfig;
      console.log('✅ Negocio encontrado:', data.nombre);
      return data;
    }
    
    console.log('ℹ️ No se encontró negocio para este usuario');
    return null;
  } catch (error) {
    console.error('Error obteniendo configuración:', error);
    return null;
  }
};

// ✅ Exportar funciones de guard
export {
  checkModuleHasData,
  canDeactivateModule,
  getDeactivatableModules,
  forceDeactivateModule
};

// ✅ Desactivar módulo con verificación
export const desactivarModuloConVerificacion = async (
  uid: string,
  moduleId: ModuleId,
  activeModules: ModuleId[]
): Promise<{ 
  success: boolean; 
  error?: string; 
  hasData?: boolean; 
  count?: number;
  requiresConfirmation?: boolean;
}> => {
  try {
    // Verificar si es obligatorio
    if (MODULOS_OBLIGATORIOS.includes(moduleId)) {
      return { 
        success: false, 
        error: 'Este módulo es obligatorio y no puede desactivarse' 
      };
    }
    
    // Verificar si tiene datos
    const { hasData, count, message } = await checkModuleHasData(uid, moduleId);
    
    if (hasData) {
      return {
        success: false,
        hasData: true,
        count,
        error: `No puedes desactivar este módulo porque tiene ${count} registros asociados.`,
        requiresConfirmation: true
      };
    }
    
    // Desactivar módulo
    const nuevosModulos = activeModules.filter(id => id !== moduleId);
    const firestore = checkDb();
    const docRef = doc(firestore, 'negocios', uid);
    await updateDoc(docRef, {
      modulosActivos: nuevosModulos,
      updatedAt: serverTimestamp(),
    });
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// ✅ Actualizar datos del negocio (nombre y tipo)
export const actualizarNegocio = async (
  uid: string,
  data: { nombre: string; tipo: TipoNegocio }
): Promise<{ success: boolean; error?: string }> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ actualizarNegocio ejecutado en el servidor - simulando éxito');
    return { success: true };
  }

  try {
    const firestore = checkDb();
    
    if (!uid) {
      return { success: false, error: 'Usuario no identificado' };
    }
    
    console.log('📝 Actualizando datos del negocio para usuario:', uid);
    console.log('📋 Nuevos datos:', data);
    
    const docRef = doc(firestore, 'negocios', uid);
    
    await updateDoc(docRef, {
      nombre: data.nombre,
      tipo: data.tipo,
      updatedAt: serverTimestamp(),
    });
    
    console.log('✅ Datos del negocio actualizados correctamente');
    return { success: true };
  } catch (error: any) {
    console.error('Error actualizando datos del negocio:', error);
    return { success: false, error: error.message };
  }
};

// ✅ Crear configuración inicial del negocio
export const crearNegocioConfig = async (
  uid: string, 
  nombre: string, 
  tipo: TipoNegocio
): Promise<{ success: boolean; error?: string }> => {
  try {
    const firestore = checkDb();
    
    if (!uid) {
      return { success: false, error: 'Usuario no identificado' };
    }
    
    console.log('📝 Creando negocio para usuario:', uid);
    
    const modulosRecomendados = getModulosRecomendados(tipo);
    const modulosActivos: ModuleId[] = [...new Set([
      ...MODULOS_OBLIGATORIOS, 
      ...modulosRecomendados
    ])];
    
    const config: NegocioConfig = {
      uid,
      nombre,
      tipo,
      modulosActivos,
      configuraciones: {},
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = doc(firestore, 'negocios', uid);
    await setDoc(docRef, config);
    
    console.log('✅ Negocio creado correctamente');
    return { success: true };
  } catch (error: any) {
    console.error('Error creando configuración:', error);
    return { success: false, error: error.message };
  }
};

// ✅ Actualizar módulos activos
export const actualizarModulos = async (
  uid: string,
  modulosActivos: ModuleId[]
): Promise<{ success: boolean; error?: string }> => {
  if (typeof window === 'undefined') {
    console.log('ℹ️ actualizarModulos ejecutado en el servidor - simulando éxito');
    return { success: true };
  }

  try {
    const firestore = checkDb();
    
    if (!uid) {
      return { success: false, error: 'Usuario no identificado' };
    }
    
    console.log('📝 Actualizando módulos para usuario:', uid);
    console.log('📋 Nuevos módulos:', modulosActivos);
    
    const docRef = doc(firestore, 'negocios', uid);
    
    await updateDoc(docRef, {
      modulosActivos,
      updatedAt: serverTimestamp(),
    });
    
    console.log('✅ Módulos actualizados correctamente');
    return { success: true };
  } catch (error: any) {
    console.error('Error actualizando módulos:', error);
    return { success: false, error: error.message };
  }
};

// ✅ Obtener módulos disponibles para un negocio
export const getModulosDisponibles = (config: NegocioConfig | null): ModuleId[] => {
  if (!config) return MODULOS_OBLIGATORIOS;
  return config.modulosActivos || MODULOS_OBLIGATORIOS;
};

// ✅ Verificar si un módulo está activo
export const isModuleActive = (config: NegocioConfig | null, moduleId: ModuleId): boolean => {
  if (!config) return MODULOS_OBLIGATORIOS.includes(moduleId);
  return config.modulosActivos?.includes(moduleId) || false;
};

// ✅ Obtener lista de módulos activos con sus datos completos
export const getActiveModules = (config: NegocioConfig | null) => {
  const activeIds = getModulosDisponibles(config);
  return MODULOS_DISPONIBLES.filter(m => activeIds.includes(m.id));
};

// ✅ Obtener módulos inactivos
export const getInactiveModules = (config: NegocioConfig | null) => {
  const activeIds = getModulosDisponibles(config);
  return MODULOS_DISPONIBLES.filter(m => !activeIds.includes(m.id));
};

// ✅ Obtener módulos recomendados para un tipo de negocio
export const getRecommendedModules = (tipo: TipoNegocio): ModuleId[] => {
  return getModulosRecomendados(tipo);
};

// ✅ Activar un módulo específico
export const activarModulo = async (
  uid: string,
  moduleId: ModuleId
): Promise<{ success: boolean; error?: string }> => {
  try {
    const config = await getNegocioConfig(uid);
    if (!config) {
      return { success: false, error: 'Configuración no encontrada' };
    }
    
    const moduleData = MODULOS_DISPONIBLES.find(m => m.id === moduleId);
    if (moduleData?.dependencias) {
      const missingDeps = moduleData.dependencias.filter(
        dep => !config.modulosActivos.includes(dep)
      );
      if (missingDeps.length > 0) {
        return { 
          success: false, 
          error: `Faltan dependencias: ${missingDeps.join(', ')}` 
        };
      }
    }
    
    const nuevosModulos = [...new Set([...config.modulosActivos, moduleId])];
    return await actualizarModulos(uid, nuevosModulos);
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// ✅ Desactivar un módulo específico
export const desactivarModulo = async (
  uid: string,
  moduleId: ModuleId
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (MODULOS_OBLIGATORIOS.includes(moduleId)) {
      return { success: false, error: 'Este módulo es obligatorio y no puede desactivarse' };
    }
    
    const config = await getNegocioConfig(uid);
    if (!config) {
      return { success: false, error: 'Configuración no encontrada' };
    }
    
    const dependientes = MODULOS_DISPONIBLES.filter(
      m => m.dependencias?.includes(moduleId) && config.modulosActivos.includes(m.id)
    );
    
    if (dependientes.length > 0) {
      return { 
        success: false, 
        error: `No puedes desactivar este módulo porque es dependencia de: ${dependientes.map(d => d.nombre).join(', ')}` 
      };
    }
    
    const nuevosModulos = config.modulosActivos.filter(id => id !== moduleId);
    return await actualizarModulos(uid, nuevosModulos);
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// ✅ Actualizar tipo de negocio (DEPRECADO - usar actualizarNegocio)
export const actualizarTipoNegocio = async (
  uid: string,
  nuevoTipo: TipoNegocio
): Promise<{ success: boolean; error?: string }> => {
  try {
    const firestore = checkDb();
    
    const nuevosRecomendados = getModulosRecomendados(nuevoTipo);
    const modulosActivos: ModuleId[] = [...new Set([
      ...MODULOS_OBLIGATORIOS, 
      ...nuevosRecomendados
    ])];
    
    // ✅ Usar la ruta correcta: negocios/{uid}
    await updateDoc(doc(firestore, 'negocios', uid), {
      tipo: nuevoTipo,
      modulosActivos,
      updatedAt: serverTimestamp(),
    });
    
    return { success: true };
  } catch (error: any) {
    console.error('Error actualizando tipo de negocio:', error);
    return { success: false, error: error.message };
  }
};