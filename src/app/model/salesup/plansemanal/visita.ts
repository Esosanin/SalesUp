import { DatePipe } from '@angular/common';

let datePipe = new DatePipe('en');

export class Visita {
    id = 0;
    fecha_comp = datePipe.transform(new Date(), 'yyyy-MM-dd')!;
    objetivo_gen = '';
    hora_inicio = datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss.SSS')!;
    hora_fin = datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss.SSS')!;
    hora_checkin = ''
    hora_checkout = ''
    geo_checkin = '';
    geo_checkout = '';
    estatus = 'Programada';
    id_sap = parseInt(localStorage.getItem('id_sap')!);
    CardCode = '';
    LineNum: number | undefined = undefined;
}
