import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeMaitrePageRoutingModule } from './home-maitre-routing.module';

import { HomeMaitrePage } from './home-maitre.page';
import { NavBarModule } from 'src/app/components/nav-bar/nav-bar.module';
import { HeaderModule } from 'src/app/components/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NavBarModule,
    HeaderModule,
    HomeMaitrePageRoutingModule
  ],
  declarations: [HomeMaitrePage]
})
export class HomeMaitrePageModule {}
