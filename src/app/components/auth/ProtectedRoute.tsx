// components/auth/ProtectedRoute.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('cliente' | 'contratista' | 'admin')[];
  redirectTo?: string;
}

export const ProtectedRoute = ({ 
  children, 
  allowedRoles = [],
  redirectTo = '/login' 
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }

    if (!loading && user && allowedRoles.length > 0) {
      // Aquí verificaremos el rol del usuario (lo implementaremos después)
      // Por ahora, solo redirigimos si no tiene el rol permitido
    }
  }, [user, loading, router, redirectTo, allowedRoles]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};