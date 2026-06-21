import { db } from '../firebase/config';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { NegocioConfig, ModuleId } from './types';
import { MODULOS_DISPONIBLES, TIPOS_NEGOCIO, MODULOS_OBLIGATORIOS } from './config';

// ✅ Obtener configuración del negocio
export const getNegocioConfig = async (uid: string): Promise<NegocioConfig | null> => {
  try {
    const docRef = doc(db, 'negocio_config', uid);
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
  tipo: keyof typeof TIPOS_NEGOCIO
): Promise<{ success: boolean; error?: string }> => {
  try {
    const tipoNegocio = TIPOS_NEGOCIO[tipo] || TIPOS_NEGOCIO.otros;
    const modulosRecomendados = tipoNegocio.modulosRecomendados as ModuleId[];
    
    // Mezclar obligatorios + recomendados
    const modulosBase = ['inventario']; // Siempre activos
    const modulosActivos = [...new Set([...modulosBase, ...modulosRecomendados])];
    
    const config: NegocioConfig = {
      uid,
      nombre,
      tipo,
      modulosActivos,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    await setDoc(doc(db, 'negocio_config', uid), config);
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
    await updateDoc(doc(db, 'negocio_config', uid), {
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
  if (!config) return ['inventario'];
  return config.modulosActivos || ['inventario'];
};

// ✅ Verificar si un módulo está activo
export const isModuleActive = (config: NegocioConfig | null, moduleId: ModuleId): boolean => {
  if (!config) return moduleId === 'inventario';
  return config.modulosActivos.includes(moduleId);
};

// ✅ Obtener lista de módulos activos con sus datos
export const getActiveModules = (config: NegocioConfig | null) => {
  const activeIds = getModulosDisponibles(config);
  return MODULOS_DISPONIBLES.filter(m => activeIds.includes(m.id));
};