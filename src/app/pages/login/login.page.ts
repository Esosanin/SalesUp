import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/servicios/login/login.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, MenuController, NavController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(50),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(255),
    ]),
  });

  recoverForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.minLength(6),
      Validators.maxLength(50),
    ]),
  });

  tokenForm = new FormGroup({
    newPass: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(50),
    ]),
    newPass2: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(50),
    ]),
    id: new FormControl(0, Validators.required),
  });
  segment = 'acceso';
  shwpwd: boolean = false;
  shwpwd2: boolean = false;
  token = '';
  recover = false;
  id_colaborador = 0;

  constructor(
    private service: LoginService,
    private navController: NavController,
    private menu: MenuController,
    private loadingController: LoadingController,
    private route: ActivatedRoute
  ) {}

  showPwd() {
    this.shwpwd ? (this.shwpwd = false) : (this.shwpwd = true);
  }

  showPwd2() {
    this.shwpwd2 ? (this.shwpwd2 = false) : (this.shwpwd2 = true);
  }

  async loading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      spinner: 'circles',
    });

    loading.present();
  }

  ngOnInit() {}

  ionViewWillEnter() {
    localStorage.clear();
    this.menu.enable(false);
    this.shwpwd = false;
    this.route.queryParams.subscribe((params) => {
      this.token = params['t'] ? params['t'] : '';
      this.id_colaborador = params['u'] ? params['u'] : 0;
    });
    if (this.token != '' && Number(this.id_colaborador)) {
      let data = { token: this.token, id: this.id_colaborador };
      this.service.tokenCheck(data).subscribe((response) => {
        if (response.token) {
          this.segment = 'recover';
          this.recover = true;
        } else {
          this.segment = 'acceso';
          this.recover = false;
          this.service.createAlert('Token inválido.', 'danger');
        }
      });
    }
  }

  login() {
    lastValueFrom(this.service.login(this.loginForm.value)).then(response=>{
      let user = response.user;
      let permisos = response.permisos;
      let accessToken = response.access_token;
      this.service.createAlert('Bienvenido(a) ' + user.nombres);
      localStorage.setItem('nombres', user.nombres);
      localStorage.setItem('nombre_colaborador', user.nombreCompleto);
      localStorage.setItem('id_colaborador', user.id_colaborador);
      localStorage.setItem('n_colaborador', user.n_colaborador);
      localStorage.setItem('id_area', user.id_area);
      localStorage.setItem('id_sap', user.id_vendedorSap);
      localStorage.setItem('tipo', user.tipo);
      localStorage.setItem('especialidad', user.especialidad);
      localStorage.setItem('id_zona', user.id_zona);
      localStorage.setItem('zona', user.zona);
      localStorage.setItem('permisos', JSON.stringify(permisos));
      localStorage.setItem('token', accessToken);
      this.service.nombres = user.nombres;

      if (user.foto && user.foto != '') {
        localStorage.setItem('foto', user.foto);
        this.service.foto = this.service.fotosUrl + user.foto;
      } else {
        localStorage.setItem('foto', 'default.png');
        this.service.foto = this.service.fotosUrl + 'default.png';
      }
      this.loginForm.reset();
      this.navController.navigateBack(['/tabs']);
    }).catch((e)=>{
      if(e.status===400){
        this.service.createAlert('Credenciales inválidas.','danger');
      }else{
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.','danger');
      }
    });
  }

  async recoverPass() {
    if(this.tokenForm.get('newPass')!.value === this.tokenForm.get('newPass2')!.value){
      this.loading();
    this.tokenForm.get('id')?.setValue(this.id_colaborador);
    let response = await lastValueFrom(
      this.service.recoverPass(this.tokenForm.value)
    ).catch(() => this.loadingController.dismiss());
    if (response) {
      this.loadingController.dismiss();
      this.service.createAlert('Contraseña actualizada.', 'success');
      this.segment = 'acceso';
      this.id_colaborador = 0;
      this.recover = false;
      console.log(response);
    }
    }else{
      this.loadingController.dismiss();
      this.service.createAlert('Las contraseñas no coinciden.','danger');
    }
  }

  async recoverPassRequest() {
    this.loading();
    let response = await lastValueFrom(
      this.service.recover(this.recoverForm.value)
    ).catch(() => {
      this.loadingController.dismiss();
    });
    if (response) {
      if (response.error) {
        this.loadingController.dismiss();
        this.service.createAlert(
          'El usuario no existe para la dirección de correo electrónico especificada.',
          'danger'
        );
      } else {
        this.loadingController.dismiss();
        this.segment = 'acceso';
        this.service.createAlert(
          'Favor de verificar su correo ECN.',
          'success'
        );
      }
    }
  }
}
