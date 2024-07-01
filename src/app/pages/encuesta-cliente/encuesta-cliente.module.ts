import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncuestaClientePageRoutingModule } from './encuesta-cliente-routing.module';

import { EncuestaClientePage } from './encuesta-cliente.page';


import { NavBarModule } from 'src/app/components/nav-bar/nav-bar.module';
import { HeaderModule } from 'src/app/components/header/header.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EncuestaClientePageRoutingModule,
    NavBarModule,
    HeaderModule,
    ReactiveFormsModule,
  ],
  declarations: [EncuestaClientePage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class EncuestaClientePageModule {}
