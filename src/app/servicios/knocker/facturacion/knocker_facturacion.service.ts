import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { catchError, retry, throwError } from 'rxjs';
import { FormMacro } from 'src/app/model/vacaciones/VacacionesForm';
import { FormMacroD } from 'src/app/model/vacaciones/VacacionesForm';
import { FormMacroV } from 'src/app/model/vacaciones/VacacionesForm';

@Injectable({
  providedIn: 'root'
})
export class VacacionesService {

  //public BASEURL: string = 'http://192.168.1.64:8080/';
  public BASEURL: string = 'http://intranet.ecn.com.mx:8060/lineup/';


  //public segment: string = 'RptMacro';

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

  getMiInfo(json: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    //return this.http.get(this.BASEURL + 'api/ProcesosSoporteVacaciones/traerMisSolicitudes',json,options).pipe(retry(1), catchError(this.handleError));
    return this.http.post<Array<Object>>(this.BASEURL + 'api/ProcesosSoporteVacaciones/traerMiInfo',json,options).pipe(retry(1), catchError(this.handleError));
  }
  getMisSolicitudes(json: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    //return this.http.get(this.BASEURL + 'api/ProcesosSoporteVacaciones/traerMisSolicitudes',json,options).pipe(retry(1), catchError(this.handleError));
    return this.http.post<Array<Object>>(this.BASEURL + 'api/ProcesosSoporteVacaciones/traerMisSolicitudes',json,options).pipe(retry(1), catchError(this.handleError));
  }
  getMisSolicitudesPendientes(json: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    //return this.http.get(this.BASEURL + 'api/ProcesosSoporteVacaciones/traerMisSolicitudes',json,options).pipe(retry(1), catchError(this.handleError));
    return this.http.post<Array<Object>>(this.BASEURL + 'api/ProcesosSoporteVacaciones/traerMisSolicitudesPendientes',json,options).pipe(retry(1), catchError(this.handleError));
  }
  getMisSolicitudesPendientesAprobar(json: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    //return this.http.get(this.BASEURL + 'api/ProcesosSoporteVacaciones/traerMisSolicitudes',json,options).pipe(retry(1), catchError(this.handleError));
    return this.http.post<Array<Object>>(this.BASEURL + 'api/ProcesosSoporteVacaciones/traerMisSolicitudesPorAprobar',json,options).pipe(retry(1), catchError(this.handleError));
  }
  getMisSolicitudesPendientesAprobarCH(json: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    //return this.http.get(this.BASEURL + 'api/ProcesosSoporteVacaciones/traerMisSolicitudes',json,options).pipe(retry(1), catchError(this.handleError));
    return this.http.post<Array<Object>>(this.BASEURL + 'api/ProcesosSoporteVacaciones/traerMisSolicitudesPorAprobarCH',json,options).pipe(retry(1), catchError(this.handleError));
  }
  /*getDescansoFormpagets(data: FormDescansos) {
    return this.http.post(this.BASEURL + 'api/ProcesosSoporteVacaciones/descansosFormulario', data, options).pipe(retry(1), catchError(this.handleError));
  }
  getVacacionFormpagets(data: FormVacaciones) {
    return this.http.post(this.BASEURL + 'api/ProcesosSoporteVacaciones/vacacionesFormulario', data, options).pipe(retry(1), catchError(this.handleError));
  }*/
  /*getPermisoFormpagets(data: FormPermisos) {
    return this.http.post(this.BASEURL + 'api/ProcesosSoporteVacaciones/permisosFormulario', data, options).pipe(retry(1), catchError(this.handleError));
  } */
  // getPermisoFormpagets con este se envian los datos del form y se trae la info de respuesta
  getMacroFormserv(data: FormMacro) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/ProcesosSoporteVacaciones/macroFormulario', data, options).pipe(retry(1), catchError(this.handleError));
  }
  getMacroFormservD(data: FormMacroD) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/ProcesosSoporteVacaciones/macroFormularioD', data, options).pipe(retry(1), catchError(this.handleError));
  }
  getMacroFormservV(data: FormMacroV) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/ProcesosSoporteVacaciones/macroFormularioV', data, options).pipe(retry(1), catchError(this.handleError));
  }
  cancelarsolicitudvacaciones(json: Object)
  {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post<Array<Object>>(this.BASEURL+'api/ProcesosSoporteVacaciones/cancelarsolicitudVM',json,options).pipe(retry(1), catchError(this.handleError));
  }
  aprobarLider(json: Object)
  {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post<Array<Object>>(this.BASEURL+'api/ProcesosSoporteVacaciones/aprobarLider',json,options).pipe(retry(1), catchError(this.handleError));
  }
  aprobarconsueldoLider(json: Object)
  {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post<Array<Object>>(this.BASEURL+'api/ProcesosSoporteVacaciones/aprobarconsueldoLider',json,options).pipe(retry(1), catchError(this.handleError));
  }
  aprobarsinsueldoLider(json: Object)
  {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post<Array<Object>>(this.BASEURL+'api/ProcesosSoporteVacaciones/aprobarsinsueldoLider',json,options).pipe(retry(1), catchError(this.handleError));
  }
  rechazarLider(json: Object)
  {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post<Array<Object>>(this.BASEURL+'api/ProcesosSoporteVacaciones/rechazarLider',json,options).pipe(retry(1), catchError(this.handleError));
  }
  aprobarCapHum(json: Object)
  {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post<Array<Object>>(this.BASEURL+'api/ProcesosSoporteVacaciones/aprobarCapHum',json,options).pipe(retry(1), catchError(this.handleError));
  }
  rechazarCapHum(json: Object)
  {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post<Array<Object>>(this.BASEURL+'api/ProcesosSoporteVacaciones/rechazarCapHum',json,options).pipe(retry(1), catchError(this.handleError));
  }
  /*getmacro(){
    return this.http.get(this.BASEURL + 'api/ProcesosSoporteVacaciones/traerMacro',options).pipe(retry(1), catchError(this.handleError));
  }*/

    //alertas
    async createAlert(message: string, color: string = '') {
      const toast = await this.toast.create({ message: message, duration: 3000, color: color });
      return toast.present();
    }

}
