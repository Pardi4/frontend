import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { SeoService } from '../seo.service';
import { Locale, pageData } from '../site-content';
import { ShellComponent } from './shell.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ShellComponent],
  template: `
    <qs-shell [locale]="locale" pageKey="quiz">
      <main class="container quiz-main">
        <ng-container *ngIf="sharedToken; else privateQuiz">
          <section class="section">
            <header class="quiz-header">
              <p class="eyebrow">{{ text.sharedBadge }}</p>
              <h1>{{ sharedQuiz()?.title || text.sharedTitle }}</h1>
              <p class="desc text-secondary">{{ text.sharedSubtitle }}</p>
            </header>

            <div class="shared-layout" *ngIf="sharedQuestions().length; else sharedLoading">
              <section class="shared-grid">
                <article class="shared-card glass" *ngFor="let question of sharedQuestions(); let i = index">
                  <div class="card-top">
                    <span class="badge badge-outline">{{ i + 1 }} / {{ sharedQuestions().length }}</span>
                  </div>
                  <img class="question-image" *ngIf="imageSrc(question)" [src]="imageSrc(question)" alt="">
                  <h3>{{ question.questionText }}</h3>
                  
                  <div class="answer-choices" *ngIf="question.options?.length; else sharedTextAnswer">
                    <label class="answer-choice" *ngFor="let option of question.options; let optionIndex = index" [class.active]="isSharedChosen(question.id, optionIndex)">
                      <input [type]="question.questionType === 'checkbox' ? 'checkbox' : 'radio'" [name]="'shared-' + question.id" [checked]="isSharedChosen(question.id, optionIndex)" (change)="chooseShared(question, optionIndex)">
                      <span>{{ option }}</span>
                    </label>
                  </div>
                  <ng-template #sharedTextAnswer>
                    <div class="text-answer-box">
                      <input class="form-input" [value]="sharedAnswers()[question.id] || ''" (input)="setSharedText(question.id, $any($event.target).value)" [placeholder]="text.typeAnswer">
                    </div>
                  </ng-template>
                </article>
              </section>

              <aside class="shared-sidebar glass">
                <h2>{{ text.submitShared }}</h2>
                <p class="text-secondary">{{ text.submitSharedText }}</p>
                <div class="form-group" style="margin-top: 1.5rem;">
                  <input class="form-input" [(ngModel)]="sharedDisplayName" [placeholder]="text.displayName">
                </div>
                <button class="btn btn-primary btn-block" type="button" (click)="submitShared()" [disabled]="sharedSubmitting()">
                  {{ sharedSubmitting() ? text.loading : text.checkAnswers }}
                </button>
                
                <div class="score-box glass" *ngIf="sharedResult() as result">
                  <div class="score-num text-gradient-strong">{{ result.score }} / {{ result.totalQuestions }}</div>
                  <p class="text-secondary">{{ text.correctAnswers }}</p>
                </div>
              </aside>
            </div>

            <ng-template #sharedLoading>
              <div class="empty-panel glass">
                <p class="text-secondary">{{ sharedError() || text.loading }}</p>
              </div>
            </ng-template>
          </section>
        </ng-container>

        <ng-template #privateQuiz>
          <section class="section">
            <header class="quiz-header">
              <p class="eyebrow">{{ text.badge }}</p>
              <h1>{{ text.title }}</h1>
              <p class="desc text-secondary">{{ text.subtitle }}</p>
            </header>

            <section *ngIf="!api.token()" class="login-card glass">
              <h2>{{ text.loginTitle }}</h2>
              <p class="text-secondary">{{ text.loginSubtitle }}</p>
              <form (ngSubmit)="login()">
                <div class="form-group">
                  <input class="form-input" type="email" name="email" [(ngModel)]="email" placeholder="Email" autocomplete="email" required>
                </div>
                <div class="form-group">
                  <input class="form-input" type="password" name="password" [(ngModel)]="password" [placeholder]="text.password" autocomplete="current-password" required>
                </div>
                <button class="btn btn-primary btn-block" type="submit">{{ text.signIn }}</button>
              </form>
              <div class="form-error" *ngIf="error()">{{ error() }}</div>
            </section>

            <section *ngIf="api.token() && !practice().length">
              <div class="quiz-toolbar glass">
                <div class="toolbar-title">
                  <h2>{{ text.historyTitle }}</h2>
                  <p class="text-secondary">{{ pagination().total || notes().length }} {{ text.historyCount }}</p>
                </div>
                <div class="filter-row">
                  <input class="form-input" type="search" [(ngModel)]="search" (ngModelChange)="loadNotes(1)" [placeholder]="text.searchPlaceholder">
                  <select class="form-select" [(ngModel)]="status" (ngModelChange)="loadNotes(1)">
                    <option value="">{{ text.filterAll }}</option>
                    <option value="favorite">{{ text.filterFavorite }}</option>
                    <option value="new">{{ text.filterNew }}</option>
                    <option value="learning">{{ text.filterLearning }}</option>
                    <option value="mastered">{{ text.filterMastered }}</option>
                  </select>
                  <label class="page-size-control">
                    <span>{{ text.perPage }}</span>
                    <input class="form-input" type="number" min="1" max="100" [(ngModel)]="pageSize" (ngModelChange)="loadNotes(1)">
                  </label>
                  <button class="btn btn-outline" type="button" (click)="selectVisible()">{{ text.selectVisible }}</button>
                  <button class="btn btn-primary" type="button" (click)="startPractice()">{{ text.startPractice }}</button>
                </div>
              </div>

              <div class="empty-panel glass" *ngIf="!loading() && !notes().length">
                <h3>{{ text.emptyTitle }}</h3>
                <p class="text-secondary">{{ text.emptyText }}</p>
              </div>

              <div class="notes-grid">
                <article class="note-card glass glass-hover" *ngFor="let note of notes()">
                  <div class="note-head">
                    <label class="pill" [class.active]="selected().has(note.id)">
                      <input type="checkbox" [checked]="selected().has(note.id)" (change)="toggleSelected(note.id)">
                      <span>{{ text.selected }}</span>
                    </label>
                    <button class="favorite-star-btn" type="button" [class.is-favorite]="note.favorite" (click)="toggleFavorite(note)" [attr.aria-label]="note.favorite ? text.favorited : text.favorite" [title]="note.favorite ? text.favorited : text.favorite">
                      <span aria-hidden="true">{{ note.favorite ? '★' : '☆' }}</span>
                    </button>
                  </div>
                  
                  <img class="question-image" *ngIf="imageSrc(note)" [src]="imageSrc(note)" alt="">
                  <h3>{{ note.questionText }}</h3>
                  
                  <div class="note-meta">
                    <span class="badge badge-outline">{{ note.platform || 'quiz' }}</span>
                    <span class="badge badge-outline" style="text-transform: capitalize;">{{ note.status || 'new' }}</span>
                  </div>
                  
                  <div class="answer-panel-box">
                    <strong>{{ text.answer }}</strong>
                    <p>{{ note.answerText }}</p>
                  </div>
                  
                  <div class="explanation-panel-box" *ngIf="note.explanation">
                    <strong>{{ text.explanation }}</strong>
                    <p>{{ note.explanation }}</p>
                  </div>
                  
                  <div class="personal-note-box">
                    <label class="eyebrow" style="font-size: 0.7rem; margin-bottom: 0.5rem;">{{ text.personalNote }}</label>
                    <textarea class="form-input" [(ngModel)]="note.personalNote" [placeholder]="text.notePlaceholder"></textarea>
                  </div>
                  
                  <div class="note-actions">
                    <select class="form-select" [(ngModel)]="note.status" (ngModelChange)="updateNote(note, { status: note.status })" style="flex: 1;">
                      <option value="new">{{ text.new }}</option>
                      <option value="learning">{{ text.learning }}</option>
                      <option value="mastered">{{ text.mastered }}</option>
                    </select>
                    <button class="btn btn-primary btn-sm" type="button" (click)="updateNote(note, { personalNote: note.personalNote || '' })">
                      {{ text.saveNote }}
                    </button>
                  </div>
                </article>
              </div>

              <div class="quiz-pagination glass" *ngIf="pagination().pages > 1">
                <button class="btn btn-outline btn-sm" type="button" (click)="loadNotes(currentPage() - 1)" [disabled]="currentPage() <= 1">
                  {{ text.prevPage }}
                </button>
                <span>{{ currentPage() }} / {{ pagination().pages }}</span>
                <button class="btn btn-outline btn-sm" type="button" (click)="loadNotes(currentPage() + 1)" [disabled]="currentPage() >= pagination().pages">
                  {{ text.nextPage }}
                </button>
              </div>
            </section>

            <section *ngIf="practice().length" class="practice-container">
              <div class="practice-top">
                <button class="btn btn-outline" type="button" (click)="backToNotes()">{{ text.backToNotes }}</button>
                <span class="badge badge-outline">{{ currentIndex() + 1 }} / {{ practice().length }}</span>
              </div>

              <article class="practice-card glass" *ngIf="!finished() && currentQuestion() as question">
                <p class="eyebrow">{{ question.platform || 'QuizSolver' }}</p>
                <img class="question-image" *ngIf="imageSrc(question)" [src]="imageSrc(question)" alt="" style="margin-top: 1.5rem;">
                <h2 style="margin-top: 0.5rem; line-height: 1.3;">{{ question.questionText }}</h2>

                <div class="answer-choices" *ngIf="question.options?.length; else practiceTextAnswer">
                  <label class="answer-choice" *ngFor="let option of question.options; let i = index" [class.active]="isChosen(i)">
                    <input [type]="question.questionType === 'checkbox' ? 'checkbox' : 'radio'" name="answer" [checked]="isChosen(i)" (change)="chooseAnswer(i, question.questionType)">
                    <span>{{ option }}</span>
                  </label>
                </div>
                <ng-template #practiceTextAnswer>
                  <div class="text-answer-box" style="margin: 2rem 0;">
                    <input class="form-input" [(ngModel)]="typedAnswer" [placeholder]="text.typeAnswer">
                  </div>
                </ng-template>

                <div class="result-panel anim-slide-up" [class.correct]="isCorrect()" [class.incorrect]="!isCorrect()" *ngIf="checked()">
                  <strong>{{ isCorrect() ? text.correct : text.incorrect }}</strong>
                  <p class="text-secondary" style="margin-top: 0.5rem; color: inherit;">
                    {{ question.explanation || text.noExplanation }}
                  </p>
                </div>

                <div class="section-actions">
                  <button class="btn btn-primary btn-block" type="button" *ngIf="!checked()" (click)="checkAnswer(question)">
                    {{ text.checkAnswer }}
                  </button>
                  <button class="btn btn-outline btn-block" type="button" *ngIf="checked()" (click)="nextQuestion()">
                    {{ text.nextQuestion }}
                  </button>
                </div>
              </article>

              <div class="empty-panel glass" *ngIf="finished()">
                <h2>{{ text.resultTitle }}</h2>
                <div class="score-box" style="margin: 2rem 0;">
                  <span class="score-num text-gradient-strong" style="font-size: 3.5rem; font-weight: 800; font-family: var(--font-heading);">
                    {{ score() }} / {{ practice().length }}
                  </span>
                  <p class="text-secondary" style="margin-top: 0.5rem;">{{ text.correctAnswers }}</p>
                </div>
                <button class="btn btn-primary" type="button" (click)="restartPractice()">{{ text.restartPractice }}</button>
              </div>
            </section>
          </section>
        </ng-template>
      </main>
    </qs-shell>
  `,
  styles: [`
    .quiz-main {
      padding-bottom: 5rem;
    }
    .quiz-header {
      padding: 4rem 0 2rem;
      text-align: center;
    }
    .quiz-header h1 {
      font-size: 2.75rem;
      margin: 0.5rem 0;
    }

    /* Shared quiz layout */
    .shared-layout {
      display: grid;
      grid-template-columns: 1.3fr 0.7fr;
      gap: 2rem;
      margin-top: 2rem;
      align-items: start;
    }
    .shared-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    .shared-card {
      padding: 2.5rem;
    }
    .shared-sidebar {
      padding: 2.5rem;
      position: sticky;
      top: 6rem;
    }
    .shared-sidebar h2 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    .score-box {
      margin-top: 2rem;
      padding: 1.5rem;
      text-align: center;
      background: rgba(255, 255, 255, 0.02);
    }
    .score-num {
      font-size: 2.5rem;
      font-weight: 800;
      font-family: var(--font-heading);
      line-height: 1.2;
    }

    .card-top {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 1rem;
    }

    .question-image {
      max-width: 100%;
      max-height: 300px;
      object-fit: contain;
      border-radius: var(--radius-md);
      margin-bottom: 1.5rem;
      border: 1px solid var(--border);
    }

    .answer-choices {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin: 1.5rem 0;
    }
    .answer-choice {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.25rem;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.25s var(--ease-out);
    }
    .answer-choice:hover {
      background: rgba(255, 255, 255, 0.04);
      border-color: var(--border-hover);
    }
    .answer-choice.active {
      background: rgba(6, 182, 212, 0.08);
      border-color: var(--accent-cyan);
      box-shadow: 0 0 15px rgba(6, 182, 212, 0.1);
    }
    .answer-choice input {
      accent-color: var(--accent-cyan);
      width: 1.2rem;
      height: 1.2rem;
    }

    /* Private quiz login panel */
    .login-card {
      max-width: 480px;
      margin: 4rem auto;
      padding: 3rem;
      text-align: center;
    }
    .login-card h2 {
      font-size: 1.75rem;
      margin-bottom: 0.5rem;
    }
    .login-card p {
      margin-bottom: 2rem;
    }

    /* Toolbar */
    .quiz-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1.5rem;
      margin: 2.5rem 0;
      padding: 1.5rem 2rem;
    }
    .toolbar-title h2 {
      font-size: 1.5rem;
    }
    .filter-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .filter-row .form-input {
      width: 240px;
    }
    .filter-row .form-select {
      width: 160px;
    }
    .page-size-control {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);
      font-size: 0.85rem;
      font-weight: 700;
      white-space: nowrap;
    }
    .page-size-control .form-input {
      width: 76px;
      padding-inline: 0.75rem;
    }

    /* Notes Grid */
    .notes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 2rem;
      margin-top: 1.5rem;
    }
    .note-card {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .note-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
    }
    .favorite-star-btn {
      width: 2.35rem;
      height: 2.35rem;
      display: inline-grid;
      place-items: center;
      border: 1px solid var(--border);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-secondary);
      font-size: 1.35rem;
      line-height: 1;
      transition: border-color 0.2s var(--ease-out), color 0.2s var(--ease-out), background 0.2s var(--ease-out), transform 0.2s var(--ease-out);
    }
    .favorite-star-btn:hover {
      color: #facc15;
      border-color: rgba(250, 204, 21, 0.45);
      transform: translateY(-1px);
    }
    .favorite-star-btn.is-favorite {
      color: #facc15;
      background: rgba(250, 204, 21, 0.1);
      border-color: rgba(250, 204, 21, 0.45);
      animation: favorite-pop 0.55s cubic-bezier(.2, .9, .2, 1.25);
    }
    .favorite-star-btn span {
      display: block;
      transform-origin: center;
    }
    @keyframes favorite-pop {
      0% { transform: scale(0.82) rotate(0deg); }
      45% { transform: translateY(-5px) scale(1.18) rotate(170deg); }
      75% { transform: translateY(1px) scale(0.98) rotate(330deg); }
      100% { transform: translateY(0) scale(1) rotate(360deg); }
    }
    .note-meta {
      display: flex;
      gap: 0.5rem;
      margin: 1rem 0;
    }
    .answer-panel-box, .explanation-panel-box {
      margin-top: 1rem;
      padding: 1rem 1.25rem;
      background: rgba(255, 255, 255, 0.02);
      border-left: 3px solid var(--accent-cyan);
      border-radius: 0 var(--radius-md) var(--radius-md) 0;
    }
    .explanation-panel-box {
      border-left-color: var(--accent-violet);
    }
    .answer-panel-box p, .explanation-panel-box p {
      font-size: 0.95rem;
      margin-top: 0.25rem;
    }
    .personal-note-box {
      margin-top: 1.25rem;
    }
    .note-card textarea {
      resize: vertical;
      min-height: 70px;
      font-size: 0.875rem;
    }
    .note-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    /* Practice Card */
    .practice-container {
      max-width: 720px;
      margin: 3rem auto;
    }
    .practice-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .practice-card {
      padding: 3rem;
    }
    .result-panel {
      margin: 1.5rem 0;
      padding: 1.25rem 1.5rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
    }
    .result-panel.correct {
      background: rgba(16, 185, 129, 0.08);
      border-color: rgba(16, 185, 129, 0.2);
      color: var(--accent-emerald);
    }
    .result-panel.incorrect {
      background: rgba(244, 63, 94, 0.08);
      border-color: rgba(244, 63, 94, 0.2);
      color: var(--accent-rose);
    }
    .section-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }
    .empty-panel {
      padding: 4rem;
      text-align: center;
      margin-top: 2rem;
    }
    .empty-panel h3 {
      margin-bottom: 0.75rem;
    }
    .quiz-pagination {
      margin: 2rem auto 0;
      padding: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      width: fit-content;
    }
    .quiz-pagination span {
      min-width: 72px;
      text-align: center;
      color: var(--text-secondary);
      font-weight: 800;
    }

    @media (max-width: 992px) {
      .shared-layout {
        grid-template-columns: 1fr;
      }
      .shared-sidebar {
        position: static;
      }
    }
    @media (max-width: 768px) {
      .notes-grid {
        grid-template-columns: 1fr;
      }
      .quiz-toolbar {
        flex-direction: column;
        align-items: stretch;
        padding: 1.5rem;
      }
      .filter-row {
        flex-direction: column;
        align-items: stretch;
      }
      .filter-row .form-input,
      .filter-row .form-select,
      .page-size-control,
      .filter-row button {
        width: 100%;
      }
      .page-size-control .form-input {
        width: 100%;
      }
    }
  `]
})
export class QuizComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  protected readonly api = inject(ApiService);

  protected locale: Locale = 'en';
  protected text = QUIZ_TEXT.en;
  protected email = '';
  protected password = '';
  protected search = '';
  protected status = '';
  protected typedAnswer = '';
  protected sharedToken = '';
  protected sharedDisplayName = '';

  protected readonly notes = signal<any[]>([]);
  protected readonly selected = signal<Set<string>>(new Set());
  protected readonly practice = signal<any[]>([]);
  protected readonly currentIndex = signal(0);
  protected readonly chosen = signal<Set<number>>(new Set());
  protected readonly checked = signal(false);
  protected readonly correct = signal(false);
  protected readonly score = signal(0);
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly currentPage = signal(1);
  protected readonly pagination = signal({ page: 1, limit: 20, total: 0, pages: 1 });
  protected readonly finished = signal(false);
  protected readonly currentQuestion = computed(() => this.practice()[this.currentIndex()] || null);
  protected pageSize = 20;

  protected readonly sharedQuiz = signal<any>(null);
  protected readonly sharedQuestions = signal<any[]>([]);
  protected readonly sharedAnswers = signal<Record<string, any>>({});
  protected readonly sharedResult = signal<any>(null);
  protected readonly sharedSubmitting = signal(false);
  protected readonly sharedError = signal('');

  async ngOnInit(): Promise<void> {
    this.locale = (this.route.snapshot.data['locale'] || 'en') as Locale;
    this.text = QUIZ_TEXT[this.locale];
    this.seo.applyPage('quiz', this.locale, { robots: 'index, follow' });
    this.sharedToken = this.route.snapshot.paramMap.get('token') || '';

    if (this.sharedToken) {
      await this.loadSharedQuiz();
      return;
    }

    await this.api.restoreSession();
    await this.loadNotes();
  }

  protected imageSrc(item: any): string {
    return item?.questionImageBase64 || item?.questionImageUrl || '';
  }

  protected async login(): Promise<void> {
    const result = await this.api.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: this.email, password: this.password, rememberMe: true })
    });
    if (result.success && result.token) {
      this.api.setSession(result.token, result.user);
      await this.loadNotes();
      return;
    }
    this.error.set(result.error || this.text.loginError);
  }

  protected async loadNotes(page = this.currentPage()): Promise<void> {
    if (!this.api.token()) return;
    this.loading.set(true);
    const limit = Math.min(Math.max(Number(this.pageSize) || 20, 1), 100);
    this.pageSize = limit;
    const nextPage = Math.max(Number(page) || 1, 1);
    const params = new URLSearchParams();
    params.set('page', String(nextPage));
    params.set('limit', String(limit));
    if (this.search.trim()) params.set('search', this.search.trim());
    if (this.status === 'favorite') params.set('favorite', 'true');
    else if (this.status) params.set('status', this.status);
    const result = await this.api.request(`/api/quiz/study-notes${params.size ? `?${params}` : ''}`);
    this.loading.set(false);
    if (result.success && Array.isArray(result.notes)) {
      this.notes.set(result.notes);
      this.currentPage.set(result.pagination?.page || nextPage);
      this.pagination.set(result.pagination || { page: nextPage, limit, total: result.notes.length, pages: 1 });
    }
  }

  protected toggleSelected(id: string): void {
    const next = new Set(this.selected());
    next.has(id) ? next.delete(id) : next.add(id);
    this.selected.set(next);
  }

  protected selectVisible(): void {
    this.selected.set(new Set(this.notes().map((note) => note.id)));
  }

  protected async updateNote(note: any, patch: any): Promise<void> {
    Object.assign(note, patch);
    this.notes.set([...this.notes()]);
    await this.api.request(`/api/quiz/study-notes/${note.id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch)
    });
  }

  protected async toggleFavorite(note: any): Promise<void> {
    await this.updateNote(note, { favorite: !note.favorite });
  }

  protected async startPractice(): Promise<void> {
    const noteIds = Array.from(this.selected());
    if (!noteIds.length) {
      this.error.set(this.text.selectAtLeastOne);
      return;
    }
    const result = await this.api.request('/api/quiz/practice', {
      method: 'POST',
      body: JSON.stringify({ noteIds })
    });
    if (result.success && Array.isArray(result.questions)) {
      this.practice.set(result.questions);
      this.currentIndex.set(0);
      this.score.set(0);
      this.checked.set(false);
      this.finished.set(false);
      this.chosen.set(new Set());
      this.typedAnswer = '';
    }
  }

  protected chooseAnswer(index: number, type: string): void {
    const next = type === 'checkbox' ? new Set(this.chosen()) : new Set<number>();
    if (type === 'checkbox' && next.has(index)) next.delete(index);
    else next.add(index);
    this.chosen.set(next);
  }

  protected isChosen(index: number): boolean {
    return this.chosen().has(index);
  }

  protected checkAnswer(question: any): void {
    const value = question.questionType === 'text'
      ? this.typedAnswer.trim().toLowerCase()
      : Array.from(this.chosen()).sort((a, b) => a - b);
    const answer = question.questionType === 'text'
      ? String(question.answerText || question.answer || '').trim().toLowerCase()
      : Array.isArray(question.answer) ? [...question.answer].sort((a, b) => a - b) : [question.answer];
    const ok = JSON.stringify(value) === JSON.stringify(answer);
    this.correct.set(ok);
    this.checked.set(true);
    if (ok) this.score.set(this.score() + 1);
  }

  protected isCorrect(): boolean {
    return this.correct();
  }

  protected nextQuestion(): void {
    if (this.currentIndex() + 1 >= this.practice().length) {
      this.finished.set(true);
      return;
    }
    this.currentIndex.set(this.currentIndex() + 1);
    this.chosen.set(new Set());
    this.typedAnswer = '';
    this.checked.set(false);
    this.correct.set(false);
  }

  protected backToNotes(): void {
    this.practice.set([]);
    this.finished.set(false);
  }

  protected restartPractice(): void {
    this.currentIndex.set(0);
    this.score.set(0);
    this.chosen.set(new Set());
    this.checked.set(false);
    this.correct.set(false);
    this.finished.set(false);
  }

  protected async loadSharedQuiz(): Promise<void> {
    try {
      const response = await fetch(`/api/quiz/shared/${encodeURIComponent(this.sharedToken)}`);
      const data = await response.json();
      if (!data.success) {
        this.sharedError.set(data.error || this.text.sharedError);
        return;
      }
      this.sharedQuiz.set(data.quiz);
      this.sharedQuestions.set(data.questions || []);
    } catch {
      this.sharedError.set(this.text.sharedError);
    }
  }

  protected isSharedChosen(questionId: string, optionIndex: number): boolean {
    const value = this.sharedAnswers()[questionId];
    return Array.isArray(value) ? value.includes(optionIndex) : value === optionIndex;
  }

  protected chooseShared(question: any, optionIndex: number): void {
    const next = { ...this.sharedAnswers() };
    if (question.questionType === 'checkbox') {
      const values = Array.isArray(next[question.id]) ? [...next[question.id]] : [];
      const existing = values.indexOf(optionIndex);
      if (existing >= 0) values.splice(existing, 1);
      else values.push(optionIndex);
      next[question.id] = values;
    } else {
      next[question.id] = optionIndex;
    }
    this.sharedAnswers.set(next);
  }

  protected setSharedText(questionId: string, value: string): void {
    this.sharedAnswers.set({ ...this.sharedAnswers(), [questionId]: value });
  }

  protected async submitShared(): Promise<void> {
    this.sharedSubmitting.set(true);
    try {
      const orderedAnswers = this.sharedQuestions().map((question) => {
        const value = this.sharedAnswers()[question.id];
        return value === undefined ? (question.questionType === 'checkbox' ? [] : '') : value;
      });
      const response = await fetch(`/api/quiz/shared/${encodeURIComponent(this.sharedToken)}/attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: this.sharedDisplayName || this.text.anonymous,
          answers: orderedAnswers
        })
      });
      const data = await response.json();
      if (data.success) this.sharedResult.set(data);
      else this.sharedError.set(data.error || this.text.sharedError);
    } catch {
      this.sharedError.set(this.text.sharedError);
    }
    this.sharedSubmitting.set(false);
  }
}

const QUIZ_TEXT: Record<Locale, any> = {
  en: {
    badge: 'History and notes',
    title: 'Your saved questions become a quiz',
    subtitle: 'Notes and quiz from history now live on the same page. Select questions, add your own notes, and practice them later.',
    loginTitle: 'Sign in to load your history',
    loginSubtitle: 'Use the same account as the Chrome extension.',
    password: 'Password',
    signIn: 'Sign in',
    loginError: 'Could not sign in.',
    historyTitle: 'Saved questions',
    historyCount: 'questions',
    searchPlaceholder: 'Search notes',
    filterAll: 'All',
    filterFavorite: 'Favorites',
    filterNew: 'New',
    filterLearning: 'Learning',
    filterMastered: 'Mastered',
    perPage: 'Per page',
    prevPage: 'Prev',
    nextPage: 'Next',
    selectVisible: 'Select visible',
    startPractice: 'Start history quiz',
    emptyTitle: 'No saved questions yet',
    emptyText: 'Solve questions with history saving enabled in the extension, then return here.',
    selected: 'Selected',
    favorited: 'Favorite',
    favorite: 'Mark favorite',
    answer: 'Answer',
    explanation: 'Explanation',
    noExplanation: 'No explanation saved yet.',
    personalNote: 'Your note',
    notePlaceholder: 'Add what you want to remember...',
    saveNote: 'Save note',
    new: 'New',
    learning: 'Learning',
    mastered: 'Mastered',
    backToNotes: 'Back to history',
    typeAnswer: 'Type your answer',
    checkAnswer: 'Check answer',
    nextQuestion: 'Next question',
    correct: 'Correct',
    incorrect: 'Not quite',
    resultTitle: 'Practice complete',
    correctAnswers: 'correct answers',
    restartPractice: 'Practice again',
    selectAtLeastOne: 'Select at least one question.',
    sharedBadge: 'Shared quiz',
    sharedTitle: 'Shared QuizSolver quiz',
    sharedSubtitle: 'Answer the shared questions and submit your attempt.',
    submitShared: 'Submit attempt',
    submitSharedText: 'Enter a display name and check your score.',
    displayName: 'Display name',
    loading: 'Loading...',
    checkAnswers: 'Check answers',
    sharedError: 'Could not load shared quiz.',
    anonymous: 'Anonymous'
  },
  pl: {
    badge: 'Historia i notatki',
    title: 'Przekształcaj historię w quizy powtórkowe',
    subtitle: 'Zarządzaj zapisanymi pytaniami, dodawaj własne notatki i twórz spersonalizowane testy sprawdzające przed egzaminem.',
    loginTitle: 'Zaloguj się, aby wczytać historię',
    loginSubtitle: 'Użyj tego samego konta co w rozszerzeniu Chrome.',
    password: 'Hasło',
    signIn: 'Zaloguj się',
    loginError: 'Nie udało się zalogować.',
    historyTitle: 'Zapisane pytania',
    historyCount: 'pytań',
    searchPlaceholder: 'Szukaj w notatkach...',
    filterAll: 'Wszystkie',
    filterFavorite: 'Ulubione',
    filterNew: 'Nowe',
    filterLearning: 'W trakcie nauki',
    filterMastered: 'Opanowane',
    perPage: 'Na strone',
    prevPage: 'Poprzednia',
    nextPage: 'Nastepna',
    selectVisible: 'Zaznacz widoczne',
    startPractice: 'Rozpocznij quiz powtórkowy',
    emptyTitle: 'Brak zapisanych pytań',
    emptyText: 'Rozwiązuj testy za pomocą rozszerzenia z włączonym zapisem historii, a Twoje pytania automatycznie pojawią się w tym panelu.',
    selected: 'Wybrane',
    favorited: 'Ulubione',
    favorite: 'Dodaj do ulubionych',
    answer: 'Odpowiedź',
    explanation: 'Wyjaśnienie',
    noExplanation: 'Brak zapisanego wyjaśnienia.',
    personalNote: 'Twoja notatka',
    notePlaceholder: 'Dodaj kluczowe informacje, wzory lub komentarz...',
    saveNote: 'Zapisz notatkę',
    new: 'Nowe',
    learning: 'W trakcie nauki',
    mastered: 'Opanowane',
    backToNotes: 'Wróć do historii',
    typeAnswer: 'Wpisz swoją odpowiedź',
    checkAnswer: 'Sprawdź odpowiedź',
    nextQuestion: 'Następne pytanie',
    correct: 'Poprawnie!',
    incorrect: 'Niewłaściwa odpowiedź',
    resultTitle: 'Quiz zakończony!',
    correctAnswers: 'poprawnych odpowiedzi',
    restartPractice: 'Rozpocznij ponownie',
    selectAtLeastOne: 'Zaznacz co najmniej jedno pytanie, aby rozpocząć quiz.',
    sharedBadge: 'Udostępniony quiz',
    sharedTitle: 'Udostępniony quiz QuizSolver',
    sharedSubtitle: 'Odpowiedz na poniższe pytania i prześlij swoje podejście, aby sprawdzić wiedzę.',
    submitShared: 'Wyślij podejście',
    submitSharedText: 'Wpisz swoją nazwę użytkownika, aby sprawdzić uzyskany wynik.',
    displayName: 'Nazwa użytkownika',
    loading: 'Ładowanie...',
    checkAnswers: 'Sprawdź odpowiedzi',
    sharedError: 'Nie udało się wczytać quizu.',
    anonymous: 'Anonimowy'
  }
};
