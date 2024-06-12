export class Embudo {
    FechaCont: string = '';
    FechaCont_n: string = '';
    DocNum: number = 0;
    DocEntry: number = 0;
    Cliente: string = '';
    nvendedor: number = 0;
    zona: string = '';
    oficina: string = '';
    TOTAL: number = 0; // Importe USD 
    TOTAL_n: string = ''; // Importe USD con diseño Currency
    Referencia: string = '';
    porc_cierre: number = 0;
    U_FECHACIERRE: string = '';
    U_FECHACIERRE_n: string = ''; // Modal: Detalle (format = 00/00/0000); Update (minimo = fecha minima de cierre, fecha actual)
    comments: string = '';
    Etapa: string = '';
    etapacodigo: number = 0;
    industria: string = '';
    diff: number = 0;
    U_BitrixID: number = 0;
    permiso: number = 0;

    subtotal: number = 0;
    subtotal_n: string = '';

    fecha_actual: string = '';
}