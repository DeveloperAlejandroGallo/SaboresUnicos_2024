import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeTabsPageRoutingModule } from './home-tabs-routing.module';

import { HomeTabsPage } from './home-tabs.page';
import { RouterModule } from '@angular/router';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';

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
            path: 'mi-perfil',
            loadChildren: ()=> import('../../pages/mi-perfil/mi-perfil.module').then(m=>m.MiPerfilPageModule)
          },
          {
            path: 'signup/:perfil',
            loadChildren: () => import('../../pages/signup/signup.module').then( m => m.SignupPageModule)
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
  declarations: [HomeTabsPage, BarcodeScanningModalComponent]
})
export class HomeTabsPageModule {}
