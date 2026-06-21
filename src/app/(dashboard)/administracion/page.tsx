'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Plus, 
  Check, 
  X, 
  AlertCircle,
  Package,
  DollarSign,
  Factory,
  Users,
  TrendingUp,
  ShoppingCart,
  Building,
  Receipt,
  Store,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../../../hooks/useAuth';
import { 
  getNegocioConfig, 
  crearNegocioConfig, 
  actualizarModulos,
  getActiveModules,
  isModuleActive 
} from '../../../../lib/modules/modules';
import { MODULOS_DISPONIBLES, TIPOS_NEGOCIO, MODULOS_OBLIGATORIOS } from '../../../../lib/modules/config';
import { ModuleId } from '../../../../lib/modules/types';
import { showToast } from '../../providers';
import { ModuleNav } from './components/ModuleNav'; // ✅ Importar el navbar

// Mapeo de iconos
const ICONOS: Record<string, any> = {
  '📦': Package,
  '💰': DollarSign,
  '🏭': Factory,
  '💵': TrendingUp,
  '👥': Users,
  '📊': TrendingUp,
  '👤': Users,
  '🏢': Building,
  '🛒': ShoppingCart,
  '🔧': Settings,
};

export default function AdministracionPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<any>(null);
  const [modulosActivos, setModulosActivos] = useState<ModuleId[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const [negocioData, setNegocioData] = useState({
    nombre: '',
    tipo: 'otros' as keyof typeof TIPOS_NEGOCIO,
  });
  const [modulosSeleccionados, setModulosSeleccionados] = useState<ModuleId[]>(['inventario']);

  useEffect(() => {
    if (user) {
      cargarConfiguracion();
    }
  }, [user]);

  const cargarConfiguracion = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getNegocioConfig(user.uid);
      if (data) {
        setConfig(data);
        setModulosActivos(data.modulosActivos || ['inventario']);
      } else {
        setShowWizard(true);
      }
    } catch (error) {
      showToast({ message: 'Error al cargar configuración', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCrearNegocio = async () => {
    if (!user) return;
    if (!negocioData.nombre.trim()) {
      showToast({ message: 'Ingresa un nombre para tu negocio', type: 'error' });
      return;
    }

    const result = await crearNegocioConfig(user.uid, negocioData.nombre, negocioData.tipo);
    if (result.success) {
      showToast({ message: '✅ Negocio configurado exitosamente', type: 'success' });
      setShowWizard(false);
      await cargarConfiguracion();
    } else {
      showToast({ message: result.error || 'Error al crear configuración', type: 'error' });
    }
  };

  const toggleModulo = (moduleId: ModuleId) => {
    if (MODULOS_OBLIGATORIOS.includes(moduleId)) return;
    
    setModulosSeleccionados(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleGuardarModulos = async () => {
    if (!user) return;
    const result = await actualizarModulos(user.uid, modulosSeleccionados);
    if (result.success) {
      showToast({ message: '✅ Módulos actualizados correctamente', type: 'success' });
      setModulosActivos(modulosSeleccionados);
      await cargarConfiguracion();
    } else {
      showToast({ message: result.error || 'Error al actualizar módulos', type: 'error' });
    }
  };

  // Módulos disponibles para seleccionar
  const modulosDisponibles = MODULOS_DISPONIBLES;

  // Módulos activos
  const modulosActivosData = modulosDisponibles.filter(m => modulosActivos.includes(m.id));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  // ✅ WIZARD: Configuración inicial del negocio
  if (showWizard) {
    return (
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🏪</div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Configura tu Negocio
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Personaliza Tinker según las necesidades de tu negocio
            </p>
          </div>

          <div className="space-y-6">
            {/* Nombre del negocio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre del Negocio *
              </label>
              <input
                type="text"
                value={negocioData.nombre}
                onChange={(e) => setNegocioData({ ...negocioData, nombre: e.target.value })}
                placeholder="Ej: Mi Restaurante, Tienda Don Juan..."
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Tipo de negocio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Negocio
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(TIPOS_NEGOCIO).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => setNegocioData({ ...negocioData, tipo: key as any })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      negocioData.tipo === key
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{value.nombre.split(' ')[0]}</div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {value.nombre}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCrearNegocio}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              Comenzar con Tinker 🚀
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ✅ DASHBOARD DE ADMINISTRACIÓN
  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            ⚙️ Administración
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {config?.nombre || 'Mi Negocio'} - Gestiona los módulos de tu negocio
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowWizard(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <Settings size={20} />
            Reconfigurar
          </button>
        </div>
      </motion.div>

      {/* ✅ NAVBAR DE MÓDULOS */}
      <ModuleNav modulosActivos={modulosActivos} />

      {/* Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Módulos Activos</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {modulosActivos.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Tipo de Negocio</p>
          <p className="text-lg font-medium text-gray-800 dark:text-white capitalize">
            {config?.tipo || 'Otros'}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Módulos Disponibles</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {modulosDisponibles.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Estado</p>
          <p className="text-lg font-medium text-green-600">✅ Configurado</p>
        </div>
      </div>

      {/* Módulos Activos */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          📋 Módulos Activos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modulosActivosData.map((modulo) => {
            const Icon = ICONOS[modulo.icono] || Settings;
            return (
              <motion.div
                key={modulo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-green-200 dark:border-green-800 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-2xl">
                    {modulo.icono}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {modulo.nombre}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {modulo.descripcion}
                    </p>
                  </div>
                  <div className="text-green-500">
                    <Check size={18} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Gestión de Módulos */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          🔧 Activar / Desactivar Módulos
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Selecciona los módulos que quieres activar para tu negocio.
          <span className="text-blue-600"> * Módulos obligatorios</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {modulosDisponibles.map((modulo) => {
            const isActive = modulosSeleccionados.includes(modulo.id);
            const isObligatorio = MODULOS_OBLIGATORIOS.includes(modulo.id);
            const Icon = ICONOS[modulo.icono] || Settings;

            return (
              <button
                key={modulo.id}
                onClick={() => toggleModulo(modulo.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                  isActive
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                } ${isObligatorio ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                disabled={isObligatorio}
              >
                <div className="text-2xl">{modulo.icono}</div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-800 dark:text-white">
                    {modulo.nombre}
                    {isObligatorio && ' *'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {modulo.descripcion}
                  </p>
                </div>
                <div>
                  {isActive ? (
                    <Check size={20} className="text-blue-600" />
                  ) : (
                    <Plus size={20} className="text-gray-400" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleGuardarModulos}
          className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}