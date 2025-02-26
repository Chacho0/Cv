import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerCurriculumPage } from './ver-curriculum.page';

const routes: Routes = [
  {
    path: '',
    component: VerCurriculumPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerCurriculumPageRoutingModule {}
