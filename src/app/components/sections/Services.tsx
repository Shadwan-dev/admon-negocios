'use client';
import { useState } from 'react';
import { 
  Home, 
  Building, 
  Wrench, 
  Droplet, 
  Zap, 
  PaintBucket,
  ChevronRight 
} from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    icon: Home,
    title: 'Construcción Residencial',
    description: 'Diseñamos y construimos la casa de tus sueños con materiales de primera calidad.',
    features: ['Diseño personalizado', 'Materiales premium', 'Garantía 10 años'],
    href: '/servicios/residencial'
  },
  {
    icon: Building,
    title: 'Proyectos Comerciales',
    description: 'Edificios, oficinas y locales comerciales con estándares internacionales.',
    features: ['Eficiencia energética', 'Certificación LEED', 'Mantenimiento incluido'],
    href: '/servicios/comercial'
  },
  {
    icon: Wrench,
    title: 'Remodelaciones',
    description: 'Transformamos tus espacios con las últimas tendencias en diseño.',
    features: ['Cocinas modernas', 'Baños de lujo', 'Ampliaciones'],
    href: '/servicios/remodelaciones'
  },
  {
    icon: Droplet,
    title: 'Instalaciones Hidráulicas',
    description: 'Sistemas de agua potable, alcantarillado y calefacción eficientes.',
    features: ['Tuberías de cobre', 'Sistemas ecológicos', 'Garantía 5 años'],
    href: '/servicios/hidraulica'
  },
  {
    icon: Zap,
    title: 'Instalaciones Eléctricas',
    description: 'Sistemas eléctricos modernos y eficientes para tu hogar o negocio.',
    features: ['Domótica', 'Paneles solares', 'Sistemas de respaldo'],
    href: '/servicios/electricidad'
  },
  {
    icon: PaintBucket,
    title: 'Acabados de Lujo',
    description: 'Detalles que marcan la diferencia en cada rincón de tu propiedad.',
    features: ['Pintura profesional', 'Revestimientos', 'Pisos de ingeniería'],
    href: '/servicios/acabados'
  }
];

export const Services = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Nuestros Servicios
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6" />
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Ofrecemos soluciones integrales en construcción con los más altos estándares de calidad
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isHovered = hoveredIndex === index;
            
            return (
              <div
                key={index}
                className="group relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className={`card h-full transform transition-all duration-500 ${
                  isHovered ? 'shadow-2xl -translate-y-2' : ''
                }`}>
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 transition-all duration-500 ${
                    isHovered ? 'scale-110 rotate-3' : ''
                  }`}>
                    <Icon size={32} className="text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {service.description}
                  </p>
                  
                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <ChevronRight size={14} className="text-blue-600 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Link */}
                  <Link 
                    href={service.href}
                    className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 group/link"
                  >
                    <span>Más información</span>
                    <ChevronRight size={16} className="ml-1 group-hover/link:translate-x-1 transition" />
                  </Link>
                </div>
                
                {/* Glow effect */}
                {isHovered && (
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-amber-500 rounded-2xl blur opacity-20 -z-10" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};