import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
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
    private msgService: MensajesService) {

    this.usuario = this.auth.usuarioActual!;

    this.usrService.allUsers$.subscribe((users) => {

      this.users = users.filter(x => x.activo == false);
      console.log(this.users);
    });

  }

  Rechazar(usr: Usuario) {
    try{
      this.usrService.delete(usr.id);
      this.auth.eliminarUsuario(usr);
      this.msgService.Info("Usuario Rechazado y eliminado.");
      
      }
      catch(ex){
        console.error(`Error al eliminar el usuario: ${ex}`)
        this.msgService.Error("Error al eliminar el usuario.");
      }
    //envio de mail
    }

  Aceptar(usr: Usuario) {
    this.usrService.aprobarCuenta(usr);
    this.msgService.Exito("Usuario Aprobado");
    //envio de mail
    }



}
