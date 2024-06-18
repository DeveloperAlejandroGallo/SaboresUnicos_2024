import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeMaitrePageRoutingModule } from './home-maitre-routing.module';

import { HomeMaitrePage } from './home-maitre.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeMaitrePageRoutingModule
  ],
  declarations: [HomeMaitrePage]
})
export class HomeMaitrePageModule {}
