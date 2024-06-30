import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EstadoPedido } from 'src/app/enums/estado-pedido';
import { Pedido } from 'src/app/models/pedido';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.page.html',
  styleUrls: ['./resumen.page.scss'],
})
export class ResumenPage {
accionPedido(arg0: Pedido) {
throw new Error('Method not implemented.');
}

  public tarifaServicio: number = 100;
  public usuario: Usuario;
  public pedido: Pedido;
  public subtotal: number = 0;
  public total: number = 0;
  public estadoPedido: string = "Abierto";
  public colorEstado: string = "";
  public textoAccion: string = "";
  public botonDeshabilitado: boolean = false;

  constructor(
    private auth: AuthService,
    private productoService: ProductoService,
    private pedidoSrv: PedidoService,
    private router: Router) {


    this.usuario = this.auth.usuarioActual!;

    this.pedido = this.pedidoSrv.listadoPedidos.find(
      x => x.cliente.id === this.auth.usuarioActual!.id
      && x.estadoPedido !== EstadoPedido.Cerrado)!;

    this.pedidoSrv.escucharPedidoId(this.pedido.id);

    console.log('Id Pedido: ',this.pedido.id);

    this.pedidoSrv.pedido$.subscribe(data => {
        this.pedido = data;
        this.subtotal = data.productos.reduce((acc, x) => acc + x.producto.precio * x.cantidad, 0);
        this.total = this.subtotal + this.pedido.propina - (this.pedido.descuentoPorJuego * this.subtotal / 100) + this.tarifaServicio;

        this.botonDeshabilitado = false;
        switch(this.pedido.estadoPedido){
          case EstadoPedido.Abierto:
            this.estadoPedido = "Abierto";
            this.colorEstado = "abierto";
            this.textoAccion = "Enviar Pedido";
              break;
          case EstadoPedido.Pendiente:
            this.estadoPedido = "Pendiente de aceptar por el mozo";
            this.colorEstado = "pendiente";
            this.textoAccion = "Pedido Enviado";
            this.botonDeshabilitado = true;
            break;
          case EstadoPedido.EnPreparacion:
            this.estadoPedido = "En preparación";
            this.colorEstado = "en-preparacion";
            this.textoAccion = "Pedido Enviado";
            this.botonDeshabilitado = true;
            break;
          case EstadoPedido.Listo:
            this.estadoPedido = "Listo para entregar al cliente.";
            this.colorEstado = "listo";
            this.textoAccion = "Pedido Enviado";
            this.botonDeshabilitado = true;
            break;
          case EstadoPedido.Entregado:
            this.estadoPedido = "Entregado al cliente.";
            this.colorEstado = "entregado";
            this.textoAccion = "Confirmar Recepción";
            break;
          case EstadoPedido.Confirmado:
            this.estadoPedido = "Recibido por el cliente.";
            this.colorEstado = "confirmado";
            this.textoAccion = "Pagar";
            break;
          case EstadoPedido.Pagado:
            this.estadoPedido = "Pagado.";
            this.colorEstado = "pagado";
            this.textoAccion = "Cerrado";
            this.botonDeshabilitado = true;
              break;
          case EstadoPedido.Cerrado:
            this.estadoPedido = "Cerrado.";
            this.colorEstado = "cerrado";
            this.textoAccion = "Cerrado";
            this.botonDeshabilitado = true;
            break;
        }
      }
    )

  }


  volver() {
    throw new Error('Method not implemented.');
  }

}
