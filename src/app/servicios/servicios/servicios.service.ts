import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { catchError, retry, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  public BASEURL: string = 'http://intranet.ecn.com.mx:8060/lineup/api/';

  //public BASEURL: string = 'http://192.168.1.64:8080/api/';

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

  // CONEXIÓN A SAP SERVER
  Reporteservicio_consulta(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'servicios/Reporteservicio_consulta', data, options).pipe(retry(1), catchError(this.handleError));
  }

  Embudo_getEmbudo(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'servicios/Embudo_getEmbudo', data, options).pipe(retry(1), catchError(this.handleError));
  }

  Embudo_getCotizacion(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'servicios/Embudo_getCotizacion', data, options).pipe(retry(1), catchError(this.handleError));
  }

  // CONEXIÓN A SAP SERVER
  Embudo_getSelectBitrix(){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.get(this.BASEURL + 'servicios/Embudo_getSelectBitrix', options).pipe(retry(1), catchError(this.handleError));
  }

  // CONEXIÓN A SAP SERVER
  Embudo_updateQuotation(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'servicios/Embudo_updateQuotation', data, options).pipe(retry(1), catchError(this.handleError));
  }

  createPDF(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
      responseType: 'blob' as const,
    };
    return this.http.post(this.BASEURL + 'servicios/createPDF', data, options);
  }

  createXLS(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
      responseType: 'blob' as const,
    };
    return this.http.post(this.BASEURL + 'servicios/createXLS', data, options);
  }

  //alertas
  async createAlert(message: string, color: string = '') {
    const toast = await this.toast.create({ message: message, duration: 3000, color: color });
    return toast.present();
  }

}
