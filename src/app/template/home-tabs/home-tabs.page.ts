import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Perfil } from 'src/app/enums/perfil';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { Barcode, BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { MensajesService } from 'src/app/services/mensajes.service';
import { IonPopover, ModalController, Platform } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import Swal from 'sweetalert2';
import { ListaEsperaService } from 'src/app/services/lista-espera.service';
import { MesaService } from 'src/app/services/mesas.service';
import { TipoEmpleado } from 'src/app/enums/tipo-empleado';
import { PushNotifications } from '@capacitor/push-notifications';
import { UsuarioService } from 'src/app/services/usuario.service';
import { PushNotificationService } from 'src/app/services/push-notification.service';

import { Keyboard } from '@capacitor/keyboard';
import { PedidoService } from 'src/app/services/pedido.service';
import { EstadoPedido } from 'src/app/enums/estado-pedido';
import { Pedido } from 'src/app/models/pedido';
import { timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EncuestaService } from 'src/app/services/encuesta.service';
import { Timestamp } from 'firebase/firestore';

const background = '#f8f8f8d7';
@Component({
  selector: 'app-home-tabs',
  templateUrl: './home-tabs.page.html',
  styleUrls: ['./home-tabs.page.scss'],
})

export class HomeTabsPage implements OnInit, OnDestroy {

  @ViewChild('popover') popover!: IonPopover;
  @Input() isLoading: boolean = false;

  public verLlenarEncuesta: boolean = false;
  public isKeyboardOpen = false;
  private keyboardWillShowSub: any;
  private keyboardWillHideSub: any;

  public usuarioLogueado!: Usuario;
  public esCliente: boolean = true;
  public esMaitre: boolean = false;
  public esDuenio: boolean = false;
  public esSupervisor: boolean = false;
  public esEmpleado: boolean = false;
  public esCocinero: boolean = false;
  public esMozo: boolean = false;
  public esBartender: boolean = false;
  public esAnonimo: boolean = false;
  public url: string;
  public codigoLeido: string = "";
  public isSupported: boolean = false;
  public isPermissionGranted = false;


  //para ocultar/ver distintos TABS -->
  verJuegos : boolean = false;
  verChat : boolean = false;
  verMiPedido : boolean = false;
  verEncuesta : boolean = false;
  estaEnEspera : boolean = false;
  tieneMesaAsignada : boolean = false;
  queAlta: string = '';
  pedido!: Pedido ;
  verMenu : boolean = false;
  //-------------------------
  constructor(
    private mesasSvc: MesaService,
    private listaSvc: ListaEsperaService,
    private modalController: ModalController,
    private platform: Platform,
    private msgService: MensajesService,
    private router: Router,
    private auth: AuthService,
    private usrService: UsuarioService,
    private pushSrv: PushNotificationService,
    private pedidoSrv: PedidoService,
    private encuestaSrv: EncuestaService) {



    this.url = this.router.url;
    this.usuarioLogueado = this.auth.usuarioActual!;
    this.usrService.usuario$.subscribe(data => {
      this.usuarioLogueado = data;
    });

    this.verChat = false;
    this.verJuegos = false;
    this.verMenu = false;
    this.verLlenarEncuesta = false;

    if(this.usuarioLogueado!.perfil !== Perfil.Empleado && this.usuarioLogueado!.mesaAsignada !== 0){
      this.isLoading = true;

        this.pedidoSrv.escucharPedidoId(this.pedido.id).subscribe({
                next: (pedido) => {
                this.pedido = pedido;

                this.verChat = false;
                this.verJuegos = false;
                this.verMenu = false;
                this.verLlenarEncuesta = false;


                console.log("leyo el pedido")
                if(this.pedido.estadoPedido === EstadoPedido.Aceptado ||
                  this.pedido.estadoPedido === EstadoPedido.EnPreparacion ||
                  this.pedido.estadoPedido === EstadoPedido.Listo ||
                  this.pedido.estadoPedido === EstadoPedido.Servido ||
                  this.pedido.estadoPedido === EstadoPedido.CuentaSolicitada ||
                  this.pedido.estadoPedido === EstadoPedido.Pagado){

                    this.encuestaSrv.allEncuestas$.subscribe({
                      next: (data) => {
                        this.verLlenarEncuesta = !data.some(x =>
                          x.cliente.id === this.usuarioLogueado!.id && this.cargoEncuestaHoy(x.fecha)) ;
                      },
                      error: (err) => {
                        console.error(err);
                      }
                    });
                  }

                if(this.pedido?.estadoPedido !== EstadoPedido.MesaAsignada && this.pedido?.estadoPedido !==  EstadoPedido.Cerrado){
                  this.verChat = true;
                  this.verJuegos = true;
                  this.verMenu = true;
                  this.router.navigate(['home-tabs/menu-productos']);
                }

                this.isLoading = false;
              },error: (err) => {
                console.error(err);
                this.isLoading = false;
              },complete: () => {
                this.isLoading = false
              }
              });
            } else {
              this.isLoading = false;
            }



  }

}

  ngOnInit() {


    if (this.platform.is('capacitor')) {
      Keyboard.addListener('keyboardWillShow', () => {
        this.isKeyboardOpen = true;
        console.log("teclado abierto");
      }).then(handle => {
        this.keyboardWillShowSub = handle;
      });

      Keyboard.addListener('keyboardWillHide', () => {
        this.isKeyboardOpen = false;
        console.log("teclado oculto");

      }).then(handle => {
        this.keyboardWillHideSub = handle;
      });

      console.log("Validando permisos de notificaciones en plataforma:");

      this.addListeners();
      this.registerNotifications();


    }
    this.tiposEntidades();

    this.preparaCamara();

    //Si al loguearse tiene mesa asignada, que NO es de reserva, voy directamente al menu.




    this.listaSvc.buscarEnListaXid(this.usuarioLogueado.id).subscribe(data => {
      this.estaEnEspera = data.length > 0;
    });

  }

  ngOnDestroy() {
    if (this.keyboardWillShowSub && this.keyboardWillShowSub.remove) {
      this.keyboardWillShowSub.remove();
    }
    if (this.keyboardWillHideSub && this.keyboardWillHideSub.remove) {
      this.keyboardWillHideSub.remove();
    }
  }

  // Método para abrir el Popover
  mostrarPopOver() {
    this.popover.present();
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
    this.verEncuesta = true;

    this.verMenu = false;
    if (this.usuarioLogueado.perfil == Perfil.Empleado) {
      this.esCliente = false;
      this.esDuenio = this.usuarioLogueado.tipoEmpleado === TipoEmpleado.Dueño;
      this.esSupervisor = this.usuarioLogueado.tipoEmpleado === TipoEmpleado.Supervisor;
      this.esMaitre = this.usuarioLogueado.tipoEmpleado === TipoEmpleado.Maitre;
      this.esCocinero = this.usuarioLogueado.tipoEmpleado === TipoEmpleado.Cocinero;
      this.esMozo = this.usuarioLogueado.tipoEmpleado === TipoEmpleado.Mozo;
      this.esBartender = this.usuarioLogueado.tipoEmpleado === TipoEmpleado.Bartender;
      this.verChat = false;
      this.verEncuesta = false;

    }

    if (this.esMaitre) {
      this.queAlta = 'Cliente'
    }

    if (this.esDuenio || this.esSupervisor) {
      this.queAlta = 'Empleado';
    }





  }

  private cargoEncuestaHoy(fechaEncuesta: Timestamp): boolean{


    let fechaEncuestaDate = fechaEncuesta.toDate();

    let fecha = new Date();
    let hora = fecha.getHours();
    let minutos = fecha.getMinutes();
    let segundos = fecha.getSeconds();
    let horaActual = hora + minutos/60 + segundos/3600;

    let fechaInicio = new Date();
    let fechaCierre = new Date();


    if(environment.horaCierre >= 0){
      //Antes de las 00
      fechaInicio.setDate(fechaInicio.getDate());
      fechaInicio.setHours(environment.horaApertura);
      fechaInicio.setMinutes(environment.minutoApertura);

      fechaCierre.setDate(fechaCierre.getDate() + 1);
      fechaCierre.setHours(environment.horaCierre);
      fechaCierre.setMinutes(environment.minutoCierre);


      if(hora >= 0 && hora <= environment.horaCierre){
        fechaInicio.setDate(fechaInicio.getDate() - 1);
        fechaInicio.setHours(environment.horaApertura);
        fechaInicio.setMinutes(environment.minutoApertura);

        fechaCierre.setHours(environment.horaCierre);
        fechaCierre.setMinutes(environment.minutoCierre);

      }
    }
    else{ //Abre y cierra en el día.
      fechaInicio.setDate(fechaInicio.getDate());
      fechaInicio.setHours(environment.horaApertura);
      fechaInicio.setMinutes(environment.minutoApertura);

      fechaCierre.setDate(fechaCierre.getDate());
      fechaCierre.setHours(environment.horaCierre);
      fechaCierre.setMinutes(environment.minutoCierre);

    }
    if(fechaEncuestaDate >= fechaInicio && fechaEncuestaDate <= fechaCierre){
      return true;
    }
    return false;

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

    if (data) {
      this.codigoLeido = data?.barcode?.displayValue;
      const datos = this.codigoLeido.split('/');

      switch (this.usuarioLogueado.perfil) {
        case Perfil.Cliente:
        case Perfil.Anonimo:
          switch (datos[0]) {
            case "IngresoLocal":
              this.ingresarAListaEspera();

              break;
            case "Mesa":
              if (this.validacionesMesa(datos[1])) {
                this.pedidoSrv.actualizarEstado(this.pedido, EstadoPedido.Abierto);
                this.router.navigate(['home-tabs/menu-productos']);
                this.verJuegos = true;
                this.verChat = true;
                this.verEncuesta = true;
              }
              break;
            case "Propina":
              if (this.esValidoParaPropina()) {
                if (this.pedido.propina != 0) {
                  this.msgService.Info("Ya dejaste propina.");
                  return;
                }
                //To Do: Seleccion de Propina con Swal Fire con opciones 0, 5, 10, 15, 20
                Swal.fire({
                  title: "¿Cual fué su nivel de satisfacción?",
                  input: 'select',
                  inputOptions: {
                    '0': '0% - Malo',
                    '5':  '5% - Regular',
                    '10': '10% - Bueno',
                    '15': '15% - Muy Bueno',
                    '20': '20% - Excelente'
                  },
                  inputPlaceholder: 'Seleccione un % de Propina',
                  showCancelButton: true,
                  confirmButtonColor: "#0EA06F",
                  cancelButtonColor: "#d33",
                  cancelButtonText: "Cancelar",
                  confirmButtonText: "Enviar",
                  heightAuto: false,
                  background: background
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.isLoading = true;
                    timer(3500).subscribe(()=>{

                      this.pedidoSrv.aplicarPropina(this.pedido, Number(result.value)).then(()=>{

                        this.msgService.Exito("Propina dejada con éxito. Gracias!!");

                      },
                      err=>{

                        this.msgService.Error("El servicio de propinas no está disponible en este momento. Intente más tarde.");
                      });

                      this.isLoading = false;
                    }); //Simulo tiempo de espera
                  }
                });



              }
              break;
            case "Pago":
              if (this.esValidoParaPago()) {
                this.isLoading = true;
                timer(3500).subscribe(() => {
                  this.isLoading = false;
                  this.pedidoSrv.actualizarEstado(this.pedido, EstadoPedido.Pagado).then(() => {
                    this.msgService.Exito("Pago realizado con éxito. Gracias por su visita.");
                    this.pushSrv.MozoPagoRealizado(this.pedido).subscribe({
                      next: (data) => {
                        console.log("Rta Push Pago: ");
                        console.log(data);
                      },
                      error: (error) => {
                        console.error("Error Push Pago: ");
                        console.error(error);
                      }
                    }); //Envio Push al Mozo

                  },
                    err => {
                      this.msgService.Error("El servicio de pagos no está disponible en este momento. Intente más tarde.");
                    });

                }); //Simulo tiempo de espera
              }
              break;
          }
          break;
        default:
          this.msgService.Error("No se identifico el tipo de perfil.");
          break;
      }

    }

  }
  esValidoParaPropina(): boolean {
    if (!this.pedido) {
      this.msgService.Info("No tienes mesa asignada.\nPor favor escanee el QR de la entrada para estar en lista de espera.");
      return false;
    }

    if(this.pedido.estadoPedido == EstadoPedido.MesaAsignada){
      this.msgService.Info(`Por favor escanee el QR de la Mesa ${this.usuarioLogueado.mesaAsignada}.`);
      return false;
    }

    if (this.pedido.estadoPedido == EstadoPedido.Abierto) {
      this.msgService.Info("Aun no tienes un Mozo asignado al cual dejarle la propina.\nPor favor primero has el pedido.");
      return false;
    }

    if (this.pedido.estadoPedido == EstadoPedido.Cerrado) {
      this.msgService.Info("El pedido ya fue cerrado.");
      return false;
    }


    return true;
  }
  esValidoParaPago(): boolean {

    if (this.pedido === (null || undefined)) {
      this.msgService.Info("No tienes mesa asignada.\nPor favor escanee el QR de la entrada para estar en lista de espera.");
      return false;
    }

    if (this.pedido.estadoPedido == EstadoPedido.Pagado) {
      this.msgService.Info("Ya pagaste tu pedido.");
      return false;
    }

    if (this.pedido.estadoPedido == EstadoPedido.Cerrado) {
      this.msgService.Info("El pedido ya fue cerrado.");
      return false;
    }

    if (this.pedido.estadoPedido != EstadoPedido.CuentaSolicitada) {
      this.msgService.Info("Primero solicita la cuenta al mozo.");
      return false;
    }


    return true;

  }



  validacionesMesa(mesa: string): boolean {

    if (this.usuarioLogueado.mesaAsignada == 0) {
      this.msgService.Info("No tienes mesa asignada.\nPor favor escanee el QR de la entrada para estar en lista de espera.");
      return false;
    }

    const nroMesa = mesa;
    if (this.usuarioLogueado.mesaAsignada != Number(nroMesa)) {
      this.msgService.Info('Mesa equivocada. Su número de mesa es ' + this.usuarioLogueado.mesaAsignada);
      return false;

    }
    return true;
  }




  ingresarAListaEspera() {
    // console.log(this.usuario);

    // this.msgService.Info(this.usuario.mesaAsignada.toString());

    if (this.usuarioLogueado.mesaAsignada == 0) {
      if (!this.estaEnEspera) {
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
            this.listaSvc.nuevo(this.usuarioLogueado).then(() => {
              this.isLoading = false;
              this.msgService.ExitoIonToast("Estas en lista de espera. Pronto se te asignará una mesa. Gracias!", 3);
              this.pushSrv.MaitreNuevoEnListaEspera(this.usuarioLogueado).subscribe({
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
            }).catch(err => {
              this.msgService.Error(err);
            })
          }
        });
      }
      else {
        this.msgService.Info("Ya estas en la lista de espera.");
      }
    } else {
      this.msgService.Info("Ya te asignaron una mesa, tu número de mesa es: " + this.usuarioLogueado.mesaAsignada);
    }

  }



  /**
 * Push Notifications
 * Registra el dispositivo para recibir notificaciones
 */
  async registerNotifications() {

    if (this.usuarioLogueado.token == (null || undefined)) {
      console.log("Usuario sin token");
      console.log("verificando permisos Push Notifications");
      let permisionStatus = await PushNotifications.checkPermissions();

      console.log("Pregunto si tiene permisos de recibir notificaciones");
      if (permisionStatus.receive === "prompt") {
        permisionStatus = await PushNotifications.requestPermissions();
      }
      console.log("verificando si se dieron permisos de recibir notificaciones");
      if (permisionStatus.receive !== "granted") {
        console.log("No se puede recibir notificaciones");
      }

    }

    PushNotifications.register();
  }

  async addListeners() {

    await PushNotifications.addListener('registration', token => {
      console.info('Token de registro: ', token.value);

      if (this.usuarioLogueado.token != token.value) {
        this.usrService.actualizarToken(this.usuarioLogueado.id!, token.value);
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

  recibirIsLoading(is: boolean) {
    this.isLoading = is;
  }

  irAlChat() {
    this.router.navigate(['home-tabs/chat']);
  }
  irACreacionEncuesta() {
    this.router.navigate(['home-tabs/encuesta-cliente']);
  }

  IrAGraficosEncuestas() {
    this.router.navigate(['graficos-encuestas']);
  }
}
