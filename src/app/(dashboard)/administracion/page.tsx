'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Settings, 
  Store, 
  Users, 
  Shield,
  Database,
  Activity,
  UserCog,
  Building,
  ArrowRight,
  CheckCircle,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../../../hooks/useAuth';
import { 
  getNegocioConfig, 
  crearNegocioConfig, 
  actualizarModulos 
} from '../../../../lib/modules/modules';
import { MODULOS_DISPONIBLES, TIPOS_NEGOCIO, MODULOS_OBLIGATORIOS } from '../../../../lib/modules/config';
import { ModuleId, TipoNegocio } from '../../../../lib/modules/types';
import { getUsuariosByNegocio } from '../../../../lib/firebase/usuarios';
import { showToast } from '../../providers';
import { BusinessWizard } from './components/BusinessWizard';
import { ModuleSelector } from './components/ModuleSelector';
import { checkModulesData } from '../../../../lib/modules/moduleGuard';

// ✅ Tarjeta de configuración - CORREGIDA
function ConfigCard({ 
  icon: Icon, 
  title, 
  description, 
  href, 
  color,
  badge,
  onClick
}: { 
  icon: any; 
  title: string; 
  description: string; 
  href: string; 
  color: string;
  badge?: string;
  onClick?: () => void;
}) {
  // ✅ Si tiene onClick, renderizar como button
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="w-full text-left"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${color}`}>
              <Icon size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-800 dark:text-white">{title}</h3>
                {badge && (
                  <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                    {badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
            </div>
            <ArrowRight size={20} className="text-gray-400" />
          </div>
        </motion.div>
      </button>
    );
  }

  // ✅ Si no tiene onClick, renderizar como Link
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all cursor-pointer"
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-800 dark:text-white">{title}</h3>
              {badge && (
                <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                  {badge}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
          </div>
          <ArrowRight size={20} className="text-gray-400" />
        </div>
      </motion.div>
    </Link>
  );
}

export default function AdministracionPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<any>(null);
  const [modulosSeleccionados, setModulosSeleccionados] = useState<ModuleId[]>(['inventario']);
  const [showWizard, setShowWizard] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [moduleDataStatus, setModuleDataStatus] = useState<Record<ModuleId, { hasData: boolean; count: number; message: string }>>({} as any);
  const [loadingData, setLoadingData] = useState(false);
  const [usuariosCount, setUsuariosCount] = useState(0);

  useEffect(() => {
    if (user) {
      cargarConfiguracion();
    }
  }, [user]);

  const cargarConfiguracion = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Cargar configuración, módulos y usuarios en paralelo
      const [data, usuariosData] = await Promise.all([
        getNegocioConfig(user.uid),
        getUsuariosByNegocio(user.uid)
      ]);
      
      if (data) {
        setConfig(data);
        setModulosSeleccionados(data.modulosActivos || ['inventario']);
        setShowWizard(false);
        setLastUpdated(new Date().toLocaleString());
        setUsuariosCount(usuariosData.length);
        // Cargar datos de módulos
        await cargarDatosModulos(data.modulosActivos || ['inventario']);
      } else {
        setShowWizard(true);
      }
    } catch (error) {
      showToast({ message: 'Error al cargar configuración', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const cargarDatosModulos = async (modules: ModuleId[]) => {
    if (!user || !modules.length) return;
    setLoadingData(true);
    try {
      const status = await checkModulesData(user.uid, modules);
      setModuleDataStatus(status);
    } catch (error) {
      console.error('Error verificando datos:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleCompleteWizard = async (data: { nombre: string; tipo: TipoNegocio }) => {
    if (!user) return;
    
    const result = await crearNegocioConfig(user.uid, data.nombre, data.tipo);
    if (result.success) {
      showToast({ message: '✅ Negocio configurado exitosamente', type: 'success' });
      setShowWizard(false);
      await cargarConfiguracion();
    } else {
      showToast({ message: result.error || 'Error al crear configuración', type: 'error' });
    }
  };

  const handleToggleModule = (moduleId: ModuleId) => {
    if (MODULOS_OBLIGATORIOS.includes(moduleId)) return;
    
    // Verificar si tiene datos y está activo
    if (modulosSeleccionados.includes(moduleId)) {
      const status = moduleDataStatus[moduleId];
      if (status?.hasData) {
        showToast({
          message: `⚠️ No puedes desactivar "${moduleId}" porque tiene ${status.count} registros.`,
          type: 'error'
        });
        return;
      }
    }
    
    setModulosSeleccionados(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleSaveModules = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const result = await actualizarModulos(user.uid, modulosSeleccionados);
      if (result.success) {
        showToast({ message: '✅ Módulos actualizados correctamente', type: 'success' });
        await cargarConfiguracion();
      } else {
        showToast({ message: result.error || 'Error al actualizar módulos', type: 'error' });
      }
    } catch (error) {
      showToast({ message: 'Error al guardar cambios', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Estadísticas
  const totalModulos = MODULOS_DISPONIBLES.length;
  const modulosActivos = modulosSeleccionados.length;
  const modulosConDatos = Object.values(moduleDataStatus).filter(s => s?.hasData).length;

  // Wizard
  if (showWizard) {
    return <BusinessWizard onComplete={handleCompleteWizard} loading={loading} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            ⚙️ Administración
            {config?.nombre && (
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                • {config.nombre}
              </span>
            )}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
            Gestiona la configuración de tu negocio
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={cargarConfiguracion}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Recargar
          </button>
        </div>
      </motion.div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Negocio</p>
          <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
            {config?.nombre || 'Sin configurar'}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Tipo</p>
          <p className="text-sm font-semibold text-gray-800 dark:text-white capitalize">
            {config?.tipo || 'Otros'}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Módulos Activos</p>
          <p className="text-sm font-semibold text-blue-600">
            {modulosActivos} / {totalModulos}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Usuarios</p>
          <p className="text-sm font-semibold text-green-600 flex items-center gap-1">
            <Users size={14} />
            {usuariosCount}
          </p>
        </div>
      </div>

      {/* ✅ CONFIGURACIONES DISPONIBLES */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <Settings size={16} />
          Configuraciones
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Usuarios */}
          <ConfigCard
            icon={Users}
            title="Usuarios"
            description="Gestiona usuarios y permisos del negocio"
            href="/administracion/usuarios"
            color="bg-blue-600"
            badge={`${usuariosCount}`}
          />

          {/* Módulos */}
          <ConfigCard
            icon={Shield}
            title="Módulos"
            description="Activa o desactiva módulos del negocio"
            href="/administracion/modulos"
            color="bg-purple-600"
          />

          {/* Datos del negocio */}
          <ConfigCard
            icon={Building}
            title="Datos del Negocio"
            description="Configura nombre, tipo y datos básicos"
            href="/administracion/datos"
            color="bg-green-600"
          />

          {/* Actividad */}
          <ConfigCard
            icon={Activity}
            title="Actividad"
            description="Historial y actividad del negocio"
            href="/administracion/actividad"
            color="bg-yellow-600"
          />
        </div>
      </div>

      {/* ✅ GESTIÓN DE MÓDULOS - SECCIÓN PRINCIPAL (se mantiene igual) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <Settings size={18} className="text-gray-500" />
              Gestionar Módulos
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Activa o desactiva módulos según las necesidades de tu negocio
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              <span className="text-blue-600 font-medium">*</span> Obligatorios
            </span>
            <button
              onClick={handleSaveModules}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors shadow-sm text-sm font-medium"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-4">
          <ModuleSelector
            selectedModules={modulosSeleccionados}
            onToggle={handleToggleModule}
            onSave={handleSaveModules}
            loading={loading}
            saving={saving}
            moduleDataStatus={moduleDataStatus}
            loadingData={loadingData}
          />
        </div>
      </motion.div>

      {/* ✅ ACCIONES RÁPIDAS - SOLO ADMINISTRACIÓN */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
          <ArrowRight size={16} />
          Acciones rápidas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all hover:scale-[1.02]"
          >
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Activity size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white">Dashboard</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Ver métricas del negocio</p>
            </div>
          </Link>
          <Link
            href="/administracion/usuarios"
            className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all hover:scale-[1.02]"
          >
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <UserCog size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white">Gestionar Usuarios</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{usuariosCount} usuarios registrados</p>
            </div>
          </Link>
        </div>
      </motion.div>

      {/* Footer con información */}
      <div className="text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <span>📦 {totalModulos} módulos disponibles</span>
          <span>✅ {modulosActivos} activos</span>
          {modulosConDatos > 0 && (
            <span className="text-amber-600 flex items-center gap-1">
              <Database size={12} />
              {modulosConDatos} con datos
            </span>
          )}
          <span className="text-blue-600 flex items-center gap-1">
            <Users size={12} />
            {usuariosCount} usuarios
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Shield size={12} />
          <span>Los cambios se aplican inmediatamente</span>
        </div>
      </div>
    </div>
  );
}