
interface DatosSolicitante{
    PrjCode: string;                    // Numero del proyecto
    autoria_contralor: number;
    autoriza: string;                   // Nombre del autorizador
    btn_imprimir: number;               // Display boton imprimir ¿? 1 | 0
    btn_imprimir_sol: number;           // Display boton (solicitud, vuelo, hospedaje)
    btn_terminar_enviarlider: number;   // Display boton enviar
    totalsol_hechas: number;            // $v_cuenta + $h_cuenta + $a_cuenta
    c_email: string;                    // Email del colaborador
    c_puesto: string;                   // Puesto del colaborador
    celular: string;                    // Celular del colaborador
    contralor_id: number;
    div_cambionombre: string;           // Display div
    div_compras: number;                // Display div
    div_compras_capturar: number;       // Display div
    edo: number;
    envio_contraloria: number;
    estado: string;
    estado_reagendarhosp: string;
    estado_reagendarvuelo: string;
    estado_solicnv: string;
    f_nacimiento: string;
    f_nacimiento_n: string;
    fecha: string;
    internacional_inge: number;
    lider_celular: string;
    lider_email: string;
    lider_id: number;
    motivo: string;
    n_depto: string;
    n_nr: string;
    id_colaborador: number;
    nombre_colab_solicitante: string;
    solicitante_nuevo_nombre: string;
    solicitante_nuevo: string;
    prj_presupuesto: string;
    proyecto_servicio: string;
    req_contraloria: number;
    total_errores: number;
    urgencia: number;
    urgencia_creador: string;
    reagenda_vuelo: number;
    reagenda_hosp: number;

    camn_nom: string;
};
interface DatosHospedaje{
    btn_h_cotiz: number;
    display_btn_cancel_h: number;
    div_h_cotiz: number;
    estado_h: number;
    h_cuenta: number;
    h_inputs_cotiz: number;
    h_option: number;
    id_h: number;
    h_tipo: string;
    h_ciudad: string;
    internacional: string;
    inicio_entrada: string;
    inicio_entrada_n: string;
    fin_salida: string;
    fin_salida_n: string;
};
interface DatosErrores{
    solicitud_errordias: number;
    solicitud_errordias_h: number;
    solicitud_errordias_v: number;
    error_div_compras: number;

    a_errores: number;
    a_errores_txt: Array<any>;
    h_errores: number;
    h_errores_txt: Array<any>;
    v_errores: number;
    v_errores_txt: Array<any>;

    error_prj_presupuesto: number;
    error_viaticos_pend: number;

    error_v_dias_semanasanta: number;
    error_v_dias_verano: number;
    error_v_dias_navidad: number;
    error_v_dias_internacional: number;
    error_v_dias_nacional: number;
    div_v_error: number;
    div_v_cotiz: number;

    error_h_dias_semanasanta: number;
    error_h_dias_verano: number;
    error_h_dias_navidad: number;
    error_h_dias_internacional: number;
    error_h_dias_nacional: number;
    div_h_error: number;
    div_h_cotiz: number;

    error_dias_autos: number;
    div_a_error: number;
    div_a_cotiz: number;
};
interface DatosAuto{
    a_cuenta: number;
    a_inputs_cotiz: number;
    a_option: number;
    btn_a_cotiz: number;
    display_btn_cancel_a: number;
    div_a_cotiz: number;
    estado_a: number;
    id_a: number;
    a_tipo: string;
    a_lugar_entrega: string;
    inicio_entrada: string;
    inicio_entrada_n: string;
    fin_salida: string;
    fin_salida_n: string;
};
interface DatosVuelos{
    btn_v_cotiz: number;
    display_btn_cancel_v: number;
    div_v_cotiz: number;
    estado_v: number;
    id_v: number;
    v_cuenta: number;
    v_inputs_cotiz: number;
    v_option: number;

    origen: string;
    destino: string;
    v_tipo: string;
    v_inicio: string;
    v_fin: string;
    internacional: string;
    justificacion: string;
    inicio_entrada: string;
    inicio_entrada_n: string;
    fin_salida: string;
    fin_salida_n: string;
    fecha: string;
}

export class VH {
    solicitante!: DatosSolicitante;
    errores!: DatosErrores;
    hospedaje!: DatosHospedaje;
    vuelos!: DatosVuelos;
    auto!: DatosAuto;

    hospedaje_cotizacion: Array<any> = [];
    vuelos_cotizacion: Array<any> = [];
    autos_cotizacion: Array<any> = [];

    encuesta: number = 0;
    aerolinea: Array<any> = [];
    totalsol_hechas: number = 0;

    constructor(){
        this.AllClear();
    }

    AllClear(): void{
        this.solicitante = {
            PrjCode: '',
            autoria_contralor: 0,
            autoriza: '',
            btn_imprimir: 0,
            btn_imprimir_sol: 0,
            btn_terminar_enviarlider: 0,
            totalsol_hechas: 0,
            c_email: '',
            c_puesto: '',
            celular: '',
            contralor_id: 0,
            div_cambionombre: '',
            div_compras: 0,
            div_compras_capturar: 0,
            edo: 0,
            envio_contraloria: 0,
            estado: '',
            estado_reagendarhosp: '',
            estado_reagendarvuelo: '',
            estado_solicnv: '',
            f_nacimiento: '',
            f_nacimiento_n: '',
            fecha: '',
            internacional_inge: 0,
            lider_celular: '',
            lider_email: '',
            lider_id: 0,
            motivo: '',
            n_depto: '',
            n_nr: '',
            id_colaborador: 0,
            nombre_colab_solicitante: '',
            solicitante_nuevo_nombre: '',
            solicitante_nuevo: '',
            prj_presupuesto: '',
            proyecto_servicio: '',
            req_contraloria: 0,
            total_errores: 0,
            urgencia: 0,
            urgencia_creador: '',
            reagenda_vuelo: 0,
            reagenda_hosp: 0,

            camn_nom: '',
        };
        this.errores = {
            solicitud_errordias: 0,
            solicitud_errordias_h: 0,
            solicitud_errordias_v: 0,
            error_div_compras: 0,

            a_errores: 0,
            a_errores_txt: [],
            h_errores: 0,
            h_errores_txt: [],
            v_errores: 0,
            v_errores_txt: [],

            error_prj_presupuesto: 0,
            error_viaticos_pend: 0,

            error_v_dias_semanasanta: 0,
            error_v_dias_verano: 0,
            error_v_dias_navidad: 0,
            error_v_dias_internacional: 0,
            error_v_dias_nacional: 0,
            div_v_error: 0,
            div_v_cotiz: 0,

            error_h_dias_semanasanta: 0,
            error_h_dias_verano: 0,
            error_h_dias_navidad: 0,
            error_h_dias_internacional: 0,
            error_h_dias_nacional: 0,
            div_h_error: 0,
            div_h_cotiz: 0,

            error_dias_autos: 0,
            div_a_error: 0,
            div_a_cotiz: 0
        };
        this.hospedaje = {
            btn_h_cotiz: 0,
            display_btn_cancel_h: 0,
            div_h_cotiz: 0,
            estado_h: 0,
            h_cuenta: 0,
            h_inputs_cotiz: 0,
            h_option: 0,
            id_h: 0,
            h_tipo: '',
            h_ciudad: '',
            internacional: '',
            inicio_entrada: '',
            inicio_entrada_n: '',
            fin_salida: '',
            fin_salida_n: '',
        };
        this.vuelos = {
            btn_v_cotiz: 0,
            display_btn_cancel_v: 0,
            div_v_cotiz: 0,
            estado_v: 0,
            id_v: 0,
            v_cuenta: 0,
            v_inputs_cotiz: 0,
            v_option: 0,

            origen: '',
            destino: '',
            v_tipo: '',
            v_inicio: '',
            v_fin: '',
            internacional: '',
            justificacion: '',
            inicio_entrada: '',
            inicio_entrada_n: '',
            fin_salida: '',
            fin_salida_n: '',
            fecha: '',
        };
        this.auto = {
            a_cuenta: 0,
            a_inputs_cotiz: 0,
            a_option: 0,
            btn_a_cotiz: 0,
            display_btn_cancel_a: 0,
            div_a_cotiz: 0,
            estado_a: 0,
            id_a: 0,
            a_tipo: '',
            a_lugar_entrega: '',
            inicio_entrada: '',
            inicio_entrada_n: '',
            fin_salida: '',
            fin_salida_n: ''
        };

        this.hospedaje_cotizacion = [];
        this.vuelos_cotizacion = [];
        this.autos_cotizacion = [];

        this.encuesta = 0;
        this.aerolinea = [];
        this.totalsol_hechas = 0;
    }

}
