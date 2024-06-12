export class FormMacro{ //permisos FormPermisos
    fecha_inicial: string = '';
    fecha_final: string = '';
    p_motivo: number = 0;
    id_colaborador: number = parseInt(localStorage.getItem('id_colaborador')!);
}
export class FormMacroD{ //descansos FormPermisos
    fecha_inicial: string = '';
    fecha_final: string = '';
    d_motivo: number = 0;
    d_especificar: string = '';
    id_colaborador: number = parseInt(localStorage.getItem('id_colaborador')!);
    diasdisponiblesdescanso: number = parseInt(localStorage.getItem('diasdisponiblesdescanso')!);
    esproyectos: number = parseInt(localStorage.getItem('esproyectos')!);
}
export class FormMacroV{ //vacaciones FormPermisos
    fecha_inicial: string = '';
    fecha_final: string = '';
    v_regreso_labores: string = '';
    v_comentarios: string = '';
    id_colaborador: number = parseInt(localStorage.getItem('id_colaborador')!);
    v_antiguedad: number = parseInt(localStorage.getItem('antiguedadingresoanios')!);
    v_dias_totales: number = parseInt(localStorage.getItem('diastotalesdeantiguedad')!);
    diasdisponiblesdeantiguedad: number = parseInt(localStorage.getItem('diasdisponiblesdeantiguedad')!);
    actividad1: string = '';
    responsables1: string = '';
    fechalimite1: string = '';
    observaciones1: string = '';
    actividad2: string = '';
    responsables2: string = '';
    fechalimite2: string = '';
    observaciones2: string = '';
    actividad3: string = '';
    responsables3: string = '';
    fechalimite3: string = '';
    observaciones3: string = '';
}
