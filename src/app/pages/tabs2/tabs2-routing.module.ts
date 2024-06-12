import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tabs2Page } from './tabs2.page';

const routes: Routes = [
  {
    path: '',
    component: Tabs2Page,
    children:[
      {
        path: 'salesup',
        loadChildren: () => import('../salesup/salesup.module').then(m => m.SalesupPageModule)
      },
      {
        path: 'plansemanal',
        loadChildren: () => import('../salesup/plansemanal/plansemanal.module').then(m => m.PlansemanalPageModule)
      },
      {
        path: 'mimes',
        loadChildren: () => import('../salesup/mimes/mimes.module').then(m => m.MimesPageModule)
      },
      {
        path: 'oportunidades',
        loadChildren: () => import('../salesup/oportunidades/oportunidades.module').then(m => m.OportunidadesPageModule)
      },
      {
        path: 'metas',
        loadChildren: () => import('../salesup/metas/metas.module').then( m => m.MetasPageModule)
      },
      {
        path: 'cuentas',
        loadChildren: () => import('../salesup/cuentas/cuentas.module').then( m => m.CuentasPageModule)
      },
      {
        path: 'contactos',
        loadChildren: () => import('../salesup/contactos/contactos.module').then( m => m.ContactosPageModule)
      },
      {
        path: 'altavendedor',
        loadChildren: () => import('../salesup/altavendedor/altavendedor.module').then( m => m.AltavendedorPageModule)
      },
      {
        path: 'calendario',
        loadChildren: () => import('../salesup/calendario/calendario.module').then( m => m.CalendarioPageModule)
      },
      {
        path: '**',
        redirectTo: 'salesup'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tabs2PageRoutingModule {}
