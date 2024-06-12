import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonInput, LoadingController, NavController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { SalesupService } from 'src/app/servicios/salesup/salesup.service';

@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.page.html',
  styleUrls: ['./cuentas.page.scss'],
})
export class CuentasPage implements OnInit {
  @ViewChild('searchInput', { static: false }) searchInput!: IonInput;

  showSearchbar = false;
  zona = 'todas';
  tipo = 'cualquiera';
  cuentasSap: Array<any> = [];
  cuentasSap2: Array<any> = [];
  cuentasLeads: Array<any> = [];
  cuentasLeads2: Array<any> = [];
  industrias: Array<any> = [];
  zonas: Array<any> = [];
  cuentaSelected: any = {};
  segment = 'lead';
  detCuenta = false;
  tipoVendedor = '';
  id_zona = 0;
  id_sap = 0;
  editar = false;
  cuentaIndex = 0;
  detalles: Array<any> = [];
  limiteSelects = 20;
  vendedores: Array<any> = [];
  vendedores2: Array<any> = [];
  vendedorSelected: any = null;
  limite = 20;
  cuentasSelect = Array();
  cuentasSelect2 = Array();
  showCuenta = false;
  modalTitle = 'Agregar cuenta';
  leadsFormGroup = new FormGroup({
    id: new FormControl(0, Validators.required),
    cuenta: new FormControl('', Validators.required),
    raz_social: new FormControl('', Validators.required),
    tipo: new FormControl('', Validators.required),
    rfc: new FormControl('', [
      Validators.required,
      Validators.minLength(12),
      Validators.maxLength(13),
    ]),
    id_industria: new FormControl(null, Validators.required),
    produce: new FormControl('', Validators.required),
    direccion: new FormControl('', Validators.required),
    telefono: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10)
    ]),
    estado: new FormControl('', Validators.required),
    municipio: new FormControl('', Validators.required),
    asociada: new FormControl(
      { value: false, disabled: true },
      Validators.required
    ),
    id_sap: new FormControl(0, Validators.required),
    id_corp: new FormControl(0, Validators.required),
    LineNumCorp: new FormControl({value:0,disabled:true}, Validators.required),
    potencial: new FormControl(null, Validators.required),
    pref_equipo: new FormControl('', Validators.required),
    pref_proyecto: new FormControl('', Validators.required),
    pref_servicio: new FormControl('', Validators.required),
    //tam: new FormControl(null, Validators.required),
    //market_share: new FormControl(null, Validators.required),
    tipo_cuenta: new FormControl('', Validators.required),
  });
  sucursales = Array();
  constructor(
    private service: SalesupService,
    private loadingController: LoadingController,
    private navController: NavController
  ) {}

  ngOnInit() {}

  cuentaChange(){
    this.leadsFormGroup.get('LineNumCorp')?.reset();
    this.leadsFormGroup.get('id_corp')?.setValue(this.cuentaSelected.CardCode);
    let data = {
      CardCode: this.cuentaSelected.CardCode,
      id_sap:217
    };
    lastValueFrom(this.service.getSucursales(data)).then((response)=>{
      this.sucursales= response.sucursales;
      this.leadsFormGroup.get('LineNumCorp')?.enable();
    });
  }

  async loading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      spinner: 'circles',
    });

    await loading.present();
  }

  asociadaChange(){
    this.cuentaSelected = undefined;
    this.leadsFormGroup.get('LineNumCorp')?.reset();
    this.leadsFormGroup.get('LineNumCorp')?.disable();
    let data = {
      select: true,
      id_sap: 217
    };
    if(this.leadsFormGroup.get('asociada')?.value){
      this.getCuentas(data).catch(()=>{
        this.service.createAlert(
          'Error al obtener las cuentas. Intente de nuevo.',
          'danger'
        );
      });
    }
  }

  ionViewWillEnter() {
    this.tipoVendedor = localStorage.getItem('tipo')!;
    this.id_zona = parseInt(localStorage.getItem('id_zona')!);
    this.id_sap = parseInt(localStorage.getItem('id_sap')!);
    let data = {
      tipo: this.tipoVendedor,
      id_sap: localStorage.getItem('id_sap'),
      id_zona: localStorage.getItem('id_zona'),
      select: false,
    };
    lastValueFrom(this.service.getZonas()).then((response)=>{
      this.zonas = response.zonas;
    }).catch(()=>{
      this.service.createAlert(
        'Error al obtener las zonas. Intente de nuevo.',
        'danger'
      );
    });
      this.getCuentas(data);
  }

  async loadFormData() {
    this.loading();
    let response = await lastValueFrom(this.service.getIndustrias()).catch(() =>
      this.loadingController.dismiss()
    );
    if (response) {
      this.industrias = response.industrias;
    }
    if (this.tipoVendedor != 'Vendedor') {
      let data = {
        tipo: this.tipoVendedor,
        id_zona: this.id_zona,
        select: true,
        id_sap: this.id_sap,
      };
      response = await lastValueFrom(this.service.getVendedores(data)).catch(
        () => this.loadingController.dismiss()
      );
      if (response) {
        this.vendedores = response.vendedores;
        this.vendedores2 = response.vendedores;
        this.loadingController.dismiss();
      }
    }else{
      this.loadingController.dismiss();
    }
  }

  liderChange() {
    this.cuentaSelected = undefined;
      this.leadsFormGroup.get('asociada')?.enable();
      let data = {
        id_sap: this.vendedorSelected.id_sap,
        select: true,
      };
      this.service.getCuentas(data).subscribe((response) => {
        this.cuentasSelect = response.select;
        this.cuentasSelect2 = response.select;
        if (this.editar) {
          if (this.cuentasLeads[this.cuentaIndex].id_corp != null) {
            let cuenta = '';
            for (let i = 0; i < this.cuentasSelect.length; i++) {
              if (
                this.cuentasSelect[i].CardCode ==
                this.cuentasLeads[this.cuentaIndex].id_corp
              ) {
                cuenta = this.cuentasSelect[i].CardName;
              }
            }
            this.cuentaSelected = {
              CardCode: this.cuentasLeads[this.cuentaIndex].id_corp,
              CardName: cuenta,
            };
          } else {
            this.cuentaSelected = null;
          }
        }
      });
  }

  editCuenta(editar: boolean, index: number, sap: boolean) {
    this.cuentaSelected = undefined;
    this.vendedorSelected = undefined;
    this.leadsFormGroup.reset();
    this.leadsFormGroup.patchValue({
         id: 0,
         asociada: false,
         id_sap: 0
       });
    if(editar){
      if(sap){
        this.navController.navigateBack(['tabs2/cuentas/detalle-cuenta',this.cuentasSap[index].CardCode+'_'+this.cuentasSap[index].LineNum]);
      }else{
        this.navController.navigateBack(['tabs2/cuentas/detalle-cuenta',this.cuentasLeads[index].id+'_-1']);
      }
    }else{
      if(this.tipoVendedor == 'Vendedor'){
        this.leadsFormGroup.get('asociada')?.enable();
      }else{
        this.leadsFormGroup.get('asociada')?.disable();
      }
      this.loadFormData().then(() => (this.showCuenta = true)).catch(()=>{
        this.service.createAlert(
          'Error al obtener los datos. Intente de nuevo.',
          'danger'
        );
      });
    }
    // this.tipoVendedor = localStorage.getItem('tipo')!;
    // this.editar = editar;
    // this.cuentaIndex = index;
    // this.vendedorSelected = null;
    // this.cuentaSelected = null;
    // this.leadsFormGroup.reset();
    // this.leadsFormGroup.patchValue({
    //   id: 0,
    //   asociada: false,
    // });
    // if (editar) {
    //   this.modalTitle = 'Editar cuenta';
    //   this.leadsFormGroup.get('asociada')?.enable();
    //   this.loadFormData().finally(() => {
    //     this.leadsFormGroup.setValue({
    //       id: this.cuentasLeads[index].id,
    //       cuenta: this.cuentasLeads[index].cuenta,
    //       raz_social: this.cuentasLeads[index].raz_social,
    //       tipo: this.cuentasLeads[index].tipo,
    //       rfc: this.cuentasLeads[index].rfc,
    //       id_industria: this.cuentasLeads[index].id_industria,
    //       produce: this.cuentasLeads[index].produce,
    //       direccion: this.cuentasLeads[index].direccion,
    //       telefono: this.cuentasLeads[index].telefono,
    //       estado: this.cuentasLeads[index].estado,
    //       municipio: this.cuentasLeads[index].municipio,
    //       id_zona: this.cuentasLeads[index].id_zona,
    //       asociada: this.cuentasLeads[index].asociada,
    //       id_corp: null,
    //       id_sap: null,
    //       potencial: this.cuentasLeads[index].potencial,
    //       pref_equipo: this.cuentasLeads[index].pref_equipo,
    //       pref_proyecto: this.cuentasLeads[index].pref_proyecto,
    //       pref_servicio: this.cuentasLeads[index].pref_servicio,
    //       tam: this.cuentasLeads[index].tam,
    //       market_share: this.cuentasLeads[index].market_share,
    //       tipo_cuenta: this.cuentasLeads[index].tipo_cuenta,
    //     });
    //     if (this.tipoVendedor != 'Vendedor') {
    //       this.vendedorSelected = {
    //         id_sap: this.cuentasLeads[index].id_sap,
    //         nombre: this.cuentasLeads[index].lider,
    //       };
    //     } else {
    //       this.vendedorSelected = null;
    //     }
    //     if (this.cuentasLeads[index].asociada) {
    //       this.liderChange();
    //     }
    //   });
    //   this.showCuenta = true;
    // } else {

    // }
  }

  saveCuenta() {
    this.leadsFormGroup.patchValue({
      id_sap: this.tipoVendedor!='Vendedor'?this.vendedorSelected.id_sap:this.id_sap
    });
    lastValueFrom(this.service.saveCuenta(this.leadsFormGroup.value)).then(()=>{
      let data = {
        tipo: this.tipoVendedor,
        id_sap: this.id_sap,
        select: false,
      };
      this.getCuentas(data).then(() => {
        if (this.leadsFormGroup.get('id')?.value != 0) {
          this.leadsFormGroup.reset();
          this.showCuenta = false;
          this.service.createAlert('Cuenta modificada con éxito.', 'success');
        } else {
          this.leadsFormGroup.reset();
          this.showCuenta = false;
          this.service.createAlert('Cuenta agregada con éxito.', 'success');
        }
      }).catch(()=>{
        this.service.createAlert(
          'Error al obtener las las cuentas. Intente de nuevo.',
          'danger'
        );
      });
    }).catch(()=>{
      this.service.createAlert(
        'Error al guardar la cuenta. Intente de nuevo.',
        'danger'
      );
    });
  }

  verCuenta(index: number) {
    // this.detalles = [
    //   {
    //     title: 'Cuenta',
    //     text: this.cuentasSap2[index].CardName,
    //     icon: 'business',
    //   },
    //   {
    //     title: 'Detalles',
    //     text: this.cuentasSap2[index].CntctPrsn,
    //     icon: 'information',
    //   },
    //   {
    //     title: 'RFC',
    //     text: this.cuentasSap2[index].LicTradNum,
    //     icon: 'reader',
    //   },
    //   {
    //     title: 'Dirección',
    //     text:
    //       this.cuentasSap2[index].MailAddres +
    //       ', ' +
    //       this.cuentasSap2[index].MailCity +
    //       ', ' +
    //       this.cuentasSap2[index].MailCountr +
    //       ', ' +
    //       this.cuentasSap2[index].MailZipCod,
    //     icon: 'map',
    //   },
    //   {
    //     title: 'Líder de cuenta',
    //     text: this.cuentasSap2[index].lider,
    //     icon: 'person',
    //   },
    // ];
    // this.detCuenta = true;
  }

  filtroZonaChange() {
    if (this.zona != 'todas') {
      if (this.tipo != 'cualquiera') {
        this.cuentasLeads = this.cuentasLeads2.filter(
          (cuenta) => cuenta.id_zona == this.zona && cuenta.tipo == this.tipo
        );
      } else {
        this.cuentasLeads = this.cuentasLeads2.filter(
          (cuenta) => cuenta.id_zona == this.zona
        );
      }
    } else {
      if (this.tipo != 'cualquiera') {
        this.cuentasLeads = this.cuentasLeads2.filter(
          (cuenta) => cuenta.tipo == this.tipo
        );
      } else {
        this.cuentasLeads = this.cuentasLeads2;
      }
    }
  }

  async refresh(event: any) {
    event.target.complete();
    let data = {
      tipo: localStorage.getItem('tipo'),
      id_sap: localStorage.getItem('id_sap'),
      select: false,
    };
    this.getCuentas(data);
  }

  async getCuentas(data: any) {
    this.loading();
    let response = await lastValueFrom(this.service.getCuentas(data)).catch(
      () => this.loadingController.dismiss()
    );
    if (response) {
      if (data.select) {
        this.cuentasSelect = response.select;
        this.cuentasSelect2 = response.select;
      } else {
        this.cuentasSap = response.cuentas;
        this.cuentasSap2 = response.cuentas;
        this.cuentasLeads = response.leads;
        this.cuentasLeads2 = response.leads;
      }
      this.loadingController.dismiss();
    }
  }

  filtroTipoChange() {
    if (this.tipo != 'cualquiera') {
      if (this.zona != 'todas') {
        this.cuentasLeads = this.cuentasLeads2.filter(
          (cuenta) => cuenta.tipo == this.tipo && cuenta.id_zona == this.zona
        );
      } else {
        this.cuentasLeads = this.cuentasLeads2.filter(
          (cuenta) => cuenta.tipo == this.tipo
        );
      }
    } else {
      if (this.zona != 'todas') {
        this.cuentasLeads = this.cuentasLeads2.filter(
          (cuenta) => cuenta.id_zona == this.zona
        );
      } else {
        this.cuentasLeads = this.cuentasLeads2;
      }
    }
  }

  getMoreVendedores(event: any) {
    this.limiteSelects += 20;
    if (this.limiteSelects >= this.vendedores.length) {
      event.component.disableInfiniteScroll();
    } else {
      event.component.endInfiniteScroll();
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

  searchCuentas2(event: any, sap: boolean) {
    if (sap) {
      this.limite = 20;
      if (event.detail && event.detail?.value != '') {
        this.cuentasSap = this.cuentasSap2.filter(
          (cuenta) =>
            cuenta.CardName.toString()
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
            cuenta.LicTradNum.toString()
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
        this.cuentasSap = this.cuentasSap2;
      }
    } else {
      this.limite = 20;
      if (event.detail && event.detail?.value != '') {
        if (this.tipo != 'cualquiera' && this.zona != 'todas') {
          this.cuentasLeads = this.cuentasLeads2.filter(
            (cuenta: any) =>
              cuenta.cuenta
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
                ) &&
              cuenta.tipo == this.tipo &&
              cuenta.id_zona == this.zona
          );
        } else if (this.tipo != 'cualquiera' && this.zona == 'todas') {
          this.cuentasLeads = this.cuentasLeads2.filter(
            (cuenta: any) =>
              cuenta.cuenta
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
                ) && cuenta.tipo == this.tipo
          );
        } else if (this.tipo == 'cualquiera' && this.zona != 'todas') {
          this.cuentasLeads = this.cuentasLeads2.filter(
            (cuenta: any) =>
              cuenta.cuenta
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
                ) && cuenta.id_zona == this.zona
          );
        } else {
          this.cuentasLeads = this.cuentasLeads2.filter((cuenta: any) =>
            cuenta.cuenta
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
        }
      } else {
        if (this.tipo != 'cualquiera' && this.zona != 'todas') {
          this.cuentasLeads = this.cuentasLeads2.filter(
            (cuenta: any) =>
              cuenta.tipo == this.tipo && cuenta.id_zona == this.zona
          );
        } else if (this.tipo != 'cualquiera' && this.zona == 'todas') {
          this.cuentasLeads = this.cuentasLeads2.filter(
            (cuenta: any) => cuenta.tipo == this.tipo
          );
        } else if (this.tipo == 'cualquiera' && this.zona != 'todas') {
          this.cuentasLeads = this.cuentasLeads2.filter(
            (cuenta: any) => cuenta.id_zona == this.zona
          );
        } else {
          this.cuentasLeads = this.cuentasLeads2;
        }
      }
    }
  }

  searchCuentas(event: any) {
    this.limiteSelects = 20;
    event.component.enableInfiniteScroll();
    if (event.text != '') {
      this.cuentasSelect = this.cuentasSelect2.filter((cuenta: any) =>
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
      this.cuentasSelect = this.cuentasSelect2;
    }
  }

  getMoreCuentas(event: any, sap: boolean, select: boolean) {
    if (sap) {
      this.limite += 20;
      event.target.complete();
    } else {
      if (select) {
        this.limiteSelects += 20;
        if (this.limiteSelects >= this.cuentasLeads.length) {
          event.component.disableInfiniteScroll();
        } else {
          event.component.endInfiniteScroll();
        }
      } else {
        this.limite += 20;
        event.target.complete();
      }
    }
  }

  focus() {
    setTimeout(() => {
      this.searchInput.setFocus();
    }, 500);
  }
}
