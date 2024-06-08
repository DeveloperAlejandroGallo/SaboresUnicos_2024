import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';



@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [NavBarComponent],
  exports: [NavBarComponent]
})
export class NavBarModule { }
