// components/sections/Hero.tsx - Versión con artículos destacados
'use client';
import { useState, useEffect } from 'react';
import { Play, ArrowRight, TrendingUp, Calendar, Users, Building2, Globe2, Shield, Award, BookOpen, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Artículos destacados para mostrar en el Hero
const articulosDestacados = [
  {
    id: 1,
    title: 'Tendencias en arquitectura sostenible 2025',
    excerpt: 'Descubre las últimas innovaciones en construcción ecológica.',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5',
    category: 'Arquitectura'
  },
  {
    id: 2,
    title: 'Beneficios de la domótica en el hogar moderno',
    excerpt: 'Automatización inteligente para mayor confort y eficiencia.',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827',
    category: 'Tecnología'
  }
];

export const Hero = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/70 z-10" />
        <Image
          src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5"
          alt="Construcción moderna"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Hero Content */}
      <div className="container-custom relative z-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-300 text-sm font-medium">Construcción Global desde 2010</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Construimos tus 
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-amber-400 bg-clip-text text-transparent"> Sueños</span>
            <br />
            <span className="text-white/90">en Cada Rincón del Mundo</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed max-w-2xl">
            Expertos en construcción internacional. Calidad premium, tecnología de punta 
            y precios competitivos en más de 50 países.
          </p>
          
          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link
              href="/contacto" 
              className="group relative inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              <span>Solicitar Cotización</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
            </Link>
            
            <Link
              href="/servicios"
              className="inline-flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300"
            >
              <span>Nuestros Servicios</span>
              <Building2 size={18} />
            </Link>

            {/* Botón Blog */}
            <Link
              href="/blog"
              className="inline-flex items-center justify-center space-x-2 bg-amber-500/20 backdrop-blur-sm hover:bg-amber-500/30 border border-amber-400/30 text-amber-100 font-semibold py-4 px-6 rounded-xl transition-all duration-300 group"
            >
              <BookOpen size={18} className="group-hover:rotate-12 transition-transform" />
              <span>Blog</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Artículos destacados (minicards) */}
          <div className="mt-8">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
              <BookOpen size={14} />
              <span>Artículos destacados</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {articulosDestacados.map((articulo) => (
                <Link
                  key={articulo.id}
                  href={`/blog/${articulo.id}`}
                  className="group bg-white/5 backdrop-blur-sm hover:bg-white/10 border border-white/10 rounded-xl p-3 flex items-center gap-3 transition-all duration-300 hover:scale-105"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={articulo.image}
                      alt={articulo.title}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate max-w-[200px]">
                      {articulo.title}
                    </p>
                    <p className="text-xs text-gray-400">{articulo.category}</p>
                  </div>
                  <ChevronRight size={14} className="text-gray-500 group-hover:text-white transition-colors flex-shrink-0" />
                </Link>
              ))}
              <Link
                href="/blog"
                className="flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors px-3"
              >
                Ver todos →
              </Link>
            </div>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-white font-medium">4.9/5</span>
              <span className="text-gray-300 text-sm">(1,200+ reseñas)</span>
            </div>
            
            <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-white text-sm">ISO 9001</span>
            </div>
            
            <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-white text-sm">+200 Profesionales</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};