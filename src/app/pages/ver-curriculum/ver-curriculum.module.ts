import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerCurriculumPageRoutingModule } from './ver-curriculum-routing.module';

import { VerCurriculumPage } from './ver-curriculum.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerCurriculumPageRoutingModule
  ],
  declarations: [VerCurriculumPage]
})
export class VerCurriculumPageModule {}
