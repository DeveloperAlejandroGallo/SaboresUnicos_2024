import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent{

  @Input() emailUsuario: any; // Asegúrate de pasar el usuario como entrada desde los tabs

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
      this.authService.cerrarSesion();
      this.router.navigateByUrl('/', { replaceUrl: true });
  }

}
