// src/components/sections/Stats.tsx
'use client';
import { useEffect, useState, useRef } from 'react';
import { Building, Globe, Users, Trophy } from 'lucide-react';

const StatCard = ({ icon: Icon, value, label, suffix = '' }: any) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const step = value / (duration / 16);
          let current = 0;
          
          const timer = setInterval(() => {
            current += step;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, 16);
          
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div ref={elementRef} className="text-center p-6">
      <div className="inline-flex p-4 bg-blue-600/10 rounded-full mb-4">
        <Icon size={32} className="text-blue-300" />
      </div>
      <div className="text-4xl md:text-5xl font-bold mb-2">
        {count}{suffix}
      </div>
      <div className="text-gray-300 dark:text-gray-300 font-medium">{label}</div>
    </div>
  );
};

export const Stats = () => {
  const stats = [
    { icon: Building, value: 500, label: 'Proyectos Completados', suffix: '+' },
    { icon: Globe, value: 50, label: 'Países', suffix: '+' },
    { icon: Users, value: 200, label: 'Profesionales', suffix: '+' },
    { icon: Trophy, value: 15, label: 'Años de Experiencia', suffix: '' },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};