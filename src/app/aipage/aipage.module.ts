import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AIpagePage } from './aipage.page';
import { HttpClientModule } from '@angular/common/http';
import { AIpagePageRoutingModule } from './aipage-routing.module';
import { ApiService } from '../aipage/api.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AIpagePageRoutingModule,
    HttpClientModule
  ],
  declarations: [AIpagePage],
  providers: [ApiService]
})
export class AIpagePageModule {}
