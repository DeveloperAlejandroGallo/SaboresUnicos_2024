import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Perfil } from 'src/app/enums/perfil';
import { TipoEmpleado } from 'src/app/enums/tipo-empleado';
import { Usuario } from 'src/app/models/usuario';
import { AudioService } from 'src/app/services/audio.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit{

  public usuario!: Usuario;
  public isLoading = false;
  public esDuenio: boolean = false;
  public esCliente: boolean;
  public esSupervisor: boolean;
  public esEmpleado: boolean;
  public esMaitre: boolean;
  public esCocinero: boolean;
  public esMozo: boolean;
  public esBartender: boolean;
  public esAnonimo: boolean;

  constructor(private authSrv: AuthService,
    private audioSrv: AudioService,
    private router: Router) {

      this.router.events.subscribe((event) => {

        if (event instanceof NavigationEnd && event.urlAfterRedirects.includes('/home')) {
          this.audioSrv.reporoduccionCambioPagina();
        }
      });

    this.usuario = this.authSrv.usuarioActual!;

    this.esCliente = this.usuario.perfil === Perfil.Cliente;
    this.esAnonimo = this.usuario.perfil === Perfil.Anonimo;
    this.esDuenio = this.usuario.tipoEmpleado === TipoEmpleado.Dueño;
    this.esSupervisor = this.usuario.tipoEmpleado === TipoEmpleado.Supervisor;
    this.esEmpleado = this.usuario.perfil === Perfil.Empleado;
    this.esMaitre = this.usuario.tipoEmpleado === TipoEmpleado.Maitre;
    this.esCocinero = this.usuario.tipoEmpleado === TipoEmpleado.Cocinero;
    this.esMozo = this.usuario.tipoEmpleado === TipoEmpleado.Mozo;
    this.esBartender = this.usuario.tipoEmpleado === TipoEmpleado.Bartender;



  }

  ngOnInit(): void {
    this.audioSrv.reporoduccionCambioPagina();
  }

  recibirIsLoading($event: boolean) {
      this.isLoading = $event;
    }
}


