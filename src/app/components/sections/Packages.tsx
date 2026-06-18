// components/sections/Packages.tsx
'use client';
import { useState } from 'react';
import { Check, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const packages = [
  {
    name: 'Básico',
    price: '15,000',
    description: 'Ideal para proyectos pequeños',
    features: [
      'Hasta 60m² construidos',
      'Diseño estándar',
      'Materiales económicos',
      'Garantía 1 año',
      'Plano arquitectónico',
      'Permisos municipales'
    ],
    notIncluded: [
      'Acabados premium',
      'Domótica'
    ],
    popular: false,
    color: 'gray'
  },
  {
    name: 'Premium',
    price: '35,000',
    description: 'El más elegido por nuestros clientes',
    features: [
      'Hasta 150m² construidos',
      'Diseño personalizado',
      'Materiales de primera calidad',
      'Garantía 5 años',
      'Plano completo',
      'Permisos municipales',
      'Acabados de lujo',
      'Domótica básica'
    ],
    notIncluded: [],
    popular: true,
    color: 'blue'
  },
  {
    name: 'Personalizado',
    price: 'Custom',
    description: 'Para proyectos únicos y exclusivos',
    features: [
      'Metraje ilimitado',
      'Diseño arquitectónico exclusivo',
      'Materiales premium internacionales',
      'Garantía 10 años',
      'Estudio de suelo incluido',
      'Paisajismo profesional',
      'Domótica avanzada',
      'Piscina y spa',
      'Eco-friendly certificado'
    ],
    notIncluded: [],
    popular: false,
    color: 'purple'
  }
];

export const Packages = () => {
  const [billingCycle, setBillingCycle] = useState<'one-time' | 'installments'>('one-time');

  return (
    <section className="py-24 bg-gray-50 dark:bg-slate-800">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Paquetes de Construcción
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mb-6" />
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Soluciones adaptadas a tus necesidades y presupuesto
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white dark:bg-slate-700 rounded-full p-1 mt-8">
            <button
              onClick={() => setBillingCycle('one-time')}
              className={`px-6 py-2 rounded-full transition ${
                billingCycle === 'one-time' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Pago único
            </button>
            <button
              onClick={() => setBillingCycle('installments')}
              className={`px-6 py-2 rounded-full transition ${
                billingCycle === 'installments' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Financiamiento
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                pkg.popular ? 'ring-2 ring-amber-500 md:scale-105' : ''
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-6 right-6 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                  <Star size={14} className="mr-1" />
                  Más popular
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{pkg.description}</p>
                
                <div className="mb-6">
                  {pkg.price === 'Custom' ? (
                    <div className="text-3xl font-bold">A Medida</div>
                  ) : (
                    <>
                      <div className="text-4xl font-bold">${pkg.price}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {billingCycle === 'one-time' ? 'Pago único' : 'Desde $500/mes'}
                      </div>
                    </>
                  )}
                </div>
                
                <Link
                  href="/cotizar"
                  className={`block text-center py-3 rounded-lg font-semibold transition mb-8 ${
                    pkg.popular
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {pkg.price === 'Custom' ? 'Solicitar cotización' : 'Elegir plan'}
                </Link>
                
                <div className="space-y-4">
                  <p className="font-semibold">Incluye:</p>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm">
                        <Check size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {pkg.notIncluded.length > 0 && (
                    <>
                      <p className="font-semibold mt-4">No incluye:</p>
                      <ul className="space-y-2">
                        {pkg.notIncluded.map((item, idx) => (
                          <li key={idx} className="flex items-start text-sm">
                            <div className="w-4 h-4 border-2 border-red-400 rounded-full mr-2 mt-0.5" />
                            <span className="text-gray-500">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-300">
            ¿Necesitas un paquete completamente personalizado? 
            <Link href="/contacto" className="text-blue-600 hover:underline ml-1">
              Contáctanos
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};