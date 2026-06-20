'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  RefreshCw, 
  X,
  Save,
  AlertCircle,
  Package,
  DollarSign,
  Wallet
} from 'lucide-react';
import { useAuth } from '../../../../hooks/useAuth';
import { 
  getProductos, 
  crearProducto, 
  actualizarProducto, 
  eliminarProducto,
  calcularPrecioLocal,
  convertirLocalToUSD,
  Producto 
} from '../../../../lib/firebase/productos';
import { getTasaCambio } from '../../../../lib/firebase/tasaCambio';
import { showToast } from '../../providers';

const CATEGORIAS = [
  { value: 'materia_prima', label: 'Materia Prima' },
  { value: 'listo_venta', label: 'Listo para Venta' }
];

const UNIDADES = [
  { value: 'kg', label: 'Kilogramo (kg)' },
  { value: 'lb', label: 'Libra (lb)' },
  { value: 'litro', label: 'Litro (L)' },
  { value: 'unidad', label: 'Unidad' }
];

const MONEDAS = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'local', label: 'Moneda Local' }
];

const initialState: Omit<Producto, 'id' | 'uid' | 'createdAt' | 'updatedAt'> = {
  nombre: '',
  categoria: 'materia_prima',
  precioUSD: 0,
  precioLocal: 0,
  monedaCompra: 'USD',
  precioCompraOriginal: 0,
  unidad: 'kg',
};

export default function ProductosPage() {
  const { user } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductoId, setCurrentProductoId] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialState);
  const [tasaCambio, setTasaCambio] = useState(24.50);
  const [monedaLocal, setMonedaLocal] = useState('Peso');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Cargar productos y tasa de cambio
  useEffect(() => {
    if (user) {
      cargarDatos();
    }
  }, [user]);

  const cargarDatos = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Cargar tasa de cambio
      const tasa = await getTasaCambio(user.uid);
      if (tasa) {
        setTasaCambio(tasa.valorCompra);
        setMonedaLocal(tasa.monedaLocal || 'Peso');
      }
      
      // Cargar productos
      await cargarProductos();
    } catch (error) {
      showToast({ message: 'Error al cargar datos', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const cargarProductos = async () => {
    if (!user) return;
    try {
      const productosData = await getProductos(user.uid);
      // Calcular precio local para cada producto
      const productosConPrecioLocal = productosData.map(p => ({
        ...p,
        precioLocal: p.precioUSD ? calcularPrecioLocal(p.precioUSD, tasaCambio) : 0
      }));
      setProductos(productosConPrecioLocal);
    } catch (error) {
      showToast({ message: 'Error al cargar productos', type: 'error' });
    }
  };

  // Filtrar productos
  const filteredProducts = productos.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'todos' || producto.categoria === filter;
    return matchesSearch && matchesFilter;
  });

  // Abrir modal para crear
  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentProductoId(null);
    setFormData({
      ...initialState,
      monedaCompra: 'USD',
    });
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const handleOpenEdit = (producto: Producto) => {
    setIsEditing(true);
    setCurrentProductoId(producto.id || null);
    setFormData({
      nombre: producto.nombre,
      categoria: producto.categoria,
      precioUSD: producto.precioUSD,
      precioLocal: producto.precioLocal || 0,
      monedaCompra: producto.monedaCompra || 'USD',
      precioCompraOriginal: producto.precioCompraOriginal || producto.precioUSD,
      unidad: producto.unidad,
    });
    setIsModalOpen(true);
  };

  // Manejar cambio de moneda
  const handleMonedaChange = (moneda: 'USD' | 'local') => {
    setFormData({ ...formData, monedaCompra: moneda });
    // Limpiar el precio de la moneda no seleccionada
    if (moneda === 'USD') {
      setFormData(prev => ({
        ...prev,
        monedaCompra: 'USD',
        precioLocal: 0,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        monedaCompra: 'local',
        precioUSD: 0,
      }));
    }
  };

  // Manejar cambio de precio según moneda
  const handlePrecioChange = (value: number, tipo: 'USD' | 'local') => {
    if (tipo === 'USD') {
      const precioLocal = calcularPrecioLocal(value, tasaCambio);
      setFormData(prev => ({
        ...prev,
        precioUSD: value,
        precioLocal: precioLocal,
        precioCompraOriginal: value,
      }));
    } else {
      const precioUSD = convertirLocalToUSD(value, tasaCambio);
      setFormData(prev => ({
        ...prev,
        precioLocal: value,
        precioUSD: precioUSD,
        precioCompraOriginal: value,
      }));
    }
  };

  // Guardar producto
  const handleSave = async () => {
    if (!user) return;
    
    if (!formData.nombre.trim()) {
      showToast({ message: 'El nombre es obligatorio', type: 'error' });
      return;
    }

    const precioValid = formData.monedaCompra === 'USD' 
      ? formData.precioUSD > 0 
      : (formData.precioLocal || 0) > 0;

    if (!precioValid) {
      showToast({ 
        message: `El precio en ${formData.monedaCompra === 'USD' ? 'USD' : monedaLocal} debe ser mayor a 0`, 
        type: 'error' 
      });
      return;
    }

    try {
      // Preparar datos para guardar
      const productoData = {
        uid: user.uid,
        nombre: formData.nombre,
        categoria: formData.categoria,
        unidad: formData.unidad,
        monedaCompra: formData.monedaCompra,
        precioUSD: formData.monedaCompra === 'USD' ? formData.precioUSD : formData.precioUSD,
        precioCompraOriginal: formData.monedaCompra === 'USD' ? formData.precioUSD : formData.precioLocal,
      };

      if (isEditing && currentProductoId) {
        const result = await actualizarProducto(currentProductoId, productoData);
        if (result.success) {
          showToast({ message: 'Producto actualizado ✅', type: 'success' });
          await cargarProductos();
          setIsModalOpen(false);
        } else {
          showToast({ message: result.error || 'Error al actualizar', type: 'error' });
        }
      } else {
        const result = await crearProducto(productoData);
        if (result.success) {
          showToast({ message: 'Producto creado ✅', type: 'success' });
          await cargarProductos();
          setIsModalOpen(false);
        } else {
          showToast({ message: result.error || 'Error al crear', type: 'error' });
        }
      }
    } catch (error) {
      showToast({ message: 'Error al guardar producto', type: 'error' });
    }
  };

  // Eliminar producto
  const handleDelete = async (id: string) => {
    const result = await eliminarProducto(id);
    if (result.success) {
      showToast({ message: 'Producto eliminado 🗑️', type: 'success' });
      await cargarProductos();
    } else {
      showToast({ message: result.error || 'Error al eliminar', type: 'error' });
    }
    setDeleteConfirm(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando productos...</p>
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
            📦 Productos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {productos.length} productos en tu inventario
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            <Plus size={20} />
            Nuevo Producto
          </button>
          <button 
            onClick={cargarProductos}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <RefreshCw size={20} />
            Actualizar
          </button>
        </div>
      </motion.div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['todos', 'materia_prima', 'listo_venta'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                  filter === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                {cat === 'todos' ? 'Todos' : cat === 'materia_prima' ? 'Materia Prima' : 'Listo para Venta'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <Package size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No hay productos</p>
            <p className="text-sm mt-1">Comienza agregando tu primer producto</p>
            <button 
              onClick={handleOpenCreate}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              + Agregar Producto
            </button>
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
                    Moneda Compra
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
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                          📦
                        </div>
                        <span className="font-medium text-gray-800 dark:text-white">{producto.nombre}</span>
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
                      {(producto.precioLocal || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        producto.monedaCompra === 'USD'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {producto.monedaCompra === 'USD' ? 'USD' : monedaLocal}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                      {producto.unidad}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button 
                        onClick={() => handleOpenEdit(producto)}
                        className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 transition-colors mr-2"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm(producto.id || null)}
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

      {/* Modal de Confirmación de Eliminación */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-4">
                <AlertCircle size={24} />
                <h3 className="text-lg font-semibold">Confirmar Eliminación</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Crear/Editar Producto */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  {isEditing ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej: Arroz, Aceite, Pollo..."
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>

                {/* Categoría */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Categoría *
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value as 'materia_prima' | 'listo_venta' })}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    {CATEGORIAS.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* Moneda de Compra */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Moneda de Compra *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {MONEDAS.map((moneda) => (
                      <button
                        key={moneda.value}
                        type="button"
                        onClick={() => handleMonedaChange(moneda.value as 'USD' | 'local')}
                        className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                          formData.monedaCompra === moneda.value
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        {moneda.value === 'USD' ? (
                          <DollarSign size={18} />
                        ) : (
                          <Wallet size={18} />
                        )}
                        {moneda.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Precio según moneda */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Precio de Compra ({formData.monedaCompra === 'USD' ? 'USD' : monedaLocal}) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.monedaCompra === 'USD' ? formData.precioUSD || '' : formData.precioLocal || ''}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      handlePrecioChange(value, formData.monedaCompra);
                    }}
                    placeholder="0.00"
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                  {formData.monedaCompra === 'local' && (
                    <p className="text-xs text-gray-500 mt-1">
                      Equivalente en USD: ${formData.precioUSD?.toFixed(2) || '0.00'} 
                      (tasa: 1 USD = {tasaCambio} {monedaLocal})
                    </p>
                  )}
                  {formData.monedaCompra === 'USD' && (
                    <p className="text-xs text-gray-500 mt-1">
                      Equivalente en {monedaLocal}: {(formData.precioLocal || 0).toFixed(2)} 
                      (tasa: 1 USD = {tasaCambio} {monedaLocal})
                    </p>
                  )}
                </div>

                {/* Unidad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Unidad de Medida *
                  </label>
                  <select
                    value={formData.unidad}
                    onChange={(e) => setFormData({ ...formData, unidad: e.target.value as 'kg' | 'litro' | 'unidad' | 'lb' })}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    {UNIDADES.map(unidad => (
                      <option key={unidad.value} value={unidad.value}>{unidad.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6 justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Save size={18} />
                  {isEditing ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}