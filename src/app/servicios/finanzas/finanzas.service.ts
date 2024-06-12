import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { catchError, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinanzasService {

  public BASEURL: string = 'http://intranet.ecn.com.mx:8060/lineup/';

  // public BASEURL: string = 'http://192.168.1.64:8080/';

  constructor(private http: HttpClient, private toast: ToastController) { }

  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error?.message}`;
    }
    //alert('Error al conectar con el servidor. Intente de nuevo.');
    return throwError(() => {
      return 'Error al conectar con el servidor.';
    });
  }



  // Modulo: Solicitudes Finanzas

  SR_getSolicitudesFinanzas_Pendientes(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/finanzas/SR_getSolicitudesFinanzas_Pendientes', data, options).pipe(retry(1), catchError(this.handleError));
  }

  SR_getSolicitudesFinanzas_Aprobadas(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/finanzas/SR_getSolicitudesFinanzas_Aprobadas', data, options).pipe(retry(1), catchError(this.handleError));
  }

  SR_getSolicitudesFinanzas_Depositadas(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/finanzas/SR_getSolicitudesFinanzas_Depositadas', data, options).pipe(retry(1), catchError(this.handleError));
  }

  SR_updateSolicitudesFinanzas_acciones(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/finanzas/SR_updateSolicitudesFinanzas_acciones', data, options).pipe(retry(1), catchError(this.handleError));
  }

  SR_getSolicitud_Detalles(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/finanzas/SR_getSolicitud_Detalles', data, options).pipe(retry(1), catchError(this.handleError));
  }

  SR_habilitarCheckbox(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/finanzas/SR_habilitarCheckbox', data, options).pipe(retry(1), catchError(this.handleError));
  }

  SR_getTotalConceptos(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/finanzas/SR_getTotalConceptos', data, options).pipe(retry(1), catchError(this.handleError));
  }

  SR_generarPDF_solicitud(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
      responseType: 'blob' as const,
    };
    return this.http.post(this.BASEURL + 'api/finanzas/SR_generarPDF_solicitud', data, options).pipe(retry(1), catchError(this.handleError));
  }

  SR_guardarConceptosSolicitados(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/finanzas/SR_guardarConceptosSolicitados', data, options).pipe(retry(1), catchError(this.handleError));
  }


//////////////////////////////////////////////////////////////////////////////
  // MDOULO: INFORMES REGISTRADOS

  IR_getInformes(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/finanzas/IR_getInformes', data, options).pipe(retry(1), catchError(this.handleError));
  }

  IR_getGastos(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/finanzas/IR_getGastos', data, options).pipe(retry(1), catchError(this.handleError));
  }

  IR_getDetallesGastos(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/finanzas/IR_getDetallesGastos', data, options).pipe(retry(1), catchError(this.handleError));
  }

  IR_gasto_acciones(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/finanzas/IR_gasto_acciones', data, options).pipe(retry(1), catchError(this.handleError));
  }

  IR_genera_pdf_comprobacion(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/finanzas/IR_genera_pdf_comprobacion', data, options).pipe(retry(1), catchError(this.handleError));
  }

  IR_gastoRegresar(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/finanzas/IR_gastoRegresar', data, options).pipe(retry(1), catchError(this.handleError));
  }

  IR_gastoDepositado(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/finanzas/IR_gastoDepositado', data, options).pipe(retry(1), catchError(this.handleError));
  }

  IR_gasto_montoAdeudo(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/finanzas/IR_gasto_montoAdeudo', data, options).pipe(retry(1), catchError(this.handleError));
  }

  IR_gastoOcultar(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/finanzas/IR_gastoOcultar', data, options).pipe(retry(1), catchError(this.handleError));
  }

  IR_gastoAnexos(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/finanzas/IR_gastoAnexos', data, options).pipe(retry(1), catchError(this.handleError));
  }


//////////////////////////////////////////////////////////////////////////////
  // MDOULO: SOLICITUDES EN DEPOSITO
  SD_getSolicitudes(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/finanzas/SD_getSolicitudes', data, options).pipe(retry(1), catchError(this.handleError));
  }


//////////////////////////////////////////////////////////////////////////////
  // MODULO: GENERAR EXTRACTO DE VIATICOS
  GE_generarArchivo(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
      responseType: 'blob' as const,
    };
    return this.http.post(this.BASEURL + 'api/finanzas/GE_generarArchivo', data, options);
  }

//////////////////////////////////////////////////////////////////////////////
  // MODULO: GENERAR EXTRACTO DE VIATICOS

  SVC_getColaboradores(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/finanzas/SVC_getColaboradores', data, options).pipe(retry(1), catchError(this.handleError));
  }

//////////////////////////////////////////////////////////////////////////////
  // MODULO: VIATICOS - HOSPEDAJES

  VH_getViaticosHospedaje(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/finanzas/VH_getViaticosHospedaje', data, options).pipe(retry(1), catchError(this.handleError));
  }

  VH_getServiciosReservaciones(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/finanzas/VH_getServiciosReservaciones', data, options).pipe(retry(1), catchError(this.handleError));
  }

  //////////////////////////////////////////////////////////////////////////////
    // MODULO: SERVICIOS - RESERVACIONES

    SR_guardarEncuesta(data: Object){
      const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
      return this.http.post(this.BASEURL + 'api/finanzas/SR_guardarEncuesta', data, options).pipe(retry(1), catchError(this.handleError));
    }


    // ACCIONES //
    SR_ACCIONES_editarServicio(data: Object){
      const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
      return this.http.post(this.BASEURL + 'api/finanzas/SR_ACCIONES_editarServicio', data, options).pipe(retry(1), catchError(this.handleError));
    }
    SR_ACCIONES_versionServicio(data: Object){
      const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
      return this.http.post(this.BASEURL + 'api/finanzas/SR_ACCIONES_versionServicio', data, options).pipe(retry(1), catchError(this.handleError));
    }
    SR_ACCIONES_eliminarDetalle(data: Object){
      const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
      return this.http.post(this.BASEURL + 'api/finanzas/SR_ACCIONES_eliminarDetalle', data, options).pipe(retry(1), catchError(this.handleError));
    }
    SR_ACCIONES_masCotizVuelos(data: Object){
      const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
      return this.http.post(this.BASEURL + 'api/finanzas/SR_ACCIONES_masCotizVuelos', data, options).pipe(retry(1), catchError(this.handleError));
    }
    SR_ACCIONES_recotizar(data: Object){
      const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
      return this.http.post(this.BASEURL + 'api/finanzas/SR_ACCIONES_recotizar', data, options).pipe(retry(1), catchError(this.handleError));
    }
    SR_ACCIONES_cancelarServicio(data: Object){
      const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
      return this.http.post(this.BASEURL + 'api/finanzas/SR_ACCIONES_cancelarServicio', data, options).pipe(retry(1), catchError(this.handleError));
    }
    SR_ACCIONES_reagendar(data: Object){
      const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
      return this.http.post(this.BASEURL + 'api/finanzas/SR_ACCIONES_reagendar', data, options).pipe(retry(1), catchError(this.handleError));
    }

    SR_selectCotizacion(data: Object){
      const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
      return this.http.post(this.BASEURL + 'api/finanzas/SR_selectCotizacion', data, options).pipe(retry(1), catchError(this.handleError));
    }
    SR_eliminarCotizacion(data: Object){
      const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
      return this.http.post(this.BASEURL + 'api/finanzas/SR_eliminarCotizacion', data, options).pipe(retry(1), catchError(this.handleError));
    }
    SR_verCotizaciones(data: Object){
      const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
      return this.http.post(this.BASEURL + 'api/finanzas/SR_verCotizaciones', data, options).pipe(retry(1), catchError(this.handleError));
    }
    SR_agregarCotizacion(data: Object){
      const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
      return this.http.post(this.BASEURL + 'api/finanzas/SR_agregarCotizacion', data, options).pipe(retry(1), catchError(this.handleError));
    }

    // VUELOS

    SR_verCompras(data: Object){
      const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
      return this.http.post(this.BASEURL + 'api/finanzas/SR_verCompras', data, options).pipe(retry(1), catchError(this.handleError));
    }
    SR_extraCompra(data: Object){
      const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
      return this.http.post(this.BASEURL + 'api/finanzas/SR_extraCompra', data, options).pipe(retry(1), catchError(this.handleError));
    }
    SR_borrarInfoCompra(data: Object){
      const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
      return this.http.post(this.BASEURL + 'api/finanzas/SR_borrarInfoCompra', data, options).pipe(retry(1), catchError(this.handleError));
    }
    SR_addFileVuelos(data: FormData){
      let token = localStorage.getItem('token') ? localStorage.getItem('token') : '';
      let options = {headers: new HttpHeaders()};

      return this.http.post(this.BASEURL + 'api/finanzas/SR_addFileVuelos', data, options).pipe(retry(1), catchError(this.handleError));
    }

    // HOSPEDAJE

    SR_enviarCompra(data: Object){
      const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
      return this.http.post(this.BASEURL + 'api/finanzas/SR_enviarCompra', data, options).pipe(retry(1), catchError(this.handleError));
    }
    SR_enviarCotizLider(data: Object){
      const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
      return this.http.post(this.BASEURL + 'api/finanzas/SR_enviarCotizLider', data, options).pipe(retry(1), catchError(this.handleError));
    }

    // MODALES

    SR_modals(data: Object){
      const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
      return this.http.post(this.BASEURL + 'api/finanzas/SR_modals', data, options).pipe(retry(1), catchError(this.handleError));
    }
    SR_modalsEstructura(data: Object){
      const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
      return this.http.post(this.BASEURL + 'api/finanzas/SR_modalsEstructura', data, options).pipe(retry(1), catchError(this.handleError));
    }
    SR_desgloseEscalas(data: Object){
      const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
      return this.http.post(this.BASEURL + 'api/finanzas/SR_desgloseEscalas', data, options).pipe(retry(1), catchError(this.handleError));
    }

  //alertas
  async createAlert(message: string, color: string = '') {
    const toast = await this.toast.create({ message: message, duration: 3000, color: color });
    return toast.present();
  }
}
