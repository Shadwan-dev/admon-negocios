'use client';

import { useState, useEffect } from 'react';
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
  Home
} from 'lucide-react';
import { useAuth } from '../../../../hooks/useAuth';
import { getNegocioConfig } from '../../../../lib/modules/modules';
import { showToast } from '../../providers';
import { Logo } from './../../components/ui/Logo';
import { ThemeSelector } from './../../components/ui/ThemeSelector';
import { useLogoTheme } from '../../providers';

// ✅ Mapeo de módulos del negocio
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

export default function NegocioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { logoTheme, setLogoTheme } = useLogoTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  // Cargar configuración
  useEffect(() => {
    const loadConfig = async () => {
      if (user) {
        try {
          const data = await getNegocioConfig(user.uid);
          setConfig(data);
        } catch (error) {
          console.error('Error cargando configuración:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadConfig();
  }, [user]);

  // Detectar mobile
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
    setIsNavigating(true);
    router.push(path);
    setTimeout(() => setIsNavigating(false), 500);
  };

  const goBackToNegocio = () => {
    router.push('/negocio');
  };

  // ✅ Determinar el módulo actual
  const currentModule = MODULES.find(m => pathname === m.path);
  const moduleLabel = currentModule?.label || 'Módulo';

  // ✅ Verificar si estamos en la página principal de negocio
  const isNegocioHome = pathname === '/negocio';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando negocio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar de módulos - MISMO ANCHO QUE EL DASHBOARD (280px) */}
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
        {/* Header del Sidebar con botón "Volver al Negocio" */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-2 overflow-hidden min-w-0">
            {/* ✅ Botón "Volver al Negocio" con mejor estilo */}
            <button
  onClick={() => router.push('/dashboard')}
  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0 group"
  title="Ir al Dashboard"
>
  <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
</button>
            
            <motion.div
              animate={{ opacity: sidebarOpen ? 1 : 0 }}
              className="flex items-center gap-2 min-w-0"
            >
              <Logo size="sm" theme={logoTheme} variant="default" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                {config?.nombre || 'Mi Negocio'}
              </span>
            </motion.div>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navegación de módulos */}
        <nav className="p-3 space-y-0.5 overflow-y-auto max-h-[calc(100vh-140px)]">
          {MODULES.map((mod) => {
            const isActive = pathname === mod.path;
            const Icon = mod.icon;

            return (
              <button
                key={mod.id}
                onClick={() => handleNavigate(mod.path)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm
                  ${isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }
                `}
              >
                <Icon size={18} className={isActive ? 'text-blue-600' : ''} />
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

        {/* Footer del Sidebar */}
        <div className="absolute bottom-0 w-full p-3 border-t dark:border-gray-700">
          {/* ✅ Botón "Volver al Negocio" mejorado en el footer */}
          <button
            onClick={goBackToNegocio}
            className={`
              flex items-center gap-3 p-2.5 w-full rounded-lg transition-colors
              ${isNegocioHome 
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
              }
            `}
          >
            <Store size={18} className="flex-shrink-0" />
            <motion.span 
              animate={{ opacity: sidebarOpen ? 1 : 0 }}
              className="text-sm font-medium"
            >
              Volver a Mi Negocio
            </motion.span>
          </button>
        </div>
      </motion.aside>

      {/* Overlay para mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main 
        className={`transition-all duration-300 ${
          sidebarOpen && !isMobile ? 'ml-[280px]' : !isMobile ? 'ml-[72px]' : 'ml-0'
        }`}
      >
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu size={20} />
              </button>
              <h1 className="text-sm font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <span className="text-gray-400 dark:text-gray-500">🏪</span>
                {isNegocioHome ? 'Mi Negocio' : moduleLabel}
              </h1>
              {!isNegocioHome && (
                <button
                  onClick={goBackToNegocio}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <ArrowLeft size={14} />
                  Volver
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <ThemeSelector 
                currentTheme={logoTheme} 
                onThemeChange={setLogoTheme} 
              />
            </div>
          </div>
        </div>

        {/* Content con Spinner de carga */}
        <div className="p-4 md:p-6 relative min-h-[calc(100vh-120px)]">
          <AnimatePresence mode="wait">
            {isNavigating ? (
              <motion.div
                key="spinner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-gray-50/80 dark:bg-gray-900/80 z-40"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Cargando...</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}