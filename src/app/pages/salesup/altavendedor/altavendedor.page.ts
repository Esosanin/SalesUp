import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { SalesupService } from 'src/app/servicios/salesup/salesup.service';

@Component({
  selector: 'app-altavendedor',
  templateUrl: './altavendedor.page.html',
  styleUrls: ['./altavendedor.page.scss'],
})
export class AltavendedorPage implements OnInit {
  vendedores: Array<any> = [];
  vendedores2: Array<any> = [];
  limiteSelects: number = 20;
  zonas: Array<any> = [];
  altaVendedorForm: FormGroup = new FormGroup({
    id_sap: new FormControl(undefined, Validators.required),
    id_zona: new FormControl(undefined, Validators.required),
    tipo: new FormControl(undefined, Validators.required),
    especialidad: new FormControl(
      { value: undefined, disabled: true },
      Validators.required
    ),
  });

  constructor(private salesUpService: SalesupService) { }

  tipoChange() {
    if (this.altaVendedorForm.get('tipo') != undefined) {
      this.altaVendedorForm.get('especialidad')?.enable();
    }
  }

  ngOnInit() { }

  getMoreVendedores(event: any) {
    this.limiteSelects += 20;
    if (this.vendedores.length <= this.limiteSelects) {
      event.component.disableInfiniteScroll();
    } else {
      event.component.endInfiniteScroll();
    }
  }

  searchVendedores(event: any) {
    this.limiteSelects = 20;
    event.component.enableInfiniteScroll();

    if (event.text != '') {
      this.vendedores = this.vendedores2.filter((vendedor) =>
        vendedor.nombreC
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
    this.getFormData();
  }

  async getFormData() {
    let response = await lastValueFrom(
      this.salesUpService.getVendedoresSinRegistrar()
    ).catch(() => {
      this.salesUpService.createAlert(
        'Error al conectar con el servidor. Intente de nuevo.',
        'danger'
      );
    });
    if (response) {
      this.vendedores = response.vendedores;
      this.vendedores2 = response.vendedores;
    }
    response = await lastValueFrom(this.salesUpService.getZonas()).catch(() => {
      this.salesUpService.createAlert(
        'Error al conectar con el servidor. Intente de nuevo.',
        'danger'
      );
    });
    if (response) {
      this.zonas = response.zonas;
    }
  }

  altaVendedor() {
    let id_sap = this.altaVendedorForm.get('id_sap')?.value?.id_vendedorSap;
    this.altaVendedorForm.get('id_sap')?.setValue(id_sap);

    this.salesUpService.altaVendedor(this.altaVendedorForm.value).subscribe({
      next: () => {
        this.altaVendedorForm.reset();
        this.getFormData();
        this.salesUpService.createAlert(
          'El vendedor fue dado de alta en Sales Up.',
          'success'
        );
      },
      error: () => {
        this.salesUpService.createAlert(
          'Error al conectar con el servidor. Intente de nuevo.',
          'danger'
        );
      }
    });
  }
}
