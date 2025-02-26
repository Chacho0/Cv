import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearCurriculumPage } from './crear-curriculum.page';

const routes: Routes = [
  {
    path: '',
    component: CrearCurriculumPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearCurriculumPageRoutingModule {}
