import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ListaPedidosComponent } from './lista-pedidos.component';
import { MonedaPesosPipe } from 'src/app/pipes/moneda-pesos.pipe';


@NgModule({
  imports: [ CommonModule, FormsModule , IonicModule,MonedaPesosPipe],
  declarations: [ListaPedidosComponent],
  exports: [ListaPedidosComponent]
})
export class ListaPedidosModule { }
