import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // ✅ IMPORTANTE: Configurar para exportación estática
  output: 'export',
  
  reactStrictMode: true,
  
  // Configurar alias para importaciones
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };
    return config;
  },
  
  images: {
    unoptimized: true, // ✅ Necesario para exportación estática
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
  
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'firebase',
      '@hookform/resolvers',
      'react-hook-form',
    ],
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

console.log('📋 Variables cargadas en next.config:');
console.log('API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Definida' : '❌ No definida');

export default nextConfig;