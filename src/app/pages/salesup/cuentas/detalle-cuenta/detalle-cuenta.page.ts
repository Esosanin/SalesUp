import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { Visita } from 'src/app/model/salesup/plansemanal/visita';
import { SalesupService } from 'src/app/servicios/salesup/salesup.service';
import { Geolocation } from '@capacitor/geolocation';
import { Actividad } from 'src/app/model/salesup/plansemanal/actividad';
import { Acompanamiento } from 'src/app/model/salesup/plansemanal/acompanamiento';
import { Compromiso } from 'src/app/model/salesup/plansemanal/compromiso';
import { Levantamiento } from 'src/app/model/salesup/plansemanal/levantamiento';
import { Oportunidad } from 'src/app/model/salesup/opciones/oportunidad';

@Component({
  selector: 'app-detalle-cuenta',
  templateUrl: './detalle-cuenta.page.html',
  styleUrls: ['./detalle-cuenta.page.scss'],
})
export class DetalleCuentaPage implements OnInit {
  id = '';
  cuenta = Array();
  contactos = Array();
  visitas = Array();
  oportunidades = Array();
  barChartData = Object();
  barChartOptions = Object();
  tipoVendedor = '';
  cuentaSelected: any = null;
  id_oportunidad = 0;
  showModalOportunidad = false;
  oportunidadModalTitle = '';
  oportunidad = new Oportunidad();
  vendedorSelected: any = null;
  leadsFormGroup = new FormGroup({
    id: new FormControl(0, Validators.required),
    cuenta: new FormControl('', Validators.required),
    raz_social: new FormControl('', Validators.required),
    tipo: new FormControl(null, Validators.required),
    rfc: new FormControl('', [
      Validators.required,
      Validators.minLength(12),
      Validators.maxLength(13),
    ]),
    id_industria: new FormControl(null, Validators.required),
    produce: new FormControl('', Validators.required),
    direccion: new FormControl('', Validators.required),
    telefono: new FormControl('', Validators.required),
    estado: new FormControl('', Validators.required),
    municipio: new FormControl('', Validators.required),
    asociada: new FormControl(false, Validators.required),
    id_sap: new FormControl(0, Validators.required),
    id_corp: new FormControl(0, Validators.required),
    potencial: new FormControl(null, Validators.required),
    pref_equipo: new FormControl('', Validators.required),
    pref_proyecto: new FormControl('', Validators.required),
    pref_servicio: new FormControl('', Validators.required),
    tam: new FormControl(null, Validators.required),
    market_share: new FormControl(null, Validators.required),
    tipo_cuenta: new FormControl('', Validators.required),
  });
  industrias = Array();
  vendedores = Array();
  vendedores2 = Array();
  showCuenta = false;
  cuentasSelect = Array();
  cuentasSelect2 = Array();
  spk1s = Array();
  limiteSelects = 20;
  showModalVisita = false;
  visita = new Visita();
  detVisitas = Array();
  visitaEstatus = '';
  visitaId = 0;
  visitaTitle = '';
  CardCode = '';
  visitaIndex = 0;
  mapUrl: any;
  actividades = Array();
  visitaCompleta = false;
  checkIn2 = false;
  actividadesCompletas = false
  acompanamientos = Array();
  showModalDetalleVisita = false
  visitaModalTitle = '';
  nombreCuenta = '';
  nombreSucursal = '';
  limiteVisitas = 3;
  limiteOportunidades = 3;
  today = '';
  actividadIndex = 0;
  showModalDetalleActividad = false;
  levantamientos = Array();
  compromisos = Array();
  actividad = new Actividad();
  contactoSelected: any;
  actividadModalTitle = '';
  contactosSelect = Array();
  contactosSelect2 = Array();
  showModalActividad = false;
  acompanamiento = new Acompanamiento();
  acompanamientoModalTitle = '';
  showModalAcompanamiento = false;
  compromiso = new Compromiso();
  disableContacto = false;
  compromisoModalTitle = '';
  showModalCompromiso = false;
  levantamiento = new Levantamiento();
  levantamientoModalTitle = '';
  showModalLevantamiento = false;
  showFormContacto = false;
  modalTitle = '';
  visitaSubtitle = '';
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
  });
  contactosCuenta = Array();
  sap = false;
  modalOrganigrama = false;

  constructor(
    private route: ActivatedRoute,
    private service: SalesupService,
    private loadingController: LoadingController,
    private sanatizer: DomSanitizer,
    private alertController: AlertController,
    private datePipe: DatePipe,
    private router: Router
  ) {}

  ngOnInit() {}

  async getContactos(data: Object) {
    let response = await lastValueFrom(this.service.getContactos(data));
    if (response) {
      this.contactosCuenta = response.leads? response.leads:Array();
      this.contactosSelect = response.select?response.select:Array();
      this.contactosSelect2 = response.select?response.select:Array();
    }
  }

  saveContacto() {
    this.service.saveContacto(this.contactoForm.value).subscribe(() => {
      let data = {
        select: false,
        contactoCuenta: true,
        CardCode: this.cuenta[0].id
      };
      this.getContactos(data).finally(() => {
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
      });
    });
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
            this.service.deleteLevantamiento(data).subscribe(() => {
              let data = {
                id_sap: this.cuenta[0].id_sap,
                id_actividad: this.levantamientos[index].id_actividad
              };
              this.service.getLevantamientos(data).subscribe((response) => {
                this.levantamientos = response.levantamientos;
                this.service.createAlert('Levantamiento eliminado.', 'success');
              });
            });
          },
        },
      ],
    });

    await alert.present();
  }

  execActividad(index: number) {
    let data = { id: this.actividades[index].id };
    this.service.execActividad(data).subscribe(() => {
      this.service.createAlert('Actividad ejecutada.', 'success');
      let data = { id_cita: this.visitaId };
      this.service.getActividades(data).subscribe((response) => {
        this.actividades = response.actividades;
      });
      data = { id_cita: this.visitaId };
      this.service.checkActividades(data).subscribe((r: any) => {
        if (r.length > 0) {
          this.actividadesCompletas = false;
        } else {
          this.actividadesCompletas = true;
        }
      });
    });
  }

  async addContacto(editar: boolean, index: number) {
    this.nombreCuenta = this.cuenta[0].raz_social;
    this.contactoForm.reset();
    this.cuentaSelected = null;
    this.contactoForm.patchValue({
      id: 0,
      clave: false,
    });
    if (editar) {
      this.modalTitle = 'Editar contacto';
      this.contactoForm.setValue({
        id: this.contactosCuenta[index].id,
        contacto: this.contactosCuenta[index].contacto,
        posicion: this.contactosCuenta[index].posicion,
        clave: this.contactosCuenta[index].clave,
        relacion: this.contactosCuenta[index].relacion,
        telefono: this.contactosCuenta[index].telefono,
        email: this.contactosCuenta[index].email,
        CardCode: this.contactosCuenta[index].CardCode,
      });
    } else {
      this.modalTitle = 'Agregar contacto';
    }
    this.showFormContacto = true;
  }

  addCompromiso(editar: boolean, index: number, actividad: boolean) {
    this.compromiso = new Compromiso();
    this.contactoSelected = null;
    if (actividad) {
      this.disableContacto = true;
      this.compromiso.id_actividad = this.actividades[this.actividadIndex].id;
      this.contactoSelected = {
        CntctCode: this.actividades[this.actividadIndex].CntctCode,
        Name: this.actividades[this.actividadIndex].Name,
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
        Name: this.compromisos[index].Name,
      };
      this.compromisoModalTitle = 'Editar compromiso';
    } else {
      this.compromisoModalTitle = 'Agregar compromiso';
    }

    let data = {
      id_sap: this.cuenta[0].id_sap,
      select: true,
    };
    this.getFormCompromisoActividades(data).finally(()=>{
      this.showModalCompromiso = true;
    });
  }

  async getFormCompromisoActividades(data: Object){
    this.loading();
    let response = await lastValueFrom(this.service.getContactos(data)).catch(()=>this.loadingController.dismiss());
    if(response){
        this.contactosSelect = response.select;
        this.contactosSelect2 = response.select;
        this.loadingController.dismiss();
    }
  }

  execCompromiso(index: number) {
    let data = { id: this.compromisos[index].id };
    this.service.execCompromiso(data).subscribe(() => {
      let data = {
        id_actividad: this.compromisos[index].id_actividad
      };
      this.service.getCompromisos(data).subscribe((response) => {
        this.compromisos = response.compromisos;
      });
      this.service.createAlert('Compromiso finalizado.', 'success');
    });
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
            this.service.deleteActividad(data).subscribe(() => {
              this.service.createAlert('Actividad eliminada.', 'success');
              let data = { id_cita: this.visitaId };
              this.service.getActividades(data).subscribe((response) => {
                this.actividades = response.actividades;
              });
            });
          },
        },
      ],
    });

    await alert.present();
  }

  searchContactos(event: any) {
    this.limiteSelects = 20;
    event.component.enableInfiniteScroll();
    if (event.text != '') {
      this.contactosSelect = this.contactosSelect2.filter((contacto: any) =>
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
      this.contactosSelect = this.contactosSelect2;
    }

    if (this.limiteSelects >= this.contactos.length) {
      event.component.disableInfiniteScroll();
    }
  }

  saveActividad() {
    this.actividadesCompletas = false;
    this.actividad.id_cita = this.visitaId;
    this.actividad.CntctCode = this.contactoSelected.CntctCode;
    this.service.addActividad(this.actividad).subscribe(() => {
      let data = { id_cita: this.visitaId };
      this.service.getActividades(data).subscribe((response) => {
        this.actividades = response.actividades;
        this.actividad.id == 0
          ? this.service.createAlert('Actividad programada.', 'success')
          : this.service.createAlert('Actividad actualizada.', 'success');
        this.showModalActividad = false;
      });
      this.service.checkActividades(data).subscribe((r: any) => {
        if (r.length > 0) {
          this.actividadesCompletas = false;
        } else {
          this.actividadesCompletas = true;
        }
      });
    });
  }

  getMoreContactos(event: any) {
    this.limiteSelects += 20;
    if (this.limiteSelects >= this.contactosSelect.length) {
      event.component.disableInfiniteScroll();
    } else {
      event.component.endInfiniteScroll();
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
      this.vendedorSelected = {
        id_sap: this.acompanamientos[index].id_sap,
        nombre: this.acompanamientos[index].nombre,
      };
      this.acompanamiento.id_sap = this.vendedorSelected.id_sap;
      this.acompanamiento.id_cita = this.acompanamientos[index].id_cita;
    } else {
      this.acompanamientoModalTitle = 'Agregar acompañamiento';
      this.acompanamiento.id_cita = this.visitaId;
    }

    let data = { id_zona: this.cuenta[0].id_zona, id_sap: this.cuenta[0].id_sap, tipo: this.tipoVendedor };
    this.service.getVendedores(data).subscribe((response) => {
      this.vendedores = response.vendedores;
      this.vendedores2 = response.vendedores;
    });
    this.showModalAcompanamiento = true;
  }

  addActividad(editar: boolean, index: number) {
    this.actividad = new Actividad();
    this.contactoSelected = undefined;

    if (editar) {
      this.actividad.objetivo = this.actividades[index].objetivo;
      this.actividad.detalles = this.actividades[index].detalles;
      this.actividad.id_cita = this.actividades[index].id_cita;
      this.actividad.id = this.actividades[index].id;
      this.contactoSelected = {
        CntctCode: this.actividades[index].CntctCode,
        Name: this.actividades[index].Name,
      };
      this.actividadModalTitle = 'Editar actividad';
    } else {
      this.actividadModalTitle = 'Agregar actividad';
    }

    let data = {
      id_sap: this.cuenta[0].id_sap,
      select: true,
    };

    this.getFormCompromisoActividades(data).finally(()=>{
      this.showModalActividad = true;
    });

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
            this.service.deleteCompromiso(data).subscribe(() => {
              let data = {
                id_actividad: this.compromisos[index].id_actividad,
                id_sap: this.cuenta[0].id_sap,
              };
              this.service.getCompromisos(data).subscribe((response) => {
                this.compromisos = response.compromisos;
                this.service.createAlert('Compromiso eliminado.', 'success');
              });
            });
          },
        },
      ],
    });

    await alert.present();
  }

  addLevantamiento(editar: boolean, index: number, actividad: boolean) {
    this.levantamiento = new Levantamiento();
    this.contactoSelected = undefined;
    if (actividad) {
      this.disableContacto = true;
      this.levantamiento.id_actividad =
        this.actividades[this.actividadIndex].id;
      this.contactoSelected = {
        CntctCode: this.actividades[this.actividadIndex].CntctCode,
        Name: this.actividades[this.actividadIndex].Name,
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
        Name: this.levantamientos[index].Name,
      };
      this.levantamiento.id_sap = this.contactoSelected.id;
    } else {
      this.levantamientoModalTitle = 'Agregar levantamiento';
    }

    let data = {
      id_sap: this.cuenta[0].id_sap,
      select: true
    };
    this.service.getContactos(data).subscribe((response) => {
      this.contactosSelect = response.select;
      this.contactosSelect2 = response.select;
    });

    this.showModalLevantamiento = true;
  }

  execLevantamiento(index: number) {}


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
            this.service.deleteVisita(data).subscribe(() => {
              this.service.createAlert('Visita eliminada.', 'success');
              let data = {
                CardCode: this.id
              };
              this.service.getVisitas(data).subscribe((response) => {
                this.visitas = response.visitas;
                this.showModalDetalleVisita = false;
              });
            });
          },
        },
      ],
    });

    await alert.present();
  }

  addVisita(editar: boolean, index: number) {
    this.visita = new Visita();
    this.cuentaSelected = undefined;

    if (editar) {
      this.visitaModalTitle = 'Editar visita';
      this.nombreCuenta = this.visitas[index].CardName;
      this.nombreSucursal = this.visitas[index].descripcion;
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
        CardCode: this.visitas[index].CardCode,
        CardName: this.visitas[index].CardName
          ? this.visitas[index].CardName
          : this.visitas[index].raz_social,
      };
      this.showModalVisita = true;
    } else {
      this.visitaModalTitle = 'Agregar visita';
      this.nombreCuenta = this.cuenta[0].raz_social;
      this.showModalVisita = true;
    }

    let data = {
      id_sap: this.cuenta[0].id_sap,
      tipo: 'Vendedor',
      select: true,
    };
    this.service.getCuentas(data).subscribe((response) => {
      this.cuentasSelect = response.select;
      this.cuentasSelect2 = response.select;
    });
  }

  saveVisita() {
    this.visita.CardCode = this.visitas[this.visitaIndex].CardCode;
    this.visita.id_sap = this.visitas[this.visitaIndex].id_sap;
    this.visita.LineNum = this.visitas[this.visitaIndex].LineNum;
    lastValueFrom(this.service.addVisita(this.visita)).then(()=>{
      let data = {
        CardCode: this.id.split('_')[0]
      };
      lastValueFrom(this.service.getVisitas(data)).then((response)=>{
        this.visitas = response.visitas;
        this.visita.id == 0
          ? this.service.createAlert('Visita programada.', 'success')
          : this.service.createAlert('Visita actualizada.', 'success');
        for (let i = 0; i < this.visitas.length; i++) {
          if (this.visitas[i].id == this.visitaId) {
            this.detVisitas = [
              { icon: 'clipboard', detalle: this.visitas[i].objetivo_gen },
              { icon: 'calendar-number', detalle: this.datePipe.transform(this.visitas[i].fecha_comp,'dd/M/yyyy') },
              {
                icon: 'time',
                detalle:
                  this.visitas[i].hora_inicioTitulo +
                  ' - ' +
                  this.visitas[i].hora_finTitulo,
              },
            ];
          }
        }
        this.showModalVisita = false;
      }).catch(()=>{
        this.service.createAlert(
          'Error al obtener las visitas. Intente de nuevo.',
          'danger'
        );
      });
    }).catch(()=>{
      this.service.createAlert(
        'Error al guardar los datos. Intente de nuevo.',
        'danger'
      );
    });
  }

  async detVisita(index: number) {
    this.loading();
    this.visitaId = this.visitas[index].id;
    this.visitaTitle = this.visitas[index].CardName;
    this.visitaSubtitle = this.visitas[index].descripcion;
    this.visitaEstatus = this.visitas[index].estatus;
    this.CardCode = this.visitas[index].CardCode;
    this.visitaIndex = index;

    this.detVisitas = [
      { icon: 'clipboard', detalle: this.visitas[index].objetivo_gen },
      {
        icon: 'calendar-number',
        detalle: this.datePipe.transform(this.visitas[index].fecha_comp,'dd/MM/yyyy')
      },
      {
        icon: 'time',
        detalle:
          this.visitas[index].hora_inicioTitulo +
          ' - ' +
          this.visitas[index].hora_finTitulo,
      },
    ];
    this.mapUrl = this.sanatizer.bypassSecurityTrustResourceUrl(
      'https://maps.google.com/maps?q=' +
        this.visitas[index].p_geografica +
        '&t=&z=13&ie=UTF8&iwloc=&output=embed'
    );
    this.getVisitaData(index).then(()=>{
      this.loadingController.dismiss();
      this.showModalDetalleVisita = true;
    }).catch(()=>{
      this.loadingController.dismiss();
      this.service.createAlert(
        'Error al obtener los datos de la visita. Intente de nuevo.',
        'danger'
      );
    });
  }

  async getVisitaData(index: number){
    let data = { id_cita: this.visitas[index].id };

    let response = await lastValueFrom(this.service.getActividades(data));
    if(response){
      this.actividades = response.actividades;
    }

    response = await lastValueFrom(this.service.checkCheckIn(data));
    if(response){
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
    if(response){
      if (response.length > 0) {
        this.actividadesCompletas = false;
      } else {
        this.actividadesCompletas = true;
      }
    }
    response = await lastValueFrom(this.service.getAcompanamientos(data));
    if(response){
      this.acompanamientos = response.acompanamientos;
    }
  }

  async getFormData() {
    let response = await lastValueFrom(this.service.getIndustrias());
    if (response) {
      this.industrias = response.industrias;
    }
    response = await lastValueFrom(this.service.getSpk1());
    if (response) {
      this.spk1s = response.spk1;
    }
  }

  saveOportunidad() {
    this.oportunidad.id_sap = this.cuenta[0].id_sap;
    this.oportunidad.CardCode = this.cuenta[0].id;
    this.service.addOportunidad(this.oportunidad).subscribe(() => {
      let data = {id_sap: this.cuenta[0].id_sap};
      this.service.getOportunidades(data).subscribe(response=>{
        this.oportunidades = response.oportunidades;
        this.showModalOportunidad = false;
        this.oportunidad.id!=0?this.service.createAlert('Oportunidad de negocio actualizada.','success'):this.service.createAlert('Oportunidad de negocio creada.','success');
      });
    });
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

  addOportunidad(editar: boolean, index: number) {
    this.oportunidad = new Oportunidad();
    this.cuentaSelected = null;
    this.nombreCuenta = this.cuenta[0].raz_social;
    if (editar) {
      this.oportunidadModalTitle = 'Editar oportunidad';
      this.getFormData().finally(() => {
        this.id_oportunidad = this.oportunidades[index].id;
        this.cuentaSelected = {
          CardCode: this.oportunidades[index].CardCode,
          CardName: this.oportunidades[index].CardName,
        };
        this.oportunidad.id = this.oportunidades[index].id;
        this.oportunidad.descripcion = this.oportunidades[index].descripcion;
        this.oportunidad.id_industria = this.oportunidades[index].id_industria;
        this.oportunidad.id_spk1 = this.oportunidades[index].id_spk1;
        this.oportunidad.monto_estim = this.oportunidades[index].monto_estim;
        this.showModalOportunidad = true;
      });
    } else {
      this.id_oportunidad = 0;
      this.oportunidadModalTitle = 'Agregar oportunidad';
      this.getFormData().finally(() => {
        this.showModalOportunidad = true;
      });
    }
  }

  searchCuentas(event: any) {
    this.limiteSelects = 20;
    event.component.enableInfiniteScroll();
    if (event.text != '') {
      this.cuentasSelect = this.cuentasSelect2.filter((cuenta) =>
        cuenta.CardName.toString()
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

  getMoreCuentas(event: any) {
    this.limiteSelects += 20;
    if (this.limiteSelects >= this.cuentasSelect.length) {
      event.component.disableInfiniteScroll();
    } else {
      event.component.endInfiniteScroll();
    }
  }

  saveCuenta() {
    if (this.leadsFormGroup.get('asociada')!.value) {
      this.leadsFormGroup
        .get('id_corp')
        ?.setValue(this.cuentaSelected.CardCode);
    } else {
      this.leadsFormGroup.get('id_corp')?.setValue(null);
    }
    if (this.tipoVendedor != 'Vendedor') {
      this.leadsFormGroup.get('id_sap')?.setValue(this.vendedorSelected.id_sap);
    } else {
      this.leadsFormGroup
        .get('id_sap')
        ?.setValue(parseInt(localStorage.getItem('id_sap')!));
    }

    this.service.saveCuenta(this.leadsFormGroup.value).subscribe(() => {
      this.leadsFormGroup.reset();
      this.showCuenta = false;
      this.getDataCuenta().finally(() =>
        this.service.createAlert('Cuenta modificada con éxito.', 'success')
      );
    });
  }

  async loading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      spinner: 'circles',
    });

    await loading.present();
  }

  refresh(event: any) {
    this.ionViewWillEnter(event);
  }

  printCurrentPosition = async () => {
    return await Geolocation.getCurrentPosition();
  };

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
                let data = {
                  CardCode: this.id
                };
                this.service.getVisitas(data).subscribe((response) => {
                  this.visitas = response.visitas;
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
                let data = {
                  CardCode: this.id
                };
                this.service.getVisitas(data).subscribe((response) => {
                  this.visitas = response.visitas;
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

  detalleActividad(index: number) {
    this.actividadIndex = index;
    this.showModalDetalleActividad = true;
    let data = {
      id_actividad: this.actividades[index].id,
      id_sap: this.cuenta[0].id_sap
    };
    this.service.getLevantamientos(data).subscribe((response) => {
      this.levantamientos = response.levantamientos;
    });
    this.service.getCompromisos(data).subscribe((response) => {
      this.compromisos = response.compromisos;
    });
  }

  ionViewWillEnter(event: any) {
    // this.barChartData = {
    //   labels: ['red', 'blue', 'yellow'],
    //   datasets: [
    //     {
    //       label: 'colors',
    //       data: [12, 11, 14],
    //     },
    //   ],
    // };
    // this.barChartOptions = {
    //   responsive: false,
    //   maintainAspectRatio: false,
    // };
    this.today = this.datePipe.transform(new Date(),'yyyy-MM-dd')!;
    this.tipoVendedor = localStorage.getItem('tipo')!;
    this.id = this.route.snapshot.paramMap.get('id')!;
    let parametros = this.id.split('_');
    if(!Number(parametros[0])){
      //this.router.navigate(['tabs2/cuentas']).finally(()=>{
       // this.service.createAlert('La cuenta no existe.','danger');
      //});
      this.sap = true;
    }else{
      this.sap = false;
      //this.getDataCuenta().finally(() => event?.target.complete());
    }
    this.getDataCuenta().then(() =>{
      event?.target.complete();
      this.loadingController.dismiss();
    }).catch(()=>{
      this.loadingController.dismiss();
      this.service.createAlert(
        'Error al obtener los datos. Intente de nuevo.',
        'danger'
      );
    });
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
        id_sap: localStorage.getItem('id_sap'),
      };
      response = await lastValueFrom(this.service.getVendedores(data)).catch(
        () => this.loadingController.dismiss()
      );
      if (response) {
        this.vendedores = response.vendedores;
        this.vendedores2 = response.vendedores;
        //this.loadingController.dismiss();
      }
    }
    let data = {
      tipo: 'Vendedor',
      id_sap: this.cuenta[0].id_sap,
      select: true,
    };
    response = await lastValueFrom(this.service.getCuentas(data));
    if (response) {
      this.cuentasSelect = response.select;
      this.cuentasSelect2 = response.select;
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

  editCuenta() {
    this.tipoVendedor = localStorage.getItem('tipo')!;
    this.vendedorSelected = null;
    this.cuentaSelected = null;
    this.leadsFormGroup.reset();
    this.leadsFormGroup.patchValue({
      id: 0,
      asociada: false,
    });
    this.leadsFormGroup.get('asociada')?.enable();
    this.loadFormData().finally(() => {
      this.leadsFormGroup.setValue({
        id: this.cuenta[0].CardCode,
        cuenta: this.cuenta[0].cuenta,
        raz_social: this.cuenta[0].raz_social,
        tipo: this.cuenta[0].tipo,
        rfc: this.cuenta[0].rfc,
        id_industria: this.cuenta[0].id_industria,
        produce: this.cuenta[0].produce,
        direccion: this.cuenta[0].direccion,
        telefono: this.cuenta[0].telefono,
        estado: this.cuenta[0].estado,
        municipio: this.cuenta[0].municipio,
        asociada: this.cuenta[0].asociada,
        id_corp: null,
        id_sap: null,
        potencial: this.cuenta[0].potencial,
        pref_equipo: this.cuenta[0].pref_equipo,
        pref_proyecto: this.cuenta[0].pref_proyecto,
        pref_servicio: this.cuenta[0].pref_servicio,
        tam: this.cuenta[0].tam,
        market_share: this.cuenta[0].market_share,
        tipo_cuenta: this.cuenta[0].tipo_cuenta,
      });
      if (this.tipoVendedor != 'Vendedor') {
        this.vendedorSelected = {
          id_sap: this.cuenta[0].id_sap,
          nombre: this.cuenta[0].lider,
        };
      } else {
        this.vendedorSelected = null;
      }
      if (this.cuenta[0].asociada) {
        this.liderChange();
      }
    }).catch(()=>{
      this.loadingController.dismiss();
      this.service.createAlert('Error al obtener los datos. Intente de nuevo.','danger');
    });
    this.showCuenta = true;
  }

  liderChange() {
    this.cuentaSelected = null;
    let data = {
      tipo: 'Vendedor',
      id_sap: this.vendedorSelected.id_sap,
      select: true,
    };
    this.service.getCuentas(data).subscribe((response) => {
      this.cuentasSelect = response.select;
      this.cuentasSelect2 = response.select;
      if (this.cuenta[0].id_corp != null) {
        let cuenta = '';
        for (let i = 0; i < this.cuentasSelect.length; i++) {
          if (this.cuentasSelect[i].CardCode == this.cuenta[0].id_corp) {
            cuenta = this.cuentasSelect[i].CardName;
          }
        }
        if(cuenta!=''){
          this.cuentaSelected = {
            CardCode: this.cuenta[0].id_corp,
            CardName: cuenta,
          };
        }
      }
      this.loadingController?.dismiss();
    });
  }

  addOrganigrama(editar: boolean){
    let data = {select: true,CardCode:this.cuenta[0].id?this.cuenta[0].id:this.cuenta[0].CardCode};
    this.getContactos(data).finally(()=>{
      this.modalOrganigrama = true;
    });
  }

  async getDataCuenta() {
    this.loading();
    let response = await lastValueFrom(this.service.getDataCuenta(this.id)).catch(()=>{
      this.loadingController.dismiss();
    });
    if (response) {
      this.cuenta = response.cuenta;
      this.contactosCuenta = response.contactos;
      this.cuenta[0].produce = '';
      if(!this.cuenta[0].tipo){
        this.cuenta[0].tipo = 'General';
      }
        let data = { id_sap: localStorage.getItem('id_sap'), tipo: this.tipoVendedor };
        response = await lastValueFrom(this.service.getVendedores(data));
        if (response) {
          this.vendedores = response.vendedores;
        }
      if(this.cuenta.length === 0){
        this.router.navigate(['tabs2/cuentas']).finally(()=>{
          this.service.createAlert('La cuenta no existe.','danger');
        });
      }
    }
    let data = {CardCode: this.id.split('_')[0], select: true};
    response = await lastValueFrom(this.service.getVisitas(data));
    if(response){
      this.visitas = response.visitas;
    }

    response = await lastValueFrom(this.service.getOportunidades(data));
    if(response){
      this.oportunidades = response.oportunidades;
    }

    // let data2 = {select: false, contactoCuenta: true, CardCode: this.id};
    // response = await this.getContactos(data2);
    // if(response){
    //   this.contactosCuenta = response.leads;
    // }
  }
}
