import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResumenPage } from './resumen.page';

const routes: Routes = [
  {
    path: '',
    component: ResumenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResumenPageRoutingModule {}
