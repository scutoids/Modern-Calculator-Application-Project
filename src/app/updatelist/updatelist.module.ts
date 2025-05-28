import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdatelistPageRoutingModule } from './updatelist-routing.module';

import { UpdatelistPage } from './updatelist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdatelistPageRoutingModule
  ],
  declarations: [UpdatelistPage]
})
export class UpdatelistPageModule {}
