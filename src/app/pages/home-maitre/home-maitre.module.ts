import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeMaitrePageRoutingModule } from './home-maitre-routing.module';

import { HomeMaitrePage } from './home-maitre.page';
import { NavBarModule } from 'src/app/components/nav-bar/nav-bar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NavBarModule,
    HomeMaitrePageRoutingModule
  ],
  declarations: [HomeMaitrePage]
})
export class HomeMaitrePageModule {}
