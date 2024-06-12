import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';
import {
  AlertController,
  IonInput,
  IonSelect,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { Visita } from 'src/app/model/salesup/plansemanal/visita';
import { last, lastValueFrom } from 'rxjs';
import { SalesupService } from 'src/app/servicios/salesup/salesup.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Acompanamiento } from 'src/app/model/salesup/plansemanal/acompanamiento';
import { Actividad } from 'src/app/model/salesup/plansemanal/actividad';
import { Geolocation } from '@capacitor/geolocation';
import { Compromiso } from 'src/app/model/salesup/plansemanal/compromiso';
import { Levantamiento } from 'src/app/model/salesup/plansemanal/levantamiento';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface cuentaSelected {
  CardCode: string;
  CardName: string;
  LineNum: number;
  Vendedor: string;
}

interface vendedorSelected {
  id_sap: number;
  nombre: string;
}

interface contactoSelected {
  CntctCode: number;
  Name: string;
  CardCode: string;
}

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
})
export class CalendarioPage implements OnInit {
  @ViewChild('calendar') calendar!: FullCalendarComponent;
  @ViewChild('opcionesSelect') opcionesSelect!: IonSelect;
  @ViewChild('file') file!: IonInput;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth listMonth',
    },
    titleFormat: {
      year: 'numeric',
      month: 'short',
    },
    weekNumbers: true,
    weekends: false,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    locale: esLocale,
    customButtons: {
      prev: {
        click: () => {
          let calendar = this.calendar.getApi();
          this.mesSelected = calendar.getDate().getMonth();
          if (this.mesSelected == 0) {
            this.mesSelected = 12;
          }
          this.getEvents().finally(() => {
            calendar.prev();
          });
        },
      },
      next: {
        click: () => {
          let calendar = this.calendar.getApi();
          this.mesSelected = calendar.getDate().getMonth() + 2;
          if (this.mesSelected == 13) {
            this.mesSelected = 1;
          }
          this.getEvents().finally(() => {
            calendar.next();
          });
        },
      },
      today: {
        click: () => {
          let calendar = this.calendar.getApi();
          this.mesSelected = new Date().getMonth() + 1;
          this.getEvents().finally(() => {
            calendar.today();
          });
        },
        text: 'Mes actual',
      },
    },
    eventClick: (e) => {
      let index = parseInt(e.event._def.extendedProps['index']);
      this.idSapSelected = e.event._def.extendedProps['id_sap'];
      let tipo = e.event._def.extendedProps['tipo'];
      switch (tipo) {
        case 'visita':
          this.detVisita(index);
          break;

        case 'compromiso':
          this.addCompromiso(true, index, false);
          break;

        case 'levantamiento':
          this.showDetLevantamiento(index);
      }
    },
  };
  showModalDetalleLevantamiento = false;
  levantamientoIndex = 0;
  showVisita = false;
  visita = new Visita();
  cuentaSelected: cuentaSelected | undefined;
  visitaModalTitle = '';
  visitas = Array();
  showModalVisita = false;
  tipo = '';
  vendedorSelected: vendedorSelected | undefined;
  cuentas = Array();
  cuentas2 = Array();
  id_sap = 0;
  id_zona = 0;
  limiteSelects = 20;
  mesSelected = 0;
  visitaTitle = '';
  visitaSubtitle = '';
  detVisitas = Array();
  visitaId = 0;
  mapUrl: any;
  idSapSelected = 0;
  showModalDetalleVisita = false;
  visitaIndex = 0;
  visitaEstatus = '';
  actividades = Array();
  checkIn2 = false;
  visitaCompleta = false;
  today: string = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
  actividadesCompletas = false;
  acompanamientos = Array();
  acompanamiento = new Acompanamiento();
  acompanamientoModalTitle = '';
  vendedores = Array();
  vendedores2 = Array();
  showModalAcompanamiento = false;
  actividad = new Actividad();
  contactoSelected: contactoSelected | undefined;
  levantamiento = new Levantamiento();
  levantamientoModalTitle = '';
  showModalLevantamiento = false;
  actividadModalTitle = '';
  CardCode = '';
  contactos = Array();
  contactos2 = Array();
  cotizaciones = Array();
  cotizaciones2 = Array();
  showModalActividad = false;
  actividadIndex = 0;
  showModalDetalleActividad = false;
  fecha_create = '';
  levantamientos = Array();
  compromisos = Array();
  compromiso = new Compromiso();
  disableContacto = false;
  compromisoModalTitle = '';
  showModalCompromiso = false;
  limite = 20;
  levantamientoTitulo = '';
  imagenes = Array();
  imagenIndex = 0;
  formData = new FormData();
  editarImagen = false;
  nombreArchivo = '';
  srcImage: any;
  imagenForm: FormGroup = new FormGroup({
    id: new FormControl(0),
    archivo: new FormControl('', Validators.required),
    numParte: new FormControl('', Validators.required),
    comentarios: new FormControl('', Validators.required),
    id_levantamiento: new FormControl(0),
  });
  showModalImagenes = false;
  isImage = false;
  vendedorTitle = '';

  constructor(
    private service: SalesupService,
    private modales: ModalController,
    private router: Router,
    private sanatizer: DomSanitizer,
    private datePipe: DatePipe,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {}

  saveImagen() {
    this.file.getInputElement().then(async (input) => {
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
      let response = await lastValueFrom(
        this.service.saveImagenLevantamiento(this.formData)
      ).catch(() => {
        this.service.createAlert(
          'Error al conectar con el servidor. Intente de nuevo.',
          'danger'
        );
      });
      if (response) {
        let id = this.levantamientos[this.levantamientoIndex].id;
        this.getImgLevantamiento(id).finally(() => {
          this.showModalImagenes = false;
          if (this.imagenForm.get('id')!.value != 0) {
            this.service.createAlert(
              'Datos actualizados con éxito.',
              'success'
            );
          } else {
            this.service.createAlert('Datos guardados con éxito.', 'success');
          }
        });
      }
    });
  }

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
          handler: async () => {
            let data = { id: this.imagenes[this.imagenIndex].id };
            let response = await lastValueFrom(
              this.service.deleteImagen(data)
            ).catch(() => {
              this.service.createAlert(
                'Error al conectar con el servidor. Intente de nuevo.',
                'danger'
              );
            });
            if (response) {
              let id = this.levantamientos[this.levantamientoIndex].id;
              this.getImgLevantamiento(id).finally(() => {
                this.showModalImagenes = false;
                this.service.createAlert('Imagen eliminada.', 'success');
              });
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async getImgLevantamiento(id: number) {
    let response = await lastValueFrom(
      this.service.getImgLevantamiento(id)
    ).catch(() => {
      this.service.createAlert(
        'Error al conectar con el servidor. Intente de nuevo.',
        'danger'
      );
    });
    if (response) {
      this.imagenes = response.imagenes;
    }
  }

  showDetLevantamiento(index: number) {
    this.levantamientoIndex = index;
    let id_levantamiento = this.levantamientos[index].id;
    this.getImgLevantamiento(id_levantamiento).finally(() => {
      this.showModalDetalleLevantamiento = true;
    });
  }

  addFile(file: IonInput) {
    file.getInputElement().then((input) => {
      input.click();
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
          handler: async () => {
            let data = { id: this.levantamientos[index].id };
            let response = await lastValueFrom(
              this.service.deleteLevantamiento(data)
            );
            if (response) {
              this.getLevantamientos().finally(() => {
                this.service.createAlert('Levantamiento eliminado.', 'success');
              });
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async saveLevantamiento() {
    this.levantamiento.CntctCode = this.contactoSelected!.CntctCode;
    this.levantamiento.id_sap =
      this.tipo == 'Gerente' || this.tipo == 'Corporativo'
        ? this.vendedorSelected!.id_sap
        : this.id_sap;
    let response = await lastValueFrom(
      this.service.addLevantamiento(this.levantamiento)
    );
    if (response) {
      this.levantamientos = response.levantamientos;
    }

    this.getLevantamientos().finally(() => {
      this.showModalLevantamiento = false;
      this.levantamiento.id == 0
        ? this.service.createAlert('Levantamiento programado.', 'success')
        : this.service.createAlert('Levantamiento actualizado.', 'success');
    });
  }

  saveCompromiso() {
    this.compromiso.CntctCode = this.contactoSelected!.CntctCode;
    for (let i = 0; i < this.cuentas.length; i++) {
      if (this.cuentas[i].CardCode == this.contactoSelected?.CardCode) {
        this.compromiso.id_sap = this.cuentas[i].SlpCode;
      }
    }
    // this.service.addCompromiso(this.compromiso).subscribe(() => {
    //   this.getCompromisos().finally(() => {
    //     this.showModalCompromiso = false;
    //     this.service.createAlert('Compromiso programado.', 'success');
    //   });
    // });
  }

  nuevoContacto() {
    this.modales.dismiss().finally(() => {
      this.router.navigate(['tabs2/contactos']);
    });
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

  opcionesChange(value: string) {
    switch (value) {
      case 'visita':
        this.addVisita(false, 0);
        break;
      case 'compromiso':
        this.addCompromiso(false, 0, false);
        break;
      case 'levantamiento':
        this.addLevantamiento(false, 0, false);
        break;
    }
  }

  opciones() {
    this.opcionesSelect.value = 'visita';
    this.opcionesSelect.open();
  }

  async detVisita(index: number) {
    this.loading();
    this.visitaId = this.visitas[index].id;
    this.visitaTitle =
      this.visitas[index].CardName != null
        ? this.visitas[index].CardName
        : this.visitas[index].raz_social;
    this.visitaSubtitle = '';
    this.visitaEstatus = this.visitas[index].estatus;
    this.CardCode = this.visitas[index].CardCode;
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
    let data = { id_cita: this.visitas[index].id };

    let response = await lastValueFrom(this.service.getActividades(data));
    if (response) {
      this.actividades = response.actividades;
    }
    response = await lastValueFrom(this.service.checkCheckIn(data));
    if (response && response.check != null) {
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

    response = await lastValueFrom(this.service.checkActividades(data));
    if (response) {
      if (response.length > 0) {
        this.actividadesCompletas = false;
      } else {
        this.actividadesCompletas = true;
      }
    }

    response = await lastValueFrom(this.service.getAcompanamientos(data));
    if (response) {
      this.acompanamientos = response.acompanamientos;
    }

    this.showModalDetalleVisita = true;
    this.loadingController.dismiss();
  }

  printCurrentPosition = async () => {
    return await Geolocation.getCurrentPosition();
  };

  async getCotizaciones(slpcode: number) {
    let response = await lastValueFrom(this.service.getCotizaciones(slpcode));
    if (response) {
      this.cotizaciones = response.cotizaciones;
      this.cotizaciones2 = response.cotizaciones;
    }
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
            this.service.deleteAcompanamiento(data).subscribe(() => {
              let data = { id_cita: this.visitaId };
              this.service.getAcompanamientos(data).subscribe((response) => {
                this.acompanamientos = response.acompanamientos;
                this.service.createAlert('Acompañante eliminado.', 'success');
              });
            });
          },
        },
      ],
    });

    await alert.present();
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
    this.service.getVendedores(data).subscribe((response) => {
      this.vendedores = response.vendedores;
      this.vendedores2 = response.vendedores;
    });
    this.showModalAcompanamiento = true;
  }

  async addActividad(editar: boolean, index: number) {
    this.actividad = new Actividad();
    this.contactoSelected = undefined;

    if (editar) {
      this.actividad.objetivo = this.actividades[index].objetivo;
      this.actividad.detalles = this.actividades[index].detalles;
      this.actividad.id_cita = this.actividades[index].id_cita;
      this.actividad.id = this.actividades[index].id;
      this.contactoSelected = {
        CntctCode: this.actividades[index].CntctCode,
        Name: this.actividades[index].contacto,
        CardCode: this.actividades[index].CardCode
      };
      this.actividadModalTitle = 'Editar actividad';
    } else {
      this.actividadModalTitle = 'Agregar actividad';
    }

    let data = {
      CardCode: this.CardCode,
      select: true,
    };

    let response = await lastValueFrom(this.service.getContactos(data));
    if (response) {
      this.contactos = response.select;
      this.contactos2 = response.select;
    }

    await this.getCotizaciones(
      this.tipo != 'Vendedor' ? this.vendedorSelected!.id_sap : this.id_sap
    );

    this.showModalActividad = true;
  }

  detalleActividad(index: number) {
    this.actividadIndex = index;
    this.showModalDetalleActividad = true;
    let data = {
      fecha_create: this.fecha_create,
      id_sap:
        this.tipo == 'Gerente' || this.tipo == 'Corporativo'
          ? this.vendedorSelected!.id_sap
          : this.id_sap,
      id_actividad: this.actividades[index].id,
    };
    this.service.getLevantamientos(data).subscribe((response) => {
      this.levantamientos = response.levantamientos;
    });
    this.service.getCompromisos(data).subscribe((response) => {
      this.compromisos = response.compromisos;
    });
  }

  checkIn(checkOut: boolean) {
    checkOut
      ? this.confirmCheckout(this.visitaId)
      : this.confirmCheckin(this.visitaId);
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
              this.service.checkIn(data).subscribe(() => {
                this.checkIn2 = true;
                this.service.createAlert(
                  'La visita inició correctamente, favor de realizar las actividades.',
                  'success'
                );
                this.getVisitas().finally(() => {
                  this.visitaEstatus = this.visitas[this.visitaIndex].estatus;
                });
              });
            });
          },
        },
      ],
    });

    await alert.present();
  }
  async getVisitas() {
    const data = {
      tipo: this.tipo,
      mes: this.mesSelected,
      id_sap: this.id_sap,
      id_zona: this.id_zona,
    };
    let response = await lastValueFrom(this.service.getVisitas(data)).catch(
      () => {
        this.service.createAlert(
          'Error al conectar con el servidor. Intente de nuevo.',
          'danger'
        );
      }
    );
    if (response) {
      this.visitas = response.visitas;
    }
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
            this.printCurrentPosition().then((response) => {
              let data = {
                id: id_cita,
                geo_checkout:
                  response.coords.latitude.toString() +
                  ', ' +
                  response.coords.longitude.toString(),
                checkout: true,
              };
              this.service.checkIn(data).subscribe(() => {
                this.checkIn2 = true;
                this.visitaCompleta = true;
                this.service.createAlert(
                  'La visita terminó correctamente, las horas se verán reflejadas en los indicadores.',
                  'success'
                );
                this.getVisitas().finally(() => {
                  this.visitaEstatus = this.visitas[this.visitaIndex].estatus;
                });
              });
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
            this.service.deleteVisita(data).subscribe({
              next: () => {
                this.getVisitas().finally(() => {
                  this.showModalDetalleVisita = false;
                  this.service.createAlert('Visita eliminada.', 'success');
                });
              },
              error: () => {
                this.service.createAlert(
                  'Error al conectar con el servidor. Intente de nuevo.',
                  'danger'
                );
              },
            });
          },
        },
      ],
    });

    await alert.present();
  }

  ionViewWillEnter() {
    this.tipo = localStorage.getItem('tipo')!;
    this.id_zona = parseInt(localStorage.getItem('id_zona')!);
    this.id_sap = parseInt(localStorage.getItem('id_sap')!);
    let calendar = this.calendar.getApi();
    this.mesSelected = calendar.getDate().getMonth() + 1;
    this.getEvents();
  }

  async getEvents() {
    this.loading();

    let calendar = this.calendar.getApi();
    let events = Array();

    await this.getVisitas().finally(() => {
      for (let i = 0; i < this.visitas.length; i++) {
        let start =
          this.visitas[i].fecha_comp + 'T' + this.visitas[i].hora_inicio;
        let end = this.visitas[i].fecha_comp + 'T' + this.visitas[i].hora_fin;
        events.push({
          title: this.visitas[i].CardName,
          start: start,
          end: end,
          index: i,
          id_sap: this.visitas[i].SlpCode,
          color: 'red',
          tipo: 'visita',
        });
      }
    });
    await this.getCompromisos().finally(() => {
      for (let i = 0; i < this.compromisos.length; i++) {
        let start = this.compromisos[i].fecha;
        events.push({
          title: 'Compromiso con ' + this.compromisos[i].contacto,
          start: start,
          end: start,
          index: i,
          id_sap: this.compromisos[i].SlpCode,
          color: '#0157b8',
          tipo: 'compromiso',
        });
      }
    });

    await this.getLevantamientos().finally(() => {
      for (let i = 0; i < this.levantamientos.length; i++) {
        let start = this.levantamientos[i].fecha_entrega;
        events.push({
          title: 'Levantamiento con ' + this.levantamientos[i].contacto,
          start: start,
          end: start,
          index: i,
          id_sap: this.levantamientos[i].SlpCode,
          color: 'darkorange',
          tipo: 'levantamiento',
        });
      }
    });

    calendar.setOption('events', events);
    this.loadingController.dismiss();
  }

  async getCompromisos() {
    const data = {
      tipo: this.tipo,
      mes: this.mesSelected,
      id_sap: this.id_sap,
      id_zona: this.id_zona,
    };
    let response = await lastValueFrom(this.service.getCompromisos(data));
    if (response) {
      this.compromisos = response.compromisos;
    }
  }

  async getLevantamientos() {
    const data = {
      tipo: this.tipo,
      mes: this.mesSelected,
      id_sap: this.id_sap,
      id_zona: this.id_zona,
    };
    let response = await lastValueFrom(
      this.service.getLevantamientos(data)
    ).catch(() => {
      this.service.createAlert(
        'Error al conectar con el servidor. Intente de nuevo.',
        'danger'
      );
    });
    if (response) {
      this.levantamientos = response.levantamientos;
    }
  }

  cuentaChange() {
    this.visita.CardCode = this.cuentaSelected!.CardCode;
    this.visita.LineNum = this.cuentaSelected!.LineNum;
    this.vendedorTitle = this.cuentaSelected!.Vendedor;
  }

  async saveVisita() {
    this.loading();
    for (let i = 0; i < this.cuentas.length; i++) {
      if (this.cuentas[i].CardCode == this.cuentaSelected?.CardCode) {
        this.visita.id_sap = this.cuentas[i].SlpCode;
      }
    }
    await lastValueFrom(this.service.addVisita(this.visita));

    const data = {
      tipo: this.tipo,
      mes: this.mesSelected,
      id_sap: this.id_sap,
      id_zona: this.id_zona,
    };

    let response = await lastValueFrom(this.service.getVisitas(data));
    if (response) {
      this.visitas = response.visitas;
    }

    if (this.visita.id != 0) {
      this.service.createAlert('Visita actualizada.', 'success');
      for (let i = 0; i < this.visitas.length; i++) {
        if (this.visitas[i].id == this.visitaId) {
          this.visitaTitle = this.visitas[i].CardName;
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
    } else {
      this.service.createAlert('Visita programada.', 'success');
    }
    this.cuentaSelected = undefined;
    this.visita = new Visita();
    this.loadingController.dismiss();
    this.showModalVisita = false;
  }

  async loading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      spinner: 'circles',
    });

    await loading.present();
  }

  async addVisita(editar: boolean, index: number) {
    this.loading();
    this.visita = new Visita();
    this.cuentaSelected = undefined;

    if (editar) {
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
      this.cuentaSelected = {
        CardCode:
          this.visitas[index].CardCode + '_' + this.visitas[index].LineNum,
        CardName: this.visitas[index].CardName,
        LineNum: this.visitas[index].LineNum,
        Vendedor: this.visitas[index].Vendedor,
      };
      this.vendedorTitle = this.cuentaSelected.Vendedor;
    } else {
      this.visitaModalTitle = 'Agendar visita';
    }

    let data = {
      id_sap: editar ? this.idSapSelected : this.id_sap,
      tipo: this.tipo,
      select: true,
      id_zona: this.id_zona,
    };

    let response = await lastValueFrom(this.service.getCuentas(data));
    if (response) {
      this.cuentas = response.select;
      this.cuentas2 = response.select;
    }
    this.showModalVisita = true;
    this.loadingController.dismiss();
  }

  getMoreCuentas(event: any) {
    this.limiteSelects += 20;
    if (this.limiteSelects >= this.cuentas.length) {
      event.component.disableInfiniteScroll();
    } else {
      event.component.endInfiniteScroll();
    }
  }

  nuevaCuenta() {
    this.modales.dismiss().finally(() => {
      this.router.navigate(['tabs2/cuentas']);
    });
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

  async addCompromiso(editar: boolean, index: number, actividad: boolean) {
    this.loading();
    this.compromiso = new Compromiso();
    this.contactoSelected = undefined;
    if (actividad) {
      this.disableContacto = true;
      this.compromiso.id_actividad = this.actividades[this.actividadIndex].id;
      this.contactoSelected = {
        CntctCode: this.actividades[this.actividadIndex].CntctCode,
        Name: this.actividades[this.actividadIndex].Name,
        CardCode: this.actividades[this.actividadIndex].CardCode,
      };
    } else {
      this.disableContacto = false;
      this.compromiso.id_actividad = 0;
    }
    if (editar) {
      this.compromiso.detalles = this.compromisos[index].detalles;
      this.compromiso.fecha = this.compromisos[index].fecha;
      this.compromiso.hora = this.compromisos[index].hora;
      this.compromiso.id = this.compromisos[index].id;
      this.contactoSelected = {
        CntctCode: this.compromisos[index].CntctCode,
        Name: this.compromisos[index].contacto,
        CardCode: this.compromisos[index].CardCode,
      };
      this.compromisoModalTitle = 'Editar compromiso';
    } else {
      this.compromisoModalTitle = 'Agregar compromiso';
    }

    let data = {
      id_sap: editar ? this.idSapSelected : this.id_sap,
      tipo: this.tipo,
      select: true,
      id_zona: this.id_zona,
    };

    let response = await lastValueFrom(this.service.getContactos(data));

    if (response) {
      this.contactos = response.select;
      this.contactos2 = response.select;
    }

    this.loadingController.dismiss();

    this.showModalCompromiso = true;
  }

  async addLevantamiento(editar: boolean, index: number, actividad: boolean) {
    this.loading();
    this.levantamiento = new Levantamiento();
    this.contactoSelected = undefined;
    if (actividad) {
      this.disableContacto = true;
      this.levantamiento.id_actividad =
        this.actividades[this.actividadIndex].id;
      this.contactoSelected = {
        CntctCode: this.actividades[this.actividadIndex].CntctCode,
        Name: this.actividades[this.actividadIndex].Name,
        CardCode: this.actividades[this.actividadIndex].CardCode,
      };
    } else {
      this.levantamiento.id_actividad = 0;
      this.disableContacto = false;
    }
    if (editar) {
      this.levantamientoModalTitle = 'Editar levantamiento';
      this.levantamiento.id = this.levantamientos[index].id;
      this.levantamiento.nombre_apli = this.levantamientos[index].nombre_apli;
      this.levantamiento.fecha_entrega = this.levantamientos[
        index
      ].fecha_entrega
        .split('/')
        .reverse()
        .join('-');
      this.levantamiento.comentarios = this.levantamientos[index].comentarios;
      this.contactoSelected = {
        CntctCode: this.levantamientos[index].CntctCode,
        Name: this.levantamientos[index].contacto,
        CardCode: this.levantamientos[index].CardCode,
      };
    } else {
      this.levantamientoModalTitle = 'Agregar levantamiento';
    }

    let data = {
      id_sap: editar ? this.idSapSelected : this.id_sap,
      tipo: this.tipo,
      select: true,
      id_zona: this.id_zona,
    };
    let response = await lastValueFrom(this.service.getContactos(data));
    if (response) {
      this.contactos = response.select;
      this.contactos2 = response.select;
    }

    this.loadingController.dismiss();
    this.showModalLevantamiento = true;
  }
}
