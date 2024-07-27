import { TabsPage } from './tabs.page';
import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadComponent: () =>
          import('../tab1/tab1.page').then((m) => m.Tab1Page),
        data: {title: 'My Garden'}
      },
      {
        path: 'tab2',
        loadComponent: () =>
          import('../tab2/tab2.page').then((m) => m.Tab2Page),
        data: {title: 'Other Gardens'}
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('../tab3/tab3.page').then((m) => m.Tab3Page),
        data: {title: 'About Me'}
      },
      {
        path: 'myaccount',
        loadComponent: () =>
          import('../myaccount/myaccount.page').then((m) => m.MyaccountPage),
        data: {title: 'My Account'}
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full',
  },
];
