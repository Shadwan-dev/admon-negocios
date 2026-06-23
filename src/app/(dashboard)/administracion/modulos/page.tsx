'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Settings,
  Package,
  ShoppingCart,
  Factory,
  DollarSign,
  Users,
  TrendingUp,
  UserCircle,
  Truck,
  ShoppingBag,
  Calculator,
  BarChart3,
  Check,
  X,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../../../../hooks/useAuth';
import { getNegocioConfig, actualizarModulos } from '../../../../../lib/modules/modules';
import { MODULOS_DISPONIBLES, MODULOS_OBLIGATORIOS } from '../../../../../lib/modules/config';
import { ModuleId } from '../../../../../lib/modules/types';
import { showToast } from '../../../providers';
import { Spinner } from '../../../components/ui/Spinner';

// Mapeo de iconos para módulos
const MODULE_ICONS: Record<string, any> = {
  inventario: Package,
  ventas: ShoppingCart,
  produccion: Factory,
  caja: DollarSign,
  empleados: Users,
  reportes: BarChart3,
  clientes: UserCircle,
  proveedores: Truck,
  compras: ShoppingBag,
  fichas_costo: Calculator,
};

export default function ModulosPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<any>(null);
  const [modulosSeleccionados, setModulosSeleccionados] = useState<ModuleId[]>(['inventario']);

  useEffect(() => {
    if (user) {
      cargarDatos();
    }
  }, [user]);

  const cargarDatos = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getNegocioConfig(user.uid);
      setConfig(data);
      setModulosSeleccionados(data?.modulosActivos || ['inventario']);
    } catch (error) {
      showToast({ message: 'Error al cargar configuración', type: 'error' });
    } finally {
      setLoading(false);
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

  const handleGuardar = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const result = await actualizarModulos(user.uid, modulosSeleccionados);
      if (result.success) {
        showToast({ message: '✅ Módulos actualizados correctamente', type: 'success' });
        await cargarDatos();
      } else {
        showToast({ message: result.error || 'Error al actualizar', type: 'error' });
      }
    } catch (error) {
      showToast({ message: 'Error al guardar cambios', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Spinner size="lg" label="Cargando módulos..." />;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push('/administracion')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Settings size={24} className="text-purple-600" />
            Módulos
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Activa o desactiva módulos para tu negocio
          </p>
        </div>
      </div>

      {/* Grid de módulos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {MODULOS_DISPONIBLES.map((modulo) => {
          const isActive = modulosSeleccionados.includes(modulo.id);
          const isObligatorio = MODULOS_OBLIGATORIOS.includes(modulo.id);
          const Icon = MODULE_ICONS[modulo.id] || Settings;

          return (
            <motion.div
              key={modulo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => toggleModulo(modulo.id)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              } ${isObligatorio ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-md'}`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  <Icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800 dark:text-white text-sm">
                      {modulo.nombre}
                    </span>
                    {isObligatorio && (
                      <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                        Obligatorio
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{modulo.descripcion}</p>
                </div>
                <div>
                  {isActive ? (
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Check size={14} className="text-blue-600" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <X size={14} className="text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Guardar */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {modulosSeleccionados.length} módulos activos de {MODULOS_DISPONIBLES.length}
        </p>
        <button
          onClick={handleGuardar}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Guardando...
            </>
          ) : (
            'Guardar Cambios'
          )}
        </button>
      </div>
    </div>
  );
}