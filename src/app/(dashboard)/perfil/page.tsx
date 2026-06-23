'use client';

import { useState } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import { resetearContraseña } from '../../../../lib/firebase/usuarios';
import { showToast } from '../../providers';
import { Button } from './../../components/ui/Button';
import { KeyRound, Mail, User } from 'lucide-react';

export default function PerfilPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const result = await resetearContraseña(user.email);
      if (result.success) {
        showToast({ 
          message: `✅ Email de restablecimiento enviado a ${user.email}`, 
          type: 'success' 
        });
      } else {
        showToast({ 
          message: result.error || 'Error al enviar email', 
          type: 'error' 
        });
      }
    } catch (error) {
      showToast({ message: 'Error al enviar email', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Mi Perfil
        </h2>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <User size={18} className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Nombre</p>
              <p className="text-gray-800 dark:text-white">{user?.displayName || 'Sin nombre'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <Mail size={18} className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Correo electrónico</p>
              <p className="text-gray-800 dark:text-white">{user?.email}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={handleResetPassword}
              loading={loading}
              icon={<KeyRound size={18} />}
              variant="ghost"
            >
              Restablecer mi contraseña
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Recibirás un enlace por correo electrónico para crear una nueva contraseña
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}