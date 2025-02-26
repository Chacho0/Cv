import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurriculumService } from 'src/app/services/curriculum.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-curriculum-details',
  templateUrl: './curriculum-details.page.html',
  styleUrls: ['./curriculum-details.page.scss'],
})
export class CurriculumDetailsPage implements OnInit {
  curriculumId: string = ''; // ID del currículum
  curriculum: any = {}; // Datos del currículum

  constructor(
    private curriculumService: CurriculumService,
    private route: ActivatedRoute,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  ngOnInit() {
    // Obtener el ID del currículum desde los parámetros de la URL
    this.curriculumId = this.route.snapshot.paramMap.get('id') || '';

    if (this.curriculumId) {
      this.loadCurriculumDetails();
    } else {
      this.router.navigate(['/curriculums']);
    }
  }

  // Cargar detalles del currículum
  loadCurriculumDetails() {
    this.curriculumService.getCurriculum(this.curriculumId).subscribe(
      (data) => {
        this.curriculum = data; // Asignar los datos del currículum
        console.log('Currículum cargado:', data);
        // Validar si existen cursos para evitar errores
        if (!this.curriculum.cursos) {
          this.curriculum.cursos = []; // Inicializar cursos si no existen
        }
      },
      (error) => {
        console.error('Error al cargar el currículum:', error);
      }
    );
  }

  // Función para regresar a la página VerCurriculum
  goBack() {
    this.router.navigate(['/ver-curriculum']); // Redirigir a la página 'ver-curriculum'
  }
}
