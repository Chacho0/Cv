import { Injectable } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private file: File) {}

  // Método para guardar un archivo en el directorio 'downloads'
  async saveFile(fileName: string, base64Data: string): Promise<void> {
    try {
      // Verificar si el directorio 'downloads' existe
      const directoryExists = await this.checkDirectory();

      if (!directoryExists) {
        // Crear el directorio si no existe (en el almacenamiento externo)
        await Filesystem.mkdir({
          path: 'Download',  // Usar el directorio de Descargas
          directory: Directory.External,  // Directorio de almacenamiento externo
          recursive: true,  // Permite crear subdirectorios si es necesario
        });

        console.log('Directorio "downloads" creado exitosamente.');
      }

      // Guardar el archivo en el directorio 'downloads'
      await Filesystem.writeFile({
        path: `Download/${fileName}`,  // Guardar en la carpeta de Descargas
        data: base64Data,  // Contenido del archivo en base64
        directory: Directory.External,  // Usamos 'External' para el almacenamiento externo
        encoding: Encoding.UTF8,  // Establecemos la codificación UTF8
      });

      console.log('Archivo guardado correctamente:', fileName);

      // Aquí también podrías lanzar una notificación o abrir el archivo para que el usuario lo vea

    } catch (error) {
      console.error('Error al guardar el archivo:', error);
      throw error;  // Lanzar el error para su manejo posterior
    }
  }

  // Método para verificar si el directorio 'downloads' existe
  private async checkDirectory(): Promise<boolean> {
    try {
      // Intentar leer el contenido del directorio 'downloads' en el almacenamiento externo
      await Filesystem.readdir({
        path: 'Download',  // Verificamos el directorio 'Download'
        directory: Directory.External,  // Directorio donde se buscará
      });

      // Si no hay error, el directorio existe
      return true;
    } catch (error) {
      console.log('Error al verificar el directorio:', error);
      return false;  // Si ocurre un error, el directorio no existe
    }
  }
}
