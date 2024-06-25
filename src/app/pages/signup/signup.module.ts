import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupPageRoutingModule } from './signup-routing.module';

import { SignupPage } from './signup.page';
import { NavBarModule } from 'src/app/components/nav-bar/nav-bar.module';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { HeaderModule } from 'src/app/components/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SignupPageRoutingModule,
    HeaderModule,
    NavBarModule
  ],
  declarations: [SignupPage, BarcodeScanningModalComponent]
})
export class SignupPageModule {}
