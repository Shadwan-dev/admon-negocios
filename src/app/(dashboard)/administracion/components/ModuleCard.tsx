'use client';

import { motion } from 'framer-motion';
import { Check, Plus, Lock, AlertCircle, Database, Shield } from 'lucide-react';
import { Module } from '../../../../../lib/modules/types';

interface ModuleCardProps {
  module: Module;
  isActive: boolean;
  isRequired?: boolean;
  hasData?: boolean;
  dataCount?: number;
  onToggle: () => void;
  onForceToggle?: () => void;
}

export function ModuleCard({ 
  module, 
  isActive, 
  isRequired = false, 
  hasData = false,
  dataCount = 0,
  onToggle,
  onForceToggle
}: ModuleCardProps) {
  // Obtener color de categoría
  const getCategoryColor = (categoria: string) => {
    const colors: Record<string, string> = {
      administracion: 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 text-blue-600',
      operaciones: 'border-green-200 bg-green-50 dark:bg-green-900/20 text-green-600',
      finanzas: 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600',
      recursos: 'border-purple-200 bg-purple-50 dark:bg-purple-900/20 text-purple-600',
    };
    return colors[categoria] || 'border-gray-200 bg-gray-50 dark:bg-gray-700/30 text-gray-600';
  };

  const canToggle = !isRequired && !(isActive && hasData);
  const showDataWarning = isActive && hasData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={canToggle ? { scale: 1.02 } : {}}
      className={`
        relative p-4 rounded-xl border-2 transition-all cursor-pointer
        ${isActive 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm' 
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
        }
        ${!canToggle && isActive && hasData ? 'opacity-90' : ''}
        ${isRequired ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-md'}
      `}
      onClick={canToggle ? onToggle : undefined}
    >
      <div className="flex items-start gap-4">
        {/* Icono */}
        <div className="text-3xl flex-shrink-0">{module.icono}</div>
        
        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-800 dark:text-white text-sm">
              {module.nombre}
            </h3>
            
            {/* Badge de datos */}
            {hasData && isActive && (
              <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Database size={12} />
                {dataCount}
              </span>
            )}
            
            {isRequired && (
              <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <Shield size={10} />
                Obligatorio
              </span>
            )}
            
            <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(module.categoria)}`}>
              {module.categoria}
            </span>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {module.descripcion}
          </p>
          
          {module.dependencias && module.dependencias.length > 0 && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
              <AlertCircle size={12} />
              Depende de: {module.dependencias.join(', ')}
            </p>
          )}

          {/* Mensaje de datos en uso */}
          {showDataWarning && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
              <Database size={12} />
              {dataCount} registros - No se puede desactivar
            </p>
          )}
        </div>

        {/* Estado */}
        <div className="flex-shrink-0">
          {isRequired ? (
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <Lock size={16} className="text-gray-400" />
            </div>
          ) : isActive ? (
            <div className={`w-8 h-8 rounded-full ${hasData ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-blue-100 dark:bg-blue-900/30'} flex items-center justify-center`}>
              <Check size={18} className={hasData ? 'text-amber-600' : 'text-blue-600'} />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-gray-200">
              <Plus size={18} className="text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Barra de estado */}
      {isActive && (
        <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl ${hasData ? 'bg-amber-500' : 'bg-blue-500'}`} />
      )}
    </motion.div>
  );
}