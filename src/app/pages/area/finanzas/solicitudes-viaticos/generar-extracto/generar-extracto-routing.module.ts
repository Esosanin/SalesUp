import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenerarExtractoPage } from './generar-extracto.page';

const routes: Routes = [
  {
    path: '',
    component: GenerarExtractoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenerarExtractoPageRoutingModule {}
