import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { Router } from '@angular/router';
declare let iziToast: any;

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


  constructor(private _clienteService: ClienteService, private _router: Router) {
    this.token = localStorage.getItem('token'); //Token del usuario que inicio seccion
    this.id = localStorage.getItem('id'); //Identificador del usuario que inicio seccion

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

  }

  ngOnInit(): void {

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
}
