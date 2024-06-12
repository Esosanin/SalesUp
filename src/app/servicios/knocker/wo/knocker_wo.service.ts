import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { catchError, retry, throwError } from 'rxjs';
//import { FormMacro } from 'src/app/model/VacacionesForm';
import { FormFactAntiComp } from 'src/app/model/projectdone/WOAntiFactComp';
import { FormFactAntiParc } from 'src/app/model/projectdone/WOAntiFactComp';
import { FormWOHistComent } from 'src/app/model/projectdone/WOAntiFactComp';
import { FormFechaConfirmada } from 'src/app/model/projectdone/WOAntiFactComp';
import { formFechaTerminacion } from 'src/app/model/projectdone/WOAntiFactComp';
import { formCancelarOT } from 'src/app/model/projectdone/WOAntiFactComp';
import { formEjecutarOT } from 'src/app/model/projectdone/WOAntiFactComp';
import { formSugerenciaOT } from 'src/app/model/projectdone/WOAntiFactComp';
import { formRecursosEncuesta } from 'src/app/model/projectdone/WOAntiFactComp';

@Injectable({
  providedIn: 'root'
})
export class KnockerWO {

  //public BASEURL: string = 'http://192.168.1.64:8080/';
  public BASEURL: string = 'http://intranet.ecn.com.mx:8060/lineup/';


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
    alert('Error al conectar con el servidor. Intente de nuevo.');
    return throwError(() => {
      return 'Error al conectar con el servidor.';
    });
  }

  getdatoknockerpermiso(json: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post<Array<Object>>(this.BASEURL + 'api/KnockerWO/traerdatoknockerpermiso',json,options).pipe(retry(1), catchError(this.handleError));
  }
  getproyectoswoabiertos(json: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post<Array<Object>>(this.BASEURL + 'api/KnockerWO/traerproyectoswoabiertos',json,options).pipe(retry(1), catchError(this.handleError));
  }
  getproyectoswocerrados(json: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post<Array<Object>>(this.BASEURL + 'api/KnockerWO/traerproyectoswocerrados',json,options).pipe(retry(1), catchError(this.handleError));
  }
  getWODatosDetalleProyectoOK(json: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post<Array<Object>>(this.BASEURL + 'api/KnockerWO/traerWODatosDetalleProyectoOK',json,options).pipe(retry(1), catchError(this.handleError));
  }
  getWODatosDetalleHistComentarios(json: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post<Array<Object>>(this.BASEURL + 'api/KnockerWO/traerWODatosDetalleHistComentarios',json,options).pipe(retry(1), catchError(this.handleError));
  }
  getWODatosDetalleArchivosCot(json: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post<Array<Object>>(this.BASEURL + 'api/KnockerWO/traerWODatosDetalleArchivosCot',json,options).pipe(retry(1), catchError(this.handleError));
  }
  getWODatosDetalleArchivosOCP(json: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post<Array<Object>>(this.BASEURL + 'api/KnockerWO/traerWODatosDetalleArchivosOCP',json,options).pipe(retry(1), catchError(this.handleError));
  }
  getWOPermisos(json: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post<Array<Object>>(this.BASEURL + 'api/KnockerWO/traerWOPermisos',json,options).pipe(retry(1), catchError(this.handleError));
  }
  getWODetalle(json: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post<Array<Object>>(this.BASEURL + 'api/KnockerWO/traerWODatosDetalle',json,options).pipe(retry(1), catchError(this.handleError));
  }
  getWOHistComentsOT(json: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post<Array<Object>>(this.BASEURL + 'api/KnockerWO/traerWoHistComentsOT',json,options).pipe(retry(1), catchError(this.handleError));
  }
  getOTAttachments(json: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post<Array<Object>>(this.BASEURL + 'api/KnockerWO/traerOTAttachments',json,options).pipe(retry(1), catchError(this.handleError));
  }
  getOTAnexosWO(json: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post<Array<Object>>(this.BASEURL + 'api/KnockerWO/traerAnexosWO',json,options).pipe(retry(1), catchError(this.handleError));
  }
  sendAntiFactCompleto(data: FormFactAntiComp) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/KnockerWO/mandarFormFactAntiComp', data, options).pipe(retry(1), catchError(this.handleError));
  }
  sendAntiFactParcial(data: FormFactAntiParc) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/KnockerWO/mandarFormFactAntiParc', data, options).pipe(retry(1), catchError(this.handleError));
  }
  sendComentariosHistorial(data: FormWOHistComent) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/KnockerWO/mandarFormComentarioHist', data, options).pipe(retry(1), catchError(this.handleError));
  }
  sendFechaConfirmada(data: FormFechaConfirmada) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/KnockerWO/mandarFormFechaConfirmada', data, options).pipe(retry(1), catchError(this.handleError));
  }
  sendFechaTerminacion(data: formFechaTerminacion) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/KnockerWO/mandarFormFechaTerminacion', data, options).pipe(retry(1), catchError(this.handleError));
  }
  sendComentariosCancelarOT(data: formCancelarOT) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/KnockerWO/mandarComentariosCancelarOT', data, options).pipe(retry(1), catchError(this.handleError));
  }
  sendTerminarFactCompleto(data: FormFactAntiComp) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/KnockerWO/mandarFormTermFactComp', data, options).pipe(retry(1), catchError(this.handleError));
  }
  sendTerminarFactParcial(data: FormFactAntiParc) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/KnockerWO/mandarFormTermFactParc', data, options).pipe(retry(1), catchError(this.handleError));
  }
  backEPWO(json: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post<Array<Object>>(this.BASEURL + 'api/KnockerWO/regresarEPWO',json,options).pipe(retry(1), catchError(this.handleError));
  }
  ejecutarWO(data: formEjecutarOT) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/KnockerWO/mandarFormEjecutarOT', data, options).pipe(retry(1), catchError(this.handleError));
  }
  getSurveyComent(json: Object) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/KnockerWO/traerEncuestaComentarios', json, options).pipe(retry(1), catchError(this.handleError));
  }
  formSurvSugerenciaOT(data: formSugerenciaOT) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/KnockerWO/mandarEncuestaSugerenciaOT', data, options).pipe(retry(1), catchError(this.handleError));
  }
  getPersonasPorEvaluarWO(json: Object) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/KnockerWO/traerPersonasPorEvaluar', json, options).pipe(retry(1), catchError(this.handleError));
  }
  getEvaluacionAvgWO(json: Object) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/KnockerWO/traerEvaluacionProm', json, options).pipe(retry(1), catchError(this.handleError));
  }
  sendRecursosEncuestaWO(data: formRecursosEncuesta) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/KnockerWO/mandarRecursosEncuesta', data, options).pipe(retry(1), catchError(this.handleError));
  }
  getEvaluacionesEncuestWO(json: Object) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/KnockerWO/traerEvaluacionesEncuesta', json, options).pipe(retry(1), catchError(this.handleError));
  }
  borrarAnexoOT(json: Object) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    //return this.http.post(this.BASEURL + 'api/KnockerWO/traerEvaluacionesEncuesta', json, options).pipe(retry(1), catchError(this.handleError));
    return this.http.post<Array<Object>>(this.BASEURL+'api/KnockerWO/borrarArchivoAdjuntoOT',json,options).pipe(retry(1), catchError(this.handleError));
  }




  nuevaSolicitud(json: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post<Array<Object>>(this.BASEURL + 'api/KnockerWO/nuevo',json,options).pipe(retry(1), catchError(this.handleError));
  }





    //alertas
    async createAlert(message: string, color: string = '') {
      const toast = await this.toast.create({ message: message, duration: 3000, color: color });
      return toast.present();
    }

}
