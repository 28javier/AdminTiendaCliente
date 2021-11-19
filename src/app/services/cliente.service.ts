import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  public url: any;
  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url
  }


  // guard para autenticar las rutas
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false
    }

    try {
      const helper = new JwtHelperService();
      var decodedToken = helper.decodeToken(<any>token);
      // console.log(decodedToken);

      // condciiona de expiracion del token
      if (helper.isTokenExpired(token)) {
        localStorage.clear();
        return false;
      }

      if (!decodedToken) {
        console.log('NO ACCESO RESTRINCION POR EL TOKEN');
        localStorage.clear();
        return false;
      }
    } catch (error) {
      localStorage.clear();
      // localStorage.removeItem('token');
      return false;
    }
    return true;
  }
  //fin guard para autenticar las rutas

  login_cliente(data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'login_cliente', data, { headers: headers });
  }

  // obtener_cliente_guest
  obtener_cliente_guest(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(this.url + 'obtener_cliente_guest/' + id, { headers: headers });
  }

  // actualizar_perfil_cliente_guest
  actualizar_perfil_cliente_guest(id: any, data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.put(this.url + 'actualizar_perfil_cliente_guest/' + id, data, { headers: headers });
  }

  obtener_config_publico(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'obtener_config_publico', { headers: headers });
  }

  // productos

  // listar_productos_publico/:filtro?
  listar_productos_publico(filtro: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'listar_productos_publico/' + filtro, { headers: headers });
  }

  // direcciones
  // registro_direccion_cliente
  registro_direccion_cliente(data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.post(this.url + 'registro_direccion_cliente', data, { headers: headers });
  }
  // obtener_direccion_todos_cliente
  obtener_direccion_todos_cliente(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(this.url + 'obtener_direccion_todos_cliente/' + id, { headers: headers });
  }

  // cambiar_direccion_principal_cliente
  cambiar_direccion_principal_cliente(id: any, cliente: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.put(this.url + 'cambiar_direccion_principal_cliente/' + id + '/' + cliente, { data: true }, { headers: headers });
  }

  obtener_direccion_principal_cliente(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(this.url + 'obtener_direccion_principal_cliente/' + id, { headers: headers });
  }

  eliminar_direccion_cliente(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.delete(this.url + 'eliminar_direccion_cliente/' + id, { headers: headers });
  }

  // servicios de compras de productos de los clientes
  // registro_compra_cliente
  registro_compra_cliente(data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.post(this.url + 'registro_compra_cliente', data, { headers: headers });
  }


  // servicio del cupon
  // validar_cupon_cliente
  validar_cupon_cliente(cupon: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(this.url + 'validar_cupon_cliente/' + cupon, { headers: headers });
  }

  // servicio del envio del email
  // enviar_correo_compra_cliente
  enviar_correo_compra_cliente(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(this.url + 'enviar_correo_compra_cliente/' + id, { headers: headers });
  }
}
