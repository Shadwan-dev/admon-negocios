'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  UserPlus,
  Shield,
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  XCircle,
  X,
  Loader2,
  Mail,
  User,
  Key,
  ChevronDown,
  ChevronUp,
  Filter,
  RefreshCw,
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../../../../../hooks/useAuth';
import { 
  getUsuariosByNegocio, 
  crearUsuario, 
  actualizarUsuario, 
  toggleUsuarioActivo,
  resetearContraseña,
  getPermisosPorRol,
  Usuario,
  Permisos
} from '../../../../../lib/firebase/usuarios';
import { 
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../../../../lib/firebase/config';
import { getNegocioConfig } from '../../../../../lib/modules/modules';
import { showToast } from '../../../providers';
import { Spinner } from '../../../components/ui/Spinner';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

// ✅ Componente Modal para restablecer contraseña - CORREGIDO
function ResetPasswordModal({ 
  isOpen, 
  onClose, 
  usuario, 
  onReset,
  loading 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  usuario: Usuario | null;
  onReset: (email: string) => void;
  loading: boolean;
}) {
  if (!isOpen || !usuario) return null;

  // ✅ Función corregida con validación de db
  const verificarEmailEnUso = async (email: string) => {
    try {
      // ✅ Verificar que db no sea null/undefined
      if (!db) {
        throw new Error('Firestore no está disponible. Verifica tu conexión.');
      }

      // Buscar en la colección de usuarios
      const q = query(
        collection(db, 'usuarios'),
        where('email', '==', email)
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const usuarioDoc = snapshot.docs[0];
        const usuarioData = usuarioDoc.data();
        
        // Verificar si tiene un negocio propio
        const negocio = await getNegocioConfig(usuarioDoc.id);
        
        if (negocio) {
          return {
            existe: true,
            uid: usuarioDoc.id,
            nombre: usuarioData.nombre || 'Usuario',
            negocioNombre: negocio.nombre,
            negocioUid: usuarioDoc.id,
            esAdmin: usuarioData.rol === 'admin'
          };
        }
      }
      
      return { existe: false };
    } catch (error) {
      // ✅ Manejo correcto de error de tipo unknown
      console.error('Error verificando email:', error);
      
      if (error instanceof Error) {
        return { existe: false, error: error.message };
      }
      
      return { existe: false, error: 'Error desconocido al verificar el email' };
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <KeyRound size={20} className="text-blue-600" />
            Restablecer Contraseña
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Se enviará un correo electrónico a <strong className="text-blue-600 dark:text-blue-400">{usuario.email}</strong> 
              con un enlace para restablecer su contraseña.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              El usuario deberá hacer clic en el enlace y crear una nueva contraseña.
            </p>
          </div>

          <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <AlertCircle size={18} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              Esta acción enviará un email al usuario. No podrás ver la nueva contraseña.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onReset(usuario.email)}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <KeyRound size={18} />}
            Enviar Email
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Componente Modal para crear/editar usuario
function UsuarioModal({ 
  isOpen, 
  onClose, 
  onSave, 
  usuario,
  negocioUid,
  loading 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (data: any) => void; 
  usuario?: Usuario | null;
  negocioUid: string;
  loading: boolean;
}) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    rol: 'empleado',
    permisos: getPermisosPorRol('empleado'),
  });
  const [showPermisos, setShowPermisos] = useState(false);

  useEffect(() => {
    if (usuario) {
      setFormData({
        email: usuario.email || '',
        password: '',
        nombre: usuario.nombre || '',
        rol: usuario.rol || 'empleado',
        permisos: usuario.permisos || getPermisosPorRol('empleado'),
      });
    } else {
      setFormData({
        email: '',
        password: '',
        nombre: '',
        rol: 'empleado',
        permisos: getPermisosPorRol('empleado'),
      });
    }
  }, [usuario, isOpen]);

  const handleRolChange = (rol: string) => {
    setFormData({
      ...formData,
      rol,
      permisos: getPermisosPorRol(rol),
    });
  };

  const togglePermiso = (key: keyof Permisos) => {
    setFormData({
      ...formData,
      permisos: {
        ...formData.permisos,
        [key]: !formData.permisos[key],
      },
    });
  };

  if (!isOpen) return null;

  const isEdit = !!usuario;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre completo *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="Nombre del usuario"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Correo electrónico *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="usuario@email.com"
              disabled={isEdit}
            />
          </div>

          {/* Contraseña (solo para nuevos) */}
          {!isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contraseña *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          )}

          {/* Rol */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rol
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['admin', 'gerente', 'empleado', 'invitado'].map((rol) => (
                <button
                  key={rol}
                  onClick={() => handleRolChange(rol)}
                  className={`px-3 py-2 rounded-lg border-2 transition-all text-sm capitalize ${
                    formData.rol === rol
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {rol}
                </button>
              ))}
            </div>
          </div>

          {/* Permisos */}
          <div>
            <button
              onClick={() => setShowPermisos(!showPermisos)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {showPermisos ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              Permisos
            </button>

            <AnimatePresence>
              {showPermisos && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 space-y-1 overflow-hidden bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg"
                >
                  {Object.entries(formData.permisos).map(([key, value]) => (
                    <label
                      key={key}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => togglePermiso(key as keyof Permisos)}
                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {key.replace('_', ' ')}
                      </span>
                    </label>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(formData)}
            disabled={loading || !formData.nombre || !formData.email || (!isEdit && !formData.password)}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
            {isEdit ? 'Actualizar' : 'Crear Usuario'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function UsuariosPage() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [resetPasswordUsuario, setResetPasswordUsuario] = useState<Usuario | null>(null);
  const [negocioConfig, setNegocioConfig] = useState<any>(null);
  const [rolFiltro, setRolFiltro] = useState<string>('todos');

  useEffect(() => {
    if (user) {
      cargarDatos();
    }
  }, [user]);

  const cargarDatos = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // ✅ Validar db antes de usarlo
      if (!db) {
        throw new Error('Firestore no está disponible');
      }
      
      const [config, usuariosData] = await Promise.all([
        getNegocioConfig(user.uid),
        getUsuariosByNegocio(user.uid)
      ]);
      setNegocioConfig(config);
      setUsuarios(usuariosData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      showToast({ 
        message: error instanceof Error ? error.message : 'Error al cargar datos', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCrearUsuario = async (data: any) => {
    if (!user || !negocioConfig) return;
    setSaving(true);
    try {
      const result = await crearUsuario(
        data.email,
        data.password,
        data.nombre,
        data.rol,
        user.uid,
        data.permisos,
        user.uid
      );
      if (result.success) {
        showToast({ message: '✅ Usuario creado correctamente', type: 'success' });
        setModalOpen(false);
        await cargarDatos();
      } else {
        showToast({ message: result.error || 'Error al crear usuario', type: 'error' });
      }
    } catch (error) {
      console.error('Error al crear usuario:', error);
      showToast({ 
        message: error instanceof Error ? error.message : 'Error al crear usuario', 
        type: 'error' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEditarUsuario = async (data: any) => {
    if (!user || !editingUsuario) return;
    setSaving(true);
    try {
      const result = await actualizarUsuario(editingUsuario.uid, {
        nombre: data.nombre,
        rol: data.rol as any,
        permisos: data.permisos,
      });
      if (result.success) {
        showToast({ message: '✅ Usuario actualizado correctamente', type: 'success' });
        setModalOpen(false);
        setEditingUsuario(null);
        await cargarDatos();
      } else {
        showToast({ message: result.error || 'Error al actualizar usuario', type: 'error' });
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      showToast({ 
        message: error instanceof Error ? error.message : 'Error al actualizar usuario', 
        type: 'error' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActivo = async (uid: string, activo: boolean) => {
    try {
      const result = await toggleUsuarioActivo(uid, !activo);
      if (result.success) {
        showToast({ 
          message: `✅ Usuario ${!activo ? 'activado' : 'desactivado'} correctamente`, 
          type: 'success' 
        });
        await cargarDatos();
      } else {
        showToast({ message: result.error || 'Error al cambiar estado', type: 'error' });
      }
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      showToast({ 
        message: error instanceof Error ? error.message : 'Error al cambiar estado', 
        type: 'error' 
      });
    }
  };

  const handleResetPassword = async (email: string) => {
    if (!email) return;
    setResetLoading(true);
    try {
      const result = await resetearContraseña(email);
      if (result.success) {
        showToast({ 
          message: `✅ Email de restablecimiento enviado a ${email}`, 
          type: 'success' 
        });
        setResetPasswordUsuario(null);
      } else {
        showToast({ 
          message: result.error || 'Error al enviar email de restablecimiento', 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error al enviar email:', error);
      showToast({ 
        message: error instanceof Error ? error.message : 'Error al enviar email de restablecimiento', 
        type: 'error' 
      });
    } finally {
      setResetLoading(false);
    }
  };

  const filteredUsuarios = usuarios.filter(u => {
    const matchesSearch = u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRol = rolFiltro === 'todos' || u.rol === rolFiltro;
    return matchesSearch && matchesRol;
  });

  const totalUsuarios = usuarios.length;
  const activos = usuarios.filter(u => u.activo).length;

  if (loading) {
    return <Spinner size="lg" label="Cargando usuarios..." />;
  }

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Users size={24} className="text-blue-600" />
            Usuarios
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gestión de usuarios y permisos del negocio
          </p>
        </div>
        <button
          onClick={() => {
            setEditingUsuario(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg text-sm"
        >
          <UserPlus size={18} />
          Nuevo Usuario
        </button>
      </motion.div>

      {/* Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Usuarios</p>
          <p className="text-lg font-bold text-gray-800 dark:text-white">{totalUsuarios}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">Activos</p>
          <p className="text-lg font-bold text-green-600">{activos}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">Inactivos</p>
          <p className="text-lg font-bold text-red-600">{totalUsuarios - activos}</p>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>
          <div className="flex gap-2">
            {['todos', 'admin', 'gerente', 'empleado', 'invitado'].map((rol) => (
              <button
                key={rol}
                onClick={() => setRolFiltro(rol)}
                className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-colors ${
                  rolFiltro === rol
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {rol === 'todos' ? 'Todos' : rol}
              </button>
            ))}
          </div>
          <button
            onClick={cargarDatos}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {filteredUsuarios.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Users size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No hay usuarios registrados</p>
            <p className="text-xs mt-1">Crea el primer usuario desde el botón "Nuevo Usuario"</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Permisos
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsuarios.map((usuario) => {
                  const permisosActivos = Object.values(usuario.permisos).filter(Boolean).length;
                  const isCurrentUser = user?.uid === usuario.uid;

                  return (
                    <motion.tr
                      key={usuario.uid}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-semibold text-xs">
                            {usuario.nombre?.split(' ').map(n => n[0]).join('') || '?'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {usuario.nombre}
                              {isCurrentUser && (
                                <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">(tú)</span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{usuario.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${
                          usuario.rol === 'admin' 
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : usuario.rol === 'gerente'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                            : usuario.rol === 'empleado'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                          {usuario.rol}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {permisosActivos} módulos
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 text-xs rounded-full flex items-center gap-1 w-fit ${
                          usuario.activo
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {usuario.activo ? <CheckCircle size={12} /> : <XCircle size={12} />}
                          {usuario.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        {!isCurrentUser && (
                          <>
                            <button
                              onClick={() => {
                                setEditingUsuario(usuario);
                                setModalOpen(true);
                              }}
                              className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 transition-colors mr-1"
                              title="Editar usuario"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => setResetPasswordUsuario(usuario)}
                              className="p-1 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400 transition-colors mr-1"
                              title="Restablecer contraseña"
                            >
                              <KeyRound size={16} />
                            </button>
                            <button
                              onClick={() => handleToggleActivo(usuario.uid, usuario.activo)}
                              className={`p-1 rounded-lg transition-colors ${
                                usuario.activo
                                  ? 'hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400'
                                  : 'hover:bg-green-50 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400'
                              }`}
                              title={usuario.activo ? 'Desactivar usuario' : 'Activar usuario'}
                            >
                              {usuario.activo ? <XCircle size={16} /> : <CheckCircle size={16} />}
                            </button>
                          </>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de restablecer contraseña */}
      <ResetPasswordModal
        isOpen={!!resetPasswordUsuario}
        onClose={() => setResetPasswordUsuario(null)}
        usuario={resetPasswordUsuario}
        onReset={handleResetPassword}
        loading={resetLoading}
      />

      {/* Modal de crear/editar usuario */}
      <UsuarioModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingUsuario(null);
        }}
        onSave={editingUsuario ? handleEditarUsuario : handleCrearUsuario}
        usuario={editingUsuario}
        negocioUid={user?.uid || ''}
        loading={saving}
      />
    </div>
  );
}