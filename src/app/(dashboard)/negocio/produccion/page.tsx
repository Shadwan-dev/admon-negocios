'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Factory, 
  Plus, 
  Search, 
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  X,
  Loader2,
  Calendar,
  Package,
  Users
} from 'lucide-react';
import { useAuth } from '../../../../../hooks/useAuth';
import { 
  getOrdenesProduccion, 
  crearOrdenProduccion, 
  actualizarEstadoOrden,
  OrdenProduccion 
} from '../../../../../lib/firebase/produccion';
import { getProductos } from '../../../../../lib/firebase/productos';
import { showToast } from '../../../providers';

// Modal para crear orden
function OrdenModal({ 
  isOpen, 
  onClose, 
  onSave, 
  productos,
  loading 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (data: any) => void; 
  productos: any[];
  loading: boolean;
}) {
  const [formData, setFormData] = useState({
    producto: '',
    productoId: '',
    cantidad: 1,
    fecha: new Date().toISOString().split('T')[0],
    notas: '',
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
            Nueva Orden de Producción
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
              Producto *
            </label>
            <select
              value={formData.productoId}
              onChange={(e) => {
                const producto = productos.find(p => p.id === e.target.value);
                setFormData({
                  ...formData,
                  productoId: e.target.value,
                  producto: producto?.nombre || ''
                });
              }}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="">Seleccionar producto</option>
              {productos.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cantidad *
            </label>
            <input
              type="number"
              value={formData.cantidad}
              onChange={(e) => setFormData({ ...formData, cantidad: parseInt(e.target.value) || 1 })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fecha
            </label>
            <input
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notas
            </label>
            <textarea
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none resize-none"
              rows={2}
              placeholder="Instrucciones adicionales"
            />
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
            disabled={loading || !formData.productoId}
            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
            Crear Orden
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProduccionPage() {
  const { user } = useAuth();
  const [ordenes, setOrdenes] = useState<OrdenProduccion[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      cargarDatos();
    }
  }, [user]);

  const cargarDatos = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [ordenesData, productosData] = await Promise.all([
        getOrdenesProduccion(user.uid),
        getProductos(user.uid)
      ]);
      setOrdenes(ordenesData);
      setProductos(productosData);
    } catch (error) {
      showToast({ message: 'Error al cargar datos', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCrearOrden = async (data: any) => {
    if (!user) return;
    setSaving(true);
    try {
      const result = await crearOrdenProduccion(user.uid, {
        uid: user.uid,
        ...data,
        estado: 'pendiente'
      });
      if (result.success) {
        showToast({ message: '✅ Orden creada correctamente', type: 'success' });
        setModalOpen(false);
        await cargarDatos();
      } else {
        showToast({ message: result.error || 'Error al crear orden', type: 'error' });
      }
    } catch (error) {
      showToast({ message: 'Error al crear orden', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleCambiarEstado = async (ordenId: string, estado: 'completada' | 'en_progreso' | 'pendiente' | 'cancelada') => {
    if (!user) return;
    try {
      const result = await actualizarEstadoOrden(user.uid, ordenId, estado);
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

  // Estadísticas
  const totalOrdenes = ordenes.length;
  const completadas = ordenes.filter(o => o.estado === 'completada').length;
  const pendientes = ordenes.filter(o => o.estado === 'pendiente' || o.estado === 'en_progreso').length;

  const filteredOrdenes = ordenes.filter(o => 
    o.producto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.id?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando órdenes...</p>
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
            🏭 Producción
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestión de órdenes de producción
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
          <Plus size={20} />
          Nueva Orden
        </button>
      </motion.div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Factory size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Órdenes Totales</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">{totalOrdenes}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completadas</p>
              <p className="text-xl font-bold text-green-600">{completadas}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pendientes</p>
              <p className="text-xl font-bold text-yellow-600">{pendientes}</p>
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
            placeholder="Buscar órdenes de producción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {filteredOrdenes.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <Factory size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No hay órdenes de producción</p>
            <p className="text-sm mt-1">Crea tu primera orden desde el botón "Nueva Orden"</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Orden #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Cantidad
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
                {filteredOrdenes.map((orden, index) => (
                  <motion.tr
                    key={orden.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800 dark:text-white">
                      #{orden.id?.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-white">
                      {orden.producto}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-white">
                      {orden.cantidad}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                      {orden.fecha}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${
                        orden.estado === 'completada' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : orden.estado === 'en_progreso'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : orden.estado === 'pendiente'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {orden.estado === 'completada' ? <CheckCircle size={14} /> :
                         orden.estado === 'en_progreso' ? <Clock size={14} /> :
                         <AlertCircle size={14} />}
                        {orden.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {orden.estado === 'pendiente' && (
                        <button
                          onClick={() => orden.id && handleCambiarEstado(orden.id, 'en_progreso')}
                          className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg text-blue-600 transition-colors mr-2"
                        >
                          <Clock size={18} />
                        </button>
                      )}
                      {orden.estado === 'en_progreso' && (
                        <button
                          onClick={() => orden.id && handleCambiarEstado(orden.id, 'completada')}
                          className="p-1 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg text-green-600 transition-colors mr-2"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      {orden.estado === 'completada' && (
                        <button
                          onClick={() => orden.id && handleCambiarEstado(orden.id, 'pendiente')}
                          className="p-1 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg text-yellow-600 transition-colors mr-2"
                        >
                          <Clock size={18} />
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
      <OrdenModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleCrearOrden}
        productos={productos}
        loading={saving}
      />
    </div>
  );
}