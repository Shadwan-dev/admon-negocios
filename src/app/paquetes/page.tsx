// app/paquetes/page.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  Check, 
  Star, 
  TrendingUp, 
  Shield, 
  Clock, 
  Home, 
  Building2,
  Sparkles,
  ArrowRight,
  Phone,
  Calendar,
  Users,
  Award,
  Gem
} from 'lucide-react';

const paquetesData = [
  {
    id: 'basico',
    nombre: 'Básico',
    precio: '$15,000',
    precioLetra: 'Desde $15,000',
    descripcion: 'Ideal para proyectos pequeños o primeros pasos en la construcción.',
    features: [
      'Hasta 60m² construidos',
      'Diseño estándar',
      'Materiales económicos',
      'Garantía 1 año',
      'Plano arquitectónico',
      'Permisos municipales',
      'Instalaciones básicas',
      'Acabados estándar'
    ],
    noIncluye: [
      'Acabados premium',
      'Domótica',
      'Piscina',
      'Jardinería'
    ],
    popular: false,
    color: 'gray',
    icon: Home,
    tiempo: '2-3 meses',
    garantia: '1 año'
  },
  {
    id: 'intermedio',
    nombre: 'Intermedio',
    precio: '$35,000',
    precioLetra: 'Desde $35,000',
    descripcion: 'El más elegido por nuestros clientes. Calidad y diseño en cada detalle.',
    features: [
      'Hasta 150m² construidos',
      'Diseño personalizado',
      'Materiales de primera calidad',
      'Garantía 5 años',
      'Plano completo',
      'Permisos municipales',
      'Acabados de lujo',
      'Domótica básica',
      'Eficiencia energética',
      'Sistemas de seguridad'
    ],
    noIncluye: [
      'Piscina',
      'Domótica avanzada'
    ],
    popular: true,
    color: 'blue',
    icon: Building2,
    tiempo: '4-6 meses',
    garantia: '5 años'
  },
  {
    id: 'premium',
    nombre: 'Premium',
    precio: 'A Medida',
    precioLetra: 'Presupuesto personalizado',
    descripcion: 'Para proyectos únicos y exclusivos con los más altos estándares.',
    features: [
      'Metraje ilimitado',
      'Diseño arquitectónico exclusivo',
      'Materiales premium internacionales',
      'Garantía 10 años',
      'Estudio de suelo incluido',
      'Paisajismo profesional',
      'Domótica avanzada',
      'Piscina y spa',
      'Eco-friendly certificado',
      'Sistemas de energía renovable',
      'Acabados de lujo importados'
    ],
    noIncluye: [],
    popular: false,
    color: 'purple',
    icon: Gem,
    tiempo: '6-12 meses',
    garantia: '10 años'
  }
];

const beneficiosAdicionales = [
  {
    icon: Shield,
    title: 'Garantía Extendida',
    description: 'Hasta 10 años de garantía en estructura'
  },
  {
    icon: Clock,
    title: 'Entrega Garantizada',
    description: 'Cumplimos los plazos acordados'
  },
  {
    icon: Users,
    title: 'Profesionales Certificados',
    description: 'Mano de obra calificada'
  },
  {
    icon: Award,
    title: 'Materiales Premium',
    description: 'Calidad garantizada'
  }
];

export default function PaquetesPage() {
  const [billingCycle, setBillingCycle] = useState<'one-time' | 'installments'>('one-time');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Paquetes de Construcción
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Soluciones adaptadas a tus necesidades y presupuesto. Encuentra el paquete perfecto 
              para tu proyecto de construcción.
            </p>
          </div>
        </div>
      </section>

      {/* Beneficios Rápidos */}
      <section className="py-12 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-gray-700">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {beneficiosAdicionales.map((beneficio, index) => {
              const Icon = beneficio.icon;
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{beneficio.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{beneficio.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Paquetes Grid */}
      <section className="py-20">
        <div className="container-custom">
          {/* Toggle de Facturación */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center bg-white dark:bg-slate-800 rounded-full p-1 shadow-lg border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setBillingCycle('one-time')}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  billingCycle === 'one-time' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600'
                }`}
              >
                Pago único
              </button>
              <button
                onClick={() => setBillingCycle('installments')}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  billingCycle === 'installments' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600'
                }`}
              >
                Financiamiento
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {paquetesData.map((paquete, index) => {
              const Icon = paquete.icon;
              return (
                <div
                  key={index}
                  className={`relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                    paquete.popular ? 'ring-2 ring-amber-500 md:scale-105' : ''
                  }`}
                >
                  {/* Badge Popular */}
                  {paquete.popular && (
                    <div className="absolute top-6 right-6 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center z-10">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      Más popular
                    </div>
                  )}

                  {/* Cabecera */}
                  <div className={`p-8 ${
                    paquete.popular 
                      ? 'bg-gradient-to-br from-amber-500/10 to-transparent' 
                      : ''
                  }`}>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        paquete.popular 
                          ? 'bg-amber-500/20 text-amber-600' 
                          : 'bg-blue-600/10 text-blue-600'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{paquete.nombre}</h3>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{paquete.descripcion}</p>
                    
                    <div className="mb-6">
                      <div className="text-4xl font-bold text-gray-900 dark:text-white">
                        {paquete.precio}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {billingCycle === 'one-time' 
                          ? paquete.precioLetra 
                          : `Desde $${Math.floor(parseInt(paquete.precio.replace(/[^0-9]/g, '')) / 12)}/mes`}
                      </div>
                    </div>

                    <Link
                      href="/contacto"
                      className={`block text-center py-3 rounded-xl font-semibold transition-all duration-300 ${
                        paquete.popular
                          ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-xl'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                      }`}
                    >
                      {paquete.precio === 'A Medida' ? 'Solicitar Cotización' : 'Elegir Plan'}
                    </Link>
                  </div>

                  {/* Detalles */}
                  <div className="p-8 pt-0 border-t border-gray-100 dark:border-gray-700">
                    <div className="space-y-6">
                      {/* Tiempo y Garantía */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-300">{paquete.tiempo}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Shield className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-300">{paquete.garantia}</span>
                        </div>
                      </div>

                      {/* Features */}
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white mb-3">Incluye:</p>
                        <ul className="space-y-2">
                          {paquete.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start text-sm">
                              <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* No Incluye */}
                      {paquete.noIncluye.length > 0 && (
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white mb-3">No incluye:</p>
                          <ul className="space-y-2">
                            {paquete.noIncluye.map((item, idx) => (
                              <li key={idx} className="flex items-start text-sm">
                                <div className="w-4 h-4 border-2 border-red-400 rounded-full mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-500 dark:text-gray-400">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Comparativa Rápida */}
          <div className="mt-16 bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Comparativa Rápida
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400">Característica</th>
                      {paquetesData.map((paquete) => (
                        <th key={paquete.id} className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          {paquete.nombre}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">Metraje máximo</td>
                      <td className="text-center py-3 px-4">60m²</td>
                      <td className="text-center py-3 px-4">150m²</td>
                      <td className="text-center py-3 px-4">Ilimitado</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">Diseño</td>
                      <td className="text-center py-3 px-4">Estándar</td>
                      <td className="text-center py-3 px-4">Personalizado</td>
                      <td className="text-center py-3 px-4">Exclusivo</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">Garantía</td>
                      <td className="text-center py-3 px-4">1 año</td>
                      <td className="text-center py-3 px-4">5 años</td>
                      <td className="text-center py-3 px-4">10 años</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">Domótica</td>
                      <td className="text-center py-3 px-4">No</td>
                      <td className="text-center py-3 px-4">Básica</td>
                      <td className="text-center py-3 px-4">Avanzada</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">Piscina</td>
                      <td className="text-center py-3 px-4">No</td>
                      <td className="text-center py-3 px-4">Opcional</td>
                      <td className="text-center py-3 px-4">Incluida</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿No encuentras el paquete perfecto?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Creamos paquetes personalizados adaptados a tus necesidades específicas.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contacto"
                className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Phone className="w-5 h-5" />
                <span>Solicitar Personalizado</span>
              </Link>
              <Link
                href="/servicios"
                className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300"
              >
                <span>Ver Servicios</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}