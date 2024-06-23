import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ListaProductosComponent } from './lista-productos.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@NgModule({
  declarations:[ListaProductosComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [ListaProductosComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListaProductosModule { }
