import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Rol } from '../models/models';

/** Uso en rutas: canActivate: [authGuard, roleGuard(['admin'])] */
export function roleGuard(rolesPermitidos: Rol[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const rol = auth.rol();

    if (rol && rolesPermitidos.includes(rol)) {
      return true;
    }
    return router.createUrlTree(['/dashboard']);
  };
}
