import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { ADMIN_PANEL_URL } from './app/admin-path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

const privateNoindexPaths = ['/dashboard', '/success', '/404', '/admin', ADMIN_PANEL_URL];
const publicQueryParamsToDrop = ['auth', 'error', 'q'];
const legacyAdminPaths = ['/admin', '/admin/', '/admin.html', '/admin-app.js'];

function isLegacyAdminPath(pathname: string): boolean {
  const cleanPath = pathname.replace(/\/+$/, '') || '/';
  return cleanPath === '/admin' || cleanPath === '/admin.html' || cleanPath === '/admin-app.js';
}

function isAdminPanelPath(pathname: string): boolean {
  const cleanPath = pathname.replace(/\/+$/, '') || '/';
  return cleanPath === ADMIN_PANEL_URL;
}

function shouldSkipPathCleanup(req: express.Request): boolean {
  return req.path === '/api'
    || req.path.startsWith('/api/')
    || req.path === '/extension-auth/callback'
    || isLegacyAdminPath(req.path)
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
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
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
