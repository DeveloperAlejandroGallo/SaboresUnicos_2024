import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { EmailService } from 'src/app/services/email.service';
import { MensajesService } from 'src/app/services/mensajes.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-list-usuarios',
  templateUrl: './list-usuarios.component.html',
  styleUrls: ['./list-usuarios.component.scss'],
})
export class ListUsuariosComponent  {


  public usuario: Usuario;
  public users: Array<Usuario> = new Array<Usuario>;

  constructor(private auth: AuthService,
    private usrService: UsuarioService,
    private msgService: MensajesService,
    private emailService: EmailService) {

    this.usuario = this.auth.usuarioActual!;

    this.usrService.allUsers$.subscribe((users) => {

      this.users = users.filter(x => x.activo == false);
      console.info("Usuario Pendientes de Aprobación:");
      console.log(this.users);
    });

  }

  Rechazar(usr: Usuario) {
    try{
      this.usrService.delete(usr.id);
      this.auth.eliminarUsuario(usr);
      }
      catch(ex){
        console.error(`Error al eliminar el usuario: ${ex}`)
        return;
      }

      this.emailService.enviarEmailAceptacionRechazo(usr, false).subscribe({
        next: responseData => {
          this.msgService.Exito("Usuario Rechazado y eliminado. Email de aviso enviado correctamente.");
        },
        error: error => {
          console.error(`Error al enviar el email: ${error}`);
          this.msgService.Exito("Usuario Rechazado y eliminado.");
        }
      });
    }

  Aceptar(usr: Usuario) {

    this.usrService.aprobarCuenta(usr);
    this.emailService.enviarEmailAceptacionRechazo(usr, true).subscribe({
      next: responseData => {
        this.msgService.Exito("Usuario aprobado. Email de aviso enviado correctamente.");
      },
      error: error => {
        console.error(`Error al enviar el email: ${error}`);
        this.msgService.Exito("Usuario aprobado.");
      }
    });
    }



}
