import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

// MODELOS
import { VH } from 'src/app/model/ServiciosReservaciones/VH';
import { ExtraCompra } from 'src/app/model/ServiciosReservaciones/ExtraCompra';
import { AllModalData } from 'src/app/model/ServiciosReservaciones/AllModalData';

// SERVICIO
import { FinanzasService } from 'src/app/servicios/finanzas/finanzas.service';
import { AllModalBool } from 'src/app/model/ServiciosReservaciones/AllModalBool';
import { DivAcciones } from 'src/app/model/ServiciosReservaciones/DivAcciones';

interface historial {
  tipo: number;
  fecha: string;
  nombre_creador: string;
  align: boolean;
  comentario: string;
  estado: number;
}

interface reagendarVuelo {
  Vid: number;
  Vjustif: string;
  Vinternacional: string;
  Vtipo: string;
  Vorigen: string;
  Vdestino: string;
  Vinicio_entrada_pais: string;
  Vfin_salida_pais: string;
  Vinicio: string;
  Vfin: string;
}

interface reagendarHospedaje {
  Hid: number;
  Hjustif: string;
  Hinternacional: string;
  Htipo: string;
  Hinicio_entrada_pais: string;
  Hfin_salida_pais: string;
  Hciudad: string;
}

interface v_escala {
  info: {
    f_salida: string;
    f_salida_n: string;
    h_salida: string;
    origen: string;
    f_llegada: string;
    f_llegada_n: string;
    h_llegada: string;
    destino: string;
  };

  detalles: Array<any>;
}

@Component({
  selector: 'app-servicios-reservaciones',
  templateUrl: './servicios-reservaciones.page.html',
  styleUrls: ['./servicios-reservaciones.page.scss'],
})
export class ServiciosReservacionesPage implements OnInit {

  @ViewChild('SR_Modal_encuesta') SR_Modal_encuesta: any;

  @ViewChild('vuelo_file') SR_vuelo_file: any;

  @ViewChild('SR_Modal_cotVuelos') SR_Modal_cotVuelos: any;
  @ViewChild('SR_Modal_escalaVuelos') SR_Modal_escalaVuelos: any;
  @ViewChild('SR_ModalDetalles') SR_ModalDetalles: any;
  @ViewChild('SR_Modal_recotizar') SR_Modal_recotizar: any;
  @ViewChild('SR_Modal_cancelarServicio') SR_Modal_cancelarServicio: any;
  @ViewChild('SR_Modal_editarServicio') SR_Modal_editarServicio: any;
  @ViewChild('SR_Modal_reagendar') SR_Modal_reagendar: any;

  // Cotizaciones: Vuelos | Hospedajes
  // Principal uso de estas variables, resetear formulario.
  @ViewChild('cotizacion_vuelosForm') cotizacion_vuelosForm: any;
  @ViewChild('cotizacion_hospedajeForm') cotizacion_hospedajeForm: any;
  @ViewChild('cotizacion_autoForm') cotizacion_autoForm: any;

  @ViewChild('SR_Modal_1001') SR_Modal_1001: any;
  @ViewChild('SR_Modal_1002') SR_Modal_1002: any;

  @ViewChild('SR_Modal_201') SR_Modal_201: any;
  @ViewChild('SR_Modal_202') SR_Modal_202: any;
  @ViewChild('SR_Modal_203') SR_Modal_203: any;
  @ViewChild('SR_Modal_204') SR_Modal_204: any;
  @ViewChild('SR_Modal_205') SR_Modal_205: any;
  @ViewChild('SR_Modal_206') SR_Modal_206: any;
  @ViewChild('SR_Modal_208') SR_Modal_208: any;
  @ViewChild('SR_Modal_209') SR_Modal_209: any;

  colaborador_id!: number;

  segment: number = 1;
  segment_errores: number = 1;
  btn_changeSegment: boolean = false;

  btn_cancelAction: boolean = false;

  SR_solicitudID: any;
  SR_radio: any = {
    vuelo: 0,
    hosp: 0,
    auto: 0
  };
  SR_historialOption: number = 1;

  SR_extraCompra_info: ExtraCompra = new ExtraCompra();
  SR_solicitud: VH = new VH();
  // Información de los modales
  SR_modalData: AllModalData = new AllModalData();
  // Abre los modales
  SR_modalBool: AllModalBool = new AllModalBool();
  SR_divAcciones: DivAcciones = new DivAcciones();

  SR_historial: Array<historial> = [];
  SR_historial_copy: Array<historial> = [];
  SR_reagendarVuelo!: reagendarVuelo;
  SR_reagendarHosp!: reagendarHospedaje;

  SR_modalDetalles: boolean = false;
  SR_modalDetalles_data: any;

  // Agregar cotización de vuelos
  SR_cotVuelos: any = {
    v_ciudadSalida: '',
    v_fSalida: '',
    v_hSalida: '',
    v_venida: null,
    v_ciudadLlegada: '',
    v_fLlegada: '',
    v_hLlegada: '',
    v_precio: null,
    v_moneda: '',
    v_aerolinea: '',
    v_escalas: null,
    v_comentario: ''
  };
  // Agregar cotización de hospedaje
  SR_cotHospedaje: any = {
    h_name: '',
    h_tipo: '',
    h_entrada: '',
    h_salida: '',
    h_precio: null,
    h_moneda: '',
    h_ciudad: '',
    h_comentario: ''
  };
  SR_cotAuto: any = {
    a_arrendadora: '',
    a_recepcion: '',
    a_entrega: '',
    a_precio: null,
    a_moneda: '',
    a_comentario: ''
  };

  // Estructura de selects
  SR_estructuras: any = {
    selectLugar: [],
    selectAerolinea: [],
    selectSolicitantes: [],

    radio_encuesta: 0
  };
  // Variable para los tipo de información en Compras
  SR_agregarInformacion_compras: number = 0;


  // VUELOS
  SR_listEscalas: v_escala = {
    info: {
      f_salida: '',
      f_salida_n: '',
      h_salida: '',
      origen: '',
      f_llegada: '',
      f_llegada_n: '',
      h_llegada: '',
      destino: '',
    },
    detalles: []
  };

  SR_compras: any = {
    total: '',
    arcAdjuntos: [],
    cargosExtras: [],
    comentarios: [],
    precioCompra: [],
    viaticos: [],
    viaticos_ingo: 0,
    asesor: []
  };

  constructor(private service: FinanzasService,
              private router: Router,
              private toast: ToastController) {
  }

  ngOnInit() {
    if(sessionStorage.getItem('VH solicitud') && parseInt(sessionStorage.getItem('VH solicitud')!) >= 0){
      this.SR_solicitudID = sessionStorage.getItem('VH solicitud');
      this.colaborador_id = parseInt(localStorage.getItem('id_colaborador')!);
      this.inicializarVariables();
    }else{
      this.service.createAlert('Error, vuelva a intentarlo', 'danger');
      this.router.navigate([this.router.url + '/servicios-reservaciones']);
    }
  }

  // Inicialización de las variables
  inicializarVariables(){
    this.btn_cancelAction = false;
    this.SR_agregarInformacion_compras = 0;

    this.SR_historial = [];
    this.SR_reagendarVuelo = {
      Vdestino: '',
      Vfin: '',
      Vfin_salida_pais: '',
      Vid: 0,
      Vinicio: '',
      Vinicio_entrada_pais: '',
      Vinternacional: '',
      Vjustif: '',
      Vorigen: '',
      Vtipo: ''
    };
    this.SR_reagendarHosp = {
      Hid: 0,
      Hjustif: '',
      Hinternacional: '',
      Htipo: '',
      Hinicio_entrada_pais: '',
      Hfin_salida_pais: '',
      Hciudad: ''
    };

    this.SR_cotVuelos = {
      v_ciudadSalida: '',
      v_fSalida: '',
      v_hSalida: '',
      v_venida: null,
      v_ciudadLlegada: '',
      v_fLlegada: '',
      v_hLlegada: '',
      v_precio: null,
      v_moneda: '',
      v_aerolinea: '',
      v_escalas: null,
      v_comentario: ''
    };
    this.SR_cotHospedaje = {
      h_name: '',
      h_tipo: '',
      h_entrada: '',
      h_salida: '',
      h_precio: null,
      h_moneda: '',
      h_ciudad: '',
      h_comentario: ''
    };
    this.SR_cotAuto = {
      a_arrendadora: '',
      a_recepcion: '',
      a_entrega: '',
      a_precio: null,
      a_moneda: '',
      a_comentario: ''
    };

    this.SR_radio = {
      vuelo: 0,
      hosp: 0,
      auto: 0
    };

    this.SR_modalDetalles = false;
    this.SR_modalDetalles_data = null;

    this.SR_listEscalas = {
      info: {
        f_salida: '',
        f_salida_n: '',
        h_salida: '',
        origen: '',
        f_llegada: '',
        f_llegada_n: '',
        h_llegada: '',
        destino: '',
      },
      detalles: []
    };

    this.SR_compras = {
      flag: 0,
      total: '',
      arcAdjuntos: [],
      cargosExtras: [],
      comentarios: [],
      precioCompra: [],
      viaticos: [],
      viaticos_ingo: 0,
      asesor: []
    };

    this.SR_solicitud = new VH();
    this.SR_extraCompra_info = new ExtraCompra();
    this.SR_modalData = new AllModalData();
    this.SR_modalBool = new AllModalBool();
    this.SR_divAcciones = new DivAcciones();


    this.SR_getServiciosReservaciones();
  }

  // SELECT, TABLES, etc
  async SR_recargarEstructuras(tipo: number, data: any){
    this.service.SR_modalsEstructura({sol_id: this.SR_solicitudID, tipo: tipo, data: data}).subscribe(
      r => {
        switch(tipo){
          case 1:
            this.SR_estructuras.selectLugar = r;
            break;
          case 2:
            this.SR_estructuras.selectAerolinea = r;
            break;
          case 3:
            this.SR_estructuras.selectSolicitantes = r;
            break;
        }
      },
      e => {
        this.service.createAlert('Error al recoger la información. Intente de nuevo.', 'danger');
      }
    );
  }

  // Cambio de segmentos: Vuelos, Hospedaje
  onChangeSegment(value: number){
    this.segment = value;

    switch(value){
      case 4:
      case 5:
      case 6:
        this.segment_errores = 1;
        this.SR_change_accionesVisibles(value);
        break;
    }


    this.SR_agregarInformacion_compras = 0; // Se reinicia la selección de agregar información a compras
  }

  // Obteniendo la información de servicios - reservaciones
  // Aplicando filtros
  async SR_getServiciosReservaciones(){
    this.service.VH_getServiciosReservaciones({
      sol_id: this.SR_solicitudID,
      user: this.colaborador_id,
      user_n: localStorage.getItem('n_colaborador')
    }).subscribe(
      (r:any) => {
        this.SR_solicitud = r[0] as VH;
        this.SR_historial = r[1] as Array<historial>;
        this.SR_reagendarVuelo = r[2] as reagendarVuelo;

        this.SR_historial.forEach(x => {
          this.SR_solicitud.solicitante.camn_nom = x.comentario;
        });

        this.SR_historial_copy = Object.assign(this.SR_historial);

        this.SR_accionesVisibles();
      },
      e => {
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        console.log(e);
      }
    );
  }

  // Realizara condicionales para cada tipo de acciones
  SR_accionesVisibles(){

    var edo = this.SR_solicitud.solicitante.edo;
    var id_colaborador = this.SR_solicitud.solicitante.id_colaborador;

    if( ( edo === 1 ) &&
        ( this.colaborador_id === id_colaborador || this.colaborador_id === 1050 ) )
      this.SR_divAcciones.opt1 = true;

    if( ( edo === 2 ) &&
        ( this.SR_solicitud.solicitante.lider_id === this.colaborador_id ) )
      this.SR_divAcciones.opt2 = true;

    if( ( edo === 3 || edo === 7 || edo === 20 ) &&
        ( this.colaborador_id === id_colaborador ) )
      this.SR_divAcciones.opt3 = true;

    if( ( edo === 5 || edo === 18 ) &&
        ( this.colaborador_id === this.SR_solicitud.solicitante.contralor_id ) )
      this.SR_divAcciones.opt4 = true;

    if( ( edo === 10 || edo === 11 ) &&
        ( this.colaborador_id === 1050 ) )
      this.SR_divAcciones.opt5 = true;

    if( ( edo === 4 || edo === 6 || edo === 9 || edo === 16 ) &&
        ( this.colaborador_id === 1050 ) )
      this.SR_divAcciones.opt6 = true;

    if( ( this.SR_divAcciones.opt1 || this.SR_divAcciones.opt2 ||
          this.SR_divAcciones.opt3 || this.SR_divAcciones.opt4 ||
          this.SR_divAcciones.opt5 || this.SR_divAcciones.opt6 ) )
      this.SR_divAcciones.vistaDiv = true;

    if(this.SR_solicitud.solicitante.estado_solicnv)
      if(this.SR_solicitud.solicitante.estado_solicnv !== '')
        this.SR_divAcciones.solicnv = true;

    if(this.SR_solicitud.solicitante.estado_reagendarvuelo)
      if(this.SR_solicitud.solicitante.estado_reagendarvuelo !== '')
        if(this.SR_solicitud.solicitante.lider_id === this.colaborador_id ||
           this.SR_solicitud.solicitante.contralor_id === this.colaborador_id)
          this.SR_divAcciones.vueloAcciones = true;

    if(this.SR_solicitud.solicitante.estado_reagendarhosp)
      if(this.SR_solicitud.solicitante.estado_reagendarhosp !== '')
        if(this.SR_solicitud.solicitante.lider_id === this.colaborador_id ||
           this.SR_solicitud.solicitante.contralor_id === this.colaborador_id)
          this.SR_divAcciones.hospAcciones = true;

    if( this.SR_divAcciones.vistaDiv || this.SR_divAcciones.solicnv ||
        this.SR_divAcciones.vueloAcciones || this.SR_divAcciones.hospAcciones )
      this.SR_divAcciones.vistaFab = true;

    //////////////////////////////////////

    if(edo === 11)
      if(this.colaborador_id === this.SR_solicitud.solicitante.id_colaborador)
        if(this.SR_solicitud.encuesta === 0)
          this.SR_createModal(10, null);

  }

  // Esto sirve para cuando se cambie de Vuelos | Hospedaje | Autos
  // Son los permisos respectivos de cada sección ya mencionados.
  SR_change_accionesVisibles(tipo: number){
    var edo = this.SR_solicitud.solicitante.edo;
    var id_colaborador = this.SR_solicitud.solicitante.id_colaborador;

    switch(tipo){
      case 4: // Vuelos
        var estado_v = this.SR_solicitud.vuelos.estado_v;
        var opt = 0;

        if(this.SR_solicitud.vuelos.v_cuenta >= 1){
          if( ( edo === 1 || edo === 3 || edo === 7 ) &&
              ( this.colaborador_id === id_colaborador || this.colaborador_id === 1050 ) &&
              ( estado_v !== 14 ) )
            opt = 1;

          if( ( edo === 8 ) &&
              ( this.SR_solicitud.solicitante.lider_id === this.colaborador_id ) &&
              ( estado_v !== 14 ) )
            opt = 2;

          if( ( this.colaborador_id === 1050 ) &&
              ( edo === 8 || edo === 9 || edo === 10 || edo === 11 || edo === 16) &&
              ( estado_v !== 14 ) )
            opt = 3;

          if( ( this.colaborador_id === id_colaborador || this.colaborador_id === this.SR_solicitud.solicitante.lider_id ) &&
              ( edo === 4 || edo === 6 || edo === 8 || edo === 9 || edo === 10 || edo === 11 || edo === 16 ) &&
              ( estado_v !== 14 && estado_v !== 17) )
            opt = 4;
        }

        switch(opt){
          case 1:
            this.SR_divAcciones.vuelo.opt1 = true;
            break;
          case 2:
            this.SR_divAcciones.vuelo.opt2 = true;
            break;
          case 3:
            this.SR_divAcciones.vuelo.opt3 = true;
            break;
          case 4:
            this.SR_divAcciones.vuelo.opt4 = true;
            break;
        }
        break;
      case 5: // Hospedajes
        var estado_h = this.SR_solicitud.hospedaje.estado_h;
        var opt = 0;

        if(this.SR_solicitud.hospedaje.h_cuenta >= 1){
          if( ( edo === 1 || edo === 3 || edo === 7 ) &&
              ( this.colaborador_id === id_colaborador || this.colaborador_id === 1050 ) &&
              ( estado_h !== 14 ) )
            opt = 1;

          if( ( this.colaborador_id === 1050 ) &&
              ( edo === 8 || edo === 9 || edo === 10 || edo === 11 || edo === 16) &&
              ( estado_h !== 14 ) )
            opt = 2;

          if( ( this.colaborador_id === id_colaborador || this.colaborador_id === this.SR_solicitud.solicitante.lider_id ) &&
              ( edo === 4 || edo === 6 || edo === 8 || edo === 9 || edo === 10 || edo === 11 || edo === 16 ) &&
              ( estado_h !== 14 && estado_h !== 17) )
            opt = 3;
        }

        switch(opt){
          case 1:
            this.SR_divAcciones.hosp.opt1 = true;
            break;
          case 2:
            this.SR_divAcciones.hosp.opt2 = true;
            break;
          case 3:
            this.SR_divAcciones.hosp.opt3 = true;
            break;
        }
        break;
      case 6: // Autos
        var estado_a = this.SR_solicitud.auto.estado_a;
        var opt = 0;

        if(this.SR_solicitud.auto.a_cuenta >= 1){
          if( ( edo === 1 || edo === 3 || edo === 7 ) &&
              ( this.colaborador_id === id_colaborador || this.colaborador_id === 1050 ) &&
              ( estado_a !== 14 ) )
            opt = 1;

          if( ( this.colaborador_id === 1050 ) &&
              ( edo === 8 || edo === 9 || edo === 10 || edo === 11 || edo === 16) &&
              ( estado_a !== 14 ) )
            opt = 2;

          if( ( this.colaborador_id === id_colaborador ) &&
              ( edo === 4 || edo === 6 || edo === 8 || edo === 9 || edo === 10 || edo === 11 || edo === 16 ) &&
              ( estado_a !== 14 ) )
            opt = 3;
        }

        switch(opt){
          case 1:
            this.SR_divAcciones.auto.opt1 = true;
            break;
          case 2:
            this.SR_divAcciones.auto.opt2 = true;
            break;
          case 3:
            this.SR_divAcciones.auto.opt3 = true;
            break;
        }
        break;
    }
  }

  // Agregar un servicio: Vuelos | Hospedaje | Renta de auto
  async SR_modal_agregarServicio(){

    this.SR_Modal_202.onDidDismiss().then(() => this.SR_modalBool.m_202 = false);
    this.SR_modalBool.m_202 = true;

  }

  // Compras/Gastos: Vuelos | Hospedajes
  async SR_borrarInfoCompra(info: any){
    this.btn_cancelAction = true;

    var data: any = {};
    switch(info.tipo){
      case 1: // ARCHIVOS ADJUNTOS
        data = {
          id_cabecera: this.SR_solicitudID,
          id_compra: this.SR_compras.arcAdjuntos[info.i].id
        };
        break;
      case 2: // GASTOS|CARGOS EXTRAS
        data = {
          id_cabecera: this.SR_solicitudID,
          id_compra: this.SR_compras.cargosExtras[info.i].id
        };
        break;
      case 3: // COMENTARIOS
        data = {
          id_cabecera: this.SR_solicitudID,
          id_compra: this.SR_compras.comentarios[info.i].id
        };
        break;
      case 4: // PRECIO COMPRA
        data = {
          id_cabecera: this.SR_solicitudID,
          id_compra: this.SR_compras.precioCompra[info.i].id
        };
        break;
      case 5: // INFO ASESOR
        data = {
          id_cabecera: this.SR_solicitudID,
          id_compra: this.SR_compras.asesor[info.i].id
        };
        break;
      default:
        data = {
          id_cabecera: 0,
          id_compra: 0
        };
        break;
    }
    this.service.SR_borrarInfoCompra(data).subscribe(
      r => {
        if(r === 1){
          this.service.createAlert('Se ha eliminado con exito.', 'success');
          this.SR_verCompras(info.tipo_solicitud);

          this.SR_extraCompra_info = new ExtraCompra();
        }else{
          switch(info.tipo){
            case 1: // ARCHIVOS ADJUNTOS
              this.service.createAlert('Error al eliminar el archivos adjuntos. Intente de nuevo.', 'danger');
              break;
            case 2: // GASTOS|CARGOS EXTRAS
              this.service.createAlert('Error al eliminar el gasto extra. Intente de nuevo.', 'danger');
              break;
            case 3: // COMENTARIOS
              this.service.createAlert('Error al eliminar el comentario. Intente de nuevo.', 'danger');
              break;
            case 4: // PRECIO COMPRA
              this.service.createAlert('Error al eliminar el precio compra. Intente de nuevo.', 'danger');
              break;
            case 5: // INFO ASESOR
              this.service.createAlert('Error al eliminar el tarifa publica y compras. Intente de nuevo.', 'danger');
              break;
            default:
              this.service.createAlert('Error al eliminar la información. Intente de nuevo.', 'danger');
              break;
          }
        }
      },
      e => {
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        console.log(e);
      },
      () => {
        this.btn_cancelAction = false;
      }
    );
  }

  async SR_verCompras(tipo_solicitud: number){
    this.SR_recargarEstructuras(2, {tipo_sol: tipo_solicitud});

    this.service.SR_verCompras({
      'id_cabecera': this.SR_solicitudID,
      'tipo_solicitud': tipo_solicitud
    }).subscribe(
      r => {
        var result = r as any;
        if(result.flag === 1){
          this.SR_compras.total = result.list.total;
          this.SR_compras.arcAdjuntos = result.list.arcAdjuntos;
          this.SR_compras.cargosExtras = result.list.cargosExtras;
          this.SR_compras.comentarios = result.list.comentarios;
          this.SR_compras.precioCompra = result.list.precioCompra;
          this.SR_compras.viaticos = result.list.viaticos;
          this.SR_compras.viaticos_ingo = result.list.viaticos_ingo;
          this.SR_compras.asesor = result.list.asesor;
        }else
          this.service.createAlert('Error al obtener la información. Intente de nuevo.', 'danger');
      },
      e => {
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        console.log(e);
      }
    );
  }

  // Agregar información de compra
  async SR_extraCompra(tipo_solicitud: number, tipo_info: number){

    var data: any = {
      tipo_solicitud: tipo_solicitud,
      tipo_info: tipo_info,
      id_cabecera: this.SR_solicitudID,

      monto: null,
      moneda_extra: null,
      comentario: null,
      motivo: null,
      concepto_extra: null,
      moneda: null,
      vinculo: null,
      viaticos: null,
      concepto: null,
      file: null,
      titulo_archivo: null,

      monto_dias: null
    };

    var flag_file = false;

    switch(tipo_solicitud){
      case 1:
      case 2:
      case 3:
        switch(tipo_info){
          case 1: // Archivo adjunto
            flag_file = true;

            var file = new FormData();
            var datas: any = {
              id_cabecera: this.SR_solicitudID,
              id: 2,
              tz: new Date().toISOString(),
              update: 2,
              titulo_archivo: this.SR_extraCompra_info.AdjArchivo.descripcion,
              tipo_info: tipo_info.toString(),
              tipo_solicitud: tipo_solicitud.toString()
            }

            file.append('archivo', this.SR_extraCompra_info.AdjArchivo.archivo);
            file.append('datos', JSON.stringify(datas));

            data = file;

            break;
          case 2: // Cargos extras

              data.vinculo = this.SR_extraCompra_info.CargoExtra.vinculo;
              data.motivo = this.SR_extraCompra_info.CargoExtra.motivo;
              data.monto = this.SR_extraCompra_info.CargoExtra.monto;
              data.moneda = this.SR_extraCompra_info.CargoExtra.moneda;
              data.concepto_extra = this.SR_extraCompra_info.CargoExtra.concepto_extra;
              data.comentario = this.SR_extraCompra_info.CargoExtra.comentario;

            break;
          case 3: // Comentario

            data.comentario = this.SR_extraCompra_info.Comentario.comentario;

            break;
          case 4: // Precio de compra - precio con dias anticipados

            data.vinculo = this.SR_extraCompra_info.TarifaCompra.vinculo;
            data.concepto = this.SR_extraCompra_info.TarifaCompra.concepto;
            data.monto = this.SR_extraCompra_info.TarifaCompra.monto;
            data.moneda = this.SR_extraCompra_info.TarifaCompra.moneda;
            data.monto_dias = this.SR_extraCompra_info.TarifaCompra.monto_dias;
            data.moneda_extra = this.SR_extraCompra_info.TarifaCompra.moneda_extra;

            break;
          case 5: // Precio convenio

            data.vinculo = this.SR_extraCompra_info.TarifaPublica.vinculo;
            data.concepto = this.SR_extraCompra_info.TarifaPublica.concepto;
            data.monto = this.SR_extraCompra_info.TarifaPublica.monto;
            data.moneda = this.SR_extraCompra_info.TarifaPublica.moneda;

            break;
          case 6: // Va cargado a viaticos

            data.viaticos = this.SR_extraCompra_info.CargoViaticos.viaticos;

            break;
        }
        break;
    }

    if(!flag_file){
      this.service.SR_extraCompra(data).subscribe(
        r => {
          if(r === 1){
            this.service.createAlert('Se guardo con exito.', 'success');
            this.SR_agregarInformacion_compras = 0;

            this.SR_extraCompra_info = new ExtraCompra();
          }else
            this.service.createAlert('No se guardo. Intentelo de nuevo', 'danger');

          this.SR_verCompras(tipo_solicitud);
        },
        e => {
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
          console.log(e);
        },
        () => {
          this.btn_cancelAction = false;
        }
      );
    }else{
      this.service.SR_addFileVuelos(data).subscribe(
        r => {
          if(r){
            this.service.createAlert('Se guardo con exito.', 'success');
            this.SR_agregarInformacion_compras = 0;

            this.SR_extraCompra_info = new ExtraCompra();
          }else
            this.service.createAlert('No se guardo.', 'danger');
        },
        e => {
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
          console.log(e);
        },
        () => {
          this.btn_cancelAction = false;
        }
      );
    }

  }



  //////////////////////////////////
  // ACCIONES //

  async SR_ACCIONES_eliminarDetalle(tipo_sol: number){
    var message = tipo_sol === 1 ? '¿Desea eliminar el servicio "Vuelo"?' :
                  tipo_sol === 2 ? '¿Desea eliminar el servicio "Hospedaje"?' :
                  tipo_sol === 3 ? '¿Desea eliminar el servicio "Auto"?' :
                                  '¿Desea eliminar el servicio?';
    const toast = await this.toast.create({
      message: message, color: 'danger', buttons: [
        {
          side: 'end',
          text: 'confirmar',
          handler: () => {
            var data: any = {};

            switch(tipo_sol){
              case 1:
                data = {
                  folio_cabecera: this.SR_solicitudID,
                  tipo_solicitud: tipo_sol,
                  id_detalle: this.SR_solicitud.vuelos.id_v
                };
                break;
              case 2:
                data = {
                  folio_cabecera: this.SR_solicitudID,
                  tipo_solicitud: tipo_sol,
                  id_detalle: this.SR_solicitud.hospedaje.id_h
                };
                break;
              case 3:
                data = {
                  folio_cabecera: this.SR_solicitudID,
                  tipo_solicitud: tipo_sol,
                  id_detalle: this.SR_solicitud.auto.id_a
                };
                break;
            }

            if(data){
              this.service.SR_ACCIONES_eliminarDetalle(data).subscribe(
                r => {
                  if(r === 1){
                    this.service.createAlert('Se elimino con exito.', 'success');
                    this.inicializarVariables();
                  }else
                    this.service.createAlert('No pudo eliminarse. Intente de nuevo.', 'danger');
                },
                e => {
                  this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
                  console.log(e);
                },
                () => {
                  this.onChangeSegment(1);
                }
              );
            }else
              this.service.createAlert('Error al obtener la información. Intente de nuevo.', 'danger');
          }
        },
        {
          side: 'end',
          icon: 'close',
          handler: () => {
            toast.dismiss();
          }
        }
      ]
    });
    toast.present();
  }

  SR_ACCIONES_masCotizVuelos(){
    var data: any = {
      colaborador_id: this.colaborador_id,
      id_cabecera: this.SR_solicitudID
    };
    this.service.SR_ACCIONES_masCotizVuelos(data).subscribe(
      r => {
        if(r !== 2){
          this.service.createAlert('Se guardaron los cambios con exito.', 'success');
          this.inicializarVariables();
        }else
          this.service.createAlert('No se pudo guardar los cambios. Intente de nuevo.', 'danger');
      },
      e => {
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        console.log(e);
      }
    );
  }
  // Las funciones: recotizar, cancelar servicios; funcionan para:
  // Vuelos | Hospedajes | Autos

  SR_ACCIONES_createModal_editarServicio(tipo_sol: number){
    this.SR_recargarEstructuras(1, {});

    this.SR_modalData.editarServicio.tipo_sol = tipo_sol;
    this.SR_modalData.editarServicio.id = this.SR_solicitudID;

    this.SR_Modal_editarServicio.onDidDismiss().then(() => this.SR_modalBool.editarServicio = false);
    this.SR_modalBool.editarServicio = true;
  }
  SR_ACCIONES_editarServicio(){
    var data: any = {
      folio_cabecera: this.SR_modalData.editarServicio.id,
      tipo_sol: this.SR_modalData.editarServicio.tipo_sol
    };
    switch(this.SR_modalData.editarServicio.tipo_sol){
      case 1: // Vuelo
        data.filio_detalle = this.SR_solicitud.vuelos.id_v;
        data.tipo = this.SR_modalData.editarServicio.v.tipo;
        data.internacional = this.SR_modalData.editarServicio.v.internacional;
        data.origen = this.SR_modalData.editarServicio.v.origen;
        data.destino = this.SR_modalData.editarServicio.v.destino;
        data.f_salida = this.SR_modalData.editarServicio.v.f_salida;
        data.f_regreso = this.SR_modalData.editarServicio.v.tipo === 1 ? '1900-01-01' : this.SR_modalData.editarServicio.v.f_regreso;
        data.v_salida = this.SR_modalData.editarServicio.v.h_salida_desc + ' ' + this.SR_modalData.editarServicio.v.h_salida_num;
        data.v_regreso = this.SR_modalData.editarServicio.v.h_regreso_desc + ' ' + this.SR_modalData.editarServicio.v.h_regreso_num;
        break;
      case 2: // Hospedaje
        data.filio_detalle = this.SR_solicitud.hospedaje.id_h;
        data.tipo = this.SR_modalData.editarServicio.h.tipo;
        data.internacional = this.SR_modalData.editarServicio.h.internacional;
        data.ciudad = this.SR_modalData.editarServicio.h.ciudad;
        data.f_entrada = this.SR_modalData.editarServicio.h.entrada;
        data.f_salida = this.SR_modalData.editarServicio.h.salida;
        break;
      case 3: // Auto
        data.filio_detalle = this.SR_solicitud.auto.id_a;
        data.tipo = this.SR_modalData.editarServicio.a.tipo;
        data.lugar = this.SR_modalData.editarServicio.a.lugar;
        data.entrada = this.SR_modalData.editarServicio.a.f_entrada;
        data.salida = this.SR_modalData.editarServicio.a.f_salida;
        break;
    }
    if(this.SR_modalData.editarServicio.tipo_sol !== 0){
      this.service.SR_ACCIONES_editarServicio(data).subscribe(
        r => {
          if(r === 1){
            this.service.createAlert('Se guardo con exito.', 'success');
            this.inicializarVariables();
            this.SR_closeModal();
          }else
            this.service.createAlert('No se guardo con exito.', 'danger');
        },
        e => {
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
          console.log(e);
        }
      );
    }else
      this.service.createAlert('Error al guardar. Recargue la pagina y vuelva intentarlo.');
  }
  SR_ACCIONES_versionServicio(){
    var data: any = {
      folio_cabecera: this.SR_modalData.editarServicio.id,
      tipo_sol: this.SR_modalData.editarServicio.tipo_sol
    };
    switch(this.SR_modalData.editarServicio.tipo_sol){
      case 1: // Vuelo
        data.filio_detalle = this.SR_solicitud.vuelos.id_v;
        data.tipo = this.SR_modalData.editarServicio.v.tipo;
        data.internacional = this.SR_modalData.editarServicio.v.internacional;
        data.origen = this.SR_modalData.editarServicio.v.origen;
        data.destino = this.SR_modalData.editarServicio.v.destino;
        data.f_salida = this.SR_modalData.editarServicio.v.f_salida;
        data.f_regreso = this.SR_modalData.editarServicio.v.tipo === 1 ? '1900-01-01' : this.SR_modalData.editarServicio.v.f_regreso;
        data.v_salida = this.SR_modalData.editarServicio.v.h_salida_desc + ' ' + this.SR_modalData.editarServicio.v.h_salida_num;
        data.v_regreso = this.SR_modalData.editarServicio.v.h_regreso_desc + ' ' + this.SR_modalData.editarServicio.v.h_regreso_num;
        break;
      case 2: // Hospedaje
        data.filio_detalle = this.SR_solicitud.hospedaje.id_h;
        data.tipo = this.SR_modalData.editarServicio.h.tipo;
        data.internacional = this.SR_modalData.editarServicio.h.internacional;
        data.ciudad = this.SR_modalData.editarServicio.h.ciudad;
        data.f_entrada = this.SR_modalData.editarServicio.h.entrada;
        data.f_salida = this.SR_modalData.editarServicio.h.salida;
        break;
      case 3: // Auto
        data.filio_detalle = this.SR_solicitud.auto.id_a;
        data.tipo = this.SR_modalData.editarServicio.a.tipo;
        data.lugar = this.SR_modalData.editarServicio.a.lugar;
        data.entrada = this.SR_modalData.editarServicio.a.f_entrada;
        data.salida = this.SR_modalData.editarServicio.a.f_salida;
        break;
    }
    if(this.SR_modalData.editarServicio.tipo_sol !== 0){
      this.service.SR_ACCIONES_versionServicio(data).subscribe(
        r => {
          if(r === 1){
            this.service.createAlert('Se guardo con exito.', 'success');
            this.inicializarVariables();
            this.SR_closeModal();
          }else
            this.service.createAlert('No se guardo con exito.', 'danger');
        },
        e => {
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
          console.log(e);
        }
      )
    }
  }
  SR_ACCIONES_createModal_recotizar(tipo_sol: number){
    this.SR_modalData.Recotizar$Cancelar.tipo_sol = tipo_sol;
    this.SR_modalData.Recotizar$Cancelar.id_detalle =  tipo_sol === 1 ? this.SR_solicitud.vuelos.id_v :
                                              tipo_sol === 2 ? this.SR_solicitud.hospedaje.id_h :
                                              tipo_sol === 3 ? this.SR_solicitud.auto.id_a : 0;

    this.SR_Modal_recotizar.onDidDismiss().then(() => this.SR_modalBool.recotizar = false);
    this.SR_modalBool.recotizar = true;
  }
  SR_ACCIONES_recotizar(){
    var data: any = {
      tipo_sol: this.SR_modalData.Recotizar$Cancelar.tipo_sol,
      comentario: this.SR_modalData.Recotizar$Cancelar.comentario,
      id_detalle: this.SR_modalData.Recotizar$Cancelar.id_detalle,
      id_cabecera: this.SR_solicitudID
    };
    this.service.SR_ACCIONES_recotizar(data).subscribe(
      r => {
        if(r === 0 || r === 2)
          this.service.createAlert('No se pudo guardar los cambios. Intente de nuevo', 'danger');
        else {
          this.service.createAlert('Se guardaron los cambios.', 'success');
          this.inicializarVariables();
        }
      },
      e => {
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        console.log(e);
      },
      () => {
       this.SR_closeModal();
      }
    );

  }
  SR_ACCIONES_createModal_cancelarServicio(tipo_sol: number){
    this.SR_modalData.Recotizar$Cancelar.tipo_sol = tipo_sol;
    this.SR_modalData.Recotizar$Cancelar.id_detalle = tipo_sol === 1 ? this.SR_solicitud.vuelos.id_v :
                                                    tipo_sol === 2 ? this.SR_solicitud.hospedaje.id_h :
                                                    tipo_sol === 3 ? this.SR_solicitud.auto.id_a : 0;

    this.SR_Modal_cancelarServicio.onDidDismiss().then(() => this.SR_modalBool.cancelarServicio = false);
    this.SR_modalBool.cancelarServicio = true;
  }
  SR_ACCIONES_cancelarServicio(){
    var data: any = {
      tipo_sol: this.SR_modalData.Recotizar$Cancelar.tipo_sol,
      comentario: this.SR_modalData.Recotizar$Cancelar.comentario,
      id_detalle: this.SR_modalData.Recotizar$Cancelar.id_detalle,
      id_cabecera: this.SR_solicitudID,
      colaborador_id: this.colaborador_id
    };
    this.service.SR_ACCIONES_cancelarServicio(data).subscribe(
      r => {
        if(r === 0 || r === 2)
          this.service.createAlert('No se pudo guardar los cambios. Intente de nuevo', 'danger');
        else {
          this.service.createAlert('Se realizo con exito.','success');
          this.inicializarVariables();
        }
      },
      e => {
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        console.log(e);
      },
      () => {
        this.SR_closeModal();
      }
    );
  }


  // Vuelos || Hospedajes
  SR_ACCIONES_createModal_reagendar(tipo_sol: number){
    this.SR_recargarEstructuras(1, {});

    this.SR_modalData.reagendar.tipo_sol = tipo_sol;

    this.SR_Modal_reagendar.onDidDismiss().then(() => this.SR_modalBool.reagendar = false);
    this.SR_modalBool.reagendar = true;
  }
  SR_ACCIONES_reagendar(){
    var data: any = {};

    switch(this.SR_modalData.reagendar.tipo_sol){
      case 1:
        data = {
          tipo_solicitud: this.SR_modalData.reagendar.tipo_sol,
          v_tipo: this.SR_modalData.reagendar.v.tipo,
          v_origen: this.SR_modalData.reagendar.v.origen,
          v_destino: this.SR_modalData.reagendar.v.destino,
          inicio_entrada: this.SR_modalData.reagendar.v.f_salida,
          fin_salida: this.SR_modalData.reagendar.v.f_regreso,
          v_inicio: this.SR_modalData.reagendar.v.h_salida_desc + ' ' + this.SR_modalData.reagendar.v.h_salida_num,
          v_internacional: this.SR_modalData.reagendar.v.internacional,
          v_fin: this.SR_modalData.reagendar.v.h_regreso_desc + ' ' + this.SR_modalData.reagendar.v.h_regreso_num,
          justif_v: this.SR_modalData.reagendar.v.comentario,

          folio_cabecera: this.SR_solicitudID,
          filio_detalle: this.SR_solicitud.vuelos.id_v,
          lider_id: this.SR_solicitud.solicitante.lider_id,
          colaborador_id: this.colaborador_id
        };
        break;
      case 2:
        data = {
          tipo_solicitud: this.SR_modalData.reagendar.tipo_sol,
          justif_h: this.SR_modalData.reagendar.h.comentario,
          h_tipo: this.SR_modalData.reagendar.h.tipo,
          h_ciudad: this.SR_modalData.reagendar.h.ciudad,
          h_internacional: this.SR_modalData.reagendar.h.internacional,
          inicio_entrada: this.SR_modalData.reagendar.h.entrada,
          fin_salida: this.SR_modalData.reagendar.h.salida,

          folio_cabecera: this.SR_solicitudID,
          filio_detalle: this.SR_solicitud.hospedaje.id_h,
          lider_id: this.SR_solicitud.solicitante.lider_id,
          colaborador_id: this.colaborador_id
        };
        break;
    }
    if(this.SR_modalData.reagendar.tipo_sol !== 0){
      this.service.SR_ACCIONES_reagendar(data).subscribe(
        r => {
          this.inicializarVariables();
        },
        e => {
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
          console.log(e);
        },
        () => {
          this.SR_closeModal();
        }
      );
    }else
      this.service.createAlert('Error al guardar. Recargue la pagina y vuelva a intentarlo.');
  }

  // END ACCIONES //



  //////////////////////////////////
  // TODOS //

  SR_createModalDetalles(tipo_sol: number, index: number){
    switch(tipo_sol){
      case 1:
        this.SR_modalDetalles_data = this.SR_solicitud.vuelos_cotizacion[index];
        this.SR_modalDetalles_data.aerolinea = this.SR_solicitud.aerolinea[index];
        break;
      case 2:
        this.SR_modalDetalles_data = this.SR_solicitud.hospedaje_cotizacion[index];
        break;
      case 3:
        this.SR_modalDetalles_data = this.SR_solicitud.autos_cotizacion[index];
        break;
    }

    if(this.SR_modalDetalles_data){
      this.SR_ModalDetalles.onDidDismiss().then(() => this.SR_modalDetalles = false);
      this.SR_modalDetalles = true;
    }else
      this.service.createAlert('Error al visualizar los detalles. Intentelo de nuevo.', 'danger');
  }
  // Elimina cotización: Vuelo | Hospedaje | Auto
  SR_eliminarCotizacion(tipo_sol: number, index: number){
    var data: any = {};
    switch(tipo_sol){
      case 1:
        data = {
          sol_id: this.SR_solicitudID,
          detalle_id: this.SR_solicitud.vuelos.id_v,
          cotizacion_id: this.SR_solicitud.vuelos_cotizacion[index].id,
          tipo_sol: tipo_sol
        };
        break;
      case 2:
        data = {
          sol_id: this.SR_solicitudID,
          detalle_id: this.SR_solicitud.hospedaje.id_h,
          cotizacion_id: this.SR_solicitud.hospedaje_cotizacion[index].id,
          tipo_sol: tipo_sol
        };
        break;
      case 3:
        data = {
          sol_id: this.SR_solicitudID,
          detalle_id: this.SR_solicitud.auto.id_a,
          cotizacion_id: this.SR_solicitud.autos_cotizacion[index].id,
          tipo_sol: tipo_sol
        };
        break;
    }
    if(data){
      this.service.SR_eliminarCotizacion(data).subscribe(
        r => {
          if(r === 1){
            this.service.createAlert('Se ha eliminado con exito.', 'success');
            this.SR_verCotizaciciones(tipo_sol);
          }else
            this.service.createAlert('Error al eliminar la cotización. Intente de nuevo.', 'danger');
        },
        e => {
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
          console.log(e);
        },
        () => {
          this.btn_cancelAction = false;
        }
      );
    }else
      this.service.createAlert('Error al realizar la acción. Intentelo de nuevo.', 'danger');
  }
  // Obtención de cotizaciones: Vuelo | Hospedaje | Auto
  SR_verCotizaciciones(tipo_sol: number){
    this.service.SR_verCotizaciones({sol_id: this.SR_solicitudID, tipo_sol: tipo_sol}).subscribe(
      (r:any) => {
        if(r[0] !== 1)
          this.service.createAlert('Error al obtener la información. Intente de nuevo.', 'danger');


        switch(tipo_sol){
          case 1:
            this.SR_solicitud.vuelos_cotizacion = r[1];
            break;
          case 2:
            this.SR_solicitud.hospedaje_cotizacion = r[1];
            break;
          case 3:
            this.SR_solicitud.autos_cotizacion = r[1];
            break;
        }
      },
      e => {
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        console.log(e);
      }
    );
  }
  // Agregar cotización
  SR_agregarCotizacion(tipo_sol: number){
    this.btn_cancelAction = true;
    var data: any = {};

    switch(tipo_sol){
      case 1:
        data = {
          id_cabecera: this.SR_solicitudID,
          id_detalle: this.SR_solicitud.vuelos.id_v,
          origen: this.SR_cotVuelos.v_ciudadSalida,
          f_salida: this.SR_cotVuelos.v_fSalida,
          h_salida: this.SR_cotVuelos.v_hSalida,
          ida_venida: this.SR_cotVuelos.v_venida,

          destino: this.SR_cotVuelos.v_ciudadLlegada,
          f_llegada: this.SR_cotVuelos.v_fLlegada,
          h_llegada: this.SR_cotVuelos.v_hLlegada,

          precio: this.SR_cotVuelos.v_precio,
          moneda: this.SR_cotVuelos.v_moneda,
          aerolinea: this.SR_cotVuelos.v_aerolinea,
          escalas: this.SR_cotVuelos.v_escalas,
          comentario: this.SR_cotVuelos.v_comentario,
          colaborador_id: this.colaborador_id,

          tipo_sol: 1
        };
        break;
      case 2:
        data = {
          id_cabecera: this.SR_solicitudID,
          id_detalle: this.SR_solicitud.hospedaje.id_h,
          colaborador_id: this.colaborador_id,

          h_hotel: this.SR_cotHospedaje.h_name,
          h_tipo: this.SR_cotHospedaje.h_tipo,
          f_entrada: this.SR_cotHospedaje.h_entrada,
          f_salida: this.SR_cotHospedaje.h_salida,
          precio: this.SR_cotHospedaje.h_precio,
          moneda: this.SR_cotHospedaje.h_moneda,
          h_origen: this.SR_cotHospedaje.h_ciudad,
          comentario: this.SR_cotHospedaje.h_comentario,

          tipo_sol: 2
        };
        break;
      case 3:
        data = {
          id_cabecera: this.SR_solicitudID,
          id_detalle: this.SR_solicitud.auto.id_a,
          colaborador_id: this.colaborador_id,

          arrendadora: this.SR_cotAuto.a_arrendadora,
          f_recepcion: this.SR_cotAuto.a_recepcion,
          f_entrega: this.SR_cotAuto.a_entrega,
          precio: this.SR_cotAuto.a_precio,
          moneda: this.SR_cotAuto.a_moneda,
          comentario: this.SR_cotAuto.a_comentario,

          tipo_sol: 3
        };
        break;
    }

    if(tipo_sol){
      this.service.SR_agregarCotizacion(data).subscribe(
        r => {
          switch(tipo_sol){
            case 1:
              this.cotizacion_vuelosForm.reset();
              break;
            case 2:
              this.cotizacion_hospedajeForm.reset();
              break;
            case 3:
              this.cotizacion_autoForm.reset();
              break;
          }
          if(r === 1){
            this.service.createAlert('Se ha creado con exito.', 'success');
            this.inicializarVariables();
          }else
            this.service.createAlert('Error al crear la cotización. Intente de nuevo.', 'danger');
        },
        e => {
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
          console.log(e);
        },
        () => {
          this.btn_cancelAction = false;
          this.SR_verCotizaciciones(tipo_sol);
        }
      );
    }else
      this.service.createAlert('Error al realizar la acción. Intentelo de nuevo.', 'danger');
  }
  // Selección de cotización: Vuelos | Hospedajes
  async SR_selectCotizacion(tipo_sol: number){
    this.btn_cancelAction = true;
    var data: any = {};
    var select_radio: number = 0;

    switch(tipo_sol){
      case 1: // Vuelo
        select_radio = this.SR_radio.vuelo;
        break;
      case 2: // Hospedaje
        select_radio = this.SR_radio.hosp;
        break;
      case 3: // Auto
        select_radio = this.SR_radio.auto;
        break;
    }

    if(select_radio){

      switch(tipo_sol){
        case 1: // Vuelo
          data = {
            id_cabecera: this.SR_solicitudID,
            id_detalle: this.SR_solicitud.vuelos.id_v,
            colaborador_id: this.colaborador_id,
            tipo_sol: tipo_sol,
            tipo_vuelo: 0,
            opc1: select_radio,
            opc2: 0,
            edo: this.SR_solicitud.solicitante.edo
          };
          break;
        case 2: // Hospedaje
          data = {
            id_cabecera: this.SR_solicitudID,
            id_detalle: this.SR_solicitud.hospedaje.id_h,
            colaborador_id: this.colaborador_id,
            tipo_sol: tipo_sol,
            tipo_vuelo: 0,
            opc1: select_radio,
            opc2: 0,
            edo: this.SR_solicitud.solicitante.edo
          };
          break;
        case 3: // Auto
          data = {
            id_cabecera: this.SR_solicitudID,
            id_detalle: this.SR_solicitud.auto.id_a,
            colaborador_id: this.colaborador_id,
            tipo_sol: tipo_sol,
            tipo_vuelo: 0,
            opc1: select_radio,
            opc2: 0,
            edo: this.SR_solicitud.solicitante.edo
          }
          break;
      }

      this.service.SR_selectCotizacion(data).subscribe(
        r => {
          switch(r){
            case 0:
              this.service.createAlert('Selecciona una cotización.', 'danger');
              break;
            case 2:
              this.service.createAlert('No se pudieron guardar los cambios en la cotización.', 'danger');
              break;
            case 3:
              this.service.createAlert('No se puedieron guardar los cambios en la solicitud.', 'danger');
              break;
            case 4:
              this.service.createAlert('No se pudieron guardar los cambios.', 'danger');
              break;
            case 5:
            case 111:
              this.inicializarVariables();
              break;
            default:
              this.inicializarVariables();
              break;
          }
        },
        e => {
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
          console.log(e);
        },
        () => {
          this.SR_radio = {
            vuelo: '',
            hosp: '',
            auto: ''
          };
          this.btn_cancelAction = false;
        }
      );
    }else{
      this.service.createAlert('Seleccione una cotización', 'danger');
      this.btn_cancelAction = false;
    }
  }
  CHANGE_extraCompra_info_resetData(){
    this.SR_extraCompra_info = new ExtraCompra();
  }

  // END TODOS //



  //////////////////////////////////
  // VUELOS

  // Escalas para cotizaciones de vuelo
  async SR_modal_agregarEscalasVuelos(values:any){
    this.service.SR_desgloseEscalas({id: this.SR_solicitud.vuelos_cotizacion[values.index].id}).subscribe(
      (r:any) => {
        this.SR_listEscalas.info = r[0] as any;
        this.SR_listEscalas.detalles = r[1] as Array<any>;
      },
      e => {

      },
      () => {

        if(this.colaborador_id === 1050) this.SR_recargarEstructuras(1, {});

        this.SR_Modal_escalaVuelos.onDidDismiss().then(() => this.SR_modalBool.v_escala = false);
        this.SR_modalBool.v_escala = true;

        this.SR_modalData.v_escala.id = this.SR_solicitud.vuelos_cotizacion[values.index].id;

      }
    );
  }

  // Lista de escalas de vuelo
  async SR_list_escalasVuelos(id: number){
    this.service.SR_desgloseEscalas({id: id}).subscribe(
      (r:any) => {
        this.SR_listEscalas.info = r[0] as any;
        this.SR_listEscalas.detalles = r[1] as Array<any>;
      },
      e => {

      }
    );
  }

  SR_changeFile(event: any){
    var file: any = event.target.files[0];
    this.SR_extraCompra_info.AdjArchivo.archivo = file;
    this.SR_extraCompra_info.AdjArchivo.titulo_archivo = file.name;
  }




  //////////////////////////////////
  // HOSPEDAJE

  // Enviar correo  para lider y colaborador confirmando que
  // se capturó la información de compra
  async SR_enviarCompra(){
    this.btn_cancelAction = true;
    var data = {
      id_cabecera: this.SR_solicitudID,
      email_colab: this.SR_solicitud.solicitante.c_email,
      email_lider: this.SR_solicitud.solicitante.lider_email
    }
    this.service.SR_enviarCompra(data).subscribe(
      r =>{
        if(r === 0)
          this.service.createAlert('Hubo un error al envíar la información. Intente de nuevo', 'danger'); // no se guardo la información
        else if(r === 1)
          this.service.createAlert('¡Enviado!', 'success'); // si se envio a lider y colab
        else if(r === 2)
          this.service.createAlert('No se envió la información.', 'success'); // no se envio a lider y colab, si le llegó a maura
        else
          this.service.createAlert('No se envió la notificación.', 'danger'); // no se envio ninguno de los dos correos
      },
      e =>{
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        console.log(e);
      },
      () =>{
        this.inicializarVariables();

        this.btn_cancelAction = false;
      }
    );

  }

  // Maura envia cotizaciones al lider
  async SR_enviarCotizLider(){
    this.btn_cancelAction = true;

    var data = {
      id_cabecera: this.SR_solicitudID,
      lider_id: this.SR_solicitud.solicitante.lider_id
    }
    this.service.SR_enviarCotizLider(data).subscribe(
      r => {
        if(r === 2)
          this.service.createAlert('No se pudieron guardar los cambios.', 'danger');
        else{
          this.inicializarVariables();
        }
      },
      e => {
          this.inicializarVariables();

          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
          console.log(e);
      },
      () => {
        this.btn_cancelAction = false;
      }
    );

  }


  //////////////////////////////////
  // MODALES

  // Acciones como: agregar, aceptar, aplicar, terminar, etc.
  // Toda acción que implique el guardado o borrado
  async SR_modals(type: number, values: any){
    this.btn_cancelAction = true;

    var data: any;
    var flag = true;
    switch(type){
      case 10:
        if(this.SR_modalData.v_encuesta.calificacion > 0){
          data = {
            type: type,
            sol_id: this.SR_solicitudID,
            colaborador: this.colaborador_id,

            calificacion: this.SR_modalData.v_encuesta.calificacion,
            comentario: this.SR_modalData.v_encuesta.comentario
          };
        }else
          this.service.createAlert('Seleccione la calificación.', 'danger');
        break;
      case 100:
        flag = false;

        if(this.SR_modalData.v_escala.lugar)
          if(this.SR_modalData.v_escala.h_inicio)
            if(this.SR_modalData.v_escala.h_fin){
              data = {
                  id: this.SR_modalData.v_escala.id,
                  type: type,
                  colaborador_id: this.colaborador_id,

                  lugar: this.SR_modalData.v_escala.lugar,
                  inicio: this.SR_modalData.v_escala.h_inicio,
                  fin: this.SR_modalData.v_escala.h_fin
              };
              flag = true;
            }else
              this.service.createAlert('Indica el fin.', 'danger');
          else
            this.service.createAlert('Indica el inicio.', 'danger');
        else
          this.service.createAlert('Indica el lugar.', 'danger');
        break;
      case 201:
        data = {
          type: type,

          sol_id: this.SR_solicitudID,
          urgencia: this.SR_solicitud.solicitante.urgencia,
          colaborador_id: this.colaborador_id,
          autoriza: this.SR_solicitud.solicitante.autoria_contralor,
          sol_errordias: this.SR_solicitud.errores.solicitud_errordias,
          error_prj_presupuesto: this.SR_solicitud.errores.error_prj_presupuesto,
          error_viaticos_pend: this.SR_solicitud.errores.error_viaticos_pend,
          error_v_dias_semanasanta: this.SR_solicitud.errores.error_v_dias_semanasanta,
          error_v_dias_verano: this.SR_solicitud.errores.error_v_dias_verano,
          error_v_dias_navidad: this.SR_solicitud.errores.error_v_dias_navidad,
          error_v_dias_internacional: this.SR_solicitud.errores.error_v_dias_internacional,
          error_v_dias_nacional: this.SR_solicitud.errores.error_v_dias_nacional,
          error_h_dias_semanasanta: this.SR_solicitud.errores.error_h_dias_semanasanta,
          error_h_dias_verano: this.SR_solicitud.errores.error_h_dias_verano,
          error_h_dias_navidad: this.SR_solicitud.errores.error_h_dias_navidad,
          error_h_dias_internacional: this.SR_solicitud.errores.error_h_dias_internacional,
          error_h_dias_nacional: this.SR_solicitud.errores.error_h_dias_nacional,
          error_dias_autos: this.SR_solicitud.errores.error_dias_autos,
          internacional_inge: this.SR_solicitud.solicitante.internacional_inge,

          plan_trabajo: this.SR_modalData.m_201.planTrabajo,
          solicitud_tardia: this.SR_modalData.m_201.soliTardia
        };
        break;
      case 202:
        if(this.SR_modalData.m_202.tipoSolicitud){
          flag = false;

          switch(this.SR_modalData.m_202.tipoSolicitud){
            //vuelos revisa errores, guardar detalle de servicio si hay al menos un error se insertara contralor,
            case '1': // vuelo

              if(this.SR_modalData.m_202.v.tipo)
                if(this.SR_modalData.m_202.v.internacional)
                  if(this.SR_modalData.m_202.v.origen)
                    if(this.SR_modalData.m_202.v.destino)
                      if(this.SR_modalData.m_202.v.f_salida)
                        if(this.SR_modalData.m_202.v.h_salida_desc && this.SR_modalData.m_202.v.h_salida_num)
                          if(this.SR_modalData.m_202.v.f_regreso || this.SR_modalData.m_202.v.tipo === 1)
                            if( ( this.SR_modalData.m_202.v.h_regreso_desc && this.SR_modalData.m_202.v.h_regreso_num ) ||
                                  this.SR_modalData.m_202.v.tipo === 1)
                              flag = true;
                            else
                              this.service.createAlert('Indica la hora del evento de regreso.', 'danger');
                          else
                            this.service.createAlert('Indica la fecha del evento de regreso.', 'danger');
                        else
                          this.service.createAlert('Indica la hora del evento de regreso.', 'danger');
                      else
                        this.service.createAlert('Indica la fecha del evento de regreso.', 'danger');
                    else
                      this.service.createAlert('Indica el destino.', 'danger');
                  else
                    this.service.createAlert('Indica el origen.', 'danger');
                else
                  this.service.createAlert('Indica si es un vuelo internacional.', 'danger');
              else
                this.service.createAlert('Indica el tipo de vuelo.', 'danger');

              data = {
                type: type,
                solicitud: this.SR_solicitudID,
                tipo_solicitud: this.SR_modalData.m_202.tipoSolicitud,

                tipo: this.SR_modalData.m_202.v.tipo,
                internacional: this.SR_modalData.m_202.v.internacional,
                origen: this.SR_modalData.m_202.v.origen,
                destino: this.SR_modalData.m_202.v.destino,
                fsalida: this.SR_modalData.m_202.v.f_salida,
                hsalida_desc: this.SR_modalData.m_202.v.h_salida_desc,
                hsalida_num: this.SR_modalData.m_202.v.h_salida_num,
                fregreso: this.SR_modalData.m_202.v.tipo === 1 ? '1900-01-01' : this.SR_modalData.m_202.v.f_regreso,
                hregreso_desc: this.SR_modalData.m_202.v.tipo === 1 ? '' : this.SR_modalData.m_202.v.h_regreso_desc,
                hregreso_num: this.SR_modalData.m_202.v.tipo === 1 ? '' : this.SR_modalData.m_202.v.h_regreso_num
              };

              break;
            //hospedaje revisa errores, guardar detalle de servicio si hay al menos un error se insertara contralor,
            case '2': // hospedaje

              if(this.SR_modalData.m_202.h.tipo)
                if(this.SR_modalData.m_202.h.ciudad)
                  if(this.SR_modalData.m_202.h.internacional)
                    if(this.SR_modalData.m_202.h.entrada)
                      if(this.SR_modalData.m_202.h.salida)
                        flag = true;
                      else
                        this.service.createAlert('Indica la salida.', 'danger');
                    else
                      this.service.createAlert('Indica la entrada.', 'danger');
                  else
                    this.service.createAlert('Indica si es un hospedaje internacional.', 'danger');
                else
                  this.service.createAlert('Indica la ciudad', 'danger');
              else
                this.service.createAlert('Indica el tipo de hospedaje', 'danger');

              data = {
                type: type,
                solicitud: this.SR_solicitudID,
                tipo_solicitud: this.SR_modalData.m_202.tipoSolicitud,

                tipo: this.SR_modalData.m_202.h.tipo,
                ciudad: this.SR_modalData.m_202.h.ciudad,
                internacional: this.SR_modalData.m_202.h.internacional,
                entrada: this.SR_modalData.m_202.h.entrada,
                salida: this.SR_modalData.m_202.h.salida
              }
              break;
            //autos revisa errores, guardar detalle de servicio si hay al menos un error se insertara contralor,
            case '3': // auto

              if(this.SR_modalData.m_202.a.tipo)
                if(this.SR_modalData.m_202.a.lugar)
                  if(this.SR_modalData.m_202.a.f_entrada)
                    if(this.SR_modalData.m_202.a.f_salida)
                      flag = true;
                    else
                      this.service.createAlert('Indica el fin.', 'danger');
                  else
                    this.service.createAlert('Indica el inicio.', 'danger');
                else
                  this.service.createAlert('Indica el lugar de entrega.', 'danger');
              else
                this.service.createAlert('Indica el tipo de auto.', 'danger');

              data = {
                type: type,
                solicitud: this.SR_solicitudID,
                tipo_solicitud: this.SR_modalData.m_202.tipoSolicitud,

                tipo: this.SR_modalData.m_202.a.tipo,
                lugar: this.SR_modalData.m_202.a.lugar,
                inicio: this.SR_modalData.m_202.a.f_entrada,
                fin: this.SR_modalData.m_202.a.f_salida
              }
              break;
          }

        }else
          this.service.createAlert('Indica el tipo de solicitud.', 'danger');
        break;
      case 203:
        data = {
          solicitud: this.SR_solicitudID,
          type: type,

          contraloria: this.SR_solicitud.solicitante.req_contraloria,
          celularLider: this.SR_modalData.m_203.celularLider,
          comentarioLider: this.SR_modalData.m_203.comentario,
          aprueba: values.btn,
          colaboradorID: this.colaborador_id,
          internacionalInge: this.SR_solicitud.solicitante.internacional_inge

        };
        break;
      case 204:
        data = {
          type: type,
          id_cabecera : this.SR_solicitudID,
          colaborador_id : this.colaborador_id,

          comentario_reenviar : this.SR_modalData.m_204.comentarioLider,
          solicitud_tardia : this.SR_modalData.m_204.solicitudTardia,

          urgencia : this.SR_solicitud.solicitante.urgencia,
          autoriza_contralor : this.SR_solicitud.solicitante.autoria_contralor,
          solicitud_errordias : this.SR_solicitud.errores.solicitud_errordias,
          error_prj_presupuesto: this.SR_solicitud.errores.error_prj_presupuesto,
          error_viaticos_pend: this.SR_solicitud.errores.error_viaticos_pend,
          error_v_dias_semanasanta: this.SR_solicitud.errores.error_v_dias_semanasanta,
          error_v_dias_verano: this.SR_solicitud.errores.error_v_dias_verano,
          error_v_dias_navidad: this.SR_solicitud.errores.error_v_dias_navidad,
          error_v_dias_internacional: this.SR_solicitud.errores.error_v_dias_internacional,
          error_v_dias_nacional: this.SR_solicitud.errores.error_v_dias_nacional,
          error_h_dias_semanasanta: this.SR_solicitud.errores.error_h_dias_semanasanta,
          error_h_dias_verano: this.SR_solicitud.errores.error_h_dias_verano,
          error_h_dias_navidad: this.SR_solicitud.errores.error_h_dias_navidad,
          error_h_dias_internacional: this.SR_solicitud.errores.error_h_dias_internacional,
          error_h_dias_nacional: this.SR_solicitud.errores.error_h_dias_nacional,
          error_dias_autos: this.SR_solicitud.errores.error_dias_autos,
          internacional_inge: this.SR_solicitud.solicitante.internacional_inge
        };
        break;
      case 205:
        data = {
          type: type,
          id_cabecera : this.SR_solicitudID,
          colaborador_id : this.colaborador_id,

          comentario_contralor: this.SR_modalData.m_205.comentarioContralor,

          aprueba: values.btn,
          internacional_inge: this.SR_solicitud.solicitante.internacional_inge
        };
        break;
      case 206:
      case 207:
        data = {
          type: type,
          id_cabecera: this.SR_solicitudID,
          colaborador_id: this.colaborador_id,
          solicitante_id: this.SR_solicitud.solicitante.id_colaborador,
          edo: this.SR_solicitud.solicitante.edo,
          lider_id: this.SR_solicitud.solicitante.lider_id,
          respuesta: values.btn,
          solic_nvo: this.SR_solicitud.solicitante.solicitante_nuevo,
          tipofx: ( type === 206 ? 'L' : 'C' )
        };
        break;
      case 208:
        data = {
          type: type,
          colaborador_id: this.colaborador_id,

          tipo_solicitud : 1,
          folio_cabecera : this.SR_solicitudID,
          filio_detalle : this.SR_solicitud.vuelos.id_v,
          etapa : ( this.SR_solicitud.solicitante.reagenda_vuelo === 1 ) ? 2 : ( this.SR_solicitud.solicitante.reagenda_vuelo === 2 ? 3 : 0 ),
          respuesta : values.btn,
          lider_id : this.SR_solicitud.solicitante.lider_id,
          id17: this.SR_reagendarVuelo.Vid
        };
        break;
      case 209:
        data = {
          type: type,
          colaborador_id: this.colaborador_id,

          tipo_solicitud : 2,
          folio_cabecera : this.SR_solicitudID,
          filio_detalle : this.SR_solicitud.hospedaje.id_h,
          etapa : ( this.SR_solicitud.solicitante.reagenda_hosp === 1 ) ? 2 : ( this.SR_solicitud.solicitante.reagenda_hosp === 2 ? 3 : 0 ),
          respuesta : values.btn,
          lider_id : this.SR_solicitud.solicitante.lider_id,
          id17: this.SR_reagendarHosp.Hid
        };
        break;
      case 1001:
        data = {
          type: type,
          id_cabecera: this.SR_solicitudID,
          colaborador_id: this.colaborador_id,
          comentario: this.SR_modalData.m_1001.comentario
        };
        break;
      case 1002:
        data = {
          type: type,
          id_cabecera: this.SR_solicitudID,
          colaborador_id: this.colaborador_id,
          solicitante_id: this.SR_solicitud.solicitante.id_colaborador,
          edo: this.SR_solicitud.solicitante.edo,
          lider_id: this.SR_solicitud.solicitante.lider_id,

          nuevo_solic: this.SR_modalData.m_1002.nuevo_solic,
          comentario: this.SR_modalData.m_1002.comentario
        };
        break;
      default:
        flag = false;
        this.service.createAlert('Hubo un error. Cierre la ventana emergente y vuelva a intentar.', 'warning');
        break;
    }

    if(flag){
      this.service.SR_modals(data).subscribe(
        r => {
          switch(type){
            case 10:

              if(r === 1){
                this.service.createAlert('¡Gracias por tu calificación!');
                this.SR_modalBool.v_encuesta = false;
              }else
                this.service.createAlert('Hubo un error, vuelve a intentarlo.', 'danger');

              break;
            case 100:
              if(r === 1)
                this.SR_list_escalasVuelos(this.SR_modalData.v_escala.id);
              else
                this.service.createAlert('No se pudo guardar.', 'danger');
              break;
            case 201:
              if(r === 0)
                this.service.createAlert("Llena el campo de solicitud tardía", 'danger');
              else if(r === 1)
                this.service.createAlert("No pudo guardarse el plan de trabajo", 'danger');
              else if(r === 2)
                this.service.createAlert("No se pudo actualizar la solicitud", 'danger');
              else{
                this.inicializarVariables();
              }

              break;
            case 202:
              if(r === 1)
                this.inicializarVariables();
              else
                this.service.createAlert('Hubo un error y no pudo guardarse.', 'danger');
              break;
            case 203:
              if(r === 1)
                  this.service.createAlert('No pudo guardarse el comentario', 'danger');
              else if(r === 2)
                  this.service.createAlert('No se pudo actualizar la solicitud', 'danger');
              else if(r === 3){
                //this.service.createAlert('No se pudo enviar correo con la notificación', 'danger');
                this.inicializarVariables();
              }else
                this.inicializarVariables();

              break;
            case 204:
              if(r === 0)
                  this.service.createAlert('Llena el campo de solicitud tardía', 'danger');
              else if(r === 1)
                  this.service.createAlert('No pudo guardarse el plan de trabajo', 'danger');
              else if(r === 2)
                  this.service.createAlert('No se pudo actualizar la solicitud', 'danger');
              else{
                this.inicializarVariables();
              }

              break;
            case 205:
              if(r === 1)
                this.service.createAlert('No pudo guardarse el comentario', 'danger');
              else if(r === 2)
                this.service.createAlert('No se pudo actualizar la solicitud', 'danger');
              else
                this.inicializarVariables();


              break;
            case 206:
            case 207:
              if(r === 0)
                  this.service.createAlert('No se pudo procesar la solicitud.', 'danger');
              else if(r === 2)
                  this.service.createAlert('No se pudieron guardar los cambios.', 'danger');
              else{
                //this.service.createAlert('No se pudo enviar el correo', 'danger');
                this.inicializarVariables();
              }
              break;
            case 208:
              this.inicializarVariables();
              break;
            case 209:
              this.inicializarVariables();
              break;
            case 1001:
              if(r !== 0){
                this.inicializarVariables();
                this.onChangeSegment(1);
              }else
                this.service.createAlert('No se guardo. Vuelva a intentarlo.', 'danger');
              break;
            case 1002:
              switch(r){
                case 0: this.service.createAlert('No se pudo procesar la solicitud.', 'danger'); break;
                case 1:
                  this.inicializarVariables();
                  this.service.createAlert('Se envio con exito.', 'success');
                  break;
                case 2: this.service.createAlert('No se pudieron guardar los cambios.', 'danger'); break;
                default:
                  this.inicializarVariables();
                  this.service.createAlert('Se envio con exito.', 'success');
                  break;
              }
              break;
          }
        },
        e => {
          if(type !== 100){
            this.inicializarVariables();
          }

          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
          console.log(e);
        },
        () => {
          this.btn_cancelAction = false;
          if(type !== 100)
            this.SR_closeModal();
        }
      );
    }else
      this.btn_cancelAction = false;

  }

  // Redirección de la creación del modal seleccionado
  async SR_createModal(type: number, values: any){

    switch(type){
      case 10: // Encuesta

        if(this.SR_solicitud.encuesta === 0){
          this.SR_Modal_encuesta.onDidDismiss().then(() => this.SR_modalBool.v_encuesta = false);
          this.SR_modalBool.v_encuesta = true;

          this.SR_divAcciones.vistaEncuesta = true;
        }

        break;
      case 100: // Agregar escala

        this.SR_modal_agregarEscalasVuelos(values);

        break;
      case 101: // Borrar escala

      break;
      case 201: // Borrador: Terminar
        this.SR_Modal_201.onDidDismiss().then(() => this.SR_modalBool.m_201 = false);
        this.SR_modalBool.m_201 = true;
        break;
      // Borrador: Agregar un servicio
      // Devuelta al colaborador para hacer cambios: Terminar
      case 202:
        this.SR_recargarEstructuras(1, {});

        this.SR_modal_agregarServicio();

        break;
      case 203: // Enviado al líder: Atender solicitud
        this.SR_Modal_203.onDidDismiss().then(() => this.SR_modalBool.m_203 = false);
        this.SR_modalBool.m_203 = true;

        this.SR_modalData.m_203.celularLider = parseInt(this.SR_solicitud.solicitante.lider_celular);
        break;
      case 204: // Devuelta al colaborador para hacer cambios: Agregar un servicio
        this.SR_Modal_204.onDidDismiss().then(() => this.SR_modalBool.m_204 = false);
        this.SR_modalBool.m_204 = true;
        break;
      case 205:
        this.SR_Modal_205.onDidDismiss().then(() => this.SR_modalBool.m_205 = false);
        this.SR_modalBool.m_205 = true;
        break;
      case 206:
        this.SR_Modal_206.onDidDismiss().then(() => this.SR_modalBool.m_206 = false);
        this.SR_modalBool.m_206 = true;
        break;
      case 207:
        this.SR_Modal_206.onDidDismiss().then(() => this.SR_modalBool.m_207 = false);
        this.SR_modalBool.m_207 = true;
        break;
      case 208:
        this.SR_Modal_208.onDidDismiss().then(() => this.SR_modalBool.m_208 = false);
        this.SR_modalBool.m_208 = true;
        break;
      case 209:
        this.SR_Modal_209.onDidDismiss().then(() => this.SR_modalBool.m_209 = false);
        this.SR_modalBool.m_209 = true;
        break;
      case 1001: // Cancelar solicitud
        this.SR_Modal_1001.onDidDismiss().then(() => this.SR_modalBool.m_1001 = false);
        this.SR_modalBool.m_1001 = true;
        break;
      case 1002: // Cambiar nombre

        this.SR_recargarEstructuras(3, {});

        this.SR_Modal_1002.onDidDismiss().then(() => this.SR_modalBool.m_1002 = false);
        this.SR_modalBool.m_1002 = true;
        break;
    }
  }

  // Metodo para cerrar todos los modales
  SR_closeModal(){
    this.SR_modalData = new AllModalData();
    this.SR_modalBool = new AllModalBool();

    this.SR_modalDetalles = false;
  }

  // MODAL m202 por cada cambio se borrara la información que ha colocado
  SR_m_202_changeSolicitud(){
    this.SR_modalData.m_202.v = {
      comentario: '',
      tipo: 0,
      internacional: 0,
      origen: 0,
      destino: 0,
      f_salida: '',
      h_salida_desc: '',
      h_salida_num: '',
      f_regreso: '',
      h_regreso_desc: '',
      h_regreso_num: '',
    };
    this.SR_modalData.m_202.h = {
      comentario: '',
      tipo: 0,
      internacional: 0,
      ciudad: 0,
      entrada: '',
      salida: '',
    };
    this.SR_modalData.m_202.a = {
      tipo: 0,
      lugar: 0,
      f_entrada: '',
      f_salida: '',
    };
  }

  // Borra los datos cuando se cambia de tipo de solicitud en el
  // modal "Agregar un servicio"
  SR_changeSolicitud_resetData(value: string){
    this.SR_modalData = new AllModalData();

    this.SR_modalData.m_202.tipoSolicitud = value;
  }

  //alertas on link
  async confirmAlert(message: string, color: string = '', data: any) {
    const toast = await this.toast.create({
      message: message, color: color, buttons: [
        {
          side: 'end',
          text: 'confirmar',
          handler: () => {
            switch(data.tipo){
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                this.SR_borrarInfoCompra(data);
                break;
              case 9: // Eliminar Vuelo
                this.SR_eliminarCotizacion(1, data.i);
                break;
              case 19: // Eliminar Hospedaje
                this.SR_eliminarCotizacion(2, data.i);
                break;
              case 29: // Eliminar Auto
                this.SR_eliminarCotizacion(3, data.i);
                break;
              case 1001: // Cancelar solicitud
                this.SR_createModal(data.tipo, null);
                break;
              default:
                this.service.createAlert('Vuelva a intentarlo.', 'warning');
                break;
            }
          }
        },
        {
          side: 'end',
          icon: 'close',
          handler: () => {
            this.btn_cancelAction = false;
            toast.dismiss();
          }
        }
      ]
    });
    return toast.present();
  }

}
