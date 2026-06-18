'use client';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const posts = [
  {
    title: 'Tendencias en arquitectura sostenible 2025',
    excerpt: 'Descubre las últimas innovaciones en construcción ecológica y materiales sustentables.',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5',
    author: 'Arq. María Martínez',
    date: '15 Mar 2025',
    readTime: '5 min',
    category: 'Arquitectura'
  },
  {
    title: 'Cómo elegir los mejores materiales para tu construcción',
    excerpt: 'Guía completa para seleccionar materiales de calidad según tu presupuesto y necesidades.',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122',
    author: 'Ing. Carlos Ruiz',
    date: '10 Mar 2025',
    readTime: '8 min',
    category: 'Materiales'
  },
  {
    title: 'Beneficios de la domótica en el hogar moderno',
    excerpt: 'Automatización inteligente para mayor confort, seguridad y eficiencia energética.',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827',
    author: 'Tec. Laura Sánchez',
    date: '5 Mar 2025',
    readTime: '6 min',
    category: 'Tecnología'
  }
];

export const Blog = () => {
  return (
    <section className="py-24 bg-gray-50 dark:bg-slate-800">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Blog de Construcción
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mb-6" />
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Consejos, tendencias y novedades del mundo de la construcción
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article key={index} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  {post.category}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center">
                    <User size={14} className="mr-1" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <Link
                  href={`/blog/${index}`}
                  className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 group"
                >
                  <span>Leer más</span>
                  <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition" />
                </Link>
              </div>
            </article>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold"
          >
            <span>Ver todos los artículos</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};