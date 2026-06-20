'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// ============================================
// CONTEXTO DE TEMA (reemplaza next-themes)
// ============================================
type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// ============================================
// TOAST SIMPLE (reemplaza react-hot-toast)
// ============================================
type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

export function showToast({ message, type = 'info', duration = 4000 }: ToastOptions) {
  const emojis = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };
  
  // Usar alert para mostrar mensajes (simple pero funcional)
  // En producción, puedes reemplazar con un componente personalizado
  console.log(`${emojis[type]} ${message}`);
  
  // También mostrar en UI con alert (temporal)
  // alert(`${emojis[type]} ${message}`);
  
  // Podríamos crear un estado global para mostrar toasts en UI
  // pero por ahora usamos console + alert simple
}

// Componente Toaster (placeholder)
export function Toaster() {
  return null;
}

// ============================================
// PROVIDER PRINCIPAL
// ============================================
interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Detectar tema del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
    };

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Aplicar tema al DOM
  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme === 'system' ? resolvedTheme === 'dark' : theme === 'dark';
    
    root.classList.toggle('dark', isDark);
  }, [theme, resolvedTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}