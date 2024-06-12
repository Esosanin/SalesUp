import { DatePipe } from '@angular/common';

let datePipe = new DatePipe('en');

export class Levantamiento {
    id: number = 0;
    nombre_apli: string = '';
    fecha_entrega: string = datePipe.transform(new Date(), 'yyyy-MM-dd')!;
    comentarios: string = '';
    estatus: string = 'Detectado';
    CntctCode: number | undefined = undefined;
    id_sap: number = parseInt(localStorage.getItem('id_sap')!);
    id_actividad: number = 0;
    CardCode = '';
    LineNum: number | undefined = undefined;
}
