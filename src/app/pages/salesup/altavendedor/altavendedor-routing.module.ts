import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AltavendedorPage } from './altavendedor.page';

const routes: Routes = [
  {
    path: '',
    component: AltavendedorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AltavendedorPageRoutingModule {}
