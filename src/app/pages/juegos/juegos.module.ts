import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JuegosPageRoutingModule } from './juegos-routing.module';

import { JuegosPage } from './juegos.page';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { HeaderModule } from 'src/app/components/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JuegosPageRoutingModule,
    HeaderModule,
  ],
  declarations: [JuegosPage]
})
export class JuegosPageModule {}
