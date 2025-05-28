import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdatelistPage } from './updatelist.page';

const routes: Routes = [
  {
    path: '',
    component: UpdatelistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdatelistPageRoutingModule {}
