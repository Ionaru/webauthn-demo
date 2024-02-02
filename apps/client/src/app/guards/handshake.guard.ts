import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, of, tap } from 'rxjs';

let done = false;

export const handhake: CanActivateFn = () => {
  console.log('handhake');
  const authService = inject(AuthService);
  return done
    ? of(true)
    : authService.init$().pipe(
        tap(() => {
          console.log('handhake done');
          done = true;
        }),
        map(() => true)
      );
};
