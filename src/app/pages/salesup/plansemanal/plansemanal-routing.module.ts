import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlansemanalPage } from './plansemanal.page';

const routes: Routes = [
  {
    path: '',
    component: PlansemanalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlansemanalPageRoutingModule {}
