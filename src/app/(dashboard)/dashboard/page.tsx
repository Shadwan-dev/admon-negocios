'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Package, 
  DollarSign, 
  ShoppingCart,
  ArrowUp,
  ArrowDown,
  MoreVertical
} from 'lucide-react';
import { useAuth } from '../../../../hooks/useAuth';
import { getProductos } from '../../../../lib/firebase/productos';
import { getTasaCambio } from '../../../../lib/firebase/tasaCambio';
import { showToast } from '../../providers';

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProductos: 0,
    totalMateriaPrima: 0,
    totalListoVenta: 0,
    tasaCambio: 0,
    monedaLocal: 'Peso',
  });

  useEffect(() => {
    if (user) {
      cargarDashboard();
    }
  }, [user]);

  const cargarDashboard = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Cargar productos
      const productos = await getProductos(user.uid);
      const totalProductos = productos.length;
      const totalMateriaPrima = productos.filter(p => p.categoria === 'materia_prima').length;
      const totalListoVenta = productos.filter(p => p.categoria === 'listo_venta').length;

      // Cargar tasa de cambio
      const tasa = await getTasaCambio(user.uid);
      
      setStats({
        totalProductos,
        totalMateriaPrima,
        totalListoVenta,
        tasaCambio: tasa?.valorCompra || 24.50,
        monedaLocal: tasa?.monedaLocal || 'Peso',
      });
    } catch (error) {
      showToast({ message: 'Error al cargar el dashboard', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const metrics = [
    {
      title: 'Productos Totales',
      value: stats.totalProductos,
      change: '+0%',
      trend: 'up' as const,
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Materia Prima',
      value: stats.totalMateriaPrima,
      change: '+0%',
      trend: 'up' as const,
      icon: ShoppingCart,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    {
      title: 'Listo para Venta',
      value: stats.totalListoVenta,
      change: '+0%',
      trend: 'up' as const,
      icon: Package,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: `Tasa de Cambio (USD → ${stats.monedaLocal})`,
      value: stats.tasaCambio.toFixed(2),
      change: '+0%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          📊 Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Resumen de tu negocio
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-lg ${metric.bg}`}>
                  <Icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change}
                  {metric.trend === 'up' ? (
                    <ArrowUp className="inline w-3 h-3 ml-1" />
                  ) : (
                    <ArrowDown className="inline w-3 h-3 ml-1" />
                  )}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                {metric.value}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{metric.title}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            📈 Tendencias
          </h2>
          <div className="h-64 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900/10 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <TrendingUp size={40} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Gráfico interactivo en desarrollo</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              🚀 Acciones Rápidas
            </h2>
          </div>
          <div className="space-y-3">
            <button className="w-full p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-blue-600 dark:text-blue-400 text-sm font-medium">
              + Agregar Producto
            </button>
            <button className="w-full p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors text-purple-600 dark:text-purple-400 text-sm font-medium">
              + Crear Ficha de Costo
            </button>
            <button className="w-full p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors text-green-600 dark:text-green-400 text-sm font-medium">
              💱 Actualizar Tasa de Cambio
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}