// components/ui/GlobalPresence.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  Globe2, 
  Clock, 
  Users, 
  Building2, 
  ChevronDown,
  Award
} from 'lucide-react';
import Link from 'next/link';

// Datos de presencia global
const globalData = {
  paises: [
    { nombre: 'Estados Unidos', flag: '🇺🇸', proyectos: 120, ciudad: 'Miami' },
    { nombre: 'México', flag: '🇲🇽', proyectos: 85, ciudad: 'Ciudad de México' },
    { nombre: 'Colombia', flag: '🇨🇴', proyectos: 95, ciudad: 'Bogotá' },
    { nombre: 'Argentina', flag: '🇦🇷', proyectos: 70, ciudad: 'Buenos Aires' },
    { nombre: 'Chile', flag: '🇨🇱', proyectos: 60, ciudad: 'Santiago' },
    { nombre: 'España', flag: '🇪🇸', proyectos: 45, ciudad: 'Madrid' },
    { nombre: 'Brasil', flag: '🇧🇷', proyectos: 80, ciudad: 'São Paulo' },
    { nombre: 'Canadá', flag: '🇨🇦', proyectos: 35, ciudad: 'Toronto' },
    { nombre: 'Perú', flag: '🇵🇪', proyectos: 50, ciudad: 'Lima' },
    { nombre: 'Ecuador', flag: '🇪🇨', proyectos: 40, ciudad: 'Quito' }
  ],
  stats: {
    totalProyectos: 500,
    paisesTotales: 50,
    profesionales: 200,
    añosExperiencia: 15
  }
};

export const GlobalPresence = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(globalData.paises[0]);
  const [currentTime, setCurrentTime] = useState('');
  
  // Ref para el timeout
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'America/New_York'
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200); // 200ms de gracia
  };

  const topCountries = globalData.paises.slice(0, 5);

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Botón Global */}
      <button
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
          isOpen 
            ? 'bg-blue-600 text-white shadow-lg' 
            : 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-800/30 text-green-700 dark:text-green-300'
        }`}
      >
        <div className="relative">
          <Globe2 className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-12' : ''}`} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </div>
        <span className="text-sm font-medium">Global</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Global */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Cabecera con estadísticas */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold flex items-center">
                <Globe2 className="w-4 h-4 mr-2" />
                Presencia Global
              </h4>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                {globalData.stats.paisesTotales}+ países
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <div className="font-bold text-lg">{globalData.stats.totalProyectos}+</div>
                <div className="text-blue-100">Proyectos</div>
              </div>
              <div>
                <div className="font-bold text-lg">{globalData.stats.profesionales}+</div>
                <div className="text-blue-100">Profesionales</div>
              </div>
              <div>
                <div className="font-bold text-lg">{globalData.stats.añosExperiencia}</div>
                <div className="text-blue-100">Años</div>
              </div>
            </div>
          </div>

          {/* Países destacados */}
          <div className="p-4">
            <h5 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Presencia en el Mundo
            </h5>
            <div className="space-y-1">
              {topCountries.map((pais, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition cursor-pointer"
                  onMouseEnter={() => setSelectedCountry(pais)}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{pais.flag}</span>
                    <div>
                      <span className="font-medium text-sm text-gray-900 dark:text-white">{pais.nombre}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({pais.ciudad})</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{pais.proyectos}</span>
                    <span className="text-xs text-gray-400">proy.</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Ver todos los países */}
            <Link
              href="/presencia-global"
              className="mt-3 text-center block text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
              onClick={() => setIsOpen(false)}
            >
              Ver todos los países →
            </Link>
          </div>

          {/* Info adicional */}
          <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-slate-900/50 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">
                Hora global: {currentTime}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Award className="w-3 h-3 text-amber-500" />
              <span className="text-gray-500 dark:text-gray-400">ISO 9001</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};