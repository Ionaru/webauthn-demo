import { Route } from '@angular/router';

import { HomePage } from './pages/home/home.page';
import { RegisterPage } from './pages/register/register.page';
import { SecurePage } from './pages/secure/secure.page';
import { isLoggedIn, isLoggoutOut } from './guards/is-logged-in.guard';
import { handhake } from './guards/handshake.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    canActivate: [handhake],
    children: [
      { path: '', component: HomePage, canActivate: [isLoggoutOut] },
      {
        path: 'register',
        component: RegisterPage,
        canActivate: [isLoggoutOut],
      },
      { path: 'secure', component: SecurePage, canActivate: [isLoggedIn] },
    ],
  },
];
