import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyMapPageRoutingModule } from './company-map-routing.module';

import { CompanyMapPage } from './company-map.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompanyMapPageRoutingModule
  ],
  declarations: [CompanyMapPage]
})
export class CompanyMapPageModule {}
