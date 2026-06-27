// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from './components/ui/Navbar';

export const metadata: Metadata = {
  title: {
    default: 'Tinker - Gestión Inteligente',
    template: '%s | Tinker',
  },
  description:
    'Plataforma integral para administrar tu negocio: productos, precios, fichas de costo y más.',
  keywords: ['gestión empresarial', 'inventario', 'precios', 'fichas de costo', 'Tinker'],
  authors: [{ name: 'Tinker' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <Providers>
          <Navbar />
          <main className="pt-16">{children}</main>
        </Providers>
      </body>
    </html>
  );
}