import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-filosofia',
  templateUrl: './filosofia.page.html',
  styleUrls: ['./filosofia.page.scss']
})
export class FilosofiaPage implements OnInit {

  //variable que depende la vista filosofia
  segment: string = 'politicas';
  filesUrl: string = 'http://intranet.ecn.com.mx:8060/lineup/public/files/filosofia/';
  imagesUrl: string = 'http://intranet.ecn.com.mx:8060/lineup/public/images/filosofia/';
  politicasMenu: Array<any> = [
    {label: 'Política de puntualidad y asistencia', icon:'reader', file:'puntualidad_y_asistencia_nov.pdf'},
    {label: 'Política de seguridad y salud', icon:'reader', file:'POLITICA__DE_SEGURIDAD_Y_SALUD_EN_EL_TRABAJO.pdf'},
    {label: 'Políticas de seguridad y uso de TI', icon:'reader', url:'tabs/filosofia/politicas'},
    {label: 'ESR viajando contigo', icon:'reader', file:'Calendario_de_Actividade_Viajando_Contigo.pdf'},
    {label: 'Material de identidad', icon:'menu', menu: true}
  ];
  showModalMenu: boolean = false;

  materiales: Array<any> = [
    {name: 'Firma ECN ZIP', file:'FirmaECN.ZIP', icon: 'pencil-outline'},
    {name: 'Hoja membretada MX', file:'Hoja membretada MX.docx', icon:'document-outline'},
    {name: 'Hoja membretada USA', file:'Hoja membretada USA.docx', icon:'document-outline'},
    {name: 'Presentación', file:'Presentacion.pptx', icon:'document-outline'},
    {name: 'Solicitud de tarjetas de presentación', file:'Solicitud de tarjetas de presentacion.docx', icon:'document-outline'},
    {name: 'CV - ECN AUTOMATION', file:'CV - ECN AUTOMATION.pdf', icon:'document-outline'},
  ];
  state = 'shown';

  constructor(private router: Router) {
  }

  menuClick(menu: any){
    if(menu.url){
      this.router.navigate([menu.url]);
    }else if(menu.menu){
      this.showModalMenu = true;
    }else if(menu.file){
      window.open(this.filesUrl + menu.file);
      this.showModalMenu = false;
    }
  }

  ngOnInit() {
  }
}
