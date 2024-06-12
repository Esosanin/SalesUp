// Interface: Vuelo y Hospedaje
// Sirven para la Interface: Reagendar y EditarServicio
    interface Vuelo {
        comentario: string,
        tipo: number,           // Seleccionar el tipo de vuelo
        internacional: number,  // ¿Es internacional?
        origen: number,         // Seleccionar el origen
        destino: number,        // Seleccionar el destino
        f_salida: string,       // Fecha de salida
        h_salida_desc: string,  // Descripción de hora salida (preferente)
        h_salida_num: string,   // Numero de hora salida (preferente)
        f_regreso: string,      // Fecha de regreso
        h_regreso_desc: string, // Descripción de hora regreso (preferente)
        h_regreso_num: string,  // Numero de hora regreso (preferente)
    }
    interface Hospedaje {
        comentario: string,     // Comentario
        tipo: number,           // Seleccionar el tipo de hospedaje
        internacional: number,  // Seleccionar si es un hospedaje internacional
        ciudad: number,         // Seleccionar la ciudad de hospedaje
        entrada: string,        // Fecha de entrada
        salida: string,         // Fecha de salida
    }
    interface Auto {
        tipo: number;             // Seleccionar el tipo de auto
        lugar: number;            // Seleccionar el lugar de entrega
        f_entrada: string;        // Fecha de inicio de entrega
        f_salida: string;         // Fecha de fin de salida
    }
interface Reagendar {
    tipo_sol: number;
    v: Vuelo;
    h: Hospedaje;
}
interface EditarServicio {
    id: number;
    tipo_sol: number;
    v: Vuelo;
    h: Hospedaje;
    a: Auto;
}
// Dos interfaces en una: Recotizar y Cancelar Servicio
interface Recotizar$Cancelar {
    tipo_sol: number;
    id_detalle: number;
    comentario: string;
}

interface V_Encuesta {
    calificacion: number;
    comentario: string;
}
interface V_Escala {
    id: number;

    lugar: number;
    h_inicio: string;
    h_fin: string;
}

interface M_201 {
    planTrabajo: string;              // Descripción del plan de trabajo
    soliTardia: string;               // Descripción de la solicitud tardía
}
interface M_202 {
    tipoSolicitud: string;            // Seleccionar el tipo de solicitud

    v: Vuelo;
    h: Hospedaje;
    a: Auto;
}
interface M_203 {
    celularLider: number;
    comentario: string;
}
interface M_204 {
    comentarioLider: string;
    solicitudTardia: string;
}
interface M_205 {
    comentarioContralor: string;
}
interface M_1001{
    comentario: string;
}
interface M_1002{
    nuevo_solic: number;
    comentario: string;
}

export class AllModalData {
    reagendar!: Reagendar;
    editarServicio!: EditarServicio;
    Recotizar$Cancelar!: Recotizar$Cancelar;

    v_encuesta!: V_Encuesta;
    v_escala!: V_Escala;

    m_201!: M_201;
    m_202!: M_202;
    m_203!: M_203;
    m_204!: M_204;
    m_205!: M_205;

    m_1001!: M_1001;
    m_1002!: M_1002;

    constructor(){
        this.AllClear();
    }

    AllClear(){
        this.reagendar = {
            tipo_sol: 0,
            v: {
                comentario: '',
                tipo: 0,
                origen: 0,
                destino: 0,
                f_salida: '',
                h_salida_desc: '',
                h_salida_num: '',
                f_regreso: '',
                h_regreso_desc: '',
                h_regreso_num: '',
                internacional: 0
            },
            h: {
                ciudad: 0,
                comentario: '',
                entrada: '',
                internacional: 0,
                salida: '',
                tipo: 0,
            },
        };
        this.editarServicio = {
            tipo_sol: 0,
            id: 0,
            v: {
                tipo: 0,
                internacional: 0,
                comentario: '',
                origen: 0,
                destino: 0,
                f_salida: '',
                h_salida_desc: '',
                h_salida_num: '',

                // Regreso es igual a Entrada
                f_regreso: '',
                h_regreso_desc: '',
                h_regreso_num: '',
            },
            h: {
                tipo: 0,
                ciudad: 0,
                internacional: 0,
                comentario: '',
                entrada: '',
                salida: '',
            },
            a: {
                tipo: 0,
                lugar: 0,
                f_entrada: '',
                f_salida: ''
            }
        };
        this.Recotizar$Cancelar = {
            tipo_sol: 0,
            id_detalle: 0,
            comentario: ''
        };

        this.v_encuesta = {
            calificacion: 0,
            comentario: ''
        };
        this.v_escala = {
            id: 0,
            lugar: 0,
            h_inicio: '',
            h_fin: ''
        };

        this.m_201 = {
            planTrabajo: '',
            soliTardia: '',
        };
        this.m_202 = {
            tipoSolicitud: '',

            v: {
                comentario: '',
                tipo: 0,
                internacional: 0,
                origen: 0,
                destino: 0,
                f_salida: '',
                h_salida_desc: '',
                h_salida_num: '',
                f_regreso: '',
                h_regreso_desc: '',
                h_regreso_num: '',
            },
            h: {
                comentario: '',
                tipo: 0,
                internacional: 0,
                ciudad: 0,
                entrada: '',
                salida: '',
            },
            a: {
                tipo: 0,
                lugar: 0,
                f_entrada: '',
                f_salida: '',
            }
        };
        this.m_203 = {
            celularLider: 0,
            comentario: ''
        };
        this.m_204 = {
            comentarioLider: '',
            solicitudTardia: ''
        };
        this.m_205 = {
            comentarioContralor: ''
        };

        this.m_1001 = {
            comentario: ''
        }
        this.m_1002 = {
            nuevo_solic: 0,
            comentario: ''
        }
    }

}
