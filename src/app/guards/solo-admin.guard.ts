import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MensajesService } from '../services/mensajes.service';
import { inject } from '@angular/core';

export const soloAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const mensajes = inject(MensajesService);

  if (authService.usuarioActual?.esAdmin) {
    return true;
  }

    // Redirect to the login page
    mensajes.ErrorIonToast('Solo los administradores pueden acceder a esta página');
    // return router.navigate(['/login']);
    return false;
};
