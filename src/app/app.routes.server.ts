import { RenderMode, ServerRoute } from '@angular/ssr';
import { PAGE_ROUTES, SUPPORTED_LOCALES } from './site-content';

const routePath = (path: string): string => path.replace(/^\/+/, '').replace(/\/+$/, '');

const sharedQuizRoutes: ServerRoute[] = SUPPORTED_LOCALES.map(({ code }) => ({
  path: `${routePath(PAGE_ROUTES.quiz[code])}/shared/:token`,
  renderMode: RenderMode.Server
}));

const blogPostRoutes: ServerRoute[] = SUPPORTED_LOCALES.map(({ code }) => ({
  path: routePath(PAGE_ROUTES.blogPost[code]),
  renderMode: RenderMode.Server
}));

export const serverRoutes: ServerRoute[] = [
  ...sharedQuizRoutes,
  ...blogPostRoutes,
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
