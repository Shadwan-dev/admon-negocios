// app/servicios/[slug]/page.tsx
'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  CheckCircle, 
  ArrowRight, 
  Phone, 
  Calendar,
  Users,
  Shield,
  Clock,
  Star,
  Building2,
  Home,
  Wrench,
  Droplet,
  Zap,
  PaintBucket,
  Pencil
} from 'lucide-react';

// Datos de todos los servicios
const serviciosData = {
  residencial: {
    title: 'Construcción Residencial',
    icon: Home,
    description: 'Diseñamos y construimos la casa de tus sueños con materiales de primera calidad y acabados personalizados. Creamos espacios que reflejan tu estilo y necesidades.',
    longDescription: 'Nos especializamos en la construcción de viviendas únicas que combinan diseño, funcionalidad y confort. Desde la planificación hasta la entrega final, nos aseguramos de que cada detalle esté cuidado al máximo.',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
    gallery: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5',
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122'
    ],
    features: [
      'Diseño arquitectónico personalizado',
      'Materiales premium certificados',
      'Gestión de permisos municipales',
      'Garantía estructural de 10 años',
      'Entrega llave en mano',
      'Sostenibilidad y eficiencia energética'
    ],
    includes: [
      'Estudio de suelo',
      'Planos arquitectónicos y estructurales',
      'Permisos y licencias',
      'Materiales de construcción',
      'Mano de obra calificada',
      'Acabados estándar',
      'Garantía post-construcción'
    ],
    notIncludes: [
      'Mobiliario y decoración',
      'Jardinería exterior',
      'Piscina y spa (opcional)'
    ],
    proceso: [
      { step: 1, title: 'Consulta y Diseño', description: 'Entendemos tus necesidades y creamos el diseño perfecto' },
      { step: 2, title: 'Planificación', description: 'Gestionamos permisos y planificamos cada detalle' },
      { step: 3, title: 'Construcción', description: 'Ejecutamos con los más altos estándares de calidad' },
      { step: 4, title: 'Entrega', description: 'Entregamos tu hogar con garantía y soporte' }
    ],
    testimonios: [
      { name: 'Carlos López', project: 'Casa de Playa', text: 'Excelente trabajo, cumplieron todos los plazos y el acabado es impecable.' },
      { name: 'María González', project: 'Remodelación', text: 'Superaron mis expectativas. Mi nueva casa es perfecta.' }
    ],
    precioDesde: '$15,000',
    tiempoEstimado: '3-6 meses'
  },
  comercial: {
    title: 'Proyectos Comerciales',
    icon: Building2,
    description: 'Edificios, oficinas y locales comerciales con estándares internacionales y eficiencia energética.',
    longDescription: 'Desarrollamos proyectos comerciales que combinan funcionalidad, estética y eficiencia. Desde oficinas corporativas hasta centros comerciales, creamos espacios que impulsan tu negocio.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5'
    ],
    features: [
      'Certificación LEED',
      'Eficiencia energética',
      'Diseño funcional',
      'Mantenimiento posventa',
      'Cumplimiento normativo',
      'Espacios adaptables'
    ],
    includes: [
      'Diseño arquitectónico comercial',
      'Estudios de impacto',
      'Permisos comerciales',
      'Instalaciones especializadas',
      'Sistemas de seguridad',
      'Garantía de 5 años'
    ],
    notIncludes: [
      'Equipamiento de oficina',
      'Sistemas de TI'
    ],
    proceso: [
      { step: 1, title: 'Análisis de Requerimientos', description: 'Entendemos las necesidades específicas de tu negocio' },
      { step: 2, title: 'Diseño y Aprobación', description: 'Creamos el diseño y obtenemos las aprobaciones' },
      { step: 3, title: 'Construcción', description: 'Ejecutamos con estándares comerciales' },
      { step: 4, title: 'Entrega y Soporte', description: 'Entregamos el proyecto con soporte continuo' }
    ],
    testimonios: [
      { name: 'Empresa XYZ', project: 'Oficinas Corporativas', text: 'Construyeron nuestras oficinas en tiempo récord y con calidad superior.' }
    ],
    precioDesde: 'Presupuesto personalizado',
    tiempoEstimado: '6-12 meses'
  },
  remodelaciones: {
    title: 'Remodelaciones',
    icon: Wrench,
    description: 'Transformamos tus espacios con las últimas tendencias en diseño y funcionalidad.',
    longDescription: 'Especialistas en remodelaciones de cocinas, baños y espacios interiores. Transformamos tu hogar con las últimas tendencias y materiales de primera calidad.',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba',
    gallery: [
      'https://images.unsplash.com/photo-1556911220-bff31c812dba',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914'
    ],
    features: [
      'Cocinas modernas',
      'Baños de lujo',
      'Ampliaciones',
      'Cambio de distribución',
      'Actualización de instalaciones',
      'Diseño personalizado'
    ],
    includes: [
      'Diseño de interiores',
      'Demolición controlada',
      'Nuevas instalaciones',
      'Acabados premium',
      'Garantía de 3 años'
    ],
    notIncludes: [
      'Muebles nuevos',
      'Electrodomésticos'
    ],
    proceso: [
      { step: 1, title: 'Evaluación', description: 'Evaluamos el espacio y tus necesidades' },
      { step: 2, title: 'Diseño', description: 'Creamos el diseño de tu nuevo espacio' },
      { step: 3, title: 'Remodelación', description: 'Ejecutamos la transformación' },
      { step: 4, title: 'Entrega', description: 'Entregamos tu espacio renovado' }
    ],
    testimonios: [
      { name: 'Ana Rodríguez', project: 'Remodelación de Cocina', text: 'Mi cocina quedó como siempre soñé. Excelente trabajo.' }
    ],
    precioDesde: '$5,000',
    tiempoEstimado: '2-4 semanas'
  },
  hidraulica: {
    title: 'Instalaciones Hidráulicas',
    icon: Droplet,
    description: 'Sistemas de agua potable, alcantarillado y calefacción eficientes y duraderos.',
    longDescription: 'Ofrecemos soluciones integrales en instalaciones hidráulicas para proyectos residenciales y comerciales, garantizando eficiencia y durabilidad.',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1',
    gallery: [
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1'
    ],
    features: [
      'Tuberías de cobre y PEX',
      'Sistemas ecológicos',
      'Garantía de 5 años',
      'Mantenimiento preventivo',
      'Eficiencia hídrica',
      'Sistemas de calefacción'
    ],
    includes: [
      'Diseño de sistemas hidráulicos',
      'Instalación de tuberías',
      'Sistemas de presión',
      'Calentadores de agua',
      'Garantía de 5 años'
    ],
    notIncludes: [
      'Equipos de bombeo externos',
      'Sistemas de tratamiento'
    ],
    proceso: [
      { step: 1, title: 'Diagnóstico', description: 'Evaluamos tus necesidades hídricas' },
      { step: 2, title: 'Diseño', description: 'Diseñamos el sistema óptimo' },
      { step: 3, title: 'Instalación', description: 'Instalamos con precisión' },
      { step: 4, title: 'Pruebas', description: 'Realizamos pruebas de funcionamiento' }
    ],
    testimonios: [
      { name: 'Pedro Martínez', project: 'Instalación Completa', text: 'El sistema funciona perfectamente, muy profesionales.' }
    ],
    precioDesde: '$2,500',
    tiempoEstimado: '1-2 semanas'
  },
  electricidad: {
    title: 'Instalaciones Eléctricas',
    icon: Zap,
    description: 'Sistemas eléctricos modernos, eficientes y seguros para tu hogar o negocio.',
    longDescription: 'Especialistas en instalaciones eléctricas residenciales y comerciales, integrando tecnología de punta y soluciones eficientes.',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1',
    gallery: [
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1'
    ],
    features: [
      'Domótica integrada',
      'Paneles solares',
      'Sistemas de respaldo',
      'Iluminación LED',
      'Certificación eléctrica',
      'Eficiencia energética'
    ],
    includes: [
      'Diseño de sistema eléctrico',
      'Instalación de cableado',
      'Tableros eléctricos',
      'Sistemas de iluminación',
      'Garantía de 3 años'
    ],
    notIncludes: [
      'Electrodomésticos',
      'Equipos de climatización'
    ],
    proceso: [
      { step: 1, title: 'Evaluación', description: 'Evaluamos tus necesidades eléctricas' },
      { step: 2, title: 'Diseño', description: 'Diseñamos el sistema eléctrico' },
      { step: 3, title: 'Instalación', description: 'Instalamos el sistema' },
      { step: 4, title: 'Certificación', description: 'Certificamos la instalación' }
    ],
    testimonios: [
      { name: 'Laura Fernández', project: 'Domótica', text: 'Increíble cómo mejoró la eficiencia de mi hogar.' }
    ],
    precioDesde: '$3,000',
    tiempoEstimado: '2-3 semanas'
  },
  acabados: {
    title: 'Acabados de Lujo',
    icon: PaintBucket,
    description: 'Detalles que marcan la diferencia en cada rincón de tu propiedad con acabados exclusivos.',
    longDescription: 'Especialistas en acabados de alta gama que transforman espacios en obras de arte. Desde pintura profesional hasta revestimientos importados.',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
    gallery: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914'
    ],
    features: [
      'Pintura profesional',
      'Revestimientos importados',
      'Pisos de ingeniería',
      'Carpintería personalizada',
      'Acabados ecológicos',
      'Diseño exclusivo'
    ],
    includes: [
      'Asesoría de diseño',
      'Materiales de primera calidad',
      'Mano de obra especializada',
      'Garantía de 3 años'
    ],
    notIncludes: [
      'Muebles',
      'Decoración'
    ],
    proceso: [
      { step: 1, title: 'Consultoría', description: 'Asesoría en diseño y materiales' },
      { step: 2, title: 'Selección', description: 'Selección de materiales' },
      { step: 3, title: 'Ejecución', description: 'Aplicación de acabados' },
      { step: 4, title: 'Entrega', description: 'Entrega de espacios renovados' }
    ],
    testimonios: [
      { name: 'Isabel Torres', project: 'Acabados Premium', text: 'Los acabados son espectaculares, superaron mis expectativas.' }
    ],
    precioDesde: '$4,000',
    tiempoEstimado: '2-3 semanas'
  },
  diseno: {
    title: 'Diseño Arquitectónico',
    icon: Pencil,
    description: 'Planes y diseños innovadores que maximizan el espacio, la luz y la funcionalidad.',
    longDescription: 'Creamos diseños arquitectónicos únicos que combinan estética, funcionalidad y sostenibilidad. Desde la conceptualización hasta los planos finales.',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
    gallery: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914'
    ],
    features: [
      'Planos 3D',
      'Visualización realista',
      'Diseño sostenible',
      'Optimización de espacios',
      'Asesoría completa',
      'Cumplimiento normativo'
    ],
    includes: [
      'Planos arquitectónicos',
      'Planos estructurales',
      'Planos de instalaciones',
      'Render 3D',
      'Asesoría en materiales'
    ],
    notIncludes: [
      'Permisos municipales',
      'Construcción'
    ],
    proceso: [
      { step: 1, title: 'Concepto', description: 'Desarrollamos el concepto inicial' },
      { step: 2, title: 'Diseño', description: 'Creamos el diseño detallado' },
      { step: 3, title: 'Planos', description: 'Elaboramos los planos finales' },
      { step: 4, title: 'Revisión', description: 'Revisamos y ajustamos el diseño' }
    ],
    testimonios: [
      { name: 'Arq. Juan Pérez', project: 'Proyecto Residencial', text: 'Excelente capacidad de diseño y atención al detalle.' }
    ],
    precioDesde: '$2,000',
    tiempoEstimado: '2-4 semanas'
  }
};

export default function ServicioDetalle() {
  const params = useParams();
  const slug = params.slug as string;
  const servicio = serviciosData[slug as keyof typeof serviciosData];

  if (!servicio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Servicio no encontrado</h1>
          <Link href="/servicios" className="text-blue-600 hover:underline">
            Volver a servicios
          </Link>
        </div>
      </div>
    );
  }

  const Icon = servicio.icon;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero del Servicio */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container-custom relative z-10">
          <Link
            href="/servicios"
            className="inline-flex items-center space-x-2 text-white/80 hover:text-white mb-8 transition"
          >
            <ArrowLeft size={18} />
            <span>Volver a Servicios</span>
          </Link>
          
          <div className="max-w-4xl">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Icon size={32} className="text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">{servicio.title}</h1>
            </div>
            <p className="text-xl text-blue-100 mb-6">{servicio.description}</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{servicio.tiempoEstimado}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Garantía incluida</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido Principal */}
      <div className="container-custom py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-12">
            {/* Descripción */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Descripción</h2>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                {servicio.longDescription}
              </p>
            </div>

            {/* Características */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Características</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {servicio.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Proceso */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Proceso de Trabajo</h2>
              <div className="space-y-4">
                {servicio.proceso.map((step) => (
                  <div key={step.step} className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">{step.step}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Incluye y No Incluye */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-green-600 dark:text-green-400 mb-3">✓ Incluye:</h3>
                <ul className="space-y-2">
                  {servicio.includes.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2 text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-red-600 dark:text-red-400 mb-3">✗ No incluye:</h3>
                <ul className="space-y-2">
                  {servicio.notIncludes.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2 text-gray-700 dark:text-gray-300">
                      <div className="w-4 h-4 border-2 border-red-400 rounded-full mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Card de Cotización */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">¿Listo para comenzar?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Solicita una cotización personalizada para tu proyecto
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Precio desde:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{servicio.precioDesde}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Tiempo estimado:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{servicio.tiempoEstimado}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Garantía:</span>
                  <span className="font-semibold text-green-600">Incluida</span>
                </div>
              </div>

              <Link
                href="/contacto"
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Phone className="w-4 h-4" />
                <span>Solicitar Cotización</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/servicios"
                className="w-full flex items-center justify-center space-x-2 mt-3 text-blue-600 hover:text-blue-700 font-medium transition"
              >
                <span>Ver todos los servicios</span>
              </Link>
            </div>

            {/* Testimonios */}
            {servicio.testimonios && servicio.testimonios.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Testimonios</h3>
                <div className="space-y-4">
                  {servicio.testimonios.map((testimonio, index) => (
                    <div key={index} className="border-b dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium text-gray-900 dark:text-white">{testimonio.name}</span>
                        <span className="text-sm text-gray-500">{testimonio.project}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">"{testimonio.text}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}