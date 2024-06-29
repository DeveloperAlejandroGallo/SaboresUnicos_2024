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
  usuario: Usuario;
  pedido: Pedido;

  constructor(
    private auth: AuthService,
    private productoService: ProductoService,
    private pedidoSrv: PedidoService,
    private router: Router) {


    this.usuario = this.auth.usuarioActual!;

    this.pedido = this.pedidoSrv.listadoPedidos.find(
      x => x.cliente.id === this.auth.usuarioActual!.id
      && x.estadoPedido == EstadoPedido.Pendiente)!;

    this.pedidoSrv.escucharPedidoId(this.pedido.id);

    console.log('Id Pedido: ',this.pedido.id);

    this.pedidoSrv.pedido$.subscribe(data => {
        this.pedido = data;
      }
    )

  }

}
