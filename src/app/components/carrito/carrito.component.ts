import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/services/global';
import { CarritoService } from '../../services/carrito.service';
declare let iziToast: any;
import { io } from 'socket.io-client';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  public token: any;
  public id_cliente: any;
  public carrito_arr: Array<any> = [];
  public url: any;
  public subtotal = 0;
  public total_pagar = 0;
  public socket = io('http://localhost:4201');


  constructor(private _carritoService: CarritoService) {
    this.token = localStorage.getItem('token');
    this.id_cliente = localStorage.getItem('id');
    this.url = GLOBAL.url;
    this.obtenerCarritoCliente();
  }

  ngOnInit(): void {
  }

  obtenerCarritoCliente() {
    this._carritoService.abtener_carrito_cliente(this.id_cliente, this.token).subscribe(
      resp => {
        console.log(resp);
        this.carrito_arr = resp.data;
        this.calcularCarrito();
      }, error => {
        console.log(error);
      });
  }
  calcularCarrito() {
    this.carrito_arr.forEach(item => {
      this.subtotal = this.subtotal + parseInt(item.producto.precio);
    });
    this.total_pagar = this.subtotal;
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

}
