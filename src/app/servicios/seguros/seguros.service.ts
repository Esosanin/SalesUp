import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { catchError, retry, throwError } from 'rxjs';

const BASEURL: string = 'http://intranet.ecn.com.mx:8060/lineup/api/segurosFlotilla';

@Injectable({
  providedIn: 'root'
})
export class SegurosService {

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
      //return errorMessage;
    });
  }

  getRelacion(){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.get(BASEURL,options).pipe(retry(1), catchError(this.handleError));
  }

  async createAlert(message: string, color: string = '') {
    const toast = await this.toast.create({ message: message, duration: 3000, color: color });
    return toast.present();
  }
}
