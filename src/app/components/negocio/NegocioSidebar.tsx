// components/negocio/NegocioSidebar.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  X,
  Home,
  LayoutDashboard
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
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNavigate = (path: string) => {
    if (pathname === path) return;
    router.push(path);
    if (isMobile) setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Determinar si estamos en la página principal de negocio
  const isNegocioHome = pathname === '/negocio';

  // Ancho del sidebar: 280px abierto, 72px colapsado
  const sidebarWidth = sidebarOpen ? 280 : 72;

  return (
    <>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isMobile && !sidebarOpen ? 0 : sidebarWidth,
          opacity: isMobile && !sidebarOpen ? 0 : 1,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-hidden ${
          isMobile && !sidebarOpen ? 'pointer-events-none' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header con logo y botón de toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0 group"
              title="Ir al Dashboard"
            >
              <LayoutDashboard 
                size={20} 
                className="text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" 
              />
            </button>
            <motion.span
              initial={false}
              animate={{ opacity: sidebarOpen ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate"
            >
              Mi Negocio
            </motion.span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
            aria-label={sidebarOpen ? 'Cerrar sidebar' : 'Abrir sidebar'}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navegación de módulos */}
        <nav className="p-3 space-y-0.5 overflow-y-auto max-h-[calc(100vh-160px)]">
          {MODULES.map((mod) => {
            const isActive = pathname === mod.path;
            const Icon = mod.icon;

            return (
              <motion.button
                key={mod.id}
                onClick={() => handleNavigate(mod.path)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm
                  ${isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }
                `}
              >
                <Icon size={18} className={isActive ? 'text-blue-600 dark:text-blue-400' : ''} />
                <motion.span
                  initial={false}
                  animate={{ 
                    opacity: sidebarOpen ? 1 : 0,
                    width: sidebarOpen ? 'auto' : 0
                  }}
                  transition={{ duration: 0.2 }}
                  className="font-medium truncate whitespace-nowrap"
                >
                  {mod.label}
                </motion.span>
              </motion.button>
            );
          })}
        </nav>

        {/* Footer con botón "Volver a Mi Negocio" */}
        <div className="absolute bottom-0 w-full p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <motion.button
            onClick={() => router.push('/negocio')}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={`
              flex items-center gap-3 p-2.5 w-full rounded-lg transition-all text-sm
              ${isNegocioHome 
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
              }
            `}
          >
            <Store size={18} className="flex-shrink-0" />
            <motion.span
              initial={false}
              animate={{ 
                opacity: sidebarOpen ? 1 : 0,
                width: sidebarOpen ? 'auto' : 0
              }}
              transition={{ duration: 0.2 }}
              className="font-medium truncate whitespace-nowrap"
            >
              Volver a Mi Negocio
            </motion.span>
          </motion.button>
        </div>
      </motion.aside>

      {/* Overlay para mobile */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Espaciador para el contenido (compensa el ancho del sidebar) */}
      <div 
        className={`transition-all duration-300 ${
          isMobile ? 'ml-0' : `ml-[${sidebarWidth}px]`
        }`}
        style={{ 
          marginLeft: isMobile ? 0 : sidebarWidth 
        }}
      />
    </>
  );
};