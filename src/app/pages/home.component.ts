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
            
            <!-- Social Proof Statistics -->
            <div class="hero-proof-stats delay-3">
              <div class="rating-stars community-mark" aria-hidden="true">
                <span class="star">✓</span>
              </div>
              <span class="rating-text">{{ text.hero.socialProof }}</span>
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
      margin-bottom: 2.25rem;
    }
    .hero-actions .btn {
      min-width: 220px;
    }

    .hero-proof-stats {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 4.5rem;
      font-size: 0.95rem;
      color: var(--text-secondary);
    }
    .rating-stars {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border-radius: 999px;
      color: #d1fae5;
      background: rgba(22, 163, 111, 0.18);
      border: 1px solid rgba(22, 163, 111, 0.36);
      box-shadow: 0 0 18px rgba(22, 163, 111, 0.16);
    }
    .rating-text {
      font-family: var(--font-heading);
      font-weight: 500;
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
      headingStart: 'AI Quiz Solver Chrome Extension —',
      headingAccent: 'Solve Any Quiz Instantly',
      lead: 'Instantly solve quizzes on Testportal, Moodle, Kahoot, Canvas, Google Forms and 7 more platforms. Get AI answer suggestions with step-by-step explanations — free to install.',
      primary: 'Install from Chrome Web Store',
      secondary: 'See how it works',
      proof: ['Testportal, Moodle, Canvas, Forms and more', 'Notes and images saved with questions', 'Shareable quizzes from history'],
      socialProof: 'Join the first QuizSolver users shaping the AI quiz solver built for real study workflows.'
    },
    how: {
      eyebrow: 'How QuizSolver works',
      title: '3 steps to solve any quiz with AI',
      subtitle: 'Install once, solve quizzes on any supported platform, and automatically build a personal study library.',
      steps: [
        { title: 'Install and sign in', text: 'Add QuizSolver to Chrome for free. Create an account — your solved questions, notes, and practice quizzes sync across the extension and the website.' },
        { title: 'Solve or scan', text: 'Click Solve current page when a quiz is open. For image-based questions or unusual layouts, drag FocusScan to capture just the question area.' },
        { title: 'Review and study', text: 'Every solved question is saved to History. Turn them into flashcards, run a practice quiz, or share a set of questions with classmates.' }
      ]
    },
    features: {
      eyebrow: 'QuizSolver features',
      title: 'Everything you need to solve quizzes faster',
      subtitle: 'Built for real quiz situations: visible questions, image-based questions, hint-only mode, quick overlay, and a full study review system.',
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
      subtitle: 'Use one AI quiz solver for Testportal, Moodle, Canvas, Google Forms, Microsoft Forms, Blackboard, Quizlet, Socrative, Kahoot and Quizizz.',
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
      { question: 'Does QuizSolver work on Testportal?', answer: 'Yes. QuizSolver auto-detects questions on Testportal including the timer interface. Open a Testportal quiz, click Solve current page, and you get an AI suggestion within seconds.' },
      { question: 'What is FocusScan and when should I use it?', answer: 'FocusScan is a screenshot tool inside QuizSolver. Draw a box around any part of the screen — a PDF, image, canvas, or embed — and QuizSolver reads that region instead of the full page. Use it when the question is not in plain HTML text.' },
      { question: 'How many free credits do I get?', answer: 'All new accounts get free starting credits — enough to try answer suggestions and explanations. Additional credits start from $1.99 for 100 credits. Kahoot Quiz ID mode never uses credits.' },
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
      lead: 'Rozwiązuj quizy na Testportal, Moodle, Kahoot, Canvas, Google Forms i 7 kolejnych platformach. Dostajesz sugestie odpowiedzi AI z krótkim wyjaśnieniem krok po kroku — instalacja jest darmowa.',
      primary: 'Zainstaluj z Chrome Web Store',
      secondary: 'Zobacz jak to działa',
      proof: ['Testportal, Moodle, Canvas, Forms i inne', 'Notatki i obrazy zapisywane z pytaniami', 'Udostępniane quizy z historii'],
      socialProof: 'Dołącz do pierwszych użytkowników i pomóż rozwijać najlepszy AI quiz solver do nauki, powtórek i quizów online.'
    },
    how: {
      eyebrow: 'Jak działa QuizSolver',
      title: '3 kroki, żeby rozwiązać quiz z AI',
      subtitle: 'Instalujesz raz, rozwiązujesz quizy na obsługiwanych platformach i automatycznie budujesz własną bibliotekę do nauki.',
      steps: [
        { title: 'Zainstaluj i zaloguj się', text: 'Dodaj QuizSolver do Chrome za darmo. Konto synchronizuje rozwiązane pytania, notatki i quizy powtórkowe między rozszerzeniem a stroną.' },
        { title: 'Rozwiąż lub zeskanuj', text: 'Kliknij Rozwiąż obecną stronę, gdy quiz jest otwarty. Przy pytaniach w obrazku, canvasie albo nietypowym układzie przeciągnij FocusScan tylko po obszarze pytania.' },
        { title: 'Ucz się i udostępniaj', text: 'Każde rozwiązane pytanie trafia do historii. Możesz zrobić z niego fiszki, uruchomić quiz powtórkowy albo udostępnić zestaw pytań innym.' }
      ]
    },
    features: {
      eyebrow: 'Funkcje QuizSolver',
      title: 'Wszystko, czego potrzebujesz do szybszego rozwiązywania quizów',
      subtitle: 'Stworzone pod realne sytuacje: widoczne pytania, pytania w obrazkach, tryb samej podpowiedzi, szybki overlay oraz pełny system powtórek.',
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
      subtitle: 'Jedno rozszerzenie AI do Testportal, Moodle, Canvas, Google Forms, Microsoft Forms, Blackboard, Quizlet, Socrative, Kahoot i Quizizz.',
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
      { question: 'Czy QuizSolver działa na Testportalu?', answer: 'Tak. QuizSolver wykrywa pytania na Testportalu, również w widoku z timerem. Otwierasz quiz, klikasz Rozwiąż obecną stronę i po chwili dostajesz sugestię odpowiedzi AI.' },
      { question: 'Co to jest FocusScan i kiedy go używać?', answer: 'FocusScan to narzędzie do zaznaczania fragmentu ekranu. Obrysowujesz pytanie w PDF-ie, obrazku, canvasie albo nietypowym embedzie, a QuizSolver odczytuje tylko ten obszar zamiast całej strony.' },
      { question: 'Ile darmowych kredytów dostaje nowe konto?', answer: 'Każde nowe konto dostaje darmowe kredyty startowe, żeby sprawdzić sugestie odpowiedzi i wyjaśnienia. Dodatkowe pakiety zaczynają się od $1.99 za 100 kredytów. Tryb Kahoot Quiz ID nie zużywa kredytów.' },
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
    lead: 'Löse Quizze auf Testportal, Moodle, Kahoot, Canvas, Google Forms und 7 weiteren Plattformen. Erhalte KI-Antwortvorschläge mit kurzen Schritt-für-Schritt-Erklärungen.',
    primary: 'Aus dem Chrome Web Store installieren',
    secondary: 'So funktioniert es',
    proof: ['Testportal, Moodle, Canvas, Forms und mehr', 'Notizen und Bilder werden mit Fragen gespeichert', 'Teilbare Quizze aus deiner Historie'],
    socialProof: 'Werde einer der ersten QuizSolver-Nutzer und gestalte einen AI-Quiz-Solver für echte Lernabläufe mit.',
    how: ['So funktioniert QuizSolver', '3 Schritte, um jedes Quiz mit KI zu lösen', 'Einmal installieren, auf unterstützten Plattformen lösen und automatisch eine persönliche Lernbibliothek aufbauen.'],
    steps: [['Installieren und anmelden', 'Installiere QuizSolver kostenlos in Chrome. Dein Konto synchronisiert gelöste Fragen, Notizen und Übungsquizze zwischen Erweiterung und Website.'], ['Lösen oder scannen', 'Klicke Aktuelle Seite lösen. Bei Bildern, Canvas, PDF oder ungewöhnlichem Layout markierst du nur den Fragebereich mit FocusScan.'], ['Wiederholen und teilen', 'Jede gelöste Frage landet in der Historie. Daraus entstehen Karteikarten, Übungsquizze und teilbare Fragensets.']],
    features: ['QuizSolver-Funktionen', 'Alles, was du brauchst, um Quizze schneller zu lösen', 'Für sichtbare Fragen, bildbasierte Fragen, Hinweis-Modus, Quick Overlay und ein vollständiges Wiederholungssystem.', ['Fragenerkennung', 'Klicke Aktuelle Seite lösen: Die Erweiterung liest Frage, Optionen, Fragetyp und Bilder, bevor sie eine Antwort vorschlägt.'], ['Hinweis-Modus', 'Nutze ihn, wenn nichts automatisch geklickt werden soll. QuizSolver markiert nur die wahrscheinlich richtige Antwort.'], ['FocusScan', 'Markiere einen Bereich, wenn die Frage in einem Bild, Canvas, PDF oder ungewöhnlichen Layout steckt.'], ['Quick Overlay', 'Öffne ein kleines verschiebbares Fenster auf der Seite für schnelle Aktionen.'], ['Historie und Notizen', 'Speichere gelöste Fragen mit Antwort, Erklärung, Quelle, Bildern und eigenen Notizen.'], ['Übungsquiz aus Historie', 'Verwandle gespeicherte Fragen in ein Übungsquiz und prüfe danach die richtigen Antworten.'], ['Fragen teilen', 'Wähle aktuelle Fragen aus und erstelle einen öffentlichen Quizlink für andere.'], ['Kahoot Quiz ID', 'Wenn der Host Fragen ausblendet, öffnet die Quiz ID einen Suchbereich mit Antworten ohne AI-Credits.']],
    pricing: ['Einfache Credit-Preise', 'Lade nur auf, wenn du es brauchst', 'Keine Abos. Antworten und Erklärungen nutzen Credits, deine Historie bleibt verfügbar.', 'Beliebt'],
    faqTitle: 'Häufige Fragen'
  },
  es: {
    headingStart: 'Resuelve quizzes con',
    headingAccent: 'potencia AI',
    eyebrow: 'Extensión Chrome AI quiz solver',
    lead: 'Resuelve quizzes en Testportal, Moodle, Kahoot, Canvas, Google Forms y 7 plataformas más. Recibe sugerencias de respuesta con IA y explicaciones paso a paso.',
    primary: 'Instalar desde Chrome Web Store',
    secondary: 'Ver cómo funciona',
    proof: ['Testportal, Moodle, Canvas, Forms y más', 'Notas e imágenes guardadas con preguntas', 'Quizzes compartibles desde el historial'],
    socialProof: 'Únete a los primeros usuarios de QuizSolver y ayuda a crear un AI quiz solver para estudiar mejor.',
    how: ['Cómo funciona QuizSolver', '3 pasos para resolver cualquier quiz con IA', 'Instala una vez, resuelve en plataformas compatibles y crea automáticamente tu biblioteca de estudio.'],
    steps: [['Instala e inicia sesión', 'Añade QuizSolver a Chrome gratis. Tu cuenta sincroniza preguntas resueltas, notas y quizzes de práctica entre la extensión y la web.'], ['Resuelve o escanea', 'Haz clic en Resolver página actual. Para imágenes, canvas, PDF o diseños raros, usa FocusScan solo sobre el área de la pregunta.'], ['Repasa y comparte', 'Cada pregunta resuelta se guarda en Historial. Úsala para tarjetas, quizzes de práctica o enlaces compartidos.']],
    features: ['Funciones de QuizSolver', 'Todo lo que necesitas para resolver quizzes más rápido', 'Para preguntas visibles, preguntas en imágenes, modo pista, overlay rápido y un sistema completo de repaso.', ['Detección de preguntas', 'Haz clic en Resolver página actual: la extensión lee la pregunta, opciones, tipo e imágenes antes de sugerir una respuesta.'], ['Modo pista', 'Úsalo cuando no quieres clics automáticos. QuizSolver solo marca la respuesta probable.'], ['FocusScan', 'Selecciona un área cuando la pregunta está en una imagen, canvas, PDF o diseño extraño.'], ['Overlay rápido', 'Abre una ventana pequeña y movible en la página con acciones rápidas.'], ['Historial y notas', 'Guarda preguntas resueltas con respuesta, explicación, fuente, imágenes y tus notas.'], ['Quiz de práctica', 'Convierte preguntas guardadas en un quiz y revisa las respuestas correctas al final.'], ['Compartir preguntas', 'Elige preguntas recientes y crea un enlace público para compartirlas.'], ['Kahoot Quiz ID', 'Si el host oculta preguntas, Quiz ID abre un banco buscable de respuestas sin gastar créditos AI.']],
    pricing: ['Precios simples por créditos', 'Recarga solo cuando lo necesites', 'Sin suscripciones. Las respuestas y explicaciones usan créditos; el historial queda disponible.', 'Popular'],
    faqTitle: 'Preguntas frecuentes'
  },
  fr: {
    headingStart: 'Résolvez des quiz avec',
    headingAccent: 'la puissance IA',
    eyebrow: 'Extension Chrome IA quiz solver',
    lead: 'Résolvez des quiz sur Testportal, Moodle, Kahoot, Canvas, Google Forms et 7 autres plateformes. Obtenez des suggestions IA avec des explications étape par étape.',
    primary: 'Installer depuis Chrome Web Store',
    secondary: 'Voir le fonctionnement',
    proof: ['Testportal, Moodle, Canvas, Forms et plus', 'Notes et images sauvegardées avec les questions', 'Quiz partageables depuis l’historique'],
    socialProof: 'Rejoignez les premiers utilisateurs de QuizSolver et aidez à construire un AI quiz solver vraiment utile.',
    how: ['Comment fonctionne QuizSolver', '3 étapes pour résoudre un quiz avec l’IA', 'Installez une fois, résolvez sur les plateformes compatibles et créez automatiquement une bibliothèque d’étude.'],
    steps: [['Installer et se connecter', 'Ajoutez QuizSolver à Chrome gratuitement. Votre compte synchronise questions résolues, notes et quiz d’entraînement entre l’extension et le site.'], ['Résoudre ou scanner', 'Cliquez Résoudre la page. Pour images, canvas, PDF ou layouts inhabituels, utilisez FocusScan uniquement sur la zone de question.'], ['Réviser et partager', 'Chaque question résolue est sauvegardée dans l’historique pour créer des cartes, des quiz ou des liens partagés.']],
    features: ['Fonctions QuizSolver', 'Tout pour résoudre les quiz plus vite', 'Pour questions visibles, questions en image, mode indice, overlay rapide et système complet de révision.', ['Détection des questions', 'Cliquez Résoudre la page : l’extension lit la question, les options, le type et les images avant de proposer une réponse.'], ['Mode indice', 'À utiliser quand vous ne voulez aucun clic automatique. QuizSolver marque seulement la réponse probable.'], ['FocusScan', 'Sélectionnez une zone si la question est dans une image, un canvas, un PDF ou un layout inhabituel.'], ['Overlay rapide', 'Ouvrez une petite fenêtre déplaçable avec les actions rapides sur la page.'], ['Historique et notes', 'Enregistrez les questions avec réponse, explication, source, images et notes personnelles.'], ['Quiz d’entraînement', 'Transformez les questions enregistrées en quiz et vérifiez les bonnes réponses à la fin.'], ['Partage de questions', 'Choisissez des questions récentes et créez un lien public.'], ['Kahoot Quiz ID', 'Si l’hôte masque les questions, Quiz ID ouvre une banque de réponses sans crédits IA.']],
    pricing: ['Tarifs crédits simples', 'Rechargez seulement si nécessaire', 'Pas d’abonnement. Réponses et explications utilisent des crédits, l’historique reste disponible.', 'Populaire'],
    faqTitle: 'Questions fréquentes'
  },
  it: {
    headingStart: 'Risolvi quiz con',
    headingAccent: 'potenza AI',
    eyebrow: 'Estensione Chrome AI quiz solver',
    lead: 'Risolvi quiz su Testportal, Moodle, Kahoot, Canvas, Google Forms e altre 7 piattaforme. Ottieni suggerimenti AI con spiegazioni passo dopo passo.',
    primary: 'Installa da Chrome Web Store',
    secondary: 'Vedi come funziona',
    proof: ['Testportal, Moodle, Canvas, Forms e altro', 'Note e immagini salvate con le domande', 'Quiz condivisibili dalla cronologia'],
    socialProof: 'Unisciti ai primi utenti di QuizSolver e aiutaci a creare un AI quiz solver davvero utile per lo studio.',
    how: ['Come funziona QuizSolver', '3 passaggi per risolvere qualsiasi quiz con AI', 'Installa una volta, risolvi sulle piattaforme supportate e crea automaticamente una libreria di studio.'],
    steps: [['Installa e accedi', 'Aggiungi QuizSolver a Chrome gratis. Il tuo account sincronizza domande risolte, note e quiz di pratica tra estensione e sito.'], ['Risolvi o scansiona', 'Clicca Risolvi pagina corrente. Per immagini, canvas, PDF o layout insoliti usa FocusScan solo sull’area della domanda.'], ['Ripassa e condividi', 'Ogni domanda risolta viene salvata nella cronologia per creare flashcard, quiz di pratica o link condivisi.']],
    features: ['Funzioni QuizSolver', 'Tutto ciò che serve per risolvere quiz più velocemente', 'Per domande visibili, domande in immagini, modalità suggerimento, overlay rapido e sistema completo di ripasso.', ['Rilevamento domande', 'Clicca Risolvi pagina corrente: l’estensione legge domanda, opzioni, tipo e immagini prima di suggerire una risposta.'], ['Modalità suggerimento', 'Usala quando non vuoi clic automatici. QuizSolver evidenzia solo la risposta probabile.'], ['FocusScan', 'Seleziona un’area quando la domanda è in immagine, canvas, PDF o layout insolito.'], ['Overlay rapido', 'Apri una piccola finestra spostabile sulla pagina con azioni rapide.'], ['Cronologia e note', 'Salva domande risolte con risposta, spiegazione, fonte, immagini e note personali.'], ['Quiz di pratica', 'Trasforma domande salvate in un quiz e controlla le risposte corrette alla fine.'], ['Condividi domande', 'Scegli domande recenti e crea un link pubblico.'], ['Kahoot Quiz ID', 'Se l’host nasconde le domande, Quiz ID apre un banco risposte senza crediti AI.']],
    pricing: ['Prezzi crediti semplici', 'Ricarica solo quando serve', 'Nessun abbonamento. Risposte e spiegazioni usano crediti; la cronologia resta disponibile.', 'Popolare'],
    faqTitle: 'Domande frequenti'
  },
  uk: {
    headingStart: 'Розв’язуй квізи з',
    headingAccent: 'силою AI',
    eyebrow: 'Chrome-розширення AI quiz solver',
    lead: 'Розв’язуй квізи на Testportal, Moodle, Kahoot, Canvas, Google Forms та 7 інших платформах. Отримуй AI-підказки з короткими покроковими поясненнями.',
    primary: 'Встановити з Chrome Web Store',
    secondary: 'Як це працює',
    proof: ['Testportal, Moodle, Canvas, Forms та інші', 'Нотатки й зображення зберігаються з питаннями', 'Квізи з історії можна ділитися'],
    socialProof: 'Приєднуйся до перших користувачів QuizSolver і допоможи створити AI quiz solver для реального навчання.',
    how: ['Як працює QuizSolver', '3 кроки, щоб розв’язати квіз з AI', 'Встанови один раз, розв’язуй на підтримуваних платформах і автоматично збирай власну бібліотеку для навчання.'],
    steps: [['Встанови й увійди', 'Додай QuizSolver у Chrome безкоштовно. Акаунт синхронізує розв’язані питання, нотатки і тренувальні квізи між розширенням та сайтом.'], ['Розв’язуй або скануй', 'Натисни Розв’язати сторінку. Для зображень, canvas, PDF або незвичного макета виділи лише область питання через FocusScan.'], ['Повторюй і ділись', 'Кожне розв’язане питання зберігається в історії, щоб робити картки, тренувальні квізи або посилання для інших.']],
    features: ['Функції QuizSolver', 'Усе потрібне, щоб розв’язувати квізи швидше', 'Для видимих питань, питань у зображеннях, режиму підказки, швидкого overlay і повної системи повторення.', ['Виявлення питань', 'Натисни Розв’язати сторінку: розширення читає питання, варіанти, тип і зображення перед підказкою.'], ['Режим підказки', 'Використовуй, коли не хочеш автоматичних кліків. QuizSolver лише підсвічує ймовірну відповідь.'], ['FocusScan', 'Виділи область, якщо питання в зображенні, canvas, PDF або незвичному макеті.'], ['Швидкий overlay', 'Відкрий маленьке рухоме вікно на сторінці з швидкими діями.'], ['Історія і нотатки', 'Зберігай розв’язані питання з відповіддю, поясненням, джерелом, зображеннями і нотатками.'], ['Квіз з історії', 'Перетвори збережені питання на тренувальний квіз і перевір правильні відповіді після завершення.'], ['Поширення питань', 'Обери останні питання і створи публічне посилання для інших.'], ['Kahoot Quiz ID', 'Якщо хост ховає питання, Quiz ID відкриває банк відповідей без витрати AI-кредитів.']],
    pricing: ['Прості ціни кредитів', 'Поповнюй лише коли потрібно', 'Без підписок. Відповіді й пояснення витрачають кредити, історія доступна завжди.', 'Популярне'],
    faqTitle: 'Поширені питання'
  }
};

const HOME_PLATFORM_KEYS: PageKey[] = ['testportal', 'moodle', 'canvas', 'googleForms', 'microsoftForms', 'blackboard', 'quizlet', 'socrative', 'kahoot', 'quizizz'];

const HOME_DETAIL_TEXT: Record<Exclude<Locale, 'en' | 'pl'>, any> = {
  de: {
    platforms: ['Nahtlose Plattform-Integrationen', 'Optimiert für die Systeme, die du wirklich nutzt', 'Eine Chrome-Erweiterung für Testportal, Moodle, Canvas, Google Forms, Microsoft Forms, Blackboard, Quizlet, Socrative, Kahoot und Quizizz.'],
    packs: [
      ['Kleines Guthaben', '100 Credits holen', ['Einmaliger Kauf, kein Abo', 'Gut für kurze Übungstests', 'Für Antworten und Erklärungen', 'Dauerhafter Zugriff auf Notizen']],
      ['Paket für regelmäßige Nutzung', '500 Credits wählen', ['15% günstiger als Starter', 'Ideal für wöchentliche Aufgaben', 'Hohe Antwortpriorität', 'Dauerhafter Zugriff auf Notizen']],
      ['Große Lernsessions', '2000 Credits wählen', ['Bester Preis pro Credit', 'Perfekt für Prüfungsphasen', 'Höchste Antwortpriorität', 'Dauerhafter Zugriff auf Notizen']]
    ],
    faq: [
      ['Was klicke ich auf einer Quizseite?', 'Öffne die Erweiterung und klicke Aktuelle Seite lösen. Bei ungewöhnlichen Layouts markierst du die Frage mit FocusScan.'],
      ['Funktioniert QuizSolver mit Testportal?', 'Ja. QuizSolver erkennt Testportal-Fragen, auch im Timer-Interface. Öffne den Testportal-Test, klicke Aktuelle Seite lösen und erhalte in Sekunden einen KI-Vorschlag.'],
      ['Was ist FocusScan?', 'FocusScan ist ein Screenshot-Werkzeug in QuizSolver. Markiere einen PDF-, Bild-, Canvas- oder Embed-Bereich, wenn die Frage nicht als normaler HTML-Text vorliegt.'],
      ['Wie viele kostenlose Credits bekomme ich?', 'Neue Konten erhalten Start-Credits zum Testen von Antworten und Erklärungen. Zusätzliche Pakete beginnen bei $1.99 für 100 Credits. Kahoot Quiz ID verbraucht keine Credits.'],
      ['Wofür ist der Hinweis-Modus?', 'Er markiert die wahrscheinlich richtige Antwort, ohne automatisch zu klicken. Du entscheidest selbst, was du auswählst.'],
      ['Verbraucht die Demo Credits?', 'Nein. Die Demo nutzt lokale Beispielfragen und ist nur zum Lernen des Workflows gedacht.'],
      ['Wo finde ich gelöste Fragen?', 'Alle gespeicherten Fragen liegen in Historie & Quiz. Dort kannst du Notizen ergänzen, üben und Links teilen.'],
      ['Was ist Kahoot Quiz ID?', 'Quiz ID identifiziert den Quiz-Inhalt. Der Live-PIN ist nur zum Beitreten eines Spiels da.']
    ]
  },
  es: {
    platforms: ['Integraciones fluidas', 'Optimizado para los sistemas que usas', 'Una extensión de Chrome para Testportal, Moodle, Canvas, Google Forms, Microsoft Forms, Blackboard, Quizlet, Socrative, Kahoot y Quizizz.'],
    packs: [
      ['Recarga pequeña', 'Obtener 100 créditos', ['Pago único, sin suscripción', 'Bueno para pruebas rápidas', 'Sirve para respuestas y explicaciones', 'Acceso permanente a notas']],
      ['Pack de uso regular', 'Elegir 500 créditos', ['Ahorra 15% frente al starter', 'Ideal para tareas semanales', 'Respuesta con alta prioridad', 'Acceso permanente a notas']],
      ['Sesiones intensas', 'Elegir 2000 créditos', ['Mejor valor por crédito', 'Perfecto para exámenes', 'Máxima prioridad de respuesta', 'Acceso permanente a notas']]
    ],
    faq: [
      ['¿Qué hago al abrir una página de quiz?', 'Abre la extensión y pulsa Resolver página actual. Si el diseño es raro, usa FocusScan y selecciona solo la pregunta.'],
      ['¿Funciona QuizSolver en Testportal?', 'Sí. QuizSolver detecta preguntas de Testportal, incluido el modo con temporizador. Abre el quiz, pulsa Resolver página actual y recibe una sugerencia IA en segundos.'],
      ['¿Qué es FocusScan?', 'FocusScan es una herramienta de captura dentro de QuizSolver. Selecciona una zona de PDF, imagen, canvas o embed cuando la pregunta no está en texto HTML normal.'],
      ['¿Cuántos créditos gratis recibo?', 'Las cuentas nuevas reciben créditos iniciales para probar respuestas y explicaciones. Los paquetes adicionales empiezan desde $1.99 por 100 créditos. Kahoot Quiz ID no usa créditos.'],
      ['¿Para qué sirve el modo pista?', 'Marca la respuesta probable sin hacer clic automático, para que tú mantengas el control.'],
      ['¿La demo consume créditos?', 'No. La demo usa preguntas locales preparadas para aprender el flujo sin gastar créditos.'],
      ['¿Dónde reviso preguntas resueltas?', 'En Historial y quiz puedes verlas, añadir notas, practicar y compartir enlaces.'],
      ['¿Qué es Kahoot Quiz ID?', 'Quiz ID identifica el quiz. El PIN solo sirve para entrar a una partida en vivo.']
    ]
  },
  fr: {
    platforms: ['Intégrations fluides', 'Optimisé pour les systèmes que tu utilises', 'Une extension Chrome pour Testportal, Moodle, Canvas, Google Forms, Microsoft Forms, Blackboard, Quizlet, Socrative, Kahoot et Quizizz.'],
    packs: [
      ['Petite recharge', 'Obtenir 100 crédits', ['Achat unique, sans abonnement', 'Idéal pour des tests rapides', 'Fonctionne pour réponses et explications', 'Accès permanent aux notes']],
      ['Pack régulier', 'Choisir 500 crédits', ['15% d’économie vs starter', 'Parfait pour les devoirs hebdomadaires', 'Réponses prioritaires', 'Accès permanent aux notes']],
      ['Grosses sessions', 'Choisir 2000 crédits', ['Meilleur prix par crédit', 'Parfait pour les examens', 'Priorité maximale', 'Accès permanent aux notes']]
    ],
    faq: [
      ['Que faire sur une page de quiz ?', 'Ouvrez l’extension et cliquez Résoudre la page. Si le layout est inhabituel, utilisez FocusScan sur la question.'],
      ['QuizSolver fonctionne-t-il sur Testportal ?', 'Oui. QuizSolver détecte les questions Testportal, y compris l’interface avec minuteur. Ouvrez le quiz, cliquez Résoudre la page et recevez une suggestion IA en quelques secondes.'],
      ['Qu’est-ce que FocusScan ?', 'FocusScan est un outil de capture dans QuizSolver. Sélectionnez une zone de PDF, image, canvas ou embed lorsque la question n’est pas du texte HTML classique.'],
      ['Combien de crédits gratuits ai-je ?', 'Les nouveaux comptes reçoivent des crédits de départ pour tester réponses et explications. Les packs commencent à $1.99 pour 100 crédits. Kahoot Quiz ID ne consomme pas de crédits.'],
      ['À quoi sert le mode indice ?', 'Il marque la réponse probable sans cliquer automatiquement, pour garder le contrôle.'],
      ['La démo consomme-t-elle des crédits ?', 'Non. La démo utilise des questions locales préparées pour apprendre le workflow.'],
      ['Où revoir les questions résolues ?', 'Dans Historique et quiz, vous pouvez revoir, annoter, pratiquer et partager des questions.'],
      ['Qu’est-ce que Kahoot Quiz ID ?', 'Quiz ID identifie le quiz. Le PIN sert seulement à rejoindre une partie en direct.']
    ]
  },
  it: {
    platforms: ['Integrazioni fluide', 'Ottimizzato per i sistemi che usi davvero', 'Un’estensione Chrome per Testportal, Moodle, Canvas, Google Forms, Microsoft Forms, Blackboard, Quizlet, Socrative, Kahoot e Quizizz.'],
    packs: [
      ['Piccola ricarica', 'Ottieni 100 crediti', ['Acquisto una tantum, niente abbonamento', 'Ottimo per test rapidi', 'Vale per risposte e spiegazioni', 'Accesso permanente alle note']],
      ['Pack uso regolare', 'Scegli 500 crediti', ['Risparmi il 15% rispetto allo starter', 'Ideale per compiti settimanali', 'Risposte ad alta priorità', 'Accesso permanente alle note']],
      ['Sessioni intense', 'Scegli 2000 crediti', ['Miglior valore per credito', 'Perfetto per esami', 'Massima priorità', 'Accesso permanente alle note']]
    ],
    faq: [
      ['Cosa clicco su una pagina quiz?', 'Apri l’estensione e premi Risolvi pagina corrente. Per layout insoliti usa FocusScan sulla domanda.'],
      ['QuizSolver funziona su Testportal?', 'Sì. QuizSolver rileva le domande su Testportal, inclusa l’interfaccia con timer. Apri il quiz, clicca Risolvi pagina corrente e ricevi un suggerimento AI in pochi secondi.'],
      ['Che cos’è FocusScan?', 'FocusScan è uno strumento screenshot dentro QuizSolver. Seleziona un’area PDF, immagine, canvas o embed quando la domanda non è testo HTML normale.'],
      ['Quanti crediti gratis ricevo?', 'I nuovi account ricevono crediti iniziali per provare risposte e spiegazioni. I pacchetti aggiuntivi partono da $1.99 per 100 crediti. Kahoot Quiz ID non usa crediti.'],
      ['A cosa serve la modalità suggerimento?', 'Evidenzia la risposta probabile senza clic automatici, così decidi tu cosa selezionare.'],
      ['La demo consuma crediti?', 'No. La demo usa domande locali preparate per imparare il flusso.'],
      ['Dove rivedo le domande risolte?', 'In Cronologia e quiz puoi rivederle, aggiungere note, fare pratica e condividere link.'],
      ['Cos’è Kahoot Quiz ID?', 'Quiz ID identifica il quiz. Il PIN serve solo per entrare in una partita live.']
    ]
  },
  uk: {
    platforms: ['Плавні інтеграції', 'Оптимізовано для систем, якими ти реально користуєшся', 'Chrome-розширення для Testportal, Moodle, Canvas, Google Forms, Microsoft Forms, Blackboard, Quizlet, Socrative, Kahoot і Quizizz.'],
    packs: [
      ['Мале поповнення', 'Отримати 100 кредитів', ['Разова покупка, без підписки', 'Добре для швидких тренувань', 'Працює для відповідей і пояснень', 'Постійний доступ до нотаток']],
      ['Пакет для регулярного використання', 'Вибрати 500 кредитів', ['Економія 15% проти starter', 'Зручно для щотижневих завдань', 'Високий пріоритет відповіді', 'Постійний доступ до нотаток']],
      ['Великі навчальні сесії', 'Вибрати 2000 кредитів', ['Найкраща ціна за кредит', 'Ідеально перед іспитами', 'Найвищий пріоритет відповіді', 'Постійний доступ до нотаток']]
    ],
    faq: [
      ['Що натиснути на сторінці квізу?', 'Відкрий розширення і натисни Розв’язати сторінку. Для незвичного макета використовуй FocusScan.'],
      ['Чи працює QuizSolver на Testportal?', 'Так. QuizSolver розпізнає питання Testportal, включно з інтерфейсом таймера. Відкрий квіз, натисни Розв’язати сторінку й отримай AI-підказку за секунди.'],
      ['Що таке FocusScan?', 'FocusScan — це інструмент скріншота в QuizSolver. Виділи область PDF, зображення, canvas або embed, якщо питання не є звичайним HTML-текстом.'],
      ['Скільки безкоштовних кредитів я отримую?', 'Нові акаунти отримують стартові кредити для перевірки відповідей і пояснень. Додаткові пакети починаються від $1.99 за 100 кредитів. Kahoot Quiz ID не витрачає кредити.'],
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
      proof: t.proof,
      socialProof: t.socialProof
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
