'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Building,
  Package,
  X,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../../../../hooks/useAuth';
import { 
  getProveedores, 
  crearProveedor, 
  actualizarProveedor, 
  eliminarProveedor,
  Proveedor 
} from '../../../../../lib/firebase/proveedores';
import { showToast } from '../../../providers';

// Modal para crear/editar proveedor
function ProveedorModal({ 
  isOpen, 
  onClose, 
  onSave, 
  proveedor, 
  loading 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (data: any) => void; 
  proveedor?: Proveedor | null;
  loading: boolean;
}) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    telefono2: '',
    direccion: '',
    notas: '',
  });

  useEffect(() => {
    if (proveedor) {
      setFormData({
        nombre: proveedor.nombre || '',
        email: proveedor.email || '',
        telefono: proveedor.telefono || '',
        telefono2: proveedor.telefono2 || '',
        direccion: proveedor.direccion || '',
        notas: proveedor.notas || '',
      });
    } else {
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        telefono2: '',
        direccion: '',
        notas: '',
      });
    }
  }, [proveedor, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            {proveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
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
              Nombre del proveedor *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="Nombre del proveedor"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="email@ejemplo.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Teléfono
              </label>
              <input
                type="text"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="+123456789"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Teléfono 2
              </label>
              <input
                type="text"
                value={formData.telefono2}
                onChange={(e) => setFormData({ ...formData, telefono2: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="+987654321"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Dirección
            </label>
            <input
              type="text"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="Dirección del proveedor"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notas
            </label>
            <textarea
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none resize-none"
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
            disabled={loading || !formData.nombre.trim()}
            className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
            {proveedor ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProveedoresPage() {
  const { user } = useAuth();
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null);
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
      const data = await getProveedores(user.uid);
      setProveedores(data);
    } catch (error) {
      showToast({ message: 'Error al cargar proveedores', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCrearProveedor = async (data: any) => {
    if (!user) return;
    setSaving(true);
    try {
      const result = await crearProveedor(user.uid, {
        uid: user.uid,
        ...data,
        productos: 0
      });
      if (result.success) {
        showToast({ message: '✅ Proveedor creado correctamente', type: 'success' });
        setModalOpen(false);
        await cargarDatos();
      } else {
        showToast({ message: result.error || 'Error al crear proveedor', type: 'error' });
      }
    } catch (error) {
      showToast({ message: 'Error al crear proveedor', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleEditarProveedor = async (data: any) => {
    if (!user || !editingProveedor?.id) return;
    setSaving(true);
    try {
      const result = await actualizarProveedor(user.uid, editingProveedor.id, data);
      if (result.success) {
        showToast({ message: '✅ Proveedor actualizado correctamente', type: 'success' });
        setModalOpen(false);
        setEditingProveedor(null);
        await cargarDatos();
      } else {
        showToast({ message: result.error || 'Error al actualizar proveedor', type: 'error' });
      }
    } catch (error) {
      showToast({ message: 'Error al actualizar proveedor', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleEliminarProveedor = async (proveedorId: string) => {
    if (!confirm('¿Estás seguro de eliminar este proveedor?')) return;
    
    try {
      const result = await eliminarProveedor(user!.uid, proveedorId);
      if (result.success) {
        showToast({ message: '✅ Proveedor eliminado correctamente', type: 'success' });
        await cargarDatos();
      } else {
        showToast({ message: result.error || 'Error al eliminar proveedor', type: 'error' });
      }
    } catch (error) {
      showToast({ message: 'Error al eliminar proveedor', type: 'error' });
    }
  };

  const filteredProveedores = proveedores.filter(p => 
    p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.telefono?.includes(searchTerm)
  );

  const totalProductos = proveedores.reduce((sum, p) => sum + (p.productos || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando proveedores...</p>
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
            🏢 Proveedores
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestión de proveedores y compras
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProveedor(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
          <UserPlus size={20} />
          Nuevo Proveedor
        </button>
      </motion.div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Truck size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Proveedores</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">{proveedores.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Package size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Productos</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">{totalProductos}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Building size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Principal</p>
              <p className="text-xl font-bold text-green-600">{proveedores[0]?.nombre || 'N/A'}</p>
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
            placeholder="Buscar proveedores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {filteredProveedores.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <Truck size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No hay proveedores registrados</p>
            <p className="text-sm mt-1">Agrega proveedores desde el botón "Nuevo Proveedor"</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Proveedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Dirección
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Productos
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProveedores.map((prov, index) => (
                  <motion.tr
                    key={prov.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 font-semibold">
                          {prov.nombre?.split(' ').map(n => n[0]).join('') || '?'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">{prov.nombre}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {prov.email && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <Mail size={14} /> {prov.email}
                          </p>
                        )}
                        {prov.telefono && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <Phone size={14} /> {prov.telefono}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                      {prov.direccion ? (
                        <span className="flex items-center gap-1">
                          <MapPin size={14} /> {prov.direccion}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-white">
                      {prov.productos || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button 
                        onClick={() => {
                          setEditingProveedor(prov);
                          setModalOpen(true);
                        }}
                        className="p-1 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400 transition-colors mr-2"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => prov.id && handleEliminarProveedor(prov.id)}
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
      <ProveedorModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingProveedor(null);
        }}
        onSave={editingProveedor ? handleEditarProveedor : handleCrearProveedor}
        proveedor={editingProveedor}
        loading={saving}
      />
    </div>
  );
}