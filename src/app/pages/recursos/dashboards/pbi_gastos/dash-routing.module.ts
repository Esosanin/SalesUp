import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthguardService } from 'src/app/authguard.service';

import { DashPage } from './dash.page';

const routes: Routes = [
  {
    path: '',
    component: DashPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashPageRoutingModule {}
