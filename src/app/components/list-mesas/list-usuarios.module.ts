import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ListMesasComponent } from './list-mesas.component';



@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [ListMesasComponent],
  exports: [ListMesasComponent]
})
export class ListMesasModule { }
