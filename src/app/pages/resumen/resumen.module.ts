import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResumenPageRoutingModule } from './resumen-routing.module';

import { ResumenPage } from './resumen.page';
import { FechaToStringPipe } from 'src/app/pipes/fecha-to-string.pipe';
import { MonedaPesosPipe } from "../../pipes/moneda-pesos.pipe";

import { HeaderModule } from 'src/app/components/header/header.module';

@NgModule({
    declarations: [ResumenPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ResumenPageRoutingModule,
        FechaToStringPipe,
        MonedaPesosPipe,
        HeaderModule
    ]
})
export class ResumenPageModule {}
