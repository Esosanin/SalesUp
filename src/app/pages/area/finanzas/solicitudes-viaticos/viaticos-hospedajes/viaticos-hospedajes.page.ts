import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonInfiniteScroll } from '@ionic/angular';
import { FinanzasService } from 'src/app/servicios/finanzas/finanzas.service';

interface viaticohospedaje {
  solicitud: number;
  vicol: number;
  depositado: string;
  colab: string;
  destino: string;
  cantidad: string;
  desglose: Array<any>;
}

@Component({
  selector: 'app-viaticos-hospedajes',
  templateUrl: './viaticos-hospedajes.page.html',
  styleUrls: ['./viaticos-hospedajes.page.scss'],
})
export class ViaticosHospedajesPage implements OnInit {

  @ViewChild('VH_ModalDetalles') VH_ModalDetalles: any;
  @ViewChild('VH_ModalSolicitud') VH_ModalSolicitud: any;
  @ViewChild('searchInput') searchInput: any;
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll!: IonInfiniteScroll;

  showSearchbar: boolean = false;
  search: any;
  VH_modalDetalles: boolean = false;

  limite: number = 20;
  length: number = 0;

  VH_list: Array<any> = [];
  VH_list_copy: Array<any> = [];
  VH_modaldetalle: viaticohospedaje = {
    solicitud: 0,
    vicol: 0,
    depositado: '',
    colab: '',
    destino: '',
    cantidad: '',
    desglose: []
  }

  constructor(private service: FinanzasService,
              private router: Router) { }

  ngOnInit() {
    this.VH_getViaticosHospedaje();
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

  VH_search(){
    this.VH_list = this.VH_list_copy.filter(val =>
      (val.solicitud.toString().toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase()) >= 0) ||
      (val.depositado.toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase()) >= 0) ||
      (val.colab.toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase()) >= 0) ||
      (val.destino.toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase()) >= 0) ||
      (val.cantidad.toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase()) >= 0)
    )
  }

  async VH_getViaticosHospedaje(){
    this.service.VH_getViaticosHospedaje({search: this.search}).subscribe(
      r => {
        this.VH_list = r as any;
        this.VH_list_copy = Object.assign(this.VH_list);
      },
      e => {
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        console.log(e);
      }
    );
  }

  VH_createModal(type: number, index: number){
    switch(type){
      case 0:
        this.VH_ModalDetalles.onDidDismiss().then(() => this.VH_modalDetalles = false);
        this.VH_modalDetalles = true;
        this.VH_modaldetalle = this.VH_list[index];
        break;
      case 1:
        sessionStorage.setItem('VH solicitud', this.VH_list[index].solicitud);
        this.router.navigate([this.router.url + '/servicios-reservaciones']);
        break;
    }
  }

}
