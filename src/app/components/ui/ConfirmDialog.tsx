// components/ui/ConfirmDialog.tsx
'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  loading = false,
}: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={24} className="text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <X size={18} />}
            {loading ? 'Eliminando...' : confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
};