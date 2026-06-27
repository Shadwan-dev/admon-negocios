// components/marketplace/GoogleMapsAutocomplete.tsx
'use client';

import { useState } from 'react';

interface Props {
  value: string;
  onChange: (value: string, coordenadas?: { lat: number; lng: number }) => void;
  placeholder?: string;
  className?: string;
}

export const GoogleMapsAutocomplete = ({ 
  value, 
  onChange, 
  placeholder = 'Dirección de entrega...', 
  className = '' 
}: Props) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${className}`}
    />
  );
};