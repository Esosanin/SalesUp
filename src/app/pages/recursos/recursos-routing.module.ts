import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecursosPage } from './recursos.page';

const routes: Routes = [
  {
    path: '',
    component: RecursosPage
  },
  {
    path: 'tickets',
    loadChildren: () => import('./tickets/tickets.module').then( m => m.TicketsPageModule)
  },
  {
    path: 'tickets-ti',
    loadChildren: () => import('./tickets-ti/tickets-ti.module').then( m => m.TicketsTIPageModule)
  },
  // {
  //   path: 'projectdone',
  //   loadChildren: () => import('./projectdone/projectdone.module').then( m => m.ProjectdonePageModule)
  // },
  {
    path: 'gastos',
    loadChildren: () => import('./gastos/gastos.module').then( m => m.GastosPageModule)
  },
  {
    path: 'vacaciones',
    loadChildren: () => import('./vacaciones/dash.module').then( m => m.DashPageModule)
  },
  {
    path: 'incidencias',
    loadChildren: () => import('./dashboards/pbi_indicadores_incidencias/dash.module').then( m => m.DashPageModule)
  },
  {
    path: 'anfinanciero',
    loadChildren: () => import('./dashboards/pbi_analisis_financiero/dash.module').then( m => m.DashPageModule)
  },
  {
    path: 'conpresupuesto',
    loadChildren: () => import('./dashboards/pbi_control_presupuestal/dash.module').then( m => m.DashPageModule)
  },
  {
    path: 'indsva',
    loadChildren: () => import('./dashboards/pbi_indicadores_sva/dash.module').then( m => m.DashPageModule)
  },
  {
    path: 'gesfinanciera',
    loadChildren: () => import('./dashboards/pbi_gestion_auo/dash.module').then( m => m.DashPageModule)
  },
  {
    path: 'dashbalance',
    loadChildren: () => import('./dashboards/pbi_balance/dash.module').then( m => m.DashPageModule)
  },
  {
    path: 'dashviaticos',
    loadChildren: () => import('./dashboards/pbi_viaticos/dash.module').then( m => m.DashPageModule)
  },
  {
    path: 'dashgastos',
    loadChildren: () => import('./dashboards/pbi_gastos/dash.module').then( m => m.DashPageModule)
  },
  {
    path: 'uep',
    loadChildren: () => import('./dashboards/pbi_uep_pipelines/dash.module').then( m => m.DashPageModule)
  },
  {
    path: 'segocprov',
    loadChildren: () => import('./dashboards/pbi_seguimiento_oc_prov/dash.module').then( m => m.DashPageModule)
  },
  {
    path: 'indsoluciones',
    loadChildren: () => import('./dashboards/pbi_indicadores_soln/dash.module').then( m => m.DashPageModule)
  },
  {
    path: 'indcoe',
    loadChildren: () => import('./dashboards/pbi_indicadores_coe/dash.module').then( m => m.DashPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecursosPageRoutingModule {}
