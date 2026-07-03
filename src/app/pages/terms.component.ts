import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '../seo.service';
import { Locale, contentFor, pageData } from '../site-content';
import { ShellComponent } from './shell.component';

@Component({
  standalone: true,
  imports: [CommonModule, ShellComponent],
  template: `
    <qs-shell [locale]="locale" pageKey="terms">
      <div class="container terms-page">
        <section class="utility-hero">
          <div class="utility-hero-grid">
            <div>
              <span class="eyebrow">{{ data.badge }}</span>
              <h1 class="hero-title">{{ data.title }}</h1>
              <p class="hero-subtitle text-secondary">{{ data.subtitle }}</p>
              <div class="utility-meta">
                <span>{{ data.effective }}</span>
                <span>support@getquizsolver.com</span>
              </div>
            </div>
            <aside class="utility-callout glass">
              <h2>{{ c.common.brand }}</h2>
              <p class="text-secondary">{{ c.footer.description }}</p>
            </aside>
          </div>
        </section>

        <section class="terms-content">
          <div class="terms-layout">
            <article class="terms-card glass glass-hover" *ngFor="let section of data.sections">
              <h2>{{ section.title }}</h2>
              <p class="text-secondary" *ngIf="section.text">{{ section.text }}</p>
              <ul *ngIf="section.items">
                <li *ngFor="let item of section.items" class="text-secondary">{{ item }}</li>
              </ul>
            </article>
          </div>
        </section>
      </div>
    </qs-shell>
  `,
  styles: [`
    .terms-page {
      padding-bottom: 5rem;
    }
    .utility-hero {
      padding: 5rem 0 3rem;
    }
    .utility-hero-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(18rem, 0.8fr);
      gap: 3rem;
      align-items: center;
    }
    .hero-title {
      font-size: clamp(2rem, 5vw, 3rem);
      margin-top: 0.5rem;
    }
    .hero-subtitle {
      font-size: 1.125rem;
      margin: 1rem 0 1.5rem;
      max-width: 46rem;
    }
    .utility-meta {
      display: flex;
      gap: 1.5rem;
      font-size: 0.85rem;
      color: var(--text-secondary);
      flex-wrap: wrap;
    }
    .utility-callout {
      padding: 2.5rem;
    }
    .utility-callout h2 {
      font-size: 1.5rem;
    }
    .utility-callout p {
      font-size: 0.95rem;
      margin-top: 0.5rem;
    }
    .terms-content {
      padding: 2rem 0;
    }
    .terms-layout {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      max-width: 820px;
      margin: 0 auto;
    }
    .terms-card {
      padding: 2rem;
    }
    .terms-card h2 {
      font-size: 1.35rem;
    }
    .terms-card p {
      margin-top: 0.5rem;
    }
    .terms-card ul {
      padding-left: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 1rem;
      list-style: disc;
    }
    @media (max-width: 768px) {
      .utility-hero-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      .terms-card,
      .utility-callout {
        padding: 1.5rem;
      }
    }
  `]
})
export class TermsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);

  protected locale: Locale = 'en';
  protected c = contentFor('en');
  protected data = pageData('terms', 'en');

  ngOnInit(): void {
    this.locale = (this.route.snapshot.data['locale'] || 'en') as Locale;
    this.c = contentFor(this.locale);
    this.data = pageData('terms', this.locale);
    this.seo.applyPage('terms', this.locale);
  }
}
