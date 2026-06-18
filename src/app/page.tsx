// app/page.tsx
// CORREGIDO - La línea 3 estaba incompleta
'use client';
import { Hero } from './components/sections/Hero';
import { Services } from './components/sections/Services'; 
import { Stats } from './components/sections/Stats';
import { Packages } from './components/sections/Packages';
import { GlobalPresence } from './components/sections/GlobalPresence';
import { Testimonials } from './components/sections/Testimonials';
import { CTASection } from './components/sections/CTASection';
import { Blog } from './components/sections/Blog';

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <Packages />
      <GlobalPresence />
      <Testimonials />
      <Blog />
      <CTASection />
    </>
  );
}