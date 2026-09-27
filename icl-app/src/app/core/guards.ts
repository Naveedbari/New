import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Pages that need a logged-in user. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.loggedIn()) return true;
  return router.parseUrl(auth.hasAccount() ? '/login' : '/welcome');
};

/** First-run screen: only reachable before an account exists. */
export const welcomeGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.hasAccount()) return true;
  return router.parseUrl(auth.loggedIn() ? '/tabs/home' : '/login');
};

/** PIN screen: only reachable when an account exists and nobody is logged in. */
export const loginGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.hasAccount()) return router.parseUrl('/welcome');
  if (auth.loggedIn()) return router.parseUrl('/tabs/home');
  return true;
};
