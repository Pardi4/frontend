import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import {
  CHROME_WEB_STORE_URL,
  Locale,
  PageKey,
  SITE_URL,
  SUPPORTED_LOCALES,
  abs,
  contentFor,
  localeOption,
  pageData,
  pathFor,
  platformEntries
} from './site-content';

/* ─── Per-locale keyword sets ───────────────────────────────────────────────── */
const LOCALE_KEYWORDS: Record<Locale, string> = {
  en: 'quiz solver, AI quiz solver, chrome extension quiz, testportal solver, moodle quiz solver, google forms solver, kahoot bot, quizizz solver, quiz answer helper, online quiz AI',
  pl: 'quiz solver, rozwiązywanie quizów AI, testportal rozwiązywanie, moodle quiz solver, google forms pomoc, rozszerzenie chrome do quizów, kahoot bot, quizizz solver, pomoc w quizach, AI do testów',
  de: 'Quiz-Solver, KI Quiz Löser, Chrome-Erweiterung Quiz, Testportal Löser, Moodle Quiz Hilfe, Google Forms Solver, Kahoot Bot, Quizizz Solver, Quiz Antworten KI, Online-Quiz Hilfe',
  es: 'solucionador de quiz, AI quiz solver, extensión chrome quiz, testportal solver, moodle quiz solver, google forms solver, kahoot bot, quizizz solver, ayuda quiz online, respuestas quiz IA',
  fr: 'solveur de quiz, IA quiz solver, extension chrome quiz, testportal solver, moodle quiz solver, google forms solver, kahoot bot, quizizz solver, aide quiz en ligne, réponses quiz IA',
  it: 'risolutore quiz, AI quiz solver, estensione chrome quiz, testportal solver, moodle quiz solver, google forms solver, kahoot bot, quizizz solver, aiuto quiz online, risposte quiz IA',
  uk: 'розв\'язувач квізів, AI quiz solver, розширення chrome квіз, testportal solver, moodle quiz solver, google forms solver, kahoot bot, quizizz solver, допомога в квізах, відповіді квіз AI'
};

/* ─── Noindex pages ──────────────────────────────────────────────────────────── */
const NOINDEX_PAGES = new Set<PageKey>(['dashboard', 'success', 'notFound']);

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private readonly title: Title,
    private readonly meta: Meta,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  applyPage(pageKey: PageKey, locale: Locale, options: { robots?: string; status404?: boolean } = {}): void {
    const copy = contentFor(locale);
    const data = pageData(pageKey, locale);
    const meta = this.resolveMeta(pageKey, locale, data);
    const canonicalPath = pathFor(pageKey, locale);
    const canonical = abs(canonicalPath);
    const robots = options.robots || (NOINDEX_PAGES.has(pageKey) ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    const locOpt = localeOption(locale);

    /* ── HTML lang ── */
    this.document.documentElement.lang = copy['htmlLang'] || locale;

    /* ── Core ── */
    this.title.setTitle(meta.title);
    this.upsertMeta('name', 'description', meta.description);
    this.upsertMeta('name', 'robots', robots);
    this.upsertMeta('name', 'author', 'QuizSolver');
    this.upsertMeta('name', 'theme-color', '#030712');
    this.upsertMeta('name', 'application-name', 'QuizSolver');
    this.upsertMeta('name', 'keywords', LOCALE_KEYWORDS[locale] || LOCALE_KEYWORDS.en);
    this.upsertMeta('name', 'rating', 'general');

    /* ── Open Graph ── */
    this.upsertMeta('property', 'og:type', (pageKey === 'home' || pageKey === 'credits') ? 'website' : 'article');
    this.upsertMeta('property', 'og:site_name', 'QuizSolver');
    this.upsertMeta('property', 'og:url', canonical);
    this.upsertMeta('property', 'og:title', meta.title);
    this.upsertMeta('property', 'og:description', meta.description);
    this.upsertMeta('property', 'og:image', abs('/og-image.png'));
    this.upsertMeta('property', 'og:image:type', 'image/png');
    this.upsertMeta('property', 'og:image:width', '1200');
    this.upsertMeta('property', 'og:image:height', '630');
    this.upsertMeta('property', 'og:image:alt', 'QuizSolver AI quiz solver Chrome extension — answer any quiz instantly');
    this.upsertMeta('property', 'og:locale', locOpt.ogLocale);

    /* All OG locale alternates — use data attribute for unique selection */
    SUPPORTED_LOCALES
      .filter(opt => opt.code !== locale)
      .forEach(opt => {
        const selector = `[property="og:locale:alternate"][data-loc="${opt.code}"]`;
        const existing = this.document.head.querySelector(selector);
        if (existing) {
          existing.setAttribute('content', opt.ogLocale);
        } else {
          const el = this.document.createElement('meta');
          el.setAttribute('property', 'og:locale:alternate');
          el.setAttribute('content', opt.ogLocale);
          el.setAttribute('data-loc', opt.code);
          this.document.head.appendChild(el);
        }
      });

    /* ── Twitter / X ── */
    this.upsertMeta('name', 'twitter:card', 'summary_large_image');
    this.upsertMeta('name', 'twitter:site', '@getquizsolver');
    this.upsertMeta('name', 'twitter:creator', '@getquizsolver');
    this.upsertMeta('name', 'twitter:title', meta.title);
    this.upsertMeta('name', 'twitter:description', meta.description);
    this.upsertMeta('name', 'twitter:image', abs('/og-image.png'));
    this.upsertMeta('name', 'twitter:image:alt', 'QuizSolver AI quiz solver Chrome extension');

    /* ── Canonical + hreflang ── */
    this.upsertLink('canonical', canonical);
    SUPPORTED_LOCALES.forEach(opt => this.upsertAlternate(opt.htmlLang, abs(pathFor(pageKey, opt.code))));
    this.upsertAlternate('x-default', abs(pathFor(pageKey, 'en')));

    /* ── JSON-LD ── */
    this.upsertJsonLd(this.buildJsonLd(pageKey, locale, data, meta, canonical));
  }

  /* ──────────────────────────────────────────────────────────────────────────── */
  private resolveMeta(pageKey: PageKey, locale: Locale, data: any): { title: string; description: string } {
    data = data || {};
    if (data?.meta?.title && data?.meta?.description) return data.meta;
    if (['privacy', 'dashboard', 'credits', 'quiz', 'demo', 'success', 'notFound'].includes(pageKey)) {
      return { title: data.metaTitle || data.title || 'QuizSolver', description: data.metaDescription || '' };
    }
    const copy = contentFor(locale);
    return {
      title: `${data?.title || copy['common']?.brand || 'QuizSolver'} | QuizSolver`,
      description: data?.subtitle || copy['footer']?.description || 'QuizSolver AI quiz solver Chrome extension.'
    };
  }

  /* ──────────────────────────────────────────────────────────────────────────── */
  private buildJsonLd(pageKey: PageKey, locale: Locale, data: any, meta: { title: string; description: string }, canonical: string): unknown {
    const homeUrl = `${SITE_URL}/`;
    const locOpt = localeOption(locale);

    const graph: any[] = [
      /* Organization */
      {
        '@type': 'Organization',
        '@id': `${homeUrl}#organization`,
        name: 'QuizSolver',
        url: homeUrl,
        logo: {
          '@type': 'ImageObject',
          url: abs('/logo-512.png'),
          width: 512,
          height: 512
        },
        sameAs: [CHROME_WEB_STORE_URL],
        contactPoint: {
          '@type': 'ContactPoint',
          url: abs('/privacy#contact'),
          contactType: 'customer support',
          availableLanguage: SUPPORTED_LOCALES.map(opt => opt.label)
        }
      },
      /* SoftwareApplication */
      {
        '@type': 'SoftwareApplication',
        '@id': `${homeUrl}#software`,
        name: 'QuizSolver',
        alternateName: 'Quiz Solver Pro',
        applicationCategory: 'BrowserApplication',
        applicationSubCategory: 'EducationApplication',
        operatingSystem: 'Chrome, Chromium, Edge',
        url: homeUrl,
        downloadUrl: CHROME_WEB_STORE_URL,
        installUrl: CHROME_WEB_STORE_URL,
        sameAs: [CHROME_WEB_STORE_URL],
        inLanguage: SUPPORTED_LOCALES.map(opt => opt.htmlLang),
        description: meta.description,
        screenshot: abs('/og-image.png'),
        creator: { '@id': `${homeUrl}#organization` },
        featureList: [
          'AI quiz answer suggestions',
          'Answer explanations',
          'Study Notes history',
          'Practice Mode',
          'FocusScan screenshot solver',
          'Kahoot Quiz ID answer bank',
          'Testportal, Moodle, Canvas, Google Forms, Microsoft Forms, Kahoot, Quizizz and more',
          'Optional site permissions and hint mode'
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '127',
          bestRating: '5',
          worstRating: '1'
        },
        offers: [
          { '@type': 'Offer', name: 'Free starter credits', price: '0', priceCurrency: 'USD' },
          { '@type': 'Offer', name: '100 credit top-up', price: '1.99', priceCurrency: 'USD' },
          { '@type': 'Offer', name: '500 credit top-up', price: '4.99', priceCurrency: 'USD' },
          { '@type': 'Offer', name: '2000 credit top-up', price: '9.99', priceCurrency: 'USD' }
        ]
      },
      /* WebSite */
      {
        '@type': 'WebSite',
        '@id': `${homeUrl}#website`,
        name: 'QuizSolver',
        url: homeUrl,
        publisher: { '@id': `${homeUrl}#organization` },
        inLanguage: SUPPORTED_LOCALES.map(opt => opt.htmlLang),
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      },
      /* WebPage */
      {
        '@type': pageKey === 'home' ? 'WebPage' : 'Article',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: meta.title,
        description: meta.description,
        headline: meta.title,
        isPartOf: { '@id': `${homeUrl}#website` },
        about: { '@id': `${homeUrl}#software` },
        inLanguage: locOpt.htmlLang,
        datePublished: '2026-05-01',
        dateModified: new Date().toISOString().split('T')[0],
        ...(pageKey !== 'home' && {
          author: { '@id': `${homeUrl}#organization` },
          publisher: { '@id': `${homeUrl}#organization` }
        })
      }
    ];

    /* BreadcrumbList — all non-home pages */
    if (pageKey !== 'home') {
      graph.push({
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'QuizSolver', item: homeUrl },
          { '@type': 'ListItem', position: 2, name: data?.shortName || data?.platformName || data?.title || meta.title, item: canonical }
        ]
      });
    }

    /* HowTo — pages with steps */
    if (Array.isArray(data?.steps) && data.steps.length) {
      graph.push({
        '@type': 'HowTo',
        '@id': `${canonical}#howto`,
        name: data.stepsTitle || data.title,
        description: data.subtitle,
        totalTime: 'PT2M',
        step: data.steps.map((step: string, index: number) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: `Step ${index + 1}`,
          text: step
        }))
      });
    }

    /* FAQPage — pages with faq */
    if (Array.isArray(data?.faq) && data.faq.length) {
      graph.push({
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: data.faq.map((item: any) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer
          }
        }))
      });
    }

    /* ItemList — home page: list of supported platforms */
    if (pageKey === 'home') {
      const platforms = platformEntries(locale);
      graph.push({
        '@type': 'ItemList',
        '@id': `${canonical}#platforms`,
        name: 'Supported quiz platforms',
        description: 'QuizSolver works with all major online quiz and learning management platforms.',
        numberOfItems: platforms.length,
        itemListElement: platforms.map((entry, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: entry.data?.platformName || entry.pageKey,
          url: abs(pathFor(entry.pageKey as PageKey, locale))
        }))
      });
    }

    /* Product — credits page */
    if (pageKey === 'credits') {
      graph.push({
        '@type': 'Product',
        '@id': `${canonical}#product`,
        name: 'QuizSolver AI Credits',
        description: 'Prepaid AI credits for solving quiz questions, getting explanations, and using study tools in the QuizSolver Chrome extension.',
        brand: { '@id': `${homeUrl}#organization` },
        url: canonical,
        image: abs('/og-image.png'),
        offers: [
          { '@type': 'Offer', name: 'Free starter credits', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
          { '@type': 'Offer', name: '100 AI credits', price: '1.99', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
          { '@type': 'Offer', name: '500 AI credits', price: '4.99', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
          { '@type': 'Offer', name: '2000 AI credits', price: '9.99', priceCurrency: 'USD', availability: 'https://schema.org/InStock' }
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '127',
          bestRating: '5',
          worstRating: '1'
        }
      });
    }

    return { '@context': 'https://schema.org', '@graph': graph };
  }

  /* ──────────────────────────────────────────────────────────────────────────── */
  private upsertMeta(attr: 'name' | 'property', key: string, content: string): void {
    this.meta.updateTag({ [attr]: key, content });
  }

  private removeAllMeta(attr: 'name' | 'property', key: string): void {
    const selector = `meta[${attr}="${key}"]`;
    this.document.head.querySelectorAll(selector).forEach(el => el.remove());
  }

  private appendMeta(attr: 'name' | 'property', key: string, content: string): void {
    const el = this.document.createElement('meta');
    el.setAttribute(attr, key);
    el.setAttribute('content', content);
    this.document.head.appendChild(el);
  }

  private upsertLink(rel: string, href: string): void {
    const selector = `link[rel="${rel}"]`;
    let link = this.document.head.querySelector<HTMLLinkElement>(selector);
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', rel);
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  private upsertAlternate(hreflang: string, href: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${hreflang}"]`);
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', hreflang);
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  private upsertJsonLd(payload: unknown): void {
    const existing = this.document.head.querySelector<HTMLScriptElement>('script[data-quizsolver-schema="main"]');
    if (existing) existing.remove();
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-quizsolver-schema', 'main');
    script.textContent = JSON.stringify(payload, null, 0).replace(/</g, '\\u003c');
    this.document.head.appendChild(script);
  }
}
