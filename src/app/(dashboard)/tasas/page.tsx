'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Save, TrendingUp, RefreshCw } from 'lucide-react';
import { useAuth } from '../../../../hooks/useAuth';
import { getTasaCambio, actualizarTasaCambio, TasaCambio } from '../../../../lib/firebase/tasaCambio';
import { showToast } from '../../providers';

export default function TasasPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tasa, setTasa] = useState<TasaCambio | null>(null);
  const [formData, setFormData] = useState({
    valorCompra: 24.50,
    valorVenta: 25.00,
    monedaLocal: 'Peso',
  });

  useEffect(() => {
    if (user) {
      cargarTasa();
    }
  }, [user]);

  const cargarTasa = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getTasaCambio(user.uid);
      if (data) {
        setTasa(data);
        setFormData({
          valorCompra: data.valorCompra,
          valorVenta: data.valorVenta,
          monedaLocal: data.monedaLocal || 'Peso',
        });
      }
    } catch (error) {
      showToast({ message: 'Error al cargar la tasa de cambio', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const result = await actualizarTasaCambio(user.uid, {
        valorCompra: formData.valorCompra,
        valorVenta: formData.valorVenta,
        monedaLocal: formData.monedaLocal,
      });
      if (result.success) {
        showToast({ 
          message: `✅ Tasa actualizada: 1 USD = ${formData.valorCompra} ${formData.monedaLocal}. Los precios de productos se actualizarán automáticamente.`, 
          type: 'success' 
        });
        await cargarTasa();
      } else {
        showToast({ message: result.error || 'Error al guardar', type: 'error' });
      }
    } catch (error) {
      showToast({ message: 'Error al guardar la tasa de cambio', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando tasa de cambio...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          💱 Tasa de Cambio
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Actualiza el valor del dólar. Los precios de productos se recalcularán automáticamente.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Configurar Tasa del Día
            </h2>
            <button 
              onClick={cargarTasa}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <RefreshCw size={18} className="text-gray-500" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Moneda Local
              </label>
              <input
                type="text"
                value={formData.monedaLocal}
                onChange={(e) => setFormData({ ...formData, monedaLocal: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Ej: Peso, Sol, Bolívar"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Precio de Compra (USD → Local)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.valorCompra}
                  onChange={(e) => setFormData({ ...formData, valorCompra: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Precio de Venta (Local → USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.valorVenta}
                  onChange={(e) => setFormData({ ...formData, valorVenta: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
            <button 
              onClick={handleGuardar}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <Save size={20} />
              )}
              {saving ? 'Guardando...' : 'Guardar Tasa de Cambio'}
            </button>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-400 flex items-center gap-2">
              <RefreshCw size={16} className="animate-spin" />
              <span>Última actualización: {tasa?.fecha || 'No disponible'}</span>
            </p>
            <p className="text-xs text-yellow-700 dark:text-yellow-500 mt-1">
              💡 Al actualizar la tasa, los precios locales de los productos se recalcularán automáticamente.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            Resumen
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-blue-100 text-sm">1 USD equivale a:</p>
              <p className="text-3xl font-bold">{formData.valorCompra} {formData.monedaLocal}</p>
            </div>
            <div className="border-t border-blue-400/30 pt-3">
              <p className="text-blue-100 text-sm">Ejemplo de conversión:</p>
              <p className="text-sm">
                Producto: Arroz ($1.20 USD) → {(1.20 * formData.valorCompra).toFixed(2)} {formData.monedaLocal}
              </p>
            </div>
            <div className="border-t border-blue-400/30 pt-3">
              <p className="text-blue-100 text-sm">1 kg en libras:</p>
              <p className="text-2xl font-bold">2.20462 lb</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}