import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '../seo.service';
import { BLOG_POSTS, BlogPost } from '../blog-content';
import { CHROME_WEB_STORE_URL, Locale, PageKey, pageData, pathFor, platformEntries } from '../site-content';
import { ShellComponent } from './shell.component';

type PlatformUi = {
  install: string;
  related: string;
  whatItDoes: (platform: string) => string;
  aiAnswers: string;
  explanations: string;
  notes: string;
  sharing: string;
  howToStart: string;
  featuresTitle: string;
  platforms: string;
  otherGuides: string;
  guidesIntro: string;
  relatedArticles: string;
  readArticle: string;
  faqTitle: string;
  stats: string[];
  intro: (platform: string) => string;
};

const PLATFORM_UI: Record<Locale, PlatformUi> = {
  en: {
    install: 'Install extension',
    related: 'See related',
    whatItDoes: platform => `Why students use QuizSolver on ${platform}`,
    aiAnswers: 'AI answer suggestions',
    explanations: 'Short explanations',
    notes: 'Notes and history quiz',
    sharing: 'Shareable quizzes',
    howToStart: 'How to start',
    featuresTitle: 'Features in this workflow',
    platforms: 'Platforms',
    otherGuides: 'Other QuizSolver guides',
    guidesIntro: 'Choose your platform and get a step-by-step guide tailored to that quiz system.',
    relatedArticles: 'Related articles and tutorials',
    readArticle: 'Read article',
    faqTitle: 'Questions about this workflow',
    stats: ['10+ platforms', 'AI answers in seconds', 'Free to install'],
    intro: platform => `QuizSolver detects questions on ${platform}, suggests AI answers, and saves everything to your study history automatically.`
  },
  pl: {
    install: 'Zainstaluj rozszerzenie',
    related: 'Zobacz podobne',
    whatItDoes: platform => `Dlaczego użytkownicy używają QuizSolver na ${platform}`,
    aiAnswers: 'Sugestie odpowiedzi AI',
    explanations: 'Krótkie wyjaśnienia',
    notes: 'Notatki i quiz z historii',
    sharing: 'Udostępnianie quizu z pytań',
    howToStart: 'Jak zacząć',
    featuresTitle: 'Funkcje w tym workflow',
    platforms: 'Platformy',
    otherGuides: 'Inne poradniki QuizSolver',
    guidesIntro: 'Wybierz platformę i zobacz instrukcję krok po kroku dopasowaną do konkretnego systemu quizów.',
    relatedArticles: 'Powiązane artykuły i tutoriale',
    readArticle: 'Przeczytaj artykuł',
    faqTitle: 'Pytania o ten workflow',
    stats: ['10+ platform', 'Odpowiedzi AI w kilka sekund', 'Darmowa instalacja'],
    intro: platform => `QuizSolver wykrywa pytania na ${platform}, podpowiada odpowiedzi AI i automatycznie zapisuje wszystko do historii nauki.`
  },
  de: {
    install: 'Erweiterung installieren',
    related: 'Ähnliche ansehen',
    whatItDoes: platform => `Warum Lernende QuizSolver auf ${platform} nutzen`,
    aiAnswers: 'KI-Antwortvorschläge',
    explanations: 'Kurze Erklärungen',
    notes: 'Notizen und Quiz aus der Historie',
    sharing: 'Teilbare Quizze',
    howToStart: 'So startest du',
    featuresTitle: 'Funktionen in diesem Workflow',
    platforms: 'Plattformen',
    otherGuides: 'Weitere QuizSolver-Guides',
    guidesIntro: 'Wähle deine Plattform und erhalte eine Schritt-für-Schritt-Anleitung für dieses Quizsystem.',
    relatedArticles: 'Passende Artikel und Tutorials',
    readArticle: 'Artikel lesen',
    faqTitle: 'Fragen zu diesem Workflow',
    stats: ['10+ Plattformen', 'KI-Antworten in Sekunden', 'Kostenlos installieren'],
    intro: platform => `QuizSolver erkennt Fragen auf ${platform}, schlägt KI-Antworten vor und speichert alles automatisch in deiner Lernhistorie.`
  },
  es: {
    install: 'Instalar extensión',
    related: 'Ver similares',
    whatItDoes: platform => `Por qué estudiantes usan QuizSolver en ${platform}`,
    aiAnswers: 'Sugerencias de respuesta con IA',
    explanations: 'Explicaciones breves',
    notes: 'Notas y quiz del historial',
    sharing: 'Quizzes compartibles',
    howToStart: 'Cómo empezar',
    featuresTitle: 'Funciones de este flujo',
    platforms: 'Plataformas',
    otherGuides: 'Más guías de QuizSolver',
    guidesIntro: 'Elige tu plataforma y sigue una guía paso a paso adaptada a ese sistema de quiz.',
    relatedArticles: 'Artículos y tutoriales relacionados',
    readArticle: 'Leer artículo',
    faqTitle: 'Preguntas sobre este flujo',
    stats: ['10+ plataformas', 'Respuestas IA en segundos', 'Instalación gratis'],
    intro: platform => `QuizSolver detecta preguntas en ${platform}, sugiere respuestas con IA y guarda todo automáticamente en tu historial de estudio.`
  },
  fr: {
    install: 'Installer l’extension',
    related: 'Voir similaires',
    whatItDoes: platform => `Pourquoi utiliser QuizSolver sur ${platform}`,
    aiAnswers: 'Suggestions de réponses IA',
    explanations: 'Explications courtes',
    notes: 'Notes et quiz depuis l’historique',
    sharing: 'Quiz partageables',
    howToStart: 'Comment commencer',
    featuresTitle: 'Fonctions de ce workflow',
    platforms: 'Plateformes',
    otherGuides: 'Autres guides QuizSolver',
    guidesIntro: 'Choisissez votre plateforme et suivez un guide étape par étape adapté à ce système de quiz.',
    relatedArticles: 'Articles et tutoriels liés',
    readArticle: 'Lire l’article',
    faqTitle: 'Questions sur ce workflow',
    stats: ['10+ plateformes', 'Réponses IA en quelques secondes', 'Installation gratuite'],
    intro: platform => `QuizSolver détecte les questions sur ${platform}, propose des réponses IA et sauvegarde automatiquement le tout dans votre historique d’étude.`
  },
  it: {
    install: 'Installa estensione',
    related: 'Vedi simili',
    whatItDoes: platform => `Perché usare QuizSolver su ${platform}`,
    aiAnswers: 'Suggerimenti AI',
    explanations: 'Spiegazioni brevi',
    notes: 'Note e quiz dalla cronologia',
    sharing: 'Quiz condivisibili',
    howToStart: 'Come iniziare',
    featuresTitle: 'Funzioni in questo workflow',
    platforms: 'Piattaforme',
    otherGuides: 'Altre guide QuizSolver',
    guidesIntro: 'Scegli la piattaforma e segui una guida passo passo pensata per quel sistema di quiz.',
    relatedArticles: 'Articoli e tutorial correlati',
    readArticle: 'Leggi articolo',
    faqTitle: 'Domande su questo workflow',
    stats: ['10+ piattaforme', 'Risposte AI in pochi secondi', 'Installazione gratis'],
    intro: platform => `QuizSolver rileva le domande su ${platform}, suggerisce risposte AI e salva automaticamente tutto nella tua cronologia di studio.`
  },
  uk: {
    install: 'Встановити розширення',
    related: 'Схожі сторінки',
    whatItDoes: platform => `Чому користуються QuizSolver на ${platform}`,
    aiAnswers: 'AI-підказки відповідей',
    explanations: 'Короткі пояснення',
    notes: 'Нотатки й квіз з історії',
    sharing: 'Квізи для поширення',
    howToStart: 'Як почати',
    featuresTitle: 'Функції цього сценарію',
    platforms: 'Платформи',
    otherGuides: 'Інші гайди QuizSolver',
    guidesIntro: 'Обери платформу й отримай покроковий гайд, адаптований до цієї системи квізів.',
    relatedArticles: 'Пов’язані статті та гайди',
    readArticle: 'Читати статтю',
    faqTitle: 'Питання про цей сценарій',
    stats: ['10+ платформ', 'AI-відповіді за секунди', 'Безкоштовна установка'],
    intro: platform => `QuizSolver знаходить питання на ${platform}, пропонує AI-відповіді й автоматично зберігає все в історії навчання.`
  }
};

@Component({
  standalone: true,
  imports: [CommonModule, ShellComponent],
  template: `
    <qs-shell [locale]="locale" [pageKey]="pageKey">
      <div class="seo-page">
        <section class="platform-hero">
          <div class="container platform-hero-grid">
            <div class="platform-hero-content">
              <nav class="breadcrumbs" aria-label="Breadcrumb">
                <a [href]="pathFor('home')" class="breadcrumb-link">QuizSolver</a>
                <span class="divider">/</span>
                <span class="active-crumb">{{ data?.shortName || data?.platformName }}</span>
              </nav>
              <p class="eyebrow">{{ data?.badge || platformLabel }}</p>
              <h1>{{ data?.title }}</h1>
              <p class="desc text-secondary">{{ data?.subtitle }}</p>
              <div class="hero-actions">
                <a class="btn btn-primary btn-lg" [href]="storeUrl" target="_blank" rel="noopener">
                  {{ ui.install }}
                </a>
                <a class="btn btn-outline btn-lg" href="#platform-guides">
                  {{ ui.related }}
                </a>
              </div>
            </div>
            
            <aside class="platform-hero-aside glass">
              <h2>{{ whatItDoesTitle }}</h2>
              <p class="text-secondary" style="margin-bottom: 1.5rem;">{{ platformIntro }}</p>
              <ul class="check-list">
                <li class="check-item"><span class="check-icon">✓</span> {{ ui.aiAnswers }}</li>
                <li class="check-item"><span class="check-icon">✓</span> {{ ui.explanations }}</li>
                <li class="check-item"><span class="check-icon">✓</span> {{ ui.notes }}</li>
                <li class="check-item"><span class="check-icon">✓</span> {{ ui.sharing }}</li>
              </ul>
            </aside>
          </div>
          <div class="container platform-stat-bar" aria-label="QuizSolver facts">
            <div class="platform-stat" *ngFor="let stat of ui.stats">
              <span>{{ stat }}</span>
            </div>
          </div>
        </section>

        <section class="section">
          <div class="container two-col-grid">
            <article class="guide-card glass glass-hover reveal">
              <h2>{{ data?.stepsTitle || ui.howToStart }}</h2>
              <ol class="numbered-steps">
                <li *ngFor="let step of data?.steps; let i = index">
                  <span class="step-index">{{ i + 1 }}</span>
                  <span class="text-secondary">{{ step }}</span>
                </li>
              </ol>
            </article>
            <article class="guide-card glass glass-hover reveal delay-100">
              <h2>{{ ui.featuresTitle }}</h2>
              <ul class="feature-list">
                <li *ngFor="let feature of data?.features" class="text-secondary">
                  <span style="color: var(--accent-cyan); font-weight: bold; margin-right: 0.5rem;">✦</span> {{ feature }}
                </li>
              </ul>
            </article>
          </div>
          <div class="container" *ngIf="data?.note">
            <div class="accent-box glass">
              <p class="text-secondary" style="margin: 0;">{{ data?.note }}</p>
            </div>
          </div>
        </section>

        <section class="section" *ngIf="data?.keywordSections?.length">
          <div class="container keywords-grid">
            <article class="keyword-card glass glass-hover reveal" *ngFor="let section of data?.keywordSections; let i = index" [class.delay-100]="i === 1">
              <h2>{{ section.title }}</h2>
              <p class="text-secondary">{{ section.text }}</p>
            </article>
          </div>
        </section>

        <section class="section" *ngIf="relatedArticles().length">
          <div class="container">
            <header class="section-header">
              <p class="eyebrow">Blog</p>
              <h2>{{ ui.relatedArticles }}</h2>
            </header>

            <div class="article-grid">
              <a class="article-card glass glass-hover reveal" *ngFor="let article of relatedArticles(); let i = index" [class.delay-100]="(i % 3) === 1" [class.delay-200]="(i % 3) === 2" [href]="postUrl(article)">
                <span class="eyebrow">{{ article.datePublished | date:'mediumDate' }}</span>
                <strong>{{ article.title }}</strong>
                <span class="text-secondary">{{ article.excerpt }}</span>
                <span class="article-link">{{ ui.readArticle }} →</span>
              </a>
            </div>
          </div>
        </section>

        <section class="section" id="platform-guides">
          <div class="container">
            <header class="section-header">
              <p class="eyebrow">{{ ui.platforms }}</p>
              <h2>{{ ui.otherGuides }}</h2>
              <p class="text-secondary">
                {{ ui.guidesIntro }}
              </p>
            </header>
            
            <div class="related-grid">
              <a class="related-card glass glass-hover reveal" *ngFor="let entry of relatedPages(); let i = index" [class.delay-100]="(i % 3) === 1" [class.delay-200]="(i % 3) === 2" [href]="pathFor(entry.pageKey)">
                <span class="eyebrow" style="font-size: 0.75rem;">{{ entry.data.shortName || entry.data.platformName }}</span>
                <strong class="text-gradient-strong">{{ entry.data.linkTitle || entry.data.title }}</strong>
              </a>
            </div>
          </div>
        </section>

        <section class="section" *ngIf="data?.faq?.length">
          <div class="container">
            <header class="section-header">
              <p class="eyebrow">FAQ</p>
              <h2>{{ ui.faqTitle }}</h2>
            </header>
            
            <div class="faq-list">
              <details class="faq-details glass reveal" *ngFor="let item of data?.faq; let i = index" [class.delay-100]="(i % 2) === 1">
                <summary class="faq-summary">
                  <span>{{ item.question }}</span>
                  <span class="icon">+</span>
                </summary>
                <div class="faq-content">
                  <p class="text-secondary">{{ item.answer }}</p>
                </div>
              </details>
            </div>
          </div>
        </section>
      </div>
    </qs-shell>
  `,
  styles: [`
    .platform-hero {
      padding: 6rem 0 3rem;
    }
    .platform-hero-grid {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 3rem;
      align-items: center;
    }
    .breadcrumbs {
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .breadcrumb-link {
      color: var(--text-secondary);
      transition: color 0.2s;
    }
    .breadcrumb-link:hover {
      color: var(--text-primary);
    }
    .breadcrumbs .divider {
      color: var(--text-tertiary);
    }
    .active-crumb {
      color: var(--text-primary);
      font-weight: 500;
    }
    .platform-hero-content h1 {
      font-size: clamp(2rem, 5vw, 3.5rem);
      margin: 0.75rem 0 1.25rem;
      line-height: 1.2;
    }
    .platform-hero-content .desc {
      font-size: 1.125rem;
      margin-bottom: 2rem;
    }
    .hero-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .platform-hero-aside {
      padding: 3rem;
    }
    .platform-hero-aside h2 {
      font-size: 1.75rem;
      margin-bottom: 1rem;
    }
    .platform-stat-bar {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.75rem;
      margin-top: 1.5rem;
    }
    .platform-stat {
      min-height: 4.25rem;
      display: grid;
      place-items: center;
      padding: 0.85rem 1rem;
      border: 1px solid #2b3545;
      border-radius: 12px;
      background: #171c24;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.22);
      text-align: center;
    }
    .platform-stat span {
      color: var(--text-primary);
      font-family: var(--font-heading);
      font-size: 0.95rem;
      font-weight: 850;
    }
    .check-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .check-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .check-icon {
      color: var(--accent-cyan);
      font-weight: bold;
      font-size: 1.1rem;
    }

    .two-col-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
    }
    .guide-card {
      padding: 2.5rem;
    }
    .guide-card h2 {
      font-size: 1.75rem;
      margin-bottom: 1.5rem;
    }
    .guide-card ol, .guide-card ul {
      padding-left: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .numbered-steps {
      padding-left: 0 !important;
      list-style: none;
      gap: 0.85rem !important;
    }
    .numbered-steps li {
      display: grid;
      grid-template-columns: 2rem minmax(0, 1fr);
      gap: 0.85rem;
      align-items: start;
      padding: 0.85rem;
      border: 1px solid #2b3545;
      border-radius: 12px;
      background: #1d2430;
    }
    .step-index {
      display: grid;
      place-items: center;
      width: 2rem;
      height: 2rem;
      border-radius: 8px;
      background: linear-gradient(135deg, #7c5cfc, #0ea5e9);
      color: white;
      font-weight: 900;
    }
    .feature-list {
      list-style: none;
      padding-left: 0 !important;
    }

    .accent-box {
      margin-top: 2rem;
      padding: 1.5rem;
      border: 1px dashed var(--accent-cyan);
      background: rgba(6, 182, 212, 0.04);
      text-align: center;
    }

    /* Keywords */
    .keywords-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
    }
    .keyword-card {
      padding: 2.5rem;
    }
    .keyword-card h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    /* Related platform links */
    .related-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1.5rem;
      margin-top: 2.5rem;
    }
    .related-card {
      padding: 1.75rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      justify-content: center;
    }
    .related-card strong {
      font-size: 1.15rem;
    }
    .article-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1rem;
      margin-top: 2rem;
    }
    .article-card {
      min-height: 15rem;
      padding: 1.5rem;
      border-radius: 14px;
      text-decoration: none;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .article-card strong {
      color: var(--text-primary);
      font-size: 1.08rem;
      line-height: 1.35;
    }
    .article-card .text-secondary {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      font-size: 0.92rem;
      line-height: 1.55;
    }
    .article-link {
      margin-top: auto;
      color: var(--accent-cyan);
      font-weight: 800;
      font-size: 0.9rem;
    }

    /* FAQ accordion */
    .faq-list {
      max-width: 800px;
      margin: 2.5rem auto 0;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .faq-details {
      overflow: hidden;
    }
    .faq-summary {
      padding: 1.25rem 1.75rem;
      font-family: var(--font-heading);
      font-size: 1.15rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      list-style: none;
    }
    .faq-summary::-webkit-details-marker {
      display: none;
    }
    .faq-summary .icon {
      font-size: 1.5rem;
      color: var(--accent-cyan);
      transition: transform 0.3s var(--ease-out);
    }
    .faq-details[open] .faq-summary .icon {
      transform: rotate(45deg);
    }
    .faq-content {
      padding: 0 1.75rem 1.5rem;
    }

    @media (max-width: 992px) {
      .platform-hero-grid, .two-col-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      .platform-hero-aside {
        padding: 2rem;
      }
      .platform-stat-bar {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PlatformComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);

  protected locale: Locale = 'en';
  protected pageKey: PageKey = 'quizSolverAi';
  protected data = pageData('quizSolverAi', 'en');
  protected platformLabel = 'AI quiz solver';
  protected platformIntro = '';
  protected whatItDoesTitle = '';
  protected ui = PLATFORM_UI.en;
  protected storeUrl = CHROME_WEB_STORE_URL;

  ngOnInit(): void {
    this.locale = (this.route.snapshot.data['locale'] || 'en') as Locale;
    this.ui = PLATFORM_UI[this.locale] || PLATFORM_UI.en;
    this.pageKey = this.route.snapshot.data['pageKey'] as PageKey;
    this.data = pageData(this.pageKey, this.locale) || {};
    this.platformLabel = this.data?.shortName || this.data?.platformName || 'AI quiz solver';
    this.platformIntro = this.ui.intro(this.platformLabel);
    this.whatItDoesTitle = this.ui.whatItDoes(this.platformLabel);
    this.seo.applyPage(this.pageKey, this.locale);
  }

  protected pathFor(pageKey: PageKey): string {
    return pathFor(pageKey, this.locale);
  }

  protected relatedPages(): Array<{ pageKey: PageKey; data: any }> {
    return platformEntries(this.locale).filter((entry) => entry.pageKey !== this.pageKey);
  }

  protected relatedArticles(): BlogPost[] {
    const category = this.articleCategory();
    return BLOG_POSTS
      .filter(post => post.locale === this.locale && post.category === category)
      .slice(0, 3);
  }

  protected postUrl(post: BlogPost): string {
    return pathFor('blogPost', this.locale).replace(':slug', post.slug);
  }

  private articleCategory(): string {
    if (this.pageKey === 'kahoot') return 'kahoot';
    if (this.pageKey === 'demo') return 'study-workflows';
    if (this.pageKey === 'quizSolverAi') return 'study-workflows';
    return 'platform-guides';
  }
}
