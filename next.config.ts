// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // ← Genera archivos estáticos
  images: {
    unoptimized: true, // Necesario para exportación estática
    domains: [
      'images.unsplash.com',
      'randomuser.me',
      'firebasestorage.googleapis.com',
      'lh3.googleusercontent.com',
      'graph.facebook.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.facebook.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;