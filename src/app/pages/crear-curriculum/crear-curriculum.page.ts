import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-crear-curriculum',
  templateUrl: './crear-curriculum.page.html',
  styleUrls: ['./crear-curriculum.page.scss'],
})
export class CrearCurriculumPage implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  // Método para abrir el selector de archivo al hacer clic en la imagen
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
  user: any = null;

  curriculum: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    ciudad: string;
    estadoCivil: string;
    introduccion: string;
    imagen: string;
    educacion: string[];
    experiencia: string[];
    habilidades: string[];
    idiomas: string[];
    referencias: string[];
    cursos: string[]; // Agregar esta línea
  } = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    ciudad: '',
    estadoCivil: '',
    introduccion: '',
    imagen: '',
    educacion: [''],
    experiencia: [''],
    habilidades: [''],
    idiomas: [''],
    referencias: [''],
    cursos: [''], // Inicializar con un arreglo vacío
  };
  

  selectedFile: File | null = null;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.afAuth.onAuthStateChanged((user) => {
      if (!user) {
        this.router.navigate(['/login']);
      } else {
        this.user = user;
        console.log('Usuario autenticado:', user);
      }
    });
  }
  

  async logout() {
    try {
      await this.afAuth.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  // Manejar selección de archivo
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.curriculum.imagen = e.target.result;
      };
      reader.readAsDataURL(file);
      this.selectedFile = file;
    }
  }

  // Subir el currículum con la imagen
  submitCurriculum() {
    if (this.user) {
      const userId = this.user.uid;
      if (this.selectedFile) {
        const path = `curriculum/${userId}_${Date.now()}`;
        this.storageService.uploadImage(this.selectedFile, path).subscribe(
          (url: string) => {
            console.log('URL de la imagen subida:', url);
            this.curriculum.imagen = url;
            this.saveToFirestore(userId);
          },
          (error: any) => {
            console.error('Error al subir la imagen:', error);
          }
        );
      } else {
        this.saveToFirestore(userId);
      }
    } else {
      console.error('Usuario no autenticado. No se puede guardar el currículum.');
    }
  }

  // Guardar currículum en Firestore
  saveToFirestore(userId: string) {
    this.firestore
      .collection('curriculum')
      .add({
        ...this.curriculum,
        userId,
        createdAt: new Date(),
      })
      .then(() => {
        console.log('Currículum registrado con éxito');
        this.resetForm();
      })
      .catch((error) => {
        console.error('Error al registrar el currículum:', error);
      });
  }

  // Limpiar formulario
  resetForm() {
    this.curriculum = {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      ciudad: '',
      estadoCivil: '',
      introduccion: '',
      imagen: '',
      educacion: [''],
      experiencia: [''],
      habilidades: [''],
      idiomas: [''],
      referencias: [''],
      cursos: [''], 
    };
    this.selectedFile = null;
    const fileInput: any = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // Métodos para agregar o eliminar elementos de listas dinámicas
  addItem(section: keyof typeof this.curriculum) {
    if (Array.isArray(this.curriculum[section])) {
      (this.curriculum[section] as string[]).push('');
    }
  }

  removeItem(section: keyof typeof this.curriculum, index: number) {
    if (Array.isArray(this.curriculum[section])) {
      (this.curriculum[section] as string[]).splice(index, 1);
    }
  }

  
  trackByIndex(index: number): number {
    return index;
  }
}
