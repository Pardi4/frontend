import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnDestroy, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '../seo.service';
import { Locale } from '../site-content';
import { ShellComponent } from './shell.component';

type DemoQuestionType = 'radio' | 'hidden' | 'text' | 'matching' | 'selected';

interface DemoQuestion {
  id: string;
  type: DemoQuestionType;
  kicker: string;
  title: string;
  instruction: string;
  question: string;
  options?: string[];
  prompts?: string[];
  placeholder?: string;
  correctText: string;
}

interface DemoCopy {
  eyebrow: string;
  title: string;
  lead: string;
  install: string;
  openStore: string;
  demoBadge: string;
  localBadge: string;
  mapTitle: string;
  mapText: string;
  prev: string;
  next: string;
  restart: string;
  startTour: string;
  selectText: string;
  selectedTip: string;
  popupTitle: string;
  popupSteps: string[];
  questions: DemoQuestion[];
}

const COPY: Record<Locale, DemoCopy> = {
  en: {
    eyebrow: 'Interactive onboarding',
    title: 'Try QuizSolver on a safe demo quiz',
    lead: 'Five predefined questions show how the extension works. This page never consumes credits, so you can try each mode safely.',
    install: 'Install extension',
    openStore: 'Open Chrome Web Store',
    demoBadge: 'No credits used',
    localBadge: 'Guided practice',
    mapTitle: 'How to use this demo',
    mapText: 'Start the extension tutorial, then open the QuizSolver popup on this page. You can also use Alt+Q to open the quick overlay.',
    prev: 'Previous',
    next: 'Next question',
    restart: 'Restart demo',
    startTour: 'Start extension tutorial',
    selectText: 'Select demo question text',
    selectedTip: 'Select the question text, open the quick overlay, then click Solve selected text.',
    popupTitle: 'Popup flow',
    popupSteps: [
      'Click the QS extension icon in Chrome.',
      'Use Solve current page for standard questions.',
      'Turn on Hint mode to test hidden mode.',
      'Open Quick overlay or press Alt+Q.',
      'Select text and solve only that selection.'
    ],
    questions: [
      {
        id: 'demo-radio',
        type: 'radio',
        kicker: 'Step 1',
        title: 'Standard solve',
        instruction: 'Click Solve current page in the extension popup. QuizSolver should choose the correct option.',
        question: 'What should you take when it is raining outside?',
        options: ['Sunglasses', 'Umbrella', 'Beach towel', 'Ice skates'],
        correctText: 'Umbrella'
      },
      {
        id: 'demo-hidden',
        type: 'hidden',
        kicker: 'Step 2',
        title: 'Hidden mode',
        instruction: 'Turn on Hint mode in the popup before solving. The answer should be hinted instead of clicked.',
        question: 'Which item do people usually keep in a fridge?',
        options: ['Blanket', 'Milk', 'Notebook', 'Keys'],
        correctText: 'Milk'
      },
      {
        id: 'demo-text',
        type: 'text',
        kicker: 'Step 3',
        title: 'Typed answer',
        instruction: 'Solve the page and the extension will fill the text input with a local demo answer.',
        question: 'How many days are in a normal week?',
        placeholder: 'Type the answer here',
        correctText: '7'
      },
      {
        id: 'demo-matching',
        type: 'matching',
        kicker: 'Step 4',
        title: 'Dropdown and matching',
        instruction: 'This step shows multi-select matching. QuizSolver fills each dropdown with the matching concept.',
        question: 'Match each everyday activity with the place where it usually happens.',
        prompts: ['Cooking', 'Sleeping', 'Shopping'],
        options: ['Kitchen', 'Bedroom', 'Store'],
        correctText: 'Cooking = Kitchen, Sleeping = Bedroom, Shopping = Store'
      },
      {
        id: 'demo-selected',
        type: 'selected',
        kicker: 'Step 5',
        title: 'Quick overlay and selected text',
        instruction: 'Select the question text, press Alt+Q or open Quick overlay, then solve selected text.',
        question: 'Which QuizSolver tool opens a small window with fast actions?',
        options: ['Quick overlay', 'Credit checkout', 'Admin panel', 'Browser history'],
        correctText: 'Quick overlay'
      }
    ]
  },
  pl: {
    eyebrow: 'Interaktywny onboarding',
    title: 'Przetestuj QuizSolver na bezpiecznym demo',
    lead: 'Pięć predefiniowanych pytań pokazuje, jak działa rozszerzenie. Ta strona nie zużywa kredytów, więc możesz spokojnie przetestować każdy tryb.',
    install: 'Zainstaluj rozszerzenie',
    openStore: 'Otwórz Chrome Web Store',
    demoBadge: 'Bez zużycia kredytów',
    localBadge: 'Tryb treningowy',
    mapTitle: 'Jak korzystać z demo',
    mapText: 'Uruchom tutorial rozszerzenia, a potem otwórz popup QuizSolver na tej stronie. Możesz też nacisnąć Alt+Q, żeby otworzyć szybki overlay.',
    prev: 'Poprzednie',
    next: 'Następne pytanie',
    restart: 'Zacznij od nowa',
    startTour: 'Uruchom tutorial w rozszerzeniu',
    selectText: 'Zaznacz tekst pytania',
    selectedTip: 'Zaznacz tekst pytania, otwórz szybki overlay i kliknij Solve selected text.',
    popupTitle: 'Co klikać w popupie',
    popupSteps: [
      'Kliknij ikonę QS w Chrome.',
      'Użyj Solve current page przy zwykłym pytaniu.',
      'Włącz Hint mode, żeby sprawdzić tryb ukryty.',
      'Otwórz Quick overlay albo naciśnij Alt+Q.',
      'Zaznacz tekst i rozwiąż tylko zaznaczenie.'
    ],
    questions: [
      {
        id: 'demo-radio',
        type: 'radio',
        kicker: 'Krok 1',
        title: 'Zwykłe rozwiązywanie',
        instruction: 'Kliknij Solve current page w popupie rozszerzenia. QuizSolver powinien zaznaczyć poprawną opcję.',
        question: 'Co warto zabrać, gdy na zewnątrz pada deszcz?',
        options: ['Okulary przeciwsłoneczne', 'Parasol', 'Ręcznik plażowy', 'Łyżwy'],
        correctText: 'Parasol'
      },
      {
        id: 'demo-hidden',
        type: 'hidden',
        kicker: 'Krok 2',
        title: 'Tryb ukryty',
        instruction: 'Włącz Hint mode w popupie przed rozwiązaniem. Odpowiedź zostanie podpowiedziana zamiast kliknięta.',
        question: 'Co najczęściej trzymamy w lodówce, żeby było chłodne?',
        options: ['Koc', 'Mleko', 'Zeszyt', 'Klucze'],
        correctText: 'Mleko'
      },
      {
        id: 'demo-text',
        type: 'text',
        kicker: 'Krok 3',
        title: 'Odpowiedź wpisywana',
        instruction: 'Rozwiąż stronę, a rozszerzenie wypełni pole tekstowe lokalną odpowiedzią demo.',
        question: 'Ile dni ma zwykły tydzień?',
        placeholder: 'Wpisz odpowiedź tutaj',
        correctText: '7'
      },
      {
        id: 'demo-matching',
        type: 'matching',
        kicker: 'Krok 4',
        title: 'Selecty i dopasowanie',
        instruction: 'Ten krok pokazuje dopasowywanie wielu selectów. QuizSolver wypełnia każdy select pasującym pojęciem.',
        question: 'Dopasuj codzienną czynność do miejsca, w którym zwykle się odbywa.',
        prompts: ['Gotowanie', 'Spanie', 'Zakupy'],
        options: ['Kuchnia', 'Sypialnia', 'Sklep'],
        correctText: 'Gotowanie = Kuchnia, Spanie = Sypialnia, Zakupy = Sklep'
      },
      {
        id: 'demo-selected',
        type: 'selected',
        kicker: 'Krok 5',
        title: 'Szybki overlay i zaznaczony tekst',
        instruction: 'Zaznacz tekst pytania, naciśnij Alt+Q albo otwórz Quick overlay, a potem rozwiąż zaznaczony tekst.',
        question: 'Które narzędzie QuizSolver otwiera małe okno z szybkimi akcjami?',
        options: ['Szybki overlay', 'Płatność za kredyty', 'Panel admina', 'Historia przeglądarki'],
        correctText: 'Szybki overlay'
      }
    ]
  }
};

@Component({
  standalone: true,
  imports: [CommonModule, ShellComponent],
  template: `
    <qs-shell [locale]="locale" pageKey="demo">
      <main id="main-content" class="demo-page" data-qs-demo-root="onboarding">
        <section class="demo-hero">
          <div class="container demo-hero-grid">
            <div class="demo-copy">
              <p class="eyebrow">{{ copy.eyebrow }}</p>
              <h1>{{ copy.title }}</h1>
              <p class="demo-lead">{{ copy.lead }}</p>
              <div class="demo-badges" aria-label="Demo guarantees">
                <span>{{ copy.demoBadge }}</span>
                <span>{{ copy.localBadge }}</span>
              </div>
              <div class="demo-actions">
                <button class="btn btn-primary btn-lg" type="button" data-qs-tour-start (click)="startGuidedTour()">{{ copy.startTour }}</button>
              </div>
            </div>

            <aside class="demo-map glass">
              <h2>{{ copy.mapTitle }}</h2>
              <p>{{ copy.mapText }}</p>
              <ol>
                <li *ngFor="let step of copy.popupSteps; let i = index" [class.active]="i === current()">
                  <span>{{ i + 1 }}</span>
                  <p>{{ step }}</p>
                </li>
              </ol>
            </aside>
          </div>
        </section>

        <section class="container demo-workspace" *ngIf="currentQuestion() as question">
          <aside class="demo-side glass">
            <p class="eyebrow">{{ copy.popupTitle }}</p>
            <h2>{{ question.title }}</h2>
            <p>{{ question.instruction }}</p>
            <div class="mock-popup" aria-hidden="true">
              <div class="mock-popup-head">
                <strong>QS</strong>
                <span>QuizSolver</span>
              </div>
              <div class="mock-action primary" data-qs-tour="mock-solve">Solve current page</div>
              <div class="mock-action">FocusScan</div>
              <div class="mock-action" data-qs-tour="mock-overlay">Quick overlay</div>
              <div class="mock-toggle" [class.on]="question.type === 'hidden'" data-qs-tour="mock-hint">
                <span>Hint mode</span><i></i>
              </div>
            </div>
          </aside>

          <article class="demo-card glass" [attr.data-qs-demo-question]="question.id" data-qs-tour="question-card">
            <div class="question-top">
              <div>
                <p class="eyebrow">{{ question.kicker }}</p>
                <h2 class="question-text" data-qs-demo-question-text [attr.data-qs-demo-selectable]="question.type === 'selected' ? 'true' : null">
                  {{ question.question }}
                </h2>
              </div>
              <span class="question-count">{{ current() + 1 }} / {{ copy.questions.length }}</span>
            </div>

            <fieldset class="demo-options" *ngIf="question.type === 'radio' || question.type === 'hidden' || question.type === 'selected'">
              <legend class="sr-only">{{ question.question }}</legend>
              <label class="demo-option" *ngFor="let option of question.options; let i = index">
                <input type="radio" [name]="question.id" [value]="i">
                <span>{{ option }}</span>
              </label>
            </fieldset>

            <label class="text-answer" *ngIf="question.type === 'text'">
              <span>{{ locale === 'pl' ? 'Twoja odpowiedź' : 'Your answer' }}</span>
              <input type="text" [name]="question.id + '-answer'" [placeholder]="question.placeholder || ''">
            </label>

            <div class="matching-board" *ngIf="question.type === 'matching'">
              <label class="match-row" *ngFor="let prompt of question.prompts; let i = index">
                <span>{{ prompt }}</span>
                <select [name]="question.id + '-' + i">
                  <option value="">{{ locale === 'pl' ? 'Wybierz' : 'Choose' }}</option>
                  <option *ngFor="let option of question.options" [value]="option">{{ option }}</option>
                </select>
              </label>
            </div>

            <div class="selected-tip" *ngIf="question.type === 'selected'">
              <button class="btn btn-outline btn-sm" type="button" data-qs-tour="select-text" (click)="selectQuestionText()">{{ copy.selectText }}</button>
              <p>{{ copy.selectedTip }}</p>
            </div>

            <div class="demo-nav">
              <button class="btn btn-outline" type="button" (click)="previous()" [disabled]="current() === 0">{{ copy.prev }}</button>
              <button class="btn btn-primary" type="button" data-qs-tour="next" (click)="next()">
                {{ current() === copy.questions.length - 1 ? copy.restart : copy.next }}
              </button>
            </div>
          </article>
        </section>
      </main>
    </qs-shell>
  `,
  styles: [`
    .demo-page {
      padding: 5rem 0 6rem;
      width: 100%;
      max-width: 100vw;
      overflow-x: hidden;
    }

    .demo-hero {
      padding: 2rem 0 4rem;
      max-width: 100vw;
      overflow-x: hidden;
      background:
        radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.12), transparent 32rem),
        radial-gradient(circle at 86% 8%, rgba(245, 158, 11, 0.1), transparent 28rem);
    }

    .demo-hero-grid,
    .demo-workspace {
      display: grid;
      grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
      gap: 1.5rem;
      align-items: stretch;
    }

    .demo-copy,
    .demo-map,
    .demo-side,
    .demo-card {
      min-width: 0;
    }

    .demo-copy h1 {
      max-width: 780px;
      margin: 0.9rem 0 1rem;
      overflow-wrap: anywhere;
    }

    .demo-lead {
      max-width: 720px;
      font-size: 1.08rem;
      overflow-wrap: break-word;
    }

    .demo-badges,
    .demo-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-top: 1.4rem;
    }

    .demo-badges span {
      min-width: 0;
      border: 1px solid rgba(16, 185, 129, 0.28);
      background: rgba(16, 185, 129, 0.08);
      color: #b7f7d1;
      border-radius: 999px;
      padding: 0.45rem 0.75rem;
      font-size: 0.85rem;
      font-weight: 800;
      overflow-wrap: anywhere;
    }

    .demo-map,
    .demo-side,
    .demo-card {
      border-radius: 1rem;
      padding: 1.35rem;
    }

    .demo-map h2,
    .demo-side h2 {
      font-size: 1.35rem;
      margin-bottom: 0.65rem;
    }

    .demo-map ol {
      display: grid;
      gap: 0.7rem;
      margin-top: 1rem;
    }

    .demo-map li {
      display: grid;
      grid-template-columns: 2rem 1fr;
      gap: 0.7rem;
      align-items: center;
      padding: 0.7rem;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 0.75rem;
      background: rgba(255,255,255,0.03);
    }

    .demo-map li.active {
      border-color: rgba(6, 182, 212, 0.45);
      background: rgba(6, 182, 212, 0.1);
    }

    .demo-map li span {
      display: grid;
      place-items: center;
      width: 2rem;
      height: 2rem;
      border-radius: 0.6rem;
      background: rgba(6, 182, 212, 0.16);
      color: #67e8f9;
      font-weight: 900;
    }

    .demo-map li p {
      color: var(--text-primary);
      font-size: 0.92rem;
      line-height: 1.35;
    }

    .demo-workspace {
      grid-template-columns: minmax(280px, 0.42fr) minmax(0, 1fr);
      align-items: start;
    }

    .demo-side {
      position: sticky;
      top: 6rem;
    }

    .demo-side > p:not(.eyebrow) {
      margin-bottom: 1rem;
    }

    .mock-popup {
      display: grid;
      gap: 0.6rem;
      margin-top: 1.15rem;
      padding: 0.85rem;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 0.9rem;
      background: #0d1421;
    }

    .mock-popup-head {
      display: flex;
      align-items: center;
      gap: 0.55rem;
      padding-bottom: 0.35rem;
      color: var(--text-primary);
      font-weight: 800;
    }

    .mock-popup-head strong {
      display: grid;
      place-items: center;
      width: 2rem;
      height: 2rem;
      border-radius: 0.6rem;
      background: var(--grad-primary);
    }

    .mock-action,
    .mock-toggle {
      min-height: 2.65rem;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 0.7rem;
      padding: 0.7rem 0.8rem;
      background: rgba(255,255,255,0.04);
      color: var(--text-primary);
      font-weight: 800;
    }

    .mock-action.primary {
      background: var(--grad-primary);
      color: white;
    }

    .mock-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .mock-toggle i {
      width: 2.35rem;
      height: 1.25rem;
      border-radius: 999px;
      background: rgba(148, 163, 184, 0.25);
      position: relative;
    }

    .mock-toggle i::after {
      content: '';
      position: absolute;
      top: 0.2rem;
      left: 0.2rem;
      width: 0.85rem;
      height: 0.85rem;
      border-radius: 50%;
      background: white;
      transition: transform 0.2s ease;
    }

    .mock-toggle.on i {
      background: rgba(16, 185, 129, 0.55);
    }

    .mock-toggle.on i::after {
      transform: translateX(1.1rem);
    }

    .question-top {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1.3rem;
    }

    .question-text {
      margin-top: 0.35rem;
      font-size: clamp(1.5rem, 3vw, 2.25rem);
    }

    .question-count {
      flex: 0 0 auto;
      height: 2.3rem;
      padding: 0.42rem 0.7rem;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.08);
      color: #bae6fd;
      font-weight: 900;
    }

    .demo-options {
      display: grid;
      gap: 0.75rem;
      border: 0;
    }

    .demo-option {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      min-height: 3.35rem;
      padding: 0.8rem 0.9rem;
      border: 1px solid rgba(255,255,255,0.09);
      border-radius: 0.8rem;
      background: rgba(255,255,255,0.04);
      color: var(--text-primary);
      font-weight: 750;
    }

    .demo-option:hover {
      border-color: rgba(6, 182, 212, 0.35);
      background: rgba(6, 182, 212, 0.08);
    }

    .demo-option input {
      width: 1.15rem;
      height: 1.15rem;
      accent-color: var(--accent-cyan);
    }

    .text-answer {
      display: grid;
      gap: 0.55rem;
      color: var(--text-primary);
      font-weight: 800;
    }

    .text-answer input,
    .match-row select {
      width: 100%;
      min-height: 3.2rem;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 0.8rem;
      background: #111827;
      color: var(--text-primary);
      padding: 0 0.9rem;
      outline: none;
    }

    .text-answer input:focus,
    .match-row select:focus {
      border-color: rgba(6, 182, 212, 0.55);
      box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.14);
    }

    .matching-board {
      display: grid;
      gap: 0.85rem;
    }

    .match-row {
      display: grid;
      grid-template-columns: minmax(120px, 0.35fr) minmax(0, 1fr);
      gap: 0.85rem;
      align-items: center;
    }

    .match-row > span {
      color: var(--text-primary);
      font-weight: 900;
    }

    .selected-tip,
    .demo-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.85rem;
      flex-wrap: wrap;
      margin-top: 1.2rem;
    }

    .selected-tip {
      justify-content: flex-start;
      border: 1px solid rgba(245, 158, 11, 0.18);
      background: rgba(245, 158, 11, 0.08);
      border-radius: 0.8rem;
      padding: 0.75rem;
    }

    .selected-tip p {
      flex: 1 1 260px;
      color: #fde68a;
      font-size: 0.92rem;
    }

    .demo-nav {
      justify-content: flex-end;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
    }

    @media (max-width: 900px) {
      .demo-hero-grid,
      .demo-workspace {
        grid-template-columns: minmax(0, 1fr);
      }

      .demo-side {
        position: static;
      }
    }

    @media (max-width: 640px) {
      .demo-page {
        padding-top: 3rem;
        overflow-x: hidden;
      }

      .demo-hero {
        padding-top: 1rem;
      }

      .demo-copy h1 {
        font-size: 2rem;
      }

      .demo-hero-grid,
      .demo-workspace,
      .demo-copy,
      .demo-card,
      .demo-map,
      .demo-side {
        max-width: 100%;
        overflow-x: hidden;
      }

      .demo-hero .container,
      .demo-workspace.container {
        padding-left: 1rem;
        padding-right: 1rem;
      }

      .demo-lead,
      .demo-map p,
      .demo-map li p,
      .demo-side p {
        max-width: calc(100vw - 2rem);
      }

      .demo-badges,
      .demo-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .demo-badges span,
      .demo-actions .btn {
        width: 100%;
        justify-content: center;
        text-align: center;
        white-space: normal;
      }

      .match-row,
      .question-top {
        grid-template-columns: 1fr;
      }

      .question-top {
        display: grid;
      }

      .question-count {
        width: max-content;
      }
    }
  `]
})
export class DemoComponent implements OnInit, OnDestroy {
  protected locale: Locale = 'en';
  protected copy = COPY.en;
  protected readonly current = signal(0);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly handleTourStep = (event: Event) => {
    const step = Number((event as CustomEvent<{ step?: number }>).detail?.step ?? 0);
    const nextStep = Math.min(Math.max(0, step), this.copy.questions.length - 1);
    this.current.set(nextStep);
    this.scrollToWorkspace();
  };

  ngOnInit(): void {
    this.locale = (this.route.snapshot.data['locale'] as Locale) || 'en';
    this.copy = COPY[this.locale] || COPY.en;
    this.seo.applyPage('demo', this.locale);
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('qs-demo-set-step', this.handleTourStep);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('qs-demo-set-step', this.handleTourStep);
    }
  }

  protected currentQuestion(): DemoQuestion {
    return this.copy.questions[this.current()];
  }

  protected next(): void {
    const scrollSnapshot = this.captureScroll();
    this.current.update((value) => value >= this.copy.questions.length - 1 ? 0 : value + 1);
    this.restoreScroll(scrollSnapshot);
  }

  protected previous(): void {
    const scrollSnapshot = this.captureScroll();
    this.current.update((value) => Math.max(0, value - 1));
    this.restoreScroll(scrollSnapshot);
  }

  protected selectQuestionText(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const selector = `[data-qs-demo-question="${this.currentQuestion().id}"] [data-qs-demo-selectable="true"]`;
    const element = document.querySelector<HTMLElement>(selector);
    if (!element) return;
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(element);
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  protected startGuidedTour(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.dispatchEvent(new CustomEvent('qs-demo-start-tour'));
  }

  private scrollToWorkspace(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    requestAnimationFrame(() => {
      document.querySelector('.demo-workspace')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  }

  private captureScroll(): { x: number; y: number } | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return { x: window.scrollX, y: window.scrollY };
  }

  private restoreScroll(snapshot: { x: number; y: number } | null): void {
    if (!snapshot || !isPlatformBrowser(this.platformId)) return;
    const restore = () => window.scrollTo(snapshot.x, snapshot.y);
    requestAnimationFrame(() => {
      restore();
      setTimeout(restore, 0);
    });
  }
}
