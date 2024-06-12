import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonContent } from '@ionic/angular';
import { CapitalhumanoService } from 'src/app/servicios/capitalhumano/capitalhumano.service';


interface Departamento{
  departamentos_id: number;
  departamentos_codigo: string;
  departamentos_desc: string;
  id_area: number;
}


@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.page.html',
  styleUrls: ['./departamentos.page.scss'],
})
export class DepartamentosPage implements OnInit {

  @ViewChild('searchInput') searchInput: any;
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild('ModalEditDepartamento') ModalEditDepartamento: any;

  constructor(private service: CapitalhumanoService, private alertController: AlertController) { }


  showSearchbar: boolean = false;
  departamentos: any = [];
  areas: any = [];
  departamentoData: Departamento = {departamentos_id: 0,
                                    departamentos_codigo: '',
                                    departamentos_desc: '',
                                    id_area: 0
                                  };
  ModalDepartamento: boolean = false;
  btnSaveDepartamento: boolean = false;
  modalDepartamentoTitle: string = '';
  limite: number = 20;
  length: number = 0;

  ngOnInit() {
    this.limite = 20;
    let data: Object = { searchText: ''};

    this.service.getDepartamentos(data).subscribe(
      r => {
        this.length = Object.keys(r).length;
        if (this.length > 0) {
          this.departamentos = r;
        } else {
          this.departamentos = null;
        }
      },
      e => {
        console.log(e);
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
      }
    );

    this.service.getAreas(data).subscribe(
      r => {
        this.areas = r;
        console.log(r);
      },
      e => {
        console.log(e);
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
      }
    );

  }

  saveEditModalDepartamento(){
    let data = {};
    if(this.btnSaveDepartamento){
      data = {
                id: this.departamentoData.departamentos_id,
                codigo: this.departamentoData.departamentos_codigo,
                descripcion: this.departamentoData.departamentos_desc,
                area: this.departamentoData.id_area
              };

      this.service.editDepartamento(data).subscribe(
        r => {
          this.ModalDepartamento = false;
          this.ngOnInit();
          this.service.createAlert('Se a modificado el departamento', 'success');
        },
        e => {
          console.log(e);
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        }
      );
    }else{
      data = {
                codigo: this.departamentoData.departamentos_codigo,
                descripcion: this.departamentoData.departamentos_desc,
                area: this.departamentoData.id_area
              };

      this.service.createDepartamento(data).subscribe(
        r => {
          this.ModalDepartamento = false;
          this.ngOnInit();
          this.service.createAlert('Se a creado el departamento', 'success');
        },
        e => {
          console.log(e);
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        }
      );
    }

  }

  closeEdit(){
    this.ModalDepartamento = false;
  }

  createModalDepartamento(){
    this.modalDepartamentoTitle = 'Crear departamento';
    this.ModalEditDepartamento.onDidDismiss().then(() => this.ModalDepartamento = false);
    this.ModalDepartamento = true;

    this.departamentoData.departamentos_desc = '';
    this.departamentoData.departamentos_codigo = '';
    this.departamentoData.id_area = 0;

    this.btnSaveDepartamento = false;
  }

  editModalDepartamentos(index: number){
    this.modalDepartamentoTitle = 'Editar departamento';
    this.ModalEditDepartamento.onDidDismiss().then(() => this.ModalDepartamento = false);
    this.ModalDepartamento = true;

    this.departamentoData.departamentos_id = this.departamentos[index].departamentos_id;
    this.departamentoData.departamentos_desc = this.departamentos[index].departamentos_desc;
    this.departamentoData.departamentos_codigo = this.departamentos[index].departamentos_codigo;
    this.departamentoData.id_area = this.departamentos[index].id_area;

    this.btnSaveDepartamento = true;
  }

  deleteModalDepartamentos(id: number){
    this.departamentoData.departamentos_id = id;

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

  getDepartamentos(searchText: any) {
    let data: Object = { searchText: searchText};
    this.service.getDepartamentos(data).subscribe(
      r => {
        this.departamentos = r;
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

      header: '¿Desea eliminar el departamento?',

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
              id: this.departamentoData.departamentos_id,
              estado: 0
            };

            this.service.deleteDepartamento(data).subscribe(

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
