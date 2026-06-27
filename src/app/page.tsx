// app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Package, 
  Calculator, 
  DollarSign, 
  ArrowRight,
  CheckCircle,
  Zap
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const features = [
  {
    icon: Package,
    title: 'Productos',
    description: 'Inventario con precios en USD y conversión automática',
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: DollarSign,
    title: 'Tasa de Cambio',
    description: 'Actualiza el dólar y todos los precios se recalcular',
    color: 'text-green-600',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    icon: Calculator,
    title: 'Fichas de Costo',
    description: 'Calcula costos de productos con ingredientes y mano de obra',
    color: 'text-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
  },
];

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* HERO */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-400 text-xs font-medium mb-4">
                <Zap size={14} />
                Gestión inteligente con Tinker
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 leading-tight">
                Administra tu negocio
                <br />
                <span className="text-blue-600 dark:text-blue-400">con Tinker</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-lg">
                Controla productos, precios y costos en una sola plataforma. 
                Conversión automática de USD a tu moneda local.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center gap-2 text-sm font-medium"
                >
                  Comenzar Ahora
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="#features"
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Ver Servicios
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">Dashboard</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">Ventas</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-white">$12.4K</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">Productos</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-white">156</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">Margen</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-white">34%</p>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg space-y-1.5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Arroz</span>
                    <span className="font-medium text-gray-800 dark:text-white">$1.20/kg</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Aceite</span>
                    <span className="font-medium text-gray-800 dark:text-white">$3.50/L</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Huevos</span>
                    <span className="font-medium text-gray-800 dark:text-white">$0.15/un</span>
                  </div>
                </div>
                <div className="mt-3 bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg text-white flex justify-between items-center">
                  <span className="text-xs opacity-80">1 USD = 24.50</span>
                  <span className="text-xs font-medium">Pesos</span>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 bg-yellow-400 dark:bg-yellow-500 text-yellow-900 dark:text-yellow-100 px-3 py-0.5 rounded-full text-xs font-bold shadow-lg">
                🔥 Popular
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="features" className="py-8 px-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Nuestros Servicios
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Herramientas diseñadas para simplificar tu gestión
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all p-4 hover:scale-[1.02]"
                >
                  <div className={`w-10 h-10 rounded-lg ${feature.bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">
              ¿Listo para empezar con Tinker?
            </h2>
            <p className="text-blue-100 text-sm mb-4">
              Únete a +500 negocios que ya confían en Tinker
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/register"
                className="px-6 py-2.5 bg-white text-blue-600 hover:bg-gray-100 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl text-sm flex items-center gap-2"
              >
                Empezar Gratis
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="px-6 py-2.5 bg-blue-700/50 hover:bg-blue-700/70 text-white rounded-lg font-semibold transition-colors border border-blue-400/50 text-sm"
              >
                Iniciar Sesión
              </Link>
            </div>
            <p className="text-blue-200 text-xs mt-3 flex items-center justify-center gap-1">
              <CheckCircle size={12} />
              Sin tarjeta de crédito
            </p>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold">Tinker</span>
          </div>
          <div className="flex gap-6 text-gray-400">
            <span>© 2024 Tinker</span>
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos</a>
            <a href="#" className="hover:text-white transition-colors">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}