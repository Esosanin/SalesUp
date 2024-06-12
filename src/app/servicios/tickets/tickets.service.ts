import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { catchError, retry, throwError } from 'rxjs';

const BASEURL: string = 'http://intranet.ecn.com.mx:8060/lineup/api/tickets/';
//const BASEURL: string = 'http://192.168.1.64:8080/api/tickets/';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

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

  getTicketsUsuario(json: Object){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<Array<any>>(BASEURL+'ticketsUsuario',json, options).pipe(retry(1), catchError(this.handleError));
  }
  getArchivos(json: Object){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<Array<any>>(BASEURL+'archivos',json, options).pipe(retry(1), catchError(this.handleError));
  }
  getAreas(){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.get<Array<any>>(BASEURL+'areas', options).pipe(retry(1), catchError(this.handleError));
  }

  getCategorias(id_area: number){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<Array<any>>(BASEURL+'categorias',id_area, options).pipe(retry(1), catchError(this.handleError));
  }
  nuevaSolicitud(data: FormData){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL + 'nuevo',data, options).pipe(retry(1), catchError(this.handleError));
  }

  //tickets del colaborador
  getTicketsTI(id_colaborador: Object){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<Array<any>>(BASEURL+'ticketsTI',id_colaborador, options).pipe(retry(1), catchError(this.handleError));
  }

  //detalles del ticket
  getTicketTI(id_ticket: Object){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL+'ticketTI',id_ticket, options).pipe(retry(1), catchError(this.handleError));
  }

  getCategoriasTI(){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.get<Array<any>>(BASEURL + 'getCategoriasTI', options).pipe(retry(1), catchError(this.handleError));
  }

  getColaboradores(){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.get<Array<any>>(BASEURL + 'getColaboradores', options).pipe(retry(1), catchError(this.handleError));
  }

  createTicketTI(ticketData: FormData){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL+'createTicketTI',ticketData, options).pipe(retry(1), catchError(this.handleError));
  }

  async createAlert(message: string, color: string = '') {
    const toast = await this.toast.create({ message: message, duration: 3000, color: color });
    return toast.present();
  }
}
