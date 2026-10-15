import { Routes } from '@angular/router';
import { ADMIN_PANEL_ROUTE_PATH } from './admin-path';
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

const pricingRedirectRoutes = (): Routes =>
  SUPPORTED_LOCALES.map(({ code, prefix }) => ({
    path: `${prefix ? prefix.replace(/^\//, '') + '/' : ''}pricing`,
    redirectTo: routePath(PAGE_ROUTES.credits[code as Locale]),
    pathMatch: 'full' as const
  }));

const uninstallRoutes = (): Routes =>
  SUPPORTED_LOCALES.map(({ code, prefix }) => ({
    path: `${prefix ? prefix.replace(/^\//, '') + '/' : ''}uninstall`,
    loadComponent: () => import('./pages/uninstall.component').then(m => m.UninstallComponent),
    data: { locale: code }
  }));

export const routes: Routes = [
  ...pricingRedirectRoutes(),
  { path: 'qr-login/:sessionId', loadComponent: () => import('./pages/qr-login.component').then(m => m.QrLoginComponent), data: { locale: 'en' } },
  { path: 'pl/qr-login/:sessionId', loadComponent: () => import('./pages/qr-login.component').then(m => m.QrLoginComponent), data: { locale: 'pl' } },
  ...uninstallRoutes(),
  { path: 'odinstalowano', redirectTo: 'uninstall', pathMatch: 'full' },
  { path: 'pl/odinstalowano', redirectTo: 'pl/uninstall', pathMatch: 'full' },
  ...localizedRoutes('home', () => import('./pages/home.component').then(m => m.HomeComponent)),
  ...localizedRoutes('dashboard', () => import('./pages/dashboard.component').then(m => m.DashboardComponent)),
  { path: ADMIN_PANEL_ROUTE_PATH, loadComponent: () => import('./pages/admin.component').then(m => m.AdminComponent), data: { locale: 'en' } },
  { path: `pl/${ADMIN_PANEL_ROUTE_PATH}`, loadComponent: () => import('./pages/admin.component').then(m => m.AdminComponent), data: { locale: 'pl' } },
  ...localizedRoutes('credits', () => import('./pages/credits.component').then(m => m.CreditsComponent)),
  ...localizedRoutes('quiz', () => import('./pages/quiz.component').then(m => m.QuizComponent)),
  ...localizedRoutes('demo', () => import('./pages/demo.component').then(m => m.DemoComponent)),
  ...sharedQuizRoutes(),
  ...localizedRoutes('privacy', () => import('./pages/privacy.component').then(m => m.PrivacyComponent)),
  ...localizedRoutes('cookies', () => import('./pages/cookies.component').then(m => m.CookiesComponent)),
  ...localizedRoutes('terms', () => import('./pages/terms.component').then(m => m.TermsComponent)),
  ...localizedRoutes('contact', () => import('./pages/contact.component').then(m => m.ContactComponent)),
  ...localizedRoutes('complaints', () => import('./pages/complaints.component').then(m => m.ComplaintsComponent)),
  { path: 'reklamacje', loadComponent: () => import('./pages/complaints.component').then(m => m.ComplaintsComponent), data: { locale: 'pl' } },
  { path: 'pl/reklamacje', loadComponent: () => import('./pages/complaints.component').then(m => m.ComplaintsComponent), data: { locale: 'pl' } },
  { path: 'procedura-reklamacyjna', loadComponent: () => import('./pages/complaints.component').then(m => m.ComplaintsComponent), data: { locale: 'pl' } },
  { path: 'pl/procedura-reklamacyjna', loadComponent: () => import('./pages/complaints.component').then(m => m.ComplaintsComponent), data: { locale: 'pl' } },
  ...localizedRoutes('blog', () => import('./pages/blog-list.component').then(m => m.BlogListComponent)),
  ...localizedRoutes('blogCategory', () => import('./pages/blog-list.component').then(m => m.BlogListComponent)),
  ...localizedRoutes('blogPost', () => import('./pages/blog-post.component').then(m => m.BlogPostComponent)),
  ...localizedRoutes('success', () => import('./pages/status-pages.component').then(m => m.StatusPageComponent), { pageKey: 'success' }),
  ...localizedRoutes('notFound', () => import('./pages/status-pages.component').then(m => m.StatusPageComponent), { pageKey: 'notFound' }),
  ...localizedRoutes('mobileInstall', () => import('./pages/mobile-install.component').then(m => m.MobileInstallComponent)),
  ...PLATFORM_PAGE_KEYS.flatMap((pageKey) =>
    localizedRoutes(pageKey, () => import('./pages/platform.component').then(m => m.PlatformComponent), { pageKey })
  ),
  { path: '**', loadComponent: () => import('./pages/status-pages.component').then(m => m.StatusPageComponent), data: { locale: 'en', pageKey: 'notFound' } }
];
