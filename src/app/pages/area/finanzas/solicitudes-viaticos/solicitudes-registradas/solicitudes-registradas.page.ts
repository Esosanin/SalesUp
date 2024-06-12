import { Component, OnInit, ViewChild } from '@angular/core';
import { FinanzasService } from 'src/app/servicios/finanzas/finanzas.service';
import { IonContent, ToastController } from '@ionic/angular';
import { formatCurrency } from '@angular/common';
import { Router } from '@angular/router';

interface solicitudFinanzas {
  sol_id: number;
  fechaRecepcion: string;
  nombreSolicitud: string;
  nombreSolicitante: string;
  motivoViaje: string;
  cuentaBBVA: number;
  clabe: number;
  depto: string;
  geo: string;
  proyecto: string;
  autoriza: string;
  montoSolicitado: string;
  pago: string;
  codigo: string;
}

@Component({
  selector: 'app-solicitudes-registradas',
  templateUrl: './solicitudes-registradas.page.html',
  styleUrls: ['./solicitudes-registradas.page.scss'],
})
export class SolicitudesRegistradasPage implements OnInit {

  @ViewChild('searchInput') searchInput: any;
  @ViewChild('ModalComentario') ModalComentario: any;
  @ViewChild('ModalDetalles') ModalDetalles: any;
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  segment: string = 'Pendientes';
  title: string = 'Pendientes';
  btn_changeSegment: boolean = false;

  showSearchbar: boolean = false;
  search: string = '';
  limite: number = 20;
  length: number = 0;

  commentAlert: string = '';
  SR_acciones: any;

  // Pendientes
  SR_solicitudesFinanzas_Pendintes: Array<any> = [];

  // Aprobadas
  SR_solicitudesFinanzas_Aprobadas: Array<any> = [];

  // Depositadas
  SR_solicitudesFinanzas_Depositadas: Array<any> = [];

  // Detalles de solicitud
  SR_SolicitudFinanzas_Detalles: solicitudFinanzas = {
    sol_id: 0,
    fechaRecepcion: '',
    nombreSolicitud: '',
    nombreSolicitante: '',
    motivoViaje: '',
    cuentaBBVA: 0,
    clabe: 0,
    depto: '',
    geo: '',
    proyecto: '',
    autoriza: '',
    montoSolicitado: '',
    pago: '',
    codigo: ''
  };

  // MODAL
  modalComentario: boolean = false;
  modalDetalles: boolean = false;

  constructor(private finanzasService: FinanzasService,
              private toast: ToastController,
              private router: Router) { }

  ngOnInit() {
    this.btn_changeSegment = false;
    this.search = '';
    this.onChangeSegment();
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

  // Cambio de segmentos | Pendientes | Aprobadas | Depositadas |
  onChangeSegment(){
    this.btn_changeSegment = true;
    this.limite = 20;
    switch(this.segment){
      case 'Pendientes':
        this.SR_getSolicitudesFinanzas_Pendientes();
        break;
      case 'Aprobadas':
        this.SR_getSolicitudesFinanzas_Aprobadas();
        break;
      case 'Depositadas':
        this.SR_getSolicitudesFinanzas_Depositadas();
        break;
    }
    this.title = this.segment;
  }

  // Segmento Pendientes
  async SR_getSolicitudesFinanzas_Pendientes(){
    this.finanzasService.SR_getSolicitudesFinanzas_Pendientes({search: this.search}).subscribe(
      r => {
        this.SR_solicitudesFinanzas_Pendintes = [];
        this.length = Object.keys(r).length;
        if(this.length > 0)
          this.SR_solicitudesFinanzas_Pendintes = r as any;

        this.btn_changeSegment = false;
      },
      e => {
        console.log(e);
        this.finanzasService.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
      }
    );
  }

  // Segmento Aprobadas
  async SR_getSolicitudesFinanzas_Aprobadas(){
    this.finanzasService.SR_getSolicitudesFinanzas_Aprobadas({search: this.search}).subscribe(
      r => {
        this.SR_solicitudesFinanzas_Aprobadas = [];
        this.length = Object.keys(r).length;
        if(this.length > 0)
          this.SR_solicitudesFinanzas_Aprobadas = r as any;
        this.btn_changeSegment = false;
      },
      e => {
        console.log(e);
        this.finanzasService.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
      }
    );
  }

  // Segmento Depositadas
  async SR_getSolicitudesFinanzas_Depositadas(){
    this.finanzasService.SR_getSolicitudesFinanzas_Depositadas({search: this.search}).subscribe(
      r => {
        this.SR_solicitudesFinanzas_Depositadas = [];
        this.length = Object.keys(r).length;
        if(this.length > 0)
          this.SR_solicitudesFinanzas_Depositadas = r as any;
        this.btn_changeSegment = false;
      },
      e => {
        console.log(e);
        this.finanzasService.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
      }
    );
  }

  // Comentario finalizado para el envío de datos de cada acción
  async SR_comentario(){
    this.SR_acciones.comment = this.commentAlert;
    this.finanzasService.SR_updateSolicitudesFinanzas_acciones(this.SR_acciones).subscribe(
      r => {
        var data = r as any;
        switch(data.tipo){
          case 1: // Depositar
            if(data.result == 1)
              this.finanzasService.createAlert('Solicitud en depósito.', 'success');
            else if(data.result == 2)
              this.finanzasService.createAlert('Solicitud en depósito. No se envío notificación al solicitante.', 'success');
            else
              this.finanzasService.createAlert('No se actualizo. Intente de nuevo.', 'danger');
            break;
          case 2: // Retener
            if(data.result == 1)
              this.finanzasService.createAlert('Solicitud retenida.', 'success');
            else if(data.result == 2)
              this.finanzasService.createAlert('Solicitud retenida. No se envío notificación al solicitante.', 'success');
            else
              this.finanzasService.createAlert('No se actualizo. Intente de nuevo.', 'danger');
            break;
          case 4: // Archviar
            if(data.result == 1)
              this.finanzasService.createAlert('Solicitud depositada.', 'success');
            else if(data.result == 2)
              this.finanzasService.createAlert('Solicitud depositada. No se envío notificación al solicitante.', 'success');
            else
              this.finanzasService.createAlert('No se actualizo. Intente de nuevo.', 'danger');
            break;
          case 5: // Eliminar
            if(data.result == 1)
              this.finanzasService.createAlert('Solicitud eliminada.', 'success');
            else
              this.finanzasService.createAlert('No se actualizo. Intente de nuevo.', 'danger');
            break;
          case 6: // Regresar / Restaurar
            if(data.result == 1)
              this.finanzasService.createAlert('Solicitud regresada.', 'success');
            else
              this.finanzasService.createAlert('No se actualizo. Intente de nuevo.', 'danger');
            break;
        }
        this.onChangeSegment();
      },
      e => {
        console.log(e);
        this.finanzasService.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
      }
    );
  }

  // Modal detalles de la solicitud
  SR_modalDetalles(index: number){
    this.ModalDetalles.onDidDismiss().then(() => this.modalDetalles = false);
    this.modalDetalles = true;

    this.SR_SolicitudFinanzas_Detalles = {
      sol_id: 0,
      fechaRecepcion: '',
      nombreSolicitud: '',
      nombreSolicitante: '',
      motivoViaje: '',
      cuentaBBVA: 0,
      clabe: 0,
      depto: '',
      geo: '',
      proyecto: '',
      autoriza: '',
      montoSolicitado: '',
      pago: '',
      codigo: ''
    }
    switch(this.segment){
      case 'Pendientes':

        this.SR_SolicitudFinanzas_Detalles = {
          sol_id: this.SR_solicitudesFinanzas_Pendintes[index].sol_id,
          fechaRecepcion: this.SR_solicitudesFinanzas_Pendintes[index].sol_fecha_aprobacion_n + ' - ' + this.SR_solicitudesFinanzas_Pendintes[index].sol_hr_aprobacion_lider_n,
          nombreSolicitud: this.SR_solicitudesFinanzas_Pendintes[index].sol_nombre_solicitud,
          nombreSolicitante: this.SR_solicitudesFinanzas_Pendintes[index].nombre,
          motivoViaje: this.SR_solicitudesFinanzas_Pendintes[index].sol_motivo,
          cuentaBBVA: this.SR_solicitudesFinanzas_Pendintes[index].bbva,
          clabe: this.SR_solicitudesFinanzas_Pendintes[index].cuentabancaria,
          depto: this.SR_solicitudesFinanzas_Pendintes[index].sol_departamentos_id,
          geo: this.SR_solicitudesFinanzas_Pendintes[index].sol_geografica_id,
          proyecto: this.SR_solicitudesFinanzas_Pendintes[index].proy,
          autoriza: this.SR_solicitudesFinanzas_Pendintes[index].nombreAprob,
          montoSolicitado: formatCurrency(this.SR_solicitudesFinanzas_Pendintes[index].sumaTotal, 'en-US', '$', 'USD', '1.2-2'),
          pago: this.SR_solicitudesFinanzas_Pendintes[index].pago,
          codigo: this.SR_solicitudesFinanzas_Pendintes[index].codigo
        };
        break;
      case 'Aprobadas':
        this.SR_SolicitudFinanzas_Detalles = {
          sol_id: this.SR_solicitudesFinanzas_Aprobadas[index].sol_id,
          fechaRecepcion: this.SR_solicitudesFinanzas_Aprobadas[index].sol_fecha_aprobacion_n + ' - ' + this.SR_solicitudesFinanzas_Aprobadas[index].sol_hr_aprobacion_lider_n,
          nombreSolicitud: this.SR_solicitudesFinanzas_Aprobadas[index].sol_nombre_solicitud,
          nombreSolicitante: this.SR_solicitudesFinanzas_Aprobadas[index].nombre,
          motivoViaje: this.SR_solicitudesFinanzas_Aprobadas[index].sol_motivo,
          cuentaBBVA: this.SR_solicitudesFinanzas_Aprobadas[index].bbva,
          clabe: this.SR_solicitudesFinanzas_Aprobadas[index].cuentabancaria,
          depto: this.SR_solicitudesFinanzas_Aprobadas[index].sol_departamentos_id,
          geo: this.SR_solicitudesFinanzas_Aprobadas[index].sol_geografica_id,
          proyecto: this.SR_solicitudesFinanzas_Aprobadas[index].proy,
          autoriza: this.SR_solicitudesFinanzas_Aprobadas[index].nombreAprob,
          montoSolicitado: formatCurrency(this.SR_solicitudesFinanzas_Aprobadas[index].sumaTotal, 'en-US', '$', 'USD', '1.2-2'),
          pago: this.SR_solicitudesFinanzas_Aprobadas[index].pago,
          codigo: this.SR_solicitudesFinanzas_Aprobadas[index].codigo
        };
        break;
      case 'Depositadas':
        this.SR_SolicitudFinanzas_Detalles = {
          sol_id: this.SR_solicitudesFinanzas_Depositadas[index].sol_id,
          fechaRecepcion: this.SR_solicitudesFinanzas_Depositadas[index].sol_fecha_aprobacion_n + ' - ' + this.SR_solicitudesFinanzas_Depositadas[index].sol_hr_aprobacion_lider_n,
          nombreSolicitud: this.SR_solicitudesFinanzas_Depositadas[index].sol_nombre_solicitud,
          nombreSolicitante: this.SR_solicitudesFinanzas_Depositadas[index].nombre,
          motivoViaje: this.SR_solicitudesFinanzas_Depositadas[index].sol_motivo,
          cuentaBBVA: this.SR_solicitudesFinanzas_Depositadas[index].bbva,
          clabe: this.SR_solicitudesFinanzas_Depositadas[index].cuentabancaria,
          depto: this.SR_solicitudesFinanzas_Depositadas[index].sol_departamentos_id,
          geo: this.SR_solicitudesFinanzas_Depositadas[index].sol_geografica_id,
          proyecto: this.SR_solicitudesFinanzas_Depositadas[index].proy,
          autoriza: this.SR_solicitudesFinanzas_Depositadas[index].nombreAprob,
          montoSolicitado: formatCurrency(this.SR_solicitudesFinanzas_Depositadas[index].sumaTotal, 'en-US', '$', 'USD', '1.2-2'),
          pago: this.SR_solicitudesFinanzas_Depositadas[index].pago,
          codigo: this.SR_solicitudesFinanzas_Depositadas[index].codigo
        };
        break;
    }
  }

  // Dependiendo del boton y del segmento seleccionado, abrira el modal de comentarios
  // o realizara una confirmación.
  SR_btn_acciones(tipo: string, id: number){
    this.commentAlert = '';
    this.SR_acciones = {
      sol_id: id,
      url: window.location.host,
      usuario: localStorage.getItem('id_colaborador'),
      tipo: 0,
      comment: ''
    };
    switch(tipo){
      case 'depositar':
        this.ModalComentario.onDidDismiss().then(() => this.modalComentario = false);
        this.modalComentario = true;
        this.SR_acciones.tipo = 1;
        break;
      case 'retener':
        this.ModalComentario.onDidDismiss().then(() => this.modalComentario = false);
        this.modalComentario = true;
        this.SR_acciones.tipo = 2;
        break;
      case 'archivar':
        this.ModalComentario.onDidDismiss().then(() => this.modalComentario = false);
        this.modalComentario = true;
        this.SR_acciones.tipo = 4;
        break;
      case 'eliminar':
        this.SR_acciones.tipo = 5;
        this.confirmAlert('¿Seguró de eliminar la solicitud?', 'medium', {tipo: tipo});

        break;
      case 'regresar':
        this.SR_acciones.tipo = 6;
        this.confirmAlert('¿Seguró de restaurar la solicitud?', 'medium', {tipo: tipo});
        break;
    }
  }

  SR_openVerSolicitud(){
    sessionStorage.setItem('solicitud', this.SR_SolicitudFinanzas_Detalles.sol_id.toString());
    this.router.navigate(['tabs/area/solicitudes-registradas/ver-solicitud']);
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
              case 'eliminar':
              case 'regresar':
                this.SR_comentario();
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
