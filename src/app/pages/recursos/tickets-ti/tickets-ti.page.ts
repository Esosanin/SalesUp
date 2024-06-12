import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IonContent, IonInput, IonModal, LoadingController } from '@ionic/angular';
import { TicketsService } from 'src/app/servicios/tickets/tickets.service';


@Component({
  selector: 'app-tickets-ti',
  templateUrl: './tickets-ti.page.html',
  styleUrls: ['./tickets-ti.page.scss'],
})
export class TicketsTIPage implements OnInit {

  @ViewChild('detallesModal', { static: false }) detallesModal!: IonModal;
  @ViewChild('newTicketModal', { static: false }) newTicketModal!: IonModal;
  @ViewChild('archivo', { static: false }) archivo!: IonInput;
  @ViewChild('searchInput', { static: false }) searchInput!: IonInput;
  @ViewChild(IonContent, { static: false }) content!: IonContent;


  constructor(private service: TicketsService,
    private loadingController: LoadingController,
    public datePipe: DatePipe) { }

  tickets: any = [];
  tickets2: any = [];
  usuarios: any = [];
  usuarios2: any = [];
  openTicket: boolean = false;
  openNewTicket: boolean = false;
  ticketData: any = {};
  //ticketFiles: string = 'http://192.168.137.143:8080/public/files/recursos/tickets/';
  ticketFiles: string = 'http://intranet.ecn.com.mx:8060/lineup/public/files/recursos/tickets/';
  ticketForm: FormGroup = new FormGroup({
    titulo: new FormControl(),
    categoria: new FormControl(),
    prioridad: new FormControl(),
    medio: new FormControl(),
    usuario: new FormControl(),
    descripcion: new FormControl()
  });
  categorias: any = [];
  limiteSelects: number = 30;
  id_area: number = parseInt(localStorage.getItem('id_area')!);
  formData: FormData = new FormData();
  showSearchbar: boolean = false;
  limite: number = 30;

  ngOnInit() {
    let id_colaborador = { id_colaborador: parseInt(localStorage.getItem('id_colaborador')!) };
    this.service.getTicketsTI(id_colaborador).subscribe(
      response => {
        this.tickets = response;
        this.tickets2 = response;
      });
  }

  focus() {
    setTimeout(() => {
      this.searchInput.setFocus();
    }, 500);
  }

  getMoreTickets() {
    this.limite += 30;
  }

  searchTicket(event: any) {
    this.limite = 30;
    if (event.detail && event.detail.value != '') this.tickets = this.tickets2.filter((ticket: any) => ticket.Nombre_Modulo.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '').includes(event.detail.value.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')) || ticket.Peticion_Titulo.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '').includes(event.detail.value.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')));
    else this.tickets = this.tickets2;
  }

  newTicket() {
    //this.loading();
    this.getFormData().finally(() => {
      this.ticketForm = new FormGroup({
        titulo: new FormControl(),
        categoria: new FormControl(),
        prioridad: new FormControl(),
        medio: new FormControl(),
        usuario: new FormControl(),
        descripcion: new FormControl()
      });
      this.openNewTicket = true;
      //this.loadingController.dismiss();
    });
  }

  getMoreUsuarios(event: any) {
    this.limiteSelects += 20;
    if (this.limiteSelects >= this.usuarios.length) event.component.disableInfiniteScroll();
    else event.component.endInfiniteScroll();
  }

  searchUsuarios(event: any) {
    this.limiteSelects = 20;
    event.component.enableInfiniteScroll();

    if (event.text != '') this.usuarios = this.usuarios2.filter((usuario:any) => usuario.nombre.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '').includes(event.text.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')));
    else this.usuarios = this.usuarios2;

    if (this.limiteSelects >= this.usuarios.length) {
      event.component.disableInfiniteScroll();
    }
  }

  addFile() {
    this.archivo.getInputElement().then(input => {
      if (input.files!.length > 0) {
        this.formData.append('archivo', input.files![0]);
      }
    });
  }

  submitTicket() {
    if (this.id_area == 11) {
      this.ticketForm.get('usuario')!.setValue(parseInt(this.ticketForm.get('usuario')!.value.id_colaborador));
    } else {
      this.ticketForm.get('usuario')!.setValue(parseInt(localStorage.getItem('id_colaborador')!));
      this.ticketForm.get('medio')!.setValue(1);
    }
    this.formData.append('datos', JSON.stringify(this.ticketForm.value));
    this.service.createTicketTI(this.formData).subscribe(
      () => {
        this.openNewTicket = false;
        this.service.createAlert('Solicitud creada con éxito.', 'success');
      });
  }

  async getFormData() {
    return new Promise(res => {
      this.service.getCategoriasTI().subscribe(
        response => {
          this.categorias = response;
        });
        this.service.getColaboradores().subscribe(
          response => {
            this.usuarios = response;
            this.usuarios2 = response;
            res(true);
          });
      });
  }

  detalles(Peticion_ID: number) {
    this.detallesModal.onDidDismiss().finally(() => {
      this.openTicket = false;
    })
    //this.loading();
    let id_ticket = { id_ticket: Peticion_ID };
    this.service.getTicketTI(id_ticket).subscribe(
      (response:any) => {
        this.ticketData = response[0];
        this.openTicket = true;
      });
  }

  async loading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      spinner: 'dots'
    });

    await loading.present();
  }

}
