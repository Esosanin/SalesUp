export class SolicitudRegistrada {
  // INFORMACION GENERAL
  sol_id: any = '';
  sol_nombre_solicitud: any = '';
  sol_nombre_solicitante: any = '';
  nombre_solicitante: any = '';
  sol_solicitante_colaborador_id: any = '';
  sol_jefeDirecto: any = '';
  sol_comentarioGeneral: any = '';
  sol_fechaSalida: any = '';
  sol_fechaSalida_n: any = '';
  sol_fechallegada: any = '';
  sol_fechallegada_n: any = '';
  sol_horaSalida: any = '';
  sol_horaSalida_n: any = '';
  sol_horaLlegada: any = '';
  sol_horaLlegada_n: any = '';
  sol_duracion: any = '';
  sol_cantidadAcompanyantes: any = '';
  sol_proyectoServicioOpcion: any = '';
  sol_departamentos_id: any = '';
  sol_geografica_id: any = '';
  sol_motivo: any = '';
  sol_cliente: any = '';
  sol_origen: any = '';
  sol_destino: any = '';
  sol_tipoTransporte: any = '';
  sol_cuentaDePago: any = ''; // tipo_pago
  sol_cuentaPersonal: any = '';
  sol_cuentaEmpresarial: any = '';
  sol_comidas: any = '';
  sol_autobus: any = '';
  sol_hospedaje: any = '';
  sol_casetas: any = '';
  sol_combustibles: any = '';
  sol_telCel: any = '';
  sol_lavanderia: any = '';
  sol_taxi: any = '';
  sol_estacionamiento: any = '';
  sol_estado: any = '';
  sol_retenida: any = '';

  // DEPARTAMENTO
  id_aprobador: any = ''; // JEFE INMEDIATO
  id_departamentos: any = '';

  // JEFE DIRECTO
  nombre_lider: any = '';

  departamento_codigo: any = '';
  zona_geografica: any = '';

  // SAPSERVER *(NO SE USA)
  PrcCode: any = '';
  DEPTO: any = '';
  PrjCode: any = '';
  PrjName: any = '';
}