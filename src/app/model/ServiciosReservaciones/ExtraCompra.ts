interface AdjArchivo {
    id_cabecera: number;
    titulo_archivo: string;
    descripcion: string;
    archivo: any;
};
interface CargoExtra {
    monto: number;
    comentario: string;
    motivo: number;
    concepto_extra: number;
    moneda: string;
    vinculo: number;
};
interface Comentario {
    comentario: string;
};
interface TarifaCompra {
    concepto: string;
    monto: number;
    monto_dias: number;
    moneda: string;
    moneda_extra: string;
    vinculo: number;
};
interface TarifaPublica {
    concepto: string;
    monto: number;
    moneda: string;
    vinculo: number;
};
interface CargoViaticos {
    viaticos: number;
};

export class ExtraCompra {
    AdjArchivo!: AdjArchivo;
    CargoExtra!: CargoExtra;
    Comentario!: Comentario;
    TarifaCompra!: TarifaCompra;
    TarifaPublica!: TarifaPublica;
    CargoViaticos!: CargoViaticos;

    constructor(){
        this.AllClear();
    }

    AllClear(){
        this.AdjArchivo = {
            archivo: '',
            descripcion: '',
            id_cabecera: 0,
            titulo_archivo: '',
        };
        this.CargoExtra = {
            comentario: '',
            concepto_extra: 0,
            moneda: '',
            monto: 0,
            motivo: 0,
            vinculo: 0,
        };
        this.Comentario = {
            comentario: ''
        };
        this.TarifaCompra = {
            concepto: '',
            moneda: '',
            moneda_extra: '',
            monto: 0,
            monto_dias: 0,
            vinculo: 0
        };
        this.TarifaPublica = {
            concepto: '',
            moneda: '',
            monto: 0,
            vinculo: 0
        };
        this.CargoViaticos = {
            viaticos: 0
        };
    }
}
