import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitudesRegistradasPage } from './solicitudes-registradas.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitudesRegistradasPage
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
export class SolicitudesRegistradasPageRoutingModule {}
