import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.page.html',
  styleUrls: ['./mi-perfil.page.scss'],
})
export class MiPerfilPage implements OnInit {

  cantEncuestas = 0;
  cantPedidos = 0;
  sonidoApp = true;

  public usuario!: Usuario;
  url: string;

  constructor(private router: Router, private auth: AuthService) {
    this.url = this.router.url;
    this.usuario = this.auth.usuarioActual!;
    console.log(this.usuario);
  }

  ngOnInit() {
  }
  
  cambiarEstadoSonido(){
    this.sonidoApp = !this.sonidoApp;
  }
}
