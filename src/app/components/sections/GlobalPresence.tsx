// components/sections/GlobalPresence.tsx
'use client';
import { MapPin, CheckCircle } from 'lucide-react';

const countries = [
  { name: 'Estados Unidos', flag: '🇺🇸', projects: 120 },
  { name: 'México', flag: '🇲🇽', projects: 85 },
  { name: 'Colombia', flag: '🇨🇴', projects: 95 },
  { name: 'Argentina', flag: '🇦🇷', projects: 70 },
  { name: 'Chile', flag: '🇨🇱', projects: 60 },
  { name: 'España', flag: '🇪🇸', projects: 45 },
  { name: 'Brasil', flag: '🇧🇷', projects: 80 },
  { name: 'Canadá', flag: '🇨🇦', projects: 35 },
  { name: 'Perú', flag: '🇵🇪', projects: 50 },
  { name: 'Ecuador', flag: '🇪🇨', projects: 40 }
];

export const GlobalPresence = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-900 to-slate-900 text-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Presencia Global
            </h2>
            <div className="w-20 h-1 bg-amber-500 mb-6" />
            <p className="text-xl text-gray-300 mb-6">
              Operamos en más de 50 países con estándares internacionales de calidad
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <CheckCircle size={24} className="text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Equipo internacional</h3>
                  <p className="text-gray-300">Profesionales certificados en cada país</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle size={24} className="text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Materiales locales e importados</h3>
                  <p className="text-gray-300">Optimización de costos y tiempos</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle size={24} className="text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Certificaciones internacionales</h3>
                  <p className="text-gray-300">Cumplimos con regulaciones locales</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold mb-2">+500</div>
              <div className="text-gray-300">Proyectos completados internacionalmente</div>
              <div className="text-sm text-gray-400 mt-2">Satisfacción garantizada</div>
            </div>
          </div>
          
          {/* Right Content - Countries Grid */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <MapPin size={20} className="mr-2 text-amber-500" />
              Países con mayor presencia
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {countries.map((country, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white/10 rounded-lg p-3 hover:bg-white/20 transition"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{country.flag}</span>
                    <span className="font-medium">{country.name}</span>
                  </div>
                  <span className="text-sm text-amber-400">{country.projects} proyectos</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center text-sm text-gray-300">
              +40 países adicionales con proyectos activos
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};