import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AIpagePage } from './aipage.page';

const routes: Routes = [
  {
    path: '',
    component: AIpagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AIpagePageRoutingModule {}
