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
      <div class="container quiz-main">
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
                <p class="text-secondary">{{ api.currentUser() ? text.submitSharedLoggedText : text.submitSharedText }}</p>
                <div class="logged-attempt-note" *ngIf="api.currentUser() as user">
                  {{ text.loggedAttemptAs }} <strong>{{ user.displayName || user.email }}</strong>
                </div>
                <div class="form-group" style="margin-top: 1.5rem;" *ngIf="!api.currentUser()">
                  <input class="form-input" [(ngModel)]="sharedDisplayName" [placeholder]="text.displayName">
                </div>
                <button class="btn btn-primary btn-block" type="button" (click)="submitShared()" [disabled]="sharedSubmitting()">
                  {{ sharedSubmitting() ? text.loading : text.checkAnswers }}
                </button>
                <div class="form-error" *ngIf="sharedError()">{{ sharedError() }}</div>
                
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
                <div class="toolbar-main">
                  <div class="toolbar-title">
                    <h2>{{ resultsPanelOpen() ? text.sharedResultsTitle : text.historyTitle }}</h2>
                    <p class="text-secondary">
                      {{ resultsPanelOpen() ? text.sharedResultsText : ((pagination().total || notes().length) + ' ' + text.historyCount) }}
                    </p>
                  </div>
                  <div class="primary-actions">
                    <button class="btn btn-primary" type="button" (click)="startPractice()">{{ text.startPractice }}</button>
                    <button class="btn btn-outline" type="button" (click)="toggleResultsLookup()">
                      {{ resultsPanelOpen() ? text.backToAllQuestions : text.sharedResultsButton }}
                    </button>
                  </div>
                </div>
                <div class="filter-row" *ngIf="!resultsPanelOpen()">
                  <input class="form-input" type="search" [(ngModel)]="search" (ngModelChange)="loadNotes(1)" [placeholder]="text.searchPlaceholder">
                  <select class="form-select" [(ngModel)]="status" (ngModelChange)="loadNotes(1)">
                    <option value="">{{ text.filterAll }}</option>
                    <option value="favorite">{{ text.filterFavorite }}</option>
                    <option value="new">{{ text.filterNew }}</option>
                    <option value="learning">{{ text.filterLearning }}</option>
                    <option value="mastered">{{ text.filterMastered }}</option>
                  </select>
                  <button class="btn btn-outline" type="button" (click)="toggleVisibleSelection()">
                    {{ allVisibleSelected() ? text.clearSelection : text.selectVisible }}
                  </button>
                </div>
              </div>

              <div class="note-toast" *ngIf="noteToast()">
                {{ noteToast() }}
              </div>

              <div class="shared-results-panel glass" *ngIf="resultsPanelOpen()">
                <div class="results-header">
                  <div>
                    <h3>{{ text.sharedResultsTitle }}</h3>
                    <p class="text-secondary">{{ text.sharedResultsText }}</p>
                  </div>
                </div>
                <div class="results-tabs">
                  <button type="button" [class.active]="sharedResultsMode() === 'created'" (click)="setSharedResultsMode('created')">{{ text.createdQuizzes }}</button>
                  <button type="button" [class.active]="sharedResultsMode() === 'attempts'" (click)="setSharedResultsMode('attempts')">{{ text.myAttempts }}</button>
                </div>
                <div class="form-error" *ngIf="sharedResultsError()">{{ sharedResultsError() }}</div>

                <ng-container *ngIf="!sharedResultsLoading(); else sharedResultsLoadingTpl">
                  <div class="empty-results" *ngIf="sharedResultsMode() === 'created' && !createdSharedQuizzes().length">{{ text.noCreatedQuizzes }}</div>
                  <div class="created-results-grid" *ngIf="sharedResultsMode() === 'created'">
                    <article class="results-board" *ngFor="let quiz of createdSharedQuizzes()">
                      <div class="results-summary">
                        <div>
                          <strong>{{ quiz.title }}</strong>
                          <span>{{ quiz.questionCount }} {{ text.historyCount }} · {{ quiz.attemptCount }} {{ text.resultsCount }}</span>
                        </div>
                        <a class="btn btn-outline btn-sm" [href]="quiz.shareUrl" target="_blank" rel="noopener">{{ text.openQuiz }}</a>
                      </div>
                      <div class="empty-results" *ngIf="!quiz.attempts?.length">{{ text.noSharedResults }}</div>
                      <div class="attempt-list" *ngIf="quiz.attempts?.length">
                        <details class="attempt-row" *ngFor="let attempt of quiz.attempts">
                          <summary>
                            <strong>{{ attempt.displayName }}</strong>
                            <span>{{ attempt.score }} / {{ attempt.totalQuestions }} · {{ attempt.percentage }}% · {{ attempt.completedAt | date:'short' }}</span>
                          </summary>
                          <div class="answer-review-list">
                            <article class="answer-review" *ngFor="let answer of attempt.answers" [class.correct]="answer.correct">
                              <div>
                                <strong>{{ answer.questionText }}</strong>
                                <p>{{ text.selectedAnswer }}: {{ answer.givenText || '-' }}</p>
                                <p>{{ text.correctAnswer }}: {{ answer.correctAnswerText }}</p>
                              </div>
                              <span>{{ answer.correct ? text.correct : text.incorrect }}</span>
                            </article>
                          </div>
                        </details>
                      </div>
                    </article>
                  </div>

                  <div class="empty-results" *ngIf="sharedResultsMode() === 'attempts' && !participatedAttempts().length">{{ text.noMyAttempts }}</div>
                  <div class="created-results-grid" *ngIf="sharedResultsMode() === 'attempts'">
                    <article class="results-board" *ngFor="let attempt of participatedAttempts()">
                      <div class="results-summary">
                        <div>
                          <strong>{{ attempt.title }}</strong>
                          <span>{{ attempt.score }} / {{ attempt.totalQuestions }} · {{ attempt.percentage }}% · {{ attempt.completedAt | date:'short' }}</span>
                        </div>
                        <a class="btn btn-outline btn-sm" [href]="attempt.shareUrl" target="_blank" rel="noopener">{{ text.openQuiz }}</a>
                      </div>
                      <div class="answer-review-list">
                        <article class="answer-review" *ngFor="let answer of attempt.answers" [class.correct]="answer.correct">
                          <div>
                            <strong>{{ answer.questionText }}</strong>
                            <p>{{ text.selectedAnswer }}: {{ answer.givenText || '-' }}</p>
                            <p>{{ text.correctAnswer }}: {{ answer.correctAnswerText }}</p>
                          </div>
                          <span>{{ answer.correct ? text.correct : text.incorrect }}</span>
                        </article>
                      </div>
                    </article>
                  </div>
                </ng-container>
                <ng-template #sharedResultsLoadingTpl>
                  <div class="empty-results">{{ text.loading }}</div>
                </ng-template>
              </div>

              <ng-container *ngIf="!resultsPanelOpen()">
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

                <div class="notes-footer-controls glass" *ngIf="notes().length || pagination().total">
                  <label class="page-size-control">
                    <span>{{ text.perPage }}</span>
                    <select class="form-select" [(ngModel)]="pageSize" (ngModelChange)="loadNotes(1)">
                      <option [ngValue]="30">30</option>
                      <option [ngValue]="50">50</option>
                      <option [ngValue]="100">100</option>
                    </select>
                  </label>
                  <div class="quiz-pagination" *ngIf="pagination().pages > 1">
                    <button class="btn btn-outline btn-sm" type="button" (click)="loadNotes(currentPage() - 1, true)" [disabled]="currentPage() <= 1">
                      {{ text.prevPage }}
                    </button>
                    <span>{{ currentPage() }} / {{ pagination().pages }}</span>
                    <button class="btn btn-outline btn-sm" type="button" (click)="loadNotes(currentPage() + 1, true)" [disabled]="currentPage() >= pagination().pages">
                      {{ text.nextPage }}
                    </button>
                  </div>
                </div>
              </ng-container>
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
      </div>
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
      display: grid;
      gap: 1.15rem;
      margin: 2.5rem 0;
      padding: 1.5rem 2rem;
    }
    .toolbar-main {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }
    .toolbar-title {
      min-width: 0;
    }
    .toolbar-title h2 {
      font-size: 1.5rem;
    }
    .primary-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .filter-row {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.75rem;
      flex-wrap: wrap;
      width: 100%;
      padding: 0.4rem;
      border: 1px solid rgba(148, 163, 184, 0.14);
      border-radius: 12px;
      background: rgba(15, 23, 42, 0.45);
    }
    .filter-row .form-input {
      flex: 1 1 0;
      min-width: 260px;
      max-width: none;
      min-height: 44px;
      border-color: transparent;
      background-color: rgba(255, 255, 255, 0.04);
    }
    .filter-row .form-select {
      flex: 0 0 180px;
      min-height: 44px;
      border-color: transparent;
      background-color: rgba(255, 255, 255, 0.04);
    }
    .filter-row .btn {
      min-height: 44px;
    }
    .page-size-control {
      display: flex;
      align-items: center;
      color: var(--text-secondary);
      font-size: 0.85rem;
      font-weight: 700;
      white-space: nowrap;
      min-height: 44px;
      overflow: hidden;
      border: 1px solid rgba(148, 163, 184, 0.16);
      border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.04);
    }
    .page-size-control span {
      padding: 0 0.8rem;
      color: var(--text-secondary);
    }
    .page-size-control .form-select {
      width: 92px;
      min-height: 42px;
      border: 0;
      border-left: 1px solid rgba(148, 163, 184, 0.16);
      border-radius: 0;
      background-color: transparent;
      padding-left: 0.75rem;
    }
    .note-toast {
      position: fixed;
      right: 1rem;
      bottom: 1rem;
      z-index: 80;
      padding: 0.85rem 1rem;
      border: 1px solid rgba(16, 185, 129, 0.35);
      border-radius: var(--radius-md);
      background: rgba(4, 120, 87, 0.92);
      color: #ecfdf5;
      font-weight: 800;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
      animation: note-toast-in 0.22s var(--ease-out);
    }
    @keyframes note-toast-in {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .shared-results-panel {
      margin: 1.25rem 0 2rem;
      padding: 1.25rem;
    }
    .logged-attempt-note {
      margin-top: 1.25rem;
      padding: 0.85rem 1rem;
      border: 1px solid rgba(6, 182, 212, 0.2);
      border-radius: var(--radius-md);
      background: rgba(6, 182, 212, 0.08);
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
    .logged-attempt-note strong {
      color: var(--text-primary);
    }
    .results-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .results-header h3 {
      font-size: 1.15rem;
      margin-bottom: 0.25rem;
    }
    .results-lookup-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 0.75rem;
    }
    .results-tabs {
      display: inline-flex;
      gap: 0.25rem;
      padding: 0.25rem;
      margin-bottom: 1rem;
      border: 1px solid rgba(148, 163, 184, 0.14);
      border-radius: var(--radius-md);
      background: rgba(15, 23, 42, 0.55);
    }
    .results-tabs button {
      border: 0;
      border-radius: calc(var(--radius-md) - 2px);
      padding: 0.7rem 0.95rem;
      background: transparent;
      color: var(--text-secondary);
      font-weight: 800;
      cursor: pointer;
    }
    .results-tabs button.active {
      background: rgba(6, 182, 212, 0.13);
      color: var(--accent-cyan);
    }
    .created-results-grid {
      display: grid;
      gap: 1rem;
    }
    .results-board {
      margin-top: 1rem;
      border: 1px solid rgba(148, 163, 184, 0.14);
      border-radius: var(--radius-md);
      overflow: hidden;
      background: rgba(15, 23, 42, 0.32);
    }
    .results-summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.9rem 1rem;
      border-bottom: 1px solid rgba(148, 163, 184, 0.14);
    }
    .results-summary div {
      display: grid;
      gap: 0.25rem;
    }
    .results-summary span,
    .results-table-wrap td span {
      color: var(--text-secondary);
    }
    .empty-results {
      padding: 1rem;
      color: var(--text-secondary);
    }
    .results-table-wrap {
      overflow-x: auto;
    }
    .results-table-wrap table {
      width: 100%;
      border-collapse: collapse;
      min-width: 560px;
    }
    .results-table-wrap th,
    .results-table-wrap td {
      padding: 0.85rem 1rem;
      text-align: left;
      border-bottom: 1px solid rgba(148, 163, 184, 0.1);
      font-size: 0.9rem;
    }
    .results-table-wrap th {
      color: var(--text-secondary);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .results-table-wrap tr:last-child td {
      border-bottom: 0;
    }
    .attempt-list {
      display: grid;
      gap: 0.75rem;
      padding: 1rem;
    }
    .attempt-row {
      border: 1px solid rgba(148, 163, 184, 0.14);
      border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.02);
      overflow: hidden;
    }
    .attempt-row summary {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.9rem 1rem;
      cursor: pointer;
      list-style: none;
    }
    .attempt-row summary::-webkit-details-marker {
      display: none;
    }
    .attempt-row summary span {
      color: var(--text-secondary);
      font-size: 0.85rem;
    }
    .answer-review-list {
      display: grid;
      gap: 0.75rem;
      padding: 1rem;
    }
    .answer-review {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 1rem;
      padding: 0.9rem 1rem;
      border: 1px solid rgba(244, 63, 94, 0.22);
      border-radius: var(--radius-md);
      background: rgba(244, 63, 94, 0.06);
    }
    .answer-review.correct {
      border-color: rgba(16, 185, 129, 0.22);
      background: rgba(16, 185, 129, 0.06);
    }
    .answer-review strong {
      display: block;
      margin-bottom: 0.45rem;
    }
    .answer-review p {
      color: var(--text-secondary);
      font-size: 0.88rem;
      margin: 0.2rem 0;
    }
    .answer-review > span {
      align-self: start;
      color: var(--text-primary);
      font-size: 0.78rem;
      font-weight: 900;
      text-transform: uppercase;
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
      45% { transform: translateY(-7px) scale(1.22) rotate(180deg); }
      75% { transform: translateY(2px) scale(0.98) rotate(300deg); }
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
    .notes-footer-controls {
      margin: 2rem auto 0;
      padding: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      width: min(100%, 760px);
    }
    .quiz-pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
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
        padding: 0.9rem;
        gap: 0.85rem;
        margin: 1.25rem 0 1.5rem;
      }
      .toolbar-main,
      .primary-actions {
        flex-direction: column;
        align-items: stretch;
      }
      .filter-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
        gap: 0.5rem;
        padding: 0.45rem;
      }
      .filter-row .form-input,
      .page-size-control,
      .primary-actions .btn {
        width: 100%;
      }
      .filter-row .form-input {
        grid-column: 1 / -1;
        min-width: 0;
        min-height: 38px;
        padding: 0.6rem 0.75rem;
      }
      .filter-row .form-select {
        min-width: 0;
        width: 100%;
        min-height: 38px;
        padding: 0.55rem 0.7rem;
      }
      .filter-row button {
        width: auto;
        min-height: 38px;
        padding: 0.55rem 0.75rem;
        font-size: 0.82rem;
        white-space: nowrap;
      }
      .page-size-control .form-select {
        width: 100%;
      }
      .note-toast {
        left: 1rem;
        right: 1rem;
        text-align: center;
      }
      .results-lookup-row {
        grid-template-columns: 1fr;
      }
      .results-summary {
        flex-direction: column;
        align-items: stretch;
      }
      .attempt-row summary,
      .answer-review,
      .notes-footer-controls {
        grid-template-columns: 1fr;
        flex-direction: column;
        align-items: stretch;
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
  protected readonly pagination = signal({ page: 1, limit: 30, total: 0, pages: 1 });
  protected readonly finished = signal(false);
  protected readonly currentQuestion = computed(() => this.practice()[this.currentIndex()] || null);
  protected pageSize = 30;

  protected readonly sharedQuiz = signal<any>(null);
  protected readonly sharedQuestions = signal<any[]>([]);
  protected readonly sharedAnswers = signal<Record<string, any>>({});
  protected readonly sharedResult = signal<any>(null);
  protected readonly sharedSubmitting = signal(false);
  protected readonly sharedError = signal('');
  protected readonly resultsPanelOpen = signal(false);
  protected readonly sharedResultsMode = signal<'created' | 'attempts'>('created');
  protected readonly createdSharedQuizzes = signal<any[]>([]);
  protected readonly participatedAttempts = signal<any[]>([]);
  protected readonly sharedResultsLoading = signal(false);
  protected readonly sharedResultsError = signal('');
  protected readonly noteToast = signal('');
  protected readonly allVisibleSelected = computed(() => {
    const notes = this.notes();
    return notes.length > 0 && notes.every(note => this.selected().has(note.id));
  });
  private noteToastTimer?: ReturnType<typeof setTimeout>;

  async ngOnInit(): Promise<void> {
    this.locale = (this.route.snapshot.data['locale'] || 'en') as Locale;
    this.text = QUIZ_TEXT[this.locale] || QUIZ_TEXT.en;
    this.seo.applyPage('quiz', this.locale, { robots: 'index, follow' });
    this.sharedToken = this.route.snapshot.paramMap.get('token') || '';
    await this.api.restoreSession();

    if (this.sharedToken) {
      await this.loadSharedQuiz();
      return;
    }

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

  protected async loadNotes(page = this.currentPage(), preserveScroll = false): Promise<void> {
    if (!this.api.token()) return;
    const scrollSnapshot = this.captureScroll(preserveScroll);
    this.loading.set(true);
    const allowedLimits = [30, 50, 100];
    const limit = allowedLimits.includes(Number(this.pageSize)) ? Number(this.pageSize) : 30;
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
    this.restoreScroll(scrollSnapshot);
  }

  protected toggleSelected(id: string): void {
    const next = new Set(this.selected());
    next.has(id) ? next.delete(id) : next.add(id);
    this.selected.set(next);
  }

  protected toggleVisibleSelection(): void {
    if (this.allVisibleSelected()) {
      this.selected.set(new Set());
      return;
    }
    this.selected.set(new Set(this.notes().map((note) => note.id)));
  }

  protected async updateNote(note: any, patch: any): Promise<void> {
    Object.assign(note, patch);
    this.notes.set([...this.notes()]);
    const result = await this.api.request(`/api/quiz/study-notes/${note.id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch)
    });
    if (result.success && Object.prototype.hasOwnProperty.call(patch, 'personalNote')) {
      this.showNoteToast(this.text.noteSaved);
    }
  }

  private showNoteToast(message: string): void {
    this.noteToast.set(message);
    if (this.noteToastTimer) clearTimeout(this.noteToastTimer);
    this.noteToastTimer = setTimeout(() => this.noteToast.set(''), 2200);
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
    const scrollSnapshot = this.captureScroll(true);
    if (this.currentIndex() + 1 >= this.practice().length) {
      this.finished.set(true);
      this.restoreScroll(scrollSnapshot);
      return;
    }
    this.currentIndex.set(this.currentIndex() + 1);
    this.chosen.set(new Set());
    this.typedAnswer = '';
    this.checked.set(false);
    this.correct.set(false);
    this.restoreScroll(scrollSnapshot);
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
    const displayName = this.api.currentUser() ? '' : this.sharedDisplayName.trim();
    if (!this.api.currentUser() && !displayName) {
      this.sharedError.set(this.text.displayNameRequired);
      return;
    }
    this.sharedSubmitting.set(true);
    this.sharedError.set('');
    try {
      const orderedAnswers = this.sharedQuestions().map((question) => {
        const value = this.sharedAnswers()[question.id];
        return value === undefined ? (question.questionType === 'checkbox' ? [] : '') : value;
      });
      const result = await this.api.request(`/api/quiz/shared/${encodeURIComponent(this.sharedToken)}/attempt`, {
        method: 'POST',
        body: JSON.stringify({
          displayName,
          answers: orderedAnswers
        })
      });
      if (result.success) this.sharedResult.set(result);
      else this.sharedError.set(result.error || this.text.sharedError);
    } catch {
      this.sharedError.set(this.text.sharedError);
    }
    this.sharedSubmitting.set(false);
  }

  protected toggleResultsLookup(): void {
    const next = !this.resultsPanelOpen();
    this.resultsPanelOpen.set(next);
    if (next) this.loadSharedResults();
  }

  protected setSharedResultsMode(mode: 'created' | 'attempts'): void {
    this.sharedResultsMode.set(mode);
    this.loadSharedResults(mode);
  }

  protected async loadSharedResults(mode = this.sharedResultsMode()): Promise<void> {
    this.sharedResultsLoading.set(true);
    this.sharedResultsError.set('');
    const endpoint = mode === 'created' ? '/api/quiz/shared-created' : '/api/quiz/shared-attempts';
    const result = await this.api.request(endpoint);
    if (result.success) {
      if (mode === 'created') this.createdSharedQuizzes.set(result.quizzes || []);
      else this.participatedAttempts.set(result.attempts || []);
    } else {
      this.sharedResultsError.set(result.error || this.text.sharedResultsError);
    }
    this.sharedResultsLoading.set(false);
  }

  private captureScroll(enabled: boolean): { x: number; y: number } | null {
    if (!enabled || typeof window === 'undefined') return null;
    return { x: window.scrollX, y: window.scrollY };
  }

  private restoreScroll(snapshot: { x: number; y: number } | null): void {
    if (!snapshot || typeof window === 'undefined') return;
    const restore = () => window.scrollTo(snapshot.x, snapshot.y);
    requestAnimationFrame(() => {
      restore();
      setTimeout(restore, 0);
    });
  }
}

const QUIZ_TEXT: Partial<Record<Locale, any>> & { en: any; pl: any } = {
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
    clearSelection: 'Clear selection',
    startPractice: 'Start history quiz',
    sharedResultsButton: 'Check results',
    backToAllQuestions: 'Back to all questions',
    sharedResultsTitle: 'Shared quiz results',
    sharedResultsText: 'Review quizzes you created and your own attempts from shared quizzes.',
    createdQuizzes: 'Created quizzes',
    myAttempts: 'My attempts',
    openQuiz: 'Open quiz',
    noCreatedQuizzes: 'No shared quizzes created yet.',
    noMyAttempts: 'You have not joined any shared quizzes yet.',
    selectedAnswer: 'Selected',
    correctAnswer: 'Correct',
    sharedResultsPlaceholder: 'Paste quiz link or token',
    sharedResultsTokenRequired: 'Paste a shared quiz link or token first.',
    sharedResultsError: 'Could not load shared results.',
    loadResults: 'Load results',
    resultsCount: 'attempts',
    noSharedResults: 'No attempts yet.',
    player: 'Player',
    score: 'Score',
    when: 'When',
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
    noteSaved: 'Note saved',
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
    submitSharedLoggedText: 'Check your score. This attempt will be saved to your account.',
    loggedAttemptAs: 'Your result will be saved as',
    displayName: 'Display name',
    loading: 'Loading...',
    checkAnswers: 'Check answers',
    displayNameRequired: 'Enter a display name before checking answers.',
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
    perPage: 'Na stronę',
    prevPage: 'Poprzednia',
    nextPage: 'Nastepna',
    selectVisible: 'Zaznacz widoczne',
    clearSelection: 'Odznacz wszystkie',
    startPractice: 'Rozpocznij quiz powtórkowy',
    sharedResultsButton: 'Sprawdz wyniki',
    backToAllQuestions: 'Wróć do wszystkich pytań',
    sharedResultsTitle: 'Wyniki udostepnionego quizu',
    sharedResultsText: 'Przegladaj quizy, ktore stworzyles, oraz swoje podejscia do quizow innych osob.',
    createdQuizzes: 'Moje quizy',
    myAttempts: 'Moje podejscia',
    openQuiz: 'Otwórz quiz',
    noCreatedQuizzes: 'Nie masz jeszcze udostepnionych quizow.',
    noMyAttempts: 'Nie brales jeszcze udzialu w udostepnionych quizach.',
    selectedAnswer: 'Zaznaczono',
    correctAnswer: 'Poprawna',
    sharedResultsPlaceholder: 'Wklej link do quizu albo token',
    sharedResultsTokenRequired: 'Najpierw wklej link do quizu albo token.',
    sharedResultsError: 'Nie udało się wczytać wyników.',
    loadResults: 'Wczytaj wyniki',
    resultsCount: 'podejsc',
    noSharedResults: 'Brak podejsc.',
    player: 'Gracz',
    score: 'Wynik',
    when: 'Kiedy',
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
    noteSaved: 'Notatka zapisana',
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
    submitSharedLoggedText: 'Sprawdź wynik. To podejście zostanie zapisane na Twoim koncie.',
    loggedAttemptAs: 'Wynik zapisze się jako',
    displayName: 'Nazwa użytkownika',
    loading: 'Ładowanie...',
    checkAnswers: 'Sprawdź odpowiedzi',
    displayNameRequired: 'Wpisz nick przed sprawdzeniem odpowiedzi.',
    sharedError: 'Nie udało się wczytać quizu.',
    anonymous: 'Anonimowy'
  }
};

const QUIZ_BASE_LOCALIZED: Record<Exclude<Locale, 'en' | 'pl'>, Partial<typeof QUIZ_TEXT.en>> = {
  de: {
    badge: 'Historie und Notizen',
    title: 'Verwandle deine Historie in Übungsquizze',
    subtitle: 'Verwalte gespeicherte Fragen, Notizen und personalisierte Übungstests.',
    loginTitle: 'Einloggen, um die Historie zu laden',
    loginSubtitle: 'Nutze dasselbe Konto wie in der Chrome-Erweiterung.',
    password: 'Passwort',
    signIn: 'Einloggen',
    loginError: 'Login fehlgeschlagen.',
    historyTitle: 'Gespeicherte Fragen',
    historyCount: 'Fragen',
    searchPlaceholder: 'Notizen suchen',
    filterAll: 'Alle',
    filterFavorite: 'Favoriten',
    filterNew: 'Neu',
    filterLearning: 'Lernen',
    filterMastered: 'Gemeistert',
    perPage: 'Pro Seite',
    prevPage: 'Zurück',
    nextPage: 'Weiter',
    selectVisible: 'Sichtbare auswählen',
    clearSelection: 'Alle abwählen',
    startPractice: 'Historienquiz starten',
    sharedResultsButton: 'Ergebnisse prüfen',
    backToAllQuestions: 'Zurück zu allen Fragen',
    emptyTitle: 'Noch keine gespeicherten Fragen',
    emptyText: 'Löse Tests mit aktivierter Historie, damit Fragen hier erscheinen.',
    selected: 'Ausgewählt',
    favorited: 'Favorit',
    favorite: 'Favorit markieren',
    answer: 'Antwort',
    explanation: 'Erklärung',
    noExplanation: 'Noch keine Erklärung gespeichert.',
    personalNote: 'Deine Notiz',
    notePlaceholder: 'Füge wichtige Infos, Formeln oder Kommentare hinzu...',
    saveNote: 'Notiz speichern',
    noteSaved: 'Notiz gespeichert',
    typeAnswer: 'Antwort eingeben',
    checkAnswer: 'Antwort prüfen',
    nextQuestion: 'Nächste Frage',
    correct: 'Richtig',
    incorrect: 'Nicht ganz',
    resultTitle: 'Übung beendet',
    correctAnswers: 'richtige Antworten',
    restartPractice: 'Erneut üben',
    loading: 'Wird geladen...',
    checkAnswers: 'Antworten prüfen',
    anonymous: 'Anonym'
  },
  es: {
    badge: 'Historial y notas',
    title: 'Convierte tu historial en quizzes de práctica',
    subtitle: 'Gestiona preguntas guardadas, notas y tests personalizados.',
    loginTitle: 'Inicia sesión para cargar el historial',
    loginSubtitle: 'Usa la misma cuenta que en la extensión Chrome.',
    password: 'Contraseña',
    signIn: 'Entrar',
    loginError: 'No se pudo iniciar sesión.',
    historyTitle: 'Preguntas guardadas',
    historyCount: 'preguntas',
    searchPlaceholder: 'Buscar notas',
    filterAll: 'Todas',
    filterFavorite: 'Favoritas',
    filterNew: 'Nuevas',
    filterLearning: 'Aprendiendo',
    filterMastered: 'Dominadas',
    perPage: 'Por página',
    prevPage: 'Anterior',
    nextPage: 'Siguiente',
    selectVisible: 'Seleccionar visibles',
    clearSelection: 'Quitar selección',
    startPractice: 'Iniciar quiz del historial',
    sharedResultsButton: 'Ver resultados',
    backToAllQuestions: 'Volver a preguntas',
    emptyTitle: 'Aún no hay preguntas guardadas',
    emptyText: 'Resuelve tests con historial activado para ver preguntas aquí.',
    selected: 'Seleccionada',
    favorited: 'Favorita',
    favorite: 'Marcar favorita',
    answer: 'Respuesta',
    explanation: 'Explicación',
    noExplanation: 'No hay explicación guardada.',
    personalNote: 'Tu nota',
    notePlaceholder: 'Añade información clave, fórmulas o comentarios...',
    saveNote: 'Guardar nota',
    noteSaved: 'Nota guardada',
    typeAnswer: 'Escribe tu respuesta',
    checkAnswer: 'Comprobar respuesta',
    nextQuestion: 'Siguiente pregunta',
    correct: 'Correcto',
    incorrect: 'No exactamente',
    resultTitle: 'Práctica completada',
    correctAnswers: 'respuestas correctas',
    restartPractice: 'Practicar otra vez',
    loading: 'Cargando...',
    checkAnswers: 'Comprobar respuestas',
    anonymous: 'Anónimo'
  },
  fr: {
    badge: 'Historique et notes',
    title: 'Transformez l’historique en quiz de révision',
    subtitle: 'Gérez questions sauvegardées, notes et tests personnalisés.',
    loginTitle: 'Connectez-vous pour charger l’historique',
    historyTitle: 'Questions sauvegardées',
    historyCount: 'questions',
    searchPlaceholder: 'Rechercher des notes',
    startPractice: 'Lancer un quiz',
    sharedResultsButton: 'Voir les résultats',
    backToAllQuestions: 'Retour aux questions',
    saveNote: 'Sauvegarder la note',
    noteSaved: 'Note sauvegardée',
    loading: 'Chargement...',
    checkAnswers: 'Vérifier les réponses',
    anonymous: 'Anonyme'
  },
  it: {
    badge: 'Cronologia e note',
    title: 'Trasforma la cronologia in quiz di pratica',
    subtitle: 'Gestisci domande salvate, note e test personalizzati.',
    loginTitle: 'Accedi per caricare la cronologia',
    historyTitle: 'Domande salvate',
    historyCount: 'domande',
    searchPlaceholder: 'Cerca note',
    startPractice: 'Avvia quiz',
    sharedResultsButton: 'Vedi risultati',
    backToAllQuestions: 'Torna alle domande',
    saveNote: 'Salva nota',
    noteSaved: 'Nota salvata',
    loading: 'Caricamento...',
    checkAnswers: 'Controlla risposte',
    anonymous: 'Anonimo'
  },
  uk: {
    badge: 'Історія і нотатки',
    title: 'Перетвори історію на тренувальні квізи',
    subtitle: 'Керуй збереженими питаннями, нотатками і персональними тестами.',
    loginTitle: 'Увійди, щоб завантажити історію',
    historyTitle: 'Збережені питання',
    historyCount: 'питань',
    searchPlaceholder: 'Пошук нотаток',
    startPractice: 'Почати квіз з історії',
    sharedResultsButton: 'Перевірити результати',
    backToAllQuestions: 'Назад до питань',
    saveNote: 'Зберегти нотатку',
    noteSaved: 'Нотатку збережено',
    loading: 'Завантаження...',
    checkAnswers: 'Перевірити відповіді',
    anonymous: 'Анонім'
  }
};

(['de', 'es', 'fr', 'it', 'uk'] as const).forEach((locale) => {
  QUIZ_TEXT[locale] = { ...QUIZ_TEXT.en, ...QUIZ_BASE_LOCALIZED[locale] };
});
