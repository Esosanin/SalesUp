import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MimesPage } from './mimes.page';

const routes: Routes = [
  {
    path: '',
    component: MimesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MimesPageRoutingModule {}
