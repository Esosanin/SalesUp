import { Component, OnInit, ViewChild } from '@angular/core';
import { FinanzasService } from 'src/app/servicios/finanzas/finanzas.service';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-solicitudes-deposito',
  templateUrl: './solicitudes-deposito.page.html',
  styleUrls: ['./solicitudes-deposito.page.scss'],
})
export class SolicitudesDepositoPage implements OnInit {

  @ViewChild('searchInput') searchInput: any;
  @ViewChild('ModalComentario') ModalComentario: any;
  @ViewChild('ModalDetalles') ModalDetalles: any;
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  showSearchbar: boolean = false;
  btn_changeSegment: boolean = false;
  segment: string = 'por depositar';
  limite: number = 20;
  length: number = 0;

  SD_solicitudesDeposito: Array<any> = [];
  search: any = '';

  modalComentarios: boolean = false;
  SD_modalComentario: any = {
    sol_id: 0,
    usuario: localStorage.getItem('id_colaborador'),
    tipo: 0,
    comment: ''
  }
  modalDetalles: boolean = false;
  SD_modalDetalles: any = null;

  SD_listFull: boolean = false;
  SD_showLoader: boolean = false;

  constructor(private service: FinanzasService,
              private router: Router) { }

  ngOnInit() {
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

  SD_clearVariables(){
    this.btn_changeSegment = false;
    this.SD_solicitudesDeposito = [];

    this.modalComentarios = false;
    this.SD_modalComentario = {
      sol_id: 0,
      url: window.location.host,
      usuario: localStorage.getItem('id_colaborador'),
      tipo: 0,
      comment: ''
    }

    this.modalDetalles = false;
    this.SD_modalDetalles = null;

    this.SD_listFull = false;
  }

  onChangeSegment(){
    this.SD_clearVariables();
    this.btn_changeSegment = true;
    switch(this.segment){
      case 'por depositar': this.SD_getSolicitudes(1); break;
      case 'pagadas': this.SD_getSolicitudes(2); break;
    }
  }

  async SD_getSolicitudes(type: number){
    this.limite = 20;

    this.SD_showLoader = true;
    this.service.SD_getSolicitudes({type: type, search: this.search}).subscribe(
      r => {
        this.SD_showLoader = false;

        this.btn_changeSegment = false;
        this.SD_solicitudesDeposito = r as any;
        this.length = Object.keys(r).length;
      },
      e => {
        this.SD_showLoader = false;

        this.btn_changeSegment = false;
        console.log(e);
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
      }
    );
  }

  SD_verSolicitud(id: number){
    sessionStorage.setItem('solicitud', id.toString());
    // Para redireccionar a la solicitud, se tiene que crear el path en el archivo module.ts
    // de esta misma carpeta
    this.router.navigate(['tabs/area/solicitudes-deposito/ver-solicitud']);
  }

  SD_openModal_detalles(index: number){
    this.ModalDetalles.onDidDismiss().then(() => {
      this.modalDetalles = false;
      this.SD_modalDetalles = null;
    });
    this.modalDetalles = true;
    this.SD_modalDetalles = this.SD_solicitudesDeposito[index];
  }

  SD_openModal_comentarios(value: number){
    this.ModalComentario.onDidDismiss().then(() => {
      this.modalComentarios = false;

      this.SD_modalComentario = {
        sol_id: 0,
        usuario: localStorage.getItem('id_colaborador'),
        tipo: 0,
        comment: ''
      }
    });
    this.modalComentarios = true;

    this.SD_modalComentario.sol_id = value;
    this.SD_modalComentario.tipo = 4;
    this.SD_modalComentario.comment = '';
  }

  // Comentario finalizado para el envío de datos
  // Se uso el mismo metodo que en "Solicitudes-registradas"
  async SD_comentario(){
    this.SD_showLoader = true;

    this.service.SR_updateSolicitudesFinanzas_acciones(this.SD_modalComentario).subscribe(
      r => {
        var data = r as any;
        switch(data.tipo){
          case 1: // Depositar
            if(data.result == 1)
              this.service.createAlert('Solicitud en depósito.', 'success');
            else if(data.result == 2)
              this.service.createAlert('Solicitud en depósito. No se envío notificación al solicitante.', 'success');
            else
              this.service.createAlert('No se actualizo. Intente de nuevo.', 'danger');
            break;
          case 2: // Retener
            if(data.result == 1)
              this.service.createAlert('Solicitud retenida.', 'success');
            else if(data.result == 2)
              this.service.createAlert('Solicitud retenida. No se envío notificación al solicitante.', 'success');
            else
              this.service.createAlert('No se actualizo. Intente de nuevo.', 'danger');
            break;
          case 4: // Archviar
            if(data.result == 1)
              this.service.createAlert('Solicitud depositada.', 'success');
            else if(data.result == 2)
              this.service.createAlert('Solicitud depositada. No se envío notificación al solicitante.', 'success');
            else
              this.service.createAlert('No se actualizo. Intente de nuevo.', 'danger');
            break;
        }

        this.onChangeSegment();
      },
      e => {
        this.SD_showLoader = false;
        this.onChangeSegment();

        console.log(e);
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
      }
    );
  }




}
