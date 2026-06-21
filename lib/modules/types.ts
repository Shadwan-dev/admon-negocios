// ✅ Definir tipo específico para los tipos de negocio
export type TipoNegocio = 'restaurante' | 'tienda' | 'supermercado' | 'farmacia' | 'taller' | 'otros';

// Tipos de módulos disponibles
export type ModuleId = 
  | 'inventario'
  | 'ventas'
  | 'produccion'
  | 'caja'
  | 'empleados'
  | 'reportes'
  | 'clientes'
  | 'proveedores'
  | 'compras';

// Interfaz de un módulo
export interface Module {
  id: ModuleId;
  nombre: string;
  descripcion: string;
  icono: string;
  categoria: 'administracion' | 'operaciones' | 'finanzas' | 'recursos';
  activo: boolean;
  requerido?: boolean;
  dependencias?: ModuleId[];
  configuracion?: {
    tieneProductos?: boolean;
    tieneStock?: boolean;
    tienePrecios?: boolean;
    [key: string]: any;
  };
  permisos?: {
    leer: boolean;
    escribir: boolean;
    eliminar: boolean;
  };
}

// Configuración del negocio
export interface NegocioConfig {
  uid: string;
  nombre: string;
  tipo: TipoNegocio; // ✅ Usar el tipo específico
  modulosActivos: ModuleId[];
  configuraciones?: {
    [key: string]: any;
  };
  createdAt?: any;
  updatedAt?: any;
}