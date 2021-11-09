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
}
