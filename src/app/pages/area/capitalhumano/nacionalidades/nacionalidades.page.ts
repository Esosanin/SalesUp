import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonContent } from '@ionic/angular';
import { CapitalhumanoService } from 'src/app/servicios/capitalhumano/capitalhumano.service';

interface Nacionalidad {
  id_nacionalidad: number;
  nacionalidad: string;
}

@Component({
  selector: 'app-nacionalidades',
  templateUrl: './nacionalidades.page.html',
  styleUrls: ['./nacionalidades.page.scss'],
})
export class NacionalidadesPage implements OnInit {

  @ViewChild('searchInput') searchInput: any;
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild('ModalEditNacionalidad') ModalEditNacionalidad: any;

  constructor(private service: CapitalhumanoService, private alertController: AlertController) { }

  showSearchbar: boolean = false;
  nacionalidades: any = [];
  nacionalidadData: Nacionalidad = {id_nacionalidad: 0,
                                    nacionalidad: ''
                                  };
  ModalNacionalidad: boolean = false;
  btnSaveNacionalidad: boolean = false;
  modalNacionalidadTitle: string = '';
  limite: number = 20;
  length: number = 0;

  ngOnInit() {
    this.limite = 20;
    let data: Object = { searchText: ''};

    this.service.getNacionalidades(data).subscribe(
      r => {
        this.length = Object.keys(r).length;
        if (this.length > 0) {
          this.nacionalidades = r;
        } else {
          this.nacionalidades = null;
        }
      },
      e => {
        console.log(e);
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
      }
    );

  }

  saveEditModalNacionalidad(){
    let data = {};
    if(this.btnSaveNacionalidad){
      data = {
                id: this.nacionalidadData.id_nacionalidad,
                nacionalidad: this.nacionalidadData.nacionalidad
              };

      this.service.editNacionalidad(data).subscribe(
        r => {
          this.ModalNacionalidad = false;
          this.ngOnInit();
          this.service.createAlert('Se a modificado la nacionalidad', 'success');
        },
        e => {
          console.log(e);
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        }
      );
    }else{
      data = {
                nacionalidad: this.nacionalidadData.nacionalidad
              };

      this.service.createNacionalidad(data).subscribe(
        r => {
          this.ModalNacionalidad = false;
          this.ngOnInit();
          this.service.createAlert('Se a creado la nacionalidad', 'success');
        },
        e => {
          console.log(e);
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        }
      );
    }
  }

  closeEdit(){
    this.ModalNacionalidad = false;
  }

  createModalNacionalidad(){
    this.modalNacionalidadTitle = 'Crear nacionalidad';
    this.ModalEditNacionalidad.onDidDismiss().then(() => this.ModalNacionalidad = false);
    this.ModalNacionalidad = true;

    this.nacionalidadData.id_nacionalidad = 0;
    this.nacionalidadData.nacionalidad = '';

    this.btnSaveNacionalidad = false;
  }

  editModalNacionalidad(nacionalidad: string, id: number){
    this.modalNacionalidadTitle = 'Editar nacionalidad';
    this.ModalEditNacionalidad.onDidDismiss().then(() => this.ModalNacionalidad = false);
    this.ModalNacionalidad = true;

    this.nacionalidadData.id_nacionalidad = id;
    this.nacionalidadData.nacionalidad = nacionalidad;

    this.btnSaveNacionalidad = true;
  }

  deleteModalNacionalidad(id: number){
    this.nacionalidadData.id_nacionalidad = id;

    this.confirm();
  }

  //FOCUS BÚSQUEDA
  focus() {
    setTimeout(() => {
      this.searchInput.setFocus();
    }, 500);
  }

  addItems(event: any){

  }

  getNacionalidades(searchText: any) {
    let data: Object = { searchText: searchText};

    this.service.getNacionalidades(data).subscribe(
      r => {
        this.nacionalidades = r;
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

      header: '¿Desea eliminar el nacionalidad?',

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
              id: this.nacionalidadData.id_nacionalidad
            };

            this.service.deleteNacionalidad(data).subscribe(

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
