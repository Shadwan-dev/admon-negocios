'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  Calculator, 
  DollarSign, 
  LogOut,
  Menu,
  X,
  User,
  Settings,
  Store,
  Building,
  ChevronDown,
  ChevronUp,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { logoutUser } from '../../../lib/firebase/auth';
import { getNegociosDeUsuario, cambiarNegocioActivo } from '../../../lib/firebase/usuarios';
import { getNegocioConfig } from '../../../lib/modules/modules';
import { Logo } from '../components/ui/Logo';
import { ThemeSelector } from '../components/ui/ThemeSelector';
import { showToast, useLogoTheme } from '../providers';

// ✅ NAVEGACIÓN PRINCIPAL
const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Store, label: 'Mi Negocio', href: '/negocio' },
  { icon: Package, label: 'Productos', href: '/productos' },
  { icon: DollarSign, label: 'Tasa de Cambio', href: '/tasas' },
  { icon: Calculator, label: 'Fichas de Costo', href: '/fichas-costo' },
  { icon: Settings, label: 'Administración', href: '/administracion' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const { logoTheme, setLogoTheme } = useLogoTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [negocios, setNegocios] = useState<any[]>([]);
  const [negocioActivo, setNegocioActivo] = useState<string | null>(null);
  const [mostrarNegocios, setMostrarNegocios] = useState(false);
  const [configLoading, setConfigLoading] = useState(true);

  // Verificar autenticación
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Cargar negocios del usuario
  useEffect(() => {
    const loadNegocios = async () => {
      if (user) {
        try {
          const negociosData = await getNegociosDeUsuario(user.uid);
          setNegocios(negociosData);
          
          // Determinar negocio activo
          if (negociosData.length > 0) {
            const activo = negociosData.find(n => n.activo) || negociosData[0];
            setNegocioActivo(activo.uid);
          }
        } catch (error) {
          console.error('Error cargando negocios:', error);
        } finally {
          setConfigLoading(false);
        }
      }
    };
    loadNegocios();
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

  const handleLogout = async () => {
    try {
      const result = await logoutUser();
      if (result.success) {
        showToast({ message: 'Sesión cerrada correctamente', type: 'success' });
        router.push('/login');
      } else {
        showToast({ message: 'Error al cerrar sesión', type: 'error' });
      }
    } catch (error) {
      showToast({ message: 'Error al cerrar sesión', type: 'error' });
    }
  };

  const handleCambiarNegocio = async (negocioUid: string) => {
    if (!user) return;
    try {
      const result = await cambiarNegocioActivo(user.uid, negocioUid);
      if (result.success) {
        setNegocioActivo(negocioUid);
        setMostrarNegocios(false);
        showToast({ message: '✅ Cambiado al negocio seleccionado', type: 'success' });
        router.refresh();
      } else {
        showToast({ message: result.error || 'Error al cambiar negocio', type: 'error' });
      }
    } catch (error) {
      showToast({ message: 'Error al cambiar negocio', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  // Obtener nombre del negocio activo
  const negocioActivoNombre = negocios.find(n => n.uid === negocioActivo)?.nombre || 'Mi Negocio';
  const tieneMultiplesNegocios = negocios.length > 1;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: sidebarOpen ? (isMobile ? '100%' : 280) : (isMobile ? 0 : 80),
          opacity: sidebarOpen || !isMobile ? 1 : 0
        }}
        className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 shadow-lg z-50 overflow-hidden ${
          isMobile && !sidebarOpen ? 'pointer-events-none' : ''
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <motion.div
            animate={{ opacity: sidebarOpen ? 1 : 0 }}
            className="flex items-center gap-2 overflow-hidden"
          >
            <Logo size="sm" theme={logoTheme} variant="default" />
            {sidebarOpen && (
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                {negocioActivoNombre}
              </span>
            )}
          </motion.div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
          {/* ✅ NAVEGACIÓN PRINCIPAL */}
          {navItems.map((item) => {
            const active = isActiveRoute(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 5 }}
                  className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors text-sm ${
                    active
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <item.icon size={18} />
                  <motion.span
                    animate={{ opacity: sidebarOpen ? 1 : 0 }}
                    className="font-medium"
                  >
                    {item.label}
                  </motion.span>
                </motion.div>
              </Link>
            );
          })}

          {/* ✅ SECCIÓN DE NEGOCIOS - Solo si tiene múltiples */}
          {tieneMultiplesNegocios && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setMostrarNegocios(!mostrarNegocios)}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xs text-gray-500 dark:text-gray-400"
              >
                <span className="flex items-center gap-2">
                  <Building size={14} />
                  <span>Tus Negocios</span>
                </span>
                {mostrarNegocios ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {mostrarNegocios && (
                <div className="mt-1 space-y-1">
                  {negocios.map((negocio) => {
                    const isActivo = negocio.uid === negocioActivo;
                    return (
                      <button
                        key={negocio.uid}
                        onClick={() => handleCambiarNegocio(negocio.uid)}
                        className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors text-sm ${
                          isActivo
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        <div className="flex-1 text-left truncate">
                          <p className="text-sm font-medium truncate">
                            {negocio.nombre}
                          </p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 capitalize">
                            {negocio.rol}
                          </p>
                        </div>
                        {isActivo && (
                          <CheckCircle size={14} className="text-blue-600 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </nav>

        <div className="absolute bottom-0 w-full p-3 border-t dark:border-gray-700">
          <div className="flex items-center gap-2 p-2 mb-2 rounded-lg bg-gray-50 dark:bg-gray-700/30">
            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-semibold">
              {user.displayName?.[0] || user.email?.[0] || 'U'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800 dark:text-white truncate">
                  {user.displayName || 'Usuario'}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 p-2 w-full rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors text-sm"
          >
            <LogOut size={16} />
            {sidebarOpen && (
              <motion.span animate={{ opacity: sidebarOpen ? 1 : 0 }}>
                Cerrar Sesión
              </motion.span>
            )}
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
          sidebarOpen && !isMobile ? 'ml-[280px]' : !isMobile ? 'ml-[80px]' : 'ml-0'
        }`}
      >
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {navItems.find(item => isActiveRoute(item.href))?.label || 'Dashboard'}
                </h1>
                {tieneMultiplesNegocios && (
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Negocio: {negocioActivoNombre}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Indicador de negocio activo */}
              {tieneMultiplesNegocios && (
                <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  <Building size={12} />
                  <span className="max-w-[80px] truncate">{negocioActivoNombre}</span>
                </div>
              )}
              <ThemeSelector 
                currentTheme={logoTheme} 
                onThemeChange={setLogoTheme} 
              />
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}