'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  UserPlus,
  UserCheck,
  UserX,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  X,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../../../../hooks/useAuth';
import { 
  getEmpleados, 
  crearEmpleado, 
  actualizarEmpleado, 
  eliminarEmpleado,
  Empleado 
} from '../../../../../lib/firebase/empleados';
import { showToast } from '../../../providers';

// Modal para crear/editar empleado
function EmpleadoModal({ 
  isOpen, 
  onClose, 
  onSave, 
  empleado, 
  loading 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (data: any) => void; 
  empleado?: Empleado | null;
  loading: boolean;
}) {
  const [formData, setFormData] = useState({
    nombre: '',
    cargo: '',
    email: '',
    telefono: '',
    salario: 0,
    estado: 'activo',
    fechaContratacion: new Date().toISOString().split('T')[0],
    notas: '',
  });

  useEffect(() => {
    if (empleado) {
      setFormData({
        nombre: empleado.nombre || '',
        cargo: empleado.cargo || '',
        email: empleado.email || '',
        telefono: empleado.telefono || '',
        salario: empleado.salario || 0,
        estado: empleado.estado || 'activo',
        fechaContratacion: empleado.fechaContratacion || new Date().toISOString().split('T')[0],
        notas: empleado.notas || '',
      });
    } else {
      setFormData({
        nombre: '',
        cargo: '',
        email: '',
        telefono: '',
        salario: 0,
        estado: 'activo',
        fechaContratacion: new Date().toISOString().split('T')[0],
        notas: '',
      });
    }
  }, [empleado, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            {empleado ? 'Editar Empleado' : 'Nuevo Empleado'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre completo *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Nombre del empleado"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cargo *
            </label>
            <input
              type="text"
              value={formData.cargo}
              onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Ej: Cajero, Cocinero..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="email@ejemplo.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Teléfono
              </label>
              <input
                type="text"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="+123456789"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Salario (USD)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.salario}
                onChange={(e) => setFormData({ ...formData, salario: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estado
              </label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value as 'activo' | 'inactivo' })}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fecha de Contratación
            </label>
            <input
              type="date"
              value={formData.fechaContratacion}
              onChange={(e) => setFormData({ ...formData, fechaContratacion: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notas
            </label>
            <textarea
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              rows={2}
              placeholder="Información adicional..."
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(formData)}
            disabled={loading || !formData.nombre.trim() || !formData.cargo.trim()}
            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
            {empleado ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function EmpleadosPage() {
  const { user } = useAuth();
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState<Empleado | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      cargarDatos();
    }
  }, [user]);

  const cargarDatos = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getEmpleados(user.uid);
      setEmpleados(data);
    } catch (error) {
      showToast({ message: 'Error al cargar empleados', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCrearEmpleado = async (data: any) => {
    if (!user) return;
    setSaving(true);
    try {
      const result = await crearEmpleado(user.uid, {
        uid: user.uid,
        ...data
      });
      if (result.success) {
        showToast({ message: '✅ Empleado creado correctamente', type: 'success' });
        setModalOpen(false);
        await cargarDatos();
      } else {
        showToast({ message: result.error || 'Error al crear empleado', type: 'error' });
      }
    } catch (error) {
      showToast({ message: 'Error al crear empleado', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleEditarEmpleado = async (data: any) => {
    if (!user || !editingEmpleado?.id) return;
    setSaving(true);
    try {
      const result = await actualizarEmpleado(user.uid, editingEmpleado.id, data);
      if (result.success) {
        showToast({ message: '✅ Empleado actualizado correctamente', type: 'success' });
        setModalOpen(false);
        setEditingEmpleado(null);
        await cargarDatos();
      } else {
        showToast({ message: result.error || 'Error al actualizar empleado', type: 'error' });
      }
    } catch (error) {
      showToast({ message: 'Error al actualizar empleado', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleEliminarEmpleado = async (empleadoId: string) => {
    if (!confirm('¿Estás seguro de eliminar este empleado?')) return;
    
    try {
      const result = await eliminarEmpleado(user!.uid, empleadoId);
      if (result.success) {
        showToast({ message: '✅ Empleado eliminado correctamente', type: 'success' });
        await cargarDatos();
      } else {
        showToast({ message: result.error || 'Error al eliminar empleado', type: 'error' });
      }
    } catch (error) {
      showToast({ message: 'Error al eliminar empleado', type: 'error' });
    }
  };

  const filteredEmpleados = empleados.filter(e => 
    e.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.cargo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activos = empleados.filter(e => e.estado === 'activo').length;
  const inactivos = empleados.filter(e => e.estado === 'inactivo').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando empleados...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            👥 Empleados
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestión de personal y salarios
          </p>
        </div>
        <button
          onClick={() => {
            setEditingEmpleado(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
          <UserPlus size={20} />
          Nuevo Empleado
        </button>
      </motion.div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Users size={20} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Empleados</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">{empleados.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <UserCheck size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Activos</p>
              <p className="text-xl font-bold text-green-600">{activos}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <UserX size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Inactivos</p>
              <p className="text-xl font-bold text-red-600">{inactivos}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar empleados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {filteredEmpleados.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <Users size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No hay empleados registrados</p>
            <p className="text-sm mt-1">Agrega empleados desde el botón "Nuevo Empleado"</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Empleado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Cargo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Salario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredEmpleados.map((emp, index) => (
                  <motion.tr
                    key={emp.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-semibold">
                          {emp.nombre?.split(' ').map(n => n[0]).join('') || '?'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">{emp.nombre}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {emp.fechaContratacion ? `Desde ${emp.fechaContratacion}` : ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-white">
                      {emp.cargo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {emp.email && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <Mail size={14} /> {emp.email}
                          </p>
                        )}
                        {emp.telefono && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <Phone size={14} /> {emp.telefono}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800 dark:text-white">
                      ${emp.salario?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${
                        emp.estado === 'activo' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {emp.estado === 'activo' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                        {emp.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button 
                        onClick={() => {
                          setEditingEmpleado(emp);
                          setModalOpen(true);
                        }}
                        className="p-1 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400 transition-colors mr-2"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => emp.id && handleEliminarEmpleado(emp.id)}
                        className="p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <EmpleadoModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingEmpleado(null);
        }}
        onSave={editingEmpleado ? handleEditarEmpleado : handleCrearEmpleado}
        empleado={editingEmpleado}
        loading={saving}
      />
    </div>
  );
}