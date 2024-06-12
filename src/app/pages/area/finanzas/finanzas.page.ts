import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-finanzas',
  templateUrl: './finanzas.page.html',
  styleUrls: ['./finanzas.page.scss'],
})
export class FinanzasPage implements OnInit {
  constructor() {}

  ngOnInit() {}

  pages: Array<any> = [
    {
      title: 'Solicitud de viáticos',
      icon: 'cash',
      url: 'solicitudes-viaticos',
    }
  ];
}
