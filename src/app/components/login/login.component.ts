import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { Router } from '@angular/router';
declare var iziToast: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user: any = {};
  public usuario: any = {};
  public token: any;

  constructor(private _clienteService: ClienteService,
    private _router: Router
  ) {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this._router.navigate(['/']) //Para redureccionar a la pagia de inicio si un usuario ya se logueo
    }

  }

  ngOnInit(): void {
  }

  login(loginForm: any) {
    if (loginForm.valid) {
      // console.log(this.user);
      let data = {
        email: this.user.email,
        password: this.user.password
      }
      this._clienteService.login_cliente(data).subscribe(
        resp => {
          if (resp.data == undefined) {

          } else {
            this.usuario = resp.data;
            localStorage.setItem('token', resp.token);
            localStorage.setItem('id', resp.data._id);
            iziToast.show({
              title: 'Success',
              titleColor: 'FF0000',
              class: 'text-danger',
              color: 'green',
              position: 'topRight',
              message: resp.message
            });
            // this._clienteService.obtener_cliente_guest(resp.data._id, resp.token).subscribe(
            //   response => {
            //     console.log(response);
            //   },
            //   error => {
            //     console.log(error);
            //   }
            // );
            this._router.navigate(['/']);
          }
          // console.log(resp);
        },
        error => {
          // console.log(error);
          iziToast.show({
            title: 'Error',
            titleColor: 'red',
            color: 'red',
            class: 'text-danger',
            position: 'topRight',
            message: error.error.message
          });
        }
      );
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: 'red',
        class: 'text-danger',
        position: 'topRight',
        color: 'red',
        message: 'Los datos del formulario no son validos'
      });
    }
  }

}
