import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public token: any = {}
  public user: any = undefined;
  public user_lc: any = undefined;
  public id: any;

  constructor(private _clienteService: ClienteService) {
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

}
