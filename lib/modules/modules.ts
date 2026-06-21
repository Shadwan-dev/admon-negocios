import { db } from '../firebase/config';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { NegocioConfig, ModuleId, TipoNegocio } from './types';
import { 
  MODULOS_DISPONIBLES, 
  TIPOS_NEGOCIO, 
  MODULOS_OBLIGATORIOS,
  getModulosRecomendados 
} from './config';

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
    const docRef = doc(firestore, 'negocio_config', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as NegocioConfig;
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo configuración:', error);
    return null;
  }
};

// ✅ Crear configuración inicial del negocio
export const crearNegocioConfig = async (
  uid: string, 
  nombre: string, 
  tipo: TipoNegocio // ✅ Usar el tipo específico
): Promise<{ success: boolean; error?: string }> => {
  try {
    const firestore = checkDb();
    
    // Obtener módulos recomendados para este tipo de negocio
    const modulosRecomendados = getModulosRecomendados(tipo);
    
    // Módulos obligatorios + recomendados (sin duplicados)
    const modulosActivos: ModuleId[] = [...new Set([
      ...MODULOS_OBLIGATORIOS, 
      ...modulosRecomendados
    ])];
    
    const config: NegocioConfig = {
      uid,
      nombre,
      tipo, // ✅ Ahora tipo es del tipo correcto
      modulosActivos,
      configuraciones: {},
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    await setDoc(doc(firestore, 'negocio_config', uid), config);
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
  try {
    const firestore = checkDb();
    await updateDoc(doc(firestore, 'negocio_config', uid), {
      modulosActivos,
      updatedAt: serverTimestamp(),
    });
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
    
    // Verificar dependencias
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
    // No permitir desactivar módulos obligatorios
    if (MODULOS_OBLIGATORIOS.includes(moduleId)) {
      return { success: false, error: 'Este módulo es obligatorio y no puede desactivarse' };
    }
    
    const config = await getNegocioConfig(uid);
    if (!config) {
      return { success: false, error: 'Configuración no encontrada' };
    }
    
    // Verificar si algún módulo depende de este
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

// ✅ Actualizar tipo de negocio
export const actualizarTipoNegocio = async (
  uid: string,
  nuevoTipo: TipoNegocio
): Promise<{ success: boolean; error?: string }> => {
  try {
    const firestore = checkDb();
    
    // Obtener nuevos módulos recomendados
    const nuevosRecomendados = getModulosRecomendados(nuevoTipo);
    const modulosActivos: ModuleId[] = [...new Set([
      ...MODULOS_OBLIGATORIOS, 
      ...nuevosRecomendados
    ])];
    
    await updateDoc(doc(firestore, 'negocio_config', uid), {
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