import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'catalogo',
        loadComponent: () => import('./pages/catalog/catalog.page').then((m) => m.CatalogPage),
      },
      {
        path: 'resenas',
        loadComponent: () => import('./pages/reviews/reviews.page').then((m) => m.ReviewsPage),
      },
      {
        path: 'perfil',
        loadComponent: () => import('./pages/profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: 'info',
        loadComponent: () => import('./pages/info/info.page').then((m) => m.InfoPage),
      },
      {
        path: '',
        redirectTo: 'catalogo',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'animal/:id',
    loadComponent: () => import('./pages/animal-detail/animal-detail.page').then((m) => m.AnimalDetailPage),
  },
  {
    path: 'animal/:id/adoptar',
    loadComponent: () => import('./pages/adoption-form/adoption-form.page').then((m) => m.AdoptionFormPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/auth/register.page').then((m) => m.RegisterPage),
  },
  {
    path: '',
    redirectTo: 'tabs/catalogo',
    pathMatch: 'full',
  },
];
