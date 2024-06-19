import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeTabsPageRoutingModule } from './home-tabs-routing.module';

import { HomeTabsPage } from './home-tabs.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeTabsPage,
        children: [
          {
            path: 'home',
            loadChildren: ()=> import('../../pages/home/home.module').then(m=>m.HomePageModule)
          },
          {
            path: 'login',
            loadChildren: ()=> import('../../pages/login/login.module').then(m=>m.LoginPageModule)
          },
          //path: otra pagina
          {
            path: '',
            redirectTo: 'home',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ])
  ],
  declarations: [HomeTabsPage]
})
export class HomeTabsPageModule {}
