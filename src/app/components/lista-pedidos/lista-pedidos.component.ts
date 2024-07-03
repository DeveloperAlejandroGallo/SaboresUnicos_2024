import { Component, OnInit } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import { EstadoPedido, EstadoPedidoProducto } from 'src/app/enums/estado-pedido';
import { Pedido } from 'src/app/models/pedido';
import { PedidoService } from 'src/app/services/pedido.service';
import { formatDate } from '@angular/common';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { TipoProducto } from 'src/app/enums/tipo-producto';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/models/usuario';
import { MensajesService } from 'src/app/services/mensajes.service';
import { Producto } from 'src/app/models/producto';
import { TipoEmpleado } from 'src/app/enums/tipo-empleado';
import { Perfil } from 'src/app/enums/perfil';
import Swal from 'sweetalert2';
import { MesaService } from 'src/app/services/mesas.service';
import { EstadoMesa } from 'src/app/enums/estado-mesa';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-lista-pedidos',
  templateUrl: './lista-pedidos.component.html',
  styleUrls: ['./lista-pedidos.component.scss'],
})
export class ListaPedidosComponent implements OnInit {

  estadoPedido: EstadoPedido = EstadoPedido.Pendiente;
  opcionSeleccionada = 'Mis_pedidos';
  estaEnPreparacion = false;
  pedidosPendientes: Pedido[] = [];
  todosMisPedidos: Pedido[] = [];
  empleadoActual!: Usuario;
  isModalOpen = false;
  selectedPedidoProd: Producto[] = [];
  pedidoProductos: Array<{ producto: Producto, cantidad: number, estadoProducto:EstadoPedidoProducto, empleadoId:string}> = [];
  isLoadingList = true;
  isLoadingPush = false;
  productosPendientes: Array<{ producto: Producto, cantidad: number, estadoProducto:EstadoPedidoProducto, empleadoId:string, idPedido: string, mesaNumero:number}> = [];
  misPedidosProductos: Array<{ producto: Producto, cantidad: number, estadoProducto:EstadoPedidoProducto, empleadoId:string, idPedido: string, mesaNumero:number}> = [];

  constructor(private mesaSvc:MesaService, private msgService: MensajesService, private auth: AuthService, private pedidosSvc: PedidoService, private pushNotif: PushNotificationService,
    private usrSrv: UsuarioService
  ) {
    console.log(auth.usuarioActual);
    this.empleadoActual = this.auth.usuarioActual!;
  }

  ngOnInit() {
    this.pedidosSvc.allPedidos$.subscribe(data => {
      if(this.empleadoActual.tipoEmpleado == TipoEmpleado.Mozo){
        this.todosMisPedidos = data.filter(pedido=> pedido.mozo?.id == this.empleadoActual.id && pedido.estadoPedido != EstadoPedido.Cerrado);
        console.log(this.todosMisPedidos);

        this.pedidosPendientes = data.filter(pedido => pedido.estadoPedido == EstadoPedido.Pendiente && pedido.mozo == null);
        console.log(this.pedidosPendientes);
        if(this.pedidosPendientes.length>0){
          this.opcionSeleccionada = 'Pendientes';
        }
      }
      else if(this.empleadoActual.tipoEmpleado == TipoEmpleado.Cocinero || this.empleadoActual.tipoEmpleado == TipoEmpleado.Bartender){
        const tipoProducto = this.empleadoActual.tipoEmpleado == TipoEmpleado.Cocinero ? [TipoProducto.Comida, TipoProducto.Postre] : [TipoProducto.Bebida];
        this.productosPendientes = data.flatMap(pedido=>
          pedido.productos.filter(producto=>
            producto.estadoProducto == EstadoPedidoProducto.Pendiente && producto.empleadoId == ""
            && tipoProducto.includes(producto.producto.tipo)
          ).map(producto=>({
            ...producto,
            idPedido: pedido.id,
            mesaNumero: pedido.mesa.numero
          }))
        );

        this.misPedidosProductos = data.flatMap(pedido=>
          pedido.productos.filter(producto=>
            producto.empleadoId == this.empleadoActual.id &&
            (producto.estadoProducto == EstadoPedidoProducto.EnPreparacion)
            && tipoProducto.includes(producto.producto.tipo)
          ).map(producto =>({
            ...producto,
            idPedido: pedido.id,
            mesaNumero: pedido.mesa.numero
          }))
        );
        if(this.productosPendientes.length>0){
          this.opcionSeleccionada = 'Pendientes';
        }
      }
    });
    setTimeout(() => {

      this.isLoadingList = false;

    }, 1500);
  }


  cambiarVista(event: any) {
    this.opcionSeleccionada = event.detail.value
  }

  confirmarPedido(pedido: Pedido) {
    this.isLoadingPush = true;
    this.pedidosSvc.actualizarEstado(pedido, EstadoPedido.Aceptado);
    this.pedidosSvc.actualizarMozo(pedido, this.auth.usuarioActual!);
    this.pedidosSvc.actualizarFechaAceptado(pedido);
    this.pedidosSvc.actualizarEstadoProductoAPendiente(pedido);
    this.pushNotif.ClienteMozoAceptoPedido(pedido.cliente, this.empleadoActual.nombre + ' ' + this.empleadoActual.apellido).subscribe({
      next: (data) => {
        console.log("Rta Push Notificacion Mozo: ");
        console.log(data);
      },
      error: (error) => {
        console.error("Error Push Notificacion Mozo: ");
        console.error(error);
      }
    });
    pedido.productos.forEach(prod => {
      switch (prod.producto.tipo) {
        case TipoProducto.Comida:
          this.pushNotif.CocinerosPedido(prod.producto, TipoProducto.Comida).subscribe({
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
          this.pushNotif.BartendersPedido(prod.producto).subscribe({
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
          this.pushNotif.CocinerosPedido(prod.producto, TipoProducto.Postre).subscribe({
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

  openModal(productos: Array<{ producto: Producto, cantidad: number, estadoProducto:EstadoPedidoProducto,empleadoId: string }>) {
    // this.selectedPedidoProd = productos;
    this.pedidoProductos = productos;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.pedidoProductos = [];
  }


  formatearFecha(timestamp: Timestamp): string {
    const fecha = new Date(timestamp.seconds * 1000);
    return formatDate(fecha, 'HH:mm dd/MM', 'en-US');
  }
  getItemOptionText(pedido: Pedido): string {
    switch (pedido.estadoPedido) {
      case EstadoPedido.Pendiente:
        return 'ACEPTAR';
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
      case EstadoPedido.Pagado:
        return 'bag-check';
      default:
        return 'alert';
    }
  }
  getEstadoPedidoClass(pedido: Pedido) {
    switch (pedido.estadoPedido) {
      case EstadoPedido.Abierto:
        return 'abierto';
      case EstadoPedido.Pendiente:
        return 'pendiente';
      case EstadoPedido.Aceptado:
        return 'aceptado';
      case EstadoPedido.EnPreparacion:
        return 'en-preparacion';
      case EstadoPedido.Listo:
        return 'listo';
      case EstadoPedido.Servido:
        return 'servido';
      case EstadoPedido.CuentaSolicitada:
        return 'cuenta-solicitada';
      case EstadoPedido.Pagado:
        return 'pagado';
      case EstadoPedido.Cerrado:
        return 'cerrado';
      default:
        return '';
    }
  }
  getEstadoPedidoProductoClass(estadoProducto: EstadoPedidoProducto) {
    switch (estadoProducto) {
      case EstadoPedidoProducto.Pendiente:
        return 'pendiente';
      case EstadoPedidoProducto.EnPreparacion:
        return 'en-preparacion';
      case EstadoPedidoProducto.Listo:
        return 'listo';
      default:
        return '';
    }
  }

  accionPedido(pedido: Pedido) {
    console.log('Accion de:', pedido.estadoPedido);
    switch (pedido.estadoPedido) {
      case EstadoPedido.Pendiente:
        this.confirmarPedido(pedido);
        break;
      case EstadoPedido.Pagado:
        this.ConfirmarPagoPedido(pedido);
        break;
      default:
        console.log("Error en accion");
        break;
    }
  }

  accionProducto(producto: { producto: Producto, cantidad: number, estadoProducto:EstadoPedidoProducto, empleadoId:string, idPedido: string , mesaNumero:number}){
    const { mesaNumero, ...productoData } = producto;
    console.log(productoData);

    switch (producto.estadoProducto) {
      case EstadoPedidoProducto.Pendiente:
        this.prepararPedido(productoData);
        break;
      case EstadoPedidoProducto.EnPreparacion:
        this.terminarPedido(productoData);
        break;
      default:
        console.log("Error en accion");
        break;
    }

  }

  ConfirmarPagoPedido(pedido: Pedido){
    const background = 'rgb(255 255 255 / 91%)';
    Swal.fire({
      title: "¿Pedido pagado?",
      text: "Confirmas que este pedido se ha pagado.",
      icon: "warning",
      color: "#000000",
      showCancelButton: true,
      background: background,
      heightAuto: false,
      width: "20em",
      confirmButtonColor: "#0EA06F",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar Pago",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.pedidosSvc.actualizarEstado(pedido,EstadoPedido.Cerrado);
        this.mesaSvc.cambiarEstadoDeMesa(EstadoMesa.libre,pedido.mesa.id, "");
        this.usrSrv.asignarMesa(0, pedido.cliente.id);
        this.pushNotif.ClienteMozoPagoConfirmado(pedido.cliente,this.empleadoActual.nombre).subscribe({
          next: (data) => {
            console.log("Rta Push Notificacion Mozo: ");
            console.log(data);
          },
          error: (error) => {
            console.error("Error Push Notificacion Mozo: ");
            console.error(error);
          }
        });
        this.msgService.ExitoIonToast("Pago Confirmado.\nLa mesa ha sido liberada.",2);

      }
    });
  }
  terminarPedido(producto: { producto: Producto, cantidad: number, estadoProducto:EstadoPedidoProducto, empleadoId:string, idPedido: string }){
    this.isLoadingPush = true;
    producto.estadoProducto = EstadoPedidoProducto.Listo;
    this.pedidosSvc.actualizarPedido(producto).then(()=>{
      console.log("Se actualizo el producto del pedido");
      return this.pedidosSvc.traerPedidoXId(producto.idPedido);
    }).then((pedido)=>{
      if(pedido){
        this.verificarListo(pedido);
      }
      else{
        this.msgService.Error("Pedido no encontrado");
      }
    })
    .catch(error=>{
      this.msgService.Error("Error al actualizar producto");
    }).finally(()=>{
      this.isLoadingPush=false;
    });
  }

  prepararPedido(producto: { producto: Producto, cantidad: number, estadoProducto:EstadoPedidoProducto, empleadoId:string, idPedido: string }){
    this.isLoadingPush = true;
    producto.estadoProducto = EstadoPedidoProducto.EnPreparacion;
    producto.empleadoId = this.empleadoActual.id;
    this.pedidosSvc.actualizarPedido(producto).then(()=>{
      console.log("Se actualizo el producto del pedido");
      return this.pedidosSvc.traerPedidoXId(producto.idPedido);
    }).then((pedido)=>{
      if(pedido)
        this.pedidosSvc.actualizarEstado(pedido,EstadoPedido.EnPreparacion);
      else this.msgService.Error("Pedido no encontrado");
    })
    .catch(error=>{
      this.msgService.Error("Error al actualizar producto");
    }).finally(()=>{
      this.isLoadingPush=false;
    });
  }

  verificarListo(pedido: Pedido){
    const todosListos = pedido.productos.every(producto=>
      producto.estadoProducto == EstadoPedidoProducto.Listo
    );
    if(todosListos && pedido.mozo){
      this.pedidosSvc.actualizarEstado(pedido,EstadoPedido.Listo);
      this.pushNotif.MozoPedidoListo(pedido.mozo,pedido.mesa.numero).subscribe({
        next: (data) => {
          console.log("Rta Push Notificacion Mozo: ");
          console.log(data);
        },
        error: (error) => {
          console.error("Error Push Notificacion Mozo: ");
          console.error(error);
        }
      });
    }

  }
}
