import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Math3DPageRoutingModule } from './math3-d-routing.module';

import { Math3DPage } from './math3-d.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Math3DPageRoutingModule
  ],
  declarations: [Math3DPage]
})
export class Math3DPageModule {}
