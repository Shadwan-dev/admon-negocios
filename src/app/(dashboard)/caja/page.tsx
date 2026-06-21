'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Calendar,
  Download,
  Printer,
  Plus
} from 'lucide-react';

export default function CajaPage() {
  const [periodo, setPeriodo] = useState('hoy');

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            💵 Caja / Finanzas
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Cierres de caja, arqueo y balances
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg">
            <Plus size={20} />
            Nuevo Cierre
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
            <Download size={20} />
            Exportar
          </button>
        </div>
      </motion.div>

      {/* Resumen de caja */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Saldo Actual</p>
          <p className="text-2xl font-bold text-green-600">$5,234.50</p>
          <p className="text-xs text-gray-400">Actualizado: Hoy 14:30</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Ingresos (Hoy)</p>
          <p className="text-2xl font-bold text-blue-600">$1,245.00</p>
          <p className="text-xs text-green-500">↑ 12% vs ayer</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Egresos (Hoy)</p>
          <p className="text-2xl font-bold text-red-600">$450.00</p>
          <p className="text-xs text-red-500">↓ 5% vs ayer</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Balance del Día</p>
          <p className="text-2xl font-bold text-purple-600">$795.00</p>
          <p className="text-xs text-green-500">Positivo</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          {['hoy', 'semana', 'mes', 'trimestre', 'año'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                periodo === p
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {p === 'hoy' ? 'Hoy' : 
               p === 'semana' ? 'Semana' :
               p === 'mes' ? 'Mes' :
               p === 'trimestre' ? 'Trimestre' : 'Año'}
            </button>
          ))}
        </div>
      </div>

      {/* Movimientos */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-800 dark:text-white">Últimos Movimientos</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${index % 2 === 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                  {index % 2 === 0 ? (
                    <TrendingUp size={20} className="text-green-600" />
                  ) : (
                    <TrendingDown size={20} className="text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {index % 2 === 0 ? 'Venta #1234' : 'Compra #5678'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {index % 2 === 0 ? 'Cliente: Juan Pérez' : 'Proveedor: Distribuidora XYZ'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${index % 2 === 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {index % 2 === 0 ? '+' : '-'}${(Math.random() * 100 + 50).toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">Hace {index + 1} horas</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}