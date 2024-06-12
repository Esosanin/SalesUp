import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthguardService } from './authguard.service';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'tabs',
    canActivateChild: [AuthguardService],
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'tabs2',
    canActivateChild: [AuthguardService],
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('./pages/tabs2/tabs2.module').then( m => m.Tabs2PageModule)
  },
  {
    path: '**',
    redirectTo: 'tabs'
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, onSameUrlNavigation:'reload' })
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
