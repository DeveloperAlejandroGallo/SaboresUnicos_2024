import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncuestasGraficoPageRoutingModule } from './encuestas-grafico-routing.module';

import { EncuestasGraficoPage } from './encuestas-grafico.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EncuestasGraficoPageRoutingModule,
    HeaderModule,
    NgxChartsModule
  ],
  declarations: [EncuestasGraficoPage]
})
export class EncuestasGraficoPageModule {}
