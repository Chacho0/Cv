import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuard} from './guards/auth.guard';
import { CurriculumDetailsPage } from './pages/curriculum-details/curriculum-details.page';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
     path: 'portal',
     loadChildren: () => import('./pages/portal/portal.module').then(m => m.PortalPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'restablecer-password',
    loadChildren: () => import('./pages/restablecer-password/restablecer-password.module').then( m => m.RestablecerPasswordPageModule)
  },
  {
    path: 'registrar',
    loadChildren: () => import('./pages/registrar/registrar.module').then( m => m.RegistrarPageModule)
  },
  {
    path: 'crear-curriculum',
    loadChildren: () => import('./pages/crear-curriculum/crear-curriculum.module').then( m => m.CrearCurriculumPageModule)
  },
  {
    path: 'ver-curriculum',
    loadChildren: () => import('./pages/ver-curriculum/ver-curriculum.module').then( m => m.VerCurriculumPageModule)
  },
  {
    path: 'curriculum-details',
    loadChildren: () => import('./pages/curriculum-details/curriculum-details.module').then( m => m.CurriculumDetailsPageModule)
  },
  {
    path: 'curriculum-details/:id', // Usamos ':id' para capturar el ID del currículum
    component: CurriculumDetailsPage,
  },
  {
    path: 'curriculu-editar/:id', // Acepta el ID del currículum que se desea editar
    loadChildren: () => import('./pages/curriculu-editar/curriculu-editar.module').then(m => m.CurriculuEditarPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
