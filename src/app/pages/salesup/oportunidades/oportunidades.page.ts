import { DatePipe, formatCurrency } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonContent, LoadingController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { Oportunidad } from 'src/app/model/salesup/opciones/oportunidad';
import { SalesupService } from 'src/app/servicios/salesup/salesup.service';

@Component({
  selector: 'app-oportunidades',
  templateUrl: './oportunidades.page.html',
  styleUrls: ['./oportunidades.page.scss'],
})
export class OportunidadesPage implements OnInit {
  @ViewChild('oportunidadModal') oportunidadModal: any;
  @ViewChild('searchInput') searchInput: any;
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  oportunidadModalTitle: string = '';
  showModalOportunidad: boolean = false;
  cuentaSelected: any = undefined;
  vendedorSelected: any = undefined;
  cuentas: any = [];
  cuentas2: any = [];
  industrias: any = [];
  oport: Oportunidad = new Oportunidad();
  spk1s: any = [];
  oportunidades: any = [];
  oportunidades2: any = [];
  limite: number = 20;
  limiteSelects: number = 20;
  showSearchbar: boolean = false;
  id_oportunidad: number = 0;
  tipo: string = '';
  vendedores: Array<any> = [];
  vendedores2: Array<any> = [];
  id_sap: number = 0;
  sucursales = Array();

  constructor(
    private service: SalesupService,
    public datePipe: DatePipe,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {}

  cuentaChange() {
        this.oport.LineNum = undefined;
        this.oport.CardCode = this.cuentaSelected!.CardCode;
        this.getSucursales(this.oport.CardCode);
  }

  async getSucursales(CardCode: string) {
    let data = {
      CardCode: CardCode,
      id_sap: this.vendedorSelected!.id_sap
    };
    await lastValueFrom(this.service.getSucursales(data)).then((response)=>{
      this.sucursales = response.sucursales;
    }).catch(
      () => {
        this.service.createAlert(
          'Error al obtener las sucursales. Intente de nuevo',
          'danger'
        );
      }
    );
  }

  ionViewWillEnter() {
    this.tipo = localStorage.getItem('tipo')!;
    this.id_sap = parseInt(localStorage.getItem('id_sap')!);
    if (this.tipo == 'Vendedor') {
      this.refresh(false);
    } else {
      const data = {
        id_sap: this.id_sap,
        tipo: this.tipo,
      };
      this.service.getVendedores(data).subscribe((response) => {
        this.vendedores = response.vendedores;
        this.vendedores2 = response.vendedores;
      });
    }
  }

  async confirmDelete(id_oportunidad: number) {
    const alert = await this.alertController.create({
      header: '¿Desea eliminar la oportunidad?',
      message: 'Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'No',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Confirmar',
          cssClass: 'alert-button-confirm',
          handler: () => {
            let data = { id: id_oportunidad };
            this.service.deleteOportunidad(data).subscribe(() => {
              this.refresh(false);
            });
          },
        },
      ],
    });

    await alert.present();
  }

  getMoreVendedores(event: any) {
    this.limiteSelects += 20;
    if (this.vendedores.length <= this.limiteSelects) {
      event.component.disableInfiniteScroll();
    } else {
      event.component.endInfiniteScroll();
    }
  }

  async refresh(event: any) {
    const data = {
      id_sap:
        this.tipo == 'Gerente' || this.tipo == 'Corporativo'
          ? this.vendedorSelected.id_sap
          : this.id_sap,
    };
    let response = await lastValueFrom(this.service.getOportunidades(data));
    if (response) {
      this.limite = 20;
      this.oportunidades = response.oportunidades;
      this.oportunidades2 = response.oportunidades;
      if (event) {
        event.target.complete();
      }
    }
  }

  saveOportunidad() {
    if (this.tipo == 'Gerente' || this.tipo == 'Corporativo') {
      this.oport.id_sap = this.vendedorSelected.id_sap;
    }
    this.service.addOportunidad(this.oport).subscribe(() => {
      this.refresh(false).finally(() => {
        this.showModalOportunidad = false;
        this.oport.id == 0
          ? this.service.createAlert('Oportunidad registrada.', 'success')
          : this.service.createAlert('Oportunidad actualizada.', 'success');
      });
    });
  }

  async getFormData() {
    let response = await lastValueFrom(this.service.getIndustrias());
    if (response) {
      this.industrias = response.industrias;
    }
    const data = {
      id_sap:
        this.tipo == 'Corporativo' || this.tipo == 'Gerente'
          ? this.vendedorSelected.id_sap
          : this.id_sap,
          select: true,
          tipo: 'Vendedor'
    };
    response = await lastValueFrom(this.service.getCuentas(data));
    if (response) {
      this.cuentas = response.select;
      this.cuentas2 = response.select;
    }
    response = await lastValueFrom(this.service.getSpk1());
    if (response) {
      this.spk1s = response.spk1;
    }
  }

  formatoMoneda(number: number): string {
    return formatCurrency(number, 'en', '$', 'USD');
  }

  async loading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      spinner: 'circles',
    });

    await loading.present();
  }

  addOportunidad(editar: boolean, index: number) {
    this.loading();
    this.oport = new Oportunidad();
    this.cuentaSelected = undefined;

    this.getFormData().then(() => {
    if (editar) {

        this.getSucursales(this.oportunidades[index].CardCode).then(()=>{
          this.oportunidadModalTitle = 'Editar oportunidad';
        this.id_oportunidad = this.oportunidades[index].id;
        this.cuentaSelected = {
          CardCode: this.oportunidades[index].CardCode,
          CardName: this.oportunidades[index].CardName,
        };
        this.oport.id = this.oportunidades[index].id;
        this.oport.CardCode = this.oportunidades[index].CardCode;
          this.oport.LineNum = this.oportunidades[index].LineNum;
          this.oport.descripcion = this.oportunidades[index].descripcion;
        this.oport.id_industria = this.oportunidades[index].id_industria;
        this.oport.id_spk1 = this.oportunidades[index].id_spk1;
        this.oport.monto_estim = this.oportunidades[index].monto_estim;
        this.loadingController.dismiss();
        this.showModalOportunidad = true;
        }).catch(()=>{
          //this.loadingController.dismiss();
        });

    } else {
      this.id_oportunidad = 0;
      this.oportunidadModalTitle = 'Agregar oportunidad';
      this.loadingController.dismiss();
      this.showModalOportunidad = true;
    }
  }).catch(()=>{
    this.service.createAlert('Error al obtener los datos. Intente de nuevo','danger');
  });
  }

  focus() {
    setTimeout(() => {
      this.searchInput.setFocus();
    }, 500);
  }

  searchVendedores(event: any) {
    this.limiteSelects = 20;
    event.component.enableInfiniteScroll();

    if (event.text != '') {
      this.vendedores = this.vendedores2.filter((vendedor) =>
        vendedor.nombre
          .toString()
          .toLowerCase()
          .normalize('NFD')
          .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
          .includes(
            event.text
              .toString()
              .toLowerCase()
              .normalize('NFD')
              .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
          )
      );
    } else {
      this.vendedores = this.vendedores2;
    }

    if (this.limiteSelects >= this.vendedores.length) {
      event.component.disableInfiniteScroll();
    }
  }

  searchCuentas(event: any) {
    this.limiteSelects = 20;
    event.component.enableInfiniteScroll();

    if (event.text != '') {
      this.cuentas = this.cuentas2.filter((cuenta2: any) =>
        cuenta2.CardName.toString()
          .toLowerCase()
          .normalize('NFD')
          .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
          .includes(
            event.text
              .toString()
              .toLowerCase()
              .normalize('NFD')
              .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
          )
      );
    } else {
      this.cuentas = this.cuentas2;
    }

    if (this.limiteSelects >= this.cuentas.length) {
      event.component.disableInfiniteScroll();
    }
  }

  getMoreCuentas(event: any) {
    this.limiteSelects += 20;
    if (this.limiteSelects >= this.cuentas.length) {
      event.component.disableInfiniteScroll();
    } else {
      event.component.endInfiniteScroll();
    }
  }

  searchOportunidad(event: any) {
    this.limite = 20;
    if (event.detail && event.detail.value != '') {
      this.oportunidades = this.oportunidades2.filter(
        (oportunidad: any) =>
          oportunidad.CardName.toString()
            .toLowerCase()
            .normalize('NFD')
            .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
            .includes(
              event.detail.value
                .toString()
                .toLowerCase()
                .normalize('NFD')
                .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
            ) ||
          oportunidad.industria
            .toString()
            .toLowerCase()
            .normalize('NFD')
            .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
            .includes(
              event.detail.value
                .toString()
                .toLowerCase()
                .normalize('NFD')
                .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
            ) ||
          oportunidad.spk1
            .toString()
            .toLowerCase()
            .normalize('NFD')
            .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
            .includes(
              event.detail.value
                .toString()
                .toLowerCase()
                .normalize('NFD')
                .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
            ) ||
          this.datePipe
            .transform(oportunidad.fecha, 'dd/MM/yyyy')!
            .toString()
            .toLowerCase()
            .normalize('NFD')
            .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
            .includes(
              event.detail.value
                .toString()
                .toLowerCase()
                .normalize('NFD')
                .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
            )
      );
    } else this.oportunidades = this.oportunidades2;
  }

  getMoreOportunidades(event: any) {
    this.limite += 20;
    event.target.complete();
  }
}
