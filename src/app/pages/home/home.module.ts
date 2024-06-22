import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { NavBarModule } from 'src/app/components/nav-bar/nav-bar.module';
import { HeaderModule } from 'src/app/components/header/header.module';
import { ListUsuariosModule } from 'src/app/components/list-usuarios/list-usuarios.module';
import { HomeMaitrePageModule } from 'src/app/pages/home-maitre/home-maitre.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    NavBarModule,
    HeaderModule,
    HomePageRoutingModule,
    ListUsuariosModule,
    HomeMaitrePageModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
