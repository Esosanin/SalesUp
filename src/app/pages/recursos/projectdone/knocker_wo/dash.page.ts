import { Component, OnInit, ViewChild } from '@angular/core';
//import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { IonContent } from '@ionic/angular';
import { Router,NavigationEnd } from '@angular/router';
import { KnockerWO } from 'src/app/servicios/knocker/wo/knocker_wo.service';
//import { FormMacro } from 'src/app/model/VacacionesForm'

@Component({
  selector: 'app-dash',
  templateUrl: './dash.page.html',
  styleUrls: ['./dash.page.scss'],
})

export class DashPage implements OnInit {

  @ViewChild('searchInput') searchInput: any;
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  segment: string = 'WOabierto';

  //VARIABLES
  id_colaborador: number = localStorage.getItem('id_colaborador') ? parseInt(localStorage.getItem('id_colaborador')!) : 0;
  id_perfilwo: number = localStorage.getItem('id_perfilwo') ? parseInt(localStorage.getItem('id_perfilwo')!) : 0;
  regionwo: string = localStorage.getItem('regionwo') ? localStorage.getItem('regionwo')! : '';
  es_pmwo: number = localStorage.getItem('es_pmwo') ? parseInt(localStorage.getItem('es_pmwo')!) : 0;

  datoperf: any =[];
  proyectoswoabiertosArray: any =[];
  proyectoswocerradosArray: any =[];

  //para el buscador
  dataem: any;//abiertos
  resultsem: any;//abiertos
  dataemC: any;//cerrados
  resultsemC: any;//cerrados





  constructor(private service:KnockerWO,
    private router: Router) {
  }


  ngOnInit() {

    //this.generateItems();//ejemplo infinitescroll

    let json = {
      id_colaborador: this.id_colaborador
      , id_perfil: this.id_perfilwo
      , region: this.regionwo
      , es_pm_wo: this.es_pmwo
    };
    this.service.getdatoknockerpermiso(json).subscribe({
      next: (r) =>{


        this.datoperf=r;
        localStorage.setItem('id_perfilwo', this.datoperf[0].asignperf_perfil);
        localStorage.setItem('regionwo', this.datoperf[0].region);
        localStorage.setItem('es_pmwo', this.datoperf[0].es_pm);

        let json = {
          id_colaborador: this.id_colaborador
          , id_perfil: this.datoperf[0].asignperf_perfil
          , region: this.datoperf[0].region
          , es_pm_wo: this.datoperf[0].es_pm
        };

        this.service.getproyectoswoabiertos(json).subscribe({
          next: (r) =>{
            this.proyectoswoabiertosArray=r;
            this.dataem = this.proyectoswoabiertosArray;
          },
          error: (e) =>{
            console.log(e);
            this.service.createAlert('No se pudo traer la información del perfil', 'danger');
          }
        });
        this.service.getproyectoswocerrados(json).subscribe({
          next: (r) =>{
            this.proyectoswocerradosArray=r;
            this.dataemC = this.proyectoswocerradosArray;
          },
          error: (e) =>{
            console.log(e);
            this.service.createAlert('No se pudo traer la información de proyectos cerrados', 'danger');
          }
        });


      },
      error: (e) =>{
        console.log(e);
        this.service.createAlert('No se pudo traer la información de proyectos abiertos', 'danger');
      }
    });




  } //ngOnInit() fin

back(){
  return this.router.url.slice(0,this.router.url.lastIndexOf('/'));
}

initializeItems(){
    this.dataem = this.proyectoswoabiertosArray;
    this.resultsem = [...this.dataem];
    this.dataemC = this.proyectoswocerradosArray;
    this.resultsemC = [...this.dataemC];
}
handleChange(event: any) {
  this.initializeItems();//employeeList
  //console.log(this.employeeList);//ok
// set val to the value of the searchbar
/*let val = event.target.value;
// if the value is an empty string don't filter the items
if (val && val.trim() != '') {
this.employeeList = this.employeeList.filter((item) => {
  return (item.nombres.toLowerCase().indexOf(val.toLowerCase())>-1);
})
}*/
const query = event.target.value.toLowerCase();
//console.log(query);//ok
this.dataem = this.dataem.filter((d: { [x: string]: string; }) => d['nombres'].toLowerCase().indexOf(query) > -1);
//console.log(this.resultsem);
  /*const query = event.target.value.toLowerCase();
  this.results = this.data.filter(d => d.toLowerCase().indexOf(query) > -1);
  console.log(this.results);*/
  return this.dataem;
}
handleChangeBuscarAbiertos(event: any) {
  this.initializeItems();
  const query = event.target.value.toLowerCase();
  this.dataem = this.dataem.filter((d: { [x: string]: string; }) => d['todorow'].toLowerCase().indexOf(query) > -1);
  return this.dataem;
}
handleChangeBuscarCerrados(event: any ) {
  this.initializeItems();
  const query = event.target.value.toLowerCase();
  this.dataemC = this.dataemC.filter((d: { [x: string]: string; }) => d['todorow'].toLowerCase().indexOf(query) > -1);
  return this.dataemC;
}

/*passTheSalt(event) {
this.router.navigate(['/tabs/procesossoporte/knocker_wo/knocker_wo_detalle/event']);
}*/




}
