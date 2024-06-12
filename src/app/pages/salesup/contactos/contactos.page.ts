import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonInput, LoadingController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { SalesupService } from 'src/app/servicios/salesup/salesup.service';

interface cuentaSelected {
  CardCode: string;
  CardName: string;
  LineNum: number;
}
interface vendedorSelected {
  id_sap: number;
  nombre: string;
}

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.page.html',
  styleUrls: ['./contactos.page.scss'],
})
export class ContactosPage implements OnInit {
  @ViewChild('searchInput', { static: false }) searchInput!: IonInput;

  showSearchbar = false;
  segment = 'sap';
  contactosLeads: Array<any> = [];
  contactosLeads2: Array<any> = [];
  contactosSap: Array<any> = [];
  contactosSap2: Array<any> = [];
  detalles: Array<any> = [];
  cuentas: Array<any> = [];
  cuentas2: Array<any> = [];
  cuentaSelected: cuentaSelected | undefined = undefined;
  detContacto = false;
  showFormContacto = false;
  tipo = '';
  id_sap = 0;
  id_zona = 0;
  limite = 30;
  limiteSelects = 30;
  modalTitle = '';
  contactoForm = new FormGroup({
    id: new FormControl(0, Validators.required),
    contacto: new FormControl('', Validators.required),
    posicion: new FormControl('', Validators.required),
    clave: new FormControl(false, Validators.required),
    relacion: new FormControl('', Validators.required),
    telefono: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    CardCode: new FormControl('', Validators.required),
    LineNum: new FormControl({disabled: true }, Validators.required),
  });
  vendedorSelected: vendedorSelected | undefined = undefined;
  vendedores = Array();
  vendedores2 = Array();
  sucursales = Array();
  showCuenta = false;

  constructor(
    private service: SalesupService,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {}

  cuentaChange() {
    this.contactoForm.get('LineNum')?.reset();
    //this.contactoForm.get('LineNum')?.disable();
    this.contactoForm.get('CardCode')?.setValue(this.cuentaSelected!.CardCode);
    let data = {
      CardCode: this.cuentaSelected!.CardCode,
      id_sap:
        this.tipo != 'Vendedor' ? this.vendedorSelected?.id_sap : this.id_sap,
    };
    if(!this.cuentaSelected!.CardCode.toString().includes('C')){
      this.sucursales = [{LineNum:-1,descripcion:'Sin descripción'}];
      this.contactoForm.get('LineNum')?.enable();
    }else{
      lastValueFrom(this.service.getSucursales(data))
      .then((response) => {
        this.sucursales = response.sucursales;
        this.contactoForm.get('LineNum')?.enable();
      })
      .catch(() => {
        this.service.createAlert(
          'Error al obtener las sucursales. Intente de nuevo',
          'danger'
        );
      });
    }

  }

  searchVendedores(event: any) {
    this.limiteSelects = 20;
    event.component.enableInfiniteScroll();

    if (event.text != '') {
      this.vendedores = this.vendedores2.filter((vendedor: any) =>
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

  ionViewWillEnter() {
    this.tipo = localStorage.getItem('tipo')!;
    this.id_sap = parseInt(localStorage.getItem('id_sap')!);
    this.id_zona = parseInt(localStorage.getItem('id_zona')!);
    let data = {
      id_sap: this.id_sap,
      select: false,
      id_zona: this.id_zona,
      tipo: this.tipo,
    };
    this.getContactos(data).catch(()=>{
      this.loadingController.dismiss();
    });
  }

  vendedorChange() {
    this.cuentaSelected = undefined;
    let data = {
      id_sap: this.vendedorSelected?.id_sap,
      select: true,
    };
    lastValueFrom(this.service.getCuentas(data))
      .then((response) => {
        this.cuentas = response.select;
        this.cuentas2 = response.select;
      })
      .catch(() => {
        this.service.createAlert(
          'Error al obtener las cuentas. Intente de nuevo.',
          'danger'
        );
      });
  }

  getMoreVendedores(event: any) {
    this.limiteSelects += 20;
    if (this.limiteSelects >= this.vendedores.length) {
      event.component.disableInfiniteScroll();
    } else {
      event.component.endInfiniteScroll();
    }
  }

  saveContacto() {
    //this.contactoForm.get('CardCode')?.setValue(this.cuentaSelected!.CardCode);
    lastValueFrom(this.service.saveContacto(this.contactoForm.value)).then(()=>{
      let data = {
        select: false,
        tipo: this.tipo,
        id_zona: this.id_zona
      };
      this.getContactos(data).then(() => {
        if (this.contactoForm.get('id')!.value != 0) {
          this.service.createAlert(
            'Contacto modificado correctamente.',
            'success'
          );
        } else {
          this.service.createAlert(
            'Contacto registrado correctamente.',
            'success'
          );
        }
        this.showFormContacto = false;
      }).catch(()=>{
        this.service.createAlert(
          'Error al obtener los contactos. Intente de nuevo.',
          'danger'
        );
      });
    }).catch(()=>{
      this.service.createAlert(
        'Error al registrar el contacto. Intente de nuevo.',
        'danger'
      );
    });
  }

  searchCuentas(event: any) {
    this.limiteSelects = 20;
    event.component.enableInfiniteScroll();
    if (event.text != '') {
      this.cuentas = this.cuentas2.filter((cuenta: any) =>
        cuenta.cuenta
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
      this.cuentas = this.cuentas2;
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

  addContacto(editar: boolean, index: number) {
    this.loading();
    this.contactoForm.reset();
    this.cuentaSelected = undefined;
    this.vendedorSelected = undefined;
    this.sucursales = Array();
    this.cuentas = Array();
    this.cuentas2 = Array();
    this.contactoForm.get('LineNum')?.disable();
    this.contactoForm.patchValue({
      id: 0,
      clave: false,
    });

    if (editar) {
      if (this.tipo != 'Vendedor') {
        let data = {
          id_zona: this.id_zona,
          tipo: this.tipo,
        };
        lastValueFrom(this.service.getVendedores(data))
          .then((response) => {
            this.vendedores = response.vendedores;
            this.vendedores2 = response.vendedores;
            let data = {
              select: true,
              id_sap: this.contactosLeads[index].SlpCode,
            };
            this.vendedorSelected = {
              id_sap: parseInt(this.contactosLeads[index].SlpCode),
              nombre: this.contactosLeads[index].lider
            };
            lastValueFrom(this.service.getCuentas(data))
              .then((response) => {
                this.cuentas = response.select;
                this.cuentas2 = response.select;
                if(!this.contactosLeads[index].CardCode.toString().includes('C')){
                  this.sucursales = [{LineNum:-1,descripcion:'Sin descripción'}];
                    this.modalTitle = 'Editar contacto';
                  this.contactoForm.setValue({
                    id: this.contactosLeads[index].id,
                    contacto: this.contactosLeads[index].contacto,
                    posicion: this.contactosLeads[index].posicion,
                    clave: this.contactosLeads[index].clave,
                    relacion: this.contactosLeads[index].relacion,
                    telefono: this.contactosLeads[index].telefono,
                    email: this.contactosLeads[index].email,
                    CardCode: this.contactosLeads[index].CardCode,
                    LineNum: this.contactosLeads[index].LineNum,
                  });
                  this.cuentaSelected = {
                    CardCode: this.contactosLeads[index].CardCode,
                    CardName: this.contactosLeads[index].CardName,
                    LineNum: this.contactosLeads[index].LineNum,
                  };
                  this.contactoForm.get('LineNum')?.enable();
                  this.showCuenta = true;
                  this.loadingController.dismiss();
                  this.showFormContacto = true;
                }else{
                  let data = {
                    CardCode: this.contactosLeads[index].CardCode,
                    id_sap: this.contactosLeads[index].SlpCode
                  };
                  lastValueFrom(this.service.getSucursales(data)).then((response)=>{
                    this.sucursales = response.sucursales;
                    this.modalTitle = 'Editar contacto';
                  this.contactoForm.setValue({
                    id: this.contactosLeads[index].id,
                    contacto: this.contactosLeads[index].contacto,
                    posicion: this.contactosLeads[index].posicion,
                    clave: this.contactosLeads[index].clave,
                    relacion: this.contactosLeads[index].relacion,
                    telefono: this.contactosLeads[index].telefono,
                    email: this.contactosLeads[index].email,
                    CardCode: this.contactosLeads[index].CardCode,
                    LineNum: this.contactosLeads[index].LineNum,
                  });
                  this.cuentaSelected = {
                    CardCode: this.contactosLeads[index].CardCode,
                    CardName: this.contactosLeads[index].CardName,
                    LineNum: this.contactosLeads[index].LineNum,
                  };
                  this.contactoForm.get('LineNum')?.enable();
                  this.showCuenta = true;
                  this.loadingController.dismiss();
                  this.showFormContacto = true;
                  }).catch(()=>{
                    this.loadingController.dismiss();
                    this.service.createAlert(
                      'Error al obtener las sucursales. Intente de nuevo.',
                      'danger'
                    );
                  });
                }
              })
              .catch(() => {
                this.loadingController.dismiss();
                this.service.createAlert(
                  'Error al obtener las cuentas. Intente de nuevo.',
                  'danger'
                );
              });
          })
          .catch(() => {
            this.loadingController.dismiss();
            this.service.createAlert(
              'Error al obtener los vendedores. Intente de nuevo.',
              'danger'
            );
          });
      } else {
        let data = {
          select: true,
          id_sap: this.id_sap,
        };
        lastValueFrom(this.service.getCuentas(data))
          .then((response) => {
            this.cuentas = response.select;
            this.cuentas2 = response.select;
            let data = {
              CardCode: this.contactosLeads[index].CardCode,
              id_sap: this.id_sap
            };
            lastValueFrom(this.service.getSucursales(data)).then((response)=>{
              this.sucursales = response.sucursales;
              this.modalTitle = 'Editar contacto';
            this.contactoForm.setValue({
              id: this.contactosLeads[index].id,
              contacto: this.contactosLeads[index].contacto,
              posicion: this.contactosLeads[index].posicion,
              clave: this.contactosLeads[index].clave,
              relacion: this.contactosLeads[index].relacion,
              telefono: this.contactosLeads[index].telefono,
              email: this.contactosLeads[index].email,
              CardCode: this.contactosLeads[index].CardCode,
              LineNum: this.contactosLeads[index].LineNum,
            });
            this.cuentaSelected = {
              CardCode: this.contactosLeads[index].CardCode,
              CardName: this.contactosLeads[index].CardCode,
              LineNum: this.contactosLeads[index].LineNum,
            };
            this.loadingController.dismiss();
            this.showFormContacto = true;
            }).catch(()=>{

            });
          })
          .catch(() => {
            this.service.createAlert(
              'Error al obtener las cuentas. Intente de nuevo.',
              'danger'
            );
            this.loadingController.dismiss();
          });
      }
    } else {
      if (this.tipo != 'Vendedor') {
        let data = {
          id_zona: this.id_zona,
          tipo: this.tipo,
        };
        lastValueFrom(this.service.getVendedores(data))
          .then((response) => {
            this.vendedores = response.vendedores;
            this.vendedores2 = response.vendedores;
            this.modalTitle = 'Agregar contacto';
            this.loadingController.dismiss();
            this.showFormContacto = true;
          })
          .catch(() => {
            this.loadingController.dismiss();
            this.service.createAlert(
              'Error al obtener los vendedores. Intente de nuevo.',
              'danger'
            );
          });
      } else {
        let data = {
          select: true,
          id_sap: this.id_sap,
        };
        lastValueFrom(this.service.getCuentas(data))
          .then((response) => {
            this.cuentas = response.select;
            this.cuentas2 = response.select;
            this.showCuenta = true;
            this.modalTitle = 'Agregar contacto';
            this.loadingController.dismiss();
            this.showFormContacto = true;
          })
          .catch(() => {
            this.loadingController.dismiss();
            this.service.createAlert(
              'Error al obtener las cuentas. Intente de nuevo.',
              'danger'
            );
          });
      }
    }
  }

  getMoreContactos(event: any) {
    this.limite += 30;
    event.target.complete();
  }

  verContacto(index: number) {
    this.detalles = [
      {
        title: 'Contacto',
        icon: 'id-card',
        text: this.contactosSap[index].Name,
      },
      {
        title: 'Líder de cuenta',
        icon: 'person',
        text: this.contactosSap[index].lider,
      },
      {
        title: 'Cuenta',
        icon: 'business',
        text: this.contactosSap[index].CardName,
      },
      {
        title: 'Posición',
        icon: 'hammer',
        text: this.contactosSap[index].Position,
      },
      {
        title: 'Teléfono',
        icon: 'call',
        text: this.contactosSap[index].Telefono,
      },
      { title: 'Email', icon: 'mail', text: this.contactosSap[index].email },
      {
        title: 'Dirección',
        icon: 'map',
        text: this.contactosSap[index].direccion,
      },
    ];
    this.detContacto = true;
  }

  async getContactos(data: Object) {
    this.loading();
    let response = await lastValueFrom(this.service.getContactos(data));
    if (response) {
      this.contactosLeads = response.leads;
      this.contactosLeads2 = response.leads;
      this.contactosSap = response.sap;
      this.contactosSap2 = response.sap;
      this.loadingController.dismiss();
    } else {
      this.loadingController.dismiss();
    }
  }

  searchContactos(event: any) {
    if (event.detail && event.detail?.value != '') {
      if (this.segment == 'sap') {
        this.contactosSap = this.contactosSap2.filter(
          (contacto) =>
            contacto.FirstName?.toString()
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
            contacto.LastName?.toString()
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
            contacto.lider
              ?.toString()
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
            contacto.CardName?.toString()
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
      } else {
        this.contactosLeads = this.contactosLeads2.filter(
          (contacto) =>
            contacto.contacto
              ?.toString()
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
            contacto.cuenta
              ?.toString()
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
            contacto.CardName?.toString()
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
            contacto.lider
              ?.toString()
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
      }
    } else {
      if (this.segment == 'sap') {
        this.contactosSap = this.contactosSap2;
      } else {
        this.contactosLeads = this.contactosLeads2;
      }
    }
  }

  async loading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      spinner: 'circles',
    });

    await loading.present();
  }

  focus() {
    setTimeout(() => {
      this.searchInput.setFocus();
    }, 500);
  }
}
