import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectdonePage } from './projectdone.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectdonePage
  },
  {
    path: 'ordenesdetrabajo',
    loadChildren: () => import('./knocker_wo/dash.module').then( m => m.DashPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectdonePageRoutingModule {}
