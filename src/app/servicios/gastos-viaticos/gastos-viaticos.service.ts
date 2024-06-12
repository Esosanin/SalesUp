import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { catchError, retry, throwError } from 'rxjs';

//const BASEURL: string = 'http://192.168.1.64:8080/api/gastos-viaticos/';

const BASEURL: string = 'http://intranet.ecn.com.mx:8060/lineup/api/gastos-viaticos/';

@Injectable({
  providedIn: 'root'
})
export class GastosViaticosService {

  constructor(private http: HttpClient, private toast:ToastController) { }

  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error?.message}`;
    }
    alert('Error al conectar con el servidor. Intente de nuevo.');
    return throwError(() => {
      //return 'Error al conectar con el servidor.';
      return errorMessage;
    });
  }

  mandarNotificacion(data: Object){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL+'mandarNotificacion',data, options)
    .pipe(retry(1), catchError(this.handleError));
  }

  // Mis solicitudes de gasto
  getSolicitudesGasto(id_colaborador: Object){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL+'getSolicitudesGasto',id_colaborador, options)
    .pipe(retry(1), catchError(this.handleError));
  }

  // Mis adeudos
  getAdeudos(data: Object){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL+'getAdeudos',data, options)
    .pipe(retry(1), catchError(this.handleError));
  }

  //anexos de adeudos

  verAnexoAdeudo(data: Object){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL+'verAnexoAdeudo',data, options)
    .pipe(retry(1), catchError(this.handleError));
  }

  //enviar anexo adeudo

  saveAnexoAdeudo(data: FormData){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL+'saveAnexoAdeudo',data, options)
    .pipe(retry(1), catchError(this.handleError));
  }

  //Informe

  getGastoInforme(datos: Object){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL+'getGastoInforme',datos, options)
    .pipe(retry(1), catchError(this.handleError));
  }

  //obtener anexo xml para descarga directa

  getXML(urlFile: string){
    const token = localStorage.getItem('token');
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
      responseType: 'blob' as const
    };

    return this.http.get(urlFile, options)
    .pipe(retry(1), catchError(this.handleError));
  }

  //terminar informe

  terminarInforme(datos: Object){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL+'terminarInforme',datos, options)
    .pipe(retry(1), catchError(this.handleError));
  }


  //detalles del informe

  getDetalleInforme(datos: Object){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL+'getDetalleInforme',datos, options)
    .pipe(retry(1), catchError(this.handleError));
  }

  //detalles de la solicitud
  getDetalleSolicitud(sol_id: Object){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL+'getDetalleSolicitud',sol_id, options)
    .pipe(retry(1), catchError(this.handleError));
  }

  //get tipos de gasto
  getTipoGasto(){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.get<Array<any>>(BASEURL+'getTipoGasto', options)
    .pipe(retry(1), catchError(this.handleError));
  }

  //guardar gasto

  saveGasto(datos: Object){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL+'saveGasto',datos, options)
    .pipe(retry(1), catchError(this.handleError));
  }

  //eliminar gasto
  deleteGasto(id_gasto: Object){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL+'deleteGasto',id_gasto, options)
    .pipe(retry(1), catchError(this.handleError));
  }

  //generación de pdf de solicitud de gastos
  generarPDF(sol_id: Object){
    const token = localStorage.getItem('token');
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
      responseType: 'blob' as const
    };

    return this.http.post(BASEURL+'generarPDF',sol_id, options)
    .pipe(retry(1), catchError(this.handleError));
  }

  //enviar a revisión
  enviarRevision(sol_id: Object){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL+'enviarRevision',sol_id, options)
    .pipe(retry(1), catchError(this.handleError));
  }

  //crear informe de solicitud de gasto
  crearInforme(sol_id: Object){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL+'crearInforme',sol_id, options)
    .pipe(retry(1), catchError(this.handleError));
  }

  //registrar comprobante xml
  subirXML(datos: FormData){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL+'subirXML',datos, options)
    .pipe(retry(1), catchError(this.handleError));
  }

  comprobarGasto(datos: FormData){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL+'comprobarGasto',datos, options)
    .pipe(retry(1), catchError(this.handleError));
  }

  //cancelar comprobación de gasto, eliminar anexo y factura
  cancelGasto(datos: Object){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL+'cancelGasto',datos, options)
    .pipe(retry(1), catchError(this.handleError));
  }

  async createAlert(message: string, color: string = '') {
    const toast = await this.toast.create({ message: message, duration: 3000, color: color });
    return toast.present();
  }
}
