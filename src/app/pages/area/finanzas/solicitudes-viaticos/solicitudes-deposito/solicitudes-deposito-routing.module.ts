import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitudesDepositoPage } from './solicitudes-deposito.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitudesDepositoPage
  },
  {
    path: 'ver-solicitud',
    loadChildren: () => import('../ver-solicitud/ver-solicitud.module').then( m => m.VerSolicitudPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudesDepositoPageRoutingModule {}
