// app/tienda/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  DollarSign,
  Heart,
  ShoppingCart,
  Eye,
  X,
  UserCircle,
  Package,
  Clock,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { obtenerPublicaciones } from '@/lib/firebase/marketplace';
import { Publicacion, Resena } from '@/types/marketplace';
import { showToast } from '../providers';

// ✅ Eliminar la definición local de Publicacion

const CATEGORIAS = [
  { id: 'todos', label: 'Todos' },
  { id: 'construccion', label: 'Construcción' },
  { id: 'remodelacion', label: 'Remodelación' },
  { id: 'diseno', label: 'Diseño' },
  { id: 'materiales', label: 'Materiales' },
  { id: 'mano-de-obra', label: 'Mano de obra' },
  { id: 'otros', label: 'Otros' },
];

export default function TiendaPage() {
  const { user } = useAuth();
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todos');
  const [tipoSeleccionado, setTipoSeleccionado] = useState<'todos' | 'producto' | 'servicio'>('todos');

  useEffect(() => {
    cargarPublicaciones();
  }, []);

  const cargarPublicaciones = async () => {
    setLoading(true);
    try {
      const data = await obtenerPublicaciones();
      setPublicaciones(data);
    } catch (error) {
      console.error('Error cargando publicaciones:', error);
      showToast({ message: 'Error al cargar la tienda', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Filtrar publicaciones
  const publicacionesFiltradas = publicaciones.filter((pub) => {
    const matchSearch = pub.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        pub.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        pub.negocioNombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = categoriaSeleccionada === 'todos' || pub.categoria === categoriaSeleccionada;
    const matchTipo = tipoSeleccionado === 'todos' || pub.tipo === tipoSeleccionado;
    return matchSearch && matchCategoria && matchTipo;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Cargando tienda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header de la tienda */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                🛒 Tienda
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Encuentra productos y servicios de construcción
              </p>
            </div>
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar productos o servicios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-2 mt-4">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoriaSeleccionada(cat.id)}
                className={`px-3 py-1.5 rounded-full text-sm transition ${
                  categoriaSeleccionada === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-1" />
            <button
              onClick={() => setTipoSeleccionado('todos')}
              className={`px-3 py-1.5 rounded-full text-sm transition ${
                tipoSeleccionado === 'todos'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setTipoSeleccionado('producto')}
              className={`px-3 py-1.5 rounded-full text-sm transition flex items-center gap-1 ${
                tipoSeleccionado === 'producto'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Package size={14} />
              Productos
            </button>
            <button
              onClick={() => setTipoSeleccionado('servicio')}
              className={`px-3 py-1.5 rounded-full text-sm transition flex items-center gap-1 ${
                tipoSeleccionado === 'servicio'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Clock size={14} />
              Servicios
            </button>
          </div>
        </div>
      </div>

      {/* Grid de publicaciones */}
      <div className="container-custom py-8">
        {publicacionesFiltradas.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              No hay publicaciones disponibles
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {searchTerm ? 'No se encontraron resultados para tu búsqueda' : 'Sé el primero en publicar un producto o servicio'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {publicacionesFiltradas.map((pub, index) => (
              <motion.div
                key={pub.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition-all overflow-hidden group"
              >
                <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                  {pub.imagenes && pub.imagenes.length > 0 ? (
                    <Image
                      src={pub.imagenes[0]}
                      alt={pub.titulo}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Package size={40} />
                    </div>
                  )}
                  {pub.destacado && (
                    <span className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                      ⭐ Destacado
                    </span>
                  )}
                  <span className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-0.5 rounded-full text-xs">
                    {pub.tipo === 'producto' ? '📦 Producto' : '🛠️ Servicio'}
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {pub.titulo}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {pub.negocioNombre}
                      </p>
                    </div>
                    <div className="flex items-center text-yellow-400 ml-2">
                      <Star size={16} fill="currentColor" />
                      <span className="text-sm ml-1 text-gray-600 dark:text-gray-300">
                        {pub.valoracionPromedio.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                    {pub.descripcion}
                  </p>

                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <MapPin size={14} />
                    <span>{pub.ubicacion}</span>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {pub.moneda} {pub.precio.toFixed(2)}
                      </span>
                      {pub.tipo === 'producto' && pub.stock !== undefined && (
                        <p className="text-xs text-gray-500">Stock: {pub.stock}</p>
                      )}
                      {pub.tipo === 'servicio' && pub.duracion && (
                        <p className="text-xs text-gray-500">⏱️ {pub.duracion}</p>
                      )}
                    </div>
                    <Link
                      href={`/tienda/${pub.id}`}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition flex items-center gap-1"
                    >
                      <Eye size={14} />
                      Ver más
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}