import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AltaPersonaPageRoutingModule } from './alta-persona-routing.module';

import { AltaPersonaPage } from './alta-persona.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AltaPersonaPageRoutingModule
  ],
  declarations: [AltaPersonaPage]
})
export class AltaPersonaPageModule {}
