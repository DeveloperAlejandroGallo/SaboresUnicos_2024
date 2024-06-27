import { Component, OnInit } from '@angular/core';
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



const background = '#f8f8f8d7';
@Component({
  selector: 'app-home-tabs',
  templateUrl: './home-tabs.page.html',
  styleUrls: ['./home-tabs.page.scss'],
})

export class HomeTabsPage implements OnInit {
  public usuario!: Usuario;
  public esCliente:boolean = true;
  public esMaitre:boolean = false;
  public url: string;
  public codigoLeido : string = "";
  public isSupported: boolean = false;
  public isPermissionGranted = false;

  isLoading = false;
  //para ocultar/ver distintos TABS -->
  verJuegos : boolean = false;
  verChat : boolean = false;
  verChatFlotante: boolean = false;
  verMiPedido : boolean = false;
  verEncuesta : boolean = false;
  estaEnEspera : boolean = false;
  tieneMesaAsignada : boolean = false;
  //-------------------------
  constructor(private mesasSvc: MesaService, private listaSvc: ListaEsperaService,private modalController: ModalController, private platform: Platform, private msgService: MensajesService, private router: Router, private auth: AuthService, private usrService: UsuarioService) {
    this.url = this.router.url;
    this.usuario = this.auth.usuarioActual!;
    this.usrService.allUsers$.subscribe(data =>{
      this.usuario = data.filter(x => x.id === this.auth.usuarioActual?.id)[0];
    });
    console.log(this.usuario);
  }

  ngOnInit() {

    if(this.usuario.perfil == Perfil.Dueño || this.usuario.perfil == Perfil.Empleado){
      this.esCliente = false;
      if (this.usuario.tipoEmpleado == TipoEmpleado.maitre) {
        this.esMaitre = true;
      }
    }

    this.listaSvc.buscarEnListaXid(this.usuario.id).subscribe(data=>{
      this.estaEnEspera = data.length > 0;
      console.log(this.estaEnEspera);

    });

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

      switch(this.usuario.perfil){
        case Perfil.Cliente:
        case Perfil.Anonimo:
          switch(datos[0]){
            case "IngresoLocal":
              this.ingresarAListaEspera();
              break;
            case "Mesa":
              const nroMesa = datos[1];
              if (this.usuario.mesaAsignada == Number(nroMesa)) {
                this.router.navigate(['home-tabs/menu-productos']);
                this.verJuegos = true;
                this.verChat = true;
                this.verEncuesta = true;
              }else{
                this.msgService.Info('Mesa equivocada. Su número de mesa es ' + this.usuario.mesaAsignada);
              }
              //validar que haya pasado por lista de espera y que el qr de mesa escaneado sea el que se le fue asignado
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

    if (this.usuario.mesaAsignada == 0) {
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
            this.listaSvc.nuevo(this.usuario).then(()=>{
              this.isLoading = false;
              this.msgService.ExitoIonToast("Estas en lista de espera. Pronto se te asignará una mesa. Gracias!", 3);
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
      this.msgService.Info("Ya te asignaron una mesa, tu número de mesa es: " + this.usuario.mesaAsignada);
    }

  }



  /**
 * Push Notifications
 * Registra el dispositivo para recibir notificaciones
 */
async registerNotifications() {
  let permisionStatus = await PushNotifications.checkPermissions();

  if(permisionStatus.receive === "prompt"){
    permisionStatus = await PushNotifications.requestPermissions();
  }

  if(permisionStatus.receive !== "granted"){
    console.log("No se puede recibir notificaciones");
  }

  PushNotifications.register();

}

async addListeners() {

  if(this.usuario.token !== (null || undefined)) {

    await PushNotifications.addListener('registration', token => {
      console.info('Token de registro: ', token.value);

      this.usrService.actualizarToken(this.usuario.id!,token.value);
    });

    await PushNotifications.addListener('registrationError', err => {
      console.error('Error Registro Push: ', err.error);
    });


  }
  await PushNotifications.addListener('pushNotificationReceived', notification => {
    console.log('Notificación Recibida: ', notification);
  });

  await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
    console.log('Push notification action performed', notification.actionId, notification.inputValue);
  });


}



}
