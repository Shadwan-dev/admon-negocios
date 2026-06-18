// components/ui/Navbar.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
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
  LayoutDashboard,
  Globe2,
  LogOut // ← Agregamos LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { logoutUser } from '@/lib/firebase/auth';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  
  const { user, loading } = useAuth();
  
  // Refs para manejar el timeout del dropdown
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const authTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Limpiar timeouts al desmontar
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
      if (authTimeoutRef.current) clearTimeout(authTimeoutRef.current);
    };
  }, []);

  const handleDropdownEnter = (name: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(name);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const handleAuthEnter = () => {
    if (authTimeoutRef.current) clearTimeout(authTimeoutRef.current);
    setIsAuthOpen(true);
  };

  const handleAuthLeave = () => {
    authTimeoutRef.current = setTimeout(() => {
      setIsAuthOpen(false);
    }, 200);
  };

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
    { 
      name: 'Inicio', 
      href: '/', 
      icon: Home,
      description: 'Página principal'
    },
    { 
      name: 'Servicios', 
      href: '/servicios',
      icon: Wrench,
      description: 'Lo que ofrecemos',
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
    { 
      name: 'Proyectos', 
      href: '/proyectos', 
      icon: FolderGit2,
      description: 'Nuestro trabajo'
    },
    { 
      name: 'Paquetes', 
      href: '/paquetes', 
      icon: Package,
      description: 'Planes y precios'
    },
    { 
      name: 'Contacto', 
      href: '/contacto', 
      icon: Phone,
      description: 'Escríbenos'
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl border-b border-gray-200/20 dark:border-gray-700/20' 
          : 'bg-gradient-to-b from-black/30 to-transparent backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            
            {/* Logo */}
            <Link href="/" className="group relative flex items-center space-x-3">
              <div className="relative w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                <Building2 className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg lg:text-xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-amber-500 bg-clip-text text-transparent">
                  BuildMaster
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                  Global Construction
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.dropdown && handleDropdownEnter(item.name)}
                  onMouseLeave={handleDropdownLeave}
                >
                  {item.dropdown ? (
                    <>
                      <button
                        className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2 group ${
                          isActive(item.href)
                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                            : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                        }`}
                      >
                        <item.icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                        <span>{item.name}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                          activeDropdown === item.name ? 'rotate-180' : ''
                        }`} />
                      </button>

                      {/* Dropdown menu */}
                      {activeDropdown === item.name && (
                        <div 
                          className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                          onMouseEnter={() => handleDropdownEnter(item.name)}
                          onMouseLeave={handleDropdownLeave}
                        >
                          <div className="p-2">
                            <div className="px-3 py-2 mb-1">
                              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Nuestros Servicios
                              </p>
                            </div>
                            {item.dropdown.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="block px-4 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all duration-200"
                                onClick={() => setActiveDropdown(null)}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2 group ${
                        isActive(item.href)
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <item.icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Right side - Auth & Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Global presence indicator - versión simplificada sin componente duplicado */}
              <div className="flex items-center space-x-1 px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full">
                <Globe2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm text-green-700 dark:text-green-300">Global</span>
              </div>

              {/* Auth Dropdown */}
              <div 
                className="relative"
                onMouseEnter={handleAuthEnter}
                onMouseLeave={handleAuthLeave}
              >
                <button
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <User className="w-4 h-4" />
                  <span>Mi Cuenta</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isAuthOpen ? 'rotate-180' : ''}`} />
                </button>

                {isAuthOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                    onMouseEnter={handleAuthEnter}
                    onMouseLeave={handleAuthLeave}
                  >
                    {loading ? (
                      <div className="p-4 text-center">
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                      </div>
                    ) : user ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {user.displayName || user.email || 'Usuario'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                        >
                          <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span>Cerrar Sesión</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => router.push('/login')}
                          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                        >
                          <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span>Iniciar Sesión</span>
                        </button>
                        <button
                          onClick={() => router.push('/register')}
                          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                        >
                          <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span>Registrarse</span>
                        </button>
                      </>
                    )}
                    
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-700" />
                    
                    <div className="p-3 bg-gray-50 dark:bg-slate-900/50">
                      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                        ¿Necesitas ayuda profesional?
                      </p>
                      <Link
                        href="/contacto"
                        className="text-xs text-center text-blue-600 dark:text-blue-400 font-medium mt-1 block hover:underline"
                        onClick={() => setIsAuthOpen(false)}
                      >
                        Cotiza tu proyecto aquí →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden fixed inset-x-0 top-16 bg-white dark:bg-slate-900 shadow-2xl transform transition-all duration-500 ease-in-out ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
        }`}>
          <div className="max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <div key={item.name}>
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                      </button>
                      {activeDropdown === item.name && (
                        <div className="ml-8 mt-1 space-y-1">
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="block px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                              onClick={() => setIsOpen(false)}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
              
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Cerrar Sesión</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => router.push('/login')}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg"
                    >
                      <User className="w-5 h-5" />
                      <span>Iniciar Sesión</span>
                    </button>
                    <button
                      onClick={() => router.push('/register')}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl"
                    >
                      <UserPlus className="w-5 h-5" />
                      <span>Registrarse</span>
                    </button>
                  </>
                )}
                {user && (
  <>
    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
      <p className="font-medium text-gray-900 dark:text-white truncate">
        {user.displayName || user.email || 'Usuario'}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
        {user.email}
      </p>
    </div>
    <Link
      href="/dashboard"
      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
    >
      <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform" />
      <span>Dashboard</span>
    </Link>
    <Link
      href="/proyectos"
      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
    >
      <FolderGit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
      <span>Mis Proyectos</span>
    </Link>
    <button
      onClick={handleLogout}
      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
    >
      <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
      <span>Cerrar Sesión</span>
    </button>
  </>
)}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content overlap */}
      <div className="h-16 lg:h-20" />
    </>
  );
};