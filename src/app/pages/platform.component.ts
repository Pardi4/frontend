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

type PlatformDetail = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  typesTitle: string;
  types: string[];
};

const PLATFORM_CONTEXT: Partial<Record<PageKey, { en: string; pl: string }>> = {
  quizSolverAi: {
    en: 'QuizSolver is built for messy real quiz pages, not only clean demo forms. It checks the visible question, nearby answer controls, images, headings and page context before it sends a compact request to AI.',
    pl: 'QuizSolver jest projektowany pod prawdziwe, nieidealne strony z quizami, a nie tylko proste formularze demo. Sprawdza widoczne pytanie, pobliskie odpowiedzi, obrazy, nagłówki i kontekst strony zanim wyśle zwięzłe zapytanie do AI.'
  },
  testportal: {
    en: 'Testportal often combines timers, one-question screens, radio answers, checkboxes and images inside a focused test interface. QuizSolver keeps the work in the browser side panel so the question can be reviewed without leaving the test tab.',
    pl: 'Testportal często łączy timer, widok jednego pytania, odpowiedzi radio, checkboxy i obrazy w skoncentrowanym interfejsie testu. QuizSolver trzyma pracę w panelu przeglądarki, żeby dało się sprawdzić pytanie bez opuszczania karty testu.'
  },
  moodle: {
    en: 'Moodle quizzes can mix classic multiple choice, multi-answer questions, cloze-style content, math notation, attachments and long course-specific wording. QuizSolver focuses on the active question block and keeps the answer context together.',
    pl: 'Quizy Moodle potrafią mieszać pytania jednokrotnego wyboru, wielokrotnego wyboru, cloze, notację matematyczną, załączniki i długie treści kursowe. QuizSolver skupia się na aktywnym bloku pytania i zachowuje kontekst odpowiedzi razem.'
  },
  canvas: {
    en: 'Canvas LMS can show quizzes through classic quizzes, New Quizzes and embedded LTI tools. QuizSolver reads the visible assessment area first, then FocusScan covers frames, images or custom layouts when the regular DOM is not enough.',
    pl: 'Canvas LMS może pokazywać testy przez Classic Quizzes, New Quizzes i osadzone narzędzia LTI. QuizSolver najpierw czyta widoczny obszar testu, a FocusScan pomaga przy ramkach, obrazach i układach, których zwykły DOM nie wystarcza.'
  },
  googleForms: {
    en: 'Google Forms quizzes use sections, required fields, radio groups, checkboxes, dropdowns, short answers and image prompts. QuizSolver keeps each visible form question separate so options from the next section do not leak into the current answer.',
    pl: 'Quizy Google Forms używają sekcji, pól wymaganych, grup radio, checkboxów, list rozwijanych, krótkich odpowiedzi i pytań z obrazami. QuizSolver rozdziela widoczne pytania, żeby opcje z kolejnej sekcji nie mieszały się z aktualną odpowiedzią.'
  },
  microsoftForms: {
    en: 'Microsoft Forms can render questions as cards with ratings, choices, text fields and media blocks. QuizSolver reads the active card structure and uses FocusScan when a school or company theme changes the default layout.',
    pl: 'Microsoft Forms potrafi renderować pytania jako karty z ocenami, wyborami, polami tekstowymi i multimediami. QuizSolver czyta strukturę aktywnej karty i używa FocusScan, gdy motyw szkoły lub firmy zmienia domyślny układ.'
  },
  blackboard: {
    en: 'Blackboard assessments vary between Classic and Ultra interfaces, long question pools and embedded course content. QuizSolver targets the visible test item and keeps explanations useful for reviewing the concept later.',
    pl: 'Testy Blackboard różnią się między widokiem Classic i Ultra, pulami pytań oraz treścią osadzoną z kursu. QuizSolver celuje w widoczny element testu i zapisuje wyjaśnienie tak, żeby później dało się powtórzyć pojęcie.'
  },
  quizlet: {
    en: 'Quizlet is often used for flashcards, definitions, matching and written practice. QuizSolver treats the prompt and candidate answer as a study pair, which helps verify meaning instead of only guessing the next tile.',
    pl: 'Quizlet jest często używany do fiszek, definicji, dopasowań i odpowiedzi pisemnych. QuizSolver traktuje pytanie i możliwą odpowiedź jako parę do nauki, co pomaga sprawdzić znaczenie zamiast tylko zgadywać kolejny kafelek.'
  },
  socrative: {
    en: 'Socrative quizzes are live and move quickly, so the extension prioritizes the currently visible prompt and answer controls. The goal is fast feedback while still keeping the final choice under the student’s control.',
    pl: 'Quizy Socrative są prowadzone na żywo i często idą szybko, dlatego rozszerzenie priorytetowo traktuje aktualnie widoczne pytanie oraz kontrolki odpowiedzi. Celem jest szybka podpowiedź bez odbierania użytkownikowi finalnej decyzji.'
  },
  kahoot: {
    en: 'Kahoot is different because some games show the question on the player screen while others show only colored answer tiles. QuizSolver supports both visible-question mode and Quiz ID answer-bank mode for hidden-question games.',
    pl: 'Kahoot jest inny, bo część gier pokazuje pytanie na ekranie gracza, a część tylko kolorowe kafelki odpowiedzi. QuizSolver obsługuje tryb widocznego pytania oraz bank odpowiedzi po Quiz ID dla gier z ukrytym pytaniem.'
  },
  quizizz: {
    en: 'Quizizz can appear as live games, homework, practice sets and meme-heavy question cards. QuizSolver reads the visible prompt, options and media so the answer suggestion stays tied to the exact card on screen.',
    pl: 'Quizizz może działać jako gra live, zadanie domowe, zestaw ćwiczeń albo karta pytania z multimediami. QuizSolver czyta widoczną treść, opcje i media, żeby sugestia odpowiedzi była powiązana z dokładnie tą kartą na ekranie.'
  }
};

const DEFAULT_TYPES_EN = [
  'Single-choice and multiple-choice answers',
  'Typed short answers and dropdown fields',
  'Question images, diagrams and screenshots through FocusScan',
  'Long prompts with answer explanations saved to history'
];

const DEFAULT_TYPES_PL = [
  'Pytania jednokrotnego i wielokrotnego wyboru',
  'Krótkie odpowiedzi tekstowe i listy rozwijane',
  'Obrazy, wykresy i zrzuty ekranu przez FocusScan',
  'Długie treści z wyjaśnieniami zapisywanymi w historii'
];

function buildPlatformDetail(pageKey: PageKey, locale: Locale, platform: string): PlatformDetail {
  const isPl = locale === 'pl';
  const context = PLATFORM_CONTEXT[pageKey]?.[isPl ? 'pl' : 'en']
    || (isPl
      ? `QuizSolver analizuje widoczny kontekst na ${platform}, a nie tylko pierwszy nagłówek znaleziony na stronie. Dzięki temu łatwiej uniknąć sytuacji, w której do AI trafia sam licznik typu "Pytanie 5" zamiast właściwej treści.`
      : `QuizSolver analyzes the visible context on ${platform}, not just the first heading found on the page. That helps avoid sending a generic label such as "Question 5" instead of the real prompt.`);

  return {
    eyebrow: isPl ? 'Wykrywanie pytań' : 'Question detection',
    title: isPl ? `Jak QuizSolver działa na ${platform}` : `How QuizSolver works on ${platform}`,
    paragraphs: [
      context,
      isPl
        ? 'Parser porównuje treść pytania z pobliskimi odpowiedziami, kontrolkami formularza, obrazami i widocznym układem strony. Jeżeli standardowe wykrywanie nie zwraca sensownego pytania, FocusScan pozwala ręcznie zaznaczyć dokładny fragment ekranu i ponowić analizę bez mieszania treści z innych części strony.'
        : 'The parser compares the question text with nearby answer choices, form controls, images and the visible page layout. If standard detection does not return a meaningful question, FocusScan lets you select the exact screen region and retry without mixing content from other parts of the page.',
      isPl
        ? 'Każde zapisane pytanie może trafić do historii razem z odpowiedzią, wyjaśnieniem i notatką. Dzięki temu strona platformy nie kończy się na jednorazowej podpowiedzi: z rozwiązanych zadań powstaje prywatna baza powtórek i quizów treningowych.'
        : 'Every saved question can go to history with the answer, explanation and your own note. That means the platform workflow does not stop at a one-time hint: solved tasks become a private review library and practice quiz source.'
    ],
    typesTitle: isPl ? `Obsługiwane pytania na ${platform}` : `Supported question types on ${platform}`,
    types: isPl ? DEFAULT_TYPES_PL : DEFAULT_TYPES_EN
  };
}

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
    featuresTitle: 'Supported question types and signals',
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
    featuresTitle: 'Obsługiwane typy pytań i sygnały',
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

        <section class="section platform-detail-section">
          <div class="container platform-detail-grid">
            <article class="platform-detail-copy reveal">
              <p class="eyebrow">{{ detail.eyebrow }}</p>
              <h2>{{ detail.title }}</h2>
              <p class="text-secondary" *ngFor="let paragraph of detail.paragraphs">{{ paragraph }}</p>
            </article>
            <aside class="question-types-panel glass reveal delay-100">
              <h2>{{ detail.typesTitle }}</h2>
              <ul class="question-types-list">
                <li *ngFor="let type of detail.types">
                  <span class="type-dot" aria-hidden="true"></span>
                  <span>{{ type }}</span>
                </li>
              </ul>
            </aside>
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
    .platform-detail-section {
      padding-top: 2rem;
    }
    .platform-detail-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
      gap: 2rem;
      align-items: start;
    }
    .platform-detail-copy h2,
    .question-types-panel h2 {
      font-size: 1.75rem;
      margin-bottom: 1rem;
    }
    .platform-detail-copy p {
      font-size: 1rem;
      line-height: 1.75;
      margin-bottom: 1rem;
    }
    .question-types-panel {
      padding: 2rem;
    }
    .question-types-list {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .question-types-list li {
      display: grid;
      grid-template-columns: 0.7rem minmax(0, 1fr);
      gap: 0.75rem;
      align-items: start;
      color: var(--text-secondary);
      line-height: 1.55;
    }
    .type-dot {
      width: 0.55rem;
      height: 0.55rem;
      margin-top: 0.45rem;
      border-radius: 999px;
      background: var(--accent-cyan);
      box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.12);
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
      .platform-hero-grid, .platform-detail-grid, .two-col-grid {
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
  protected detail = buildPlatformDetail('quizSolverAi', 'en', 'AI quiz solver');

  ngOnInit(): void {
    this.locale = (this.route.snapshot.data['locale'] || 'en') as Locale;
    this.ui = PLATFORM_UI[this.locale] || PLATFORM_UI.en;
    this.pageKey = this.route.snapshot.data['pageKey'] as PageKey;
    this.data = pageData(this.pageKey, this.locale) || {};
    this.platformLabel = this.data?.shortName || this.data?.platformName || 'AI quiz solver';
    this.platformIntro = this.ui.intro(this.platformLabel);
    this.whatItDoesTitle = this.ui.whatItDoes(this.platformLabel);
    this.detail = buildPlatformDetail(this.pageKey, this.locale, this.platformLabel);
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
