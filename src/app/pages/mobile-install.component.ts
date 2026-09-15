import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '../seo.service';
import { Locale, contentFor, pageData, pathFor, CHROME_WEB_STORE_URL } from '../site-content';
import { ShellComponent } from './shell.component';

@Component({
  standalone: true,
  imports: [CommonModule, ShellComponent],
  template: `
    <qs-shell [locale]="locale" pageKey="mobileInstall">
      <div class="container mobile-install-page">
        <section class="utility-hero text-center">
          <span class="eyebrow">Mobile Setup</span>
          <h1 class="hero-title">{{ data?.title }}</h1>
          <p class="hero-subtitle text-secondary mx-auto">{{ data?.subtitle }}</p>
          
          <div class="os-tabs">
            <button class="btn" [class.btn-primary]="os === 'android'" [class.btn-outline]="os !== 'android'" (click)="os = 'android'">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.411 13.8533 8.082 12 8.082s-3.5902.329-5.1367.8677L4.841 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396"/></svg>
              <span>Android (Kiwi Browser)</span>
            </button>
            <button class="btn" [class.btn-primary]="os === 'ios'" [class.btn-outline]="os !== 'ios'" (click)="os = 'ios'">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.96.04-2.14.65-2.82 1.45-.6.69-1.12 1.77-1.02 2.82 1.08.08 2.21-.56 2.83-1.4z"/></svg>
              <span>iOS (iPhone / iPad)</span>
            </button>
          </div>
        </section>

        <section class="tutorial-content">
          <!-- ANDROID KIWI BROWSER TUTORIAL -->
          <div class="android-tutorial" *ngIf="os === 'android'">
            <div class="kiwi-callout glass">
              <div class="kiwi-callout-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              </div>
              <div class="kiwi-callout-text">
                <h3>{{ androidGuide.whyKiwiTitle }}</h3>
                <p class="text-secondary">{{ androidGuide.whyKiwiText }}</p>
              </div>
            </div>

            <div class="steps-grid">
              <!-- STEP 1 -->
              <div class="step-card glass">
                <div class="step-header">
                  <span class="step-badge">01</span>
                  <span class="step-tag">{{ isPl ? 'Google Play' : 'Play Store' }}</span>
                </div>
                <h3>{{ isPl ? 'Zainstaluj Kiwi Browser' : 'Install Kiwi Browser' }}</h3>
                <p class="text-secondary">
                  {{ isPl ? 'Pobierz bezpłatną przeglądarkę Kiwi ze sklepu Google Play. Działa na silniku Chromium i w 100% obsługuje rozszerzenia z Chrome Web Store na telefonie.' : 'Download the free Kiwi Browser from Google Play. It runs on Chromium and fully supports Chrome extensions on Android.' }}
                </p>

                <!-- Mockup Play Store -->
                <div class="step-illustration">
                  <div class="mock-play-card">
                    <div class="mock-play-app">
                      <div class="mock-kiwi-logo">🥝</div>
                      <div class="mock-play-meta">
                        <strong>Kiwi Browser</strong>
                        <span>Geometry · 4.4 ★ (10M+ pobrań)</span>
                      </div>
                    </div>
                    <span class="mock-play-badge">{{ isPl ? 'Darmowa' : 'Free' }}</span>
                  </div>
                </div>

                <div class="step-action">
                  <a [href]="kiwiPlayStoreUrl" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm btn-block">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a1.597 1.597 0 0 1-.22-.843V2.657c0-.317.078-.612.219-.843zm11.235 11.238l2.569-2.57-11.83-6.83 9.261 9.4zm0 1.896l-9.26 9.4 11.829-6.83-2.569-2.57zm1.053-1.053l2.844 1.642a1.6 1.6 0 0 0 1.604 0l-4.448-2.57 4.448-2.57a1.6 1.6 0 0 0-1.604 0l-2.844 1.642z"/></svg>
                    <span>{{ isPl ? 'Pobierz z Google Play' : 'Get on Google Play' }}</span>
                  </a>
                </div>
              </div>

              <!-- STEP 2 -->
              <div class="step-card glass">
                <div class="step-header">
                  <span class="step-badge">02</span>
                  <span class="step-tag">Chrome Web Store</span>
                </div>
                <h3>{{ isPl ? 'Dodaj QuizSolver do Kiwi' : 'Add QuizSolver to Kiwi' }}</h3>
                <p class="text-secondary">
                  {{ isPl ? 'Uruchom Kiwi Browser na telefonie, wejdź w link do Chrome Web Store i kliknij niebieski przycisk „Dodaj do Chrome”.' : 'Open Kiwi Browser on your phone, visit the Chrome Web Store link and tap the blue "Add to Chrome" button.' }}
                </p>

                <!-- Mockup Chrome Web Store -->
                <div class="step-illustration">
                  <div class="mock-cws-bar">
                    <div class="mock-cws-info">
                      <span class="mock-qs-icon">QS</span>
                      <div>
                        <strong>QuizSolver</strong>
                        <small>5.0 ★★★★★</small>
                      </div>
                    </div>
                    <span class="mock-cws-btn">{{ isPl ? '+ Dodaj do Chrome' : '+ Add to Chrome' }}</span>
                  </div>
                </div>

                <div class="step-action">
                  <a [href]="storeUrl" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm btn-block">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" y1="8" x2="12" y2="8"/><line x1="3.95" y1="6.06" x2="8.54" y2="14"/><line x1="10.88" y1="21.94" x2="15.46" y2="14"/></svg>
                    <span>{{ isPl ? 'Otwórz Chrome Web Store' : 'Open Chrome Web Store' }}</span>
                  </a>
                </div>
              </div>

              <!-- STEP 3 -->
              <div class="step-card glass">
                <div class="step-header">
                  <span class="step-badge">03</span>
                  <span class="step-tag">{{ isPl ? 'Menu Kiwi' : 'Kiwi Menu' }}</span>
                </div>
                <h3>{{ isPl ? 'Otwórz w menu i zaloguj się' : 'Open Menu & Sign In' }}</h3>
                <p class="text-secondary">
                  {{ isPl ? 'W Kiwi kliknij trzy kropki (⋮) w prawym górnym rogu ekranu i przewiń na sam dół menu. Kliknij QuizSolver i zaloguj się, aby połączyć swoje konto i kredyty.' : 'In Kiwi, tap the three dots (⋮) in the top right corner and scroll to the bottom. Tap QuizSolver and sign in to access your credits.' }}
                </p>

                <!-- Mockup Kiwi Menu -->
                <div class="step-illustration">
                  <div class="mock-menu-box">
                    <div class="mock-menu-item muted">{{ isPl ? 'Nowa karta' : 'New tab' }}</div>
                    <div class="mock-menu-item muted">{{ isPl ? 'Pobrane pliki' : 'Downloads' }}</div>
                    <div class="mock-menu-divider"></div>
                    <div class="mock-menu-item active-ext">
                      <span class="mock-qs-pill">QS</span>
                      <strong>QuizSolver — AI Quiz Solver</strong>
                      <span class="mock-arrow">›</span>
                    </div>
                  </div>
                </div>

                <div class="step-action">
                  <span class="step-note text-secondary">
                    💡 {{ isPl ? 'Wskazówka: Zaloguj się tym samym mailem, co na komputerze.' : 'Tip: Sign in with the same email you use on desktop.' }}
                  </span>
                </div>
              </div>

              <!-- STEP 4 -->
              <div class="step-card glass">
                <div class="step-header">
                  <span class="step-badge">04</span>
                  <span class="step-tag">{{ isPl ? 'Gotowe!' : 'Ready!' }}</span>
                </div>
                <h3>{{ isPl ? 'Rozwiązuj quizy z AI na telefonie' : 'Solve Quizzes with AI on Mobile' }}</h3>
                <p class="text-secondary">
                  {{ isPl ? 'Wejdź na Testportal, Google Forms, Moodle lub dowolny quiz w Kiwi. Kliknij 3 kropki -> QuizSolver -> „Rozwiąż stronę”. Przy pytaniach ze zdjęciem użyj FocusScan.' : 'Visit Testportal, Google Forms, Moodle or any quiz in Kiwi. Tap 3 dots -> QuizSolver -> "Solve page", or use FocusScan for image questions.' }}
                </p>

                <!-- Mockup Solving Question -->
                <div class="step-illustration">
                  <div class="mock-quiz-box">
                    <div class="mock-quiz-q">{{ isPl ? 'Pytanie 1 / 15: Wybierz poprawną odpowiedź...' : 'Question 1 / 15: Select the correct answer...' }}</div>
                    <div class="mock-quiz-opt correct">
                      <span>✓ {{ isPl ? 'Odpowiedź A (AI 98%)' : 'Option A (AI 98%)' }}</span>
                      <span class="badge-ai">{{ isPl ? 'Sugerowana' : 'Suggested' }}</span>
                    </div>
                  </div>
                </div>

                <div class="step-action">
                  <a [href]="pathFor('demo', locale)" class="btn btn-outline btn-sm btn-block">
                    <span>{{ isPl ? 'Wypróbuj w darmowym Demo' : 'Try Free Interactive Demo' }}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- IOS VIDEO TUTORIAL -->
          <div class="video-wrapper-vertical" *ngIf="os === 'ios'">
            <div class="video-container-vertical glass">
              <iframe
                src="https://www.youtube-nocookie.com/embed/2YHPMk_xHAs"
                title="How to install QuizSolver on iOS"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen>
              </iframe>
            </div>
            <div class="video-meta-note">
              <a href="https://youtube.com/shorts/2YHPMk_xHAs" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
                <span>{{ isPl ? 'Otwórz w aplikacji YouTube' : 'Open in YouTube app' }}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </div>
          </div>
        </section>
      </div>
    </qs-shell>
  `,
  styles: [`
    .mobile-install-page {
      padding-bottom: 5rem;
    }
    .utility-hero {
      padding: 4.5rem 0 2.5rem;
    }
    .text-center { text-align: center; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .hero-title {
      font-size: clamp(2rem, 5vw, 3rem);
      margin-top: 0.5rem;
    }
    .hero-subtitle {
      font-size: 1.125rem;
      margin: 1rem auto 1.5rem;
      max-width: 46rem;
    }
    .os-tabs {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 1.75rem;
      flex-wrap: wrap;
    }
    .os-tabs .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.75rem 1.4rem;
      font-size: 1rem;
    }
    .tutorial-content {
      max-width: 900px;
      margin: 0 auto;
    }

    /* Kiwi Callout */
    .kiwi-callout {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1.5rem;
      border-radius: 16px;
      margin-bottom: 2rem;
      border-left: 4px solid var(--accent-cyan);
    }
    .kiwi-callout-icon {
      color: var(--accent-cyan);
      flex-shrink: 0;
    }
    .kiwi-callout-text h3 {
      font-size: 1.15rem;
      margin-bottom: 0.25rem;
    }
    .kiwi-callout-text p {
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    /* Steps Grid */
    .steps-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    .step-card {
      display: flex;
      flex-direction: column;
      padding: 1.75rem;
      border-radius: 16px;
      position: relative;
    }
    .step-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
    .step-badge {
      font-size: 0.85rem;
      font-weight: 800;
      color: var(--accent-cyan);
      background: rgba(14, 165, 233, 0.12);
      border: 1px solid rgba(14, 165, 233, 0.3);
      padding: 0.25rem 0.65rem;
      border-radius: var(--radius-sm);
    }
    .step-tag {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .step-card h3 {
      font-size: 1.25rem;
      margin-bottom: 0.6rem;
      color: var(--text-primary);
    }
    .step-card p {
      font-size: 0.925rem;
      line-height: 1.55;
      margin-bottom: 1.25rem;
    }

    /* Step Mockup Illustrations */
    .step-illustration {
      margin-top: auto;
      margin-bottom: 1.25rem;
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 0.85rem 1rem;
    }
    .mock-play-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
    }
    .mock-play-app {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }
    .mock-kiwi-logo {
      font-size: 1.6rem;
      line-height: 1;
    }
    .mock-play-meta {
      display: flex;
      flex-direction: column;
    }
    .mock-play-meta strong {
      font-size: 0.95rem;
    }
    .mock-play-meta span {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    .mock-play-badge {
      font-size: 0.75rem;
      color: #34d399;
      background: rgba(52, 211, 153, 0.12);
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      font-weight: 600;
    }

    .mock-cws-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
    }
    .mock-cws-info {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .mock-qs-icon {
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, var(--accent-violet), var(--accent-cyan));
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 900;
      color: #fff;
    }
    .mock-cws-info small {
      display: block;
      font-size: 0.7rem;
      color: #facc15;
    }
    .mock-cws-btn {
      font-size: 0.75rem;
      font-weight: 700;
      color: #fff;
      background: var(--accent-cyan);
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      white-space: nowrap;
    }

    .mock-menu-box {
      font-size: 0.8rem;
    }
    .mock-menu-item {
      padding: 0.3rem 0;
    }
    .mock-menu-item.muted {
      color: var(--text-tertiary);
    }
    .mock-menu-divider {
      height: 1px;
      background: var(--border);
      margin: 0.4rem 0;
    }
    .mock-menu-item.active-ext {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-primary);
      background: rgba(14, 165, 233, 0.1);
      border: 1px solid rgba(14, 165, 233, 0.3);
      padding: 0.45rem 0.65rem;
      border-radius: 8px;
    }
    .mock-qs-pill {
      font-size: 0.65rem;
      background: var(--accent-cyan);
      color: #030712;
      padding: 0.1rem 0.35rem;
      border-radius: 4px;
      font-weight: 800;
    }
    .mock-arrow {
      margin-left: auto;
      color: var(--accent-cyan);
      font-size: 1rem;
    }

    .mock-quiz-box {
      font-size: 0.8rem;
    }
    .mock-quiz-q {
      color: var(--text-secondary);
      margin-bottom: 0.4rem;
    }
    .mock-quiz-opt.correct {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #34d399;
      padding: 0.4rem 0.65rem;
      border-radius: 6px;
      font-weight: 600;
    }
    .badge-ai {
      font-size: 0.65rem;
      background: rgba(16, 185, 129, 0.25);
      padding: 0.1rem 0.4rem;
      border-radius: 4px;
    }

    .step-action {
      margin-top: 0.5rem;
    }
    .step-action .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
    }
    .step-note {
      display: block;
      font-size: 0.825rem;
      text-align: center;
    }

    /* iOS Vertical Video - Auto Adaptive Height & Width */
    .video-wrapper-vertical {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      width: 100%;
    }
    .video-container-vertical {
      width: min(280px, 80vw);
      height: min(490px, 58vh);
      aspect-ratio: 9 / 16;
      border-radius: 18px;
      overflow: hidden;
      position: relative;
      background: #000;
      border: 1px solid var(--border);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
    }
    .video-container-vertical iframe {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }
    .video-meta-note {
      text-align: center;
    }
    .video-meta-note a {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    @media (max-width: 640px) {
      .steps-grid {
        grid-template-columns: 1fr;
      }
      .kiwi-callout {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class MobileInstallComponent implements OnInit {
  locale: Locale = 'en';
  c = contentFor(this.locale);
  data: any;
  os: 'android' | 'ios' = 'android';

  protected readonly pathFor = pathFor;
  protected readonly storeUrl = CHROME_WEB_STORE_URL;
  protected readonly kiwiPlayStoreUrl = 'https://play.google.com/store/apps/details?id=com.kiwibrowser.browser';

  private route = inject(ActivatedRoute);
  private seo = inject(SeoService);
  private platformId = inject(PLATFORM_ID);

  get isPl(): boolean {
    return this.locale === 'pl';
  }

  get androidGuide() {
    return {
      whyKiwiTitle: this.isPl ? 'Dlaczego Kiwi Browser?' : 'Why Kiwi Browser?',
      whyKiwiText: this.isPl
        ? 'Aplikacja Google Chrome na telefony nie obsługuje rozszerzeń. Kiwi Browser to bezpłatna przeglądarka oparta na tym samym silniku Chromium, która w 100% wspiera rozszerzenia z Chrome Web Store na telefonach z systemem Android.'
        : 'The standard mobile Google Chrome does not support extensions. Kiwi Browser is a free browser based on the same Chromium engine that fully supports Chrome Web Store extensions on Android phones.'
    };
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
      if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) {
        this.os = 'ios';
      }
    }
    
    this.route.data.subscribe(data => {
      this.locale = data['locale'] || 'en';
      this.c = contentFor(this.locale);
      this.data = pageData('mobileInstall', this.locale);
      this.seo.applyPage('mobileInstall', this.locale);
    });
  }
}
