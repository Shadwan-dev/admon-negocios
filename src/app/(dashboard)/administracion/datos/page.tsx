'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  Building,
  Store,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../../../../hooks/useAuth';
import { getNegocioConfig, actualizarNegocio } from '../../../../../lib/modules/modules';
import { TIPOS_NEGOCIO } from '../../../../../lib/modules/config';
import { TipoNegocio } from '../../../../../lib/modules/types';
import { showToast } from '../../../providers';
import { Spinner } from '../../../components/ui/Spinner';

export default function DatosPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<any>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'otros' as TipoNegocio,
  });

  useEffect(() => {
    if (user) {
      cargarDatos();
    }
  }, [user]);

  const cargarDatos = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getNegocioConfig(user.uid);
      setConfig(data);
      setFormData({
        nombre: data?.nombre || '',
        tipo: data?.tipo || 'otros',
      });
    } catch (error) {
      showToast({ message: 'Error al cargar datos', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // ✅ Usar actualizarNegocio en lugar de actualizarTipoNegocio
      const result = await actualizarNegocio(user.uid, {
        nombre: formData.nombre,
        tipo: formData.tipo,
      });
      if (result.success) {
        showToast({ message: '✅ Datos actualizados correctamente', type: 'success' });
        router.push('/administracion');
      } else {
        showToast({ message: result.error || 'Error al actualizar', type: 'error' });
      }
    } catch (error) {
      showToast({ message: 'Error al guardar cambios', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Spinner size="lg" label="Cargando datos..." />;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/administracion"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Building size={24} className="text-green-600" />
            Datos del Negocio
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Configura la información básica de tu negocio
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre del Negocio *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="Nombre de tu negocio"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipo de Negocio
            </label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoNegocio })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {Object.entries(TIPOS_NEGOCIO).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleGuardar}
              disabled={saving || !formData.nombre.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}