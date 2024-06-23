import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuProductosPageRoutingModule } from './menu-productos-routing.module';

import { MenuProductosPage } from './menu-productos.page';
import { ListaProductosModule } from 'src/app/components/lista-productos/lista-productos.module';
import { NavBarModule } from 'src/app/components/nav-bar/nav-bar.module';
import { HeaderModule } from 'src/app/components/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuProductosPageRoutingModule,
    ListaProductosModule,
    NavBarModule,
    HeaderModule
  ],
  declarations: [MenuProductosPage]
})
export class MenuProductosPageModule {}
