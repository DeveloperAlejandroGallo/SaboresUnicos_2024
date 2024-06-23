import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuProductosPageRoutingModule } from './menu-productos-routing.module';

import { MenuProductosPage } from './menu-productos.page';
import { NavBarModule } from 'src/app/components/nav-bar/nav-bar.module';
import { HeaderModule } from 'src/app/components/header/header.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuProductosPageRoutingModule,
    NavBarModule,
    HeaderModule
  ],
  declarations: [MenuProductosPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MenuProductosPageModule {}
