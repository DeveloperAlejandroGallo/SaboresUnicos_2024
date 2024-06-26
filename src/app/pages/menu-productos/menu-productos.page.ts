import { Component, OnInit, ViewChild  } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Producto } from 'src/app/models/producto';
import { IonModal } from '@ionic/angular';
import { TipoProducto } from 'src/app/enums/tipo-producto';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { ProductoService } from 'src/app/services/producto.service';

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
  cantidadProducto: number = 0;
  public usuario!: Usuario;
  public listaDeProductos: Array<Producto> = new Array<Producto>;
  public listaDeTipoComida: Array<Producto> = new Array<Producto>;
  public listaDeTipoBebida: Array<Producto> = new Array<Producto>;
  public listaDeTipoPostre: Array<Producto> = new Array<Producto>;

  

  constructor(private modalController: ModalController, private auth: AuthService, private productoService: ProductoService) {
    
    this.productoService.allUsers$.subscribe((productos) => {

      this.listaDeProductos = productos
      console.log(this.listaDeProductos);

      this.listaDeTipoComida = productos.filter(x => x.tipo == 'Comida')
      console.log(this.listaDeTipoComida);

      this.listaDeTipoBebida = productos.filter(x => x.tipo == 'Bebida')
      console.log(this.listaDeTipoBebida);

      this.listaDeTipoPostre = productos.filter(x => x.tipo == 'Postre')
      console.log(this.listaDeTipoPostre);
    });

    this.usuario = this.auth.usuarioActual!;
   }

  ngOnInit() {}

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


  incrementarCantidad() {
    this.cantidadProducto++;
  }

  decrementarCantidad() {
    if (this.cantidadProducto > 0) {
      this.cantidadProducto--;
    }
  }

}
