import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerPosfinselPage } from './ver-posfinsel.page';

const routes: Routes = [
  {
    path: '',
    component: VerPosfinselPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerPosfinselPageRoutingModule {}
