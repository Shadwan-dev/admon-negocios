// components/negocio/NegocioSidebar.tsx
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
  UserCircle,
  Truck,
  ShoppingBag,
  Calculator,
  BarChart3,
  ArrowLeft,
  Store,
  Menu,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';

const MODULES = [
  { id: 'productos', icon: Package, label: 'Productos', path: '/negocio/productos' },
  { id: 'ventas', icon: ShoppingCart, label: 'Ventas', path: '/negocio/ventas' },
  { id: 'produccion', icon: Factory, label: 'Producción', path: '/negocio/produccion' },
  { id: 'caja', icon: DollarSign, label: 'Caja', path: '/negocio/caja' },
  { id: 'empleados', icon: Users, label: 'Empleados', path: '/negocio/empleados' },
  { id: 'clientes', icon: UserCircle, label: 'Clientes', path: '/negocio/clientes' },
  { id: 'proveedores', icon: Truck, label: 'Proveedores', path: '/negocio/proveedores' },
  { id: 'compras', icon: ShoppingBag, label: 'Compras', path: '/negocio/compras' },
  { id: 'reportes', icon: BarChart3, label: 'Reportes', path: '/negocio/reportes' },
  { id: 'fichas-costo', icon: Calculator, label: 'Fichas de Costo', path: '/fichas-costo' },
];

export const NegocioSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNavigate = (path: string) => {
    if (pathname === path) return;
    router.push(path);
  };

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ 
          width: sidebarOpen ? (isMobile ? '100%' : 280) : (isMobile ? 0 : 72),
          opacity: sidebarOpen || !isMobile ? 1 : 0
        }}
        className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 shadow-lg z-50 overflow-hidden ${
          isMobile && !sidebarOpen ? 'pointer-events-none' : ''
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
              Mi Negocio
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Módulos */}
        <nav className="p-3 space-y-0.5 overflow-y-auto max-h-[calc(100vh-140px)]">
          {MODULES.map((mod) => {
            const isActive = pathname === mod.path;
            const Icon = mod.icon;

            return (
              <button
                key={mod.id}
                onClick={() => handleNavigate(mod.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                <Icon size={18} />
                <motion.span
                  animate={{ opacity: sidebarOpen ? 1 : 0 }}
                  className="font-medium truncate"
                >
                  {mod.label}
                </motion.span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 w-full p-3 border-t dark:border-gray-700">
          <button
            onClick={() => router.push('/negocio')}
            className="flex items-center gap-3 p-2.5 w-full rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
          >
            <Store size={18} />
            <motion.span 
              animate={{ opacity: sidebarOpen ? 1 : 0 }}
              className="text-sm font-medium"
            >
              Volver a Mi Negocio
            </motion.span>
          </button>
        </div>
      </motion.aside>

      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};