import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListUsrPendientesPageRoutingModule } from './list-usr-pendientes-routing.module';
import { ListUsrPendientesPage } from './list-usr-pendientes.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListUsrPendientesPageRoutingModule
  ],
  declarations: [ListUsrPendientesPage],
  exports: [ListUsrPendientesPage]
})
export class ListUsrPendientesPageModule {}
