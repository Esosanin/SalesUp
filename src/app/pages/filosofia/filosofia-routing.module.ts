import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FilosofiaPage } from './filosofia.page';

const routes: Routes = [
  {
    path: '',
    component: FilosofiaPage
  },
  {
    path: 'politicas',
    loadChildren: () => import('./politicas/politicas.module').then( m => m.PoliticasPageModule)
  },
  {
    path: 'seguros',
    loadChildren: () => import('./seguros/seguros.module').then( m => m.SegurosPageModule)
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilosofiaPageRoutingModule {}
