import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthguardService } from 'src/app/authguard.service';

import { DashPage } from './dash.page';

const routes: Routes = [
  {
    path: '',
    component: DashPage
  },
  /*{ 
    path: 'knocker_wo/:id',
    component: ProductDetailComponent 
  },*/
  {
    path: 'detalle/:id',
    loadChildren: () => import('./detalle/dash.module').then( m => m.DashPageModule)
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashPageRoutingModule {}











