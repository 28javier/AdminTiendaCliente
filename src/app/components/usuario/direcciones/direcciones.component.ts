import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { GuestService } from '../../../services/guest.service';
declare var $: any;
declare var iziToast: any;
@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.component.html',
  styleUrls: ['./direcciones.component.css']
})
export class DireccionesComponent implements OnInit {

  public token: any;
  public id: any;
  public direccion: any = {
    pais: '',
    region: '',
    provincia: '',
    distrito: '',
    principal: false
  }
  public regiones: Array<any> = [];
  public provincias: Array<any> = [];
  public distritos: Array<any> = [];
  public regiones_arr: Array<any> = [];
  public provincias_arr: Array<any> = [];
  public distritos_arr: Array<any> = [];
  public direcciones: any = [];
  public load_data = true;

  constructor(private _guestService: GuestService, private _clienteService: ClienteService) {
    this.token = localStorage.getItem('token');
    this.id = localStorage.getItem('id');

    this._guestService.get_Regiones().subscribe(
      resp => {
        // console.log(resp);
        this.regiones_arr = resp;
      });

    this._guestService.get_Provincias().subscribe(
      resp => {
        // console.log(resp);
        this.provincias_arr = resp;
      });

    this._guestService.get_Distrito().subscribe(
      resp => {
        // console.log(resp);
        this.distritos_arr = resp;
      });


  }

  ngOnInit(): void {
    this.obtener_direccion();
  }

  select_pais() {
    if (this.direccion.pais == "Ecuador") {
      $('#sl-region').prop('disabled', false);
      this._guestService.get_Regiones().subscribe(
        resp => {
          // console.log(resp);
          resp.forEach((element: { id: any, name: any; }) => {
            this.regiones.push({
              id: element.id,
              name: element.name
            });
          });
          // console.log(this.regiones);

        }, error => {
          console.log(error);
        });
    } else {
      $('#sl-region').prop('disabled', true);
      $('#sl-provincia').prop('disabled', true);
      $('#sl-distrito').prop('disabled', true);
      this.regiones = [];
      this.provincias = [];
      this.distritos = [];
      this.direccion.region = '';
      this.direccion.provincia = '';
      this.direccion.distrito = '';
    }
  }

  select_region() {
    this.provincias = [];
    $('#sl-provincia').prop('disabled', false);
    $('#sl-distrito').prop('disabled', true);
    this.direccion.provincia = '';
    this.direccion.distrito = '';
    this._guestService.get_Provincias().subscribe(
      resp => {
        // console.log(resp);
        resp.forEach((element: { region_id: any; }) => {
          if (element.region_id == this.direccion.region) {
            this.provincias.push(element)
          }
        });
        // console.log(this.provincias);
      });
  }

  select_provincia() {
    this.distritos = [];
    $('#sl-distrito').prop('disabled', false);
    this.direccion.distrito = '';
    this._guestService.get_Distrito().subscribe(
      resp => {
        // console.log(resp);
        resp.forEach((element: { provincia_id: any; }) => {
          if (element.provincia_id == this.direccion.provincia) {
            this.distritos.push(element)
          }
        });
        // console.log(this.distritos)
      });
  }

  registrar(dataForm: any) {
    if (dataForm.valid) {

      this.regiones_arr.forEach(element => {
        if (parseInt(element.id) == parseInt(this.direccion.region)) {
          this.direccion.region = element.name;
        }
      });
      this.provincias_arr.forEach(element => {
        if (parseInt(element.id) == parseInt(this.direccion.provincia)) {
          this.direccion.provincia = element.name;
        }
      });
      this.distritos_arr.forEach(element => {
        if (parseInt(element.id) == parseInt(this.direccion.distrito)) {
          this.direccion.distrito = element.name;
        }
      });

      let data = {
        destinatario: this.direccion.destinatario,
        dni: this.direccion.dni,
        zip: this.direccion.zip,
        direccion: this.direccion.direccion,
        telefono: this.direccion.telefono,
        pais: this.direccion.pais,
        provincia: this.direccion.provincia,
        region: this.direccion.region,
        distrito: this.direccion.distrito,
        principal: this.direccion.principal,
        cliente: localStorage.getItem('id')
      }

      this._clienteService.registro_direccion_cliente(data, this.token).subscribe(
        resp => {
          this.direccion = {
            pais: '',
            region: '',
            provincia: '',
            distrito: '',
            principal: false
          };
          $('#sl-region').prop('disabled', true);
          $('#sl-provincia').prop('disabled', true);
          $('#sl-distrito').prop('disabled', true);

          iziToast.show({
            title: 'Success',
            titleColor: 'FF0000',
            class: 'text-success',
            color: 'green',
            position: 'topRight',
            message: resp.message
          });
          this.obtener_direccion();
        });
      console.log(data);


    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: 'red',
        class: 'text-danger',
        position: 'topRight',
        color: 'red',
        message: 'Los datos del formulario no son validos'
      })
    }
  }

  obtener_direccion() {
    this._clienteService.obtener_direccion_todos_cliente(this.id, this.token).subscribe(
      resp => {
        // console.log(resp);
        this.direcciones = resp.data;
        this.load_data = false;
      }, error => {
        console.log(error);
      });
  }

  establecer_principal(id: any) {
    this._clienteService.cambiar_direccion_principal_cliente(id, this.id, this.token).subscribe(
      resp => {
        iziToast.show({
          title: 'SUCCESS',
          titleColor: 'green',
          color: 'green',
          class: 'text-green',
          position: 'topRight',
          message: resp.message
        });
        this.obtener_direccion();
      });
  }

  eliminarDireccion(id: any) {
    this._clienteService.eliminar_direccion_cliente(id, this.token).subscribe(
      resp => {
        iziToast.show({
          title: 'SUCCESS',
          titleColor: 'green',
          color: 'green',
          class: 'text-green',
          position: 'topRight',
          message: resp.message
        });
        $('#delete-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.obtener_direccion();
      });
  }

}
