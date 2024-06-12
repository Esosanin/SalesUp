import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitudesViaticosPage } from './solicitudes-viaticos.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitudesViaticosPage
  },
  {
    path: 'solicitudes-registradas',
    loadChildren: () => import('./solicitudes-registradas/solicitudes-registradas.module').then( m => m.SolicitudesRegistradasPageModule)
  },
  {
    path: 'informes-registrados',
    loadChildren: () => import('./informes-registrados/informes-registrados.module').then( m => m.InformesRegistradosPageModule)
  },
  {
    path: 'solicitudes-deposito',
    loadChildren: () => import('./solicitudes-deposito/solicitudes-deposito.module').then( m => m.SolicitudesDepositoPageModule)
  },
  {
    path: 'generar-extracto',
    loadChildren: () => import('./generar-extracto/generar-extracto.module').then( m => m.GenerarExtractoPageModule)
  },
  {
    path: 'saldos-viaticos-colab',
    loadChildren: () => import('./saldos-viaticos-colab/saldos-viaticos-colab.module').then( m => m.SaldosViaticosColabPageModule)
  },
  {
    path: 'viaticos-hospedajes',
    loadChildren: () => import('./viaticos-hospedajes/viaticos-hospedajes.module').then( m => m.ViaticosHospedajesPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudesViaticosPageRoutingModule {}
