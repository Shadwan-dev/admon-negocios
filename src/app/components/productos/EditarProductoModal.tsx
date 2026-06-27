// components/productos/EditarProductoModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Save, 
  Loader2, 
  AlertCircle,
  DollarSign
} from 'lucide-react';
import { Producto, actualizarProducto } from '@/lib/firebase/productos';
import { showToast } from '../../providers';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  producto: Producto | null;
  onActualizado: () => void;
}

const CATEGORIAS = [
  { value: 'materia_prima', label: 'Materia Prima' },
  { value: 'listo_venta', label: 'Listo para Venta' },
];

const UNIDADES = [
  { value: 'kg', label: 'Kilogramo (kg)' },
  { value: 'litro', label: 'Litro (L)' },
  { value: 'unidad', label: 'Unidad' },
  { value: 'lb', label: 'Libra (lb)' },
];

const MONEDAS = [
  { value: 'USD', label: 'USD' },
  { value: 'local', label: 'Moneda Local' },
];

export const EditarProductoModal = ({ isOpen, onClose, producto, onActualizado }: Props) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Producto>>({
    nombre: '',
    categoria: 'materia_prima',
    precioUSD: 0,
    stock: 0,
    unidad: 'unidad',
    descripcion: '',
    monedaCompra: 'USD',
    precioCompraOriginal: 0,
    factorConversion: 1,
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
        monedaCompra: producto.monedaCompra || 'USD',
        precioCompraOriginal: producto.precioCompraOriginal || 0,
        factorConversion: producto.factorConversion || 1,
      });
    }
  }, [producto]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!producto?.id) return;

    // Validar campos
    if (!formData.nombre?.trim()) {
      showToast({ message: 'El nombre es requerido', type: 'error' });
      return;
    }
    if (!formData.unidad) {
      showToast({ message: 'La unidad es requerida', type: 'error' });
      return;
    }
    if (!formData.precioUSD || formData.precioUSD <= 0) {
      showToast({ message: 'El precio debe ser mayor a 0', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const result = await actualizarProducto(producto.id, {
        nombre: formData.nombre,
        categoria: formData.categoria,
        precioUSD: formData.precioUSD,
        stock: formData.stock || 0,
        unidad: formData.unidad,
        descripcion: formData.descripcion || '',
        monedaCompra: formData.monedaCompra,
        precioCompraOriginal: formData.precioCompraOriginal || 0,
        factorConversion: formData.factorConversion || 1,
      });

      if (result.success) {
        showToast({ message: '✅ Producto actualizado correctamente', type: 'success' });
        onActualizado();
        onClose();
      } else {
        showToast({ message: result.error || 'Error al actualizar', type: 'error' });
      }
    } catch (error) {
      showToast({ message: 'Error al actualizar producto', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !producto) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between rounded-t-2xl">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Save size={20} className="text-blue-600" />
            Editar Producto
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Precio actual */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Precio actual: <span className="font-bold text-blue-600">${producto.precioUSD.toFixed(2)} USD</span>
            </p>
            {producto.precioLocal && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Precio local: <span className="font-bold text-green-600">${producto.precioLocal.toFixed(2)}</span>
              </p>
            )}
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Nombre del producto"
              required
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Categoría
            </label>
            <select
              value={formData.categoria}
              onChange={(e) => setFormData({...formData, categoria: e.target.value as any})}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              {CATEGORIAS.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Precio y Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Precio (USD) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.precioUSD}
                onChange={(e) => setFormData({...formData, precioUSD: parseFloat(e.target.value) || 0})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Stock
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          {/* Unidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Unidad *
            </label>
            <select
              value={formData.unidad}
              onChange={(e) => setFormData({...formData, unidad: e.target.value as any})}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              {UNIDADES.map((unidad) => (
                <option key={unidad.value} value={unidad.value}>{unidad.label}</option>
              ))}
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
              placeholder="Descripción del producto..."
            />
          </div>

          {/* Moneda de compra y precio original */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Moneda Compra
              </label>
              <select
                value={formData.monedaCompra}
                onChange={(e) => setFormData({...formData, monedaCompra: e.target.value as any})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              >
                {MONEDAS.map((moneda) => (
                  <option key={moneda.value} value={moneda.value}>{moneda.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Precio Compra Original
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.precioCompraOriginal}
                onChange={(e) => setFormData({...formData, precioCompraOriginal: parseFloat(e.target.value) || 0})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Factor de conversión */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Factor de Conversión
            </label>
            <input
              type="number"
              step="0.001"
              value={formData.factorConversion}
              onChange={(e) => setFormData({...formData, factorConversion: parseFloat(e.target.value) || 1})}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="1"
            />
            <p className="text-xs text-gray-400 mt-1">
              Factor para convertir entre unidades (ej: 1 kg = 2.204 lb)
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};