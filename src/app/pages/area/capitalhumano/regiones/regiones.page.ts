import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonContent } from '@ionic/angular';
import { CapitalhumanoService } from 'src/app/servicios/capitalhumano/capitalhumano.service';

interface Region {
  id_region: number;
  codigo_region: string;
  nombre_region: string;
}

@Component({
  selector: 'app-regiones',
  templateUrl: './regiones.page.html',
  styleUrls: ['./regiones.page.scss'],
})
export class RegionesPage implements OnInit {

  @ViewChild('searchInput') searchInput: any;
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild('ModalEditRegion') ModalEditRegion: any;

  constructor(private service: CapitalhumanoService, private alertController: AlertController) { }

  showSearchbar: boolean = false;
  regiones: any = [];
  regionData: Region = {id_region: 0,
                        codigo_region: '',
                        nombre_region: ''
                      };
  ModalRegion: boolean = false;
  btnSaveRegion: boolean = false;
  modalRegionTitle: string = '';
  limite: number = 20;
  length: number = 0;

  ngOnInit() {
    this.limite = 20;
    let data: Object = { searchText: ''};

    this.service.getRegiones(data).subscribe(
      r => {
        this.length = Object.keys(r).length;
        if (this.length > 0) {
          this.regiones = r;
        } else {
          this.regiones = null;
        }
      },
      e => {
        console.log(e);
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
      }
    );

  }

  saveEditModalRegion(){
    let data = {};
    if(this.btnSaveRegion){
      data = {
                id: this.regionData.id_region,
                codigo: this.regionData.codigo_region,
                nombre: this.regionData.nombre_region
              };

      this.service.editRegion(data).subscribe(
        r => {
          this.ModalRegion = false;
          this.ngOnInit();
          this.service.createAlert('Se a modificado el región', 'success');
        },
        e => {
          console.log(e);
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        }
      );
    }else{
      data = {
                codigo: this.regionData.codigo_region,
                nombre: this.regionData.nombre_region
              };

      this.service.createRegion(data).subscribe(
        r => {
          this.ModalRegion = false;
          this.ngOnInit();
          this.service.createAlert('Se a creado el región', 'success');
        },
        e => {
          console.log(e);
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        }
      );
    }

  }

  closeEdit(){
    this.ModalRegion = false;
  }

  createModalRegion(){
    this.modalRegionTitle = 'Crear región';
    this.ModalEditRegion.onDidDismiss().then(() => this.ModalRegion = false);
    this.ModalRegion = true;

    this.regionData.codigo_region = '';
    this.regionData.nombre_region = '';

    this.btnSaveRegion = false;
  }

  editModalRegion(index: number){
    this.modalRegionTitle = 'Editar región';
    this.ModalEditRegion.onDidDismiss().then(() => this.ModalRegion = false);
    this.ModalRegion = true;

    this.regionData.id_region = this.regiones[index].id_region;
    this.regionData.codigo_region = this.regiones[index].codigo_region;
    this.regionData.nombre_region = this.regiones[index].nombre_region;

    this.btnSaveRegion = true;
  }

  deleteModalRegion(id: number){
    this.regionData.id_region = id;

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

  getRegiones(searchText: any) {
    let data: Object = { searchText: searchText};
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

  //confirmaciones

  async confirm() {
    let data = {};

    const alert = await this.alertController.create({

      header: '¿Desea eliminar el región?',

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
              id: this.regionData.id_region
            };

            this.service.deleteRegion(data).subscribe(

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
