import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarritoService } from 'src/app/services/carrito.service';
import { GLOBAL } from 'src/app/services/global';
import { ClienteService } from '../../../services/cliente.service';
declare let jQuery: any;
declare let $: any;
declare let noUiSlider: any;
declare var iziToast: any;
import { io } from 'socket.io-client';
import { GuestService } from 'src/app/services/guest.service';


@Component({
  selector: 'app-index-products',
  templateUrl: './index-products.component.html',
  styleUrls: ['./index-products.component.css']
})
export class IndexProductsComponent implements OnInit {

  public config_Global: any = {};
  public filter_categoria: any = '';
  public productos: Array<any> = [];
  public filter_producto: any = '';
  public load_data = true;
  public url: any;
  public filter_cat_productos: any = 'todos';
  public route_categoria: any;
  public page = 1;
  public pageSize = 15;
  public sort_by: any = 'Defecto';
  public carrito_data: any = {
    variedad: '',
    cantidad: 1
  };
  public token: any;
  public btn_cart: boolean = false
  public socket = io('http://localhost:4201');
  public descuento_activo: any = undefined;



  constructor(private _clienteService: ClienteService, private _router: ActivatedRoute, private _carritoService: CarritoService, private _guestService: GuestService) {
    this.url = GLOBAL.url;
    this.token = localStorage.getItem('token');
    this._router.params.subscribe(
      params => {
        this.route_categoria = params['categoria'];
        if (this.route_categoria) {
          this._clienteService.listar_productos_publico('').subscribe(
            resp => {
              this.productos = resp.data;
              this.productos = this.productos.filter(item => item.categoria.toLowerCase() == this.route_categoria);
              this.load_data = false;
            }, error => {
            });
        } else {
          this._clienteService.listar_productos_publico('').subscribe(
            resp => {
              // console.log(resp);
              this.productos = resp.data;
              this.load_data = false;
            }, error => {
              console.log(error);
            });
        }
      }
    );
    this.configPublico();
    // this.obtenerProducto();
  }


  ngOnInit(): void {
    var slider: any = document.getElementById('slider');
    noUiSlider.create(slider, {
      start: [0, 1000],
      connect: true,
      range: {
        'min': 0,
        'max': 1000
      },
      tooltips: [true, true],
      pips: {
        mode: 'count',
        values: 5,

      }
    });
    slider.noUiSlider.on('update', function (values: any) {
      // console.log(values);
      $('.cs-range-slider-value-min').val(values[0]);
      $('.cs-range-slider-value-max').val(values[1]);
    });
    $('.noUi-tooltip').css('font-size', '11px');

    this.obtenerDescuentoActivo();
  }

  configPublico() {
    this._clienteService.obtener_config_publico().subscribe(
      resp => {
        // console.log(resp);
        this.config_Global = resp.data;
        // console.log(this.config_Global);
      }, error => {
        console.log(error);
      });
  }


  obtenerProducto() {
    this._clienteService.listar_productos_publico(this.filter_producto).subscribe(
      resp => {
        // console.log(resp);
        this.productos = resp.data;
        this.load_data = false;
      }, error => {
        console.log(error);
      });
  }

  buscar_categoria() {
    // console.log(this.filter_categoria);
    if (this.filter_categoria) {
      let search = new RegExp(this.filter_categoria, 'i');
      this.config_Global.categorias = this.config_Global.categorias.filter(
        (item: { titulo: string; }) => search.test(item.titulo));
    } else {
      this.configPublico();
    }
  }

  buscar_Producto() {
    this._clienteService.listar_productos_publico(this.filter_producto).subscribe(
      resp => {
        // console.log(resp);
        this.productos = resp.data;
        this.load_data = false;
      }, error => {
        console.log(error);
      });
  }

  buscar_precios() {
    this._clienteService.listar_productos_publico(this.filter_producto).subscribe(
      resp => {
        // console.log(resp);
        this.productos = resp.data;
        let min = parseInt($('.cs-range-slider-value-min').val());
        let max = parseInt($('.cs-range-slider-value-max').val());
        // console.log(min);
        // console.log(max);
        this.productos = this.productos.filter((item) => {
          return item.precio >= min && item.precio <= max
        });
      }, error => {
        console.log(error);
      });
  }

  buscar_por_categoria() {
    // console.log(this.filter_cat_productos);
    if (this.filter_cat_productos == 'todos') {
      this.obtenerProducto();
      this.load_data = false;
    } else {
      this._clienteService.listar_productos_publico(this.filter_producto).subscribe(
        resp => {
          // console.log(resp);
          this.productos = resp.data;
          this.productos = this.productos.filter(item => item.categoria == this.filter_cat_productos);
          this.load_data = false;
        }, error => {
          console.log(error);
        });
    }
  }

  resetProducto() {
    this.filter_producto = '';
    this._clienteService.listar_productos_publico('').subscribe(
      resp => {
        // console.log(resp);
        this.productos = resp.data;
        this.load_data = false;
      }, error => {
        console.log(error);
      });
  }

  orden_por() {
    if (this.sort_by == 'Defecto') {
      this._clienteService.listar_productos_publico('').subscribe(
        response => {
          this.productos = response.data;
          this.load_data = false;
        });
    } else if (this.sort_by == 'Popularidad') {
      this.productos.sort(function (a, b) {
        if (a.nventas < b.nventas) {
          return 1;
        }
        if (a.nventas > b.nventas) {
          return -1;
        }
        return 0;
      });
    } else if (this.sort_by == '+-Precio') {
      this.productos.sort(function (a, b) {
        if (a.precio < b.precio) {
          return 1;
        }
        if (a.precio > b.precio) {
          return -1;
        }
        return 0;
      });
    } else if (this.sort_by == '-+Precio') {
      this.productos.sort(function (a, b) {
        if (a.precio > b.precio) {
          return 1;
        }
        if (a.precio < b.precio) {
          return -1;
        }
        return 0;
      });
    } else if (this.sort_by == 'AZ') {
      this.productos.sort(function (a, b) {
        if (a.titulo > b.titulo) {
          return 1;
        }
        if (a.titulo < b.titulo) {
          return -1;
        }
        return 0;
      });
    } else if (this.sort_by == 'ZA') {
      this.productos.sort(function (a, b) {
        if (a.titulo < b.titulo) {
          return 1;
        }
        if (a.titulo > b.titulo) {
          return -1;
        }
        return 0;
      });
    }
  }


  agregar_Producto_Carrito(producto: any) {
    let data = {
      producto: producto._id,
      cliente: localStorage.getItem('id'),
      cantidad: 1,
      variedad: producto.variedades[0].titulo
    };
    this.btn_cart = true;
    this._carritoService.agregar_carrito_cliente(data, this.token).subscribe(
      resp => {
        // console.log(resp);
        if (resp.data == undefined) {
          iziToast.show({
            title: 'Error',
            titleColor: 'red',
            color: 'red',
            class: 'text-danger',
            position: 'topRight',
            message: resp.message
          });
          this.btn_cart = false;
        } else {
          iziToast.show({
            title: 'Success',
            titleColor: 'FF0000',
            class: 'text-danger',
            color: 'green',
            position: 'topRight',
            message: resp.message
          });
          // this.socket.emit('new-carrito-add', { data: true });
          this.socket.emit('add-carrito-add', { data: true });
          this.btn_cart = false;
        }
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
