import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restablecer-password',
  templateUrl: './restablecer-password.page.html',
  styleUrls: ['./restablecer-password.page.scss'],
})
export class RestablecerPasswordPage {
  email: string = ''; // Almacena el correo electrónico del usuario
  mensaje: string = ''; // Mensaje de éxito o error

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  // Enviar notificación de restablecimiento de contraseña
  async sendPasswordResetEmail() {
    try {
      await this.afAuth.sendPasswordResetEmail(this.email); // Método de Firebase para enviar el correo
      this.mensaje = 'Se ha enviado un enlace de restablecimiento de contraseña a tu correo.';
    } catch (error: any) {
      console.error('Error al enviar el correo de restablecimiento:', error);
      this.mensaje = this.getErrorMessage(error.code); // Obtener un mensaje amigable
    }
  }

  // Navegar al login
  goToLogin() {
    this.router.navigate(['/login']); // Redirigir al login
  }

  // Obtener mensajes de error amigables
  private getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/user-not-found': 'No se encontró un usuario con ese correo.',
      'auth/invalid-email': 'El correo no tiene un formato válido.',
    };
    return errorMessages[errorCode] || 'Ocurrió un error. Inténtalo de nuevo.';
  }
}
