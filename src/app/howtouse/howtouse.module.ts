import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HowtousePageRoutingModule } from './howtouse-routing.module';

import { HowtousePage } from './howtouse.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HowtousePageRoutingModule
  ],
  declarations: [HowtousePage]
})
export class HowtousePageModule {}
