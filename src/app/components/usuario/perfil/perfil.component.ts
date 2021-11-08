import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
declare let iziToast: any;
declare let jQuery: any;
declare let $: any;
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public cliente: any = {
    genero: '',
    pais: ''
  };
  public id: any;
  public token: any;

  constructor(private _clienteService: ClienteService) {
    this.id = localStorage.getItem('id');
    this.token = localStorage.getItem('token');

    this.obtenerClienteBy();
  }

  ngOnInit(): void {

  }

  obtenerClienteBy() {
    if (this.id) {
      this._clienteService.obtener_cliente_guest(this.id, this.token).subscribe(
        resp => {
          // console.log(resp);
          this.cliente = resp.data;
        }, error => {
          console.log(error);
        }
      )
    }
  }
  actualizar(actualizarForm: any) {
    if (actualizarForm.valid) {
      // console.log(this.cliente);
      this.cliente.password = $('#input_password').val()
      this._clienteService.actualizar_perfil_cliente_guest(this.id, this.cliente, this.token).subscribe(
        resp => {
          // console.log(resp);
          iziToast.show({
            title: 'Success',
            titleColor: 'FF0000',
            class: 'text-success',
            color: 'green',
            position: 'topRight',
            message: resp.message
          });
          this.obtenerClienteBy();
        }, error => {
          console.log(error);
        }
      )

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
