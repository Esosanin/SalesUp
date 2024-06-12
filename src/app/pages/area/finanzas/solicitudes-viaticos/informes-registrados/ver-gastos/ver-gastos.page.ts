import { Component, OnInit, ViewChild } from '@angular/core';
import { FinanzasService } from 'src/app/servicios/finanzas/finanzas.service';
import { InformacionGastos } from 'src/app/model/Finanzas/InformacionGastos';
import {DomSanitizer} from '@angular/platform-browser';

interface informGastos {
  comentario_rechazo: string;
  excedido_comentario: string;
}

@Component({
  selector: 'app-ver-gastos',
  templateUrl: './ver-gastos.page.html',
  styleUrls: ['./ver-gastos.page.scss'],
})

export class VerGastosPage implements OnInit {

  @ViewChild('ModalComentario') ModalComentario: any;

  constructor(private service: FinanzasService, private sanitizer: DomSanitizer) { }

  user_id = parseInt(localStorage.getItem('id_colaborador')!);

  IR_tableGastos: Array<any> = []; // 0 | service.IR_getGastos
  IR_informGastos_comentarios: informGastos = {
    comentario_rechazo: '',
    excedido_comentario: ''
  } // 1 | service.IR_getGastos
  IR_totalSolicitado: any;
  IR_montoTotal: any;
  IR_gastosTotales: Array<any> = []; // 4 | service.IR_getGastos

  IR_permisosOpciones: number = 0; // 1, 3 | service.IR_getGastos
  IR_btnRadio: string = '';

  IR_displayInformacion_gasto: boolean = false;

  // IR_vistaInforme_gastos
  IR_informacion_gastos!: InformacionGastos;

  modal_open: boolean = false;
  modal_comment: string = '';
  btn_acciones: number = 0;

  btn_refrescadorAcciones: boolean = false;

  ngOnInit() {
    this.IR_recargarPagina();
  }

  IR_recargarPagina(){
    this.IR_limpiarVariables();
    this.IR_getGastos();
  }

  /* [Limpieza de variables] */
  IR_limpiarVariables(){
    this.btn_refrescadorAcciones = false;
    this.IR_informacion_gastos = new InformacionGastos();

    this.IR_tableGastos = [];
    this.IR_gastosTotales = [];
    this.IR_btnRadio = '';
    this.IR_informGastos_comentarios = {
      comentario_rechazo: '',
      excedido_comentario: ''
    }
    this.IR_permisosOpciones = 0;
    this.IR_totalSolicitado = '';
    this.IR_montoTotal = '';

    this.IR_displayInformacion_gasto = false;
    this.modal_open = false;
    this.modal_comment = '';
    this.btn_acciones = 0;
  }


  /* [Listado de tipos de gastos] */
  async IR_getGastos(){
    this.service.IR_getGastos({gas_id: sessionStorage.getItem('informe')}).subscribe(
      (r:any) => {

        /* [Listado de tipos de gastos] Rellena el listado */
        this.IR_tableGastos = r[0] as any;

        var total = 0;
        for (let i = 0; i < this.IR_tableGastos.length; i++)
          total+= this.IR_tableGastos[i].gasd_monto;

        this.IR_montoTotal = Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD' }).format(total);

        /*
            [Listado de tipos de gastos]
            Obtención del identificador de la solicitud y utilización de estados en las condiciones
        */
        var gastos = r[1] as any;
        this.IR_informGastos_comentarios.comentario_rechazo = gastos.gas_comentario_rechazo;
        this.IR_informGastos_comentarios.excedido_comentario = gastos.gas_excedido_coment;

        /* [Listado de tipos de gastos] Resultado del total solicitado */
        this.IR_totalSolicitado = r[2].asistente_TOTAL_n;

        /*
            [Listado de tipos de gastos]
            Obtención de identificadores para la utilización en las condiciones
        */
        var personal = r[3] as any;

        /*
          Permiso para la visualización y acción de los botones superiores y inferiores
          y comentarios
            (BI)         : Botón Imprimir
            (BPDF)       : Botón PDF
            (CA)         : Comentarios de Aprobación
            (CR)         : Comentarios de Rechazo
            (BAR_JD)     : Botón Aprobación y Rechazo por parte del Jefe Directo
            (BAR_D_SyJD) : Botón Aprobación y Rechazo Diferente del Solicitante y Jefe Directo del Solicitante

          PERMISOS
              Tipo    |   Relacionados
                1     | (BI), (BPDF), (CA)
                2     | (BI), (CR)
                3     | (BI), (BAR_JD)
                4     | (BI), (BPDF), (CA)
                5     | (BI), (BPDF), (CR)
                6     | (BI), (BPDF), (BAR_JD)
                7     | (BI), (BPDF), (BAR_D_SyJD)
        */

        if(personal.sol_solicitante_colaborador_id == this.user_id){
          // INFORMES APROBADOS
          if(gastos.gas_estado == 2)
            this.IR_permisosOpciones = 1;

            // INFORMES RECHAZADOS
          else if(gastos.gas_estado == 3)
            this.IR_permisosOpciones = 2;

            // INFORMES PENDIENTES AUN SIN APROBAR O RECHAZAR
          else if(gastos.gas_estado == 5 &&
                  personal.sol_jefeDirecto == this.user_id &&
                  gastos.gas_excedido == 1)
            this.IR_permisosOpciones = 3;
        }else{
          // INFORMES APROBADOS
          if(gastos.gas_estado == 2)
            this.IR_permisosOpciones = 4;

          // INFORMES RECHAZADOS
          else if(gastos.gas_estado == 3)
            this.IR_permisosOpciones = 5;

          // INFORMES PENDIENTES AUN SIN APROBAR O RECHAZAR
          else if(gastos.gas_estado == 5) {
            if(gastos.gas_excedido == 1)
              this.IR_permisosOpciones = 6;
            else if(gastos.gas_excedido != 1 &&
                    personal.sol_jefeDirecto != this.user_id)
              this.IR_permisosOpciones = 7;
          }
        }

        /*
            [Listado de tipos de gastos]
            Obtención categoria de tipos de gastos y el monto total de estos.
        */
        this.IR_gastosTotales = r[4] as any;

      },
      e => {
        console.log(e);
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
      }
    );
  }

  // Al seleccionar un radio button se toma "gasd_id"
  async IR_vistaInforme_gastos(){
    this.service.IR_getDetallesGastos({gas_id: this.IR_btnRadio}).subscribe(
      (r:any) => {
        this.IR_informacion_gastos.aprobar_gasto = r[0] as any;
        this.IR_informacion_gastos.asistentes_gasto = r[1] as any;

        var anexos = r[2] as any;
        for (let i = 0; i < anexos.length; i++) {
          var file = String(anexos[i].tur_anexo_nombre).split('.') as any;
          file = file[file.length - 1];
          file =  (
                    file == 'jpg' || file == 'JPG' ||
                    file == 'png' || file == 'PNG' ||
                    file == 'jpeg' || file == 'JPEG'
                  ) ? 1 :
                  ( file == 'pdf' || file == 'PDF') ? 2 :
                  ( file == 'xml' || file == 'XML') ? 3 : 0;
          this.IR_informacion_gastos.anexos_gasto[i] = {
            file: anexos[i].tur_anexo_nombre,
            tipo: Number(file)
          };
        }

        this.IR_informacion_gastos.excepciones_gasto = r[3] as any;
      },
      e => {
        console.log(e);
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
      }
    );
  }

  // Genera el pdf de la solicitud
  async IR_openPDF(){
    let data: any = { sol_id: sessionStorage.getItem('informe'), url: window.location.host};
    this.service.IR_genera_pdf_comprobacion(data).subscribe(
      (r:any) => {
        this.btn_refrescadorAcciones = false;
        let url = window.URL.createObjectURL(r);
        window.open(url);
      },
      e => {
        this.btn_refrescadorAcciones = false;
        console.log(e);
      }
    );
  }

  // PDF visible al usuario
  IR_viewPDF(file: any){
    return this.sanitizer.bypassSecurityTrustResourceUrl("http://intranet.ecn.com.mx:8060/intranet/modulos/ecntur/aprobaciones/Anexos/"+file);
  }

  // Comentario para la acción aprobar o rechazar
  open_comment(value: number){
    this.ModalComentario.onDidDismiss().then(() => this.modal_open = false);
    this.modal_open = true;

    this.modal_comment = '';
    this.btn_acciones = value;
  }

  // Aprobación y rechazo
  async IR_btnAcciones(){
    switch(this.btn_acciones){
      case 1: // Aprobar solicitud
        this.service.IR_gasto_acciones(
          {
            tipo: 1,
            id: sessionStorage.getItem('informe'),
            user: this.user_id,
            comment: this.modal_comment
          }).subscribe(
          r => {
            this.IR_recargarPagina();
            if(r == 1)
              this.service.createAlert('Gasto aprobado', 'success');
            else
              this.service.createAlert('No se actualizo. Intente lo de nuevo.', 'error');
          },
          e => {
            this.IR_recargarPagina();
            console.log(e);
            this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
          }
        );
        break;
      case 2: // Rechazar solicitud
        this.service.IR_gasto_acciones(
          {
            tipo: 2,
            id: sessionStorage.getItem('informe'),
            user: this.user_id,
            comment: this.modal_comment
          }).subscribe(
          r => {
            this.IR_recargarPagina();
            if(r == 1)
              this.service.createAlert('Gasto rechazado', 'success');
            else
              this.service.createAlert('No se actualizo. Intente lo de nuevo.', 'error');
          },
          e => {
            this.IR_recargarPagina();
            console.log(e);
            this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
          }
        );

        break;
      case 3: // Aprobar solicitud por lider
        this.service.IR_gasto_acciones(
          {
            tipo: 3,
            id: sessionStorage.getItem('informe'),
            user: this.user_id,
            comment: this.modal_comment
          }).subscribe(
          r => {
            this.IR_recargarPagina();
            if(r == 1)
              this.service.createAlert('Gasto aprobado', 'success');
            else
              this.service.createAlert('No se actualizo. Intente lo de nuevo.', 'error');
          },
          e => {
            this.IR_recargarPagina();
            console.log(e);
            this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
          }
        );

        break;
      case 4: // Rechazar solicitud por lider
        this.service.IR_gasto_acciones(
          {
            tipo: 4,
            id: sessionStorage.getItem('informe'),
            user: this.user_id,
            comment: this.modal_comment
          }).subscribe(
          r => {
            this.IR_recargarPagina();
            if(r == 1)
              this.service.createAlert('Gasto rechazado', 'success');
            else
              this.service.createAlert('No se actualizo. Intente lo de nuevo.', 'error');
          },
          e => {
            this.IR_recargarPagina();
            console.log(e);
            this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
          }
        );

        break;
    }
  }

}
