import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonContent } from '@ionic/angular';
import { CapitalhumanoService } from 'src/app/servicios/capitalhumano/capitalhumano.service';


interface Carrera{
  id_carrera: number;
  carrera: string;
}

@Component({
  selector: 'app-carreras',
  templateUrl: './carreras.page.html',
  styleUrls: ['./carreras.page.scss'],
})
export class CarrerasPage implements OnInit {

  @ViewChild('searchInput') searchInput: any;
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild('ModalEditCarrera') ModalEditCarrera: any;

  constructor(private service: CapitalhumanoService, private alertController: AlertController) { }

  showSearchbar: boolean = false;
  carreras: any = [];
  carreraData: Carrera = {id_carrera: 0,
                          carrera: ''
                        };
  ModalCarrera: boolean = false;
  btnSaveCarrera: boolean = false;
  modalCarreraTitle: string = '';
  limite: number = 20;
  length: number = 0;

  ngOnInit() {
    this.limite = 20;
    let data: Object = { searchText: ''};

    this.service.getCarreras(data).subscribe(
      r => {
        this.length = Object.keys(r).length;
        if (this.length > 0) {
          this.carreras = r;
        } else {
          this.carreras = null;
        }
      },
      e => {
        console.log(e);
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
      }
    );

  }

  saveEditModalCarrera(){
    let data = {};
    if(this.btnSaveCarrera){
      data = {
                id: this.carreraData.id_carrera,
                carrera: this.carreraData.carrera
              };

      this.service.editCarrera(data).subscribe(
        r => {
          this.ModalCarrera = false;
          this.ngOnInit();
          this.service.createAlert('Se a modificado la carrera', 'success');
        },
        e => {
          console.log(e);
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        }
      );
    }else{
      data = {
                carrera: this.carreraData.carrera
              };

      this.service.createCarrera(data).subscribe(
        r => {
          this.ModalCarrera = false;
          this.ngOnInit();
          this.service.createAlert('Se a creado la carrera', 'success');
        },
        e => {
          console.log(e);
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        }
      );
    }
  }

  closeEdit(){
    this.ModalCarrera = false;
  }

  createModalCarrera(){
    this.modalCarreraTitle = 'Crear carrera';
    this.ModalEditCarrera.onDidDismiss().then(() => this.ModalCarrera = false);
    this.ModalCarrera = true;

    this.carreraData.id_carrera = 0;
    this.carreraData.carrera = '';

    this.btnSaveCarrera = false;
  }

  editModalCarrera(carrera: string, id: number){
    this.modalCarreraTitle = 'Editar carrera';
    this.ModalEditCarrera.onDidDismiss().then(() => this.ModalCarrera = false);
    this.ModalCarrera = true;

    this.carreraData.id_carrera = id;
    this.carreraData.carrera = carrera;

    this.btnSaveCarrera = true;
  }

  deleteModalCarrera(id: number){
    this.carreraData.id_carrera = id;

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

  getCarreras(searchText: any) {
    let data: Object = { searchText: searchText};

    this.service.getCarreras(data).subscribe(
      r => {
        this.carreras = r;
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

      header: '¿Desea eliminar el carrera?',

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
              id: this.carreraData.id_carrera
            };

            this.service.deleteCarrera(data).subscribe(

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
