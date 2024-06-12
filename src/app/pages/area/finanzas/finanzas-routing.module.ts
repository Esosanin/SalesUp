import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinanzasPage } from './finanzas.page';

const routes: Routes = [
  {
    path: '',
    component: FinanzasPage
  },
  {
    path: 'solicitudes-viaticos',
    loadChildren: () => import('./solicitudes-viaticos/solicitudes-viaticos.module').then( m => m.SolicitudesViaticosPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanzasPageRoutingModule {}
