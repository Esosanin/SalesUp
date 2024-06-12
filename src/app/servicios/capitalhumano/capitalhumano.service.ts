import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { catchError, retry, throwError } from 'rxjs';
import { Oferta } from 'src/app/model/OfertaLaboral/Oferta';

@Injectable({
  providedIn: 'root'
})
export class CapitalhumanoService {

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
      // return 'Error al conectar con el servidor.';
      return errorMessage;
    });
  }

  // Modulo: Areas

  getAreas(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/getAreas', data, options).pipe(retry(1), catchError(this.handleError));
  }

  editArea(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/editArea', data, options).pipe(retry(1), catchError(this.handleError));
  }

  createArea(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/createArea', data, options).pipe(retry(1), catchError(this.handleError));
  }

  deleteArea(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/deleteArea', data, options).pipe(retry(1), catchError(this.handleError));
  }

  // Modulo: Carreras

  getCarreras(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/getCarreras', data, options).pipe(retry(1), catchError(this.handleError));
  }

  createCarrera(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/createCarrera', data,  options).pipe(retry(1), catchError(this.handleError));
  }

  editCarrera(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/editCarrera', data,  options).pipe(retry(1), catchError(this.handleError));
  }

  deleteCarrera(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/deleteCarrera', data,  options).pipe(retry(1), catchError(this.handleError));
  }

  // Modulo: Departamentos

  getDepartamentos(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/getDepartamentos', data, options).pipe(retry(1), catchError(this.handleError));
  }

  createDepartamento(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/createDepartamento', data, options).pipe(retry(1), catchError(this.handleError));
  }

  editDepartamento(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/editDepartamento', data, options).pipe(retry(1), catchError(this.handleError));
  }

  deleteDepartamento(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/deleteDepartamento', data, options).pipe(retry(1), catchError(this.handleError));
  }

  // Modulo: Especialidades

  getEspecialidades(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/getEspecialidades', data, options).pipe(retry(1), catchError(this.handleError));
  }

  createEspecialidad(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/createEspecialidad', data,  options).pipe(retry(1), catchError(this.handleError));
  }

  editEspecialidad(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/editEspecialidad', data,  options).pipe(retry(1), catchError(this.handleError));
  }

  deleteEspecialidad(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/deleteEspecialidad', data,  options).pipe(retry(1), catchError(this.handleError));
  }

  // Modulo: Nacionalidades

  getNacionalidades(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/getNacionalidades', data, options).pipe(retry(1), catchError(this.handleError));
  }

  createNacionalidad(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/createNacionalidad', data,  options).pipe(retry(1), catchError(this.handleError));
  }

  editNacionalidad(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/editNacionalidad', data,  options).pipe(retry(1), catchError(this.handleError));
  }

  deleteNacionalidad(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/deleteNacionalidad', data,  options).pipe(retry(1), catchError(this.handleError));
  }

  // Modulo: Puestos

  getPuestos(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/getPuestos', data, options).pipe(retry(1), catchError(this.handleError));
  }

  createPuesto(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/createPuesto', data,  options).pipe(retry(1), catchError(this.handleError));
  }

  editPuesto(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/editPuesto', data,  options).pipe(retry(1), catchError(this.handleError));
  }

  deletePuesto(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/deletePuesto', data,  options).pipe(retry(1), catchError(this.handleError));
  }

  // Modulo: Regiones

  getRegiones(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/getRegiones', data, options).pipe(retry(1), catchError(this.handleError));
  }

  createRegion(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/createRegion', data,  options).pipe(retry(1), catchError(this.handleError));
  }

  editRegion(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/editRegion', data,  options).pipe(retry(1), catchError(this.handleError));
  }

  deleteRegion(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/deleteRegion', data,  options).pipe(retry(1), catchError(this.handleError));
  }

  // Modulo: Sucursales

  getSucursales(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/getSucursales', data, options).pipe(retry(1), catchError(this.handleError));
  }

  createSucursal(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/createSucursal', data,  options).pipe(retry(1), catchError(this.handleError));
  }

  editSucursal(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/editSucursal', data,  options).pipe(retry(1), catchError(this.handleError));
  }

  deleteSucursal(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/deleteSucursal', data,  options).pipe(retry(1), catchError(this.handleError));
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // MODULO: PROPUESTA SALARIAL

  // Modal siguiente paso  # Información General
  btnCrearPropuesta(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/crearPropuesta', data, options).pipe(retry(1), catchError(this.handleError));
  }

  // Tabla de propuestas en proceso # Pagina: tablas
  getPropuestas_proceso(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/getPropuestas_proceso', data, options).pipe(retry(1), catchError(this.handleError));
  }

  // Tabla de propuestas terminadas # Pagina: tablas
  getPropuestas_terminadas(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/getPropuestas_terminadas', data, options).pipe(retry(1), catchError(this.handleError));
  }

  // Modal siguiente paso (ion-select) # Pagina: tablas
  getColaboradores_propuesta(){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.get(this.BASEURL + 'api/areas/getColaboradores_propuesta', options).pipe(retry(1), catchError(this.handleError));
  }

  // Modal siguiente paso (ion-select) # Pagina: tablas
  getTipoEmpleado_propuesta(){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.get(this.BASEURL + 'api/areas/getTipoEmpleado_propuesta', options).pipe(retry(1), catchError(this.handleError));
  }

  // Modal siguiente paso (ion-select) # Pagina: tablas
  getPuestos_propuesta(){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.get(this.BASEURL + 'api/areas/getPuestos_propuesta', options).pipe(retry(1), catchError(this.handleError));
  }

  // Modal siguiente paso (ion-select) # Pagina: tablas
  getSucursales_propuesta(){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.get(this.BASEURL + 'api/areas/getSucursales_propuesta', options).pipe(retry(1), catchError(this.handleError));
  }

  // Modal siguiente paso (ion-select) # Pagina: tablas
  getDepartamentos_propuesta(){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.get(this.BASEURL + 'api/areas/getDepartamentos_propuesta', options).pipe(retry(1), catchError(this.handleError));
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // MODULO OFERTAS LABORALES

  getOfertas(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/getOfertas', data, options).pipe(retry(1), catchError(this.handleError));
  }

  Ofertas_getSelectAreas_Ofertas(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/Ofertas_getSelectAreas_Ofertas', data, options).pipe(retry(1), catchError(this.handleError));
  }

  Ofertas_getSelectPaises_Ofertas(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/Ofertas_getSelectPaises_Ofertas', data, options).pipe(retry(1), catchError(this.handleError));
  }

  Ofertas_getSelects(){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.get(this.BASEURL + 'api/areas/Ofertas_getSelects', options).pipe(retry(1), catchError(this.handleError));
  }

  Ofertas_getSelectCiudad(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/Ofertas_getSelectCiudad', data, options).pipe(retry(1), catchError(this.handleError));
  }

  Ofertas_publicarOferta(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/Ofertas_publicarOferta', data, options).pipe(retry(1), catchError(this.handleError));
  }

  Ofertas_getDetalleOferta(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/Ofertas_getDetalleOferta', data, options).pipe(retry(1), catchError(this.handleError));
  }

  Ofertas_actualizarOferta(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/Ofertas_actualizarOferta', data, options).pipe(retry(1), catchError(this.handleError));
  }

  Ofertas_verCurriculum(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/Ofertas_verCurriculum', data, options).pipe(retry(1), catchError(this.handleError));
  }

  // SUB-MODULO POSTULADOS

  oferta: Oferta = new Oferta();

  Ofertas_getPosFinSel(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/Ofertas_getPosFinSel', data, options).pipe(retry(1), catchError(this.handleError));
  }

  Ofertas_getFiltrosPostulados(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/Ofertas_getFiltrosPostulados', data, options).pipe(retry(1), catchError(this.handleError));
  }

  Ofertas_accionesPosFinSelOpciones(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/Ofertas_accionesPosFinSelOpciones', data, options).pipe(retry(1), catchError(this.handleError));
  }

  Ofertas_cambiarEstado(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/Ofertas_cambiarEstado', data, options).pipe(retry(1), catchError(this.handleError));
  }

  // SUB-MODULO USUARIOS

  Ofertas_getUsuarios(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/Ofertas_getUsuarios', data, options).pipe(retry(1), catchError(this.handleError));
  }

  Ofertas_getSelectPaises_Usuarios(){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.get(this.BASEURL + 'api/areas/Ofertas_getSelectPaises_Usuarios', options).pipe(retry(1), catchError(this.handleError));
  }

  Ofertas_onChangeEstado_Usuarios(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/Ofertas_onChangeEstado_Usuarios', data, options).pipe(retry(1), catchError(this.handleError));
  }

  // SUB-MODULO ESTADISTICAS

  Ofertas_misEstadisticas_Estadisticas(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/Ofertas_misEstadisticas_Estadisticas', data, options).pipe(retry(1), catchError(this.handleError));
  }

  // SUB-MODULO CONFIGURACION

  Ofertas_listsAIP_Configuracion(){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.get(this.BASEURL + 'api/areas/Ofertas_listsAIP_Configuracion', options).pipe(retry(1), catchError(this.handleError));
  }

  Ofertas_CRUD_Configuracion(data: Object){
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';
    const options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post(this.BASEURL + 'api/areas/Ofertas_CRUD_Configuracion', data, options).pipe(retry(1), catchError(this.handleError));
  }

  //alertas
  async createAlert(message: string, color: string = '') {
    const toast = await this.toast.create({ message: message, duration: 3000, color: color });
    return toast.present();
  }

}
