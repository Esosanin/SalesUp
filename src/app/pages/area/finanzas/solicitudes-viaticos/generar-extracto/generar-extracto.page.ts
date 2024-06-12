import { Component, OnInit } from '@angular/core';
import { FinanzasService } from 'src/app/servicios/finanzas/finanzas.service';

@Component({
  selector: 'app-generar-extracto',
  templateUrl: './generar-extracto.page.html',
  styleUrls: ['./generar-extracto.page.scss'],
})
export class GenerarExtractoPage implements OnInit {

  GE_fInicio: string = '';
  GE_fFinal: string = '';

  constructor(private service: FinanzasService) { }

  ngOnInit() {
  }

  // Genera un archivo de Excel
  GE_generarArchivo(){
    this.service.GE_generarArchivo({inicio: this.GE_fInicio, final: this.GE_fFinal}).subscribe(
      r => {
        // CON NOMBRE UNICO: asde4-dfsd834-2358ydfhduo23nn-d867hhn2.xlsx
        //let url = window.URL.createObjectURL(r);
        //window.open(url);

        // Con nombre predefinido
        let link = document.createElement('a');
        link.download = "asistencia.xlsx";
        link.href = URL.createObjectURL(r);
        link.click();
        URL.revokeObjectURL(link.href);
      },
      e => {
        console.log(e);
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
      }
    );
  }

}
