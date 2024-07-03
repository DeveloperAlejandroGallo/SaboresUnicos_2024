import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EncuestasGraficoPage } from './encuestas-grafico.page';

const routes: Routes = [
  {
    path: '',
    component: EncuestasGraficoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EncuestasGraficoPageRoutingModule {}
