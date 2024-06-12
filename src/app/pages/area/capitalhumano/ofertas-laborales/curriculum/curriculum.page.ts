import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Curriculum } from 'src/app/model/OfertaLaboral/Curriculum';
import { CapitalhumanoService } from 'src/app/servicios/capitalhumano/capitalhumano.service';

@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.page.html',
  styleUrls: ['./curriculum.page.scss'],
})
export class CurriculumPage implements OnInit {

  constructor(private service: CapitalhumanoService,
              private router: Router,) { }

  curriculum: Curriculum = new Curriculum();
  formacion: Array<any> = [];
  experiencia: Array<any> = [];

  usuario: number = 0;
  tipoCurriculum: number = 0;
  oferta_id: number = 0;;
  fileUrl: string = '';

  // Open divs
  InformacionGeneral: boolean = true;
  PreferenciasEmpleo: boolean = false;
  PerfilProfesional: boolean = false;
  Formacion: boolean = false;
  ExperienciasProfesionales: boolean = false;

  ngOnInit() {
    this.curriculum = new Curriculum;
    this.formacion = [];
    this.experiencia = [];

    switch(sessionStorage.getItem('OfertasLab curriculum tipo')){
      case 'O':
        if( ( sessionStorage.getItem('OfertasLab oferta_id') != null && parseInt(sessionStorage.getItem('OfertasLab oferta_id')!) != 0 ) &&
            ( sessionStorage.getItem('OfertasLab PosFinSel usuario') != null && parseInt(sessionStorage.getItem('OfertasLab PosFinSel usuario')!) != 0 ) &&
            sessionStorage.getItem('OfertasLab PosFinSel tipoCurriculum') != null){
          this.usuario = parseInt(sessionStorage.getItem('OfertasLab PosFinSel usuario')!);
          this.oferta_id = parseInt(sessionStorage.getItem('OfertasLab oferta_id')!);
          this.tipoCurriculum = parseInt(sessionStorage.getItem('OfertasLab PosFinSel tipoCurriculum')!);
        }else
          this.router.navigate(['tabs/area/capitalhumano/ofertas-laborales/ver-posfinsel']);
        break;
      case 'U':
        if( sessionStorage.getItem('OfertasLab PosFinSel usuario') != null && parseInt(sessionStorage.getItem('OfertasLab PosFinSel usuario')!) != 0){
          this.usuario = parseInt(sessionStorage.getItem('OfertasLab PosFinSel usuario')!);
        }else
          this.router.navigate(['tabs/area/capitalhumano/ofertas-laborales']);
      break;
    }

    this.Ofertas_verCurriculum(sessionStorage.getItem('OfertasLab curriculum tipo')!);
  }

  async Ofertas_verCurriculum(segment: string){
    this.service.Ofertas_verCurriculum({ usuario: this.usuario, oferta: this.oferta_id, tipoCurriculum: this.tipoCurriculum, segment: segment}).subscribe(
      (r:any) => {
        console.log(r);
        this.curriculum = r[0][0];
        this.formacion = r[1];
        this.experiencia = r[2];
      },
      e => {
        console.log(e);
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
      }
    );
  }

  openDiv(tipo: any){
    switch(tipo.tipo){
      case 'Informacion general':
        this.InformacionGeneral = this.InformacionGeneral ? false : true;
        break;
      case 'Preferencias Empleo':
        this.PreferenciasEmpleo = this.PreferenciasEmpleo ? false : true;
        break;
      case 'Perfil Profesional':
        this.PerfilProfesional = this.PerfilProfesional ? false : true;
        break;
      case 'Formacion':
        this.Formacion = this.Formacion ? false : true;
        break;
      case 'Experiencias Profesionales':
        this.ExperienciasProfesionales = this.ExperienciasProfesionales ? false : true;
        break;
    }
  }

}
