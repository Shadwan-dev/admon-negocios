// app/auth/RegisterForm.tsx
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle, 
  Loader, 
  Briefcase 
} from 'lucide-react';
import { registerWithEmail, loginWithGoogle, loginWithFacebook } from '@/lib/firebase/auth';

export const RegisterForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: 'cliente' as 'cliente' | 'contratista',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      await registerWithEmail(formData.email, formData.password, formData.nombre, formData.rol);
      setSuccess('Cuenta creada con éxito. Revisa tu email para verificar tu cuenta.');
      setTimeout(() => router.push('/login'), 3000);
    } catch (error: any) {
      console.error('Error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('Este email ya está registrado.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Email inválido.');
      } else if (error.code === 'auth/weak-password') {
        setError('Contraseña demasiado débil.');
      } else {
        setError('Error al crear la cuenta. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    setError('');
    try {
      if (provider === 'google') {
        await loginWithGoogle();
      } else {
        await loginWithFacebook();
      }
      router.push('/');
    } catch (error: any) {
      setError(`Error al registrarse con ${provider}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Crear Cuenta</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Únete a BuildMaster Global y comienza tu proyecto
        </p>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 p-3 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </motion.div>
      )}

      {success && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 p-3 mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-300"
        >
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{success}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre completo
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Juan Pérez"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="tu@email.com"
            />
          </div>
        </div>

        {/* Rol */}
        <div>
          <label htmlFor="rol" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tipo de cuenta
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              id="rol"
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
            >
              <option value="cliente">Cliente - Quiero construir</option>
              <option value="contratista">Contratista - Ofrezco servicios</option>
            </select>
          </div>
        </div>

        {/* Contraseña */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Confirmar Contraseña */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirmar Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-white font-semibold transition-all duration-300 ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
          }`}
        >
          {loading ? <Loader className="w-5 h-5 animate-spin" /> : <span>Crear Cuenta</span>}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ¿Ya tienes cuenta?{' '}
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">
              O regístrate con
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSocialRegister('google')}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.282-3.282C17.708 1.745 15.068 0 12 0 7.31 0 3.255 2.69 1.276 6.609l3.99 3.156z"/>
              <path fill="#34A853" d="M16.218 18.545A7.04 7.04 0 0 1 12 19.091c-3.066 0-5.682-1.964-6.734-4.891L1.276 17.39C3.255 21.31 7.31 24 12 24c3.068 0 5.708-1.745 6.863-4.273l-4.645-3.182z"/>
              <path fill="#4A90E2" d="M20.745 10.273H12v5.455h4.91c-.5 1.527-1.782 2.545-3.273 2.545-1.782 0-3.273-1.091-3.873-2.636l-3.99 3.156C7.327 21.309 7.31 24 12 24c3.068 0 5.708-1.745 6.863-4.273l-4.645-3.182z"/>
              <path fill="#FBBC05" d="M5.266 9.765l3.99 3.156C8.745 11.364 9.818 9.273 12 9.273c1.782 0 3.273 1.091 3.873 2.636l3.99-3.156C17.708 1.745 15.068 0 12 0 7.31 0 3.255 2.69 1.276 6.609l3.99 3.156z"/>
            </svg>
            <span className="text-sm font-medium">Google</span>
          </button>
          <button
            type="button"
            onClick={() => handleSocialRegister('facebook')}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition"
          >
            <svg className="w-5 h-5 text-[#1877f2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span className="text-sm font-medium">Facebook</span>
          </button>
        </div>
      </form>
    </motion.div>
  );
};