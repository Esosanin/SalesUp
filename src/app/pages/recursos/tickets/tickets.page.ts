import { Component, OnInit, ViewChild } from '@angular/core';
import { TicketsService } from 'src/app/servicios/tickets/tickets.service';
//import { MultipleDocumentsPicker } from '@awesome-cordova-plugins/multiple-document-picker/ngx';
//import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { IonInput, IonModal, Platform } from '@ionic/angular';
import { Ticket } from 'src/app/model/recursos/tickets/Ticket';
import { CuentaService } from 'src/app/servicios/cuenta/cuenta.service';
//import { File } from '@ionic-native/file/ngx';
//import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';


var formData = new FormData();

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss'],
})




export class TicketsPage implements OnInit {

  @ViewChild('ticketForm') ticketForm: any;
  @ViewChild('file', { static: false }) file!: IonInput;
  @ViewChild('detallesModal', { static: false }) detallesModal!: IonModal;

  filesUrl: string = 'http://intranet.ecn.com.mx:8060/lineup/public/files/recursos/tickets/';

  //filesUrl: string = 'http://192.168.1.66:8080/public/files/recursos/tickets/';
  requisitos: string = '';
  areas: Array<any> = [];
  categorias: any = [];

  ticketData = new Ticket();

  archivosSol: Array<any> = [];
  archivosRes: Array<any> = [];

  nombre_colaborador: string = localStorage.getItem('nombre_colaborador')!;

  idticket: number = 0;

  archivos: any = [];

  openTicket: boolean = false;
  nombre_area: string = '';
  nombre_subcategoria: string = '';
  comentario_responsable: string = '';
  responsable: string = '';
  grupoNombre: string = '';
  fechaCreacion: string = '';
  fechaAtencion: string = '';
  fechaFinalizacion: string = '';

  grupos: any = [
    {
      nombre: "En espera",
      id: 1,
      tickets: []
    },
    {
      nombre: "En proceso",
      id: 2,
      tickets: []
    },
    {
      nombre: "Aprobado",
      id: 3,
      tickets: []
    },
    {
      nombre: "Rechazado",
      id: 4,
      tickets: []
    },
  ];
  tickets: any = [];
  id_colaborador: number = localStorage.getItem('id_colaborador') ? parseInt(localStorage.getItem('id_colaborador')!) : 0;

  constructor(private service: TicketsService,
    // private chooser: MultipleDocumentsPicker,
    // private transfer: FileTransfer,
    private platform: Platform,
    public service2: CuentaService) {
    //private file: File,
    //private fileOpener: FileOpener) {
  }

  refresh(event: any) {
    this.ngOnInit();
    event.target.complete();
  }

  ngOnInit() {
    this.ticketData = new Ticket();
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.openTicket = false;
    });
    this.grupos[0]['tickets'] = [];
    this.grupos[1]['tickets'] = [];
    this.grupos[2]['tickets'] = [];
    this.grupos[3]['tickets'] = [];
    let json = { id_colaborador: this.id_colaborador };
    this.service.getTicketsUsuario(json).subscribe(r => {
      this.tickets = r;
      for (let i = 0; i < this.tickets.length; i++) {
        if (this.tickets[i]['ticket_estado'] === 1) {
          this.grupos[0]['tickets'].push(this.tickets[i]);
        } else if (this.tickets[i]['ticket_estado'] === 2) {
          this.grupos[1]['tickets'].push(this.tickets[i]);
        } else if (this.tickets[i]['ticket_estado'] === 3) {
          this.grupos[2]['tickets'].push(this.tickets[i]);

        } else if (this.tickets[i]['ticket_estado'] === 4) {
          this.grupos[3]['tickets'].push(this.tickets[i]);

        }
      }
    });

    this.service.getAreas().subscribe(r => {
      this.areas = r;
    });
  }

  openFile(archivo: string){
    window.open(this.filesUrl + archivo);
  }

  // openFileExternal(url: string, filename: string) {
  //   const fileTransfer: FileTransferObject = this.transfer.create();
  //   const directory = this.file.dataDirectory;
  //   // let options: FileUploadOptions = {
  //   //   fileKey: 'file',
  //   //   fileName: 'asistencia.xlxs',
  //   //   headers: {}
  //   // };
  //   fileTransfer.download(encodeURI(url) + filename, directory + filename).then(
  //     entry => {
  //       if(filename.split('.')[1]=='xlsx'){
  //         this.fileOpener.open(directory + filename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  //         .catch(
  //           e => alert(JSON.stringify(e))
  //         );
  //       }else if(filename.split('.')[1]=='pdf'){
  //         this.fileOpener.open(directory + filename, 'application/pdf')
  //         .catch(
  //           e => alert(JSON.stringify(e))
  //         );
  //       }
  //     }, error => alert(JSON.stringify(error)));
  // }

  enviarSolicitud() {
    formData.append('datos', JSON.stringify(this.ticketData));
    // if (this.ticketData.archivos.length > 0) {
    //   const fileTransfer: FileTransferObject = this.transfer.create();
    //   for (let i = 0; i < this.ticketData.archivos.length; i++) {
    //     let options: FileUploadOptions = {
    //       fileKey: 'file',
    //       fileName: this.ticketData.archivos[i].name,
    //       headers: {}
    //     };

    //     fileTransfer.upload(this.ticketData.archivos[i].uri, 'http://intranet.ecn.com.mx:8060/api/public/api/tickets/upload', options)
    //       .catch(e => alert(JSON.stringify(e)));
    //   }
    // }
    this.service.nuevaSolicitud(formData).subscribe(
      () => {
        formData = new FormData();
        this.ticketForm.reset();
        this.ticketData = new Ticket();
        this.service.createAlert('Solicitud enviada.', 'success');
        this.grupos[0]['tickets'] = [];
        this.grupos[1]['tickets'] = [];
        this.grupos[2]['tickets'] = [];
        this.grupos[3]['tickets'] = [];
        this.archivos = [];
        this.ngOnInit();
        this.service2.segment = 'tickets';
      });
  }

  detallesTicket(id_ticket: number) {
    this.nombre_area = '';
    this.nombre_subcategoria = '';
    this.comentario_responsable = '';
    this.responsable = '';
    this.grupoNombre = '';
    this.fechaCreacion = '';
    this.detallesModal.onDidDismiss().finally(() => {
      this.openTicket = false;
      this.ticketData = new Ticket();
    })
    for (let i = 0; i < this.tickets.length; i++) {
      if (this.tickets[i].id_ticket == id_ticket) {
        this.ticketData.titulo_ticket = this.tickets[i].titulo_ticket;
        this.nombre_area = this.tickets[i].nombre_area;
        this.nombre_subcategoria = this.tickets[i].nombre_subcategoria;
        this.ticketData.descripcion_ticket = this.tickets[i].descripcion_ticket;
        if (this.tickets[i].ticket_estado == 3 || this.tickets[i].ticket_estado == 4) {
          this.comentario_responsable = this.tickets[i].comentario_responsable;
        }
        for (let z = 0; z < this.grupos.length; z++) {
          if (this.grupos[z].id == this.tickets[i].ticket_estado) {
            this.grupoNombre = this.grupos[z].nombre;
          }
        }
        if (this.tickets[i].fechaHora_ticket && this.tickets[i].fechaHora_ticket != '') {
          this.fechaCreacion = this.tickets[i].fechaHora_ticket;
        }
        if (this.tickets[i].fechaHora_ticket_Atencion && this.tickets[i].fechaHora_ticket_Atencion != '') {
          this.fechaAtencion = this.tickets[i].fechaHora_ticket_Atencion;
        }
        if (this.tickets[i].fechaHora_ticket_Finalizacion && this.tickets[i].fechaHora_ticket_Finalizacion != '') {
          this.fechaFinalizacion = this.tickets[i].fechaHora_ticket_Finalizacion;
        }
        this.responsable = this.tickets[i].responsable + ' ' + this.tickets[i].responsable_ap + ' ' + this.tickets[i].responsable_am;
      }
    }
    this.getArchivos(id_ticket).finally(()=>{
      this.openTicket = true;
    });
  }

  addFiles() {
    this.file.getInputElement().then(input => {
      if (input.files!.length > 0) {
        for (let i = 0; i < input.files!.length; i++) {
          formData.append("archivos[]", input.files![i]);
          this.archivos.push(input.files![i]);
        }
      }
    });
  }

  anexar() {
    this.file.getInputElement().then(input => {
      input.click();
    });
    // this.chooser.pick(2).then(
    //   files => {
    //     let files2 = JSON.parse(files);
    //     for (let i = 0; i < files2.length; i++) {
    //       this.ticketData.archivos.push(files2[i]);
    //       this.archivos.push(files2[i]);
    //     }
    //   }
    // ).catch(e=>console.log(e));
  }

  vaciar() {
    this.archivos = [];
  }

  areaChange() {
    this.categorias = [];
    this.ticketData.id_subarea = 0;
    this.service.getCategorias(this.ticketData.id_area).subscribe(r => {
      this.categorias = r;
    });
  }

  categoriaChange() {
    this.requisitos = '';
    this.categorias.forEach((r3: any) => {
      if (r3['id_subcategoria'] == this.ticketData.id_subarea) {
        this.requisitos = r3['requisitos'];
      }
    });

  }

  async getArchivos(id_ticket: number) {
    return new Promise(res => {
      this.archivosSol = [];
      this.archivosRes = [];
      var json = { id_ticket: id_ticket };
      this.service.getArchivos(json).subscribe(r => {
        let arr = r as any;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].tipo_archivo == 1) {
            this.archivosSol.push(arr[i]);
          }
          if (arr[i].tipo_archivo == 2) {
            this.archivosRes.push(arr[i]);
          }
        }
        res(true);
      });
  });
}
}
