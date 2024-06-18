import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeMaitrePage } from './home-maitre.page';

const routes: Routes = [
  {
    path: '',
    component: HomeMaitrePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeMaitrePageRoutingModule {}
