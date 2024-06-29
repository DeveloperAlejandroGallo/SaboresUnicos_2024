import { Component, HostListener, OnInit } from '@angular/core';
import { UsuarioService } from './services/usuario.service';
import { AudioService } from './services/audio.service';
import {  Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { AuthService } from './services/auth.service';
import { StatusBar, Style } from '@capacitor/status-bar';
import { MesaService } from './services/mesas.service';
import { register } from 'swiper/element/bundle';
import { ScreenOrientation, ScreenOrientationPlugin } from '@capacitor/screen-orientation';
import { EncuestaService } from './services/encuesta.service';
import { ListaEsperaService } from './services/lista-espera.service';
import { PedidoService } from './services/pedido.service';
import { ProductoService } from './services/producto.service';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent{



  isLoading: boolean = false;
  esAdmin: boolean = false;

  constructor(private usuariosSrv: UsuarioService,
            private audioSrv: AudioService,
            private router: Router,
            private platform: Platform,
            private authSrv: AuthService,
            private mesasSrv: MesaService,
            private encuestaSrv: EncuestaService,
            private listaEsperaSrv: ListaEsperaService,
            private pedidoSrv: PedidoService,
            private productoSrv: ProductoService) {



    this.iniciarApp();
    this.LlenarListas();

  }



  private LlenarListas() {
    this.mesasSrv.traer();
    this.usuariosSrv.traer();
    this.encuestaSrv.traer();
    this.listaEsperaSrv.traer();
    this.pedidoSrv.traer();
    this.productoSrv.traer();
  }

  logout() {
   this.authSrv.cerrarSesion();
  }



  irAUrl(url: string) {
    this.isLoading = true;

    setTimeout(() => {
        this.isLoading = false;
        this.router.navigate([url]);
      }, 1200);

    }


  iniciarApp() {
    this.platform.ready().then(() => {
      this.audioSrv.reporoduccionInicioSesion();

      this.setAndroidBackButtonBehavior();

      //para la barra de notificaciones
      if(this.platform.is('capacitor')){
        StatusBar.setBackgroundColor({ color: '#BF0000' });
        StatusBar.setStyle({ style: Style.Light });
      }
    });
  }
  setAndroidBackButtonBehavior() {
    this.platform.backButton.subscribeWithPriority(10,() => {
      if (window.location.pathname == "/login") {
          App.exitApp();
      }
      if (window.location.pathname != "/home") {
        return;
      //   Swal.fire({
      //     title: '¿Estás seguro?',
      //     text: "¿Quieres cerrar la sesión?",
      //     icon: 'warning',
      //     showCancelButton: true,
      //     // confirmButtonColor: '#3085d6',
      //     // cancelButtonColor: '#d33',
      //     confirmButtonText: 'Sí, cerrar sesión!',
      //     cancelButtonText: 'No, cancelar!',
      //     heightAuto: false
      //   }).then((result) => {
      //     if (result.isConfirmed) {
      //       this.authSrv.cerrarSesion();
      //     }
      //   })
      }
    });
  }


  @HostListener('document:touchstart', ['$event'])
  @HostListener('document:mousedown', ['$event'])
  onUserInteraction(event: Event) {

    // this.audioSrv.reporoduccionInicioSesion(5);
 }
}

