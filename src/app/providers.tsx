'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { LogoTheme } from './components/ui/Logo';

// ============================================
// CONTEXTO PARA EL TEMA DEL LOGO
// ============================================
interface LogoThemeContextType {
  logoTheme: LogoTheme;
  setLogoTheme: (theme: LogoTheme) => void;
}

const LogoThemeContext = createContext<LogoThemeContextType | undefined>(undefined);

export function useLogoTheme() {
  const context = useContext(LogoThemeContext);
  if (context === undefined) {
    throw new Error('useLogoTheme must be used within a Providers');
  }
  return context;
}

// ============================================
// CONTEXTO DE TEMA (claro/oscuro)
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
// TOAST SIMPLE
// ============================================
type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

export function showToast({ message, type = 'info' }: ToastOptions) {
  const emojis = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };
  console.log(`${emojis[type]} ${message}`);
}

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
  // Tema del sistema (claro/oscuro)
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Tema del logo
  const [logoTheme, setLogoTheme] = useState<LogoTheme>('default');

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

  // Cargar tema del logo guardado
  useEffect(() => {
    const saved = localStorage.getItem('tinker-logo-theme') as LogoTheme;
    if (saved) {
      setLogoTheme(saved);
    }
  }, []);

  // Guardar tema del logo cuando cambia
  const handleSetLogoTheme = (newTheme: LogoTheme) => {
    setLogoTheme(newTheme);
    localStorage.setItem('tinker-logo-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      <LogoThemeContext.Provider value={{ logoTheme, setLogoTheme: handleSetLogoTheme }}>
        {children}
      </LogoThemeContext.Provider>
    </ThemeContext.Provider>
  );
}