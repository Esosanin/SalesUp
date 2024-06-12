export class Plan {
    id_sap: number = parseInt(localStorage.getItem('id_sap')!);
    proy_men: number = 0;
    proy_sem: number = 0;
    fecha_create: string = '';
    confirmacion: boolean = false;
}
