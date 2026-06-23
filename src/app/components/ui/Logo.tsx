'use client';

import { useState, useEffect } from 'react';

// Definir los temas disponibles
export const LOGO_THEMES = {
  default: {
    primary: '#2563EB',    // Azul
    secondary: '#7C3AED',  // Púrpura
    gradient: 'from-blue-600 to-purple-600',
    text: 'text-gray-800 dark:text-white',
    primaryLight: 'blue',
    secondaryLight: 'purple',
  },
  ocean: {
    primary: '#0891B2',    // Cian
    secondary: '#0E7490',  // Azul profundo
    gradient: 'from-cyan-600 to-blue-700',
    text: 'text-gray-800 dark:text-white',
    primaryLight: 'cyan',
    secondaryLight: 'blue',
  },
  sunset: {
    primary: '#EA580C',    // Naranja
    secondary: '#DC2626',  // Rojo
    gradient: 'from-orange-500 to-red-600',
    text: 'text-gray-800 dark:text-white',
    primaryLight: 'orange',
    secondaryLight: 'red',
  },
  emerald: {
    primary: '#059669',    // Verde esmeralda
    secondary: '#047857',  // Verde oscuro
    gradient: 'from-emerald-500 to-green-700',
    text: 'text-gray-800 dark:text-white',
    primaryLight: 'emerald',
    secondaryLight: 'green',
  },
  royal: {
    primary: '#7C3AED',    // Púrpura
    secondary: '#4F46E5',  // Índigo
    gradient: 'from-purple-500 to-indigo-600',
    text: 'text-gray-800 dark:text-white',
    primaryLight: 'purple',
    secondaryLight: 'indigo',
  },
  midnight: {
    primary: '#0F172A',    // Azul oscuro
    secondary: '#1E293B',  // Gris oscuro
    gradient: 'from-slate-800 to-slate-900',
    text: 'text-white',
    primaryLight: 'slate',
    secondaryLight: 'gray',
  },
};

export type LogoTheme = keyof typeof LOGO_THEMES;

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';  // ✅ Agregar 'xs'
  theme?: LogoTheme;
  variant?: 'default' | 'minimal' | 'gradient';
}

export function Logo({ 
  className = '', 
  showText = true, 
  size = 'md',
  theme = 'default',
  variant = 'default'
}: LogoProps) {
  const [currentTheme, setCurrentTheme] = useState<LogoTheme>(theme);

  useEffect(() => {
    setCurrentTheme(theme);
    applyThemeColors(theme);
  }, [theme]);

  const applyThemeColors = (themeKey: LogoTheme) => {
    const colors = LOGO_THEMES[themeKey];
    const root = document.documentElement;
    
    root.style.setProperty('--theme-primary', colors.primary);
    root.style.setProperty('--theme-secondary', colors.secondary);
    root.style.setProperty('--theme-primary-light', colors.primaryLight);
    root.style.setProperty('--theme-secondary-light', colors.secondaryLight);
    
    document.body.setAttribute('data-theme', themeKey);
  };

  const themeColors = LOGO_THEMES[currentTheme];
  
  // ✅ Agregar 'xs' con tamaño 20
  const sizes = {
    xs: { icon: 20, text: 'text-xs' },      // ✅ NUEVO
    sm: { icon: 28, text: 'text-lg' },
    md: { icon: 36, text: 'text-xl' },
    lg: { icon: 48, text: 'text-2xl' },
    xl: { icon: 64, text: 'text-4xl' },
  };

  const { icon, text } = sizes[size] || sizes.md; // ✅ Fallback por seguridad

  const renderLogoIcon = () => {
    if (variant === 'gradient') {
      return (
        <svg 
          width={icon} 
          height={icon} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={`bg-gradient-to-br ${themeColors.gradient} rounded-lg p-1 text-white shadow-md`}
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      );
    }

    if (variant === 'minimal') {
      return (
        <svg 
          width={icon} 
          height={icon} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={className || `text-${themeColors.primaryLight}-600`}
        >
          <path d="M4 20h16" />
          <path d="M12 4v16" />
          <path d="M4 12h16" />
        </svg>
      );
    }

    return (
      <svg 
        width={icon} 
        height={icon} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={className || `text-${themeColors.primaryLight}-600`}
      >
        <path d="M4 4h16" stroke={themeColors.primary} />
        <path d="M12 4v16" stroke={themeColors.secondary} />
        <path d="M8 8l4 4 4-4" stroke={themeColors.secondary} strokeWidth="1.5" opacity="0.5" />
        <circle cx="12" cy="12" r="2" stroke={themeColors.primary} strokeWidth="1.5" fill="none" />
      </svg>
    );
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {renderLogoIcon()}
      
      {showText && (
        <span className={`font-bold ${text} ${themeColors.text}`}>
          Tinker
        </span>
      )}
    </div>
  );
}