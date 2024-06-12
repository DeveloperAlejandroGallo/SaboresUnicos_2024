import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AltaPersonaPage } from './alta-persona.page';

const routes: Routes = [
  {
    path: '',
    component: AltaPersonaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AltaPersonaPageRoutingModule {}
