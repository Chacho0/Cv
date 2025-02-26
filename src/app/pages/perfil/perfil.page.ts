import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { CurriculumService } from 'src/app/services/curriculum.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  user: any = null;
  curriculums: any[] = [];

  constructor(
    private afAuth: AngularFireAuth, 
    private router: Router, 
    private curriculumService: CurriculumService  // Inyectamos el servicio de currículum
  ) {}

  ngOnInit() {
    this.afAuth.onAuthStateChanged(user => {
      if (!user) {
        this.router.navigate(['/login']); // Redirige si no está autenticado
      } else {
        this.user = user; // Establece los datos del usuario autenticado
        this.loadCurriculums();  // Cargar los currículums del usuario
      }
    });
  }

  // Método para cargar los currículums del usuario
  loadCurriculums(): void {
    const userId = this.user?.uid; // Usamos el userId del usuario autenticado
    this.curriculumService.getCurriculums(userId).subscribe(data => {
      this.curriculums = data;  // Almacena los currículums en el array
    });
  }

  async logout() {
    try {
      await this.afAuth.signOut();
      this.router.navigate(['/login']);  // Redirige al login después de cerrar sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  // Método para ver el currículum
  viewCurriculum(curriculumId: string) {
    this.router.navigate(['/curriculum-details', curriculumId]);
  }
}
