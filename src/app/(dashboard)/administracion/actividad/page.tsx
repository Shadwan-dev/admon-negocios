'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Calendar,
  Users,
  Package,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../../../../hooks/useAuth';
import { getNegocioConfig } from '../../../../../lib/modules/modules';
import { getUsuariosByNegocio } from '../../../../../lib/firebase/usuarios';
import { getProductos } from '../../../../../lib/firebase/productos';
import { getVentas } from '../../../../../lib/firebase/ventas';
import { showToast } from '../../../providers';
import { Spinner } from '../../../components/ui/Spinner';

export default function ActividadPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    usuarios: 0,
    productos: 0,
    ventas: 0,
    ingresos: 0,
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
      const [usuarios, productos, ventas] = await Promise.all([
        getUsuariosByNegocio(user.uid),
        getProductos(user.uid),
        getVentas(user.uid),
      ]);

      setStats({
        usuarios: usuarios.length,
        productos: productos.length,
        ventas: ventas.filter(v => v.estado === 'completada').length,
        ingresos: ventas.filter(v => v.estado === 'completada').reduce((sum, v) => sum + v.total, 0),
      });
    } catch (error) {
      showToast({ message: 'Error al cargar datos', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner size="lg" label="Cargando actividad..." />;
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
            <Activity size={24} className="text-yellow-600" />
            Actividad
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Resumen de la actividad del negocio
          </p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Usuarios</p>
              <p className="text-lg font-bold text-gray-800 dark:text-white">{stats.usuarios}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Package size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Productos</p>
              <p className="text-lg font-bold text-gray-800 dark:text-white">{stats.productos}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <DollarSign size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Ventas</p>
              <p className="text-lg font-bold text-gray-800 dark:text-white">{stats.ventas}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Activity size={18} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Ingresos</p>
              <p className="text-lg font-bold text-yellow-600">${stats.ingresos.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Últimas actividades - Placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
          <Clock size={16} />
          Últimas actividades
        </h3>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Activity size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Próximamente: Historial de actividades</p>
          <p className="text-xs mt-1">Aquí verás el registro de acciones en el negocio</p>
        </div>
      </div>
    </div>
  );
}