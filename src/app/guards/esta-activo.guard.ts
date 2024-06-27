import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MensajesService } from '../services/mensajes.service';
import { inject } from '@angular/core';

export const estaActivoGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const mensajes = inject(MensajesService);

  if (authService.usuarioActual?.estado) {
    return true;
  }

  // Redirect to the login page
  mensajes.Error('El restoran debe aprobar su cuenta para acceder a esta página.\nPor favor, espere a que lo hagan.');
  return router.navigate(['/login']);
};
