import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { ADMIN_PANEL_URL } from './app/admin-path';
import { BLOG_POSTS } from './app/blog-content';
import { PAGE_SLUGS, SUPPORTED_LOCALES, pageData } from './app/site-content';
import type { Locale, PageKey } from './app/site-content';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

const privateNoindexPaths = ['/dashboard', '/success', '/404', '/admin', ADMIN_PANEL_URL];
const publicQueryParamsToDrop = ['auth', 'error', 'q'];
const legacyAdminPaths = ['/admin', '/admin/', '/admin.html', '/admin-app.js'];
const ogSlugToPageKey = new Map<string, PageKey>(
  Object.entries(PAGE_SLUGS)
    .filter(([, slug]) => !slug.includes(':'))
    .map(([pageKey, slug]) => [slug || 'home', pageKey as PageKey])
);

function normalizeOgLocale(value: string): Locale {
  return (SUPPORTED_LOCALES.some(locale => locale.code === value) ? value : 'en') as Locale;
}

function svgEscape(value: string): string {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function titleFromSlug(slug: string): string {
  return slug
    .replace(/^(blog|category)-/, '')
    .split('-')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function wrapSvgTitle(title: string): string {
  const words = title.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > 31 && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
    if (lines.length === 3) break;
  }
  if (line && lines.length < 3) lines.push(line);
  return lines
    .slice(0, 3)
    .map((item, index) => `<tspan x="76" dy="${index === 0 ? 0 : 72}">${svgEscape(item)}</tspan>`)
    .join('');
}

function resolveOgTitle(locale: Locale, slug: string): { eyebrow: string; title: string; description: string } {
  if (slug.startsWith('blog-')) {
    const postSlug = slug.slice('blog-'.length);
    const post = BLOG_POSTS.find(item => item.slug === postSlug && item.locale === locale)
      || BLOG_POSTS.find(item => item.slug === postSlug);
    return {
      eyebrow: 'QuizSolver Blog',
      title: post?.title || titleFromSlug(postSlug),
      description: post?.excerpt || 'AI quiz guides, platform tutorials and study workflows.'
    };
  }

  if (slug.startsWith('category-')) {
    return {
      eyebrow: 'QuizSolver Guides',
      title: `${titleFromSlug(slug)} guides`,
      description: 'Platform tutorials, AI quiz workflows and responsible study tips.'
    };
  }

  const pageKey = ogSlugToPageKey.get(slug) || 'home';
  const data = pageData(pageKey, locale) || pageData(pageKey, 'en') || {};
  return {
    eyebrow: data.shortName || data.badge || 'QuizSolver',
    title: data.meta?.title || data.title || 'QuizSolver AI Quiz Solver',
    description: data.meta?.description || data.subtitle || 'AI quiz solver Chrome extension for Testportal, Moodle, Kahoot, Canvas, Google Forms and more.'
  };
}

function isLegacyAdminPath(pathname: string): boolean {
  const cleanPath = pathname.replace(/\/+$/, '') || '/';
  return cleanPath === '/admin' || cleanPath === '/admin.html' || cleanPath === '/admin-app.js';
}

function isAdminPanelPath(pathname: string): boolean {
  const cleanPath = pathname.replace(/\/+$/, '') || '/';
  return cleanPath === ADMIN_PANEL_URL ||
    new RegExp(`^/[a-z]{2}${ADMIN_PANEL_URL}$`).test(cleanPath);
}

function shouldSkipPathCleanup(req: express.Request): boolean {
  return req.path === '/api'
    || req.path.startsWith('/api/')
    || req.path === '/extension-auth/callback'
    || isLegacyAdminPath(req.path)
    || isAdminPanelPath(req.path)
    || /\.[a-z0-9]{2,8}$/i.test(req.path);
}

function cleanPublicPageUrl(req: express.Request): string {
  const queryIndex = req.originalUrl.indexOf('?');
  const pathPart = queryIndex === -1 ? req.originalUrl : req.originalUrl.slice(0, queryIndex);
  const queryPart = queryIndex === -1 ? '' : req.originalUrl.slice(queryIndex + 1);
  const cleanPath = pathPart.length > 1 ? pathPart.replace(/\/+$/, '') || '/' : pathPart;
  const params = new URLSearchParams(queryPart);
  const preserveAuthError = params.has('auth') && params.has('error');

  if (preserveAuthError && !params.has('q') && cleanPath === pathPart) {
    return req.originalUrl;
  }

  (preserveAuthError ? ['q'] : publicQueryParamsToDrop).forEach(param => params.delete(param));
  const cleanQuery = params.toString();

  return `${cleanPath}${cleanQuery ? `?${cleanQuery}` : ''}`;
}

app.get('/og/:locale/:slug', (req, res, next) => {
  if (!req.params.slug.endsWith('.svg')) return next();

  const locale = normalizeOgLocale(req.params.locale);
  const slug = req.params.slug.replace(/\.svg$/, '');
  const og = resolveOgTitle(locale, slug);
  const title = wrapSvgTitle(og.title);
  const description = svgEscape(og.description.length > 150 ? `${og.description.slice(0, 147)}...` : og.description);
  const eyebrow = svgEscape(og.eyebrow);

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${svgEscape(og.title)}">
  <defs>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7c5cfc"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
    <radialGradient id="glow" cx="70%" cy="15%" r="65%">
      <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.34"/>
      <stop offset="70%" stop-color="#030712" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#030712"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="48" y="48" width="1104" height="534" rx="34" fill="#101827" stroke="#293347" stroke-width="2"/>
  <rect x="76" y="82" width="58" height="58" rx="16" fill="url(#brand)"/>
  <text x="105" y="120" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#ffffff">QS</text>
  <text x="156" y="112" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="800" fill="#dbeafe">QuizSolver</text>
  <text x="76" y="198" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="800" fill="#38bdf8">${eyebrow}</text>
  <text x="76" y="292" font-family="Arial, Helvetica, sans-serif" font-size="62" font-weight="900" fill="#ffffff">${title}</text>
  <text x="76" y="528" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="600" fill="#b6c4d8">${description}</text>
  <text x="1018" y="528" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="800" fill="#8be9ff">getquizsolver.com</text>
</svg>`;

  res
    .status(200)
    .type('image/svg+xml')
    .setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800');
  res.send(svg);
});

app.get(legacyAdminPaths, (_req, res) => {
  res
    .status(404)
    .setHeader('X-Robots-Tag', 'noindex, nofollow');
  res
    .type('html')
    .send('<!doctype html><html><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>Not found</title></head><body>Not found</body></html>');
});

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  if (shouldSkipPathCleanup(req)) return next();

  const cleanUrl = cleanPublicPageUrl(req);
  if (cleanUrl !== req.originalUrl) {
    return res.redirect(301, cleanUrl);
  }
  return next();
});

app.use((req, res, next) => {
  const isNoindex = privateNoindexPaths.some(p => req.path === p || req.path.match(new RegExp(`^/[a-z]{2}${p}`)));
  if (isNoindex) {
    res.setHeader('X-Robots-Tag', isAdminPanelPath(req.path) ? 'noindex, nofollow' : 'noindex, follow');
  }
  next();
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server only when this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
