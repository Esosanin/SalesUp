import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiciosReservacionesPage } from './servicios-reservaciones.page';

const routes: Routes = [
  {
    path: '',
    component: ServiciosReservacionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiciosReservacionesPageRoutingModule {}
