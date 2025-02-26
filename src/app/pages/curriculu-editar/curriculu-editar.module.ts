import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CurriculuEditarPageRoutingModule } from './curriculu-editar-routing.module';

import { CurriculuEditarPage } from './curriculu-editar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CurriculuEditarPageRoutingModule
  ],
  declarations: [CurriculuEditarPage]
})
export class CurriculuEditarPageModule {}
