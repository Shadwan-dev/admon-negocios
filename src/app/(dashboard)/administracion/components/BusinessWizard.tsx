'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Check, 
  Sparkles, 
  Building,
  Store,
  Coffee,
  ShoppingBag,
  Briefcase,
  Home
} from 'lucide-react';
import { TIPOS_NEGOCIO } from '../../../../../lib/modules/config';
import { TipoNegocio } from '../../../../../lib/modules/types';

interface BusinessWizardProps {
  onComplete: (data: { nombre: string; tipo: TipoNegocio }) => void;
  loading?: boolean;
}

// Iconos para tipos de negocio
const TIPO_ICONS: Record<string, any> = {
  restaurante: Coffee,
  tienda: Store,
  supermercado: ShoppingBag,
  farmacia: Briefcase,
  taller: Home,
  otros: Building,
};

export function BusinessWizard({ onComplete, loading }: BusinessWizardProps) {
  const [step, setStep] = useState(1);
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<TipoNegocio>('otros');

  const handleNext = () => {
    if (step === 1 && nombre.trim()) {
      setStep(2);
    }
  };

  const handleComplete = () => {
    if (nombre.trim() && tipo) {
      onComplete({ nombre, tipo });
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header con progreso */}
          <div className="px-8 pt-8 pb-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all
                    ${step >= s 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                    }
                  `}>
                    {step > s ? <Check size={18} /> : s}
                  </div>
                  {s < 2 && (
                    <div className={`
                      w-16 h-0.5 mx-2 transition-all
                      ${step > s ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                    `} />
                  )}
                </div>
              ))}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {step === 1 ? 'Configura tu negocio' : '¡Ya casi terminas!'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {step === 1 
                  ? 'Cuéntanos sobre tu negocio para personalizar Tinker' 
                  : 'Selecciona el tipo de negocio para recomendarte los mejores módulos'
                }
              </p>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-4xl">
                      🏪
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Nombre de tu negocio *
                    </label>
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ej: Mi Restaurante, Tienda Don Juan..."
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-lg"
                      onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                      autoFocus
                    />
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                      Este nombre aparecerá en toda la plataforma
                    </p>
                  </div>
                  <button
                    onClick={handleNext}
                    disabled={!nombre.trim()}
                    className="mt-2 w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all flex items-center justify-center gap-2 font-medium shadow-lg shadow-blue-600/20"
                  >
                    Continuar
                    <ArrowRight size={18} />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-2">
                    Selecciona el tipo que mejor describa tu negocio
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(TIPOS_NEGOCIO).map(([key, value]) => {
                      const Icon = TIPO_ICONS[key] || Building;
                      const isSelected = tipo === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setTipo(key as TipoNegocio)}
                          className={`
                            p-4 rounded-xl border-2 transition-all text-center group
                            ${isSelected
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                            }
                          `}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className={`
                              w-12 h-12 rounded-full flex items-center justify-center transition-all
                              ${isSelected 
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' 
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 group-hover:text-gray-600'
                              }
                            `}>
                              <Icon size={24} />
                            </div>
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              {value.nombre}
                            </p>
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-blue-600" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={handleComplete}
                    disabled={!tipo || loading}
                    className="mt-2 w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all flex items-center justify-center gap-2 font-medium shadow-lg shadow-blue-600/20"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Sparkles size={18} />
                        Comenzar con Tinker
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400 dark:text-gray-500 flex justify-between">
            <span>Paso {step} de 2</span>
            <span>{nombre ? `"${nombre}"` : 'Sin nombre'}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}