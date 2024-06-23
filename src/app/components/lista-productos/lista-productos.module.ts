import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ListaProductosComponent } from './lista-productos.component';



@NgModule({
  declarations:[ListaProductosComponent],
  imports: [
    CommonModule
  ],
  exports: [ListaProductosComponent]
})
export class ListaProductosModule { }
