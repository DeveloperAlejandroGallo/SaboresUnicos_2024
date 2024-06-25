import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  {
  public usuario!: Usuario;
  url: string;
  @ViewChild('popover') popover: any;
  isOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private auth: AuthService,
    private popoverController: PopoverController
  ) {
    this.url = this.router.url;
    this.usuario = this.auth.usuarioActual!;
    // console.log(this.usuario);
  }

  logout() {
    this.isOpen = false;
    this.popoverController.dismiss();
    this.authService.cerrarSesion();
    // this.router.navigateByUrl('/', { replaceUrl: true });
  }

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }
}
