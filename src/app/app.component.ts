import { Component, HostListener, OnInit } from '@angular/core';
import { UsuarioService } from './services/usuario.service';
import { AudioService } from './services/audio.service';
import {  Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { AuthService } from './services/auth.service';
import { StatusBar, Style } from '@capacitor/status-bar';
import { PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{



  isLoading: boolean = false;
  esAdmin: boolean = false;

  constructor(private usuariosSrv: UsuarioService,
              private audioSrv: AudioService,
              private router: Router,
              private platform: Platform,
              private authSrv: AuthService) {



    this.iniciarApp();
    this.usuariosSrv.traer();

    if(this.platform.is("android")){
      this.addListeners();
      this.registerNotifications();
    }


  }
  async registerNotifications() {
    let permisionStatus = await PushNotifications.checkPermissions();

    if(permisionStatus.receive === "prompt"){
      permisionStatus = await PushNotifications.requestPermissions();
    }

    if(permisionStatus.receive !== "granted"){
      console.log("No se puede recibir notificaciones");
    }

    PushNotifications.register();

    PushNotifications.addListener('registration', (token: PushNotificationSchema) => {
      console.log('Token de dispositivo:', token.value);
      // Aquí puedes enviar el token al servidor para almacenarlo y asociarlo con el usuario
      // Por ejemplo, puedes hacer una solicitud HTTP POST a tu endpoint "/notify" con el token
    });

  }

  addListeners() {

  }
  ngOnInit(): void {
    this.usuariosSrv.traer();
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
      StatusBar.setBackgroundColor({ color: '#BF0000' });
      StatusBar.setStyle({ style: Style.Light });
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
