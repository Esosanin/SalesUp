import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children:[
      {
        path: 'filosofia',
        loadChildren: () => import('../filosofia/filosofia.module').then(m => m.FilosofiaPageModule)
      },
      {
        path: 'cuenta',
        loadChildren: () => import('../cuenta/cuenta.module').then( m => m.CuentaPageModule)
      },
      {
        path: 'checador',
        loadChildren: () => import('../checador/checador.module').then( m => m.ChecadorPageModule)
      },
      // {
      //   path: 'recursos',
      //   loadChildren: () => import('../recursos/recursos.module').then(m => m.RecursosPageModule)
      // },
      // {
      //   path: 'area',
      //   loadChildren: () => import('../area/area.module').then( m => m.AreaPageModule)
      // },
      // {
      //   path: 'cotizaciones',
      //   loadChildren: () => import('../cotizaciones/cotizaciones.module').then( m => m.CotizacionesPageModule)
      // },
      {
        path: '**',
        redirectTo: 'filosofia'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
