import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarritoService } from 'src/app/services/carrito.service';
import { GLOBAL } from 'src/app/services/global';
import { GuestService } from 'src/app/services/guest.service';
declare let tns: any;
declare var lightGallery: any;
declare var iziToast: any;
import { io } from 'socket.io-client';


@Component({
  selector: 'app-show-product',
  templateUrl: './show-product.component.html',
  styleUrls: ['./show-product.component.css']
})
export class ShowProductComponent implements OnInit {

  public slug: any;
  public url: any;
  public producto: any = {}
  public productos_rec: Array<any> = [];
  public carrito_data: any = {
    variedad: '',
    cantidad: 1
  };
  public token: any;
  public btn_cart: boolean = false
  public socket = io('http://localhost:4201');
  public descuento_activo: any = undefined;


  constructor(private _guestService: GuestService, private _rote: ActivatedRoute, private _carritoService: CarritoService) {
    this.url = GLOBAL.url;
    this.token = localStorage.getItem('token');
    this._rote.params.subscribe(
      params => {
        this.slug = params['slug'];
        // console.log(this.slug);
        this._guestService.obtener_productos_slug_publico(this.slug).subscribe(
          resp => {
            // console.log(resp);
            this.producto = resp.data;
            this.cargarProductosRecomendados();
          }, error => {
            console.log(error);
          });
      });
  }

  ngOnInit(): void {
    setTimeout(() => {
      tns({
        container: '.cs-carousel-inner',
        controlsText: ['<i class="cxi-arrow-left"></i>', '<i class="cxi-arrow-right"></i>'],
        navPosition: "top",
        controlsPosition: "top",
        mouseDrag: !0,
        speed: 600,
        autoplayHoverPause: !0,
        autoplayButtonOutput: !1,
        navContainer: "#cs-thumbnails",
        navAsThumbnails: true,
        gutter: 15,
      });
      var e = document.querySelectorAll(".cs-gallery");
      if (e.length) {
        for (var t = 0; t < e.length; t++) {
          lightGallery(e[t], { selector: ".cs-gallery-item", download: !1, videojs: !0, youtubePlayerParams: { modestbranding: 1, showinfo: 0, rel: 0 }, vimeoPlayerParams: { byline: 0, portrait: 0 } });
        }
      }
      tns({
        container: '.cs-carousel-inner-two',
        controlsText: ['<i class="cxi-arrow-left"></i>', '<i class="cxi-arrow-right"></i>'],
        navPosition: "top",
        controlsPosition: "top",
        mouseDrag: !0,
        speed: 600,
        autoplayHoverPause: !0,
        autoplayButtonOutput: !1,
        nav: false,
        controlsContainer: "#custom-controls-related",
        responsive: {
          0: {
            items: 1,
            gutter: 20
          },
          480: {
            items: 2,
            gutter: 24
          },
          700: {
            items: 3,
            gutter: 24
          },
          1100: {
            items: 4,
            gutter: 30
          }
        }
      });

    }, 500);

    this.obtenerDescuentoActivo();
  }

  cargarProductosRecomendados() {
    this._guestService.listar_productos_recomendados_publico(this.producto.categoria).subscribe(
      resp => {
        // console.log(resp);
        this.productos_rec = resp.data;
      }, error => {
        console.log(error);
      });
  }

  agregar_Producto_Carrito() {
    if (this.carrito_data.variedad) {
      if (this.carrito_data.cantidad <= this.producto.stock) {
        let data = {
          producto: this.producto._id,
          cliente: localStorage.getItem('id'),
          cantidad: this.carrito_data.cantidad,
          variedad: this.carrito_data.variedad
        };
        this.btn_cart = true;
        this._carritoService.agregar_carrito_cliente(data, this.token).subscribe(
          resp => {
            console.log(resp);
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
              this.socket.emit('add-carrito-add', { data: true });
              this.btn_cart = false;
            }
          }, error => {
            console.log(error);
          });
      } else {
        iziToast.show({
          title: 'Error',
          titleColor: 'red',
          color: 'red',
          class: 'text-danger',
          position: 'topRight',
          message: `La maxima cantidad disponible es ${this.producto.stock}`
        });
      }
    } else {
      iziToast.show({
        title: 'Error',
        titleColor: 'red',
        color: 'red',
        class: 'text-danger',
        position: 'topRight',
        message: 'Seleccione una variedad del Producto'
      });
    }
  }


  // descuentos mostrar
  obtenerDescuentoActivo() {
    this._guestService.obtener_descuento_activo().subscribe(
      resp => {
        // console.log(resp);
        if (resp.data != undefined) {
          this.descuento_activo = resp.data[0];
          console.log(this.descuento_activo);
        } else {
          this.descuento_activo = undefined;
        }
      }, error => {
        console.log(error);
      });
  }
}
