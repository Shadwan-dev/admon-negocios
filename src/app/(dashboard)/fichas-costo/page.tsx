'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Calculator, 
  Trash2, 
  Save, 
  X,
  Search,
  Edit,
  AlertCircle,
  Package,
  TrendingUp,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../../../hooks/useAuth';
import { 
  getProductos, 
  Producto, 
  crearProducto 
} from '../../../../lib/firebase/productos';
import { 
  getFichasCosto, 
  crearFichaCosto, 
  actualizarFichaCosto, 
  eliminarFichaCosto,
  calcularCostoTotal,
  calcularPrecioSugerido,
  UNIDADES_MEDIDA,
  FichaCosto,
  IngredienteFicha
} from '../../../../lib/firebase/fichasCosto';
import { getTasaCambio } from '../../../../lib/firebase/tasaCambio';
import { showToast } from '../../providers';

// Estado inicial de un ingrediente
const ingredienteInicial: IngredienteFicha = {
  productoId: '',
  nombre: '',
  cantidad: 1,
  unidad: 'kg',
  precioUnitario: 0,
  costoTotal: 0,
};

// Estado inicial de la ficha
const fichaInicial: Omit<FichaCosto, 'id' | 'uid' | 'createdAt' | 'updatedAt'> = {
  nombre: '',
  ingredientes: [{ ...ingredienteInicial }],
  manoObra: 0,
  margenGanancia: 30,
  costoTotal: 0,
  precioSugerido: 0,
};

export default function FichasCostoPage() {
  const { user } = useAuth();
  const [fichas, setFichas] = useState<FichaCosto[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFichaId, setCurrentFichaId] = useState<string | null>(null);
  const [formData, setFormData] = useState(fichaInicial);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProductSearch, setShowProductSearch] = useState<number | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Producto[]>([]);
  const [monedaLocal, setMonedaLocal] = useState('Peso');
  const [tasaCambio, setTasaCambio] = useState(24.50);
  const searchRef = useRef<HTMLDivElement>(null);

  // Cargar datos iniciales
  useEffect(() => {
    if (user) {
      cargarDatos();
    }
  }, [user]);

  // Cerrar búsqueda al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowProductSearch(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cargarDatos = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [fichasData, productosData, tasa] = await Promise.all([
        getFichasCosto(user.uid),
        getProductos(user.uid),
        getTasaCambio(user.uid)
      ]);
      setFichas(fichasData);
      setProductos(productosData);
      if (tasa) {
        setTasaCambio(tasa.valorCompra);
        setMonedaLocal(tasa.monedaLocal || 'Peso');
      }
    } catch (error) {
      showToast({ message: 'Error al cargar datos', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos para autocompletado
  const buscarProductos = (term: string) => {
    if (!term.trim()) {
      setFilteredProducts([]);
      return;
    }
    const lowerTerm = term.toLowerCase();
    const results = productos.filter(p => 
      p.nombre.toLowerCase().includes(lowerTerm)
    );
    setFilteredProducts(results);
  };

  // Manejar cambio en búsqueda de producto
  const handleSearchChange = (value: string, index: number) => {
    setSearchTerm(value);
    buscarProductos(value);
    setShowProductSearch(index);
  };

  // Seleccionar un producto de la lista
  const seleccionarProducto = (producto: Producto, index: number) => {
    const nuevosIngredientes = [...formData.ingredientes];
    nuevosIngredientes[index] = {
      ...nuevosIngredientes[index],
      productoId: producto.id || '',
      nombre: producto.nombre,
      precioUnitario: producto.precioUSD || 0,
      costoTotal: (producto.precioUSD || 0) * nuevosIngredientes[index].cantidad,
    };
    setFormData({ ...formData, ingredientes: nuevosIngredientes });
    setSearchTerm('');
    setFilteredProducts([]);
    setShowProductSearch(null);
    // Recalcular totales
    recalcularTotales(nuevosIngredientes);
  };

  // Agregar producto nuevo desde la búsqueda
  const agregarProductoNuevo = async (nombre: string, index: number) => {
    if (!nombre.trim() || !user) return;
    
    // Verificar si ya existe
    if (productos.some(p => p.nombre.toLowerCase() === nombre.toLowerCase())) {
      showToast({ message: 'Este producto ya existe en el inventario', type: 'error' });
      return;
    }

    // Crear producto nuevo
    const nuevoProducto = {
      uid: user.uid,
      nombre: nombre.trim(),
      categoria: 'materia_prima' as const,
      precioUSD: 0,
      stock: 0,
      unidad: 'kg' as const,
      monedaCompra: 'USD' as const,
      precioCompraOriginal: 0,
    };

    const result = await crearProducto(nuevoProducto);
    if (result.success && result.id) {
      const productoCompleto: Producto = {
        ...nuevoProducto,
        id: result.id,
      };
      // Actualizar lista de productos
      setProductos([...productos, productoCompleto]);
      // Seleccionar el producto creado
      seleccionarProducto(productoCompleto, index);
      showToast({ message: `Producto "${nombre}" creado ✅`, type: 'success' });
    } else {
      showToast({ message: result.error || 'Error al crear producto', type: 'error' });
    }
  };

  // Actualizar cantidad de un ingrediente
  const actualizarCantidad = (index: number, cantidad: number) => {
    const nuevosIngredientes = [...formData.ingredientes];
    const ing = nuevosIngredientes[index];
    ing.cantidad = cantidad;
    ing.costoTotal = ing.precioUnitario * cantidad;
    setFormData({ ...formData, ingredientes: nuevosIngredientes });
    recalcularTotales(nuevosIngredientes);
  };

  // Actualizar unidad de un ingrediente
  const actualizarUnidad = (index: number, unidad: string) => {
    const nuevosIngredientes = [...formData.ingredientes];
    nuevosIngredientes[index].unidad = unidad;
    setFormData({ ...formData, ingredientes: nuevosIngredientes });
  };

  // Recalcular totales
  const recalcularTotales = (ingredientes: IngredienteFicha[]) => {
    const costoTotal = calcularCostoTotal(ingredientes, formData.manoObra);
    const precioSugerido = calcularPrecioSugerido(costoTotal, formData.margenGanancia);
    setFormData(prev => ({
      ...prev,
      costoTotal,
      precioSugerido,
    }));
  };

  // Agregar ingrediente
  const agregarIngrediente = () => {
    setFormData({
      ...formData,
      ingredientes: [...formData.ingredientes, { ...ingredienteInicial }],
    });
  };

  // Eliminar ingrediente
  const eliminarIngrediente = (index: number) => {
    if (formData.ingredientes.length === 1) {
      showToast({ message: 'Debe tener al menos un ingrediente', type: 'error' });
      return;
    }
    const nuevosIngredientes = formData.ingredientes.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredientes: nuevosIngredientes });
    recalcularTotales(nuevosIngredientes);
  };

  // Manejar cambio de mano de obra
  const handleManoObraChange = (value: number) => {
    setFormData({ ...formData, manoObra: value });
    const costoTotal = calcularCostoTotal(formData.ingredientes, value);
    const precioSugerido = calcularPrecioSugerido(costoTotal, formData.margenGanancia);
    setFormData(prev => ({
      ...prev,
      costoTotal,
      precioSugerido,
    }));
  };

  // Manejar cambio de margen
  const handleMargenChange = (value: number) => {
    setFormData({ ...formData, margenGanancia: value });
    const costoTotal = calcularCostoTotal(formData.ingredientes, formData.manoObra);
    const precioSugerido = calcularPrecioSugerido(costoTotal, value);
    setFormData(prev => ({
      ...prev,
      costoTotal,
      precioSugerido,
    }));
  };

  // Guardar ficha
  const handleSave = async () => {
    if (!user) return;

    if (!formData.nombre.trim()) {
      showToast({ message: 'El nombre de la ficha es obligatorio', type: 'error' });
      return;
    }

    if (formData.ingredientes.some(ing => !ing.nombre.trim())) {
      showToast({ message: 'Todos los ingredientes deben tener nombre', type: 'error' });
      return;
    }

    const fichaData = {
      uid: user.uid,
      nombre: formData.nombre,
      ingredientes: formData.ingredientes,
      manoObra: formData.manoObra,
      margenGanancia: formData.margenGanancia,
      costoTotal: formData.costoTotal,
      precioSugerido: formData.precioSugerido,
    };

    try {
      if (isEditing && currentFichaId) {
        const result = await actualizarFichaCosto(currentFichaId, fichaData);
        if (result.success) {
          showToast({ message: 'Ficha actualizada ✅', type: 'success' });
          await cargarDatos();
          setIsModalOpen(false);
        } else {
          showToast({ message: result.error || 'Error al actualizar', type: 'error' });
        }
      } else {
        const result = await crearFichaCosto(fichaData);
        if (result.success) {
          showToast({ message: 'Ficha creada ✅', type: 'success' });
          await cargarDatos();
          setIsModalOpen(false);
        } else {
          showToast({ message: result.error || 'Error al crear', type: 'error' });
        }
      }
    } catch (error) {
      showToast({ message: 'Error al guardar ficha', type: 'error' });
    }
  };

  // Abrir modal para crear
  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentFichaId(null);
    setFormData({
      ...fichaInicial,
      ingredientes: [{ ...ingredienteInicial }],
    });
    setSearchTerm('');
    setFilteredProducts([]);
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const handleOpenEdit = (ficha: FichaCosto) => {
    setIsEditing(true);
    setCurrentFichaId(ficha.id || null);
    setFormData({
      nombre: ficha.nombre,
      ingredientes: ficha.ingredientes.map(ing => ({ ...ing })),
      manoObra: ficha.manoObra || 0,
      margenGanancia: ficha.margenGanancia || 30,
      costoTotal: ficha.costoTotal || 0,
      precioSugerido: ficha.precioSugerido || 0,
    });
    setSearchTerm('');
    setFilteredProducts([]);
    setIsModalOpen(true);
  };

  // Eliminar ficha
  const handleDelete = async (id: string) => {
    const result = await eliminarFichaCosto(id);
    if (result.success) {
      showToast({ message: 'Ficha eliminada 🗑️', type: 'success' });
      await cargarDatos();
    } else {
      showToast({ message: result.error || 'Error al eliminar', type: 'error' });
    }
    setDeleteConfirm(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando fichas de costo...</p>
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
            🧮 Fichas de Costo
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {fichas.length} fichas de costo guardadas
          </p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
          <Plus size={20} />
          Nueva Ficha
        </button>
      </motion.div>

      {/* Lista de fichas */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {fichas.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <Calculator size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No hay fichas de costo</p>
            <p className="text-sm mt-1">Crea tu primera ficha para calcular costos de tus productos</p>
            <button 
              onClick={handleOpenCreate}
              className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              + Crear Ficha
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {fichas.map((ficha) => (
              <motion.div
                key={ficha.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {ficha.nombre}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {ficha.ingredientes?.length || 0} ingredientes
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Costo total: <span className="font-medium">${ficha.costoTotal?.toFixed(2)}</span>
                      </p>
                      <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                        Precio sugerido: ${ficha.precioSugerido?.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">
                        Margen: {ficha.margenGanancia || 30}%
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenEdit(ficha)}
                      className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(ficha.id || null)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
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
                ¿Estás seguro de que deseas eliminar esta ficha de costo? Esta acción no se puede deshacer.
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

      {/* Modal de Crear/Editar Ficha */}
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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  {isEditing ? '✏️ Editar Ficha de Costo' : '➕ Nueva Ficha de Costo'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Nombre de la ficha */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nombre de la Ficha *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej: Pollo Asado, Pan de Masa, Salsa..."
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  />
                </div>

                {/* Ingredientes */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Ingredientes *
                    </label>
                    <button
                      onClick={agregarIngrediente}
                      className="text-sm text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                    >
                      <Plus size={14} />
                      Agregar
                    </button>
                  </div>

                  {formData.ingredientes.map((ing, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 mb-3">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 space-y-2">
                          {/* Búsqueda de producto */}
                          <div ref={searchRef} className="relative">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                              <input
                                type="text"
                                value={ing.nombre}
                                onChange={(e) => {
                                  const nuevosIngredientes = [...formData.ingredientes];
                                  nuevosIngredientes[index].nombre = e.target.value;
                                  setFormData({ ...formData, ingredientes: nuevosIngredientes });
                                  handleSearchChange(e.target.value, index);
                                }}
                                placeholder="Buscar producto..."
                                className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                              />
                            </div>

                            {/* Resultados de búsqueda */}
                            {showProductSearch === index && filteredProducts.length > 0 && (
                              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                {filteredProducts.map((p) => (
                                  <button
                                    key={p.id}
                                    onClick={() => seleccionarProducto(p, index)}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-800 dark:text-white flex items-center justify-between"
                                  >
                                    <span>{p.nombre}</span>
                                    <span className="text-xs text-gray-500">${p.precioUSD?.toFixed(2)}</span>
                                  </button>
                                ))}
                                {/* Opción para crear nuevo producto */}
                                {ing.nombre.trim() && !productos.some(p => p.nombre.toLowerCase() === ing.nombre.toLowerCase()) && (
                                  <button
                                    onClick={() => agregarProductoNuevo(ing.nombre, index)}
                                    className="w-full text-left px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-sm text-purple-600 dark:text-purple-400 flex items-center gap-2 border-t border-gray-200 dark:border-gray-700"
                                  >
                                    <UserPlus size={14} />
                                    Crear "{ing.nombre}"
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="text-xs text-gray-500 dark:text-gray-400">Cantidad</label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={ing.cantidad}
                                onChange={(e) => actualizarCantidad(index, parseFloat(e.target.value) || 0)}
                                className="w-full px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-1 focus:ring-purple-500 outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 dark:text-gray-400">Unidad</label>
                              <select
                                value={ing.unidad}
                                onChange={(e) => actualizarUnidad(index, e.target.value)}
                                className="w-full px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-1 focus:ring-purple-500 outline-none"
                              >
                                {UNIDADES_MEDIDA.map(u => (
                                  <option key={u.value} value={u.value}>{u.label}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 dark:text-gray-400">Precio</label>
                              <input
                                type="number"
                                step="0.01"
                                value={ing.precioUnitario || ''}
                                onChange={(e) => {
                                  const nuevosIngredientes = [...formData.ingredientes];
                                  const precio = parseFloat(e.target.value) || 0;
                                  nuevosIngredientes[index].precioUnitario = precio;
                                  nuevosIngredientes[index].costoTotal = precio * nuevosIngredientes[index].cantidad;
                                  setFormData({ ...formData, ingredientes: nuevosIngredientes });
                                  recalcularTotales(nuevosIngredientes);
                                }}
                                className="w-full px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-1 focus:ring-purple-500 outline-none"
                              />
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => eliminarIngrediente(index)}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 dark:text-red-400 mt-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mano de obra y Margen */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mano de Obra ({monedaLocal})
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.manoObra || ''}
                      onChange={(e) => handleManoObraChange(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Margen de Ganancia (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="1000"
                      value={formData.margenGanancia || ''}
                      onChange={(e) => handleMargenChange(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Resumen */}
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 text-white">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-purple-100 text-sm">Costo Total</p>
                      <p className="text-2xl font-bold">${formData.costoTotal?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div>
                      <p className="text-purple-100 text-sm">Precio Sugerido</p>
                      <p className="text-2xl font-bold">${formData.precioSugerido?.toFixed(2) || '0.00'}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-purple-100 text-sm border-t border-purple-400/30 pt-2">
                    {formData.ingredientes.length} ingredientes | Margen: {formData.margenGanancia || 30}%
                  </div>
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
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
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