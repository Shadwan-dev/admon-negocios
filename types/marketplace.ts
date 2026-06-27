// types/marketplace.ts
export interface Publicacion {
  id?: string;
  uid: string; // ID del vendedor
  negocioId: string;
  negocioNombre: string;
  tipo: 'producto' | 'servicio';
  titulo: string;
  descripcion: string;
  precio: number;
  moneda: 'USD' | 'CUP' | 'ARS' | 'MXN' | 'EUR';
  categoria: 'construccion' | 'remodelacion' | 'diseno' | 'materiales' | 'mano-de-obra' | 'otros';
  imagenes: string[];
  ubicacion: string;
  coordenadas?: {
    lat: number;
    lng: number;
  };
  stock?: number; // Solo para productos
  duracion?: string; // Solo para servicios (ej: "2 semanas")
  activo: boolean;
  destacado: boolean;
  valoracionPromedio: number;
  totalReseñas: number;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export interface Solicitud {
  id?: string;
  publicacionId: string;
  vendedorUid: string;
  compradorUid: string;
  compradorNombre: string;
  compradorEmail: string;
  telefono: string;
  direccion: string;
  coordenadas?: {
    lat: number;
    lng: number;
  };
  mensaje?: string;
  cantidad?: number;
  fechaSolicitud: Date;
  estado: 'pendiente' | 'aceptado' | 'rechazado' | 'completado' | 'cancelado';
  totalPrecio: number;
  fechaEntrega?: Date;
  comentarioVendedor?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Resena {
  id?: string;
  publicacionId: string;
  compradorUid: string;
  compradorNombre: string;
  calificacion: number; // 1-5
  comentario: string;
  imagenes?: string[];
  fecha: Date;
  verificado: boolean; // Solo compras completadas
  createdAt: Date;
  updatedAt: Date;
}

export interface Notificacion {
  id?: string;
  uid: string; // Usuario destinatario
  tipo: 'solicitud' | 'aceptado' | 'rechazado' | 'completado' | 'cancelado' | 'reseña';
  mensaje: string;
  data: {
    solicitudId?: string;
    publicacionId?: string;
    url?: string;
  };
  leido: boolean;
  createdAt: Date;
  updatedAt: Date;
}