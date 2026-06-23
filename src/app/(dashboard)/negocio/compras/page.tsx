'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Truck,
  Calendar,
  DollarSign,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../../../../hooks/useAuth';
import { 
  getCompras, 
  crearCompra, 
  actualizarEstadoCompra,
  eliminarCompra,
  Compra 
} from '../../../../../lib/firebase/compras';
import { getProveedores } from '../../../../../lib/firebase/proveedores';
import { getProductos } from '../../../../../lib/firebase/productos';
import { showToast } from '../../../providers';

// Modal para crear compra
function CompraModal({ 
  isOpen, 
  onClose, 
  onSave, 
  proveedores,
  productos,
  loading 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (data: any) => void; 
  proveedores: any[];
  productos: any[];
  loading: boolean;
}) {
  const [formData, setFormData] = useState({
    proveedor: '',
    proveedorId: '',
    items: [{ productoId: '', cantidad: 1, precio: 0 }],
    fecha: new Date().toISOString().split('T')[0],
    notas: '',
  });

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
            Nueva Compra
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
              Proveedor *
            </label>
            <select
              value={formData.proveedorId}
              onChange={(e) => {
                const proveedor = proveedores.find(p => p.id === e.target.value);
                setFormData({
                  ...formData,
                  proveedorId: e.target.value,
                  proveedor: proveedor?.nombre || ''
                });
              }}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
            >
              <option value="">Seleccionar proveedor</option>
              {proveedores.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fecha
            </label>
            <input
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
            />
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
                  className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
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
                  className="w-20 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                  min="1"
                />
                <input
                  type="number"
                  step="0.01"
                  value={item.precio}
                  onChange={(e) => handleItemChange(index, 'precio', parseFloat(e.target.value) || 0)}
                  className="w-24 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
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
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              + Agregar producto
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notas
            </label>
            <textarea
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none resize-none"
              rows={2}
              placeholder="Instrucciones adicionales"
            />
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
              estado: 'pendiente'
            })}
            disabled={loading || !formData.proveedorId || formData.items.every(i => !i.productoId)}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
            Crear Compra
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function ComprasPage() {
  const { user } = useAuth();
  const [compras, setCompras] = useState<Compra[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);
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
      const [comprasData, proveedoresData, productosData] = await Promise.all([
        getCompras(user.uid),
        getProveedores(user.uid),
        getProductos(user.uid)
      ]);
      setCompras(comprasData);
      setProveedores(proveedoresData);
      setProductos(productosData);
    } catch (error) {
      showToast({ message: 'Error al cargar datos', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCrearCompra = async (data: any) => {
    if (!user) return;
    setSaving(true);
    try {
      const result = await crearCompra(user.uid, {
        uid: user.uid,
        ...data
      });
      if (result.success) {
        showToast({ message: '✅ Compra registrada correctamente', type: 'success' });
        setModalOpen(false);
        await cargarDatos();
      } else {
        showToast({ message: result.error || 'Error al registrar compra', type: 'error' });
      }
    } catch (error) {
      showToast({ message: 'Error al registrar compra', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleCambiarEstado = async (compraId: string, estado: 'recibido' | 'pendiente' | 'cancelado') => {
    if (!user) return;
    try {
      const result = await actualizarEstadoCompra(user.uid, compraId, estado);
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

  const handleEliminarCompra = async (compraId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta compra?')) return;
    
    try {
      const result = await eliminarCompra(user!.uid, compraId);
      if (result.success) {
        showToast({ message: '✅ Compra eliminada correctamente', type: 'success' });
        await cargarDatos();
      } else {
        showToast({ message: result.error || 'Error al eliminar compra', type: 'error' });
      }
    } catch (error) {
      showToast({ message: 'Error al eliminar compra', type: 'error' });
    }
  };

  const filteredCompras = compras.filter(c => 
    c.proveedor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id?.includes(searchTerm)
  );

  const totalCompras = compras.reduce((sum, c) => sum + c.total, 0);
  const recibidas = compras.filter(c => c.estado === 'recibido').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando compras...</p>
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
            🛒 Compras
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Registro de compras a proveedores
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
          <Plus size={20} />
          Nueva Compra
        </button>
      </motion.div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <ShoppingBag size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Compras</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">{compras.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Recibidas</p>
              <p className="text-xl font-bold text-green-600">{recibidas}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <DollarSign size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Gastado</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">${totalCompras.toFixed(2)}</p>
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
            placeholder="Buscar compras por proveedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {filteredCompras.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <ShoppingBag size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No hay compras registradas</p>
            <p className="text-sm mt-1">Registra tu primera compra desde el botón "Nueva Compra"</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Compra #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Proveedor
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
                {filteredCompras.map((compra, index) => (
                  <motion.tr
                    key={compra.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800 dark:text-white">
                      #{compra.id?.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-white">
                      <div className="flex items-center gap-2">
                        <Truck size={16} className="text-gray-400" />
                        {compra.proveedor}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                      {compra.fecha}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-white">
                      {compra.items?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800 dark:text-white">
                      ${compra.total?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${
                        compra.estado === 'recibido' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : compra.estado === 'pendiente'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {compra.estado === 'recibido' ? <CheckCircle size={14} /> :
                         compra.estado === 'pendiente' ? <Clock size={14} /> :
                         <AlertCircle size={14} />}
                        {compra.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {compra.estado === 'pendiente' && (
                        <button
                          onClick={() => compra.id && handleCambiarEstado(compra.id, 'recibido')}
                          className="p-1 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg text-green-600 transition-colors mr-2"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      {compra.estado === 'recibido' && (
                        <button
                          onClick={() => compra.id && handleCambiarEstado(compra.id, 'pendiente')}
                          className="p-1 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg text-yellow-600 transition-colors mr-2"
                        >
                          <Clock size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => compra.id && handleEliminarCompra(compra.id)}
                        className="p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <CompraModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleCrearCompra}
        proveedores={proveedores}
        productos={productos}
        loading={saving}
      />
    </div>
  );
}