import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfertasLaboralesPage } from './ofertas-laborales.page';

const routes: Routes = [
  {
    path: '',
    component: OfertasLaboralesPage
  },
  {
    path: 'ver-posfinsel',
    loadChildren: () => import('./ver-posfinsel/ver-posfinsel.module').then( m => m.VerPosfinselPageModule)
  },
  {
    path: 'curriculum',
    loadChildren: () => import('./curriculum/curriculum.module').then( m => m.CurriculumPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfertasLaboralesPageRoutingModule {}
