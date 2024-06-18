import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { NavBarModule } from 'src/app/components/nav-bar/nav-bar.module';
import { ListUsrPendientesPageModule } from '../list-usr-pendientes/list-usr-pendientes.module';







@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    NavBarModule,
    HomePageRoutingModule,
    ListUsrPendientesPageModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
