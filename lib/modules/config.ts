import { Module } from './types';

// ✅ Catálogo completo de módulos disponibles
export const MODULOS_DISPONIBLES: Module[] = [
  {
    id: 'inventario',
    nombre: '📦 Inventario / Almacén',
    descripcion: 'Control de stock, entradas y salidas de productos. Alertas de stock bajo.',
    icono: '📦',
    categoria: 'operaciones',
    activo: false,
    configuracion: {
      tieneProductos: true,
      tieneStock: true,
    },
    permisos: { leer: true, escribir: true, eliminar: false },
  },
  {
    id: 'ventas',
    nombre: '💰 Ventas',
    descripcion: 'Registro de ventas, facturación, clientes, métodos de pago.',
    icono: '💰',
    categoria: 'operaciones',
    activo: false,
    dependencias: ['inventario'],
    configuracion: {
      tieneClientes: true,
      tieneFacturacion: true,
    },
    permisos: { leer: true, escribir: true, eliminar: false },
  },
  {
    id: 'produccion',
    nombre: '🏭 Producción / Elaboración',
    descripcion: 'Gestión de recetas, órdenes de producción, costos de elaboración.',
    icono: '🏭',
    categoria: 'operaciones',
    activo: false,
    dependencias: ['inventario'],
    configuracion: {
      tieneRecetas: true,
      tieneOrdenes: true,
    },
    permisos: { leer: true, escribir: true, eliminar: false },
  },
  {
    id: 'caja',
    nombre: '💵 Caja / Finanzas',
    descripcion: 'Cierres de caja, arqueo, ingresos, egresos, balances diarios.',
    icono: '💵',
    categoria: 'finanzas',
    activo: false,
    dependencias: ['ventas'],
    configuracion: {
      tieneArqueo: true,
      tieneCierres: true,
    },
    permisos: { leer: true, escribir: true, eliminar: false },
  },
  {
    id: 'empleados',
    nombre: '👥 Empleados / RRHH',
    descripcion: 'Gestión de trabajadores, salarios, descuentos, responsabilidad material.',
    icono: '👥',
    categoria: 'recursos',
    activo: false,
    configuracion: {
      tieneSalarios: true,
      tieneDescuentos: true,
      tieneBonos: true,
    },
    permisos: { leer: true, escribir: true, eliminar: false },
  },
  {
    id: 'reportes',
    nombre: '📊 Reportes',
    descripcion: 'Generación de reportes, estadísticas, análisis de datos.',
    icono: '📊',
    categoria: 'administracion',
    activo: false,
    configuracion: {
      tieneExportacion: true,
      tieneGraficos: true,
    },
    permisos: { leer: true, escribir: false, eliminar: false },
  },
  {
    id: 'clientes',
    nombre: '👤 Clientes',
    descripcion: 'Gestión de clientes, historial de compras, créditos.',
    icono: '👤',
    categoria: 'operaciones',
    activo: false,
    dependencias: ['ventas'],
    permisos: { leer: true, escribir: true, eliminar: false },
  },
  {
    id: 'proveedores',
    nombre: '🏢 Proveedores',
    descripcion: 'Gestión de proveedores, compras, precios de compra.',
    icono: '🏢',
    categoria: 'operaciones',
    activo: false,
    dependencias: ['inventario'],
    permisos: { leer: true, escribir: true, eliminar: false },
  },
  {
    id: 'compras',
    nombre: '🛒 Compras',
    descripcion: 'Registro de compras a proveedores, órdenes de compra, facturas.',
    icono: '🛒',
    categoria: 'operaciones',
    activo: false,
    dependencias: ['inventario', 'proveedores'],
    permisos: { leer: true, escribir: true, eliminar: false },
  },
];

// ✅ Módulos obligatorios (siempre activos)
export const MODULOS_OBLIGATORIOS: string[] = ['inventario'];

// ✅ Módulos por categoría
export const MODULOS_POR_CATEGORIA = {
  administracion: ['reportes'],
  operaciones: ['inventario', 'ventas', 'produccion', 'clientes', 'proveedores', 'compras'],
  finanzas: ['caja'],
  recursos: ['empleados'],
};

// ✅ Tipos de negocio predefinidos
export const TIPOS_NEGOCIO = {
  restaurante: {
    nombre: '🍽️ Restaurante',
    modulosRecomendados: ['inventario', 'ventas', 'produccion', 'caja', 'empleados'],
  },
  tienda: {
    nombre: '🏪 Tienda',
    modulosRecomendados: ['inventario', 'ventas', 'caja', 'clientes'],
  },
  supermercado: {
    nombre: '🛒 Supermercado',
    modulosRecomendados: ['inventario', 'ventas', 'caja', 'proveedores', 'compras', 'empleados'],
  },
  farmacia: {
    nombre: '💊 Farmacia',
    modulosRecomendados: ['inventario', 'ventas', 'caja', 'clientes', 'proveedores'],
  },
  taller: {
    nombre: '🔧 Taller',
    modulosRecomendados: ['inventario', 'ventas', 'caja', 'empleados', 'clientes'],
  },
  otros: {
    nombre: '📋 Otros',
    modulosRecomendados: ['inventario', 'ventas', 'caja'],
  },
};