import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-solicitudes-viaticos',
  templateUrl: './solicitudes-viaticos.page.html',
  styleUrls: ['./solicitudes-viaticos.page.scss'],
})
export class SolicitudesViaticosPage implements OnInit {

  constructor() { }

  pages: Array<any> = [
    {
      title: 'Solicitudes registradas',
      icon: 'document',
      url: 'solicitudes-viaticos',
    },
    {
      title: 'Informes registrados',
      icon: 'reader',
      url: 'informes-registrados',
    },
    {
      title: 'Solicitudes por depositar',
      icon: 'cash',
      url: 'solicitudes-deposito',
    },
    {
      title: 'Generar plantilla de viáticos',
      icon: 'reader',
      url: 'generar-extracto',
    },
    {
      title: 'Saldos viáticos colaboradores',
      icon: 'reader',
      url: 'saldos-viaticos-colab',
    },
    {
      title: 'Viáticos hospedajes',
      icon: 'home',
      url: 'viaticos-hospedajes',
    },
  ];

  ngOnInit() {
  }

}
