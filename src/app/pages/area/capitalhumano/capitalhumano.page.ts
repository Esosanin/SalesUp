import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonInfiniteScroll, IonInput, IonPopover, LoadingController, ToastController } from '@ionic/angular';
import { CuentaService } from 'src/app/servicios/cuenta/cuenta.service';
import { Colaborador } from 'src/app/model/area/capitalhumano/Colaborador';
import { LoginService } from 'src/app/servicios/login/login.service';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-capitalhumano',
  templateUrl: './capitalhumano.page.html',
  styleUrls: ['./capitalhumano.page.scss'],
})

export class CapitalhumanoPage implements OnInit {


  @ViewChild('searchInput') searchInput: any;
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll!: IonInfiniteScroll;
  @ViewChild('foto', { static: false }) foto: any;
  @ViewChild('popover', { static: false }) popover!: IonPopover;

  segment: string = 'colaboradores';
  isOpen: boolean = false;
  colaboradores: any = [];
  showSearchbar: boolean = false;
  nacionalidades: any;
  carreras: any = [];
  estudios: any = [];
  regiones: any = [];
  activos: boolean = true;
  sucursales: any = [];
  //id_colaborador: number = parseInt(localStorage.getItem('id_colaborador'));
  today: Date = new Date();
  dia: string = this.today.getDate() >= 10 ? this.today.getDate().toString() : '0' + (this.today.getDate());
  from: string = this.today.getFullYear() + '-' + (this.today.getMonth() + 1 >= 10 ? (this.today.getMonth() + 1) : '0' + (this.today.getMonth() + 1)) + '-01';
  to: string = this.today.getFullYear() + '-' + (this.today.getMonth() + 1 >= 10 ? (this.today.getMonth() + 1) : '0' + (this.today.getMonth() + 1)) + '-' + this.dia;
  showModalFechas: boolean = false;
  limite: number = 30;
  limiteSelects: number = 20;
  menu: boolean = false;
  id_colaborador_menu: number = 0;
  editar: boolean = false;
  colaboradorData: Colaborador = new Colaborador();
  tipoSangres: any = [];
  tipoEmpleado: any;
  nombreRegion: any;
  colaboradores2: any = [];
  departamentos: any;
  areas: any = [];
  geografias: any = [];
  puestos: any = [];
  puestos2: any = [];
  especialidades: any = [];
  especialidades2: any = [];
  especialidadSelected: any = {};
  showModalForm: boolean = false;
  modalFormTitle: string = '';
  jefeInmediatoSelected: any = {};
  jefeInmediatoSelect: any = [];
  jefeInmediatoSelect2: any = [];
  aprobadorSelected: any = {};
  aprobadorSelect: any = [];
  aprobadorSelect2: any = [];
  eyeClicked: boolean = false;
  typePass: string = 'password';
  formData: FormData = new FormData();
  puestoSelected: any = {};
  copyText: boolean = false;
  hojas: any = [];
  posApoyo: any = [];
  posApoyo2: any = [];
  tabuladorData: any = [];
  tabuladorDataAll: any = [];
  hoja: string = '';
  posApoyoText: string = '';
  categorias: any = [];
  categorias2: any = [];
  niveles: any = [];

  constructor(private service: CuentaService,
    public service2: LoginService,
    private toast: ToastController,
    private loadingController: LoadingController,
    private router: Router) { }

    presentPopover(e: Event) {
      this.popover.event = e;
      this.isOpen = true;
    }

  async loading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      spinner: 'circles'
    });

    await loading.present();
  }

  openCarreras(){
    this.popover.dismiss().finally(()=>{
      this.router.navigate(['/tabs/area/capitalhumano/carreras']);
    });
  }
  openEspecialidades(){
    this.popover.dismiss().finally(()=>{
      this.router.navigate(['/tabs/area/capitalhumano/especialidades']);
    });
  }
  openNacionalidades(){
    this.popover.dismiss().finally(()=>{
      this.router.navigate(['/tabs/area/capitalhumano/nacionalidades']);
    });
  }
  openPuestos(){
    this.popover.dismiss().finally(()=>{
      this.router.navigate(['/tabs/area/capitalhumano/puestos']);
    });
  }
  openRegiones(){
    this.popover.dismiss().finally(()=>{
      this.router.navigate(['/tabs/area/capitalhumano/regiones']);
    });
  }
  openSucursales(){
    this.popover.dismiss().finally(()=>{
      this.router.navigate(['/tabs/area/capitalhumano/sucursales']);
    });
  }
  openOfertas(){
    this.popover.dismiss().finally(()=>{
      this.router.navigate(['/tabs/area/capitalhumano/ofertas-laborales']);
    });
  }
  openPropuestas(){
    this.popover.dismiss().finally(()=>{
      this.router.navigate(['/tabs/area/capitalhumano/propuesta-salarial']);
    });
  }

  eyeClick() {
    this.eyeClicked ? this.eyeClicked = false : this.eyeClicked = true;
  }

  activosChange(event: any) {
    if (event.detail.checked) {
      this.activos = true;
    } else {
      this.activos = false;
    }
    if (this.showSearchbar) {
      this.searchColaboradores(event = { detail: { value: this.searchInput.value } });
    } else {
      this.searchColaboradores(event = { detail: { value: '' } })
    }
  }
  sucursalChange(event: any) {
    this.regiones = [];
    for (let i = 0; i < this.sucursales.length; i++) {
      if (this.sucursales[i].id_sucursal == event.detail.value) {
        this.nombreRegion = this.sucursales[i].nombre_region;
        this.colaboradorData.id_region = this.sucursales[i].id_region;
      }
    }
    if (!this.nombreRegion) {
      this.nombreRegion = "Sin región registrada";
      this.colaboradorData.id_region = 0;
    }

  }
  departamentoChange(event: any) {
    for (let i = 0; i < this.departamentos.length; i++) {
      if (this.departamentos[i].departamentos_id == event.detail.value) {
        this.areas = [{ id_area: this.departamentos[i].id_area, area: this.departamentos[i].area }];
      }
    }
    this.colaboradorData.id_area = this.areas[0].id_area;
  }

  async getFormData() {
    let response = await lastValueFrom(this.service.getSangre());
    if(response){
      this.tipoSangres = response.tipoSangre;
    }
    response = await lastValueFrom(this.service.getNacionalidades());
    if(response){
      this.nacionalidades = response;
    }
    response = await lastValueFrom(this.service.getEstudios());
    if(response){
      this.estudios = response;
    }
    response = await lastValueFrom(this.service.getCarreras());
    if(response){
      this.carreras = response;
    }
    response = await lastValueFrom(this.service.getTipoEmpleado());
    if(response){
      this.tipoEmpleado = response;
    }
    response = await lastValueFrom(this.service.getSucursales());
    if(response){
      this.sucursales = response;
    }
    response = await lastValueFrom(this.service.getDepartamentos());
    if(response){
      this.departamentos = response;
    }
    response = await lastValueFrom(this.service.getGeografias());
    if(response){
      this.geografias = response;
    }
    response = await lastValueFrom(this.service.getPuestos());
    if(response){
      this.puestos = response;
      this.puestos2 = response;
    }
    response = await lastValueFrom(this.service.getEspecialidades());
    if(response){
      this.especialidades = response;
      this.especialidades2 = response;
    }
    response = await lastValueFrom(this.service.getHojaEspecialidad());
    if(response){
      this.hojas = response[0];
        this.posApoyo2 = response[1];
        this.categorias2 = response[2];
    }
  }

  fotoChange() {
    this.foto.getInputElement().then((res:any) => {
      if (res.files.length > 0) {
        if (res.files[0].type == 'image/jpg' || res.files[0].type == 'image/jpeg' || res.files[0].type == 'image/png') {
          this.formData.append('foto', res.files[0]);
        } else {
          res.value = null;
          this.service.createAlert('Solo se aceptan fotografías de tipo jpg, jpeg y png.', 'danger');
        }
      }
    })
  }

  hojaChange() {
    let arr = [];
    for (let i = 0; i < this.posApoyo2.length; i++) {
      if (this.posApoyo2[i].hoja == this.tabuladorData.hoja) {
        arr.push(this.posApoyo2[i]);
      }
    }
    this.posApoyo = arr;
    if (this.hoja != this.tabuladorData.hoja) {
      this.tabuladorData.posicion_apoyo = null;
      this.tabuladorData.categoria = null;
      this.colaboradorData.ingreso_bruto_men = 0;
      this.colaboradorData.tab_nivel = 1;
      this.hoja = this.tabuladorData.hoja;
    }
  }

  posApoyoChange() {
    let arr = [];
    for (let i = 0; i < this.categorias2.length; i++) {
      if (this.categorias2[i].hoja == this.tabuladorData.hoja && this.categorias2[i].posicion_apoyo == this.tabuladorData.posicion_apoyo) {
        arr.push(this.categorias2[i]);
      }
    }
    this.categorias = arr;
    if (this.posApoyoText != this.tabuladorData.posicion_apoyo) {
      this.tabuladorData.categoria = null;
      this.colaboradorData.ingreso_bruto_men = 0;
      this.posApoyoText = this.tabuladorData.posicion_apoyo;
    }
  }

  categoriaChange() {
    if (this.tabuladorData.hoja && this.tabuladorData.posicion_apoyo && this.tabuladorData.categoria) {
      for (let i = 0; i < this.tabuladorDataAll.length; i++) {
        if (this.tabuladorDataAll[i].hoja == this.tabuladorData.hoja &&
          this.tabuladorDataAll[i].posicion_apoyo == this.tabuladorData.posicion_apoyo &&
          this.tabuladorDataAll[i].categoria == this.tabuladorData.categoria) {
          this.tabuladorData = {
            hoja: this.tabuladorDataAll[i].hoja, posicion_apoyo: this.tabuladorDataAll[i].posicion_apoyo, categoria: this.tabuladorDataAll[i].categoria,
            nivel_1: this.tabuladorDataAll[i].nivel_1, nivel_2: this.tabuladorDataAll[i].nivel_2, nivel_3: this.tabuladorDataAll[i].nivel_3, nivel_4: this.tabuladorDataAll[i].nivel_4
          };
          break;
        }
      }

      if (this.tabuladorData.nivel_1 != 0 && this.tabuladorData.nivel_2 != 0 && this.tabuladorData.nivel_3 != 0 && this.tabuladorData.nivel_4 != 0) {
        this.niveles = [1, 2, 3, 4];
        if(this.colaboradorData.tab_nivel == 0){
          this.colaboradorData.tab_nivel = 1
        }
      }
      if (this.tabuladorData.nivel_1 != 0 && this.tabuladorData.nivel_2 != 0 && this.tabuladorData.nivel_3 != 0 && this.tabuladorData.nivel_4 == 0) {
        this.niveles = [1, 2, 3];
        if(this.colaboradorData.tab_nivel == 0){
          this.colaboradorData.tab_nivel = 1
        }
      }
      if (this.tabuladorData.nivel_1 != 0 && this.tabuladorData.nivel_2 != 0 && this.tabuladorData.nivel_3 == 0 && this.tabuladorData.nivel_4 == 0) {
        this.niveles = [1, 2];
        if(this.colaboradorData.tab_nivel == 0){
          this.colaboradorData.tab_nivel = 1
        }
      }
      if (this.tabuladorData.nivel_1 != 0 && this.tabuladorData.nivel_2 == 0 && this.tabuladorData.nivel_3 == 0 && this.tabuladorData.nivel_4 == 0) {
        this.niveles = [1];
        this.colaboradorData.tab_nivel = 1;
      }

      switch (this.colaboradorData.tab_nivel) {
        case 1:
          this.colaboradorData.ingreso_bruto_men = this.tabuladorData.nivel_1;
          break;
        case 2:
          this.colaboradorData.ingreso_bruto_men = this.tabuladorData.nivel_2;
          break;
        case 3:
          this.colaboradorData.ingreso_bruto_men = this.tabuladorData.nivel_3;
          break;
        case 4:
          this.colaboradorData.ingreso_bruto_men = this.tabuladorData.nivel_4;
          break;
      }
    }
  }

  nivelChange() {
    if (this.tabuladorData.hoja && this.tabuladorData.posicion_apoyo && this.tabuladorData.categoria) {

      switch (this.colaboradorData.tab_nivel) {
        case 1:
          this.colaboradorData.ingreso_bruto_men = this.tabuladorData.nivel_1;
          break;
        case 2:
          this.colaboradorData.ingreso_bruto_men = this.tabuladorData.nivel_2;
          break;
        case 3:
          this.colaboradorData.ingreso_bruto_men = this.tabuladorData.nivel_3;
          break;
        case 4:
          this.colaboradorData.ingreso_bruto_men = this.tabuladorData.nivel_4;
          break;
      }
    }
  }

  registroChange() {
    this.copyText = false;
  }

  editColaborador(id_colaborador: number, editar: boolean) {
    this.colaboradorData = new Colaborador();
    this.formData = new FormData();
    this.eyeClicked = false;
    this.typePass = 'password';
    this.colaboradorData.id_colaborador = id_colaborador;
    this.loading();
    if (editar) {
      this.editar = true;
      this.modalFormTitle = 'Editar colaborador';
      this.menu = false;
      this.showModalForm = true;
      this.getFormData().finally(() => {
        this.service.getColaborador(this.colaboradorData.id_colaborador).subscribe(
          r => {
            console.log(r);
            this.colaboradorData = r.colaborador;
            if(this.colaboradorData.infonavit){
              this.colaboradorData.infonavit = parseFloat(this.colaboradorData.infonavit.toString());
            }
            this.tabuladorDataAll = r.tabulador;
            for (let i = 0; i < this.tabuladorDataAll.length; i++) {
              if (this.tabuladorDataAll[i].id == this.colaboradorData.tabulador_id) {
                this.tabuladorData = {
                  hoja: this.tabuladorDataAll[i].hoja, posicion_apoyo: this.tabuladorDataAll[i].posicion_apoyo, categoria: this.tabuladorDataAll[i].categoria,
                  nivel_1: this.tabuladorDataAll[i].nivel_1, nivel_2: this.tabuladorDataAll[i].nivel_2, nivel_3: this.tabuladorDataAll[i].nivel_3, nivel_4: this.tabuladorDataAll[i].nivel_4
                };
              }
            }
            this.hoja = this.tabuladorData.hoja;
            this.posApoyoText = this.tabuladorData.posicion_apoyo;
            for (let i = 0; i < this.especialidades2.length; i++) {
              if(this.especialidades2[i].id_especialidad == this.colaboradorData.especialidad){
                this.especialidadSelected = this.especialidades2[i];
              }
            }
            if (this.colaboradorData.fonacot == null) this.colaboradorData.fonacot = false;
            if (this.colaboradorData.infonavit == null) this.colaboradorData.infonavit = 0;
            for (let i = 0; i < this.jefeInmediatoSelect2.length; i++) {
              if (this.jefeInmediatoSelect2[i].id_colaborador == this.colaboradorData.jefe_inmediato) {
                this.jefeInmediatoSelected = { id_colaborador: this.jefeInmediatoSelect2[i].id_colaborador, nombreC: this.jefeInmediatoSelect2[i].nombreC };
              }
              if (this.jefeInmediatoSelect2[i].id_colaborador == this.colaboradorData.id_aprobador) {
                this.aprobadorSelected = { id_colaborador: this.jefeInmediatoSelect2[i].id_colaborador, nombreC: this.jefeInmediatoSelect2[i].nombreC };
              }
            }
            let areas = [];
            for (let i = 0; i < this.departamentos.length; i++) {
              if (this.departamentos[i].id_area == this.colaboradorData.id_area) {
                areas.push({ id_area: this.departamentos[i].id_area, area: this.departamentos[i].area });
                break;
              }
            }
            this.areas = areas;
            this.colaboradorData.id_area = this.areas[0].id_area;

            for (let i = 0; i < this.puestos2.length; i++) {
              if (this.colaboradorData.id_puesto == this.puestos2[i].id_puesto) {
                this.puestoSelected = { id_puesto: this.puestos2[i].id_puesto, puesto: this.puestos2[i].puesto };
                break;
              }
            }
            this.loadingController.dismiss()
          });
      });
    } else {
      this.editar = false;
      this.modalFormTitle = 'Nuevo colaborador';
      this.tabuladorData = null;
      this.jefeInmediatoSelected = null;
      this.aprobadorSelected = null;
      this.puestoSelected = null;
      this.showModalForm = true;
      this.getFormData().finally(() => this.loadingController.dismiss());
    }
  };

  saveColaborador() {
    this.colaboradorData.jefe_inmediato = this.jefeInmediatoSelected.id_colaborador;
    this.colaboradorData.id_aprobador = this.aprobadorSelected.id_colaborador;
    this.colaboradorData.id_puesto = this.puestoSelected.id_puesto;
    this.colaboradorData.especialidad = this.especialidadSelected.id_especialidad;
    this.formData.append('datos', JSON.stringify(this.colaboradorData));
    this.formData.append('tabulador', JSON.stringify(this.tabuladorData));
    this.service.saveColaborador(this.formData).subscribe(
      () => {
        this.getColaboradores(this.activos);
        if (this.colaboradorData.id_colaborador == parseInt(localStorage.getItem('id_colaborador')!)) {
          if (this.formData.get('foto')) {
            const file: any = this.formData.get('foto')!;
            this.service2.foto = this.service2.fotosUrl + file['name'];
            localStorage.setItem('foto', file['name']);
          } else {
            this.service2.foto = this.service2.fotosUrl + this.colaboradorData.foto;
            localStorage.setItem('foto', this.colaboradorData.foto);
          }
        }
        this.showModalForm = false;
        this.colaboradorData.id_colaborador == 0 ? this.service.createAlert('Colaborador registrado.', 'success') : this.service.createAlert('Colaborador actualizado.', 'success');
      }
    );
  }

  copiar(selectInput: any) {
    navigator.clipboard.writeText(selectInput.model);
    this.copyText = true;
  }

  refresh(event: any) {
    this.getColaboradores(this.activos).finally(()=>event.target.complete());
  }

  openMenu(id_colaborador: number) {
    this.id_colaborador_menu = id_colaborador;
    this.menu = true;
  }

  //alertas on link
  async createAlertButton(message: string, color: string = '') {
    const toast = await this.toast.create({
      message: message, color: color, buttons: [
        {
          side: 'end',
          text: 'Abrir',
          handler: () => {
            //FALTA CONFIGURAR PARA ABRIR EXCEL EN NAVEGADOR
          }
        },
        {
          side: 'end',
          icon: 'close',
          handler: () => {
            toast.dismiss();
          }
        }
      ]
    });
    return toast.present();
  }

  //generar excel con las asistencias diarias

  generateExcel() {
    let data: any = { from: this.from, to: this.to };
    this.service.generateExcel(data).subscribe(
      r => {
        if (r == 1) {
          this.showModalFechas = false;
          this.createAlertButton('Reporte de asistencia generado.', 'success');
        } else {
          this.showModalFechas = false;
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        }
      });
  }

  generatePDF(id_colaborador: number) {
    this.service.generatePDF(id_colaborador).subscribe((data: Blob) =>{
      let url = window.URL.createObjectURL(data);
        window.open(url);
        this.menu = false;
    });
  }

  //FOCUS BÚSQUEDA
  focus() {
    setTimeout(() => {
      this.searchInput.setFocus();
    }, 500);
  }

  //BUSCADOR FILTRANDO ARRAY Y NO MANDANDO SOLICITUD CADA VEZ
  searchColaboradores(event: any) {
    if (event.detail && event.detail.value != '') {
      this.ScrollToTop();
      this.colaboradores = this.colaboradores2.filter((colaborador: any) =>
        colaborador.area != null && colaborador.nombre_region != null ?
          colaborador.estado == this.activos &&
          (colaborador.apellido_p.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '').includes(
            event.detail.value.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')) ||
            colaborador.apellido_m.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '').includes(
              event.detail.value.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')) ||
            colaborador.nombres.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '').includes(
              event.detail.value.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')) ||
            colaborador.area.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '').includes(
              event.detail.value.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')) ||
            colaborador.nombre_region.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '').includes(
              event.detail.value.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')) ||
            colaborador.n_colaborador.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '').includes(
              event.detail.value.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, ''))) :
          colaborador.estado == this.activos &&
          (colaborador.apellido_p.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '').includes(
            event.detail.value.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')) ||
            colaborador.apellido_m.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '').includes(
              event.detail.value.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')) ||
            colaborador.nombres.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '').includes(
              event.detail.value.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')) ||
            colaborador.n_colaborador.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '').includes(
              event.detail.value.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')))
      );
    } else {
      this.filterActivos(this.activos);
    }
  }

  async getColaboradores(activos: boolean) {
    let response = await lastValueFrom(this.service.getColaboradores());
    if (response){
      this.colaboradores2 = response.colaboradores;
        if (this.showSearchbar) {
          this.searchColaboradores({ detail: { value: this.searchInput.value } });
        } else {
          this.filterActivos(activos);
        }
    }
  }

  getMoreJefeInmediato(event: any) {
    this.limiteSelects += 30;
    if (this.limiteSelects >= this.jefeInmediatoSelect.length) {
      event.component.disableInfiniteScroll();
    } else {
      event.component.endInfiniteScroll();
    }
  }
  getMoreEspecialidades(event: any) {
    this.limiteSelects += 30;
    if (this.limiteSelects >= this.especialidades.length) {
      event.component.disableInfiniteScroll();
    } else {
      event.component.endInfiniteScroll();
    }
  }

  getMorePuestos(event: any) {
    this.limiteSelects += 30;
    if (this.limiteSelects >= this.puestos.length) {
      event.component.disableInfiniteScroll();
    } else {
      event.component.endInfiniteScroll();
    }
  }

  searchPuesto(event: any) {
    this.limiteSelects = 30;
    event.component.enableInfiniteScroll();
    if (this.limiteSelects >= this.puestos.length) {
      event.component.disableInfiniteScroll();
    }
    if (event.text != '') {
      this.puestos = this.puestos2.filter((puesto: any) => puesto.puesto.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '').includes(event.text.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')));
    } else {
      this.puestos = this.puestos2;
    }
  }

  searchEspecialidades(event: any) {
    this.limiteSelects = 30;
    event.component.enableInfiniteScroll();
    if (this.limiteSelects >= this.especialidades.length) {
      event.component.disableInfiniteScroll();
    }
    if (event.text != '') {
      this.especialidades = this.especialidades2.filter((especialidad:any) => especialidad.especialidad.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '').includes(event.text.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')));
    } else {
      this.especialidades = this.especialidades2;
    }
  }

  searchJefeInmediato(event: any) {
    this.limiteSelects = 30;
    event.component.enableInfiniteScroll();
    if (this.limiteSelects >= this.jefeInmediatoSelect.length) {
      event.component.disableInfiniteScroll();
    }
    if (event.text != '') {
      this.jefeInmediatoSelect = this.jefeInmediatoSelect2.filter((jefe:any) => jefe.nombreC.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '').includes(event.text.toString().toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')));
    } else {
      this.jefeInmediatoSelect = this.jefeInmediatoSelect2;
    }
  }

  filterActivos(activos: boolean) {
    this.ScrollToTop();
    if (activos) {
      let arr = []
      for (let i = 0; i < this.colaboradores2.length; i++) {
        if (this.colaboradores2[i].estado == 1) {
          arr.push(this.colaboradores2[i]);
        }
      }
      this.colaboradores = arr;
      this.jefeInmediatoSelect = arr;
      this.jefeInmediatoSelect2 = arr;
    } else {
      let arr = []
      for (let i = 0; i < this.colaboradores2.length; i++) {
        if (this.colaboradores2[i].estado == 0) {
          arr.push(this.colaboradores2[i]);
        }
      }
      this.colaboradores = arr;
    }
  }

  ScrollToTop() {
    this.content.scrollToTop(700).finally(() => {
      this.limite = 30;
    });
  }

  ngOnInit() {
    this.getColaboradores(true);
  }

  addItems(event: any) {
    this.limite += 30;
    event.target.complete();
  }

}
