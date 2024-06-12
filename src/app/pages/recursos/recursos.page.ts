import { Component, OnInit } from '@angular/core';
import { CuentaService } from 'src/app/servicios/cuenta/cuenta.service';

@Component({
  selector: 'app-recursos',
  templateUrl: './recursos.page.html',
  styleUrls: ['./recursos.page.scss'],
})
export class RecursosPage implements OnInit {

  segment: string = 'solicitudes';

  //OTROS
  otros: Array<any> = [
    {
      title: 'Vacaciones y permisos',
      url: './permisos',
      icon: 'bed'
    },
    {
      title: 'Extensiones oficinas',
      url: './extensiones',
      icon: 'call'
    },
    {
      title: 'Comisiones',
      url: './comisiones',
      icon: 'call'
    },
    {
      title: 'Fuente de conocimiento (wiki)',
      url: './fuenteconocimiento',
      icon: 'book'
    },
    {
      title: 'Documentos ECN',
      url: './documentos',
      icon: 'folder'
    },
    {
      title: 'Project done',
      url: './projectdone',
      icon: 'bar-chart'
    },
    {
      title: 'Doc y Met por proyecto',
      url: './docmetproyecto',
      icon: 'bar-chart'
    },
    {
      title: 'Planeación de trabajo',
      url: './plantrabajo',
      icon: 'reader'
    },
    {
      title: 'Consulta de Cross Selling',
      url: './crossselling',
      icon: 'reader'
    },
    {
      title: 'Proyectos de inversión',
      url: './proyinversion',
      icon: 'cash'
    },
    {
      title: 'Lecciones aprendidas proyectos',
      url: './leccionesproyectos',
      icon: 'checkmark-done'
    },
  ];

  //REPORTES OTROS
  repotros: Array<any> = [
    {
      title: 'Indicadores de incidencias',
      url: './incidencias',
      icon: 'bar-chart'
    },
    {
      title: 'Análisis financiero',
      url: './anfinanciero',
      icon: 'bar-chart'
    },
    {
      title: 'Control presupuestal',
      url: './conpresupuesto',
      icon: 'grid'
    },
    {
      title: 'Indicadores SVA',
      url: './indsva',
      icon: 'bar-chart'
    },
    {
      title: 'Gestión financiera',
      url: './gesfinanciera',
      icon: 'grid'
    },
    {
      title: 'Dashboard balance',
      url: './dashbalance',
      icon: 'grid'
    },
    {
      title: 'Dashboard de viáticos',
      url: './dashviaticos',
      icon: 'grid'
    },
    {
      title: 'Dashboard de gastos',
      url: './dashgastos',
      icon: 'grid'
    },
    {
      title: 'UEP pipeline and sales',
      url: './uep',
      icon: 'grid'
    },
    {
      title: 'Seguimiento OC proveedores',
      url: './segocprov',
      icon: 'grid'
    },
    {
      title: 'Indicadores de soluciones',
      url: './indsoluciones',
      icon: 'grid'
    },
    // {
    //   title: 'Viáticos por zona',
    //   url: './viaticoszona',
    //   icon: 'bar-chart'
    // },
    // {
    //   title: 'ECN provisión',
    //   url: './ecnprovision',
    //   icon: 'bar-chart'
    // },
    // {
    //   title: 'Viáticos y gastos',
    //   url: './viaticosgastos',
    //   icon: 'bar-chart'
    // },
    // {
    //   title: 'Combustible',
    //   url: './repcombustible',
    //   icon: 'bar-chart'
    // },
    {
      title: 'Indicadores COE',
      url: './indcoe',
      icon: 'bar-chart'
    },
    // {
    //   title: 'Cumplimiento cliente',
    //   url: './cumplicliente',
    //   icon: 'bar-chart'
    // },
    // {
    //   title: 'Indicadores de seguridad',
    //   url: './indseguridad',
    //   icon: 'bar-chart'
    // },
    // {
    //   title: 'Foja',
    //   url: './foja',
    //   icon: 'reader'
    // },
    // {
    //   title: 'Foja Perú',
    //   url: './fojaperu',
    //   icon: 'reader'
    // },
    // {
    //   title: 'Estado resultados dinámico',
    //   url: './estadoresultdin',
    //   icon: 'reader'
    // },
    // {
    //   title: 'Semáforo finanzas',
    //   url: './semfinanzas',
    //   icon: 'reader'
    // },
    // {
    //   title: 'Cartera sin fecha de pago',
    //   url: './carterasinfech',
    //   icon: 'reader'
    // },
    // {
    //   title: 'Semáforo facturación',
    //   url: './semfacturacion',
    //   icon: 'reader'
    // },
    // {
    //   title: 'Metas vendedor por SPK',
    //   url: './metasvenspk',
    //   icon: 'reader'
    // },
    // {
    //   title: 'Metas vendedor por industria',
    //   url: './metasvenind',
    //   icon: 'reader'
    // },
    // {
    //   title: 'Metas regional por SPK',
    //   url: './metasregspk',
    //   icon: 'reader'
    // },
    // {
    //   title: 'Metas regional por Industria',
    //   url: './metasregind',
    //   icon: 'reader'
    // },
    // {
    //   title: 'Metas generales',
    //   url: './metasgen',
    //   icon: 'reader'
    // },
    // {
    //   title: 'Order entry',
    //   url: './orderentry',
    //   icon: 'reader'
    // },
    // {
    //   title: 'Metas indicadores IM-UEN',
    //   url: './metindicadoresimuen',
    //   icon: 'reader'
    // },
    // {
    //   title: 'Metas Fact-OE',
    //   url: './metasfactoe',
    //   icon: 'reader'
    // },
    // {
    //   title: 'Pronóstico de facturación',
    //   url: './pronfacturacion',
    //   icon: 'reader'
    // },

  ];

  //REPORTES
  reportes: Array<any> = [
    {
      title: 'SAP',
      url: './sap',
      icon: 'bar-chart'
    },
    {
      title: 'Backlog semaforo 2.0',
      url: './semaforo',
      icon: 'reader'
    },
    {
      title: 'Backlog equipos directos',
      url: './equipos',
      icon: 'reader'
    },
    {
      title: 'Backlog equipos directos',
      url: './eqdirectos',
      icon: 'reader'
    },
    {
      title: 'Backlog equipos transfer',
      url: './eqtransfer',
      icon: 'reader'
    },
    {
      title: 'Backlog servicios',
      url: './servicios',
      icon: 'reader'
    },
    {
      title: 'Backlog proyectos',
      url: './proyectos',
      icon: 'reader'
    },
    {
      title: 'Backlog servicios',
      url: './servicios',
      icon: 'reader'
    },
    {
      title: 'Backlog gas y fuego',
      url: './gasfuego',
      icon: 'reader'
    },
    {
      title: 'Backlog Suite Met',
      url: './suitemet',
      icon: 'reader'
    },
    {
      title: 'Facturas abiertas',
      url: './facturas',
      icon: 'bar-chart'
    },
    {
      title: 'Cobranza',
      url: './cobranza',
      icon: 'bar-chart'
    },
    {
      title: 'Utilidad facturas',
      url: './utilidadfac',
      icon: 'bar-chart'
    },
    {
      title: 'Cotizaciones abiertas',
      url: './cotabiertas',
      icon: 'bar-chart'
    },
    {
      title: 'Cotizaciones abiertas por partida',
      url: './cotabpartida',
      icon: 'bar-chart'
    },
    {
      title: 'Cotizaciones abiertas por partida con margen',
      url: './cotabpartida',
      icon: 'bar-chart'
    },
    {
      title: 'Cotizaciones completas',
      url: './cotcompletas',
      icon: 'bar-chart'
    },
    {
      title: 'Cotizaciones por partida',
      url: './cotpartida',
      icon: 'bar-chart'
    },
    {
      title: 'Pedidos por partida',
      url: './pedpartida',
      icon: 'bar-chart'
    },
    {
      title: 'Backlog pedidos pendientes',
      url: './pedpendientes',
      icon: 'reader'
    },
    {
      title: 'Seguimiento de pedidos',
      url: './segpedidos',
      icon: 'bar-chart'
    },
    {
      title: 'Confirmación de pedidos',
      url: './confpedidos',
      icon: 'bar-chart'
    },
    {
      title: 'Expeditación directos',
      url: './expdirectos',
      icon: 'bar-chart'
    },
    {
      title: 'Expeditación Transfer',
      url: './exptransfer',
      icon: 'bar-chart'
    },
    {
      title: 'Cartera de clientes',
      url: './carclientes',
      icon: 'bar-chart'
    },
    {
      title: 'FC y NC clientes soluciones',
      url: './fcncclientes',
      icon: 'bar-chart'
    },
    {
      title: 'Factura proveedor',
      url: './facproveedor',
      icon: 'bar-chart'
    },
    {
      title: 'Movimiento de stock 1.1',
      url: './movstock',
      icon: 'bar-chart'
    },
  ];

  //SOLICITUDES
  solicitudes: Array<any> = [
    {
      title: 'Tickets',
      url: './tickets',
      icon: 'ticket'
    },
    {
      title: 'Tickets TI',
      url: './tickets-ti',
      icon: 'ticket'
    },
    {
      title: 'Gastos',
      url: './gastos',
      icon: 'wallet'
    },
    // {
    //   title: 'Viáticos',
    //   url: './viaticos',
    //   icon: 'bag'
    // },
    // {
    //   title: 'Reembolsos',
    //   url: './reembolsos',
    //   icon: 'cash'
    // },
    // {
    //   title: 'Combustible',
    //   url: './combustible',
    //   icon: 'water'
    // },
    // {
    //   title: 'Guía de envío',
    //   url: './envios',
    //   icon: 'paper-plane'
    // },
    // {
    //   title: 'Servicios y reservaciones',
    //   url: './reservaciones',
    //   icon: 'card'
    // }
    {
      title: 'Vacaciones y permisos',
      url: './vacaciones',
      icon: 'bed'
    },
    // {
    //   title: 'Project Done',
    //   url: './projectdone',
    //   icon: 'briefcase'
    // }
  ];
  constructor(private service: CuentaService) {
    this.service.segment = 'tickets';
  }

  ngOnInit() {
  }

}
