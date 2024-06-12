interface infoAnexos {
    file: string;
    tipo: number;
}

export class InformacionGastos {

    // Aprobargasto
    aprobar_gasto: any = {
        gasd_id: 0,
        gasd_informe: 0,

        gasd_tipoGasto: 0,
        gasd_tipoGasto_n: '',

        gasd_fechaTransaccion: '',
        gasd_fechaTransaccion_n: '',

        gasd_cantidad: 0,
        gasd_cdCompra: '',

        gasd_monto: 0,
        gasd_monto_n: '',

        gasd_otrosImpuestos: 0,

        gasd_moneda: 0,
        gasd_moneda_n: '',

        gasd_mxIVAMontoMXN: 0,
        gasd_mxIVAMontoMXN_n: '',

        gasd_tipoComprobante: 0,
        gasd_tipoComprobante_n: '',

        gasd_RFC: '',
        gasd_establecimiento: '',
        gasd_comentarios: '',
        gasd_anexo: '',

        gasd_fechaElaboracion: '',
        gasd_fechaElaboracion_n: '',

        gasd_estado: 0,
        gasd_status: 0,
        gasd_colaborador_id: 0,
        gasd_frontera: 0,
        gasd_acompanyantes: 0,
    };

    // Asistentes gasto
    asistentes_gasto: Array<any> = [];

    // Anexos gasto
    anexos_gasto: Array<infoAnexos> = [];

    // Excepciones gasto
    excepciones_gasto: Array<any> = [];
}
