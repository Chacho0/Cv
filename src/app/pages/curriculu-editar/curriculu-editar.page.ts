import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurriculumService } from 'src/app/services/curriculum.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-curriculu-editar',
  templateUrl: './curriculu-editar.page.html',
  styleUrls: ['./curriculu-editar.page.scss'],
})
export class CurriculuEditarPage implements OnInit {
  curriculumId: string = ''; // ID del currículum
  curriculumData: any = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    ciudad: '',
    estadoCivil: '',
    introduccion: '',
    imagen: '', // URL de la imagen actual
    educacion: [],
    experiencia: [],
    habilidades: [],
    idiomas: [],
    referencias: [],
    cursos: [], // <-- Agregar esta propiedad
  };
  

  selectedImage: string | null = null; // Previsualización de la nueva imagen
  uploadProgress: number = 0;

  constructor(
    private route: ActivatedRoute,
    private curriculumService: CurriculumService,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
    // Capturar el ID del currículum desde la URL
    this.curriculumId = this.route.snapshot.paramMap.get('id') || '';

    // Cargar datos del currículum
    this.loadCurriculumData();
  }

  loadCurriculumData() {
    this.curriculumService.getCurriculum(this.curriculumId).subscribe((data: any) => {
      if (data) {
        this.curriculumData = data;
      }
    });
  }

  // Actualizar la imagen del currículum
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const filePath = `curriculum/${this.curriculumId}/imagen_${Date.now()}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              this.curriculumData.imagen = url; // Actualizamos la URL de la imagen en los datos
              console.log('Nueva URL de la imagen:', url);
            });
          })
        )
        .subscribe();
    }
  }

  // Guardar cambios en el currículum
  saveChanges() {
    this.curriculumService.updateCurriculum(this.curriculumId, this.curriculumData).then(() => {
      console.log('Currículum actualizado:', this.curriculumData);
    });
  }


  addItem(type: string) {
    if (type === 'educacion' ||type === 'cursos' || type === 'experiencia' || type === 'habilidades' || type === 'idiomas' || type === 'referencias') {
      this.curriculumData[type].push(''); // Solo agrega una cadena vacía si es necesario
    }
  }
  
  removeItem(type: string, index: number) {
    if (this.curriculumData[type] && this.curriculumData[type].length > 0) {
      this.curriculumData[type].splice(index, 1); // Elimina el ítem en el índice especificado
    }
  }
    
  trackByIndex(index: number, item: any): number {
    return index; // Esto asegura que cada elemento se rastree por su índice único
  }
  
}
