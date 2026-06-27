// components/ui/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Menu, 
  X, 
  User, 
  LogIn, 
  UserPlus, 
  ChevronDown,
  Home,
  Wrench,
  FolderGit2,
  Package,
  Phone,
  Building2,
  Globe2,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  Plus,
  Store
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { logoutUser } from '@/lib/firebase/auth';
import { Logo } from './Logo';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
    setIsAuthOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push('/');
      setIsAuthOpen(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const navItems = [
    { name: 'Inicio', href: '/', icon: Home },
    { 
      name: 'Servicios', 
      href: '/servicios',
      icon: Wrench,
      dropdown: [
        { name: 'Construcción Residencial', href: '/servicios/residencial' },
        { name: 'Proyectos Comerciales', href: '/servicios/comercial' },
        { name: 'Remodelaciones', href: '/servicios/remodelaciones' },
        { name: 'Instalaciones Hidráulicas', href: '/servicios/hidraulica' },
        { name: 'Instalaciones Eléctricas', href: '/servicios/electricidad' },
        { name: 'Acabados de Lujo', href: '/servicios/acabados' },
        { name: 'Diseño Arquitectónico', href: '/servicios/diseno' },
      ]
    },
    { name: 'Proyectos', href: '/proyectos', icon: FolderGit2 },
    { name: 'Paquetes', href: '/paquetes', icon: Package },
    { name: 'Contacto', href: '/contacto', icon: Phone },
  ];

  const isActive = (href: string) => pathname === href;

  // Si estamos en la página de inicio, no mostrar ciertos enlaces
  const isHomePage = pathname === '/';

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-gray-200/20 dark:border-gray-700/20' 
          : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Logo size="md" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {/* Enlaces principales */}
              <Link 
                href="/tienda" 
                className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                  isActive('/tienda') 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
                }`}
              >
                <ShoppingBag size={16} />
                Tienda
              </Link>

              {user && (
                <Link 
                  href="/publicar" 
                  className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                    isActive('/publicar') 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
                  }`}
                >
                  <Plus size={16} />
                  Publicar
                </Link>
              )}

              {user && (
                <Link 
                  href="/dashboard" 
                  className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                    isActive('/dashboard') 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
                  }`}
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
              )}

              {/* Enlaces de servicios (solo en home) */}
              {isHomePage && (
                <>
                  {navItems.slice(1).map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </>
              )}
            </div>

            {/* Right side - Auth & Actions */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Cerrar sesión"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors text-sm font-medium"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg text-sm font-medium"
                  >
                    Empezar Gratis
                  </Link>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden fixed inset-x-0 top-16 bg-white dark:bg-gray-900 shadow-2xl transform transition-all duration-500 ease-in-out ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
        }`}>
          <div className="max-h-[calc(100vh-4rem)] overflow-y-auto p-4 space-y-2">
            <Link
              href="/tienda"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingBag size={20} />
              <span>Tienda</span>
            </Link>

            {user && (
              <>
                <Link
                  href="/publicar"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Plus size={20} />
                  <span>Publicar</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard size={20} />
                  <span>Dashboard</span>
                </Link>
              </>
            )}

            {isHomePage && (
              <>
                <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </>
            )}

            <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />
            
            {!user && (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <LogIn size={20} />
                  <span>Iniciar Sesión</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <UserPlus size={20} />
                  <span>Empezar Gratis</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content overlap */}
      <div className="h-16" />
    </>
  );
};