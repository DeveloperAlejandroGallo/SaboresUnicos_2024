import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-usr-pendientes',
  templateUrl: './list-usr-pendientes.page.html',
  styleUrls: ['./list-usr-pendientes.page.scss'],
})
export class ListUsrPendientesPage implements OnInit {


  public usuario: Usuario | undefined;
  public usuariosPendientes: Array<Usuario> = new Array<Usuario>();

  constructor(private usrSrv: UsuarioService,
              private auth: AuthService
  ) {

    this.usuario = this.auth.usuarioActual;
    this.usrSrv.allUsers$.subscribe(usr => {
      this.usuariosPendientes = usr.filter(u => !u.activo);
    });
  }

  ngOnInit() {
    var a =1;
  }

  onClick(usr: Usuario) {
    Swal.fire({
      title: `¿Desea Aprobar la cuenta de ${this.usuario?.nombre}, ${this.usuario?.apellido}?`,
      text: "Se le enviará un correo electrónico con la confirmación de su cuenta",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Cerrar sesión'
    }).then((result) => {
      if (result.isConfirmed) {
        this.auth.enviarEmailDeVerificacion(usr);
      }
    });
    }

}
