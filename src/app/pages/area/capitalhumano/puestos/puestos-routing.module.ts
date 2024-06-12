import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PuestosPage } from './puestos.page';

const routes: Routes = [
  {
    path: '',
    component: PuestosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PuestosPageRoutingModule {}
