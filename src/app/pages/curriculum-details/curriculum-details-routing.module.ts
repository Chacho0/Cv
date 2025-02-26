import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CurriculumDetailsPage } from './curriculum-details.page';

const routes: Routes = [
  {
    path: '',
    component: CurriculumDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CurriculumDetailsPageRoutingModule {}
