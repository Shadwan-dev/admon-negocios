'use client';

import { useState, useEffect } from 'react';
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
  Users,
  Loader2,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '../../../../../hooks/useAuth';
import { getVentas } from '../../../../../lib/firebase/ventas';
import { getProductos } from '../../../../../lib/firebase/productos';
import { getClientes } from '../../../../../lib/firebase/clientes';
import { getMovimientosCaja } from '../../../../../lib/firebase/caja';
import { showToast } from '../../../providers';

export default function ReportesPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [ventas, setVentas] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [caja, setCaja] = useState<any[]>([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [tipoReporte, setTipoReporte] = useState('ventas');

  useEffect(() => {
    if (user) {
      cargarDatos();
    }
  }, [user]);

  const cargarDatos = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [ventasData, productosData, clientesData, cajaData] = await Promise.all([
        getVentas(user.uid),
        getProductos(user.uid),
        getClientes(user.uid),
        getMovimientosCaja(user.uid)
      ]);
      setVentas(ventasData);
      setProductos(productosData);
      setClientes(clientesData);
      setCaja(cajaData);
    } catch (error) {
      showToast({ message: 'Error al cargar datos', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Calcular estadísticas
  const totalVentas = ventas.filter(v => v.estado === 'completada').reduce((sum, v) => sum + v.total, 0);
  const totalProductos = productos.length;
  const totalClientes = clientes.length;
  const totalIngresos = caja.filter(m => m.tipo === 'ingreso' && m.estado === 'completado').reduce((sum, m) => sum + m.monto, 0);

  // Reportes disponibles
  const reportes = [
    { 
      id: 'ventas', 
      nombre: '💰 Reporte de Ventas', 
      descripcion: 'Ventas por período, cliente y producto',
      icono: <DollarSign size={20} />,
      estadisticas: `$${totalVentas.toFixed(2)} | ${ventas.filter(v => v.estado === 'completada').length} ventas`
    },
    { 
      id: 'inventario', 
      nombre: '📦 Reporte de Inventario', 
      descripcion: 'Stock, productos con bajo inventario',
      icono: <Package size={20} />,
      estadisticas: `${totalProductos} productos | ${productos.filter(p => (p.stock || 0) < 10).length} con stock bajo`
    },
    { 
      id: 'clientes', 
      nombre: '👤 Reporte de Clientes', 
      descripcion: 'Clientes frecuentes y ventas por cliente',
      icono: <Users size={20} />,
      estadisticas: `${totalClientes} clientes`
    },
    { 
      id: 'caja', 
      nombre: '💵 Reporte de Caja', 
      descripcion: 'Ingresos, egresos y balances',
      icono: <BarChart size={20} />,
      estadisticas: `$${totalIngresos.toFixed(2)} ingresos | ${caja.filter(m => m.tipo === 'egreso' && m.estado === 'completado').reduce((s, m) => s + m.monto, 0).toFixed(2)} egresos`
    },
  ];

  const handleGenerarReporte = () => {
    showToast({ 
      message: `📊 Generando reporte de ${tipoReporte}...`, 
      type: 'info' 
    });
    // Aquí iría la lógica de generación
  };

  const handleExportar = () => {
    showToast({ message: '📥 Exportando reporte...', type: 'info' });
  };

  const handleImprimir = () => {
    showToast({ message: '🖨️ Enviando a impresión...', type: 'info' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando datos...</p>
        </div>
      </div>
    );
  }

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipo de Reporte
            </label>
            <select
              value={tipoReporte}
              onChange={(e) => setTipoReporte(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {reportes.map(r => (
                <option key={r.id} value={r.id}>{r.nombre}</option>
              ))}
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
          <div className="flex items-end gap-2">
            <button
              onClick={handleGenerarReporte}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors w-full"
            >
              <Filter size={18} />
              Generar
            </button>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleExportar}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <Download size={18} />
            Exportar
          </button>
          <button
            onClick={handleImprimir}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <Printer size={18} />
            Imprimir
          </button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Ventas Totales</p>
          <p className="text-xl font-bold text-blue-600">${totalVentas.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Productos</p>
          <p className="text-xl font-bold text-green-600">{totalProductos}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Clientes</p>
          <p className="text-xl font-bold text-purple-600">{totalClientes}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Ingresos</p>
          <p className="text-xl font-bold text-green-600">${totalIngresos.toFixed(2)}</p>
        </div>
      </div>

      {/* Lista de reportes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportes.map((reporte) => (
          <motion.div
            key={reporte.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02] ${
              tipoReporte === reporte.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setTipoReporte(reporte.id)}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${
                tipoReporte === reporte.id 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}>
                {reporte.icono}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {reporte.nombre}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {reporte.descripcion}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  {reporte.estadisticas}
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTipoReporte(reporte.id);
                      handleGenerarReporte();
                    }}
                    className="text-xs px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Generar
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      showToast({ message: `📄 Vista previa de ${reporte.nombre}`, type: 'info' });
                    }}
                    className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Ver muestra
                  </button>
                </div>
              </div>
              {tipoReporte === reporte.id && (
                <div className="w-2 h-2 rounded-full bg-blue-600" />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Resumen del reporte seleccionado */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <FileText size={18} className="text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-800 dark:text-white">
              Reporte seleccionado: {reportes.find(r => r.id === tipoReporte)?.nombre}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Haz clic en "Generar" para obtener el reporte completo con los filtros aplicados.
              {fechaInicio && fechaFin && ` Período: ${fechaInicio} - ${fechaFin}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}