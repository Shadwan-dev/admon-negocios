'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Package, 
  ShoppingCart, 
  Factory, 
  DollarSign, 
  Users, 
  TrendingUp,
  Settings,
  LayoutDashboard,
  UserCircle, // ✅ Para clientes
  Truck,      // ✅ Para proveedores
  ShoppingBag // ✅ Para compras
} from 'lucide-react';
import { ModuleId } from '../../../../../lib/modules/types';

interface ModuleNavProps {
  modulosActivos: ModuleId[];
}

// ✅ Mapeo completo de iconos y nombres - AHORA CON TODOS LOS MÓDULOS
const MODULE_CONFIG: Record<ModuleId, { icon: any; label: string; color: string }> = {
  inventario: { icon: Package, label: 'Inventario', color: 'text-blue-600' },
  ventas: { icon: ShoppingCart, label: 'Ventas', color: 'text-green-600' },
  produccion: { icon: Factory, label: 'Producción', color: 'text-purple-600' },
  caja: { icon: DollarSign, label: 'Caja', color: 'text-yellow-600' },
  empleados: { icon: Users, label: 'Empleados', color: 'text-indigo-600' },
  reportes: { icon: TrendingUp, label: 'Reportes', color: 'text-cyan-600' },
  clientes: { icon: UserCircle, label: 'Clientes', color: 'text-pink-600' },     // ✅ AGREGADO
  proveedores: { icon: Truck, label: 'Proveedores', color: 'text-orange-600' },   // ✅ AGREGADO
  compras: { icon: ShoppingBag, label: 'Compras', color: 'text-red-600' },        // ✅ AGREGADO
};

export function ModuleNav({ modulosActivos }: ModuleNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Módulos disponibles (filtrar los que están activos)
  const modules = modulosActivos
    .filter(id => MODULE_CONFIG[id])
    .map(id => ({ id, ...MODULE_CONFIG[id] }));

  // Si no hay módulos activos, mostrar mensaje
  if (modules.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No hay módulos activos. Ve a Administración para activarlos.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
      <div className="flex flex-wrap gap-2">
        {/* Botón Dashboard */}
        <button
          onClick={() => router.push('/dashboard')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            pathname === '/dashboard'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <LayoutDashboard size={18} />
          <span className="text-sm font-medium">Dashboard</span>
        </button>

        {/* Separador */}
        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Módulos */}
        {modules.map((mod) => {
          const Icon = mod.icon;
          const isActive = pathname === `/${mod.id}`;

          return (
            <motion.button
              key={mod.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(`/${mod.id}`)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive
                  ? `bg-${mod.color.split('-')[1]}-50 dark:bg-${mod.color.split('-')[1]}-900/20 border-2 border-${mod.color.split('-')[1]}-500`
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Icon size={18} className={isActive ? mod.color : ''} />
              <span className="text-sm font-medium">{mod.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}