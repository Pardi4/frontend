import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '../seo.service';
import { CHROME_WEB_STORE_URL, Locale, pathFor } from '../site-content';
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
    lead: 'Five predefined questions show how the extension works. This page never consumes credits and demo answers are resolved locally, without AI calls.',
    install: 'Install extension',
    openStore: 'Open Chrome Web Store',
    demoBadge: 'No credits used',
    localBadge: 'Local answers only',
    mapTitle: 'How to use this demo',
    mapText: 'Open the QuizSolver popup on this page and follow each step. You can also use Alt+Q to open the quick overlay.',
    prev: 'Previous',
    next: 'Next question',
    restart: 'Restart demo',
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
        question: 'Which protocol is the secure version of HTTP?',
        options: ['HTTP', 'HTTPS', 'FTP', 'SMTP'],
        correctText: 'HTTPS'
      },
      {
        id: 'demo-hidden',
        type: 'hidden',
        kicker: 'Step 2',
        title: 'Hidden mode',
        instruction: 'Turn on Hint mode in the popup before solving. The answer should be hinted instead of clicked.',
        question: 'Which CSS property changes the text color?',
        options: ['background-color', 'color', 'border', 'display'],
        correctText: 'color'
      },
      {
        id: 'demo-text',
        type: 'text',
        kicker: 'Step 3',
        title: 'Typed answer',
        instruction: 'Solve the page and the extension will fill the text input with a local demo answer.',
        question: 'What short abbreviation is commonly used for artificial intelligence?',
        placeholder: 'Type the answer here',
        correctText: 'AI'
      },
      {
        id: 'demo-matching',
        type: 'matching',
        kicker: 'Step 4',
        title: 'Dropdown and matching',
        instruction: 'This step shows multi-select matching. QuizSolver fills each dropdown with the matching concept.',
        question: 'Match each web technology with its main role.',
        prompts: ['HTML', 'CSS', 'JavaScript'],
        options: ['Structure', 'Styles', 'Logic'],
        correctText: 'HTML = Structure, CSS = Styles, JavaScript = Logic'
      },
      {
        id: 'demo-selected',
        type: 'selected',
        kicker: 'Step 5',
        title: 'Quick overlay and selected text',
        instruction: 'Select the question text, press Alt+Q or open Quick overlay, then solve selected text.',
        question: 'What does Alt+Q open in QuizSolver?',
        options: ['Quick overlay', 'Credit checkout', 'Admin panel', 'Browser history'],
        correctText: 'Quick overlay'
      }
    ]
  },
  pl: {
    eyebrow: 'Interaktywny onboarding',
    title: 'Przetestuj QuizSolver na bezpiecznym demo',
    lead: 'Piecc predefiniowanych pytan pokazuje, jak dziala rozszerzenie. Ta strona nie zuzywa kredytow i nie wysyla zapytan do AI.',
    install: 'Zainstaluj rozszerzenie',
    openStore: 'Otworz Chrome Web Store',
    demoBadge: 'Bez zuzycia kredytow',
    localBadge: 'Tylko lokalne odpowiedzi',
    mapTitle: 'Jak korzystac z demo',
    mapText: 'Otworz popup QuizSolver na tej stronie i przejdz kroki po kolei. Mozesz tez nacisnac Alt+Q, zeby otworzyc szybki overlay.',
    prev: 'Poprzednie',
    next: 'Nastepne pytanie',
    restart: 'Zacznij od nowa',
    selectText: 'Zaznacz tekst pytania',
    selectedTip: 'Zaznacz tekst pytania, otworz szybki overlay i kliknij Solve selected text.',
    popupTitle: 'Co klikac w popupie',
    popupSteps: [
      'Kliknij ikone QS w Chrome.',
      'Uzyj Solve current page przy zwyklym pytaniu.',
      'Wlacz Hint mode, zeby sprawdzic tryb ukryty.',
      'Otworz Quick overlay albo nacisnij Alt+Q.',
      'Zaznacz tekst i rozwiaz tylko zaznaczenie.'
    ],
    questions: [
      {
        id: 'demo-radio',
        type: 'radio',
        kicker: 'Krok 1',
        title: 'Zwykle rozwiazywanie',
        instruction: 'Kliknij Solve current page w popupie rozszerzenia. QuizSolver powinien zaznaczyc poprawna opcje.',
        question: 'Ktory protokol jest bezpieczniejsza wersja HTTP?',
        options: ['HTTP', 'HTTPS', 'FTP', 'SMTP'],
        correctText: 'HTTPS'
      },
      {
        id: 'demo-hidden',
        type: 'hidden',
        kicker: 'Krok 2',
        title: 'Tryb ukryty',
        instruction: 'Wlacz Hint mode w popupie przed rozwiazaniem. Odpowiedz zostanie podpowiedziana zamiast kliknieta.',
        question: 'Ktora wlasciwosc CSS zmienia kolor tekstu?',
        options: ['background-color', 'color', 'border', 'display'],
        correctText: 'color'
      },
      {
        id: 'demo-text',
        type: 'text',
        kicker: 'Krok 3',
        title: 'Odpowiedz wpisywana',
        instruction: 'Rozwiaz strone, a rozszerzenie wypelni pole tekstowe lokalna odpowiedzia demo.',
        question: 'Jakim skrotem najczesciej okresla sie sztuczna inteligencje?',
        placeholder: 'Wpisz odpowiedz tutaj',
        correctText: 'AI'
      },
      {
        id: 'demo-matching',
        type: 'matching',
        kicker: 'Krok 4',
        title: 'Selecty i dopasowanie',
        instruction: 'Ten krok pokazuje dopasowywanie wielu selectow. QuizSolver wypelnia kazdy select pasujacym pojeciem.',
        question: 'Dopasuj technologie webowe do ich glownej roli.',
        prompts: ['HTML', 'CSS', 'JavaScript'],
        options: ['Struktura', 'Style', 'Logika'],
        correctText: 'HTML = Struktura, CSS = Style, JavaScript = Logika'
      },
      {
        id: 'demo-selected',
        type: 'selected',
        kicker: 'Krok 5',
        title: 'Szybki overlay i zaznaczony tekst',
        instruction: 'Zaznacz tekst pytania, nacisnij Alt+Q albo otworz Quick overlay, a potem rozwiaz zaznaczony tekst.',
        question: 'Co otwiera skrot Alt+Q w QuizSolver?',
        options: ['Szybki overlay', 'Platnosc za kredyty', 'Panel admina', 'Historie przegladarki'],
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
                <a class="btn btn-primary btn-lg" [href]="storeUrl" target="_blank" rel="noopener">{{ copy.install }}</a>
                <a class="btn btn-outline btn-lg" [href]="pathFor('quiz')">{{ locale === 'pl' ? 'Otworz historie' : 'Open history' }}</a>
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
              <div class="mock-action primary">Solve current page</div>
              <div class="mock-action">FocusScan</div>
              <div class="mock-action">Quick overlay</div>
              <div class="mock-toggle" [class.on]="question.type === 'hidden'">
                <span>Hint mode</span><i></i>
              </div>
            </div>
          </aside>

          <article class="demo-card glass" [attr.data-qs-demo-question]="question.id">
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
              <span>{{ locale === 'pl' ? 'Twoja odpowiedz' : 'Your answer' }}</span>
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
              <button class="btn btn-outline btn-sm" type="button" (click)="selectQuestionText()">{{ copy.selectText }}</button>
              <p>{{ copy.selectedTip }}</p>
            </div>

            <div class="answer-note">
              <span>{{ locale === 'pl' ? 'Poprawna odpowiedz demo' : 'Demo correct answer' }}</span>
              <strong>{{ question.correctText }}</strong>
            </div>

            <div class="demo-nav">
              <button class="btn btn-outline" type="button" (click)="previous()" [disabled]="current() === 0">{{ copy.prev }}</button>
              <button class="btn btn-primary" type="button" (click)="next()">
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
    .answer-note,
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

    .answer-note {
      border-top: 1px solid rgba(255,255,255,0.08);
      padding-top: 1rem;
    }

    .answer-note span {
      color: var(--text-secondary);
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 900;
    }

    .answer-note strong {
      color: #86efac;
      font-size: 1.05rem;
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
export class DemoComponent implements OnInit {
  protected locale: Locale = 'en';
  protected copy = COPY.en;
  protected readonly current = signal(0);
  protected readonly storeUrl = CHROME_WEB_STORE_URL;
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    this.locale = (this.route.snapshot.data['locale'] as Locale) || 'en';
    this.copy = COPY[this.locale] || COPY.en;
    this.seo.applyPage('demo', this.locale);
  }

  protected currentQuestion(): DemoQuestion {
    return this.copy.questions[this.current()];
  }

  protected next(): void {
    this.current.update((value) => value >= this.copy.questions.length - 1 ? 0 : value + 1);
    this.scrollToWorkspace();
  }

  protected previous(): void {
    this.current.update((value) => Math.max(0, value - 1));
    this.scrollToWorkspace();
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

  protected pathFor(pageKey: 'quiz'): string {
    return pathFor(pageKey, this.locale);
  }

  private scrollToWorkspace(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    requestAnimationFrame(() => {
      document.querySelector('.demo-workspace')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  }
}
