import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CapitalhumanoPage } from './capitalhumano.page';

const routes: Routes = [
  {
    path: '',
    component: CapitalhumanoPage
  },
  // {
  //   path: 'areas',
  //   loadChildren: () => import('./areas/areas.module').then( m => m.AreasPageModule)
  // },
  {
    path: 'departamentos',
    loadChildren: () => import('./departamentos/departamentos.module').then( m => m.DepartamentosPageModule)
  },
  {
    path: 'especialidades',
    loadChildren: () => import('./especialidades/especialidades.module').then( m => m.EspecialidadesPageModule)
  },
  {
    path: 'carreras',
    loadChildren: () => import('./carreras/carreras.module').then( m => m.CarrerasPageModule)
  },
  {
    path: 'nacionalidades',
    loadChildren: () => import('./nacionalidades/nacionalidades.module').then( m => m.NacionalidadesPageModule)
  },
  {
    path: 'puestos',
    loadChildren: () => import('./puestos/puestos.module').then( m => m.PuestosPageModule)
  },
  {
    path: 'regiones',
    loadChildren: () => import('./regiones/regiones.module').then( m => m.RegionesPageModule)
  },
  {
    path: 'sucursales',
    loadChildren: () => import('./sucursales/sucursales.module').then( m => m.SucursalesPageModule)
  },
  {
    path: 'propuesta-salarial',
    loadChildren: () => import('./propuesta-salarial/propuesta-salarial.module').then( m => m.PropuestaSalarialPageModule)
  },
  {
    path: 'ofertas-laborales',
    loadChildren: () => import('./ofertas-laborales/ofertas-laborales.module').then( m => m.OfertasLaboralesPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CapitalhumanoPageRoutingModule {}
