// app/servicios/page.tsx
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Building2,
  Wrench,
  Droplet,
  Zap,
  PaintBucket,
  PenTool,
  Hammer,
  CheckCircle,
  Clock,
  Award,
  Shield,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Datos de servicios
const servicios = [
  {
    id: 'residencial',
    icon: Home,
    title: 'Construcción Residencial',
    description: 'Diseñamos y construimos la casa de tus sueños con materiales de primera calidad y acabados personalizados.',
    features: [
      'Diseño arquitectónico personalizado',
      'Materiales de construcción premium',
      'Garantía estructural de 10 años',
      'Acabados de alta calidad',
      'Eficiencia energética',
      'Certificación LEED opcional'
    ],
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
    price: 'Desde $15,000',
    href: '/servicios/residencial'
  },
  {
    id: 'comercial',
    icon: Building2,
    title: 'Proyectos Comerciales',
    description: 'Edificios, oficinas y locales comerciales con estándares internacionales de calidad y funcionalidad.',
    features: [
      'Diseño funcional y moderno',
      'Cumplimiento de normativas locales',
      'Eficiencia operativa',
      'Materiales durables',
      'Mantenimiento incluido',
      'Certificación de calidad'
    ],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
    price: 'Desde $30,000',
    href: '/servicios/comercial'
  },
  {
    id: 'remodelaciones',
    icon: Hammer,
    title: 'Remodelaciones',
    description: 'Transformamos tus espacios con las últimas tendencias en diseño y funcionalidad.',
    features: [
      'Diseño de interiores',
      'Ampliaciones estructurales',
      'Cocinas modernas',
      'Baños de lujo',
      'Cambio de distribución',
      'Permisos incluidos'
    ],
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba',
    price: 'Desde $5,000',
    href: '/servicios/remodelaciones'
  },
  {
    id: 'hidraulica',
    icon: Droplet,
    title: 'Instalaciones Hidráulicas',
    description: 'Sistemas de agua potable, alcantarillado y calefacción eficientes y ecológicos.',
    features: [
      'Sistemas de agua potable',
      'Alcantarillado moderno',
      'Calefacción eficiente',
      'Tuberías de cobre',
      'Sistemas ecológicos',
      'Garantía 5 años'
    ],
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1',
    price: 'Desde $3,000',
    href: '/servicios/hidraulica'
  },
  {
    id: 'electrica',
    icon: Zap,
    title: 'Instalaciones Eléctricas',
    description: 'Sistemas eléctricos modernos y eficientes para tu hogar o negocio.',
    features: [
      'Instalación completa',
      'Domótica avanzada',
      'Paneles solares',
      'Sistemas de respaldo',
      'Certificación eléctrica',
      'Eficiencia energética'
    ],
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    price: 'Desde $2,500',
    href: '/servicios/electricidad'
  },
  {
    id: 'acabados',
    icon: PaintBucket,
    title: 'Acabados de Lujo',
    description: 'Detalles que marcan la diferencia en cada rincón de tu propiedad.',
    features: [
      'Pintura profesional',
      'Revestimientos de calidad',
      'Pisos de ingeniería',
      'Carpintería a medida',
      'Detalles arquitectónicos',
      'Personalización total'
    ],
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
    price: 'Desde $4,000',
    href: '/servicios/acabados'
  },
  {
    id: 'diseno',
    icon: PenTool,
    title: 'Diseño Arquitectónico',
    description: 'Planos y diseños personalizados que combinan estética, funcionalidad y sostenibilidad.',
    features: [
      'Diseño personalizado',
      'Planos estructurales',
      'Permisos municipales',
      'Visualizaciones 3D',
      'Asesoría integral',
      'Sostenibilidad'
    ],
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e',
    price: 'Desde $2,000',
    href: '/servicios/diseno'
  },
  {
    id: 'consultoria',
    icon: Shield,
    title: 'Consultoría y Supervisión',
    description: 'Asesoría profesional para garantizar la calidad y éxito de tu proyecto de construcción.',
    features: [
      'Supervisión de obra',
      'Control de calidad',
      'Gestión de proyectos',
      'Optimización de costos',
      'Informes periódicos',
      'Garantía de calidad'
    ],
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd',
    price: 'Desde $1,500',
    href: '/servicios/consultoria'
  }
];

// Proceso de trabajo
const procesoPasos = [
  {
    step: '01',
    title: 'Consulta Inicial',
    description: 'Conversamos sobre tu proyecto, necesidades y presupuesto.',
    icon: '💬'
  },
  {
    step: '02',
    title: 'Diseño y Planificación',
    description: 'Creamos los planos y definimos el cronograma de trabajo.',
    icon: '📐'
  },
  {
    step: '03',
    title: 'Construcción',
    description: 'Ejecutamos la obra con los más altos estándares de calidad.',
    icon: '🏗️'
  },
  {
    step: '04',
    title: 'Entrega y Garantía',
    description: 'Entregamos tu proyecto y te acompañamos con garantía post-venta.',
    icon: '🔑'
  }
];

// Beneficios
const beneficios = [
  {
    icon: Award,
    title: 'Calidad Internacional',
    description: 'Utilizamos los mejores materiales y técnicas de construcción globales.'
  },
  {
    icon: Clock,
    title: 'Cumplimiento de Plazos',
    description: 'Entregamos tus proyectos a tiempo y con la calidad prometida.'
  },
  {
    icon: Shield,
    title: 'Garantía Extendida',
    description: 'Respaldamos nuestro trabajo con garantías de hasta 10 años.'
  },
  {
    icon: CheckCircle,
    title: 'Satisfacción Garantizada',
    description: 'Trabajamos hasta que estés 100% satisfecho con el resultado.'
  }
];

export default function ServiciosPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('todos');

  const categorias = ['todos', 'construcción', 'remodelación', 'instalación', 'diseño'];

  const filteredServicios = filter === 'todos' 
    ? servicios 
    : servicios.filter(s => {
        if (filter === 'construcción') return ['residencial', 'comercial'].includes(s.id);
        if (filter === 'remodelación') return ['remodelaciones'].includes(s.id);
        if (filter === 'instalación') return ['hidraulica', 'electrica'].includes(s.id);
        if (filter === 'diseño') return ['acabados', 'diseno', 'consultoria'].includes(s.id);
        return true;
      });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Nuestros Servicios
            </h1>
            <div className="w-20 h-1 bg-amber-500 mb-6" />
            <p className="text-xl text-blue-100 leading-relaxed">
              Ofrecemos soluciones integrales en construcción con los más altos estándares de calidad internacional.
              Desde el diseño hasta la entrega, te acompañamos en cada paso.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 sticky top-16 z-40">
        <div className="container-custom py-4">
          <div className="flex flex-wrap gap-2">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === cat
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServicios.map((servicio, index) => (
              <motion.div
                key={servicio.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                onMouseEnter={() => setSelectedService(servicio.id)}
                onMouseLeave={() => setSelectedService(null)}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={servicio.image}
                    alt={servicio.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-2 rounded-lg">
                      <servicio.icon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {servicio.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {servicio.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    {servicio.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-start text-sm">
                        <CheckCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                      </div>
                    ))}
                    {servicio.features.length > 3 && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        +{servicio.features.length - 3} características más
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-lg font-bold text-blue-600">
                      {servicio.price}
                    </span>
                    <Link
                      href={servicio.href}
                      className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium text-sm group/link"
                    >
                      <span>Ver más</span>
                      <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Nuestro Proceso de Trabajo
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6" />
            <p className="text-gray-600 dark:text-gray-300">
              Un proceso transparente y estructurado para garantizar el éxito de tu proyecto.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {procesoPasos.map((paso, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300">
                  <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl group-hover:scale-110 transition-transform">
                    {paso.icon}
                  </div>
                  <div className="text-sm font-bold text-blue-600 mb-2">{paso.step}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{paso.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{paso.description}</p>
                </div>
                {index < procesoPasos.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-blue-300" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {beneficios.map((beneficio, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <beneficio.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">{beneficio.title}</h3>
                <p className="text-blue-100">{beneficio.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50 dark:bg-slate-900">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              ¿Listo para empezar tu proyecto?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Contáctanos hoy mismo y recibe una cotización sin compromiso en menos de 24 horas.
            </p>
            <Link
              href="/contacto"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span>Solicitar Cotización</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}