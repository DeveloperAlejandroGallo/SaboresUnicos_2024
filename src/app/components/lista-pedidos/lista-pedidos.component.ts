import { Component, OnInit } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import { EstadoPedido } from 'src/app/enums/estado-pedido';
import { Pedido } from 'src/app/models/pedido';
import { PedidoService } from 'src/app/services/pedido.service';
import { formatDate } from '@angular/common';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { TipoProducto } from 'src/app/enums/tipo-producto';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/models/usuario';
import { MensajesService } from 'src/app/services/mensajes.service';

@Component({
  selector: 'app-lista-pedidos',
  templateUrl: './lista-pedidos.component.html',
  styleUrls: ['./lista-pedidos.component.scss'],
})
export class ListaPedidosComponent  implements OnInit {

  estadoPedido: EstadoPedido = EstadoPedido.Pendiente;
  opcionSeleccionada = 'Todos';
  estaEnPreparacion = false;
  pedidosPendientes : Pedido[] = [];
  pedidosListos : Pedido[] = [];
  todosLosPedidos : Pedido [] = [];
  desactivados: { [key: string]: boolean } = {};
  mozoActual!:Usuario;
  isLoadingList = true;
  isLoadingPush = false;
  
  constructor(private msgService: MensajesService,private auth: AuthService,private pedidosSvc : PedidoService, private pushNotif : PushNotificationService) { 
    console.log(auth.usuarioActual);
    this.mozoActual = this.auth.usuarioActual!;
  }

  ngOnInit() {
    this.pedidosSvc.allPedidos$.subscribe(data=>{
      this.todosLosPedidos = data;
      console.log(this.todosLosPedidos);
      
      this.pedidosPendientes = data.filter(pedido => pedido.estadoPedido == EstadoPedido.Pendiente);
      console.log(this.pedidosPendientes);
      
      this.pedidosListos = data.filter(pedido => pedido.estadoPedido == EstadoPedido.Listo);
      console.log(this.pedidosListos);
    });
    setTimeout(() => {
      this.isLoadingList = false;
    }, 1000);
  }

  cambiarVista(event:any){
    console.log(event?.target.value);
    this.opcionSeleccionada = event.detail.value
  }

  confirmarPedido(pedido : Pedido){
    this.isLoadingPush = true;
    this.pedidosSvc.actualizarEstado(pedido,EstadoPedido.Aceptado);
    this.pedidosSvc.actualizarMozo(pedido, this.auth.usuarioActual!);
    this.pedidosSvc.actualizarFechaAceptado(pedido);
    this.pushNotif.ClienteMozoAceptoPedido(pedido.cliente, this.mozoActual.nombre + ' ' + this.mozoActual.apellido).subscribe({
      next: (data) => {
        console.log("Rta Push Notificacion Mozo: ");
        console.log(data);
      },
      error: (error) => {
        console.error("Error Push Notificacion Mozo: ");
        console.error(error);
      }
    });
    pedido.productos.forEach(prod=>{
      switch(prod.producto.tipo){
        case TipoProducto.Comida:
          this.pushNotif.CocinerosPedido(prod.producto, TipoProducto.Comida).subscribe( {
            next: (data) => {
              console.log("Rta Push Notificacion Mozo: ");
              console.log(data);
            },
            error: (error) => {
              console.error("Error Push Notificacion Mozo: ");
              console.error(error);
            }
          });
          break;
        case TipoProducto.Bebida:
          this.pushNotif.BartendersPedido(prod.producto).subscribe( {
            next: (data) => {
              console.log("Rta Push Notificacion Mozo: ");
              console.log(data);
            },
            error: (error) => {
              console.error("Error Push Notificacion Mozo: ");
              console.error(error);
            }
          });
          break;
        case TipoProducto.Postre:
          this.pushNotif.CocinerosPedido(prod.producto, TipoProducto.Postre).subscribe( {
            next: (data) => {
              console.log("Rta Push Notificacion Mozo: ");
              console.log(data);
            },
            error: (error) => {
              console.error("Error Push Notificacion Mozo: ");
              console.error(error);
            }
          });
          break;
        default: 
          console.log("error no se encontro el tipo de comida");
          this.msgService.Error("No se encontro el tipo de comida");
          break;
      }
    });
    setTimeout(() => {
      this.isLoadingPush = false;
      this.msgService.Info("Pedido confirmado y derivado a sus respectivos sectores.");
    }, 1000);
  }
  isItemDisabled(pedidoId: string): boolean {
    return this.desactivados[pedidoId] === true;
  }

  formatearFecha(timestamp: Timestamp): string {
    const fecha = new Date(timestamp.seconds * 1000);
    return formatDate(fecha, 'HH:mm dd/MM', 'en-US');
  }
  getItemOptionText(pedido: Pedido): string {
    switch (pedido.estadoPedido) {
      case EstadoPedido.Pendiente:
        return 'ACEPTAR';
      case EstadoPedido.Aceptado:
        return 'Preparar';
      case EstadoPedido.EnPreparacion:
        return 'Listo';
      case EstadoPedido.Listo:
        return 'Entregar';
      case EstadoPedido.Entregado:
        return 'Confirmar';
      case EstadoPedido.Confirmado:
        return 'Pagar';
      case EstadoPedido.Pagado:
        return 'CONFIRMAR PAGO';
      default:
        return 'Acción';
    }
  }
  getItemOptionIcon(pedido: Pedido): string {
    switch (pedido.estadoPedido) {
      case EstadoPedido.Pendiente:
        return 'checkmark-circle';
      case EstadoPedido.Aceptado:
        return 'fast-food';
      case EstadoPedido.EnPreparacion:
        return 'pizza';
      case EstadoPedido.Listo:
        return 'checkmark-done';
      case EstadoPedido.Entregado:
        return 'person-circle';
      case EstadoPedido.Confirmado:
        return 'cash';
      case EstadoPedido.Pagado:
        return 'bag-check';
      default:
        return 'alert';
    }
  }
  getPedidoStyle(pedido: Pedido) {
    switch (pedido.estadoPedido) {
      case EstadoPedido.Abierto:
        return { '--background': '#bcbcbc' };
      case EstadoPedido.Pendiente:
        return { '--background': '#e4e361' };
      case EstadoPedido.Aceptado:
        return { '--background': '#f9b36e' };
      case EstadoPedido.EnPreparacion:
        return { '--background': '#f9b36e' };
      case EstadoPedido.Listo:
        return { '--background': '#ccffcc' };
      case EstadoPedido.Entregado:
        return { '--background': '#d1ffd6' };
      case EstadoPedido.Confirmado:
        return { '--background': '#b6fcd5' };
      case EstadoPedido.Pagado:
        return { '--background': '#d1e7dd' };
      case EstadoPedido.Cerrado:
        return { '--background': '#e2e3e5' };
      default:
        return {};
    }
  }
  handleAction(pedido: Pedido) {
    // Implementa la acción que deseas realizar con el pedido
    // pedido.estadoPedido = EstadoPedido.Aceptado;
    this.confirmarPedido(pedido);
    console.log('Action for:', pedido);
  }
}
