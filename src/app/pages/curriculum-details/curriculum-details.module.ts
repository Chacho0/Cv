import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CurriculumDetailsPageRoutingModule } from './curriculum-details-routing.module';

import { CurriculumDetailsPage } from './curriculum-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CurriculumDetailsPageRoutingModule
  ],
  declarations: [CurriculumDetailsPage]
})
export class CurriculumDetailsPageModule {}
