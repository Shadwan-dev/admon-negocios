// app/contacto/page.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  CheckCircle,
  AlertCircle,
  Building2,
  Globe2,
  User,
  Briefcase,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

// SVG de redes sociales
const SocialIcons = {
  Facebook: () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  Twitter: () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  Instagram: () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  ),
  LinkedIn: () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  YouTube: () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  WhatsApp: () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
  TikTok: () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  )
};

// Esquema de validación con Zod
const contactSchema = z.object({
  user_name: z.string().min(2, 'El nombre es requerido'),
  user_email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'El asunto es requerido'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
  service: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contacto() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Configuración de EmailJS (reemplaza con tus credenciales)
      const result = await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID',
        formRef.current!,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY'
      );
      
      console.log('Email enviado:', result.text);
      setSubmitStatus('success');
      reset();
      
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Error al enviar:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Oficina Central',
      details: 'Miami, Florida, USA',
      sub: '1234 Construction Ave, Suite 100'
    },
    {
      icon: Phone,
      title: 'Teléfono',
      details: '+1 (305) 123-4567',
      sub: 'Lunes a Viernes 9am - 6pm'
    },
    {
      icon: Mail,
      title: 'Email',
      details: 'info@buildmaster.com',
      sub: 'Respuesta en 24 horas'
    },
    {
      icon: Clock,
      title: 'Horario',
      details: 'Lunes - Viernes',
      sub: '9:00 AM - 6:00 PM (EST)'
    }
  ];

  const socialNetworks = [
    { name: 'Facebook', icon: SocialIcons.Facebook, color: 'hover:bg-[#1877f2]', url: '#' },
    { name: 'Twitter', icon: SocialIcons.Twitter, color: 'hover:bg-[#000000]', url: '#' },
    { name: 'Instagram', icon: SocialIcons.Instagram, color: 'hover:bg-[#e4405f]', url: '#' },
    { name: 'LinkedIn', icon: SocialIcons.LinkedIn, color: 'hover:bg-[#0a66c2]', url: '#' },
    { name: 'YouTube', icon: SocialIcons.YouTube, color: 'hover:bg-[#ff0000]', url: '#' },
    { name: 'WhatsApp', icon: SocialIcons.WhatsApp, color: 'hover:bg-[#25d366]', url: '#' },
    { name: 'TikTok', icon: SocialIcons.TikTok, color: 'hover:bg-[#000000]', url: '#' },
  ];

  const services = [
    'Construcción Residencial',
    'Proyectos Comerciales',
    'Remodelaciones',
    'Instalaciones Hidráulicas',
    'Instalaciones Eléctricas',
    'Acabados de Lujo',
    'Diseño Arquitectónico',
    'Consultoría',
    'Otro'
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section con animación */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-24 overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contacto</h1>
            <div className="w-20 h-1 bg-amber-500 mx-auto mb-6" />
            <p className="text-xl text-blue-100">
              Estamos aquí para ayudarte. Cuéntanos tu proyecto y te daremos una respuesta en menos de 24 horas.
            </p>
          </motion.div>
        </div>
      </motion.section>

      <div className="container-custom py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1 space-y-4"
          >
            {contactInfo.map((info, index) => (
              <motion.div 
                key={index}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow group"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors">
                    <info.icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{info.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{info.details}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{info.sub}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Social Media con SVG */}
            <motion.div 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Síguenos</h3>
              <div className="grid grid-cols-4 gap-3">
                {socialNetworks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full aspect-square bg-gray-100 dark:bg-slate-700 rounded-xl flex items-center justify-center text-gray-700 dark:text-gray-300 ${social.color} transition-all duration-300 hover:text-white group`}
                    aria-label={social.name}
                  >
                    <social.icon />
                  </motion.a>
                ))}
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Síguenos en todas nuestras redes sociales
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Form con React Hook Form */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Envíanos un mensaje
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Completa el formulario y te contactaremos a la brevedad.
              </p>

              <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Nombre y Email */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nombre completo *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="user_name"
                        {...register('user_name')}
                        className={`w-full pl-10 pr-4 py-3 border ${errors.user_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                        placeholder="Juan Pérez"
                      />
                      {errors.user_name && (
                        <p className="mt-1 text-sm text-red-500">{errors.user_name.message}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="user_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        id="user_email"
                        {...register('user_email')}
                        className={`w-full pl-10 pr-4 py-3 border ${errors.user_email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                        placeholder="juan@ejemplo.com"
                      />
                      {errors.user_email && (
                        <p className="mt-1 text-sm text-red-500">{errors.user_email.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Teléfono y Servicio */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Teléfono
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        id="phone"
                        {...register('phone')}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="+1 (305) 123-4567"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Servicio de interés
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        id="service"
                        {...register('service')}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
                      >
                        <option value="">Selecciona un servicio</option>
                        {services.map((service) => (
                          <option key={service} value={service}>{service}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Asunto */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Asunto *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    {...register('subject')}
                    className={`w-full px-4 py-3 border ${errors.subject ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                    placeholder="Consulta sobre construcción"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>
                  )}
                </div>

                {/* Mensaje */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    {...register('message')}
                    rows={5}
                    className={`w-full px-4 py-3 border ${errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none`}
                    placeholder="Cuéntanos sobre tu proyecto..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-xl text-white font-semibold transition-all duration-300 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Enviar Mensaje</span>
                    </>
                  )}
                </motion.button>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-300"
                  >
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span>¡Mensaje enviado con éxito! Te contactaremos pronto.</span>
                  </motion.div>
                )}
                {submitStatus === 'error' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.</span>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>

        {/* Map Section mejorado */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="h-80 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center relative">
              <div className="text-center">
                <Building2 className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">Ubicación de nuestra oficina central</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Miami, Florida, USA</p>
                <motion.a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center space-x-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Globe2 className="w-4 h-4" />
                  <span>Ver en Google Maps</span>
                </motion.a>
              </div>
              {/* Aquí puedes integrar @react-google-maps/api después */}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}