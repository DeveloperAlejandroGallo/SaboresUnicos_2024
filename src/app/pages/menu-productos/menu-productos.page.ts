import { Component, OnInit, ViewChild  } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Producto } from 'src/app/models/productos';
import { IonModal } from '@ionic/angular';

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


  comida: Producto[] = [
    {
      id: '1',
      nombre: 'Pizza de muzzarela con tomates',
      imagenes: ['../../../assets/img/fondo-gris.png', '../../../assets/img/fondoLogin.png', '../../../assets/img/fondoSplash.jpg'],
      cantidad: 1,
      precio: 10.99,
      tiempo: 20,
      descripcion: 'Deliciosa pizza con ingredientes frescos.'
    },
    {
      id: '2',
      nombre: 'Pizza',
      imagenes: ['../../../assets/img/fondo-gris.png', '../../../assets/img/fondoLogin.png', '../../../assets/img/fondoSplash.jpg'],
      cantidad: 0,
      precio: 10.99,
      tiempo: 20,
      descripcion: 'Deliciosa pizza con ingredientes frescos.'
    },
     {
      id: '3',
      nombre: 'Pizza',
      imagenes: ['../../../assets/img/fondo-gris.png', '../../../assets/img/fondoLogin.png', '../../../assets/img/fondoSplash.jpg'],
      cantidad: 1,
      precio: 10.99,
      tiempo: 20,
      descripcion: 'Deliciosa pizza con ingredientes frescos.'
    }
    // Otros productos...
  ];

  bebidas: Producto[] = [
    {
      id: '4',
      nombre: 'Coca Cola',
      imagenes: ['../../../assets/img/fondo-gris.png', '../../../assets/img/fondoLogin.png', '../../../assets/img/fondoSplash.jpg'],
      cantidad: 1,
      precio: 1.99,
      tiempo: 2,
      descripcion: 'Refrescante bebida.'
    },
    // Otros productos...
  ];

  postres: Producto[] = [
    {
      id: '5',
      nombre: 'Tarta de Manzana',
      imagenes: ['../../../assets/img/fondo-gris.png', '../../../assets/img/fondoLogin.png', '../../../assets/img/fondoSplash.jpg'],
      cantidad: 1,
      precio: 3.99,
      tiempo: 15,
      descripcion: 'Deliciosa tarta de manzana.'
    },
    // Otros productos...
  ];

  constructor(private modalController: ModalController) { }

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


  incrementarCantidad(producto: any) {
    producto.cantidad++;
  }

  decrementarCantidad(producto: any) {
    if (producto.cantidad > 0) {
      producto.cantidad--;
    }
  }

}
