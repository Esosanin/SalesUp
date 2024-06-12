import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerSolicitudPage } from './ver-solicitud.page';

const routes: Routes = [
  {
    path: '',
    component: VerSolicitudPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerSolicitudPageRoutingModule {}
