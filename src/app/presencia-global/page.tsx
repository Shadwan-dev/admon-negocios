// app/presencia-global/page.tsx
'use client';  // ← Agregar esta línea al inicio
import { useState } from 'react';  // ← Importar useState
import Link from 'next/link';
import { MapPin, Globe2, Users, Building2, Award } from 'lucide-react';

const paisesData = [
  { nombre: 'Estados Unidos', flag: '🇺🇸', proyectos: 120, ciudad: 'Miami', continente: 'América' },
  { nombre: 'México', flag: '🇲🇽', proyectos: 85, ciudad: 'Ciudad de México', continente: 'América' },
  { nombre: 'Colombia', flag: '🇨🇴', proyectos: 95, ciudad: 'Bogotá', continente: 'América' },
  { nombre: 'Argentina', flag: '🇦🇷', proyectos: 70, ciudad: 'Buenos Aires', continente: 'América' },
  { nombre: 'Chile', flag: '🇨🇱', proyectos: 60, ciudad: 'Santiago', continente: 'América' },
  { nombre: 'Perú', flag: '🇵🇪', proyectos: 50, ciudad: 'Lima', continente: 'América' },
  { nombre: 'Ecuador', flag: '🇪🇨', proyectos: 40, ciudad: 'Quito', continente: 'América' },
  { nombre: 'Brasil', flag: '🇧🇷', proyectos: 80, ciudad: 'São Paulo', continente: 'América' },
  { nombre: 'España', flag: '🇪🇸', proyectos: 45, ciudad: 'Madrid', continente: 'Europa' },
  { nombre: 'Francia', flag: '🇫🇷', proyectos: 25, ciudad: 'París', continente: 'Europa' },
  { nombre: 'Italia', flag: '🇮🇹', proyectos: 20, ciudad: 'Roma', continente: 'Europa' },
  { nombre: 'Portugal', flag: '🇵🇹', proyectos: 15, ciudad: 'Lisboa', continente: 'Europa' },
  { nombre: 'Canadá', flag: '🇨🇦', proyectos: 35, ciudad: 'Toronto', continente: 'América' },
  { nombre: 'Emiratos Árabes', flag: '🇦🇪', proyectos: 18, ciudad: 'Dubai', continente: 'Asia' },
  { nombre: 'Australia', flag: '🇦🇺', proyectos: 12, ciudad: 'Sídney', continente: 'Oceanía' },
];

const continentes = ['Todos', 'América', 'Europa', 'Asia', 'Oceanía'];

export default function PresenciaGlobalPage() {
  const [selectedContinente, setSelectedContinente] = useState('Todos');
  
  const filteredPaises = selectedContinente === 'Todos' 
    ? paisesData 
    : paisesData.filter(p => p.continente === selectedContinente);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Presencia Global
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Operamos en más de 50 países alrededor del mundo, llevando nuestra experiencia 
              y calidad a cada rincón.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2">
                <Globe2 className="w-4 h-4" />
                <span>50+ países</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2">
                <Building2 className="w-4 h-4" />
                <span>500+ proyectos</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2">
                <Users className="w-4 h-4" />
                <span>200+ profesionales</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="py-8 bg-white dark:bg-slate-800 border-b">
        <div className="container-custom">
          <div className="flex flex-wrap gap-2">
            {continentes.map((cont) => (
              <button
                key={cont}
                onClick={() => setSelectedContinente(cont)}
                className={`px-4 py-2 rounded-full transition ${
                  selectedContinente === cont
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                {cont}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lista de Países */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPaises.map((pais, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 hover:shadow-lg transition flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{pais.flag}</span>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{pais.nombre}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{pais.ciudad}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-600 dark:text-blue-400">{pais.proyectos}</div>
                  <div className="text-xs text-gray-500">proyectos</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">¿Tienes un proyecto internacional?</h2>
          <p className="text-xl text-blue-100 mb-6">Estamos listos para ayudarte en cualquier parte del mundo.</p>
          <Link
            href="/contacto"
            className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 px-8 py-3 rounded-lg font-semibold transition"
          >
            <span>Contactar Ahora</span>
          </Link>
        </div>
      </section>
    </div>
  );
}