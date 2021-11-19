import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { Router } from '@angular/router';
import { CarritoService } from 'src/app/services/carrito.service';
import { GLOBAL } from 'src/app/services/global';
declare let iziToast: any;
declare let $: any;
import { io } from 'socket.io-client';
import { GuestService } from '../../services/guest.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public token: any;
  public id: any;
  public user: any = undefined;
  public user_lc: any = undefined;
  public config_Global: any = {};
  public op_cart: boolean = false;
  public carrito_arr: Array<any> = [];
  public url: any;
  public subtotal = 0;
  public socket = io('http://localhost:4201');
  public descuento_activo: any = undefined;


  constructor(private _clienteService: ClienteService, private _router: Router, private _carritoService: CarritoService, private _guestService: GuestService) {
    this.token = localStorage.getItem('token'); //Token del usuario que inicio seccion
    this.id = localStorage.getItem('id'); //Identificador del usuario que inicio seccion
    this.url = GLOBAL.url;
    if (this.token) {
      this._clienteService.obtener_cliente_guest(this.id, this.token).subscribe(
        response => {
          // console.log(response);
          this.user = response.data;
          localStorage.setItem('user_data', JSON.stringify(this.user));
          // console.log(this.user);
          // validar que exista en el localstorage el userdata
          if (localStorage.getItem('user_data')) {
            this.user_lc = JSON.parse(localStorage.getItem('user_data') || '{}');
            this.obtener_carrito_cliente();
          } else {
            this.user_lc = undefined;
          }
          // console.log(this.user_lc);
        },
        error => {
          console.log(error);
          this.user = undefined;
        }
      );
    }

    this.configPublico();
  }

  ngOnInit(): void {
    this.socket.on('new-carrito', (data: any) => {
      // console.log(data);
      this.obtener_carrito_cliente();
    });
    this.socket.on('new-carrito-add', (data: any) => {
      // console.log(data);
      this.obtener_carrito_cliente();
    });

    this.obtenerDescuentoActivo();
  }

  obtener_carrito_cliente() {
    this._carritoService.abtener_carrito_cliente(this.user_lc._id, this.token).subscribe(
      resp => {
        // console.log(resp);
        this.carrito_arr = resp.data;
        this.calcularCarrito();
      }, error => {
        console.log(error);
      });
  }
  configPublico() {
    this._clienteService.obtener_config_publico().subscribe(
      resp => {
        // console.log(resp);
        this.config_Global = resp.data;
        // console.log(this.config_Global);
      }, error => {
        console.log(error);
      }
    );
  }


  logaut() {
    window.location.reload(); // refresco de pagina
    localStorage.clear();
    this._router.navigate(['/']);
    iziToast.show({
      title: 'SUCCESS',
      titleColor: 'green',
      class: 'text-green',
      position: 'topRight',
      color: 'green',
      message: 'Logaut Realizado Correctamente'
    });

  }

  op_modal_cart() {
    if (!this.op_cart) {
      this.op_cart = true;
      $('#cart').addClass('show');
    } else {
      this.op_cart = false;
      $('#cart').removeClass('show');
    }
  }

  calcularCarrito() {
    this.subtotal = 0;
    if (this.descuento_activo == undefined) {
      this.carrito_arr.forEach(item => {
        this.subtotal = this.subtotal + parseInt(item.producto.precio);
      });
    } else if (this.descuento_activo != undefined) {
      this.carrito_arr.forEach(item => {
        let new_precio = Math.round(parseInt(item.producto.precio) - (parseInt(item.producto.precio) * this.descuento_activo.descuento) / 100);
        this.subtotal = this.subtotal + new_precio;
      });
    }
  }

  eliminar_item(id: any) {
    this._carritoService.eliminar_carrito_cliente(id, this.token).subscribe(
      resp => {
        // console.log(resp);
        iziToast.show({
          title: 'Success',
          titleColor: 'FF0000',
          class: 'text-danger',
          color: 'green',
          position: 'topRight',
          message: 'Se elimino el producto del carrito'
        });
        this.socket.emit('delete-carrito', { data: resp.data });
      }, error => {
        console.log(error);
      });
  }

  // descuentos mostrar
  obtenerDescuentoActivo() {
    this._guestService.obtener_descuento_activo().subscribe(
      resp => {
        // console.log(resp);
        if (resp.data != undefined) {
          this.descuento_activo = resp.data[0];
          // console.log(this.descuento_activo);
        } else {
          this.descuento_activo = undefined;
        }
      }, error => {
        console.log(error);
      });
  }
}
