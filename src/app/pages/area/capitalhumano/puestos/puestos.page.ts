import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonContent } from '@ionic/angular';
import { CapitalhumanoService } from 'src/app/servicios/capitalhumano/capitalhumano.service';

interface Puesto {
  id_puesto: number;
  puesto: string;
  descripcion_pues: string;
}

@Component({
  selector: 'app-puestos',
  templateUrl: './puestos.page.html',
  styleUrls: ['./puestos.page.scss'],
})
export class PuestosPage implements OnInit {

  @ViewChild('searchInput') searchInput: any;
  @ViewChild('ModalEditPuesto') ModalEditPuesto: any;
  @ViewChild(IonContent, { static: false }) content!: IonContent;


  constructor(private service: CapitalhumanoService, private alertController: AlertController) { }

  showSearchbar: boolean = false;
  puestos: any = [];
  puestoData: Puesto = {id_puesto: 0,
                        puesto: '',
                        descripcion_pues: ''
                      };
  ModalPuesto: boolean = false;
  btnSavePuesto: boolean = false;
  modalPuestoTitle: string = '';
  limite: number = 20;
  length: number = 0;

  ngOnInit() {
    this.limite = 20;
    let data: Object = { searchText: ''};

    this.service.getPuestos(data).subscribe(
      r => {
        this.length = Object.keys(r).length;
        if (this.length > 0) {
          this.puestos = r;
        } else {
          this.puestos = null;
        }
      },
      e => {
        console.log(e);
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
      }
    );

  }

  saveEditModalPuesto(){
    let data = {};
    if(this.btnSavePuesto){
      data = {
                id: this.puestoData.id_puesto,
                puesto: this.puestoData.puesto,
                descripcion: this.puestoData.descripcion_pues
              };

      this.service.editPuesto(data).subscribe(
        r => {
          this.ModalPuesto = false;
          this.ngOnInit();
          this.service.createAlert('Se a modificado el puesto', 'success');
        },
        e => {
          console.log(e);
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        }
      );
    }else{
      data = {
                puesto: this.puestoData.puesto,
                descripcion: this.puestoData.descripcion_pues
              };

      this.service.createPuesto(data).subscribe(
        r => {
          this.ModalPuesto = false;
          this.ngOnInit();
          this.service.createAlert('Se a creado el puesto', 'success');
        },
        e => {
          console.log(e);
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        }
      );
    }

  }

  closeEdit(){
    this.ModalPuesto = false;
  }

  createModalPuesto(){
    this.modalPuestoTitle = 'Crear departamento';
    this.ModalEditPuesto.onDidDismiss().then(() => this.ModalPuesto = false);
    this.ModalPuesto = true;

    this.puestoData.puesto = '';
    this.puestoData.descripcion_pues = '';

    this.btnSavePuesto = false;
  }

  editModalPuesto(index: number){
    this.modalPuestoTitle = 'Editar departamento';
    this.ModalEditPuesto.onDidDismiss().then(() => this.ModalPuesto = false);
    this.ModalPuesto = true;

    this.puestoData.id_puesto = this.puestos[index].id_puesto;
    this.puestoData.puesto = this.puestos[index].puesto;
    this.puestoData.descripcion_pues = this.puestos[index].descripcion_pues;

    this.btnSavePuesto = true;
  }

  deleteModalPuesto(id: number){
    this.puestoData.id_puesto = id;

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

  getPuestos(searchText: any) {
    let data: Object = { searchText: searchText};
    this.service.getPuestos(data).subscribe(
      r => {
        this.puestos = r;
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

      header: '¿Desea eliminar el puesto?',

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
              id: this.puestoData.id_puesto,
              estado: 0
            };

            this.service.deletePuesto(data).subscribe(

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
