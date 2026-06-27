// app/tienda/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Star,
  MapPin,
  DollarSign,
  Package,
  Clock,
  UserCircle,
  Calendar,
  Heart,
  ShoppingCart,
  Loader2,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Phone,
  Mail,
  Building2,
  Share2,
  Truck,
  Shield,
  X
} from 'lucide-react';
import { obtenerPublicacionPorId } from '@/lib/firebase/marketplace';
import { crearSolicitud } from '@/lib/firebase/solicitudes';
import { showToast } from '../../providers';
import { GoogleMapsAutocomplete } from '../../components/marketplace/GoogleMapsAutocomplete';

export default function DetallePublicacionPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [publicacion, setPublicacion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [solicitando, setSolicitando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [formSolicitud, setFormSolicitud] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    mensaje: '',
    cantidad: 1,
  });
  const [coordenadas, setCoordenadas] = useState<{ lat: number; lng: number } | undefined>();

  useEffect(() => {
    if (id) {
      cargarPublicacion();
    }
  }, [id]);

  const cargarPublicacion = async () => {
    setLoading(true);
    try {
      const data = await obtenerPublicacionPorId(id as string);
      if (data) {
        setPublicacion(data);
      } else {
        showToast({ message: 'Publicación no encontrada', type: 'error' });
        router.push('/tienda');
      }
    } catch (error) {
      console.error('Error cargando publicación:', error);
      showToast({ message: 'Error al cargar la publicación', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSolicitar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast({ message: 'Debes iniciar sesión para solicitar', type: 'error' });
      router.push('/login');
      return;
    }

    if (!formSolicitud.nombre || !formSolicitud.telefono || !formSolicitud.direccion) {
      showToast({ message: 'Completa todos los campos requeridos', type: 'error' });
      return;
    }

    setSolicitando(true);
    try {
      const solicitudData = {
        publicacionId: publicacion.id,
        vendedorUid: publicacion.uid,
        compradorUid: user.uid,
        compradorNombre: formSolicitud.nombre,
        compradorEmail: user.email || '',
        telefono: formSolicitud.telefono,
        direccion: formSolicitud.direccion,
        coordenadas: coordenadas,
        mensaje: formSolicitud.mensaje,
        cantidad: formSolicitud.cantidad || 1,
        totalPrecio: publicacion.precio * (formSolicitud.cantidad || 1),
        estado: 'pendiente' as const, // ✅ Usar 'as const' para tipado literal
        fechaSolicitud: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await crearSolicitud(solicitudData);
      showToast({ 
        message: '✅ Solicitud enviada. El vendedor te contactará pronto.', 
        type: 'success' 
      });
      setMostrarModal(false);
      setFormSolicitud({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        mensaje: '',
        cantidad: 1,
      });
    } catch (error) {
      console.error('Error creando solicitud:', error);
      showToast({ message: 'Error al enviar la solicitud', type: 'error' });
    } finally {
      setSolicitando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!publicacion) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-custom py-6">
        {/* Botón volver */}
        <Link
          href="/tienda"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition mb-6"
        >
          <ArrowLeft size={18} />
          Volver a la tienda
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Imágenes */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="relative h-96 bg-gray-200 dark:bg-gray-700">
                {publicacion.imagenes && publicacion.imagenes.length > 0 ? (
                  <Image
                    src={publicacion.imagenes[0]}
                    alt={publicacion.titulo}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Package size={64} />
                  </div>
                )}
                {publicacion.destacado && (
                  <span className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ⭐ Destacado
                  </span>
                )}
              </div>
              {publicacion.imagenes && publicacion.imagenes.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-4">
                  {publicacion.imagenes.slice(1, 5).map((img: string, index: number) => (
                    <div key={index} className="relative h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <Image src={img} alt={`Imagen ${index + 2}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Información */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 space-y-6 sticky top-20">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  {publicacion.tipo === 'producto' ? (
                    <Package size={16} className="text-blue-600" />
                  ) : (
                    <Clock size={16} className="text-purple-600" />
                  )}
                  <span>{publicacion.tipo === 'producto' ? 'Producto' : 'Servicio'}</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {publicacion.titulo}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <Building2 size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {publicacion.negocioNombre}
                  </span>
                </div>
              </div>

              {/* Valoración */}
              <div className="flex items-center gap-4 py-3 border-y border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-1">
                  <Star size={20} className="text-yellow-400 fill-current" />
                  <span className="font-semibold">{publicacion.valoracionPromedio?.toFixed(1) || '0.0'}</span>
                  <span className="text-sm text-gray-500">({publicacion.totalReseñas || 0} reseñas)</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin size={16} />
                  {publicacion.ubicacion}
                </div>
              </div>

              {/* Precio */}
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {publicacion.moneda} {publicacion.precio?.toFixed(2)}
                </div>
                {publicacion.tipo === 'producto' && publicacion.stock !== undefined && (
                  <p className="text-sm text-gray-500 mt-1">
                    📦 Stock: {publicacion.stock} unidades
                  </p>
                )}
                {publicacion.tipo === 'servicio' && publicacion.duracion && (
                  <p className="text-sm text-gray-500 mt-1">
                    ⏱️ Duración estimada: {publicacion.duracion}
                  </p>
                )}
              </div>

              {/* Descripción */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Descripción</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {publicacion.descripcion}
                </p>
              </div>

              {/* Botón de solicitud */}
              <button
                onClick={() => setMostrarModal(true)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Solicitar
              </button>

              {/* Acciones secundarias */}
              <div className="flex gap-2">
                <button className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2">
                  <Heart size={16} />
                  Guardar
                </button>
                <button className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2">
                  <Share2 size={16} />
                  Compartir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Solicitud */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Solicitar {publicacion.titulo}
              </h2>
              <button
                onClick={() => setMostrarModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSolicitar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={formSolicitud.nombre}
                  onChange={(e) => setFormSolicitud({...formSolicitud, nombre: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={formSolicitud.telefono}
                  onChange={(e) => setFormSolicitud({...formSolicitud, telefono: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="+1 (305) 123-4567"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Dirección de entrega *
                </label>
                <input
                  type="text"
                  value={formSolicitud.direccion}
                  onChange={(e) => {
                    setFormSolicitud({...formSolicitud, direccion: e.target.value});
                  }}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Calle, número, ciudad"
                  required
                />
              </div>

              {publicacion.tipo === 'producto' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={publicacion.stock || 99}
                    value={formSolicitud.cantidad}
                    onChange={(e) => setFormSolicitud({...formSolicitud, cantidad: parseInt(e.target.value) || 1})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mensaje para el vendedor
                </label>
                <textarea
                  value={formSolicitud.mensaje}
                  onChange={(e) => setFormSolicitud({...formSolicitud, mensaje: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                  placeholder="Detalles adicionales sobre tu solicitud..."
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <AlertCircle size={18} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  El vendedor recibirá tu solicitud y te contactará para coordinar los detalles.
                </p>
              </div>

              <button
                type="submit"
                disabled={solicitando}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition flex items-center justify-center gap-2"
              >
                {solicitando ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <CheckCircle size={20} />
                )}
                {solicitando ? 'Enviando...' : 'Enviar Solicitud'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}