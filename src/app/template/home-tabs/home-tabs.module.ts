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
          {
            path: 'menu-productos',
            loadChildren: () => import('../../pages/menu-productos/menu-productos.module').then( m => m.MenuProductosPageModule)
          },
          {
            path: 'chat',
            loadChildren: () => import('../../pages/chat/chat.module').then( m => m.ChatPageModule)
          },
          {
            path: 'juegos',
            loadChildren: () => import('../../pages/juegos/juegos.module').then( m => m.JuegosPageModule)
          },
          {
            path: 'resumen',
            loadChildren: () => import('../../pages/resumen/resumen.module').then( m => m.ResumenPageModule)
          },
          {
            path: 'encuesta-cliente',
            loadChildren: () => import('../../pages/encuesta-cliente/encuesta-cliente.module').then( m => m.EncuestaClientePageModule)
          },
          {
            path: 'encuestas-grafico',
            loadChildren: () => import('../../pages/encuestas-grafico/encuestas-grafico.module').then( m => m.EncuestasGraficoPageModule)
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
