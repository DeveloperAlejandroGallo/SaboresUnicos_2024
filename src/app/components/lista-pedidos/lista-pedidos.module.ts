import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ListaPedidosComponent } from './lista-pedidos.component';


@NgModule({
  imports: [ CommonModule, FormsModule , IonicModule],
  declarations: [ListaPedidosComponent],
  exports: [ListaPedidosComponent]
})
export class ListaPedidosModule { }
