import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { EstaLogueadoGuard } from './guards/esta-logueado.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash-animado',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signup/:perfil',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'splash-animado',
    loadChildren: () => import('./pages/splash-animado/splash-animado.module').then( m => m.SplashAnimadoPageModule)
  },
  // {
  //   path: 'home',
  //   loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  // },
  {
    path: 'alta-persona',
    loadChildren: () => import('./pages/alta-persona/alta-persona.module').then( m => m.AltaPersonaPageModule),
    canActivate: [EstaLogueadoGuard]
  },
  {
    path: 'tab-duenio',
    loadChildren: () => import('./pages/tab-duenio/tab-duenio.module').then( m => m.TabDuenioPageModule),
    canActivate: [EstaLogueadoGuard]
  },
  {
    path: 'home-tabs',
    loadChildren: () => import('./template/home-tabs/home-tabs.module').then( m => m.HomeTabsPageModule),
    // canActivate: [EstaLogueadoGuard]
  },
  {
    path: 'mi-perfil',
    loadChildren: () => import('./pages/mi-perfil/mi-perfil.module').then( m => m.MiPerfilPageModule),
    canActivate: [EstaLogueadoGuard]

  },
  {
    path: 'home-maitre',
    loadChildren: () => import('./pages/home-maitre/home-maitre.module').then( m => m.HomeMaitrePageModule),
    canActivate: [EstaLogueadoGuard]
  },
  {
    path: 'menu-productos',
    loadChildren: () => import('./pages/menu-productos/menu-productos.module').then( m => m.MenuProductosPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'encuesta-cliente',
    loadChildren: () => import('./pages/encuesta-cliente/encuesta-cliente.module').then( m => m.EncuestaClientePageModule)
  },  {
    path: 'encuestas-grafico',
    loadChildren: () => import('./pages/encuestas-grafico/encuestas-grafico.module').then( m => m.EncuestasGraficoPageModule)
  },


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
