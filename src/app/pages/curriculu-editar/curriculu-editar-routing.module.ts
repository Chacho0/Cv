import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CurriculuEditarPage } from './curriculu-editar.page';

const routes: Routes = [
  {
    path: '',
    component: CurriculuEditarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CurriculuEditarPageRoutingModule {}
