import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  images: {
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
  
  // ✅ Configuración de Turbopack (sin 'resolve')
  turbopack: {
    // La configuración de alias se maneja a través de tsconfig.json
    // No se necesita 'resolve' aquí
  },
  
  async redirects() {
    return [
      {
        source: '/productos',
        destination: '/negocio/productos',
        permanent: true,
      },
      {
        source: '/ventas',
        destination: '/negocio/ventas',
        permanent: true,
      },
      {
        source: '/produccion',
        destination: '/negocio/produccion',
        permanent: true,
      },
      {
        source: '/caja',
        destination: '/negocio/caja',
        permanent: true,
      },
      {
        source: '/empleados',
        destination: '/negocio/empleados',
        permanent: true,
      },
      {
        source: '/clientes',
        destination: '/negocio/clientes',
        permanent: true,
      },
      {
        source: '/proveedores',
        destination: '/negocio/proveedores',
        permanent: true,
      },
      {
        source: '/compras',
        destination: '/negocio/compras',
        permanent: true,
      },
      {
        source: '/reportes',
        destination: '/negocio/reportes',
        permanent: true,
      },
      {
        source: '/fichas-costo',
        destination: '/negocio/fichas-costo',
        permanent: true,
      },
    ];
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
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;