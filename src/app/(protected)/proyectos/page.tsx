// app/(protected)/proyectos/page.tsx
'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search,
  Filter,
  ArrowRight,
  Calendar,
  MapPin,
  Users,
  Home,
  Building2,
  Wrench,
  Star,
  Eye,
  ChevronDown,
  X
} from 'lucide-react';

// Datos de proyectos
const proyectosData = [
  {
    id: 1,
    title: 'Villa Moderna en la Playa',
    category: 'residencial',
    location: 'Miami Beach, Florida',
    year: '2024',
    description: 'Espectacular villa de 450m² con diseño contemporáneo, piscina infinita y acabados de lujo.',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
    gallery: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5',
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122'
    ],
    features: ['Piscina infinita', 'Domótica', 'Paneles solares', 'Acabados de lujo'],
    size: '450m²',
    bedrooms: 5,
    bathrooms: 6,
    status: 'completado',
    cliente: 'Familia Martínez'
  },
  {
    id: 2,
    title: 'Oficinas Corporativas Tower',
    category: 'comercial',
    location: 'Downtown, Miami',
    year: '2024',
    description: 'Edificio corporativo de 20 pisos con certificación LEED Platinum y tecnología de punta.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5'
    ],
    features: ['LEED Platinum', 'Eficiencia energética', 'Smart building', 'Green spaces'],
    size: '25,000m²',
    bedrooms: 0,
    bathrooms: 50,
    status: 'completado',
    cliente: 'Empresa Global Corp'
  },
  {
    id: 3,
    title: 'Remodelación de Casa Histórica',
    category: 'remodelaciones',
    location: 'Coral Gables, Florida',
    year: '2023',
    description: 'Restauración y remodelación de una casa histórica de 1920 preservando su arquitectura original.',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba',
    gallery: [
      'https://images.unsplash.com/photo-1556911220-bff31c812dba',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914'
    ],
    features: ['Preservación histórica', 'Acabados premium', 'Sistemas modernos', 'Diseño de interiores'],
    size: '320m²',
    bedrooms: 4,
    bathrooms: 3,
    status: 'completado',
    cliente: 'Familia Rodríguez'
  },
  {
    id: 4,
    title: 'Complejo Residencial Parque Central',
    category: 'residencial',
    location: 'Buenos Aires, Argentina',
    year: '2024',
    description: 'Complejo de 5 torres residenciales con áreas verdes, piscinas y amenities de lujo.',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5',
    gallery: [
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab'
    ],
    features: ['Áreas verdes', 'Piscinas', 'Gimnasio', 'Seguridad 24h'],
    size: '15,000m²',
    bedrooms: 120,
    bathrooms: 150,
    status: 'en-progreso',
    cliente: 'Inversiones Central'
  },
  {
    id: 5,
    title: 'Local Comercial Food Court',
    category: 'comercial',
    location: 'Bogotá, Colombia',
    year: '2023',
    description: 'Moderno food court con diseño innovador y espacios gastronómicos de primer nivel.',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba',
    gallery: [
      'https://images.unsplash.com/photo-1556911220-bff31c812dba',
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1'
    ],
    features: ['Diseño gastronómico', 'Sistemas de extracción', 'Espacios abiertos', 'Terraza'],
    size: '800m²',
    bedrooms: 0,
    bathrooms: 10,
    status: 'completado',
    cliente: 'Grupo Gourmet'
  },
  {
    id: 6,
    title: 'Renovación de Oficinas Ejecutivas',
    category: 'remodelaciones',
    location: 'Ciudad de México, México',
    year: '2024',
    description: 'Renovación completa de oficinas ejecutivas con diseño moderno y tecnología avanzada.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1'
    ],
    features: ['Diseño colaborativo', 'Smart offices', 'Eficiencia energética', 'Acústica'],
    size: '2,000m²',
    bedrooms: 0,
    bathrooms: 15,
    status: 'completado',
    cliente: 'Consultoría Global'
  }
];

const categorias = [
  { id: 'todos', label: 'Todos los Proyectos', icon: Filter },
  { id: 'residencial', label: 'Residencial', icon: Home },
  { id: 'comercial', label: 'Comercial', icon: Building2 },
  { id: 'remodelaciones', label: 'Remodelaciones', icon: Wrench }
];

export default function ProyectosPage() {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<typeof proyectosData[0] | null>(null);

  const filteredProjects = useMemo(() => {
    return proyectosData.filter(proyecto => {
      const matchesCategory = selectedCategory === 'todos' || proyecto.category === selectedCategory;
      const matchesSearch = proyecto.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          proyecto.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'completado': { label: 'Completado', color: 'bg-green-500' },
      'en-progreso': { label: 'En Progreso', color: 'bg-amber-500' },
    };
    return statusMap[status as keyof typeof statusMap] || { label: status, color: 'bg-gray-500' };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Nuestros Proyectos
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Descubre nuestra calidad y experiencia a través de los proyectos que hemos realizado alrededor del mundo.
              +500 proyectos completados con éxito.
            </p>
          </div>
        </div>
      </section>

      {/* Filtros y Búsqueda */}
      <section className="py-8 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-30">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Categorías */}
            <div className="flex flex-wrap gap-2">
              {categorias.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      selectedCategory === cat.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Buscador */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar proyectos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Proyectos */}
      <section className="py-16">
        <div className="container-custom">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No se encontraron proyectos con estos filtros.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((proyecto) => {
                const statusBadge = getStatusBadge(proyecto.status);
                return (
                  <div
                    key={proyecto.id}
                    className="group bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={proyecto.image}
                        alt={proyecto.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${statusBadge.color}`}>
                          {statusBadge.label}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center justify-between text-white">
                          <div>
                            <p className="text-sm opacity-90">{proyecto.category}</p>
                            <h3 className="text-lg font-bold">{proyecto.title}</h3>
                          </div>
                          <button
                            onClick={() => setSelectedProject(proyecto)}
                            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 p-2 rounded-full transition"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4 mb-3">
                        <div className="flex items-center space-x-1">
                          <MapPin size={14} />
                          <span>{proyecto.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>{proyecto.year}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {proyecto.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>{proyecto.size}</span>
                          {proyecto.bedrooms > 0 && (
                            <>
                              <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                              <span>{proyecto.bedrooms} habs</span>
                            </>
                          )}
                          {proyecto.bathrooms > 0 && (
                            <>
                              <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                              <span>{proyecto.bathrooms} baños</span>
                            </>
                          )}
                        </div>
                        <Link
                          href={`/proyectos/${proyecto.id}`}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm group/link flex items-center"
                        >
                          Ver detalles
                          <ArrowRight size={14} className="ml-1 group-hover/link:translate-x-1 transition" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Tienes un proyecto en mente?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Cuéntanos tu idea y hagamos realidad tu proyecto con la calidad que nos caracteriza.
            </p>
            <Link
              href="/contacto"
              className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span>Contactar Ahora</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Modal de Proyecto */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-900 z-10 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedProject.title}</h2>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="relative h-64 rounded-xl overflow-hidden mb-6">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                    {selectedProject.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm text-white ${getStatusBadge(selectedProject.status).color}`}>
                    {getStatusBadge(selectedProject.status).label}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300">{selectedProject.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Ubicación</span>
                    <p className="font-medium">{selectedProject.location}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Año</span>
                    <p className="font-medium">{selectedProject.year}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Tamaño</span>
                    <p className="font-medium">{selectedProject.size}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Cliente</span>
                    <p className="font-medium">{selectedProject.cliente}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Características destacadas</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.features.map((feature, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-slate-700 rounded-full text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Link
                  href="/contacto"
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
                  onClick={() => setSelectedProject(null)}
                >
                  <span>Cotizar proyecto similar</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}