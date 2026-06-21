'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check } from 'lucide-react';
import { LOGO_THEMES, LogoTheme } from './Logo';

interface ThemeSelectorProps {
  currentTheme: LogoTheme;
  onThemeChange: (theme: LogoTheme) => void;
}

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const themes = Object.keys(LOGO_THEMES) as LogoTheme[];
  const themeColors = LOGO_THEMES[currentTheme];

  return (
    <div className="relative">
      {/* Botón para abrir selector */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
          isOpen 
            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
        }`}
      >
        <Palette size={18} />
        <span className="text-sm font-medium hidden sm:inline">Tema</span>
        <div 
          className="w-4 h-4 rounded-full border border-gray-200 dark:border-gray-600"
          style={{ background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` }}
        />
      </button>

      {/* Dropdown de temas */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-50"
          >
            <div className="space-y-1">
              {themes.map((themeKey) => {
                const colors = LOGO_THEMES[themeKey];
                const isActive = currentTheme === themeKey;
                
                return (
                  <button
                    key={themeKey}
                    onClick={() => {
                      console.log('🎨 Cambiando tema a:', themeKey);
                      onThemeChange(themeKey);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/30'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {/* Vista previa del tema */}
                    <div className="flex items-center gap-2 flex-1">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ 
                          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` 
                        }}
                      >
                        <span className="text-white text-xs font-bold">T</span>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-800 dark:text-white capitalize">
                          {themeKey}
                        </p>
                        <div className="flex gap-1 mt-0.5">
                          <div 
                            className="w-3 h-3 rounded-full border border-gray-200 dark:border-gray-600"
                            style={{ background: colors.primary }}
                          />
                          <div 
                            className="w-3 h-3 rounded-full border border-gray-200 dark:border-gray-600"
                            style={{ background: colors.secondary }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {isActive && (
                      <Check size={16} className="text-blue-600 dark:text-blue-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}