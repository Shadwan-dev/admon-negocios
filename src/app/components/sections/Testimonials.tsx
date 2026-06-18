// components/sections/Testimonials.tsx
'use client';
import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Carlos López',
    location: 'Miami, USA',
    project: 'Construcción de casa de playa',
    rating: 5,
    text: 'Excelente trabajo, cumplieron todos los plazos y el acabado es impecable. El equipo es muy profesional y siempre estuvieron en comunicación.',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    date: 'Enero 2024'
  },
  {
    name: 'María González',
    location: 'Madrid, España',
    project: 'Remodelación completa de oficinas',
    rating: 5,
    text: 'La mejor experiencia de construcción que he tenido. Superaron mis expectativas en calidad y servicio post-venta.',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
    date: 'Febrero 2024'
  },
  {
    name: 'Roberto Silva',
    location: 'São Paulo, Brasil',
    project: 'Construcción de edificio comercial',
    rating: 5,
    text: 'Constructores confiables, con excelentes precios y materiales de primera. Los recomiendo ampliamente.',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
    date: 'Diciembre 2023'
  },
  {
    name: 'Ana Rodríguez',
    location: 'Bogotá, Colombia',
    project: 'Ampliación de vivienda',
    rating: 4,
    text: 'Muy contenta con el resultado. El equipo fue puntual y respetuoso. Solo un pequeño retraso pero lo compensaron.',
    image: 'https://randomuser.me/api/portraits/women/4.jpg',
    date: 'Marzo 2024'
  }
];

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const visibleTestimonials = testimonials.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6" />
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Más de 500 clientes satisfechos alrededor del mundo
          </p>
        </div>

        <div className="relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleTestimonials.map((testimonial, index) => (
              <div key={index} className="card relative">
                <Quote className="absolute top-6 right-6 text-blue-200 dark:text-blue-900 w-12 h-12" />
                
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                    <p className="text-xs text-blue-600">{testimonial.project}</p>
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={`${
                        i < testimonial.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                <div className="mt-4 text-xs text-gray-400">{testimonial.date}</div>
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-12 space-x-4">
              <button
                onClick={prev}
                className="p-2 rounded-full bg-gray-200 dark:bg-slate-700 hover:bg-blue-600 hover:text-white transition"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={next}
                className="p-2 rounded-full bg-gray-200 dark:bg-slate-700 hover:bg-blue-600 hover:text-white transition"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>
        
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-1 bg-green-50 dark:bg-green-900/20 rounded-full px-4 py-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-green-700 dark:text-green-300 ml-2">
              4.9 de 5 - Basado en 1,200+ reseñas verificadas
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};