'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  AlertCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Filter,
  X,
  Check,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../../../hooks/useAuth';
import { 
  getProductos, 
  crearProducto, 
  actualizarProducto, 
  eliminarProducto,
  Producto 
} from '../../../../lib/firebase/productos';
import { getTasaCambio } from '../../../../lib/firebase/tasaCambio';
import { showToast } from '../../providers';
import { Button } from '../../components/ui/Button';

// Modal para crear/editar producto
function ProductoModal({ 
  isOpen, 
  onClose, 
  onSave, 
  producto, 
  loading 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (data: any) => void; 
  producto?: Producto | null;
  loading: boolean;
}) {
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: 'materia_prima',
    precioUSD: 0,
    stock: 0,
    unidad: 'unidad',
    descripcion: '',
  });

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre || '',
        categoria: producto.categoria || 'materia_prima',
        precioUSD: producto.precioUSD || 0,
        stock: producto.stock || 0,
        unidad: producto.unidad || 'unidad',
        descripcion: producto.descripcion || '',
      });
    } else {
      setFormData({
        nombre: '',
        categoria: 'materia_prima',
        precioUSD: 0,
        stock: 0,
        unidad: 'unidad',
        descripcion: '',
      });
    }
  }, [producto, isOpen]);

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
            {producto ? 'Editar Producto' : 'Nuevo Producto'}
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
              Nombre *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Nombre del producto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Categoría
            </label>
            <select
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="materia_prima">Materia Prima</option>
              <option value="listo_venta">Listo para Venta</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Precio (USD)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.precioUSD}
                onChange={(e) => setFormData({ ...formData, precioUSD: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Stock
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Unidad
            </label>
            <select
              value={formData.unidad}
              onChange={(e) => setFormData({ ...formData, unidad: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="kg">Kilogramo (kg)</option>
              <option value="litro">Litro (L)</option>
              <option value="unidad">Unidad</option>
              <option value="lb">Libra (lb)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              rows={2}
              placeholder="Descripción opcional"
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
            disabled={loading || !formData.nombre.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
            {producto ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function InventarioPage() {
  const { user } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState<string>('todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
  const [saving, setSaving] = useState(false);
  const [tasaCambio, setTasaCambio] = useState<number>(24.50);

  useEffect(() => {
    if (user) {
      cargarDatos();
    }
  }, [user]);

  const cargarDatos = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [productosData, tasaData] = await Promise.all([
        getProductos(user.uid),
        getTasaCambio(user.uid)
      ]);
      setProductos(productosData);
      if (tasaData) {
        setTasaCambio(tasaData.valorCompra);
      }
    } catch (error) {
      showToast({ message: 'Error al cargar datos', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCrearProducto = async (data: any) => {
    if (!user) return;
    setSaving(true);
    try {
      const result = await crearProducto({
        uid: user.uid,
        ...data,
        precioLocal: data.precioUSD * tasaCambio,
        monedaCompra: 'USD'
      });
      if (result.success) {
        showToast({ message: '✅ Producto creado correctamente', type: 'success' });
        setModalOpen(false);
        await cargarDatos();
      } else {
        showToast({ message: result.error || 'Error al crear producto', type: 'error' });
      }
    } catch (error) {
      showToast({ message: 'Error al crear producto', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleEditarProducto = async (data: any) => {
    if (!user || !editingProducto?.id) return;
    setSaving(true);
    try {
      const result = await actualizarProducto(editingProducto.id, {
        ...data,
        precioLocal: data.precioUSD * tasaCambio
      });
      if (result.success) {
        showToast({ message: '✅ Producto actualizado correctamente', type: 'success' });
        setModalOpen(false);
        setEditingProducto(null);
        await cargarDatos();
      } else {
        showToast({ message: result.error || 'Error al actualizar producto', type: 'error' });
      }
    } catch (error) {
      showToast({ message: 'Error al actualizar producto', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleEliminarProducto = async (productoId: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
      const result = await eliminarProducto(productoId);
      if (result.success) {
        showToast({ message: '✅ Producto eliminado correctamente', type: 'success' });
        await cargarDatos();
      } else {
        showToast({ message: result.error || 'Error al eliminar producto', type: 'error' });
      }
    } catch (error) {
      showToast({ message: 'Error al eliminar producto', type: 'error' });
    }
  };

  // Filtrar productos
  const filteredProducts = productos.filter(p => {
    const matchesSearch = p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategoria === 'todos' || p.categoria === filterCategoria;
    return matchesSearch && matchesFilter;
  });

  // Estadísticas
  const totalProductos = productos.length;
  const valorTotal = productos.reduce((sum, p) => sum + (p.precioUSD || 0), 0);
  const productosBajoStock = productos.filter(p => (p.stock || 0) < 10).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando inventario...</p>
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
            📦 Inventario
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Control de stock y productos {tasaCambio && `• 1 USD = ${tasaCambio.toFixed(2)}`}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setEditingProducto(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            <Plus size={20} />
            Nuevo Producto
          </button>
          <button 
            onClick={cargarDatos}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </motion.div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Package size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Productos</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">{totalProductos}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Valor Total (USD)</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">${valorTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertCircle size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Stock Bajo</p>
              <p className="text-xl font-bold text-red-600">{productosBajoStock}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex gap-2">
            {['todos', 'materia_prima', 'listo_venta'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategoria(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  filterCategoria === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {cat === 'todos' ? 'Todos' : cat === 'materia_prima' ? 'Materia Prima' : 'Listo para Venta'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <Package size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No hay productos en el inventario</p>
            <p className="text-sm mt-1">Agrega productos desde el botón "Nuevo Producto"</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Precio USD
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Precio Local
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Unidad
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProducts.map((producto, index) => (
                  <motion.tr
                    key={producto.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span className="font-medium text-gray-800 dark:text-white">
                          {producto.nombre}
                        </span>
                        {producto.descripcion && (
                          <p className="text-xs text-gray-400 dark:text-gray-500">{producto.descripcion}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        producto.categoria === 'materia_prima'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {producto.categoria === 'materia_prima' ? 'Materia Prima' : 'Listo para Venta'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-white">
                      ${producto.precioUSD?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-white">
                      ${(producto.precioUSD * tasaCambio).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-medium ${(producto.stock || 0) < 10 ? 'text-red-600' : 'text-gray-800 dark:text-white'}`}>
                        {producto.stock || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                      {producto.unidad || 'unidad'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button 
                        onClick={() => {
                          setEditingProducto(producto);
                          setModalOpen(true);
                        }}
                        className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 transition-colors mr-2"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => producto.id && handleEliminarProducto(producto.id)}
                        className="p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400 transition-colors"
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
      <ProductoModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingProducto(null);
        }}
        onSave={editingProducto ? handleEditarProducto : handleCrearProducto}
        producto={editingProducto}
        loading={saving}
      />
    </div>
  );
}