import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonContent } from '@ionic/angular';
import { CapitalhumanoService } from 'src/app/servicios/capitalhumano/capitalhumano.service';

interface Sucursal {
  id_sucursal: number;
  sucursal: string;
  direccion_suc: string;
  avr: string;
  region: number;
}

@Component({
  selector: 'app-sucursales',
  templateUrl: './sucursales.page.html',
  styleUrls: ['./sucursales.page.scss'],
})
export class SucursalesPage implements OnInit {

  @ViewChild('searchInput') searchInput: any;
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild('ModalEditSucursal') ModalEditSucursal: any;

  constructor(private service: CapitalhumanoService, private alertController: AlertController) { }

  showSearchbar: boolean = false;
  sucursales: any = [];
  regiones: any = [];
  sucursalData: Sucursal = {id_sucursal: 0,
                            sucursal: '',
                            direccion_suc: '',
                            avr: '',
                            region: 0
                          };
  ModalSucursal: boolean = false;
  btnSaveSucursal: boolean = false;
  modalSucursalTitle: string = '';
  limite: number = 20;
  length: number = 0;

  ngOnInit() {
    this.limite = 20;
    let data: Object = { searchText: ''};

    this.service.getSucursales(data).subscribe(
      r => {
        this.length = Object.keys(r).length;
        if (this.length > 0) {
          this.sucursales = r;
        } else {
          this.sucursales = null;
        }
      },
      e => {
        console.log(e);
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
      }
    );

    this.service.getRegiones(data).subscribe(
      r => {
        this.regiones = r;
      },
      e => {
        console.log(e);
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
      }
    );

  }

  saveEditModalSucursal(){
    let data = {};
    if(this.btnSaveSucursal){
      data = {
                id: this.sucursalData.id_sucursal,
                sucursal: this.sucursalData.sucursal,
                direccion: this.sucursalData.direccion_suc,
                avr: this.sucursalData.avr,
                region: this.sucursalData.region
              };

      this.service.editSucursal(data).subscribe(
        r => {
          this.ModalSucursal = false;
          this.ngOnInit();
          this.service.createAlert('Se a modificado la sucursal', 'success');
        },
        e => {
          console.log(e);
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        }
      );
    }else{
      data = {
                sucursal: this.sucursalData.sucursal,
                direccion: this.sucursalData.direccion_suc,
                avr: this.sucursalData.avr,
                region: this.sucursalData.region
              };

      this.service.createSucursal(data).subscribe(
        r => {
          this.ModalSucursal = false;
          this.ngOnInit();
          this.service.createAlert('Se a creado la sucursal', 'success');
        },
        e => {
          console.log(e);
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        }
      );
    }

  }

  closeEdit(){
    this.ModalSucursal = false;
  }

  createModalSucursal(){
    this.modalSucursalTitle = 'Crear sucursal';
    this.ModalEditSucursal.onDidDismiss().then(() => this.ModalSucursal = false);
    this.ModalSucursal = true;

    this.sucursalData.sucursal = '';
    this.sucursalData.avr = '';
    this.sucursalData.direccion_suc = '';
    this.sucursalData.region = 0;

    this.btnSaveSucursal = false;
  }

  editModalSucursal(index: number){
    this.modalSucursalTitle = 'Editar sucursal';
    this.ModalEditSucursal.onDidDismiss().then(() => this.ModalSucursal = false);
    this.ModalSucursal = true;

    this.sucursalData.id_sucursal = this.sucursales[index].id_sucursal;
    this.sucursalData.sucursal = this.sucursales[index].sucursal;
    this.sucursalData.avr = this.sucursales[index].avr;
    this.sucursalData.direccion_suc = this.sucursales[index].direccion_suc;
    this.sucursalData.region = this.sucursales[index].region;

    this.btnSaveSucursal = true;
  }

  deleteModalSucursal(id: number){
    this.sucursalData.id_sucursal = id;

    this.confirm();
  }

  addItems(event: any){
    event.target.complete();
    this.limite += 20;
  }

  //FOCUS BÚSQUEDA
  focus() {
    setTimeout(() => {
      this.searchInput.setFocus();
    }, 500);
  }

  getSucursales(searchText: any) {
    let data: Object = { searchText: searchText};
    this.service.getSucursales(data).subscribe(
      r => {
        this.sucursales = r;
      },
      e => {
        console.log(e);
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
      }
    );
  }

  //confirmaciones

  async confirm() {
    let data = {};

    const alert = await this.alertController.create({

      header: '¿Desea eliminar el sucursal?',

      buttons: [
        {
          text: 'No',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Confirmar',
          cssClass: 'alert-button-confirm',
          handler: () => {

            data = {
              id: this.sucursalData.id_sucursal
            };

            this.service.deleteSucursal(data).subscribe(

              () => { },

              e => {
                console.log(e);
                this.service.createAlert('No se pudo conectar con el servidor, intente de nuevo.', 'danger');
              },

              () => {
                this.service.createAlert('Se elimino con exito.', 'success');
                this.ngOnInit();
              }
            );
          }
        },
      ],
    });

    await alert.present();
  }
}
