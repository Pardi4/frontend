import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SeoService } from '../seo.service';
import { BLOG_POSTS, BlogPost } from '../blog-content';
import { Locale, PageKey, pageData, pathFor, CHROME_WEB_STORE_URL } from '../site-content';
import { ShellComponent } from './shell.component';

type RelatedPlatform = {
  pageKey: PageKey;
  label: string;
  href: string;
};

const BLOG_PLATFORM_KEYWORDS: Array<{ key: string; pageKey: PageKey }> = [
  { key: 'kahoot', pageKey: 'kahoot' },
  { key: 'testportal', pageKey: 'testportal' },
  { key: 'moodle', pageKey: 'moodle' },
  { key: 'canvas', pageKey: 'canvas' },
  { key: 'google-forms', pageKey: 'googleForms' },
  { key: 'google forms', pageKey: 'googleForms' },
  { key: 'microsoft-forms', pageKey: 'microsoftForms' },
  { key: 'microsoft forms', pageKey: 'microsoftForms' },
  { key: 'blackboard', pageKey: 'blackboard' },
  { key: 'quizlet', pageKey: 'quizlet' },
  { key: 'socrative', pageKey: 'socrative' },
  { key: 'quizizz', pageKey: 'quizizz' }
];

@Component({
  standalone: true,
  imports: [CommonModule, ShellComponent],
  template: `
    <qs-shell [locale]="locale" pageKey="blogPost">
      <div class="container blog-post-page" id="main-content" *ngIf="post">
        <div class="back-navigation">
          <a [href]="getBlogListUrl()" class="back-link">
            <span class="arrow">←</span>
            <span>{{ labels.back }}</span>
          </a>
        </div>

        <nav class="breadcrumbs" aria-label="Breadcrumb">
          <a [href]="getHomeUrl()">QuizSolver</a>
          <span>/</span>
          <a [href]="getBlogListUrl()">Blog</a>
          <span>/</span>
          <span>{{ post.title }}</span>
        </nav>

        <header class="post-header">
          <div class="post-meta">
            <span class="post-badge">{{ labels.guide }}</span>
            <span class="bullet">•</span>
            <span>{{ post.datePublished | date:'mediumDate' }}</span>
            <span class="bullet">•</span>
            <span>{{ post.readTime }} {{ labels.readSuffix }}</span>
          </div>
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-author-box">
            <span class="author-avatar">{{ post.author.substring(0, 2).toUpperCase() }}</span>
            <div class="author-details">
              <span class="author-name">{{ post.author }}</span>
              <span class="author-role">{{ labels.authorRole }}</span>
            </div>
          </div>
        </header>

        <article class="post-content glass">
          <div [innerHTML]="post.content"></div>
        </article>

        <section class="related-platforms glass reveal" *ngIf="relatedPlatforms().length">
          <p class="eyebrow">{{ labels.relatedEyebrow }}</p>
          <h2>{{ labels.relatedTitle }}</h2>
          <div class="related-platform-list">
            <a class="related-platform-link" *ngFor="let platform of relatedPlatforms()" [href]="platform.href">
              <span>{{ platform.label }}</span>
              <span class="arrow">→</span>
            </a>
          </div>
        </section>

        <section class="post-cta glass reveal">
          <div class="cta-gradient"></div>
          <div class="cta-inner">
            <h2 class="cta-title">{{ labels.ctaTitle }}</h2>
            <p class="cta-description text-secondary">
              {{ labels.ctaText }}
            </p>
            <div class="cta-actions">
              <a [href]="storeUrl" target="_blank" rel="noopener" class="btn btn-primary btn-lg">
                {{ labels.install }}
              </a>
              <a [href]="getDemoUrl()" class="btn btn-outline btn-lg">
                {{ labels.demo }}
              </a>
            </div>
          </div>
        </section>
      </div>

      <div class="container not-found-state" *ngIf="!post">
        <div class="not-found-card glass">
          <h1>{{ labels.notFoundTitle }}</h1>
          <p class="text-secondary">
            {{ labels.notFoundText }}
          </p>
          <a [href]="getBlogListUrl()" class="btn btn-primary">
            {{ labels.goBlog }}
          </a>
        </div>
      </div>
    </qs-shell>
  `,
  styles: [`
    .blog-post-page {
      padding-top: 3rem;
      padding-bottom: 6rem;
      max-width: 860px;
      margin: 0 auto;
    }
    .back-navigation {
      margin-bottom: 2rem;
    }
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 600;
      transition: color 0.2s ease, gap 0.2s ease;
    }
    .back-link:hover {
      color: var(--accent-cyan);
      gap: 0.75rem;
    }
    .back-link .arrow {
      font-family: system-ui, -apple-system, sans-serif;
    }
    .breadcrumbs {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 2rem;
      color: var(--text-tertiary);
      font-size: 0.9rem;
    }
    .breadcrumbs a {
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 700;
    }
    .breadcrumbs a:hover {
      color: var(--accent-cyan);
    }
    .breadcrumbs span:last-child {
      color: var(--text-primary);
      font-weight: 700;
    }

    .post-header {
      margin-bottom: 3rem;
    }
    .post-meta {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-bottom: 1.25rem;
    }
    .post-badge {
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.05em;
      color: var(--accent-violet);
    }
    .post-meta .bullet {
      color: var(--text-tertiary);
    }
    .post-title {
      font-size: clamp(2rem, 5vw, 2.75rem);
      font-weight: 900;
      line-height: 1.25;
      color: var(--text-primary);
      margin-bottom: 2rem;
    }
    .post-author-box {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .author-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 9999px;
      background: linear-gradient(135deg, var(--accent-violet) 0%, var(--accent-cyan) 100%);
      color: #ffffff;
      font-weight: 800;
      font-size: 0.95rem;
    }
    .author-details {
      display: flex;
      flex-direction: column;
    }
    .author-name {
      font-weight: 700;
      color: var(--text-primary);
    }
    .author-role {
      font-size: 0.825rem;
      color: var(--text-tertiary);
    }

    .post-content {
      padding: 3rem;
      border-radius: var(--radius-lg);
      margin-bottom: 4rem;
    }
    .related-platforms {
      padding: 2rem;
      border-radius: var(--radius-lg);
      margin-bottom: 4rem;
    }
    .related-platforms h2 {
      font-size: 1.5rem;
      margin-bottom: 1.25rem;
    }
    .related-platform-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 0.75rem;
    }
    .related-platform-link {
      min-height: 3.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding: 0.9rem 1rem;
      border: 1px solid #2b3545;
      border-radius: 10px;
      background: #171c24;
      color: var(--text-primary);
      text-decoration: none;
      font-weight: 800;
    }
    .related-platform-link:hover {
      border-color: rgba(6, 182, 212, 0.55);
    }
    .related-platform-link .arrow {
      color: var(--accent-cyan);
    }

    /* Markdown/HTML rendered styles */
    ::ng-deep .blog-article-content {
      font-size: 1.1rem;
      line-height: 1.75;
      color: var(--text-primary);
    }
    ::ng-deep .blog-article-content p {
      margin-bottom: 1.5rem;
    }
    ::ng-deep .blog-article-content h2 {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 2.5rem 0 1rem;
    }
    ::ng-deep .blog-article-content h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 2rem 0 0.75rem;
    }
    ::ng-deep .blog-article-content ul, ::ng-deep .blog-article-content ol {
      margin-bottom: 1.5rem;
      padding-left: 1.5rem;
    }
    ::ng-deep .blog-article-content ul {
      list-style-type: disc;
    }
    ::ng-deep .blog-article-content ol {
      list-style-type: decimal;
    }
    ::ng-deep .blog-article-content li {
      margin-bottom: 0.5rem;
    }
    ::ng-deep .blog-article-content blockquote {
      margin: 2rem 0;
      padding: 1.25rem 2rem;
      border-left: 4px solid var(--accent-violet);
      background: rgba(124, 92, 252, 0.04);
      border-radius: 0 var(--radius-md) var(--radius-md) 0;
    }
    ::ng-deep .blog-article-content blockquote p {
      margin-bottom: 0;
      font-style: italic;
      color: var(--text-secondary);
    }
    ::ng-deep .blog-article-content code {
      font-family: Consolas, Monaco, monospace;
      font-size: 0.95rem;
      padding: 0.2rem 0.4rem;
      border-radius: var(--radius-sm);
      background: rgba(255, 255, 255, 0.06);
      color: var(--accent-cyan);
    }
    ::ng-deep .blog-article-content em {
      font-style: italic;
    }
    ::ng-deep .blog-article-content strong {
      font-weight: 700;
    }

    ::ng-deep .blog-native-ad {
      margin: 2.5rem 0;
      padding: 2rem;
      background: linear-gradient(135deg, rgba(124, 92, 252, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%);
      border: 1px solid rgba(124, 92, 252, 0.2);
      border-radius: var(--radius-md);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    ::ng-deep .blog-native-ad-title {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0 !important;
    }
    ::ng-deep .blog-native-ad-text {
      font-size: 0.975rem;
      color: var(--text-secondary);
      line-height: 1.5;
      margin: 0 !important;
    }
    ::ng-deep .blog-native-ad-btn {
      align-self: flex-start;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, var(--accent-violet) 0%, var(--accent-cyan) 100%);
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.95rem;
      border-radius: var(--radius-sm);
      transition: opacity 0.2s ease, transform 0.2s ease;
      box-shadow: 0 4px 12px rgba(124, 92, 252, 0.25);
    }
    ::ng-deep .blog-native-ad-btn:hover {
      opacity: 0.95;
      transform: translateY(-1px);
    }

    /* CTA Box */
    .post-cta {
      position: relative;
      border-radius: var(--radius-lg);
      overflow: hidden;
      margin-bottom: 4rem;
    }
    .cta-gradient {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at bottom right, rgba(124, 92, 252, 0.08) 0%, transparent 60%);
      pointer-events: none;
      z-index: 1;
    }
    .cta-inner {
      padding: 3rem;
      z-index: 2;
      position: relative;
      text-align: center;
    }
    .cta-title {
      font-size: 1.75rem;
      font-weight: 850;
      margin-bottom: 1rem;
    }
    .cta-description {
      font-size: 1.05rem;
      max-width: 680px;
      margin: 0 auto 2.25rem;
      line-height: 1.6;
    }
    .cta-actions {
      display: flex;
      gap: 1.25rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    .cta-actions .btn {
      min-width: 240px;
    }

    /* Not Found state */
    .not-found-state {
      padding: 6rem 0;
      max-width: 600px;
      margin: 0 auto;
    }
    .not-found-card {
      padding: 4rem;
      text-align: center;
      border-radius: var(--radius-lg);
    }
    .not-found-card h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    .not-found-card p {
      margin-bottom: 2.25rem;
    }

    @media (max-width: 640px) {
      .post-content {
        padding: 1.75rem;
      }
      .cta-inner {
        padding: 2rem;
      }
      .cta-actions .btn {
        width: 100%;
      }
    }
  `]
})
export class BlogPostComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);

  protected locale: Locale = 'en';
  protected post?: BlogPost;
  protected readonly storeUrl = CHROME_WEB_STORE_URL;
  protected labels = this.labelsFor('en');

  ngOnInit(): void {
    this.locale = (this.route.snapshot.data['locale'] || 'en') as Locale;
    this.labels = this.labelsFor(this.locale);

    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.post = BLOG_POSTS.find(p => p.slug === slug && p.locale === this.locale);
        
        if (this.post) {
          this.seo.applyBlogPost(this.post, this.locale);
        } else {
          const otherLangPost = BLOG_POSTS.find(p => p.slug === slug);
          if (otherLangPost) {
            const routePattern = pathFor('blogPost', otherLangPost.locale);
            const redirectUrl = routePattern.replace(':slug', slug);
            this.router.navigateByUrl(redirectUrl);
          } else {
            this.seo.applyPage('notFound', this.locale);
          }
        }
      }
    });
  }

  protected getBlogListUrl(): string {
    return pathFor('blog', this.locale);
  }

  protected getHomeUrl(): string {
    return pathFor('home', this.locale);
  }

  protected getDemoUrl(): string {
    return pathFor('demo', this.locale);
  }

  protected relatedPlatforms(): RelatedPlatform[] {
    if (!this.post) return [];
    const haystack = [
      this.post.category,
      this.post.slug,
      this.post.title,
      this.post.metaDescription,
      ...(this.post.tags || [])
    ].join(' ').toLowerCase();
    const pageKeys = BLOG_PLATFORM_KEYWORDS
      .filter(item => haystack.includes(item.key))
      .map(item => item.pageKey);
    const uniquePageKeys = [...new Set(pageKeys.length ? pageKeys : ['quizSolverAi' as PageKey])].slice(0, 4);
    return uniquePageKeys.map(pageKey => {
      const data = pageData(pageKey, this.locale) || pageData(pageKey, 'en') || {};
      return {
        pageKey,
        label: data.shortName ? `${data.shortName} Quiz Solver` : data.title || 'AI Quiz Solver',
        href: pathFor(pageKey, this.locale)
      };
    });
  }

  private labelsFor(locale: Locale) {
    const labels: Record<Locale, any> = {
      en: {
        back: 'Back to blog',
        guide: 'Guide',
        readSuffix: 'read',
        authorRole: 'QuizSolver Writer',
        ctaTitle: 'Ready to make your next quiz easier to review?',
        ctaText: 'Install the free QuizSolver Chrome extension and use AI explanations, notes and practice quizzes directly in your browser sidebar.',
        install: 'Add to Chrome (free)',
        demo: 'Try interactive demo',
        notFoundTitle: 'Article not found',
        notFoundText: 'Sorry, this blog post does not exist or has been moved.',
        goBlog: 'Go to blog'
      },
      pl: {
        back: 'Wróć do bloga',
        guide: 'Poradnik',
        readSuffix: 'czytania',
        authorRole: 'Autor QuizSolver',
        ctaTitle: 'Chcesz łatwiej powtarzać pytania z kolejnego quizu?',
        ctaText: 'Zainstaluj darmowe rozszerzenie QuizSolver do Chrome. Korzystaj z bocznego panelu, wyjaśnień AI, notatek i quizów powtórkowych.',
        install: 'Dodaj do Chrome za darmo',
        demo: 'Wypróbuj demo',
        notFoundTitle: 'Nie znaleziono artykułu',
        notFoundText: 'Ten wpis blogowy nie istnieje albo został przeniesiony.',
        goBlog: 'Przejdź do bloga'
      },
      de: {
        back: 'Zurück zum Blog',
        guide: 'Leitfaden',
        readSuffix: 'Lesezeit',
        authorRole: 'QuizSolver Autor',
        ctaTitle: 'Bereit für bessere Wiederholung?',
        ctaText: 'Installiere QuizSolver kostenlos und nutze KI-Erklärungen, Notizen und Übungsquizze direkt in Chrome.',
        install: 'Kostenlos zu Chrome hinzufügen',
        demo: 'Demo testen',
        notFoundTitle: 'Artikel nicht gefunden',
        notFoundText: 'Dieser Blogbeitrag existiert nicht oder wurde verschoben.',
        goBlog: 'Zum Blog'
      },
      es: {
        back: 'Volver al blog',
        guide: 'Guía',
        readSuffix: 'de lectura',
        authorRole: 'Autor de QuizSolver',
        ctaTitle: '¿Quieres repasar mejor tu próximo quiz?',
        ctaText: 'Instala QuizSolver gratis y usa explicaciones con IA, notas y práctica directamente en Chrome.',
        install: 'Añadir a Chrome gratis',
        demo: 'Probar demo',
        notFoundTitle: 'Artículo no encontrado',
        notFoundText: 'Este artículo no existe o fue movido.',
        goBlog: 'Ir al blog'
      },
      fr: {
        back: 'Retour au blog',
        guide: 'Guide',
        readSuffix: 'de lecture',
        authorRole: 'Auteur QuizSolver',
        ctaTitle: 'Prêt à mieux réviser votre prochain quiz ?',
        ctaText: 'Installez QuizSolver gratuitement et utilisez explications IA, notes et quiz de révision dans Chrome.',
        install: 'Ajouter à Chrome gratuitement',
        demo: 'Essayer la démo',
        notFoundTitle: 'Article introuvable',
        notFoundText: 'Cet article n’existe pas ou a été déplacé.',
        goBlog: 'Aller au blog'
      },
      it: {
        back: 'Torna al blog',
        guide: 'Guida',
        readSuffix: 'di lettura',
        authorRole: 'Autore QuizSolver',
        ctaTitle: 'Vuoi ripassare meglio il prossimo quiz?',
        ctaText: 'Installa QuizSolver gratis e usa spiegazioni AI, note e quiz di pratica direttamente in Chrome.',
        install: 'Aggiungi a Chrome gratis',
        demo: 'Prova la demo',
        notFoundTitle: 'Articolo non trovato',
        notFoundText: 'Questo articolo non esiste o è stato spostato.',
        goBlog: 'Vai al blog'
      },
      uk: {
        back: 'Назад до блогу',
        guide: 'Гайд',
        readSuffix: 'читання',
        authorRole: 'Автор QuizSolver',
        ctaTitle: 'Хочете краще повторити наступний квіз?',
        ctaText: 'Встановіть QuizSolver безкоштовно та використовуйте AI-пояснення, нотатки й тренувальні квізи в Chrome.',
        install: 'Додати до Chrome безкоштовно',
        demo: 'Спробувати демо',
        notFoundTitle: 'Статтю не знайдено',
        notFoundText: 'Ця стаття не існує або була переміщена.',
        goBlog: 'До блогу'
      }
    };
    labels.en.relatedEyebrow = 'Related';
    labels.en.relatedTitle = 'Related platform guides';
    labels.pl.relatedEyebrow = 'Powiązane';
    labels.pl.relatedTitle = 'Powiązane poradniki platform';
    return {
      relatedEyebrow: labels.en.relatedEyebrow,
      relatedTitle: labels.en.relatedTitle,
      ...(labels[locale] || labels.en)
    };
  }
}
