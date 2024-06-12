import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonContent } from '@ionic/angular';
import { CapitalhumanoService } from 'src/app/servicios/capitalhumano/capitalhumano.service';


interface Especialidad{
  id_especialidad: number;
  especialidad: string;
}

@Component({
  selector: 'app-especialidades',
  templateUrl: './especialidades.page.html',
  styleUrls: ['./especialidades.page.scss'],
})

export class EspecialidadesPage implements OnInit {

  @ViewChild('searchInput') searchInput: any;
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild('ModalEditEspecialidad') ModalEditEspecialidad: any;

  constructor(private service: CapitalhumanoService, private alertController: AlertController) { }

  showSearchbar: boolean = false;
  especialidades: any = [];
  especialidadData: Especialidad = {id_especialidad: 0,
                                    especialidad: ''
                                  };
  ModalEspecialidad: boolean = false;
  btnSaveEspecialidad: boolean = false;
  modalEspecialidadTitle: string = '';
  limite: number = 20;
  length: number = 0;

  ngOnInit() {
    this.limite = 20;
    let data: Object = { searchText: ''};

    this.service.getEspecialidades(data).subscribe(
      r => {
        this.length = Object.keys(r).length;
        if (this.length > 0) {
          this.especialidades = r;
        } else {
          this.especialidades = null;
        }
      },
      e => {
        console.log(e);
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
      }
    );
  }

  saveEditModalEspecialidad(){
    let data = {};
    if(this.btnSaveEspecialidad){
      data = {
                id: this.especialidadData.id_especialidad,
                especialidad: this.especialidadData.especialidad
              };

      this.service.editEspecialidad(data).subscribe(
        r => {
          this.ModalEspecialidad = false;
          this.ngOnInit();
          this.service.createAlert('Se a modificado la especialidad', 'success');
        },
        e => {
          console.log(e);
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        }
      );
    }else{
      data = {
                especialidad: this.especialidadData.especialidad
              };

      this.service.createEspecialidad(data).subscribe(
        r => {
          this.ModalEspecialidad = false;
          this.ngOnInit();
          this.service.createAlert('Se a creado la especialidad', 'success');
        },
        e => {
          console.log(e);
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        }
      );
    }
  }

  closeEdit(){
    this.ModalEspecialidad = false;
  }

  createModalEspecialidad(){
    this.modalEspecialidadTitle = 'Crear especialidad';
    this.ModalEditEspecialidad.onDidDismiss().then(() => this.ModalEspecialidad = false);
    this.ModalEspecialidad = true;

    this.especialidadData.id_especialidad = 0;
    this.especialidadData.especialidad = '';

    this.btnSaveEspecialidad = false;
  }

  editModalEspecialidad(especialidad: string, id: number){
    this.modalEspecialidadTitle = 'Editar especialidad';
    this.ModalEditEspecialidad.onDidDismiss().then(() => this.ModalEspecialidad = false);
    this.ModalEspecialidad = true;

    this.especialidadData.id_especialidad = id;
    this.especialidadData.especialidad = especialidad;

    this.btnSaveEspecialidad = true;
  }

  deleteModalEspecialidad(id: number){
    this.especialidadData.id_especialidad = id;

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

  getEspecialidades(searchText: any) {
    let data: Object = { searchText: searchText};
    this.service.getEspecialidades(data).subscribe(
      r => {
        this.especialidades = r;
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

      header: '¿Desea eliminar el especialidad?',

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
              id: this.especialidadData.id_especialidad
            };

            this.service.deleteEspecialidad(data).subscribe(

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
