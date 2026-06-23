import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUsuarioById } from './lib/firebase/usuarios';
import { Permisos } from './lib/firebase/usuarios';

// Rutas públicas (no requieren autenticación)
const PUBLIC_PATHS = ['/', '/login', '/register', '/reset-password'];

// Rutas protegidas que requieren permisos específicos
const PROTECTED_PATHS = [
  '/negocio',
  '/dashboard',
  '/administracion',
  '/productos',
  '/ventas',
  '/produccion',
  '/caja',
  '/empleados',
  '/clientes',
  '/proveedores',
  '/compras',
  '/reportes',
  '/fichas-costo',
];

// Mapeo de módulos a permisos
const MODULE_PERMISSIONS: Record<string, keyof Permisos> = {
  '/negocio': 'inventario',
  '/productos': 'inventario',
  '/ventas': 'ventas',
  '/produccion': 'produccion',
  '/caja': 'caja',
  '/empleados': 'empleados',
  '/clientes': 'clientes',
  '/proveedores': 'proveedores',
  '/compras': 'compras',
  '/reportes': 'reportes',
  '/fichas-costo': 'fichas_costo',
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Obtener token de Firebase de las cookies
  const session = request.cookies.get('session')?.value;
  const isAuthenticated = !!session;

  // Rutas públicas
  if (PUBLIC_PATHS.includes(pathname)) {
    if (isAuthenticated && pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    if (isAuthenticated && PUBLIC_PATHS.includes(pathname) && pathname !== '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verificar permisos para rutas protegidas
  try {
    // Obtener usuario de Firestore
    const userData = await getUsuarioById(session);
    
    if (!userData || !userData.activo) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('session');
      return response;
    }

    // Si es admin o gerente, tiene acceso a todo
    if (userData.rol === 'admin' || userData.rol === 'gerente') {
      return NextResponse.next();
    }

    // Verificar permisos específicos para cada ruta
    const moduleKey = Object.keys(MODULE_PERMISSIONS).find(key => pathname.startsWith(key));
    
    if (moduleKey) {
      const permissionKey = MODULE_PERMISSIONS[moduleKey];
      // ✅ Usar el tipado correcto para acceder a permisos
      const hasPermission = userData.permisos?.[permissionKey as keyof Permisos] || false;
      
      if (!hasPermission) {
        return NextResponse.redirect(new URL('/negocio', request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Error en middleware:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/reset-password',
    '/dashboard/:path*',
    '/negocio/:path*',
    '/administracion/:path*',
    '/productos/:path*',
    '/ventas/:path*',
    '/produccion/:path*',
    '/caja/:path*',
    '/empleados/:path*',
    '/clientes/:path*',
    '/proveedores/:path*',
    '/compras/:path*',
    '/reportes/:path*',
    '/fichas-costo/:path*',
  ],
};