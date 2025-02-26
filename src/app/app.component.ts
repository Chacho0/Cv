import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  user: any = null;
  isLoginPage = false;

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  ngOnInit() {
    // Verifica si el usuario está en la página de login
    this.router.events.subscribe((event: any) => {
      if (event.url && event.url.includes('login')) {
        this.isLoginPage = true; // Si es la página de login, ocultamos el menú
      } else {
        this.isLoginPage = false;
      }
    });

    // Verifica si el usuario está autenticado
    this.afAuth.onAuthStateChanged(user => {
      if (user) {
        this.user = user;
      }
    });
  }

  async logout() {
    try {
      await this.afAuth.signOut();
      this.router.navigate(['/login']); // Redirige al login después de cerrar sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
