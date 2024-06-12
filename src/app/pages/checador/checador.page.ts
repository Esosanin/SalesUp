import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginService } from 'src/app/servicios/login/login.service';
import { Geolocation } from '@capacitor/geolocation';
import { Checada } from 'src/app/model/checador/Checada';
import { LoadingController, NavController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';


@Component({
  selector: 'app-checador',
  templateUrl: './checador.page.html',
  styleUrls: ['./checador.page.scss'],
})
export class ChecadorPage implements OnInit {

  checkData: Checada = new Checada();
  colaborador: string = localStorage.getItem('nombre_colaborador')!;
  proyectos: any;
  //url: string = '';
  //colaboradoresSemanales: any;
  tabla: boolean = false;
  detalleSemanal: Array<any> = [];
  horaEntrada: string = '';
  time: Date = new Date();
  checarEntrada = true;
  checadasCompletas = false;


  constructor(private service: LoginService,
    private navController: NavController,
    private loadingController: LoadingController
  ) { }

  async loading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      spinner: 'circles'
    });

    await loading.present();
  }

  checkExists(){
    this.loading();
    this.service.checkExists(this.checkData).subscribe({
      next:(data)=>{
        if(data.checadasCompletas){
          this.checadasCompletas = true;
        }else if(data.checkIn){
          this.checarEntrada = true;
        }else{
          this.checkData.tipo = data.checkData.tipo;
          this.horaEntrada = data.checkData.horaEntrada;
          this.checarEntrada = false;
        }
      },
      complete:()=>{
        this.loadingController.dismiss();
      }

    });
    // let response = await lastValueFrom(this.service.checkExists(this.checkData)).catch(()=>{
    //   setTimeout(() => {
    //     this.loadingController.dismiss();
    //     this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.','danger');
    //   }, 500);}).finally(()=>{
    //   setTimeout(() => {
    //     this.loadingController.dismiss();
    //   }, 300);
    // });
    //   if (response == 0) {
    //     this.checkin = true;
    //     this.checar = true;
    //   } else if (response.length > 0) {
    //     this.checkData.tipo = response[9];
    //     this.horaEntrada = response[8];
    //     // this.checkData.tipo_acceso = r[0].tipo_acceso;
    //     // this.checkData.tipo = r[0].tipo;
    //     // this.checkData.proyecto = r[0].proyecto;
    //     // this.checkData.destino = r[0].destino;
    //     // this.checkData.checkExists = r[0].id_checada;
    //     // this.detalleSemanal = r[1];
    //     // if(this.detalleSemanal.length > 0){
    //     //   this.detalleSemanal.forEach(detalle => {
    //     //     this.checkData.detalles.push({id_checada:detalle['id_checada']});
    //     //   });
    //     // }
    //     this.checkin = false;
    //     this.checar = true;
    //     //this.checkData.entrada = r[0].entrada.split(' ')[1].substring(0, 5);
    //     //this.url = 'https://maps.google.com/maps?q=' + parseFloat(r[0].ubicacion.split(' ')[0]) + ',' + parseFloat(r[0].ubicacion.split(' ')[1]) + '&output=embed';
    //   } else if (response == 2) {
    //     this.checar = false;
    //     this.checkin = false;
    //     this.service.createAlert('Ya han sido registradas las chacadas de este día.','danger');
    //     this.navController.navigateBack(['/tabs/filosofia']);
    //   }
  }

  ionViewWillLeave(){
    this.checarEntrada = true;
  }

  ionViewWillEnter() {
    this.getCurrentDate();
    this.tabla = false;
    this.checkData = new Checada();
    this.checkExists();
  }

  //function para agregar un proyecto no listado en el select (checar entrada)
  // addProyecto(event: {
  //   component: IonicSelectableComponent
  // }) {
  //   if (event.component.searchText != '') {
  //     let item = event.component.searchText;
  //     this.proyectoComponent.addItem({ PrjCode: item }).then(() => {
  //       this.proyectoComponent.search(item);
  //     });

  //     event.component.hideAddItemTemplate();
  //   } else {
  //     this.service.createAlert('El campo añadir está vacío.', 'danger');
  //   }
  // }

  detalleChange(event: any, id_colaborador: number) {
    this.checkData.detalles.push({ id_colaborador: id_colaborador, detalle: event.detail.value });
    let count = 0;
    let index = 0;
    for (let i = 0; i < this.checkData.detalles.length; i++) {
      if (id_colaborador == this.checkData.detalles[i]['id_colaborador']) {
        count++;
        if (count == 1) {
          index = i;
        }
        if (count > 1) {
          this.checkData.detalles.splice(index, 1);
        }
      }
    }
  }

  // proyectoChange() {
  //   let data = { proyecto: this.checkData.proyecto, id_colaborador: this.checkData.id_colaborador };
  //   this.service.getColaboradoresSemanales(data).subscribe(
  //     r => {
  //       this.colaboradoresSemanales = r;
  //       this.tabla = true;
  //     }
  //   );
  // }

  // tipoChange() {
  //   if (this.checkData.tipo == 'Ejecución') {
  //     this.checkData.destino = '';
  //     this.service.getProyectos().subscribe(r => this.proyectos = r);
  //   } else if (this.checkData.tipo == 'Comisión') {
  //     this.checkData.proyecto = '';
  //     this.checkData.tipo_acceso = '';
  //     this.tabla = false;
  //   } else {
  //     this.tabla = false;
  //     this.checkData.proyecto = '';
  //     this.checkData.tipo_acceso = '';
  //     this.checkData.destino = '';
  //   }
  // }

  ngOnInit() {
  }

  //funcion para obtener la ubicación

  async printCurrentPosition () {
    return await Geolocation.getCurrentPosition({
      enableHighAccuracy: true
    });
  };

  refresh(event: any) {
    this.ionViewWillEnter();
    event.target.complete();
  }

  checkIn2() {
    this.loading();
    let plataforma = Capacitor.getPlatform();
    this.checkData.checkExists = this.checarEntrada;
    if (this.checarEntrada && plataforma!='web') {
      this.printCurrentPosition().then(
        ubicacion => {
          this.checkData.ubicacion = ubicacion.coords.latitude.toString() + ', ' + ubicacion.coords.longitude.toString();
          this.service.checkIn(this.checkData).subscribe({
            complete: () => {
              this.loadingController.dismiss();
              this.service.createAlert('Checada registrada.', 'success');
              this.navController.navigateBack(['/tabs/filosofia']);
            },
            error: () =>{
              this.loadingController.dismiss();
              this.service.createAlert('Error al registrar la checada, favor de contactar a TI.', 'danger');
            }
        });
        }).catch(()=>{
          this.loadingController.dismiss();
          this.service.createAlert('La aplicación necesita acceder a la ubicación, favor de aceptar los permisos.', 'danger');
        });
    } else {
      this.service.checkIn(this.checkData).subscribe({
        complete:()=>{
          this.loadingController.dismiss();
          this.service.createAlert('Checada registrada.', 'success');
          this.navController.navigateBack(['/tabs/filosofia']);
        },
        error:()=>{
          this.loadingController.dismiss();
          this.service.createAlert('Error al registrar la checada, favor de contactar a TI.', 'danger');
        }
      });
    }
  }

  getCurrentDate() {
    setInterval(() => {
      this.time = new Date(); //set time variable with current date
    }, 1000); // set it every one seconds}
  }
}
