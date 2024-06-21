import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { AudioService } from 'src/app/services/audio.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.page.html',
  styleUrls: ['./mi-perfil.page.scss'],
})
export class MiPerfilPage  {

  cantEncuestas = 0;
  cantPedidos = 0;


  public usuario!: Usuario;
  url: string;

  public estadoToggle: boolean = true;


  constructor(private router: Router,
    private auth: AuthService,
    private audioSrv: AudioService) {

      this.audioSrv.reporoduccionCambioPagina();

    this.url = this.router.url;
    this.usuario = this.auth.usuarioActual!;
    console.log(this.usuario);

    this.estadoToggle = this.audioSrv.sonidoActivo;

  }


  cambiarEstadoSonido(event: CustomEvent){
    this.audioSrv.sonidoActivo = event.detail.checked;
  }
}
