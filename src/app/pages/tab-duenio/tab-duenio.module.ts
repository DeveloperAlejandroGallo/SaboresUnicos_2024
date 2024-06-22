import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabDuenioPageRoutingModule } from './tab-duenio-routing.module';

import { TabDuenioPage } from './tab-duenio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabDuenioPageRoutingModule
  ],
  declarations: [TabDuenioPage]
})
export class TabDuenioPageModule {}
