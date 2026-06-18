// app/auth/LoginForm.tsx
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle, 
  Loader
} from 'lucide-react';
import { 
  loginWithEmail, 
  loginWithGoogle, 
  loginWithFacebook,
  loginWithGithub,
  resetPassword 
} from '@/lib/firebase/auth';

// SVGs optimizados
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.282-3.282C17.708 1.745 15.068 0 12 0 7.31 0 3.255 2.69 1.276 6.609l3.99 3.156z"/>
    <path fill="#34A853" d="M16.218 18.545A7.04 7.04 0 0 1 12 19.091c-3.066 0-5.682-1.964-6.734-4.891L1.276 17.39C3.255 21.31 7.31 24 12 24c3.068 0 5.708-1.745 6.863-4.273l-4.645-3.182z"/>
    <path fill="#4A90E2" d="M20.745 10.273H12v5.455h4.91c-.5 1.527-1.782 2.545-3.273 2.545-1.782 0-3.273-1.091-3.873-2.636l-3.99 3.156C7.327 21.309 7.31 24 12 24c3.068 0 5.708-1.745 6.863-4.273l-4.645-3.182z"/>
    <path fill="#FBBC05" d="M5.266 9.765l3.99 3.156C8.745 11.364 9.818 9.273 12 9.273c1.782 0 3.273 1.091 3.873 2.636l3.99-3.156C17.708 1.745 15.068 0 12 0 7.31 0 3.255 2.69 1.276 6.609l3.99 3.156z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877f2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const GithubIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

export const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetMode, setResetMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (resetMode) {
        await resetPassword(email);
        setSuccess('Email de restablecimiento enviado. Revisa tu bandeja de entrada.');
        return;
      }

      await loginWithEmail(email, password);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error:', error);
      if (error.code === 'auth/user-not-found') {
        setError('No existe una cuenta con este email.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Contraseña incorrecta.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Email inválido.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Demasiados intentos. Intenta más tarde.');
      } else {
        setError('Error al iniciar sesión. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'github') => {
    setLoading(true);
    setError('');
    try {
      if (provider === 'google') {
        await loginWithGoogle();
      } else if (provider === 'facebook') {
        await loginWithFacebook();
      } else if (provider === 'github') {
        await loginWithGithub();
      }
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Ventana emergente cerrada. Intenta de nuevo.');
      } else {
        setError(`Error al iniciar sesión con ${provider}.`);
      }
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {resetMode ? 'Restablecer Contraseña' : 'Iniciar Sesión'}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          {resetMode 
            ? 'Te enviaremos un enlace para restablecer tu contraseña.' 
            : 'Accede a tu cuenta para gestionar tus proyectos.'}
        </p>
      </div>

      {/* Mensajes de estado */}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="tu@email.com"
            />
          </div>
        </div>

        {/* Password */}
        {!resetMode && (
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
        )}

        {/* Botón de acción */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-white font-semibold transition-all duration-300 ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
          }`}
        >
          {loading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <span>{resetMode ? 'Enviar enlace' : 'Iniciar Sesión'}</span>
          )}
        </button>

        {/* Enlaces de ayuda */}
        <div className="flex flex-col space-y-2 text-center">
          {!resetMode ? (
            <>
              <button
                type="button"
                onClick={() => setResetMode(true)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ¿No tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/register')}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Regístrate aquí
                </button>
              </p>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setResetMode(false)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Volver a iniciar sesión
            </button>
          )}
        </div>

        {/* Social Login */}
        {!resetMode && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                  O continúa con
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Google */}
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
                className="flex items-center justify-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition active:scale-95"
                aria-label="Iniciar sesión con Google"
              >
                <GoogleIcon />
              </button>

              {/* Facebook */}
              <button
                type="button"
                onClick={() => handleSocialLogin('facebook')}
                disabled={loading}
                className="flex items-center justify-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition active:scale-95"
                aria-label="Iniciar sesión con Facebook"
              >
                <FacebookIcon />
              </button>

              {/* GitHub */}
              <button
                type="button"
                onClick={() => handleSocialLogin('github')}
                disabled={loading}
                className="flex items-center justify-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition active:scale-95 dark:text-white"
                aria-label="Iniciar sesión con GitHub"
              >
                <GithubIcon />
              </button>
            </div>
          </>
        )}
      </form>
    </motion.div>
  );
};