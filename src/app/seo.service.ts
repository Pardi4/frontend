import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { BlogPost, BLOG_POSTS } from './blog-content';
import { BlogCategoryCopy, BLOG_CATEGORY_ORDER, categoryFor, categoryLabel } from './blog-categories';
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

/* ─── Noindex pages ──────────────────────────────────────────────────────────── */
const NOINDEX_PAGES = new Set<PageKey>(['dashboard', 'success', 'notFound']);
const SEO_DATE = '2026-06-28';
const BASE_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const ASSET_VERSION = '20260628';
const assetUrl = (path: string) => `${abs(path)}?v=${ASSET_VERSION}`;
const ogImageUrl = (locale: Locale, slug: string) => abs(`/og/${locale}/${slug}.svg?v=${ASSET_VERSION}`);

const PLATFORM_PAGE_KEYS = [
  'quizSolverAi', 'testportal', 'moodle', 'canvas', 'googleForms',
  'microsoftForms', 'blackboard', 'quizlet', 'socrative', 'kahoot', 'quizizz'
];

const categoryHasPosts = (locale: Locale, slug: string): boolean =>
  BLOG_POSTS.some(post => post.locale === locale && post.category === slug);

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
    const robots = options.robots || (NOINDEX_PAGES.has(pageKey) ? 'noindex, follow' : BASE_ROBOTS);
    const locOpt = localeOption(locale);
    const keywords = this.keywordsFor(pageKey, locale, data);
    const routeParts = canonicalPath.split('/').filter(Boolean);
    const routeSlug = routeParts.length === 0 || (routeParts.length === 1 && routeParts[0] === locale)
      ? 'home'
      : routeParts[routeParts.length - 1] || 'home';
    const ogImage = ogImageUrl(locale, routeSlug.replace(/[^a-z0-9-]/gi, '-').toLowerCase());

    this.clearRouteSpecificMeta();

    /* ── HTML lang ── */
    this.document.documentElement.lang = copy['htmlLang'] || locale;

    /* ── Core ── */
    this.title.setTitle(meta.title);
    this.upsertMeta('name', 'description', meta.description);
    this.upsertMeta('name', 'robots', robots);
    this.upsertMeta('name', 'googlebot', robots);
    this.upsertMeta('name', 'bingbot', robots);
    this.upsertMeta('name', 'author', 'QuizSolver');
    this.upsertMeta('name', 'keywords', keywords);
    this.upsertMeta('name', 'theme-color', '#030712');
    this.upsertMeta('name', 'application-name', 'QuizSolver');
    this.upsertMeta('name', 'rating', 'general');

    /* ── Open Graph ── */
    const isPlatform = PLATFORM_PAGE_KEYS.includes(pageKey as any);
    this.upsertMeta('property', 'og:type', pageKey === 'credits' ? 'product' : isPlatform ? 'article' : 'website');
    this.upsertMeta('property', 'og:site_name', 'QuizSolver');
    this.upsertMeta('property', 'og:url', canonical);
    this.upsertMeta('property', 'og:title', meta.title);
    this.upsertMeta('property', 'og:description', meta.description);
    this.upsertMeta('property', 'og:image', ogImage);
    this.upsertMeta('property', 'og:image:type', 'image/svg+xml');
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
    this.upsertMeta('property', 'og:updated_time', SEO_DATE);
    this.setOgLocaleAlternates(SUPPORTED_LOCALES, locale);

    this.upsertMeta('name', 'twitter:card', 'summary_large_image');
    this.upsertMeta('name', 'twitter:site', '@getquizsolver');
    this.upsertMeta('name', 'twitter:creator', '@getquizsolver');
    this.upsertMeta('name', 'twitter:title', meta.title);
    this.upsertMeta('name', 'twitter:description', meta.description);
    this.upsertMeta('name', 'twitter:image', ogImage);
    this.upsertMeta('name', 'twitter:image:alt', 'QuizSolver AI quiz solver Chrome extension');

    /* ── Canonical + hreflang ── */
    this.upsertLink('canonical', canonical);
    SUPPORTED_LOCALES.forEach(opt => this.upsertAlternate(opt.htmlLang, abs(pathFor(pageKey, opt.code))));
    this.upsertAlternate('x-default', abs(pathFor(pageKey, 'en')));
    this.setHreflangAlternates(
      SUPPORTED_LOCALES.map(opt => ({ hreflang: opt.htmlLang, href: abs(pathFor(pageKey, opt.code)) })),
      abs(pathFor(pageKey, 'en'))
    );

    /* ── JSON-LD ── */
    this.upsertJsonLd(this.buildJsonLd(pageKey, locale, data, meta, canonical));
  }

  /* ──────────────────────────────────────────────────────────────────────────── */
  private resolveMeta(pageKey: PageKey, locale: Locale, data: any): { title: string; description: string } {
    data = data || {};
    if (data?.meta?.title && data?.meta?.description) return data.meta;
    if (['privacy', 'dashboard', 'credits', 'quiz', 'demo', 'success', 'notFound', 'blog'].includes(pageKey)) {
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

    const webpageType = pageKey === 'credits'
      ? 'CollectionPage'
      : pageKey === 'blog'
        ? 'Blog'
        : pageKey === 'blogCategory'
          ? 'CollectionPage'
          : 'WebPage';

    const graph: any[] = [
      /* Organization */
      {
        '@type': 'Organization',
        '@id': `${homeUrl}#organization`,
        name: 'QuizSolver',
        description: 'QuizSolver builds AI-powered browser extensions for students. The flagship product is a Chrome extension that instantly solves quizzes on Testportal, Moodle, Canvas, Google Forms, Kahoot, Quizizz, Blackboard, Microsoft Forms, Quizlet, and Socrative using AI answer suggestions and step-by-step explanations.',
        url: homeUrl,
        foundingDate: '2025',
        knowsAbout: [
          'AI quiz solving', 'educational technology', 'Chrome browser extensions',
          'Testportal', 'Moodle LMS', 'Canvas LMS', 'Google Forms', 'Kahoot',
          'Quizizz', 'Blackboard Learn', 'Microsoft Forms', 'Quizlet', 'Socrative'
        ],
        logo: {
          '@type': 'ImageObject',
          url: assetUrl('/logo-512.png'),
          width: 512,
          height: 512
        },
        sameAs: [
          CHROME_WEB_STORE_URL,
          'https://twitter.com/getquizsolver'
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'support@getquizsolver.com',
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
        applicationCategory: 'EducationalApplication',
        applicationSubCategory: 'BrowserApplication',
        operatingSystem: 'Chrome, Chromium, Edge',
        url: homeUrl,
        downloadUrl: CHROME_WEB_STORE_URL,
        installUrl: CHROME_WEB_STORE_URL,
        sameAs: [CHROME_WEB_STORE_URL],
        softwareVersion: '0.911',
        inLanguage: SUPPORTED_LOCALES.map(opt => opt.htmlLang),
        description: 'QuizSolver is a Chrome extension that uses AI to instantly suggest answers and explanations for quiz questions on Testportal, Moodle, Canvas LMS, Google Forms, Kahoot, Quizizz, Blackboard, Microsoft Forms, Quizlet, and Socrative. It works in the browser side panel without tab switching and saves all solved questions for later review.',
        screenshot: assetUrl('/og-image.png'),
        creator: { '@id': `${homeUrl}#organization` },
        mentions: [
          { '@type': 'SoftwareApplication', name: 'Testportal', url: 'https://testportal.pl' },
          { '@type': 'SoftwareApplication', name: 'Moodle', url: 'https://moodle.org' },
          { '@type': 'SoftwareApplication', name: 'Canvas LMS', url: 'https://www.instructure.com' },
          { '@type': 'SoftwareApplication', name: 'Google Forms', url: 'https://forms.google.com' },
          { '@type': 'SoftwareApplication', name: 'Kahoot', url: 'https://kahoot.com' },
          { '@type': 'SoftwareApplication', name: 'Quizizz', url: 'https://quizizz.com' },
          { '@type': 'SoftwareApplication', name: 'Blackboard Learn', url: 'https://www.blackboard.com' },
          { '@type': 'SoftwareApplication', name: 'Microsoft Forms', url: 'https://forms.office.com' },
          { '@type': 'SoftwareApplication', name: 'Quizlet', url: 'https://quizlet.com' },
          { '@type': 'SoftwareApplication', name: 'Socrative', url: 'https://socrative.com' }
        ],
        featureList: [
          'AI quiz answer suggestions',
          'Step-by-step answer explanations',
          'Study notes and question history',
          'Practice quiz from history',
          'FocusScan screenshot solver',
          'Kahoot Quiz ID answer bank (free, no credits)',
          'Works on Testportal, Moodle, Canvas, Google Forms, Kahoot, Quizizz, Blackboard, Microsoft Forms, Quizlet, Socrative',
          'Chrome Side Panel — no tab switching required',
          'Hint mode for discreet help'
        ],
        offers: [
          { '@type': 'Offer', name: 'Free starter credits', price: '0', priceCurrency: 'USD' },
          { '@type': 'Offer', name: '100 credit top-up', price: '1.99', priceCurrency: 'USD' },
          { '@type': 'Offer', name: '500 credit top-up', price: '4.99', priceCurrency: 'USD' },
          { '@type': 'Offer', name: '2000 credit top-up', price: '9.99', priceCurrency: 'USD' }
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '5.0',
          reviewCount: '12',
          bestRating: '5',
          worstRating: '1'
        }
      },
      /* WebSite */
      {
        '@type': 'WebSite',
        '@id': `${homeUrl}#website`,
        name: 'QuizSolver',
        url: homeUrl,
        publisher: { '@id': `${homeUrl}#organization` },
        inLanguage: SUPPORTED_LOCALES.map(opt => opt.htmlLang)
      },
      {
        '@type': 'SiteNavigationElement',
        '@id': `${homeUrl}#site-navigation`,
        name: 'Primary navigation',
        url: [
          abs(pathFor('quizSolverAi', locale)),
          abs(pathFor('demo', locale)),
          abs(pathFor('credits', locale)),
          abs(pathFor('quiz', locale)),
          abs(pathFor('blog', locale)),
          ...BLOG_CATEGORY_ORDER
            .filter(category => categoryHasPosts(locale, category))
            .map(category => abs(pathFor('blogCategory', locale).replace(':category', category))),
          abs(pathFor('kahoot', locale)),
          abs(pathFor('testportal', locale)),
          abs(pathFor('googleForms', locale))
        ]
      },
      /* WebPage */
      {
        '@type': webpageType,
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: meta.title,
        description: meta.description,
        headline: meta.title,
        isPartOf: { '@id': `${homeUrl}#website` },
        about: { '@id': `${homeUrl}#software` },
        inLanguage: locOpt.htmlLang,
        datePublished: '2026-05-01',
        dateModified: SEO_DATE,
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['h1', '.hero-lead', '.desc', 'p.hero-subtitle']
        },
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
      const stepNames: string[] = [
        'Open the quiz page', 'Activate QuizSolver', 'Review AI suggestion'
      ];
      graph.push({
        '@type': 'HowTo',
        '@id': `${canonical}#howto`,
        name: data.stepsTitle || data.title,
        description: data.subtitle,
        totalTime: 'PT2M',
        step: data.steps.map((step: string, index: number) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: stepNames[index] || `Step ${index + 1}`,
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

    /* ItemList + home FAQ — home page only */
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
      /* Home-level FAQ for AI Overviews */
      graph.push({
        '@type': 'FAQPage',
        '@id': `${canonical}#homefaq`,
        mainEntity: [
          { '@type': 'Question', name: 'What is QuizSolver?', acceptedAnswer: { '@type': 'Answer', text: 'QuizSolver is a Chrome browser extension that uses AI to instantly solve quiz questions on platforms like Testportal, Moodle, Canvas, Google Forms, Kahoot, Quizizz, Blackboard, Microsoft Forms, Quizlet, and Socrative. It shows AI answer suggestions with step-by-step explanations in a Chrome Side Panel.' } },
          { '@type': 'Question', name: 'Is QuizSolver free?', acceptedAnswer: { '@type': 'Answer', text: 'QuizSolver is free to install. New accounts receive free starting AI credits. Additional credits are purchased as one-time top-up packages starting from $1.99. The Kahoot Quiz ID mode is always free and does not consume credits.' } },
          { '@type': 'Question', name: 'What quiz platforms does QuizSolver support?', acceptedAnswer: { '@type': 'Answer', text: 'QuizSolver supports Testportal, Moodle, Canvas LMS, Google Forms, Kahoot, Quizizz, Blackboard Learn, Microsoft Forms, Quizlet, and Socrative. For any other platform or image-based questions, the FocusScan tool can capture any screen region.' } },
          { '@type': 'Question', name: 'Does QuizSolver work on Kahoot?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. QuizSolver has two Kahoot modes: Auto mode detects visible questions and suggests the best answer automatically. Quiz ID mode lets you load the full answer bank for any Kahoot quiz using the Quiz ID from the URL — this mode is completely free (no credits needed).' } },
          { '@type': 'Question', name: 'Can Google or teachers detect QuizSolver?', acceptedAnswer: { '@type': 'Answer', text: 'QuizSolver runs in the standard Chrome extension sandbox inside the Chrome Side Panel. It does not inject suspicious scripts into quiz pages and does not require leaving the quiz tab, so it does not trigger common window-focus or tab-switch detectors.' } },
          { '@type': 'Question', name: 'How do I install QuizSolver?', acceptedAnswer: { '@type': 'Answer', text: 'Visit the Chrome Web Store, search for QuizSolver or click the install link at getquizsolver.com, click Add to Chrome, pin the icon to your toolbar, create a free account, and open any supported quiz page to start.' } }
        ]
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
        category: 'Prepaid AI quiz credits',
        url: canonical,
        image: assetUrl('/og-image.png'),
        isRelatedTo: { '@id': `${homeUrl}#software` },
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'Delivery', value: 'Automatic credit top-up after payment confirmation' },
          { '@type': 'PropertyValue', name: 'Billing', value: 'One-time purchase, no subscription' }
        ],
        offers: [
          { '@type': 'Offer', name: 'Free starter credits', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: canonical, seller: { '@id': `${homeUrl}#organization` } },
          { '@type': 'Offer', name: '100 AI credits', price: '1.99', priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: canonical, seller: { '@id': `${homeUrl}#organization` } },
          { '@type': 'Offer', name: '500 AI credits', price: '4.99', priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: canonical, seller: { '@id': `${homeUrl}#organization` } },
          { '@type': 'Offer', name: '2000 AI credits', price: '9.99', priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: canonical, seller: { '@id': `${homeUrl}#organization` } }
        ]
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

  private clearRouteSpecificMeta(): void {
    [
      ['property', 'article:published_time'],
      ['property', 'article:modified_time'],
      ['property', 'article:section'],
      ['property', 'product:price:amount'],
      ['property', 'product:price:currency']
    ].forEach(([attr, key]) => this.removeAllMeta(attr as 'name' | 'property', key));
    this.document.head.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove());
  }

  private setOgLocaleAlternates(locales: typeof SUPPORTED_LOCALES, currentLocale: Locale): void {
    this.document.head.querySelectorAll('meta[property="og:locale:alternate"]').forEach(el => el.remove());
    locales
      .filter(opt => opt.code !== currentLocale)
      .forEach(opt => {
        const el = this.document.createElement('meta');
        el.setAttribute('property', 'og:locale:alternate');
        el.setAttribute('content', opt.ogLocale);
        el.setAttribute('data-loc', opt.code);
        this.document.head.appendChild(el);
      });
  }

  private setHreflangAlternates(alternates: Array<{ hreflang: string; href: string }>, defaultHref: string): void {
    this.document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
    [...alternates, { hreflang: 'x-default', href: defaultHref }].forEach(item => {
      const link = this.document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', item.hreflang);
      link.setAttribute('href', item.href);
      this.document.head.appendChild(link);
    });
  }

  private keywordsFor(pageKey: PageKey, locale: Locale, data: any): string {
    const platformName = data?.platformName || data?.shortName || '';
    const base = [
      'QuizSolver',
      'AI quiz solver',
      'quiz solver Chrome extension',
      'online quiz answers',
      'FocusScan OCR',
      'quiz answer explanations',
      'study notes',
      'practice quiz'
    ];
    if (pageKey === 'credits') base.push('AI credits', 'QuizSolver credits', 'one-time credit packs');
    if (pageKey === 'quiz') base.push('quiz history', 'practice test generator', 'saved quiz questions');
    if (pageKey === 'demo') base.push('interactive quiz solver demo', 'Chrome extension demo');
    if (pageKey === 'blog') base.push('AI study guides', 'quiz platform guides', 'Kahoot guides');
    if (platformName) {
      base.unshift(`${platformName} quiz solver`, `${platformName} AI answers`, `${platformName} Chrome extension`);
    }
    if (locale === 'pl') {
      base.push('rozwiązywanie quizów AI', 'odpowiedzi do quizów', 'rozszerzenie Chrome do quizów');
    }
    return [...new Set(base)].join(', ');
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

  applyBlogCategory(category: BlogCategoryCopy, locale: Locale, options: { robots?: string } = {}): void {
    const copy = contentFor(locale);
    const meta = { title: category.metaTitle, description: category.metaDescription };
    const canonicalPath = pathFor('blogCategory', locale).replace(':category', category.slug);
    const canonical = abs(canonicalPath);
    const locOpt = localeOption(locale);
    const robots = options.robots || BASE_ROBOTS;
    const keywords = this.keywordsFor('blog', locale, { title: category.title });
    const categoryOgImage = ogImageUrl(locale, `category-${category.slug}`.replace(/[^a-z0-9-]/gi, '-').toLowerCase());
    const localesWithCategoryPosts = SUPPORTED_LOCALES.filter(opt => {
      const localizedCategory = categoryFor(opt.code, category.slug);
      return !!localizedCategory && categoryHasPosts(opt.code, localizedCategory.slug);
    });

    this.clearRouteSpecificMeta();
    this.document.documentElement.lang = copy['htmlLang'] || locale;
    this.title.setTitle(meta.title);
    this.upsertMeta('name', 'description', meta.description);
    this.upsertMeta('name', 'robots', robots);
    this.upsertMeta('name', 'googlebot', robots);
    this.upsertMeta('name', 'bingbot', robots);
    this.upsertMeta('name', 'author', 'QuizSolver');
    this.upsertMeta('name', 'keywords', keywords);
    this.upsertMeta('name', 'theme-color', '#030712');
    this.upsertMeta('name', 'application-name', 'QuizSolver');
    this.upsertMeta('name', 'rating', 'general');

    this.upsertMeta('property', 'og:type', 'website');
    this.upsertMeta('property', 'og:site_name', 'QuizSolver');
    this.upsertMeta('property', 'og:url', canonical);
    this.upsertMeta('property', 'og:title', meta.title);
    this.upsertMeta('property', 'og:description', meta.description);
    this.upsertMeta('property', 'og:image', categoryOgImage);
    this.upsertMeta('property', 'og:image:type', 'image/svg+xml');
    this.upsertMeta('property', 'og:image:width', '1200');
    this.upsertMeta('property', 'og:image:height', '630');
    this.upsertMeta('property', 'og:image:alt', category.title);
    this.upsertMeta('property', 'og:locale', locOpt.ogLocale);
    this.upsertMeta('property', 'og:updated_time', SEO_DATE);

    localesWithCategoryPosts
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
    this.setOgLocaleAlternates(localesWithCategoryPosts, locale);

    this.upsertMeta('name', 'twitter:card', 'summary_large_image');
    this.upsertMeta('name', 'twitter:site', '@getquizsolver');
    this.upsertMeta('name', 'twitter:creator', '@getquizsolver');
    this.upsertMeta('name', 'twitter:title', meta.title);
    this.upsertMeta('name', 'twitter:description', meta.description);
    this.upsertMeta('name', 'twitter:image', categoryOgImage);
    this.upsertMeta('name', 'twitter:image:alt', category.title);

    this.upsertLink('canonical', canonical);
    localesWithCategoryPosts.forEach(opt => {
      const localizedCategory = categoryFor(opt.code, category.slug);
      if (localizedCategory) {
        const route = pathFor('blogCategory', opt.code).replace(':category', localizedCategory.slug);
        this.upsertAlternate(opt.htmlLang, abs(route));
      }
    });
    const defaultLocale = localesWithCategoryPosts.find(opt => opt.code === 'en') || localesWithCategoryPosts[0];
    const defaultCategory = defaultLocale ? categoryFor(defaultLocale.code, category.slug) : undefined;
    if (defaultLocale && defaultCategory) {
      this.upsertAlternate('x-default', abs(pathFor('blogCategory', defaultLocale.code).replace(':category', defaultCategory.slug)));
    }
    this.setHreflangAlternates(
      localesWithCategoryPosts
        .map(opt => {
          const localizedCategory = categoryFor(opt.code, category.slug);
          return localizedCategory
            ? { hreflang: opt.htmlLang, href: abs(pathFor('blogCategory', opt.code).replace(':category', localizedCategory.slug)) }
            : null;
        })
        .filter(Boolean) as Array<{ hreflang: string; href: string }>,
      defaultLocale && defaultCategory
        ? abs(pathFor('blogCategory', defaultLocale.code).replace(':category', defaultCategory.slug))
        : canonical
    );

    const homeUrl = `${SITE_URL}/`;
    const posts = BLOG_POSTS
      .filter(post => post.locale === locale && post.category === category.slug)
      .slice(0, 12);

    this.upsertJsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': `${canonical}#webpage`,
          url: canonical,
          name: meta.title,
          description: meta.description,
          isPartOf: { '@id': `${homeUrl}#website` },
          inLanguage: locOpt.htmlLang,
          about: { '@id': `${homeUrl}#software` },
          breadcrumb: { '@id': `${canonical}#breadcrumb` }
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${canonical}#breadcrumb`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'QuizSolver', item: homeUrl },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: abs(pathFor('blog', locale)) },
            { '@type': 'ListItem', position: 3, name: category.title, item: canonical }
          ]
        },
        {
          '@type': 'ItemList',
          '@id': `${canonical}#articles`,
          name: category.title,
          numberOfItems: posts.length,
          itemListElement: posts.map((post, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: post.title,
            url: abs(pathFor('blogPost', locale).replace(':slug', post.slug))
          }))
        }
      ]
    });
  }

  applyBlogPost(post: BlogPost, locale: Locale): void {
    const copy = contentFor(locale);
    const meta = { title: post.metaTitle, description: post.metaDescription };
    const canonicalPath = pathFor('blogPost', locale).replace(':slug', post.slug);
    const canonical = abs(canonicalPath);
    const robots = BASE_ROBOTS;
    const locOpt = localeOption(locale);
    const translationPosts = BLOG_POSTS.filter(p => p.translationKey === post.translationKey);
    const translationLocales = SUPPORTED_LOCALES.filter(opt => translationPosts.some(p => p.locale === opt.code));
    const postOgImage = ogImageUrl(locale, `blog-${post.slug}`.replace(/[^a-z0-9-]/gi, '-').toLowerCase());
    const wordCount = post.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    const readMinutes = Math.max(1, Number.parseInt(post.readTime, 10) || 5);

    this.clearRouteSpecificMeta();

    /* ── HTML lang ── */
    this.document.documentElement.lang = copy['htmlLang'] || locale;

    /* ── Core ── */
    this.title.setTitle(meta.title);
    this.upsertMeta('name', 'description', meta.description);
    this.upsertMeta('name', 'robots', robots);
    this.upsertMeta('name', 'googlebot', robots);
    this.upsertMeta('name', 'bingbot', robots);
    this.upsertMeta('name', 'author', post.author);
    this.upsertMeta('name', 'keywords', [...(post.tags || []), 'QuizSolver', 'AI quiz solver', 'Chrome extension'].join(', '));
    this.upsertMeta('name', 'theme-color', '#030712');
    this.upsertMeta('name', 'application-name', 'QuizSolver');
    this.upsertMeta('name', 'rating', 'general');

    /* ── Open Graph ── */
    this.upsertMeta('property', 'og:type', 'article');
    this.upsertMeta('property', 'og:site_name', 'QuizSolver');
    this.upsertMeta('property', 'og:url', canonical);
    this.upsertMeta('property', 'og:title', meta.title);
    this.upsertMeta('property', 'og:description', meta.description);
    this.upsertMeta('property', 'og:image', postOgImage);
    this.upsertMeta('property', 'og:image:type', 'image/svg+xml');
    this.upsertMeta('property', 'og:image:width', '1200');
    this.upsertMeta('property', 'og:image:height', '630');
    this.upsertMeta('property', 'og:image:alt', post.title);
    this.upsertMeta('property', 'og:locale', locOpt.ogLocale);
    this.upsertMeta('property', 'article:published_time', post.datePublished);
    this.upsertMeta('property', 'article:modified_time', post.dateModified);
    this.upsertMeta('property', 'article:section', categoryLabel(locale, post.category));
    (post.tags || []).slice(0, 8).forEach(tag => this.appendMeta('property', 'article:tag', tag));
    this.upsertMeta('property', 'og:updated_time', post.dateModified);

    /* All OG locale alternates */
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
    this.setOgLocaleAlternates(
      translationLocales.length ? translationLocales : SUPPORTED_LOCALES.filter(opt => opt.code === locale),
      locale
    );

    /* ── Twitter / X ── */
    this.upsertMeta('name', 'twitter:card', 'summary_large_image');
    this.upsertMeta('name', 'twitter:site', '@getquizsolver');
    this.upsertMeta('name', 'twitter:creator', '@getquizsolver');
    this.upsertMeta('name', 'twitter:title', meta.title);
    this.upsertMeta('name', 'twitter:description', meta.description);
    this.upsertMeta('name', 'twitter:image', postOgImage);
    this.upsertMeta('name', 'twitter:image:alt', post.title);

    /* ── Canonical + hreflang ── */
    this.upsertLink('canonical', canonical);

    SUPPORTED_LOCALES.forEach(opt => {
      const match = BLOG_POSTS.find(p => p.translationKey === post.translationKey && p.locale === opt.code);
      if (match) {
        this.upsertAlternate(opt.htmlLang, abs(pathFor('blogPost', opt.code).replace(':slug', match.slug)));
      }
    });
    const defaultPost = BLOG_POSTS.find(p => p.translationKey === post.translationKey && p.locale === 'en') || post;
    this.upsertAlternate('x-default', abs(pathFor('blogPost', defaultPost.locale).replace(':slug', defaultPost.slug)));
    this.setHreflangAlternates(
      (translationPosts.length ? translationPosts : [post]).map(match => ({
        hreflang: localeOption(match.locale).htmlLang,
        href: abs(pathFor('blogPost', match.locale).replace(':slug', match.slug))
      })),
      abs(pathFor('blogPost', defaultPost.locale).replace(':slug', defaultPost.slug))
    );

    const homeUrl = `${SITE_URL}/`;
    const blogPostSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['BlogPosting', 'Article'],
          '@id': `${canonical}#post`,
          url: canonical,
          mainEntityOfPage: { '@id': `${canonical}#webpage` },
          headline: post.title,
          description: post.metaDescription,
          datePublished: post.datePublished,
          dateModified: post.dateModified,
          inLanguage: locOpt.htmlLang,
          articleSection: categoryLabel(locale, post.category),
          keywords: post.tags?.join(', '),
          wordCount,
          timeRequired: `PT${readMinutes}M`,
          isAccessibleForFree: true,
          about: (post.tags || []).slice(0, 8).map(tag => ({ '@type': 'Thing', name: tag })),
          author: {
            '@type': 'Person',
            name: post.author
          },
          publisher: {
            '@type': 'Organization',
            '@id': `${homeUrl}#organization`,
            name: 'QuizSolver',
            logo: {
              '@type': 'ImageObject',
              url: assetUrl('/logo-512.png'),
              width: 512,
              height: 512
            }
          },
          image: {
            '@type': 'ImageObject',
            url: postOgImage,
            width: 1200,
            height: 630
          },
          thumbnailUrl: postOgImage,
          potentialAction: {
            '@type': 'ReadAction',
            target: canonical
          }
        },
        {
          '@type': 'WebPage',
          '@id': `${canonical}#webpage`,
          url: canonical,
          name: post.metaTitle,
          description: post.metaDescription,
          isPartOf: { '@id': `${homeUrl}#website` },
          inLanguage: locOpt.htmlLang,
          breadcrumb: { '@id': `${canonical}#breadcrumb` }
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${canonical}#breadcrumb`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'QuizSolver', item: homeUrl },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: abs(pathFor('blog', locale)) },
            { '@type': 'ListItem', position: 3, name: post.title, item: canonical }
          ]
        }
      ]
    };
    this.upsertJsonLd(blogPostSchema);
  }
}
