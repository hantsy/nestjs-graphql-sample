import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'posts',
    loadComponent: () =>
      import('./posts/post-list').then((m) => m.PostListComponent),
  },
  {
    path: 'posts/new',
    loadComponent: () =>
      import('./posts/post-create').then((m) => m.PostCreateComponent),
  },
  {
    path: 'posts/:id',
    loadComponent: () =>
      import('./posts/post-detail').then((m) => m.PostDetailComponent),
  },
  {
    path: 'posts/:id/edit',
    loadComponent: () =>
      import('./posts/post-edit').then((m) => m.PostEditComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
