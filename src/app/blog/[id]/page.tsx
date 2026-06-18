// app/blog/[id]/page.tsx
'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

// Datos de artículos (mismo que en blog/page.tsx)
const articulosData = [
  {
    id: 1,
    title: 'Tendencias en arquitectura sostenible 2025',
    excerpt: 'Descubre las últimas innovaciones en construcción ecológica y materiales sustentables que están revolucionando la industria.',
    content: `
      <p>La arquitectura sostenible está transformando la forma en que construimos nuestros espacios. En 2025, las tendencias se centran en la eficiencia energética, el uso de materiales reciclados y la integración con el entorno natural.</p>
      
      <h2>Materiales ecológicos en auge</h2>
      <p>El bambú, la madera laminada cruzada (CLT) y los materiales reciclados están ganando terreno en la construcción moderna. Estos materiales no solo reducen la huella de carbono, sino que también ofrecen durabilidad y estética única.</p>
      
      <h2>Edificios de energía positiva</h2>
      <p>Los edificios que generan más energía de la que consumen son una realidad. Con paneles solares integrados, sistemas de captación de agua de lluvia y diseño bioclimático, es posible crear estructuras autosuficientes.</p>
      
      <h2>Integración con la naturaleza</h2>
      <p>Los techos verdes, jardines verticales y la conexión con espacios exteriores son elementos clave en el diseño sostenible actual. Estos espacios no solo mejoran la estética, sino que también contribuyen a la biodiversidad urbana.</p>
    `,
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5',
    author: 'Arq. María Martínez',
    date: '15 Mar 2025',
    readTime: '5 min',
    category: 'Arquitectura',
    tags: ['Sostenibilidad', 'Innovación', 'Eco-friendly'],
    featured: true,
    likes: 234,
    comments: 45
  },
  {
    id: 2,
    title: 'Cómo elegir los mejores materiales para tu construcción',
    excerpt: 'Guía completa para seleccionar materiales de calidad según tu presupuesto y necesidades específicas.',
    content: `
      <p>Seleccionar los materiales adecuados es fundamental para garantizar la durabilidad y calidad de tu proyecto de construcción. Aquí te guiamos en el proceso de elección.</p>
      
      <h2>Factores a considerar</h2>
      <ul>
        <li><strong>Presupuesto:</strong> Define cuánto puedes invertir en materiales</li>
        <li><strong>Clima:</strong> Los materiales deben adaptarse a las condiciones climáticas locales</li>
        <li><strong>Durabilidad:</strong> Evalúa la vida útil de cada material</li>
        <li><strong>Mantenimiento:</strong> Considera los costos y esfuerzo de mantenimiento</li>
      </ul>
      
      <h2>Materiales recomendados por tipo de proyecto</h2>
      <p>Para proyectos residenciales, los materiales más recomendados son aquellos que ofrecen un equilibrio entre costo y durabilidad. El concreto armado, el acero estructural y los acabados de cerámica son opciones populares.</p>
    `,
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122',
    author: 'Ing. Carlos Ruiz',
    date: '10 Mar 2025',
    readTime: '8 min',
    category: 'Materiales',
    tags: ['Materiales', 'Construcción', 'Calidad'],
    featured: false,
    likes: 189,
    comments: 32
  },
  {
    id: 3,
    title: 'Beneficios de la domótica en el hogar moderno',
    excerpt: 'Automatización inteligente para mayor confort, seguridad y eficiencia energética en tu hogar.',
    content: `
      <p>La domótica ha dejado de ser una tecnología futurista para convertirse en una realidad accesible que transforma la manera en que vivimos nuestros hogares.</p>
      
      <h2>Control total desde tu smartphone</h2>
      <p>Con la domótica, puedes controlar luces, temperatura, persianas y electrodomésticos desde cualquier lugar del mundo. Esto no solo ofrece comodidad, sino también ahorro energético significativo.</p>
      
      <h2>Seguridad inteligente</h2>
      <p>Los sistemas de seguridad integrados con domótica ofrecen alertas en tiempo real, cámaras de vigilancia accesibles desde el móvil y sensores de movimiento que detectan cualquier anomalía.</p>
    `,
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827',
    author: 'Tec. Laura Sánchez',
    date: '5 Mar 2025',
    readTime: '6 min',
    category: 'Tecnología',
    tags: ['Domótica', 'Smart Home', 'Eficiencia'],
    featured: false,
    likes: 156,
    comments: 28
  },
  {
    id: 4,
    title: 'Iluminación natural: Clave para el bienestar en el hogar',
    excerpt: 'Cómo aprovechar al máximo la luz natural en tu vivienda para mejorar tu calidad de vida.',
    content: `
      <p>La luz natural no solo ilumina nuestros espacios, sino que también influye en nuestro estado de ánimo, productividad y salud en general.</p>
      
      <h2>Beneficios de la luz natural</h2>
      <ul>
        <li>Mejora el estado de ánimo y reduce el estrés</li>
        <li>Aumenta la productividad y concentración</li>
        <li>Regula los ritmos circadianos</li>
        <li>Ahorro energético significativo</li>
      </ul>
      
      <h2>Estrategias para maximizar la luz natural</h2>
      <p>El uso de claraboyas, ventanas amplias, espejos estratégicos y colores claros en paredes y techos son algunas de las técnicas más efectivas para aprovechar al máximo la luz natural.</p>
    `,
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1',
    author: 'Arq. Elena Torres',
    date: '28 Feb 2025',
    readTime: '4 min',
    category: 'Arquitectura',
    tags: ['Iluminación', 'Bienestar', 'Diseño'],
    featured: false,
    likes: 98,
    comments: 15
  },
  {
    id: 5,
    title: 'El futuro de la construcción: Impresión 3D',
    excerpt: 'La tecnología de impresión 3D está revolucionando la construcción con estructuras innovadoras y eficientes.',
    content: `
      <p>La impresión 3D está transformando la industria de la construcción, permitiendo crear estructuras complejas con mayor rapidez y menos desperdicio de materiales.</p>
      
      <h2>Ventajas de la impresión 3D en construcción</h2>
      <ul>
        <li>Reducción de tiempo de construcción hasta un 50%</li>
        <li>Minimización de residuos de materiales</li>
        <li>Posibilidad de crear formas arquitectónicas únicas</li>
        <li>Reducción de costos laborales</li>
      </ul>
      
      <h2>Proyectos destacados</h2>
      <p>Ya existen casas completas impresas en 3D en varios países, demostrando que esta tecnología es viable y accesible para proyectos residenciales y comerciales.</p>
    `,
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5',
    author: 'Ing. Javier Mendoza',
    date: '20 Feb 2025',
    readTime: '7 min',
    category: 'Tecnología',
    tags: ['Impresión 3D', 'Innovación', 'Construcción'],
    featured: false,
    likes: 145,
    comments: 23
  },
  {
    id: 6,
    title: 'Espacios abiertos: La tendencia que llegó para quedarse',
    excerpt: 'El diseño de espacios abiertos mejora la funcionalidad y la conexión entre áreas del hogar.',
    content: `
      <p>Los espacios abiertos se han convertido en una de las tendencias más populares en diseño de interiores, y por buenas razones.</p>
      
      <h2>Ventajas de los espacios abiertos</h2>
      <ul>
        <li>Mayor sensación de amplitud y luminosidad</li>
        <li>Mejor flujo de comunicación entre áreas</li>
        <li>Flexibilidad en la distribución del mobiliario</li>
        <li>Integración de áreas sociales y familiares</li>
      </ul>
      
      <h2>Cómo crear espacios abiertos funcionales</h2>
      <p>La clave está en la zonificación con mobiliario, el uso de diferentes niveles y la integración de elementos arquitectónicos que definan cada espacio sin cerramientos.</p>
    `,
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba',
    author: 'Arq. Sofía Ramírez',
    date: '15 Feb 2025',
    readTime: '5 min',
    category: 'Diseño',
    tags: ['Espacios', 'Diseño Interior', 'Tendencias'],
    featured: false,
    likes: 167,
    comments: 31
  }
];

export default function ArticuloPage() {
  const params = useParams();
  const id = Number(params.id);
  const articulo = articulosData.find(a => a.id === id);

  if (!articulo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Artículo no encontrado</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">El artículo que buscas no existe o ha sido eliminado.</p>
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
          >
            <ArrowLeft size={18} />
            <span>Volver al Blog</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero del Artículo */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16 md:py-24">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container-custom relative z-10">
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 text-white/80 hover:text-white mb-6 transition"
          >
            <ArrowLeft size={18} />
            <span>Volver al Blog</span>
          </Link>
          
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                {articulo.category}
              </span>
              <span className="text-white/70 text-sm">{articulo.date}</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {articulo.title}
            </h1>
            <p className="text-xl text-blue-100">
              {articulo.excerpt}
            </p>
          </div>
        </div>
      </section>

      {/* Contenido del Artículo */}
      <div className="container-custom py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
              {/* Imagen destacada */}
              <div className="relative h-96 w-full">
                <Image
                  src={articulo.image}
                  alt={articulo.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Información del autor */}
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold">
                    {articulo.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{articulo.author}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{articulo.date}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{articulo.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition">
                    <Heart className="w-5 h-5 text-red-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition">
                    <Bookmark className="w-5 h-5 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition">
                    <Share2 className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
              
              {/* Contenido */}
              <div 
                className="p-8 prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: articulo.content }}
              />
            </div>
            
            {/* Tags */}
            <div className="mt-6 flex flex-wrap gap-2">
              {articulo.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-slate-700 rounded-full text-sm text-gray-600 dark:text-gray-300">
                  #{tag}
                </span>
              ))}
            </div>
            
            {/* Artículos relacionados */}
            <div className="mt-12">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Artículos relacionados
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {articulosData
                  .filter(a => a.id !== articulo.id && a.category === articulo.category)
                  .slice(0, 2)
                  .map((related) => (
                    <Link
                      key={related.id}
                      href={`/blog/${related.id}`}
                      className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 hover:shadow-lg transition group"
                    >
                      <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition">
                        {related.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {related.date} • {related.readTime}
                      </p>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Autor */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-3">
                {articulo.author.charAt(0)}
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">{articulo.author}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Arquitecta especialista en diseño sostenible</p>
            </div>
            
            {/* Compartir - CON ICONOS SVG DIRECTOS */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Compartir</h4>
              <div className="flex justify-center gap-3">
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#1877f2] text-white rounded-lg hover:bg-[#1877f2]/80 transition flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                
                <a 
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(articulo.title)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#000000] text-white rounded-lg hover:bg-[#000000]/80 transition flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#0a66c2] text-white rounded-lg hover:bg-[#0a66c2]/80 transition flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                
                <a 
                  href={`mailto:?subject=${encodeURIComponent(articulo.title)}&body=${encodeURIComponent(`Lee este artículo: ${window.location.href}`)}`}
                  className="w-10 h-10 bg-[#ea4335] text-white rounded-lg hover:bg-[#ea4335]/80 transition flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-1.023.902-1.82 1.636-1.82h.273L12 10.182 21.091 3.637h.273c.734 0 1.636.797 1.636 1.82z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl shadow-xl p-6 text-center">
              <h4 className="font-bold text-lg mb-2">¿Necesitas ayuda con tu proyecto?</h4>
              <p className="text-blue-100 text-sm mb-4">Contáctanos y te asesoramos sin compromiso</p>
              <Link
                href="/contacto"
                className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-lg transition"
              >
                <span>Contactar</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}