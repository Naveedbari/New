import { Routes } from '@angular/router';
import { authGuard, loginGuard, welcomeGuard } from './core/guards';

export const routes: Routes = [
  { path: '', redirectTo: 'tabs/home', pathMatch: 'full' },
  {
    path: 'welcome',
    canActivate: [welcomeGuard],
    loadComponent: () => import('./pages/welcome/welcome.page').then((m) => m.WelcomePage),
  },
  {
    path: 'login',
    canActivate: [loginGuard],
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'tabs',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'tournaments',
        loadComponent: () => import('./pages/tournaments/tournaments.page').then((m) => m.TournamentsPage),
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.page').then((m) => m.SettingsPage),
      },
      {
        path: 'teams',
        loadComponent: () => import('./pages/teams/teams.page').then((m) => m.TeamsPage),
      },
    ],
  },
  {
    path: 'tournaments/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/tournament-form/tournament-form.page').then((m) => m.TournamentFormPage),
  },
  {
    path: 'tournaments/start',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/tournament-new/tournament-new.page').then((m) => m.TournamentNewPage),
  },
  {
    path: 'tournaments/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/tournament-form/tournament-form.page').then((m) => m.TournamentFormPage),
  },
  {
    path: 'tournaments/:id/matches/:matchId/toss',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/toss/toss.page').then((m) => m.TossPage),
  },
  {
    path: 'tournaments/:id/fixtures',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/fixtures/fixtures.page').then((m) => m.FixturesPage),
  },
  {
    path: 'tournaments/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/tournament-detail/tournament-detail.page').then((m) => m.TournamentDetailPage),
  },
  {
    path: 'teams/new',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/team-form/team-form.page').then((m) => m.TeamFormPage),
  },
  {
    path: 'teams/:id/edit',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/team-form/team-form.page').then((m) => m.TeamFormPage),
  },
  {
    path: 'teams/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/team-detail/team-detail.page').then((m) => m.TeamDetailPage),
  },
  { path: '**', redirectTo: 'tabs/home' },
];
