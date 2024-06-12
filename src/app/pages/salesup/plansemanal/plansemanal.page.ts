import { DatePipe, formatCurrency } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  AlertController,
  IonContent,
  IonInput,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { Actividad } from 'src/app/model/salesup/plansemanal/actividad';
import { Plan } from 'src/app/model/salesup/plansemanal/plan';
import { Visita } from 'src/app/model/salesup/plansemanal/visita';
import { SalesupService } from 'src/app/servicios/salesup/salesup.service';
import { Geolocation } from '@capacitor/geolocation';
import { Compromiso } from 'src/app/model/salesup/plansemanal/compromiso';
import { Acompanamiento } from 'src/app/model/salesup/plansemanal/acompanamiento';
import { Levantamiento } from 'src/app/model/salesup/plansemanal/levantamiento';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';

interface vendedorSelected {
  id_sap: number;
  nombre: string;
  id_colaborador: number;
}

interface cuentaSelected {
  CardCode: string;
  CardName: string;
  LineNum: number;
}

interface cotizacionSelected {
  DocNum: string;
  NumatCard: string;
}

@Component({
  selector: 'app-plansemanal',
  templateUrl: './plansemanal.page.html',
  styleUrls: ['./plansemanal.page.scss'],
})
export class PlansemanalPage implements OnInit {
  @ViewChild('searchInput') searchInput!: IonInput;
  @ViewChild('file') file!: IonInput;
  @ViewChild('planModal') planModal: any;
  @ViewChild('visitaModal') visitaModal: any;
  @ViewChild('detalleVisitaModal') detalleVisitaModal: any;
  @ViewChild('actividadModal') actividadModal: any;
  @ViewChild('acompanamientoModal') acompanamientoModal: any;
  @ViewChild('levantamientoModal') levantamientoModal: any;
  @ViewChild('compromisoModal') compromisoModal: any;
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild(DataTableDirective) dt!: DataTableDirective;

  id_zona: number = 0;
  id_sap: number = 0;
  showSearchbar: boolean = false;
  planes: any = [];
  showModalPlan: boolean = false;
  showModalVisita: boolean = false;
  showModalDetalleVisita: boolean = false;
  showModalActividad: boolean = false;
  showModalCompromiso: boolean = false;
  showModalLevantamiento: boolean = false;
  planTitle: string = '';
  modalType: string = '';
  vendedor: string = localStorage.getItem('nombre_colaborador')!;
  proyMensual: string = '';
  proySemanal: string = '';
  fechaInicio: string = '';
  fechaCreacion: string = '';
  visitas = Array();
  seguimientos: any = [];
  cuentas = Array();
  cuentas2 = Array();
  cuentaSelected: undefined | cuentaSelected;
  visita: Visita = new Visita();
  detalles: Array<any> = [];
  visitaId: number = 0;
  visitaTitle: string = '';
  visitaEstatus: string = '';
  detVisitas: Array<any> = [];
  mapUrl: SafeResourceUrl = '';
  actividades: any = [];
  actividadTitle: string = '';
  actividadObjetivo: string = '';
  actividadEstatus: string = '';
  compromisos = Array();
  levantamientos = Array();
  compromisoFechas: any = [];
  contactos: any = [];
  contactos2: any = [];
  CardCode: string = '';
  LineNum = 0;
  actividad: Actividad = new Actividad();
  fecha_create: string = '';
  confirmacion: boolean = false;
  idPlan: number = 0;
  editar: boolean = false;
  actividadModalTitle: string = 'Agregar actividad';
  visitaModalTitle: string = 'Agregar visita';
  compromisoModalTitle: string = 'Agregar compromiso';
  visitaIndex: number = 0;
  checkIn2: boolean = false;
  visitaCompleta: boolean = false;
  actividadesCompletas: boolean = false;
  acompanamientos: any = [];
  compromiso: Compromiso = new Compromiso();
  compromisoTitle: string = '';
  compromisoEstatus: string = '';
  showModalAcompanamiento: boolean = false;
  acompanamiento: Acompanamiento = new Acompanamiento();
  vendedorSelected: undefined | vendedorSelected = undefined;
  vendedores: any = [];
  acompanamientoModalTitle: string = 'Agregar acompañamiento';
  limite: number = 20;
  limiteSelects: number = 20;
  vendedoresLength: number = 0;
  vendedores2: any = [];
  planIndex: number = 0;
  planes2: any = [];
  levantamiento: Levantamiento = new Levantamiento();
  levantamientoModalTitle: string = 'Agregar levantamiento';
  today: string = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
  tipo: string = '';
  cotizaciones = Array();
  cotizaciones2 = Array();
  cotizacionSelected: undefined | cotizacionSelected;
  showModalDetalleActividad = false;
  actividadIndex = 0;
  showModalDetalleLevantamiento = false;
  levantamientoIndex = 0;
  levantamientoTitulo = '';
  levantamientoSubtitle = '';
  showModalDetallesCot = false;
  imagenes = Array();
  showModalImagenes = false;
  imagenForm: FormGroup = new FormGroup({
    id: new FormControl(0),
    archivo: new FormControl('', Validators.required),
    numParte: new FormControl('', Validators.required),
    comentarios: new FormControl('', Validators.required),
    id_levantamiento: new FormControl(0),
  });

  formCot: FormGroup = new FormGroup({
    id_doc: new FormControl('', Validators.required),
    porc_cierre: new FormControl('', Validators.required),
    fecha_cierre: new FormControl(''),
    coments: new FormControl(''),
    edo: new FormControl('', Validators.required),
  });
  formData: FormData = new FormData();
  nombreArchivo = 'Seleccionar...';
  srcImage: any;
  isImage = false;
  editarImagen = false;
  imagenIndex = 0;
  showModalCotizaciones = false;
  filtroCotizaciones = 'semana';
  dtOptions: DataTables.Settings = {};
  static data: any;
  static showModalEditCotizacion = false;
  etapas = Array();
  static service2: any;
  static plan2: any;
  clienteCot = '';
  etapaCot = '';
  fechaContCot = '';
  subtotalCot = '';
  porcCierreCot = '';
  fechaCierreCot = '';
  zonaCot = '';
  oficinaCot = '';
  industriaCot = '';
  comentariosCot = '';
  partidas = Array();
  togglePln = false;
  detProyecciones = false;
  modalProyeccionesTitle = '';
  cotizado = 0;
  ponderado = 0;
  cantidad = 0;
  sucursales = Array();
  visitaSubtitle = '';
  isActividad = false;

  constructor(
    private service: SalesupService,
    private alertController: AlertController,
    public datePipe: DatePipe,
    private sanatizer: DomSanitizer,
    private loadingController: LoadingController,
    private router: Router,
    private modales: ModalController
  ) {
    PlansemanalPage.service2 = service;
    PlansemanalPage.plan2 = this;
  }

  ngOnInit() {}

  cuentaChange(tipo: string) {
    switch (tipo) {
      case 'visita':
        this.visita.LineNum = undefined;
        this.visita.CardCode = this.cuentaSelected!.CardCode;
        this.getSucursales(this.visita.CardCode);
        break;

      case 'compromiso':
        this.compromiso.LineNum = undefined;
        this.compromiso.CardCode = this.cuentaSelected!.CardCode;
        this.compromiso.CntctCode = undefined;
        this.getSucursales(this.compromiso.CardCode);
        break;

      case 'levantamiento':
        this.levantamiento.LineNum = undefined;
        this.levantamiento.CardCode = this.cuentaSelected!.CardCode;
        this.levantamiento.CntctCode = undefined;
        this.getSucursales(this.levantamiento.CardCode);
        break;
    }
  }

  sucursalChange(tipo: string) {
    switch (tipo) {
      case 'compromiso':
        this.compromiso.CntctCode = undefined;
        this.getContactos(this.compromiso.CardCode, this.compromiso.LineNum);
        break;

      case 'levantamiento':
        this.levantamiento.CntctCode = undefined;
        this.getContactos(
          this.levantamiento.CardCode,
          this.levantamiento.LineNum
        );
        break;
    }
  }

  async getContactos(CardCode: string, LineNum: number | undefined) {
    let data = {
      select: true,
      CardCode: CardCode,
      LineNum: LineNum,
    };
    let response = await lastValueFrom(this.service.getContactos(data));
    if (response) {
      this.contactos = response.select;
      this.contactos2 = response.select;
    }
  }

  async getSucursales(CardCode: string) {
    let data = {
      CardCode: CardCode,
      id_sap: this.planes[this.planIndex].id_sap,
    };
    let response = await lastValueFrom(this.service.getSucursales(data)).catch(
      () => {
        this.service.createAlert(
          'Error al conectar con el servidor. Intente de nuevo',
          'danger'
        );
      }
    );
    if (response) {
      this.sucursales = response.sucursales;
    }
  }

  getShowModalEditCotizacion() {
    return PlansemanalPage.showModalEditCotizacion;
  }

  setFalseShowModalCotizacion() {
    PlansemanalPage.showModalEditCotizacion = false;
  }

  ionViewWillLeave() {
    this.togglePln = false;
  }

  async reloadDataTable() {
    await this.dt.dtInstance.then((dtInstance: DataTables.Api) => {
      if (this.togglePln) {
        PlansemanalPage.data = {
          tipo: 1,
          type: 'app',
          user_id: this.planes[this.planIndex].id_colaborador,
          id_sap: this.planes[this.planIndex].id_sap,
          filtro: this.filtroCotizaciones,
          fecha: this.planes[this.planIndex].fecha_create,
        };
      } else {
        PlansemanalPage.data = {
          tipo: 1,
          type: 'app',
          user_id:
            this.tipo == 'Gerente' || this.tipo == 'Corporativo'
              ? this.vendedorSelected!.id_colaborador
              : localStorage.getItem('id_colaborador'),
          id_sap:
            this.tipo == 'Gerente' || this.tipo == 'Corporativo'
              ? this.vendedorSelected!.id_sap
              : this.id_sap,
          filtro: this.filtroCotizaciones,
          fecha: this.planes[this.planIndex].fecha_create,
        };
      }
      dtInstance.ajax.reload();
    });
  }

  addFile(file: IonInput) {
    file.getInputElement().then((input) => {
      input.click();
    });
  }

  saveImagen() {
    this.file.getInputElement().then((input) => {
      if (this.editarImagen) {
        this.formData.append('editar', 'true');
        if (input.files && input.files.length == 0) {
          this.formData.append('sinarchivo', 'true');
        } else {
          this.formData.append('sinarchivo', 'false');
        }
      } else {
        this.formData.append('editar', 'false');
        this.formData.append('sinarchivo', 'false');
      }
      this.formData.append('datos', JSON.stringify(this.imagenForm.value));

      lastValueFrom(this.service.saveImagenLevantamiento(this.formData))
        .then(() => {
          lastValueFrom(
            this.service.getImgLevantamiento(
              this.levantamientos[this.levantamientoIndex].id
            )
          )
            .then((response) => {
              this.imagenes = response.imagenes;
              this.showModalImagenes = false;
              if (this.imagenForm.get('id')!.value != 0) {
                this.service.createAlert(
                  'Datos actualizados con éxito.',
                  'success'
                );
              } else {
                this.service.createAlert(
                  'Datos guardados con éxito.',
                  'success'
                );
              }
            })
            .catch(() => {
              this.service.createAlert(
                'Error al obtener las imágenes. Intente de nuevo',
                'danger'
              );
            });
        })
        .catch(() => {
          this.service.createAlert(
            'Error al guardar la imagen. Intente de nuevo.',
            'danger'
          );
        });
    });
  }

  changeFile(file: IonInput) {
    file.getInputElement().then((input) => {
      if (input.files?.length! > 0) {
        this.nombreArchivo = input.files![0].name;
        if (
          input.files![0].type == 'image/jpg' ||
          input.files![0].type == 'image/png' ||
          input.files![0].type == 'image/jpeg'
        ) {
          this.srcImage = window.URL.createObjectURL(input.files![0]);
          this.isImage = true;
        } else {
          this.isImage = false;
        }
        this.formData.append('archivo', input.files![0]);
      } else {
        this.nombreArchivo = 'Seleccionar...';
        this.srcImage = null;
        this.formData.delete('archivo');
      }
    });
  }

  addImagen(editar: boolean, index: number) {
    this.imagenIndex = index;
    this.formData = new FormData();
    if (editar) {
      this.editarImagen = true;
      this.nombreArchivo = this.imagenes[index].imagen;
      this.srcImage =
        'http://intranet.ecn.com.mx:8060/lineup/public/files/salesup/levantamientos/' +
        this.nombreArchivo;
      this.imagenForm.get('id')?.setValue(this.imagenes[index].id);
      this.imagenForm.get('archivo')?.setValue(this.imagenes[index].imagen);
      this.imagenForm.get('numParte')?.setValue(this.imagenes[index].numparte);
      this.imagenForm
        .get('comentarios')
        ?.setValue(this.imagenes[index].comentarios);
      this.imagenForm
        .get('id_levantamiento')
        ?.setValue(this.imagenes[index].id_levantamiento);
    } else {
      this.editarImagen = false;
      this.nombreArchivo = 'Seleccionar...';
      this.imagenForm.reset();
      this.imagenForm
        .get('id_levantamiento')
        ?.setValue(this.levantamientos[this.levantamientoIndex].id);
    }

    this.showModalImagenes = true;
  }

  nuevaCuenta() {
    this.modales.dismiss().finally(() => {
      this.modales.dismiss().finally(() => {
        this.router.navigate(['tabs2/cuentas']);
      });
    });
  }

  nuevoContacto() {
    this.modales.dismiss().finally(() => {
      this.modales.dismiss().finally(() => {
        this.router.navigate(['tabs2/contactos']);
      });
    });
  }

  detalleActividad(index: number) {
    this.actividadIndex = index;
    this.getActividadData()
      .then(() => {
        this.isActividad = true;
        this.showModalDetalleActividad = true;
      })
      .catch(() => {
        this.service.createAlert(
          'Error al obtener los datos de la actividad. Intente de nuevo.','danger'
        );
      });
  }

  async getActividadData() {
    let data = {
      fecha_create: this.fecha_create,
      id_sap: this.planes[this.planIndex].id_sap,
      id_actividad: this.actividades[this.actividadIndex].id,
    };
    await lastValueFrom(this.service.getLevantamientos(data)).then(
      (response) => {
        this.levantamientos = response.levantamientos;
      }
    );
    await lastValueFrom(this.service.getCompromisos(data)).then((response) => {
      this.compromisos = response.compromisos;
    });
  }

  addContacto() {
    this.showModalActividad = false;
    this.modales.dismiss().finally(() => {
      this.router.navigate(['/tabs2/contactos']);
    });
  }

  async getCotizaciones(slpcode: number) {
    let response = await lastValueFrom(this.service.getCotizaciones(slpcode));
    if (response) {
      this.cotizaciones = response.cotizaciones;
      this.cotizaciones2 = response.cotizaciones;
    }
  }

  searchCotizaciones(event: any) {
    this.limiteSelects = 20;
    event.component.enableInfiniteScroll();

    if (event.text != '') {
      this.cotizaciones = this.cotizaciones2.filter((cotizacion) =>
        cotizacion.NumatCard.toString()
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

  getMoreCotizaciones(event: any) {
    this.limiteSelects += 20;
    if (this.limiteSelects >= this.cotizaciones.length) {
      event.component.disableInfiniteScroll();
    } else {
      event.component.endInfiniteScroll();
    }
  }

  async actualizarProy() {
    this.loading();
    let data = { id_plan: this.idPlan };
    let response = await lastValueFrom(this.service.actualizarProy(data)).catch(
      () => {
        this.loadingController.dismiss();
      }
    );
    if (response) {
      this.proyMensual = this.formatoMoneda(response.proy_men);
      this.proySemanal = this.formatoMoneda(response.proy_sem);
      this.updateDetalles(this.planIndex);
      this.loadingController.dismiss();
      this.service.createAlert('Proyecciones actualizadas.', 'success');
    }
  }

  ionViewWillEnter() {
    //this.vendedorSelected = undefined;
    //this.planes = [];
    //this.planes2 = [];
    this.tipo = localStorage.getItem('tipo')!;
    this.id_zona = parseInt(localStorage.getItem('id_zona')!);
    this.id_sap = parseInt(localStorage.getItem('id_sap')!);
    this.refresh(false);
  }

  async getPlanes(id_sap: any) {
    let data;
    if (id_sap == 0) {
      data = { tipo: this.tipo, id_zona: this.id_zona };
    } else {
      data = { tipo: 'Vendedor', id_sap: id_sap };
    }
    await lastValueFrom(this.service.getPlanes(data))
      .then((response) => {
        this.planes = response.planes;
        this.planes2 = response.planes;
      })
      .catch(() => {
        this.service.createAlert(
          'Error al obtener los planes. Intente de nuevo.',
          'danger'
        );
      });
  }

  addLevantamiento(editar: boolean, index: number, actividad: boolean) {
    this.loading();
    this.levantamiento = new Levantamiento();
    this.cuentaSelected = undefined;
    this.getCuentas()
      .finally(() => {
        if (actividad) {
          this.levantamiento.id_actividad =
            this.actividades[this.actividadIndex].id;
          this.levantamiento.CntctCode =
            this.actividades[this.actividadIndex].CntctCode;
          this.levantamiento.CardCode =
            this.actividades[this.actividadIndex].CardCode;
          this.cuentaSelected = {
            CardCode: this.actividades[this.actividadIndex].CardCode,
            CardName: this.actividades[this.actividadIndex].CardName,
            LineNum: this.actividades[this.actividadIndex].LineNum,
          };
          let data = {
            CardCode: this.actividades[this.actividadIndex].CardCode,
            id_sap: this.actividades[this.actividadIndex].id_sap,
          };
          lastValueFrom(this.service.getSucursales(data))
            .then((response) => {
              this.sucursales = response.sucursales;
              this.levantamiento.LineNum =
                this.actividades[this.actividadIndex].LineNum;
              let data = {
                CardCode: this.actividades[this.actividadIndex].CardCode,
                LineNum: this.actividades[this.actividadIndex].LineNum,
                select: true,
              };
              lastValueFrom(this.service.getContactos(data))
                .then((response) => {
                  this.contactos = response.select;
                  this.levantamiento.CntctCode =
                    this.actividades[this.actividadIndex].CntctCode;
                })
                .catch(() => {
                  this.service.createAlert(
                    'Error al obtener los datos. Intente de nuevo.',
                    'danger'
                  );
                });
            })
            .catch(() => {
              this.service.createAlert(
                'Error al obtener los datos. Intente de nuevo.',
                'danger'
              );
            });
        } else {
          this.levantamiento.id_actividad = 0;
        }
        if (editar && !actividad) {
          this.getSucursales(this.levantamientos[index].CardCode)
            .then(() => {
              this.getContactos(
                this.levantamientos[index].CardCode,
                this.levantamientos[index].LineNum
              )
                .then(() => {
                  this.levantamientoModalTitle = 'Editar levantamiento';
                  this.levantamiento.id = this.levantamientos[index].id;
                  this.levantamiento.nombre_apli =
                    this.levantamientos[index].nombre_apli;
                  this.levantamiento.fecha_entrega =
                    this.levantamientos[index].fecha_entrega;
                  this.levantamiento.comentarios =
                    this.levantamientos[index].comentarios;
                  this.levantamiento.CntctCode =
                    this.levantamientos[index].CntctCode;
                  this.levantamiento.CardCode =
                    this.levantamientos[index].CardCode;
                  this.levantamiento.LineNum =
                    this.levantamientos[index].LineNum;
                  this.cuentaSelected = {
                    CardCode: this.levantamientos[index].CardCode,
                    CardName: this.levantamientos[index].CardName,
                    LineNum: this.levantamientos[index].LineNum,
                  };
                  this.loadingController.dismiss();
                  this.showModalLevantamiento = true;
                })
                .catch(() => {
                  this.loadingController.dismiss();
                  this.service.createAlert(
                    'Error al obtener los contactos. Intente de nuevo',
                    'danger'
                  );
                });
            })
            .catch(() => {
              this.loadingController.dismiss();
              this.service.createAlert(
                'Error al obtener las sucursales. Intente de nuevo',
                'danger'
              );
            });
        }else if(editar && actividad){
          this.levantamientoModalTitle = 'Editar levantamiento';
                  this.levantamiento.id = this.levantamientos[index].id;
                  this.levantamiento.nombre_apli =
                    this.levantamientos[index].nombre_apli;
                  this.levantamiento.fecha_entrega =
                    this.levantamientos[index].fecha_entrega;
                  this.levantamiento.comentarios =
                    this.levantamientos[index].comentarios;
                  this.levantamiento.CntctCode =
                    this.levantamientos[index].CntctCode;
                  this.levantamiento.CardCode =
                    this.levantamientos[index].CardCode;
                  this.levantamiento.LineNum =
                    this.levantamientos[index].LineNum;
                  this.cuentaSelected = {
                    CardCode: this.levantamientos[index].CardCode,
                    CardName: this.levantamientos[index].CardName,
                    LineNum: this.levantamientos[index].LineNum,
                  };
                  this.loadingController.dismiss();
                  this.showModalLevantamiento = true;
        }else {
          this.levantamientoModalTitle = 'Agregar levantamiento';
          this.loadingController.dismiss();
          this.showModalLevantamiento = true;
        }
      })
      .catch(() => {
        this.loadingController.dismiss();
        this.service.createAlert(
          'Error al obtener las cuentas. Intente de nuevo.',
          'danger'
        );
      });
  }

  saveLevantamiento() {
    this.levantamiento.id_sap = this.planes[this.planIndex].id_sap;
    lastValueFrom(this.service.addLevantamiento(this.levantamiento))
      .then(() => {
        let data = {
          id_sap: this.planes[this.planIndex].id_sap,
          fecha_create: this.fecha_create,
          id_actividad: this.levantamiento.id_actividad,
        };
        lastValueFrom(this.service.getLevantamientos(data))
          .then((res) => {
            this.levantamientos = res.levantamientos;
            if (this.levantamiento.id != 0) {
              for (let i = 0; i < this.levantamientos.length; i++) {
                if (this.levantamiento.id == this.levantamientos[i].id) {
                  this.levantamientoIndex = i;
                  this.levantamientoTitulo = this.levantamientos[i].contacto;
                  this.levantamientoSubtitle = this.levantamientos[i].CardName;
                }
              }
            }
            this.showModalLevantamiento = false;
            this.levantamiento.id == 0
              ? this.service.createAlert('Levantamiento programado.', 'success')
              : this.service.createAlert(
                  'Levantamiento actualizado.',
                  'success'
                );
          })
          .catch(() => {
            this.service.createAlert(
              'Error al obtener los levantamientos. Intente de nuevo.',
              'danger'
            );
          });
      })
      .catch(() => {
        this.service.createAlert(
          'Error al programar el levantamiento. Intente de nuevo.',
          'danger'
        );
      });
  }

  saveAcompanamiento() {
    this.acompanamiento.id_sap = this.vendedorSelected!.id_sap;
    lastValueFrom(this.service.addAcompanamiento(this.acompanamiento))
      .then(() => {
        let data = { id_cita: this.visitaId };
        lastValueFrom(this.service.getAcompanamientos(data))
          .then((response) => {
            this.acompanamientos = response.acompanamientos;
            this.acompanamiento.id == 0
              ? this.service.createAlert(
                  'Compañero agregado a la visita.',
                  'success'
                )
              : this.service.createAlert('Compañero actualizado.', 'success');
            this.showModalAcompanamiento = false;
          })
          .catch(() => {
            this.service.createAlert(
              'Error al obtener los acompañamientos. Intente de nuevo.',
              'danger'
            );
          });
      })
      .catch(() => {
        this.service.createAlert(
          'Error al conectar con el servidor. Intente de nuevo.',
          'danger'
        );
      });
  }

  getMorePlanes(event: any) {
    this.limite += 20;
    event.target.complete();
  }

  searchPlan(event: any) {
    this.limite = 20;
    if (event.detail && event.detail.value != '') {
      this.planes = this.planes2.filter(
        (plan: any) =>
          plan.semana.toString().includes(event.detail.value) ||
          this.datePipe
            .transform(plan.fecha_create, 'dd/MM/yyyy')!
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
          plan.vendedor
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
    } else {
      this.planes = this.planes2;
    }
  }

  searchContactos(event: any) {
    this.limite = 20;
    event.component.enableInfiniteScroll();
    if (event.text != '') {
      this.contactos = this.contactos2.filter((contacto: any) =>
        contacto.Name.toString()
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
      this.contactos = this.contactos2;
    }

    if (this.limiteSelects >= this.contactos.length) {
      event.component.disableInfiniteScroll();
    }
  }

  getMoreContactos(event: any) {
    this.limiteSelects += 20;
    if (this.limiteSelects >= this.contactos.length) {
      event.component.disableInfiniteScroll();
    } else {
      event.component.endInfiniteScroll();
    }
  }

  focus() {
    setTimeout(() => {
      this.searchInput.setFocus();
    }, 500);
  }

  addAcompanamiento(editar: boolean, index: number) {
    this.acompanamiento = new Acompanamiento();
    this.vendedorSelected = undefined;
    if (editar) {
      this.acompanamientoModalTitle = 'Editar acompañamiento';
      this.acompanamiento.id = this.acompanamientos[index].id;
      this.vendedorSelected = this.acompanamientos[index].id_sap;
      this.acompanamiento.id_sap = this.vendedorSelected!.id_sap;
      this.acompanamiento.id_cita = this.acompanamientos[index].id_cita;
    } else {
      this.acompanamientoModalTitle = 'Agregar acompañamiento';
      this.acompanamiento.id_cita = this.visitaId;
    }

    let data = { id_zona: this.id_zona, id_sap: this.id_sap, tipo: this.tipo };
    lastValueFrom(this.service.getVendedores(data))
      .then((response) => {
        this.vendedores = response.vendedores;
        this.vendedores2 = response.vendedores;
        this.showModalAcompanamiento = true;
      })
      .catch(() => {
        this.service.createAlert(
          'Error al obtener los vendedores. Intente de nuevo.',
          'danger'
        );
      });
  }

  //funcion para scroll infinito de vendedores,cuentas,contactos (ion-selectable)
  getMoreVendedores(event: any) {
    this.limiteSelects += 20;
    if (this.limiteSelects >= this.vendedores.length) {
      event.component.disableInfiniteScroll();
    } else {
      event.component.endInfiniteScroll();
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

  searchCuentas(event: any) {
    this.limiteSelects = 20;
    event.component.enableInfiniteScroll();

    if (event.text != '') {
      this.cuentas = this.cuentas2.filter((cuenta2) =>
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

  //funcion para agregar y editar actividades
  addActividad(editar: boolean, index: number) {
    this.loading();
    this.actividad = new Actividad();
    this.cotizacionSelected = undefined;

    if (editar) {
      this.actividad.objetivo = this.actividades[index].objetivo;
      this.actividad.detalles = this.actividades[index].detalles;
      this.actividad.id_cita = this.actividades[index].id_cita;
      this.actividad.id = this.actividades[index].id;
      this.actividad.CntctCode = this.actividades[index].CntctCode;
      if(this.actividades[index].id_cot!='0'){
        this.getCotizaciones(this.actividades[index].id_sap).finally(()=>{
          this.actividad.id_cot = this.actividades[index].id_cot;
          for (let i = 0; i < this.cotizaciones.length; i++) {
            if(this.cotizaciones[i].DocNum == this.actividades[index].id_cot){
              this.cotizacionSelected = {
                DocNum : this.cotizaciones[i].DocNum,
                NumatCard: this.cotizaciones[i].NumatCard
              };
            }
          }
        }).catch(()=>{

        });
      }
      this.actividadModalTitle = 'Editar actividad';
    } else {
      this.actividadModalTitle = 'Agregar actividad';
    }

    let data = {
      CardCode: this.CardCode,
      LineNum: this.LineNum,
      select: true,
    };

    let id_sapp = this.planes[this.planIndex].id_sap;

    lastValueFrom(this.service.getContactos(data))
      .then((response) => {
        this.contactos = response.select;
        this.getCotizaciones(id_sapp)
          .then(() => {
            this.loadingController.dismiss();
            this.showModalActividad = true;
          })
          .catch(() => {
            this.loadingController.dismiss();
            this.service.createAlert(
              'Error al obtener los datos. Intente de nuevo.',
              'danger'
            );
          });
      })
      .catch(() => {
        this.loadingController.dismiss();
        this.service.createAlert(
          'Error al obtener los datos. Intente de nuevo.',
          'danger'
        );
      });
  }

  showDetLevantamiento(index: number) {
    this.levantamientoIndex = index;
    this.levantamientoTitulo = this.levantamientos[index].contacto;
    this.levantamientoSubtitle = this.levantamientos[index].CardName;
    let id_levantamiento = this.levantamientos[index].id;
    lastValueFrom(this.service.getImgLevantamiento(id_levantamiento))
      .then((response) => {
        this.imagenes = response.imagenes;
        this.showModalDetalleLevantamiento = true;
      })
      .catch(() => {
        this.service.createAlert(
          'Error al conectar con el servidor. Intente de nuevo.',
          'danger'
        );
      });
  }

  async saveActividad() {
    this.loading();
    this.actividadesCompletas = false;
    this.actividad.id_cita = this.visitaId;
    if (
      this.actividad.objetivo == 'Cierre' ||
      this.actividad.objetivo == 'Negociacion' ||
      this.actividad.objetivo == 'Seguimiento'
    ) {
      this.actividad.id_cot = this.cotizacionSelected!.DocNum;
    } else {
      this.actividad.id_cot = '0';
    }
    await lastValueFrom(this.service.addActividad(this.actividad));

    let data = { id_cita: this.visitaId };
    let response = await lastValueFrom(this.service.getActividades(data));
    if (response) {
      this.actividades = response.actividades;
    }

    response = await lastValueFrom(this.service.checkActividades(data));
    if (response && response.length > 0) {
      this.actividadesCompletas = true;
    } else {
      this.actividadesCompletas = false;
    }
    this.loadingController.dismiss();

    this.actividad.id == 0
      ? this.service.createAlert('Actividad programada.', 'success')
      : this.service.createAlert('Actividad actualizada.', 'success');
    this.showModalActividad = false;
  }

  execLevantamiento(index: number) {}

  execCompromiso(index: number) {
    let data = { id: this.compromisos[index].id };
    lastValueFrom(this.service.execCompromiso(data))
      .then(() => {
        let data = {
          id_sap: this.planes[this.planIndex].id_sap,
          fecha_create: this.fecha_create,
        };
        lastValueFrom(this.service.getCompromisos(data))
          .then((response) => {
            this.compromisos = response.compromisos;
            this.service.createAlert('Compromiso finalizado.', 'success');
          })
          .catch(() => {
            this.service.createAlert(
              'Error al obtener los compromisos. Intente de nuevo.',
              'danger'
            );
          });
      })
      .catch(() => {
        this.service.createAlert(
          'Error al ejecutar el compromiso. Intente de nuevo.',
          'danger'
        );
      });
  }

  execActividad(index: number) {
    let data = { id: this.actividades[index].id };
    lastValueFrom(this.service.execActividad(data))
      .then(() => {
        this.service.createAlert('Actividad ejecutada.', 'success');
        let data = { id_cita: this.visitaId };
        lastValueFrom(this.service.getActividades(data))
          .then((response) => {
            this.actividades = response.actividades;
            lastValueFrom(this.service.checkActividades(data))
              .then((response: any) => {
                if (response.length > 0) {
                  this.actividadesCompletas = true;
                } else {
                  this.actividadesCompletas = false;
                }
              })
              .catch(() => {
                this.service.createAlert(
                  'Error al conectar con el servidor. Intente de nuevo.',
                  'danger'
                );
              });
          })
          .catch(() => {
            this.service.createAlert(
              'Error al obtener las actividades. Intente de nuevo.',
              'danger'
            );
          });
      })
      .catch(() => {
        this.service.createAlert(
          'Error al ejecutar la actividad. Intente de nuevo.',
          'danger'
        );
      });
  }

  async addCompromiso(editar: boolean, index: number, actividad: boolean) {
    this.loading();
    this.compromiso = new Compromiso();
    this.cuentaSelected = undefined;
    this.getCuentas()
      .then(() => {
        if (actividad) {
          this.compromiso.id_actividad =
            this.actividades[this.actividadIndex].id;
          this.compromiso.CardCode =
            this.actividades[this.actividadIndex].CardCode;
          this.cuentaSelected = {
            CardCode: this.actividades[this.actividadIndex].CardCode,
            CardName: this.actividades[this.actividadIndex].CardName,
            LineNum: this.actividades[this.actividadIndex].LineNum,
          };
          let data = {
            CardCode: this.actividades[this.actividadIndex].CardCode,
            id_sap: this.actividades[this.actividadIndex].id_sap,
          };
          lastValueFrom(this.service.getSucursales(data))
            .then((response) => {
              this.sucursales = response.sucursales;
              this.compromiso.LineNum =
                this.actividades[this.actividadIndex].LineNum;
              let data = {
                CardCode: this.actividades[this.actividadIndex].CardCode,
                LineNum: this.actividades[this.actividadIndex].LineNum,
                select: true,
              };
              lastValueFrom(this.service.getContactos(data))
                .then((response) => {
                  this.contactos = response.select;
                  this.compromiso.CntctCode =
                    this.actividades[this.actividadIndex].CntctCode;
                })
                .catch(() => {
                  this.service.createAlert(
                    'Error al obtener los datos. Intente de nuevo.',
                    'danger'
                  );
                });
            })
            .catch(() => {
              this.service.createAlert(
                'Error al obtener los datos. Intente de nuevo.',
                'danger'
              );
            });
        } else {
          this.compromiso.id_actividad = 0;
        }
        if (editar && !actividad) {
          this.getSucursales(this.compromisos[index].CardCode)
            .then(() => {
              this.getContactos(
                this.compromisos[index].CardCode,
                this.compromisos[index].LineNum
              )
                .then(() => {
                  this.compromiso.detalles = this.compromisos[index].detalles;
                  this.compromiso.fecha = this.compromisos[index].fecha;
                  this.compromiso.hora = this.compromisos[index].hora;
                  this.compromiso.id = this.compromisos[index].id;
                  this.compromiso.CntctCode = this.compromisos[index].CntctCode;
                  this.compromiso.CardCode = this.compromisos[index].CardCode;
                  this.compromiso.LineNum = this.compromisos[index].LineNum;
                  this.cuentaSelected = {
                    CardCode: this.compromisos[index].CardCode,
                    CardName: this.compromisos[index].CardName,
                    LineNum: this.compromisos[index].LineNum,
                  };
                  this.compromisoModalTitle = 'Editar compromiso';
                  this.loadingController.dismiss();
                  this.showModalCompromiso = true;
                })
                .catch(() => {
                  this.loadingController.dismiss();
                  this.service.createAlert(
                    'Error al obtener los contactos. Intente de nuevo',
                    'danger'
                  );
                });
            })
            .catch(() => {
              this.loadingController.dismiss();
              this.service.createAlert(
                'Error al obtener las sucursales. Intente de nuevo',
                'danger'
              );
            });
        }else if(editar && actividad){
          this.compromiso.detalles = this.compromisos[index].detalles;
                  this.compromiso.fecha = this.compromisos[index].fecha;
                  this.compromiso.hora = this.compromisos[index].hora;
                  this.compromiso.id = this.compromisos[index].id;
                  this.compromiso.CntctCode = this.compromisos[index].CntctCode;
                  this.compromiso.CardCode = this.compromisos[index].CardCode;
                  this.compromiso.LineNum = this.compromisos[index].LineNum;
                  this.cuentaSelected = {
                    CardCode: this.compromisos[index].CardCode,
                    CardName: this.compromisos[index].CardName,
                    LineNum: this.compromisos[index].LineNum,
                  };
                  this.compromisoModalTitle = 'Editar compromiso';
                  this.loadingController.dismiss();
                  this.showModalCompromiso = true;
        } else {
          this.compromisoModalTitle = 'Agregar compromiso';
          this.loadingController.dismiss();
          this.showModalCompromiso = true;
        }
      })
      .catch(() => {
        this.loadingController.dismiss();
        this.service.createAlert(
          'Error al obtener las cuentas. Intente de nuevo.',
          'danger'
        );
      });
  }

  detVisita(index: number) {
    this.loading();
    this.visitaId = this.visitas[index].id;
    this.visitaTitle = this.visitas[index].CardName;
    this.visitaSubtitle = this.visitas[index].descripcion;
    this.visitaEstatus = this.visitas[index].estatus;
    this.CardCode = this.visitas[index].CardCode;
    this.LineNum = this.visitas[index].LineNum;
    this.visitaIndex = index;

    this.detVisitas = [
      { icon: 'person', detalle: this.visitas[index].Vendedor },
      { icon: 'clipboard', detalle: this.visitas[index].objetivo_gen },
      {
        icon: 'calendar-number',
        detalle: this.datePipe.transform(
          this.visitas[index].fecha_comp,
          'dd/MM/yyyy'
        ),
      },
      {
        icon: 'time',
        detalle:
          this.visitas[index].hora_inicioTitulo +
          ' - ' +
          this.visitas[index].hora_finTitulo,
      },
    ];
    this.visitas[index].p_geografica = encodeURIComponent(
      this.visitas[index].p_geografica
    );
    this.mapUrl = this.sanatizer.bypassSecurityTrustResourceUrl(
      'https://maps.google.com/maps?q=' +
        this.visitas[index].p_geografica +
        '&t=&z=13&ie=UTF8&iwloc=&output=embed'
    );

    this.getVisitaData(index)
      .then(() => {
        this.loadingController.dismiss();
        this.showModalDetalleVisita = true;
      })
      .catch(() => {
        this.loadingController.dismiss();
        this.service.createAlert(
          'Error al obtener los datos. Intente de nuevo.',
          'danger'
        );
      });
  }

  saveCompromiso() {
    this.compromiso.id_sap = this.planes[this.planIndex].id_sap;
    lastValueFrom(this.service.addCompromiso(this.compromiso))
      .then(() => {
        let data = {
          id_sap: this.compromiso.id_sap,
          fecha_create: this.fecha_create,
          id_actividad: this.compromiso.id_actividad,
        };
        lastValueFrom(this.service.getCompromisos(data))
          .then((res) => {
            this.compromisos = res.compromisos;
            this.showModalCompromiso = false;
            if (this.compromiso.id != 0) {
              this.service.createAlert('Compromiso modificado.', 'success');
            } else {
              this.service.createAlert('Compromiso programado.', 'success');
            }
          })
          .catch(() => {
            this.service.createAlert(
              'Error al obtener los compromisos. Intente de nuevo.',
              'danger'
            );
          });
      })
      .catch(() => {
        this.service.createAlert(
          'Error al programar el compromiso. Intente de nuevo.',
          'danger'
        );
      });
  }

  async getVisitaData(index: number) {
    let data = { id_cita: this.visitas[index].id };

    let response = await lastValueFrom(this.service.getActividades(data));
    if (response) {
      this.actividades = response.actividades;
    }

    response = await lastValueFrom(this.service.checkCheckIn(data));
    if (response) {
      if (response.check != null) {
        this.checkIn2 = true;
        if (response.check.estatus == 'Finalizada') {
          this.visitaCompleta = true;
        } else {
          this.visitaCompleta = false;
        }
      } else {
        this.checkIn2 = false;
        this.visitaCompleta = false;
      }
    }
    response = await lastValueFrom(this.service.checkActividades(data));
    if (response) {
      if (response.length > 0) {
        this.actividadesCompletas = true;
      } else {
        this.actividadesCompletas = false;
      }
    }
    response = await lastValueFrom(this.service.getAcompanamientos(data));
    if (response) {
      this.acompanamientos = response.acompanamientos;
    }
  }

  async getPlanData(id_sap: number) {
    let data = {
      fecha_create: this.fecha_create,
      id_sap: id_sap,
    };
    let response = await lastValueFrom(this.service.getVisitas(data));
    if (response) {
      this.visitas = response.visitas;
    }

    response = await lastValueFrom(this.service.getCompromisos(data));
    if (response) {
      this.compromisos = response.compromisos;
    }

    response = await lastValueFrom(this.service.getLevantamientos(data));
    if (response) {
      this.levantamientos = response.levantamientos;
    }
  }

  async saveVisita() {
    this.visita.id_sap = this.planes[this.planIndex].id_sap;
    let response = await lastValueFrom(
      this.service.addVisita(this.visita)
    ).catch(() => {
      if (this.visita.id == 0) {
        this.service.createAlert(
          'Error al programar la visita. Intente de nuevo.',
          'danger'
        );
      } else {
        this.service.createAlert(
          'Error al modificar la visita. Intente de nuevo. ',
          'danger'
        );
      }
    });
    if (response) {
      let data = {
        id_sap: this.visita.id_sap,
        fecha_create: this.fecha_create,
      };
      let response = await lastValueFrom(this.service.getVisitas(data)).catch(
        () => {
          this.service.createAlert(
            'Error al obtener las visitas. Intente de nuevo.',
            'danger'
          );
        }
      );
      if (response) {
        this.visitas = response.visitas;
        this.visita.id == 0
          ? this.service.createAlert('Visita programada.', 'success')
          : this.service.createAlert('Visita actualizada.', 'success');
        for (let i = 0; i < this.visitas.length; i++) {
          if (this.visitas[i].id == this.visitaId) {
            this.visitaTitle = this.visitas[i].CardName;
            this.visitaSubtitle = this.visitas[i].descripcion;
            this.detVisitas = [
              { icon: 'person', detalle: this.visitas[i].Vendedor },
              { icon: 'clipboard', detalle: this.visitas[i].objetivo_gen },
              {
                icon: 'calendar-number',
                detalle: this.datePipe.transform(
                  this.visitas[i].fecha_comp,
                  'dd/MM/yyyy'
                ),
              },
              {
                icon: 'time',
                detalle:
                  this.visitas[i].hora_inicioTitulo +
                  ' - ' +
                  this.visitas[i].hora_finTitulo,
              },
            ];
            this.visitas[i].p_geografica = encodeURIComponent(
              this.visitas[i].p_geografica
            );
            this.mapUrl = this.sanatizer.bypassSecurityTrustResourceUrl(
              'https://maps.google.com/maps?q=' +
                this.visitas[i].p_geografica +
                '&t=&z=13&ie=UTF8&iwloc=&output=embed'
            );
          }
        }
        this.cuentaSelected = undefined;
        this.visita = new Visita();
        this.showModalVisita = false;
      }
    }
  }

  confirmar() {
    this.confirmPlan(this.idPlan, this.planIndex);
  }

  verCotizaciones() {
    window.open(
      'http://intranet.ecn.com.mx:8060/intranet/index.php?mod=dashboard_embudo'
    );
  }

  formatoMoneda(value: number): string {
    return formatCurrency(value, 'en', '$', 'USD');
  }

  detPlan(index: number, refresh: boolean, event: any) {
    this.loading();
    this.fecha_create = this.planes[index].fecha_create;
    this.planTitle =
      'PTS_' +
      this.datePipe.transform(this.fecha_create, 'w') +
      this.datePipe.transform(this.fecha_create, 'yyyy');
    this.proyMensual = this.formatoMoneda(this.planes[index].proy_men);
    this.proySemanal = this.formatoMoneda(this.planes[index].proy_sem);
    this.confirmacion = this.planes[index].confirmacion;
    this.idPlan = this.planes[index].id;
    this.planIndex = index;
    let date = new Date(this.fecha_create);
    const day = date.getDay(); // Lunes - Domingo : 0 - 6
    const diff = date.getDate() - day + (day === 6 ? -6 : 1); //diferencia, si es domingo se resta -6
    this.fechaInicio = this.datePipe.transform(
      date.setDate(diff),
      'dd/MM/yyyy'
    )!;
    this.fechaCreacion = this.datePipe.transform(
      this.fecha_create,
      'dd/MM/yyyy'
    )!;

    this.updateDetalles(index);

    let id_sap = this.planes[index].id_sap;

    this.getPlanData(id_sap)
      .then(() => {
        this.loadingController.dismiss();
        if (refresh) {
          event.target.complete();
        } else {
          this.showModalPlan = true;
        }
      })
      .catch(() => {
        this.loadingController.dismiss();
        this.service.createAlert(
          'Error al obtener los datos del plan. Intente de nuevo.',
          'danger'
        );
      });
  }

  async guardarCotizacion() {
    this.loading();
    let data = new FormData();
    data.append('tipo', '1');
    data.append('id_doc', this.formCot.get('id_doc')?.value);
    data.append('porc_cierre', this.formCot.get('porc_cierre')?.value);
    data.append('fecha_cierre', this.formCot.get('fecha_cierre')?.value);
    data.append('coments', this.formCot.get('coments')?.value);
    data.append('edo', this.formCot.get('edo')?.value);

    let response = await lastValueFrom(this.service.updateCot(data));
    if (response) {
      this.reloadDataTable()
        .finally(() => {
          this.loadingController.dismiss();
          PlansemanalPage.showModalEditCotizacion = false;
          this.service.createAlert('Cotización actualizada.', 'success');
        })
        .catch(() => {
          this.loadingController.dismiss();
        });
    }
  }

  updateDetalles(index: number) {
    this.detalles = [
      { icon: 'person', detalle: this.planes[index].vendedor },
      { icon: 'calendar', detalle: 'Fecha inicio semana: ' + this.fechaInicio },
      { icon: 'calendar', detalle: 'Fecha de creación: ' + this.fechaCreacion },
      { icon: 'cash', detalle: 'Proyección mensual: ' + this.proyMensual },
      { icon: 'cash', detalle: 'Proyección semanal: ' + this.proySemanal },
    ];
  }

  static setCotizacionData(data: any[], id_doc: any) {
    this.plan2.formCot.setValue({
      id_doc: id_doc,
      porc_cierre: data[0],
      fecha_cierre: data[1],
      edo: data[3],
      coments: data[2],
    });
  }

  static async editarCotizacion(docEntry: string) {
    let response: any = await lastValueFrom(this.service2.getEtapas());
    if (response) {
      this.plan2.etapas = response.etapas;
    }
    let data = new FormData();
    data.append('id_doc', docEntry);
    data.append('tipo', '2');
    response = await lastValueFrom(this.service2.getInfo(data));
    if (response) {
      this.setCotizacionData(response, docEntry);
    }
    this.showModalEditCotizacion = true;
  }

  openCotizaciones(detalles: boolean) {
    if (detalles) {
      this.modalProyeccionesTitle = 'Detalles proyección mensual';
      this.detProyecciones = true;
      PlansemanalPage.data = {
        tipo: 1,
        type: 'app',
        user_id: this.planes[this.planIndex].id_colaborador,
        id_sap: this.planes[this.planIndex].id_sap,
        filtro: 'detalles',
        fecha: this.planes[this.planIndex].fecha_create,
      };
    } else {
      this.modalProyeccionesTitle = 'Mis cotizaciones';
      this.detProyecciones = false;
      if (this.togglePln) {
        PlansemanalPage.data = {
          tipo: 1,
          type: 'app',
          user_id: this.planes[this.planIndex].id_colaborador,
          id_sap: this.planes[this.planIndex].id_sap,
          filtro: this.filtroCotizaciones,
          fecha: this.planes[this.planIndex].fecha_create,
        };
      } else {
        PlansemanalPage.data = {
          tipo: 1,
          type: 'app',
          user_id:
            this.tipo == 'Gerente' || this.tipo == 'Corporativo'
              ? this.vendedorSelected!.id_colaborador
              : localStorage.getItem('id_colaborador'),
          id_sap:
            this.tipo == 'Gerente' || this.tipo == 'Corporativo'
              ? this.vendedorSelected!.id_sap
              : this.id_sap,
          filtro: this.filtroCotizaciones,
          fecha: this.planes[this.planIndex].fecha_create,
        };
      }
    }
    this.dtOptions = {
      responsive: true,
      language: {
        url: 'https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json',
      },
      ajax: {
        type: 'POST',
        url: 'http://intranet.ecn.com.mx:8060/intranet/php/embudo/embudo2.php',
        dataSrc: '',
        data: function (d) {
          Object.assign(d, PlansemanalPage.data);
          return d;
        },
      },
      scrollX: true,
      columns: [
        { data: 'docnum' },
        { data: 'fechacont' },
        { data: 'aniocierre' },
        { data: 'mescierre' },
        { data: 'ufechacierre' },
        { data: 'cliente' },
        { data: 'referencia' },
        { data: 'total' },
        { data: 'porccierre' },
        { data: 'montoponderado' },
        { data: 'etapa' },
        { data: 'vendedor' },
        { data: 'zona' },
        { data: 'industria' },
        { data: 'comments' },
        { data: 'PRGNTpresupuestal' },
        { data: 'PRGNTcompras' },
        { data: 'PRGNTtipocomprador' },
        { data: 'verinfo' },
      ],
      pageLength: 10,
      order: [],
      createdRow: function (row, data: any) {
        if (data['diff'] >= 0) $(row).addClass('danger');
      },
      info: false,
      initComplete: function () {
        //PlansemanalPage.setDataCotizaciones();
        $(document).on('click', '.btnEditarCot', function (e: any) {
          e.preventDefault();
          e.stopPropagation();
          PlansemanalPage.editarCotizacion(e.target.getAttribute('value'));
        });
        $(document).on('click', '.btnVerInfo', function (e: any) {
          e.preventDefault();
          e.stopPropagation();
          PlansemanalPage.detallesCot(e.target.getAttribute('value'));
        });
      },

      //   initComplete: function (){
      //       this.api().columns([2,3,10,12,13,15,16,17]).every(  () => {
      //   var column = this;
      //   var select = $('<select><option value=""></option></select>')
      //     .appendTo( $(column.footer()).empty() )
      //     .on( 'change', function () {
      //       var val = $.fn.dataTable.util.escapeRegex(
      //         $(this).val()
      //       );

      //       column
      //         .search( val ? '^'+val+'$' : '', true, false )
      //         .draw();
      //     } );

      //   column.data().unique().sort().each( function ( d, j ) {
      //     select.append( '<option value="'+d+'">'+d+'</option>' )
      //   } );
      // }),

      //                   this.api().columns([0,11]).every(() => {

      //                       var column = this;
      //                       var input = $('<input type="text" class="form-control">')
      //                           .appendTo($(column.footer()).empty())
      //                           .on('keyup change', function() {
      //                               if (column.search() !== this.value) {
      //                                   column
      //                                       .search(this.value)
      //                                       .draw();
      //                               }
      //                           });
      //                   });
      //   },
      // buttons: [
      //     {
      //         extend: 'excel',
      //         text: '<i class="fa fa-file-excel" aria-hidden="true"></i>',

      //     }
      // ]
    };
    this.showModalCotizaciones = true;
  }

  static setDataCotizaciones() {
    let cotizado = 0;
    let cantidad = 0;
    let ponderado = 0;
    $('table tbody tr').each(function () {
      let tr = $(this);
      cantidad++;
      let cot: string | number = tr.find('td:eq(7)').text().trim();
      let pond: string | number = tr.find('td:eq(9)').text().trim();
      cot = cot.replace('$', '');
      pond = pond.replace('$', '');
      cot = cot.replace(',', '');
      pond = pond.replace(',', '');
      cot = parseFloat(cot);
      pond = parseFloat(pond);
      cotizado += cot;
      ponderado += pond;
    });
    this.plan2.cantidad = cantidad;
    this.plan2.cotizado = cotizado;
    this.plan2.ponderado = ponderado;
  }

  static async detallesCot(docNum: string) {
    let data = new FormData();
    data.append('id_doc', docNum);
    data.append('tipo', '11');
    let response: any = await lastValueFrom(this.service2.getDetallesCot(data));
    if (response) {
      this.plan2.clienteCot = response[0][0];
      this.plan2.etapaCot = response[0][1];
      this.plan2.fechaContCot = response[0][2];
      this.plan2.subtotalCot = response[0][3];
      this.plan2.porcCierreCot = response[0][4];
      this.plan2.fechaCierreCot = response[0][5];
      this.plan2.zonaCot = response[0][6];
      this.plan2.oficinaCot = response[0][7];
      this.plan2.industriaCot = response[0][8];
      this.plan2.comentariosCot = response[0][9];
      this.plan2.partidas = [];
      for (let j = 1; j < response.length; j++) {
        let partidas = response[j];
        this.plan2.partidas.push(partidas);
      }
      this.plan2.showModalDetallesCot = true;
    }
  }

  async refresh(event: any) {
    this.planes = [];
    let data: Object = {};
    let response;
    switch (this.tipo) {
      case 'Gerente':
        if (this.togglePln) {
          this.getPlanes(0).finally(() => {
            if (event) {
              event.target.complete();
            }
          });
        } else {
          data = {
            id_zona: this.id_zona,
            id_sap: this.id_sap,
            tipo: this.tipo,
          };
          response = await lastValueFrom(this.service.getVendedores(data));
          if (response) {
            this.vendedores = response.vendedores;
            this.vendedores2 = response.vendedores;
            if (
              this.vendedorSelected?.id_sap &&
              this.vendedorSelected?.id_sap != 0
            ) {
              this.getPlanes(this.vendedorSelected!.id_sap).finally(() => {
                if (event) {
                  event.target.complete();
                }
              });
            } else {
              if (event) {
                event.target.complete();
              }
            }
          }
        }
        break;

      case 'Vendedor':
        await this.getPlanes(this.id_sap).finally(() => {
          if (event) {
            event.target.complete();
          }
        });
        break;

      case 'Corporativo':
        if (this.togglePln) {
          this.getPlanes(0).finally(() => {
            if (event) {
              event.target.complete();
            }
          });
        } else {
          data = {
            id_zona: this.id_zona,
            id_sap: this.id_sap,
            tipo: this.tipo,
          };
          response = await lastValueFrom(this.service.getVendedores(data));
          if (response) {
            this.vendedores = response.vendedores;
            this.vendedores2 = response.vendedores;
            if (
              this.vendedorSelected?.id_sap &&
              this.vendedorSelected?.id_sap != 0
            ) {
              this.getPlanes(this.vendedorSelected?.id_sap).finally(() => {
                if (event) {
                  event.target.complete();
                }
              });
            } else {
              if (event) {
                event.target.complete();
              }
            }
          }
        }
        break;
    }
  }

  checkIn(checkOut: boolean) {
    checkOut
      ? this.confirmCheckout(this.visitaId)
      : this.confirmCheckin(this.visitaId);
  }

  addPlan() {
    let data = {
      id_sap:
        this.tipo == 'Gerente' || this.tipo == 'Corporativo'
          ? this.vendedorSelected?.id_sap
          : this.id_sap,
    };
    lastValueFrom(this.service.checkPlan(data))
      .then((response) => {
        if (response == 0) {
          this.confirmNuevoPlan();
        } else {
          this.service.createAlert(
            'Ya se ha registrado un plan semanal actual.'
          );
        }
      })
      .catch(() => {
        this.service.createAlert(
          'Error al conectar con el servidor. Intente de nuevo.',
          'danger'
        );
      });
  }

  addVisita(editar: boolean, index: number) {
    this.loading();
    this.visita = new Visita();
    this.cuentaSelected = undefined;

    this.getCuentas()
      .then(() => {
        if (editar) {
          this.getSucursales(this.visitas[index].CardCode)
            .then(() => {
              this.visitaModalTitle = 'Editar visita';
              this.visita.id = this.visitas[index].id;
              this.visita.estatus = this.visitas[index].estatus;
              this.visita.fecha_comp = this.visitas[index].fecha_comp
                .split('/')
                .reverse()
                .join('-');
              this.visita.objetivo_gen = this.visitas[index].objetivo_gen;
              this.visita.hora_inicio = this.visitas[index].hora_inicio;
              this.visita.hora_fin = this.visitas[index].hora_fin;
              this.visita.LineNum = this.visitas[index].LineNum;
              this.visita.CardCode = this.visitas[index].CardCode;
              this.cuentaSelected = {
                CardCode: this.visitas[index].CardCode,
                CardName: this.visitas[index].CardName,
                LineNum: this.visitas[index].LineNum,
              };
            })
            .catch(() => {
              this.loadingController.dismiss();
              this.service.createAlert(
                'Error al obtener las sucursales. Intente de nuevo',
                'danger'
              );
            });
        } else {
          this.visitaModalTitle = 'Agregar visita';
        }
        this.loadingController.dismiss();
        this.showModalVisita = true;
      })
      .catch(() => {
        this.loadingController.dismiss();
        this.service.createAlert(
          'Error al obtener las cuentas. Intente de nuevo.',
          'danger'
        );
      });
  }

  async getCuentas() {
    let data = {
      id_sap: this.planes[this.planIndex].id_sap,
      select: true,
    };

    let response = await lastValueFrom(this.service.getCuentas(data));
    if (response) {
      this.cuentas = response.select;
      this.cuentas2 = response.select;
    }
  }

  changeHoraInicio(event: any) {
    this.visita.hora_inicio = this.datePipe.transform(
      event.detail?.value,
      'HH:mm'
    )!;
  }
  changeHoraFin(event: any) {
    this.visita.hora_fin = this.datePipe.transform(
      event.detail?.value,
      'HH:mm'
    )!;
  }

  async loading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      spinner: 'circles',
    });

    await loading.present();
  }

  //funcion para obtener la ubicación

  printCurrentPosition = async () => {
    return await Geolocation.getCurrentPosition();
  };

  //confirmaciones
  async deleteImagen() {
    const alert = await this.alertController.create({
      header: '¿Desea eliminar la imagen del levantamiento?',
      buttons: [
        {
          text: 'No',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Confirmar',
          cssClass: 'alert-button-confirm',
          handler: () => {
            let data = { id: this.imagenes[this.imagenIndex].id };
            lastValueFrom(this.service.deleteImagen(data))
              .then(() => {
                lastValueFrom(
                  this.service.getImgLevantamiento(
                    this.levantamientos[this.levantamientoIndex].id
                  )
                )
                  .then((response) => {
                    this.imagenes = response.imagenes;
                    this.showModalImagenes = false;
                    this.service.createAlert('Imagen eliminada.', 'success');
                  })
                  .catch(() => {
                    this.service.createAlert(
                      'Error al eliminar la imagen. Intente de nuevo.',
                      'danger'
                    );
                  });
              })
              .catch(() => {
                this.service.createAlert(
                  'Error al obtener las imágenes. Intente de nuevo.',
                  'danger'
                );
              });
          },
        },
      ],
    });

    await alert.present();
  }

  async confirmNuevoPlan() {
    const alert = await this.alertController.create({
      header:
        this.tipo == 'Gerente' || this.tipo == 'Corporativo'
          ? '¿Desea generar el plan semanal?'
          : '¿Desea generar su plan semanal?',
      message:
        this.tipo == 'Gerente' || this.tipo == 'Corporativo'
          ? 'Vendedor: ' + this.vendedorSelected!.nombre
          : '',
      buttons: [
        {
          text: 'No',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Confirmar',
          cssClass: 'alert-button-confirm',
          handler: () => {
            this.loading();
            let data = new Plan();
            let datos = {
              id_sap:
                this.tipo == 'Gerente' || this.tipo == 'Corporativo'
                  ? this.vendedorSelected?.id_sap
                  : this.id_sap,
            };
            lastValueFrom(this.service.getPonderado(datos))
              .then((response) => {
                data.proy_men = parseFloat(
                  parseFloat(response.proy_men).toFixed(2)
                );
                data.proy_sem = parseFloat(
                  parseFloat(response.proy_sem).toFixed(2)
                );
                if (this.tipo == 'Gerente' || this.tipo == 'Corporativo') {
                  data.id_sap = this.vendedorSelected!.id_sap;
                }
                lastValueFrom(this.service.addPlan(data))
                  .then(() => {
                    this.service.createAlert(
                      'Plan semanal registrado.',
                      'success'
                    );
                    this.refresh(false)
                      .then(() => {
                        this.loadingController.dismiss();
                      })
                      .catch(() => {
                        this.service.createAlert(
                          'Error al obtener los planes de trabajo. Intente de nuevo.',
                          'danger'
                        );
                      });
                  })
                  .catch(() => {
                    this.service.createAlert(
                      'Error al registrar el plan. Intente de nuevo.',
                      'danger'
                    );
                  });
              })
              .catch(() => {
                this.service.createAlert(
                  'Error al obtener el ponderado. Intente de nuevo.',
                  'danger'
                );
              });
          },
        },
      ],
    });

    await alert.present();
  }
  async confirmEliminarVisita() {
    const alert = await this.alertController.create({
      header: '¿Desea eliminar la visita?',
      buttons: [
        {
          text: 'No',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Confirmar',
          cssClass: 'alert-button-confirm',
          handler: () => {
            let data = { id_visita: this.visitaId };
            lastValueFrom(this.service.deleteVisita(data))
              .then(() => {
                this.service.createAlert('Visita eliminada.', 'success');
                let data = {
                  fecha_create: this.fecha_create,
                  id_sap: this.planes[this.planIndex].id_sap,
                };
                lastValueFrom(this.service.getVisitas(data))
                  .then((response) => {
                    this.visitas = response.visitas;
                    this.showModalDetalleVisita = false;
                  })
                  .catch(() => {
                    this.service.createAlert(
                      'Error al obtener las visitas. Intente de nuevo.',
                      'danger'
                    );
                  });
              })
              .catch(() => {
                this.service.createAlert(
                  'Error al eliminar la visita. Intente de nuevo.',
                  'danger'
                );
              });
          },
        },
      ],
    });

    await alert.present();
  }

  async confirmEliminarActividad(index: number) {
    const alert = await this.alertController.create({
      header: '¿Desea eliminar la actividad?',
      buttons: [
        {
          text: 'No',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Confirmar',
          cssClass: 'alert-button-confirm',
          handler: () => {
            let data = { id_actividad: this.actividades[index].id };
            lastValueFrom(this.service.deleteActividad(data))
              .then(() => {
                this.service.createAlert('Actividad eliminada.', 'success');
                let data = { id_cita: this.visitaId };
                lastValueFrom(this.service.getActividades(data))
                  .then((response) => {
                    this.actividades = response.actividades;
                  })
                  .catch(() => {
                    this.service.createAlert(
                      'Error al obtener las actividades. Intente de nuevo.',
                      'danger'
                    );
                  });
              })
              .catch(() => {
                this.service.createAlert(
                  'Error al eliminar la actividad. Intente de nuevo.',
                  'danger'
                );
              });
          },
        },
      ],
    });

    await alert.present();
  }

  async confirmPlan(id_plan: number, index: number) {
    const alert = await this.alertController.create({
      header: '¿Confirmar plan semanal?',
      message: 'Al confirmar, la proyección mensual no se podrá modificar.',
      buttons: [
        {
          text: 'No',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Confirmar',
          cssClass: 'alert-button-confirm',
          handler: async () => {
            let data;
            if (this.togglePln) {
              data = {
                id_plan: id_plan,
                id_sap: this.planes[this.planIndex].id_sap,
              };
            } else {
              data = {
                id_plan: id_plan,
                id_sap:
                  this.tipo == 'Gerente' || this.tipo == 'Corporativo'
                    ? this.vendedorSelected!.id_sap
                    : this.id_sap,
              };
            }
            this.loading();
            let response = await lastValueFrom(
              this.service.confirmPlan(data)
            ).catch(() => {
              this.loadingController.dismiss();
            });
            if (response) {
              this.planes[index].confirmacion = 1;
              this.confirmacion = true;
              this.loadingController.dismiss();
              this.service.createAlert(
                'El plan semanal se confirmó correctamente.',
                'success'
              );
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async confirmCheckin(id_cita: number) {
    const alert = await this.alertController.create({
      header: '¿Confirmar inicio de visita?',
      message:
        'Se iniciará el conteo TVFC y se registrará la ubicación actual.',
      buttons: [
        {
          text: 'No',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Confirmar',
          cssClass: 'alert-button-confirm',
          handler: () => {
            this.printCurrentPosition().then((response) => {
              let data = {
                id: id_cita,
                geo_checkin:
                  response.coords.latitude.toString() +
                  ', ' +
                  response.coords.longitude.toString(),
                checkout: false,
              };
              lastValueFrom(this.service.checkIn(data))
                .then(() => {
                  this.checkIn2 = true;
                  this.service.createAlert(
                    'La visita inició correctamente, favor de realizar las actividades.',
                    'success'
                  );
                  let data = {
                    fecha_create: this.fecha_create,
                    id_sap: this.planes[this.planIndex].id_sap,
                  };
                  lastValueFrom(this.service.getVisitas(data))
                    .then((response) => {
                      this.visitas = response.visitas;
                      for (let i = 0; i < this.visitas.length; i++) {
                        if (this.visitaId == this.visitas[i].id) {
                          this.visitaIndex = i;
                          this.visitaEstatus = this.visitas[i].estatus;
                        }
                      }
                    })
                    .catch(() => {
                      this.service.createAlert(
                        'Error al obtener las visitas. Intente de nuevo.',
                        'danger'
                      );
                    });
                })
                .catch(() => {
                  this.service.createAlert(
                    'Error al iniciar la visita. Intente de nuevo.',
                    'danger'
                  );
                });
            });
          },
        },
      ],
    });

    await alert.present();
  }
  async confirmCheckout(id_cita: number) {
    const alert = await this.alertController.create({
      header: '¿Finalizar visita?',
      message:
        'El conteo de TVFC terminará y se registrará la ubicación actual.',
      buttons: [
        {
          text: 'No',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Confirmar',
          cssClass: 'alert-button-confirm',
          handler: () => {
            this.printCurrentPosition().then((response: any) => {
              let data = {
                id: id_cita,
                geo_checkout:
                  response.coords.latitude.toString() +
                  ', ' +
                  response.coords.longitude.toString(),
                checkout: true,
              };
              lastValueFrom(this.service.checkIn(data))
                .then(() => {
                  this.checkIn2 = true;
                  this.visitaCompleta = true;
                  this.service.createAlert(
                    'La visita terminó correctamente, las horas se verán reflejadas en los indicadores.',
                    'success'
                  );
                  let data = {
                    fecha_create: this.fecha_create,
                    id_sap: this.planes[this.planIndex].id_sap,
                  };
                  lastValueFrom(this.service.getVisitas(data))
                    .then((response) => {
                      this.visitas = response.visitas;
                      for (let i = 0; i < this.visitas.length; i++) {
                        if (this.visitaId == this.visitas[i].id) {
                          this.visitaEstatus =
                            this.visitas[this.visitaIndex].estatus;
                        }
                      }
                    })
                    .catch(() => {
                      this.service.createAlert(
                        'Error al obtener las visitas. Intente de nuevo.',
                        'danger'
                      );
                    });
                })
                .catch(() => {
                  this.service.createAlert(
                    'Error al terminar la visita. Intente de nuevo.',
                    'danger'
                  );
                });
            });
          },
        },
      ],
    });

    await alert.present();
  }

  async confirmEliminarLevantamiento(index: number) {
    const alert = await this.alertController.create({
      header: '¿Desea eliminar el levantamiento?',
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
            let data = { id: this.levantamientos[index].id };
            lastValueFrom(this.service.deleteLevantamiento(data))
              .then(() => {
                let data = {
                  id_sap: this.planes[this.planIndex].id_sap,
                  fecha_create: this.fecha_create,
                };
                lastValueFrom(this.service.getLevantamientos(data))
                  .then((response) => {
                    this.levantamientos = response.levantamientos;
                    this.showModalDetalleLevantamiento = false;
                    this.service.createAlert(
                      'Levantamiento eliminado.',
                      'success'
                    );
                  })
                  .catch(() => {
                    this.service.createAlert(
                      'Error al obtener los levantamientos. Intente de nuevo.',
                      'danger'
                    );
                  });
              })
              .catch(() => {
                this.service.createAlert(
                  'Error al eliminar el levantamiento. Intente de nuevo.',
                  'danger'
                );
              });
          },
        },
      ],
    });

    await alert.present();
  }
  async confirmEliminarAcompanamiento(index: number) {
    const alert = await this.alertController.create({
      header: '¿Desea eliminar al acompañante?',
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
            let data = { id: this.acompanamientos[index].id };
            lastValueFrom(this.service.deleteAcompanamiento(data))
              .then(() => {
                let data = { id_cita: this.visitaId };
                lastValueFrom(this.service.getAcompanamientos(data))
                  .then((response) => {
                    this.acompanamientos = response.acompanamientos;
                    this.service.createAlert(
                      'Acompañante eliminado.',
                      'success'
                    );
                  })
                  .catch(() => {
                    this.service.createAlert(
                      'Error al obtener los acompañamientos. Intente de nuevo.',
                      'danger'
                    );
                  });
              })
              .catch(() => {
                this.service.createAlert(
                  'Error al eliminar el acompañamiento. Intente de nuevo.',
                  'danger'
                );
              });
          },
        },
      ],
    });

    await alert.present();
  }
  async confirmEliminarCompromiso(index: number) {
    const alert = await this.alertController.create({
      header: '¿Desea eliminar el compromiso?',
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
            let data = { id: this.compromisos[index].id };
            lastValueFrom(this.service.deleteCompromiso(data))
              .then(() => {
                let data;
                data = {
                  id_sap: this.planes[this.planIndex].id_sap,
                  fecha_create: this.fecha_create,
                };
                lastValueFrom(this.service.getCompromisos(data))
                  .then((response) => {
                    this.compromisos = response.compromisos;
                    this.service.createAlert(
                      'Compromiso eliminado.',
                      'success'
                    );
                  })
                  .catch(() => {
                    this.service.createAlert(
                      'Error al obtener los compromisos. Intente de nuevo.',
                      'danger'
                    );
                  });
              })
              .catch(() => {});
          },
        },
      ],
    });

    await alert.present();
  }
}
