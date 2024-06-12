import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Colaborador } from 'src/app/model/area/capitalhumano/Colaborador';
import { CuentaService } from 'src/app/servicios/cuenta/cuenta.service';
import { LoginService } from 'src/app/servicios/login/login.service';


@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
})

export class CuentaPage implements OnInit {

  @ViewChild(IonContent, { static: false }) content!: IonContent;


  foto: string = this.service2.foto;
  colaboradorData: Colaborador = new Colaborador();
  tipoSangres: any;
  pass: string = '';


  constructor(private service: CuentaService, private router: Router, private service2: LoginService) { }

  refresh(event: any) {
    this.getColaborador();
    event.target.complete();
  }



  save() {
    if (this.pass != '') {
      let data = { id_colaborador: this.colaboradorData.id_colaborador, password: this.pass };
      this.service2.verifyPass(data).subscribe(
        response => {
          if (response.access) {
            if (this.colaboradorData.passNuevo != this.colaboradorData.passNuevo2) {
              this.service.createAlert('Las contraseñas nuevas no coinciden.', 'danger');
            } else if (this.colaboradorData.passNuevo?.length >= 8 && this.colaboradorData.passNuevo2?.length >= 8) {
              let form = new FormData();
              form.append('datos', JSON.stringify(this.colaboradorData));
              this.service.saveColaborador(form).subscribe(
                () => {
                  this.service.createAlert('Datos actualizados correctamente.', 'success');
                  this.pass = '';
                  this.colaboradorData.passNuevo = '';
                  this.colaboradorData.passNuevo2 = '';
                  this.getColaborador();
                }
              );
            } else {
              this.service.createAlert('La contraseña nueva no puede estar vacía y debe contener al menos 8 caracteres.', 'danger');
            }
          } else {
            this.service.createAlert('La contraseña anterior es incorrecta.', 'danger');
          }
        }
      );
    } else {
      let form = new FormData();
      form.append('datos', JSON.stringify(this.colaboradorData));
      this.service.saveColaborador(form).subscribe(
        () => {
          this.colaboradorData.passNuevo = '';
          this.colaboradorData.passNuevo2 = '';
          this.service.createAlert('Datos actualizados correctamente.', 'success');
          this.getColaborador();

        },
        error => {
          this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
          console.log(error);
        }
      );
    }
  }

  solicitarFoto() {
    this.service.segment = 'nuevo';
    this.router.navigate(['./tabs/recursos/tickets']);
    this.service.createAlert('Favor de enviar la solicitud a capital humano.');
  }

  ngOnInit() {

  }

  getColaborador() {
    this.service.getColaborador(this.colaboradorData.id_colaborador).subscribe(
      response => {
        this.colaboradorData = response.colaborador;
        this.content.scrollToTop(500);
      },
      error => {
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
        console.log(error);
      });
  }

  ionViewWillEnter() {
    this.colaboradorData.id_colaborador = parseInt(localStorage.getItem('id_colaborador')!);
    this.service.getSangre().subscribe(
      response => {
        this.tipoSangres = response.tipoSangre;
        this.getColaborador();
      });
  }

}
