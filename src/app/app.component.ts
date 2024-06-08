import { Component, HostListener, OnInit } from '@angular/core';
import { UsuarioService } from './services/usuario.service';
import { AudioService } from './services/audio.service';
import { NavigationStart, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import Swal from 'sweetalert2';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  constructor(private usuariosSrv: UsuarioService,
              private audioSrv: AudioService,
              private router: Router,
              private platform: Platform,
              private authSrv: AuthService) {

    this.iniciarApp();


  }
  ngOnInit(): void {
    this.usuariosSrv.traer();
  }


  iniciarApp() {
    this.platform.ready().then(() => {
      this.audioSrv.reporoduccionInicioSesion(8);


      // this.router.events.subscribe(event => {
      //   if (event instanceof NavigationStart) {
      //     this.audioSrv.reporoduccionInicioSesion(5);
      //   }
      // });

      this.setAndroidBackButtonBehavior();
    });
  }
  setAndroidBackButtonBehavior() {
    this.platform.backButton.subscribeWithPriority(10,() => {
      if (window.location.pathname == "/login") {
          App.exitApp();
      }
      if (window.location.pathname == "/home") {
        Swal.fire({
          title: '¿Estás seguro?',
          text: "¿Quieres cerrar la sesión?",
          icon: 'warning',
          showCancelButton: true,
          // confirmButtonColor: '#3085d6',
          // cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, cerrar sesión!',
          cancelButtonText: 'No, cancelar!',
          heightAuto: false
        }).then((result) => {
          if (result.isConfirmed) {
            this.authSrv.cerrarSesion();
          }
        })
      }
    });
  }


  @HostListener('document:touchstart', ['$event'])
  @HostListener('document:mousedown', ['$event'])
  onUserInteraction(event: Event) {
    if (!this.audioSrv.inicioSesion.paused) {
      return;
    }
    // this.audioSrv.reporoduccionInicioSesion(5);
 }
}
