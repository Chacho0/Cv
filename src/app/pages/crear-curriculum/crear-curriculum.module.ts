import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearCurriculumPageRoutingModule } from './crear-curriculum-routing.module';

import { CrearCurriculumPage } from './crear-curriculum.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearCurriculumPageRoutingModule
  ],
  declarations: [CrearCurriculumPage]
})
export class CrearCurriculumPageModule {}
