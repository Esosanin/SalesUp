
interface Vuelo {
    opt1: boolean;
    opt2: boolean;
    opt3: boolean;
    opt4: boolean;
}
interface Hosp {
    opt1: boolean;
    opt2: boolean;
    opt3: boolean;
}
interface Auto {
    opt1: boolean;
    opt2: boolean;
    opt3: boolean;
}

export class DivAcciones {
    vistaFab!: boolean;
    vistaDiv!: boolean;

    opt1!: boolean;
    opt2!: boolean;
    opt3!: boolean;
    opt4!: boolean;
    opt5!: boolean;
    opt6!: boolean;

    solicnv!: boolean;
    vueloAcciones!: boolean;
    hospAcciones!: boolean;

    cuenta_opts!: number;
    vistaEncuesta!: boolean;

    vuelo!: Vuelo;
    hosp!: Hosp;
    auto!: Auto;

    constructor() {
        this.AllClear();
    }

    AllClear(){
        this.vistaFab = false;
        this.vistaDiv = false;

        this.opt1 = false;
        this.opt2 = false;
        this.opt3 = false;
        this.opt4 = false;
        this.opt5 = false;
        this.opt6 = false;

        this.solicnv = false;
        this.vueloAcciones = false;
        this.hospAcciones = false;

        this.cuenta_opts = 0;
        this.vistaEncuesta = false;

        this.vuelo = {
            opt1: false,
            opt2: false,
            opt3: false,
            opt4: false,
        }
        this.hosp = {
            opt1: false,
            opt2: false,
            opt3: false,
        }
        this.auto = {
            opt1: false,
            opt2: false,
            opt3: false,
        }
    }
}
