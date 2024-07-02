import { Component, OnInit, ViewChild  } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ItemLista, Producto } from 'src/app/models/producto';
import { IonModal } from '@ionic/angular';
import { TipoProducto } from 'src/app/enums/tipo-producto';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { ProductoService } from 'src/app/services/producto.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { Pedido } from 'src/app/models/pedido';
import { EstadoPedido, EstadoPedidoProducto } from 'src/app/enums/estado-pedido';
import { Router } from '@angular/router';
import { MensajesService } from 'src/app/services/mensajes.service';

@Component({
  selector: 'app-menu-productos',
  templateUrl: './menu-productos.page.html',
  styleUrls: ['./menu-productos.page.scss'],
})
export class MenuProductosPage implements OnInit {


  @ViewChild(IonModal) modal: IonModal | undefined;


  selectedCategory: string = 'comida';
  isModalOpen = false;
  selectedProduct: Producto | null = null;
  name: string | undefined;

  public usuario!: Usuario;
  public listaDeProductos: Array<Producto> = new Array<Producto>;
  public listaDeTipoComida: Array<ItemLista> = new Array<ItemLista>;
  public listaDeTipoBebida: Array<ItemLista> = new Array<ItemLista>;
  public listaDeTipoPostre: Array<ItemLista> = new Array<ItemLista>;
  public subtotal: number = 0;
  public buttonWidth: number = 190;
  public buttonHeight: number = 50;
  public verImporte: boolean = true;
  public pedido!: Pedido;
  private idPedido: string = '';
  public total: number = 0;




  constructor(
    private modalController: ModalController,
    private auth: AuthService,
    private productoService: ProductoService,
    private pedidoSrv: PedidoService,
    private router: Router,
    private msgSrv: MensajesService) {


    this.usuario = this.auth.usuarioActual!;

    this.pedido = this.pedidoSrv.listadoPedidos.find(
      x => x.cliente.id === this.auth.usuarioActual!.id
      && x.estadoPedido !== EstadoPedido.Cerrado)!;

    this.pedidoSrv.escucharPedidoId(this.pedido.id);

    console.log('Id Pedido: ',this.pedido.id);

    this.LlenarListasDeProductos();


    this.pedidoSrv.pedido$.subscribe(data => {
        this.pedido = data;
        this.subtotal = this.pedido.productos.length != 0 ? this.pedido.productos.reduce((acc, x) => acc + x.producto.precio * x.cantidad, 0) : 0;

      }
    )


   }

  private LlenarListasDeProductos() {
    this.productoService.allProductos$.subscribe((productos) => {

      this.listaDeProductos = productos;
      console.log(this.listaDeProductos);

      this.listaDeTipoComida = productos.filter(x => x.tipo == 'Comida').map(
        x => {
          return {
            producto: x,
            cantidad: 0
          };
        }

      );
      console.log(this.listaDeTipoComida);

      this.listaDeTipoBebida = productos.filter(x => x.tipo == 'Bebida').map(x => {
        return {
          producto: x,
          cantidad: 0
        };
      }
      );
      console.log(this.listaDeTipoBebida);

      this.listaDeTipoPostre = productos.filter(x => x.tipo == 'Postre').map(
        x => {
          return {
            producto: x,
            cantidad: 0
          };
        }
      );
      console.log(this.listaDeTipoPostre);
    });
  }

  ngOnInit() {
    var a =1;
  }

  //Menu:
  PedirCuenta() {

    }
  VerDetalle() {
    if(this.subtotal > 0)
      this.router.navigate(['home-tabs/resumen']);
    else
      this.msgSrv.Info("Debe elegir al menos un producto apra ver el detalle de cuenta.");
  }




  segmentChanged(event: any) {
    this.selectedCategory = event.detail.value;
  }

  openModal(producto: Producto) {
    this.selectedProduct = producto;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedProduct = null;
  }

  cancel() {
    this.modal?.dismiss(null, 'cerrar');
  }

  confirm() {
    this.modal?.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {

  }


  incrementarCantidad(item: ItemLista, queLista: string) {

    switch (queLista) {
      case 'Comida':
        this.listaDeTipoComida.find(x => x.producto.id === item.producto.id)!.cantidad++;
        break;
      case 'Bebida':
        this.listaDeTipoBebida.find(x => x.producto.id === item.producto.id)!.cantidad++;
        break;
      case 'Postre':
        this.listaDeTipoPostre.find(x => x.producto.id === item.producto.id)!.cantidad++;
        break;
    }


    let index = this.pedido.productos.findIndex(x => x.producto.id === item.producto.id);
    if(index == -1){
      this.pedido.productos.push({
        producto: item.producto,
        cantidad: 1,
        estadoProducto: EstadoPedidoProducto.Pendiente,
        empleadoId: ""
      });
    }else{
        this.pedido.productos[index].cantidad++;
    }

      if(this.pedido.tiempoEstimado < item.producto.tiempoPreparacionEnMinutos)
        this.pedido.tiempoEstimado = item.producto.tiempoPreparacionEnMinutos;

     this.pedidoSrv.actualizarProducto(this.pedido);
  }

  decrementarCantidad(item: ItemLista, queLista: string) {
    if (item.cantidad > 0) {

      switch (queLista) {
        case 'Comida':
          this.listaDeTipoComida.find(x => x.producto.id === item.producto.id)!.cantidad--;
          break;
        case 'Bebida':
          this.listaDeTipoBebida.find(x => x.producto.id === item.producto.id)!.cantidad--;
          break;
        case 'Postre':
          this.listaDeTipoPostre.find(x => x.producto.id === item.producto.id)!.cantidad--;
          break;
      }


      let index = this.pedido.productos.findIndex(x => x.producto.id === item.producto.id);

      this.pedido.productos[index].cantidad--;

      if(this.pedido.productos[index].cantidad === 0)
        this.pedido.productos.splice(index,1);

      //obtener el maximo tiempo de preparacion
      let max = 0;
      this.pedido.productos.forEach(x => {
        if(x.producto.tiempoPreparacionEnMinutos > max)
          max = x.producto.tiempoPreparacionEnMinutos;
        });

       this.pedidoSrv.actualizarProducto(this.pedido);

    }
  }

}
