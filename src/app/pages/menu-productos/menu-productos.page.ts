import { Component, OnInit, ViewChild  } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Producto } from 'src/app/models/producto';
import { IonModal } from '@ionic/angular';
import { TipoProducto } from 'src/app/enums/tipo-producto';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';

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

  comida: Producto[] = [
    {
      id: '1',
      nombre: 'Pizza de muzzarela con tomates',
      fotos: ['../../../assets/img/fondo-gris.png', '../../../assets/img/fondoLogin.png', '../../../assets/img/fondoSplash.jpg'],
      precio: 10.99,
      tiempoPreparacionEnMinutos: 20,
      descripcion: 'Deliciosa pizza con ingredientes frescos.',
      tipo: TipoProducto.Comida
    },
    // Otros productos...
  ];

  bebidas: Producto[] = [
    {
      id: '4',
      nombre: 'Coca Cola',
      fotos: ['../../../assets/img/fondo-gris.png', '../../../assets/img/fondoLogin.png', '../../../assets/img/fondoSplash.jpg'],
      precio: 1.99,
      tiempoPreparacionEnMinutos: 2,
      descripcion: 'Refrescante bebida.',
      tipo: TipoProducto.Bebida
    },
    // Otros productos...
  ];

  postres: Producto[] = [
    {
      id: '5',
      nombre: 'Tarta de Manzana',
      fotos: ['../../../assets/img/fondo-gris.png', '../../../assets/img/fondoLogin.png', '../../../assets/img/fondoSplash.jpg'],
      precio: 3.99,
      tiempoPreparacionEnMinutos: 15,
      descripcion: 'Deliciosa tarta de manzana.',
      tipo: TipoProducto.Postre
    },
    // Otros productos...
  ];

  constructor(private modalController: ModalController, private auth: AuthService) {
    
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
