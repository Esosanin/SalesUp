import { Component, OnInit } from '@angular/core';
import { Embudo } from 'src/app/model/Servicios/Embudo';
import { ServiciosService } from 'src/app/servicios/servicios/servicios.service';

@Component({
  selector: 'app-ver-detalles',
  templateUrl: './ver-detalles.page.html',
  styleUrls: ['./ver-detalles.page.scss'],
})
export class VerDetallesPage implements OnInit {

  ES_docnum: string = '';

  ES_cotizacion_copy: Embudo = new Embudo();
  ES_encabezado: Embudo = new Embudo();
  ES_partidas: Array<any> = [];

  ES_selectEtapa: Array<any> = [];

  constructor(private service: ServiciosService) { }

  ngOnInit() {
    this.ES_docnum = sessionStorage.getItem('ES_servicio')!;
    this.Embudo_getCotizacion();
    //this.Embudo_getSelectBitrix();
  }

  async Embudo_getCotizacion(){
    this.service.Embudo_getCotizacion({docnum: this.ES_docnum}).subscribe(
      (r:any) => {
        this.ES_encabezado = new Embudo();
        this.ES_encabezado = r[0] as any;

        this.ES_partidas = [];
        this.ES_partidas = r[1] as any;
      },
      e => {
        console.log(e);
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
      }
    );
  }

  // CONEXIÓN A SAP SERVER
  async Embudo_getSelectBitrix(){
    this.service.Embudo_getSelectBitrix().subscribe(
      r => {
        this.ES_selectEtapa = [];
        this.ES_selectEtapa = r as any;
      },
      e => {
        console.log(e);
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
      }
    );
  }

  Embudo_changeEtapa(){
    var etapa = this.ES_selectEtapa.find(x => x.CODE == this.ES_encabezado.etapacodigo);
    this.ES_encabezado.Etapa = etapa.NAME;
    this.ES_encabezado.U_BitrixID = etapa.U_BitrixID;
  }

}
