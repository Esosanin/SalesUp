import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViaticosHospedajesPage } from './viaticos-hospedajes.page';

const routes: Routes = [
  {
    path: '',
    component: ViaticosHospedajesPage
  },
  {
    path: 'servicios-reservaciones',
    loadChildren: () => import('./servicios-reservaciones/servicios-reservaciones.module').then( m => m.ServiciosReservacionesPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViaticosHospedajesPageRoutingModule {}
