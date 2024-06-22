import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ListaEncuestasComponent } from './lista-encuestas.component';



@NgModule({
  imports: [ CommonModule, FormsModule , IonicModule],
  declarations: [ListaEncuestasComponent],
  exports: [ListaEncuestasComponent]
})
export class ListaEncuestasModule { }
