import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ListUsuariosComponent } from './list-usuarios.component';



@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [ListUsuariosComponent],
  exports: [ListUsuariosComponent]
})
export class ListUsuariosModule { }
