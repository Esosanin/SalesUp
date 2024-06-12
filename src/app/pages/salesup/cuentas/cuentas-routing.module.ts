import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CuentasPage } from './cuentas.page';

const routes: Routes = [
  {
    path: '',
    component: CuentasPage
  },
  {
    path: 'detalle-cuenta/:id',
    loadChildren: () => import('./detalle-cuenta/detalle-cuenta.module').then( m => m.DetalleCuentaPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CuentasPageRoutingModule {}
