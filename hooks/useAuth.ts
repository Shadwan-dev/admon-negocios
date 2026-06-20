'use client';

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange } from '@/lib/firebase/auth';
import { checkFirebaseConnection } from '@/lib/firebase/config';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkConnection = async () => {
      try {
        const status = await checkFirebaseConnection();
        if (mounted) {
          setFirebaseReady(status.success);
          if (!status.success) {
            setError('Firebase no está disponible. Verifica tu conexión.');
          }
        }
      } catch (err) {
        if (mounted) {
          setError('Error al conectar con Firebase');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkConnection();

    const unsubscribe = onAuthStateChange((user) => {
      if (mounted) {
        setUser(user);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  return { user, loading, error, firebaseReady };
}