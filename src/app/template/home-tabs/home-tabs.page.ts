import { Component, Input, OnInit, HostListener, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Perfil } from 'src/app/enums/perfil';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { Barcode, BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { MensajesService } from 'src/app/services/mensajes.service';
import { ModalController, Platform } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import Swal from 'sweetalert2';
import { ListaEsperaService } from 'src/app/services/lista-espera.service';
import { MesaService } from 'src/app/services/mesas.service';
import { TipoEmpleado } from 'src/app/enums/tipo-empleado';
import { PushNotifications } from '@capacitor/push-notifications';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';



const background = '#f8f8f8d7';
@Component({
  selector: 'app-home-tabs',
  templateUrl: './home-tabs.page.html',
  styleUrls: ['./home-tabs.page.scss'],
})

export class HomeTabsPage implements OnInit{

  @Input() isLoading: boolean = false;

  public keyboardShowListener: any
  public keyboardHideListener: any

  public usuarioLogueado!: Usuario;
  public esCliente:boolean = true;
  public esMaitre:boolean = false;
  public esDuenio: boolean = false;
  public esSupervisor: boolean = false;
  public esEmpleado: boolean = false;
  public esCocinero: boolean = false;
  public esMozo: boolean = false;
  public esBartender: boolean = false;
  public esAnonimo: boolean = false;
  public url: string;
  public codigoLeido : string = "";
  public isSupported: boolean = false;
  public isPermissionGranted = false;
  public habilitarBoton = true;
  //para ocultar/ver distintos TABS -->
  verJuegos : boolean = false;
  verChat : boolean = false;
  verChatFlotante: boolean = false;
  verMiPedido : boolean = false;
  verEncuesta : boolean = false;
  estaEnEspera : boolean = false;
  tieneMesaAsignada : boolean = false;
  queAlta: string = '';
  //-------------------------
  constructor(
    private mesasSvc: MesaService,
    private listaSvc: ListaEsperaService,
    private modalController: ModalController,
    private platform: Platform,
    private msgService: MensajesService,
    private router: Router,
    private auth: AuthService,
    private usrService: UsuarioService) {

    this.url = this.router.url;
    this.usuarioLogueado = this.auth.usuarioActual!;
    this.usrService.allUsers$.subscribe(data =>{
      this.usuarioLogueado = data.filter(x => x.id === this.auth.usuarioActual?.id)[0];
    });

  // console.log(this.usuarioLogueado);
  }



  ngOnInit() {

    if(this.platform.is('capacitor')) {
      console.log("Validadndo permisos de notificaciones en plataforma:");

      this.addListeners();
      this.registerNotifications();
    }
    this.tiposEntidades();

    this.preparaCamara();

    //Si al loguearse tiene mesa asignada, que NO es de reserva, voy directamente al menu.

    if (this.esCliente && this.usuarioLogueado.mesaAsignada != 0 && !this.usuarioLogueado.tieneReserva) {
      this.router.navigate(['home-tabs/menu-productos']);
      this.verJuegos = true;
      this.verChat = true;
      this.verEncuesta = true;
      return;
    }



    this.listaSvc.buscarEnListaXid(this.usuarioLogueado.id).subscribe(data=>{
      this.estaEnEspera = data.length > 0;
    });


  }





  private preparaCamara() {
    if (this.platform.is('capacitor')) {
      try {
        BarcodeScanner.installGoogleBarcodeScannerModule();

        BarcodeScanner.isSupported().then((result: any) => {
          this.isSupported = result.supported;
          if (!this.isSupported) {
            this.msgService.ErrorIonToast(
              'El escaneo de códigos QR no está soportado en este dispositivo'
            );
          }
        });

        BarcodeScanner.checkPermissions().then((result) => {
          this.isPermissionGranted = result.camera === 'granted';
        });
        BarcodeScanner.removeAllListeners();
      } catch (error) {
        console.error('Error al escanear: ' + error);
      }
    }
  }

  tiposEntidades() {

    this.esCliente = true;

    if(this.usuarioLogueado.perfil == Perfil.Empleado){
      this.esCliente = false;
      this.esDuenio = this.usuarioLogueado.tipoEmpleado === TipoEmpleado.Dueño;
      this.esSupervisor = this.usuarioLogueado.tipoEmpleado === TipoEmpleado.Supervisor;
      this.esMaitre = this.usuarioLogueado.tipoEmpleado === TipoEmpleado.Maitre;
      this.esCocinero = this.usuarioLogueado.tipoEmpleado === TipoEmpleado.Cocinero;
      this.esMozo = this.usuarioLogueado.tipoEmpleado === TipoEmpleado.Mozo;
      this.esBartender = this.usuarioLogueado.tipoEmpleado === TipoEmpleado.Bartender;

    }

    if(this.esMaitre){
      this.queAlta = 'Cliente'
    }

    if(this.esDuenio || this.esSupervisor){
      this.queAlta = 'Empleado';
    }

  }

  async escanearQR() {
    const modal = await this.modalController.create({
      component: BarcodeScanningModalComponent,
      cssClass: 'barcode-scanning-modal',
      showBackdrop: false,
      componentProps: {
        formats: [],
        LensFacing: LensFacing.Back
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();

    if(data){
      this.codigoLeido = data?.barcode?.displayValue;
      const datos = this.codigoLeido.split('/');

      switch(this.usuarioLogueado.perfil){
        case Perfil.Cliente:
        case Perfil.Anonimo:
          switch(datos[0]){
            case "IngresoLocal":
              this.ingresarAListaEspera();

              break;
            case "Mesa":
              if(this.validacionesMesa(datos[1])) {
                this.router.navigate(['home-tabs/menu-productos']);
                this.verJuegos = true;
                this.verChat = true;
                this.verEncuesta = true;
              }
              break;
            case "Propinas":

              break;
          }
          break;
        default:
          this.msgService.Error("No se identifico el tipo de perfil.");
          break;
      }

    }

  }




  ingresarAListaEspera(){
    // console.log(this.usuario);

    // this.msgService.Info(this.usuario.mesaAsignada.toString());

    if (this.usuarioLogueado.mesaAsignada == 0) {
      if(!this.estaEnEspera){
        Swal.fire({
          title: "¿Quieres entrar a la lista de espera?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#0EA06F",
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancelar",
          confirmButtonText: "Entrar",
          heightAuto: false,
          background: background
        }).then((result) => {
          if (result.isConfirmed) {

            this.isLoading = true;
            //this.usuario.estaEnListaEspera = true;
            //this.usrService.actualizar(this.usuario);
            this.listaSvc.nuevo(this.usuarioLogueado).then(()=>{
              this.isLoading = false;
              this.msgService.ExitoIonToast("Estas en lista de espera. Pronto se te asignará una mesa. Gracias!", 3);
              this.pushSrv.notificarMaitreNuevoEnListaEspera(this.usuarioLogueado).subscribe( {
                next: (data) => {
                  console.log("Rta Push Lista: ");
                  console.log(data);
                },
                error: (error) => {
                  console.error("Error Push Lista: ");
                  console.error(error);
                  this.isLoading = false;
                }
              });
            }).catch(err=>{
              this.msgService.Error(err);
            })
          }
        });
      }
      else{
        this.msgService.Info("Ya estas en la lista de espera.");
      }
    }else{
      this.msgService.Info("Ya te asignaron una mesa, tu número de mesa es: " + this.usuarioLogueado.mesaAsignada);
    }

  }



    /**
   * Push Notifications
   * Registra el dispositivo para recibir notificaciones
   */
  async registerNotifications() {

    if(this.usuarioLogueado.token == (null || undefined)) {
      console.log("Usuario sin token");
      console.log("verificando permisos Push Notifications");
      let permisionStatus = await PushNotifications.checkPermissions();

      console.log("Pregunto si tiene permisos de recibir notificaciones");
      if(permisionStatus.receive === "prompt"){
        permisionStatus = await PushNotifications.requestPermissions();
      }
      console.log("verificando si se dieron permisos de recibir notificaciones");
      if(permisionStatus.receive !== "granted"){
        console.log("No se puede recibir notificaciones");
      }

    }

    PushNotifications.register();
  }

  async addListeners() {

      await PushNotifications.addListener('registration', token => {
        console.info('Token de registro: ', token.value);

        if(this.usuarioLogueado.token != token.value){
          this.usrService.actualizarToken(this.usuarioLogueado.id!,token.value);
        }
      });

      await PushNotifications.addListener('registrationError', err => {
        console.error('Error Registro Push: ', err.error);
      });


    await PushNotifications.addListener('pushNotificationReceived', notification => {
      console.log('Notificación Recibida: ', notification);
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
      console.log('Push notification action performed', notification.actionId, notification.inputValue);
    });

  }

  recibirIsLoading(is: boolean){
    this.isLoading = is;
  }


}
