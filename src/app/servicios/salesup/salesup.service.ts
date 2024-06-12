import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';


//const BASEURL: string = 'http://192.168.1.64:8080/api/salesup/';
const BASEURL: string = 'http://intranet.ecn.com.mx:8060/lineup/api/salesup/';

@Injectable({
  providedIn: 'root'
})
export class SalesupService {

  public confirm: boolean = false;

  public units = '';
  public inner = '';
  public title = '';

  constructor(private http: HttpClient,
    private toast: ToastController) {
  }

  //MAS OPCIONES

  altaVendedor(data: Object){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL + 'opciones/altaVendedor', data, options);
  }

  getVendedoresSinRegistrar() {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.get<any>(BASEURL + 'opciones/getVendedoresSinRegistrar', options);
  }

  deleteOportunidad(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL + 'opciones/deleteOportunidad', data, options);
  }

  getOportunidades(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL + 'opciones/getOportunidades',data, options);
  }

  getMetas(data: Object){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL + 'opciones/getMetas',data, options);
  }

  deleteMeta(data: Object){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL + 'opciones/deleteMeta',data, options);
  }

  saveMeta(data: Object){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL + 'opciones/saveMeta',data, options);
  }



  //PLANES SEMANALES Y MENSUALES

  getSucursales(data: Object){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL+'planes/getSucursales',data, options);
  }

  updateCot(data: FormData){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>('http://intranet.ecn.com.mx:8060/intranet/php/Dashboard_Funel/ws_methods.php',data, options);
  }

  getDetallesCot(data: FormData){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>('http://intranet.ecn.com.mx:8060/intranet/php/Dashboard_Funel/ws_methods.php',data, options);
  }

  getInfo(data: FormData){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>('http://intranet.ecn.com.mx:8060/intranet/php/Dashboard_Funel/ws_methods.php',data, options);
  }

  getEtapas(){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.get<any>(BASEURL + 'planes/getEtapas', options);
  }

  deleteImagen(data: Object){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL + 'planes/deleteImagen',data, options);
  }

  saveImagenLevantamiento(formData: FormData){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL + 'planes/saveImagenLevantamiento',formData, options);
  }

  getImgLevantamiento(id_levantamiento: number){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.get<any>(BASEURL + 'planes/getImgLevantamiento/'+id_levantamiento, options);
  }

  getCotizaciones(slpcode: number){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.get<any>(BASEURL + 'planes/getCotizaciones/'+slpcode, options).pipe();
  }

  actualizarProy(data: Object){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL + 'planes/actualizarProy', data, options);
  }

  saveContacto(data: Object){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL + 'planes/saveContacto', data, options);
  }

  saveCuenta(data: Object){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL + 'planes/saveCuenta', data, options);
  }

  getSpk1() {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.get<any>(BASEURL + 'planes/getSpk1', options);
  }

  addOportunidad(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL + 'planes/addOportunidad',data, options);
  }

  getIndustrias() {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.get<any>(BASEURL + 'planes/getIndustrias', options);
  }

  //confirmar plan semanal

  confirmPlan(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL + 'planes/confirmPlan', data, options);
  }

  //checar si ya hay un plan semanal activo
  checkPlan(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL + 'planes/checkPlan', data, options);
  }

  //registrar plan semanal
  addPlan(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL + 'planes/addPlan', data, options);
  }

  //hacer checkin a visita
  checkIn(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL + 'planes/checkIn', data, options);
  }

  //ejecutar actividad
  execActividad(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL + 'planes/execActividad', data, options);
  }
  //finalizar compromiso
  execCompromiso(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL + 'planes/execCompromiso', data, options);
  }


  //checar si ya se ejecutaron todas las actividades
  checkActividades(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL + 'planes/checkActividades', data, options);
  }

  //checar si ya hay checkin en una visita

  checkCheckIn(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL + 'planes/checkCheckIn', data, options);
  }

  //obtener planes semanales
  getPlanes(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL + 'planes/getPlanes', data, options);
  }

  //obtener las zonas

  getZonas(): Observable<any> {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.get(BASEURL + 'planes/getZonas', options);
  }

  //obtener visitas del plan seleccionado
  getVisitas(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL + 'planes/getVisitas', data, options);
  }

  //obtener actividades de la visita seleccionada
  getActividades(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL + 'planes/getActividades', data, options);
  }

  //obtener compromisos de la actividad seleccionada
  getCompromisos(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL + 'planes/getCompromisos', data, options);
  }

  //obtener levantamientos de la actividad seleccionada
  getLevantamientos(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL + 'planes/getLevantamientos', data, options);
  }

  //obtener detalles de cuenta

  getDataCuenta(id: string){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.get<any>(BASEURL + 'planes/getCuenta/' + id, options);
  }

  //obtener las cuentas del vendedor activo
  getCuentas(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL + 'planes/getCuentas', data, options);
  }

  getActividad(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL + 'planes/getActividad', data, options);
  }

  addVisita(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL + 'planes/addVisita', data, options);
  }
  addCompromiso(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL + 'planes/addCompromiso', data, options);
  }
  getAcompanamientos(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL + 'planes/getAcompanamientos', data, options);
  }


  getVendedores(data: Object): Observable<any> {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL + 'planes/getVendedores',data, options);
  }

  addAcompanamiento(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL + 'planes/addAcompanamiento', data, options);
  }
  addLevantamiento(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL + 'planes/addLevantamiento', data, options);
  }

  getContactos(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL + 'planes/getContactos', data, options);
  }

  deleteVisita(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL + 'planes/deleteVisita', data, options);
  }

  deleteActividad(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL + 'planes/deleteActividad', data, options);
  }

  addActividad(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL + 'planes/addActividad', data, options);
  }
  deleteLevantamiento(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL + 'planes/deleteLevantamiento', data, options);
  }
  deleteAcompanamiento(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL + 'planes/deleteAcompanamiento', data, options);
  }
  deleteCompromiso(data: Object) {
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post(BASEURL + 'planes/deleteCompromiso', data, options);
  }

  getPonderado(datos: Object){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL + 'planes/getPonderado', datos, options);
  }


  //INDICADORES

  getHorasMetas(data: Object){
    const token = localStorage.getItem('token');
    const options = { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };

    return this.http.post<any>(BASEURL + 'indicadores/getHorasMetas',data, options);
  }

  //alertas
  async createAlert(message: string, color: string = '') {
    const toast = await this.toast.create({ message: message, duration: 3000, color: color });
    return toast.present();
  }

}

