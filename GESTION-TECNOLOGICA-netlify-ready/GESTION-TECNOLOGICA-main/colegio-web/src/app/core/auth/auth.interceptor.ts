import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

/**
 * Añade el JWT emitido por Cognito a cada request hacia API Gateway.
 * No aplica en modo mock (useMockData = true), ya que no hay red real.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (environment.useMockData) {
    return next(req);
  }

  const idToken = localStorage.getItem('colegio_id_token');
  if (!idToken) {
    return next(req);
  }

  return next(req.clone({ setHeaders: { Authorization: `Bearer ${idToken}` } }));
};
