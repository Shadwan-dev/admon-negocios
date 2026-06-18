// app/blog/page.tsx
'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  Calendar, 
  User, 
  Clock, 
  Tag, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  BookOpen,
  Users,
  MessageCircle,
  Heart
} from 'lucide-react';

// Datos de artículos del blog
const articulosData = [
  {
    id: 1,
    title: 'Tendencias en arquitectura sostenible 2025',
    excerpt: 'Descubre las últimas innovaciones en construcción ecológica y materiales sustentables que están revolucionando la industria.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
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
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
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
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
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
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
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
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
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
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
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

const categorias = ['Todos', 'Arquitectura', 'Materiales', 'Tecnología', 'Diseño'];

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredArticles = useMemo(() => {
    return articulosData.filter(articulo => {
      const matchesCategory = selectedCategory === 'Todos' || articulo.category === selectedCategory;
      const matchesSearch = articulo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          articulo.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          articulo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const featuredArticle = articulosData.find(a => a.featured);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Blog de Construcción
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Consejos, tendencias y novedades del mundo de la construcción. 
              Información valiosa para tus proyectos.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="py-12 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-gray-700">
          <div className="container-custom">
            <div className="flex items-center gap-2 text-sm text-amber-500 font-semibold mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Artículo Destacado</span>
            </div>
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden">
                <Image
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                    {featuredArticle.category}
                  </span>
                  <span>{featuredArticle.date}</span>
                  <span>{featuredArticle.readTime}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  {featuredArticle.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {featuredArticle.excerpt}
                </p>
                <Link
                  href={`/blog/${featuredArticle.id}`}
                  className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 group"
                >
                  <span>Leer más</span>
                  <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filtros y Búsqueda */}
      <section className="py-8 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-30">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Categorías */}
            <div className="flex flex-wrap gap-2">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Buscador */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Artículos */}
      <section className="py-16">
        <div className="container-custom">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No se encontraron artículos con estos filtros.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((articulo) => (
                <article key={articulo.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={articulo.image}
                      alt={articulo.title}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold">
                        {articulo.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{articulo.author}</span>
                      </div>
                      <span>•</span>
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
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {articulo.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {articulo.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/blog/${articulo.id}`}
                        className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 group"
                      >
                        <span>Leer más</span>
                        <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition" />
                      </Link>
                      
                      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Heart size={14} className="text-red-500" />
                          <span>{articulo.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle size={14} />
                          <span>{articulo.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container-custom text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Suscríbete al Newsletter</h2>
            <p className="text-blue-100 mb-6">
              Recibe los mejores consejos de construcción y las últimas tendencias directamente en tu correo.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="px-4 py-3 rounded-lg text-gray-900 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button className="bg-amber-500 hover:bg-amber-600 px-6 py-3 rounded-lg font-semibold transition">
                Suscribirme
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}