import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PropuestaSalarialPage } from './propuesta-salarial.page';

const routes: Routes = [
  {
    path: '',
    component: PropuestaSalarialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropuestaSalarialPageRoutingModule {}
