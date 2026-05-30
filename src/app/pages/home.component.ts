import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '../seo.service';
import { CHROME_WEB_STORE_URL, Locale, PageKey, pathFor } from '../site-content';
import { ShellComponent } from './shell.component';

@Component({
  standalone: true,
  imports: [CommonModule, ShellComponent],
  template: `
    <qs-shell [locale]="locale" pageKey="home">
      <main id="main-content">
        <!-- Hero Section -->
        <section class="hero-section">
          <div class="hero-bg-glow"></div>
          <div class="hero-bg-orb orb-cyan"></div>
          <div class="hero-bg-orb orb-violet"></div>
          
          <div class="container hero-container">
            <p class="eyebrow">{{ text.hero.eyebrow }}</p>
            <h1 class="hero-title delay-1">
              {{ text.hero.headingStart }}
              <span class="text-gradient-strong">{{ text.hero.headingAccent }}</span>
            </h1>
            <p class="hero-lead delay-2">{{ text.hero.lead }}</p>
            <div class="hero-actions delay-3">
              <a class="btn btn-primary btn-lg" [href]="storeUrl" target="_blank" rel="noopener">
                {{ text.hero.primary }}
              </a>
              <a class="btn btn-outline btn-lg" href="#how-it-works">
                {{ text.hero.secondary }}
              </a>
            </div>
            
            <!-- Platform Trust Bar -->
            <div class="trust-bar delay-4">
              <div class="trust-marquee-wrapper">
                <div class="trust-marquee">
                  <span class="trust-item" *ngFor="let platform of ['Testportal', 'Moodle', 'Google Forms', 'Canvas', 'MS Forms', 'Blackboard', 'Quizlet', 'Kahoot', 'Quizizz', 'Socrative']">
                    <span class="bullet">✦</span> {{ platform }}
                  </span>
                  <!-- Duplicate for infinite loop -->
                  <span class="trust-item" *ngFor="let platform of ['Testportal', 'Moodle', 'Google Forms', 'Canvas', 'MS Forms', 'Blackboard', 'Quizlet', 'Kahoot', 'Quizizz', 'Socrative']">
                    <span class="bullet">✦</span> {{ platform }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- How It Works Section -->
        <section class="section" id="how-it-works">
          <div class="container">
            <div class="section-header">
              <p class="eyebrow">{{ text.how.eyebrow }}</p>
              <h2>{{ text.how.title }}</h2>
              <p>{{ text.how.subtitle }}</p>
            </div>

            <div class="steps-grid">
              <div class="step-card glass glass-hover reveal" *ngFor="let step of text.how.steps; let i = index" [class.delay-100]="i === 1" [class.delay-200]="i === 2">
                <div class="step-num">{{ i + 1 }}</div>
                <h3 class="step-title">{{ step.title }}</h3>
                <p class="step-text">{{ step.text }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Features Bento Grid Section -->
        <section class="section" id="features">
          <div class="container">
            <div class="section-header">
              <p class="eyebrow">{{ text.features.eyebrow }}</p>
              <h2>{{ text.features.title }}</h2>
              <p>{{ text.features.subtitle }}</p>
            </div>

            <div class="bento-grid">
              <!-- Bento Card 1 (Large Hero Feature) -->
              <article class="bento-card card-lg glass glass-hover reveal">
                <div class="bento-card-bg-gradient"></div>
                <div class="bento-content">
                  <span class="badge badge-outline bento-badge">{{ text.features.items[0].icon }}</span>
                  <h3 class="bento-title">{{ text.features.items[0].title }}</h3>
                  <p class="bento-text">{{ text.features.items[0].text }}</p>
                  
                  <div class="bento-preview-box">
                    <div class="preview-header">
                      <span class="preview-dot"></span>
                      <span class="preview-dot"></span>
                      <span class="preview-dot"></span>
                    </div>
                    <div class="preview-body">
                      <p class="preview-q">What is the primary function of DNA replication?</p>
                      <div class="preview-suggestion">
                        <strong>AI Suggestion:</strong> To create an identical copy of DNA before cell division.
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <!-- Bento Card 2 (Standard Feature) -->
              <article class="bento-card glass glass-hover reveal delay-100">
                <div class="bento-content">
                  <span class="badge badge-outline bento-badge">{{ text.features.items[1].icon }}</span>
                  <h3 class="bento-title">{{ text.features.items[1].title }}</h3>
                  <p class="bento-text">{{ text.features.items[1].text }}</p>
                </div>
              </article>

              <!-- Bento Card 3 (Standard Feature) -->
              <article class="bento-card glass glass-hover reveal delay-200">
                <div class="bento-content">
                  <span class="badge badge-outline bento-badge">{{ text.features.items[2].icon }}</span>
                  <h3 class="bento-title">{{ text.features.items[2].title }}</h3>
                  <p class="bento-text">{{ text.features.items[2].text }}</p>
                </div>
              </article>

              <!-- Bento Card 4 (Standard Feature) -->
              <article class="bento-card glass glass-hover reveal">
                <div class="bento-content">
                  <span class="badge badge-outline bento-badge">{{ text.features.items[3].icon }}</span>
                  <h3 class="bento-title">{{ text.features.items[3].title }}</h3>
                  <p class="bento-text">{{ text.features.items[3].text }}</p>
                </div>
              </article>

              <!-- Bento Card 5 (Large Feature) -->
              <article class="bento-card card-md glass glass-hover reveal delay-100">
                <div class="bento-content">
                  <span class="badge badge-outline bento-badge">{{ text.features.items[4].icon }}</span>
                  <h3 class="bento-title">{{ text.features.items[4].title }}</h3>
                  <p class="bento-text">{{ text.features.items[4].text }}</p>
                </div>
              </article>

              <!-- Bento Card 6 (Standard Feature) -->
              <article class="bento-card glass glass-hover reveal delay-200">
                <div class="bento-content">
                  <span class="badge badge-outline bento-badge">{{ text.features.items[5].icon }}</span>
                  <h3 class="bento-title">{{ text.features.items[5].title }}</h3>
                  <p class="bento-text">{{ text.features.items[5].text }}</p>
                </div>
              </article>

              <!-- Bento Card 7 (Standard Feature) -->
              <article class="bento-card glass glass-hover reveal">
                <div class="bento-content">
                  <span class="badge badge-outline bento-badge">{{ text.features.items[6].icon }}</span>
                  <h3 class="bento-title">{{ text.features.items[6].title }}</h3>
                  <p class="bento-text">{{ text.features.items[6].text }}</p>
                </div>
              </article>

              <!-- Bento Card 8 (Standard Feature) -->
              <article class="bento-card glass glass-hover reveal delay-100">
                <div class="bento-content">
                  <span class="badge badge-outline bento-badge">{{ text.features.items[7].icon }}</span>
                  <h3 class="bento-title">{{ text.features.items[7].title }}</h3>
                  <p class="bento-text">{{ text.features.items[7].text }}</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <!-- Supported Platforms Section -->
        <section class="section platforms-section">
          <div class="container">
            <div class="section-header">
              <p class="eyebrow">{{ text.platforms.eyebrow }}</p>
              <h2>{{ text.platforms.title }}</h2>
              <p>{{ text.platforms.subtitle }}</p>
            </div>

            <div class="platforms-links-grid">
              <a *ngFor="let platform of text.platforms.items; let i = index" [href]="platform.href" class="platform-link-card glass glass-hover reveal" [class.delay-100]="(i % 3) === 1" [class.delay-200]="(i % 3) === 2">
                <span class="plat-name">{{ platform.name }}</span>
                <span class="plat-arrow">→</span>
              </a>
            </div>
          </div>
        </section>

        <!-- Pricing Section -->
        <section class="section" id="credits">
          <div class="container">
            <div class="section-header">
              <p class="eyebrow">{{ text.pricing.eyebrow }}</p>
              <h2>{{ text.pricing.title }}</h2>
              <p>{{ text.pricing.subtitle }}</p>
            </div>

            <div class="pricing-deck">
              <div class="price-tier-card glass glass-hover reveal" *ngFor="let pack of packs; let i = index" [class.delay-100]="i === 1" [class.delay-200]="i === 2" [class.featured]="pack.id === 'popular'">
                <div class="featured-badge" *ngIf="pack.id === 'popular'">{{ text.pricing.badge }}</div>
                
                <h3 class="tier-name">{{ pack.name }}</h3>
                <p class="tier-caption text-secondary">{{ pack.caption }}</p>
                <div class="tier-price">{{ pack.price }}</div>
                
                <ul class="tier-features">
                  <li *ngFor="let feat of pack.features">
                    <span class="check-icon">✓</span> {{ feat }}
                  </li>
                </ul>
                
                <button class="btn btn-block" [class.btn-primary]="pack.id === 'popular'" [class.btn-outline]="pack.id !== 'popular'" (click)="buyCredits()">
                  {{ pack.button }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- FAQ Section -->
        <section class="section faq-section">
          <div class="container">
            <div class="section-header">
              <p class="eyebrow">FAQ</p>
              <h2>{{ text.faqTitle }}</h2>
            </div>

            <div class="faq-container">
              <details class="faq-details glass reveal" *ngFor="let item of text.faq; let i = index" [class.delay-100]="(i % 2) === 1">
                <summary class="faq-summary">
                  <span>{{ item.question }}</span>
                  <span class="faq-icon">+</span>
                </summary>
                <div class="faq-content">
                  <p>{{ item.answer }}</p>
                </div>
              </details>
            </div>
          </div>
        </section>
      </main>
    </qs-shell>
  `,
  styles: [`
    /* Hero layout */
    .hero-section {
      position: relative;
      min-height: 90vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 7rem 0 4rem;
      overflow: hidden;
      text-align: center;
    }
    .hero-container {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .hero-title {
      font-size: clamp(2.5rem, 6.5vw, 4.75rem);
      font-weight: 900;
      line-height: 1.15;
      margin: 1.5rem 0 1rem;
      max-width: 900px;
    }
    .hero-lead {
      font-size: clamp(1.125rem, 2vw, 1.35rem);
      color: var(--text-secondary);
      max-width: 680px;
      margin-bottom: 2.5rem;
    }
    .hero-actions {
      display: flex;
      gap: 1.25rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 5rem;
    }
    .hero-actions .btn {
      min-width: 220px;
    }

    /* Floating background orbs */
    .hero-bg-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80vw;
      height: 80vw;
      max-width: 1000px;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 60%);
      filter: blur(50px);
      z-index: 1;
      pointer-events: none;
    }
    .hero-bg-orb {
      position: absolute;
      border-radius: var(--radius-full);
      filter: blur(80px);
      z-index: 2;
      pointer-events: none;
      animation: float 12s ease-in-out infinite alternate;
    }
    .orb-cyan {
      top: 20%;
      left: 15%;
      width: 300px;
      height: 300px;
      background: rgba(6, 182, 212, 0.12);
    }
    .orb-violet {
      bottom: 20%;
      right: 15%;
      width: 350px;
      height: 350px;
      background: rgba(139, 92, 246, 0.10);
      animation-delay: -3s;
    }

    /* Trust bar marquee */
    .trust-bar {
      width: 100%;
      max-width: 1000px;
      margin-top: 3rem;
      position: relative;
    }
    .trust-marquee-wrapper {
      overflow: hidden;
      white-space: nowrap;
      position: relative;
      padding: 1.25rem 0;
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
      background: rgba(255,255,255,0.01);
      mask-image: linear-gradient(to right, transparent, #000 15%, #000 85%, transparent);
      -webkit-mask-image: linear-gradient(to right, transparent, #000 15%, #000 85%, transparent);
    }
    .trust-marquee {
      display: inline-flex;
      gap: 3rem;
      animation: marquee 35s linear infinite;
    }
    .trust-item {
      font-family: var(--font-heading);
      font-weight: 600;
      font-size: 1.15rem;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: color 0.3s;
    }
    .trust-item:hover {
      color: var(--accent-cyan);
    }
    .bullet {
      color: var(--accent-cyan);
      opacity: 0.6;
    }

    /* Steps list */
    .steps-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      margin-top: 3rem;
    }
    .step-card {
      padding: 3rem 2rem;
      text-align: left;
      position: relative;
    }
    .step-num {
      width: 3.5rem;
      height: 3.5rem;
      border-radius: var(--radius-md);
      background: rgba(6, 182, 212, 0.08);
      border: 1px solid var(--border-hover);
      color: var(--accent-cyan);
      font-family: var(--font-heading);
      font-size: 1.5rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
    }
    .step-title {
      font-size: 1.35rem;
      margin-bottom: 0.75rem;
      color: var(--text-primary);
    }
    .step-text {
      color: var(--text-secondary);
      font-size: 0.95rem;
    }

    /* Bento Grid */
    .bento-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-auto-rows: minmax(220px, auto);
      gap: 1.5rem;
      margin-top: 3rem;
    }
    .bento-card {
      position: relative;
      padding: 2.25rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      text-align: left;
    }
    .bento-card-bg-gradient {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 10% 10%, rgba(6,182,212,0.06), transparent 50%);
      z-index: 0;
    }
    .bento-content {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: space-between;
    }
    .bento-badge {
      align-self: flex-start;
      margin-bottom: 1.5rem;
    }
    .bento-title {
      font-size: 1.35rem;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }
    .bento-text {
      color: var(--text-secondary);
      font-size: 0.925rem;
      line-height: 1.5;
    }
    .card-lg {
      grid-column: span 2;
      grid-row: span 2;
      justify-content: flex-start;
    }
    .card-md {
      grid-column: span 2;
    }

    /* Bento inner preview element */
    .bento-preview-box {
      margin-top: auto;
      background: rgba(3, 7, 18, 0.6);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-lg);
      padding: 1.25rem;
      box-shadow: var(--shadow-sm);
    }
    .preview-header {
      display: flex;
      gap: 6px;
      margin-bottom: 0.75rem;
    }
    .preview-dot {
      width: 8px;
      height: 8px;
      border-radius: var(--radius-full);
      background: var(--border-strong);
    }
    .preview-dot:nth-child(1) { background: var(--accent-rose); }
    .preview-dot:nth-child(2) { background: var(--accent-amber); }
    .preview-dot:nth-child(3) { background: var(--accent-emerald); }
    .preview-q {
      font-size: 0.9rem;
      font-weight: 550;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }
    .preview-suggestion {
      font-size: 0.85rem;
      color: var(--accent-cyan);
      background: rgba(6,182,212,0.06);
      border-left: 2px solid var(--accent-cyan);
      padding: 0.375rem 0.75rem;
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    }

    /* Platforms grid */
    .platforms-section {
      background: radial-gradient(circle at center, rgba(139,92,246,0.03) 0%, transparent 70%);
    }
    .platforms-links-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.25rem;
      margin-top: 3rem;
    }
    .platform-link-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.75rem;
    }
    .plat-name {
      font-family: var(--font-heading);
      font-weight: 600;
      color: var(--text-primary);
      font-size: 1.05rem;
    }
    .plat-arrow {
      color: var(--accent-cyan);
      font-weight: bold;
      transition: transform 0.3s var(--ease-spring);
    }
    .platform-link-card:hover .plat-arrow {
      transform: translateX(4px);
    }

    /* Pricing deck */
    .pricing-deck {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      margin-top: 3.5rem;
      align-items: stretch;
    }
    .price-tier-card {
      padding: 3.5rem 2.25rem;
      display: flex;
      flex-direction: column;
      position: relative;
      text-align: center;
    }
    .price-tier-card.featured {
      border: 1.5px solid var(--accent-cyan);
      box-shadow: 0 0 25px var(--glow-cyan), var(--shadow-md);
      transform: scale(1.03);
    }
    .featured-badge {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      background: var(--accent-cyan);
      color: var(--bg-deep);
      padding: 0.3rem 0.8rem;
      border-radius: var(--radius-full);
    }
    .tier-name {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }
    .tier-caption {
      font-size: 0.9rem;
      margin-bottom: 2rem;
    }
    .tier-price {
      font-family: var(--font-heading);
      font-size: 3.25rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 2rem;
    }
    .tier-features {
      list-style: none;
      padding: 0;
      margin: 0 0 2.5rem 0;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      text-align: left;
    }
    .tier-features li {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      font-size: 0.925rem;
      color: var(--text-secondary);
    }
    .check-icon {
      color: var(--accent-cyan);
      font-weight: bold;
    }
    .price-tier-card .btn {
      margin-top: auto;
    }

    /* FAQ accordion */
    .faq-section {
      background: radial-gradient(circle at center, rgba(6,182,212,0.03) 0%, transparent 70%);
    }
    .faq-container {
      max-width: 800px;
      margin: 3rem auto 0;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .faq-details {
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      overflow: hidden;
      transition: all 0.3s;
      background: rgba(15, 18, 35, 0.4);
    }
    .faq-details[open] {
      border-color: var(--border-hover);
      box-shadow: 0 4px 20px rgba(6,182,212,0.05);
      background: var(--bg-surface);
    }
    .faq-summary {
      padding: 1.5rem;
      font-family: var(--font-heading);
      font-size: 1.15rem;
      font-weight: 600;
      color: var(--text-primary);
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      user-select: none;
      list-style: none;
    }
    .faq-summary::-webkit-details-marker {
      display: none;
    }
    .faq-icon {
      font-size: 1.5rem;
      color: var(--accent-cyan);
      transition: transform 0.3s var(--ease-spring);
    }
    .faq-details[open] .faq-icon {
      transform: rotate(45deg);
    }
    .faq-content {
      padding: 0 1.5rem 1.5rem 1.5rem;
      border-top: 1px solid rgba(255,255,255,0.03);
      padding-top: 1rem;
    }
    .faq-content p {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.6;
    }

    /* Responsive */
    @media (max-width: 992px) {
      .steps-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      .bento-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.85rem;
      }
      .card-lg, .card-md {
        grid-column: span 1;
        grid-row: span 1;
      }
      .bento-card {
        min-height: 150px;
        padding: 1rem;
      }
      .bento-title {
        font-size: 1rem;
      }
      .bento-text {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        font-size: 0.78rem;
        line-height: 1.35;
      }
      .bento-preview-box {
        display: none;
      }
      .platforms-links-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
      }
      .platform-link-card {
        padding: 0.85rem 0.9rem;
      }
      .plat-name {
        font-size: 0.9rem;
        overflow-wrap: anywhere;
      }
      .pricing-deck {
        grid-template-columns: 1fr;
        gap: 2rem;
        max-width: 450px;
        margin-left: auto;
        margin-right: auto;
      }
      .price-tier-card.featured {
        transform: scale(1);
      }
    }
    @media (max-width: 480px) {
      .hero-section {
        padding: 5rem 0 3rem;
      }
      .hero-actions .btn {
        width: 100%;
      }
      .step-card, .price-tier-card {
        padding: 2rem 1.5rem;
      }
      .bento-card {
        padding: 0.85rem;
      }
      .platform-link-card {
        padding: 0.75rem;
      }
      .faq-summary {
        font-size: 1.05rem;
        padding: 1.25rem;
      }
      .faq-content {
        padding: 0 1.25rem 1.25rem;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  protected locale: Locale = 'en';
  protected readonly storeUrl = CHROME_WEB_STORE_URL;
  protected text = HOME_COPY.en;
  protected pathFor = pathFor;

  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);

  get packs() {
    return this.text.pricing.packs;
  }

  buyCredits() {
    window.location.href = pathFor('credits', this.locale);
  }

  ngOnInit(): void {
    this.locale = (this.route.snapshot.data['locale'] || 'en') as Locale;
    this.text = HOME_COPY[this.locale] || HOME_COPY.en;
    this.seo.applyPage('home', this.locale);
  }
}

const HOME_COPY: Partial<Record<Locale, any>> & { en: any; pl: any } = {
  en: {
    hero: {
      eyebrow: 'AI quiz solver Chrome extension',
      headingStart: 'Unlock the ultimate',
      headingAccent: 'Quiz Solving Power',
      lead: 'A clean browser extension for quick answer suggestions, short explanations, saved study notes, and custom history practice quizzes.',
      primary: 'Install from Chrome Web Store',
      secondary: 'See how it works',
      proof: ['Testportal, Moodle, Canvas, Forms and more', 'Notes and images saved with questions', 'Shareable quizzes from history']
    },
    how: {
      eyebrow: 'How it works',
      title: 'One connected workflow, not ten scattered tools',
      subtitle: 'QuizSolver keeps your live answer search and study review connected.',
      steps: [
        { title: 'Install and sign in', text: 'Create a free account. Use the same credentials in the Chrome extension and on getquizsolver.com.' },
        { title: 'Solve or scan', text: 'Use automatic page solving for standard quiz templates, or use FocusScan to capture image-based questions.' },
        { title: 'Review and study', text: 'Your solved questions automatically become study notes, flashcards, and custom practice quizzes.' }
      ]
    },
    features: {
      eyebrow: 'Core features',
      title: 'Tools that explain what to do next',
      subtitle: 'QuizSolver is built around the moments that actually happen during online quizzes: visible questions, hidden answer modes, images, quick checks and revision later.',
      items: [
        { icon: 'QD', title: 'Question detection', text: 'Click Solve current page and the extension reads the visible question, answer options, question type and images before showing a suggestion.' },
        { icon: 'HM', title: 'Hint mode', text: 'Turn this on when you want to stay in control. QuizSolver highlights the likely answer instead of clicking it automatically.' },
        { icon: 'FS', title: 'FocusScan', text: 'Drag around a question when it is inside an image, canvas, PDF preview or unusual portal layout. Only that selected area is scanned.' },
        { icon: 'QO', title: 'Quick overlay', text: 'Open a small movable panel on the page for fast actions such as solving the current question or solving selected text.' },
        { icon: 'NT', title: 'History and notes', text: 'Solved questions can be saved with answer, explanation, source page, images and your own note so you can review them later.' },
        { icon: 'PQ', title: 'Practice quiz from history', text: 'Turn saved questions into a practice quiz, check your result, and see which answers were correct after finishing.' },
        { icon: 'SH', title: 'Share latest questions', text: 'Choose how many recent questions to share and generate a public quiz link for classmates without giving them your account.' },
        { icon: 'ID', title: 'Kahoot Quiz ID mode', text: 'When a Kahoot host hides questions, paste the Quiz ID from the URL to open a searchable answer bank without spending AI credits.' }
      ]
    },
    platforms: {
      eyebrow: 'Seamless platform integrations',
      title: 'Optimized for the systems you actually use',
      subtitle: 'QuizSolver integrates directly with common LMS platforms and form builders.',
      items: [
        { name: 'Testportal', href: '/testportal-quiz-solver' },
        { name: 'Moodle', href: '/moodle-quiz-solver' },
        { name: 'Canvas LMS', href: '/canvas-quiz-solver' },
        { name: 'Google Forms', href: '/google-forms-quiz-solver' },
        { name: 'Microsoft Forms', href: '/microsoft-forms-quiz-solver' },
        { name: 'Blackboard Learn', href: '/blackboard-quiz-solver' },
        { name: 'Quizlet', href: '/quizlet-solver' },
        { name: 'Socrative', href: '/socrative-quiz-solver' },
        { name: 'Kahoot', href: '/kahoot-ai-bot' },
        { name: 'Quizizz', href: '/quizizz-solver' }
      ]
    },
    pricing: {
      eyebrow: 'Simple Credits Pricing',
      title: 'Top up only when you actually need it',
      subtitle: 'No recurring subscriptions. One-time credit packages keep it simple: answers and explanations spend credits, your study history is free forever.',
      badge: 'Most Popular',
      packs: [
        { id: 'starter', name: '100 credits', price: '$1.99', caption: 'Small top-up', button: 'Get 100 Credits', features: ['One-time purchase, no subscription', 'Good for quick practice tests', 'Works for both answers and explanations', 'Lifetime access to saved notes'] },
        { id: 'popular', name: '500 credits', price: '$4.99', caption: 'Regular use pack', button: 'Choose 500 Credits', features: ['Save 15% compared to starter', 'Great for weekly homework tasks', 'High priority response speed', 'Lifetime access to saved notes'] },
        { id: 'pro', name: '2000 credits', price: '$9.99', caption: 'Heavy study sessions', button: 'Choose 2000 Credits', features: ['Best value per credit', 'Perfect for midterms and finals preparation', 'Highest priority response speed', 'Lifetime access to saved notes'] }
      ]
    },
    faqTitle: 'Frequently asked questions',
    faq: [
      { question: 'What should I click when I open a quiz page?', answer: 'Open the QuizSolver extension and click Solve current page. If the page is supported, QuizSolver detects the visible question and answer options. If the layout is unusual, use FocusScan and draw a box around the question.' },
      { question: 'What is Hint mode for?', answer: 'Hint mode is for situations where you do not want the extension to click anything. It marks the likely answer visually, so you decide what to select.' },
      { question: 'Does the demo or tutorial use credits?', answer: 'No. The demo page uses predefined local questions and answers. It is there so you can learn the workflow without sending anything to AI and without spending credits.' },
      { question: 'Where can I review solved questions later?', answer: 'Saved questions are available in History & quiz. You can add notes, mark favorites, create practice quizzes and share selected questions as a public link.' },
      { question: 'What is the difference between a Kahoot PIN and Quiz ID?', answer: 'The PIN lets you join a live Kahoot game. The Quiz ID identifies the quiz itself and appears in some Kahoot URLs after quizId=. QuizSolver uses Quiz ID only for the answer-bank mode.' }
    ]
  },
  pl: {
    hero: {
      eyebrow: 'Rozszerzenie Chrome AI quiz solver',
      headingStart: 'Rozwiązuj quizy z',
      headingAccent: 'mocą AI',
      lead: 'Przejrzyste rozszerzenie do szybkich sugestii odpowiedzi, krótkich wyjaśnień pojęć, własnych notatek i quizów powtórkowych.',
      primary: 'Zainstaluj z Chrome Web Store',
      secondary: 'Zobacz jak to działa',
      proof: ['Testportal, Moodle, Canvas, Forms i inne', 'Notatki i obrazy zapisywane z pytaniami', 'Udostępniane quizy z historii']
    },
    how: {
      eyebrow: 'Jak to działa',
      title: 'Jeden spójny workflow, zamiast rozproszonych narzędzi',
      subtitle: 'QuizSolver łączy w jedno szybkie sugestie odpowiedzi na żywo z późniejszą nauką do egzaminów.',
      steps: [
        { title: 'Zainstaluj i zaloguj się', text: 'Załóż darmowe konto. Używasz tych samych danych w rozszerzeniu Chrome oraz na getquizsolver.com.' },
        { title: 'Rozwiąż lub zeskanuj', text: 'Korzystaj z automatycznego rozwiązywania standardowych stron lub użyj FocusScan do przechwycenia obrazków.' },
        { title: 'Ucz się i powtarzaj', text: 'Twoje rozwiązane pytania automatycznie stają się notatkami do nauki, fiszkami i quizami powtórkowymi.' }
      ]
    },
    features: {
      eyebrow: 'Główne funkcje',
      title: 'Funkcje, które mówią co zrobić dalej',
      subtitle: 'QuizSolver skupia się na realnych sytuacjach z quizów: widoczne pytania, tryb podpowiedzi, obrazki, szybki overlay, historia i powtórki.',
      items: [
        { icon: 'QD', title: 'Wykrywanie pytań', text: 'Klikasz Rozwiąż obecną stronę, a rozszerzenie odczytuje widoczne pytanie, odpowiedzi, typ pytania i obrazki, zanim pokaże sugestię.' },
        { icon: 'HM', title: 'Tryb podpowiedzi', text: 'Włącz go, gdy nie chcesz automatycznego kliknięcia. QuizSolver tylko wizualnie zaznaczy prawdopodobną odpowiedź.' },
        { icon: 'FS', title: 'FocusScan', text: 'Zaznacz obszar z pytaniem, gdy jest w obrazku, canvasie, podglądzie PDF albo nietypowym układzie strony. Skanowany jest tylko ten fragment.' },
        { icon: 'QO', title: 'Szybki overlay', text: 'Otwórz małe, przesuwalne okno na stronie z akcjami do szybkiego rozwiązania pytania lub zaznaczonego tekstu.' },
        { icon: 'NT', title: 'Historia i notatki', text: 'Rozwiązane pytania mogą zapisać się z odpowiedzią, wyjaśnieniem, stroną źródłową, obrazkami i Twoją własną notatką.' },
        { icon: 'PQ', title: 'Quiz z historii', text: 'Z zapisanych pytań tworzysz quiz powtórkowy, sprawdzasz wynik i widzisz, które odpowiedzi były poprawne.' },
        { icon: 'SH', title: 'Udostępnianie ostatnich pytań', text: 'Wybierasz ile ostatnich pytań udostępnić i generujesz publiczny link do quizu bez udostępniania konta.' },
        { icon: 'ID', title: 'Kahoot Quiz ID', text: 'Gdy host Kahoota ukrywa pytania, wklejasz Quiz ID z adresu URL i otwierasz wyszukiwalny bank odpowiedzi bez zużywania kredytów AI.' }
      ]
    },
    platforms: {
      eyebrow: 'Integracja z platformami',
      title: 'Zoptymalizowane pod systemy, z których korzystasz',
      subtitle: 'QuizSolver wspiera bezpośrednie zaczytywanie pytań na wiodących platformach LMS i w kreatorach formularzy.',
      items: [
        { name: 'Testportal', href: '/pl/testportal-quiz-solver' },
        { name: 'Moodle', href: '/pl/moodle-quiz-solver' },
        { name: 'Canvas LMS', href: '/pl/canvas-quiz-solver' },
        { name: 'Google Forms', href: '/pl/google-forms-quiz-solver' },
        { name: 'Microsoft Forms', href: '/pl/microsoft-forms-quiz-solver' },
        { name: 'Blackboard Learn', href: '/pl/blackboard-quiz-solver' },
        { name: 'Quizlet', href: '/pl/quizlet-solver' },
        { name: 'Socrative', href: '/pl/socrative-quiz-solver' },
        { name: 'Kahoot', href: '/pl/kahoot-ai-bot' },
        { name: 'Quizizz', href: '/pl/quizizz-solver' }
      ]
    },
    pricing: {
      eyebrow: 'Prosty Cennik Kredytów',
      title: 'Doładowujesz konto tylko wtedy, gdy tego potrzebujesz',
      subtitle: 'Bez cyklicznych subskrypcji. Jednorazowe pakiety kredytów: odpowiedzi i wyjaśnienia zużywają kredyty, historia nauki pozostaje darmowa na zawsze.',
      badge: 'Najchętniej Wybierany',
      packs: [
        { id: 'starter', name: '100 kredytów', price: '$1.99', caption: 'Małe doładowanie', button: 'Kup 100 Kredytów', features: ['Jednorazowy zakup, brak subskrypcji', 'Idealne do szybkich testów sprawdzających', 'Obejmuje odpowiedzi i wyjaśnienia', 'Bezterminowy, darmowy dostęp do historii'] },
        { id: 'popular', name: '500 kredytów', price: '$4.99', caption: 'Pakiet regularny', button: 'Wybierz 500 Kredytów', features: ['Oszczędzasz 15% w porównaniu z pakietem Starter', 'Świetny do regularnej nauki i prac domowych', 'Wysoki priorytet generowania odpowiedzi', 'Bezterminowy, darmowy dostęp do historii'] },
        { id: 'pro', name: '2000 kredytów', price: '$9.99', caption: 'Sesja egzaminacyjna', button: 'Wybierz 2000 Kredytów', features: ['Najlepsza cena w przeliczeniu na kredyt', 'Idealne do przygotowania przed kolokwiami i sesją', 'Najwyższy priorytet generowania odpowiedzi', 'Bezterminowy, darmowy dostęp do historii'] }
      ]
    },
    faqTitle: 'Najczęściej zadawane pytania',
    faq: [
      { question: 'Co kliknąć po wejściu na stronę z quizem?', answer: 'Otwórz rozszerzenie QuizSolver i kliknij Rozwiąż obecną stronę. Jeśli strona jest obsługiwana, narzędzie wykryje pytanie i opcje odpowiedzi. Przy nietypowym układzie użyj FocusScan i zaznacz sam obszar pytania.' },
      { question: 'Do czego służy tryb podpowiedzi?', answer: 'Tryb podpowiedzi jest dla sytuacji, w których nie chcesz automatycznego klikania. Rozszerzenie tylko zaznacza prawdopodobną odpowiedź, a decyzja zostaje po Twojej stronie.' },
      { question: 'Czy demo albo tutorial zużywa kredyty?', answer: 'Nie. Strona demo korzysta z gotowych lokalnych pytań i odpowiedzi. Możesz spokojnie sprawdzić cały workflow bez wysyłania zapytań do AI i bez zużywania kredytów.' },
      { question: 'Gdzie wrócić do rozwiązanych pytań?', answer: 'W zakładce Historia i quiz możesz przeglądać zapisane pytania, dodawać notatki, oznaczać ulubione, uruchamiać quiz powtórkowy i udostępniać wybrane pytania linkiem.' },
      { question: 'Czym różni się PIN Kahoota od Quiz ID?', answer: 'PIN służy do dołączenia do gry na żywo. Quiz ID identyfikuje konkretny quiz i czasem widać go w adresie URL po quizId=. QuizSolver używa Quiz ID tylko w trybie banku odpowiedzi.' }
    ]
  }
};

const HOME_LOCALE_TEXT: Record<Exclude<Locale, 'en' | 'pl'>, any> = {
  de: {
    headingStart: 'Löse Quizze mit',
    headingAccent: 'KI-Power',
    eyebrow: 'KI-Quiz-Solver Chrome-Erweiterung',
    lead: 'Eine klare Browser-Erweiterung für schnelle Antwortvorschläge, kurze Erklärungen, Lernnotizen und Quizze aus deiner Historie.',
    primary: 'Aus dem Chrome Web Store installieren',
    secondary: 'So funktioniert es',
    proof: ['Testportal, Moodle, Canvas, Forms und mehr', 'Notizen und Bilder werden mit Fragen gespeichert', 'Teilbare Quizze aus deiner Historie'],
    how: ['So funktioniert es', 'Ein verbundener Workflow statt vieler einzelner Tools', 'QuizSolver verbindet Live-Antwortsuche mit späterem Lernen.'],
    steps: [['Installieren und anmelden', 'Erstelle ein kostenloses Konto und nutze dieselben Daten in Erweiterung und Website.'], ['Lösen oder scannen', 'Nutze automatisches Lösen oder FocusScan für Fragen in Bildern.'], ['Wiederholen und lernen', 'Gelöste Fragen werden zu Notizen, Karteikarten und Übungsquizzen.']],
    features: ['Kernfunktionen', 'Werkzeuge, die den nächsten Schritt erklären', 'Für sichtbare Fragen, Hinweis-Modus, Bilder, Quick Overlay, Historie und Wiederholung.', ['Fragenerkennung', 'Klicke Aktuelle Seite lösen: Die Erweiterung liest Frage, Optionen, Fragetyp und Bilder, bevor sie eine Antwort vorschlägt.'], ['Hinweis-Modus', 'Nutze ihn, wenn nichts automatisch geklickt werden soll. QuizSolver markiert nur die wahrscheinlich richtige Antwort.'], ['FocusScan', 'Markiere einen Bereich, wenn die Frage in einem Bild, Canvas, PDF oder ungewöhnlichen Layout steckt.'], ['Quick Overlay', 'Öffne ein kleines verschiebbares Fenster auf der Seite für schnelle Aktionen.'], ['Historie und Notizen', 'Speichere gelöste Fragen mit Antwort, Erklärung, Quelle, Bildern und eigenen Notizen.'], ['Übungsquiz aus Historie', 'Verwandle gespeicherte Fragen in ein Übungsquiz und prüfe danach die richtigen Antworten.'], ['Fragen teilen', 'Wähle aktuelle Fragen aus und erstelle einen öffentlichen Quizlink für andere.'], ['Kahoot Quiz ID', 'Wenn der Host Fragen ausblendet, öffnet die Quiz ID einen Suchbereich mit Antworten ohne AI-Credits.']],
    pricing: ['Einfache Credit-Preise', 'Lade nur auf, wenn du es brauchst', 'Keine Abos. Antworten und Erklärungen nutzen Credits, deine Historie bleibt verfügbar.', 'Beliebt'],
    faqTitle: 'Häufige Fragen'
  },
  es: {
    headingStart: 'Resuelve quizzes con',
    headingAccent: 'potencia AI',
    eyebrow: 'Extensión Chrome AI quiz solver',
    lead: 'Una extensión limpia para sugerencias rápidas, explicaciones breves, notas guardadas y quizzes de práctica desde tu historial.',
    primary: 'Instalar desde Chrome Web Store',
    secondary: 'Ver cómo funciona',
    proof: ['Testportal, Moodle, Canvas, Forms y más', 'Notas e imágenes guardadas con preguntas', 'Quizzes compartibles desde el historial'],
    how: ['Cómo funciona', 'Un flujo conectado, no diez herramientas sueltas', 'QuizSolver conecta respuestas en vivo con estudio posterior.'],
    steps: [['Instala e inicia sesión', 'Crea una cuenta gratis y usa los mismos datos en la extensión y la web.'], ['Resuelve o escanea', 'Usa solución automática o FocusScan para preguntas en imágenes.'], ['Repasa y estudia', 'Las preguntas resueltas se convierten en notas, tarjetas y quizzes.']],
    features: ['Funciones principales', 'Herramientas que explican el siguiente paso', 'Para preguntas visibles, modo pista, imágenes, overlay rápido, historial y práctica.', ['Detección de preguntas', 'Haz clic en Resolver página actual: la extensión lee la pregunta, opciones, tipo e imágenes antes de sugerir una respuesta.'], ['Modo pista', 'Úsalo cuando no quieres clics automáticos. QuizSolver solo marca la respuesta probable.'], ['FocusScan', 'Selecciona un área cuando la pregunta está en una imagen, canvas, PDF o diseño extraño.'], ['Overlay rápido', 'Abre una ventana pequeña y movible en la página con acciones rápidas.'], ['Historial y notas', 'Guarda preguntas resueltas con respuesta, explicación, fuente, imágenes y tus notas.'], ['Quiz de práctica', 'Convierte preguntas guardadas en un quiz y revisa las respuestas correctas al final.'], ['Compartir preguntas', 'Elige preguntas recientes y crea un enlace público para compartirlas.'], ['Kahoot Quiz ID', 'Si el host oculta preguntas, Quiz ID abre un banco buscable de respuestas sin gastar créditos AI.']],
    pricing: ['Precios simples por créditos', 'Recarga solo cuando lo necesites', 'Sin suscripciones. Las respuestas y explicaciones usan créditos; el historial queda disponible.', 'Popular'],
    faqTitle: 'Preguntas frecuentes'
  },
  fr: {
    headingStart: 'Résolvez des quiz avec',
    headingAccent: 'la puissance IA',
    eyebrow: 'Extension Chrome IA quiz solver',
    lead: 'Une extension claire pour suggestions rapides, explications courtes, notes sauvegardées et entraînement depuis l’historique.',
    primary: 'Installer depuis Chrome Web Store',
    secondary: 'Voir le fonctionnement',
    proof: ['Testportal, Moodle, Canvas, Forms et plus', 'Notes et images sauvegardées avec les questions', 'Quiz partageables depuis l’historique'],
    how: ['Fonctionnement', 'Un flux connecté, pas dix outils dispersés', 'QuizSolver relie les réponses en direct à la révision.'],
    steps: [['Installer et se connecter', 'Créez un compte gratuit et utilisez-le dans l’extension et le site.'], ['Résoudre ou scanner', 'Utilisez la résolution automatique ou FocusScan pour les images.'], ['Réviser et apprendre', 'Les questions résolues deviennent notes, cartes et quiz.']],
    features: ['Fonctions clés', 'Des outils qui indiquent la suite', 'Pour questions visibles, mode indice, images, overlay rapide, historique et révision.', ['Détection des questions', 'Cliquez Résoudre la page : l’extension lit la question, les options, le type et les images avant de proposer une réponse.'], ['Mode indice', 'À utiliser quand vous ne voulez aucun clic automatique. QuizSolver marque seulement la réponse probable.'], ['FocusScan', 'Sélectionnez une zone si la question est dans une image, un canvas, un PDF ou un layout inhabituel.'], ['Overlay rapide', 'Ouvrez une petite fenêtre déplaçable avec les actions rapides sur la page.'], ['Historique et notes', 'Enregistrez les questions avec réponse, explication, source, images et notes personnelles.'], ['Quiz d’entraînement', 'Transformez les questions enregistrées en quiz et vérifiez les bonnes réponses à la fin.'], ['Partage de questions', 'Choisissez des questions récentes et créez un lien public.'], ['Kahoot Quiz ID', 'Si l’hôte masque les questions, Quiz ID ouvre une banque de réponses sans crédits IA.']],
    pricing: ['Tarifs crédits simples', 'Rechargez seulement si nécessaire', 'Pas d’abonnement. Réponses et explications utilisent des crédits, l’historique reste disponible.', 'Populaire'],
    faqTitle: 'Questions fréquentes'
  },
  it: {
    headingStart: 'Risolvi quiz con',
    headingAccent: 'potenza AI',
    eyebrow: 'Estensione Chrome AI quiz solver',
    lead: 'Un’estensione pulita per suggerimenti rapidi, spiegazioni brevi, note salvate e quiz di pratica dalla cronologia.',
    primary: 'Installa da Chrome Web Store',
    secondary: 'Vedi come funziona',
    proof: ['Testportal, Moodle, Canvas, Forms e altro', 'Note e immagini salvate con le domande', 'Quiz condivisibili dalla cronologia'],
    how: ['Come funziona', 'Un flusso unico, non dieci strumenti separati', 'QuizSolver collega risposte live e ripasso successivo.'],
    steps: [['Installa e accedi', 'Crea un account gratuito e usa gli stessi dati in estensione e sito.'], ['Risolvi o scansiona', 'Usa la soluzione automatica o FocusScan per immagini.'], ['Ripassa e studia', 'Le domande risolte diventano note, flashcard e quiz.']],
    features: ['Funzioni principali', 'Strumenti che spiegano il prossimo passo', 'Per domande visibili, modalità suggerimento, immagini, overlay rapido, cronologia e ripasso.', ['Rilevamento domande', 'Clicca Risolvi pagina corrente: l’estensione legge domanda, opzioni, tipo e immagini prima di suggerire una risposta.'], ['Modalità suggerimento', 'Usala quando non vuoi clic automatici. QuizSolver evidenzia solo la risposta probabile.'], ['FocusScan', 'Seleziona un’area quando la domanda è in immagine, canvas, PDF o layout insolito.'], ['Overlay rapido', 'Apri una piccola finestra spostabile sulla pagina con azioni rapide.'], ['Cronologia e note', 'Salva domande risolte con risposta, spiegazione, fonte, immagini e note personali.'], ['Quiz di pratica', 'Trasforma domande salvate in un quiz e controlla le risposte corrette alla fine.'], ['Condividi domande', 'Scegli domande recenti e crea un link pubblico.'], ['Kahoot Quiz ID', 'Se l’host nasconde le domande, Quiz ID apre un banco risposte senza crediti AI.']],
    pricing: ['Prezzi crediti semplici', 'Ricarica solo quando serve', 'Nessun abbonamento. Risposte e spiegazioni usano crediti; la cronologia resta disponibile.', 'Popolare'],
    faqTitle: 'Domande frequenti'
  },
  uk: {
    headingStart: 'Розв’язуй квізи з',
    headingAccent: 'силою AI',
    eyebrow: 'Chrome-розширення AI quiz solver',
    lead: 'Зручне розширення для швидких підказок, коротких пояснень, збережених нотаток і практики з історії.',
    primary: 'Встановити з Chrome Web Store',
    secondary: 'Як це працює',
    proof: ['Testportal, Moodle, Canvas, Forms та інші', 'Нотатки й зображення зберігаються з питаннями', 'Квізи з історії можна ділитися'],
    how: ['Як це працює', 'Один зв’язаний workflow замість купи інструментів', 'QuizSolver поєднує живі відповіді з подальшим навчанням.'],
    steps: [['Встанови й увійди', 'Створи безкоштовний акаунт і використовуй його в розширенні та на сайті.'], ['Розв’язуй або скануй', 'Використовуй автопошук або FocusScan для питань у зображеннях.'], ['Повторюй і вчися', 'Розв’язані питання стають нотатками, картками і тренувальними квізами.']],
    features: ['Основні функції', 'Інструменти, що пояснюють наступний крок', 'Для видимих питань, режиму підказки, зображень, швидкого overlay, історії та повторення.', ['Виявлення питань', 'Натисни Розв’язати сторінку: розширення читає питання, варіанти, тип і зображення перед підказкою.'], ['Режим підказки', 'Використовуй, коли не хочеш автоматичних кліків. QuizSolver лише підсвічує ймовірну відповідь.'], ['FocusScan', 'Виділи область, якщо питання в зображенні, canvas, PDF або незвичному макеті.'], ['Швидкий overlay', 'Відкрий маленьке рухоме вікно на сторінці з швидкими діями.'], ['Історія і нотатки', 'Зберігай розв’язані питання з відповіддю, поясненням, джерелом, зображеннями і нотатками.'], ['Квіз з історії', 'Перетвори збережені питання на тренувальний квіз і перевір правильні відповіді після завершення.'], ['Поширення питань', 'Обери останні питання і створи публічне посилання для інших.'], ['Kahoot Quiz ID', 'Якщо хост ховає питання, Quiz ID відкриває банк відповідей без витрати AI-кредитів.']],
    pricing: ['Прості ціни кредитів', 'Поповнюй лише коли потрібно', 'Без підписок. Відповіді й пояснення витрачають кредити, історія доступна завжди.', 'Популярне'],
    faqTitle: 'Поширені питання'
  }
};

const HOME_PLATFORM_KEYS: PageKey[] = ['testportal', 'moodle', 'canvas', 'googleForms', 'microsoftForms', 'blackboard', 'quizlet', 'socrative', 'kahoot', 'quizizz'];

const HOME_DETAIL_TEXT: Record<Exclude<Locale, 'en' | 'pl'>, any> = {
  de: {
    platforms: ['Nahtlose Plattform-Integrationen', 'Optimiert für die Systeme, die du wirklich nutzt', 'QuizSolver arbeitet direkt mit gängigen LMS-Plattformen und Formular-Tools.'],
    packs: [
      ['Kleines Guthaben', '100 Credits holen', ['Einmaliger Kauf, kein Abo', 'Gut für kurze Übungstests', 'Für Antworten und Erklärungen', 'Dauerhafter Zugriff auf Notizen']],
      ['Paket für regelmäßige Nutzung', '500 Credits wählen', ['15% günstiger als Starter', 'Ideal für wöchentliche Aufgaben', 'Hohe Antwortpriorität', 'Dauerhafter Zugriff auf Notizen']],
      ['Große Lernsessions', '2000 Credits wählen', ['Bester Preis pro Credit', 'Perfekt für Prüfungsphasen', 'Höchste Antwortpriorität', 'Dauerhafter Zugriff auf Notizen']]
    ],
    faq: [
      ['Was klicke ich auf einer Quizseite?', 'Öffne die Erweiterung und klicke Aktuelle Seite lösen. Bei ungewöhnlichen Layouts markierst du die Frage mit FocusScan.'],
      ['Wofür ist der Hinweis-Modus?', 'Er markiert die wahrscheinlich richtige Antwort, ohne automatisch zu klicken. Du entscheidest selbst, was du auswählst.'],
      ['Verbraucht die Demo Credits?', 'Nein. Die Demo nutzt lokale Beispielfragen und ist nur zum Lernen des Workflows gedacht.'],
      ['Wo finde ich gelöste Fragen?', 'Alle gespeicherten Fragen liegen in Historie & Quiz. Dort kannst du Notizen ergänzen, üben und Links teilen.'],
      ['Was ist Kahoot Quiz ID?', 'Quiz ID identifiziert den Quiz-Inhalt. Der Live-PIN ist nur zum Beitreten eines Spiels da.']
    ]
  },
  es: {
    platforms: ['Integraciones fluidas', 'Optimizado para los sistemas que usas', 'QuizSolver se integra con plataformas LMS y formularios comunes.'],
    packs: [
      ['Recarga pequeña', 'Obtener 100 créditos', ['Pago único, sin suscripción', 'Bueno para pruebas rápidas', 'Sirve para respuestas y explicaciones', 'Acceso permanente a notas']],
      ['Pack de uso regular', 'Elegir 500 créditos', ['Ahorra 15% frente al starter', 'Ideal para tareas semanales', 'Respuesta con alta prioridad', 'Acceso permanente a notas']],
      ['Sesiones intensas', 'Elegir 2000 créditos', ['Mejor valor por crédito', 'Perfecto para exámenes', 'Máxima prioridad de respuesta', 'Acceso permanente a notas']]
    ],
    faq: [
      ['¿Qué hago al abrir una página de quiz?', 'Abre la extensión y pulsa Resolver página actual. Si el diseño es raro, usa FocusScan y selecciona solo la pregunta.'],
      ['¿Para qué sirve el modo pista?', 'Marca la respuesta probable sin hacer clic automático, para que tú mantengas el control.'],
      ['¿La demo consume créditos?', 'No. La demo usa preguntas locales preparadas para aprender el flujo sin gastar créditos.'],
      ['¿Dónde reviso preguntas resueltas?', 'En Historial y quiz puedes verlas, añadir notas, practicar y compartir enlaces.'],
      ['¿Qué es Kahoot Quiz ID?', 'Quiz ID identifica el quiz. El PIN solo sirve para entrar a una partida en vivo.']
    ]
  },
  fr: {
    platforms: ['Intégrations fluides', 'Optimisé pour les systèmes que tu utilises', 'QuizSolver s’intègre aux LMS et outils de formulaires courants.'],
    packs: [
      ['Petite recharge', 'Obtenir 100 crédits', ['Achat unique, sans abonnement', 'Idéal pour des tests rapides', 'Fonctionne pour réponses et explications', 'Accès permanent aux notes']],
      ['Pack régulier', 'Choisir 500 crédits', ['15% d’économie vs starter', 'Parfait pour les devoirs hebdomadaires', 'Réponses prioritaires', 'Accès permanent aux notes']],
      ['Grosses sessions', 'Choisir 2000 crédits', ['Meilleur prix par crédit', 'Parfait pour les examens', 'Priorité maximale', 'Accès permanent aux notes']]
    ],
    faq: [
      ['Que faire sur une page de quiz ?', 'Ouvrez l’extension et cliquez Résoudre la page. Si le layout est inhabituel, utilisez FocusScan sur la question.'],
      ['À quoi sert le mode indice ?', 'Il marque la réponse probable sans cliquer automatiquement, pour garder le contrôle.'],
      ['La démo consomme-t-elle des crédits ?', 'Non. La démo utilise des questions locales préparées pour apprendre le workflow.'],
      ['Où revoir les questions résolues ?', 'Dans Historique et quiz, vous pouvez revoir, annoter, pratiquer et partager des questions.'],
      ['Qu’est-ce que Kahoot Quiz ID ?', 'Quiz ID identifie le quiz. Le PIN sert seulement à rejoindre une partie en direct.']
    ]
  },
  it: {
    platforms: ['Integrazioni fluide', 'Ottimizzato per i sistemi che usi davvero', 'QuizSolver si integra con LMS e strumenti per moduli comuni.'],
    packs: [
      ['Piccola ricarica', 'Ottieni 100 crediti', ['Acquisto una tantum, niente abbonamento', 'Ottimo per test rapidi', 'Vale per risposte e spiegazioni', 'Accesso permanente alle note']],
      ['Pack uso regolare', 'Scegli 500 crediti', ['Risparmi il 15% rispetto allo starter', 'Ideale per compiti settimanali', 'Risposte ad alta priorità', 'Accesso permanente alle note']],
      ['Sessioni intense', 'Scegli 2000 crediti', ['Miglior valore per credito', 'Perfetto per esami', 'Massima priorità', 'Accesso permanente alle note']]
    ],
    faq: [
      ['Cosa clicco su una pagina quiz?', 'Apri l’estensione e premi Risolvi pagina corrente. Per layout insoliti usa FocusScan sulla domanda.'],
      ['A cosa serve la modalità suggerimento?', 'Evidenzia la risposta probabile senza clic automatici, così decidi tu cosa selezionare.'],
      ['La demo consuma crediti?', 'No. La demo usa domande locali preparate per imparare il flusso.'],
      ['Dove rivedo le domande risolte?', 'In Cronologia e quiz puoi rivederle, aggiungere note, fare pratica e condividere link.'],
      ['Cos’è Kahoot Quiz ID?', 'Quiz ID identifica il quiz. Il PIN serve solo per entrare in una partita live.']
    ]
  },
  uk: {
    platforms: ['Плавні інтеграції', 'Оптимізовано для систем, якими ти реально користуєшся', 'QuizSolver працює з популярними LMS і формами напряму.'],
    packs: [
      ['Мале поповнення', 'Отримати 100 кредитів', ['Разова покупка, без підписки', 'Добре для швидких тренувань', 'Працює для відповідей і пояснень', 'Постійний доступ до нотаток']],
      ['Пакет для регулярного використання', 'Вибрати 500 кредитів', ['Економія 15% проти starter', 'Зручно для щотижневих завдань', 'Високий пріоритет відповіді', 'Постійний доступ до нотаток']],
      ['Великі навчальні сесії', 'Вибрати 2000 кредитів', ['Найкраща ціна за кредит', 'Ідеально перед іспитами', 'Найвищий пріоритет відповіді', 'Постійний доступ до нотаток']]
    ],
    faq: [
      ['Що натиснути на сторінці квізу?', 'Відкрий розширення і натисни Розв’язати сторінку. Для незвичного макета використовуй FocusScan.'],
      ['Для чого режим підказки?', 'Він підсвічує ймовірну відповідь без автоматичного кліку, щоб рішення залишалося за тобою.'],
      ['Чи витрачає демо кредити?', 'Ні. Демо використовує локальні підготовлені питання, щоб навчити workflow.'],
      ['Де переглянути розв’язані питання?', 'В Історія і квіз можна переглядати, додавати нотатки, тренуватися і ділитися посиланням.'],
      ['Що таке Kahoot Quiz ID?', 'Quiz ID визначає сам квіз. PIN потрібен лише для входу в живу гру.']
    ]
  }
};

function makeHomeCopy(locale: Exclude<Locale, 'en' | 'pl'>): any {
  const t = HOME_LOCALE_TEXT[locale];
  const detail = HOME_DETAIL_TEXT[locale];
  const features = t.features.slice(3).map(([title, text]: string[], i: number) => ({
    icon: HOME_COPY.en.features.items[i].icon,
    title,
    text
  }));
  const packs = HOME_COPY.en.pricing.packs.map((pack: any, index: number) => ({
    ...pack,
    caption: detail.packs[index][0],
    button: detail.packs[index][1],
    features: detail.packs[index][2]
  }));
  return {
    hero: {
      eyebrow: t.eyebrow,
      headingStart: t.headingStart,
      headingAccent: t.headingAccent,
      lead: t.lead,
      primary: t.primary,
      secondary: t.secondary,
      proof: t.proof
    },
    how: {
      eyebrow: t.how[0],
      title: t.how[1],
      subtitle: t.how[2],
      steps: t.steps.map(([title, text]: string[]) => ({ title, text }))
    },
    features: {
      eyebrow: t.features[0],
      title: t.features[1],
      subtitle: t.features[2],
      items: features
    },
    platforms: {
      eyebrow: detail.platforms[0],
      title: detail.platforms[1],
      subtitle: detail.platforms[2],
      items: HOME_COPY.en.platforms.items.map((item: any, index: number) => ({ ...item, href: pathFor(HOME_PLATFORM_KEYS[index], locale) }))
    },
    pricing: {
      eyebrow: t.pricing[0],
      title: t.pricing[1],
      subtitle: t.pricing[2],
      badge: t.pricing[3],
      packs
    },
    faqTitle: t.faqTitle,
    faq: detail.faq.map(([question, answer]: string[]) => ({ question, answer }))
  };
}

HOME_COPY.de = makeHomeCopy('de');
HOME_COPY.es = makeHomeCopy('es');
HOME_COPY.fr = makeHomeCopy('fr');
HOME_COPY.it = makeHomeCopy('it');
HOME_COPY.uk = makeHomeCopy('uk');
