import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.page.html',
  styleUrls: ['./portal.page.scss'],
})
export class PortalPage implements OnInit {
  user: any = null;

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  ngOnInit() {
    // Verifica si el usuario ya está autenticado
    this.afAuth.onAuthStateChanged(user => {
      if (!user) {
        // Si no está autenticado, redirige al login
        this.router.navigate(['/login']);
      } else {
        // Si está autenticado, guarda los datos del usuario
        this.user = user;
      }
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
}
