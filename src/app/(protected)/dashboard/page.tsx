// app/(protected)/dashboard/page.tsx
'use client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Building2, 
  FolderGit2, 
  Users, 
  Calendar, 
  CheckCircle,
  ArrowRight,
  Plus,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  // Datos de ejemplo (después conectarás con Firebase)
  const stats = [
    { icon: FolderGit2, label: 'Proyectos Activos', value: '3', color: 'blue' },
    { icon: Users, label: 'Equipo Asignado', value: '12', color: 'green' },
    { icon: Calendar, label: 'Próximas Entregas', value: '2', color: 'amber' },
    { icon: CheckCircle, label: 'Completados', value: '8', color: 'purple' },
  ];

  const recentProjects = [
    { name: 'Casa Moderna - Miami', status: 'En Progreso', progress: 65 },
    { name: 'Oficinas Corporativas - NY', status: 'En Diseño', progress: 30 },
    { name: 'Remodelación - Bogotá', status: 'Completado', progress: 100 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Hola, {user?.displayName || user?.email?.split('@')[0]} 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Bienvenido a tu panel de control de BuildMaster Global
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
              <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/20 rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Proyectos Recientes */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Proyectos Recientes
                </h2>
                <Link
                  href="/proyectos"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  Ver todos
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="space-y-4">
                {recentProjects.map((project, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{project.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{project.status}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-24 bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {project.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Acciones Rápidas
              </h2>
              <div className="space-y-3">
                <Link
                  href="/proyectos/nuevo"
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"
                >
                  <Plus className="w-5 h-5" />
                  <span>Nuevo Proyecto</span>
                </Link>
                <Link
                  href="/servicios"
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-xl transition"
                >
                  <Building2 className="w-5 h-5" />
                  <span>Explorar Servicios</span>
                </Link>
                <Link
                  href="/contacto"
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition"
                >
                  <Clock className="w-5 h-5" />
                  <span>Solicitar Cotización</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}