import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import { BLOG_POSTS } from './blog-content';
import { BLOG_CATEGORY_ORDER } from './blog-categories';
import { PAGE_ROUTES, SUPPORTED_LOCALES } from './site-content';

const routePath = (path: string): string => path.replace(/^\/+/, '').replace(/\/+$/, '');

const sharedQuizRoutes: ServerRoute[] = SUPPORTED_LOCALES.map(({ code }) => ({
  path: `${routePath(PAGE_ROUTES.quiz[code])}/shared/:token`,
  renderMode: RenderMode.Server
}));

const blogPostRoutes: ServerRoute[] = SUPPORTED_LOCALES.map(({ code }) => ({
  path: routePath(PAGE_ROUTES.blogPost[code]),
  renderMode: RenderMode.Prerender,
  fallback: PrerenderFallback.None,
  async getPrerenderParams() {
    return BLOG_POSTS
      .filter(post => post.locale === code)
      .map(post => ({ slug: post.slug }));
  }
}));

const blogCategoryRoutes: ServerRoute[] = SUPPORTED_LOCALES.map(({ code }) => ({
  path: routePath(PAGE_ROUTES.blogCategory[code]),
  renderMode: RenderMode.Prerender,
  fallback: PrerenderFallback.None,
  async getPrerenderParams() {
    return BLOG_CATEGORY_ORDER.map(category => ({ category }));
  }
}));

export const serverRoutes: ServerRoute[] = [
  ...sharedQuizRoutes,
  ...blogCategoryRoutes,
  ...blogPostRoutes,
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
