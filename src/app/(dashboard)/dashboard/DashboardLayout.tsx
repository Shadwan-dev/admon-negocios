'use client';

import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Package, 
  DollarSign, 
  ShoppingCart,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const metrics = [
  {
    title: 'Ventas Totales',
    value: '$12,458',
    change: '+12.5%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-green-600',
    bg: 'bg-green-50'
  },
  {
    title: 'Productos Activos',
    value: '156',
    change: '+4.3%',
    trend: 'up',
    icon: Package,
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    title: 'Margen Promedio',
    value: '34%',
    change: '-2.1%',
    trend: 'down',
    icon: DollarSign,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50'
  },
  {
    title: 'Órdenes Pendientes',
    value: '89',
    change: '+18%',
    trend: 'up',
    icon: ShoppingCart,
    color: 'text-purple-600',
    bg: 'bg-purple-50'
  }
];

export default function DashboardPage() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          📊 Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Resumen de tu negocio
        </p>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${metric.bg}`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
              <span className={`text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
                {metric.trend === 'up' ? <ArrowUp className="inline w-4 h-4 ml-1" /> : <ArrowDown className="inline w-4 h-4 ml-1" />}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {metric.value}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{metric.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Gráfico placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          📈 Tendencias de Ventas
        </h2>
        <div className="h-64 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900/20 rounded-lg flex items-center justify-center">
          <p className="text-gray-400">Gráfico interactivo aquí</p>
        </div>
      </div>
    </div>
  );
}