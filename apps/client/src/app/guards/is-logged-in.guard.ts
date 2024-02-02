import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const isLoggedIn: CanActivateFn = () => {
  console.log('isLoggedIn');
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.user$.pipe(
    map((user) => (user ? true : router.parseUrl('/')))
  );
};

export const isLoggoutOut: CanActivateFn = () => {
  console.log('isLoggoutOut');
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.user$.pipe(
    map((user) => (user ? router.parseUrl('/secure') : true))
  );
};
