// app/(dashboard)/negocio/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Store, 
  Package, 
  DollarSign, 
  Factory, 
  Users, 
  TrendingUp,
  UserCircle,
  Truck,
  ShoppingBag,
  Calculator,
  Plus,
  ArrowRight,
  Database,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../../../hooks/useAuth';
import { getNegocioConfig } from '../../../../lib/modules/modules';
import { ModuleId } from '../../../../lib/modules/types';
import { MODULOS_DISPONIBLES } from '../../../../lib/modules/config';
import { getProductos } from '../../../../lib/firebase/productos';
import { getVentas } from '../../../../lib/firebase/ventas';
import { getEmpleados } from '../../../../lib/firebase/empleados';
import { getClientes } from '../../../../lib/firebase/clientes';
import { getMovimientosCaja } from '../../../../lib/firebase/caja';
import { showToast } from '../../providers';
import { NegocioSidebar } from './NegocioSidebar';

// ✅ Configuración de módulos con sus rutas
const MODULE_ROUTES: Record<ModuleId, { 
  icon: any; 
  label: string; 
  path: string; 
  description: string;
  color: string;
  bg: string;
}> = {
  inventario: {
    icon: Package,
    label: 'Inventario',
    path: '/inventario',
    description: 'Control de stock y productos',
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20'
  },
  ventas: {
    icon: DollarSign,
    label: 'Ventas',
    path: '/ventas',
    description: 'Registro de ventas y clientes',
    color: 'text-green-600',
    bg: 'bg-green-50 dark:bg-green-900/20'
  },
  produccion: {
    icon: Factory,
    label: 'Producción',
    path: '/produccion',
    description: 'Órdenes de producción',
    color: 'text-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-900/20'
  },
  caja: {
    icon: TrendingUp,
    label: 'Caja',
    path: '/caja',
    description: 'Ingresos, egresos y balances',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20'
  },
  empleados: {
    icon: Users,
    label: 'Empleados',
    path: '/empleados',
    description: 'Gestión de personal',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20'
  },
  clientes: {
    icon: UserCircle,
    label: 'Clientes',
    path: '/clientes',
    description: 'Gestión de clientes',
    color: 'text-pink-600',
    bg: 'bg-pink-50 dark:bg-pink-900/20'
  },
  proveedores: {
    icon: Truck,
    label: 'Proveedores',
    path: '/proveedores',
    description: 'Gestión de proveedores',
    color: 'text-orange-600',
    bg: 'bg-orange-50 dark:bg-orange-900/20'
  },
  compras: {
    icon: ShoppingBag,
    label: 'Compras',
    path: '/compras',
    description: 'Registro de compras',
    color: 'text-red-600',
    bg: 'bg-red-50 dark:bg-red-900/20'
  },
  reportes: {
    icon: BarChart3,
    label: 'Reportes',
    path: '/reportes',
    description: 'Generación de reportes',
    color: 'text-cyan-600',
    bg: 'bg-cyan-50 dark:bg-cyan-900/20'
  },
};

// ✅ Definir el tipo correctamente
type ModuloItem = {
  id: string;
  nombre: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  count: number;
  path: string;
  color: string;
  bgColor: string;
  descripcion: string;
};

export default function NegocioPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<any>(null);
  const [moduleData, setModuleData] = useState<Record<string, number>>({});

  useEffect(() => {
    if (user) {
      cargarDatos();
    }
  }, [user]);

  const cargarDatos = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [configData, productos, ventas, empleados, clientes, caja] = await Promise.all([
        getNegocioConfig(user.uid),
        getProductos(user.uid),
        getVentas(user.uid),
        getEmpleados(user.uid),
        getClientes(user.uid),
        getMovimientosCaja(user.uid)
      ]);

      setConfig(configData);
      
      setModuleData({
        productos: productos.length,
        ventas: ventas.filter(v => v.estado === 'completada').length,
        empleados: empleados.filter(e => e.estado === 'activo').length,
        clientes: clientes.length,
        compras: 0,
        caja: caja.filter(m => m.estado === 'completado').length,
        produccion: 0,
      });
    } catch (error) {
      showToast({ message: 'Error al cargar datos', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="text-center py-12">
        <Store size={64} className="mx-auto mb-4 text-gray-300" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          No hay negocio configurado
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Ve a Administración para configurar tu negocio
        </p>
        <button
          onClick={() => router.push('/administracion')}
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Ir a Administración
          <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  // ✅ Crear moduleItems con todas las propiedades correctas
  const activeModules = config?.modulosActivos || ['inventario'];
  const moduleItems: ModuloItem[] = activeModules
    .filter((id: ModuleId) => MODULE_ROUTES[id])
    .map((id: ModuleId) => {
      const route = MODULE_ROUTES[id];
      return {
        id,
        nombre: route.label,
        icon: route.icon,
        count: moduleData[id] || 0,
        path: route.path,
        color: route.color,
        bgColor: route.bg,
        descripcion: route.description,
      };
    });

  return (
    <div className="flex min-h-screen">
      {/* ✅ Sidebar del Negocio - Componente separado */}
      <NegocioSidebar />
      
      {/* Contenido principal con margen para el sidebar */}
      <div className="flex-1 ml-[72px] md:ml-[280px] transition-all duration-300 p-4 md:p-6">
        <div className="space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                <Store size={28} className="text-blue-600" />
                {config.nombre}
                <span className="text-sm font-normal text-gray-400 dark:text-gray-500">
                  • {config.tipo}
                </span>
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Gestiona todos los aspectos de tu negocio desde aquí
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={cargarDatos}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm"
              >
                <span>🔄</span> Actualizar
              </button>
            </div>
          </motion.div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 border border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">Productos</p>
              <p className="text-lg font-bold text-gray-800 dark:text-white">{moduleData.productos || 0}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 border border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">Ventas</p>
              <p className="text-lg font-bold text-green-600">{moduleData.ventas || 0}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 border border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">Clientes</p>
              <p className="text-lg font-bold text-pink-600">{moduleData.clientes || 0}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 border border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">Módulos Activos</p>
              <p className="text-lg font-bold text-blue-600">{moduleItems.length}</p>
            </div>
          </div>

          {/* Grid de Módulos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {moduleItems.map((mod: ModuloItem, index: number) => {
              const Icon = mod.icon;
              const hasData = mod.count > 0;

              return (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleNavigate(mod.path)}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-all cursor-pointer group hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between">
                    <div className={`p-2.5 rounded-lg ${mod.bgColor}`}>
                      <Icon size={20} className={mod.color} />
                    </div>
                    {hasData && (
                      <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Database size={12} />
                        {mod.count}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-3">
                    <h3 className="font-semibold text-gray-800 dark:text-white text-sm">
                      {mod.nombre}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {mod.descripcion}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {hasData ? `${mod.count} registros` : 'Sin datos'}
                    </span>
                    <span className="text-gray-400 group-hover:text-blue-600 transition-colors">
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {/* Botón para agregar más módulos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => router.push('/administracion')}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 border-dashed border-gray-200 dark:border-gray-700 p-4 hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer group hover:shadow-md flex flex-col items-center justify-center min-h-[160px]"
            >
              <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                <Plus size={24} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">
                Activar más módulos
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
                Ve a Administración para activar módulos adicionales
              </p>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>🏪 {config.nombre} • {config.tipo}</span>
            <span>{moduleItems.length} módulos activos de {Object.keys(MODULE_ROUTES).length} disponibles</span>
          </div>
        </div>
      </div>
    </div>
  );
}