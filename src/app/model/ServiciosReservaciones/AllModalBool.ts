
export class AllModalBool {

  reagendar!: boolean;
  editarServicio!: boolean;
  recotizar!: boolean;
  cancelarServicio!: boolean;

  v_encuesta!: boolean;
  v_cotizacion!: boolean;
  v_escala!: boolean;

  m_201!: boolean;
  m_202!: boolean;
  m_203!: boolean;
  m_204!: boolean;
  m_205!: boolean;
  m_206!: boolean;
  m_207!: boolean;
  m_208!: boolean;
  m_209!: boolean;

  m_1001!: boolean;
  m_1002!: boolean;

  constructor() {
    this.AllClear();
  }

  AllClear(){
    this.reagendar = false;
    this.editarServicio = false;
    this.recotizar = false;
    this.cancelarServicio = false;

    this.v_encuesta = false;
    this.v_cotizacion = false;
    this.v_escala = false;

    this.m_201 = false;
    this.m_202 = false;
    this.m_203 = false;
    this.m_204 = false;
    this.m_205 = false;
    this.m_206 = false;
    this.m_207 = false;
    this.m_208 = false;
    this.m_209 = false;

    this.m_1001 = false;
    this.m_1002 = false;
  }

}
