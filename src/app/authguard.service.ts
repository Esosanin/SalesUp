import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { LoginService } from './servicios/login/login.service';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})

//servicio encargado de la autenticación
export class AuthguardService  {

  platform = Capacitor.getPlatform();

  constructor(private navController: NavController,
    private service: LoginService,
    private menu: MenuController) { }

  canActivateChild(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {

    if (!localStorage.getItem('token')) {
      this.service.createAlert('Favor de iniciar sesión');
      this.navController.navigateBack(['/login'], { queryParams: { from: route.url } });
      return false;

      //var urlTree = this.router.createUrlTree(['login']);
      //return urlTree;
    }
    let url = state.url.toString().split('/')[1];
    let url2 = state.url.toString().split('/')[2];

    if (url == 'tabs2') {

      let id_sap = parseInt(localStorage.getItem('id_sap')!);
      let tipo = localStorage.getItem('tipo');
      let permisos = JSON.parse(localStorage.getItem('permisos')!);

      let permisosArray = [];
      for (let i = 0; i < permisos.length; i++) {
        permisosArray.push(parseInt(permisos[i].id_sap));
      }
      if(!permisosArray.includes(id_sap)){
        this.service.createAlert('Su usuario no se encuentra dado de alta en Sales Up, favor de contactar a TI.');
        this.navController.navigateBack(['/tabs']);
        return false;
      }else{
        this.menu.enable(false, 'ecnMenu');
        this.menu.enable(true, 'salesupMenu');
      }

      //permiso para mostrar modulo metas
      if(url2 == 'metas'){
        let tipo = localStorage.getItem('tipo');
        if(tipo == 'Vendedor'){
          this.navController.navigateBack(['/tabs2/salesup']);
          this.service.createAlert('No cuenta con los permisos para ver esta página.');
          return false;
        }
      }

      //permiso para mostrar modulo de alta de vendedores
      if(url2 == 'altavendedor'){
        if(tipo=='Vendedor'){
          this.navController.navigateBack(['/tabs2/salesup']);
          this.service.createAlert('No cuenta con los permisos para ver esta página.');
          return false;
        }
      }

    } else {
      this.menu.enable(false, 'salesupMenu');
      this.menu.enable(true, 'ecnMenu');
    }
    return true;
  }
}
