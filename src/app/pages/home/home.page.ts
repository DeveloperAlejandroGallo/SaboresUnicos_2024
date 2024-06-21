import { Component, OnInit } from '@angular/core';
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
  esCliente: boolean;
  esSupervisor: boolean;
  esEmpleado: boolean;
  esMaitre: boolean;
  esCocinero: boolean;
  esMozo: boolean;
  esBartender: boolean;
  esAnonimo: boolean;

  constructor(private authSrv: AuthService,
    private audioSrv: AudioService,
    private router: Router) {

      this.router.events.subscribe((event) => {
        
        if (event instanceof NavigationEnd && event.urlAfterRedirects.includes('/home')) {
          this.audioSrv.reporoduccionCambioPagina();
        }
      });

    this.usuario = this.authSrv.usuarioActual!;

    this.esDuenio = this.usuario.perfil === Perfil.Dueño;
    this.esCliente = this.usuario.perfil === Perfil.Cliente;
    this.esAnonimo = this.usuario.perfil === Perfil.Anonimo;
    this.esSupervisor = this.usuario.perfil === Perfil.Supervisor;
    this.esEmpleado = this.usuario.perfil === Perfil.Empleado;
    this.esMaitre = this.usuario.tipoEmpleado === TipoEmpleado.maitre;
    this.esCocinero = this.usuario.tipoEmpleado === TipoEmpleado.cocinero;
    this.esMozo = this.usuario.tipoEmpleado === TipoEmpleado.mozo;
    this.esBartender = this.usuario.tipoEmpleado === TipoEmpleado.bartender;



  }

  ngOnInit(): void {
    this.audioSrv.reporoduccionCambioPagina();
  }
}


