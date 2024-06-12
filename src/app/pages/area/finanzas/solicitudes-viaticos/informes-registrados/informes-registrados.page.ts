import { Component, OnInit, ViewChild } from '@angular/core';
import { FinanzasService } from 'src/app/servicios/finanzas/finanzas.service';
import { formatCurrency } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonInfiniteScroll, ToastController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-informes-registrados',
  templateUrl: './informes-registrados.page.html',
  styleUrls: ['./informes-registrados.page.scss'],
})
export class InformesRegistradosPage implements OnInit {

  @ViewChild('ModalDetalles') ModalDetalles: any;
  @ViewChild('ModalComentario') ModalComentario: any;
  @ViewChild('ModalAdeudo') ModalAdeudo: any;
  @ViewChild('ModalAnexos') ModalAnexos: any;
  @ViewChild('searchInput') searchInput: any;
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  showSearchbar: boolean = false;
  search: any;
  limite: number = 20;
  length: number = 0;

  segment: string = 'Pendientes';

  // INFORMACIÓN DE LOS SEGMENTOS
  btn_changeSegment: boolean = false;
  IR_pendientes: Array<any> = [];
  IR_aprobadas: Array<any> = [];
  IR_rechazadas: Array<any> = [];
  IR_adeudosRecibidos: Array<any> = [];
  IR_adeudosSinEnviar: Array<any> = [];
  IR_adeudosPagados: Array<any> = [];

  // MODAL VARIABLES
  modalDetalles: boolean = false;
  IR_modalDetalles: any = {
    id: 0,
    informe: '',
    solicitante: '',
    autoriza: '',
    clave: '',
    departamento: '',
    geografica: '',
    proyecto_servicio: '',
    monto_adeudo: '',
    fecha: ''
  };
  modalComentario: boolean = false;
  modal_comentario: any = {
    tipo: '',
    comment: '',
    id: null
  };
  modalAdeudo: boolean = false;
  modal_adeudo: any = {
    id_adeudo: null,
    monto: 0
  };
  modalAnexos: boolean = false;
  modal_anexos: Array<any> = [];
  modal_anexosEliminar: boolean = false;
  modal_anexosSelect: any = {
    index: 0,
    tipo: 0,
    nombre: 0
  };

  IR_enProceso: boolean = true;
  IR_tableFull: boolean = false;

  IR_showLoader: boolean = false;

  constructor(private service: FinanzasService,
              private toast: ToastController,
              private router: Router,
              private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.IR_changeSegment(this.segment);
  }

  //FOCUS BÚSQUEDA
  focus() {
    setTimeout(() => {
      this.searchInput.setFocus();
    }, 500);
  }

  addItems(event: any) {
    event.target.complete();
    this.limite += 20;
  }

  IR_cleanVariable(){
    this.IR_enProceso = true;
    this.IR_tableFull = false;

    this.limite = 20;
    this.length = 0;

    // INFORMACIÓN DE LOS SEGMENTOS
    this.IR_pendientes = [];
    this.IR_aprobadas = [];
    this.IR_rechazadas = [];
    this.IR_adeudosRecibidos = [];
    this.IR_adeudosSinEnviar = [];
    this.IR_adeudosPagados = [];

    this.modalDetalles = false;
    this.IR_modalDetalles = {
      id: 0,
      informe: '',
      solicitante: '',
      clave: '',
      departamento: '',
      geografica: '',
      proyecto_servicio: '',
      monto_adeudo: '',
      fecha: ''
    };
    this.modalComentario = false;
    this.modal_comentario = {
      tipo: '',
      comment: '',
      id: null
    };
    this.modalAdeudo = false;
    this.modal_adeudo = {
      id_adeudo: null,
      monto: 0
    }
    this.modalAnexos = false;
    this.modal_anexosEliminar = false;
    this.modal_anexos = [];
    this.modal_anexosSelect = {
      index: 0,
      tipo: 0,
      nombre: 0
    };

  }

  IR_changeSegment(value: any){
    this.IR_cleanVariable();
    this.segment = value;
    this.btn_changeSegment = true;
    switch(value){
      case 'Pendientes':
        this.IR_getInformes(1);
        break;
      case 'Aprobadas':
        this.IR_getInformes(2);
        break;
      case 'Rechazadas':
        this.IR_getInformes(3);
        break;
      case 'Adeudos recibidos':
        this.IR_getInformes(4);
        break;
      case 'Adeudos sin enviar':
        this.IR_getInformes(5);
        break;
      case 'Adeudos pagados':
        this.IR_getInformes(6);
        break;
      default:
        this.btn_changeSegment = false;
        break;
    }
  }

  async IR_getInformes(value: any){
    this.IR_showLoader = true;

    this.service.IR_getInformes({segment: value, search: this.search}).subscribe(
      r => {
        this.IR_showLoader = false;

        this.IR_enProceso = false;

        if(r == null)
          this.service.createAlert("Error al buscar la información. Intente de nuevo.", "danger");
        else{
          var Informes: Array<any> = r as any;
          this.length = Object.keys(r).length;

          if(this.length > 0){
            this.IR_tableFull = true;

            switch(this.segment){
              case 'Pendientes':
                this.IR_pendientes = Informes;
                break;
              case 'Aprobadas':
                this.IR_aprobadas = Informes;
                break;
              case 'Rechazadas':
                this.IR_rechazadas = Informes;
                break;
              case 'Adeudos recibidos':
                this.IR_adeudosRecibidos = Informes;
                break;
              case 'Adeudos sin enviar':
                this.IR_adeudosSinEnviar = Informes;
                break;
              case 'Adeudos pagados':
                this.IR_adeudosPagados = Informes;
                break;
            }
          }
        }

        this.btn_changeSegment = false;
      },
      e => {
        this.IR_showLoader = false;

        this.IR_enProceso = false;
        this.IR_tableFull = false;

        console.log(e);
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        this.btn_changeSegment = false;
      }
    );
  }

  // Detalles de los informes
  IR_openModal_detalles(index: number){
    this.ModalDetalles.onDidDismiss().then(() => this.modalDetalles = false);
    this.modalDetalles = true;

    this.IR_modalDetalles = {
      id: 0,
      informe: '',
      solicitante: '',
      autoriza: '',
      clave: '',
      departamento: '',
      geografica: '',
      proyecto_servicio: '',
      monto_adeudo: '',
      fecha: ''
    };

    switch(this.segment){
      case 'Pendientes':
        this.IR_modalDetalles.id = this.IR_pendientes[index].gas_id;
        this.IR_modalDetalles.informe = this.IR_pendientes[index].gas_nombreInforme;
        this.IR_modalDetalles.solicitante = this.IR_pendientes[index].solicitante;
        this.IR_modalDetalles.autoriza = this.IR_pendientes[index].lider;
        this.IR_modalDetalles.clave = this.IR_pendientes[index].gas_claveInforme;
        this.IR_modalDetalles.departamento = this.IR_pendientes[index].sol_departamentos_id;
        this.IR_modalDetalles.geografica = this.IR_pendientes[index].sol_geografica_id;
        this.IR_modalDetalles.proyecto_servicio = this.IR_pendientes[index].gas_proyecto;
        this.IR_modalDetalles.monto_adeudo = this.IR_pendientes[index].solicitado_n;
        this.IR_modalDetalles.fecha = this.IR_pendientes[index].gas_fechaElaboracion_n;
        break;
      case 'Aprobadas':
        this.IR_modalDetalles.id = this.IR_aprobadas[index].gas_id;
        this.IR_modalDetalles.informe = this.IR_aprobadas[index].gas_nombreInforme;
        this.IR_modalDetalles.solicitante = this.IR_aprobadas[index].solicitante;
        this.IR_modalDetalles.autoriza = this.IR_aprobadas[index].lider;
        this.IR_modalDetalles.clave = this.IR_aprobadas[index].gas_claveInforme;
        this.IR_modalDetalles.departamento = this.IR_aprobadas[index].sol_departamentos_id;
        this.IR_modalDetalles.geografica = this.IR_aprobadas[index].sol_geografica_id;
        this.IR_modalDetalles.proyecto_servicio = this.IR_aprobadas[index].gas_proyecto;
        this.IR_modalDetalles.monto_adeudo = this.IR_aprobadas[index].solicitado_n;
        this.IR_modalDetalles.fecha = this.IR_aprobadas[index].gas_fechaElaboracion_n;
        break;
      case 'Rechazadas':
        this.IR_modalDetalles.id = this.IR_rechazadas[index].gas_id;
        this.IR_modalDetalles.informe = this.IR_rechazadas[index].gas_nombreInforme;
        this.IR_modalDetalles.solicitante = this.IR_rechazadas[index].solicitante;
        this.IR_modalDetalles.autoriza = this.IR_rechazadas[index].lider;
        this.IR_modalDetalles.clave = this.IR_rechazadas[index].gas_claveInforme;
        this.IR_modalDetalles.departamento = this.IR_rechazadas[index].sol_departamentos_id;
        this.IR_modalDetalles.geografica = this.IR_rechazadas[index].sol_geografica_id;
        this.IR_modalDetalles.proyecto_servicio = this.IR_rechazadas[index].gas_proyecto;
        this.IR_modalDetalles.monto_adeudo = this.IR_rechazadas[index].solicitado_n;
        this.IR_modalDetalles.fecha = this.IR_rechazadas[index].gas_fechaElaboracion_n;
        break;
      case 'Adeudos recibidos':
        this.IR_modalDetalles.id = this.IR_adeudosRecibidos[index].deuda_informe_id;
        this.IR_modalDetalles.informe = this.IR_adeudosRecibidos[index].nombre_informe;
        this.IR_modalDetalles.solicitante = this.IR_adeudosRecibidos[index].solicitante;
        this.IR_modalDetalles.autoriza = '';
        this.IR_modalDetalles.clave = this.IR_adeudosRecibidos[index].gas_claveInforme;
        this.IR_modalDetalles.departamento = this.IR_adeudosRecibidos[index].sol_departamentos_id;
        this.IR_modalDetalles.geografica = this.IR_adeudosRecibidos[index].sol_geografica_id;
        this.IR_modalDetalles.proyecto_servicio = this.IR_adeudosRecibidos[index].proy;
        this.IR_modalDetalles.monto_adeudo = this.IR_adeudosRecibidos[index].deuda_monto_n;
        this.IR_modalDetalles.fecha = this.IR_adeudosRecibidos[index].gas_fechaElaboracion_n;
        break;
      case 'Adeudos sin enviar':
        this.IR_modalDetalles.id = this.IR_adeudosSinEnviar[index].deuda_informe_id;
        this.IR_modalDetalles.informe = this.IR_adeudosSinEnviar[index].nombre_informe;
        this.IR_modalDetalles.solicitante = this.IR_adeudosSinEnviar[index].solicitante;
        this.IR_modalDetalles.autoriza = '';
        this.IR_modalDetalles.clave = this.IR_adeudosSinEnviar[index].gas_claveInforme;
        this.IR_modalDetalles.departamento = this.IR_adeudosSinEnviar[index].sol_departamentos_id;
        this.IR_modalDetalles.geografica = this.IR_adeudosSinEnviar[index].sol_geografica_id;
        this.IR_modalDetalles.proyecto_servicio = this.IR_adeudosSinEnviar[index].proy;
        this.IR_modalDetalles.monto_adeudo = this.IR_adeudosSinEnviar[index].deuda_monto_n;
        this.IR_modalDetalles.fecha = this.IR_adeudosSinEnviar[index].gas_fechaElaboracion_n;
        break;
      case 'Adeudos pagados':
        this.IR_modalDetalles.id = this.IR_adeudosPagados[index].deuda_informe_id;
        this.IR_modalDetalles.informe = this.IR_adeudosPagados[index].nombre_informe;
        this.IR_modalDetalles.solicitante = this.IR_adeudosPagados[index].solicitante;
        this.IR_modalDetalles.autoriza = '';
        this.IR_modalDetalles.clave = this.IR_adeudosPagados[index].gas_claveInforme;
        this.IR_modalDetalles.departamento = this.IR_adeudosPagados[index].sol_departamentos_id;
        this.IR_modalDetalles.geografica = this.IR_adeudosPagados[index].sol_geografica_id;
        this.IR_modalDetalles.proyecto_servicio = this.IR_adeudosPagados[index].proy;
        this.IR_modalDetalles.monto_adeudo = this.IR_adeudosPagados[index].deuda_monto_n;
        this.IR_modalDetalles.fecha = this.IR_adeudosPagados[index].gas_fechaElaboracion_n;
        break;
    }
  }

  // Comentario para la acción regresar
  // ********** **** ** ****** Ocular/Rechazar
  IR_openModal_comentario(tipo: string, value: number){
    this.ModalComentario.onDidDismiss().then(() => {
      this.modalComentario = false;
      this.modal_comentario = {
        tipo: '',
        comment: '',
        id: null
      };
    });
    this.modalComentario = true;

    this.modal_comentario = {
      tipo: tipo,
      comment: '',
      id: value
    }
  }

  IR_openModal_adeudo(id: number){
    this.ModalAdeudo.onDidDismiss().then(() => {
      this.modalAdeudo = false;
      this.modal_adeudo = {
        id_adeudo: null,
        monto: 0
      };
    });

    this.modalAdeudo = true;
    this.modal_adeudo = {
      id_adeudo: id,
      monto: 0
    }

    this.IR_getGasto_montoAdeudo();
  }

  IR_viewPDF(file: any){
    return this.sanitizer.bypassSecurityTrustResourceUrl("http://intranet.ecn.com.mx:8060/intranet/modulos/ecntur/aprobaciones/Anexos/"+file);
  }

  async IR_openModal_anexos(id: number){
    this.IR_showLoader = true;

    this.ModalAnexos.onDidDismiss().then(() => {
      this.modalAnexos = false;
      this.modal_anexosEliminar = false;
      this.modal_anexos = [];
      this.modal_anexosSelect = {
        index: 0,
        tipo: 0,
        nombre: 0
      }
    });

    this.modalAnexos = true;
    this.service.IR_gastoAnexos({id: id}).subscribe(
      (r:any) => {
        this.modal_anexosEliminar = (r[0] == 1) ? true : false;
        var list = r[1] as any;
        for (let i = 0; i < list.length; i++) {
          var file = String(list[i].nombre).split('.') as any;
          file = file[file.length - 1];
          file =  (
                    file == 'jpg' || file == 'JPG' ||
                    file == 'png' || file == 'PNG' ||
                    file == 'jpeg' || file == 'JPEG'
                  ) ? 1 :
                  ( file == 'pdf' || file == 'PDF') ? 2 :
                  ( file == 'xml' || file == 'XML') ? 3 : 0;
          this.modal_anexos[i] = {
            nombre: list[i].nombre,
            tipo: Number(file)
          };
        }

        this.IR_showLoader = false;
      },
      e => {
        this.IR_showLoader = false;

        console.log(e);
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
      }
    );
  }

  IR_changeAnexoSelect(){
    this.modal_anexosSelect.nombre = this.modal_anexos[this.modal_anexosSelect.index].nombre;
    this.modal_anexosSelect.tipo = this.modal_anexos[this.modal_anexosSelect.index].tipo;
  }

  async IR_getGasto_montoAdeudo(){
    this.IR_showLoader = true;

    this.service.IR_gasto_montoAdeudo({id: this.modal_adeudo.id_adeudo}).subscribe(
      r => {
        this.IR_showLoader = false;

        this.modal_adeudo.monto = r as any;
      },
      e => {
        this.IR_showLoader = false;

        console.log(e);
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
      }
    );
  }

  async IR_btn_acciones(tipo: string, id: number){
    this.IR_showLoader = true;
    switch(tipo){
      case 'gastos':
        this.IR_showLoader = false;
        sessionStorage.setItem('informe', id.toString());
        this.router.navigate(['tabs/area/informes-registrados/ver-gastos']);
        break;
      case 'regresar':
        this.service.IR_gastoRegresar({
          id: this.modal_comentario.id,
          comment: this.modal_comentario.comment,
          tipo: this.modal_comentario.tipo
        }).subscribe(
          r => {
            this.IR_showLoader = false;

            if(r == 1)
              this.service.createAlert('Se regreso el gasto.', 'success');
            else
              this.service.createAlert('Error al actualizar. Intente lo de nuevo.', 'error');


            this.IR_changeSegment(this.segment);
          },
          e => {
            this.IR_showLoader = false;

            console.log(e);
            this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
            this.btn_changeSegment = false;

            this.IR_changeSegment(this.segment);
          }
        );
        break;
      case 'depositado':
        this.service.IR_gastoDepositado({
          id: this.modal_adeudo.id_adeudo,
          monto: this.modal_adeudo.monto
        }).subscribe(
          r => {
            this.IR_showLoader = false;

            if(r == 1)
              this.service.createAlert('Adeudo aprobado.', 'success');
            else
              this.service.createAlert('Error al actualizar. Intente lo de nuevo.', 'error');

            this.IR_changeSegment(this.segment);
          },
          e => {
            this.IR_showLoader = false;

            console.log(e);
            this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');

            this.IR_changeSegment(this.segment);
          }
        );
        break;
      case 'ocultar':
        this.confirmAlert('¿Estás seguro que quieres rechazar el adeudo?', 'danger', {
          tipo: tipo,
          id: id,
          user: parseInt(localStorage.getItem('id_colaborador')!)
        });
        break;
      case 'comprobante':
        this.IR_openModal_anexos(id);
        break;
    }

    this.IR_showLoader = false;
  }

  //alertas on link
  async confirmAlert(message: string, color: string = '', datas: any) {
    const toast = await this.toast.create({
      message: message, color: color, buttons: [
        {
          side: 'end',
          text: 'confirmar',
          handler: () => {
            switch(datas.tipo){
              case 'ocultar':
                this.service.IR_gastoOcultar({
                  id: datas.id,
                  user: datas.user
                }).subscribe(
                  r => {
                    this.IR_showLoader = false;

                    if(r == 1)
                      this.service.createAlert('Adeudo aprobado.', 'success');
                    else
                      this.service.createAlert('Error al actualizar. Intente lo de nuevo.', 'error');

                    this.IR_changeSegment(this.segment);
                  },
                  e => {
                    this.IR_showLoader = false;

                    console.log(e);
                    this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
                  }
                );
                break;
            }
          }
        },
        {
          side: 'end',
          text: 'close',
          handler: () => {
            toast.dismiss();
          }
        }
      ]
    });
    return toast.present();
  }

}
