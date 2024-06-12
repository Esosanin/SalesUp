import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Observable, catchError } from 'rxjs';

const BASEURL: string = 'http://intranet.ecn.com.mx:8060/lineup/api/colaboradores/';
const AUTH: string = 'http://intranet.ecn.com.mx:8060/lineup/auth/';

//const BASEURL: string = 'http://192.168.1.64:8080/api/colaboradores/';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  nombres: string | null = localStorage.getItem('nombres') ? localStorage.getItem('nombres') : '';
  fotosUrl: string = 'http://intranet.ecn.com.mx:8060/intranet/photo/';
  //fotosUrl: string = 'http://192.168.1.64:8080/images/foto_colaborador/';
  foto: string = localStorage.getItem('foto') ? this.fotosUrl + localStorage.getItem('foto') : this.fotosUrl + 'default.png';
  constructor(private http: HttpClient, private toast: ToastController) {
  }

  //checar token

  tokenCheck(data: Object){
    return this.http.post<any>(AUTH+'tokenCheck', data);
  }

  //enviar datos de inicio de sesión

  login(data: Object) {
    return this.http.post<any>(AUTH+'login', data);
  }

  recoverPass(data: Object){
    return this.http.post<any>(AUTH+'recoverPass', data);
  }

  recover(data: Object){
    return this.http.post<any>(AUTH+'recover', data);
  }

  verifyPass(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL + 'verifyPass', data, options);
  }

  //obtener proyectos mostrados en el checkin

  getProyectos() {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.get(BASEURL + 'proyectos', options);
  }

  getColaboradoresSemanales(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL + 'semanales', data, options);

  }

  //checar desde el login

  checkIn(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL + 'checada', data, options);
  }

  //alertas
  async createAlert(message: string, color: string = '') {
    const toast = await this.toast.create({ message: message, duration: 3000, color: color });
    return toast.present();
  }

  //verificar si hay checadas en el dia de hoy
  checkExists(data: Object): Observable<any> {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL + 'check', data, options).pipe(
      catchError(() => {
        this.createAlert('Error al conectar con el servidor, intente de nuevo.','danger');
        throw 'err';
      })
    );
  }
}
