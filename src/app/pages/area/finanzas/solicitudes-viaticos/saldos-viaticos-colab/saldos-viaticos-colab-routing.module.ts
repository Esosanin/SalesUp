import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SaldosViaticosColabPage } from './saldos-viaticos-colab.page';

const routes: Routes = [
  {
    path: '',
    component: SaldosViaticosColabPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SaldosViaticosColabPageRoutingModule {}
