import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuProductosPage } from './menu-productos.page';

const routes: Routes = [
  {
    path: '',
    component: MenuProductosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuProductosPageRoutingModule {}
