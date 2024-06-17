import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PushNotificationPage } from './push-notification.page';

const routes: Routes = [
  {
    path: '',
    component: PushNotificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PushNotificationPageRoutingModule {}
