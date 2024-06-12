import { DatePipe, formatCurrency } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import {
  AlertController,
  IonContent,
  IonInput,
  IonSelect,
} from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { GastosViaticosService } from 'src/app/servicios/gastos-viaticos/gastos-viaticos.service';

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.page.html',
  styleUrls: ['./gastos.page.scss'],
})
export class GastosPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild('searchInput') searchInput!: IonInput;
  @ViewChild('fileIMG') fileIMG!: IonInput;
  @ViewChild('filePDF') filePDF!: IonInput;
  @ViewChild('fileXML') fileXML!: IonInput;
  @ViewChild('tipoComprobante') tipoComprobante!: IonSelect;
  @ViewChild('cantidad') cantidad!: any;
  @ViewChild('precio_unitario') precio_unitario!: any;
  @ViewChild('subtotal') subtotal!: any;
  @ViewChild('iva') iva!: any;
  @ViewChild('comprobanteAnexo') comprobanteAnexo!: IonInput;

  segments: Array<any> = [
    { value: 'misSol', name: 'Mis solicitudes' },
    // { value: 'solAprob', name: 'Sol. por aprobar' },
    // { value: 'infAprob', name: 'Inf. por aprobar' },
    // { value: 'polGastos', name: 'Políticas' }
  ];

  id_perfilwo: number = localStorage.getItem('id_perfilwo') ? parseInt(localStorage.getItem('id_perfilwo')!) : 0;

  solicitudes: Array<any> = [];
  subSegment: string = 'solicitudes';
  // xmlURL: string =
  //   'http://intranet.ecn.com.mx:8060/lineup/public/files/recursos/gastos/comprobacion/';
  xmlURL: string = 'http://192.168.1.64:8080/files/recursos/gastos/comprobacion/';
  openAgregarGasto: boolean = false;
  openRegistroGasto: boolean = false;
  solicitudes2: Array<any> = [];
  openDetalleMisSol: boolean = false;
  openInforme: boolean = false;
  detalleSolGas: Array<any> = [];
  informeStatus: number = 0;
  inf_id: number = 0;
  solicitante: number = 0;
  excedido: number = 0;
  aprobador: number = 0;
  finanzas: number = 0;
  aprobadoRechazado: string = '';
  solEstadoColor: string = '';
  comentarioLider: string = '';
  comentarioFinanzas: string = '';
  gastosInforme: Array<any> = [];
  totalComprobado: string = '';
  totalSolicitado: string = '';
  sol_id: number = 0;
  infDetalles: Array<any> = [];
  comprobantes: Array<any> = [];
  solicitud: boolean = false;
  informeTitle: string = 'Comprobación de gastos';
  detalleSolicitud: Array<any> = [];
  gastos: Array<any> = [];
  nuevaSolicitudTitle: string = '';
  openNuevaSolicitud: boolean = false;
  tipoGasto: Array<any> = [];
  agregarGastoTitle: string = 'Agregar gasto';
  gastoForm: FormGroup = new FormGroup({
    sol_id: new FormControl(0),
    id_gasto: new FormControl(0),
    tipo_gasto: new FormControl(0),
    descripcion: new FormControl(''),
    cantidad: new FormControl(0),
    precio_unitario: new FormControl(0),
    create_user: new FormControl(parseInt(localStorage.getItem('id_colaborador')!)),
  });
  informeForm: FormGroup = new FormGroup({
    tipo_gasto: new FormControl(),
    fecha_transaccion: new FormControl(
      this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    ),
    cd_compra: new FormControl(),
    rfc: new FormControl(),
    razon_social: new FormControl(),
    subtotal: new FormControl(0),
    iva: new FormControl(0),
    moneda: new FormControl(1),
    comentarios: new FormControl(),
  });
  sol_estado: number = 0;
  total: number = 0;
  limite: number = 30;
  gastoInforme: FormData = new FormData();
  archivoXML: string = '';
  archivoIMG: string = '';
  archivoPDF: string = '';
  showReciboForm: boolean = false;
  fac_id: number = 0;
  id_xml: number = 0;
  xmlAnexado: boolean = false;
  showSearchbar: boolean = false;
  addGastoTotal: string = '';
  comprobarGastoTotal: string = '';
  segmentValue: string = 'misSol';
  MisSolAdeudos: string = 'Solicitudes';
  adeudos: Array<any> = [];
  id_adeudo: number = 0;
  anexo: string | null = null;
  showModalAnexo: boolean = false;
  anexosURL: string = 'http://192.168.1.64:8080/files/recursos/gastos/anexosAdeudos/';
  anexoComprobanteForm: FormGroup = new FormGroup({
    anexo: new FormControl('',Validators.required)
  });
  previewComprobanteAdeudo: boolean = false;
  anexoComprobante: string = '';
  comprobanteAdeudoFormData: FormData = new FormData();

  constructor(
    private service: GastosViaticosService,
    public datePipe: DatePipe,
    private sanatizer: DomSanitizer,
    private alertController: AlertController
  ) {}

  changeAdeudos(){
    this.MisSolAdeudos = this.MisSolAdeudos == 'Solicitudes' ? 'Adeudos' : 'Solicitudes';
  }

  async deleteGasto(id_gasto: number) {
    const alert = await this.alertController.create({
      header: '¿Desea eliminar el gasto?',
      message: 'Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          handler: () => {
            let data = { id_gasto: id_gasto };
            this.service.deleteGasto(data).subscribe(() => {
              let data = { sol_id: this.sol_id };
              this.service.getDetalleSolicitud(data).subscribe((response) => {
                this.gastos = response.gastos;
                this.service.createAlert('Gasto eliminado.', 'success');
              });
            });
          },
        },
      ],
    });

    await alert.present();
  }

  segmentChange(event: any) {
    this.refresh(false);
  }

  imprimir() {}

  guardarContinuar() {
    this.openInforme = false;
  }

  async terminarInforme() {
    const alert = await this.alertController.create({
      header: '¿Desea terminar el informe?',
      message: 'No podrá realizar cambios después.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          handler: () => {
            let data = { sol_id: this.sol_id, inf_id: this.inf_id, id_colaborador: parseInt(localStorage.getItem('id_colaborador')!) };
            let response: any = lastValueFrom(this.service.terminarInforme(data));
            if(response){
              if(response.afinanzas === 1){
                this.service.createAlert('Comprobación enviada al departamento de finanzas para su aprobación','success');
                this.mandarNotificacion(this.sol_id, 1);
              }else{
                this.service.createAlert('La comprobación excede el monto solicituado, se envió al líder para su aprobación','success');
                this.mandarNotificacion(this.sol_id, 2);
              }
            }

          },
        },
      ],
    });

    await alert.present();
  }

  mandarNotificacion(sol_id: number, tipo: number){
    let data = {sol_id: sol_id, tipo: tipo};
    this.service.mandarNotificacion(data);
  }

  deleteSolicitud(id: number) {}

  ionViewWillEnter() {
    this.refresh(false);
  }

  async enviarRevision() {
    const alert = await this.alertController.create({
      header: '¿Desea enviar la solicitud?',
      message: 'No podrá realizar cambios después.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          handler: () => {
            let data = { sol_id: this.sol_id };
            this.service.enviarRevision(data).subscribe((response) => {
              if (response.afinanzas) {
                this.getSolicitudesGasto().then(() => {
                  this.openNuevaSolicitud = false;
                  this.service.createAlert(
                    'Solicitud enviada a finanzas.',
                    'success'
                  );
                });
              } else {
                this.getSolicitudesGasto().then(() => {
                  this.openNuevaSolicitud = false;
                  this.service.createAlert(
                    'Solicitud enviada a su líder.',
                    'success'
                  );
                });
              }
            });
          },
        },
      ],
    });

    await alert.present();
  }

  anexarIMG() {
    this.fileIMG.getInputElement().then((input) => {
      input.click();
    });
  }

  anexarPDF() {
    this.filePDF.getInputElement().then((input) => {
      input.click();
    });
  }

  fileIMGChange() {
    this.fileIMG.getInputElement().then((input) => {
      if (input.files!.length > 0) {
        this.gastoInforme.append('archivoIMG', input.files![0]);
        this.archivoIMG = input.files![0].name;
      }
    });
  }

  filePDFChange() {
    this.filePDF.getInputElement().then((input) => {
      if (input.files!.length > 0) {
        this.gastoInforme.append('archivoPDF', input.files![0]);
        this.archivoPDF = input.files![0].name;
      }
    });
  }

  deleteAnexo(tipo: string) {
    if (tipo == 'img') {
      this.fileIMG.value = null;
      this.archivoIMG = '';
    } else {
      this.filePDF.value = null;
      this.archivoPDF = '';
    }
  }

  anexarXML() {
    this.fileXML.getInputElement().then((input) => {
      input.click();
    });
  }

  cancelXML() {
    this.gastoInforme.delete('archivoXML');
    this.archivoXML = '';
    this.fileXML.value = null;
    this.xmlAnexado = false;
  }

  fileXMLChange() {
    this.fileXML.getInputElement().then((input) => {
      if (input.files!.length > 0) {
        this.gastoInforme.append('archivoXML', input.files![0]);
        this.archivoXML = input.files![0].name;
      }
    });
  }

  tipoComprobanteChange(event: any) {
    if (event.detail.value == 'factura') {
      this.showReciboForm = false;
    } else {
      this.informeForm.get('fecha_transaccion')!.enable();
      this.informeForm.get('cd_compra')!.enable();
      this.informeForm.get('rfc')!.enable();
      this.informeForm.get('razon_social')!.enable();
      this.informeForm.get('subtotal')!.enable();
      this.informeForm.get('iva')!.enable();
      this.informeForm.get('moneda')!.enable();

      this.informeForm.setValue({
        tipo_gasto: '',
        fecha_transaccion: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        cd_compra: '',
        rfc: '',
        razon_social: '',
        subtotal: 0,
        iva: 0,
        moneda: 1,
        comentarios: '',
      });
      this.showReciboForm = true;
      this.comprobarGastoTotal = this.formatoMoneda(0);
    }
  }

  subirDatosXML() {
    this.gastoInforme.append('inf_id', this.inf_id.toString());
    this.gastoInforme.append('user_id', parseInt(localStorage.getItem('id_colaborador')!).toString());
    this.service.subirXML(this.gastoInforme).subscribe((response) => {
      if (response.error) {
        this.service.createAlert(response.error, 'danger');
      } else {
        this.fac_id = response.fac_id;
        this.id_xml = response.id_anexo;
        this.tipoComprobante.disabled = true;
        this.showReciboForm = true;

        this.informeForm.get('fecha_transaccion')!.disable();
        this.informeForm.get('cd_compra')!.disable();
        this.informeForm.get('rfc')!.disable();
        this.informeForm.get('razon_social')!.disable();
        this.informeForm.get('subtotal')!.disable();
        this.informeForm.get('iva')!.disable();
        this.informeForm.get('moneda')!.disable();

        this.informeForm.setValue({
          tipo_gasto: '',
          fecha_transaccion: response.fac_fecha,
          cd_compra: response.lugar_expedicion,
          rfc: response.emisor_rfc,
          razon_social: response.emisor_nombre,
          subtotal: response.fac_subtotal,
          iva: response.total_impuestos_trasladados,
          moneda: response.fac_moneda,
          comentarios: '',
        });
        this.xmlAnexado = true;
        this.archivoXML = '';
        this.comprobarGastoTotal = this.formatoMoneda(parseFloat(response.fac_subtotal) + parseFloat(response.total_impuestos_trasladados));
      }
    });
  }

  registrarGasto() {
    this.getFormData().finally(() => {
      this.openRegistroGasto = true;
    });
  }

  closeRegistroGasto() {
    if (this.xmlAnexado && this.archivoXML == '') {
      this.cancelarXML(true);
    } else {
      this.gastoInforme = new FormData();
      this.archivoIMG = '';
      this.fileIMG.value = null;
      this.archivoPDF = '';
      this.filePDF.value = null;
      this.fileXML.value = null;
      this.archivoXML = '';
      this.showReciboForm = false;
      this.openRegistroGasto = false;
    }
  }

  async getFormData() {
    return new Promise((res) => {
      this.service.getTipoGasto().subscribe((tipoGasto) => {
        this.tipoGasto = tipoGasto;
        res(true);
      });
    });
  }

  ngOnInit() {}

  anexarComprobanteAdeudo(){
    this.comprobanteAnexo.getInputElement().then(input=>{
      if (input.files && input.files[0]) {
        this.comprobanteAdeudoFormData.append('anexoAdeudo',input.files[0]);
        this.anexoComprobante = (window.URL ? URL : webkitURL).createObjectURL(input.files[0]);
        this.previewComprobanteAdeudo = true;
    }
    });
  }

  anexarComprobante(){
    this.comprobanteAnexo.getInputElement().then((input)=>{
      input.click();
    });
  }

  eliminarAnexoAdeudo(){
    this.previewComprobanteAdeudo = false;
    this.comprobanteAdeudoFormData = new FormData();
    this.anexoComprobanteForm.reset();
  }

  enviarComprobanteAdeudo(){
    this.comprobanteAdeudoFormData.append('id_adeudo',this.id_adeudo.toString());
    this.service.saveAnexoAdeudo(this.comprobanteAdeudoFormData).subscribe(response=>{
      if(response.error){
        this.service.createAlert(response.error,'danger');
      }else{
        this.comprobanteAdeudoFormData = new FormData();
      this.previewComprobanteAdeudo = false;
      this.anexoComprobanteForm.reset();
      this.showModalAnexo = false;
      this.getAdeudos().finally(()=>{
        this.service.createAlert('Comprobante enviado correctamente.','success');
      });
      }
    });
  }

  verComprobanteAdeudo(id_adeudo: number){
    let data = {id_adeudo: id_adeudo};
    this.id_adeudo = id_adeudo;
    this.service.verAnexoAdeudo(data).subscribe(response=>{
      console.log(response);
      this.anexo = response.anexo ? response.anexo.anexo_nombre : null;
      this.showModalAnexo = true;
    })
  }

  async getSolicitudesGasto() {
    let id_colaborador = { id_colaborador: parseInt(localStorage.getItem('id_colaborador')!) };
    let response = await lastValueFrom(
      this.service.getSolicitudesGasto(id_colaborador)
    );//.catch((err)=>console.log(err));
    if (response) {
      this.limite = 20;
      this.solicitudes = response.solicitudes;
      this.solicitudes2 = response.solicitudes;
    }
  }

  crearInforme(sol_id: number) {
    let data = { sol_id: sol_id };
    this.service.crearInforme(data).subscribe(() => {
      this.service.createAlert('Informe creado correctamente.', 'success');
      this.verInforme(sol_id);
    });
  }

  refresh(event: any) {
    switch (this.segmentValue) {
      case 'misSol':
        if(this.subSegment == 'solicitudes'){
          if(event){
            this.getSolicitudesGasto().finally(()=>event.target.complete());
          }else{
            this.getSolicitudesGasto();
          }
        }else{
          if(event){
            this.getAdeudos().finally(()=>event.target.complete());
          }else{
            this.getAdeudos();
          }
        }
        break;

      case 'solAprob':
        break;

      case 'infAprob':
        break;

      case 'polGastos':
        break;
    }
  }

  async getAdeudos(){
    let data = {id_colaborador : parseInt(localStorage.getItem('id_colaborador')!)};
    let response = await lastValueFrom(this.service.getAdeudos(data));
    if(response) {
      this.adeudos = response.adeudos;
    }
  }

  continuarSolicitud(sol_id: number) {
    this.sol_id = sol_id;
    this.nuevaSolicitudTitle = 'Continuar solicitud';
    let data = { sol_id: sol_id };
    this.service.getDetalleSolicitud(data).subscribe((response) => {
      this.gastos = response.gastos;
      this.openNuevaSolicitud = true;
    });
  }

  addGasto() {
    this.service.getTipoGasto().subscribe((response) => {
      this.tipoGasto = response;
      this.agregarGastoTitle = 'Agregar gasto';
      this.gastoForm.reset({
        sol_id: this.sol_id,
        create_user: parseInt(localStorage.getItem('id_colaborador')!),
        id_gasto: 0,
      });
      this.openAgregarGasto = true;
    });
  }

  async cancelarXML(close: boolean) {
    const alert = await this.alertController.create({
      header: '¿Desea cancelar la factura?',
      message: 'Se eliminará el anexo y los datos registrados.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          handler: () => {
            let datos = { fac_id: this.fac_id, id_anexo: this.id_xml };
            this.service.cancelGasto(datos).subscribe(() => {
              if (close) {
                this.gastoInforme = new FormData();
                this.archivoIMG = '';
                this.archivoPDF = '';
                this.filePDF.value = null;
                this.fileIMG.value = null;
                this.fileXML.value = null;
                this.archivoXML = '';
                this.showReciboForm = false;
                this.openRegistroGasto = false;
                this.xmlAnexado = false;
              } else {
                this.showReciboForm = false;
                this.archivoXML = '';
                this.fileXML.value = null;
                this.tipoComprobante.disabled = false;
                this.xmlAnexado = false;
                this.fileIMG.value = null;
                this.filePDF.value = null;
                this.archivoIMG = '';
                this.archivoPDF = '';
              }
            });
          },
        },
      ],
    });

    await alert.present();
  }

  editGasto(index: number) {
    this.service.getTipoGasto().subscribe((response) => {
      this.tipoGasto = response;
      this.gastoForm.setValue({
        sol_id: this.sol_id,
        id_gasto: this.gastos[index].id_gasto,
        tipo_gasto: this.gastos[index].tipo_gasto,
        descripcion: this.gastos[index].descripcion,
        cantidad: this.gastos[index].cantidad,
        precio_unitario: this.gastos[index].precio_unitario,
        create_user: parseInt(localStorage.getItem('id_colaborador')!),
      });
      this.agregarGastoTitle = 'Editar gasto';
      this.openAgregarGasto = true;
    });
  }

  cantidadOrPrecioChange() {
    let sum =
      parseInt(this.cantidad.value) + parseFloat(this.precio_unitario.value);
    this.addGastoTotal = this.formatoMoneda(sum);
  }

  subtotalOrIvaChange() {
    let mult = parseInt(this.subtotal.value) * parseFloat(this.iva.value);
    this.comprobarGastoTotal = this.formatoMoneda(mult);
  }

  informeSubmit(tipoComprobante: string) {
    if (tipoComprobante == 'factura') {
      if (this.archivoPDF != '' && this.gastoInforme.get('archivoPDF') != '') {
        let ids = {
          tipoComprobante: 1,
          fac_id: this.fac_id,
          id_xml: this.id_xml,
          inf_id: this.inf_id,
          user_id: parseInt(localStorage.getItem('id_colaborador')!),
        };
        this.gastoInforme.append(
          'datos',
          JSON.stringify(this.informeForm.getRawValue())
        );
        this.gastoInforme.append('ids', JSON.stringify(ids));

        this.service.comprobarGasto(this.gastoInforme).subscribe(() => {
          let datos = {
            sol_id: this.sol_id,
            id_colaborador: parseInt(localStorage.getItem('id_colaborador')!),
          };
          this.service.getGastoInforme(datos).subscribe((response) => {
            this.gastosInforme = response.gastosInforme;
            this.openRegistroGasto = false;
            this.service.createAlert(
              'Comprobación registrada correctamente.',
              'success'
            );
          });
        });
      } else {
        this.service.createAlert(
          'Favor de anexar su comprobante PDF.',
          'danger'
        );
      }
    } else {
      if (this.archivoIMG != '' && this.gastoInforme.get('archivoIMG') != '') {
        this.informeForm.patchValue({ tipoComprobante: 2 });
      } else {
        this.service.createAlert(
          'Favor de anexar su ticket en imagen.',
          'danger'
        );
      }
    }
  }

  saveGasto() {
    this.service.saveGasto(this.gastoForm.value).subscribe(() => {
      let data = { sol_id: this.sol_id };
      this.service.getDetalleSolicitud(data).subscribe((response) => {
        this.gastos = response.gastos;
        this.gastoForm.get('id_gasto')!.value == 0
          ? this.service.createAlert('Gasto agregado.', 'success')
          : this.service.createAlert('Gasto actualizado.', 'success');
        this.openAgregarGasto = false;
      });
    });
  }

  nuevaSolicitud() {
    this.nuevaSolicitudTitle = 'Nueva solicitud';
  }

  cerrarSolicitud() {
    this.informeTitle = 'Comprobación de gastos';
    this.solicitud = false;
  }

  sumaValores(value1: string, value2: string) {
    let suma: number = parseFloat(value1) + parseFloat(value2);
    return suma;
  }

  formatoMoneda(value: number) {
    return formatCurrency(value, 'en', '$', 'USD');
  }

  searchGasto(event: any) {
    this.ScrollToTop();
    console.log(event);
    if (event.detail && event.detail.value != '') {
      this.solicitudes = this.solicitudes2.filter(
        (solicitud) =>
          solicitud.sol_id.toString().includes(event.detail.value) ||
          solicitud.sol_nombre
            .toString()
            .toLowerCase()
            .normalize('NFD')
            .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
            .includes(
              event.detail.value
                .toString()
                .toLowerCase()
                .normalize('NFD')
                .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
            ) ||
          solicitud.aprobador
            .toString()
            .toLowerCase()
            .normalize('NFD')
            .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
            .includes(
              event.detail.value
                .toString()
                .toLowerCase()
                .normalize('NFD')
                .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
            ) ||
          this.datePipe
            .transform(solicitud.create_date, 'dd/MM/yyyy')!
            .toString()
            .toLowerCase()
            .normalize('NFD')
            .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
            .includes(
              event.detail.value
                .toString()
                .toLowerCase()
                .normalize('NFD')
                .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
            )
      );
    } else {
      this.solicitudes = this.solicitudes2;
    }
  }

  addItems(event: any) {
    this.limite += 30;
    event.target.complete();
  }

  ScrollToTop() {
    this.content.scrollToTop(700).finally(() => {
      this.limite = 30;
    });
  }

  focus() {
    setTimeout(() => {
      this.searchInput.setFocus();
    }, 500);
  }

  verSolicitud(sol_id: number, modal: boolean) {
    this.sol_id = sol_id;
    let data = { sol_id: sol_id };
    this.service.getDetalleSolicitud(data).subscribe((response) => {
      this.sol_estado = response.detalles.sol_estado;
      this.detalleSolicitud = [
        {
          title: 'Nombre de la solicitud',
          subtitle: response.detalles.sol_nombre,
          icon: 'reader',
        },
        {
          title: '¿Ésta solicitud va cargada a algun proyecto a servicio?',
          subtitle: response.detalles.sol_proy_serv == 0 ? 'No' : 'Si',
          icon: 'layers',
        },
        {
          title: 'Proyecto o servicio',
          subtitle: response.proyecto,
          icon: 'layers',
          proyecto: response.proyecto == 0 ? false : true,
        },
        {
          title: 'Líder que aprobará el gasto',
          subtitle: response.aprobador,
          icon: 'person',
          lider: response.proyecto == 0 ? false : true,
        },
        {
          title: 'Nombre del solicitante',
          subtitle: response.nombre_solicitante,
          icon: 'person',
        },
        {
          title: 'Departamento',
          subtitle: response.detalles.sol_depto,
          icon: 'layers',
        },
        {
          title: 'Proposito del gasto',
          subtitle: response.detalles.motivo_gasto,
          icon: 'chatbox',
        },
        {
          title: 'Geográfica',
          subtitle: response.detalles.sol_geo,
          icon: 'layers',
        },
      ];
      this.gastos = response.gastos;
      this.total = 0;
      for (let i = 0; i < this.gastos.length; i++) {
        this.total += this.gastos[i].total;
      }
      switch (this.sol_estado) {
        case 2:
          this.aprobadoRechazado = 'En revisión de líder';
          this.solEstadoColor = 'espera';
          this.comentarioLider = '';
          break;
        case 3:
          this.aprobadoRechazado = 'Aprobada por líder | En revisión finanzas';
          this.solEstadoColor = 'espera';
          this.comentarioLider =
            'Comentario líder: ' + response.detalles.sol_coment_lider;
          break;
        case 4:
          this.aprobadoRechazado = 'Rechazada por líder';
          this.solEstadoColor = 'rechazada';
          this.comentarioLider =
            'Comentario líder: ' + response.detalles.sol_coment_lider;
          break;
        case 5:
          this.aprobadoRechazado = 'En depósito';
          this.solEstadoColor = 'espera';
          this.comentarioFinanzas =
            'Comentario finanzas: ' + response.detalles.sol_coment_fin;
          break;
        case 6:
          this.aprobadoRechazado = 'Rechazada por finanzas';
          this.solEstadoColor = 'rechazada';
          this.comentarioFinanzas =
            'Comentario finanzas: ' + response.detalles.sol_coment_fin;
          break;
        case 7:
          this.aprobadoRechazado = 'Aprobada';
          this.solEstadoColor = 'aprobada';
          this.comentarioFinanzas =
            'Comentario finanzas: ' + response.detalles.sol_coment_fin;
          break;

        default:
          break;
      }
      this.informeTitle = 'Detalle de la solicitud';
      modal ? (this.openDetalleMisSol = true) : (this.solicitud = true);
    });
  }

  generarPDF() {
    let data = { sol_id: this.sol_id };
    this.service.generarPDF(data).subscribe((response) => {
      let file = new Blob([response], { type: 'application/pdf' });
      let fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    });
  }

  verInforme(sol_id: number) {
    this.sol_id = sol_id;
    this.informeTitle = 'Comprobación de gastos';
    let datos = { sol_id: sol_id, id_colaborador: parseInt(localStorage.getItem('id_colaborador')!) };
    this.service.getGastoInforme(datos).subscribe((response) => {
      this.inf_id = response.informe.inf_id;
      this.informeStatus = response.informe.inf_estado as number;
      this.totalComprobado = this.formatoMoneda(response.total_comprobado);
      this.totalSolicitado = this.formatoMoneda(response.total_solicitado);
      this.solicitante = response.solicitante as number;
      this.aprobador = response.aprobador as number;
      this.excedido = response.informe.excedido as number;
      this.finanzas = response.finanzas as number;
      this.gastosInforme = response.gastosInforme;
      this.comentarioFinanzas = response.informe.sol_coment_fin;
      if (this.informeStatus == 3 || this.informeStatus == 5) {
        this.aprobadoRechazado = 'Aprobada';
      } else if (this.informeStatus == 4 || this.informeStatus == 6) {
        this.aprobadoRechazado = 'Rechazada';
      } else if (this.informeStatus == 7) {
        this.aprobadoRechazado = 'Depositada';
      }
      if (this.gastosInforme.length > 0) {
        this.gastoSelected({
          detail: { value: this.gastosInforme[0].gasd_id },
        }).then((res) => {
          if (res) {
            this.openInforme = true;
          }
        });
      } else {
        this.openInforme = true;
      }
    });
  }

  //al seleccionar un gasto, desplegar los detalles
  async gastoSelected(event: any) {
    return new Promise((res) => {
      let id_gasto = { id_gasto: event.detail.value };

      this.service.getDetalleInforme(id_gasto).subscribe((response) => {
        this.infDetalles = [
          {
            title: 'Tipo de gasto',
            subtitle: response.detalles.gasto_name,
            icon: 'layers',
          },
          {
            title: 'Fecha de transacción',
            subtitle: this.datePipe.transform(
              response.detalles.fecha_transaccion,
              'dd/MM/yyyy'
            ),
            icon: 'calendar',
          },
          {
            title: 'Ciudad de compra',
            subtitle: response.detalles.cd_compra,
            icon: 'map',
          },
          { title: 'RFC', subtitle: response.detalles.rfc, icon: 'reader' },
          {
            title: 'Establecimiento',
            subtitle: response.detalles.razon_social,
            icon: 'business',
          },
          {
            title: 'Subtotal',
            subtitle: this.formatoMoneda(response.detalles.subtotal),
            icon: 'cash',
          },
          {
            title: 'IVA',
            subtitle: this.formatoMoneda(response.detalles.iva),
            icon: 'cash',
          },
          { title: 'Moneda', subtitle: response.detalles.moneda, icon: 'cash' },
          {
            title: 'Comentarios',
            subtitle: response.detalles.comentarios,
            icon: 'chatbox',
          },
          {
            title: 'Total',
            subtitle: this.formatoMoneda(response.detalles.total),
            icon: 'cash',
          },
        ];

        this.comprobantes = [
          {
            url:
              response.pdf.length > 0
                ? this.sanatizer.bypassSecurityTrustResourceUrl(
                    'http://intranet.ecn.com.mx:8060/intranet/php/solicitudes_gasto/Anexos/Comprobacion/' +
                      response.pdf[0].anexo_nombre +
                      '#navpanes=0'
                  )
                : undefined,
          },
          {
            url:
              response.xml.length > 0
                ? 'http://intranet.ecn.com.mx:8060/intranet/php/solicitudes_gasto/Anexos/Comprobacion/' +
                  response.xml[0].anexo_nombre
                : undefined,
          },
        ];

        // this.comprobantes = [
        //   { url: response.pdf.length > 0 ? this.sanatizer.bypassSecurityTrustResourceUrl('http://intranet.ecn.com.mx:8060/api/files/recursos/gastos/comprobacion/' + response.pdf[0].anexo_nombre + '#navpanes=0') : undefined },
        //   { url: response.xml.length > 0 ? 'http://intranet.ecn.com.mx:8060/api/files/recursos/gastos/comprobacion/' + response.xml[0].anexo_nombre : undefined },
        // ];

        // this.comprobantes = [
        //   { url: response.pdf.length > 0 ? this.sanatizer.bypassSecurityTrustResourceUrl('http://192.168.1.64:8080/files/recursos/gastos/comprobacion/' + response.pdf[0].anexo_nombre + '#navpanes=0') : undefined },
        //   { xml: response.xml.length > 0 ? response.xml[0].anexo_nombre : undefined },
        // ];
        res(true);
      });
    });
  }

  downloadXML(xml: string) {
    window.open(this.xmlURL + xml);
  }

  detalleMisGastos(index: number) {
    this.sol_id = this.solicitudes2[index].sol_id;

    //llenado de detalles de la solicitud
    this.detalleSolGas = [
      {
        title: 'Folio',
        subtitle: this.solicitudes2[index].sol_id,
        icon: 'pricetag',
      },
      {
        title: 'Fecha de creación',
        subtitle: this.datePipe.transform(
          this.solicitudes2[index].create_date,
          'dd/MM/yyyy'
        ),
        icon: 'calendar',
      },
      {
        title: 'Nombre de la solicitud',
        subtitle: this.solicitudes2[index].sol_nombre,
        icon: 'document-text',
      },
      {
        title: 'Aprobador',
        subtitle: this.solicitudes2[index].aprobador,
        icon: 'person',
      },
      {
        title: 'Monto',
        subtitle: this.formatoMoneda(this.solicitudes2[index].total),
        icon: 'cash',
      },
      {
        title: 'Estado',
        subtitle: this.solicitudes2[index].sol_estado,
        icon: 'layers',
      },
    ];

    //abrir modal detalles Mis solicitudes de gasto
    this.openDetalleMisSol = true;
  }
}
