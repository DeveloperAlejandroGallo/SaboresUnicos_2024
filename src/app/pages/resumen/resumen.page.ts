import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { EstadoPedido } from 'src/app/enums/estado-pedido';
import { Pedido } from 'src/app/models/pedido';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { MensajesService } from 'src/app/services/mensajes.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { ProductoService } from 'src/app/services/producto.service';
import { PushNotificationService } from 'src/app/services/push-notification.service';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.page.html',
  styleUrls: ['./resumen.page.scss'],
})
export class ResumenPage {


  @Output() EnviarIsLoading = new EventEmitter<boolean>();

  public tarifaServicio: number = 100;
  public usuario: Usuario;
  public pedido: Pedido;
  public subtotal: number = 0;
  public total: number = 0;
  public estadoPedido: string = "Abierto";
  public colorEstado: string = "";
  public textoAccion: string = "";
  public botonDeshabilitado: boolean = false;
  public verAvisoPagoQR: boolean = false;
  public labelTiempo: string = "";
verCuentaRegresiva: any;
minutosRegresivos: any;



  constructor(
    private auth: AuthService,
    private productoService: ProductoService,
    private pedidoSrv: PedidoService,
    private router: Router,
    private msgSrv: MensajesService,
    private push: PushNotificationService) {



    this.usuario = this.auth.usuarioActual!;

    this.pedido = this.pedidoSrv.listadoPedidos.find(
      x => x.cliente.id === this.auth.usuarioActual!.id
      && x.estadoPedido !== EstadoPedido.Cerrado)!;

    this.pedidoSrv.escucharPedidoId(this.pedido.id);

    console.log('Id Pedido: ',this.pedido.id);

    this.SuscribirseAlPedido();


  }

  accionPedido() {
    this.EnviarIsLoading.emit(true);
    switch (this.pedido.estadoPedido) {
      case EstadoPedido.Abierto:
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
        this.pedidoSrv.actualizarEstado(this.pedido,EstadoPedido.Servido)
        .then(() => {
          this.msgSrv.ExitoToast('Esperamos que disfrutes de tu pedido!');
          this.botonDeshabilitado = true;
        })
        .catch(err => {
          console.error(err);
        });
        break;
      case EstadoPedido.Servido:
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
          this.pedidoSrv.actualizarEstado(this.pedido,EstadoPedido.Pagado)
          .then(() => {
            this.msgSrv.ExitoToast('Gracias por su visita!.\nEsperamos verte pronto!');
            this.botonDeshabilitado = false;
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
    this.pedidoSrv.pedido$.subscribe(data => {
      this.pedido = data;
      this.subtotal = data.productos.reduce((acc, x) => acc + x.producto.precio * x.cantidad, 0);
      this.total = this.subtotal + this.pedido.propina - (this.pedido.descuentoPorJuego * this.subtotal / 100) + this.tarifaServicio;

      this.botonDeshabilitado = false;
      this.verAvisoPagoQR = false;
      this.verCuentaRegresiva = false;

      switch (this.pedido.estadoPedido) {
        case EstadoPedido.Abierto:
          this.estadoPedido = "Abierto";
          this.colorEstado = "abierto";
          this.textoAccion = "Enviar Pedido";
          this.labelTiempo = `Espera de ${this.pedido.tiempoEstimado} min.`
          break;
        case EstadoPedido.Pendiente:
          this.estadoPedido = "Pendiente de aceptar por el mozo";
          this.colorEstado = "pendiente";
          this.textoAccion = "Pedido Enviado";
          this.botonDeshabilitado = true;
          this.labelTiempo = `Espera de ${this.pedido.tiempoEstimado} min.`
          break;
        case EstadoPedido.Aceptado:
          this.estadoPedido = "El Mozo aceptó su pedido.";
          this.colorEstado = "aceptado";
          this.textoAccion = "Pedido Enviado";
          this.botonDeshabilitado = true;
          break;
        case EstadoPedido.EnPreparacion:
          this.estadoPedido = "En preparación";
          this.colorEstado = "en-preparacion";
          this.textoAccion = "Pedido Enviado";
          this.botonDeshabilitado = true;
          this.verCuentaRegresiva = true;
          break;
        case EstadoPedido.Listo:
          this.estadoPedido = "Listo para entregar al cliente.";
          this.colorEstado = "listo";
          this.textoAccion = "Pedido Enviado";
          this.botonDeshabilitado = true;
          this.verCuentaRegresiva = true;
          break;
        case EstadoPedido.Servido:
          this.estadoPedido = "Recibido por el cliente.";
          this.colorEstado = "servido";
          this.textoAccion = "Solicitar Cuenta";
          this.verCuentaRegresiva = false;

          break;
        case EstadoPedido.CuentaSolicitada:
          this.estadoPedido = "Se solicito la cuenta al Mozo.";
          this.colorEstado = "cuenta-solicitada";
          this.textoAccion = "Pagar con Efvo. o Tarjeta";
          this.verAvisoPagoQR = true;
          break;
        case EstadoPedido.Pagado:
          this.estadoPedido = "Pagado.";
          this.colorEstado = "pagado";
          this.textoAccion = "Pagado";
          this.botonDeshabilitado = true;
          break;
        case EstadoPedido.Cerrado:
          this.estadoPedido = "Cerrado.";
          this.colorEstado = "cerrado";
          this.textoAccion = "Pagado";
          this.botonDeshabilitado = true;
          break;
      }



    }
    );
  }




  volver() {
    this.router.navigate(['/home-tabs/menu-productos']);
  }

}
