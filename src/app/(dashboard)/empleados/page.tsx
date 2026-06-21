'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Download, 
  Printer,
  FileText,
  BarChart,
  PieChart,
  Calendar,
  Filter,
  DollarSign,
  Package,
  Users
} from 'lucide-react';

export default function ReportesPage() {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [tipoReporte, setTipoReporte] = useState('ventas');

  const reportes = [
    { id: 1, nombre: 'Reporte de Ventas', descripcion: 'Ventas por período, cliente y producto', icono: <DollarSign size={20} /> },
    { id: 2, nombre: 'Reporte de Inventario', descripcion: 'Stock, productos con bajo inventario', icono: <Package size={20} /> },
    { id: 3, nombre: 'Reporte de Empleados', descripcion: 'Nómina, asistencia, descuentos', icono: <Users size={20} /> },
    { id: 4, nombre: 'Reporte de Caja', descripcion: 'Cierres, arqueos, balances diarios', icono: <BarChart size={20} /> },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            📊 Reportes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Generación de reportes y estadísticas
          </p>
        </div>
      </motion.div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipo de Reporte
            </label>
            <select
              value={tipoReporte}
              onChange={(e) => setTipoReporte(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="ventas">Ventas</option>
              <option value="inventario">Inventario</option>
              <option value="empleados">Empleados</option>
              <option value="caja">Caja</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fecha Fin
            </label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Filter size={18} />
            Generar Reporte
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
            <Download size={18} />
            Exportar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
            <Printer size={18} />
            Imprimir
          </button>
        </div>
      </div>

      {/* Lista de reportes disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportes.map((reporte) => (
          <motion.div
            key={reporte.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600">
                {reporte.icono}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {reporte.nombre}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {reporte.descripcion}
                </p>
                <div className="flex gap-2 mt-3">
                  <button className="text-xs px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Generar
                  </button>
                  <button className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 transition-colors">
                    Ver muestra
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}