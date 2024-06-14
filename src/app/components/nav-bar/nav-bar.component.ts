import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent{

  @Input() titulo: string = '';
  @Input() volver: Boolean = true;
  public  usuario!: Usuario;
  url: string;

  constructor(private authService: AuthService, private router: Router, private auth: AuthService) {
    this.url = this.router.url;
    this.usuario = this.auth.usuarioActual!;
    console.log(this.usuario);

  }

  logout() {
      this.authService.cerrarSesion();
      this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
