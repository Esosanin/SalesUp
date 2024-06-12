import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { SegurosService } from 'src/app/servicios/seguros/seguros.service';

@Component({
  selector: 'app-seguros',
  templateUrl: './seguros.page.html',
  styleUrls: ['./seguros.page.scss']
})

export class SegurosPage implements OnInit {

  @ViewChild('search') search: any;
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  top: boolean = false;

  limite: number = 10;

  seguros: Array<any> = [];
  seguros2: Array<any> = [];
  showSearchbar: boolean = false;
  config: any;
  queryText: string = '';
  show: boolean = false;
  alert: boolean = false;


  constructor(private service: SegurosService) {
  }

  refresh(event: any){
    this.ngOnInit();
    this.updateSeguros();
    event.target.complete();
  }

  ionViewWillEnter(){

  }

  //ABRIR ARCHIVOS PDF
  openFile(file: string) {
    console.log(file);
  }

  updateSeguros() {
    this.limite = 10;
    this.seguros = this.seguros2;
    if (this.queryText != '') {
      var seguros3: Array<any> = [];
      this.seguros.forEach((seguro: any) => {
        if (seguro['U_Marca'] && seguro['U_Marca'].toString().toLowerCase().includes(this.queryText.toLowerCase()) || seguro['slpname'] && seguro['slpname'].toString().toLowerCase().includes(this.queryText.toLowerCase()) || seguro['Name'] && seguro['Name'].toString().toLowerCase().includes(this.queryText.toLowerCase())) {
          seguros3.push(seguro);
        }
      });
      this.seguros = seguros3;
    } else {
      this.seguros = this.seguros2;
    }
  }


  //INFINITE SCROLL
  updateLimite(event: any) {
    this.top = true;
    this.limite += 10;
    event.target.complete();
  }

  logScrollEnd(){
    this.content.getScrollElement().then(r=>{
      if(r.scrollTop <=0){
        this.top = false;
      this.limite = 10;
      }
    });
  }

  ScrollToTop() {
    this.content.scrollToTop(700).then(r=>{
      this.top = false;
      this.limite = 10;
    },e=>{
      console.log(e);
    });
  }

  //FOCUS BÚSQUEDA
  focus() {
    setTimeout(() => {
      this.search.setFocus();
    }, 300);
  }

  ngOnInit() {
    this.service.getRelacion().subscribe(r => {
      this.seguros = r as Array<Object>;
      this.seguros2 = r as Array<Object>;
    });
  }

}
