import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SplashAnimadoPage } from './splash-animado.page';

const routes: Routes = [
  {
    path: '',
    component: SplashAnimadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SplashAnimadoPageRoutingModule {}
