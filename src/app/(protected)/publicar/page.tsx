// app/(protected)/publicar/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Package,
  Clock,
  DollarSign,
  MapPin,
  Tag,
  FileText,
  Upload,
  X,
  Plus,
  Loader2,
  CheckCircle,
  AlertCircle,
  Building2,
  Star
} from 'lucide-react';
import { crearPublicacion } from '@/lib/firebase/marketplace';
import { getNegocioConfig } from '@/lib/modules/modules';
import { uploadMultipleImages } from '@/lib/firebase/storage';
import { showToast } from '../../providers';

// Tipos
interface FormData {
  tipo: 'producto' | 'servicio';
  titulo: string;
  descripcion: string;
  precio: number;
  moneda: 'USD' | 'CUP' | 'ARS' | 'MXN' | 'EUR';
  categoria: string;
  ubicacion: string;
  stock: number;
  duracion: string;
  imagenes: string[];
}

const CATEGORIAS = [
  { id: 'construccion', label: 'Construcción' },
  { id: 'remodelacion', label: 'Remodelación' },
  { id: 'diseno', label: 'Diseño' },
  { id: 'materiales', label: 'Materiales' },
  { id: 'mano-de-obra', label: 'Mano de obra' },
  { id: 'Consumible', label: 'Listo para la venta' },
  { id: 'Producto Final', label: 'Listo para la venta' },
  { id: 'Comestible', label: 'Listo para la venta' },
  { id: 'Bebidas', label: 'Listo para la venta' },
  { id: 'otros', label: 'Otros' },
];

const MONEDAS = [
  { value: 'USD', label: 'USD $' },
  { value: 'CUP', label: 'CUP $' },
  { value: 'ARS', label: 'ARS $' },
  { value: 'MXN', label: 'MXN $' },
  { value: 'EUR', label: 'EUR €' },
];

export default function PublicarPage() {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [negocio, setNegocio] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    tipo: 'producto',
    titulo: '',
    descripcion: '',
    precio: 0,
    moneda: 'USD',
    categoria: '',
    ubicacion: '',
    stock: 0,
    duracion: '',
    imagenes: [],
  });
  const [imagenesPreview, setImagenesPreview] = useState<string[]>([]);
  const [subiendoImagenes, setSubiendoImagenes] = useState(false);
  const [cargandoNegocio, setCargandoNegocio] = useState(true);

  // Cargar datos del negocio
  useEffect(() => {
    if (user) {
      cargarNegocio();
    } else {
      setCargandoNegocio(false);
    }
  }, [user]);

  const cargarNegocio = async () => {
    if (!user) return;
    setCargandoNegocio(true);
    try {
      const config = await getNegocioConfig(user.uid);
      if (config) {
        setNegocio(config);
      } else {
        showToast({ 
          message: 'Primero debes crear tu negocio en Administración', 
          type: 'error' 
        });
        router.push('/administracion');
      }
    } catch (error) {
      console.error('Error cargando negocio:', error);
      showToast({ 
        message: 'Error al cargar la información del negocio', 
        type: 'error' 
      });
    } finally {
      setCargandoNegocio(false);
    }
  };

  // Manejar subida de imágenes
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // ✅ Limitar a máximo 5 imágenes
    if (imagenesPreview.length + files.length > 5) {
      showToast({ message: 'Máximo 5 imágenes por publicación', type: 'error' });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const nuevasImagenes: string[] = [];
    const archivos: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        showToast({ message: `La imagen ${file.name} excede 5MB`, type: 'error' });
        continue;
      }
      archivos.push(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        nuevasImagenes.push(reader.result as string);
        if (nuevasImagenes.length === archivos.length) {
          setImagenesPreview(prev => [...prev, ...nuevasImagenes]);
        }
      };
      reader.readAsDataURL(file);
    }

    // Resetear input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const eliminarImagen = (index: number) => {
    setImagenesPreview(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormData({
      tipo: 'producto',
      titulo: '',
      descripcion: '',
      precio: 0,
      moneda: 'USD',
      categoria: '',
      ubicacion: '',
      stock: 0,
      duracion: '',
      imagenes: [],
    });
    setImagenesPreview([]);
    setStep(1);
  };

  // Validar formulario
  const validarFormulario = () => {
    if (!formData.titulo.trim()) {
      showToast({ message: 'Ingresa un título', type: 'error' });
      return false;
    }
    if (!formData.descripcion.trim()) {
      showToast({ message: 'Ingresa una descripción', type: 'error' });
      return false;
    }
    if (formData.precio <= 0) {
      showToast({ message: 'Ingresa un precio válido', type: 'error' });
      return false;
    }
    if (!formData.categoria) {
      showToast({ message: 'Selecciona una categoría', type: 'error' });
      return false;
    }
    if (!formData.ubicacion.trim()) {
      showToast({ message: 'Ingresa una ubicación', type: 'error' });
      return false;
    }
    if (formData.tipo === 'producto' && (formData.stock < 0 || isNaN(formData.stock))) {
      showToast({ message: 'Ingresa un stock válido', type: 'error' });
      return false;
    }
    if (formData.tipo === 'servicio' && !formData.duracion.trim()) {
      showToast({ message: 'Ingresa la duración estimada', type: 'error' });
      return false;
    }
    if (imagenesPreview.length === 0) {
      showToast({ message: 'Agrega al menos una imagen', type: 'error' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;
    if (!user || !negocio) {
      showToast({ message: 'Debes iniciar sesión y tener un negocio', type: 'error' });
      return;
    }

    setLoading(true);
    setSubiendoImagenes(true);

    try {
      // ✅ Subir imágenes a Firebase Storage
      const imagenesUrls = await uploadMultipleImages(
        imagenesPreview,
        `publicaciones/${user.uid}`
      );

      setSubiendoImagenes(false);

      // ✅ Crear publicación
      const publicacionData = {
        uid: user.uid,
        negocioId: negocio.id,
        negocioNombre: negocio.nombre,
        tipo: formData.tipo,
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        precio: formData.precio,
        moneda: formData.moneda,
        categoria: formData.categoria as any,
        ubicacion: formData.ubicacion,
        imagenes: imagenesUrls,
        stock: formData.tipo === 'producto' ? formData.stock : undefined,
        duracion: formData.tipo === 'servicio' ? formData.duracion : undefined,
        activo: true,
        destacado: false,
      };

      const result = await crearPublicacion(publicacionData);
      
      if (result) {
        showToast({ message: '¡Publicación creada con éxito!', type: 'success' });
        // ✅ Resetear formulario y redirigir
        resetForm();
        setTimeout(() => router.push('/tienda'), 1500);
      }
    } catch (error) {
      console.error('Error creando publicación:', error);
      showToast({ 
        message: 'Error al crear la publicación. Intenta de nuevo.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
      setSubiendoImagenes(false);
    }
  };

  if (cargandoNegocio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Cargando información del negocio...</p>
        </div>
      </div>
    );
  }
  

  // Renderizar steps
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Tipo de publicación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Tipo de publicación
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, tipo: 'producto'})}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.tipo === 'producto'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                  }`}
                >
                  <Package className={`mx-auto mb-2 ${formData.tipo === 'producto' ? 'text-blue-600' : 'text-gray-400'}`} size={28} />
                  <p className="font-semibold text-gray-900 dark:text-white">Producto</p>
                  <p className="text-sm text-gray-500">Artículos físicos</p>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, tipo: 'servicio'})}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.tipo === 'servicio'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                  }`}
                >
                  <Clock className={`mx-auto mb-2 ${formData.tipo === 'servicio' ? 'text-blue-600' : 'text-gray-400'}`} size={28} />
                  <p className="font-semibold text-gray-900 dark:text-white">Servicio</p>
                  <p className="text-sm text-gray-500">Trabajo o asesoría</p>
                </button>
              </div>
            </div>

            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Título *
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Ej: Construcción de casa de 100m²"
                maxLength={100}
              />
              <p className="text-xs text-gray-400 mt-1">
                {formData.titulo.length}/100 caracteres
              </p>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descripción *
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                placeholder="Describe tu producto o servicio en detalle..."
                maxLength={1000}
              />
              <p className="text-xs text-gray-400 mt-1">
                {formData.descripcion.length}/1000 caracteres
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Siguiente →
              </button>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Precio y Moneda */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Precio *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="number"
                    value={formData.precio || ''}
                    onChange={(e) => setFormData({...formData, precio: parseFloat(e.target.value) || 0})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Moneda
                </label>
                <select
                  value={formData.moneda}
                  onChange={(e) => setFormData({...formData, moneda: e.target.value as any})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                >
                  {MONEDAS.map((moneda) => (
                    <option key={moneda.value} value={moneda.value}>
                      {moneda.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Categoría *
              </label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              >
                <option value="">Seleccionar categoría</option>
                {CATEGORIAS.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Ubicación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ubicación *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Ciudad, País"
                />
              </div>
            </div>

            {/* Stock o Duración */}
            <div>
              {formData.tipo === 'producto' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Stock disponible
                  </label>
                  <input
                    type="number"
                    value={formData.stock || ''}
                    onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Cantidad disponible"
                    min="0"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duración estimada *
                  </label>
                  <input
                    type="text"
                    value={formData.duracion}
                    onChange={(e) => setFormData({...formData, duracion: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Ej: 2 semanas, 3 días, 1 mes"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition"
              >
                ← Anterior
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Siguiente →
              </button>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Imágenes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Imágenes *
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
              >
                <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                <p className="text-gray-600 dark:text-gray-300">Haz clic para subir imágenes</p>
                <p className="text-sm text-gray-400">PNG, JPG, WebP - Hasta 5MB cada una</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Preview de imágenes */}
              {imagenesPreview.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                  {imagenesPreview.map((img, index) => (
                    <div key={index} className="relative group aspect-square">
                      <Image
                        src={img}
                        alt={`Imagen ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => eliminarImagen(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Resumen de la publicación */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Resumen de la publicación</h3>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <p><span className="font-medium">Tipo:</span> {formData.tipo}</p>
                <p><span className="font-medium">Título:</span> {formData.titulo}</p>
                <p><span className="font-medium">Precio:</span> {formData.moneda} {formData.precio}</p>
                <p><span className="font-medium">Categoría:</span> {CATEGORIAS.find(c => c.id === formData.categoria)?.label}</p>
                <p><span className="font-medium">Ubicación:</span> {formData.ubicacion}</p>
                {formData.tipo === 'producto' && (
                  <p><span className="font-medium">Stock:</span> {formData.stock}</p>
                )}
                {formData.tipo === 'servicio' && (
                  <p><span className="font-medium">Duración:</span> {formData.duracion}</p>
                )}
                <p><span className="font-medium">Imágenes:</span> {imagenesPreview.length}</p>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition"
              >
                ← Anterior
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    {subiendoImagenes ? 'Subiendo imágenes...' : 'Publicando...'}
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Publicar en la tienda
                  </>
                )}
              </button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (!negocio && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building2 size={64} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            No tienes un negocio configurado
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Ve a Administración para crear tu negocio
          </p>
          <button
            onClick={() => router.push('/administracion')}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Ir a Administración
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Publicar en la Tienda
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {negocio?.nombre} - {negocio?.tipo}
          </p>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  s === step
                    ? 'bg-blue-600 text-white'
                    : s < step
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}
              >
                {s < step ? <CheckCircle size={16} /> : s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-0.5 ${s < step ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Formulario */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            {renderStep()}
          </form>
        </div>
      </div>
    </div>
  );
}