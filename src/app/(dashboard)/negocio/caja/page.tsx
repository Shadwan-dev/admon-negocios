'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Plus, 
  Search, 
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Printer,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  X,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../../../../hooks/useAuth';
import { 
  getMovimientosCaja, 
  crearMovimientoCaja, 
  actualizarEstadoMovimiento,
  getResumenCaja,
  MovimientoCaja 
} from '../../../../../lib/firebase/caja';
import { showToast } from '../../../providers';

// Modal para crear movimiento
function MovimientoModal({ 
  isOpen, 
  onClose, 
  onSave, 
  loading 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (data: any) => void; 
  loading: boolean;
}) {
  const [formData, setFormData] = useState({
    tipo: 'ingreso',
    concepto: '',
    monto: 0,
    categoria: '',
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            Nuevo Movimiento
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipo
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFormData({ ...formData, tipo: 'ingreso' })}
                className={`p-3 rounded-xl border-2 transition-all ${
                  formData.tipo === 'ingreso'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <ArrowUp size={20} className={`mx-auto ${formData.tipo === 'ingreso' ? 'text-green-600' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">Ingreso</span>
              </button>
              <button
                onClick={() => setFormData({ ...formData, tipo: 'egreso' })}
                className={`p-3 rounded-xl border-2 transition-all ${
                  formData.tipo === 'egreso'
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <ArrowDown size={20} className={`mx-auto ${formData.tipo === 'egreso' ? 'text-red-600' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">Egreso</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Concepto *
            </label>
            <input
              type="text"
              value={formData.concepto}
              onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej: Venta, Compra..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Monto *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.monto}
              onChange={(e) => setFormData({ ...formData, monto: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Categoría
            </label>
            <select
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Seleccionar categoría</option>
              <option value="ventas">Ventas</option>
              <option value="compras">Compras</option>
              <option value="gastos">Gastos</option>
              <option value="servicios">Servicios</option>
              <option value="otros">Otros</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(formData)}
            disabled={loading || !formData.concepto || !formData.monto}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
            Guardar
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function CajaPage() {
  const { user } = useAuth();
  const [movimientos, setMovimientos] = useState<MovimientoCaja[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resumen, setResumen] = useState({ ingresos: 0, egresos: 0, balance: 0 });

  useEffect(() => {
    if (user) {
      cargarDatos();
    }
  }, [user]);

  const cargarDatos = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [movimientosData, resumenData] = await Promise.all([
        getMovimientosCaja(user.uid),
        getResumenCaja(user.uid)
      ]);
      setMovimientos(movimientosData);
      setResumen(resumenData);
    } catch (error) {
      showToast({ message: 'Error al cargar datos', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCrearMovimiento = async (data: any) => {
    if (!user) return;
    setSaving(true);
    try {
      const result = await crearMovimientoCaja(user.uid, {
        uid: user.uid,
        ...data,
        fecha: new Date().toISOString().split('T')[0],
        estado: 'completado'
      });
      if (result.success) {
        showToast({ message: '✅ Movimiento registrado correctamente', type: 'success' });
        setModalOpen(false);
        await cargarDatos();
      } else {
        showToast({ message: result.error || 'Error al registrar movimiento', type: 'error' });
      }
    } catch (error) {
      showToast({ message: 'Error al registrar movimiento', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleCambiarEstado = async (movimientoId: string, estado: 'completado' | 'pendiente' | 'cancelado') => {
    if (!user) return;
    try {
      const result = await actualizarEstadoMovimiento(user.uid, movimientoId, estado);
      if (result.success) {
        showToast({ message: '✅ Estado actualizado', type: 'success' });
        await cargarDatos();
      } else {
        showToast({ message: result.error || 'Error al actualizar estado', type: 'error' });
      }
    } catch (error) {
      showToast({ message: 'Error al actualizar estado', type: 'error' });
    }
  };

  const filteredMovimientos = movimientos.filter(m => 
    m.concepto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando movimientos...</p>
        </div>
      </div>
    );
  }

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
            💵 Caja
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Control de ingresos y egresos
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            <Plus size={20} />
            Nuevo Movimiento
          </button>
        </div>
      </motion.div>

      {/* Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <ArrowUp size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ingresos</p>
              <p className="text-xl font-bold text-green-600">${resumen.ingresos.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <ArrowDown size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Egresos</p>
              <p className="text-xl font-bold text-red-600">${resumen.egresos.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${resumen.balance >= 0 ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-red-100 dark:bg-red-900/30'} rounded-lg`}>
              <DollarSign size={20} className={resumen.balance >= 0 ? 'text-blue-600' : 'text-red-600'} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Balance</p>
              <p className={`text-xl font-bold ${resumen.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                ${resumen.balance.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar movimientos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {filteredMovimientos.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <DollarSign size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No hay movimientos registrados</p>
            <p className="text-sm mt-1">Registra tu primer movimiento desde el botón "Nuevo Movimiento"</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Concepto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMovimientos.map((mov, index) => (
                  <motion.tr
                    key={mov.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${mov.tipo === 'ingreso' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {mov.tipo === 'ingreso' ? '💰 Ingreso' : '💸 Egreso'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-white">
                      {mov.concepto}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                      {mov.categoria || '-'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap font-medium ${mov.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'}`}>
                      {mov.tipo === 'ingreso' ? '+' : '-'}${mov.monto.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                      {mov.fecha}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${
                        mov.estado === 'completado' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : mov.estado === 'pendiente'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {mov.estado === 'completado' ? <CheckCircle size={14} /> :
                         mov.estado === 'pendiente' ? <Clock size={14} /> :
                         <AlertCircle size={14} />}
                        {mov.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {mov.estado === 'completado' && (
                        <button
                          onClick={() => mov.id && handleCambiarEstado(mov.id, 'pendiente')}
                          className="p-1 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg text-yellow-600 transition-colors mr-2"
                        >
                          <Clock size={18} />
                        </button>
                      )}
                      {mov.estado === 'pendiente' && (
                        <button
                          onClick={() => mov.id && handleCambiarEstado(mov.id, 'completado')}
                          className="p-1 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg text-green-600 transition-colors mr-2"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <MovimientoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleCrearMovimiento}
        loading={saving}
      />
    </div>
  );
}