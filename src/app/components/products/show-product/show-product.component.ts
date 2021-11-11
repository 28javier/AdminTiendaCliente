import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/global';
import { GuestService } from 'src/app/services/guest.service';
declare let tns: any;
declare var lightGallery: any;
declare var iziToast: any;
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

  constructor(private _guestService: GuestService, private _rote: ActivatedRoute) {
    this.url = GLOBAL.url;
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
  }

  cargarProductosRecomendados() {
    this._guestService.listar_productos_recomendados_publico(this.producto.categoria).subscribe(
      resp => {
        console.log(resp);
        this.productos_rec = resp.data;
      }, error => {
        console.log(error);
      });
  }


}
