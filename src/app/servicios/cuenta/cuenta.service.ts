import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { catchError, Observable, retry, throwError } from 'rxjs';

 const BASEURL: string =
   'http://intranet.ecn.com.mx:8060/lineup/api/colaboradores/';

//const BASEURL: string = 'http://192.168.1.64:8080/api/colaboradores/';

@Injectable({
  providedIn: 'root',
})
export class CuentaService {
  public segment: string = 'tickets';

  public propuesta_id: number = 0;
  public titlePropuesta: string = '';
  public segmentCapitalHumano: string = '';
  BASEURL: string = 'http://intranet.ecn.com.mx:8060/lineup/';

  constructor(private http: HttpClient, private toast: ToastController) {}

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
      // return 'Error al conectar con el servidor.';
      return errorMessage;
    });
  }

  getPropuesta_porID(data: Object) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(
      this.BASEURL + 'api/areas/getPropuesta_porID',
      data,
      options
    ).pipe(retry(1), catchError(this.handleError));
  }

  btnGuardarInformacion(data: Object) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(
      this.BASEURL + 'api/areas/updateGuardarInformacion',
      data,
      options
    ).pipe(retry(1), catchError(this.handleError));
  }

  btnEliminarSolicitud(data: Object) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(
      this.BASEURL + 'api/areas/updateEliminarSolicitud',
      data,
      options
    ).pipe(retry(1), catchError(this.handleError));
  }

  btnNuevaPropuesta(data: Object) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(
      this.BASEURL + 'api/areas/NuevaPropuesta',
      data,
      options
    ).pipe(retry(1), catchError(this.handleError));
  }

  getTabId_niveles(data: Object) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(
      this.BASEURL + 'api/areas/getTabId_niveles',
      data,
      options
    ).pipe(retry(1), catchError(this.handleError));
  }

  getHojaEspecialidades() {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.get(
      this.BASEURL + 'api/areas/getHojaEspecialidades',
      options
    ).pipe(retry(1), catchError(this.handleError));
  }

  getHojaPosicionApoyo(data: Object) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(
      this.BASEURL + 'api/areas/getHojaPosicionApoyo',
      data,
      options
    ).pipe(retry(1), catchError(this.handleError));
  }

  getHojaSucursal_Aumento(data: Object) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(
      this.BASEURL + 'api/areas/getHojaSucursal_Aumento',
      data,
      options
    ).pipe(retry(1), catchError(this.handleError));
  }

  getHojaCategorias(data: Object) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(
      this.BASEURL + 'api/areas/getHojaCategorias',
      data,
      options
    ).pipe(retry(1), catchError(this.handleError));
  }

  getPropuestaDefinitiva(data: Object) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(
      this.BASEURL + 'api/areas/getPropuestaDefinitiva',
      data,
      options
    ).pipe(retry(1), catchError(this.handleError));
  }

  generatePropuestaSalarialDefinitivaPDF(data: Object) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
      responseType: 'blob' as const,
    };

    return this.http.post(
      this.BASEURL + 'api/areas/generatePropuestaSalarialDefinitivaPDF',
      data,
      options
    ).pipe(retry(1), catchError(this.handleError));
  }

  btnEliminarPropuesta(data: Object) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(
      this.BASEURL + 'api/areas/eliminarPropuesta',
      data,
      options
    ).pipe(retry(1), catchError(this.handleError));
  }

  btnAgregarPropuestaDefinitiva(data: Object) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(
      this.BASEURL + 'api/areas/agregarPropuestaDefinitiva',
      data,
      options
    ).pipe(retry(1), catchError(this.handleError));
  }

  btnActualizarColaborador(data: Object) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(
      this.BASEURL + 'api/areas/updateActualizarColaborador',
      data,
      options
    ).pipe(retry(1), catchError(this.handleError));
  }

  generatePDF(id_colaborador: number): Observable<Blob> {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
      responseType: 'blob' as const,
    };

    return this.http
      .get(BASEURL + 'generatePDF/' + id_colaborador, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  getColaborador(id_colaborador: number): Observable<any> {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };

    return this.http
      .get<any>(BASEURL + 'getColaborador/' + id_colaborador, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  generateExcel(data: Object) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };

    return this.http
      .post(BASEURL + 'generateExcel', data, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  getNacionalidades(): Observable<any> {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };

    return this.http
      .get(BASEURL + 'getNacionalidades', options)
      .pipe(retry(1), catchError(this.handleError));
  }
  getDepartamentos(): Observable<any> {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };

    return this.http
      .get(BASEURL + 'getDepartamentos', options)
      .pipe(retry(1), catchError(this.handleError));
  }
  getGeografias(): Observable<any> {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };

    return this.http
      .get(BASEURL + 'getGeografias', options)
      .pipe(retry(1), catchError(this.handleError));
  }
  getPuestos(): Observable<any> {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };

    return this.http
      .get(BASEURL + 'getPuestos', options)
      .pipe(retry(1), catchError(this.handleError));
  }
  getEspecialidades(): Observable<any> {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };

    return this.http
      .get(BASEURL + 'getEspecialidades', options)
      .pipe(retry(1), catchError(this.handleError));
  }
  getSucursales(): Observable<any> {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };

    return this.http
      .get(BASEURL + 'getSucursales', options)
      .pipe(retry(1), catchError(this.handleError));
  }
  getTipoEmpleado(): Observable<any> {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };

    return this.http
      .get(BASEURL + 'getTipoEmpleado', options)
      .pipe(retry(1), catchError(this.handleError));
  }
  getCarreras(): Observable<any> {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };

    return this.http
      .get(BASEURL + 'getCarreras', options)
      .pipe(retry(1), catchError(this.handleError));
  }
  getEstudios(): Observable<any> {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };

    return this.http
      .get(BASEURL + 'getEstudios', options)
      .pipe(retry(1), catchError(this.handleError));
  }

  getSangre(): Observable<any> {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };

    return this.http
      .get<any>(BASEURL + 'getSangre', options)
      .pipe(retry(1), catchError(this.handleError));
  }

  saveColaborador(datos: FormData) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };

    return this.http
      .post(BASEURL + 'saveColaborador', datos, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  getColaboradores() {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };

    return this.http
      .get<any>(BASEURL + 'getAll', options)
      .pipe(retry(1), catchError(this.handleError));
  }

  getHojaEspecialidad(): Observable<any> {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };

    return this.http
      .get(BASEURL + 'getHojaEspecialidad', options)
      .pipe(retry(1), catchError(this.handleError));
  }

  //alertas
  public async createAlert(message: string, color: string = '') {
    const toast = await this.toast.create({
      message: message,
      duration: 3000,
      color: color,
    });
    return toast.present();
  }
}
