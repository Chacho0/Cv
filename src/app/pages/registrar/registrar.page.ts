import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage {
  nombre: string = '';
  correo: string = '';
  contrasena: string = '';

  constructor(private auth: AngularFireAuth, private router: Router, private toastController: ToastController) {}

  async onSubmit() {
    if (this.nombre && this.correo && this.contrasena) {
      try {
        // Crear cuenta de usuario con Firebase Authentication
        const userCredential = await this.auth.createUserWithEmailAndPassword(this.correo, this.contrasena);
        
        // Enviar correo de verificación
        await userCredential.user?.sendEmailVerification();
        
        // Mostrar mensaje de verificación
        const toast = await this.toastController.create({
          message: 'Te hemos enviado un correo de verificación. Por favor, revisa tu correo.',
          duration: 3000,
          position: 'top'
        });
        toast.present();
      
        // Redirigir al login
        this.router.navigate(['/login']);
      } catch (error: any) {  // Aquí cambiamos el tipo a 'any'
        console.error('Error al registrar', error);
        const toast = await this.toastController.create({
          message: 'Error al registrar usuario: ' + error.message,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
      
    } else {
      const toast = await this.toastController.create({
        message: 'Por favor, completa todos los campos.',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
  }

  goToLogin() {
    // Redirige a la página de inicio de sesión
    this.router.navigate(['/login']);
  }
}
