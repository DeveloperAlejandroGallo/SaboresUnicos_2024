import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { EstadoCliente } from 'src/app/enums/estado-cliente';
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
export class ListUsuariosComponent implements OnDestroy {


  @Output() EnviarIsLoading = new EventEmitter<boolean>();

  public users: Array<Usuario> = new Array<Usuario>;
  public isLoading: boolean = false;
  private suscription!: Subscription;

  constructor(private auth: AuthService,
    private usrService: UsuarioService,
    private msgService: MensajesService,
    private emailService: EmailService) {

    this.suscription = this.usrService.allUsers$.subscribe((users) => {

      this.users = users.filter(x => x.estado == EstadoCliente.Pendiente);

    });

  }
  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }

  Rechazar(usr: Usuario) {

      this.EnviarIsLoading.emit(true);
      this.usrService.modificarEstadoCuenta(usr, EstadoCliente.Rechazado);
      // this.auth.eliminarUsuario(usr);


      this.emailService.enviarEmailAceptacionRechazo(usr, false).subscribe({
        next: responseData => {
          this.EnviarIsLoading.emit(false);
          this.msgService.Exito("Usuario Rechazado. Email de aviso enviado correctamente.");
        },
        error: error => {
          console.error(`Error al enviar el email: ${error}`);
          this.EnviarIsLoading.emit(false);
          this.msgService.Warning("Usuario Rechazado. Pero con error al enviar el email.");
        }
      });
      this.EnviarIsLoading.emit(false);
    }

  Aceptar(usr: Usuario) {
    this.EnviarIsLoading.emit(true);
    this.usrService.modificarEstadoCuenta(usr, EstadoCliente.Activo);

    this.emailService.enviarEmailAceptacionRechazo(usr, true).subscribe({
      next: responseData => {
        this.EnviarIsLoading.emit(false);
        this.msgService.Exito("Usuario aprobado. Email de aviso enviado correctamente.");
      },
      error: error => {
        console.error(`Error al enviar el email: ${error}`);
        this.EnviarIsLoading.emit(false);
        this.msgService.Warning("Usuario aprobado. Pero con error al enviar el email.");
      }
    });
    }



}
