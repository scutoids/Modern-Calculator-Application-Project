import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HowtousePage } from './howtouse.page';

const routes: Routes = [
  {
    path: '',
    component: HowtousePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HowtousePageRoutingModule {}
