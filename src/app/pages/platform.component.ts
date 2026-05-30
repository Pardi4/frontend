import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '../seo.service';
import { Locale, PageKey, pageData, pathFor, platformEntries } from '../site-content';
import { ShellComponent } from './shell.component';

type PlatformUi = {
  install: string;
  related: string;
  whatItDoes: string;
  aiAnswers: string;
  explanations: string;
  notes: string;
  sharing: string;
  howToStart: string;
  featuresTitle: string;
  platforms: string;
  otherGuides: string;
  guidesIntro: string;
  faqTitle: string;
  intro: (platform: string) => string;
};

const PLATFORM_UI: Record<Locale, PlatformUi> = {
  en: {
    install: 'Install extension',
    related: 'See related',
    whatItDoes: 'What QuizSolver does',
    aiAnswers: 'AI answer suggestions',
    explanations: 'Short explanations',
    notes: 'Notes and history quiz',
    sharing: 'Shareable quizzes',
    howToStart: 'How to start',
    featuresTitle: 'Features in this workflow',
    platforms: 'Platforms',
    otherGuides: 'Other QuizSolver guides',
    guidesIntro: 'Each platform has its own page so users land in the right context immediately.',
    faqTitle: 'Questions about this workflow',
    intro: platform => `QuizSolver helps with permitted ${platform} practice workflows: it detects questions, saves history, and lets you review them later.`
  },
  pl: {
    install: 'Zainstaluj rozszerzenie',
    related: 'Zobacz podobne',
    whatItDoes: 'Co robi QuizSolver?',
    aiAnswers: 'Sugestie odpowiedzi AI',
    explanations: 'Krótkie wyjaśnienia',
    notes: 'Notatki i quiz z historii',
    sharing: 'Udostępnianie quizu z pytań',
    howToStart: 'Jak zacząć',
    featuresTitle: 'Funkcje w tym workflow',
    platforms: 'Platformy',
    otherGuides: 'Inne poradniki QuizSolver',
    guidesIntro: 'Każda platforma ma osobną stronę, żeby użytkownik od razu widział właściwy kontekst.',
    faqTitle: 'Pytania o ten workflow',
    intro: platform => `QuizSolver pomaga przy dozwolonych ćwiczeniach i powtórkach w stylu ${platform}: wykrywa pytania, zapisuje historię i pozwala wrócić do nich później.`
  },
  de: {
    install: 'Erweiterung installieren',
    related: 'Ähnliche ansehen',
    whatItDoes: 'Was QuizSolver macht',
    aiAnswers: 'KI-Antwortvorschläge',
    explanations: 'Kurze Erklärungen',
    notes: 'Notizen und Quiz aus der Historie',
    sharing: 'Teilbare Quizze',
    howToStart: 'So startest du',
    featuresTitle: 'Funktionen in diesem Workflow',
    platforms: 'Plattformen',
    otherGuides: 'Weitere QuizSolver-Guides',
    guidesIntro: 'Jede Plattform hat eine eigene Seite, damit Nutzer sofort im richtigen Kontext landen.',
    faqTitle: 'Fragen zu diesem Workflow',
    intro: platform => `QuizSolver hilft bei erlaubten ${platform}-Übungen: Es erkennt Fragen, speichert Verlauf und erleichtert spätere Wiederholung.`
  },
  es: {
    install: 'Instalar extensión',
    related: 'Ver similares',
    whatItDoes: 'Qué hace QuizSolver',
    aiAnswers: 'Sugerencias de respuesta con IA',
    explanations: 'Explicaciones breves',
    notes: 'Notas y quiz del historial',
    sharing: 'Quizzes compartibles',
    howToStart: 'Cómo empezar',
    featuresTitle: 'Funciones de este flujo',
    platforms: 'Plataformas',
    otherGuides: 'Más guías de QuizSolver',
    guidesIntro: 'Cada plataforma tiene su propia página para que el usuario llegue al contexto correcto.',
    faqTitle: 'Preguntas sobre este flujo',
    intro: platform => `QuizSolver ayuda en prácticas permitidas de ${platform}: detecta preguntas, guarda historial y permite repasarlas después.`
  },
  fr: {
    install: 'Installer l’extension',
    related: 'Voir similaires',
    whatItDoes: 'Ce que fait QuizSolver',
    aiAnswers: 'Suggestions de réponses IA',
    explanations: 'Explications courtes',
    notes: 'Notes et quiz depuis l’historique',
    sharing: 'Quiz partageables',
    howToStart: 'Comment commencer',
    featuresTitle: 'Fonctions de ce workflow',
    platforms: 'Plateformes',
    otherGuides: 'Autres guides QuizSolver',
    guidesIntro: 'Chaque plateforme a sa propre page pour placer l’utilisateur dans le bon contexte.',
    faqTitle: 'Questions sur ce workflow',
    intro: platform => `QuizSolver aide dans les exercices autorisés ${platform} : il détecte les questions, enregistre l’historique et facilite la révision.`
  },
  it: {
    install: 'Installa estensione',
    related: 'Vedi simili',
    whatItDoes: 'Cosa fa QuizSolver',
    aiAnswers: 'Suggerimenti AI',
    explanations: 'Spiegazioni brevi',
    notes: 'Note e quiz dalla cronologia',
    sharing: 'Quiz condivisibili',
    howToStart: 'Come iniziare',
    featuresTitle: 'Funzioni in questo workflow',
    platforms: 'Piattaforme',
    otherGuides: 'Altre guide QuizSolver',
    guidesIntro: 'Ogni piattaforma ha una pagina dedicata per mostrare subito il contesto corretto.',
    faqTitle: 'Domande su questo workflow',
    intro: platform => `QuizSolver aiuta negli esercizi consentiti su ${platform}: rileva domande, salva la cronologia e permette di ripassare.`
  },
  uk: {
    install: 'Встановити розширення',
    related: 'Схожі сторінки',
    whatItDoes: 'Що робить QuizSolver',
    aiAnswers: 'AI-підказки відповідей',
    explanations: 'Короткі пояснення',
    notes: 'Нотатки й квіз з історії',
    sharing: 'Квізи для поширення',
    howToStart: 'Як почати',
    featuresTitle: 'Функції цього сценарію',
    platforms: 'Платформи',
    otherGuides: 'Інші гайди QuizSolver',
    guidesIntro: 'Кожна платформа має окрему сторінку, щоб користувач одразу бачив потрібний контекст.',
    faqTitle: 'Питання про цей сценарій',
    intro: platform => `QuizSolver допомагає з дозволеними вправами ${platform}: знаходить питання, зберігає історію і допомагає повторювати.`
  }
};

@Component({
  standalone: true,
  imports: [CommonModule, ShellComponent],
  template: `
    <qs-shell [locale]="locale" [pageKey]="pageKey">
      <main class="seo-page" id="main-content">
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
                <a class="btn btn-primary btn-lg" [href]="pathFor('credits')">
                  {{ ui.install }}
                </a>
                <a class="btn btn-outline btn-lg" href="#platform-guides">
                  {{ ui.related }}
                </a>
              </div>
            </div>
            
            <aside class="platform-hero-aside glass">
              <h2>{{ ui.whatItDoes }}</h2>
              <p class="text-secondary" style="margin-bottom: 1.5rem;">{{ platformIntro }}</p>
              <ul class="check-list">
                <li class="check-item"><span class="check-icon">✓</span> {{ ui.aiAnswers }}</li>
                <li class="check-item"><span class="check-icon">✓</span> {{ ui.explanations }}</li>
                <li class="check-item"><span class="check-icon">✓</span> {{ ui.notes }}</li>
                <li class="check-item"><span class="check-icon">✓</span> {{ ui.sharing }}</li>
              </ul>
            </aside>
          </div>
        </section>

        <section class="section">
          <div class="container two-col-grid">
            <article class="guide-card glass glass-hover reveal">
              <h2>{{ data?.stepsTitle || ui.howToStart }}</h2>
              <ol>
                <li *ngFor="let step of data?.steps" class="text-secondary">{{ step }}</li>
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
      </main>
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
  protected ui = PLATFORM_UI.en;

  ngOnInit(): void {
    this.locale = (this.route.snapshot.data['locale'] || 'en') as Locale;
    this.ui = PLATFORM_UI[this.locale] || PLATFORM_UI.en;
    this.pageKey = this.route.snapshot.data['pageKey'] as PageKey;
    this.data = pageData(this.pageKey, this.locale) || {};
    this.platformLabel = this.data?.shortName || this.data?.platformName || 'AI quiz solver';
    this.platformIntro = this.ui.intro(this.platformLabel);
    this.seo.applyPage(this.pageKey, this.locale);
  }

  protected pathFor(pageKey: PageKey): string {
    return pathFor(pageKey, this.locale);
  }

  protected relatedPages(): Array<{ pageKey: PageKey; data: any }> {
    return platformEntries(this.locale).filter((entry) => entry.pageKey !== this.pageKey);
  }
}
