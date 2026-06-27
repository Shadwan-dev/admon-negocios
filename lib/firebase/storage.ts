// lib/firebase/storage.ts
import { storage } from './config';
import { ref, uploadBytes, getDownloadURL, deleteObject, FirebaseStorage } from 'firebase/storage';

// ✅ Función de seguridad para obtener storage
const getStorage = (): FirebaseStorage => {
  if (!storage) {
    throw new Error('Storage no está disponible. Asegúrate de estar en el cliente y tener conexión.');
  }
  return storage;
};

export const uploadImage = async (imageData: string, path: string): Promise<string> => {
  try {
    const storageInstance = getStorage(); // ✅ Obtener storage segura
    
    // ✅ Verificar que la imagen es válida
    if (!imageData || !imageData.startsWith('data:image')) {
      throw new Error('Formato de imagen inválido');
    }

    // Convertir base64 a Blob
    const response = await fetch(imageData);
    if (!response.ok) {
      throw new Error('Error al descargar la imagen');
    }
    const blob = await response.blob();
    
    // ✅ Generar nombre único
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.jpg`;
    const storageRef = ref(storageInstance, `${path}/${fileName}`);
    
    // ✅ Subir con metadata
    const metadata = {
      contentType: 'image/jpeg',
    };
    
    await uploadBytes(storageRef, blob, metadata);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    throw error;
  }
};

export const uploadMultipleImages = async (images: string[], path: string): Promise<string[]> => {
  try {
    // ✅ Verificar que hay imágenes
    if (!images || images.length === 0) {
      return [];
    }

    // ✅ Subir imágenes en paralelo con manejo de errores individual
    const urls = await Promise.all(
      images.map(async (img, index) => {
        try {
          return await uploadImage(img, path);
        } catch (error) {
          console.error(`Error subiendo imagen ${index}:`, error);
          throw new Error(`Error al subir la imagen ${index + 1}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
      })
    );
    
    return urls;
  } catch (error) {
    console.error('Error subiendo múltiples imágenes:', error);
    throw error;
  }
};

export const deleteImage = async (url: string) => {
  try {
    const storageInstance = getStorage(); // ✅ Obtener storage segura
    
    const storageRef = ref(storageInstance, url);
    await deleteObject(storageRef);
    return { success: true };
  } catch (error) {
    console.error('Error eliminando imagen:', error);
    return { success: false, error: (error as Error).message };
  }
};