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
    <qs-shell [locale]="locale" pageKey="privacy">
      <main class="container privacy-page" id="main-content">
        <section class="utility-hero">
          <div class="utility-hero-grid">
            <div>
              <span class="eyebrow">{{ data.badge }}</span>
              <h1 class="hero-title">{{ data.title }}</h1>
              <p class="hero-subtitle text-secondary">{{ data.subtitle }}</p>
              <div class="utility-meta">
                <span>{{ data.effective }}</span>
                <span id="contact">{{ data.contactLabel }}: {{ data.contactValue }}</span>
              </div>
            </div>
            <aside class="utility-callout glass">
              <h2>{{ c.common.brand }}</h2>
              <p class="text-secondary" style="font-size: 0.95rem; margin-top: 0.5rem;">{{ c.footer.description }}</p>
            </aside>
          </div>
        </section>
        
        <section class="privacy-content">
          <div class="privacy-layout">
            <article class="privacy-card glass glass-hover" *ngFor="let section of data.sections">
              <h2>{{ section.title }}</h2>
              <p class="text-secondary" *ngIf="section.text" style="margin-top: 0.5rem;">{{ section.text }}</p>
              <ul *ngIf="section.items" style="margin-top: 1rem;">
                <li *ngFor="let item of section.items" class="text-secondary">{{ item }}</li>
              </ul>
            </article>
          </div>
        </section>
      </main>
    </qs-shell>
  `,
  styles: [`
    .privacy-page {
      padding-bottom: 5rem;
    }
    .utility-hero {
      padding: 5rem 0 3rem;
    }
    .utility-hero-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
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

    .privacy-content {
      padding: 2rem 0;
    }
    .privacy-layout {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    .privacy-card {
      padding: 2.5rem;
    }
    .privacy-card h2 {
      font-size: 1.5rem;
    }
    .privacy-card ul {
      padding-left: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      list-style: disc;
    }

    @media (max-width: 768px) {
      .utility-hero-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }
  `]
})
export class PrivacyComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);

  protected locale: Locale = 'en';
  protected c = contentFor('en');
  protected data = pageData('privacy', 'en');

  ngOnInit(): void {
    this.locale = (this.route.snapshot.data['locale'] || 'en') as Locale;
    this.c = contentFor(this.locale);
    this.data = pageData('privacy', this.locale);
    this.seo.applyPage('privacy', this.locale);
  }
}
