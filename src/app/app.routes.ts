import { Routes } from '@angular/router';
import { Locale, PAGE_ROUTES, PLATFORM_PAGE_KEYS, PageKey, SUPPORTED_LOCALES } from './site-content';

type Loader = Routes[number]['loadComponent'];

const routePath = (path: string): string => path.replace(/^\/+/, '').replace(/\/+$/, '');

const localizedRoutes = (pageKey: PageKey, loadComponent: Loader, extraData: Record<string, unknown> = {}): Routes =>
  SUPPORTED_LOCALES.map(({ code }) => ({
    path: routePath(PAGE_ROUTES[pageKey][code]),
    loadComponent,
    data: { locale: code, ...extraData }
  }));

const sharedQuizRoutes = (): Routes =>
  SUPPORTED_LOCALES.map(({ code }) => ({
    path: `${routePath(PAGE_ROUTES.quiz[code])}/shared/:token`,
    loadComponent: () => import('./pages/quiz.component').then(m => m.QuizComponent),
    data: { locale: code as Locale }
  }));

export const routes: Routes = [
  ...localizedRoutes('home', () => import('./pages/home.component').then(m => m.HomeComponent)),
  ...localizedRoutes('dashboard', () => import('./pages/dashboard.component').then(m => m.DashboardComponent)),
  { path: 'admin', loadComponent: () => import('./pages/admin.component').then(m => m.AdminComponent) },
  ...localizedRoutes('credits', () => import('./pages/credits.component').then(m => m.CreditsComponent)),
  ...localizedRoutes('quiz', () => import('./pages/quiz.component').then(m => m.QuizComponent)),
  ...localizedRoutes('demo', () => import('./pages/demo.component').then(m => m.DemoComponent)),
  ...sharedQuizRoutes(),
  ...localizedRoutes('privacy', () => import('./pages/privacy.component').then(m => m.PrivacyComponent)),
  ...localizedRoutes('blog', () => import('./pages/blog-list.component').then(m => m.BlogListComponent)),
  ...localizedRoutes('blogCategory', () => import('./pages/blog-list.component').then(m => m.BlogListComponent)),
  ...localizedRoutes('blogPost', () => import('./pages/blog-post.component').then(m => m.BlogPostComponent)),
  ...localizedRoutes('success', () => import('./pages/status-pages.component').then(m => m.StatusPageComponent), { pageKey: 'success' }),
  ...localizedRoutes('notFound', () => import('./pages/status-pages.component').then(m => m.StatusPageComponent), { pageKey: 'notFound' }),
  ...PLATFORM_PAGE_KEYS.flatMap((pageKey) =>
    localizedRoutes(pageKey, () => import('./pages/platform.component').then(m => m.PlatformComponent), { pageKey })
  ),
  { path: '**', loadComponent: () => import('./pages/status-pages.component').then(m => m.StatusPageComponent), data: { locale: 'en', pageKey: 'notFound' } }
];
