import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CurriculumService } from 'src/app/services/curriculum.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf'; // Para la generación de PDFs
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Platform, ToastController } from '@ionic/angular';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-ver-curriculum',
  templateUrl: './ver-curriculum.page.html',
  styleUrls: ['./ver-curriculum.page.scss'],
})
export class VerCurriculumPage implements OnInit {
  curriculums: any[] = [];
  userId: string = '';
  showOptions: number | null = null;
  showOptions1: string | null = null;  // Asegúrate de que sea un string o null
  isDownloading: boolean = false;
  selectedOption: string = 'basico';


  constructor(
    private curriculumService: CurriculumService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private platform: Platform,
    private toastController: ToastController // Para notificaciones,

  ) {}

  ngOnInit() {
    this.afAuth.onAuthStateChanged((user) => {
      if (!user) {
        this.router.navigate(['/login']);
      } else {
        this.userId = user.uid;
        this.loadCurriculums();
      }
    });
  }

  loadCurriculums() {
    this.curriculumService.getCurriculums(this.userId).subscribe(
      (data) => {
        this.curriculums = data;
      },
      (error) => {
        this.presentToast('Error al cargar currículums.');
        console.error(error);
      }
    );
  }

  viewCurriculum(curriculumId: string) {
    this.router.navigate(['/curriculum-details', curriculumId]);
  }

  editCurriculum(curriculumId: string) {
    this.router.navigate(['/curriculu-editar', curriculumId]);
  }

  async shareCurriculum(curriculumId: string) {
    if (this.isDownloading) {
      console.log('Acción ya en progreso...');
      return;
    }
  
    console.log("Compartiendo PDF de:", curriculumId);
    this.isDownloading = true;
  
    this.curriculumService.getCurriculum(curriculumId).subscribe(
      async (curriculum) => {
        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.height;
        let yOffset = 10;
  
        // Función para verificar si se necesita una nueva página
        const checkPageLimit = (extraSpace: number = 10) => {
          if (yOffset + extraSpace > pageHeight) {
            doc.addPage();
            yOffset = 20;
          }
        };
  
        // Añadir imagen de perfil si está disponible
        if (curriculum.imagen) {
          try {
            const imageUrl = await this.getImageAsBase64(curriculum.imagen);
            const imageWidth = 40;
            const imageHeight = 40;
            const imageX = 150;
            const imageY = 15;
            doc.addImage(imageUrl, 'JPEG', imageX, imageY, imageWidth, imageHeight);
          } catch (error) {
            console.error('Error al cargar la imagen:', error);
          }
        }
  
        // Encabezado (nombre del candidato)
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(18);
        doc.text(`${curriculum.nombre} ${curriculum.apellido}`, 14, yOffset);
        yOffset += 10;
  
        // Información personal
        const personalInfo = [
          `Email: ${curriculum.email}`,
          `Teléfono: ${curriculum.telefono}`,
          `Ciudad: ${curriculum.ciudad}`,
          `Estado Civil: ${curriculum.estadoCivil}`
        ];
  
        personalInfo.forEach((info) => {
          checkPageLimit(10);
          doc.setFont("Helvetica", "normal");
          doc.setFontSize(12);
          doc.text(info, 14, yOffset);
          yOffset += 10;
        });
  
        // Línea divisoria
        doc.setLineWidth(0.5);
        doc.line(14, yOffset, 195, yOffset);
        yOffset += 10;
  
        // Secciones del currículum
        const sections = [
          { title: "Introducción", content: curriculum.introduccion },
          { title: "Educación", content: curriculum.educacion },
          { title: "Experiencia", content: curriculum.experiencia },
          { title: "Habilidades", content: curriculum.habilidades },
          { title: "Cursos", content: curriculum.cursos },
          { title: "Referencias", content: curriculum.referencias }
        ];
  
        sections.forEach((section) => {
          if (section.content) {
            checkPageLimit(20);
            doc.setFont("Helvetica", "bold");
            doc.text(section.title, 14, yOffset);
            yOffset += 10;
  
            doc.setFont("Helvetica", "normal");
            const sectionText = doc.splitTextToSize(section.content, 180);
            sectionText.forEach((line: string) => {
              checkPageLimit(10);
              doc.text(line, 14, yOffset);
              yOffset += 10;
            });
  
            checkPageLimit(10);
            doc.line(14, yOffset, 195, yOffset);
            yOffset += 10;
          }
        });
  
        // Generar el PDF como un Blob
        const pdfOutput = doc.output("blob");
        const fileName = `${curriculum.nombre}_${curriculum.apellido}_CV.pdf`;
  
        try {
          // Compartir en plataformas móviles (Cordova/Capacitor)
          if (this.platform.is('cordova') || this.platform.is('capacitor')) {
            const base64Data = await this.convertBlobToBase64(pdfOutput);
  
            // Crear directorio si no existe
            await Filesystem.mkdir({
              path: 'documents',
              directory: Directory.Documents,
              recursive: true
            }).catch(() => {
              console.log('El directorio ya existe.');
            });
  
            const filePath = `${fileName}`;
            await Filesystem.writeFile({
              path: filePath,
              data: base64Data,
              directory: Directory.Documents,
            });
  
            // Compartir el archivo
            await Share.share({
              title: 'Compartir Currículum',
              text: `Consulta el currículum de ${curriculum.nombre} ${curriculum.apellido}`,
              url: `file://${filePath}`,
            });
  
          // Compartir en navegadores con la API de Web Share
          } else if (navigator.share) {
            const url = URL.createObjectURL(pdfOutput);
            const shareData = {
              title: 'Compartir Currículum',
              text: `Consulta el currículum de ${curriculum.nombre} ${curriculum.apellido}`,
              files: [new File([pdfOutput], fileName, { type: "application/pdf" })]
            };
            await navigator.share(shareData);
  
          // Descargar en navegadores que no soporten la API de Web Share
          } else {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(pdfOutput);
            link.download = fileName;
            link.click();
            console.log("El archivo se ha descargado correctamente.");
          }
        } catch (error) {
          console.error('Error al compartir el archivo:', error);
        }
  
        this.isDownloading = false;
      },
      (error) => {
        console.error("Error al obtener el currículum:", error);
        this.isDownloading = false;
      }
    );
  }
 // Muestra las opciones de descarga
 showDownloadOptions(curriculumId: string) {
  if (this.showOptions1 === curriculumId) {
    this.showOptions = null;  // Oculta las opciones si ya están visibles
  } else {
    this.showOptions1 = curriculumId;  // Muestra las opciones
  }
}

// Descargar según la opción seleccionada
downloadCurriculum(curriculumId: string) {
  if (this.selectedOption === 'basico') {
    this.downloadBasica(curriculumId);
  } else if (this.selectedOption === 'moderno') {
    this.downloadModerno(curriculumId);
  }
}
  async downloadBasica(curriculumId: string) {
    if (this.isDownloading) {
      console.log('Descarga ya en progreso...');
      return;
    }
  
    console.log("Descargando PDF de:", curriculumId);
    this.isDownloading = true;
  
    this.curriculumService.getCurriculum(curriculumId).subscribe(
      async (curriculum) => {
        const doc = new jsPDF();
        let yOffset = 10;
        const pageHeight = doc.internal.pageSize.height;
  
        // Función para añadir una nueva página si es necesario
        const checkPageLimit = (extraSpace: number = 10) => {
          if (yOffset + extraSpace > pageHeight) {
            doc.addPage();
            yOffset = 20;
          }
        };
  
        // Insertar imagen de perfil
        if (curriculum.imagen) {
          try {
            const imageUrl = await this.getImageAsBase64(curriculum.imagen);
            doc.addImage(imageUrl, 'JPEG', 150, 15, 40, 40);
          } catch (error) {
            console.error('Error al cargar la imagen:', error);
          }
        }
  
        // Encabezado (Nombre del candidato)
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(18);
        doc.text(`${curriculum.nombre} ${curriculum.apellido}`, 14, yOffset);
        yOffset += 20;
  
        // Información personal
        const personalInfo = [
          `Email: ${curriculum.email}`,
          `Teléfono: ${curriculum.telefono}`,
          `Ciudad: ${curriculum.ciudad}`,
          `Estado Civil: ${curriculum.estadoCivil}`
        ];
  
        personalInfo.forEach((info) => {
          checkPageLimit(10);
          doc.setFont("Helvetica", "normal");
          doc.setFontSize(12);
          doc.text(info, 14, yOffset);
          yOffset += 10;
        });
  
        // Línea divisoria
        doc.setLineWidth(0.5);
        doc.line(14, yOffset, 195, yOffset);
        yOffset += 10;
  
        // Secciones del currículum
        const sections = [
          { title: "Introducción", content: curriculum.introduccion },
          { title: "Educación", content: curriculum.educacion },
          { title: "Experiencia", content: curriculum.experiencia },
          { title: "Habilidades", content: curriculum.habilidades },
          { title: "Cursos", content: curriculum.cursos },
          { title: "Referencias", content: curriculum.referencias }
        ];
  
        sections.forEach((section) => {
          if (section.content) {
            checkPageLimit(20);
            doc.setFont("Helvetica", "bold");
            doc.text(section.title, 14, yOffset);
            yOffset += 10;
  
            doc.setFont("Helvetica", "normal");
            const sectionText = doc.splitTextToSize(section.content, 180);
            sectionText.forEach((line: string) => {
              checkPageLimit(10);
              doc.text(line, 14, yOffset);
              yOffset += 10;
            });
  
            checkPageLimit(10);
            doc.line(14, yOffset, 195, yOffset);
            yOffset += 10;
          }
        });
  
        // Generar el PDF en formato Blob
        const pdfOutput = doc.output("blob");
        const fileName = `${curriculum.nombre}_${curriculum.apellido}_CV.pdf`;
  
        if (this.platform.is('cordova') || this.platform.is('capacitor')) {
          try {
            const base64Data = await this.convertBlobToBase64(pdfOutput);
  
            // Guardar el archivo en el sistema de archivos
            const filePath = `${fileName}`;
            await Filesystem.writeFile({
              path: filePath,
              data: base64Data,
              directory: Directory.Documents,
            });
  
            this.presentToast('Archivo descargado exitosamente.');
          } catch (error) {
            console.error('Error al guardar el archivo:', error);
            this.presentToast('Error al guardar el archivo.');
          }
        } else {
          // Método para navegadores web
          const link = document.createElement('a');
          link.href = URL.createObjectURL(pdfOutput);
          link.download = fileName;
          link.click();
        }
  
        this.isDownloading = false;
      },
      (error) => {
        console.error("Error al obtener el currículum:", error);
        this.isDownloading = false;
        this.presentToast('Error al descargar el currículum.');
      }
    );
  }  
  
  async downloadModerno(curriculumId: string) {
    if (this.isDownloading) {
      console.log('Descarga ya en progreso...');
      return;
    }
  
    console.log("Descargando PDF moderno de:", curriculumId);
    this.isDownloading = true;
  
    this.curriculumService.getCurriculum(curriculumId).subscribe(
      async (curriculum) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        let yOffset = 20;
  
        // Función para añadir nueva página si es necesario
        const checkPageLimit = (extraSpace: number = 10) => {
          if (yOffset + extraSpace > pageHeight) {
            doc.addPage();
            yOffset = 20;
          }
        };
  
        // Estilo general
        doc.setFont("Helvetica", "normal");
  
        // Encabezado moderno con imagen de perfil
        const headerHeight = 50;
        doc.setFillColor(0, 102, 204); // Azul
        doc.rect(0, 0, pageWidth, headerHeight, "F");
  
        // Insertar imagen de perfil
        if (curriculum.imagen) {
          try {
            const imageUrl = await this.getImageAsBase64(curriculum.imagen);
            doc.addImage(imageUrl, 'JPEG', 5, 1, 40, 40);
          } catch (error) {
            console.error('Error al cargar la imagen:', error);
          }
        }
  
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255); // Texto blanco
        doc.text(`${curriculum.nombre} ${curriculum.apellido}`, 50, 25);
  
        // Subtítulo gmail y telefono Ciudad 
        doc.setFontSize(12);
        doc.text(`${curriculum.email} | ${curriculum.telefono}`, 50, 35);
  
        // Línea divisoria después del encabezado
        yOffset += headerHeight + 10;
        doc.setDrawColor(0, 102, 204); // Azul
        doc.setLineWidth(1);
        doc.line(20, yOffset, pageWidth - 20, yOffset);
        yOffset += 10;
  
        // Secciones del currículum con íconos
        const sections = [
          { title: "Introducción", content: curriculum.introduccion, icon: '📄' },
          { title: "Educación", content: curriculum.educacion, icon: '🎓' },
          { title: "Experiencia", content: curriculum.experiencia, icon: '💼' },
          { title: "Habilidades", content: curriculum.habilidades, icon: '🛠️' },
          { title: "Cursos", content: curriculum.cursos, icon: '📚' },
          { title: "Referencias", content: curriculum.referencias, icon: '🤝' },
        ];
  
        sections.forEach((section) => {
          if (section.content) {
            checkPageLimit(30);
  
            // Título de la sección con ícono
            doc.setFontSize(16);
            doc.setTextColor(0, 102, 204); // Azul
            doc.text(`${section.icon} ${section.title}`, 20, yOffset);
            yOffset += 10;
  
            // Contenido de la sección
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0); // Negro
            const sectionText = doc.splitTextToSize(section.content, pageWidth - 40);
            sectionText.forEach((line: string) => {
              checkPageLimit(10);
              doc.text(line, 20, yOffset);
              yOffset += 10;
            });
  
            checkPageLimit(10);
            yOffset += 5; // Espacio entre secciones
          }
        });
  
  
        // Guardar o descargar
        const pdfOutput = doc.output("blob");
        const fileName = `${curriculum.nombre}_${curriculum.apellido}_CV_Moderno.pdf`;
  
        try {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(pdfOutput);
          link.download = fileName;
          link.click();
          console.log("El archivo se ha descargado correctamente.");
        } catch (error) {
          console.error("Error al descargar el archivo:", error);
        }
  
        this.isDownloading = false;
      },
      (error) => {
        console.error("Error al obtener el currículum:", error);
        this.isDownloading = false;
      }
    );
  }
  
  
  // Método para obtener la imagen en formato Base64
  private async getImageAsBase64(imageUrl: string): Promise<string> {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
  
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  
  // Método para convertir Blob a Base64
  private convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  

  // Muestra una notificación
  private async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
    });
    await toast.present();
  }
  
  deleteCurriculum(curriculumId: string) {
    this.curriculumService
      .deleteCurriculum(curriculumId)
      .then(() => {
        this.presentToast('Currículum eliminado correctamente.');
        this.loadCurriculums();
      })
      .catch((error) => {
        this.presentToast('Error al eliminar el currículum.');
        console.error(error);
      });
  }
  
  toggleOptions(index: number) {
    this.showOptions = this.showOptions === index ? null : index;
  }
}
