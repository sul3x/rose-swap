import { Routes } from '@angular/router';
import {redirectLoggedInTo, redirectUnauthorizedTo, canActivate } from "@angular/fire/auth-guard";

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['']);

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/private/tabs/tabs.routes').then((m) => m.routes),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/public/login/login.page').then( m => m.LoginPage),
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/public/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'myaccount',
    loadComponent: () => import('./pages/private/myaccount/myaccount.page').then( m => m.MyaccountPage)
  },
];
