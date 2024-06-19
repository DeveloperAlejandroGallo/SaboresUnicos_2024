import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

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
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'alta-persona',
    loadChildren: () => import('./pages/alta-persona/alta-persona.module').then( m => m.AltaPersonaPageModule)
  },  {
    path: 'list-usr-pendientes',
    loadChildren: () => import('./pages/list-usr-pendientes/list-usr-pendientes.module').then( m => m.ListUsrPendientesPageModule)
  },
  {
    path: 'tab-duenio',
    loadChildren: () => import('./pages/tab-duenio/tab-duenio.module').then( m => m.TabDuenioPageModule)
  },




];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
