import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  public url: any;
  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url
  }


  // obtener_productos_slug_publico
  obtener_productos_slug_publico(slug: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'obtener_productos_slug_publico/' + slug, { headers: headers });
  }

  // listar_productos_recomendados_publico
  listar_productos_recomendados_publico(categoria: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'listar_productos_recomendados_publico/' + categoria, { headers: headers });
  }


  // data json de regiones provincias y distritos
  get_Regiones(): Observable<any> {
    return this._http.get('./assets/regiones.json');
  }

  get_Provincias(): Observable<any> {
    return this._http.get('./assets/provincias.json');
  }

  get_Distrito(): Observable<any> {
    return this._http.get('./assets/distritos.json');
  }

  get_Envios(): Observable<any> {
    return this._http.get('./assets/envios.json');
  }

  // ver los descuentos activos
  // obtener_descuento_activo
  obtener_descuento_activo(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'obtener_descuento_activo', { headers: headers });
  }
}
