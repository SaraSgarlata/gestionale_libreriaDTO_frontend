import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const router = inject(Router);

  let reqDaInviare = req;
  if (token) {
    reqDaInviare = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(reqDaInviare).pipe(
    catchError(errore => {
  if ((errore.status === 401 || errore.status === 403) && !authService.getToken()) {
    router.navigate(['/login']);
  } else if (errore.status === 401) {
    // 401 è quasi sempre un problema di autenticazione reale
    authService.removeToken();
    router.navigate(['/login']);
  }
  return throwError(() => errore);
})
  );
};