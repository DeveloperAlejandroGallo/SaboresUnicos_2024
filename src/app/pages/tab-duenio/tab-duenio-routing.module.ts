import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabDuenioPage } from './tab-duenio.page';

const routes: Routes = [
  {
    path: '',
    component: TabDuenioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabDuenioPageRoutingModule {}
