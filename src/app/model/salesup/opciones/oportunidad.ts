export class Oportunidad {
    id: number = 0;
    descripcion: string = '';
    CardCode = '';
    monto_estim = 0;
    id_industria: number | undefined = undefined;
    id_spk1: number | undefined = undefined;
    id_sap: number = parseInt(localStorage.getItem('id_sap')!);
    LineNum: number | undefined = undefined;
}
