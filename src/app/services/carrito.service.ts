import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  public url: any;
  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url
  }

  // agregar_carrito_cliente
  agregar_carrito_cliente(data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.post(this.url + 'agregar_carrito_cliente', data, { headers: headers });
  }

  // abtener_carrito_cliente
  abtener_carrito_cliente(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(this.url + 'abtener_carrito_cliente/' + id, { headers: headers });
  }

  // eliminar_carrito_cliente
  eliminar_carrito_cliente(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.delete(this.url + 'eliminar_carrito_cliente/' + id, { headers: headers });
  }
}
