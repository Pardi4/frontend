import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const siteUrl = 'https://getquizsolver.com';
const contentLastmod = process.env.SITEMAP_LASTMOD || '2026-06-27';
const posts = JSON.parse(fs.readFileSync(path.join(root, 'src', 'app', 'blog-posts.json'), 'utf8'));
const categories = [...new Set(posts.map(post => post.category).filter(Boolean))];

const locales = [
  { code: 'en', prefix: '', htmlLang: 'en' },
  { code: 'pl', prefix: '/pl', htmlLang: 'pl' },
  { code: 'de', prefix: '/de', htmlLang: 'de' },
  { code: 'es', prefix: '/es', htmlLang: 'es' },
  { code: 'fr', prefix: '/fr', htmlLang: 'fr' },
  { code: 'it', prefix: '/it', htmlLang: 'it' },
  { code: 'uk', prefix: '/uk', htmlLang: 'uk' }
];

const slugs = {
  home: '',
  credits: 'credits',
  quiz: 'quiz',
  demo: 'demo',
  quizSolverAi: 'quiz-solver-ai',
  testportal: 'testportal-quiz-solver',
  moodle: 'moodle-quiz-solver',
  canvas: 'canvas-quiz-solver',
  googleForms: 'google-forms-quiz-solver',
  microsoftForms: 'microsoft-forms-quiz-solver',
  blackboard: 'blackboard-quiz-solver',
  quizlet: 'quizlet-solver',
  socrative: 'socrative-quiz-solver',
  kahoot: 'kahoot-ai-bot',
  quizizz: 'quizizz-solver',
  privacy: 'privacy',
  blog: 'blog'
};

const indexedPageKeys = Object.keys(slugs);

function routeFor(slug, locale) {
  if (!slug) return locale.code === 'en' ? '/' : locale.prefix;
  return `${locale.prefix}/${slug}`.replace(/\/+/g, '/');
}

function blogRoute(post) {
  const locale = locales.find(item => item.code === post.locale) || locales[0];
  return `${locale.prefix}/blog/${post.slug}`.replace(/\/+/g, '/');
}

function blogCategoryRoute(category, locale) {
  return `${locale.prefix}/blog/category/${category}`.replace(/\/+/g, '/');
}

function categoryHasPosts(category, locale) {
  return posts.some(post => post.category === category && post.locale === locale.code);
}

function categoryLocales(category) {
  return locales.filter(locale => categoryHasPosts(category, locale));
}

function priority(route) {
  if (route === '/' || /^\/(pl|de|es|fr|it|uk)$/.test(route)) return '1.0';
  if (route.includes('kahoot-ai-bot') || route.includes('quiz-solver-ai') || route.includes('testportal-quiz-solver') || route.includes('google-forms-quiz-solver')) return '0.9';
  if (route.includes('/blog/category/')) return '0.75';
  if (route.includes('/blog/')) return '0.7';
  if (route.includes('privacy')) return '0.4';
  return '0.8';
}

function xmlEscape(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function pageUrl(pageKey, locale) {
  const route = routeFor(slugs[pageKey], locale);
  const alternates = locales
    .map(item => `    <xhtml:link rel="alternate" hreflang="${item.htmlLang}" href="${siteUrl}${routeFor(slugs[pageKey], item) === '/' ? '/' : routeFor(slugs[pageKey], item)}"/>`)
    .join('\n');
  return [
    '  <url>',
    `    <loc>${siteUrl}${route === '/' ? '/' : route}</loc>`,
    alternates,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}${routeFor(slugs[pageKey], locales[0]) === '/' ? '/' : routeFor(slugs[pageKey], locales[0])}"/>`,
    `    <lastmod>${contentLastmod}</lastmod>`,
    `    <changefreq>${pageKey === 'privacy' ? 'yearly' : pageKey === 'blog' ? 'weekly' : 'monthly'}</changefreq>`,
    `    <priority>${priority(route)}</priority>`,
    '  </url>'
  ].join('\n');
}

function blogUrl(post) {
  const route = blogRoute(post);
  const alternates = posts
    .filter(candidate => candidate.translationKey === post.translationKey)
    .map(candidate => {
      const locale = locales.find(item => item.code === candidate.locale);
      return locale ? `    <xhtml:link rel="alternate" hreflang="${locale.htmlLang}" href="${siteUrl}${blogRoute(candidate)}"/>` : '';
    })
    .filter(Boolean)
    .join('\n');
  const defaultPost = posts.find(candidate => candidate.translationKey === post.translationKey && candidate.locale === 'en') || post;
  return [
    '  <url>',
    `    <loc>${xmlEscape(`${siteUrl}${route}`)}</loc>`,
    alternates,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(`${siteUrl}${blogRoute(defaultPost)}`)}"/>`,
    `    <lastmod>${xmlEscape(post.dateModified || post.datePublished)}</lastmod>`,
    '    <changefreq>weekly</changefreq>',
    `    <priority>${priority(route)}</priority>`,
    '  </url>'
  ].join('\n');
}

function categoryUrl(category, locale) {
  const route = blogCategoryRoute(category, locale);
  const alternatesForCategory = categoryLocales(category);
  const defaultLocale = alternatesForCategory.find(item => item.code === 'en') || alternatesForCategory[0] || locale;
  const newestPost = posts
    .filter(post => post.category === category && post.locale === locale.code)
    .sort((a, b) => String(b.dateModified || b.datePublished).localeCompare(String(a.dateModified || a.datePublished)))[0];
  const alternates = alternatesForCategory
    .map(item => `    <xhtml:link rel="alternate" hreflang="${item.htmlLang}" href="${xmlEscape(`${siteUrl}${blogCategoryRoute(category, item)}`)}"/>`)
    .join('\n');
  return [
    '  <url>',
    `    <loc>${xmlEscape(`${siteUrl}${route}`)}</loc>`,
    alternates,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(`${siteUrl}${blogCategoryRoute(category, defaultLocale)}`)}"/>`,
    `    <lastmod>${xmlEscape(newestPost?.dateModified || newestPost?.datePublished || contentLastmod)}</lastmod>`,
    '    <changefreq>weekly</changefreq>',
    `    <priority>${priority(route)}</priority>`,
    '  </url>'
  ].join('\n');
}

const urls = [
  ...indexedPageKeys.flatMap(pageKey => locales.map(locale => pageUrl(pageKey, locale))),
  ...categories.flatMap(category => categoryLocales(category).map(locale => categoryUrl(category, locale))),
  ...posts.map(blogUrl)
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;

fs.writeFileSync(path.join(root, 'public', 'sitemap.xml'), sitemap, 'utf8');
