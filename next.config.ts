import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ✅ Exportación estática (eliminar "headers")
  output: 'export',
  
  reactStrictMode: true,
  
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '**',
      },
    ],
  },
  
  // ✅ Agregar configuración vacía de Turbopack para silenciar el error
  turbopack: {},
  
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'firebase',
      '@hookform/resolvers',
      'react-hook-form',
    ],
  },
};

console.log('📋 Variables cargadas en next.config:');
console.log('API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Definida' : '❌ No definida');

export default nextConfig;