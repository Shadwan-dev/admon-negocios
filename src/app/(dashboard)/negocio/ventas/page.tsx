'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Plus, 
  Search, 
  TrendingUp,
  ShoppingCart,
  Calendar,
  Download,
  Printer,
  Users,
  Eye,
  X,
  Loader2,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../../../../hooks/useAuth';
import { getVentas, crearVenta, Venta, actualizarEstadoVenta } from '../../../../../lib/firebase/ventas';
import { getProductos } from '../../../../../lib/firebase/productos';
import { showToast } from '../../../providers';

// Modal para crear venta
function VentaModal({ 
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
    cliente: '',
    items: [{ productoId: '', cantidad: 1, precio: 0 }],
    metodoPago: 'efectivo',
  });

  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productoId: '', cantidad: 1, precio: 0 }]
    });
  };

  const handleRemoveItem = (index: number) => {
    if (formData.items.length === 1) return;
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Si se selecciona un producto, actualizar precio
    if (field === 'productoId') {
      const product = productos.find(p => p.id === value);
      if (product) {
        newItems[index].precio = product.precioUSD || 0;
      }
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const calcularTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.cantidad * item.precio), 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            Nueva Venta
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
              Cliente
            </label>
            <input
              type="text"
              value={formData.cliente}
              onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Nombre del cliente"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Método de Pago
            </label>
            <select
              value={formData.metodoPago}
              onChange={(e) => setFormData({ ...formData, metodoPago: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
              <option value="credito">Crédito</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Productos
            </label>
            {formData.items.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <select
                  value={item.productoId}
                  onChange={(e) => handleItemChange(index, 'productoId', e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Seleccionar producto</option>
                  {productos.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={item.cantidad}
                  onChange={(e) => handleItemChange(index, 'cantidad', parseInt(e.target.value) || 1)}
                  className="w-20 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  min="1"
                />
                <input
                  type="number"
                  step="0.01"
                  value={item.precio}
                  onChange={(e) => handleItemChange(index, 'precio', parseFloat(e.target.value) || 0)}
                  className="w-24 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg text-red-600"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
            <button
              onClick={handleAddItem}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + Agregar producto
            </button>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total:</span>
              <span className="text-xl font-bold text-gray-800 dark:text-white">
                ${calcularTotal().toFixed(2)}
              </span>
            </div>
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
            onClick={() => onSave({
              ...formData,
              total: calcularTotal(),
              fecha: new Date().toISOString().split('T')[0],
              estado: 'completada'
            })}
            disabled={loading || formData.items.every(i => !i.productoId)}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
            Completar Venta
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function VentasPage() {
  const { user } = useAuth();
  const [ventas, setVentas] = useState<Venta[]>([]);
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
      const [ventasData, productosData] = await Promise.all([
        getVentas(user.uid),
        getProductos(user.uid)
      ]);
      setVentas(ventasData);
      setProductos(productosData);
    } catch (error) {
      showToast({ message: 'Error al cargar datos', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCrearVenta = async (data: any) => {
    if (!user) return;
    setSaving(true);
    try {
      const result = await crearVenta(user.uid, {
        uid: user.uid,
        ...data
      });
      if (result.success) {
        showToast({ message: '✅ Venta registrada correctamente', type: 'success' });
        setModalOpen(false);
        await cargarDatos();
      } else {
        showToast({ message: result.error || 'Error al registrar venta', type: 'error' });
      }
    } catch (error) {
      showToast({ message: 'Error al registrar venta', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleCambiarEstado = async (ventaId: string, estado: string) => {
    if (!user) return;
    try {
      const result = await actualizarEstadoVenta(user.uid, ventaId, estado as any);
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
  const totalVentas = ventas.filter(v => v.estado === 'completada').reduce((sum, v) => sum + v.total, 0);
  const cantidadVentas = ventas.filter(v => v.estado === 'completada').length;

  const filteredVentas = ventas.filter(v => 
    v.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.id?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando ventas...</p>
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
            💰 Ventas
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestión de ventas y clientes
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            <Plus size={20} />
            Nueva Venta
          </button>
        </div>
      </motion.div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <DollarSign size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ventas Totales</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">${totalVentas.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <ShoppingCart size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Ventas</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">{cantidadVentas}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Users size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Clientes</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">
                {new Set(ventas.map(v => v.cliente)).size}
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
            placeholder="Buscar ventas por cliente o número..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {filteredVentas.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <ShoppingCart size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No hay ventas registradas</p>
            <p className="text-sm mt-1">Registra tu primera venta desde el botón "Nueva Venta"</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Venta #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total
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
                {filteredVentas.map((venta, index) => (
                  <motion.tr
                    key={venta.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800 dark:text-white">
                      #{venta.id?.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-white">
                      {venta.cliente || 'Cliente general'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                      {venta.fecha}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-white">
                      {venta.items?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800 dark:text-white">
                      ${venta.total?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${
                        venta.estado === 'completada' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : venta.estado === 'pendiente'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {venta.estado === 'completada' ? <CheckCircle size={14} /> :
                         venta.estado === 'pendiente' ? <Clock size={14} /> :
                         <AlertCircle size={14} />}
                        {venta.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {venta.estado === 'completada' && (
                        <button
                          onClick={() => venta.id && handleCambiarEstado(venta.id, 'pendiente')}
                          className="p-1 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg text-yellow-600 transition-colors mr-2"
                        >
                          <Clock size={18} />
                        </button>
                      )}
                      {venta.estado === 'pendiente' && (
                        <button
                          onClick={() => venta.id && handleCambiarEstado(venta.id, 'completada')}
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
      <VentaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleCrearVenta}
        productos={productos}
        loading={saving}
      />
    </div>
  );
}