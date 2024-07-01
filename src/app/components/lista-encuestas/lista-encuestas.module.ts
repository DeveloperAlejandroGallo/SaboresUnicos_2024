import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ListaEncuestasComponent } from './lista-encuestas.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@NgModule({
  imports: [ CommonModule, FormsModule , IonicModule],
  declarations: [ListaEncuestasComponent],
  exports: [ListaEncuestasComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListaEncuestasModule { }
