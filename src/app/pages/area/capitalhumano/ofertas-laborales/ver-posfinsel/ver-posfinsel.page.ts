import { formatCurrency } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Oferta } from 'src/app/model/OfertaLaboral/Oferta';
import { Atraccionusuario } from 'src/app/model/OfertaLaboral/Atraccionusuario';
import { CapitalhumanoService } from 'src/app/servicios/capitalhumano/capitalhumano.service';

@Component({
  selector: 'app-ver-posfinsel',
  templateUrl: './ver-posfinsel.page.html',
  styleUrls: ['./ver-posfinsel.page.scss'],
})
export class VerPosfinselPage implements OnInit {
  @ViewChild('ModalPosFinSel') ModalPosFinSel: any;

  title: string = '';
  title_modal: string = '';
  modalPosFinSel: boolean = false;
  modalDatos: Atraccionusuario = new Atraccionusuario();

  oferta: Oferta = new Oferta();
  DO_idiomas: any[] = [];

  segment = '';
  filtroPais: any;
  filtroEstado: any;
  filtroCiudad: any;
  listadoPosFinSel: Array<any> = [];

  selectPais: Array<any> = [];
  selectedPais: any = { nombre: null, id: null};

  selectEstado: Array<any> = [];
  selectChangeEstado: Array<any> = [];
  selectedEstado: any = { nombre: null, id: null};

  selectCiudad: Array<any> = [];
  selectChangeCiudad: Array<any> = [];
  selectedCiudad: any = { nombre: null, id: null};

  constructor(private service: CapitalhumanoService, private router: Router,
              private toast: ToastController) { }

  ngOnInit() {
    sessionStorage.setItem('OfertasLab curriculum tipo', 'O');
    // Se limpian/vacían las variables
    sessionStorage.removeItem('OfertasLab PosFinSel usuario');
    sessionStorage.removeItem('OfertasLab PosFinSel tipoCurriculum');
    this.limpiarVariables();
    this.oferta = new Oferta();

    // Se pregunta si se mandaron los datos a utilizar:
    // Oferta_id: Oferta referenciada.
    // segment: Segmento en el que se quiere observar a las personas Postuladas/Finalistas/Seleccionados.
    if( (sessionStorage.getItem('OfertasLab oferta_id') != null && parseInt(sessionStorage.getItem('OfertasLab oferta_id')!) != 0) &&
        ( sessionStorage.getItem('OfertasLab PosFinSel segment') != null && sessionStorage.getItem('OfertasLab PosFinSel segment') != '') ){
      this.segment = sessionStorage.getItem('OfertasLab PosFinSel segment') != '' ? sessionStorage.getItem('OfertasLab PosFinSel segment')! : 'Postulados';
      this.title = this.segment;

      // Se pregunta si la oferta del servicio (capitalhumano.service) no este vacío.
      // Si fuece nulo, buscaría los datos con el id (oferta_id) anterior.
      if(this.service.oferta != null)
        this.oferta = this.service.oferta;
      else
        this.getOferta(sessionStorage.getItem('OfertasLab oferta_id'));

      this.onChangeSegment(this.segment);
    }else
      this.router.navigate(['tabs/area/capitalhumano/ofertas-laborales']);

  }

  // Limpia las variables.
  limpiarVariables(){

    this.title = '';
    this.title_modal = '';
    this.modalPosFinSel = false;
    this.modalDatos = new Atraccionusuario();

    this.listadoPosFinSel = [];
    this.filtroPais = null;
    this.filtroEstado = null;
    this.filtroCiudad = null;
    this.selectPais = [];
    this.selectedPais = { nombre: null, id: null};
    this.selectEstado = [];
    this.selectChangeEstado = [];
    this.selectedEstado = { nombre: null, id: null};
    this.selectCiudad = [];
    this.selectChangeCiudad = [];
    this.selectedCiudad = { nombre: null, id: null};

  }

  // Se obtiene los datos de la oferta si en el servicio se encuentra vacío o nulo.
  async getOferta(id: any){
    this.service.Ofertas_getDetalleOferta({id: id}).subscribe(
      (r:any) => {

        this.oferta = r[0] as any;
        var Personas = r[1] as any;
        this.DO_idiomas = r[2] as any;

        this.oferta.id_oferta = id;

        this.oferta.idioma = [];
        this.oferta.nivel = [];

        this.oferta.salario = parseFloat(this.oferta.salario.toString());
        this.oferta.salario_n = formatCurrency(this.oferta.salario, 'en-US', '$', 'USD', '1.2-2');

        this.oferta.postulados = Personas.postulados;
        this.oferta.finalistas = Personas.finalistas;
        this.oferta.seleccionados = Personas.seleccionados;

        for (let i = 0; i < this.DO_idiomas.length; i++) {
          this.oferta.idioma[i] = this.DO_idiomas[i]['idioma'];
          this.oferta.nivel[i] = this.DO_idiomas[i]['nivel'];
        }
      },
      e => {
        console.log(e);
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
      }
    );
  }

  // Cualquier cambio ha algún segmento, se recargan las listas con sus respectivas listas
  async onChangeSegment(segment: string){
    this.limpiarVariables();
    switch(segment){
      case 'Postulados':
        this.title_modal = 'postulado';
        break;
      case 'Finalistas':
        this.title_modal = 'finalista';
        break;
      case 'Seleccionados':
        this.title_modal = 'seleccionado';
        break;
    }
    this.service.Ofertas_getFiltrosPostulados({id: sessionStorage.getItem('OfertasLab oferta_id')}).subscribe(
      (r:any)=>{
        this.selectPais = r[0] as any;
        this.selectEstado = r[1] as any;
        this.selectCiudad = r[2] as any;

        this.selectChangeEstado = r[1] as any;
        this.selectChangeCiudad = r[2] as any;
      },
      e=>{
        console.log(e);
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
      }
    );
    this.title = segment;
    this.getInfo(segment);
  }

  // Cierra los modales
  closeModal(){
    this.modalPosFinSel = false;
  }

  // Se obtiene la información dependiendo de la oferta, segmento y filtros (pais, estado, ciudad)
  async getInfo(segment: string){
    var data: Object = {
      id: parseInt(sessionStorage.getItem('OfertasLab oferta_id')!),
      pais: this.selectedPais.id,
      estado: this.selectedEstado.id,
      ciudad: this.selectedCiudad.id,
      tipo: segment
    }
    this.service.Ofertas_getPosFinSel(data).subscribe(
      r=>{
        this.listadoPosFinSel = r as any;
      },
      e=>{
        console.log(e);
        this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
      }
    );
  }

  // Abre los modales
  openModal(index: number){
    this.ModalPosFinSel.onDidDismiss().then(() => this.modalPosFinSel = false);
    this.modalPosFinSel = true;

    this.modalDatos = new Atraccionusuario();
    this.modalDatos = this.listadoPosFinSel[index];
  }

  // Cualquier cambio a los filtros se realizara una busqueda por:
  // getInfo();
  changeFiltro(pais: any, estado: any, ciudad: any){
    // Fil: Filtro

    // Si los Fil de estado y ciudad no fueron seleccionados
    // mientras que el pais si fue seleccionado.
    if(estado == null && ciudad == null){
      // Se vacían los selects modificables (de repuesto).
      this.selectChangeEstado = [];
      this.selectChangeCiudad = [];

      // Se realiza el filtrado por los selects originales y se guardan en los de repuesto.
      this.selectEstado.filter(x => x.id_pais === pais?.target.value).forEach(forEstado => {
        this.selectChangeEstado.push(forEstado);
        this.selectCiudad.filter(x => x.id_estado === forEstado.id_estado).forEach(forCiudad => {
          this.selectChangeCiudad.push(forCiudad);
        });
      });
    }
    // Si el Fil de ciudad no fue seleccionado.
    // mientras que el pais y el estado fueron seleccionados.
    else if(ciudad == null){

      // Se vaía el select modificable (de repuesto).
      this.selectChangeCiudad = [];

      // Se realiza el filtrado por el select original de ciudad y se guarda en el de repuesto.
      this.selectCiudad.filter(x => x.id_estado === estado?.target.value).forEach(forCiudad => {
        this.selectChangeCiudad.push(forCiudad);
      });
    }
    // Si el Fil de ciudad fue seleccionado.
    // mientras que el pais, estado y ciudad fueron seleccionados.
    else if(ciudad != null){

      // Se vacían los selects modificables (de repuesto).
      this.selectChangeEstado = [];
      this.selectChangeCiudad = [];

      // Se busca el estado del listado ciudades por la ciudad seleccionada.
      var findEstado = this.selectCiudad.find(x => x.id_ciudad === ciudad.target.value).id_estado;
      // Se busca el pais del listado de estados por el estado seleccionado anteriomente por la ciudad.
      var findPais = this.selectEstado.find(x => x.id_estado === findEstado).id_pais;

      // Se realiza un filtrado por el select Estado para encontrar los estados del país encontrado (findPais).
      this.selectEstado.filter(x => x.id_pais === findPais).forEach(forEstado => {
        this.selectChangeEstado.push(forEstado);
      });

      // Se realiza un filtrado por el select Ciudad para encontrar las ciudades del estado encontrado (findEstado).
      this.selectCiudad.filter(x => x.id_estado === findEstado).forEach(forCiudad =>{
        this.selectChangeCiudad.push(forCiudad);
      });
    }

    // Si el Fil de ciudad fue seleccionado.
    if(ciudad != null){

      // Se guarda el listado filtrado por la ciudad seleccionada.
      var listCiudad = this.selectChangeCiudad.find(x => x.id_ciudad === this.selectedCiudad.id);

      // Se guarda el nombre de la ciudad.
      this.selectedCiudad.nombre = listCiudad.nom_loc;

      // Si no se escogio previamente un estado.
      if(estado?.id == null || estado?.nombre == null){
        for(var i = 0; i < this.selectChangeEstado.length; i++){
          // Si el estado de la lista filtrada de la ciudades es el mismo de la lista de estados.
          if(this.selectChangeEstado[i].id_estado == listCiudad.id_estado){
            // Se guarda el estado y se cierra el bucle.
            this.selectedEstado.id = this.selectChangeEstado[i].id_estado;
            this.selectedEstado.nombre = this.selectChangeEstado[i].descripcion;
            break;
          }
        }

      // Si no se escogio previamente un país.
        if(pais?.id == null || pais?.nombre == null){
          for(var o = 0; o < this.selectPais.length; o++){
            // Si el país de la lista de estados es el mismo de la lista de paises.
            if(this.selectPais[o].id_pais == this.selectChangeEstado[i].id_pais){
              // Se guarda el país y se cierra el bucle.
              this.selectedPais.id = this.selectPais[o].id_pais;
              this.selectedPais.nombre = this.selectPais[o].descripcion;
              break;
            }
          }
        }
      }
    }
    // Si el Fil de estado fue seleccionado.
    else if(estado != null){

      // Se limpia la variable ciudad.
      this.selectedCiudad = {nombre: null, id: null};

      // Se guarda el listado filtrado por el estado seleccionado.
      var listEstado = this.selectChangeEstado.find(x => x.id_estado === this.selectedEstado.id);

      // Se guarda el nombre del estado.
      this.selectedEstado.nombre = listEstado.descripcion;

      // Si no se ecogio previamente un país.
      if(pais?.id == null || pais?.nombre == null){
        for(var o = 0; o < this.selectPais.length; o++){
          // Si el país de la lista de estados es el mismo de la lista de paises.
          if(this.selectPais[o].id_pais == listEstado.id_pais){
            // Se guarda el país y se cierra el bucle.
            this.selectedPais.id = this.selectPais[o].id_pais;
            this.selectedPais.nombre = this.selectPais[o].descripcion;
            break;
          }
        }
      }
    }
    // Si el Fil de pais fue seleccionado.
    else if(pais != null){
      // Se limpian las variables ciudad y estado.
      this.selectedCiudad = {nombre: null, id: null};
      this.selectedEstado = {nombre: null, id: null};

      // Se guarda el listado filtrado por el país seleccionado.
      this.selectedPais.nombre = this.selectPais.find(x => x.id_pais === this.selectedPais.id).descripcion;
    }

    // Se busca la información mediante el segmento
    // Dentro del metodo se encuentras las variables seleccionadas por los filtros.
    this.getInfo(this.segment);

  }

  // Dependiendo del filtro cancelado se borraran los demas.
  cancelFiltro(value: number){
    switch(value){
      case 0: // Si se borra el filtro del pais se vacían todos los filtros.
        this.selectChangeEstado = this.selectEstado;
        this.selectChangeCiudad = this.selectCiudad;

        this.selectedCiudad = {nombre: null, id: null};
        this.selectedEstado = {nombre: null, id: null};
        this.selectedPais = {nombre: null, id: null};
        break;
      case 1: // Si se borra el filtro estado se vacían los filtros de estado y ciudad.
        this.selectChangeCiudad = this.selectCiudad;

        this.selectedCiudad = {nombre: null, id: null};
        this.selectedEstado = {nombre: null, id: null};
        break;
      case 2: // Si se borra el filtro de ciudad se borra el filtro ciudad.
        this.selectedCiudad = {nombre: null, id: null};
        break;
    }

    // Una vez eliminado el filtro, se realiza la busqueda.
    this.getInfo(this.segment);
  }

  // Dependiendo de la opción seleccionada se realizara una pregunta sobre:
  // añadir o eliminar.
  setOpcionesPosFinSel(usuario: number, opcion: number){
    var op_nombre = '';
    var op_tipo = '';
    var nombre = this.modalDatos.nombres + ' ' + this.modalDatos.apellido_p + ' ' + this.modalDatos.apellido_m;
    switch(opcion){
      case 1:
        op_nombre = 'a Finalistas';
        op_tipo = 'añadir';
        break;
      case 2:
        op_nombre = 'a Seleccionados';
        op_tipo = 'añadir';
        break;
      case 3:
        op_nombre = 'de Finalistas';
        op_tipo = 'eliminar';
        break;
      case 4:
        op_nombre = 'de Seleccionados';
        op_tipo = 'eliminar';
        break;
    }

    var data = {
      oferta: parseInt(sessionStorage.getItem('OfertasLab oferta_id')!),
      usuario: usuario,
      opcion: opcion,
      colaborador: parseInt(localStorage.getItem('id_colaborador')!),
      tipo: 101
    };

    this.confirmAlert('¿Desea '+op_tipo+' a "'+nombre+'" '+op_nombre+'?', 'medium', data);
  }

  // Si se quiere observar el curriculum del usuario seleccionado.
  verCurriculum(usuario: number, tipo: number){
    sessionStorage.setItem('OfertasLab PosFinSel usuario', usuario as any);
    sessionStorage.setItem('OfertasLab PosFinSel tipoCurriculum', tipo as any);

    this.router.navigate(['tabs/area/capitalhumano/ofertas-laborales/curriculum']);
  }

  //alertas on link
  async confirmAlert(message: string, color: string = '', data: any) {
    const toast = await this.toast.create({
      message: message, color: color, buttons: [
        {
          side: 'end',
          text: 'confirmar',
          handler: () => {
            switch (data.tipo){
              case 101:
                var dataInfo = {
                  oferta: data.oferta,
                  usuario: data.usuario,
                  opcion: data.opcion,
                  colaborador: data.colaborador
                };
                this.service.Ofertas_accionesPosFinSelOpciones(dataInfo).subscribe(
                  (r:any) => {
                    switch(data.opcion){
                      case 1:
                        if(r[0] == 1){
                          this.service.createAlert('Se ha añadido con exito', 'success');
                          this.closeModal();
                        }else
                          this.service.createAlert('Error al añadir. Intente de nuevo', 'danger');
                        break;
                      case 2:
                        if(r[0] == 1 && r[1] == 1){
                          this.service.createAlert('Se ha añadido y se enviado notificación con exito', 'success');
                          this.closeModal();
                        }else if(r[0] == 1 && r[1] != 1)
                          this.service.createAlert('Se ha añadido, pero *NO se enviado notificación*', 'success');
                        else
                          this.service.createAlert('Error al añadir. Intente de nuevo', 'danger');
                        break;
                      case 3:
                        if(r[0] == 1){
                          this.service.createAlert('Se ha elimiado con exito', 'success');
                          this.closeModal();
                        }else
                          this.service.createAlert('Error al eliminar. Intente de nuevo', 'danger');
                        break;
                      case 4:
                        if(r[0] == 1){
                          this.service.createAlert('Se ha eliminado con exito', 'success');
                          this.closeModal();
                        }else
                          this.service.createAlert('Error al eliminar. Intente de nuevo', 'danger');
                        break;
                    }

                    this.onChangeSegment(this.segment);
                  },
                  e => {
                    console.log(e);
                    this.service.createAlert('Error al conectar con el servidor. Intente de nuevo.', 'danger');
                  }
                );
                break;
            }
          }
        },
        {
          side: 'end',
          icon: 'close',
          handler: () => {
            toast.dismiss();
          }
        }
      ]
    });
    return toast.present();
  }

}
