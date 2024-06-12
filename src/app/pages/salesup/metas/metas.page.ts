import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonInput, LoadingController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { Meta } from 'src/app/model/salesup/opciones/meta';
import { SalesupService } from 'src/app/servicios/salesup/salesup.service';

@Component({
  selector: 'app-metas',
  templateUrl: './metas.page.html',
  styleUrls: ['./metas.page.scss'],
})
export class MetasPage implements OnInit {
  @ViewChild('searchInput', { static: false }) searchInput!: IonInput;
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  vendedores: any = [];
  vendedores2: any = [];
  metas: any = [];
  meta: Meta = new Meta();
  limite: number = 5;
  tipo: string = '';
  id_sap: number = 0;
  id_zona: number = 0;
  zona: string = '';
  zonas: Array<any> = [];
  showSearchbar: boolean = false;

  constructor(
    private service: SalesupService,
    private loadingCtrl: LoadingController
  ) {}

  refresh(event: any) {
    this.getVendedores().finally(()=>{
      event.target.complete();
    });
  }

  searchMeta(event: any) {
    this.limite = 5;
    if (event.detail && event.detail.value != '')
      this.vendedores = this.vendedores2.filter((vendedor: any) =>
        vendedor.nombre
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
    else this.vendedores = this.vendedores2;
  }

  getMoreMetas(event: any) {
    this.limite += 5;
    event.target.complete();
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.tipo = localStorage.getItem('tipo')!;
    this.id_sap = parseInt(localStorage.getItem('id_sap')!);
    this.id_zona = parseInt(localStorage.getItem('id_zona')!);
    if (this.tipo == 'Corporativo') {
      this.service.getZonas().subscribe((response) => {
        this.zonas = response.zonas;
      });
    } else {
      this.getVendedores();
    }
  }

  saveMeta(metas: Meta) {
    this.service.saveMeta(metas).subscribe(() => {
      this.service.createAlert('Meta actualizada.', 'success');
      this.getVendedores();
    });
  }

  zonaChange(event: any) {
    this.id_zona = event.detail?.value;
    this.getVendedores();
  }

  async getVendedores() {
    this.showLoading();
    const data = {
      tipo: 'Gerente',
      id_sap: this.id_sap,
      id_zona: this.id_zona,
    };
    let response = await lastValueFrom(this.service.getVendedores(data));
    if (response) {
      this.vendedores = response.vendedores;
      let nombre = '';
      if (this.tipo == 'Corporativo') {
        for (let i = 0; i < this.zonas.length; i++) {
          if (this.zonas[i].id == this.id_zona) {
            nombre = this.zonas[i].zona;
          }
        }
      } else {
        nombre = localStorage.getItem('zona')!;
      }

      this.vendedores.unshift({ id_zona: this.id_zona, nombre: nombre });
      for (let i = 0; i < this.vendedores.length; i++) {
        this.vendedores[i].metas = new Meta();
        if (i > 0) {
          this.vendedores[i].metas.id_sap = this.vendedores[i].id_sap;
        } else {
          this.vendedores[i].metas.id_zona = this.id_zona;
        }
      }
      const data2 = { id_zona: this.id_zona };
      let response2 = await lastValueFrom(this.service.getMetas(data2));
      this.metas = response2.metas;
      for (let i = 0; i < this.vendedores.length; i++) {
        for (let z = 0; z < this.metas.length; z++) {
          if (this.vendedores[i].id_sap == this.metas[z].id_sap) {
            this.vendedores[i].metas.id = parseInt(this.metas[z].id);
            this.vendedores[i].metas.meta_leads = parseInt(
              this.metas[z].meta_leads
            );
            this.vendedores[i].metas.meta_tvfc = parseInt(
              this.metas[z].meta_tvfc
            );
            this.vendedores[i].metas.meta_eh = parseFloat(
              this.metas[z].meta_eh
            );
            this.vendedores[i].metas.meta_uep = parseFloat(
              this.metas[z].meta_uep
            );
            this.vendedores[i].metas.meta_sva = parseFloat(
              this.metas[z].meta_sva
            );
            this.vendedores[i].metas.meta_sci = parseFloat(
              this.metas[z].meta_sci
            );
            this.vendedores[i].metas.meta_spf = parseFloat(
              this.metas[z].meta_spf
            );
            this.vendedores[i].metas.meta_stm = parseFloat(
              this.metas[z].meta_stm
            );
            this.vendedores[i].metas.id_zona = parseFloat(
              this.metas[z].id_zona
            );
          }
          if (this.metas[z].id_sap == 0) {
            this.vendedores[0].metas.id = parseInt(this.metas[z].id);
            this.vendedores[0].metas.meta_leads = parseInt(
              this.metas[z].meta_leads
            );
            this.vendedores[0].metas.meta_tvfc = parseInt(
              this.metas[z].meta_tvfc
            );
            this.vendedores[0].metas.meta_eh = parseFloat(
              this.metas[z].meta_eh
            );
            this.vendedores[0].metas.meta_uep = parseFloat(
              this.metas[z].meta_uep
            );
            this.vendedores[0].metas.meta_sva = parseFloat(
              this.metas[z].meta_sva
            );
            this.vendedores[0].metas.meta_sci = parseFloat(
              this.metas[z].meta_sci
            );
            this.vendedores[0].metas.meta_spf = parseFloat(
              this.metas[z].meta_spf
            );
            this.vendedores[0].metas.meta_stm = parseFloat(
              this.metas[z].meta_stm
            );
            this.vendedores[0].metas.id_zona = parseFloat(
              this.metas[z].id_zona
            );
          }
        }
      }

      this.vendedores2 = this.vendedores;
      setTimeout(() => {
        this.loadingCtrl.dismiss();
      }, 500);
    }
  }

  focus() {
    setTimeout(() => {
      this.searchInput.setFocus();
    }, 500);
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      spinner: 'circles',
    });

    loading.present();
  }
}
