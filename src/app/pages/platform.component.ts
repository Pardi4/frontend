import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '../seo.service';
import { Locale, PageKey, contentFor, pageData, pathFor, platformEntries } from '../site-content';
import { ShellComponent } from './shell.component';

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
                <a class="btn btn-primary btn-lg" [href]="pathFor('home') + '#credits'">
                  {{ locale === 'pl' ? 'Zainstaluj rozszerzenie' : 'Install extension' }}
                </a>
                <a class="btn btn-outline btn-lg" href="#platform-guides">
                  {{ locale === 'pl' ? 'Zobacz podobne' : 'See related' }}
                </a>
              </div>
            </div>
            
            <aside class="platform-hero-aside glass">
              <h2>{{ locale === 'pl' ? 'Co robi QuizSolver?' : 'What QuizSolver does' }}</h2>
              <p class="text-secondary" style="margin-bottom: 1.5rem;">{{ platformIntro }}</p>
              <ul class="check-list">
                <li class="check-item"><span class="check-icon">✓</span> {{ locale === 'pl' ? 'Sugestie odpowiedzi AI' : 'AI answer suggestions' }}</li>
                <li class="check-item"><span class="check-icon">✓</span> {{ locale === 'pl' ? 'Krótkie wyjaśnienia' : 'Short explanations' }}</li>
                <li class="check-item"><span class="check-icon">✓</span> {{ locale === 'pl' ? 'Notatki i quiz z historii' : 'Notes and history quiz' }}</li>
                <li class="check-item"><span class="check-icon">✓</span> {{ locale === 'pl' ? 'Udostępnianie quizu z pytań' : 'Shareable quizzes' }}</li>
              </ul>
            </aside>
          </div>
        </section>

        <section class="section">
          <div class="container two-col-grid">
            <article class="guide-card glass glass-hover reveal">
              <h2>{{ data?.stepsTitle || (locale === 'pl' ? 'Jak zacząć' : 'How to start') }}</h2>
              <ol>
                <li *ngFor="let step of data?.steps" class="text-secondary">{{ step }}</li>
              </ol>
            </article>
            <article class="guide-card glass glass-hover reveal delay-100">
              <h2>{{ locale === 'pl' ? 'Funkcje w tym workflow' : 'Features in this workflow' }}</h2>
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
              <p class="eyebrow">{{ locale === 'pl' ? 'Platformy' : 'Platforms' }}</p>
              <h2>{{ locale === 'pl' ? 'Inne poradniki QuizSolver' : 'Other QuizSolver guides' }}</h2>
              <p class="text-secondary">
                {{ locale === 'pl' ? 'Każda platforma ma osobną stronę, żeby użytkownik od razu widział właściwy kontekst.' : 'Each platform has its own page so users land in the right context immediately.' }}
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
              <h2>{{ locale === 'pl' ? 'Pytania o ten workflow' : 'Questions about this workflow' }}</h2>
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

  ngOnInit(): void {
    this.locale = (this.route.snapshot.data['locale'] || 'en') as Locale;
    this.pageKey = this.route.snapshot.data['pageKey'] as PageKey;
    this.data = pageData(this.pageKey, this.locale) || {};
    this.platformLabel = this.data?.shortName || this.data?.platformName || 'AI quiz solver';
    this.platformIntro = this.locale === 'pl'
      ? `QuizSolver pomaga przy dozwolonych ćwiczeniach i powtórkach w stylu ${this.platformLabel}: wykrywa pytania, zapisuje historię i pozwala wrócić do nich później.`
      : `QuizSolver helps with permitted ${this.platformLabel} practice workflows: it detects questions, saves history, and lets you review them later.`;
    this.seo.applyPage(this.pageKey, this.locale);
  }

  protected pathFor(pageKey: PageKey): string {
    return pathFor(pageKey, this.locale);
  }

  protected relatedPages(): Array<{ pageKey: PageKey; data: any }> {
    return platformEntries(this.locale).filter((entry) => entry.pageKey !== this.pageKey);
  }
}
