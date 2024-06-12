import { DatePipe, formatCurrency } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController } from '@ionic/angular';
// import { BaseChartDirective } from 'ng2-charts';
import { Observable, catchError, lastValueFrom, tap } from 'rxjs';
import { SelectWithSearchComponent } from 'src/app/components/select-with-search/select-with-search.component';
import { SalesupService } from 'src/app/servicios/salesup/salesup.service';


@Component({
  selector: 'app-salesup',
  templateUrl: './salesup.page.html',
  styleUrls: ['./salesup.page.scss']
})
export class SalesupPage implements OnInit {
  @ViewChild('select') selectSearch!: SelectWithSearchComponent;
  // @ViewChild(BaseChartDirective)
  // public chart!: BaseChartDirective;

  tipo: string = '';
  zona: string = '';
  id_zona = '';
  indicadoresValue: string = 'zona';
  cards: any = Array();
  id_sap: number = 0;

  porcentajeTvfc: number = 0;
  rendimientoTvfc: string = '';
  contenidoTvfc: string = '';

  porcentajeOportunidades: number = 0;
  rendimientoOportunidades: string = '';
  contenidoOportunidades: string = '';

  porcentajeAsertividad: number = 0;
  rendimientoAsertividad: string = '';
  contenidoAsertividad: string = '';

  porcentajeHitrate: number = 0;
  rendimientoHitrate: string = '';
  contenidoHitrate: string = '';

  porcentajeCotizaciones: number = 0;
  rendimientoCotizaciones: string = '';
  contenidoCotizaciones: string = '';

  porcentajeOrderentry: number = 0;
  rendimientoOrderentry: string = '';
  contenidoOrderentry: string = '';

  porcentajeCrossp: number = 0;
  rendimientoCrossp: string = '';
  contenidoCrossp: string = '';

  porcentajeCrossv: number = 0;
  rendimientoCrossv: string = '';
  contenidoCrossv: string = '';

  porcentajeAcomp: number = 0;
  rendimientoAcomp: string = '';
  contenidoAcomp: string = '';

  zonas$!: Observable<any>;
  vendedores$!: Observable<any>;

  showModal: boolean = false;
  modalTitle: string = '';
  detalles: Array<Object> = [];
  semanas = Array();
  numeroSemana = parseInt(this.datePipe.transform(new Date(), 'w')!);
  limite: number = 20;
  limiteSelects: number = 20;

  // barChartData = Object();
  // barChartOptions = Object();
  modalCaptura = false;
  modalCapturaTitle = '';
  showCards = false;

  //COMO EJEMPLO EN CAPTURA DE PLANES
  vendedoresCaptura = Array();

  constructor(
    private datePipe: DatePipe,
    private service: SalesupService,
    private loadingController: LoadingController,
    public salesUpService: SalesupService
  ) { }

  refreshData(vendedorSelected: any) {
    switch (this.tipo) {
      case 'Gerente':
        if (this.indicadoresValue == 'zona') {
          const data = { id_zona: this.id_zona, semana: this.numeroSemana };
          this.loading();
          this.getHorasMetas(data).finally(() => {
            this.setHorasMetas();
            this.loadingController.dismiss();
          });
        } else {
          if (vendedorSelected.id_sap != 0) {
            const data = {
              id_sap: vendedorSelected.id_sap,
              semana: this.numeroSemana,
            };
            this.loading();
            this.getHorasMetas(data).finally(() => {
              this.setHorasMetas();
              this.loadingController.dismiss();
            });
          }
        }
        break;

      case 'Vendedor':
        const data = { id_sap: this.id_sap, semana: this.numeroSemana };
        this.loading();
        this.getHorasMetas(data).finally(() => {
          this.setHorasMetas();
          this.loadingController.dismiss();
        });
        break;

      case 'Corporativo':
        if (this.indicadoresValue == 'zona') {
          const data = { id_zona: this.id_zona, semana: this.numeroSemana };
          this.loading();
          this.getHorasMetas(data).finally(() => {
            this.setHorasMetas();
            this.loadingController.dismiss();
          });
        } else {
          if (vendedorSelected.id_sap != 0) {
            const data = {
              id_sap: vendedorSelected.id_sap,
              semana: this.numeroSemana,
            };
            this.loading();
            this.getHorasMetas(data).finally(() => {
              this.setHorasMetas();
              this.loadingController.dismiss();
            });
          }
        }
        break;
    }
  }

  refresh(event: any, vendedorSelected: any) {
    switch (this.tipo) {
      case 'Gerente':
        this.getData();
        if (this.indicadoresValue == 'zona') {
          const data = { id_zona: this.id_zona, semana: this.numeroSemana };
          this.loading();
          this.getHorasMetas(data).finally(() => {
            this.setHorasMetas();
            this.loadingController.dismiss();
          });
        } else {
          if (vendedorSelected.id != 0) {
            const data = {
              id_sap: vendedorSelected.id,
              semana: this.numeroSemana,
            };
            this.loading();
            this.getHorasMetas(data).finally(() => {
              this.setHorasMetas();
              this.loadingController.dismiss();
            });
          }
        }

        break;

      case 'Vendedor':
        const data = { id_sap: this.id_sap, semana: this.numeroSemana };
        this.loading();
        this.getHorasMetas(data).finally(() => {
          this.setHorasMetas();
          this.loadingController.dismiss();
        });
        break;

      case 'Corporativo':
        this.getData();
        if (this.indicadoresValue == 'zona') {
          const data = { id_zona: this.id_zona, semana: this.numeroSemana };
          this.loading();
          this.getHorasMetas(data).finally(() => {
            this.setHorasMetas();
            this.loadingController.dismiss();
          });
        } else {
          if (vendedorSelected.id != 0) {
            const data = {
              id_sap: vendedorSelected.id,
              semana: this.numeroSemana,
            };
            this.loading();
            this.getHorasMetas(data).finally(() => {
              this.setHorasMetas();
              this.loadingController.dismiss();
            });
          }
        }
        break;
    }
    if (event) {
      event.target.complete();
    }
  }

  getData() {
    if (this.tipo == 'Corporativo') {
      this.zonas$ = this.service.getZonas().pipe(
        catchError(err => {
          this.service.createAlert('Error al conectar con el servidor, intente de nuevo.');
          throw 'err';
        })
      );
      const data = {
        id_sap: this.id_sap,
        id_zona: this.zona,
        tipo: this.tipo,
      };
      this.vendedores$ = this.service.getVendedores(data).pipe(
        tap(response => {
          this.selectSearch.values = response.vendedores;
          this.selectSearch.values2 = response.vendedores;
        }),
        catchError(err => {
          this.service.createAlert('Error al conectar con el servidor, intente de nuevo.');
          throw 'err';
        })
      );
    } else if (this.tipo == 'Gerente') {
      const data = {
        id_sap: this.id_sap,
        id_zona: this.id_zona,
        tipo: this.tipo
      };
      this.vendedores$ = this.service.getVendedores(data).pipe(
        tap(response => {
          this.selectSearch.values = response.vendedores;
        }),
        catchError(err => {
          this.service.createAlert('Error al conectar con el servidor, intente de nuevo.');
          throw 'err';
        })
      );
    }
    // response = await lastValueFrom(this.service.getVendedores(data));
    // if (response) {
    //   this.vendedores = response.vendedores;
    //   this.vendedores2 = response.vendedores;
    // }
  }

  // cardClick(detalles: string) {
  //   this.modalTitle = '';
  //   this.detalles = [];
  //   this.showModal = true;
  //   this.detallesModal.onDidDismiss().finally(
  //     () => this.showModal = false
  //   );
  //   if (detalles == 'tvfc') {
  //     this.modalTitle = 'Visitas realizadas';
  //     this.detalles = [
  //       { title: 'Bimbo', text1: 'Objetivo general', text2: 'Duración: 1 horas' },
  //       { title: 'Coca Cola', text1: 'Objetivo general', text2: 'Duración: 1 horas' }
  //     ];
  //   }
  //   if (detalles == 'oportunidades') {
  //     this.modalTitle = 'Oportunidades detectadas';
  //     this.detalles = [
  //       { title: 'Ford', text1: 'Compra de material', text2: 'oc6947' },
  //       { title: 'Heineken', text1: 'medidor electromagnético', text2: 'pendiente factura' }
  //     ];
  //   }
  //   if (detalles == 'asertividad') {
  //     this.modalTitle = 'Asertividad';
  //     this.detalles = [
  //       { title: 'Producto 1', text1: 'Descripción Producto 1', text2: '$50,000' },
  //       { title: 'Producto 2', text1: 'Descripción Producto 2', text2: '$25,000' }
  //     ];
  //   }
  //   if (detalles == 'hitrate') {
  //     this.modalTitle = 'Hit rate';
  //     this.detalles = [
  //       { title: 'Producto 1', text1: 'Descripción Producto 1', text2: '$50,000' },
  //       { title: 'Producto 2', text1: 'Descripción Producto 2', text2: '$25,000' }
  //     ];
  //   }
  //   if (detalles == 'cotizaciones') {
  //     this.modalTitle = 'Cotizaciones';
  //     this.detalles = [
  //       { title: 'Producto 1', text1: 'Descripción Producto 1', text2: '$50,000' },
  //       { title: 'Producto 2', text1: 'Descripción Producto 2', text2: '$25,000' }
  //     ];
  //   }
  //   if (detalles == 'orderentry') {
  //     this.modalTitle = 'Order entry';
  //     this.detalles = [
  //       { title: 'Producto 1', text1: 'Descripción Producto 1', text2: '$50,000' },
  //       { title: 'Producto 2', text1: 'Descripción Producto 2', text2: '$25,000' }
  //     ];
  //   }
  //   if (detalles == 'crossp') {
  //     this.modalTitle = 'Cross selling preventivo';
  //     this.detalles = [
  //       { title: 'Producto 1', text1: 'Descripción Producto 1', text2: '$50,000' },
  //       { title: 'Producto 2', text1: 'Descripción Producto 2', text2: '$25,000' }
  //     ];
  //   }
  //   if (detalles == 'crossv') {
  //     this.modalTitle = 'Cross selling venta';
  //     this.detalles = [
  //       { title: 'Producto 1', text1: 'Descripción Producto 1', text2: '$50,000' },
  //       { title: 'Producto 2', text1: 'Descripción Producto 2', text2: '$25,000' }
  //     ];
  //   }
  // }


  setHorasMetas() {
    this.cards[0].rendimiento = this.rendimientoTvfc;
    this.cards[0].contenido = this.contenidoTvfc;
    this.cards[0].porcentaje = this.porcentajeTvfc;

    this.cards[1].rendimiento = this.rendimientoOportunidades;
    this.cards[1].contenido = this.contenidoOportunidades;
    this.cards[1].porcentaje = this.porcentajeOportunidades;

    this.cards[2].rendimiento = this.rendimientoCotizaciones;
    this.cards[2].contenido = this.contenidoCotizaciones;
    this.cards[2].porcentaje = this.porcentajeCotizaciones;

    this.cards[3].rendimiento = this.rendimientoCrossp;
    this.cards[3].contenido = this.contenidoCrossp;
    this.cards[3].porcentaje = this.porcentajeCrossp;

    this.cards[4].rendimiento = this.rendimientoOrderentry;
    this.cards[4].contenido = this.contenidoOrderentry;
    this.cards[4].porcentaje = this.porcentajeOrderentry;

    this.cards[5].rendimiento = this.rendimientoCrossv;
    this.cards[5].contenido = this.contenidoCrossv;
    this.cards[5].porcentaje = this.porcentajeCrossv;

    this.cards[6].rendimiento = this.rendimientoAsertividad;
    this.cards[6].contenido = this.contenidoAsertividad;
    this.cards[6].porcentaje = this.porcentajeAsertividad;

    this.cards[7].rendimiento = this.rendimientoHitrate;
    this.cards[7].contenido = this.contenidoHitrate;
    this.cards[7].porcentaje = this.porcentajeHitrate;

    this.cards[8].rendimiento = this.rendimientoAcomp;
    this.cards[8].contenido = this.contenidoAcomp;
    this.cards[8].porcentaje = this.porcentajeAcomp;
  }

  ngOnInit() {
    this.cards = [
      {
        detalles: 'tvfc',
        titulo: 'TVFC',
        subtitulo: 'Tiempo de visita frente al cliente.',
        rendimiento: this.rendimientoTvfc,
        contenido: this.contenidoTvfc,
        porcentaje: this.porcentajeTvfc,
      },
      {
        detalles: 'oportunidades',
        titulo: 'Oportunidades',
        subtitulo: 'Oportunidades de negocio detectadas.',
        rendimiento: this.rendimientoOportunidades,
        contenido: this.contenidoOportunidades,
        porcentaje: this.porcentajeOportunidades,
      },
      {
        detalles: 'cotizaciones',
        titulo: 'Cotizaciones',
        subtitulo: 'Monto cotizado.',
        rendimiento: this.rendimientoCotizaciones,
        contenido: this.contenidoCotizaciones,
        porcentaje: this.porcentajeCotizaciones,
      },
      {
        detalles: 'crossp',
        titulo: 'Cross selling preventivo',
        subtitulo: 'Venta cruzada.',
        rendimiento: this.rendimientoCrossp,
        contenido: this.contenidoCrossp,
        porcentaje: this.porcentajeCrossp,
      },
      {
        detalles: 'orderentry',
        titulo: 'Order entry',
        subtitulo: 'Orden de compra.',
        rendimiento: this.rendimientoOrderentry,
        contenido: this.contenidoOrderentry,
        porcentaje: this.porcentajeOrderentry,
      },
      {
        detalles: 'crossv',
        titulo: 'Cross selling venta',
        subtitulo: 'Venta cruzada.',
        rendimiento: this.rendimientoCrossv,
        contenido: this.contenidoCrossv,
        porcentaje: this.porcentajeCrossv,
      },
      {
        detalles: 'asertividad',
        titulo: 'Asertividad',
        subtitulo: 'Asertividad en ventas.',
        rendimiento: this.rendimientoAsertividad,
        contenido: this.contenidoAsertividad,
        porcentaje: this.porcentajeAsertividad,
      },
      {
        detalles: 'hitrate',
        titulo: 'Hit Rate',
        subtitulo: 'Cotizaciones y pedidos.',
        rendimiento: this.rendimientoHitrate,
        contenido: this.contenidoHitrate,
        porcentaje: this.porcentajeHitrate,
      },
      {
        detalles: 'acompañamientos',
        titulo: 'Acompañamientos',
        subtitulo: 'Acompañamientos de compañeros.',
        rendimiento: this.rendimientoAcomp,
        contenido: this.contenidoAcomp,
        porcentaje: this.porcentajeAcomp,
      },
      // {
      //   detalles: 'plancaptura',
      //   titulo: 'Planes capturados',
      //   subtitulo: 'Planes semanales capturados.',
      // },
    ];
  }

  planesCapturados(event: any) {
    if (event.active.length > 0) {
      if (event.active[0].index == 0) {
        this.modalCapturaTitle = 'Planes capturados';
        this.vendedoresCaptura = [
          { nombre: 'Ibeth Picos' },
          { nombre: 'Adolfo Pizarro' },
          { nombre: 'Adrian Rivera' },
          { nombre: 'Arely Rodriguez' },
          { nombre: 'Armando Navarro' },
          { nombre: 'Balam Ramirez' },
          { nombre: 'Fernando Armas' },
        ];
        this.modalCaptura = true;
      } else {
        this.modalCapturaTitle = 'Planes no capturados';
        this.vendedoresCaptura = [
          { nombre: 'Javier Cañedo' },
          { nombre: 'Jesus Santos' },
          { nombre: 'Jonathan Villalobos' },
        ];
        this.modalCaptura = true;
      }
    }
  }

  ionViewWillEnter() {

    let year = this.datePipe.transform(new Date(), 'yyyy');
    let date = new Date(year + '-12-31');
    let semanasAño = parseInt(this.datePipe.transform(date, 'w')!);
    semanasAño = 52;
    for (let i = 1; i <= semanasAño; i++) {
      this.semanas.push(i);
    }
    // this.barChartData = {
    //   labels: ['Si', 'No'],
    //   datasets: [
    //     {
    //       label: '',
    //       data: [7, 3],
    //     },
    //   ],
    // };
    // this.barChartOptions = {
    //   responsive: false,
    //   maintainAspectRatio: false,
    //   backgroundColor: '#0157b8',
    // };
    this.id_sap = parseInt(localStorage.getItem('id_sap')!);
    this.tipo = localStorage.getItem('tipo')!;
    this.id_zona = localStorage.getItem('id_zona')!;
    this.zona = localStorage.getItem('zona')!;
    this.getData();
  }

  async loading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      spinner: 'circles',
      cssClass: 'loading'
    });

    await loading.present();
  }

  async getHorasMetas(data: any) {
    let response = await lastValueFrom(this.service.getHorasMetas(data));
    if (response) {
      let horas: number = response.horas;
      let oportunidades: number = response.oportunidades;
      let metas = response.metas;
      let metaTvfc: number = 0;
      let metaOportunidades: number = 0;
      let metaEH: number = 0;
      let metaSVA: number = 0;
      let metaSCI: number = 0;
      let metaSPF: number = 0;
      let metaSTM: number = 0;
      let metaUEP: number = 0;

      let cotEH: number = 0;
      let cotSVA: number = 0;
      let cotSCI: number = 0;
      let cotSPF: number = 0;
      let cotSTM: number = 0;
      let cotUEP: number = 0;

      let pedEH: number = 0;
      let pedSVA: number = 0;
      let pedSCI: number = 0;
      let pedSPF: number = 0;
      let pedSTM: number = 0;
      let pedUEP: number = 0;

      if (!Array.isArray(metas)) {
        metaTvfc = parseInt(metas?.meta_tvfc);
        metaOportunidades = parseInt(metas?.meta_leads);
        metaEH = parseFloat(metas?.meta_eh);
        metaSVA = parseFloat(metas?.meta_sva);
        metaSCI = parseFloat(metas?.meta_sci);
        metaSPF = parseFloat(metas?.meta_spf);
        metaSTM = parseFloat(metas?.meta_stm);
        metaUEP = parseFloat(metas?.meta_uep);
      }

      this.porcentajeTvfc =
        metaTvfc == 0 ? 0 : Math.round((horas * 100) / metaTvfc);

      if (this.porcentajeTvfc < 70) {
        this.rendimientoTvfc = 'Rendimiento bajo';
      } else if (this.porcentajeTvfc > 70 && this.porcentajeTvfc < 90) {
        this.rendimientoTvfc = 'Rendimiento promedio';
      } else if (this.porcentajeTvfc >= 90) {
        this.rendimientoTvfc = 'Rendimiento óptimo';
      }

      this.contenidoTvfc = 'Horas: ' + horas.toFixed(2) + ' | Meta: ' + metaTvfc;

      this.porcentajeOportunidades =
        metaOportunidades == 0
          ? 0
          : Math.round((oportunidades * 100) / metaOportunidades);

      if (this.porcentajeOportunidades < 75) {
        this.rendimientoOportunidades = 'Rendimiento bajo';
      } else if (
        this.porcentajeOportunidades > 75 &&
        this.porcentajeOportunidades < 95
      ) {
        this.rendimientoOportunidades = 'Rendimiento promedio';
      } else if (this.porcentajeOportunidades >= 95) {
        this.rendimientoOportunidades = 'Rendimiento óptimo';
      }
      this.contenidoOportunidades = 'Oportunidades: ' + oportunidades + ' | Meta: ' + metaOportunidades;

      let pedidos = response.pedidos;
      if (!Array.isArray(pedidos)) {
        pedEH = parseFloat(pedidos.monto_eh);
        pedSVA = parseFloat(pedidos.monto_sva);
        pedSCI = parseFloat(pedidos.monto_sci);
        pedSPF = parseFloat(pedidos.monto_spf);
        pedSTM = parseFloat(pedidos.monto_stm);
        pedUEP = parseFloat(pedidos.monto_uep);
      }

      let ventas: number = pedEH + pedSCI + pedSVA + pedSPF + pedSTM + pedUEP;
      let proy_sem: number = 0;
      proy_sem = Array.isArray(response.cotizaciones)
        ? 0
        : response.cotizaciones.proyeccion;

      this.porcentajeAsertividad =
        ventas == 0 || proy_sem == 0
          ? 0
          : Math.round((ventas * 100) / proy_sem);

      if (this.porcentajeAsertividad < 75) {
        this.rendimientoAsertividad = 'Rendimiento bajo';
      } else if (
        this.porcentajeAsertividad > 75 &&
        this.porcentajeAsertividad < 95
      ) {
        this.rendimientoAsertividad = 'Rendimiento promedio';
      } else if (this.porcentajeAsertividad >= 95) {
        this.rendimientoAsertividad = 'Rendimiento óptimo';
      }
      this.contenidoAsertividad = 'Venta: ' + this.formatoMoneda(ventas) + ' | Proyección: ' + this.formatoMoneda(proy_sem);

      let cotizaciones = response.cotizaciones;
      if (!Array.isArray(cotizaciones)) {
        cotEH = parseFloat(cotizaciones.monto_eh);
        cotSVA = parseFloat(cotizaciones.monto_sva);
        cotSCI = parseFloat(cotizaciones.monto_sci);
        cotSPF = parseFloat(cotizaciones.monto_spf);
        cotSTM = parseFloat(cotizaciones.monto_stm);
        cotUEP = parseFloat(cotizaciones.monto_uep);
      }

      this.porcentajeHitrate =
        pedidos.cuenta == 0 ||
          cotizaciones.cuenta == 0 ||
          !pedidos.cuenta ||
          !cotizaciones.cuenta
          ? 0
          : Math.round((pedidos.cuenta * 100) / cotizaciones.cuenta);

      if (this.porcentajeHitrate < 75) {
        this.rendimientoHitrate = 'Rendimiento bajo';
      } else if (this.porcentajeHitrate > 75 && this.porcentajeHitrate < 95) {
        this.rendimientoHitrate = 'Rendimiento promedio';
      } else if (this.porcentajeHitrate >= 95) {
        this.rendimientoHitrate = 'Rendimiento óptimo';
      }
      let cot = cotizaciones.cuenta ? cotizaciones.cuenta : '0';
      let ped = pedidos.cuenta ? pedidos.cuenta : '0';
      this.contenidoHitrate = 'Cotizaciones: ' + cot + ' | Pedidos: ' + ped;

      let metaGeneral: number =
        (metaEH + metaSCI + metaSPF + metaSTM + metaSVA + metaUEP) / 12;
      let montoCotizado: number =
        cotEH + cotSVA + cotSCI + cotSPF + cotSTM + cotUEP;

      this.porcentajeCotizaciones =
        metaGeneral == 0 ? 0 : Math.round((montoCotizado * 100) / metaGeneral);

      if (this.porcentajeCotizaciones < 75) {
        this.rendimientoCotizaciones = 'Rendimiento bajo';
      } else if (
        this.porcentajeCotizaciones > 75 &&
        this.porcentajeCotizaciones < 95
      ) {
        this.rendimientoCotizaciones = 'Rendimiento promedio';
      } else if (this.porcentajeCotizaciones >= 95) {
        this.rendimientoCotizaciones = 'Rendimiento óptimo';
      }
      this.contenidoCotizaciones = 'Cotizado: ' + this.formatoMoneda(montoCotizado) + ' | Meta: ' + this.formatoMoneda(metaGeneral);

      this.porcentajeOrderentry =
        metaGeneral == 0 ? 0 : Math.round((ventas * 100) / (metaGeneral / 4));

      if (this.porcentajeOrderentry < 75) {
        this.rendimientoOrderentry = 'Rendimiento bajo';
      } else if (
        this.porcentajeOrderentry > 75 &&
        this.porcentajeOrderentry < 95
      ) {
        this.rendimientoOrderentry = 'Rendimiento promedio';
      } else if (this.porcentajeOrderentry >= 95) {
        this.rendimientoOrderentry = 'Rendimiento óptimo';
      }
      this.contenidoOrderentry = 'OE: ' + this.formatoMoneda(ventas) + ' | Meta: ' + this.formatoMoneda((metaGeneral / 4));

      let cspEH: number = !isNaN(
        cotEH / montoCotizado / (metaEH / 12 / metaGeneral)
      )
        ? cotEH / montoCotizado / (metaEH / 12 / metaGeneral) >= 1
          ? 1
          : cotEH / montoCotizado / (metaEH / 12 / metaGeneral)
        : 0;
      let cspSVA: number = !isNaN(
        cotSVA / montoCotizado / (metaSVA / 12 / metaGeneral)
      )
        ? cotSVA / montoCotizado / (metaSVA / 12 / metaGeneral) >= 1
          ? 1
          : cotSVA / montoCotizado / (metaSVA / 12 / metaGeneral)
        : 0;
      let cspSCI: number = !isNaN(
        cotSCI / montoCotizado / (metaSCI / 12 / metaGeneral)
      )
        ? cotSCI / montoCotizado / (metaSCI / 12 / metaGeneral) >= 1
          ? 1
          : cotSCI / montoCotizado / (metaSCI / 12 / metaGeneral)
        : 0;
      let cspSPF: number = !isNaN(
        cotSPF / montoCotizado / (metaSPF / 12 / metaGeneral)
      )
        ? cotSPF / montoCotizado / (metaSPF / 12 / metaGeneral) >= 1
          ? 1
          : cotSPF / montoCotizado / (metaSPF / 12 / metaGeneral)
        : 0;
      let cspSTM: number = !isNaN(
        cotSTM / montoCotizado / (metaSTM / 12 / metaGeneral)
      )
        ? cotSTM / montoCotizado / (metaSTM / 12 / metaGeneral) >= 1
          ? 1
          : cotSTM / montoCotizado / (metaSTM / 12 / metaGeneral)
        : 0;
      let cspUEP: number = !isNaN(
        cotUEP / montoCotizado / (metaUEP / 12 / metaGeneral)
      )
        ? cotUEP / montoCotizado / (metaUEP / 12 / metaGeneral) >= 1
          ? 1
          : cotUEP / montoCotizado / (metaUEP / 12 / metaGeneral)
        : 0;

      if (cspEH < 0) cspEH = 0;
      if (cspSVA < 0) cspSVA = 0;
      if (cspSCI < 0) cspSCI = 0;
      if (cspSPF < 0) cspSPF = 0;
      if (cspSTM < 0) cspSTM = 0;
      if (cspUEP < 0) cspUEP = 0;

      if (cspEH > 1) cspEH = 1;
      if (cspSVA > 1) cspSVA = 1;
      if (cspSCI > 1) cspSCI = 1;
      if (cspSPF > 1) cspSPF = 1;
      if (cspSTM > 1) cspSTM = 1;
      if (cspUEP > 1) cspUEP = 1;

      let cspSUM: number = cspEH + cspSVA + cspSCI + cspSPF + cspSTM + cspUEP;
      let csp: number = parseFloat(cspSUM.toFixed(2));
      let metaCs: number = 0;

      if (metas.meta_eh > 0) {
        metaCs++;
      }
      if (metas.meta_sva > 0) {
        metaCs++;
      }
      if (metas.meta_sci > 0) {
        metaCs++;
      }
      if (metas.meta_spf > 0) {
        metaCs++;
      }
      if (metas.meta_stm > 0) {
        metaCs++;
      }
      if (metas.meta_uep > 0) {
        metaCs++;
      }

      this.porcentajeCrossp =
        metaCs == 0 ? 0 : Math.round((csp * 100) / metaCs);

      if (this.porcentajeCrossp < 75) {
        this.rendimientoCrossp = 'Rendimiento bajo';
      } else if (this.porcentajeCrossp > 75 && this.porcentajeCrossp < 95) {
        this.rendimientoCrossp = 'Rendimiento promedio';
      } else if (this.porcentajeCrossp >= 95) {
        this.rendimientoCrossp = 'Rendimiento óptimo';
      }
      this.contenidoCrossp = 'CSP: ' + csp + ' | Meta: ' + metaCs;

      let csvEH: number = !isNaN(
        pedEH / ventas / (metaEH / 12 / 4 / metaGeneral / 4)
      )
        ? pedEH / ventas / (metaEH / 12 / 4 / metaGeneral / 4) >= 1
          ? 1
          : pedEH / ventas / (metaEH / 12 / 4 / metaGeneral / 4)
        : 0;
      let csvSVA: number = !isNaN(
        pedSVA / ventas / (metaSVA / 12 / 4 / metaGeneral / 4)
      )
        ? pedSVA / ventas / (metaSVA / 12 / 4 / metaGeneral / 4) >= 1
          ? 1
          : pedSVA / ventas / (metaSVA / 12 / 4 / metaGeneral / 4)
        : 0;
      let csvSCI: number = !isNaN(
        pedSCI / ventas / (metaSCI / 12 / 4 / metaGeneral / 4)
      )
        ? pedSCI / ventas / (metaSCI / 12 / 4 / metaGeneral / 4) >= 1
          ? 1
          : pedSCI / ventas / (metaSCI / 12 / 4 / metaGeneral / 4)
        : 0;
      let csvSPF: number = !isNaN(
        pedSPF / ventas / (metaSPF / 12 / 4 / metaGeneral / 4)
      )
        ? pedSPF / ventas / (metaSPF / 12 / 4 / metaGeneral / 4) >= 1
          ? 1
          : pedSPF / ventas / (metaSPF / 12 / 4 / metaGeneral / 4)
        : 0;
      let csvSTM: number = !isNaN(
        pedSTM / ventas / (metaSTM / 12 / 4 / metaGeneral / 4)
      )
        ? pedSTM / ventas / (metaSTM / 12 / 4 / metaGeneral / 4) >= 1
          ? 1
          : pedSTM / ventas / (metaSTM / 12 / 4 / metaGeneral / 4)
        : 0;
      let csvUEP: number = !isNaN(
        pedUEP / ventas / (metaUEP / 12 / 4 / metaGeneral / 4)
      )
        ? pedUEP / ventas / (metaUEP / 12 / 4 / metaGeneral / 4) >= 1
          ? 1
          : pedUEP / ventas / (metaUEP / 12 / 4 / metaGeneral / 4)
        : 0;

      if (csvEH < 0) csvEH = 0;
      if (csvSVA < 0) csvSVA = 0;
      if (csvSCI < 0) csvSCI = 0;
      if (csvSPF < 0) csvSPF = 0;
      if (csvSTM < 0) csvSTM = 0;
      if (csvUEP < 0) csvUEP = 0;

      if (csvEH > 1) csvEH = 1;
      if (csvSVA > 1) csvSVA = 1;
      if (csvSCI > 1) csvSCI = 1;
      if (csvSPF > 1) csvSPF = 1;
      if (csvSTM > 1) csvSTM = 1;
      if (csvUEP > 1) csvUEP = 1;

      let csvSUM: number = csvEH + csvSVA + csvSCI + csvSPF + csvSTM + csvUEP;
      let csv: number = parseFloat(csvSUM.toFixed(2));

      this.porcentajeCrossv =
        metaCs == 0 ? 0 : Math.round((csv * 100) / metaCs);

      if (this.porcentajeCrossv < 75) {
        this.rendimientoCrossv = 'Rendimiento bajo';
      } else if (this.porcentajeCrossv > 75 && this.porcentajeCrossv < 95) {
        this.rendimientoCrossv = 'Rendimiento promedio';
      } else if (this.porcentajeCrossv >= 95) {
        this.rendimientoCrossv = 'Rendimiento óptimo';
      }
      this.contenidoCrossv = 'CSV: ' + csv + ' | Meta: ' + metaCs;

      if (data.id_sap) {
        let acomp = response.acompanamientos;
        let metaAcomp = response.metaAcompanamientos;
        if (
          response.acompanamientos != 0 &&
          response.metaAcompanamientos != 0
        ) {
          this.porcentajeAcomp = Math.round(
            (response.acompanamientos * 100) / response.metaAcompanamientos
          );
        } else {
          this.porcentajeAcomp = 0;
        }
        if (this.porcentajeAcomp < 75) {
          this.rendimientoAcomp = 'Rendimiento bajo';
        } else if (this.porcentajeAcomp >= 75 && this.porcentajeAcomp < 95) {
          this.rendimientoAcomp = 'Rendimiento promedio';
        } else if (this.porcentajeAcomp >= 95) {
          this.rendimientoAcomp = 'Rendimiento óptimo';
        }

        this.contenidoAcomp = 'Acompañamientos: ' + acomp + ' | Meta: ' + metaAcomp;
      }

      this.showCards = true;
    }
  }

  formatoMoneda(cantidad: number): string {
    return formatCurrency(cantidad, 'en', '$', 'USD');
  }
}
