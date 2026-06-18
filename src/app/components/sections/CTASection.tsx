// components/sections/CTASection.tsx
'use client';
import { Send, Phone, Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export const CTASection = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí conectaremos con Firebase después
    console.log('Email suscrito:', email);
    setEmail('');
    alert('¡Gracias por suscribirte! Recibirás nuestras novedades.');
  };

  return (
    <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              ¿Listo para construir tu proyecto?
            </h2>
            <p className="text-xl text-blue-100 mb-6">
              Contáctanos hoy mismo y recibe una cotización sin compromiso en menos de 24 horas
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contacto"
                className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition group"
              >
                <span>Solicitar cotización</span>
                <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition" />
              </Link>
              <Link
                href="https://wa.me/1234567890"
                className="inline-flex items-center bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition"
              >
                <Phone size={18} className="mr-2" />
                <span>WhatsApp</span>
              </Link>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">
              Suscríbete a nuestro newsletter
            </h3>
            <p className="text-blue-100 mb-6">
            Recibe consejos de construcción, ofertas especiales y novedades
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Tu mejor email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
            
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span>Respuesta en 24h</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  <span>Asesoría personalizada</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};