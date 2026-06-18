// app/api/files/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

// Configuración - Cambia esto según tu unidad mapeada
const UNIDAD_BASE = process.env.UNIDAD_BASE || 'Z:/'; 

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  let ruta = searchParams.get('ruta') || UNIDAD_BASE;
  
  // Seguridad: prevenir path traversal
  const rutaNormalizada = path.normalize(ruta);
  if (!rutaNormalizada.startsWith(path.normalize(UNIDAD_BASE))) {
    return NextResponse.json(
      { error: 'Acceso denegado: no puedes salir de la unidad base' },
      { status: 403 }
    );
  }
  
  try {
    // Verificar si la ruta existe
    if (!existsSync(rutaNormalizada)) {
      return NextResponse.json(
        { error: 'La ruta no existe' },
        { status: 404 }
      );
    }
    
    // Leer directorio
    const items = await readdir(rutaNormalizada);
    const detalles = await Promise.all(
      items.map(async (item) => {
        const rutaCompleta = path.join(rutaNormalizada, item);
        try {
          const stats = await stat(rutaCompleta);
          return {
            nombre: item,
            esDirectorio: stats.isDirectory(),
            tamaño: stats.size,
            modificado: stats.mtime.toISOString(),
            ruta: rutaCompleta
          };
        } catch (err) {
          return {
            nombre: item,
            esDirectorio: false,
            tamaño: 0,
            modificado: null,
            ruta: rutaCompleta,
            error: true
          };
        }
      })
    );
    
    // Ordenar: directorios primero, luego archivos
    detalles.sort((a, b) => {
      if (a.esDirectorio === b.esDirectorio) {
        return a.nombre.localeCompare(b.nombre);
      }
      return a.esDirectorio ? -1 : 1;
    });
    
    return NextResponse.json({
      success: true,
      rutaActual: rutaNormalizada,
      archivos: detalles
    });
    
  } catch (error) {
    console.error('Error al leer directorio:', error);
    return NextResponse.json(
      { error: 'Error al leer el directorio' },
      { status: 500 }
    );
  }
}