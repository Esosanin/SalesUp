import { Component, OnInit } from '@angular/core';
import { VacacionesService } from 'src/app/servicios/procesossoporte/vacaciones/vacaciones.service';
import { FormMacro } from 'src/app/model/vacaciones/VacacionesForm';//parametros del formulario getmacroData
import { FormMacroD } from 'src/app/model/vacaciones/VacacionesForm';//parametros del formulario getmacroData
import { FormMacroV } from 'src/app/model/vacaciones/VacacionesForm';//parametros del formulario getmacroData
import { Router,NavigationEnd } from '@angular/router';
//import { FormPermisos } from 'src/app/model/VacacionesForm';//parametros del formulario getmacroData
//import { FormVacaciones } from 'src/app/model/VacacionesForm';//parametros del formulario getmacroData
//import { FormDescansos } from 'src/app/model/VacacionesForm';//parametros del formulario getmacroData

/*interface FormPermisos{
  id_colaborador: number;
  fecha_inicial: string;
  fecha_final: string;
  p_motivo: number;
}*/

@Component({
  selector: 'app-dash',
  templateUrl: './dash.page.html',
  styleUrls: ['./dash.page.scss'],
})
export class DashPage implements OnInit {

  segment: string = 'missolicitudes';

  //VARIABLES
  resD: any =[];
  resV: any =[];
  resP: any =[];
  idcolabArray: any =[];
  miInfoArray: any =[];
  misSolicitudesArray: any =[];
  misSolicitudesArray2: any =[];
  misSolicitudesPendientesArray: any =[];
  misSolicitudesPendientesAprobarArray: any =[];
  misSolicitudesPendientesAprobarCHArray: any =[];
  id_colaborador: number = localStorage.getItem('id_colaborador') ? parseInt(localStorage.getItem('id_colaborador')!) : 0;
  antiguedadingresoanios: number = localStorage.getItem('antiguedadingresoanios') ? parseInt(localStorage.getItem('antiguedadingresoanios')!) : 0;
  diastotalesdeantiguedad: number = localStorage.getItem('diastotalesdeantiguedad') ? parseInt(localStorage.getItem('diastotalesdeantiguedad')!) : 0;
  diasdisponiblesdeantiguedad: number = localStorage.getItem('diasdisponiblesdeantiguedad') ? parseInt(localStorage.getItem('diasdisponiblesdeantiguedad')!) : 0;
  diasdisponiblesdescanso: number = localStorage.getItem('diasdisponiblesdescanso') ? parseInt(localStorage.getItem('diasdisponiblesdescanso')!) : 0;
  esproyectos: number = localStorage.getItem('esproyectos') ? parseInt(localStorage.getItem('esproyectos')!) : 0;
  getmacroDatos = new FormMacro();//para enviar info de la consulta del formulario, tiene qe llamarse igual al del form del html
  getmacroDatosD = new FormMacroD();
  getmacroDatosV = new FormMacroV();
  //rptMacroArray: any =[];//para recibir info de la consulta del formulario


  constructor(private service:VacacionesService,
    private router: Router) { }

  ngOnInit() {


    let json = { id_colaborador: this.id_colaborador };
    this.idcolabArray = [this.id_colaborador];

    //traer datos de mis solicitudes ya aprobadas, procesadas, canceladas, rechazadas
    // this.service.getMisSolicitudes(json).subscribe({
    //   next: (r:any) =>{
    //     this.misSolicitudesArray=r;
    //   },
    //   error: (e:any) =>{
    //     console.log(e);
    //     //this.service.createAlert('ngOnInit.getMisSolicitudes', 'danger');
    //     this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
    //   }
    // });

    // //traer datos de mis solicitudes pendientes
    // this.service.getMisSolicitudesPendientes(json).subscribe({
    //   next: (r:any) =>{
    //     this.misSolicitudesPendientesArray=r;
    //   },
    //   error: (e:any) =>{
    //     console.log(e);
    //     this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
    //   }
    // });

    // //traer datos de mis solicitudes por aprobar por el colaborador
    // this.service.getMisSolicitudesPendientesAprobar(json).subscribe({
    //   next: (r:any) =>{
    //     this.misSolicitudesPendientesAprobarArray=r;
    //   },
    //   error: (e:any) =>{
    //     console.log(e);
    //     //this.service.createAlert('ngOnInit.getMisSolicitudes', 'danger');
    //     this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
    //   }
    // });

    // //traer datos de mis solicitudes por aprobar por CH
    // this.service.getMisSolicitudesPendientesAprobarCH(json).subscribe({
    //   next: (r:any) =>{
    //     this.misSolicitudesPendientesAprobarCHArray=r;
    //   },
    //   error: (e:any) =>{
    //     console.log(e);
    //     //this.service.createAlert('ngOnInit.getMisSolicitudes', 'danger');
    //     this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
    //   }
    // });

    //traer mi info
    this.service.getMiInfo(json).subscribe({
      next: (r:any) =>{
        this.miInfoArray=r;
        localStorage.setItem('antiguedadingresoanios', this.miInfoArray[0].antiguedadanios);
        localStorage.setItem('diastotalesdeantiguedad', this.miInfoArray[0].diastotal);
        localStorage.setItem('diasdisponiblesdeantiguedad', this.miInfoArray[0].disponibles);
        localStorage.setItem('diasdisponiblesdescanso', this.miInfoArray[0].usadosdisponiblesdescanso);
        localStorage.setItem('esproyectos', this.miInfoArray[0].esproyectos);
        /*
        falta
        -guardar antiguedad adelantada
        -guardar dias adelantados ya usables
        */
      },
      error: (e:any) =>{
        console.log(e);
        this.service.createAlert('No se encontró la información.', 'danger');
      }
    });

  } //ngOnInit() fin


  back(){
    return this.router.url.slice(0,this.router.url.lastIndexOf('/'));
  }
  // getPermisoFormpagets //macroFormulario envia y trae info
  getMacroFormpagets(form: any) {
      this.service.getMacroFormserv(this.getmacroDatos).subscribe({ //getmacroDatos tiene qe llamarse igual al getmacroDatos = new FormMacro();, que tiene qe llamarse igual al del form del html
        next: (r:any) =>{
          this.ngOnInit();
          this.service.createAlert('Solicitud guardada', 'success');
        },
        error: (e:any) =>{
          console.log(e);
          this.service.createAlert('No se pudo guardar el permiso', 'danger');
        }
    });
  }

  getMacroFormpagetsD(form: any) {
        this.service.getMacroFormservD(this.getmacroDatosD).subscribe({ //getmacroDatos tiene qe llamarse igual al getmacroDatos = new FormMacro();, que tiene qe llamarse igual al del form del html
          next: (r:any) =>{
            this.resD=r;
              if(this.resD===1){
                this.ngOnInit();
                this.service.createAlert('Solicitud guardada', 'success');
              }else{
                this.service.createAlert('Esta seleccionando más días de los que tiene disponibles', 'danger');
              }
          },
          error: (e:any) =>{
            console.log(e);
            this.service.createAlert('No se pudo guardar el descanso', 'danger');
          }
    });
  }

  getMacroFormpagetsV(form: any) {
          this.service.getMacroFormservV(this.getmacroDatosV).subscribe({ //getmacroDatos tiene qe llamarse igual al getmacroDatos = new FormMacro();, que tiene qe llamarse igual al del form del html
            next: (r:any) =>{
              this.resV=r;
              if(this.resV===1){
                this.ngOnInit();
                this.service.createAlert('Solicitud guardada', 'success');
              }else{
                this.service.createAlert('Esta seleccionando más días de los que tiene disponibles', 'danger');
              }
            },
            error: (e:any) =>{
              console.log(e);
              this.service.createAlert('No se pudo guardar la solicitud', 'danger');
            }
        });
  }


//colaborador cancela solicitud
public cancelElement(id_sol:number):void {
  let id_solicitud=id_sol;
  this.service.cancelarsolicitudvacaciones(id_solicitud).subscribe({
  next: (r:any) =>{
    this.ngOnInit();
  },
  error: (e:any) =>{
    this.service.createAlert('No se pudo cancelar la solicitud', 'danger');
  }
  });
}

//lider aprueba solicitud
public aprobarElement(id_sol:number):void {
  let id_solicitud=id_sol;
  this.service.aprobarLider(id_solicitud).subscribe({
  next: (r:any) =>{
    this.ngOnInit();
  },
  error: (e:any) =>{
    this.service.createAlert('No se pudo actualizar la solicitud', 'danger');
  }
  });
}

//lider aprueba solicitud
public aprobarconsueldoElement(id_sol:number):void {
  let id_solicitud=id_sol;
  this.service.aprobarconsueldoLider(id_solicitud).subscribe({
  next: (r:any) =>{
    this.ngOnInit();
  },
  error: (e:any) =>{
    this.service.createAlert('No se pudo actualizar la solicitud', 'danger');
  }
  });
}

//lider aprueba solicitud
public aprobarsinsueldoElement(id_sol:number):void {
  let id_solicitud=id_sol;
  this.service.aprobarsinsueldoLider(id_solicitud).subscribe({
  next: (r:any) =>{
    this.ngOnInit();
  },
  error: (e:any) =>{
    this.service.createAlert('No se pudo actualizar la solicitud', 'danger');
  }
  });
}

//lider rechaza solicitud
public rechazarElement(id_sol:number):void {
  let id_solicitud=id_sol;
  this.service.rechazarLider(id_solicitud).subscribe({
  next: (r:any) =>{
    this.ngOnInit();
  },
  error: (e:any) =>{
    this.service.createAlert('No se pudo actualizar la solicitud', 'danger');
  }
  });
}

//CH aprueba solicitud
public aprobarElementCH(id_sol:number):void {
  let id_solicitud=id_sol;
  this.service.aprobarCapHum(id_solicitud).subscribe({
  next: (r:any) =>{
    this.ngOnInit();
  },
  error: (e:any) =>{
    this.service.createAlert('No se pudo actualizar la solicitud', 'danger');
  }
  });
}

//CH rechaza solicitud
public rechazarElementCH(id_sol:number):void {
  let id_solicitud=id_sol;
  this.service.rechazarCapHum(id_solicitud).subscribe({
  next: (r:any) =>{
    this.ngOnInit();
  },
  error: (e:any) =>{
    this.service.createAlert('No se pudo actualizar la solicitud', 'danger');
  }
  });
}





/*//lo de a continuacion si me servia para crear nuevos renglones y borrarlos pero no consegui
// tomar todos los valores y pasarlos en array para enviarlos en el formulario de vacaciones
    public elements:Array<unknown> = [];
    public appendElement():void {
       this.elements = [...this.elements, this.elements.length + 1]; // Just append anything, since you are not using the values otherwise, appending a generic ID here
       localStorage.setItem('arrayformulariovacaciones', JSON.stringify(this.elements));
       var storedNames = JSON.parse(localStorage.getItem('arrayformulariovacaciones'));
       console.log(storedNames);
    }
    public caller(elementId:number):void {
       //console.log('actividad'+elementId, 'was clicked');
      //funciona pero te deja el registro como undefined
      //this.elements.forEach((element,index)=>{
      //  if(element===elementId) delete this.elements[index];
      //});
      //console.log(...this.elements);
      //this.elements = this.elements;
      const index = this.elements.indexOf(elementId, 0);
      if (index > -1) {
        this.elements.splice(index, 1);
      }
      localStorage.setItem('arrayformulariovacaciones', JSON.stringify(this.elements));
      var storedNames = JSON.parse(localStorage.getItem('arrayformulariovacaciones'));//localStorage.names = JSON.stringify(names);       var storedNames = JSON.parse(localStorage.names);
      console.log(storedNames);
    }
    */

} //fin de: export class DashPage implements OnInit



