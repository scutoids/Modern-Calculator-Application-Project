import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HistoryPage } from './history/history.page';
import { Page3Page } from './page3/page3.page';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'page2',
    loadChildren: () => import('./page2/page2.module').then( m => m.Page2PageModule)
  },
  {
    path: 'page3',
    loadChildren: () => import('./page3/page3.module').then( m => m.Page3PageModule)
  },
  {
    path: 'history',
    loadChildren: () => import('./history/history.module').then( m => m.HistoryPageModule)
  },
  { path: 'history', component: HistoryPage },
  { path: '', redirectTo: 'calculator', pathMatch: 'full' },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'app-report',
    loadChildren: () => import('./app-report/app-report.module').then( m => m.AppReportPageModule)
  },
  {
    path: 'updatelist',
    loadChildren: () => import('./updatelist/updatelist.module').then( m => m.UpdatelistPageModule)
  },
  {
    path: 'aipage',
    loadChildren: () => import('./aipage/aipage.module').then( m => m.AIpagePageModule)
  },
  {
    path: 'howtouse',
    loadChildren: () => import('./howtouse/howtouse.module').then( m => m.HowtousePageModule)
  },
  {
    path: 'company-map',
    loadChildren: () => import('./company-map/company-map.module').then( m => m.CompanyMapPageModule)
  },
  {
    path: 'math3-d',
    loadChildren: () => import('./math3-d/math3-d.module').then( m => m.Math3DPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash:true, preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
