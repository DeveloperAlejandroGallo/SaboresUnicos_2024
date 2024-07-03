import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Timestamp } from 'firebase/firestore';
import { EstadoPedido } from 'src/app/enums/estado-pedido';
import { Pedido } from 'src/app/models/pedido';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { EncuestaService } from 'src/app/services/encuesta.service';
import { MensajesService } from 'src/app/services/mensajes.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { ProductoService } from 'src/app/services/producto.service';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.page.html',
  styleUrls: ['./resumen.page.scss'],
})
export class ResumenPage {


  @Output() EnviarIsLoading = new EventEmitter<boolean>();

  public tarifaServicio: number = 100;
  public usuario: Usuario;
  public pedido!: Pedido;
  public subtotal: number = 0;
  public total: number = 0;
  public estadoPedido: string = "Abierto";
  public colorEstado: string = "";
  public textoAccion: string = "";
  public botonDeshabilitado: boolean = false;
  public verAvisoPagoQR: boolean = false;
  private intervalId: any;

  public queTiempo: string = "Estimado"; //Faltante - Entregado
  public minutosFaltantes: string = "00";
  public mostrarCartel: boolean = false;
  public isLoading: boolean = false;
  isLoadingSpinner: boolean = false;
  constructor(
    private auth: AuthService,
    private productoService: ProductoService,
    public pedidoSrv: PedidoService,
    private router: Router,
    private msgSrv: MensajesService,
    private push: PushNotificationService,
    private encuestaSrv: EncuestaService) {

      this.usuario = this.auth.usuarioActual!;
      this.isLoading = true;
      this.SuscribirseAlPedido();


  }

  accionPedido() {
    this.EnviarIsLoading.emit(true);
    switch (this.pedido.estadoPedido) {
      case EstadoPedido.Abierto:
        this.pedidoSrv.pedidoActual.estadoPedido = EstadoPedido.Pendiente;
        this.pedidoSrv.actualizarEstado(this.pedido,EstadoPedido.Pendiente)
        .then(() => {
          this.botonDeshabilitado = true;
          this.msgSrv.ExitoToast('Su pedido ha sido enviado al mozo.\nPor favor, aguarde la confirmación.');
          this.push.MozosNuevoPedido(this.pedido.mesa.numero).subscribe( {
            next: () => {
              console.log('Notificación enviada a Mozos');
            },
            error: (err) => {
              console.error(err);
            }
          }

          );
        })
        .catch(err => {
          console.error(err);
        });
        break;
      case EstadoPedido.Listo:
        this.pedidoSrv.pedidoActual.estadoPedido = EstadoPedido.Servido;
        this.pedidoSrv.actualizarEstado(this.pedido,EstadoPedido.Servido)
        .then(() => {
          this.encuestaSrv.verLlenarEncuesta = true;
          this.encuestaSrv.allEncuestas$.subscribe({
            next: (data) => {
              this.encuestaSrv.verLlenarEncuesta = !data.some(x =>
                x.cliente.id === this.usuario!.id && this.cargoEncuestaHoy(x.fecha)) ;
            },
            error: (err) => {
              console.error(err);
            }
          });
          this.msgSrv.ExitoToast('Esperamos que disfrutes de tu pedido!');
          this.botonDeshabilitado = true;
        })
        .catch(err => {
          console.error(err);
        });
        break;
      case EstadoPedido.Servido:
        this.pedidoSrv.pedidoActual.estadoPedido = EstadoPedido.CuentaSolicitada;
        this.pedidoSrv.actualizarEstado(this.pedido,EstadoPedido.CuentaSolicitada)
        .then(() => {
          this.msgSrv.ExitoToast('Pronto el mozo se acercará con la cuenta.');
          this.push.MozoPedidoCuenta(this.pedido).subscribe( {
            next: () => {
              console.log('Enviado');
            },
            error: (err) => {
              console.error(err);
            }
          }

          );
          this.botonDeshabilitado = false;
          this.verAvisoPagoQR = true;
        })
        .catch(err => {
          console.error(err);
        });
        break;
        case EstadoPedido.CuentaSolicitada:
          this.isLoadingSpinner = true;
          this.pedidoSrv.actualizarEstado(this.pedido,EstadoPedido.Pagado)
          .then(() => {
            this.isLoadingSpinner = false;
            this.msgSrv.ExitoToast('Gracias por su visita!.\nEsperamos verte pronto!');
            this.botonDeshabilitado = true;
            
          })
          .catch(err => {
            console.error(err);
          });
          break;
      default:
        console.error('Error en el flujo de estado del pedido.');
        break;
      }
      this.EnviarIsLoading.emit(false);
    }






  private SuscribirseAlPedido() {
    this.pedidoSrv.pedido$.subscribe({
      next: (data)=>{
        this.pedido = data;
        this.subtotal = data.productos.reduce((acc, x) => acc + x.producto.precio * x.cantidad, 0);
        this.total = this.subtotal + this.pedido.propina - (this.pedido.descuentoPorJuego * this.subtotal / 100) + this.tarifaServicio;

        this.botonDeshabilitado = false;
        this.verAvisoPagoQR = false;
        this.mostrarCartel = false;
        this.encuestaSrv.verLlenarEncuesta = false;

        this.pedidoSrv.pedidoActual.estadoPedido = this.pedido.estadoPedido;

        switch (this.pedido.estadoPedido) {
          case EstadoPedido.Abierto:
            this.estadoPedido = "Abierto";
            this.colorEstado = "abierto";
            this.textoAccion = "Enviar Pedido";
            this.queTiempo = `Estimado`;
            break;
          case EstadoPedido.Pendiente:
            this.estadoPedido = "Pendiente de aceptar por el mozo";
            this.colorEstado = "pendiente";
            this.textoAccion = "Pedido Enviado";
            this.botonDeshabilitado = true;
            this.queTiempo = `Estimado`;
            break;
          case EstadoPedido.Aceptado:
            this.iniciarContador();
            this.estadoPedido = "El Mozo aceptó su pedido.";
            this.colorEstado = "aceptado";
            this.textoAccion = "Pedido Enviado";
            this.botonDeshabilitado = true;
            this.queTiempo = `Restante`;
            break;
          case EstadoPedido.EnPreparacion:
            this.estadoPedido = "En preparación";
            this.colorEstado = "en-preparacion";
            this.textoAccion = "Pedido Enviado";
            this.botonDeshabilitado = true;
            this.queTiempo = `Restante`;
            break;
          case EstadoPedido.Listo:
            this.estadoPedido = "Listo para entregar al cliente.";
            this.colorEstado = "listo";
            this.textoAccion = "Recibir Pedido";
            this.botonDeshabilitado = false;
            this.queTiempo = `Restante`;
            break;
          case EstadoPedido.Servido:
            this.estadoPedido = "Recibido por el cliente.";
            this.colorEstado = "servido";
            this.textoAccion = "Solicitar Cuenta";
            this.queTiempo = `Entregado`;
            this.botonDeshabilitado = false;
            this.mostrarCartel = true;
            this.encuestaSrv.verLlenarEncuesta = !this.encuestaSrv.listadoEncuesta.some(x =>
              x.cliente.id === this.usuario!.id && this.cargoEncuestaHoy(x.fecha)) ;
            break;
          case EstadoPedido.CuentaSolicitada:
            this.estadoPedido = "Se solicito la cuenta al Mozo.";
            this.colorEstado = "cuenta-solicitada";
            this.textoAccion = "Pagar con Efvo. o Tarjeta";
            this.verAvisoPagoQR = true;
            this.queTiempo = `Entregado`;
            this.botonDeshabilitado = false;
            this.mostrarCartel = true;
            this.encuestaSrv.verLlenarEncuesta = !this.encuestaSrv.listadoEncuesta.some(x =>
              x.cliente.id === this.usuario!.id && this.cargoEncuestaHoy(x.fecha)) ;
            break;
          case EstadoPedido.Pagado:
            this.estadoPedido = "Pagado.";
            this.colorEstado = "pagado";
            this.textoAccion = "Pagado";
            this.botonDeshabilitado = true;
            this.queTiempo = `Entregado`;
            this.encuestaSrv.verLlenarEncuesta = !this.encuestaSrv.listadoEncuesta.some(x =>
              x.cliente.id === this.usuario!.id && this.cargoEncuestaHoy(x.fecha)) ;
            break;
          case EstadoPedido.Cerrado:
            this.estadoPedido = "Cerrado.";
            this.colorEstado = "cerrado";
            this.textoAccion = "Pagado";
            this.botonDeshabilitado = true;
            this.queTiempo = `Entregado`;
            break;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });

  }

  iniciarContador() {
    if(!this.pedido|| this.pedido.fechaDePedidoAceptado === null)
      return;

    console.log('Iniciando contador');
    console.log('Pedido: ',this.pedido);

    let diffInSeconds:  number = 0;
    let minutesLeft: number = 0;
    let tiempoDelPedido: number =  this.pedido.tiempoEstimado;
    let fechaAceptado = this.pedido.fechaDePedidoAceptado.toDate();
    let now = new Date();


    let minAtuales = fechaAceptado.getMinutes();
    let minASumar = minAtuales + tiempoDelPedido;

    if(minASumar > 60){
      fechaAceptado.setHours(fechaAceptado.getHours() + 1);
      minASumar -= 60;
    }

    let horaLlegada = new Date(fechaAceptado);
    horaLlegada.setMinutes(minASumar);



    diffInSeconds = Math.floor((horaLlegada.getTime() - now.getTime()) / 1000);

    if (diffInSeconds <= 0) {
      //clearInterval(this.intervalId);
      this.minutosFaltantes = "00";
    } else {
      minutesLeft = Math.floor(diffInSeconds / 60);
      this.minutosFaltantes = `${minutesLeft < 10 ? '0'+ minutesLeft : minutesLeft}`;
    }

    setInterval(() => {
       now = new Date();
      diffInSeconds = Math.floor((horaLlegada.getTime() - now.getTime()) / 1000);
      if (diffInSeconds <= 0) {
        //clearInterval(this.intervalId);
        this.minutosFaltantes = "00";
      } else {
        minutesLeft = Math.floor(diffInSeconds / 60);
        this.minutosFaltantes = `${minutesLeft < 10 ? '0'+ minutesLeft : minutesLeft}`;
      }
    }, 10000);
  }

  ionViewDidEnter() {
    if(this.pedido.fechaDePedidoAceptado){
      this.iniciarContador();
    }
  }

  volver() {
    this.router.navigate(['/home-tabs/menu-productos']);
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


}
