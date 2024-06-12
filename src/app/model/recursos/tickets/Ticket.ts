export class Ticket{
    id_solicitante: number = parseInt(localStorage.getItem('id_colaborador')!);
    titulo_ticket: string = '';
    id_area: number = 0;
    id_subarea: number = 0;
    descripcion_ticket: string = '';
}
