import { Component, ViewChild } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { LoginService } from './servicios/login/login.service';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { SalesupService } from './servicios/salesup/salesup.service';

declare const NavigationBar: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  @ViewChild(AppComponent) appComponent!: AppComponent;

  appPages: Array<any> = [
    {
      title: 'Filosofía ECN',
      url: '/tabs/filosofia',
      icon: 'bookmark-outline',
    },
    // {
    //   title: 'Mis recursos',
    //   url: '/tabs/recursos',
    //   icon: 'folder-outline',
    // },
    // {
    //   title: 'Mi área',
    //   url: '/tabs/area',
    //   icon: 'business-outline',
    // },
    // {
    //   title: 'Cotizaciones',
    //   url: '/tabs/cotizaciones',
    //   icon: 'cash-outline'
    // }
  ];

  salesUpPages: Array<any> = [
    {
      title: 'Ind. semanales',
      url: '/tabs2/salesup',
      icon: 'pie-chart-outline',
    },
    {
      title: 'Planes de trabajo',
      url: '/tabs2/plansemanal',
      icon: 'calendar-number-outline',
    },
    {
      title: 'Ind. mensuales',
      url: '/tabs2/mimes',
      icon: 'pie-chart-outline',
    },
    {
      title: 'Oportunidades',
      url: '/tabs2/oportunidades',
      icon: 'clipboard-outline',
    },
    {
      title: 'Metas',
      url: '/tabs2/metas',
      icon: 'flag-outline',
    },
    {
      title: 'Cuentas',
      url: '/tabs2/cuentas',
      icon: 'key-outline',
    },
    {
      title: 'Contactos',
      url: '/tabs2/contactos',
      icon: 'people-outline',
    },
    {
      title: 'Alta vendedores',
      url: '/tabs2/altavendedor',
      icon: 'person-add-outline',
    },
    {
      title: 'Calendario',
      url: '/tabs2/calendario',
      icon: 'calendar-outline',
    },
  ];

  darkMode = false;
  plataforma = '';

  constructor(
    public service: LoginService,
    private navController: NavController,
    private platform: Platform,
    private salesUpService: SalesupService
  ) {
    this.plataforma = Capacitor.getPlatform();
    this.platform.ready().finally(() => {
      let dark = localStorage.getItem('dark');
      if (dark == 'true') {
        document.querySelector('meta[name="color-scheme"]')?.setAttribute('content',  'dark');
        this.darkMode = true;
        document.documentElement.classList.toggle('ion-palette-dark', true);
        this.salesUpService.units = '#fff';
        this.salesUpService.title = '#fff';
        this.salesUpService.inner = '#444';
        if (this.plataforma != 'web') {
          StatusBar.setStyle({ style: Style.Dark });
          StatusBar.setBackgroundColor({ color: '#222428' });
          NavigationBar.backgroundColorByHexString('#222428', false);
        }
      } else if (dark == 'false') {
        document.querySelector('meta[name="color-scheme"]')?.setAttribute('content',  'light');
        this.darkMode = false;
        document.documentElement.classList.toggle('ion-palette-dark', false);
        this.salesUpService.units = '';
        this.salesUpService.title = '';
        this.salesUpService.inner = '#d8dade';
        if (this.plataforma != 'web') {
          StatusBar.setStyle({ style: Style.Light });
          StatusBar.setBackgroundColor({ color: '#f6f8fc' });
          NavigationBar.backgroundColorByHexString('#f6f8fc', true);
        }
      } else {
        if (
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
        ) {
          document.documentElement.classList.toggle('ion-palette-dark', true);
          localStorage.setItem('dark', 'true');
          this.darkMode = true;
          this.salesUpService.units = '#fff';
          this.salesUpService.title = '#fff';
          this.salesUpService.inner = '#444';
          if (this.plataforma != 'web') {
            StatusBar.setStyle({ style: Style.Dark });
            StatusBar.setBackgroundColor({ color: '#222428' });
            NavigationBar.backgroundColorByHexString('#222428', false);
          }
        } else {
          document.documentElement.classList.toggle('ion-palette-dark', false);
          localStorage.setItem('dark', 'false');
          this.darkMode = false;
          this.salesUpService.units = '';
          this.salesUpService.title = '';
          this.salesUpService.inner = '#d8dade';
          if (this.plataforma != 'web') {
            StatusBar.setStyle({ style: Style.Light });
            StatusBar.setBackgroundColor({ color: '#f6f8fc' });
            NavigationBar.backgroundColorByHexString('#f6f8fc', true);
          }
        }
      }

      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (event) => {
          const dark = event.matches ? true : false;
          if (dark) {
            document.querySelector('meta[name="color-scheme"]')?.setAttribute('content',  'dark');
            document.documentElement.classList.toggle('ion-palette-dark', true);
            localStorage.setItem('dark', 'true');
            this.darkMode = true;
            if (this.plataforma != 'web') {
              StatusBar.setStyle({ style: Style.Dark });
              StatusBar.setBackgroundColor({ color: '#222428' });
              NavigationBar.backgroundColorByHexString('#222428', false);
            }
          } else {
            document.querySelector('meta[name="color-scheme"]')?.setAttribute('content',  'light');
            document.documentElement.classList.toggle(
              'ion-palette-dark',
              false
            );
            localStorage.setItem('dark', 'false');
            this.darkMode = false;
            if (this.plataforma != 'web') {
              StatusBar.setStyle({ style: Style.Light });
              StatusBar.setBackgroundColor({ color: '#f6f8fc' });
              NavigationBar.backgroundColorByHexString('#f6f8fc', true);
            }
          }
        });
    });
  }

  logout() {
    localStorage.clear();
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      document.documentElement.classList.toggle('ion-palette-dark', true);
      localStorage.setItem('dark', 'true');
      this.darkMode = true;
      this.salesUpService.units = '#fff';
      this.salesUpService.title = '#fff';
      this.salesUpService.inner = '#444';
      if (this.plataforma != 'web') {
        StatusBar.setStyle({ style: Style.Dark });
        StatusBar.setBackgroundColor({ color: '#222428' });
        NavigationBar.backgroundColorByHexString('#222428', false);
      }
    } else {
      document.documentElement.classList.toggle('ion-palette-dark', false);
      localStorage.setItem('dark', 'false');
      this.darkMode = false;
      this.salesUpService.units = '';
      this.salesUpService.title = '';
      this.salesUpService.inner = '#d8dade';
      if (this.plataforma != 'web') {
        StatusBar.setStyle({ style: Style.Light });
        StatusBar.setBackgroundColor({ color: '#f6f8fc' });
        NavigationBar.backgroundColorByHexString('#f6f8fc', true);
      }
    }
    this.navController.navigateBack(['/login']);
  }

  darkChange() {
    if (this.darkMode) {
      document.querySelector('meta[name="color-scheme"]')?.setAttribute('content',  'dark');
      localStorage.setItem('dark', 'true');
      this.salesUpService.units = '#fff';
      this.salesUpService.title = '#fff';
      this.salesUpService.inner = '#444';
    } else {
      document.querySelector('meta[name="color-scheme"]')?.setAttribute('content',  'light');
      localStorage.setItem('dark', 'false');
      this.salesUpService.units = '';
      this.salesUpService.title = '';
      this.salesUpService.inner = '#d8dade';
    }
    document.documentElement.classList.toggle(
      'ion-palette-dark',
      this.darkMode
    );
    if (this.plataforma != 'web') {
      if (this.darkMode) {
        StatusBar.setStyle({ style: Style.Dark });
        StatusBar.setBackgroundColor({ color: '#222428' });
        NavigationBar.backgroundColorByHexString('#222428', false);
      } else {
        StatusBar.setStyle({ style: Style.Light });
        StatusBar.setBackgroundColor({ color: '#f6f8fc' });
        NavigationBar.backgroundColorByHexString('#f6f8fc', true);
      }
    }
  }

  ngOnInit() {}
}
