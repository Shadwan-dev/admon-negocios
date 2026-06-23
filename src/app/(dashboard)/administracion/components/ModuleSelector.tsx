'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Database, AlertCircle } from 'lucide-react';
import { ModuleId } from '../../../../../lib/modules/types';
import { MODULOS_DISPONIBLES, MODULOS_OBLIGATORIOS } from '../../../../../lib/modules/config';
import { ModuleCard } from './ModuleCard';

interface ModuleSelectorProps {
  selectedModules: ModuleId[];
  onToggle: (moduleId: ModuleId) => void;
  onSave: () => void;
  loading?: boolean;
  saving?: boolean;
  moduleDataStatus?: Record<ModuleId, { hasData: boolean; count: number; message: string }> | null;
  loadingData?: boolean;
}

export function ModuleSelector({ 
  selectedModules, 
  onToggle, 
  onSave, 
  loading,
  saving,
  moduleDataStatus = null, // ✅ Cambiar a null en lugar de {}
  loadingData = false
}: ModuleSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('todos');

  const categories = ['todos', ...new Set(MODULOS_DISPONIBLES.map(m => m.categoria))];

  const filteredModules = MODULOS_DISPONIBLES.filter(m => {
    const matchesSearch = m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'todos' || m.categoria === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryLabels: Record<string, string> = {
    administracion: 'Administración',
    operaciones: 'Operaciones',
    finanzas: 'Finanzas',
    recursos: 'Recursos Humanos',
    todos: 'Todos los módulos'
  };

  // ✅ Calcular módulos con datos de forma segura
  const modulesWithData = moduleDataStatus 
    ? Object.values(moduleDataStatus).filter(status => status?.hasData).length 
    : 0;

  return (
    <div className="space-y-5">
      {/* Indicador de datos */}
      {loadingData ? (
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          Verificando datos...
        </div>
      ) : modulesWithData > 0 && (
        <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
          <Database size={16} />
          <span>{modulesWithData} módulos tienen datos asociados y no pueden desactivarse</span>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar módulos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors
                ${filterCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }
              `}
            >
              {categoryLabels[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de módulos */}
      {filteredModules.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <Search size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No se encontraron módulos que coincidan con tu búsqueda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredModules.map((module, index) => {
            const isActive = selectedModules.includes(module.id);
            const isRequired = MODULOS_OBLIGATORIOS.includes(module.id);
            const dataStatus = moduleDataStatus?.[module.id];

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ModuleCard
                  module={module}
                  isActive={isActive}
                  isRequired={isRequired}
                  hasData={dataStatus?.hasData || false}
                  dataCount={dataStatus?.count || 0}
                  onToggle={() => onToggle(module.id)}
                />
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Resumen */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>{selectedModules.length} módulos activos</span>
          {modulesWithData > 0 && (
            <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Database size={14} />
              {modulesWithData} con datos
            </span>
          )}
        </div>
        <button
          onClick={onSave}
          disabled={saving || loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Guardando...
            </>
          ) : (
            'Guardar Cambios'
          )}
        </button>
      </div>
    </div>
  );
}