import { DatePipe } from '@angular/common';

let datePipe = new DatePipe('en');

export class Compromiso {
    id: number = 0;
    id_sap: number = parseInt(localStorage.getItem('id_sap')!);
    detalles: string = '';
    fecha: string =  datePipe.transform(new Date(), 'yyyy-MM-dd')!;
    hora: string = datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss.SSS')!;
    estatus: string = 'Pendiente';
    CntctCode: number | undefined = undefined;
    id_actividad: number = 0;
    CardCode = '';
    LineNum: number | undefined = undefined;
}
