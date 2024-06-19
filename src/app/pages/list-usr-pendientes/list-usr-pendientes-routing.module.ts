import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListUsrPendientesPage } from './list-usr-pendientes.page';

const routes: Routes = [
  {
    path: '',
    component: ListUsrPendientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListUsrPendientesPageRoutingModule {}
