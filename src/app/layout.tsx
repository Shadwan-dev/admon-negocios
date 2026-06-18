// app/layout.tsx
import type { Metadata } from 'next';
import { Navbar } from './components/ui/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'BuildMaster Global | Construcción de Excelencia Mundial',
  description: 'Construimos tus sueños en cualquier parte del mundo.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}