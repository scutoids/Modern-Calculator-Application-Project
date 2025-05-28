import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppReportPageRoutingModule } from './app-report-routing.module';

import { AppReportPage } from './app-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppReportPageRoutingModule
  ],
  declarations: [AppReportPage]
})
export class AppReportPageModule {}
