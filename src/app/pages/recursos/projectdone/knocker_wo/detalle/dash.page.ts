import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Router,NavigationEnd } from '@angular/router';
//import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
//import { MultipleDocumentsPicker } from '@awesome-cordova-plugins/multiple-document-picker/ngx';
import { KnockerWO } from 'src/app/servicios/knocker/wo/knocker_wo.service';
import { FormEncuestasatisf, FormFactAntiComp } from 'src/app/model/projectdone/WOAntiFactComp';
import { FormFactAntiParc } from 'src/app/model/projectdone/WOAntiFactComp';
import { FormWOHistComent } from 'src/app/model/projectdone/WOAntiFactComp';
import { FormFechaConfirmada } from 'src/app/model/projectdone/WOAntiFactComp';
import { formFechaTerminacion } from 'src/app/model/projectdone/WOAntiFactComp';
import { formCancelarOT } from 'src/app/model/projectdone/WOAntiFactComp';
import { formEjecutarOT } from 'src/app/model/projectdone/WOAntiFactComp';
import { formSugerenciaOT } from 'src/app/model/projectdone/WOAntiFactComp';
import { formRecursosEncuesta } from 'src/app/model/projectdone/WOAntiFactComp';
//import { Ticket } from 'src/app/model/WOAntiFactComp';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.page.html',
  styleUrls: ['./dash.page.scss'],
})
export class DashPage implements OnInit {

  segment: string = 'InfoGralOT';
  formencuestasatisf2: FormEncuestasatisf = new FormEncuestasatisf();
  //private file: File;
  //fileChangeEvent: any;
  /*@ViewChild('ticketForm') ticketForm: any;
  archivos: Array<Object> = [];
  filesUrl: string = 'http://intranet.ecn.com.mx:8060/api/public/files/recursos/tickets';
  requisitos: string = '';
  areas: Array<Object> = [];
  categorias: Array<Object>;*/
  /*grupos: Array<Object> = [
    {
      nombre: "En espera",
      id: 1,
      tickets: []
    },
    {
      nombre: "En proceso",
      id: 2,
      tickets: []
    },
    {
      nombre: "Aprobado",
      id: 3,
      tickets: []
    },
    {
      nombre: "Rechazado",
      id: 4,
      tickets: []
    },
  ];*/

  //VARIABLES
  id_colaborador: number = localStorage.getItem('id_colaborador') ? parseInt(localStorage.getItem('id_colaborador')!) : 0;
  idDetalleWO: number = localStorage.getItem('idDetalleWO') ? parseInt(localStorage.getItem('idDetalleWO')!) : 0;//id de la orden de trabajo
  idDetalleWOProy: number = localStorage.getItem('idDetalleWOProy') ? parseInt(localStorage.getItem('idDetalleWOProy')!) : 0;//id del proyecto de intranet
  idcotizacionintranetproyecto: number = localStorage.getItem('idcotizacionintranetproyecto') ? parseInt(localStorage.getItem('idcotizacionintranetproyecto')!) : 0;
  otestadointranetproyecto: number = localStorage.getItem('otestadointranetproyecto') ? parseInt(localStorage.getItem('otestadointranetproyecto')!) : 0;
  otesteproyectoespm: number = localStorage.getItem('otesteproyectoespm') ? parseInt(localStorage.getItem('otesteproyectoespm')!) : 0;
  otesteproyectoesrecurso: number = localStorage.getItem('otesteproyectoesrecurso') ? parseInt(localStorage.getItem('otesteproyectoesrecurso')!) : 0;
  otesteproyectoanticipo: number = localStorage.getItem('otesteproyectoanticipo') ? parseInt(localStorage.getItem('otesteproyectoanticipo')!) : 0;
  othorasregistradasproy: number = localStorage.getItem('othorasregistradasproy') ? parseInt(localStorage.getItem('othorasregistradasproy')!) : 0;  //othorasregistradasproy
  WOFechaTerminacion: string = localStorage.getItem('WOFechaTerminacion') ? localStorage.getItem('WOFechaTerminacion')! : '';
  WOFechaCompromiso: string = localStorage.getItem('WOFechaCompromiso') ? localStorage.getItem('WOFechaCompromiso')! : '';
  id: any = 0;
  datosWoDetalleArray: any =[];
  datosWoDetalleHistComentariosArray: any =[];
  datosWoDetalleArchivosCotArray: any =[];
  datosWoDetalleArchivosOCPArray: any =[];
  datosGetWOPermisosArray: any =[];
  datosGetWODetalleArray: any =[];
  datosWoHistComentsArray: any=[];
  adjuntosOTArray: any=[];
  datosOTAnexosWO: any=[];
  datosEncuestaServicioRetro: any =[];
  datosPersonasXEvaluar: any =[];
  datosEvaluacionAvg: any =[];
  datosEncuestasOT: any =[];
  formFacturarAnticipoCompleto = new FormFactAntiComp();
  formFacturarAnticipoParcial = new FormFactAntiParc();
  formComentariosHistorial = new FormWOHistComent();
  formFechaConfirmada = new FormFechaConfirmada();
  formFechaTerminacion = new formFechaTerminacion();
  formCancelarOT = new formCancelarOT();
  formEjecutarOT = new formEjecutarOT();
  formSugerenciaOT = new formSugerenciaOT();
  formRecursosEncuesta = new formRecursosEncuesta();
  //ticketData = new Ticket();




  constructor(private service:KnockerWO,
    private router: Router,
    private _Activatedroute:ActivatedRoute,
    private http: HttpClient/*,
    private transfer: FileTransfer,
    private chooser: MultipleDocumentsPicker*/
    ) { }

  ngOnInit() {

    this.id=this._Activatedroute.snapshot.paramMap.get("id");
    localStorage.setItem('idDetalleWO', this.id);//id_ot de la orden de tabajo


    let json = {
      id_colaborador: this.id_colaborador
      , id_ot: this.idDetalleWO//id_ot de la orden de tabajo
      , id_proyecto: this.idDetalleWOProy
      , id_cotizacion: this.idcotizacionintranetproyecto
    };
    let jsonDet = {
      id_colaborador: this.id_colaborador
      , id_ot: this.idDetalleWO//id_ot de la orden de tabajo
      , id_proyecto: this.idDetalleWOProy
      , id_cotizacion: this.idcotizacionintranetproyecto
      , ot_estado: this.otestadointranetproyecto
      , ot_es_pm: this.otesteproyectoespm
      , ot_es_recurso: this.otesteproyectoesrecurso
      , anticipo: this.otesteproyectoanticipo
    };
    this.service.getWODatosDetalleProyectoOK(json).subscribe({
      next: (r: any) =>{
        this.datosWoDetalleArray=r;
        localStorage.setItem('idDetalleWOProy', this.datosWoDetalleArray[0].id_project);
        localStorage.setItem('idcotizacionintranetproyecto', this.datosWoDetalleArray[0].id_cotizacion);
        localStorage.setItem('otestadointranetproyecto', this.datosWoDetalleArray[0].ot_estado);
        localStorage.setItem('otesteproyectoespm', this.datosWoDetalleArray[0].ot_es_pm);
        localStorage.setItem('otesteproyectoesrecurso', this.datosWoDetalleArray[0].ot_es_recurso);
        localStorage.setItem('otesteproyectoanticipo', this.datosWoDetalleArray[0].anticipo);
        localStorage.setItem('othorasregistradasproy', this.datosWoDetalleArray[0].hrs_reg);
        if((this.datosWoDetalleArray[0].id_cotizacion)>0){
          this.getWODatosDetalleHistComentarios(json);
          this.getWODatosDetalleArchivosCot(json);
          this.getWODatosDetalleArchivosOCP(json);
        }
        this.WOPermissions(jsonDet);
        this.WODetalle(jsonDet);
      },
      error: (e) =>{
        console.log(e);
        this.service.createAlert('No se pudo traer la información del proyecto', 'danger');
      }
    });



  } //ngOnInit() fin


  backD(){
    return this.router.url.slice(0,this.router.url.lastIndexOf('/detalle'));
  }

  getWODatosDetalleHistComentarios(json:Object){
    this.service.getWODatosDetalleHistComentarios(json).subscribe({
      next: (r: any) =>{
        this.datosWoDetalleHistComentariosArray=r;
      },
      error: (e) =>{
        console.log(e);
        this.service.createAlert('No se pudo traer la información del proyecto', 'danger');
      }
    });
  }

  getWODatosDetalleArchivosCot(json:Object){
    this.service.getWODatosDetalleArchivosCot(json).subscribe({
      next: (r: any) =>{
        this.datosWoDetalleArchivosCotArray=r;
      },
      error: (e) =>{
        console.log(e);
        this.service.createAlert('No se pudo traer la información del proyecto', 'danger');
      }
    });
  }

  getWODatosDetalleArchivosOCP(json:Object){
    this.service.getWODatosDetalleArchivosOCP(json).subscribe({
      next: (r: any) =>{
        this.datosWoDetalleArchivosOCPArray=r;
      },
      error: (e) =>{
        console.log(e);
        this.service.createAlert('No se pudo traer la información del proyecto', 'danger');
      }
    });
  }

  WOPermissions(jsonDet: Object){
    this.service.getWOPermisos(jsonDet).subscribe({
      next: (r: any) =>{
        this.datosGetWOPermisosArray=r;
        this.GetSurveyAVG(jsonDet);
        this.GetSurveyComent(jsonDet);
      },
      error: (e) =>{
        console.log(e);
        this.service.createAlert('No se pudo traer la información de los permisos', 'danger');
      }
    });
  }

  WODetalle(jsonDet: Object){
    this.service.getWODetalle(jsonDet).subscribe({
      next: (r: any) =>{
        this.datosGetWODetalleArray=r;
        localStorage.setItem('WOFechaTerminacion', this.datosGetWODetalleArray[0].fecha_terminacion);
        localStorage.setItem('WOFechaCompromiso', this.datosGetWODetalleArray[0].fecha_compromiso);
        this.getWOHistComentsOT(jsonDet);
        this.getWOOTAttachments(jsonDet);
        this.getWOAnexosWO(jsonDet);
        this.getPersonasPorEvaluar(jsonDet);
        if(this.datosGetWODetalleArray[0].encuestas_hechas >= this.datosGetWODetalleArray[0].encuestas_total){
          this.getEvaluacionesEncuestaOT(jsonDet);
        }
      },
      error: (e) =>{
        console.log(e);
        //this.service.createAlert('No se pudo traer la información de los permisos', 'danger');
      }
    });
  }

  getWOHistComentsOT(json:Object){
    this.service.getWOHistComentsOT(json).subscribe({
      next: (r: any) =>{
        this.datosWoHistComentsArray=r;
      },
      error: (e) =>{
        console.log(e);
        //this.service.createAlert('No se pudo traer la información del proyecto', 'danger');
      }
    });
  }

  getWOOTAttachments(jsonDet: Object){
    this.service.getOTAttachments(jsonDet).subscribe({
      next: (r: any) =>{
        this.adjuntosOTArray=r;
      },
      error: (e) =>{
        console.log(e);
        //this.service.createAlert('No se pudo traer la información del proyecto', 'danger');
      }
    });
  }

  submitForm(){

  }

  onFileChange(event: any){

  }

  getWOAnexosWO(jsonDet: Object){
    this.service.getOTAnexosWO(jsonDet).subscribe({
      next: (r: any) =>{
        this.datosOTAnexosWO=r;
      },
      error: (e) =>{
        console.log(e);
        //this.service.createAlert('No se pudo traer la información del proyecto', 'danger');
      }
    });
  }

FormWOAntiFactComp(form: any) {
    this.service.sendAntiFactCompleto(this.formFacturarAnticipoCompleto).subscribe({
      next: (r: any) =>{
        this.ngOnInit();
        //this.service.createAlert('Solicitud guardada', 'success');
      },
      error: (e) =>{
        console.log(e);
        this.service.createAlert('No se pudo guardar la solicitud', 'danger');
      }
      });
}

FormWOAntiFactParc(form: any) {
  this.service.sendAntiFactParcial(this.formFacturarAnticipoParcial).subscribe({
    next: (r: any) =>{
      this.ngOnInit();
      //this.service.createAlert('Solicitud guardada', 'success');
    },
    error: (e) =>{
      console.log(e);
      this.service.createAlert('No se pudo guardar la solicitud', 'danger');
    }
    });
}

FormWOHistorialComent(form: any) {
  this.service.sendComentariosHistorial(this.formComentariosHistorial).subscribe({
    next: (r: any) =>{
      this.ngOnInit();
      //this.service.createAlert('Solicitud guardada', 'success');
    },
    error: (e) =>{
      console.log(e);
      this.service.createAlert('No se pudo guardar el comentario', 'danger');
    }
    });
}

FormFechaConfirmada(form: any) {
  this.service.sendFechaConfirmada(this.formFechaConfirmada).subscribe({
    next: (r: any) =>{
      this.ngOnInit();
      //this.service.createAlert('Solicitud guardada', 'success');
    },
    error: (e) =>{
      console.log(e);
      this.service.createAlert('No se pudo guardar la fecha de confirmación', 'danger');
    }
    });
}

FormFechaTerminacion(form: any) {
  this.service.sendFechaTerminacion(this.formFechaTerminacion).subscribe({
    next: (r: any) =>{
      if(r===1){
        this.ngOnInit();
      }else{
        this.service.createAlert('La fecha de termino es menor a la de confirmación o es después de la fecha actual', 'danger');
      }
    },
    error: (e) =>{
      console.log(e);
      this.service.createAlert('No se pudo guardar la fecha de confirmación', 'danger');
    }
    });
}

FormWOCancelar(form: any) {
  this.service.sendComentariosCancelarOT(this.formCancelarOT).subscribe({
    next: (r: any) =>{
      this.router.navigate(['/tabs/procesossoporte/knocker_wo']);
      this.service.createAlert('Orden cancelada correctamente', 'success');
      //this.service.createAlert('Solicitud guardada', 'success');
    },
    error: (e) =>{
      console.log(e);
      this.service.createAlert('No se pudo guardar el comentario', 'danger');
    }
    });
}

FormTerminarWOFactComp(form: any) {
  this.service.sendTerminarFactCompleto(this.formFacturarAnticipoCompleto).subscribe({
    next: (r: any) =>{
      //this.ngOnInit();
      //this.backD();
      this.router.navigate(['/tabs/procesossoporte/knocker_wo']);
      this.service.createAlert('Orden terminada correctamente', 'success');
      //this.service.createAlert('Solicitud guardada', 'success');
    },
    error: (e) =>{
      console.log(e);
      this.service.createAlert('Error al terminar la órden', 'danger');
    }
    });
}

FormTerminarWOFactParc(form: any) {
this.service.sendTerminarFactParcial(this.formFacturarAnticipoParcial).subscribe({
  next: (r: any) =>{
    this.router.navigate(['/tabs/procesossoporte/knocker_wo']);
    this.service.createAlert('Orden terminada correctamente', 'success');
    //this.service.createAlert('Solicitud guardada', 'success');
  },
  error: (e) =>{
    console.log(e);
    this.service.createAlert('Error al terminar la órden', 'danger');
  }
  });
}

public regresarEPWO(idDetalleWO:number):void{
  let id_ot=idDetalleWO;
  //console.log(id_ot);
    this.service.backEPWO(id_ot).subscribe({
    next: (r: any) =>{
      this.ngOnInit();
      this.service.createAlert('Orden regresada correctamente', 'success');
      //return this.router.url.slice(0,this.router.url.lastIndexOf('/detalle'));
    },
      error: (e) =>{
        console.log(e);
        this.service.createAlert('Error al regresar la órden', 'danger');
      }
  });
}

FormEjecutar(form: any) {
this.service.ejecutarWO(this.formEjecutarOT).subscribe({
  next: (r: any) =>{
    //return this.router.url.slice(0,this.router.url.lastIndexOf('/detalle'));
    //this.service.createAlert('Solicitud guardada', 'success');
    this.router.navigate(['/tabs/procesossoporte/knocker_wo']);
    this.service.createAlert('Orden ejecutada correctamente', 'success');
  },
  error: (e) =>{
    console.log(e);
    this.service.createAlert('Error al terminar la órden', 'danger');
  }
  });
}

GetSurveyComent(jsonDet: Object){
  this.service.getSurveyComent(jsonDet).subscribe({
    next: (r: any) =>{
      this.datosEncuestaServicioRetro=r;
    },
    error: (e) =>{
      console.log(e);
    }
  });
}

FormEncSugerenciaOT(form: any) {
  this.service.formSurvSugerenciaOT(this.formSugerenciaOT).subscribe({
    next: (r: any) =>{
      this.ngOnInit();
      this.service.createAlert('Comentario guardado', 'success');
    },
    error: (e) =>{
      console.log(e);
      this.service.createAlert('No se pudo guardar el comentario', 'danger');
    }
    });
}

getPersonasPorEvaluar(jsonDet: Object){
  this.service.getPersonasPorEvaluarWO(jsonDet).subscribe({
    next: (r: any) =>{
      this.datosPersonasXEvaluar=r;
    },
    error: (e) =>{
      console.log(e);
    }
  });
}

GetSurveyAVG(jsonDet: Object){
  this.service.getEvaluacionAvgWO(jsonDet).subscribe({
    next: (r: any) =>{
      this.datosEvaluacionAvg=r;
    },
    error: (e) =>{
      console.log(e);
    }
  });
}

FormRecursosEncuestaWO(form: any) {
  this.service.sendRecursosEncuestaWO(this.formRecursosEncuesta).subscribe({
    next: (r: any) =>{
      this.ngOnInit();//refrescar promedio, lista de colaboradores evaluados y por evaluar
      this.service.createAlert('Encuesta guardada', 'success');
    },
    error: (e) =>{
      console.log(e);
      this.service.createAlert('No se pudo guardar la encuesta', 'danger');
    }
    });
}

getEvaluacionesEncuestaOT(jsonDet: Object){
  this.service.getEvaluacionesEncuestWO(jsonDet).subscribe({
    next: (r: any) =>{
      this.datosEncuestasOT=r;
    },
    error: (e) =>{
      console.log(e);
    }
  });
}

public BotonBorrarAnxOT(att_id:number):void {
  let id_anexo=att_id;
  this.service.borrarAnexoOT(id_anexo).subscribe({
    next: (r: any) =>{
      this.ngOnInit();
    },
    error: (e) =>{
      this.service.createAlert('No se pudo borrar el archivo', 'danger');
    }
    });
}





}
