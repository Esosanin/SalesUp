import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonInfiniteScroll } from '@ionic/angular';
import { FinanzasService } from 'src/app/servicios/finanzas/finanzas.service';

@Component({
  selector: 'app-saldos-viaticos-colab',
  templateUrl: './saldos-viaticos-colab.page.html',
  styleUrls: ['./saldos-viaticos-colab.page.scss'],
})
export class SaldosViaticosColabPage implements OnInit {

  @ViewChild('searchInput') searchInput: any;
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll!: IonInfiniteScroll;

  showSearchbar: boolean = false;
  IR_showLoader: boolean = false;
  search: any;

  limite: number = 20;
  length: number = 0;

  SVC_colaboradores: Array<any> = [];
  SVC_colaborador: any = {
    id: 0,
    name: '',
    saldo: 0
  };
  SVC_colaboradorSaldo: any;

  constructor(private service: FinanzasService) { }

  ngOnInit() {
    this.SVC_colaboradorSaldo = Intl.NumberFormat('en-ES', {style: 'currency', currency: 'USD'}).format(this.SVC_colaborador.saldo);

    this.SVC_getColaboradores();
  }

  //FOCUS BÚSQUEDA
  focus() {
    setTimeout(() => {
      this.searchInput.setFocus();
      this.limite = 20;
    }, 500);
  }

  addItems(event: any) {
    event.target.complete();
    this.limite += 20;
  }

  SVC_changeSearch(value: any){
    this.search = value;
    this.SVC_getColaboradores();
    this.content.scrollToTop();
    this.limite = 20;
  }

  async SVC_getColaboradores(){
    this.service.SVC_getColaboradores({search: this.search}).subscribe(
      r => {
        this.length = Object.keys(r).length;
        this.SVC_colaboradores = r as any;
      },
      e => {
        console.log(e);
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
      }
    );
  }

}
