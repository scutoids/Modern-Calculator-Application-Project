import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyMapPage } from './company-map.page';

const routes: Routes = [
  {
    path: '',
    component: CompanyMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyMapPageRoutingModule {}
