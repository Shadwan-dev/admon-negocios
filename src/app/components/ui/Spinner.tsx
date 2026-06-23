'use client';

import { motion } from 'framer-motion';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  fullScreen?: boolean;
}

export function Spinner({ size = 'md', label = 'Cargando...', fullScreen = false }: SpinnerProps) {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-14 h-14 border-4',
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-50'
    : 'flex flex-col items-center gap-3 py-12';

  return (
    <div className={containerClasses}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`${sizes[size]} border-blue-600 border-t-transparent rounded-full`}
      />
      {label && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      )}
    </div>
  );
}