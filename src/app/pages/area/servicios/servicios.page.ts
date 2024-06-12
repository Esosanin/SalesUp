import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild, ɵDEFAULT_LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonInfiniteScroll } from '@ionic/angular';
import { Embudo } from 'src/app/model/Servicios/Embudo';
import { ServiciosService } from 'src/app/servicios/servicios/servicios.service';

interface colaboradores{
  id_colaborador: string;
  nombre: string;
  zona: string;
  avg: string;
  metrica: string;
  te: string;
}

interface servicio{
  id_ot: number;
  prjcode: string;
  prjname: string;
  zona: string;
  fechaComp: string; // Fecha de compromiso
  fechaTerm: string; // Fecha de terminación
  fechaCrea: string; // Fecha de creación
  dif: number;
  metrica: string;
}

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss']
})

export class ServiciosPage implements OnInit {

  @ViewChild('ES_ModalDetalles') ES_ModalDetalles: any;
  @ViewChild('IS_ModalDetalles') IS_ModalDetalles: any;
  @ViewChild('ES_ModalUpdate') ES_ModalUpdate: any;
  @ViewChild('searchInput') searchInput: any;
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll!: IonInfiniteScroll;

  segment: string = 'Indicadores de Servicios';
  titleServicios: string = 'Indicadores de Servicios';
  showSearchbar: boolean = false;
  search: string = '';

  limite: number = 20;
  length: number = 0;

  //////////////////////////////////////////////////
  // Indicadores de servicios

  list: string = '';

  IS_fechas: any = {
    fechaI: '',
    fechaI_copy: null,
    fechaF: '',
    fechaF_copy: null
  }

  IS_colab: Array<colaboradores> = [];
  IS_colab_copy: Array<colaboradores> = [];
  IS_servicios1: Array<servicio> = [];
  IS_servicios1_copy: Array<servicio> = [];
  IS_servicios2: Array<servicio> = [];
  IS_servicios2_copy: Array<servicio> = [];

  IS_modalDetalles:boolean = false;
  IS_modalServicio!: servicio;

  IS_btnUsar: boolean = false;
  IS_fab: boolean = false;

  // para los formatos PDF y XLS
  IS_usar: boolean = false;

  //////////////////////////////////////////////////
  // Embudo ventas

  ES_modalDetalles: boolean = false;
  ES_modalUpdate: boolean = false;

  ES_cotizacion: any;
  ES_listEmbudo: Array<Embudo> = [];

  ES_modalEmbudo!: Embudo;
  ES_selectEtapa: Array<any> = [];

  constructor(private service: ServiciosService,
              private router: Router) { }

  ngOnInit() {
    this.segment = ( sessionStorage.getItem('Servicios segment') == 'null' ? sessionStorage.getItem('Servicios segment')! : 'Indicadores de Servicios' );
    sessionStorage.setItem('Servicios segment', this.segment);

    this.onChangeSegment();
    this.Embudo_getSelectBitrix();
  }

  focus() {
    setTimeout(() => {
      this.searchInput.setFocus();
      this.limite = 20;
    }, 500);
  }

  addItems(event: any) {
    event.target.complete();
    this.limite+= 20;
  }

  onChangeSegment(){
    this.limite = 20;
    switch(this.segment){
      case 'Indicadores de Servicios':
        this.IS_fechaslterReportes();
        break;
      case 'Embudo de Ventas':
        this.Embudo_getEmbudo();
        break;
      case 'Indicadores SVA':
        break;
    }
    this.titleServicios = this.segment;
  }

  createPDF(){
    switch(this.segment){
      case 'Indicadores de Servicios':
        this.service.createPDF({
          url: window.location.host,
          Fi: this.IS_fechas.fechaI_copy,
          Ff: this.IS_fechas.fechaF_copy,
          tipo: this.list == 'Colaboradores' ? 0 : ( this.list == 'Servicios 1' ? 1 : ( this.list == 'Servicios 2' ? 2 : -1 ) ),
          search: this.search
        }).subscribe(
          r =>{
            let url = window.URL.createObjectURL(r as any);
            window.open(url);
          },
          e => {
            this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
            console.log(e);
          }
        );
        break;
    }
  }

  createXLS(){
    switch(this.segment){
      case 'Indicadores de Servicios':
        var data = {
          url: window.location.host,
          Fi: this.IS_fechas.fechaI_copy,
          Ff: this.IS_fechas.fechaF_copy,
          tipo: this.list == 'Colaboradores' ? 0 : ( this.list == 'Servicios 1' ? 1 : ( this.list == 'Servicios 2' ? 2 : -1 ) ),
          search: this.search
        };
        this.service.createXLS(data).subscribe(
          r => {
            let link = document.createElement('a');
            link.download = this.list+".xlsx";
            link.href = URL.createObjectURL(r);
            link.click();
            URL.revokeObjectURL(link.href);
          },
          e => {
            this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
            console.log(e);
          }
        );

        break;
      case 'Embudo de Ventas':
        if(this.ES_listEmbudo.length > 0){
          this.service.createXLS({
            url: window.location.host,
            Fi: '' as any,
            Ff: '' as any,
            tipo: 3,
            search: this.search
          }).subscribe(
            r =>{
              let link = document.createElement('a');
              link.download = "Embudo de Ventas.xlsx";
              link.href = URL.createObjectURL(r);
              link.click();
              URL.revokeObjectURL(link.href);
            },
            e => {
              this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
              console.log(e);
            }
          );
        }
        break;
    }
  }

  //////////////////////////////////////////////////
  // Reporte de servicios

  onChangeList(list: string){
    this.list = list;
    this.content.scrollToTop();
    this.limite = 20;

    switch(list){
      case 'Colaboradores':
        this.length = this.IS_colab.length;
        break;
      case 'Servidores 1':
        this.length = this.IS_servicios1.length;
        break;
      case 'Servidores 2':
        this.length = this.IS_servicios2.length;
        break;
    }
  }

  // CONEXIÓN A SAP SERVER
  async Reporteservicio_consulta(){
    if(this.IS_fechas.fechaI){
      if(this.IS_fechas.fechaF){
        this.IS_fab = true;

        this.IS_fechas.fechaI_copy = this.IS_fechas.fechaI;
        this.IS_fechas.fechaF_copy = this.IS_fechas.fechaF;

        this.service.Reporteservicio_consulta({FI: this.IS_fechas.fechaI, FF: this.IS_fechas.fechaF}).subscribe(
          (r:any) => {

            this.IS_colab = new Array<colaboradores>();
            this.IS_servicios1 = new Array<servicio>();
            this.IS_servicios2 = new Array<servicio>();

            r[0].forEach((data:any) => {
              var colab: colaboradores = {
                id_colaborador: data.id_colaborador,
                nombre: data.nombre ? data.nombre : '',
                zona: data.zona ? data.zona : '',
                metrica: data.metrica ? data.metrica : '0.000',
                te: data.te ? data.te : '0.000',
                avg: data.avg ? data.avg : '0.000'
              };

              this.IS_colab.push(colab);
            });
            this.IS_colab_copy = Object.assign(this.IS_colab);

            r[1].forEach((data:any) => {
              var servicio: servicio = {
                id_ot: data.id_ot,
                prjcode: data.PrjCode ? data.PrjCode : '',
                prjname: data.PRJNAME ? data.PRJNAME : '',
                zona: data.zona ? data.zona : '',
                fechaComp: data.fecha_compromiso ? data.fecha_compromiso : '',
                fechaTerm: data.fecha_terminacion ? data.fecha_terminacion : '',
                fechaCrea: data.create_date ? data.create_date : '',
                dif: data.DIF ? data.DIF : 0,
                metrica: data.metrica ? data.metrica : ''
              };

              this.IS_servicios1.push(servicio);
            });
            this.IS_servicios1_copy = Object.assign(this.IS_servicios1);

            r[2].forEach((data:any) => {
              var servicio: servicio = {
                id_ot: 0,
                prjcode: data.PrjCode ? data.PrjCode : '',
                prjname: data.PRJNAME ? data.PRJNAME : '',
                zona: data.zona ? data.zona : '',
                fechaComp: '',
                fechaTerm: '',
                fechaCrea: '',
                dif: 0,
                metrica: data.AVG ? data.AVG : '0.000'
              };

              this.IS_servicios2.push(servicio);
            });
            this.IS_servicios2_copy = Object.assign(this.IS_servicios2);

            this.onChangeList(this.list ? this.list : 'Colaboradores');

            if((this.IS_colab.length > 0 || this.IS_servicios1.length > 0 || this.IS_servicios2.length > 0) &&
               (this.IS_fechas.fechaI == this.IS_fechas.fechaI_copy && this.IS_fechas.fechaF == this.IS_fechas.fechaF_copy))
              this.IS_usar = true;
            else
              this.IS_usar = false;
          },
          e => {
            this.IS_usar = false;

            console.log(e);
            this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
          }
        );
      }else
        this.service.createAlert('Indica la fecha final', 'warning');
    }else
      this.service.createAlert('Indica la fecha inicial', 'warning');
  }

  IS_createModal(index: number){
    this.IS_ModalDetalles.onDidDismiss().then(() => this.IS_modalDetalles = false);
    this.IS_modalDetalles = true;
    this.IS_modalServicio = this.IS_servicios1[index];
  }

  IS_fechaslterReportes(){
    if(this.IS_colab_copy.length > 0)
      this.IS_colab = this.IS_colab_copy.filter(val =>
        (val.nombre.toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase())) >= 0 ||
        (val.zona.toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase())) >= 0 ||
        (val.avg.toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase())) >= 0 ||
        (val.metrica.toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase())) >= 0 ||
        (val.te.toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase())) >= 0
      );

    if(this.IS_servicios1_copy.length > 0)
      this.IS_servicios1 = this.IS_servicios1_copy.filter(val =>
        (val.prjcode.toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase())) >= 0 ||
        (val.prjname.toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase())) >= 0 ||
        (val.zona.toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase())) >= 0 ||
        (val.dif.toString().toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase())) >= 0 ||
        (val.fechaComp.toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase())) >= 0 ||
        (val.fechaTerm.toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase())) >= 0 ||
        (val.fechaCrea.toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase())) >= 0 ||
        (val.metrica.toString().toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase())) >= 0
      );

    if(this.IS_servicios2_copy.length > 0)
      this.IS_servicios2 = this.IS_servicios2_copy.filter(val =>
        (val.prjcode.toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase())) >= 0 ||
        (val.prjname.toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase())) >= 0 ||
        (val.zona.toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase())) >= 0 ||
        (val.metrica.toString().toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase())) >= 0
      );

    if((this.IS_colab.length > 0 || this.IS_servicios1.length > 0 || this.IS_servicios2.length > 0) &&
       (this.IS_fechas.fechaI == this.IS_fechas.fechaI_copy && this.IS_fechas.fechaF == this.IS_fechas.fechaF_copy))
      this.IS_usar = true;
    else
      this.IS_usar = false;
  }

  //////////////////////////////////////////////////
  // Embudo ventas

  async Embudo_getEmbudo(){
    this.service.Embudo_getEmbudo({user: localStorage.getItem('id_colaborador'), id_sap: localStorage.getItem('id_vendedorSap'), search: this.search}).subscribe(
      r => {
        this.ES_listEmbudo = [];
        this.ES_listEmbudo = r as any;

        if(this.ES_listEmbudo.length > 0)
          this.IS_usar = true;
        else
          this.IS_usar = false;
      },
      e => {
        this.IS_usar = false;

        console.log(e);
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
      }
    );
  }

  // CONEXIÓN A SAP SERVER
  async Embudo_getSelectBitrix(){
    this.service.Embudo_getSelectBitrix().subscribe(
      r => {
        this.ES_selectEtapa = [];
        this.ES_selectEtapa = r as any;
      },
      e => {
        console.log(e);
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
      }
    );
  }

  ES_createModal(type:number, index: number){
    switch(type){
      case 0: // Detalles de cotización
        this.ES_ModalDetalles.onDidDismiss().then(() => this.ES_modalDetalles = false);
        this.ES_modalDetalles = true;
        this.ES_cotizacion = new Embudo();
        this.ES_cotizacion = this.ES_listEmbudo[index];
        break;
      case 1: // Editar cotización
        this.ES_ModalUpdate.onDidDismiss().then(() => this.ES_modalUpdate = false);
        this.ES_modalUpdate = true;

        this.ES_cotizacion = new Embudo();
        this.ES_modalEmbudo = new Embudo();
        this.ES_modalEmbudo = this.ES_listEmbudo[index];
        this.ES_cotizacion = Object.assign({}, this.ES_modalEmbudo);

        this.ES_modalEmbudo.U_FECHACIERRE = isNaN(Date.parse(this.ES_modalEmbudo.U_FECHACIERRE)) ? '' : this.ES_modalEmbudo.U_FECHACIERRE;
        this.ES_cotizacion.U_FECHACIERRE = this.ES_modalEmbudo.U_FECHACIERRE;

        this.ES_modalEmbudo.fecha_actual = formatDate(Date.now(), 'yyyy-MM-dd', ɵDEFAULT_LOCALE_ID);
        this.ES_cotizacion.fecha_actual = formatDate(Date.now(), 'yyyy-MM-dd', ɵDEFAULT_LOCALE_ID);

        var etapa = this.ES_selectEtapa.find(x => x.CODE == this.ES_modalEmbudo.etapacodigo);
        this.ES_modalEmbudo.U_BitrixID = etapa.U_BitrixID;
        this.ES_cotizacion.U_BitrixID = etapa.U_BitrixID;

        break;
    }
  }

  ES_isDisabledGuardar(){ // Si ambos son iguales, el btn esta deshabilitado
    return JSON.stringify(this.ES_modalEmbudo) === JSON.stringify(this.ES_cotizacion);
  }

  ES_changePorcCierre(){
    var obj = this.ES_modalEmbudo.etapacodigo.toString();
    var flag = true;
    switch(this.ES_modalEmbudo.porc_cierre){
      case 0:
        if(obj == 'O' || obj == 'Z' || obj == '30') flag = false;
        break;
      case 10:
        if(obj == '60') flag = false;
        break;
      case 30:
      case 50:
      case 80:
      case 100:
        if(obj === '70') flag = false;
        break;
    }

    if(flag) this.service.createAlert('Favor de seleccionar la etapa correcta');

    return flag;
  }

  Embudo_changeEtapa(){
    var etapa = this.ES_selectEtapa.find(x => x.CODE == this.ES_modalEmbudo.etapacodigo);
    this.ES_modalEmbudo.Etapa = etapa.NAME;
    this.ES_modalEmbudo.U_BitrixID = etapa.U_BitrixID;

    switch(etapa.CODE){
      case '60':
        this.ES_modalEmbudo.porc_cierre = 10;
        break;
      case '70':
        this.ES_modalEmbudo.porc_cierre = 30;
        break;
      case '30':
      case 'O':
      case 'Z':
        this.ES_modalEmbudo.porc_cierre = 0;
        break;
    }
  }

  async Embudo_updateCotizacion(){
    if(!this.ES_changePorcCierre()){
      var data = {
        user: localStorage.getItem('id_colaborador'),
        doc: this.ES_modalEmbudo.DocEntry,
        porc_cierre: this.ES_modalEmbudo.porc_cierre,
        fecha_cierre: this.ES_modalEmbudo.U_FECHACIERRE,
        comments: this.ES_modalEmbudo.comments,
        edo: this.ES_modalEmbudo.etapacodigo
      };
      this.service.Embudo_updateQuotation(data).subscribe(
        (r:any) => {
          var valid = r[0]; // Identificar si es: Error, Exito, o fallo en fecha de cierre.
          var part = r[1]; // Identificar la ubicación del error.
          switch(valid){
            case 0: // ERRORES
              switch(part){
                case -1: // El id del usaurio se a borrado o no se guardo en: localStore.getItem('id_colaborador')
                  this.service.createAlert('Error. Vuelva a iniciar sesión.', 'warning');
                  break;
                case 1:   // No se actualizo la cotización en SAP                   | pt.1
                case 2:   // No se cerro la cotización en SAP
                case 4:   // No se agregaron los datos a las cotizaciones cerradas
                case 5:   // No se elimino la cotización
                case 6:   // No se actualizo la cotización en SAP                   | pt.2
                case 8:   // No se actualizaron las cotizaciones
                case 9:   // No se actualizo la cotización
                case 10:  // No se pudo obtener información de la cotización
                case 11:  // No se pudo conectar al SoapClient (wsdl)
                  this.service.createAlert('Ocurrio un error,favor de comunicarse con TI.', 'warning');
                  break;
              }
              break;
            case 1: // EXITOS
              switch(part){
                // Etapa: Z, R, A, O.
                // Si la cotización no esta en Cotizaciones cerradas.
                // Se actualiza en SAP.
                // Es eliminada de Cotizaciones.
                // Es agregada a Cotizaciones cerradas.
                case 3:
                // Etapa diferente de: Z, R, A, O.
                // Si el estado es diferente al codigo de estado en cotizaciones abiertas o no existe la cotización, se agrega.
                // Se actualiza en SAP.
                // Se actualiza las cotizaciones relacionadas con el numero de documento "DocNum".
                case 7:
                  this.service.createAlert('Modificado correctamente.', 'success');
                  break;
              }
              break;
            case 2: // La fecha de cierre debe ser mayor a la fecha de contabilización
              switch(part){
                case 0:
                  this.service.createAlert('La fecha de cierre debe ser mayor a la fecha de contabilizacion.', 'warning');
                  break;
              }
              break;
          }
          this.onChangeSegment();
        },
        e => {
          this.onChangeSegment();

          console.log(e);
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        }
      );
    }
  }

  ES_verCotizacion(value: number){
    sessionStorage.setItem('ES_servicio', value.toString());
    this.router.navigate(['tabs/area/servicios/ver-detalles']);
  }
}

type PaneType = 'left' | 'center' | 'right';
