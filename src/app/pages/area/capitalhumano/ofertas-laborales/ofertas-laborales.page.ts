import { Component, OnInit, ViewChild } from '@angular/core';
import { CapitalhumanoService } from 'src/app/servicios/capitalhumano/capitalhumano.service';
import { IonContent, ToastController } from '@ionic/angular';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Oferta } from 'src/app/model/OfertaLaboral/Oferta';
import { formatCurrency } from '@angular/common';
import { Usuarios } from 'src/app/model/OfertaLaboral/Usuarios';

interface OfertaIdiomas_i {
  id_idiomas: number;
  id_nivel: number;
  idioma: boolean;
}

@Component({
  selector: 'app-ofertas-laborales',
  templateUrl: './ofertas-laborales.page.html',
  styleUrls: ['./ofertas-laborales.page.scss'],
})
export class OfertasLaboralesPage implements OnInit {
  @ViewChild('searchInput') searchInput: any;
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild('ModalNuevaOferta') ModalNuevaOferta: any;
  @ViewChild('ModalDetallesOferta') ModalDetallesOferta: any;
  @ViewChild('ModalDuplicarEditarOferta') ModalDuplicarEditarOferta: any;
  @ViewChild('ModalNuevaConfiguracion') ModalNuevaConfiguracion: any;

  segment: string = 'Ofertas';
  title: string = 'Ofertas laborales';
  limite = 20;
  btn_segmentEstabilizador: boolean = true;

  // Oferta seleccionada de la lista, utilizada en (Nueva, Detalles, Duplicar, Editar, etc)
  oferta: Oferta = new Oferta();
  // Se utliza cuando se cambia de modal Ejemplo: Detalle -> Duplicar, Detalle -> Editar
  oferta_res: Oferta = new Oferta();

  /////////////
  // OFERTAS //
  /////////////

  ofertas: Array<Oferta> = [];
  config: any;

  selectedArea: any = { nombre: null, id: null, num: null };
  tablaAreas: Array<any> = [];
  selectedPais: any = { nombre: null, id: null, num: null };
  tablaPaises: Array<any> = [];

  // VARIABLES DE NUEVA OFERTA
  // Variable para abrir o cerrar el modal "Nueva Oferta"
  modalNuevaOferta: boolean = false;

  myGroup: FormGroup = new FormGroup({
    htmlText: new FormControl(),
  });

  btnDisableEstado: boolean = true;
  btns_DuplicarEditar: number = 0;

  changeCargo: string = '';
  changeCargo2: string = '';
  NO_selectArea: any = [];
  NO_selectPais: any = [];
  NO_selectEstado: any = [];
  NO_selectCiudad: any = [];
  NO_selectJornada: any = [];
  NO_selectContrato: any = [];
  NO_selectSalario: any = [];
  NO_selectExperiencia: any = [];
  NO_selectEstudios: any = [];
  NO_selectIdioma: any = [];
  NO_selectNivel: any = [];

  NO_selectIdiomasTable: OfertaIdiomas_i[] = [];

  maxTitulo: number = 128;
  maxSubtitulo: number = 128;
  maxDescripcion: number = 3000;

  // VARIABLES DE DETALLE OFERTA
  // Variable para abrir o cerrar el modal "Detalle Oferta"
  modalDetalleOferta: boolean = false;

  // VARIABLES DE DUPLICAR OFERTA
  modalDuplicarEditarOferta: boolean = false;

  DO_idiomas: any[] = [];

  //////////////
  // USUARIOS //
  //////////////

  showSearchbar: boolean = false;
  listUsuarios: Array<Usuarios> = [];

  U_search: string = '';
  U_selectPaises: Array<any> = [];
  U_selectPais: any = { nombre: null, id: null, num: null };

  //////////////////
  // ESTADISTICAS //
  //////////////////

  E_misEstadisticas: any = { O_total: 0, F_total: 0, S_total: 0 };

  ///////////////////
  // CONFIGURACIÓN //
  ///////////////////

  // Listas originales (No se permiten cambios)
  C_listAreas: Array<any> = [];
  C_listIdiomas: Array<any> = [];
  C_listPaises: Array<any> = [];

  // Listas remplazables (Se permiten los cambios)
  C_listRAreas: Array<any> = [];
  C_listRIdiomas: Array<any> = [];
  C_listRPaises: Array<any> = [];

  // Abrir cajas
  C_boxAreas: boolean = true;
  C_boxIdiomas: boolean = false;
  C_boxPaises: boolean = false;

  modalNuevaConfiguracion: boolean = false;
  C_nuevaConfiguracion: any = { tipo_C: '', nombre: '' };

  constructor(
    private service: CapitalhumanoService,
    private router: Router,
    private toast: ToastController
  ) {}

  ngOnInit() {
    sessionStorage.removeItem('OfertasLab curriculum tipo');
    sessionStorage.removeItem('OfertasLab oferta_id');
    sessionStorage.removeItem('OfertasLab PosFinSel segment');
    // NO SE QUE PASO AQUI; ESTA RARO....
    this.segment =
      sessionStorage.getItem('OfertasLab segment') == 'null'
        ? sessionStorage.getItem('OfertasLab segment')!
        : 'Ofertas';
    sessionStorage.setItem('OfertasLab segment', this.segment);

    //this.service.segmentOfertasLaborales = this.service.segmentOfertasLaborales != '' ? this.service.segmentOfertasLaborales : 'Ofertas';
    this.segment = sessionStorage.getItem('OfertasLab segment')!;

    this.C_boxAreas = true;
    this.C_boxIdiomas = false;
    this.C_boxPaises = false;

    this.title = 'Ofertas';
    this.onChangeSegment(this.segment);
  }

  //FOCUS BÚSQUEDA
  focus() {
    setTimeout(() => {
      this.searchInput.setFocus();
    }, 500);
  }

  createModal(tipo: string, data: any) {
    switch (tipo) {
      case 'Nueva Oferta':
        this.ModalNuevaOferta.onDidDismiss().then(
          () => (this.modalNuevaOferta = false)
        );
        this.modalNuevaOferta = true;

        this.oferta = new Oferta();
        this.oferta.id_colaborador = parseInt(
          localStorage.getItem('id_colaborador')!
        );
        this.oferta.estado = 1;

        this.NO_selectIdiomasTable = [];

        this.limpiarVariables('Ofertas');
        this.Ofertas_getSelects(tipo);
        break;
      case 'Detalle Oferta':
        this.ModalDetallesOferta.onDidDismiss().then(
          () => (this.modalDetalleOferta = false)
        );
        this.modalDetalleOferta = true;

        this.oferta = new Oferta();

        this.DO_idiomas = [];

        this.limpiarVariables('Ofertas');
        this.Ofertas_getDetalleOferta(data.oferta);

        break;
      case 'Duplicar Oferta':
      case 'Editar Oferta':
        this.ModalDuplicarEditarOferta.onDidDismiss().then(
          () => (this.modalDuplicarEditarOferta = false)
        );
        this.modalDuplicarEditarOferta = true;

        if (tipo == 'Duplicar Oferta') this.btns_DuplicarEditar = 0;
        else if (tipo == 'Editar Oferta') this.btns_DuplicarEditar = 1;
        this.oferta_res = new Oferta(); // Se limpia la variable de respaldo
        this.oferta_res = this.oferta; // Se guarda la información en la variable
        this.oferta_res.id_oferta = data.id;
        this.oferta = new Oferta(); // Se limpia la variabla original

        this.limpiarVariables('Ofertas');
        this.Ofertas_getSelects(tipo);

        break;
      case 'Nueva Configuracion':
        this.ModalNuevaConfiguracion.onDidDismiss().then(
          () => (this.modalNuevaConfiguracion = false)
        );
        this.modalNuevaConfiguracion = true;

        this.C_nuevaConfiguracion = { tipo_C: '', nombre: '' };
        break;
    }
  }

  closeEdit() {
    this.modalNuevaOferta = false;
    this.modalDetalleOferta = false;
    this.modalDuplicarEditarOferta = false;
    this.modalNuevaConfiguracion = false;
  }

  // Al terminar las consultas se habilitara las acciones para el cambio de segmentos.
  Ofertas_btnEstabilizador() {
    this.btn_segmentEstabilizador = true;
  }

  /////////////
  // OFERTAS //
  /////////////

  onChangeSegment(segment: string) {
    this.limpiarVariables(segment);

    switch (segment) {
      case 'Ofertas':
        this.title = 'Ofertas';
        this.Ofertas_getSelectAreas_Ofertas(0);
        this.Ofertas_getSelectPaises_Ofertas(0);
        this.getOfertas(0, 0);
        break;
      case 'Usuarios':
        this.title = 'Usuarios';
        this.Ofertas_getSelectPaises_Usuarios();
        this.getUsuarios('');
        break;
      case 'Estadisticas':
        this.title = 'Estadisticas';
        this.Ofertas_misEstadisticas_Estadisticas();
        break;
      case 'Configuracion':
        this.title = 'Configuración';
        this.Ofertas_listsAIP_Configuracion();
        break;
    }
    sessionStorage.setItem('OfertasLab segment', segment);
    //this.service.segmentOfertasLaborales = this.title;
  }

  limpiarVariables(segment: string) {
    switch (segment) {
      case 'Ofertas':
        // SELECTS DEL MODAL (NUEVA OFERTA / DUPLICAR OFERTA)
        this.changeCargo = '';
        this.changeCargo2 = '';
        this.NO_selectArea = [];
        this.NO_selectPais = [];
        this.NO_selectEstado = [];
        this.NO_selectCiudad = [];
        this.NO_selectJornada = [];
        this.NO_selectContrato = [];
        this.NO_selectSalario = [];
        this.NO_selectExperiencia = [];
        this.NO_selectEstudios = [];
        this.NO_selectIdioma = [];
        this.NO_selectNivel = [];

        this.selectedArea = { nombre: null, id: null, num: null };
        this.selectedPais = { nombre: null, id: null, num: null };

        // MODAL DETALLES
        this.DO_idiomas = [];
        break;
      case 'Usuarios':
        this.U_selectPaises = [];
        this.U_selectPais = { nombre: null, id: null, num: null };

        this.U_search = '';
        this.showSearchbar = false;
        this.listUsuarios = [];
        break;
      case 'Estadisticas':
        this.E_misEstadisticas = { O_total: 0, F_total: 0, S_total: 0 };
        break;
      case 'Configuracion':
        this.C_listAreas = [];
        this.C_listIdiomas = [];
        this.C_listPaises = [];

        this.C_listRAreas = [];
        this.C_listRIdiomas = [];
        this.C_listRPaises = [];

        this.C_nuevaConfiguracion = { tipo_C: '', nombre: '' };
        break;
    }
  }

  async getOfertas(area: number, pais: number) {
    this.service.getOfertas({ area: area, pais: pais }).subscribe(
      (r) => {
        this.ofertas = [];
        this.ofertas = r as any;
      },
      (e) => {
        console.log(e);
        this.service.createAlert(
          'Error al conectar con el servidor. Intente de nuevo.',
          'danger'
        );
      },
      () => {
        this.Ofertas_btnEstabilizador();
      }
    );
  }

  async Ofertas_getSelectAreas_Ofertas(pais: number) {
    this.service.Ofertas_getSelectAreas_Ofertas({ pais: pais }).subscribe(
      (r: any) => {
        this.tablaAreas = [];
        this.tablaAreas = r[0];
      },
      (e) => {
        console.log(e);
        this.service.createAlert(
          'Error al conectar con el servidor. Intente de nuevo.',
          'danger'
        );
      }
    );
  }

  async Ofertas_getSelectPaises_Ofertas(dato: number) {
    this.service
      .Ofertas_getSelectPaises_Ofertas({ area: dato, segment: this.segment })
      .subscribe(
        (r: any) => {
          this.tablaPaises = [];
          this.tablaPaises = r[0];
        },
        (e) => {
          console.log(e);
          this.service.createAlert(
            'Error al conectar con el servidor. Intente de nuevo.',
            'danger'
          );
        }
      );
  }

  Ofertas_changeSelectAreaPais_Ofertas(
    area: any,
    pais: any,
    tipo: string
  ) {
    switch (tipo) {
      case 'A':
        var infoArea = this.tablaAreas.find(
          (x) => x.id_areas === area.target.value
        );
        this.selectedArea.nombre = infoArea.descripcion;
        this.selectedArea.num = infoArea.total;
        break;
      case 'P':
        var infoPais = this.tablaPaises.find(
          (x) => x.id_pais === pais.target.value
        );
        this.selectedPais.nombre = infoPais.descripcion;
        this.selectedPais.num = infoPais.total;
        break;
    }
    this.getOfertas(
      this.selectedArea.id != null ? this.selectedArea.id : 0,
      this.selectedPais.id != null ? this.selectedPais.id : 0
    );
    this.Ofertas_getSelectAreas_Ofertas(
      this.selectedPais.id != null ? this.selectedPais.id : 0
    );
    this.Ofertas_getSelectPaises_Ofertas(
      this.selectedArea.id != null ? this.selectedArea.id : 0
    );
  }

  Ofertas_cancelarSelectAreaPais_Ofertas(tipo: number) {
    switch (tipo) {
      case 0:
        this.selectedArea = { nombre: null, id: null, num: null };
        break;
      case 1:
        this.selectedPais = { nombre: null, id: null, num: null };
        break;
    }
    this.getOfertas(
      this.selectedArea.id != null ? this.selectedArea.id : 0,
      this.selectedPais.id != null ? this.selectedPais.id : 0
    );
    this.Ofertas_getSelectAreas_Ofertas(
      this.selectedPais.id != null ? this.selectedPais.id : 0
    );
    this.Ofertas_getSelectPaises_Ofertas(
      this.selectedArea.id != null ? this.selectedArea.id : 0
    );
  }

  /////////////////////////////
  // - METODOS DE NUEVA OFERTA

  // Publica la oferta (Nueva, Duplicar)
  btn_Ofertas_publicarOferta() {
    var flag = false;

    if (this.oferta.titulo != '' && this.oferta.titulo != null) {
      if (this.oferta.subtitulo == '' && this.oferta.subtitulo == null)
        this.oferta.subtitulo = 'null';

      if (this.oferta.id_area != null) {
        if (this.oferta.id_pais != null) {
          if (
            (this.oferta.id_estado != null && this.oferta.id_pais == 1) ||
            this.oferta.id_pais != 1
          ) {
            if (
              (this.oferta.id_estado == null || this.oferta.id_estado == 0) &&
              this.oferta.id_pais == 1
            ) {
              this.oferta.id_estado = 0;
              this.oferta.id_ciudad = 0;
            }

            if (this.oferta.id_ciudad != null || this.oferta.id_pais != 1) {
              if (this.oferta.id_jornada_laboral != null) {
                if (this.oferta.id_tipo_contrato != null) {
                  if (this.oferta.salario != null) {
                    if (
                      this.oferta.fecha_contratacion != '' &&
                      this.oferta.fecha_contratacion != null
                    ) {
                      var fecha = this.oferta.fecha_contratacion.split('T');
                      this.oferta.fecha_contratacion = fecha[0];

                      if (this.oferta.vacantes != null) {
                        if (this.oferta.oferta_urgente != null) {
                          if (
                            this.myGroup.get('htmlText')!.value != '' &&
                            this.myGroup.get('htmlText')!.value != null
                          ) {
                            this.oferta.descripcion =
                              this.myGroup.get('htmlText')!.value;

                            if (this.oferta.id_experiencia != null) {
                              if (this.oferta.id_estudios != null) {
                                var cont = 0;
                                var flagIdioma = true;

                                this.oferta.idioma = [];
                                this.oferta.nivel = [];

                                for (
                                  let i = 0;
                                  i < this.NO_selectIdiomasTable.length;
                                  i++
                                ) {
                                  if (this.NO_selectIdiomasTable[i].idioma) {
                                    this.oferta.idioma[cont] =
                                      this.NO_selectIdiomasTable[i].id_idiomas;
                                    this.oferta.nivel[cont] =
                                      this.NO_selectIdiomasTable[i].id_nivel;

                                    if (
                                      this.oferta.idioma[cont] > 0 &&
                                      this.oferta.idioma[cont] != null &&
                                      this.oferta.nivel[cont] != 0 &&
                                      this.oferta.nivel[cont] != null
                                    )
                                      flagIdioma = true;
                                    else {
                                      flagIdioma = false;
                                      this.oferta.idioma = [];
                                      this.oferta.nivel = [];
                                      break;
                                    }
                                    cont++;
                                  }
                                }

                                if (flagIdioma) {
                                  if (
                                    this.oferta.licencia != '' &&
                                    this.oferta.licencia != null
                                  ) {
                                    if (this.oferta.dis_viajar != null) {
                                      if (this.oferta.dis_camb_res != null) {
                                        if (this.oferta.discapacidad != null) {
                                          flag = true;
                                        } else
                                          this.service.createAlert(
                                            'Seleccione una opción de "Discapacidad". Intente lo de nuevo.',
                                            'warning'
                                          );
                                      } else
                                        this.service.createAlert(
                                          'Seleccione una opción de "Residencia". Intente lo de nuevo.',
                                          'warning'
                                        );
                                    } else
                                      this.service.createAlert(
                                        'Seleccione una opción de "Viajar". Intente lo de nuevo.',
                                        'warning'
                                      );
                                  } else
                                    this.service.createAlert(
                                      'Seleccione una opción de "Licencia". Intente lo de nuevo.',
                                      'warning'
                                    );
                                } else
                                  this.service.createAlert(
                                    'Seleccione una opción de "Nivel". Intente lo de nuevo.',
                                    'warning'
                                  );
                              } else
                                this.service.createAlert(
                                  'Seleccione los "Estudios". Intente lo de nuevo.',
                                  'warning'
                                );
                            } else
                              this.service.createAlert(
                                'Seleccione la "Experiencia". Intente lo de nuevo.',
                                'warning'
                              );
                          } else
                            this.service.createAlert(
                              'Complete el campo "Descripción". Intente lo de nuevo.',
                              'warning'
                            );
                        } else
                          this.service.createAlert(
                            'Seleccióne una opción de "Urgente". Intente lo de nuevo.',
                            'warning'
                          );
                      } else
                        this.service.createAlert(
                          'Complete el campo "Vacantes". Intente lo de nuevo.',
                          'warning'
                        );
                    } else
                      this.service.createAlert(
                        'Seleccione la "Fecha de contratación". Intente lo de nuevo.',
                        'warning'
                      );
                  } else
                    this.service.createAlert(
                      'Complete el campo "Salario". Intente lo de nuevo.',
                      'warning'
                    );
                } else
                  this.service.createAlert(
                    'Seleccione un "Contrato". Intente lo de nuevo.',
                    'warning'
                  );
              } else
                this.service.createAlert(
                  'Seleccione una "Jornada". Intente lo de nuevo.',
                  'warning'
                );
            } else
              this.service.createAlert(
                'Seleccione una "Ciudad". Intente lo de nuevo.',
                'warning'
              );
          } else
            this.service.createAlert(
              'Seleccione un "Estado". Intente lo de nuevo.',
              'warning'
            );
        } else
          this.service.createAlert(
            'Seleccione un "País". Intente lo de nuevo.',
            'warning'
          );
      } else
        this.service.createAlert(
          'Seleccione un "Área". Intente lo de nuevo.',
          'warning'
        );
    } else
      this.service.createAlert(
        'Complete el campo "Cargo". Intente lo de nuevo.',
        'warning'
      );

    if (flag) {
      this.oferta.estado = 1;
      this.service.Ofertas_publicarOferta(this.oferta).subscribe(
        (r) => {
          this.closeEdit();
          this.onChangeSegment(this.segment);
        },
        (e) => {
          console.log(e);
          this.service.createAlert(
            'Error al conectar con el servidor. Intente de nuevo.',
            'danger'
          );
        }
      );
    }
  }

  // Metodo que crea el modal

  async Ofertas_getSelects(tipo: string) {
    this.service.Ofertas_getSelects().subscribe(
      (r: any) => {
        var listStatus: any = r[0];
        var listSelects: any = r[1];
        var error: string = 'Error en los selects: ';

        if (listStatus.areas == 1) this.NO_selectArea = listSelects.areas;
        else error += 'area';

        if (listStatus.contrato == 1)
          this.NO_selectContrato = listSelects.contrato;
        else if (listStatus.areas != 1) error += ',contrato';
        else error += 'contrato';

        if (listStatus.estado == 1) this.NO_selectEstado = listSelects.estado;
        else if (listStatus.areas != 1 || listStatus.contrato != 1)
          error += ',estado';
        else error += 'estado';

        if (listStatus.estudios == 1)
          this.NO_selectEstudios = listSelects.estudios;
        else if (
          listStatus.areas != 1 ||
          listStatus.contrato != 1 ||
          listStatus.estado != 1
        )
          error += ',estudios';
        else error += ',estudios';

        if (listStatus.experiencia == 1)
          this.NO_selectExperiencia = listSelects.experiencia;
        else if (
          listStatus.areas != 1 ||
          listStatus.contrato != 1 ||
          listStatus.estado != 1 ||
          listStatus.estudios != 1
        )
          error += ',experiencia';
        else error += 'experiencia';

        if (listStatus.idioma == 1) this.NO_selectIdioma = listSelects.idioma;
        else if (
          listStatus.areas != 1 ||
          listStatus.contrato != 1 ||
          listStatus.estado != 1 ||
          listStatus.estudios != 1 ||
          listStatus.experiencia != 1
        )
          error += ',idioma';
        else error += 'idioma';

        if (listStatus.jornada == 1)
          this.NO_selectJornada = listSelects.jornada;
        else if (
          listStatus.areas != 1 ||
          listStatus.contrato != 1 ||
          listStatus.estado != 1 ||
          listStatus.estudios != 1 ||
          listStatus.experiencia != 1 ||
          listStatus.idioma != 1
        )
          error += ',jornada';
        else error += 'jornada';

        if (listStatus.nivel == 1) this.NO_selectNivel = listSelects.nivel;
        else if (
          listStatus.areas != 1 ||
          listStatus.contrato != 1 ||
          listStatus.estado != 1 ||
          listStatus.estudios != 1 ||
          listStatus.experiencia != 1 ||
          listStatus.idioma != 1 ||
          listStatus.jornada != 1
        )
          error += ',nivel';
        else error += 'nivel';

        if (listStatus.pais == 1) this.NO_selectPais = listSelects.pais;
        else if (
          listStatus.areas != 1 ||
          listStatus.contrato != 1 ||
          listStatus.estado != 1 ||
          listStatus.estudios != 1 ||
          listStatus.experiencia != 1 ||
          listStatus.idioma != 1 ||
          listStatus.jornada != 1 ||
          listStatus.pais != 1
        )
          error += ',pais';
        else error += 'pais';

        if (
          listStatus.areas != 1 ||
          listStatus.contrato != 1 ||
          listStatus.estado != 1 ||
          listStatus.estudios != 1 ||
          listStatus.experiencia != 1 ||
          listStatus.idioma != 1 ||
          listStatus.jornada != 1 ||
          listStatus.pais != 1 ||
          listStatus.pais != 1
        )
          this.service.createAlert(error, 'danger');

        for (let i = 0; i < this.NO_selectIdioma.length; i++) {
          this.NO_selectIdiomasTable[i] = {
            id_idiomas: this.NO_selectIdioma[i].id_idiomas,
            id_nivel: 0,
            idioma: false,
          };
        }
      },
      (e) => {
        console.log(e);
        this.service.createAlert(
          'Error al conectar con el servidor. Intente de nuevo.',
          'danger'
        );
      },
      () => {
        if (tipo == 'Duplicar Oferta' || tipo == 'Editar Oferta') {
          this.oferta = this.oferta_res; // Se vuelve a recargar la información

          this.myGroup.get('htmlText')!.valueChanges.subscribe((value) => {
            this.maxDescripcion = 3000 - value.length;
          });

          for (let i = 0; i < this.NO_selectIdiomasTable.length; i++) {
            var flag = true;
            for (let o = 0; o < this.oferta.idioma.length; o++) {
              if (
                this.NO_selectIdiomasTable[i].id_idiomas ==
                this.oferta.idioma[o]
              ) {
                flag = false;
                this.NO_selectIdiomasTable[i].idioma = true;
                this.NO_selectIdiomasTable[i].id_nivel = this.oferta.nivel[o];
                break;
              }
            }
            if (flag) {
              this.NO_selectIdiomasTable[i].idioma = false;
              this.NO_selectIdiomasTable[i].id_nivel = 0;
            }
          }

          this.onChangeCargo();
          this.maxDescripcion = 3000 - this.oferta.descripcion.length;

          this.myGroup.setValue({ htmlText: this.oferta.descripcion });
        }
      }
    );
  }

  async Ofertas_getSelectCiudad() {
    this.service
      .Ofertas_getSelectCiudad({
        estado:
          this.oferta.id_estado != null && this.oferta.id_estado != 0
            ? this.oferta.id_estado
            : 0,
      })
      .subscribe(
        (r) => {
          this.NO_selectCiudad = r as any;
        },
        (e) => {
          console.log(e);
          this.service.createAlert(
            'Error al conectar con el servidor. Intente de nuevo.',
            'danger'
          );
        }
      );
  }

  onChangeCargo() {
    this.maxTitulo = 128 - this.oferta.titulo.length;
    this.maxSubtitulo = 128 - this.oferta.subtitulo.length;
    this.changeCargo = this.oferta.titulo;
    this.changeCargo2 =
      this.oferta.subtitulo != null &&
      this.oferta.subtitulo != '' &&
      this.oferta.titulo != null &&
      this.oferta.titulo != ''
        ? ' - ' + this.oferta.subtitulo
        : this.oferta.subtitulo;
  }

  Ofertas_onChangeEnableEstadoCiudad(value: number) {
    switch (value) {
      case 0:
        if (this.oferta.id_pais == 1) {
          this.btnDisableEstado = false;
        } else {
          this.btnDisableEstado = true;
          this.oferta.id_estado = 0;
          this.oferta.id_ciudad = 0;
        }
        break;
      case 1:
        this.oferta.id_ciudad = 0;
        this.Ofertas_getSelectCiudad();
        break;
    }
  }

  // Metodo de seleccion de idiomas.
  // Si selecciona el idioma se habilitara la seleccion del nivel del idioma.
  Ofertas_onChangeIdiomas(value: number, index: number, event: any) {
    switch (value) {
      case 0:
        this.NO_selectIdiomasTable[index].idioma = this.NO_selectIdiomasTable[
          index
        ].idioma
          ? false
          : true;

        break;
      case 1:
        if (event != '' && event! > 0 && event != null)
          this.NO_selectIdiomasTable[index].id_nivel = event;

        break;
    }
  }

  // Metodo que verifica si el valor obtenido es numerico.
  Ofertas_onChangeOnlyNumber(evt: any) {
    var Event = evt;

    if (Event.keyCode == 8) return true;

    if (Event.type === 'paste') {
      var key = Event.clipboardData.getData('text/plain');
      return false;
    } else {
      var key = Event.detail.data;
      return false;
    }

    var regex = /[0-9]|/;
    if (!regex.test(key)) {
      evt.target.value = Event.target.value.substring(
        0,
        Event.target.value.length - 1
      );
    }
  }

  ///////////////////////////////
  // - METODOS DE DETALLE OFERTA
  async Ofertas_getDetalleOferta(index: number) {
    this.service.Ofertas_getDetalleOferta({ id: index }).subscribe(
      (r: any) => {
        this.oferta = r[0] as any;
        var Personas = r[1] as any;
        this.DO_idiomas = r[2] as any;

        this.oferta.id_oferta = index;

        this.oferta.idioma = [];
        this.oferta.nivel = [];

        this.oferta.salario = parseFloat(this.oferta.salario.toString());
        this.oferta.salario_n = formatCurrency(
          this.oferta.salario,
          'en-US',
          '$',
          'USD',
          '1.2-2'
        );

        this.oferta.postulados = Personas.postulados;
        this.oferta.finalistas = Personas.finalistas;
        this.oferta.seleccionados = Personas.seleccionados;

        for (let i = 0; i < this.DO_idiomas.length; i++) {
          this.oferta.idioma[i] = this.DO_idiomas[i]['idioma'];
          this.oferta.nivel[i] = this.DO_idiomas[i]['nivel'];
        }

        var DO_descripcion = document.getElementById('DO_descripcion');
        DO_descripcion!.innerHTML = this.oferta.descripcion;
      },
      (e) => {
        console.log(e);
        this.service.createAlert(
          'Error al conectar con el servidor. Intente de nuevo.',
          'danger'
        );
      }
    );
  }

  // Metodo que cambia el estado de la Oferta seleccionada.
  Ofertas_cambiarEstado(id: number, estado: number) {
    this.confirmAlert(
      estado == 1
        ? '¿Desea inhabilitar la Oferta?'
        : '¿Desea habilitar la Oferta?',
      'medium',
      { id: id, estado: estado, tipo: 101 }
    );
  }

  // Po: Postulados
  // Fi: Finalistas
  // Se: Seleccionados
  // Ver detalles de la Oferta
  Ofertas_PoFiSe(id: number, tipo: string) {
    sessionStorage.setItem('OfertasLab oferta_id', id as any);
    sessionStorage.setItem('OfertasLab PosFinSel segment', tipo);

    this.service.oferta = this.oferta;

    if (
      sessionStorage.getItem('OfertasLab oferta_id') &&
      sessionStorage.getItem('OfertasLab PosFinSel segment')
    )
      this.router.navigate([
        'tabs/area/capitalhumano/ofertas-laborales/ver-posfinsel',
      ]);
    else
      this.service.createAlert(
        'No se cargo bien la información. Intente lo de nuevo',
        'warning'
      );
  }

  /////////////////////////////////
  // - METODOS DE DUPLICAR OFERTA
  // Abrir modal (Duplicar Oferta)
  btn_Oferta_openDuplicar() {
    this.closeEdit();
    this.createModal('Duplicar Oferta', { id: this.oferta.id_oferta });
  }

  ///////////////////////////////
  // - METODOS DE EDITAR OFERTA
  // Abrir modal (Editar Oferta)
  btn_Oferta_openEditar() {
    this.closeEdit();
    this.createModal('Editar Oferta', { id: this.oferta.id_oferta });
  }

  // Actualizar oferta
  async btn_Oferta_editar() {
    var flag = false;

    if (this.oferta.titulo != '' && this.oferta.titulo != null) {
      if (this.oferta.subtitulo == '' && this.oferta.subtitulo == null)
        this.oferta.subtitulo = 'null';

      if (this.oferta.id_area != null) {
        if (this.oferta.id_pais != null) {
          if (
            (this.oferta.id_estado != null && this.oferta.id_pais == 1) ||
            this.oferta.id_pais != 1
          ) {
            if (
              (this.oferta.id_estado == null || this.oferta.id_estado == 0) &&
              this.oferta.id_pais == 1
            ) {
              this.oferta.id_estado = 0;
              this.oferta.id_ciudad = 0;
            }

            if (this.oferta.id_ciudad != null || this.oferta.id_pais != 1) {
              if (this.oferta.id_jornada_laboral != null) {
                if (this.oferta.id_tipo_contrato != null) {
                  if (this.oferta.salario != null) {
                    if (
                      this.oferta.fecha_contratacion != '' &&
                      this.oferta.fecha_contratacion != null
                    ) {
                      var fecha = this.oferta.fecha_contratacion.split('T');
                      this.oferta.fecha_contratacion = fecha[0];

                      if (this.oferta.vacantes != null) {
                        if (this.oferta.oferta_urgente != null) {
                          if (
                            this.myGroup.get('htmlText')!.value != '' &&
                            this.myGroup.get('htmlText')!.value != null
                          ) {
                            this.oferta.descripcion =
                              this.myGroup.get('htmlText')!.value;

                            if (this.oferta.id_experiencia != null) {
                              if (this.oferta.id_estudios != null) {
                                var cont = 0;
                                var flagIdioma = true;

                                this.oferta.idioma = [];
                                this.oferta.nivel = [];

                                for (
                                  let i = 0;
                                  i < this.NO_selectIdiomasTable.length;
                                  i++
                                ) {
                                  if (this.NO_selectIdiomasTable[i].idioma) {
                                    this.oferta.idioma[cont] =
                                      this.NO_selectIdiomasTable[i].id_idiomas;
                                    this.oferta.nivel[cont] =
                                      this.NO_selectIdiomasTable[i].id_nivel;

                                    if (
                                      this.oferta.idioma[cont] > 0 &&
                                      this.oferta.idioma[cont] != null &&
                                      this.oferta.nivel[cont] != 0 &&
                                      this.oferta.nivel[cont] != null
                                    )
                                      flagIdioma = true;
                                    else {
                                      flagIdioma = false;
                                      this.oferta.idioma = [];
                                      this.oferta.nivel = [];
                                      break;
                                    }
                                    cont++;
                                  }
                                }

                                if (flagIdioma) {
                                  if (
                                    this.oferta.licencia != '' &&
                                    this.oferta.licencia != null
                                  ) {
                                    if (this.oferta.dis_viajar != null) {
                                      if (this.oferta.dis_camb_res != null) {
                                        if (this.oferta.discapacidad != null) {
                                          flag = true;
                                        } else
                                          this.service.createAlert(
                                            'Seleccione una opción de "Discapacidad". Intente lo de nuevo.',
                                            'warning'
                                          );
                                      } else
                                        this.service.createAlert(
                                          'Seleccione una opción de "Residencia". Intente lo de nuevo.',
                                          'warning'
                                        );
                                    } else
                                      this.service.createAlert(
                                        'Seleccione una opción de "Viajar". Intente lo de nuevo.',
                                        'warning'
                                      );
                                  } else
                                    this.service.createAlert(
                                      'Seleccione una opción de "Licencia". Intente lo de nuevo.',
                                      'warning'
                                    );
                                } else
                                  this.service.createAlert(
                                    'Seleccione una opción de "Nivel". Intente lo de nuevo.',
                                    'warning'
                                  );
                              } else
                                this.service.createAlert(
                                  'Seleccione los "Estudios". Intente lo de nuevo.',
                                  'warning'
                                );
                            } else
                              this.service.createAlert(
                                'Seleccione la "Experiencia". Intente lo de nuevo.',
                                'warning'
                              );
                          } else
                            this.service.createAlert(
                              'Complete el campo "Descripción". Intente lo de nuevo.',
                              'warning'
                            );
                        } else
                          this.service.createAlert(
                            'Seleccióne una opción de "Urgente". Intente lo de nuevo.',
                            'warning'
                          );
                      } else
                        this.service.createAlert(
                          'Complete el campo "Vacantes". Intente lo de nuevo.',
                          'warning'
                        );
                    } else
                      this.service.createAlert(
                        'Seleccione la "Fecha de contratación". Intente lo de nuevo.',
                        'warning'
                      );
                  } else
                    this.service.createAlert(
                      'Complete el campo "Salario". Intente lo de nuevo.',
                      'warning'
                    );
                } else
                  this.service.createAlert(
                    'Seleccione un "Contrato". Intente lo de nuevo.',
                    'warning'
                  );
              } else
                this.service.createAlert(
                  'Seleccione una "Jornada". Intente lo de nuevo.',
                  'warning'
                );
            } else
              this.service.createAlert(
                'Seleccione una "Ciudad". Intente lo de nuevo.',
                'warning'
              );
          } else
            this.service.createAlert(
              'Seleccione un "Estado". Intente lo de nuevo.',
              'warning'
            );
        } else
          this.service.createAlert(
            'Seleccione un "País". Intente lo de nuevo.',
            'warning'
          );
      } else
        this.service.createAlert(
          'Seleccione un "Área". Intente lo de nuevo.',
          'warning'
        );
    } else
      this.service.createAlert(
        'Complete el campo "Cargo". Intente lo de nuevo.',
        'warning'
      );

    if (flag) {
      this.service.Ofertas_actualizarOferta(this.oferta).subscribe(
        (r) => {
          this.closeEdit();
          window.location.reload();
        },
        (e) => {
          console.log(e);
          this.service.createAlert(
            'Error al conectar con el servidor. Intente de nuevo.',
            'danger'
          );
        }
      );
    }
  }

  //////////////
  // USUARIOS //
  //////////////

  // Consulta para la obtención del listado de usuarios.
  async getUsuarios(usuario: any) {
    this.U_search = usuario;
    this.service
      .Ofertas_getUsuarios({
        usuario: this.U_search,
        pais: this.selectedPais.id,
      })
      .subscribe(
        (r: any) => {
          this.listUsuarios = r[0];

          var listTel = r[1] as Array<any>;
          for (var i = 0; i < this.listUsuarios.length; i++) {
            var Tel: Array<any> = [];
            var Pre: Array<any> = [];
            listTel
              .filter((x) => x.id_usuario === this.listUsuarios[i].id_usuario)
              .forEach((y) => {
                Tel.push(y.telefono);
                Pre.push(y.prefijo);
              });
            this.listUsuarios[i].telefonos = Tel;
            this.listUsuarios[i].prefijos = Pre;
          }
        },
        (e) => {
          console.log(e);
          this.service.createAlert(
            'Error al conectar con el servidor. Intente de nuevo.',
            'danger'
          );
        },
        () => {
          this.Ofertas_btnEstabilizador();
        }
      );
  }

  // Consulta para la obtención de los paises para el select.
  async Ofertas_getSelectPaises_Usuarios() {
    this.service.Ofertas_getSelectPaises_Usuarios().subscribe(
      (r: any) => {
        this.U_selectPaises = r[0];
      },
      (e) => {
        console.log(e);
        this.service.createAlert(
          'Error al conectar con el servidor. Intente de nuevo.',
          'danger'
        );
      }
    );
  }

  // Consulta dependiendo del filtro.
  Ofertas_onChangePaises_Usuarios(event: any) {
    var list = this.U_selectPaises.find(
      (x) => x.id_pais === event.target.value
    );
    this.U_selectPais.nombre = list.descripcion;
    this.U_selectPais.num = list.num;
    this.getUsuarios(this.U_search);
  }

  // Cancela el filtro seleccionado.
  Ofertas_cancelarSelectPais_Usuarios() {
    this.U_selectPais = { nombre: null, id: null, num: null };
  }

  // Metodo de redirección para la observación del curriculum del usuario seleccionado.
  Ofertas_verCurriculum_Usuarios(id: number) {
    sessionStorage.setItem('OfertasLab PosFinSel usuario', id.toString());
    sessionStorage.setItem('OfertasLab curriculum tipo', 'U');

    this.router.navigate([
      'tabs/area/capitalhumano/ofertas-laborales/curriculum',
    ]);
  }

  // Metodo que pregunta si quieres cambiar el estado del usuario seleccionado.
  Ofertas_onChangeEstado_Usuarios(id: number, estado: number) {
    this.confirmAlert('¿Desea cambiar el "estado del usuario"?', 'medium', {
      id: id,
      estado: estado,
      tipo: 201,
    });
  }

  //////////////////
  // ESTADISTICAS //
  //////////////////

  // Consulta las estadisticas del colaborador (Colaborador que inicio sesion).
  async Ofertas_misEstadisticas_Estadisticas() {
    this.service
      .Ofertas_misEstadisticas_Estadisticas({
        id: parseInt(localStorage.getItem('id_colaborador')!),
      })
      .subscribe(
        (r: any) => {
          this.E_misEstadisticas = r[0];
        },
        (e) => {
          console.log(e);
          this.service.createAlert(
            'Error al conectar con el servidor. Intente de nuevo.',
            'danger'
          );
        },
        () => {
          this.Ofertas_btnEstabilizador();
        }
      );
  }

  ///////////////////
  // CONFIGURACIÓN //
  ///////////////////

  // Obtiene el listado de (AIP):
  // A: Áreas
  // I: Idiomas
  // P: Países
  async Ofertas_listsAIP_Configuracion() {
    this.service.Ofertas_listsAIP_Configuracion().subscribe(
      (r: any) => {
        this.C_listAreas = r[0];
        this.C_listIdiomas = r[1];
        this.C_listPaises = r[2];

        for (let i = 0; i < this.C_listAreas.length; i++)
          this.C_listRAreas[i] = Object.assign({}, this.C_listAreas[i]);
        for (let i = 0; i < this.C_listIdiomas.length; i++)
          this.C_listRIdiomas[i] = Object.assign({}, this.C_listIdiomas[i]);
        for (let i = 0; i < this.C_listPaises.length; i++)
          this.C_listRPaises[i] = Object.assign({}, this.C_listPaises[i]);
      },
      (e) => {
        console.log(e);
        this.service.createAlert(
          'Error al conectar con el servidor. Intente de nuevo.',
          'danger'
        );
      },
      () => {
        this.Ofertas_btnEstabilizador();
      }
    );
  }

  // Metodo que sirve para dejar habilitado solamente un recuadro
  Ofertas_changesBox_Configuracion(tipo_C: string) {
    switch (tipo_C) {
      case 'A':
        this.C_boxAreas = true;
        this.C_boxIdiomas = false;
        this.C_boxPaises = false;
        break;
      case 'I':
        this.C_boxAreas = false;
        this.C_boxIdiomas = true;
        this.C_boxPaises = false;
        break;
      case 'P':
        this.C_boxAreas = false;
        this.C_boxIdiomas = false;
        this.C_boxPaises = true;
        break;
    }
  }

  // Metodo para la realización del CRUD en todas las consultas de este sub-modulo.
  // Consultas relacionadas: Areas, Idiomas, Paises
  async Ofertas_CRUD_Configuracion(
    tipo_C: string,
    tipo_CRUD: string,
    data: any
  ) {
    var datas = { datos: new Array(), tipo_C: '', tipo_CRUD: '' };
    var datos: Array<any> = [];
    var count = 0;

    // Tipo seleccionado del CRUD
    switch (tipo_CRUD) {
      case 'C':
        datas = {
          datos: data.descripcion,
          tipo_C: tipo_C,
          tipo_CRUD: tipo_CRUD,
        };
        break;
      case 'U':
        // Tipo de configuración
        switch (tipo_C) {
          // Áreas
          case 'A':
            for (let i = 0; i < this.C_listAreas.length; i++) {
              if (
                this.C_listAreas[i].descripcion !=
                this.C_listRAreas.find(
                  (x) => x.id_areas === this.C_listAreas[i].id_areas
                ).descripcion
              ) {
                datos[count] = this.C_listRAreas.find(
                  (x) => x.id_areas === this.C_listAreas[i].id_areas
                );
                count++;
              }
            }
            break;
          // Idiomas
          case 'I':
            for (let i = 0; i < this.C_listIdiomas.length; i++) {
              if (
                this.C_listIdiomas[i].descripcion !=
                this.C_listRIdiomas.find(
                  (x) => x.id_idiomas === this.C_listIdiomas[i].id_idiomas
                ).descripcion
              ) {
                datos[count] = this.C_listRIdiomas.find(
                  (x) => x.id_idiomas === this.C_listIdiomas[i].id_idiomas
                );
                count++;
              }
            }
            break;
          // Países
          case 'P':
            for (let i = 0; i < this.C_listPaises.length; i++) {
              if (
                this.C_listPaises[i].descripcion !=
                this.C_listRPaises.find(
                  (x) => x.id_pais === this.C_listPaises[i].id_pais
                ).descripcion
              ) {
                datos[count] = this.C_listRPaises.find(
                  (x) => x.id_pais === this.C_listPaises[i].id_pais
                );
                count++;
              }
            }
            break;
        }
        datas = { datos: datos, tipo_C: tipo_C, tipo_CRUD: tipo_CRUD };
        break;
      case 'D':
        datas = { datos: data.id, tipo_C: tipo_C, tipo_CRUD: tipo_CRUD };
        break;
    }

    if (tipo_CRUD != 'U' || (tipo_CRUD == 'U' && count != 0)) {
      this.service.Ofertas_CRUD_Configuracion(datas).subscribe(
        (r: any) => {
          // Tipo de CRUD seleccionado
          switch (tipo_CRUD) {
            case 'C':
              if (r == 1)
                this.service.createAlert('Se agregó exitosamente.', 'success');
              else
                this.service.createAlert(
                  'No se agregó correctamente. Intente de nuevo.',
                  'danger'
                );
              break;
            case 'U':
              if (r[0] == r[1])
                this.service.createAlert(
                  'Se actualizo exitosamente.',
                  'success'
                );
              else
                this.service.createAlert(
                  'No se actualizo correctamente. Intente de nuevo.',
                  'danger'
                );
              break;
            case 'D':
              if (r == 1)
                this.service.createAlert('Se eliminó exitosamente.', 'success');
              else
                this.service.createAlert(
                  'No se eliminó correctamente. Intente de nuevo.',
                  'danger'
                );
              break;
          }
          this.onChangeSegment(this.segment);
        },
        (e) => {
          console.log(e);
          this.service.createAlert(
            'Error al conectar con el servidor. Intente de nuevo.',
            'danger'
          );
        }
      );
    }
  }

  // Metodo que realiza una pregunta para la verificación de la eliminación de algun dato.
  Ofertas_deleteItem_Configuracion(
    id: number,
    descripcion: string,
    tipo_C: string,
    tipo_CRUD: string
  ) {
    this.confirmAlert('¿Desea eliminar "' + descripcion + '"?', 'medium', {
      id: id,
      tipo_C: tipo_C,
      tipo_CRUD: tipo_CRUD,
      tipo: 301,
    });
  }

  //alertas on link
  async confirmAlert(message: string, color: string = '', data: any) {
    const toast = await this.toast.create({
      message: message,
      color: color,
      buttons: [
        {
          side: 'end',
          text: 'confirmar',
          handler: () => {
            switch (data.tipo) {
              case 101:
                this.ModalDetallesOferta.dismiss();
                this.service.Ofertas_cambiarEstado(data).subscribe(
                  (r: any) => {
                    if (r[0] == 1)
                      this.service.createAlert(
                        'Se modifico con exito.',
                        'success'
                      );
                    else
                      this.service.createAlert(
                        'No se modifico. Intente lo de nuevo.',
                        'danger'
                      );

                    this.Ofertas_changeSelectAreaPais_Ofertas(
                      this.selectedArea.id != null ? this.selectedArea.id : 0,
                      this.selectedPais.id != null ? this.selectedPais.id : 0,
                      ''
                    );
                  },
                  (e) => {
                    console.log(e);
                    this.service.createAlert(
                      'Error al conectar con el servidor. Intente de nuevo.',
                      'danger'
                    );
                  }
                );
                break;
              case 201:
                this.service.Ofertas_onChangeEstado_Usuarios(data).subscribe(
                  (r) => {
                    if (r == 1)
                      this.service.createAlert(
                        'Se modifico con exito.',
                        'success'
                      );
                    else
                      this.service.createAlert(
                        'No se modifico. Intente lo de nuevo.',
                        'danger'
                      );

                    this.onChangeSegment(this.segment);
                  },
                  (e) => {
                    console.log(e);
                    this.service.createAlert(
                      'Error al conectar con el servidor. Intente de nuevo.',
                      'danger'
                    );
                  }
                );
                break;
              case 301:
                this.Ofertas_CRUD_Configuracion(data.tipo_C, data.tipo_CRUD, {
                  id: data.id,
                });
                break;
            }
          },
        },
        {
          side: 'end',
          icon: 'close',
          handler: () => {
            toast.dismiss();
          },
        },
      ],
    });
    return toast.present();
  }
}
