import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) { //se autenticato procede
    return true;
  }

  router.navigate(['/login']); //senno la navig verso la rotta protetta viene bloccata
  return false;
};