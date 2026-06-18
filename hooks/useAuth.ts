// hooks/useAuth.ts
// hooks/useAuth.ts
'use client';
import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange } from '@/lib/firebase/auth'; // ← Importamos la función, no auth directamente

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};