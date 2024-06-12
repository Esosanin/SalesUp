export class Checada {
    id_colaborador = parseInt(localStorage.getItem('id_colaborador')!);
    colaborador = localStorage.getItem('nombre_colaborador')!;
    entrada = false;
    ubicacion = '';
    tipo = '';
    proyecto = '';
    tipo_acceso = '';
    destino = '';
    comentarios = '';
    checkExists = false;
    detalles = new Array();
    n_colaborador: string = localStorage.getItem('n_colaborador')!;
}
