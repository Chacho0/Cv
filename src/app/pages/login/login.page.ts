import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  errorMessage: string = ''; // Para mostrar errores en el HTML

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  // Inicia sesión con correo y contraseña
  async login() {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(this.email, this.password);
      console.log('Usuario autenticado:', userCredential.user);
      this.router.navigate(['/portal']); // Redirige al portal
    } catch (error: any) {
      console.error('Error de inicio de sesión:', error);
      this.errorMessage = this.getErrorMessage(error.code);
    }
  }

  // Redirige a la página de registro
  goToRegister() {
    this.router.navigate(['/registrar']); // Redirige a la página de registro
  }

  // Redirige a la página de recuperar contraseña
  goToRecoverPassword() {
    this.router.navigate(['/restablecer-password']); // Redirige a la página de recuperación de contraseña
  }
  // Inicio de sesión con Google
  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      await this.afAuth.signInWithRedirect(provider);
      const result = await this.afAuth.getRedirectResult();
      if (result.user) {
        console.log('Usuario autenticado con Google:', result.user);
        this.router.navigate(['/portal']); // Redirige al portal
      }
    } catch (error: any) {
      console.error('Error de inicio de sesión con Google:', error.message);
      this.errorMessage = this.getErrorMessage(error.code);
    }
  }
  // Obtiene un mensaje de error amigable para el usuario
  private getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/user-not-found': 'No se encontró un usuario con ese correo.',
      'auth/wrong-password': 'La contraseña es incorrecta.',
      'auth/email-already-in-use': 'El correo ya está registrado.',
      'auth/weak-password': 'La contraseña es demasiado débil.',
      'auth/invalid-email': 'El correo no tiene un formato válido.',
    };
    return errorMessages[errorCode] || 'Ocurrió un error. Inténtalo de nuevo.';
  }
}