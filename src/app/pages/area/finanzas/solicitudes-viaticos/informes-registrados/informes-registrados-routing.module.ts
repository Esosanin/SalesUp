import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InformesRegistradosPage } from './informes-registrados.page';

const routes: Routes = [
  {
    path: '',
    component: InformesRegistradosPage
  },
  {
    path: 'ver-gastos',
    loadChildren: () => import('./ver-gastos/ver-gastos.module').then( m => m.VerGastosPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformesRegistradosPageRoutingModule {}
