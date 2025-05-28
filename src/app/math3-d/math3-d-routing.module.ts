import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Math3DPage } from './math3-d.page';

const routes: Routes = [
  {
    path: '',
    component: Math3DPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Math3DPageRoutingModule {}
