import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AreaPage } from './area.page';

const routes: Routes = [
  {
    path: '',
    component: AreaPage
  },
  {
    path: 'capitalhumano',
    loadChildren: () => import('./capitalhumano/capitalhumano.module').then( m => m.CapitalhumanoPageModule)
  },
  {
    path: 'servicios',
    loadChildren: () => import('./servicios/servicios.module').then( m => m.ServiciosPageModule)
  },
  {
    path: 'finanzas',
    loadChildren: () => import('./finanzas/finanzas.module').then( m => m.FinanzasPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AreaPageRoutingModule {}
