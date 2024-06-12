import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesupPage } from './salesup.page';

const routes: Routes = [
  {
    path: '',
    component: SalesupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesupPageRoutingModule {}
