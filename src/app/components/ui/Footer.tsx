// components/ui/Footer.tsx
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="font-bold text-xl">BM</span>
              </div>
              <span className="text-xl font-bold">BuildMaster Global</span>
            </div>
            <p className="text-gray-400 mb-4">
              Construyendo excelencia alrededor del mundo desde 2010. Más de 500 proyectos completados con éxito.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-blue-400 transition">Inicio</Link></li>
              <li><Link href="/servicios" className="text-gray-400 hover:text-blue-400 transition">Servicios</Link></li>
              <li><Link href="/proyectos" className="text-gray-400 hover:text-blue-400 transition">Proyectos</Link></li>
              <li><Link href="/paquetes" className="text-gray-400 hover:text-blue-400 transition">Paquetes</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-blue-400 transition">Blog</Link></li>
              <li><Link href="/contacto" className="text-gray-400 hover:text-blue-400 transition">Contacto</Link></li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Servicios</h3>
            <ul className="space-y-2">
              <li><Link href="/servicios/residencial" className="text-gray-400 hover:text-blue-400 transition">Construcción Residencial</Link></li>
              <li><Link href="/servicios/comercial" className="text-gray-400 hover:text-blue-400 transition">Proyectos Comerciales</Link></li>
              <li><Link href="/servicios/remodelaciones" className="text-gray-400 hover:text-blue-400 transition">Remodelaciones</Link></li>
              <li><Link href="/servicios/diseno" className="text-gray-400 hover:text-blue-400 transition">Diseño Arquitectónico</Link></li>
              <li><Link href="/servicios/consultoria" className="text-gray-400 hover:text-blue-400 transition">Consultoría</Link></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-blue-400 mt-0.5" />
                <span className="text-gray-400">Oficina Central: Miami, Florida, USA</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-blue-400" />
                <span className="text-gray-400">+1 (305) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-blue-400" />
                <span className="text-gray-400">info@buildmaster.com</span>
              </li>
            </ul>
            <div className="mt-4">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-400">Disponibles 24/7</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 BuildMaster Global. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacidad" className="text-gray-400 hover:text-blue-400 transition">Política de Privacidad</Link>
              <Link href="/terminos" className="text-gray-400 hover:text-blue-400 transition">Términos y Condiciones</Link>
              <Link href="/cookies" className="text-gray-400 hover:text-blue-400 transition">Política de Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};