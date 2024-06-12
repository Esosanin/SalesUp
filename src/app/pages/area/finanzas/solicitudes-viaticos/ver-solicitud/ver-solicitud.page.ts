import { Component, OnInit, ViewChild } from '@angular/core';
import { FinanzasService } from 'src/app/servicios/finanzas/finanzas.service';
import { SolicitudRegistrada } from 'src/app/model/Finanzas/SolicitudRegistrada';
import { Conceptos } from 'src/app/model/Finanzas/Conceptos';
import { formatCurrency } from '@angular/common';
import { ToastController } from '@ionic/angular';
import { timer } from 'rxjs';

@Component({
  selector: 'app-ver-solicitud',
  templateUrl: './ver-solicitud.page.html',
  styleUrls: ['./ver-solicitud.page.scss'],
})
export class VerSolicitudPage implements OnInit {

  // COMENTARIO AL RETENER/DEPOSITAR
  @ViewChild('ModalComentario') ModalComentario: any;

  btn_tabs: number = 0;
  user_id: string = localStorage.getItem('id_colaborador')!;

  SR_solicitudDetalles!: SolicitudRegistrada;
  SR_conceptos: Array<Conceptos> = [];
  SR_conceptoComidas!: Conceptos;
  SR_conceptoAutobus!: Conceptos;
  SR_conceptoHospedaje!: Conceptos;
  SR_conceptoCasetas!: Conceptos;
  SR_conceptoCombustibles!: Conceptos;
  SR_conceptoTelefonia!: Conceptos;
  SR_conceptoLavanderia!: Conceptos;
  SR_conceptoTaxi!: Conceptos;
  SR_conceptoEstacionamiento!: Conceptos;
  SR_conceptoVarios!: Conceptos;

  SR_conceptoTOTAL: any = '';

  SR_informacionGeneral: any;
  SR_informacionSolicitada: any;
  SR_habilitarChecks: Array<any> = [];
  SR_habilitarRevision: any;

  // Acciones para modificar los conceptos de la solicitud
  SR_displayConceptos: any = {
    btn_accionProcessing: false,

    disp_comidas: false,
    disb_comidas: true,
    disp_autobus: false,
    disb_autobus: true,
    disp_hospedaje: false,
    disb_hospedaje: true,
    disp_casetas: false,
    disb_casetas: true,
    disp_combustibles: false,
    disb_combustibles: true,
    disp_telefonia: false,
    disb_telefonia: true,
    disp_lavanderia: false,
    disb_lavanderia: true,
    disp_taxi: false,
    disb_taxi: true,
    disp_estacionamiento: false,
    disb_estacionamiento: true,
    disp_varios: false,
    disb_varios: true
  };

  modalComentario: boolean = false;
  modal_data: any = {
    title: '',
    comentario: '',
    tipo: 0
  };

  constructor(
    private service: FinanzasService,
    private toast: ToastController) { }

  ngOnInit() {
    this.SR_solicitudDetalles = new SolicitudRegistrada();

    this.RS_inicializarConceptos();

    this.service.SR_getSolicitud_Detalles({solicitud: sessionStorage.getItem('solicitud'), user: this.user_id}).subscribe(
      (r:any) => {
        this.SR_solicitudDetalles = r[0] as any;

        this.SR_solicitudDetalles.id_aprobador = r[1].id_aprobador;
        this.SR_solicitudDetalles.id_departamentos = r[1].id_departamentos;

        this.SR_solicitudDetalles.nombre_lider = r[2].nombre_lider;

        this.SR_habilitarRevision = [];
        this.SR_habilitarChecks = [];
        this.service.SR_habilitarCheckbox({sol_id: this.SR_solicitudDetalles.sol_id}).subscribe(
          (r:any) => {
            this.SR_habilitarChecks = r[0];
            this.SR_habilitarRevision = r[1][0];
          },
          e => {
            console.log(e);
            this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
          }
        );

        this.service.SR_getTotalConceptos({sol_id: this.SR_solicitudDetalles.sol_id}).subscribe(
          r => {
            this.SR_conceptos = r as any;
            var total = 0;
            this.SR_conceptos.forEach(x => {
              total+= x.con_TOTAL;
              switch(x.con_tipoSolicitud){
                case 1: // Comidas
                  this.SR_conceptoComidas = Object.assign({}, x);

                  this.SR_conceptoComidas.icon = true;
                  this.SR_conceptoComidas.con_TOTAL_n = formatCurrency(this.SR_conceptoComidas.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
                  this.SR_conceptoComidas.con_precioUnitario_n = formatCurrency(this.SR_conceptoComidas.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
                  break;
                case 2: // Autobus
                  this.SR_conceptoAutobus = Object.assign({}, x);

                  this.SR_conceptoAutobus.icon = true;
                  this.SR_conceptoAutobus.con_TOTAL_n = formatCurrency(this.SR_conceptoAutobus.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
                  this.SR_conceptoAutobus.con_precioUnitario_n = formatCurrency(this.SR_conceptoAutobus.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
                  this.SR_conceptoAutobus.con_precioUnitario2_n = formatCurrency(this.SR_conceptoAutobus.con_precioUnitario2, 'en-US', '$', 'USD', '1.2-2');
                  this.SR_conceptoAutobus.con_precioUnitario3_n = formatCurrency(this.SR_conceptoAutobus.con_precioUnitario3, 'en-US', '$', 'USD', '1.2-2');
                  break;
                case 3: // Hospedaje
                  this.SR_conceptoHospedaje = Object.assign({}, x);

                  this.SR_conceptoHospedaje.icon = true;
                  this.SR_conceptoHospedaje.con_TOTAL_n = formatCurrency(this.SR_conceptoHospedaje.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
                  this.SR_conceptoHospedaje.con_precioUnitario_n = formatCurrency(this.SR_conceptoHospedaje.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
                  break;
                case 4: // Casetas
                  this.SR_conceptoCasetas = Object.assign({}, x);

                  this.SR_conceptoCasetas.icon = true;
                  this.SR_conceptoCasetas.con_TOTAL_n = formatCurrency(this.SR_conceptoCasetas.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
                  this.SR_conceptoCasetas.con_precioUnitario_n = formatCurrency(this.SR_conceptoCasetas.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');

                  break;
                case 5: // Combustibles
                  this.SR_conceptoCombustibles = Object.assign({}, x);

                  this.SR_conceptoCombustibles.icon = true;
                  this.SR_conceptoCombustibles.con_TOTAL_n = formatCurrency(this.SR_conceptoCombustibles.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
                  this.SR_conceptoCombustibles.con_precioUnitario_n = formatCurrency(this.SR_conceptoCombustibles.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
                  break;
                case 6: // Telefonia
                  this.SR_conceptoTelefonia = Object.assign({}, x);

                  this.SR_conceptoTelefonia.icon = true;
                  this.SR_conceptoTelefonia.con_TOTAL_n = formatCurrency(this.SR_conceptoTelefonia.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
                  this.SR_conceptoTelefonia.con_precioUnitario_n = formatCurrency(this.SR_conceptoTelefonia.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
                  break;
                case 7: // Lavanderia
                  this.SR_conceptoLavanderia = Object.assign({}, x);

                  this.SR_conceptoLavanderia.icon = true;
                  this.SR_conceptoLavanderia.con_TOTAL_n = formatCurrency(this.SR_conceptoLavanderia.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
                  this.SR_conceptoLavanderia.con_precioUnitario_n = formatCurrency(this.SR_conceptoLavanderia.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
                  break;
                case 8: // Taxi
                  this.SR_conceptoTaxi = Object.assign({}, x);

                  this.SR_conceptoTaxi.icon = true;
                  this.SR_conceptoTaxi.con_TOTAL_n = formatCurrency(this.SR_conceptoTaxi.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
                  this.SR_conceptoTaxi.con_precioUnitario_n = formatCurrency(this.SR_conceptoTaxi.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
                  break;
                case 9: // Estacionamiento
                  this.SR_conceptoEstacionamiento = Object.assign({}, x);

                  this.SR_conceptoEstacionamiento.icon = true;
                  this.SR_conceptoEstacionamiento.con_TOTAL_n = formatCurrency(this.SR_conceptoEstacionamiento.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
                  this.SR_conceptoEstacionamiento.con_precioUnitario_n = formatCurrency(this.SR_conceptoEstacionamiento.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
                  break;
                case 10: // Varios
                  this.SR_conceptoVarios = Object.assign({}, x);

                  this.SR_conceptoVarios.icon = true;
                  this.SR_conceptoVarios.con_TOTAL_n = formatCurrency(this.SR_conceptoVarios.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
                  this.SR_conceptoVarios.con_precioUnitario_n = formatCurrency(this.SR_conceptoVarios.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
                  this.SR_conceptoVarios.con_precioUnitario2_n = formatCurrency(this.SR_conceptoVarios.con_precioUnitario2, 'en-US', '$', 'USD', '1.2-2');
                  this.SR_conceptoVarios.con_precioUnitario3_n = formatCurrency(this.SR_conceptoVarios.con_precioUnitario3, 'en-US', '$', 'USD', '1.2-2');
                  break;
              }
            });
            this.SR_conceptoTOTAL = formatCurrency(total, 'en-US', '$', 'USD', '1.2-2');
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

  async RS_getDetalles_solicitud(){
    return new Promise((res) => {
      this.service.SR_getSolicitud_Detalles({solicitud: sessionStorage.getItem('solicitud'), user: this.user_id}).subscribe(
        (r:any) => {
          this.SR_solicitudDetalles = r[0] as any;

          this.SR_solicitudDetalles.id_aprobador = r[1].id_aprobador;
          this.SR_solicitudDetalles.id_departamentos = r[1].id_departamentos;

          this.SR_solicitudDetalles.nombre_lider = r[2].nombre_lider;
        },
        e => {
          console.log(e);
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        }
      ).add(() => {
        this.service.SR_habilitarCheckbox({sol_id: this.SR_solicitudDetalles.sol_id}).subscribe(
          (r:any) => {
            this.SR_habilitarChecks = r[0];
            this.SR_habilitarRevision = r[1][0];
          },
          e => {
            console.log(e);
            this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
          }
        )
      });
      this.service.SR_getTotalConceptos({sol_id: this.SR_solicitudDetalles.sol_id}).subscribe(
        r => {
          this.SR_conceptos = r as any;
          var total = 0;
          this.SR_conceptos.forEach(x => {
            total+= x.con_TOTAL;
            switch(x.con_tipoSolicitud){
              case 1: // Comidas
                this.SR_conceptoComidas = Object.assign({}, x);

                this.SR_conceptoComidas.icon = true;
                this.SR_conceptoComidas.con_TOTAL_n = formatCurrency(this.SR_conceptoComidas.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
                this.SR_conceptoComidas.con_precioUnitario_n = formatCurrency(this.SR_conceptoComidas.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
                break;
              case 2: // Autobus
                this.SR_conceptoAutobus = Object.assign({}, x);

                this.SR_conceptoAutobus.icon = true;
                this.SR_conceptoAutobus.con_TOTAL_n = formatCurrency(this.SR_conceptoAutobus.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
                this.SR_conceptoAutobus.con_precioUnitario_n = formatCurrency(this.SR_conceptoAutobus.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
                this.SR_conceptoAutobus.con_precioUnitario2_n = formatCurrency(this.SR_conceptoAutobus.con_precioUnitario2, 'en-US', '$', 'USD', '1.2-2');
                this.SR_conceptoAutobus.con_precioUnitario3_n = formatCurrency(this.SR_conceptoAutobus.con_precioUnitario3, 'en-US', '$', 'USD', '1.2-2');
                break;
              case 3: // Hospedaje
                this.SR_conceptoHospedaje = Object.assign({}, x);

                this.SR_conceptoHospedaje.icon = true;
                this.SR_conceptoHospedaje.con_TOTAL_n = formatCurrency(this.SR_conceptoHospedaje.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
                this.SR_conceptoHospedaje.con_precioUnitario_n = formatCurrency(this.SR_conceptoHospedaje.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
                break;
              case 4: // Casetas
                this.SR_conceptoCasetas = Object.assign({}, x);

                this.SR_conceptoCasetas.icon = true;
                this.SR_conceptoCasetas.con_TOTAL_n = formatCurrency(this.SR_conceptoCasetas.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
                this.SR_conceptoCasetas.con_precioUnitario_n = formatCurrency(this.SR_conceptoCasetas.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');

                break;
              case 5: // Combustibles
                this.SR_conceptoCombustibles = Object.assign({}, x);

                this.SR_conceptoCombustibles.icon = true;
                this.SR_conceptoCombustibles.con_TOTAL_n = formatCurrency(this.SR_conceptoCombustibles.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
                this.SR_conceptoCombustibles.con_precioUnitario_n = formatCurrency(this.SR_conceptoCombustibles.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
                break;
              case 6: // Telefonia
                this.SR_conceptoTelefonia = Object.assign({}, x);

                this.SR_conceptoTelefonia.icon = true;
                this.SR_conceptoTelefonia.con_TOTAL_n = formatCurrency(this.SR_conceptoTelefonia.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
                this.SR_conceptoTelefonia.con_precioUnitario_n = formatCurrency(this.SR_conceptoTelefonia.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
                break;
              case 7: // Lavanderia
                this.SR_conceptoLavanderia = Object.assign({}, x);

                this.SR_conceptoLavanderia.icon = true;
                this.SR_conceptoLavanderia.con_TOTAL_n = formatCurrency(this.SR_conceptoLavanderia.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
                this.SR_conceptoLavanderia.con_precioUnitario_n = formatCurrency(this.SR_conceptoLavanderia.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
                break;
              case 8: // Taxi
                this.SR_conceptoTaxi = Object.assign({}, x);

                this.SR_conceptoTaxi.icon = true;
                this.SR_conceptoTaxi.con_TOTAL_n = formatCurrency(this.SR_conceptoTaxi.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
                this.SR_conceptoTaxi.con_precioUnitario_n = formatCurrency(this.SR_conceptoTaxi.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
                break;
              case 9: // Estacionamiento
                this.SR_conceptoEstacionamiento = Object.assign({}, x);

                this.SR_conceptoEstacionamiento.icon = true;
                this.SR_conceptoEstacionamiento.con_TOTAL_n = formatCurrency(this.SR_conceptoEstacionamiento.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
                this.SR_conceptoEstacionamiento.con_precioUnitario_n = formatCurrency(this.SR_conceptoEstacionamiento.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
                break;
              case 10: // Varios
                this.SR_conceptoVarios = Object.assign({}, x);

                this.SR_conceptoVarios.icon = true;
                this.SR_conceptoVarios.con_TOTAL_n = formatCurrency(this.SR_conceptoVarios.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
                this.SR_conceptoVarios.con_precioUnitario_n = formatCurrency(this.SR_conceptoVarios.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
                this.SR_conceptoVarios.con_precioUnitario2_n = formatCurrency(this.SR_conceptoVarios.con_precioUnitario2, 'en-US', '$', 'USD', '1.2-2');
                this.SR_conceptoVarios.con_precioUnitario3_n = formatCurrency(this.SR_conceptoVarios.con_precioUnitario3, 'en-US', '$', 'USD', '1.2-2');
                break;
            }
          });
          this.SR_conceptoTOTAL = formatCurrency(total, 'en-US', '$', 'USD', '1.2-2');
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
    );


    /*
    this.service.SR_getSolicitud_Detalles({solicitud: sessionStorage.getItem('solicitud'), user: this.user_id}).subscribe(
      r => {
        this.SR_solicitudDetalles = r[0] as any;

        this.SR_solicitudDetalles.id_aprobador = r[1].id_aprobador;
        this.SR_solicitudDetalles.id_departamentos = r[1].id_departamentos;

        this.SR_solicitudDetalles.nombre_lider = r[2].nombre_lider;

        this.service.SR_habilitarCheckbox({sol_id: this.SR_solicitudDetalles.sol_id}).subscribe(
          r => {
            this.SR_habilitarChecks = r[0];
            this.SR_habilitarRevision = r[1][0];
          },
          e => {
            console.log(e);
            this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
          }
        );

        this.service.SR_getTotalConceptos({sol_id: this.SR_solicitudDetalles.sol_id}).subscribe(
          r => {
            this.SR_conceptos = r as any;
            var total = 0;
            this.SR_conceptos.forEach(x => {
              total+= x.con_TOTAL;
              switch(x.con_tipoSolicitud){
                case 1: // Comidas
                  this.SR_conceptoComidas = Object.assign({}, x);

                  this.SR_conceptoComidas.icon = true;
                  this.SR_conceptoComidas.con_TOTAL_n = formatCurrency(this.SR_conceptoComidas.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
                  this.SR_conceptoComidas.con_precioUnitario_n = formatCurrency(this.SR_conceptoComidas.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
                  break;
                case 2: // Autobus
                  this.SR_conceptoAutobus = Object.assign({}, x);

                  this.SR_conceptoAutobus.icon = true;
                  this.SR_conceptoAutobus.con_TOTAL_n = formatCurrency(this.SR_conceptoAutobus.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
                  this.SR_conceptoAutobus.con_precioUnitario_n = formatCurrency(this.SR_conceptoAutobus.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
                  this.SR_conceptoAutobus.con_precioUnitario2_n = formatCurrency(this.SR_conceptoAutobus.con_precioUnitario2, 'en-US', '$', 'USD', '1.2-2');
                  this.SR_conceptoAutobus.con_precioUnitario3_n = formatCurrency(this.SR_conceptoAutobus.con_precioUnitario3, 'en-US', '$', 'USD', '1.2-2');
                  break;
                case 3: // Hospedaje
                  this.SR_conceptoHospedaje = Object.assign({}, x);

                  this.SR_conceptoHospedaje.icon = true;
                  this.SR_conceptoHospedaje.con_TOTAL_n = formatCurrency(this.SR_conceptoHospedaje.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
                  this.SR_conceptoHospedaje.con_precioUnitario_n = formatCurrency(this.SR_conceptoHospedaje.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
                  break;
                case 4: // Casetas
                  this.SR_conceptoCasetas = Object.assign({}, x);

                  this.SR_conceptoCasetas.icon = true;
                  this.SR_conceptoCasetas.con_TOTAL_n = formatCurrency(this.SR_conceptoCasetas.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
                  this.SR_conceptoCasetas.con_precioUnitario_n = formatCurrency(this.SR_conceptoCasetas.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');

                  break;
                case 5: // Combustibles
                  this.SR_conceptoCombustibles = Object.assign({}, x);

                  this.SR_conceptoCombustibles.icon = true;
                  this.SR_conceptoCombustibles.con_TOTAL_n = formatCurrency(this.SR_conceptoCombustibles.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
                  this.SR_conceptoCombustibles.con_precioUnitario_n = formatCurrency(this.SR_conceptoCombustibles.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
                  break;
                case 6: // Telefonia
                  this.SR_conceptoTelefonia = Object.assign({}, x);

                  this.SR_conceptoTelefonia.icon = true;
                  this.SR_conceptoTelefonia.con_TOTAL_n = formatCurrency(this.SR_conceptoTelefonia.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
                  this.SR_conceptoTelefonia.con_precioUnitario_n = formatCurrency(this.SR_conceptoTelefonia.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
                  break;
                case 7: // Lavanderia
                  this.SR_conceptoLavanderia = Object.assign({}, x);

                  this.SR_conceptoLavanderia.icon = true;
                  this.SR_conceptoLavanderia.con_TOTAL_n = formatCurrency(this.SR_conceptoLavanderia.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
                  this.SR_conceptoLavanderia.con_precioUnitario_n = formatCurrency(this.SR_conceptoLavanderia.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
                  break;
                case 8: // Taxi
                  this.SR_conceptoTaxi = Object.assign({}, x);

                  this.SR_conceptoTaxi.icon = true;
                  this.SR_conceptoTaxi.con_TOTAL_n = formatCurrency(this.SR_conceptoTaxi.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
                  this.SR_conceptoTaxi.con_precioUnitario_n = formatCurrency(this.SR_conceptoTaxi.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
                  break;
                case 9: // Estacionamiento
                  this.SR_conceptoEstacionamiento = Object.assign({}, x);

                  this.SR_conceptoEstacionamiento.icon = true;
                  this.SR_conceptoEstacionamiento.con_TOTAL_n = formatCurrency(this.SR_conceptoEstacionamiento.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
                  this.SR_conceptoEstacionamiento.con_precioUnitario_n = formatCurrency(this.SR_conceptoEstacionamiento.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
                  break;
                case 10: // Varios
                  this.SR_conceptoVarios = Object.assign({}, x);

                  this.SR_conceptoVarios.icon = true;
                  this.SR_conceptoVarios.con_TOTAL_n = formatCurrency(this.SR_conceptoVarios.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
                  this.SR_conceptoVarios.con_precioUnitario_n = formatCurrency(this.SR_conceptoVarios.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
                  this.SR_conceptoVarios.con_precioUnitario2_n = formatCurrency(this.SR_conceptoVarios.con_precioUnitario2, 'en-US', '$', 'USD', '1.2-2');
                  this.SR_conceptoVarios.con_precioUnitario3_n = formatCurrency(this.SR_conceptoVarios.con_precioUnitario3, 'en-US', '$', 'USD', '1.2-2');
                  break;
              }
            });
            this.SR_conceptoTOTAL = formatCurrency(total, 'en-US', '$', 'USD', '1.2-2');
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
    */
  }

  RS_inicializarConceptos(){
    this.SR_displayConceptos = {
      btn_accionProcessing: false,

      disp_comidas: false,
      disb_comidas: true,
      disp_autobus: false,
      disb_autobus: true,
      disp_hospedaje: false,
      disb_hospedaje: true,
      disp_casetas: false,
      disb_casetas: true,
      disp_combustibles: false,
      disb_combustibles: true,
      disp_telefonia: false,
      disb_telefonia: true,
      disp_lavanderia: false,
      disb_lavanderia: true,
      disp_taxi: false,
      disb_taxi: true,
      disp_estacionamiento: false,
      disb_estacionamiento: true,
      disp_varios: false,
      disb_varios: true
    }

    this.SR_conceptos = [];
    this.SR_conceptoComidas = new Conceptos();
    this.SR_conceptoAutobus = new Conceptos();
    this.SR_conceptoHospedaje = new Conceptos();
    this.SR_conceptoCasetas = new Conceptos();
    this.SR_conceptoCombustibles = new Conceptos();
    this.SR_conceptoTelefonia = new Conceptos();
    this.SR_conceptoLavanderia = new Conceptos();
    this.SR_conceptoTaxi = new Conceptos();
    this.SR_conceptoEstacionamiento = new Conceptos();
    this.SR_conceptoVarios = new Conceptos();

    // MODAL COMENTARIO
    this.modalComentario = false;
    this.modal_data = {
      title: '',
      comentario: '',
      tipo: 0
    };
  }

  RS_getSR_ChecksRevision_Find(tipo: number){
    var Tipo = this.SR_habilitarChecks.find(x => x.con_tipoSolicitud == tipo).habilitar;
    var Revision = this.SR_habilitarRevision.sol_estado;

    var resultTipo = Tipo != undefined ? Tipo == 0 : false;
    var resultRevision = Revision >= 2;
    return (resultTipo || resultRevision);
  }

  RS_getSR_Checks_Find(tipo: number){
    var Tipo = this.SR_habilitarChecks.find(x => x.con_tipoSolicitud == tipo).habilitar;
    return (Tipo != undefined ? Tipo == 0 : false);
  }

  SR_change_Conceptos(tipo_change: number){
    switch(tipo_change){
      case 1: // COMIDAS
        this.SR_conceptoComidas.con_cantidad = parseInt(this.SR_conceptoComidas.con_cantidad ? this.SR_conceptoComidas.con_cantidad.toString() : '1') <= 1 ? 1 : this.SR_conceptoComidas.con_cantidad;

        switch(this.SR_conceptoComidas.con_tipoComidas){
          case 1:

            this.SR_conceptoComidas.con_precioUnitario = 190;
            this.SR_conceptoComidas.con_TOTAL = this.SR_conceptoComidas.con_cantidad * this.SR_conceptoComidas.con_precioUnitario;
            this.SR_conceptoComidas.con_TOTAL_n = formatCurrency(this.SR_conceptoComidas.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
            break;
          case 2:
            this.SR_conceptoComidas.con_precioUnitario = 150;
            this.SR_conceptoComidas.con_TOTAL = this.SR_conceptoComidas.con_cantidad * this.SR_conceptoComidas.con_precioUnitario;
            this.SR_conceptoComidas.con_TOTAL_n = formatCurrency(this.SR_conceptoComidas.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
            break;
        }
        break;
      case 2: // AUTOBUS
        this.SR_conceptoAutobus.con_cantidad = parseInt(this.SR_conceptoAutobus.con_cantidad ? this.SR_conceptoAutobus.con_cantidad.toString() : '1') <= 1 ? 1 : this.SR_conceptoAutobus.con_cantidad;
        this.SR_conceptoAutobus.con_precioUnitario = parseInt(this.SR_conceptoAutobus.con_precioUnitario ? this.SR_conceptoAutobus.con_precioUnitario.toString() : '0') <= 0 ? 0 : this.SR_conceptoAutobus.con_precioUnitario;
        this.SR_conceptoAutobus.con_cantidad2 = parseInt(this.SR_conceptoAutobus.con_cantidad2 ? this.SR_conceptoAutobus.con_cantidad2.toString() : '1') <= 1 ? 1 : this.SR_conceptoAutobus.con_cantidad2;
        this.SR_conceptoAutobus.con_precioUnitario2 = parseInt(this.SR_conceptoAutobus.con_precioUnitario2 ? this.SR_conceptoAutobus.con_precioUnitario2.toString() : '0') <= 0 ? 0 : this.SR_conceptoAutobus.con_precioUnitario2;
        this.SR_conceptoAutobus.con_cantidad3 = parseInt(this.SR_conceptoAutobus.con_cantidad3 ? this.SR_conceptoAutobus.con_cantidad3.toString() : '1') <= 1 ? 1 : this.SR_conceptoAutobus.con_cantidad3;
        this.SR_conceptoAutobus.con_precioUnitario3 = parseInt(this.SR_conceptoAutobus.con_precioUnitario3 ? this.SR_conceptoAutobus.con_precioUnitario3.toString() : '0') <= 0 ? 0 : this.SR_conceptoAutobus.con_precioUnitario3;

        var cantidad1 = this.SR_conceptoAutobus.con_cantidad; var precio1 = this.SR_conceptoAutobus.con_precioUnitario;
        var cantidad2 = this.SR_conceptoAutobus.con_cantidad2; var precio2 = this.SR_conceptoAutobus.con_precioUnitario2;
        var cantidad3 = this.SR_conceptoAutobus.con_cantidad3; var precio3 = this.SR_conceptoAutobus.con_precioUnitario3;

        this.SR_conceptoAutobus.con_TOTAL = (cantidad1 * precio1) + (cantidad2 * precio2) + (cantidad3 * precio3);
        this.SR_conceptoAutobus.con_TOTAL_n = formatCurrency(this.SR_conceptoAutobus.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
        this.SR_conceptoAutobus.con_precioUnitario_n = formatCurrency(this.SR_conceptoAutobus.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
        this.SR_conceptoAutobus.con_precioUnitario2_n = formatCurrency(this.SR_conceptoAutobus.con_precioUnitario2, 'en-US', '$', 'USD', '1.2-2');
        this.SR_conceptoAutobus.con_precioUnitario3_n = formatCurrency(this.SR_conceptoAutobus.con_precioUnitario3, 'en-US', '$', 'USD', '1.2-2');
        break;
      case 3: // HOSPEDAJE
        /* NO HAY CAMBIOS */

        this.SR_conceptoHospedaje.con_precioUnitario_n = formatCurrency(this.SR_conceptoHospedaje.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
        this.SR_conceptoHospedaje.con_TOTAL_n = formatCurrency(this.SR_conceptoHospedaje.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
        break;
      case 4: // CASETAS
        this.SR_conceptoCasetas.con_cantidad = parseInt(this.SR_conceptoCasetas.con_cantidad ? this.SR_conceptoCasetas.con_cantidad.toString() : '1') <= 1 ? 1 : this.SR_conceptoCasetas.con_cantidad;
        this.SR_conceptoCasetas.con_precioUnitario = parseInt(this.SR_conceptoCasetas.con_precioUnitario ? this.SR_conceptoCasetas.con_precioUnitario.toString() : '0') <= 0 ? 0 : this.SR_conceptoCasetas.con_precioUnitario;
        this.SR_conceptoCasetas.con_TOTAL = (this.SR_conceptoCasetas.con_cantidad * this.SR_conceptoCasetas.con_precioUnitario);

        this.SR_conceptoCasetas.con_TOTAL_n = formatCurrency(this.SR_conceptoCasetas.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
        this.SR_conceptoCasetas.con_precioUnitario_n = formatCurrency(this.SR_conceptoCasetas.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
        break;
      case 5: // COMBUSTIBLES
        this.SR_conceptoCombustibles.con_precioUnitario = parseInt(this.SR_conceptoCombustibles.con_precioUnitario ? this.SR_conceptoCombustibles.con_precioUnitario.toString() : '0') <= 0 ? 0 : this.SR_conceptoCombustibles.con_precioUnitario;
        this.SR_conceptoCombustibles.con_TOTAL = parseInt(this.SR_conceptoCombustibles.con_TOTAL ? this.SR_conceptoCombustibles.con_TOTAL.toString() : '0') <= 0 ? 0 : this.SR_conceptoCombustibles.con_TOTAL;

        this.SR_conceptoCombustibles.con_TOTAL_n = formatCurrency(this.SR_conceptoCombustibles.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
        this.SR_conceptoCombustibles.con_precioUnitario_n = formatCurrency(this.SR_conceptoCombustibles.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
        break;
      case 6: // CELULAR/TEL
        this.SR_conceptoTelefonia.con_cantidad = parseInt(this.SR_conceptoTelefonia.con_cantidad ? this.SR_conceptoTelefonia.con_cantidad.toString() : '1') <= 1 ? 1 : this.SR_conceptoTelefonia.con_cantidad;
        this.SR_conceptoTelefonia.con_precioUnitario = parseInt(this.SR_conceptoTelefonia.con_precioUnitario ? this.SR_conceptoTelefonia.con_precioUnitario.toString() : '0') <= 0 ? 0 : this.SR_conceptoTelefonia.con_precioUnitario;
        this.SR_conceptoTelefonia.con_TOTAL = (this.SR_conceptoTelefonia.con_cantidad * this.SR_conceptoTelefonia.con_precioUnitario);

        this.SR_conceptoTelefonia.con_TOTAL_n = formatCurrency(this.SR_conceptoTelefonia.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
        this.SR_conceptoTelefonia.con_precioUnitario_n = formatCurrency(this.SR_conceptoTelefonia.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
        break;
      case 7: // LAVANDERIA
        this.SR_conceptoLavanderia.con_cantidad = parseInt(this.SR_conceptoLavanderia.con_cantidad ? this.SR_conceptoLavanderia.con_cantidad.toString() : '1') <= 1 ? 1 : this.SR_conceptoLavanderia.con_cantidad;
        this.SR_conceptoLavanderia.con_precioUnitario = parseInt(this.SR_conceptoLavanderia.con_precioUnitario ? this.SR_conceptoLavanderia.con_precioUnitario.toString() : '0') <= 0 ? 0 : this.SR_conceptoLavanderia.con_precioUnitario;
        this.SR_conceptoLavanderia.con_TOTAL = (this.SR_conceptoLavanderia.con_cantidad * this.SR_conceptoLavanderia.con_precioUnitario);

        this.SR_conceptoLavanderia.con_TOTAL_n = formatCurrency(this.SR_conceptoLavanderia.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
        this.SR_conceptoLavanderia.con_precioUnitario_n = formatCurrency(this.SR_conceptoLavanderia.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
        break;
      case 8: // TAXI
        this.SR_conceptoTaxi.con_cantidad = parseInt(this.SR_conceptoTaxi.con_cantidad ? this.SR_conceptoTaxi.con_cantidad.toString() : '1') <= 1 ? 1 : this.SR_conceptoTaxi.con_cantidad;
        this.SR_conceptoTaxi.con_precioUnitario = parseInt(this.SR_conceptoTaxi.con_precioUnitario ? this.SR_conceptoTaxi.con_precioUnitario.toString() : '0') <= 0 ? 0 : this.SR_conceptoTaxi.con_precioUnitario;
        this.SR_conceptoTaxi.con_TOTAL = (this.SR_conceptoTaxi.con_cantidad * this.SR_conceptoTaxi.con_precioUnitario);

        this.SR_conceptoTaxi.con_TOTAL_n = formatCurrency(this.SR_conceptoTaxi.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
        this.SR_conceptoTaxi.con_precioUnitario_n = formatCurrency(this.SR_conceptoTaxi.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
        break;
      case 9: // ESTACIONAMIENTO
        this.SR_conceptoEstacionamiento.con_cantidad = parseInt(this.SR_conceptoEstacionamiento.con_cantidad ? this.SR_conceptoEstacionamiento.con_cantidad.toString() : '1') <= 1 ? 1 : this.SR_conceptoEstacionamiento.con_cantidad;
        this.SR_conceptoEstacionamiento.con_precioUnitario = parseInt(this.SR_conceptoEstacionamiento.con_precioUnitario ? this.SR_conceptoEstacionamiento.con_precioUnitario.toString() : '0') <= 0 ? 0 : this.SR_conceptoEstacionamiento.con_precioUnitario;
        this.SR_conceptoEstacionamiento.con_TOTAL = (this.SR_conceptoEstacionamiento.con_cantidad * this.SR_conceptoEstacionamiento.con_precioUnitario);

        this.SR_conceptoEstacionamiento.con_TOTAL_n = formatCurrency(this.SR_conceptoEstacionamiento.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
        this.SR_conceptoEstacionamiento.con_precioUnitario_n = formatCurrency(this.SR_conceptoEstacionamiento.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
        break;
      case 10: // VARIOS
        this.SR_conceptoVarios.con_cantidad = parseInt(this.SR_conceptoVarios.con_cantidad ? this.SR_conceptoVarios.con_cantidad.toString() : '1') <= 1 ? 1 : this.SR_conceptoVarios.con_cantidad;
        this.SR_conceptoVarios.con_precioUnitario = parseInt(this.SR_conceptoVarios.con_precioUnitario ? this.SR_conceptoVarios.con_precioUnitario.toString() : '0') <= 0 ? 0 : this.SR_conceptoVarios.con_precioUnitario;
        this.SR_conceptoVarios.con_cantidad2 = parseInt(this.SR_conceptoVarios.con_cantidad2 ? this.SR_conceptoVarios.con_cantidad2.toString() : '1') <= 1 ? 1 : this.SR_conceptoVarios.con_cantidad2;
        this.SR_conceptoVarios.con_precioUnitario2 = parseInt(this.SR_conceptoVarios.con_precioUnitario2 ? this.SR_conceptoVarios.con_precioUnitario2.toString() : '0') <= 0 ? 0 : this.SR_conceptoVarios.con_precioUnitario2;
        this.SR_conceptoVarios.con_cantidad3 = parseInt(this.SR_conceptoVarios.con_cantidad3 ? this.SR_conceptoVarios.con_cantidad3.toString() : '1') <= 1 ? 1 : this.SR_conceptoVarios.con_cantidad3;
        this.SR_conceptoVarios.con_precioUnitario3 = parseInt(this.SR_conceptoVarios.con_precioUnitario3 ? this.SR_conceptoVarios.con_precioUnitario3.toString() : '0') <= 0 ? 0 : this.SR_conceptoVarios.con_precioUnitario3;

        var cantidad1 = this.SR_conceptoVarios.con_cantidad; var precio1 = this.SR_conceptoVarios.con_precioUnitario;
        var cantidad2 = this.SR_conceptoVarios.con_cantidad2; var precio2 = this.SR_conceptoVarios.con_precioUnitario2;
        var cantidad3 = this.SR_conceptoVarios.con_cantidad3; var precio3 = this.SR_conceptoVarios.con_precioUnitario3;

        this.SR_conceptoVarios.con_TOTAL = (cantidad1 * precio1) + (cantidad2 * precio2) + (cantidad3 * precio3);
        this.SR_conceptoVarios.con_TOTAL_n = formatCurrency(this.SR_conceptoVarios.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
        this.SR_conceptoVarios.con_precioUnitario_n = formatCurrency(this.SR_conceptoVarios.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
        this.SR_conceptoVarios.con_precioUnitario2_n = formatCurrency(this.SR_conceptoVarios.con_precioUnitario2, 'en-US', '$', 'USD', '1.2-2');
        this.SR_conceptoVarios.con_precioUnitario3_n = formatCurrency(this.SR_conceptoVarios.con_precioUnitario3, 'en-US', '$', 'USD', '1.2-2');
        break;
    }
  }
  SR_btn_cancelar(tipo_change: number){
    switch(tipo_change){
      case 1: // COMIDAS
        var comidas = this.SR_conceptos.find(x => x.con_tipoSolicitud == tipo_change);
        this.SR_conceptoComidas.con_tipoComidas = comidas!.con_tipoComidas;
        this.SR_conceptoComidas.con_cantidad = comidas!.con_cantidad;
        this.SR_conceptoComidas.con_precioUnitario = comidas!.con_precioUnitario;
        this.SR_conceptoComidas.con_TOTAL = comidas!.con_TOTAL;
        this.SR_conceptoComidas.con_comentario = comidas!.con_comentario;
        this.SR_conceptoComidas.con_modificadoComentarios = comidas!.con_modificadoComentarios;

        this.SR_conceptoComidas.con_precioUnitario_n = formatCurrency(comidas!.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
        this.SR_conceptoComidas.con_TOTAL_n = formatCurrency(comidas!.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
        break;
      case 2: // AUTOBUS
        var autobus = this.SR_conceptos.find(x => x.con_tipoSolicitud == tipo_change);

        this.SR_conceptoAutobus.con_descripcion = autobus!.con_descripcion;
        this.SR_conceptoAutobus.con_cantidad = autobus!.con_cantidad;
        this.SR_conceptoAutobus.con_precioUnitario = autobus!.con_precioUnitario;
        this.SR_conceptoAutobus.con_descripcion2 = autobus!.con_descripcion2;
        this.SR_conceptoAutobus.con_cantidad2 = autobus!.con_cantidad2;
        this.SR_conceptoAutobus.con_precioUnitario2 = autobus!.con_precioUnitario2;
        this.SR_conceptoAutobus.con_descripcion3 = autobus!.con_descripcion3;
        this.SR_conceptoAutobus.con_cantidad3 = autobus!.con_cantidad3;
        this.SR_conceptoAutobus.con_precioUnitario3 = autobus!.con_precioUnitario3;
        this.SR_conceptoAutobus.con_TOTAL = autobus!.con_TOTAL;
        this.SR_conceptoAutobus.con_comentario = autobus!.con_comentario;
        this.SR_conceptoAutobus.con_modificadoComentarios = autobus!.con_modificadoComentarios;

        this.SR_conceptoAutobus.con_TOTAL_n = formatCurrency(autobus!.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
        this.SR_conceptoAutobus.con_precioUnitario_n = formatCurrency(autobus!.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
        this.SR_conceptoAutobus.con_precioUnitario2_n = formatCurrency(autobus!.con_precioUnitario2, 'en-US', '$', 'USD', '1.2-2');
        this.SR_conceptoAutobus.con_precioUnitario3_n = formatCurrency(autobus!.con_precioUnitario3, 'en-US', '$', 'USD', '1.2-2');

        break;
      case 3: // HOSPEDAJE
        var hospedaje = this.SR_conceptos.find(x => x.con_tipoSolicitud == tipo_change);

        this.SR_conceptoHospedaje.con_cantidadNoches = hospedaje!.con_cantidadNoches;
        this.SR_conceptoHospedaje.con_precioUnitario = hospedaje!.con_precioUnitario;
        this.SR_conceptoHospedaje.con_TOTAL = hospedaje!.con_TOTAL;
        this.SR_conceptoHospedaje.con_comentario = hospedaje!.con_comentario;
        this.SR_conceptoHospedaje.con_modificadoComentarios = hospedaje!.con_modificadoComentarios;

        this.SR_conceptoHospedaje.con_precioUnitario_n = formatCurrency(hospedaje!.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
        this.SR_conceptoHospedaje.con_TOTAL_n = formatCurrency(hospedaje!.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
        break;
      case 4: // CASETAS
        var casetas = this.SR_conceptos.find(x => x.con_tipoSolicitud == tipo_change);

        this.SR_conceptoCasetas.con_numEconomico = casetas!.con_numEconomico;
        this.SR_conceptoCasetas.con_cantidad = casetas!.con_cantidad;
        this.SR_conceptoCasetas.con_precioUnitario = casetas!.con_precioUnitario;
        this.SR_conceptoCasetas.con_TOTAL = casetas!.con_TOTAL;
        this.SR_conceptoCasetas.con_comentario = casetas!.con_comentario;
        this.SR_conceptoCasetas.con_modificadoComentarios = casetas!.con_modificadoComentarios;

        this.SR_conceptoCasetas.con_TOTAL_n = formatCurrency(casetas!.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
        this.SR_conceptoCasetas.con_precioUnitario_n = formatCurrency(casetas!.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
        break;
      case 5: // COMBUSTIBLES
        var combustibles = this.SR_conceptos.find(x => x.con_tipoSolicitud == tipo_change);

        this.SR_conceptoCombustibles.con_numEconomico = combustibles!.con_numEconomico;
        this.SR_conceptoCombustibles.con_rendimiento = combustibles!.con_rendimiento;
        this.SR_conceptoCombustibles.con_kmViaje = combustibles!.con_kmViaje;
        this.SR_conceptoCombustibles.con_precioUnitario = combustibles!.con_precioUnitario;
        this.SR_conceptoCombustibles.con_TOTAL = combustibles!.con_TOTAL;
        this.SR_conceptoCombustibles.con_comentario = combustibles!.con_comentario;
        this.SR_conceptoCombustibles.con_modificadoComentarios = combustibles!.con_modificadoComentarios;

        this.SR_conceptoCombustibles.con_TOTAL_n = formatCurrency(combustibles!.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
        this.SR_conceptoCombustibles.con_precioUnitario_n = formatCurrency(combustibles!.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
        break;
      case 6: // CELULAR/TEL
        var telefonia = this.SR_conceptos.find(x => x.con_tipoSolicitud == tipo_change);

        this.SR_conceptoTelefonia.con_celular = telefonia!.con_celular;
        this.SR_conceptoTelefonia.con_cantidad = telefonia!.con_cantidad;
        this.SR_conceptoTelefonia.con_precioUnitario = telefonia!.con_precioUnitario;
        this.SR_conceptoTelefonia.con_TOTAL = telefonia!.con_TOTAL;
        this.SR_conceptoTelefonia.con_comentario = telefonia!.con_comentario;
        this.SR_conceptoTelefonia.con_modificadoComentarios = telefonia!.con_modificadoComentarios;

        this.SR_conceptoTelefonia.con_TOTAL_n = formatCurrency(telefonia!.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
        this.SR_conceptoTelefonia.con_precioUnitario_n = formatCurrency(telefonia!.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
        break;
      case 7: // LAVANDERIA
        var lavanderia = this.SR_conceptos.find(x => x.con_tipoSolicitud == tipo_change);

        this.SR_conceptoLavanderia.con_cantidad = lavanderia!.con_cantidad;
        this.SR_conceptoLavanderia.con_precioUnitario = lavanderia!.con_precioUnitario;
        this.SR_conceptoLavanderia.con_TOTAL = lavanderia!.con_TOTAL;
        this.SR_conceptoLavanderia.con_comentario = lavanderia!.con_comentario;
        this.SR_conceptoLavanderia.con_modificadoComentarios = lavanderia!.con_modificadoComentarios;

        this.SR_conceptoLavanderia.con_TOTAL_n = formatCurrency(lavanderia!.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
        this.SR_conceptoLavanderia.con_precioUnitario_n = formatCurrency(lavanderia!.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
        break;
      case 8: // TAXI
        var taxi = this.SR_conceptos.find(x => x.con_tipoSolicitud == tipo_change);

        this.SR_conceptoTaxi.con_cantidad = taxi!.con_cantidad;
        this.SR_conceptoTaxi.con_precioUnitario = taxi!.con_precioUnitario;
        this.SR_conceptoTaxi.con_TOTAL = taxi!.con_TOTAL;
        this.SR_conceptoTaxi.con_comentario = taxi!.con_comentario;
        this.SR_conceptoTaxi.con_modificadoComentarios = taxi!.con_modificadoComentarios;

        this.SR_conceptoTaxi.con_TOTAL_n = formatCurrency(taxi!.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
        this.SR_conceptoTaxi.con_precioUnitario_n = formatCurrency(taxi!.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
        break;
      case 9: // ESTACIONAMIENTO
        var estacionamiento = this.SR_conceptos.find(x => x.con_tipoSolicitud == tipo_change);

        this.SR_conceptoEstacionamiento.con_cantidad = estacionamiento!.con_cantidad;
        this.SR_conceptoEstacionamiento.con_precioUnitario = estacionamiento!.con_precioUnitario;
        this.SR_conceptoEstacionamiento.con_TOTAL = estacionamiento!.con_TOTAL;
        this.SR_conceptoEstacionamiento.con_comentario = estacionamiento!.con_comentario;
        this.SR_conceptoEstacionamiento.con_modificadoComentarios = estacionamiento!.con_modificadoComentarios;

        this.SR_conceptoEstacionamiento.con_TOTAL_n = formatCurrency(estacionamiento!.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
        this.SR_conceptoEstacionamiento.con_precioUnitario_n = formatCurrency(estacionamiento!.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
        break;
      case 10: // VARIOS
        var varios = this.SR_conceptos.find(x => x.con_tipoSolicitud == tipo_change);

        this.SR_conceptoVarios.con_descripcion = varios!.con_descripcion;
        this.SR_conceptoVarios.con_cantidad = varios!.con_cantidad;
        this.SR_conceptoVarios.con_precioUnitario = varios!.con_precioUnitario;
        this.SR_conceptoVarios.con_descripcion2 = varios!.con_descripcion2;
        this.SR_conceptoVarios.con_cantidad2 = varios!.con_cantidad2;
        this.SR_conceptoVarios.con_precioUnitario2 = varios!.con_precioUnitario2;
        this.SR_conceptoVarios.con_descripcion3 = varios!.con_descripcion3;
        this.SR_conceptoVarios.con_cantidad3 = varios!.con_cantidad3;
        this.SR_conceptoVarios.con_precioUnitario3 = varios!.con_precioUnitario3;
        this.SR_conceptoVarios.con_TOTAL = varios!.con_TOTAL;
        this.SR_conceptoVarios.con_comentario = varios!.con_comentario;
        this.SR_conceptoVarios.con_modificadoComentarios = varios!.con_modificadoComentarios;

        this.SR_conceptoVarios.con_TOTAL_n = formatCurrency(varios!.con_TOTAL, 'en-US', '$', 'USD', '1.2-2');
        this.SR_conceptoVarios.con_precioUnitario_n = formatCurrency(varios!.con_precioUnitario, 'en-US', '$', 'USD', '1.2-2');
        this.SR_conceptoVarios.con_precioUnitario2_n = formatCurrency(varios!.con_precioUnitario2, 'en-US', '$', 'USD', '1.2-2');
        this.SR_conceptoVarios.con_precioUnitario3_n = formatCurrency(varios!.con_precioUnitario3, 'en-US', '$', 'USD', '1.2-2');
        break;
    }
  }

  RS_openPDF(){
    let data: any = { sol_id: this.SR_solicitudDetalles.sol_id, url: window.location.host};
    this.service.SR_generarPDF_solicitud(data).subscribe(
      r => {
        let url = window.URL.createObjectURL(r);
        window.open(url);
      },
      e => {
        console.log(e);
      }
    );
  }

  RS_permisos(){
    var permiso = ( this.user_id == '274' || this.user_id == '321' || this.user_id == '273' ||
                    this.user_id == '229' || this.user_id == '462' || this.user_id == '1302' ||
                    this.user_id == '1069' );
    return permiso;
  }

  // Acción solicitud en deposito
  // ****** ********* retenida
  async SR_updateSolicitudesFinanzas_acciones(){
    let datas: any = {
      sol_id: this.SR_solicitudDetalles.sol_id,
      url: window.location.host,
      tipo: this.modal_data.tipo,
      comment: this.modal_data.comentario,
      usuario: this.user_id
    };

    this.service.SR_updateSolicitudesFinanzas_acciones(datas).subscribe(
      r => {
        var data = r as any;

        switch(data.tipo){
          case 1: // Depositar solicitud
            if(data.result == 1)
              this.service.createAlert('Solicitud en depósito.', 'success');
            else if(data.result == 2)
              this.service.createAlert('Solicitud en depósito. No se envío notificación al solicitante.', 'success');
            else
              this.service.createAlert('No se actualizo. Intente de nuevo.', 'danger');
            break;
          case 2: // Retener solicitud
            if(data.result == 1)
              this.service.createAlert('Solicitud detenida.', 'success');
            else if(data.result == 2)
              this.service.createAlert('Solicitud detenida. No se envío notificación al solicitante.', 'success');
            else
              this.service.createAlert('No se actualizo. Intente de nuevo.', 'danger');
            break;
          case 103: // Aprobar solicitud
            if(data.result == 1)
              this.service.createAlert('Solicitud aprobada.', 'success');
            else if(data.result == 2)
              this.service.createAlert('Solicitud aprobada. No se envío notificación al solicitante.', 'success');
            else
              this.service.createAlert('No se actualizo. Intente de nuevo.', 'danger');
            break;
          case 104: // Rechazar solicitud
            if(data.result == 1)
              this.service.createAlert('Solicitud rechazada.', 'success');
            else if(data.result == 2)
              this.service.createAlert('Solicitud rechazada. No se envío notificación al solicitante.', 'success');
            else
              this.service.createAlert('No se actualizo. Intente de nuevo.', 'danger');
            break;
          default:
            this.service.createAlert("Ocurrió un error, inténtelo de nuevo","danger");
            break;
        }

        if(data.result == 1 || data.result == 2) timer(1000).subscribe(x => window.location.reload());
      },
      e => {
        console.log(e);
        window.location.reload();
      }
    );

  }

  // MODAL COMENTARIO
  RS_modal_comentario(tipo: number){
    this.ModalComentario.onDidDismiss().then(() => {
      this.modalComentario = false;
      this.SR_displayConceptos.btn_accionProcessing = false;
    });
    this.modalComentario = true;

    this.modal_data = {
      title: '',
      comentario: '',
      tipo: tipo
    };

    switch(tipo){
      case 1: // Depositar solicitud
        this.modal_data.title = 'Depositar solicitud';
        break;
      case 2: // Retener solicitud
        this.modal_data.title = 'Retener solicitud';
        break;
      case 103: // Aprobar solicitud
        this.modal_data.title = 'Aprobar solicitud';
        break;
      case 104: // Rechazar solicitud
        this.modal_data.title = 'Rechazar solicitud';
        break;
    }
  }

  async RS_guardarConceptosSolicitados(datas: any){
    this.service.SR_guardarConceptosSolicitados(datas).subscribe(
      (r:any) => {
        this.SR_displayConceptos.btn_accionProcessing = false;

        switch(r[0]){
          case 0:
            this.service.createAlert('Hubo un error al guardar la información. Intentelo de nuevo.', 'danger');
            break;
          case 1:
            this.RS_getDetalles_solicitud();

            this.SR_displayConceptos.disb_comidas = true;
            this.SR_displayConceptos.disb_autobus = true;
            this.SR_displayConceptos.disb_hospedaje = true;
            this.SR_displayConceptos.disb_casetas = true;
            this.SR_displayConceptos.disb_combustibles = true;
            this.SR_displayConceptos.disb_telefonia = true;
            this.SR_displayConceptos.disb_lavanderia = true;
            this.SR_displayConceptos.disb_taxi = true;
            this.SR_displayConceptos.disb_estacionamiento = true;
            this.SR_displayConceptos.disb_varios = true;

            this.service.createAlert('Se guardo la información.', 'success');
            break;
          case 2:
            this.service.createAlert('Hubo un error al guardar la información. Intentelo de nuevo.', 'warning');
            break;
        }
      },
      e => {
        this.SR_displayConceptos.btn_accionProcessing = false;

        console.log(e);
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
      }
    );
  }

  //alertas on link
  async confirmAlert(message: string, color: string = '', data: any) {
    const toast = await this.toast.create({
      message: message, color: color, buttons: [
        {
          side: 'end',
          text: 'confirmar',
          handler: () => {
            switch(data.tipo){
              case 1: // COMIDAS
                var comidas = {
                  tipo: data.tipo,
                  sol_id: this.SR_solicitudDetalles.sol_id,

                  comida_tipo: this.SR_conceptoComidas.con_tipoComidas,
                  comida_cantidad: this.SR_conceptoComidas.con_cantidad,
                  comida_precio: this.SR_conceptoComidas.con_precioUnitario,
                  comida_total: this.SR_conceptoComidas.con_TOTAL,
                  comida_comentario: this.SR_conceptoComidas.con_comentario,
                  comida_modificacion: this.SR_conceptoComidas.con_modificadoComentarios
                };

                this.RS_guardarConceptosSolicitados(comidas);
                break;
              case 2: // AUTOBUS
                var autobus = {
                  tipo: data.tipo,
                  sol_id: this.SR_solicitudDetalles.sol_id,

                  autobus_descripcion: this.SR_conceptoAutobus.con_descripcion,
                  autobus_cantidad: this.SR_conceptoAutobus.con_cantidad,
                  autobus_precio: this.SR_conceptoAutobus.con_precioUnitario,

                  autobus_descripcion2: this.SR_conceptoAutobus.con_descripcion2,
                  autobus_cantidad2: this.SR_conceptoAutobus.con_cantidad2,
                  autobus_precio2: this.SR_conceptoAutobus.con_precioUnitario2,

                  autobus_descripcion3: this.SR_conceptoAutobus.con_descripcion3,
                  autobus_cantidad3: this.SR_conceptoAutobus.con_cantidad3,
                  autobus_precio3: this.SR_conceptoAutobus.con_precioUnitario3,

                  autobus_total: this.SR_conceptoAutobus.con_TOTAL,
                  autobus_comentario: this.SR_conceptoAutobus.con_comentario,
                  autobus_modificacion: this.SR_conceptoAutobus.con_modificadoComentarios
                };

                this.RS_guardarConceptosSolicitados(autobus);
                break;
              case 3: // HOSPEDAJE

                var hospedaje = {
                  tipo: data.tipo,
                  sol_id: this.SR_solicitudDetalles.sol_id,

                  hospedaje_noches: this.SR_conceptoHospedaje.con_cantidadNoches,
                  hospedaje_precio: this.SR_conceptoHospedaje.con_precioUnitario,
                  hospedaje_total: this.SR_conceptoHospedaje.con_TOTAL,
                  hospedaje_comentario: this.SR_conceptoHospedaje.con_comentario,
                  hospedaje_modificacion: this.SR_conceptoHospedaje.con_modificadoComentarios
                };

                this.RS_guardarConceptosSolicitados(hospedaje);
                break;
              case 4: // CASETAS

                var casetas = {
                  tipo: data.tipo,
                  sol_id: this.SR_solicitudDetalles.sol_id,

                  casetas_numero: this.SR_conceptoCasetas.con_numEconomico,
                  casetas_cantidad: this.SR_conceptoCasetas.con_cantidad,
                  casetas_precio: this.SR_conceptoCasetas.con_precioUnitario,
                  casetas_total: this.SR_conceptoCasetas.con_TOTAL,
                  casetas_comentario: this.SR_conceptoCasetas.con_comentario,
                  casetas_modificacion: this.SR_conceptoCasetas.con_modificadoComentarios,
                }

                this.RS_guardarConceptosSolicitados(casetas);
                break;
              case 5: // COMBUSTIBLES

                var combustibles = {
                  tipo: data.tipo,
                  sol_id: this.SR_solicitudDetalles.sol_id,

                  combustible_numero: this.SR_conceptoCombustibles.con_numEconomico,
                  combustible_rendimiento: this.SR_conceptoCombustibles.con_rendimiento,
                  combustible_km: this.SR_conceptoCombustibles.con_kmViaje,
                  combustible_precio: this.SR_conceptoCombustibles.con_precioUnitario,
                  combustible_total: this.SR_conceptoCombustibles.con_TOTAL,
                  combustible_comentario: this.SR_conceptoCombustibles.con_comentario,
                  combustible_modificacion: this.SR_conceptoCombustibles.con_modificadoComentarios
                }

                this.RS_guardarConceptosSolicitados(combustibles);
                break;
              case 6: // CELULAR/TEL

                var telefonia = {
                  tipo: data.tipo,
                  sol_id: this.SR_solicitudDetalles.sol_id,

                  telefonia_numero: this.SR_conceptoTelefonia.con_celular,
                  telefonia_cantidad: this.SR_conceptoTelefonia.con_cantidad,
                  telefonia_precio: this.SR_conceptoTelefonia.con_precioUnitario,
                  telefonia_total: this.SR_conceptoTelefonia.con_TOTAL,
                  telefonia_comentario: this.SR_conceptoTelefonia.con_comentario,
                  telefonia_modificacion: this.SR_conceptoTelefonia.con_modificadoComentarios
                }

                this.RS_guardarConceptosSolicitados(telefonia);
                break;
              case 7: // LAVANDERIA

                var lavanderia = {
                  tipo: data.tipo,
                  sol_id: this.SR_solicitudDetalles.sol_id,

                  lavanderia_cantidad: this.SR_conceptoLavanderia.con_cantidad,
                  lavanderia_precio: this.SR_conceptoLavanderia.con_precioUnitario,
                  lavanderia_total: this.SR_conceptoLavanderia.con_TOTAL,
                  lavanderia_comentario: this.SR_conceptoLavanderia.con_comentario,
                  lavanderia_modificacion: this.SR_conceptoLavanderia.con_modificadoComentarios
                }

                this.RS_guardarConceptosSolicitados(lavanderia);
                break;
              case 8: // TAXI

                var taxi = {
                  tipo: data.tipo,
                  sol_id: this.SR_solicitudDetalles.sol_id,

                  taxi_cantidad: this.SR_conceptoTaxi.con_cantidad,
                  taxi_precio: this.SR_conceptoTaxi.con_precioUnitario,
                  taxi_total: this.SR_conceptoTaxi.con_TOTAL,
                  taxi_comentario: this.SR_conceptoTaxi.con_comentario,
                  taxi_modificacion: this.SR_conceptoTaxi.con_modificadoComentarios
                }

                this.RS_guardarConceptosSolicitados(taxi);
                break;
              case 9: // ESTACIONAMIENTO

                var estacionamiento = {
                  tipo: data.tipo,
                  sol_id: this.SR_solicitudDetalles.sol_id,

                  estacionamiento_cantidad: this.SR_conceptoEstacionamiento.con_cantidad,
                  estacionamiento_precio: this.SR_conceptoEstacionamiento.con_precioUnitario,
                  estacionamiento_total: this.SR_conceptoEstacionamiento.con_TOTAL,
                  estacionamiento_comentario: this.SR_conceptoEstacionamiento.con_comentario,
                  estacionamiento_modificacion: this.SR_conceptoEstacionamiento.con_modificadoComentarios
                }

                this.RS_guardarConceptosSolicitados(estacionamiento);
                break;
              case 10: // VARIOS

                var varios = {
                  tipo: data.tipo,
                  sol_id: this.SR_solicitudDetalles.sol_id,

                  varios_descripcion: this.SR_conceptoVarios.con_descripcion,
                  varios_cantidad: this.SR_conceptoVarios.con_cantidad,
                  varios_precio: this.SR_conceptoVarios.con_precioUnitario,

                  varios_descripcion2: this.SR_conceptoVarios.con_descripcion2,
                  varios_cantidad2: this.SR_conceptoVarios.con_cantidad2,
                  varios_precio2: this.SR_conceptoVarios.con_precioUnitario2,

                  varios_descripcion3: this.SR_conceptoVarios.con_descripcion3,
                  varios_cantidad3: this.SR_conceptoVarios.con_cantidad3,
                  varios_precio3: this.SR_conceptoVarios.con_precioUnitario3,

                  varios_total: this.SR_conceptoVarios.con_TOTAL,
                  varios_comentario: this.SR_conceptoVarios.con_comentario,
                  varios_modificacion: this.SR_conceptoVarios.con_modificadoComentarios
                }

                this.RS_guardarConceptosSolicitados(varios);
                break;
              case 103: // Aprobar solicitud
              case 104: // Rechazar solicitud
                this.RS_modal_comentario(data.tipo);
                break;
            }
          }
        },
        {
          side: 'end',
          icon: 'close',
          handler: () => {
            this.SR_displayConceptos.btn_accionProcessing = false;
            toast.dismiss();
          }
        }
      ]
    });
    return toast.present();
  }

}
