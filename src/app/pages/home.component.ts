import { CommonModule } from '@angular/common';
import { Component, OnInit, OnChanges, OnDestroy, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SeoService } from '../seo.service';
import { CurrencyService } from '../currency.service';
import { CHROME_WEB_STORE_URL, Locale, PageKey, pathFor } from '../site-content';
import { ShellComponent, trackGa4Event } from './shell.component';
import { Input, ChangeDetectorRef, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
@Component({
  standalone: true,
  selector: 'qs-animated-number',
  template: '{{ displayValue }}'
})
export class AnimatedNumberComponent implements OnInit, OnChanges, OnDestroy {
  @Input() target: number | null = null;
  displayValue: string = '0';

  constructor(private cdr: ChangeDetectorRef, private el: ElementRef, @Inject(PLATFORM_ID) private platformId: Object) {}

  private visible = false;
  private observer: IntersectionObserver | null = null;
  private frameId = 0;

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      this.renderStatic();
      return;
    }
    this.observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        this.visible = true;
        this.observer?.disconnect();
        this.animate();
      }
    });
    this.observer.observe(this.el.nativeElement);
  }

  ngOnChanges() {
    if (!isPlatformBrowser(this.platformId)) {
      this.renderStatic();
      return;
    }
    // Target can arrive after init (e.g. loaded from API) - (re)start animation then
    if (this.visible) this.animate();
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    if (this.frameId) cancelAnimationFrame(this.frameId);
  }

  private renderStatic() {
    if (this.target === null) return;
    this.displayValue = this.target === Infinity || this.target === -1 ? '∞' : this.target.toLocaleString('en-US');
  }

  animate() {
    if (this.target === null) return;
    if (this.frameId) cancelAnimationFrame(this.frameId);
    const duration = 2000;
    const start = performance.now();
    
    if (this.target === Infinity || this.target === -1) {
      const step = (timestamp: number) => {
        const progress = Math.min((timestamp - start) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * 999);
        this.displayValue = progress >= 1 ? '∞' : current.toString();
        this.cdr.detectChanges();
        if (progress < 1) requestAnimationFrame(step);
      };
      this.frameId = requestAnimationFrame(step);
    } else {
      const step = (timestamp: number) => {
        const progress = Math.min((timestamp - start) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * this.target!);
        this.displayValue = current.toLocaleString('en-US');
        this.cdr.detectChanges();
        if (progress < 1) this.frameId = requestAnimationFrame(step);
      };
      this.frameId = requestAnimationFrame(step);
    }
  }
}


@Component({
  standalone: true,
  imports: [CommonModule, ShellComponent, AnimatedNumberComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
              <a class="btn btn-primary btn-lg" [href]="storeUrl" target="_blank" rel="noopener" (click)="trackCta('extension_install_click')">
                {{ text.hero.primary }}
              </a>
              <a class="btn btn-outline btn-lg" [href]="homeHash('how-it-works')" (click)="trackCta('how_it_works_click')">
                {{ text.hero.secondary }}
              </a>
              <a class="btn btn-outline btn-lg" [href]="pathFor('demo', locale)" (click)="trackCta('demo_click')">
                {{ text.hero.demoBtn || 'Try free demo' }}
              </a>
            </div>
            
            <!-- Social Proof Statistics -->
            <div class="hero-proof-stats delay-3">
              <div class="cws-rating-badge">
                <span class="cws-stars" aria-hidden="true">★★★★★</span>
                <span class="cws-score">5.0</span>
              </div>
              <span class="rating-text">{{ text.hero.socialProof }}</span>
            </div>

            
            

            <div class="hero-proof-grid delay-5" aria-label="QuizSolver proof points">
              <div class="hero-proof-card glass" *ngFor="let item of text.hero.proof" [class.clickable-card]="item.href" (click)="item.href ? navigateTo(item.href) : null">
                <span class="proof-content">
                  <span class="proof-text-muted">{{ item.prefix }}</span>
                  <strong class="text-gradient-strong"><qs-animated-number [target]="item.target"></qs-animated-number></strong>
                  <span class="proof-text-muted">{{ item.suffix }}</span>
                </span>
              </div>
            </div>

            <!-- Platform Trust Bar -->
            <div class="trust-bar delay-5">
              <div class="trust-marquee-wrapper">
                <div class="trust-marquee">
                  <span class="trust-item" *ngFor="let platform of ['Testportal', 'Moodle', 'Google Forms', 'Canvas', 'MS Forms', 'Blackboard', 'Quizlet', 'Kahoot', 'Quizizz', 'Socrative', 'Blooket', 'Gimkit', 'Edpuzzle', 'Mentimeter']">
                    <span class="bullet">✦</span> {{ platform }}
                  </span>
                  <!-- Duplicate for infinite loop -->
                  <span class="trust-item" *ngFor="let platform of ['Testportal', 'Moodle', 'Google Forms', 'Canvas', 'MS Forms', 'Blackboard', 'Quizlet', 'Kahoot', 'Quizizz', 'Socrative']">
                    <span class="bullet">✦</span> {{ platform }}
                  </span>
                </div>
              </div>
            </div>
          <div class="hero-asterisks delay-4" style="font-size: 0.75rem; opacity: 0.65; margin-top: 1.5rem; text-align: center; display: grid; gap: 0.35rem; max-width: 820px; margin-left: auto; margin-right: auto; line-height: 1.45;">
            <p class="hero-asterisk" style="margin: 0;">{{ text.hero.asterisk }}</p>
            <p class="hero-asterisk" style="margin: 0;" *ngIf="text.hero.asterisk2">{{ text.hero.asterisk2 }}</p>
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
                  
                  
                  <div class="bento-icon-wrapper">
                    <div class="icon-glow"></div>
                    <span class="bento-emoji"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></span>
                  </div>
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
                  
                  
                  <div class="bento-icon-wrapper">
                    <div class="icon-glow"></div>
                    <span class="bento-emoji"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg></span>
                  </div>
                  <h3 class="bento-title">{{ text.features.items[1].title }}</h3>
                  <p class="bento-text">{{ text.features.items[1].text }}</p>
                </div>
              </article>

              <!-- Bento Card 3 (Standard Feature) -->
              <article class="bento-card glass glass-hover reveal delay-200">
                <div class="bento-content">
                  
                  
                  <div class="bento-icon-wrapper">
                    <div class="icon-glow"></div>
                    <span class="bento-emoji"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"/><path d="M12 1v4"/><path d="M12 19v4"/><path d="M1 12h4"/><path d="M19 12h4"/></svg></span>
                  </div>
                  <h3 class="bento-title">{{ text.features.items[2].title }}</h3>
                  <p class="bento-text">{{ text.features.items[2].text }}</p>
                </div>
              </article>

              <!-- Bento Card 4 (Standard Feature) -->
              <article class="bento-card glass glass-hover reveal">
                <div class="bento-content">
                  
                  
                  <div class="bento-icon-wrapper">
                    <div class="icon-glow"></div>
                    <span class="bento-emoji"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></span>
                  </div>
                  <h3 class="bento-title">{{ text.features.items[3].title }}</h3>
                  <p class="bento-text">{{ text.features.items[3].text }}</p>
                </div>
              </article>

              <!-- Bento Card 5 (Large Feature) -->
              <article class="bento-card card-md glass glass-hover reveal delay-100">
                <div class="bento-content">
                  
                  
                  <div class="bento-icon-wrapper">
                    <div class="icon-glow"></div>
                    <span class="bento-emoji"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h8"/><path d="M8 11h6"/></svg></span>
                  </div>
                  <h3 class="bento-title">{{ text.features.items[4].title }}</h3>
                  <p class="bento-text">{{ text.features.items[4].text }}</p>
                </div>
              </article>

              <!-- Bento Card 6 (Standard Feature) -->
              <article class="bento-card glass glass-hover reveal delay-200">
                <div class="bento-content">
                  
                  
                  <div class="bento-icon-wrapper">
                    <div class="icon-glow"></div>
                    <span class="bento-emoji"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span>
                  </div>
                  <h3 class="bento-title">{{ text.features.items[5].title }}</h3>
                  <p class="bento-text">{{ text.features.items[5].text }}</p>
                </div>
              </article>

              <!-- Bento Card 7 (Standard Feature) -->
              <article class="bento-card glass glass-hover reveal">
                <div class="bento-content">
                  
                  
                  <div class="bento-icon-wrapper">
                    <div class="icon-glow"></div>
                    <span class="bento-emoji"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg></span>
                  </div>
                  <h3 class="bento-title">{{ text.features.items[6].title }}</h3>
                  <p class="bento-text">{{ text.features.items[6].text }}</p>
                </div>
              </article>

              <!-- Bento Card 8 (Standard Feature) -->
              <article class="bento-card glass glass-hover reveal delay-100">
                <div class="bento-content">
                  
                  
                  <div class="bento-icon-wrapper">
                    <div class="icon-glow"></div>
                    <span class="bento-emoji"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg></span>
                  </div>
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

        <!-- Social Proof / Testimonials Section -->
        <section class="section testimonials-section">
          <div class="container">
            <div class="section-header">
              <p class="eyebrow">{{ text.testimonials?.eyebrow || 'Trusted by students' }}</p>
              <h2>{{ text.testimonials?.title || 'Students love QuizSolver' }}</h2>
              <p>{{ text.testimonials?.subtitle || 'Join thousands of students who already save time on quizzes and study smarter.' }}</p>
            </div>

            <div class="testimonials-grid">
              <div class="testimonial-card glass reveal" *ngFor="let t of testimonials; let i = index" [class.delay-100]="i === 1" [class.delay-200]="i === 2">
                <div class="testimonial-stars" aria-hidden="true">★★★★★</div>
                <p class="testimonial-quote">"{{ t.quote }}"</p>
                <div class="testimonial-author">
                  <span class="author-flag">{{ t.flag }}</span>
                  <div class="author-info">
                    <strong class="author-name">{{ t.name }}</strong>
                    <span class="author-detail">{{ t.detail }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="live-stats-bar glass reveal delay-200">
              <div class="live-stat">
                <strong class="stat-number text-gradient-strong"><qs-animated-number [target]="liveStats.users"></qs-animated-number>+</strong>
                <span class="stat-label">{{ text.testimonials?.statUsers || 'active students' }}</span>
              </div>
              <div class="live-stat-divider"></div>
              <div class="live-stat">
                <strong class="stat-number text-gradient-strong"><qs-animated-number [target]="liveStats.questions"></qs-animated-number>+</strong>
                <span class="stat-label">{{ text.testimonials?.statQuestions || 'questions solved' }}</span>
              </div>
              <div class="live-stat-divider"></div>
              <div class="live-stat">
                <strong class="stat-number text-gradient-strong">5.0</strong>
                <span class="stat-label">{{ text.testimonials?.statRating || 'Chrome Web Store rating' }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Pricing Section -->
        <section class="section" id="credits">
          <div class="container">
            <div class="section-header" style="position: relative;">
              <p class="eyebrow">{{ text.pricing.eyebrow }}</p>
              <h2>{{ text.pricing.title }}</h2>
              <p>{{ text.pricing.subtitle }}</p>
            </div>

            <div class="pricing-deck">
              <div class="price-tier-card glass glass-hover reveal" *ngFor="let pack of packs; let i = index" [class.delay-100]="i === 1" [class.delay-200]="i === 2" [class.featured]="pack.id === 'popular'">
                <div class="featured-badge" *ngIf="pack.id === 'popular'">{{ text.pricing.badge }}</div>
                
                <h3 class="tier-name">{{ pack.name }}</h3>
                <p class="tier-caption text-secondary">{{ pack.caption }}</p>
                <div class="tier-price-container">
                  <div class="tier-price-row">
                    <span class="tier-price">{{ pack.price }}</span>
                    <span *ngIf="getApproxCurrencyPrice(pack.price)" class="tier-price-approx">{{ getApproxCurrencyPrice(pack.price) }}</span>
                  </div>
                </div>
                
                <div class="tier-social-proof" *ngIf="pack.socialText">
                  <span class="pulse-dot"></span> {{ pack.socialText }}
                </div>
                

                <ul class="tier-features">
                  <li *ngFor="let feat of pack.features">
                    <span class="check-icon">✓</span> {{ feat }}
                  </li>
                </ul>
                
                <a class="btn btn-block" [class.btn-primary]="pack.id === 'popular'" [class.btn-outline]="pack.id !== 'popular'" [href]="pathFor('credits', locale) + '?pack=' + pack.id">
                  {{ pack.button }}
                </a>
              </div>
            </div>

            <!-- Currency note for non-USD locales -->
            <p class="pricing-deck-note text-secondary" *ngIf="currencyNote">
              {{ currencyNote }}
            </p>
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
      min-height: 100svh; padding-bottom: max(4rem, env(safe-area-inset-bottom));
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 7rem 0 max(4rem, env(safe-area-inset-bottom));
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
      margin-bottom: 1.25rem;
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
    .hero-proof-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.85rem;
      width: min(880px, 100%);
      margin-bottom: 3.25rem;
    }
    .hero-proof-card {
      min-height: 4.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.9rem 1rem;
      border-radius: 12px;
      color: var(--text-primary);
      font-family: var(--font-heading);
      font-weight: 700;
      font-size: 1.05rem;
      line-height: 1.35;
      text-align: center;
      transition: transform 0.2s, background 0.2s;
    }
    .hero-proof-card.clickable-card {
      cursor: pointer;
    }
    .hero-proof-card.clickable-card:hover {
      transform: translateY(-2px);
      background: rgba(255, 255, 255, 0.08);
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
      justify-content: flex-start;
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
      justify-content: flex-start;
    }
    .bento-badge {
      align-self: flex-start;
      margin-bottom: 1.5rem;
    }
    
    .bento-icon-wrapper {
      position: relative;
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.5rem;
    }
    .icon-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;
      background: var(--primary-color);
      filter: blur(12px);
      opacity: 0.2;
      border-radius: 50%;
    }
    .bento-emoji {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent-cyan);
    }
    .bento-emoji svg {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
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

    .tier-price-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      margin: 1rem 0 1.5rem;
    }
    .tier-original-price {
      font-size: 1.15rem;
      color: var(--text-tertiary);
      opacity: 0.8;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .tier-original-price s {
      text-decoration-color: var(--accent-red);
    }
    .discount-badge {
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
      font-size: 0.75rem;
      font-weight: 800;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }
    .tier-price-row {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 0.55rem;
      flex-wrap: wrap;
    }
    .tier-price {
      font-family: var(--font-heading);
      font-size: 3.25rem;
      font-weight: 800;
      line-height: 1;
      letter-spacing: -0.02em;
    }
    .tier-price-approx {
      font-size: 1.05rem;
      font-weight: 750;
      color: var(--accent-cyan);
      background: rgba(6, 182, 212, 0.12);
      border: 1px solid rgba(6, 182, 212, 0.25);
      padding: 0.15rem 0.6rem;
      border-radius: var(--radius-full);
      white-space: nowrap;
      letter-spacing: -0.01em;
    }
    .pricing-deck-note {
      text-align: center;
      font-size: 0.82rem;
      margin: 1.5rem auto 0;
      color: var(--text-secondary);
      opacity: 0.85;
      max-width: 650px;
      line-height: 1.5;
    }
    .tier-promo-timer {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.4rem;
      margin-bottom: 1.25rem;
      font-size: 0.8rem;
      color: var(--accent-amber);
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.2);
      padding: 0.4rem 0.5rem;
      border-radius: 6px;
    }
    .tier-promo-timer svg {
      flex-shrink: 0;
    }
    .tier-social-proof {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: var(--text-primary);
      background: rgba(139, 92, 246, 0.1);
      border: 1px solid rgba(139, 92, 246, 0.2);
      padding: 0.4rem 0.75rem;
      border-radius: 999px;
      margin-bottom: 1.25rem;
      font-weight: 500;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      background-color: var(--accent-cyan);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.4); }
      70% { box-shadow: 0 0 0 6px rgba(6, 182, 212, 0); }
      100% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0); }
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

    /* CWS Rating Badge in hero */
    .cws-rating-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 1rem;
      border-radius: 999px;
      background: rgba(6, 182, 212, 0.08);
      border: 1px solid rgba(6, 182, 212, 0.25);
    }
    .cws-stars {
      color: #facc15;
      font-size: 1.1rem;
      letter-spacing: 2px;
    }
    .cws-score {
      font-family: var(--font-heading);
      font-weight: 700;
      font-size: 1rem;
      color: var(--text-primary);
    }

    /* Testimonials section */
    .testimonials-section {
      background: radial-gradient(circle at 50% 0%, rgba(124, 92, 252, 0.04) 0%, transparent 60%);
    }
    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-top: 3rem;
    }
    .testimonial-card {
      padding: 2rem;
      border-radius: var(--radius-lg);
      display: flex;
      flex-direction: column;
      gap: 1rem;
      transition: transform 0.3s var(--ease-spring);
    }
    .testimonial-card:hover {
      transform: translateY(-4px);
    }
    .testimonial-stars {
      color: #facc15;
      font-size: 1.1rem;
      letter-spacing: 2px;
    }
    .testimonial-quote {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.65;
      flex: 1;
      font-style: italic;
    }
    .testimonial-author {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }
    .author-flag {
      font-size: 1.5rem;
    }
    .author-info {
      display: flex;
      flex-direction: column;
    }
    .author-name {
      font-family: var(--font-heading);
      font-size: 0.9rem;
      color: var(--text-primary);
    }
    .author-detail {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }

    /* Live Stats Bar */
    .live-stats-bar {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 3rem;
      padding: 2rem 3rem;
      border-radius: var(--radius-lg);
      margin-top: 2.5rem;
      text-align: center;
    }
    .live-stat {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .stat-number {
      font-family: var(--font-heading);
      font-size: 2rem;
      font-weight: 800;
    }
    .stat-label {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }
    .live-stat-divider {
      width: 1px;
      height: 3rem;
      background: var(--border);
    }

    /* Responsive */
    @media (max-width: 992px) {
      .testimonials-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      .live-stats-bar {
        flex-direction: column;
        gap: 1.5rem;
        padding: 1.5rem;
      }
      .live-stat-divider {
        width: 80%;
        height: 1px;
      }
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
    @media (max-width: 720px) {
      .bento-grid { grid-template-columns: 1fr; gap: 1rem; }
      .platforms-links-grid { grid-template-columns: 1fr; gap: 0.5rem; }
      .bento-card { min-height: auto; }
      .bento-text { -webkit-line-clamp: 5; }
      .hero-proof-grid {
        grid-template-columns: 1fr;
        margin-bottom: 2.25rem;
      }
      .hero-proof-card {
        min-height: 3.75rem;
        justify-content: flex-start;
      }
    }
    @media (max-width: 480px) {
      .hero-section { padding: 6rem 0 6rem; min-height: auto; }
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
export class HomeComponent implements OnInit, OnDestroy {
  protected locale: Locale = 'en';
  protected readonly storeUrl = CHROME_WEB_STORE_URL;
  protected text = HOME_COPY.en;
  protected pathFor = pathFor;

  protected testimonials = [
    { quote: 'QuizSolver saved me during finals week. I solved 3 Testportal exams in minutes and could focus on studying the explanations.', name: 'Marta K.', flag: '🇵🇱', detail: 'Computer Science, Warsaw' },
    { quote: 'I use it every week for Moodle quizzes. The hint mode is perfect — it highlights the answer without clicking so I stay in control.', name: 'Lucas R.', flag: '🇩🇪', detail: 'Engineering, Munich' },
    { quote: 'The Kahoot Quiz ID feature is incredible. I can see all answers without spending any credits. My whole class uses it now.', name: 'Sofia M.', flag: '🇪🇸', detail: 'Biology, Madrid' }
  ];
  protected liveStats = { users: 0, questions: 0 };

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly http = inject(HttpClient);
  private readonly homeCdr = inject(ChangeDetectorRef);
  private readonly currency = inject(CurrencyService);

  get packs() {
    return this.text.pricing.packs;
  }

  protected get currencyNote(): string {
    return this.currency.getCurrencyNote(this.locale);
  }

  protected getApproxCurrencyPrice(usdPriceStr: string): string {
    return this.currency.getApproxPrice(usdPriceStr, this.locale);
  }

  buyCredits() {
    window.location.href = pathFor('credits', this.locale);
  }

  protected trackCta(action: string): void {
    trackGa4Event(action, { page: 'home', locale: this.locale });
  }

  protected homeHash(hash: string): string {
    return `${pathFor('home', this.locale)}#${hash}`;
  }

  navigateTo(url: string) {
    this.router.navigateByUrl(url);
  }

  protected septemberTimer = signal('');
  private timerInterval: any;

  ngOnInit(): void {
    this.locale = (this.route.snapshot.data['locale'] || 'en') as Locale;
    this.text = HOME_COPY[this.locale] || HOME_COPY.en;
    this.seo.applyPage('home', this.locale);
    this.currency.init(this.locale);

    this.startPromoTimer();

    // Fetch live stats for social proof
    if (typeof window !== 'undefined') {
      this.http.get<any>('/api/stats/public').subscribe({
        next: (res) => {
          if (res?.success) {
            const rawUsers = res.totalUsers || 0;
            const rawQuestions = res.totalQuestionsSolved || 0;
            this.liveStats = {
              users: Math.ceil(rawUsers / 100) * 100, // round up to nearest 100
              questions: Math.ceil(rawQuestions / 1000) * 1000 // round up to nearest 1000
            };
            this.homeCdr.markForCheck(); // component is OnPush - re-render with loaded stats
          }
        },
        error: () => {}
      });
    }
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  protected getDiscount(price: string, originalPrice: string): number {
    const p = parseFloat(price.replace(/[^0-9.]/g, ''));
    const op = parseFloat(originalPrice.replace(/[^0-9.]/g, ''));
    if (!p || !op) return 0;
    return Math.round((1 - p / op) * 100);
  }

  private startPromoTimer(): void {
    if (typeof window === 'undefined') return;
    
    // Set promo end to October 1st, 2026, 00:00:00 UTC
    const promoEnd = new Date('2026-10-01T00:00:00Z').getTime();

    this.timerInterval = setInterval(() => {
      const now = Date.now();
      const diff = promoEnd - now;

      if (diff <= 0) {
        this.septemberTimer.set('');
        clearInterval(this.timerInterval);
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      const pad = (n: number) => n.toString().padStart(2, '0');
      this.septemberTimer.set(`${d}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`);
    }, 1000);
  }
}

const HOME_COPY: Partial<Record<Locale, any>> & { en: any; pl: any } = {
  en: {
    hero: {
      eyebrow: 'AI quiz solver Chrome extension',
      headingStart: 'AI Quiz Solver Chrome Extension —',
      headingAccent: 'Solve Any Quiz Instantly',
      lead: 'Instantly solve quizzes on 35+ platforms including Testportal, Moodle, Kahoot, Canvas, Google Forms... and practically infinity others thanks to Universal Parser™*. Get AI answer suggestions with step-by-step explanations.',
      primary: 'Install from Chrome Web Store',
      secondary: 'See how it works',
      demoBtn: 'Try free demo — no signup',
      proof: [
        { prefix: '', target: 35, suffix: '+ directly supported quiz platforms' },
        { prefix: '', target: -1, suffix: ' other sites — works anywhere thanks to Universal Parser™*', href: '/blog/universal-parser-infinite-quiz-platforms' }
      ],
      asterisk: '* Universal Parser™ automatically adapts to almost any quiz on the internet. For heavily-locked or graphical interfaces, simply use our foolproof FocusScan.',
      asterisk2: '** Websites and quiz portals may periodically update their layout or code, so automated parsing might not always succeed immediately — that is exactly why FocusScan (screen region capture) guarantees 100% question capture.',
      socialProof: 'Built for real quiz pages: Universal Parser, FocusScan and saved study history in one Chrome extension.'
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
      title: 'A complete AI toolkit for solving quizzes and studying smarter',
      subtitle: 'Built for real quiz situations: visible questions, image-based questions, hint-only mode, quick overlay, and a full study review system.',
      items: [
        { icon: 'UP', title: 'Universal quiz parser', text: 'QuizSolver first tries to read the visible question on any quiz page, then uses tuned workflows for platforms like Testportal, Moodle, Canvas and Forms.' },
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
        { id: 'starter', name: 'Rescue Pack (100 answers)', price: '$1.99', originalPrice: '', caption: '3–5 full tests or exams • Less than a coffee', button: 'Get Rescue Pack', features: ['100 AI answer suggestions + explanations', 'Peace of mind for 3–5 full exams or midterms', 'Works on Testportal, Moodle, Canvas & Forms', 'Credits never expire — pay once, no subscription'] },
        { id: 'popular', name: 'Semester Pack (500 answers)', price: '$4.99', originalPrice: '', caption: 'Stress-free homework & exams • Less than a pizza', socialText: 'Chosen by 84% of students', button: 'Get Semester Pack', features: ['500 AI answer suggestions + explanations', '50% discount vs Starter (~$0.01 / answer)', 'High priority response speed for timed tests', 'Lifetime access to saved notes & history'] },
        { id: 'pro', name: 'Annual & Group Pack (2000 answers)', price: '$14.99', originalPrice: '', caption: 'Massive supply for the entire year or to share • Lowest rate (<$0.008)', button: 'Get Annual Pack', features: ['2000 AI answer suggestions + explanations', 'Lowest price per answer anywhere (<$0.008)', 'Share with friends or use across multiple semesters', 'Instant maximum priority speed'] }
      ]
    },
    faqTitle: 'Frequently asked questions',
    faq: [
      { question: 'What should I click when I open a quiz page?', answer: 'Open the QuizSolver extension and click Solve current page. If the page is supported, QuizSolver detects the visible question and answer options. If the layout is unusual, use FocusScan and draw a box around the question.' },
      { question: 'Does QuizSolver work only on listed platforms?', answer: 'No. The listed platforms are optimized workflows, but QuizSolver also includes a universal parser that tries to read visible quiz questions on other websites. If a page uses an unusual layout, FocusScan lets you select the question area manually.' },
      { question: 'What if my quiz website is not supported yet?', answer: 'Universal Parser tries first. If it cannot read the page correctly, users can report the issue from the extension. We review failing layouts, tune parser profiles and add better support in later updates.' },
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
      lead: 'Rozwiązuj quizy na ponad 35 platformach takich jak Testportal, Moodle, Kahoot, Canvas, Google Forms i... nieskończoności innych dzięki Universal Parser™*. Dostajesz sugestie odpowiedzi AI z wyjaśnieniem.',
      primary: 'Zainstaluj z Chrome Web Store',
      secondary: 'Zobacz jak to działa',
      demoBtn: 'Wypróbuj demo za darmo',
      proof: [
        { prefix: '', target: 35, suffix: '+ platform quizowych ze wsparciem bezpośrednim' },
        { prefix: '', target: -1, suffix: ' innych stron — działa wszędzie dzięki Universal Parser™*', href: '/pl/blog/universal-parser-nieskonczonosc-platform-quizowych' }
      ],
      asterisk: '* Universal Parser™ automatycznie dopasowuje się do niemal każdego quizu w internecie. Przy bardzo restrykcyjnych interfejsach z pomocą przychodzi niezawodny FocusScan.',
      asterisk2: '** Strony i platformy quizowe mogą okresowo zmieniać swoją budowę kodu, przez co parser nie zawsze natychmiast rozpozna layout — właśnie dlatego FocusScan (zaznaczenie wycinka ekranu) gwarantuje 100% skuteczności.',
      socialProof: 'Stworzone pod prawdziwe quizy: Universal Parser, FocusScan i historia nauki w jednym rozszerzeniu Chrome.'
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
      title: 'Kompletny zestaw narzędzi AI do rozwiązywania quizów i nauki',
      subtitle: 'Stworzone pod realne sytuacje: widoczne pytania, pytania w obrazkach, tryb samej podpowiedzi, szybki overlay oraz pełny system powtórek.',
      items: [
        { icon: 'UP', title: 'Uniwersalny parser quizów', text: 'QuizSolver najpierw próbuje odczytać widoczne pytanie na dowolnej stronie z quizem, a dla Testportal, Moodle, Canvas i Forms używa dodatkowo dopracowanych workflow.' },
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
        { id: 'starter', name: 'Pakiet Ratunkowy (100 pytań)', price: '$1.99', originalPrice: '', caption: 'Spokój na 3–5 kolokwiów • Mniej niż energy drink', button: 'Wybierz Pakiet Ratunkowy', features: ['100 odpowiedzi AI ze szczegółowym wyjaśnieniem', 'Spokój na 3–5 pełnych kolokwiów lub testów', 'Działa na Testportal, Moodle, Canvas, Forms i innych', 'Kredyty nigdy nie wygasają — brak abonamentu'] },
        { id: 'popular', name: 'Pakiet Semestralny (500 pytań)', price: '$4.99', originalPrice: '', caption: 'Bezstresowa nauka i sesja • Mniej niż pizza', socialText: 'Wybierane przez 84% studentów', button: 'Wybierz Pakiet Semestralny', features: ['500 odpowiedzi AI ze szczegółowym wyjaśnieniem', '50% taniej w porównaniu do Starter (~$0.01 / odp.)', 'Wysoki priorytet odpowiedzi na testach z czasem', 'Bezterminowy dostęp do historii i powtórek'] },
        { id: 'pro', name: 'Pakiet Roczny / Na spółkę (2000 pytań)', price: '$14.99', originalPrice: '', caption: 'Zapas na cały rok lub dla paczki znajomych • Tylko <$0.008 / odp.', button: 'Wybierz Pakiet Roczny', features: ['2000 odpowiedzi AI ze szczegółowym wyjaśnieniem', 'Najniższy koszt za pojedynczą odpowiedź (<$0.008)', 'Idealne na spółkę ze znajomymi lub na cały rok', 'Maksymalny priorytet i natychmiastowe odpowiedzi'] }
      ]
    },
    faqTitle: 'Najczęściej zadawane pytania',
    faq: [
      { question: 'Co kliknąć po wejściu na stronę z quizem?', answer: 'Otwórz rozszerzenie QuizSolver i kliknij Rozwiąż obecną stronę. Jeśli strona jest obsługiwana, narzędzie wykryje pytanie i opcje odpowiedzi. Przy nietypowym układzie użyj FocusScan i zaznacz sam obszar pytania.' },
      { question: 'Czy QuizSolver działa tylko na wymienionych platformach?', answer: 'Nie. Wymienione platformy mają dopracowane workflow, ale QuizSolver ma też uniwersalny parser, który próbuje odczytać widoczne pytania na innych stronach z quizami. Przy nietypowym układzie możesz użyć FocusScan i zaznaczyć obszar pytania ręcznie.' },
      { question: 'Co jeśli moja strona z quizem nie jest jeszcze obsługiwana?', answer: 'Najpierw próbuje działać Universal Parser. Jeśli nie odczyta strony poprawnie, użytkownik może zgłosić problem z rozszerzenia. Sprawdzamy takie układy ręcznie, dostrajamy profile parsera i dodajemy lepsze wsparcie w kolejnych aktualizacjach.' },
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
    lead: 'Löse Quizze auf 35+ Plattformen wie Testportal, Moodle, Kahoot, Canvas, Google Forms... und praktisch unendlich vielen anderen dank Universal Parser™*. Erhalte KI-Antwortvorschläge mit Erklärungen.',
    primary: 'Aus dem Chrome Web Store installieren',
    secondary: 'So funktioniert es',
    proof: [{ prefix: '', target: 35, suffix: '+ direkt unterstützte Quiz-Plattformen' }, { prefix: '', target: -1, suffix: ' andere Seiten — funktioniert überall dank Universal Parser™*', href: '/de/blog/universal-parser-unendlich-viele-quiz-plattformen' }],
    asterisk: '* Universal Parser™ passt sich automatisch an fast jedes Quiz im Internet an. Für stark gesperrte oder grafische Oberflächen nutze einfach unseren FocusScan.',
    asterisk2: '** Webseiten können ihren Code ändern, sodass der Parser nicht immer sofort greift — genau dafür sorgt FocusScan (Bildschirmbereich) für 100% Zuverlässigkeit.',
    socialProof: 'Gemacht für echte Quizseiten: Universal Parser, FocusScan und gespeicherte Lernhistorie in einer Chrome-Erweiterung.',
    how: ['So funktioniert QuizSolver', '3 Schritte, um jedes Quiz mit KI zu lösen', 'Einmal installieren, auf unterstützten Plattformen lösen und automatisch eine persönliche Lernbibliothek aufbauen.'],
    steps: [['Installieren und anmelden', 'Installiere QuizSolver kostenlos in Chrome. Dein Konto synchronisiert gelöste Fragen, Notizen und Übungsquizze zwischen Erweiterung und Website.'], ['Lösen oder scannen', 'Klicke Aktuelle Seite lösen. Bei Bildern, Canvas, PDF oder ungewöhnlichem Layout markierst du nur den Fragebereich mit FocusScan.'], ['Wiederholen und teilen', 'Jede gelöste Frage landet in der Historie. Daraus entstehen Karteikarten, Übungsquizze und teilbare Fragensets.']],
    features: ['QuizSolver-Funktionen', 'Ein komplettes KI-Toolkit zum Lösen von Quizzen und intelligentem Lernen', 'Für sichtbare Fragen, bildbasierte Fragen, Hinweis-Modus, Quick Overlay und ein vollständiges Wiederholungssystem.', ['Universal-Quiz-Parser', 'QuizSolver versucht zuerst, sichtbare Fragen auf jeder Quizseite zu lesen, und nutzt zusätzlich optimierte Workflows für Testportal, Moodle, Canvas und Forms.'], ['Hinweis-Modus', 'Nutze ihn, wenn nichts automatisch geklickt werden soll. QuizSolver markiert nur die wahrscheinlich richtige Antwort.'], ['FocusScan', 'Markiere einen Bereich, wenn die Frage in einem Bild, Canvas, PDF oder ungewöhnlichen Layout steckt.'], ['Quick Overlay', 'Öffne ein kleines verschiebbares Fenster auf der Seite für schnelle Aktionen.'], ['Historie und Notizen', 'Speichere gelöste Fragen mit Antwort, Erklärung, Quelle, Bildern und eigenen Notizen.'], ['Übungsquiz aus Historie', 'Verwandle gespeicherte Fragen in ein Übungsquiz und prüfe danach die richtigen Antworten.'], ['Fragen teilen', 'Wähle aktuelle Fragen aus und erstelle einen öffentlichen Quizlink für andere.'], ['Kahoot Quiz ID', 'Wenn der Host Fragen ausblendet, öffnet die Quiz ID einen Suchbereich mit Antworten ohne AI-Credits.']],
    pricing: ['Einfache Credit-Preise', 'Lade nur auf, wenn du es brauchst', 'Keine Abos. Antworten und Erklärungen nutzen Credits, deine Historie bleibt verfügbar.', 'Beliebt'],
    faqTitle: 'Häufige Fragen'
  },
  es: {
    headingStart: 'Resuelve quizzes con',
    headingAccent: 'potencia AI',
    eyebrow: 'Extensión Chrome AI quiz solver',
    lead: 'Resuelve quizzes en más de 35 plataformas como Testportal, Moodle, Kahoot, Canvas, Google Forms... y en infinidad de otras gracias a Universal Parser™*. Obtén sugerencias de respuestas con explicaciones.',
    primary: 'Instalar desde Chrome Web Store',
    secondary: 'Ver cómo funciona',
    proof: [{ prefix: '', target: 35, suffix: '+ plataformas de quizzes con soporte directo' }, { prefix: '', target: -1, suffix: ' otros sitios — funciona en cualquier lugar gracias a Universal Parser™*', href: '/es/blog/universal-parser-infinitas-plataformas-quizzes' }],
    asterisk: '* Universal Parser™ se adapta automáticamente a casi cualquier quiz en internet. Para interfaces fuertemente bloqueadas, utiliza nuestro infalible FocusScan.',
    asterisk2: '** Los sitios web pueden cambiar su estructura y el parser no siempre funciona de inmediato — por eso FocusScan garantiza un 100% de efectividad.',
    socialProof: 'Creado para quizzes reales: Universal Parser, FocusScan e historial de estudio guardado en una extensión Chrome.',
    how: ['Cómo funciona QuizSolver', '3 pasos para resolver cualquier quiz con IA', 'Instala una vez, resuelve en plataformas compatibles y crea automáticamente tu biblioteca de estudio.'],
    steps: [['Instala e inicia sesión', 'Añade QuizSolver a Chrome gratis. Tu cuenta sincroniza preguntas resueltas, notas y quizzes de práctica entre la extensión y la web.'], ['Resuelve o escanea', 'Haz clic en Resolver página actual. Para imágenes, canvas, PDF o diseños raros, usa FocusScan solo sobre el área de la pregunta.'], ['Repasa y comparte', 'Cada pregunta resuelta se guarda en Historial. Úsala para tarjetas, quizzes de práctica o enlaces compartidos.']],
    features: ['Funciones de QuizSolver', 'Un kit de herramientas de IA completo para resolver quizzes y estudiar mejor', 'Para preguntas visibles, preguntas en imágenes, modo pista, overlay rápido y un sistema completo de repaso.', ['Parser universal de quizzes', 'QuizSolver primero intenta leer la pregunta visible en cualquier página de quiz y luego usa flujos optimizados para Testportal, Moodle, Canvas y Forms.'], ['Modo pista', 'Úsalo cuando no quieres clics automáticos. QuizSolver solo marca la respuesta probable.'], ['FocusScan', 'Selecciona un área cuando la pregunta está en una imagen, canvas, PDF o diseño extraño.'], ['Overlay rápido', 'Abre una ventana pequeña y movible en la página con acciones rápidas.'], ['Historial y notas', 'Guarda preguntas resueltas con respuesta, explicación, fuente, imágenes y tus notas.'], ['Quiz de práctica', 'Convierte preguntas guardadas en un quiz y revisa las respuestas correctas al final.'], ['Compartir preguntas', 'Elige preguntas recientes y crea un enlace público para compartirlas.'], ['Kahoot Quiz ID', 'Si el host oculta preguntas, Quiz ID abre un banco buscable de respuestas sin gastar créditos AI.']],
    pricing: ['Precios simples por créditos', 'Recarga solo cuando lo necesites', 'Sin suscripciones. Las respuestas y explicaciones usan créditos; el historial queda disponible.', 'Popular'],
    faqTitle: 'Preguntas frecuentes'
  },
  fr: {
    headingStart: 'Résolvez des quiz avec',
    headingAccent: 'la puissance IA',
    eyebrow: 'Extension Chrome IA quiz solver',
    lead: 'Résolvez des quiz sur plus de 35 plateformes telles que Testportal, Moodle, Kahoot, Canvas, Google Forms... et une infinité d\'autres grâce à Universal Parser™*. Obtenez des réponses IA.',
    primary: 'Installer depuis Chrome Web Store',
    secondary: 'Voir le fonctionnement',
    proof: [{ prefix: '', target: 35, suffix: '+ plateformes de quiz avec support direct' }, { prefix: '', target: -1, suffix: ' autres sites — fonctionne partout grâce à Universal Parser™*', href: '/fr/blog/universal-parser-infinite-plateformes-quiz' }],
    asterisk: '* Universal Parser™ s\'adapte automatiquement à presque n\'importe quel quiz sur internet. Pour les interfaces fortement bloquées, utilisez notre FocusScan infaillible.',
    asterisk2: '** Les sites web peuvent modifier leur structure de code et le parser peut ne pas fonctionner immédiatement — c\'est pourquoi FocusScan garantit une efficacité à 100%.',
    socialProof: 'Conçu pour de vrais quiz: Universal Parser, FocusScan et historique d’étude dans une extension Chrome.',
    how: ['Comment fonctionne QuizSolver', '3 étapes pour résoudre un quiz avec l’IA', 'Installez une fois, résolvez sur les plateformes compatibles et créez automatiquement une bibliothèque d’étude.'],
    steps: [['Installer et se connecter', 'Ajoutez QuizSolver à Chrome gratuitement. Votre compte synchronise questions résolues, notes et quiz d’entraînement entre l’extension et le site.'], ['Résoudre ou scanner', 'Cliquez Résoudre la page. Pour images, canvas, PDF ou layouts inhabituels, utilisez FocusScan uniquement sur la zone de question.'], ['Réviser et partager', 'Chaque question résolue est sauvegardée dans l’historique pour créer des cartes, des quiz ou des liens partagés.']],
    features: ['Fonctions QuizSolver', 'Une boîte à outils IA complète pour résoudre des quiz et étudier plus intelligemment', 'Pour questions visibles, questions en image, mode indice, overlay rapide et système complet de révision.', ['Parser universel de quiz', 'QuizSolver essaie d’abord de lire la question visible sur toute page de quiz, puis utilise des workflows optimisés pour Testportal, Moodle, Canvas et Forms.'], ['Mode indice', 'À utiliser quand vous ne voulez aucun clic automatique. QuizSolver marque seulement la réponse probable.'], ['FocusScan', 'Sélectionnez une zone si la question est dans une image, un canvas, un PDF ou un layout inhabituel.'], ['Overlay rapide', 'Ouvrez une petite fenêtre déplaçable avec les actions rapides sur la page.'], ['Historique et notes', 'Enregistrez les questions avec réponse, explication, source, images et notes personnelles.'], ['Quiz d’entraînement', 'Transformez les questions enregistrées en quiz et vérifiez les bonnes réponses à la fin.'], ['Partage de questions', 'Choisissez des questions récentes et créez un lien public.'], ['Kahoot Quiz ID', 'Si l’hôte masque les questions, Quiz ID ouvre une banque de réponses sans crédits IA.']],
    pricing: ['Tarifs crédits simples', 'Rechargez seulement si nécessaire', 'Pas d’abonnement. Réponses et explications utilisent des crédits, l’historique reste disponible.', 'Populaire'],
    faqTitle: 'Questions fréquentes'
  },
  it: {
    headingStart: 'Risolvi quiz con',
    headingAccent: 'potenza AI',
    eyebrow: 'Estensione Chrome AI quiz solver',
    lead: 'Risolvi quiz su oltre 35 piattaforme come Testportal, Moodle, Kahoot, Canvas, Google Forms... e un\'infinità di altre grazie a Universal Parser™*. Ottieni suggerimenti IA.',
    primary: 'Installa da Chrome Web Store',
    secondary: 'Vedi come funziona',
    proof: [{ prefix: '', target: 35, suffix: '+ piattaforme di quiz con supporto diretto' }, { prefix: '', target: -1, suffix: ' altri siti — funziona ovunque grazie a Universal Parser™*', href: '/it/blog/universal-parser-infinite-piattaforme-quiz' }],
    asterisk: '* Universal Parser™ si adatta automaticamente a quasi tutti i quiz su internet. Per interfacce fortemente bloccate, usa il nostro infallibile FocusScan.',
    asterisk2: '** I siti web possono aggiornare il proprio codice e il parser potrebbe non funzionare subito — per questo FocusScan garantisce il 100% di efficacia.',
    socialProof: 'Creato per quiz reali: Universal Parser, FocusScan e cronologia di studio salvata in un’estensione Chrome.',
    how: ['Come funziona QuizSolver', '3 passaggi per risolvere qualsiasi quiz con AI', 'Installa una volta, risolvi sulle piattaforme supportate e crea automaticamente una libreria di studio.'],
    steps: [['Installa e accedi', 'Aggiungi QuizSolver a Chrome gratis. Il tuo account sincronizza domande risolte, note e quiz di pratica tra estensione e sito.'], ['Risolvi o scansiona', 'Clicca Risolvi pagina corrente. Per immagini, canvas, PDF o layout insoliti usa FocusScan solo sull’area della domanda.'], ['Ripassa e condividi', 'Ogni domanda risolta viene salvata nella cronologia per creare flashcard, quiz di pratica o link condivisi.']],
    features: ['Funzioni QuizSolver', 'Tutto ciò che serve per risolvere quiz più velocemente', 'Per domande visibili, domande in immagini, modalità suggerimento, overlay rapido e sistema completo di ripasso.', ['Parser universale per quiz', 'QuizSolver prova prima a leggere la domanda visibile su qualsiasi pagina quiz e poi usa workflow ottimizzati per Testportal, Moodle, Canvas e Forms.'], ['Modalità suggerimento', 'Usala quando non vuoi clic automatici. QuizSolver evidenzia solo la risposta probabile.'], ['FocusScan', 'Seleziona un’area quando la domanda è in immagine, canvas, PDF o layout insolito.'], ['Overlay rapido', 'Apri una piccola finestra spostabile sulla pagina con azioni rapide.'], ['Cronologia e note', 'Salva domande risolte con risposta, spiegazione, fonte, immagini e note personali.'], ['Quiz di pratica', 'Trasforma domande salvate in un quiz e controlla le risposte corrette alla fine.'], ['Condividi domande', 'Scegli domande recenti e crea un link pubblico.'], ['Kahoot Quiz ID', 'Se l’host nasconde le domande, Quiz ID apre un banco risposte senza crediti AI.']],
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
    proof: [{ prefix: '', target: 35, suffix: '+ квіз-платформ із прямою підтримкою' }, { prefix: '', target: -1, suffix: ' інших сайтів — працює будь-де завдяки Universal Parser™*', href: '/uk/blog/universal-parser-bezlich-quiz-platform' }],
    asterisk: '* Universal Parser™ автоматично адаптується до майже будь-якого квізу в інтернеті. Для сильно заблокованих інтерфейсів використовуйте наш надійний FocusScan.',
    asterisk2: '** Сайти можуть оновлювати структуру коду, тому парсер не завжди спрацьовує миттєво — саме для цього FocusScan (виділення області) гарантує 100% точність.',
    socialProof: 'Створено для реальних квізів: Universal Parser, FocusScan і збережена історія навчання в одному Chrome-розширенні.',
    how: ['Як працює QuizSolver', '3 кроки, щоб розв’язати квіз з AI', 'Встанови один раз, розв’язуй на підтримуваних платформах і автоматично збирай власну бібліотеку для навчання.'],
    steps: [['Встанови й увійди', 'Додай QuizSolver у Chrome безкоштовно. Акаунт синхронізує розв’язані питання, нотатки і тренувальні квізи між розширенням та сайтом.'], ['Розв’язуй або скануй', 'Натисни Розв’язати сторінку. Для зображень, canvas, PDF або незвичного макета виділи лише область питання через FocusScan.'], ['Повторюй і ділись', 'Кожне розв’язане питання зберігається в історії, щоб робити картки, тренувальні квізи або посилання для інших.']],
    features: ['Функції QuizSolver', 'Усе потрібне, щоб розв’язувати квізи швидше', 'Для видимих питань, питань у зображеннях, режиму підказки, швидкого overlay і повної системи повторення.', ['Універсальний парсер квізів', 'QuizSolver спочатку пробує прочитати видиме питання на будь-якій сторінці квізу, а потім використовує оптимізовані сценарії для Testportal, Moodle, Canvas і Forms.'], ['Режим підказки', 'Використовуй, коли не хочеш автоматичних кліків. QuizSolver лише підсвічує ймовірну відповідь.'], ['FocusScan', 'Виділи область, якщо питання в зображенні, canvas, PDF або незвичному макеті.'], ['Швидкий overlay', 'Відкрий маленьке рухоме вікно на сторінці з швидкими діями.'], ['Історія і нотатки', 'Зберігай розв’язані питання з відповіддю, поясненням, джерелом, зображеннями і нотатками.'], ['Квіз з історії', 'Перетвори збережені питання на тренувальний квіз і перевір правильні відповіді після завершення.'], ['Поширення питань', 'Обери останні питання і створи публічне посилання для інших.'], ['Kahoot Quiz ID', 'Якщо хост ховає питання, Quiz ID відкриває банк відповідей без витрати AI-кредитів.']],
    pricing: ['Прості ціни кредитів', 'Поповнюй лише коли потрібно', 'Без підписок. Відповіді й пояснення витрачають кредити, історія доступна завжди.', 'Популярне'],
    faqTitle: 'Поширені питання'
  },
  pt: {
    headingStart: 'Resolva quizzes com o poder da',
    headingAccent: 'Inteligência Artificial',
    eyebrow: 'Extensão de IA para Chrome — Quiz Solver',
    lead: 'Resolva quizzes instantaneamente em mais de 35 plataformas como Testportal, Moodle, Kahoot, Canvas, Google Forms... e em infinitas outras graças ao Universal Parser™*. Receba respostas sugeridas com explicações passo a passo.',
    primary: 'Instalar no Chrome Web Store',
    secondary: 'Ver como funciona',
    proof: [
      { prefix: '', target: 35, suffix: '+ plataformas de quiz com suporte direto' },
      { prefix: '', target: -1, suffix: ' outros sites — funciona em qualquer lugar com o Universal Parser™*', href: '/pt/blog/universal-parser-infinite-quiz-platforms' }
    ],
    asterisk: '* O Universal Parser™ se adapta automaticamente a quase qualquer quiz na internet. Para interfaces muito bloqueadas ou gráficas, basta usar o FocusScan.',
    asterisk2: '** Plataformas de quiz podem atualizar seu layout ou código, por isso a leitura automática pode nem sempre funcionar de imediato — é exatamente por isso que o FocusScan (captura de área na tela) garante 100% de sucesso.',
    socialProof: 'Feito para páginas de quiz reais: Universal Parser, FocusScan e histórico de estudos salvo em uma única extensão do Chrome.',
    how: [
      'Como funciona o QuizSolver',
      '3 passos simples para resolver qualquer quiz com IA',
      'Instale uma vez, resolva quizzes em qualquer plataforma suportada e monte sua biblioteca de estudos automaticamente.'
    ],
    steps: [
      ['Instale e conecte-se', 'Adicione o QuizSolver ao Chrome gratuitamente. Crie sua conta — suas perguntas resolvidas, anotações e simulados sincronizam entre a extensão e o site.'],
      ['Resolva ou escaneie', 'Clique em "Resolver página atual". Para imagens, canvas, PDF ou layouts complexos, arraste o FocusScan selecionando apenas a área da pergunta.'],
      ['Revise e compartilhe', 'Cada pergunta resolvida fica salva no Histórico. Transforme-as em flashcards, simulados de treino ou compartilhe perguntas com colegas.']
    ],
    features: [
      'Recursos do QuizSolver',
      'Um conjunto completo de ferramentas de IA para resolver quizzes e estudar melhor',
      'Criado para situações reais: perguntas de texto, questões em imagem, Modo Dica, painel flutuante e um sistema completo de revisão.',
      ['Parser universal de quizzes', 'O QuizSolver primeiro tenta ler a pergunta visível em qualquer página de quiz e depois usa fluxos otimizados para Testportal, Moodle, Canvas e Forms.'],
      ['Modo Dica', 'Ative quando quiser manter o controle. O QuizSolver apenas destaca a resposta provável em vez de selecioná-la automaticamente.'],
      ['FocusScan', 'Selecione uma área quando a pergunta estiver dentro de imagem, canvas, PDF ou layout bloqueado.'],
      ['Quick Overlay', 'Abra uma pequena janela móvel na página para ações rápidas como resolver a pergunta atual ou texto selecionado.'],
      ['Histórico e anotações', 'Suas perguntas resolvidas são salvas com respostas, explicações, fontes, imagens e anotações pessoais.'],
      ['Simulado do histórico', 'Transforme perguntas salvas em um simulado de teste, pratique e confira o gabarito no final.'],
      ['Compartilhar perguntas', 'Escolha perguntas recentes e gere um link público de quiz para seus colegas.'],
      ['Modo Kahoot Quiz ID', 'Se o professor ocultar as perguntas, cole o Quiz ID da URL para abrir um banco de respostas sem gastar créditos de IA.']
    ],
    pricing: [
      'Preços simples de créditos',
      'Recarregue apenas quando precisar',
      'Sem assinaturas recorrentes. Pacotes avulsos e diretos: respostas e explicações usam créditos, seu histórico de estudos é gratuito para sempre.',
      'Mais Popular'
    ],
    faqTitle: 'Perguntas frequentes'
  },
  ar: {
    headingStart: 'حل الاختبارات بقوة',
    headingAccent: 'الذكاء الاصطناعي',
    eyebrow: 'إضافة كروم لحل الاختبارات بالذكاء الاصطناعي',
    lead: 'حل الاختبارات فورياً على أكثر من 35 منصة مثل Testportal و Moodle و Kahoot و Canvas و Google Forms... وعدد لا نهائي من المواقع الأخرى بفضل Universal Parser™*. احصل على اقتراحات إجابات فورية مع شروحات خطوة بخطوة.',
    primary: 'تثبيت من سوق Chrome الإلكتروني',
    secondary: 'طريقة العمل',
    proof: [
      { prefix: '', target: 35, suffix: '+ منصة اختبارات مدعومة مباشرة' },
      { prefix: '', target: -1, suffix: ' مواقع أخرى — تعمل في كل مكان مع Universal Parser™*', href: '/ar/blog/universal-parser-infinite-quiz-platforms' }
    ],
    asterisk: '* يتكيف Universal Parser™ تلقائياً مع أي اختبار تقريباً على الإنترنت. للواجهات المحمية بشدة أو المصممة كصور، استخدم ميزة FocusScan الموثوقة.',
    asterisk2: '** قد تقوم منصات الاختبارات بتحديث شفرتها البرمجية مما قد يمنع القراءة التلقائية الفورية — ولهذا يضمن FocusScan (تحديد منطقة على الشاشة) نجاح الحل بنسبة 100%.',
    socialProof: 'مصمم خصيصاً للاختبارات الحقيقية: Universal Parser و FocusScan وسجل دراسي محفوظ في إضافة واحدة لمتصفح Chrome.',
    how: [
      'كيف يعمل QuizSolver',
      '3 خطوات بسيطة لحل أي اختبار بالذكاء الاصطناعي',
      'قم بالتثبيت مرة واحدة، وحل الاختبارات على أي منصة مدعومة، وابنِ مكتبتك الدراسية تلقائياً.'
    ],
    steps: [
      ['التثبيت وتسجيل الدخول', 'أضف QuizSolver إلى متصفح Chrome مجاناً. قم بإنشاء حسابك — تتم مزامنة أسئلتك المحلولة وملاحظاتك واختبارات التدريب بين الإضافة والموقع الإلكتروني.'],
      ['الحل أو المسح', 'انقر على "حل الصفحة الحالية". بالنسبة للصور أو ملفات PDF أو المخططات غير العادية، اسحب أداة FocusScan لتحديد منطقة السؤال فقط.'],
      ['المراجعة والمشاركة', 'يتم حفظ كل سؤال تم حله في "السجل". يمكنك تحويلها إلى بطاقات استذكار أو اختبارات تجريبية أو مشاركة الأسئلة مع زملائك.']
    ],
    features: [
      'ميزات QuizSolver',
      'مجموعة أدوات ذكاء اصطناعي شاملة لحل الاختبارات والدراسة بذكاء',
      'مصممة لجميع الحالات: أسئلة نصية، أسئلة داخل صور، وضع التلميح، نافذة سريعة عائمة ونظام مراجعة متكامل.',
      ['محلل الاختبارات الشامل', 'يحاول QuizSolver أولاً قراءة الأسئلة الظاهرة على أي صفحة اختبار، ويستخدم مسارات مخصصة لمنصات Testportal و Moodle و Canvas و Forms.'],
      ['وضع التلميح', 'استخدمه عندما تفضل التحكم الكامل. يقوم QuizSolver بتمييز الإجابة المحتملة بلون خفيف دون تحديدها تلقائياً.'],
      ['FocusScan', 'حدد منطقة السؤال يدوياً عندما يكون السؤال داخل صورة أو ملف PDF أو عنصر Canvas محمي.'],
      ['النافذة العائمة السريعة', 'افتح نافذة صغيرة متحركة فوق صفحة الاختبار لتنفيذ إجراءات سريعة وحل الأسئلة فوراً.'],
      ['السجل والملاحظات', 'احفظ الأسئلة المحلولة مع إجاباتها والشروحات التفصيلية والمصدر والملاحظات الشخصية.'],
      ['اختبارات تجريبية من السجل', 'حوّل الأسئلة المحفوظة إلى اختبار تجريبي تدرب عليه واطلع على الإجابات الصحيحة في النهاية.'],
      ['مشاركة الأسئلة', 'اختر الأسئلة الحديثة وأنشئ رابط اختبار عام لمشاركته مع زملائك.'],
      ['معرّف كويز Kahoot', 'إذا قام المعلم بإخفاء الأسئلة، يتيح لك معرّف الاختبار (Quiz ID) البحث في بنك الإجابات دون استهلاك أرصدة الذكاء الاصطناعي.']
    ],
    pricing: [
      'أسعار أرصدة مرنة ومباشرة',
      'اشحن فقط عند الحاجة',
      'بدون اشتراكات شهرية متكررة. باقات فردية مباشرة: الإجابات والشروحات تستهلك أرصدة، وسجل دراستك يظل متاحاً مجاناً دائماً.',
      'الأكثر شعبية'
    ],
    faqTitle: 'الأسئلة الشائعة'
  }
};

const HOME_PLATFORM_KEYS: PageKey[] = ['testportal', 'moodle', 'canvas', 'googleForms', 'microsoftForms', 'blackboard', 'quizlet', 'socrative', 'kahoot', 'quizizz'];

const HOME_DETAIL_TEXT: Record<Exclude<Locale, 'en' | 'pl'>, any> = {
  de: {
    platforms: ['Nahtlose Plattform-Integrationen', 'Optimiert für die Systeme, die du wirklich nutzt', 'Eine Chrome-Erweiterung für Testportal, Moodle, Canvas, Google Forms, Microsoft Forms, Blackboard, Quizlet, Socrative, Kahoot und Quizizz.'],
    packs: [
      ['Rettungs-Paket (100 Antworten)', 'Sicherheit für 3–5 Klausuren • Günstiger als ein Kaffee', 'Rettungs-Paket wählen', ['100 KI-Antworten mit Schritt-für-Schritt-Erklärung', 'Sicherheit für 3–5 komplette Tests & Klausuren', 'Funktioniert auf Moodle, Testportal, Canvas & Forms', 'Credits verfallen nie — Einmalkauf ohne Abo']],
      ['Semester-Paket (500 Antworten)', 'Stressfreie Hausaufgaben & Klausuren das ganze Semester • Günstiger als Pizza', 'Semester-Paket wählen', ['500 KI-Antworten mit Erklärung', '50% Ersparnis gegenüber Starter (~$0.01 / Antwort)', 'Hohe Priorität bei zeitbegrenzten Tests', 'Dauerhafter Zugriff auf Historie & Notizen']],
      ['Jahres- & Lerngruppen-Paket (2000 Antworten)', 'Vorrat fürs ganze Studienjahr oder zum Teilen • Bester Preis (<$0.008)', 'Jahres-Paket wählen', ['2000 KI-Antworten mit Erklärung', 'Tiefster Preis pro Antwort überhaupt (<$0.008)', 'Perfekt zum Teilen mit Freunden oder fürs ganze Jahr', 'Maximale Antwortpriorität']]
    ],
    faq: [
      ['Was klicke ich auf einer Quizseite?', 'Öffne die Erweiterung und klicke Aktuelle Seite lösen. Bei ungewöhnlichen Layouts markierst du die Frage mit FocusScan.'],
      ['Funktioniert QuizSolver nur auf gelisteten Plattformen?', 'Nein. Die gelisteten Plattformen haben optimierte Workflows, aber der Universal-Parser versucht auch sichtbare Quizfragen auf anderen Websites zu lesen. Bei ungewöhnlichen Layouts hilft FocusScan.'],
      ['Funktioniert QuizSolver mit Testportal?', 'Ja. QuizSolver erkennt Testportal-Fragen, auch im Timer-Interface. Öffne den Testportal-Test, klicke Aktuelle Seite lösen und erhalte in Sekunden einen KI-Vorschlag.'],
      ['Was ist FocusScan?', 'FocusScan ist ein Screenshot-Werkzeug in QuizSolver. Markiere einen PDF-, Bild-, Canvas- oder Embed-Bereich, wenn die Frage nicht als normaler HTML-Text vorliegt.'],
      ['Wie viele kostenlose Credits bekomme ich?', 'Neue Konten erhalten Start-Credits zum Testen von Antworten und Erklärungen. Zusätzliche Pakete beginnen bei $1.99 für 100 credits. Kahoot Quiz ID verbraucht keine Credits.'],
      ['Wofür ist der Hinweis-Modus?', 'Er markiert die wahrscheinlich richtige Antwort, ohne automatisch zu klicken. Du entscheidest selbst, was du auswählst.'],
      ['Verbraucht die Demo Credits?', 'Nein. Die Demo nutzt lokale Beispielfragen und ist nur zum Lernen des Workflows gedacht.'],
      ['Wo finde ich gelöste Fragen?', 'Alle gespeicherten Fragen liegen in Historie & Quiz. Dort kannst du Notizen ergänzen, üben und Links teilen.'],
      ['Was ist Kahoot Quiz ID?', 'Quiz ID identifiziert den Quiz-Inhalt. Der Live-PIN ist nur zum Beitreten eines Spiels da.']
    ]
  },
  es: {
    platforms: ['Integraciones fluidas', 'Optimizado para los sistemas que usas', 'Una extensión de Chrome para Testportal, Moodle, Canvas, Google Forms, Microsoft Forms, Blackboard, Quizlet, Socrative, Kahoot y Quizizz.'],
    packs: [
      ['Pack Rescate (100 Respuestas)', 'Tranquilidad para 3–5 exámenes • Menos que un café', 'Elegir Pack Rescate', ['100 respuestas IA con explicación detallada', 'Tranquilidad para 3–5 exámenes o parciales', 'Funciona en Moodle, Canvas, Forms y Testportal', 'Los créditos nunca caducan — pago único sin suscripción']],
      ['Pack Semestral (500 Respuestas)', 'Tareas, parciales y exámenes todo el semestre • Menos que una pizza', 'Elegir Pack Semestral', ['500 respuestas IA con explicaciones', 'Ahorra 50% vs Starter (~$0.01 / respuesta)', 'Alta prioridad de respuesta para exámenes con tiempo', 'Acceso permanente al historial y notas']],
      ['Pack Anual o Grupal (2000 Respuestas)', 'Reserva para todo el año o para compartir • Precio mínimo (<$0.008)', 'Elegir Pack Anual', ['2000 respuestas IA con explicaciones', 'Precio más bajo por respuesta (<$0.008)', 'Ideal para compartir con amigos o todo el año', 'Máxima prioridad de respuesta']]
    ],
    faq: [
      ['¿Qué hago al abrir una página de quiz?', 'Abre la extensión y pulsa Resolver página actual. Si el diseño es raro, usa FocusScan y selecciona solo la pregunta.'],
      ['¿QuizSolver funciona solo en las plataformas listadas?', 'No. Las plataformas listadas tienen flujos optimizados, pero el parser universal también intenta leer preguntas visibles en otros sitios. Para diseños raros, usa FocusScan.'],
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
      ['Pack Sauvetage (100 Réponses)', 'Sérénité pour 3–5 partiels • Moins cher qu\'un café', 'Prendre le Pack Sauvetage', ['100 réponses IA avec explications étape par étape', 'Sérénité pour 3–5 examens ou partiels complets', 'Fonctionne sur Moodle, Canvas, Forms et Testportal', 'Crédits sans expiration — paiement unique, sans abonnement']],
      ['Pack Semestre (500 Réponses)', 'Devoirs, partiels et examens tout le semestre • Moins cher qu\'une pizza', 'Prendre le Pack Semestre', ['500 réponses IA avec explications', '50% d\'économie par rapport au Starter (~$0.01 / réponse)', 'Vitesse prioritaire pour les tests chronométrés', 'Accès illimité à l\'historique et aux notes']],
      ['Pack Annuel & Groupe (2000 Réponses)', 'Réserve pour toute l\'année ou à partager • Prix minimal (<$0.008)', 'Prendre le Pack Annuel', ['2000 réponses IA avec explications', 'Prix le plus bas par réponse (<$0.008)', 'Idéal à partager entre amis ou pour toute l\'année', 'Vitesse et priorité maximales']]
    ],
    faq: [
      ['Que faire sur une page de quiz ?', 'Ouvrez l’extension et cliquez Résoudre la page. Si le layout est inhabituel, utilisez FocusScan sur la question.'],
      ['QuizSolver fonctionne-t-il seulement sur les plateformes listées ?', 'Non. Les plateformes listées ont des workflows optimisés, mais le parser universel essaie aussi de lire les questions visibles sur d’autres sites. Pour les layouts inhabituels, utilisez FocusScan.'],
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
      ['Pacchetto Soccorso (100 Risposte)', 'Serenità per 3–5 esami • Meno di un caffè', 'Prendi Pacchetto Soccorso', ['100 risposte IA con spiegazioni dettagliate', 'Serenità per 3–5 verifiche o esami completi', 'Funziona su Moodle, Canvas, Forms e Testportal', 'I crediti non scadono mai — pagamento una tantum']],
      ['Pacchetto Semestrale (500 Risposte)', 'Compiti, prove ed esami tutto il semestre • Meno del costo di una pizza', 'Prendi Pacchetto Semestrale', ['500 risposte IA con spiegazioni', 'Risparmi il 50% rispetto allo Starter (~$0.01 / risposta)', 'Alta priorità di risposta per test a tempo', 'Accesso illimitato a cronologia e note']],
      ['Pacchetto Annuale & Gruppo (2000 Risposte)', 'Scorta per tutto l\'anno o da condividere • Prezzo più basso (<$0.008)', 'Prendi Pacchetto Annuale', ['2000 risposte IA con spiegazioni', 'Prezzo più basso per risposta (<$0.008)', 'Perfetto da dividere con compagni o per tutto l\'anno', 'Massima priorità di risposta']]
    ],
    faq: [
      ['Cosa clicco su una pagina quiz?', 'Apri l’estensione e premi Risolvi pagina corrente. Per layout insoliti usa FocusScan sulla domanda.'],
      ['QuizSolver funziona solo sulle piattaforme elencate?', 'No. Le piattaforme elencate hanno workflow ottimizzati, ma il parser universale prova anche a leggere domande visibili su altri siti. Per layout insoliti usa FocusScan.'],
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
      ['Рятувальний пакет (100 Відповідей)', 'Спокій на 3–5 модулів • Дешевше за каву', 'Обрати Рятувальний пакет', ['100 AI-відповідей з покроковими поясненнями', 'Спокій на 3–5 повних модулів або тестів', 'Працює на Testportal, Moodle, Canvas та Forms', 'Кредити ніколи не згорають — без регулярних підписок']],
      ['Семестровий пакет (500 Відповідей)', 'Домашки, модулі та сесія на весь семестр • Дешевше за піцу', 'Обрати Семестровий пакет', ['500 AI-відповідей з поясненнями', '50% економії проти Starter (~$0.01 / відповідь)', 'Високий пріоритет швидкості на тестах з таймером', 'Безтерміновий доступ до збереженої історії']],
      ['Річний / Спільний пакет (2000 Відповідей)', 'Запас на весь рік або для спільних занять • Найкраща ціна (<$0.008)', 'Обрати Річний пакет', ['2000 AI-відповідей з поясненнями', 'Найнижча ціна за одну відповідь (<$0.008)', 'Ідеально для спілки з друзями або на весь навчальний рік', 'Максимальний пріоритет швидкості']]
    ],
    faq: [
      ['Що натиснути на сторінці квізу?', 'Відкрий розширення і натисни Розв’язати сторінку. Для незвичного макета використовуй FocusScan.'],
      ['QuizSolver працює лише на перелічених платформах?', 'Ні. Перелічені платформи мають оптимізовані сценарії, але універсальний парсер також пробує читати видимі питання на інших сайтах. Для незвичних макетів допомагає FocusScan.'],
      ['Чи працює QuizSolver на Testportal?', 'Так. QuizSolver розпізнає питання Testportal, включно з інтерфейсом таймера. Відкрий квіз, натисни Розв’язати сторінку й отримай AI-підказку за секунди.'],
      ['Що таке FocusScan?', 'FocusScan — це інструмент скріншота в QuizSolver. Виділи область PDF, зображення, canvas або embed, якщо питання не є звичайним HTML-текстом.'],
      ['Скільки безкоштовних кредитів я отримую?', 'Нові акаунти отримують стартові кредити для перевірки відповідей і пояснень. Додаткові пакети починаються від $1.99 за 100 кредитів. Kahoot Quiz ID не витрачає кредити.'],
      ['Для чого режим підказки?', 'Він підсвічує ймовірну відповідь без автоматичного кліку, щоб рішення залишалося за тобою.'],
      ['Чи витрачає демо кредити?', 'Ні. Демо використовує локальні підготовлені питання, щоб навчити workflow.'],
      ['Де переглянути розв’язані питання?', 'В Історія і квіз можна переглядати, додавати нотатки, тренуватися і ділитися посиланням.'],
      ['Що таке Kahoot Quiz ID?', 'Quiz ID визначає сам квіз. PIN потрібен лише для входу в живу гру.']
    ]
  },
  pt: {
    platforms: ['Integrações perfeitas', 'Otimizado para os sistemas que você realmente usa', 'Uma extensão do Chrome para Testportal, Moodle, Canvas, Google Forms, Microsoft Forms, Blackboard, Quizlet, Socrative, Kahoot e Quizizz.'],
    packs: [
      ['Pacote Resgate (100 Respostas)', 'Tranquilidade para 3–5 provas • Menos que um cafezinho', 'Escolher Pacote Resgate', ['100 sugestões de resposta com IA + explicações', 'Tranquilidade para 3–5 provas completas', 'Funciona no Moodle, Testportal, Canvas e Forms', 'Créditos nunca expiram — pagamento único, sem assinatura']],
      ['Pacote Semestral (500 Respostas)', 'Trabalhos, provas e notas altas no semestre todo • Menos que uma pizza', 'Escolher Pacote Semestral', ['500 respostas sugeridas por IA com explicações', '50% de economia vs Starter (~$0.01 / resposta)', 'Prioridade máxima de resposta em testes com cronômetro', 'Acesso vitalício ao histórico e anotações salvas']],
      ['Pacote Anual & Grupo (2000 Respostas)', 'Suprimento para o ano todo ou para dividir com a turma • Melhor preço (<$0.008)', 'Escolher Pacote Anual', ['2000 respostas sugeridas por IA com explicações', 'Menor preço por resposta do mercado (<$0.008)', 'Perfeito para dividir com amigos ou usar o ano inteiro', 'Prioridade máxima instantânea nos servidores de IA']]
    ],
    faq: [
      ['O que devo clicar ao abrir uma página de teste?', 'Abra a extensão QuizSolver e clique em "Resolver página atual". Se o layout for suportado, a pergunta e opções são detectadas. Em layouts incomuns, use o FocusScan e selecione a área da pergunta.'],
      ['O QuizSolver funciona apenas nas plataformas listadas?', 'Não. As plataformas listadas possuem fluxos otimizados, mas o Universal Parser também lê perguntas em praticamente qualquer outro site de quiz. Em formatos gráficos, use o FocusScan.'],
      ['O que acontece se a minha plataforma ainda não tiver suporte direto?', 'O Universal Parser tenta ler o conteúdo primeiro. Se encontrar dificuldades, você pode reportar pela extensão. Atualizamos perfis de parser constantemente para suportar novos sistemas.'],
      ['O QuizSolver funciona no Testportal?', 'Sim. O QuizSolver detecta automaticamente perguntas no Testportal, inclusive com cronômetro ativo. Basta clicar em "Resolver página atual" para ver a sugestão da IA em segundos.'],
      ['O que é o FocusScan e quando usá-lo?', 'O FocusScan é uma ferramenta de captura integrada ao QuizSolver. Desenhe um retângulo sobre qualquer pergunta em imagem, PDF ou canvas bloqueado e a IA processará apenas aquela área.'],
      ['Quantos créditos gratuitos eu recebo?', 'Todas as contas novas recebem créditos gratuitos para testar sugestões e explicações. Pacotes adicionais começam a partir de $1.99 por 100 créditos. O modo Kahoot Quiz ID não gasta créditos.'],
      ['Para que serve o Modo Dica?', 'Ele destaca a resposta provável na tela sem clicar ou marcar automaticamente, mantendo você no total controle da decisão.'],
      ['A página de demonstração consome créditos?', 'Não. A demonstração usa perguntas locais simuladas para você aprender e testar o funcionamento sem gastar créditos de IA.'],
      ['Onde posso rever as questões que já resolvi?', 'Na aba Histórico e Quiz você pode rever questões respondidas, fazer anotações, praticar simulados e gerar links para compartilhar.'],
      ['Qual a diferença entre o PIN do Kahoot e o Quiz ID?', 'O PIN serve para entrar em uma partida ao vivo. O Quiz ID identifica o questionário em si (visível no link). O Quiz Solver usa o Quiz ID para o banco de respostas offline.']
    ]
  },
  ar: {
    platforms: ['تكامل سلس مع المنصات', 'محسّن للمنصات التعليمية التي تستخدمها فعلياً', 'إضافة Chrome واحدة تدعم Testportal و Moodle و Canvas و Google Forms و Microsoft Forms و Blackboard و Quizlet و Socrative و Kahoot و Quizizz.'],
    packs: [
      ['باقة الإنقاذ (100 إجابة)', 'راحة بال لـ 3–5 اختبارات • أقل من ثمن قهوة', 'اختر باقة الإنقاذ', ['100 اقتراح إجابة بالذكاء الاصطناعي مع شروحات خطوة بخطوة', 'راحة بال تامة لـ 3–5 اختبارات كاملة', 'تعمل على Moodle و Testportal و Canvas و Forms', 'الأرصدة لا تنتهي صلاحيتها أبداً — دفعة واحدة دون اشتراك']],
      ['باقة الفصل الدراسي (500 إجابة)', 'واجبات واختبارات ودرجات عالية طوال الفصل • أقل من ثمن بيتزا', 'اختر باقة الفصل الدراسي', ['500 إجابة مقترحة بالذكاء الاصطناعي مع شروحات', 'توفير 50% مقارنة بالباقة المبتدئة (~0.01$ لكل إجابة)', 'أولوية قصوى وسرعة استجابة في الاختبارات ذات التوقيت المحدد', 'وصول دائم غير محدود للسجل والملاحظات المحفوظة']],
      ['باقة العام ومجموعات الدراسة (2000 إجابة)', 'تكفي للعام الدراسي بأكمله أو للمشاركة مع زملائك • أفضل سعر (<0.008$)', 'اختر باقة العام', ['2000 إجابة مقترحة بالذكاء الاصطناعي مع شروحات', 'أقل سعر لكل إجابة في السوق إطلاقاً (<0.008$)', 'مثالية للمشاركة مع الأصدقاء أو الاستخدام طوال العام', 'أولوية معالجة فورية على خوادم الذكاء الاصطناعي']]
    ],
    faq: [
      ['ماذا أنقر عند فتح صفحة الاختبار؟', 'افتح إضافة QuizSolver وانقر على "حل الصفحة الحالية". إذا كان التصميم مدعوماً، يتم التعرف على السؤال والخيارات فوراً. للتصميمات غير العادية، استخدم FocusScan وحدد منطقة السؤال.'],
      ['هل يعمل QuizSolver فقط على المنصات المذكورة؟', 'لا. المنصات المذكورة تتوفر على مسارات عمل محسنة، لكن Universal Parser يقرأ الأسئلة أيضاً على أي موقع اختبارات تقريباً. في التنسيقات المصورة، استخدم FocusScan.'],
      ['ماذا لو كانت منصتي لا تحتوي على دعم مباشر بعد؟', 'يحاول Universal Parser قراءة المحتوى أولاً. إذا واجهت أي صعوبة، يمكنك الإبلاغ عبر الإضافة. نحن نحدّث أنماط التحليل باستمرار لدعم أنظمة جديدة.'],
      ['هل يعمل QuizSolver مع Testportal؟', 'نعم. يتعرف QuizSolver تلقائياً على أسئلة Testportal، حتى مع وجود مؤقت الاختبار النشط. انقر ببساطة على "حل الصفحة الحالية" لرؤية اقتراح الذكاء الاصطناعي في ثوانٍ.'],
      ['ما هي أداة FocusScan ومتى أستخدمها؟', 'FocusScan هي أداة التقاط شاشة مدمجة في QuizSolver. ارسم مستطيلاً حول أي سؤال داخل صورة أو ملف PDF أو عنصر Canvas محمي ليعالج الذكاء الاصطناعي تلك المنطقة فقط.'],
      ['كم عدد الأرصدة المجانية التي أحصل عليها؟', 'تحصل جميع الحسابات الجديدة على أرصدة ترحيبية مجانية لتجربة الإجابات والشروحات. تبدأ الباقات الإضافية من 1.99$ مقابل 100 رصيد. ميزة Kahoot Quiz ID لا تستهلك أي أرصدة.'],
      ['ما فائدة وضع التلميح (Hint Mode)؟', 'يميز الإجابة المحتملة على الشاشة دون النقر عليها أو اختيارها تلقائياً، مما يمنحك السيطرة الكاملة على القرار النهائي.'],
      ['هل تستهلك صفحة العرض التوضيحي أرصدة؟', 'لا. يستخدم العرض التوضيحي أسئلة محلية محاكية لتتعلم كيفية الاستخدام وتجرب الأداة دون استهلاك أرصدة الذكاء الاصطناعي.'],
      ['أين يمكنني مراجعة الأسئلة التي قمت بحلها سابقاً؟', 'في تبويب "السجل والاختبار" يمكنك مراجعة الأسئلة المحلولة، وإضافة الملاحظات، وخوض اختبارات تجريبية، وإنشاء روابط للمشاركة.'],
      ['ما الفرق بين رمز Kahoot PIN ومعرّف Quiz ID؟', 'يُستخدم PIN للانضمام إلى لعبة مباشرة. بينما يحدد معرّف Quiz ID الاختبار نفسه (موجود في رابط الاختبار). يستخدم QuizSolver معرّف Quiz ID للوصول إلى بنك الإجابات دون الحاجة إلى تشغيل اللعبة.']
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
    name: detail.packs[index][0],
    caption: detail.packs[index][1],
    button: detail.packs[index][2],
    features: detail.packs[index][3]
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
      asterisk: t.asterisk,
      asterisk2: t.asterisk2,
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
HOME_COPY.pt = makeHomeCopy('pt');
HOME_COPY.ar = makeHomeCopy('ar');
