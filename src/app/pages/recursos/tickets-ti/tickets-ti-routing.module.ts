import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TicketsTIPage } from './tickets-ti.page';

const routes: Routes = [
  {
    path: '',
    component: TicketsTIPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketsTIPageRoutingModule {}
