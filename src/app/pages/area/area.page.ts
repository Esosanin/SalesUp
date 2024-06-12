import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-area',
  templateUrl: './area.page.html',
  styleUrls: ['./area.page.scss'],
})
export class AreaPage implements OnInit {

  constructor() {
   }

  //PAGINAS
  pages: Array<any> = [
    // {
    //   title: 'Tecnologías de la información',
    //   url: './tecnologias',
    //   icon: 'laptop'
    // },
    {
      title: 'Capital humano',
      url: './capitalhumano',
      icon: 'file-tray-stacked'
    },
    {
      title: 'Servicios',
      url: './servicios',
      icon: 'server'
    },
    // {
    //   title: 'Eficiencia operativa',
    //   url: './eficienciaop',
    //   icon: 'checkmark'
    // },
    {
      title: 'Finanzas',
      url: './finanzas',
      icon: 'cash'
    },
    // {
    //   title: 'Toma de decisiones',
    //   url: './tomadecisiones',
    //   icon: 'bar-chart'
    // },
    // {
    //   title: 'Equipos',
    //   url: './equipos',
    //   icon: 'hammer'
    // },
    // {
    //   title: 'PMO',
    //   url: './pmo',
    //   icon: 'calendar-clear'
    // },
    // {
    //   title: 'Tesoreria',
    //   url: './tesoreria',
    //   icon: 'card'
    // },
    // {
    //   title: 'Logistica',
    //   url: './tesoreria',
    //   icon: 'archive'
    // },
    // {
    //   title: 'Mercadotecnia',
    //   url: './mercadotecnia',
    //   icon: 'chatbox'
    // },
    // {
    //   title: 'Compras',
    //   url: './compras',
    //   icon: 'cart'
    // },
  ];

  ngOnInit() {
  }

}
