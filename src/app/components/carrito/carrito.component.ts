import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GLOBAL } from 'src/app/services/global';
import { CarritoService } from '../../services/carrito.service';
declare let iziToast: any;
import { io } from 'socket.io-client';
import { ClienteService } from '../../services/cliente.service';
import { GuestService } from '../../services/guest.service';
import { ActivatedRoute, Router } from '@angular/router';
declare var Cleave: any;
declare var StickySidebar: any;
declare var paypal: any;

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  // ElementRef
  @ViewChild('paypalButton', { static: true }) paypalElement: ElementRef<any> | any;
  public token: any;
  public id_cliente: any;
  public carrito_arr: Array<any> = [];
  public url: any;
  public subtotal = 0;
  public total_pagar = 0;
  public socket = io('http://localhost:4201');
  public direccion_principal: any = {};
  public envios: Array<any> = [];
  public precio_envio = "0";
  public venta: any = {};
  public dventa: Array<any> = [];

  public error_cupon = '';
  public descuento = 0;
  public carrito_load = true;
  public descuento_activo: any = undefined;

  constructor(private _carritoService: CarritoService, private _clienteService: ClienteService,
    private _guestService: GuestService, private router: Router) {
    this.token = localStorage.getItem('token');
    this.id_cliente = localStorage.getItem('id');
    this.venta.cliente = this.id_cliente;
    this.url = GLOBAL.url;


    this._guestService.get_Envios().subscribe(
      resp => {
        // console.log(resp);
        this.envios = resp;
      });
    this.obtenerDescuentoActivo();

  }

  ngOnInit(): void {
    this.obtenerCarritoCliente();

    setTimeout(() => {
      new Cleave('#cc-number', {
        creditCard: true,
        onCreditCardTypeChanged: function (type: any) {

        }
      });
      new Cleave('#cc-exp-date', {
        date: true,
        datePattern: ['m', 'y']
      });
      var sidebar = new StickySidebar('.sidebar-sticky', { topSpacing: 20 });
    });
    this.get_direccion_principal();

    // codigo para iniciar Paypal
    paypal.Buttons({
      style: {
        layout: 'horizontal'
      },
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            description: 'Pago de la tienda XXX',
            amount: {
              currency_code: 'USD',
              value: this.total_pagar
            },
          }]
        });
      },
      onApprove: async (data: any, actions: any) => {
        const order = await actions.order.capture();
        // console.log(order);
        this.venta.transaccion = order.purchase_units[0].payments.captures[0].id;
        // console.log(this.venta);
        // console.log(this.dventa);

        //al backend
        this.venta.detalles = this.dventa;
        this._clienteService.registro_compra_cliente(this.venta, this.token).subscribe(
          resp => {
            console.log(resp);
            // envio del email
            this._clienteService.enviar_correo_compra_cliente(resp.venta._id, this.token).subscribe(
              resp => {
                console.log(resp);
                this.router.navigate(['/']);
              });
          }, error => {
            console.log(error);
          });
      },
      onError: (err: any) => {
      },
      onCancel: function (data: any, actions: any) {
      }
    }).render(this.paypalElement.nativeElement);
    // fin del codigo de Paypal

  }

  obtenerCarritoCliente() {
    this._carritoService.abtener_carrito_cliente(localStorage.getItem('id'), this.token).subscribe(
      resp => {
        // console.log(resp);
        this.carrito_arr = resp.data;
        // detalle venta
        this.carrito_arr.forEach(element => {
          this.dventa.push({
            producto: element.producto._id,
            subtotal: element.producto.precio,
            variedad: element.variedad,
            cantidad: element.cantidad,
            cliente: localStorage.getItem('id')
          });
        });
        // detalle venta
        this.carrito_load = false;
        this.calcularCarrito();
        this.calcular_pagar('Envio Gratis');
      }, error => {
        console.log(error);
      });
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

  get_direccion_principal() {
    this._clienteService.obtener_direccion_principal_cliente(this.id_cliente, this.token).subscribe(
      resp => {
        // console.log(resp);
        if (resp.data == undefined) {
          this.direccion_principal = undefined;
        } else {
          this.direccion_principal = resp.data;
          this.venta.direccion = this.direccion_principal._id;
        }
      }, error => {
        console.log(error);
      });
  }

  eliminar_item(id: any) {
    this._carritoService.eliminar_carrito_cliente(id, this.token).subscribe(
      resp => {
        console.log(resp);
        iziToast.show({
          title: 'Success',
          titleColor: 'FF0000',
          class: 'text-danger',
          color: 'green',
          position: 'topRight',
          message: 'Se elimino el producto del carrito'
        });
        this.socket.emit('delete-carrito', { data: resp.data });
        this.obtenerCarritoCliente();
      }, error => {
        console.log(error);
      });
  }

  calcular_pagar(envio_titulo: any) {
    this.total_pagar = parseInt(this.subtotal.toString()) + parseInt(this.precio_envio);
    this.venta.subtotal = this.total_pagar;
    this.venta.envio_precio = parseInt(this.precio_envio);
    this.venta.envio_titulo = envio_titulo;
    // console.log(this.venta);
  }


  validar_cupon() {
    if (this.venta.cupon) {
      if (this.venta.cupon.toString().length <= 20) {
        //si es valido
        this.error_cupon = '';
        this._clienteService.validar_cupon_cliente(this.venta.cupon, this.token).subscribe(
          resp => {
            // console.log(resp);
            if (resp.data != undefined) {
              // descuento
              this.error_cupon = '';
              if (resp.data.tipo == 'Valor_fijo') {
                this.descuento = resp.data.valor;
                this.total_pagar = this.total_pagar - this.descuento;
              } else if (resp.data.tipo == 'Porcentaje') {
                this.descuento = (this.total_pagar * resp.data.valor) / 100;
                this.total_pagar = this.total_pagar - this.descuento;
              }
            } else {
              this.error_cupon = 'El cupón no se pudo canjear';

            }
          });
      } else {
        // no es valido
        this.error_cupon = 'El cupón de debe ser menor de 20 caracteres';
      }
    } else {
      this.error_cupon = 'El cupón no es valido.';
    }
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
