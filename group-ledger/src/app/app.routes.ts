import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home.page').then(m => m.HomePage) },
  { path: 'g/:groupId', loadComponent: () => import('./pages/group.page').then(m => m.GroupPage) },
  { path: 'g/:groupId/m/:memberId', loadComponent: () => import('./pages/member.page').then(m => m.MemberPage) },
  { path: 'g/:groupId/money', loadComponent: () => import('./pages/money.page').then(m => m.MoneyPage) },
  { path: 'g/:groupId/event', loadComponent: () => import('./pages/event-new.page').then(m => m.EventNewPage) },
  { path: 'g/:groupId/e/:eventId', loadComponent: () => import('./pages/event.page').then(m => m.EventPage) },
  { path: 'g/:groupId/reports', loadComponent: () => import('./pages/reports.page').then(m => m.ReportsPage) },
  { path: 'g/:groupId/settings', loadComponent: () => import('./pages/settings.page').then(m => m.SettingsPage) },
  { path: '**', redirectTo: '' },
];
