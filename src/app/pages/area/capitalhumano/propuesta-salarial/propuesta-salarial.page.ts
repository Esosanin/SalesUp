import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { CapitalhumanoService } from 'src/app/servicios/capitalhumano/capitalhumano.service';
import { CuentaService } from 'src/app/servicios/cuenta/cuenta.service';

interface propuesta_i {
  id: number;
  nombre_comp: string;
  id_colaborador: number;
  nombres: string;
  apellido_p: string;
  apellido_m: string;
  tipo_empleado: number;
  puesto: number;
  sucursal: number;
  depto: number;
  //fecha: string; Se llaman igual en la query con ISNULL
  //contrato: string; Se llaman igual en la query con ISNULL
  //pago: string; Se llaman igual en la query con ISNULL
  infoextra: string;
  estado: number;
  //fecha_inicio: string; Se llaman igual en la query con ISNULL
  creador: number;
  //tmp_sueldo: number; Se llaman igual en la query con ISNULL

  tmp_sueldo: number;
  contrato: string;
  pago: string;
  fecha: string;
  fecha_inicio: string;
  tipoEmpleado_id: number;
  tipoEmpleado_desc: string;
  sucursal_n: string;
  departamentos_desc: string;
  area_n: string;
  puesto_n: string;
  codigo_region: string;
  region: number;
  id_sucursal: number;
  tipo_empleado2: number;
  id_departamentos: number;
  id_puesto: number;
  tipoEmpleado_desc2: string;
  sucursal_n2: string;
  departamentos_desc2: string;
  puesto_n2: string;
  id_region: number;
  tabulador_id: number;
  tab_nivel: number;
  porcentaje: number;
  porcentaje_n: string;
  hoja: string;
  aumento: number;
  posicion_apoyo: string;
  categoria: string;
  fechatb: string;
  base: number;

  posicion_apoyo_index: number;

  puntoGuia: number;
  ingresoBruto: number;
  puntualidad: number;
  asistencia: number;
  despensa: number;
  fondoAhorro: number;
  salarioBruto: number;
  salarioBruto_aumento: number;
  puntoGuia_n: string;
  ingresoBruto_n: string;
  puntualidad_n: string;
  asistencia_n: string;
  despensa_n: string;
  fondoAhorro_n: string;
  salarioBruto_n: string;
  salarioBruto_aumento_n: string;

  ingreso_asistencia_puntualidad: number;
  ingreso_asistencia_puntualidad_n: string;

  costoNomina: number;
  costoNomina_n: string;
}

interface nuevaPropuestaSalarial{
  colaborador_id: number;
  colaborador_nombres: string;
  colaborador_apellido_p: string;
  colaborador_apellido_m: string;
  colaborador_tipo_empleado: number;
  colaborador_posicion_apoyo_id: number;
  colaborador_sucursal_id: number;
  colaborador_departamento_id: number;
}

interface nueva_propuesta_i{
  hoja: string;
  fecha: string;
  posicion: string;
  categoria: string;
  nivel: number;
  puntoGuia: number;
  puntoGuia_n: string;
  porcentaje: number;
  ingresoBruto: number;
  ingresoBruto_n: string;
  puntualidad: number;
  puntualidad_n: string;
  asistencia: number;
  asistencia_n: string;
  despensa: number;
  despensa_n: string;
  fondoAhorro: number;
  fondoAhorro_n: string;
  salarioBruto: number;
  salarioBruto_n: string;
  salarioBruto_aumento: number;
  salarioBruto_aumento_n: string;

  aumento: number;
  base: number;
}

interface propuesta_definitiva_i{
  propuestaID: number;
  numeroPropuesta: number;
  status: number;
  tabID: number;
  fechaTab: string;
  hoja: string;
  posicionApoyo: string;
  categoria: string;
  nivelTab: number;
  porcentaje: number;
  base: number;
  aumento: number;
  puntoGuia: number;
  ingresoBruto: number;
  ingresoBrutoPremio: number;
  puntualidad: number;
  asistencia: number;
  despensa: number;
  fondoAhorro: number;
  crecimiento: number;
  subTotal: number;

  porcentaje_n: string;
  base_n: string;
  puntoGuia_n: string;
  ingresoBruto_n: string;
  ingresoBrutoPremio_n: string;
  puntualidad_n: string;
  asistencia_n: string;
  despensa_n: string;
  fondoAhorro_n: string;
  crecimiento_n: string;
  subTotal_n: string;
  costoNomina_n: string;
}

@Component({
  selector: 'app-propuesta-salarial',
  templateUrl: './propuesta-salarial.page.html',
  styleUrls: ['./propuesta-salarial.page.scss'],
})
export class PropuestaSalarialPage implements OnInit {

  // INICIO DE LA PAGINA

  titlePropuesta: string = '';
  propuesta_id: number = 0;
  propuestaColaborador: any = [];

  InformacionGeneral: boolean = true;
  PropuestaActual: boolean = false;
  NuevaPropuesta: boolean = false;
  PropuestaDefinitiva: boolean = false;

  filesUrl: string = 'http://intranet.ecn.com.mx:8060/api/public/files/propuestasalarial/';

  propuestaData: propuesta_i = {
    id: 0,
    nombre_comp: '',
    id_colaborador: 0,
    nombres: '',
    apellido_p: '',
    apellido_m: '',
    tipo_empleado: 0,
    puesto: 0,
    sucursal: 0,
    depto: 0,
    //fecha: '', Se llaman igual en la query con ISNULL
    //contrato: '', Se llaman igual en la query con ISNULL
    //pago: '', Se llaman igual en la query con ISNULL
    infoextra: '',
    estado: 0,
    //fecha_inicio: '', Se llaman igual en la query con ISNULL
    creador: 0,
    //tmp_sueldo: 0, Se llaman igual en la query con ISNULL

    tmp_sueldo: 0,
    contrato: '',
    pago: '',
    fecha: '',
    fecha_inicio: '',
    tipoEmpleado_id: 0,
    tipoEmpleado_desc: '',
    sucursal_n: '',
    departamentos_desc: '',
    area_n: '',
    puesto_n: '',
    codigo_region: '',
    region: 0,
    id_sucursal: 0,
    tipo_empleado2: 0,
    id_departamentos: 0,
    id_puesto: 0,
    tipoEmpleado_desc2: '',
    sucursal_n2: '',
    departamentos_desc2: '',
    puesto_n2: '',
    id_region: 0,
    tabulador_id: 0,
    tab_nivel: 0,
    porcentaje: 0,
    porcentaje_n: '',
    hoja: '',
    aumento: 0,
    posicion_apoyo: '',
    categoria: '',
    fechatb: '',
    base: 0,

    posicion_apoyo_index: 0,

    puntoGuia: 0,
    ingresoBruto: 0,
    puntualidad: 0,
    asistencia: 0,
    despensa: 0,
    fondoAhorro: 0,
    salarioBruto: 0,
    salarioBruto_aumento: 0,
    puntoGuia_n: '',
    ingresoBruto_n: '',
    puntualidad_n: '',
    asistencia_n: '',
    despensa_n: '',
    fondoAhorro_n: '',
    salarioBruto_n: '',
    salarioBruto_aumento_n: '',

    ingreso_asistencia_puntualidad: 0,
    ingreso_asistencia_puntualidad_n: '',
    costoNomina: 0,
    costoNomina_n: ''
  }

  ////////////////////////////
  // Nueva opción/propuesta //
  ////////////////////////////

  hojaEspecialidades: any = [];
  especialidadSeleccionada: number = 0;
  hojaPosicionApoyo: any = [];
  posicionSeleccionada: number = 0;

  nuevaPropuesta: nueva_propuesta_i = {

    hoja: '',
    fecha: '',
    posicion: '',
    categoria: '',
    nivel: 0,

    puntoGuia: 0,
    puntoGuia_n: '',
    porcentaje: 0,
    ingresoBruto: 0,
    ingresoBruto_n: '',
    puntualidad: 0,
    puntualidad_n: '',
    asistencia: 0,
    asistencia_n: '',
    despensa: 0,
    despensa_n: '',
    fondoAhorro: 0,
    fondoAhorro_n: '',
    salarioBruto: 0,
    salarioBruto_n: '',
    salarioBruto_aumento: 0,
    salarioBruto_aumento_n: '',

    aumento: 1,
    base: 0
  }

  hojaCategoria: any = [];
  categoriaSeleccionada: number = 0;
  hojaNivel_aumento: any = [];
  hojaNivel_title: any = [];
  nivelSeleccionada: number = 0;

  //////////////////////////////////
  // Propuesta #numero definitiva //
  /////////////////////////////////

  info_def: any = [];

  definitvaPropuestasB: Array<boolean> = [];
  infoDefinitiva: propuesta_definitiva_i[] = [];



  //////////////////////////////////

  constructor(private service: CuentaService,
    private toast: ToastController,
    private router: Router,
    private servicePropuesta: CapitalhumanoService) { }

       // PROPUESTA SALARIAL

  // Interface para una nueva "propuesta salarial"
  propuestaData2: nuevaPropuestaSalarial = {
    colaborador_id: 0,
    colaborador_nombres: '',
    colaborador_apellido_p: '',
    colaborador_apellido_m: '',
    colaborador_tipo_empleado: 0,
    colaborador_posicion_apoyo_id: 0,
    colaborador_sucursal_id: 0,
    colaborador_departamento_id: 0
  };

  // Variables para guardar la información de todas las propuestas
  // En proceso y Terminadas
  propuestas_proceso: any = [];
  propuestas_terminadas: any = [];

  // Variable booleana para saber si el usuario existe o hacer uno nuevo
  // dentro del Modal
  // "Existe" : FALSE
  // "No existe" : TRUE
  btn_sinCapturarColaborador: boolean = false;

  // Variable para abrir o cerrar el modal "Nueva Propuesta"
  modalPropuestaSalarial: boolean = false;

  // Variables para guardar los items para cada "IONIC-SELECTABLE"
  propuestaTipoEmpleado: any = [];
  propuestaColaboradores: Array<any> = [];
  propuestaApoyo: Array<any> = [];
  propuestaSucursal: Array<any> = [];
  propuestaDepartamento: Array<any> = [];

  // Variables para la selección "IONIC-SELECTABLE"
  colaboradorSeleccionado: Array<Object> = [];
  apoyoSeleccionado: Array<Object> = [];
  sucursalSeleccionado: Array<Object> = [];
  departamentoSeleccionado: Array<Object> = [];

  ////////////////////////////////////////////////////

  Morelimite: number = 20;

  async ngOnInit() {



        this.servicePropuesta.getPropuestas_proceso({searchText: ''}).subscribe(
          r => {
            this.propuestas_proceso = r as Array <any>;
          }
        );

        this.servicePropuesta.getPropuestas_terminadas({searchText: ''}).subscribe(
          r => {
            this.propuestas_terminadas = r as Array <any>;
          },
          e => {
            console.log(e);
            this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
          }
        );

    if(this.service.titlePropuesta && this.service.propuesta_id && this.service.propuesta_id != 0){
      this.titlePropuesta = this.service.titlePropuesta;
      this.propuesta_id = this.service.propuesta_id;

      this.service.getPropuesta_porID({ id: this.propuesta_id }).subscribe(
        r => {
          this.propuestaColaborador = r as Array <any>;
          this.propuestaColaborador = this.propuestaColaborador[0];

          this.rellenarInterfacePropuesta(this.propuestaColaborador);

          // NUEVA OPCION/PROPUESTA
          this.service.getHojaEspecialidades().subscribe(
            r => {
              this.hojaEspecialidades = r;
              this.getProcesoActual();
            },
            e => {
              console.log(e);
              this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
            }
          );

          if(this.propuestaData.tipoEmpleado_id != 1 && (!this.propuestaData.infoextra || this.propuestaData.infoextra == ''))
            this.propuestaData.infoextra =  'Nota: Todo aquella percepcion que este recibiendo mediante nomina sera sujeta a la aplicación del ISR en base lo que marca la ley. '+
                                            'El concepto ingreso por nómina es la cantidad que se verá reflejada en su recibo de nomina mensualmente. '+
                                            'Los vales de despensa serán depositados en tarjeta sodexo. ';

          this.propuestaData.puntoGuia = this.propuestaData.base * (this.propuestaData.aumento + 1);
          this.propuestaData.puntoGuia_n = Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.propuestaData.puntoGuia);
          this.propuestaData.ingresoBruto = this.propuestaData.puntoGuia * (this.propuestaData.porcentaje/100);
          this.propuestaData.ingresoBruto_n = Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.propuestaData.ingresoBruto);
          this.propuestaData.puntualidad = this.propuestaData.ingresoBruto * 0.1055;
          this.propuestaData.puntualidad_n = Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.propuestaData.puntualidad);
          this.propuestaData.asistencia = this.propuestaData.ingresoBruto * 0.1055;
          this.propuestaData.asistencia_n = Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.propuestaData.asistencia);
          this.propuestaData.despensa = 1154.64;
          this.propuestaData.despensa_n = Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.propuestaData.despensa);
          this.propuestaData.fondoAhorro = this.propuestaData.ingresoBruto * 0.04;
          this.propuestaData.fondoAhorro_n = Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.propuestaData.fondoAhorro);

          this.propuestaData.salarioBruto = this.propuestaData.ingresoBruto +
                                            this.propuestaData.puntualidad +
                                            this.propuestaData.asistencia +
                                            this.propuestaData.despensa +
                                            this.propuestaData.fondoAhorro;
          this.propuestaData.salarioBruto_n = Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.propuestaData.salarioBruto);

          // PROPUESTA ACTUAL
          this.propuestaData.ingreso_asistencia_puntualidad = this.propuestaData.ingresoBruto + this.propuestaData.asistencia + this.propuestaData.puntualidad;
          this.propuestaData.ingreso_asistencia_puntualidad_n = Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.propuestaData.ingreso_asistencia_puntualidad);

          this.propuestaData.costoNomina = this.propuestaData.salarioBruto * 1.4;
          this.propuestaData.costoNomina_n = Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.propuestaData.costoNomina);


          // PROPUESTA #NUMERO
          this.service.getPropuestaDefinitiva({ propuestaId: this.propuestaData.id, sucursal: this.propuestaData.sucursal }).subscribe(
            r => {
              this.info_def = r;
              this.rellenarInterfaceInfoDefinitiva();
            },
            e => {
              console.log(e);
              this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
            }
          );
        },
        e => {
          console.log(e);
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        }
      );
    }

    // }else
    //   this.router.navigate(['tabs/area/capitalhumano']).then(() => {
    //     window.location.reload();
    //   });

  }

  // Rellena los datos de la propuesta en propuestaData
  rellenarInterfacePropuesta(data: any){
    this.propuestaData.id = this.propuesta_id;

    this.propuestaData.nombre_comp = data.nombre_comp ? data.nombre_comp : '';
    this.propuestaData.id_colaborador = data.id_colaborador;
    this.propuestaData.nombres = data.nombres ? data.nombres : '';
    this.propuestaData.apellido_p = data.apellido_p ? data.apellido_p : '';
    this.propuestaData.apellido_m = data.apellido_m ? data.apellido_m : '';
    this.propuestaData.tipo_empleado = data.tipo_empleado;
    this.propuestaData.puesto = data.puesto;
    this.propuestaData.sucursal = data.sucursal;
    this.propuestaData.depto = data.depto;
    //this.propuestaData.fecha = data.fecha;
    //this.propuestaData.contrato = data.contrato;
    //this.propuestaData.pago = data.pago;
    this.propuestaData.infoextra = data.infoextra ? data.infoextra : '';
    this.propuestaData.estado = data.estado;
    //this.propuestaData.fecha_inicio = data.fecha_inicio;
    //this.propuestaData.tmp_sueldo = data.tmp_sueldo;
    this.propuestaData.tmp_sueldo = data.tmp_sueldo ? data.tmp_sueldo : 0;
    this.propuestaData.creador = data.creador;
    this.propuestaData.tipoEmpleado_id = data.tipoEmpleado_id;
    this.propuestaData.contrato = data.contrato ? data.contrato : '';
    this.propuestaData.pago = data.pago ? data.pago : '';
    this.propuestaData.fecha = data.fecha;
    this.propuestaData.fecha_inicio = data.fecha_inicio ? data.fecha_inicio : '';
    this.propuestaData.sucursal_n = data.sucursal_n;
    this.propuestaData.tipoEmpleado_desc = data.tipoEmpleado_desc ? data.tipoEmpleado_desc : '';
    this.propuestaData.area_n = data.area_n ? data.area_n : '';
    this.propuestaData.puesto_n = data.puesto_n ? data.puesto_n : '';
    this.propuestaData.codigo_region = data.codigo_region ? data.codigo_region : '';
    this.propuestaData.region = data.region;
    this.propuestaData.id_sucursal = data.id_sucursal;
    this.propuestaData.tipo_empleado2 = data.tipo_empleado2;
    this.propuestaData.id_departamentos = data.id_departamentos;
    this.propuestaData.departamentos_desc = data.departamentos_desc ? data.departamentos_desc : '';
    this.propuestaData.departamentos_desc2 = data.departamentos_desc2 ? data.departamentos_desc2 : '';
    this.propuestaData.id_puesto = data.id_puesto;
    this.propuestaData.tipoEmpleado_desc2 = data.tipoEmpleado_desc2 ? data.tipoEmpleado_desc2 : '';
    this.propuestaData.puesto_n2 = data.puesto_n2 ? data.puesto_n2 : '';
    this.propuestaData.sucursal_n2 = data.sucursal_n2 ? data.sucursal_n2 : '';
    this.propuestaData.id_region = data.id_region;
    this.propuestaData.tabulador_id = data.tabulador_id;
    this.propuestaData.tab_nivel = data.tab_nivel;
    this.propuestaData.porcentaje = data.porcentaje;
    this.propuestaData.porcentaje_n = new Intl.NumberFormat('en-ES', { style: 'percent', maximumFractionDigits: 2 }).format(this.propuestaData.porcentaje / 100);
    //this.propuestaData.hoja = data.hoja;
    this.propuestaData.aumento = data.aumento;
    this.propuestaData.hoja = data.hoja ? data.hoja : '';
    this.propuestaData.posicion_apoyo = data.posicion_apoyo ? data.posicion_apoyo : '';
    this.propuestaData.categoria = data.categoria ? data.categoria : '';
    this.propuestaData.fechatb = data.fechatb ? data.fechatb : '';
    this.propuestaData.base = data.base;
  }

  // Rellena los datos de la propuesta(s) definitiva
  rellenarInterfaceInfoDefinitiva(){
    var contador = 0;
    this.info_def.forEach((data:any) => {
      if(data.statust == 0)
        contador++;
      else{
        var cant = this.infoDefinitiva.length;

        var base = data.base ? data.base : 0;
        var aumento = (data.aumento ? data.aumento : 0) + 1;
        var puntoGuia = base * aumento;
        var ingresoBruto = puntoGuia * (data.porcentaje > 0 ? data.porcentaje / 100 : 0);
        var puntualidad = 0, asistencia = 0, despensa = 0, fondoAhorro = 0;
        var crecimiento = data.crecimiento ? data.crecimiento : 0;

        if(data.posicion_apoyo != 'BECARIO' && this.propuestaData.tipoEmpleado_id != 1){
          puntualidad = ingresoBruto * 0.1055;
          asistencia = ingresoBruto * 0.1055;
          despensa = 1154.64;
          fondoAhorro = ingresoBruto * 0.04;
        }

        var ingresoBrutoPremio =  ingresoBruto +
                                  puntualidad +
                                  asistencia;
        var subTotal =  ingresoBruto +
                        puntualidad +
                        asistencia +
                        despensa +
                        fondoAhorro;

        if(data.statust != 2){
          crecimiento = (this.propuestaData.ingresoBruto + this.propuestaData.puntualidad + this.propuestaData.asistencia) != 0 ?
                              ( ( (ingresoBruto + puntualidad + asistencia) / (this.propuestaData.ingresoBruto + this.propuestaData.puntualidad + this.propuestaData.asistencia) ) - 1) * 100 : 0;
        }

        this.infoDefinitiva.push ({
          numeroPropuesta: contador+cant+1,
          propuestaID: data.idprop,
          status: data.statust,
          tabID: data.tab_id,
          nivelTab: data.nivel,
          porcentaje: data.porcentaje ? data.porcentaje : 0,
          porcentaje_n: new Intl.NumberFormat('en-ES', { style: 'percent', maximumFractionDigits: 2 }).format(data.porcentaje > 0 ? data.porcentaje / 100 : 0),
          fechaTab: data.fecha ? data.fecha : '',
          hoja: data.hoja ? data.hoja : '',
          posicionApoyo: data.posicion_apoyo ? data.posicion_apoyo : '',
          categoria: data.categoria ? data.categoria : '',
          base: base,
          base_n: new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(base),
          aumento: aumento,
          puntoGuia: puntoGuia,
          puntoGuia_n: new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(puntoGuia),
          ingresoBruto: ingresoBruto,
          ingresoBruto_n: new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(ingresoBruto),
          puntualidad: puntualidad,
          puntualidad_n: new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(puntualidad),
          asistencia: asistencia,
          asistencia_n: new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(asistencia),
          despensa: despensa,
          despensa_n: new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(despensa),
          fondoAhorro: fondoAhorro,
          fondoAhorro_n: new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(fondoAhorro),
          ingresoBrutoPremio: ingresoBrutoPremio,
          ingresoBrutoPremio_n: new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(ingresoBrutoPremio),
          subTotal: subTotal,
          subTotal_n: new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(subTotal),
          crecimiento: crecimiento,
          crecimiento_n: new Intl.NumberFormat('en-ES', { style: 'percent', maximumFractionDigits: 2 }).format(crecimiento!=0 ? crecimiento / 100 : 0),
          costoNomina_n: new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(subTotal*1.4)
        });

        this.definitvaPropuestasB[this.infoDefinitiva.length] = false;
      }
    });
  }

  // Genera un PDF al documento de propuesta definitiva
  async generatePDF(tipo: string) {
    switch(tipo){
      case 'Propuesta Definitiva':
        this.service.generatePropuestaSalarialDefinitivaPDF({ tipo: 1006,
                                                              pdf: this.propuestaData.id,
                                                              te: this.propuestaData.tipoEmpleado_id }).subscribe(
          r => {
            let url = window.URL.createObjectURL(r);
            window.open(url);
          },
          e => {
            console.log(e);
          }
        );
        break;
      case 'Propuesta PDF T1':
        this.service.generatePropuestaSalarialDefinitivaPDF({ tipo: 1006,
                                                              pdf: this.propuestaData.id,
                                                              te: 1 }).subscribe(
          r => {
            let url = window.URL.createObjectURL(r);
            window.open(url);
          },
          e => {
            console.log(e);
          }
        );
        break;
    }
  }

  /////////////////////////
  // Información General //
  /////////////////////////

  // Guardar información general
  async btnGuardarInformacion(){
    var id = this.propuestaData.id;
    var tipoEmpleado = this.propuestaData.tipoEmpleado_id;
    var h_infoextra = this.propuestaData.infoextra;
    var temp_sueldobruto = this.propuestaData.tmp_sueldo;
    var h_tipocontrato = this.propuestaData.contrato;
    var fecha = this.propuestaData.fecha_inicio.split('T');
    var h_inicio = fecha[0];

    var flag = false;

    if(tipoEmpleado == 1){
      if(h_inicio){
        if(h_tipocontrato)
          flag = true;
        else
          this.service.createAlert('Indica el tipo de contrato', 'warning');
      }else{
        this.service.createAlert('Indica la fecha de inicio', 'warning');
      }
    }else{
      if(h_inicio)
        flag = true;
      else
        this.service.createAlert('Indica la fecha de inicio', 'warning');
    }

    if(flag){
      let data: Object = {
        id: id,
        tipoEmpleado: tipoEmpleado,
        h_inicio: h_inicio,
        h_tipocontrato: h_tipocontrato,
        h_infoextra: h_infoextra,
        temp_sueldobruto: temp_sueldobruto
      };
      this.service.btnGuardarInformacion(data).subscribe(
        r => {
          if(r == 1){
            this.service.createAlert('Se ha guardado', 'success');
            //location.reload();
          }else
            this.service.createAlert('Error al guardar la información. Intente de nuevo', 'danger');

        },
        e => {
          console.log(e);
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        }
      );

    }
  }
  // Rechaza la solicitud de propuesta salarial
  btnEliminarSolicitud(){
    this.confirmAlert('¿Seguro que quiere eliminar toda la propuesta?', '', {tipo: 101});
  }

  ////////////////////////////
  // Nueva opción/propuesta //
  ////////////////////////////

  // Proceso si ya poseía una propuesta salarial
  async getProcesoActual(){

    this.limpiezaPasos(0);

    // PASOS ESPECIALIDAD
    for (let i = 0; i < this.hojaEspecialidades.length; i++) {
      if(this.hojaEspecialidades[i].hoja == this.propuestaData.hoja && this.hojaEspecialidades[i].fecha == this.propuestaData.fechatb){
        this.especialidadSeleccionada = i;
        break;
      }
    }

    if(this.especialidadSeleccionada){
      this.nuevaPropuesta.hoja = this.hojaEspecialidades[this.especialidadSeleccionada].hoja;
      this.nuevaPropuesta.fecha = this.hojaEspecialidades[this.especialidadSeleccionada].fecha;

      return new Promise((res) =>
        this.service.getHojaPosicionApoyo({ hoja: this.hojaEspecialidades[this.especialidadSeleccionada].hoja }).subscribe(
          r => {
            this.hojaPosicionApoyo = r;

            for (let i = 0; i < this.hojaPosicionApoyo.length; i++) {
              if(this.hojaPosicionApoyo[i].posicion_apoyo == this.propuestaData.posicion_apoyo){
                this.posicionSeleccionada = i;
                break;
              }
            }

          },
          e => {
            console.log(e);
            this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
          }
        ).add(() => {
          if(this.posicionSeleccionada){
            this.nuevaPropuesta.posicion = this.hojaPosicionApoyo[this.posicionSeleccionada].posicion_apoyo;
            this.service.getHojaSucursal_Aumento({  sucursal: this.propuestaData.sucursal,
                                                    hoja: this.hojaEspecialidades[this.especialidadSeleccionada].hoja }).subscribe(
              r => {
                let data: any = r;
                if(data.length)
                  if(data[0].aumento > 0)
                    this.nuevaPropuesta.aumento = data[0].aumento + 1;
                    if(this.posicionSeleccionada){
                      this.service.getHojaCategorias({  hoja: this.hojaEspecialidades[this.especialidadSeleccionada].hoja,
                                                        fecha: this.hojaEspecialidades[this.especialidadSeleccionada].fecha,
                                                        posicion: this.hojaPosicionApoyo[this.posicionSeleccionada].posicion_apoyo }).subscribe(
                        r => {
                          this.hojaCategoria = r;

                          for (let i = 0; i < this.hojaCategoria.length; i++) {
                            let array: any = [];
                            let array2: any = [];
                            array['n1'] = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.hojaCategoria[i].n1*this.nuevaPropuesta.aumento);
                            array['n2'] = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.hojaCategoria[i].n2*this.nuevaPropuesta.aumento);
                            array['n3'] = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.hojaCategoria[i].n3*this.nuevaPropuesta.aumento);
                            array['n4'] = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.hojaCategoria[i].n4*this.nuevaPropuesta.aumento);
                            this.hojaNivel_aumento[i] = array;
                            array2['n1'] = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.hojaCategoria[i].n1)+'*'+this.nuevaPropuesta.aumento;
                            array2['n2'] = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.hojaCategoria[i].n2)+'*'+this.nuevaPropuesta.aumento;
                            array2['n3'] = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.hojaCategoria[i].n3)+'*'+this.nuevaPropuesta.aumento;
                            array2['n4'] = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.hojaCategoria[i].n4)+'*'+this.nuevaPropuesta.aumento;
                            this.hojaNivel_title[i] = array2;
                          }

                          this.nuevaPropuesta.porcentaje = this.propuestaData.porcentaje ? this.propuestaData.porcentaje : 0;
                          this.nuevaPropuesta.categoria = this.propuestaData.categoria ? this.propuestaData.categoria : '';
                          this.nuevaPropuesta.nivel = this.propuestaData.tab_nivel ? this.propuestaData.tab_nivel : 0;

                          this.nivelSeleccionada = this.nuevaPropuesta.nivel;

                          for (let i = 0; i < this.hojaCategoria.length; i++) {
                            if(this.hojaCategoria[i].cat == this.propuestaData.categoria){
                              this.categoriaSeleccionada = i;
                              break;
                            }
                          }

                          switch(this.nivelSeleccionada){
                            case 1:
                                this.nuevaPropuesta.puntoGuia = this.hojaCategoria[this.categoriaSeleccionada].n1 * this.nuevaPropuesta.aumento;
                                this.nuevaPropuesta.base = this.hojaCategoria[this.categoriaSeleccionada].n1;
                              break;
                            case 2:
                                this.nuevaPropuesta.puntoGuia = this.hojaCategoria[this.categoriaSeleccionada].n2 * this.nuevaPropuesta.aumento;
                                this.nuevaPropuesta.base = this.hojaCategoria[this.categoriaSeleccionada].n2;
                              break;
                            case 3:
                                this.nuevaPropuesta.puntoGuia = this.hojaCategoria[this.categoriaSeleccionada].n3 * this.nuevaPropuesta.aumento;
                                this.nuevaPropuesta.base = this.hojaCategoria[this.categoriaSeleccionada].n3;
                              break;
                            case 4:
                                this.nuevaPropuesta.puntoGuia = this.hojaCategoria[this.categoriaSeleccionada].n4 * this.nuevaPropuesta.aumento;
                                this.nuevaPropuesta.base = this.hojaCategoria[this.categoriaSeleccionada].n4;
                              break;
                            default:
                              this.nuevaPropuesta.puntoGuia = 0;
                              this.nuevaPropuesta.base = 0;
                              break;
                          }

                          if(this.nuevaPropuesta.posicion == 'BECARIO' || this.propuestaData.tipoEmpleado_id == 1){
                            this.nuevaPropuesta.ingresoBruto = this.nuevaPropuesta.puntoGuia * (this.nuevaPropuesta.porcentaje / 100);
                            this.nuevaPropuesta.puntualidad = 0;
                            this.nuevaPropuesta.asistencia = 0;
                            this.nuevaPropuesta.despensa = 0;
                            this.nuevaPropuesta.fondoAhorro = 0;
                          }else{
                            this.nuevaPropuesta.ingresoBruto = this.nuevaPropuesta.puntoGuia * (this.nuevaPropuesta.porcentaje / 100);
                            this.nuevaPropuesta.puntualidad = this.nuevaPropuesta.ingresoBruto * 0.1055;
                            this.nuevaPropuesta.asistencia = this.nuevaPropuesta.ingresoBruto * 0.1055;
                            this.nuevaPropuesta.despensa = 1154.64;
                            this.nuevaPropuesta.fondoAhorro = this.nuevaPropuesta.ingresoBruto * 0.04;
                          }

                          this.nuevaPropuesta.salarioBruto =  this.nuevaPropuesta.ingresoBruto +
                                                              this.nuevaPropuesta.puntualidad +
                                                              this.nuevaPropuesta.asistencia +
                                                              this.nuevaPropuesta.despensa +
                                                              this.nuevaPropuesta.fondoAhorro;
                          this.nuevaPropuesta.salarioBruto_aumento = this.nuevaPropuesta.salarioBruto;

                          this.nuevaPropuesta.puntoGuia_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.puntoGuia);
                          this.nuevaPropuesta.ingresoBruto_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.ingresoBruto);
                          this.nuevaPropuesta.puntualidad_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.puntualidad);
                          this.nuevaPropuesta.asistencia_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.asistencia);
                          this.nuevaPropuesta.despensa_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.despensa);
                          this.nuevaPropuesta.fondoAhorro_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.fondoAhorro);
                          this.nuevaPropuesta.salarioBruto_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.salarioBruto);
                          this.nuevaPropuesta.salarioBruto_aumento_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.salarioBruto_aumento);


                        },
                        e => {
                          console.log(e);
                          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
                        },
                        () => {
                          res(true);
                        }
                      );
                    }
              },
              e => {
                console.log(e);
                this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
              }
            );
          }
        })
      );

      /*
      this.service.getHojaPosicionApoyo({ hoja: this.hojaEspecialidades[this.especialidadSeleccionada].hoja }).subscribe(
        r => {
          this.hojaPosicionApoyo = r;

          for (let i = 0; i < this.hojaPosicionApoyo.length; i++) {
            if(this.hojaPosicionApoyo[i].posicion_apoyo == this.propuestaData.posicion_apoyo){
              this.posicionSeleccionada = i;
              break;
            }
          }

          if(this.posicionSeleccionada){
            this.nuevaPropuesta.posicion = this.hojaPosicionApoyo[this.posicionSeleccionada].posicion_apoyo;
            this.service.getHojaSucursal_Aumento({  sucursal: this.propuestaData.sucursal,
                                                    hoja: this.hojaEspecialidades[this.especialidadSeleccionada].hoja }).subscribe(
              r => {
                let data: any = r;
                if(data.length)
                  if(data[0].aumento > 0)
                    this.nuevaPropuesta.aumento = data[0].aumento + 1;
              },
              e => {
                console.log(e);
                this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
              }
            );

            this.service.getHojaCategorias({  hoja: this.hojaEspecialidades[this.especialidadSeleccionada].hoja,
                                              fecha: this.hojaEspecialidades[this.especialidadSeleccionada].fecha,
                                              posicion: this.hojaPosicionApoyo[this.posicionSeleccionada].posicion_apoyo }).subscribe(
              r => {
                this.hojaCategoria = r;

                for (let i = 0; i < this.hojaCategoria.length; i++) {
                  let array: Array<any> = [];
                  let array2: Array<any> = [];
                  array['n1'] = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.hojaCategoria[i].n1*this.nuevaPropuesta.aumento);
                  array['n2'] = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.hojaCategoria[i].n2*this.nuevaPropuesta.aumento);
                  array['n3'] = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.hojaCategoria[i].n3*this.nuevaPropuesta.aumento);
                  array['n4'] = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.hojaCategoria[i].n4*this.nuevaPropuesta.aumento);
                  this.hojaNivel_aumento[i] = array;
                  array2['n1'] = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.hojaCategoria[i].n1)+'*'+this.nuevaPropuesta.aumento;
                  array2['n2'] = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.hojaCategoria[i].n2)+'*'+this.nuevaPropuesta.aumento;
                  array2['n3'] = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.hojaCategoria[i].n3)+'*'+this.nuevaPropuesta.aumento;
                  array2['n4'] = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.hojaCategoria[i].n4)+'*'+this.nuevaPropuesta.aumento;
                  this.hojaNivel_title[i] = array2;
                }

                this.nuevaPropuesta.porcentaje = this.propuestaData.porcentaje ? this.propuestaData.porcentaje : 0;
                this.nuevaPropuesta.categoria = this.propuestaData.categoria ? this.propuestaData.categoria : null;
                this.nuevaPropuesta.nivel = this.propuestaData.tab_nivel ? this.propuestaData.tab_nivel : null;

                this.nivelSeleccionada = this.nuevaPropuesta.nivel;

                for (let i = 0; i < this.hojaCategoria.length; i++) {
                  if(this.hojaCategoria[i].cat == this.propuestaData.categoria){
                    this.categoriaSeleccionada = i;
                    break;
                  }
                }

                switch(this.nivelSeleccionada){
                  case 1:
                      this.nuevaPropuesta.puntoGuia = this.hojaCategoria[this.categoriaSeleccionada].n1 * this.nuevaPropuesta.aumento;
                      this.nuevaPropuesta.base = this.hojaCategoria[this.categoriaSeleccionada].n1;
                    break;
                  case 2:
                      this.nuevaPropuesta.puntoGuia = this.hojaCategoria[this.categoriaSeleccionada].n2 * this.nuevaPropuesta.aumento;
                      this.nuevaPropuesta.base = this.hojaCategoria[this.categoriaSeleccionada].n2;
                    break;
                  case 3:
                      this.nuevaPropuesta.puntoGuia = this.hojaCategoria[this.categoriaSeleccionada].n3 * this.nuevaPropuesta.aumento;
                      this.nuevaPropuesta.base = this.hojaCategoria[this.categoriaSeleccionada].n3;
                    break;
                  case 4:
                      this.nuevaPropuesta.puntoGuia = this.hojaCategoria[this.categoriaSeleccionada].n4 * this.nuevaPropuesta.aumento;
                      this.nuevaPropuesta.base = this.hojaCategoria[this.categoriaSeleccionada].n4;
                    break;
                  default:
                    this.nuevaPropuesta.puntoGuia = 0;
                    this.nuevaPropuesta.base = 0;
                    break;
                }

                if(this.nuevaPropuesta.posicion == 'BECARIO' || this.propuestaData.tipoEmpleado_id == 1){
                  this.nuevaPropuesta.ingresoBruto = this.nuevaPropuesta.puntoGuia * (this.nuevaPropuesta.porcentaje / 100);
                  this.nuevaPropuesta.puntualidad = 0;
                  this.nuevaPropuesta.asistencia = 0;
                  this.nuevaPropuesta.despensa = 0;
                  this.nuevaPropuesta.fondoAhorro = 0;
                }else{
                  this.nuevaPropuesta.ingresoBruto = this.nuevaPropuesta.puntoGuia * (this.nuevaPropuesta.porcentaje / 100);
                  this.nuevaPropuesta.puntualidad = this.nuevaPropuesta.ingresoBruto * 0.1055;
                  this.nuevaPropuesta.asistencia = this.nuevaPropuesta.ingresoBruto * 0.1055;
                  this.nuevaPropuesta.despensa = 1154.64;
                  this.nuevaPropuesta.fondoAhorro = this.nuevaPropuesta.ingresoBruto * 0.04;
                }

                this.nuevaPropuesta.salarioBruto =  this.nuevaPropuesta.ingresoBruto +
                                                    this.nuevaPropuesta.puntualidad +
                                                    this.nuevaPropuesta.asistencia +
                                                    this.nuevaPropuesta.despensa +
                                                    this.nuevaPropuesta.fondoAhorro;
                this.nuevaPropuesta.salarioBruto_aumento = this.nuevaPropuesta.salarioBruto;

                this.nuevaPropuesta.puntoGuia_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.puntoGuia);
                this.nuevaPropuesta.ingresoBruto_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.ingresoBruto);
                this.nuevaPropuesta.puntualidad_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.puntualidad);
                this.nuevaPropuesta.asistencia_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.asistencia);
                this.nuevaPropuesta.despensa_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.despensa);
                this.nuevaPropuesta.fondoAhorro_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.fondoAhorro);
                this.nuevaPropuesta.salarioBruto_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.salarioBruto);
                this.nuevaPropuesta.salarioBruto_aumento_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.salarioBruto_aumento);


              },
              e => {
                console.log(e);
                this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
              }
            );
          }
        },
        e => {
          console.log(e);
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        }
      );
      */
    }

  }

  // Pasos de la propuesta:
  // Seleccionaste una especialidad
  async selectEspecialidad_HojaFecha(hoja: string, fecha: string, index: number){
    var flag = false;

    if(index != null){
      this.especialidadSeleccionada = index;
      flag = true;
    }else{
      for (let i = 0; i < this.hojaEspecialidades.length; i++) {
        if(this.hojaEspecialidades[i].hoja == hoja && this.hojaEspecialidades[i].fecha == fecha){
          this.especialidadSeleccionada = i;
          flag = true;
          break;
        }
      }
    }

    this.limpiezaPasos(0);

    if(flag){
      this.nuevaPropuesta.hoja = this.hojaEspecialidades[this.especialidadSeleccionada].hoja;
      this.nuevaPropuesta.fecha = this.hojaEspecialidades[this.especialidadSeleccionada].fecha;
      this.service.getHojaPosicionApoyo({ hoja: this.hojaEspecialidades[this.especialidadSeleccionada].hoja }).subscribe(
        r => {
          this.hojaPosicionApoyo = r;
        },
        e => {
          console.log(e);
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        }
      );
    }

  }

  // Seleccionaste un apoyo
  async selectPosicionApoyo(apoyo: string, index: number){
    var flag = false;
    if(index != null){
      this.posicionSeleccionada = index;
      flag = true;
    }else{
      for (let i = 0; i < this.hojaPosicionApoyo.length; i++) {
        if(this.hojaPosicionApoyo[i].posicion_apoyo == apoyo){
          this.posicionSeleccionada = i;
          flag = true;
          break;
        }
      }
    }

    this.limpiezaPasos(1);

    if(flag){
      this.nuevaPropuesta.posicion = this.hojaPosicionApoyo[this.posicionSeleccionada].posicion_apoyo;
      this.service.getHojaSucursal_Aumento({  sucursal: this.propuestaData.sucursal,
                                              hoja: this.hojaEspecialidades[this.especialidadSeleccionada].hoja }).subscribe(
        r => {
          let data: any = r;
          if(data.length)
            if(data[0].aumento > 0)
              this.nuevaPropuesta.aumento = data[0].aumento + 1;
        },
        e => {
          console.log(e);
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        }
      );

      this.service.getHojaCategorias({  hoja: this.hojaEspecialidades[this.especialidadSeleccionada].hoja,
                                        fecha: this.hojaEspecialidades[this.especialidadSeleccionada].fecha,
                                        posicion: this.hojaPosicionApoyo[this.posicionSeleccionada].posicion_apoyo }).subscribe(
        r => {
          this.hojaCategoria = r;

          for (let i = 0; i < this.hojaCategoria.length; i++) {
            let array: any = [];
            let array2: any = [];
            array['n1'] = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.hojaCategoria[i].n1*this.nuevaPropuesta.aumento);
            array['n2'] = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.hojaCategoria[i].n2*this.nuevaPropuesta.aumento);
            array['n3'] = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.hojaCategoria[i].n3*this.nuevaPropuesta.aumento);
            array['n4'] = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.hojaCategoria[i].n4*this.nuevaPropuesta.aumento);
            this.hojaNivel_aumento[i] = array;
            array2['n1'] = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.hojaCategoria[i].n1)+'*'+this.nuevaPropuesta.aumento;
            array2['n2'] = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.hojaCategoria[i].n2)+'*'+this.nuevaPropuesta.aumento;
            array2['n3'] = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.hojaCategoria[i].n3)+'*'+this.nuevaPropuesta.aumento;
            array2['n4'] = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.hojaCategoria[i].n4)+'*'+this.nuevaPropuesta.aumento;
            this.hojaNivel_title[i] = array2;
          }
        },
        e => {
          console.log(e);
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        }
      );


    }
  }

  // Seleccionaste una categoria y/o nivel
  selectCategoriaNivel(categoriaSeleccionada: number, nivelSelect: number){
    this.limpiezaPasos(2);

    this.nuevaPropuesta.categoria = categoriaSeleccionada != 0 ? this.hojaCategoria[categoriaSeleccionada].cat : null ;
    this.nuevaPropuesta.nivel = nivelSelect != 0 ? categoriaSeleccionada != 0 ? nivelSelect : 0 : 0 ;

    switch(this.nuevaPropuesta.nivel){
      case 1:
          this.nuevaPropuesta.puntoGuia = this.hojaCategoria[categoriaSeleccionada].n1 * this.nuevaPropuesta.aumento;
          this.nuevaPropuesta.base = this.hojaCategoria[categoriaSeleccionada].n1;
        break;
      case 2:
          this.nuevaPropuesta.puntoGuia = this.hojaCategoria[categoriaSeleccionada].n2 * this.nuevaPropuesta.aumento;
          this.nuevaPropuesta.base = this.hojaCategoria[categoriaSeleccionada].n2;
        break;
      case 3:
          this.nuevaPropuesta.puntoGuia = this.hojaCategoria[categoriaSeleccionada].n3 * this.nuevaPropuesta.aumento;
          this.nuevaPropuesta.base = this.hojaCategoria[categoriaSeleccionada].n3;
        break;
      case 4:
          this.nuevaPropuesta.puntoGuia = this.hojaCategoria[categoriaSeleccionada].n4 * this.nuevaPropuesta.aumento;
          this.nuevaPropuesta.base = this.hojaCategoria[categoriaSeleccionada].n4;
        break;
      default:
        this.nuevaPropuesta.puntoGuia = 0;
        this.nuevaPropuesta.base = 0;
        break;
    }


    if(this.nuevaPropuesta.posicion == 'BECARIO' || this.propuestaData.tipoEmpleado_id == 1){
      this.nuevaPropuesta.ingresoBruto = this.nuevaPropuesta.puntoGuia * (this.nuevaPropuesta.porcentaje / 100);
      this.nuevaPropuesta.puntualidad = 0;
      this.nuevaPropuesta.asistencia = 0;
      this.nuevaPropuesta.despensa = 0;
      this.nuevaPropuesta.fondoAhorro = 0;
    }else{
      this.nuevaPropuesta.ingresoBruto = this.nuevaPropuesta.puntoGuia * (this.nuevaPropuesta.porcentaje / 100);
      this.nuevaPropuesta.puntualidad = this.nuevaPropuesta.ingresoBruto * 0.1055;
      this.nuevaPropuesta.asistencia = this.nuevaPropuesta.ingresoBruto * 0.1055;
      this.nuevaPropuesta.despensa = 1154.64;
      this.nuevaPropuesta.fondoAhorro = this.nuevaPropuesta.ingresoBruto * 0.04;
    }

    this.nuevaPropuesta.salarioBruto =  this.nuevaPropuesta.ingresoBruto +
                                        this.nuevaPropuesta.puntualidad +
                                        this.nuevaPropuesta.asistencia +
                                        this.nuevaPropuesta.despensa +
                                        this.nuevaPropuesta.fondoAhorro;
    this.nuevaPropuesta.salarioBruto_aumento = this.nuevaPropuesta.salarioBruto;

    this.nuevaPropuesta.puntoGuia_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.puntoGuia);
    this.nuevaPropuesta.ingresoBruto_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.ingresoBruto);
    this.nuevaPropuesta.puntualidad_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.puntualidad);
    this.nuevaPropuesta.asistencia_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.asistencia);
    this.nuevaPropuesta.despensa_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.despensa);
    this.nuevaPropuesta.fondoAhorro_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.fondoAhorro);
    this.nuevaPropuesta.salarioBruto_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.salarioBruto);
    this.nuevaPropuesta.salarioBruto_aumento_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.salarioBruto_aumento);

  }

  // Añadiste el porcentaje
  selectPorcentaje(porcentaje: any){
    this.nuevaPropuesta.porcentaje = porcentaje ? ( porcentaje > 100 ? 100 : ( porcentaje < 0 ? 0 : porcentaje ) ) : 0;


    if(this.nuevaPropuesta.posicion == 'BECARIO' || this.propuestaData.tipoEmpleado_id == 1){
      this.nuevaPropuesta.ingresoBruto = this.nuevaPropuesta.puntoGuia * (this.nuevaPropuesta.porcentaje / 100);
      this.nuevaPropuesta.puntualidad = 0;
      this.nuevaPropuesta.asistencia = 0;
      this.nuevaPropuesta.despensa = 0;
      this.nuevaPropuesta.fondoAhorro = 0;
    }else{
      this.nuevaPropuesta.ingresoBruto = this.nuevaPropuesta.puntoGuia * (this.nuevaPropuesta.porcentaje / 100);
      this.nuevaPropuesta.puntualidad = this.nuevaPropuesta.ingresoBruto * 0.1055;
      this.nuevaPropuesta.asistencia = this.nuevaPropuesta.ingresoBruto * 0.1055;
      this.nuevaPropuesta.despensa = 1154.64;
      this.nuevaPropuesta.fondoAhorro = this.nuevaPropuesta.ingresoBruto * 0.04;
    }

    this.nuevaPropuesta.salarioBruto =  this.nuevaPropuesta.ingresoBruto +
                                        this.nuevaPropuesta.puntualidad +
                                        this.nuevaPropuesta.asistencia +
                                        this.nuevaPropuesta.despensa +
                                        this.nuevaPropuesta.fondoAhorro;
    this.nuevaPropuesta.salarioBruto_aumento = this.nuevaPropuesta.salarioBruto;

    this.nuevaPropuesta.puntoGuia_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.puntoGuia);
    this.nuevaPropuesta.ingresoBruto_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.ingresoBruto);
    this.nuevaPropuesta.puntualidad_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.puntualidad);
    this.nuevaPropuesta.asistencia_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.asistencia);
    this.nuevaPropuesta.despensa_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.despensa);
    this.nuevaPropuesta.fondoAhorro_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.fondoAhorro);
    this.nuevaPropuesta.salarioBruto_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.salarioBruto);
    this.nuevaPropuesta.salarioBruto_aumento_n = new Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(this.nuevaPropuesta.salarioBruto_aumento);

  }

  // Limpieza de valores al realizar algun cambio en los pasos
  limpiezaPasos(parte: number){
    switch(parte){
      case 0:
        // SELECT HOJA/ESPECIALIDAD
        this.nuevaPropuesta.hoja = '';
        this.nuevaPropuesta.fecha = '';
        this.hojaPosicionApoyo = [];
        this.posicionSeleccionada = 0;

        // SELECT POSICION, CATEGORIA, NIVEL
        this.nuevaPropuesta.posicion = '';
        this.nuevaPropuesta.aumento = 1;
        this.hojaNivel_aumento = [];
        this.hojaNivel_title = [];
        this.hojaCategoria = [];
        this.categoriaSeleccionada = 0;
        this.nivelSeleccionada = 0;

        // NUEVOS DATOS NUEVAPROPUESTA
        this.nuevaPropuesta.porcentaje = 0;
        this.nuevaPropuesta.puntoGuia = 0;
        this.nuevaPropuesta.base = 0;

        this.nuevaPropuesta.ingresoBruto = 0;
        this.nuevaPropuesta.puntualidad = 0;
        this.nuevaPropuesta.asistencia = 0;
        this.nuevaPropuesta.despensa = 0;
        this.nuevaPropuesta.fondoAhorro = 0;
        this.nuevaPropuesta.salarioBruto = 0;
        this.nuevaPropuesta.salarioBruto_aumento = 0;
        this.nuevaPropuesta.puntoGuia_n = '';
        this.nuevaPropuesta.ingresoBruto_n = '';
        this.nuevaPropuesta.puntualidad_n = '';
        this.nuevaPropuesta.asistencia_n = '';
        this.nuevaPropuesta.despensa_n = '';
        this.nuevaPropuesta.fondoAhorro_n = '';
        this.nuevaPropuesta.salarioBruto_n = '';
        this.nuevaPropuesta.salarioBruto_aumento_n = '';

        break;
      case 1:

        // SELECT POSICION, CATEGORIA, NIVEL
        this.nuevaPropuesta.posicion = '';
        this.nuevaPropuesta.aumento = 1;
        this.hojaNivel_aumento = [];
        this.hojaNivel_title = [];
        this.hojaCategoria = [];
        this.categoriaSeleccionada = 0;
        this.nivelSeleccionada = 0;

        // NUEVOS DATOS NUEVAPROPUESTA
        this.nuevaPropuesta.puntoGuia = 0;
        this.nuevaPropuesta.base = 0;

        this.nuevaPropuesta.ingresoBruto = 0;
        this.nuevaPropuesta.puntualidad = 0;
        this.nuevaPropuesta.asistencia = 0;
        this.nuevaPropuesta.despensa = 0;
        this.nuevaPropuesta.fondoAhorro = 0;
        this.nuevaPropuesta.salarioBruto = 0;
        this.nuevaPropuesta.salarioBruto_aumento = 0;
        this.nuevaPropuesta.puntoGuia_n = '';
        this.nuevaPropuesta.ingresoBruto_n = '';
        this.nuevaPropuesta.puntualidad_n = '';
        this.nuevaPropuesta.asistencia_n = '';
        this.nuevaPropuesta.despensa_n = '';
        this.nuevaPropuesta.fondoAhorro_n = '';
        this.nuevaPropuesta.salarioBruto_n = '';
        this.nuevaPropuesta.salarioBruto_aumento_n = '';
        break;
      case 2:

        // NUEVOS DATOS NUEVAPROPUESTA
        this.nuevaPropuesta.puntoGuia = 0;
        this.nuevaPropuesta.base = 0;

        this.nuevaPropuesta.ingresoBruto = 0;
        this.nuevaPropuesta.puntualidad = 0;
        this.nuevaPropuesta.asistencia = 0;
        this.nuevaPropuesta.despensa = 0;
        this.nuevaPropuesta.fondoAhorro = 0;
        this.nuevaPropuesta.salarioBruto = 0;
        this.nuevaPropuesta.salarioBruto_aumento = 0;
        this.nuevaPropuesta.puntoGuia_n = '';
        this.nuevaPropuesta.ingresoBruto_n = '';
        this.nuevaPropuesta.puntualidad_n = '';
        this.nuevaPropuesta.asistencia_n = '';
        this.nuevaPropuesta.despensa_n = '';
        this.nuevaPropuesta.fondoAhorro_n = '';
        this.nuevaPropuesta.salarioBruto_n = '';
        this.nuevaPropuesta.salarioBruto_aumento_n = '';
        break;
      default:
        this.especialidadSeleccionada = 0;

        // SELECT HOJA/ESPECIALIDAD
        this.nuevaPropuesta.hoja = '';
        this.nuevaPropuesta.fecha = '';
        this.hojaPosicionApoyo = [];
        this.posicionSeleccionada = 0;

        // SELECT POSICION, CATEGORIA, NIVEL
        this.nuevaPropuesta.posicion = '';
        this.nuevaPropuesta.aumento = 1;
        this.hojaNivel_aumento = [];
        this.hojaNivel_title = [];
        this.hojaCategoria = [];
        this.categoriaSeleccionada = 0;
        this.nivelSeleccionada = 0;

        // NUEVOS DATOS NUEVAPROPUESTA
        this.nuevaPropuesta.ingresoBruto = 0;
        this.nuevaPropuesta.puntualidad = 0;
        this.nuevaPropuesta.asistencia = 0;
        this.nuevaPropuesta.despensa = 0;
        this.nuevaPropuesta.fondoAhorro = 0;
        this.nuevaPropuesta.salarioBruto = 0;
        this.nuevaPropuesta.salarioBruto_aumento = 0;
        this.nuevaPropuesta.puntoGuia_n = '';
        this.nuevaPropuesta.ingresoBruto_n = '';
        this.nuevaPropuesta.puntualidad_n = '';
        this.nuevaPropuesta.asistencia_n = '';
        this.nuevaPropuesta.despensa_n = '';
        this.nuevaPropuesta.fondoAhorro_n = '';
        this.nuevaPropuesta.salarioBruto_n = '';
        this.nuevaPropuesta.salarioBruto_aumento_n = '';
        break;
    }
  }

  // Agregar propuesta
  async btnAplicarPropuesta(){
    var flag = false;

    if(this.nuevaPropuesta.hoja){
      if(this.nuevaPropuesta.posicion){
        if(this.nuevaPropuesta.categoria){
          if(this.nuevaPropuesta.nivel){
            if(this.nuevaPropuesta.porcentaje)
              flag = true;
            else
              this.service.createAlert('Indica el porcentaje', 'danger');
          }else
            this.service.createAlert('Indica el nivel', 'danger');
        }else
          this.service.createAlert('Indica la categoría', 'danger');
      }else
        this.service.createAlert('Indica el apoyo', 'danger');
    }else
      this.service.createAlert('Indica la hoja', 'danger');


    if(flag){
      let data = {
        cabeza: this.propuestaData.id,
        hoja: this.nuevaPropuesta.hoja,
        fecha: this.nuevaPropuesta.fecha,
        posicion: this.nuevaPropuesta.posicion,
        categoria: this.nuevaPropuesta.categoria,
        nivel: this.nuevaPropuesta.nivel,
        porcentaje: this.nuevaPropuesta.porcentaje
      };

      let data2 = {
        cabeza: 0,
        tab_id: 0,
        nivel: 0,
        porcentaje: 0
      }

      return new Promise((res) => {
        this.service.getTabId_niveles(data).subscribe(
          (r:any) => {
            let id: any = r[0].id;

            data2 = {
              cabeza: this.propuestaData.id,
              tab_id: id,
              nivel: this.nuevaPropuesta.nivel,
              porcentaje: this.nuevaPropuesta.porcentaje
            }
          },
          e => {

          }
        ).add(() => {
          this.service.btnNuevaPropuesta(data2).subscribe(
            r => {
              if(r){
                this.service.createAlert('Se ha creado la nueva propuesta', 'success');
                this.router.navigate(['tabs/area/capitalhumano']);
              }else
                this.service.createAlert('Error al guardar la información. Intente de nuevo', 'danger');
            },
            e => {
              console.log(e);
              this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
            },
            () => {
              res(true);
            }
          );
        });
      });
      this.service.getTabId_niveles(data).subscribe(
        (r:any) => {
          let id: any = r[0].id;

          let data = {
            cabeza: this.propuestaData.id,
            tab_id: id,
            nivel: this.nuevaPropuesta.nivel,
            porcentaje: this.nuevaPropuesta.porcentaje
          }
          this.service.btnNuevaPropuesta(data).subscribe(
            r => {
              if(r){
                this.service.createAlert('Se ha creado la nueva propuesta', 'success');
                this.router.navigate(['tabs/area/capitalhumano']);
              }else
                this.service.createAlert('Error al guardar la información. Intente de nuevo', 'danger');
            },
            e => {
              console.log(e);
              this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
            }
          );

        },
        e => {
          console.log(e);
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        }
      );
    }
  }

  //////////////////////////
  // Propuesta definitiva //
  //////////////////////////

  // Rechaza la propuesta sugerida
  btnEliminarPropuesta(index: number){
    this.confirmAlert('¿Eliminar propuesta?', 'danger', {tipo: 102, index: index});
  }

  // Actualiza las propuestas como rechazadas y la definitiva como
  // aceptada
  btnDefinitiva(index: number){
    this.confirmAlert('¿Seleccionar como definitiva?', 'medium', {tipo: 103, index: index});
  }

  // Actualiza los datos del colaborador en la tabla maestra colaboradores
  btnActualizarColaborador(){
    // Empleado temporal
    if(this.propuestaData.tipoEmpleado_id == 1){
      if(this.propuestaData.fecha_inicio && this.propuestaData.fecha_inicio != null && this.propuestaData.fecha_inicio != ''){
        if(this.propuestaData.contrato && this.propuestaData.contrato != null && this.propuestaData.contrato != ''){
          if(this.propuestaData.tmp_sueldo && this.propuestaData.tmp_sueldo != null && this.propuestaData.tmp_sueldo > 0){
            this.confirmAlert('¿Seguro que quiere actualizar los datos maestros del colaborador?', 'medium', {tipo: 104, ingresoBruto: 0});
          }else
            this.service.createAlert('Indique el sueldo bruto semanal', 'warning');
        }else
          this.service.createAlert('Indique el tipo de contrato', 'warning');
      }else
        this.service.createAlert('Indique la fecha de inicio', 'warning');
    }else{ // Ya existe el empleado en intranet
      if(this.propuestaData.fecha_inicio && this.propuestaData.fecha_inicio != null && this.propuestaData.fecha_inicio != ''){
        this.confirmAlert('¿Seguro que quiere actualizar los datos maestros del colaborador?', 'medium', {tipo: 104, ingresoBruto: this.infoDefinitiva[0].ingresoBruto});
      }else
        this.service.createAlert('Indique la fecha de inicio', 'warning');
    }
  }

  ////////////////////////////

  // Abre las divisiones de:
  // - Información general
  // - Nueva propuesta
  // - Actual propuesta
  // - Propuesta definitiva
  openDiv(data: any){
    switch(data.tipo){
      case 'Informacion General':
        if(this.InformacionGeneral)
          this.InformacionGeneral = false;
        else
          this.InformacionGeneral = true;
        break;
      case 'Nueva Propuesta':
        if(this.NuevaPropuesta)
          this.NuevaPropuesta = false;
        else
          this.NuevaPropuesta = true;
        break;
      case 'Propuesta Actual':
        if(this.PropuestaActual)
          this.PropuestaActual = false;
        else
          this.PropuestaActual = true;
        break;
      case 'Propuesta Definitiva':
        if(this.definitvaPropuestasB[data.index])
          this.definitvaPropuestasB[data.index] = false;
        else
          this.definitvaPropuestasB[data.index] = true;
    }
  }

  //alertas on link
  async confirmAlert(message: string, color: string = '', data: any) {
    const toast = await this.toast.create({
      message: message, color: color, buttons: [
        {
          side: 'end',
          text: 'confirmar',
          handler: () => {
            switch (data.tipo){
              // Elimina desde la raíz la solicitud de propuesta salarial
              case 101:

                this.service.btnEliminarSolicitud({ id: this.propuestaData.id }).subscribe(
                  r => {
                    if(r == 1){
                      this.service.createAlert('Se ha modificado con exito', 'success');
                      this.router.navigate(['tabs/area/capitalhumano']);
                      this.service.segmentCapitalHumano = 'propuestas';
                    }else
                      this.service.createAlert('Error al eliminar la solicitud. Intente de nuevo', 'danger');
                  },
                  e => {
                    console.log(e);
                    this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
                  }
                );

                break;
              // La opción/propuesta es rechazada
              case 102:

                this.service.btnEliminarPropuesta({ id: this.infoDefinitiva[data.index].propuestaID }).subscribe(
                  r => {
                    if(r == 1){
                      this.service.createAlert('Propuesta eliminada', 'success');
                      this.router.navigate(['tabs/area/capitalhumano']);
                      this.service.segmentCapitalHumano = 'propuestas';
                    }else
                      this.service.createAlert('Error al eliminar la propuesta. Intente de nuevo', 'danger');
                  },
                  e => {
                    console.log(e);
                    this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
                  }
                );

                break;
              // Actualiza la información para que las propuestas solicitadas se marquen con estado 0
              // y marcar la definitiva como 2
              case 103:

                this.service.btnAgregarPropuestaDefinitiva({idprop: this.infoDefinitiva[data.index].propuestaID,
                                                            id: this.propuestaData.id,
                                                            crecimiento: this.infoDefinitiva[data.index].crecimiento}).subscribe(
                  r => {
                    switch(r){
                      case 3:
                        this.router.navigate(['tabs/area/capitalhumano']);
                        this.service.segmentCapitalHumano = 'propuestas';
                        break;
                      case 2:
                      case 1:
                      case 0:
                        this.service.createAlert('No se actualizo correctamente (caso: '+r+'). Intente de nuevo', 'danger');
                        break;
                    }
                  },
                  e => {
                    console.log(e);
                    this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
                  }
                );

                break;
              // Actualizar colaborador con la información de la propuesta definitiva
              case 104:

                this.service.btnActualizarColaborador({ id: this.propuestaData.id,
                                                        te: this.propuestaData.tipoEmpleado_id,
                                                        colaborador: this.propuestaData.id_colaborador,
                                                        inicio: this.propuestaData.fecha_inicio,
                                                        ingresoBruto: data.ingresoBruto}).subscribe(
                  r => {
                    var data: any = r;
                    if(this.propuestaData.id_colaborador > 0){
                      if(data.solution == 2){
                        this.service.createAlert('No se pudo actualizar correctamente', 'danger');

                        var resumenLog: Array<string> = [];
                        var resumenCol: Array<string> = [];
                        resumenLog[0] = "Resumen Colaborador Log (No registrado)";
                        resumenCol[0] = "Resumen Actualizacion Colaborador (No actualizado)";
                        if(data.ingreso == 2)
                          resumenLog[1] = '- Ingreso';
                        if(data.te == 2)
                          resumenLog[2] = '- Tipo Emp';
                        if(data.region == 2)
                          resumenLog[3] = '- Region';
                        if(data.depto == 2)
                          resumenLog[4] = '- Departamento';
                        if(data.sucursal == 2)
                          resumenLog[5] = '- Sucursal';
                        if(data.area == 2)
                          resumenLog[6] = '- Area';
                        if(data.puesto == 2)
                          resumenLog[7] = '- Puesto';
                        if(data.colaboradorUpdate == 2)
                          resumenCol[1] = '- Actualizacion de colaborador';
                        if(data.propuestaEstado == 2)
                          resumenCol[2] = '- Estado de Propuesta';

                        if(resumenLog.length > 0) console.log(resumenLog);
                        if(resumenCol.length > 0) console.log(resumenCol);
                      }else{
                        this.service.createAlert('Colaborador actualizado', 'success');
                        this.router.navigate(['tabs/area/capitalhumano']);
                      }
                    }else{
                      if(data.solution == 2){
                        this.service.createAlert('No se pudo actualizar correctamente', 'danger');
                      }else{
                        this.service.createAlert('Colaborador actualizado', 'success');
                        this.router.navigate(['tabs/area/capitalhumano']);
                      }
                    }
                  },
                  e => {
                    console.log(e);
                    this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
                  }
                );

                break;
            }
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

}
