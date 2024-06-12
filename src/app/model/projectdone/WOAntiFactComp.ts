export class FormFactAntiComp{
    coment_anticipo_completo: string = '';
    id_colaborador: number = parseInt(localStorage.getItem('id_colaborador')!);
    id_ot: number = parseInt(localStorage.getItem('idDetalleWO')!);
    comentOt: any;
}

export class FormEncuestasatisf{
  mailencuestasatisf: string = '';
}

export class FormFactAntiParc{
    monto_facturar: string = '';
    coment_anticipo_parcial: string = '';
    id_colaborador: number = parseInt(localStorage.getItem('id_colaborador')!);
    id_ot: number = parseInt(localStorage.getItem('idDetalleWO')!);
}
export class FormWOHistComent{
    comentOt: string = '';
    id_colaborador: number = parseInt(localStorage.getItem('id_colaborador')!);
    id_ot: number = parseInt(localStorage.getItem('idDetalleWO')!);
}
export class FormFechaConfirmada{
    OTfechaConfirmada: string = '';
    id_colaborador: number = parseInt(localStorage.getItem('id_colaborador')!);
    id_ot: number = parseInt(localStorage.getItem('idDetalleWO')!);
}
export class formFechaTerminacion{
    OTfechaTerminacion: string = '';
    id_colaborador: number = parseInt(localStorage.getItem('id_colaborador')!);
    id_ot: number = parseInt(localStorage.getItem('idDetalleWO')!);
}
export class formCancelarOT{
    comentcancelot: string = '';
    id_colaborador: number = parseInt(localStorage.getItem('id_colaborador')!);
    id_ot: number = parseInt(localStorage.getItem('idDetalleWO')!);
}
export class formEjecutarOT{
    mailencuestasatisf: string = '';
    id_colaborador: number = parseInt(localStorage.getItem('id_colaborador')!);
    id_ot: number = parseInt(localStorage.getItem('idDetalleWO')!);
}
export class formSugerenciaOT{
    encuestacomentsugerencia: string = '';
    id_colaborador: number = parseInt(localStorage.getItem('id_colaborador')!);
    id_ot: number = parseInt(localStorage.getItem('idDetalleWO')!);
}
export class formRecursosEncuesta{
    recursoId: number = 0;
    coordprevserv: number = 0;
    entregaconfelectimp: number = 0;
    puntualidad: number = 0;
    uniforme: number = 0;
    equiposeguridad: number = 0;
    conocimientotecnicoeq: number = 0;
    certezadetecproblema: number = 0;
    herramientayeqipo: number = 0;
    calidadreporteservicio: number = 0;
    tratopersonal: number = 0;
    id_colaborador: number = parseInt(localStorage.getItem('id_colaborador')!);
    id_ot: number = parseInt(localStorage.getItem('idDetalleWO')!);
}
/*export class Ticket{
    id_solicitante: number = parseInt(localStorage.getItem('id_colaborador')!);
    titulo_ticket: string = '';
    id_area: number = 0;
    id_subarea: number = 0;
    descripcion_ticket: string = '';
    archivos: Array<any> = [];
}*/
