import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, inject, PLATFORM_ID, signal } from '@angular/core';
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
        <!-- HERO -->
        <section class="utility-hero text-center">
          <span class="eyebrow">{{ t.eyebrow }}</span>
          <h1 class="hero-title">{{ t.title }}</h1>
          <p class="hero-subtitle text-secondary mx-auto">
            {{ t.subtitle }}
          </p>
          
          <div class="os-selector">
            <button class="os-btn" [class.active]="os === 'android'" (click)="os = 'android'" type="button">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.411 13.8533 8.082 12 8.082s-3.5902.329-5.1367.8677L4.841 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396"/></svg>
              <div class="os-btn-content">
                <strong>Android</strong>
                <span>Kiwi Browser</span>
              </div>
            </button>

            <button class="os-btn" [class.active]="os === 'ios'" (click)="os = 'ios'" type="button">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.96.04-2.14.65-2.82 1.45-.6.69-1.12 1.77-1.02 2.82 1.08.08 2.21-.56 2.83-1.4z"/></svg>
              <div class="os-btn-content">
                <strong>iOS</strong>
                <span>iPhone / iPad</span>
              </div>
            </button>
          </div>
        </section>

        <!-- ANDROID FLOW -->
        <section class="install-flow" *ngIf="os === 'android'">

          <!-- Trust bar -->
          <div class="trust-bar">
            <div class="trust-pill">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              <span>{{ t.trustFree }}</span>
            </div>
            <div class="trust-pill">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>
              <span>{{ t.trustTime }}</span>
            </div>
            <div class="trust-pill">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z"/></svg>
              <span>{{ t.trustRoot }}</span>
            </div>
          </div>

          <!-- Quick summary banner -->
          <div class="summary-card glass">
            <div class="summary-top">
              <img src="/logo.svg" alt="QS Logo" class="summary-icon">
              <div class="summary-main">
                <div class="summary-badge">
                  <span class="pulse-dot"></span>
                  <span>{{ t.reqKiwi }}</span>
                </div>
                <h2>{{ t.step4TitleSummary }}</h2>
                <p class="text-secondary">
                  {{ t.kiwiDesc }}
                </p>
              </div>
            </div>
            <div class="summary-actions">
              <a [href]="kiwiPlayStoreUrl" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a1.597 1.597 0 0 1-.22-.843V2.657c0-.317.078-.612.219-.843zm11.235 11.238l2.569-2.57-11.83-6.83 9.261 9.4zm0 1.896l-9.26 9.4 11.829-6.83-2.569-2.57zm1.053-1.053l2.844 1.642a1.6 1.6 0 0 0 1.604 0l-4.448-2.57 4.448-2.57a1.6 1.6 0 0 0-1.604 0l-2.844 1.642z"/></svg>
                <span>{{ t.getKiwi }}</span>
              </a>
              <button class="btn btn-outline" type="button" (click)="copyLink($event)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                <span>{{ copied() ? t.copied : t.copyLink }}</span>
              </button>
            </div>
          </div>

          <!-- Why Kiwi Browser compare strip -->
          <div class="compare-strip glass">
            <div class="compare-col compare-bad">
              <div class="compare-head">
                <span class="compare-dot"></span>
                <span>{{ t.chromeAndroid }}</span>
              </div>
              <div class="compare-row"><span class="mark bad">✕</span>{{ t.noExt }}</div>
              <div class="compare-row"><span class="mark bad">✕</span>{{ t.noStore }}</div>
            </div>
            <div class="compare-vs"><span>{{ t.vs }}</span></div>
            <div class="compare-col compare-good">
              <div class="compare-head">
                <span class="compare-dot good"></span>
                <span>Kiwi Browser</span>
              </div>
              <div class="compare-row"><span class="mark good">✓</span>{{ t.fullStore }}</div>
              <div class="compare-row"><span class="mark good">✓</span>{{ t.sameEngine }}</div>
            </div>
          </div>

          <!-- Chronological Step Cards -->
          <div class="flow-steps">
            <!-- STEP 1 -->
            <div class="flow-card glass">
              <div class="flow-side">
                <span class="flow-num">1</span>
                <span class="flow-line"></span>
              </div>
              <div class="flow-body">
                <div class="flow-header">
                  <h3>{{ t.step1Title }}</h3>
                  <span class="flow-tag">{{ t.step1 }}</span>
                </div>
                <p class="text-secondary">
                  {{ t.step1Desc }}
                </p>
                <div class="flow-box">
                  <div class="app-row">
                    <div class="app-icon-wrap">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                    </div>
                    <div class="app-meta">
                      <strong>Kiwi Browser — Fast & Quiet</strong>
                      <span>Geometry Mobile · 4.4★</span>
                    </div>
                    <a [href]="kiwiPlayStoreUrl" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary">
                      {{ t.install }}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- STEP 2 -->
            <div class="flow-card glass">
              <div class="flow-side">
                <span class="flow-num">2</span>
                <span class="flow-line"></span>
              </div>
              <div class="flow-body">
                <div class="flow-header">
                  <h3>{{ t.step2Title }}</h3>
                  <span class="flow-tag">{{ t.step2 }}</span>
                </div>
                <p class="text-secondary">
                  {{ t.step2Desc }}
                </p>
                <div class="flow-box mini-browser">
                  <div class="mini-browser-bar">
                    <span class="mb-dot"></span>
                    <span class="mb-dot"></span>
                    <span class="mb-dot"></span>
                    <div class="mb-url">{{ storeUrl }}</div>
                  </div>
                  <div class="mini-browser-body">
                    <div class="mb-store-row">
                      <img src="/logo.svg" alt="QS Logo" class="mb-store-icon">
                      <div class="mb-store-meta">
                        <strong>QuizSolver — AI Quiz Solver</strong>
                        <span>chrome.google.com/webstore</span>
                      </div>
                      <span class="mb-add-btn">{{ t.addToChrome }}</span>
                    </div>
                  </div>
                </div>
                <div class="url-buttons">
                  <button class="btn btn-sm btn-outline" type="button" (click)="copyLink($event)">
                    {{ copied() ? t.copiedShort : t.copyLinkShort }}
                  </button>
                  <a [href]="storeUrl" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary">
                    {{ t.openStore }}
                  </a>
                </div>
              </div>
            </div>

            <!-- STEP 3 -->
            <div class="flow-card glass">
              <div class="flow-side">
                <span class="flow-num">3</span>
                <span class="flow-line"></span>
              </div>
              <div class="flow-body">
                <div class="flow-header">
                  <h3>{{ t.step3Title }}</h3>
                  <span class="flow-tag">{{ t.step3 }}</span>
                </div>
                <p class="text-secondary">
                  {{ t.step3Desc }}
                </p>
                <div class="flow-box mini-browser">
                  <div class="mini-browser-bar">
                    <span class="mb-dot"></span>
                    <span class="mb-dot"></span>
                    <span class="mb-dot"></span>
                    <div class="mb-url">testportal.pl/test/8842</div>
                    <span class="mb-menu-dots">⋮</span>
                  </div>
                  <div class="menu-snippet">
                    <div class="menu-row muted">
                      <span>{{ t.newTab }}</span>
                    </div>
                    <div class="menu-row muted">
                      <span>{{ t.settings }}</span>
                    </div>
                    <div class="menu-divider"></div>
                    <div class="menu-row highlight">
                      <img src="/logo.svg" alt="QS Logo" class="qs-badge-icon">
                      <strong>{{ t.qsTitle }}</strong>
                      <span class="badge-ready">{{ t.active }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- STEP 4 -->
            <div class="flow-card glass">
              <div class="flow-side">
                <span class="flow-num flow-num-final">4</span>
              </div>
              <div class="flow-body">
                <div class="flow-header">
                  <h3>{{ t.step4Title }}</h3>
                  <span class="flow-tag">{{ t.step4 }}</span>
                </div>
                <p class="text-secondary">
                  {{ t.step4Desc }}
                </p>
                <div class="platform-chips">
                  <span class="chip">Testportal</span>
                  <span class="chip">Google Forms</span>
                  <span class="chip">Moodle</span>
                  <span class="chip">Canvas</span>
                  <span class="chip">Kahoot</span>
                  <span class="chip">Quizizz</span>
                </div>
                <div class="flow-box quiz-box">
                  <div class="quiz-tip">
                    <span class="quiz-check">✓</span>
                    <div>
                      <strong>{{ t.worksSame }}</strong>
                      <span class="text-secondary">{{ t.worksSameDesc }}</span>
                    </div>
                  </div>
                  <div class="quiz-cta">
                    <a [href]="pathFor('demo', locale)" class="btn btn-sm btn-outline">
                      {{ t.tryDemo }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Feature grid -->
          <div class="feature-grid">
            <div class="feature-item">
              <div class="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.5" fill="currentColor"/></svg>
              </div>
              <strong>{{ t.feat1Title }}</strong>
              <span>{{ t.feat1Desc }}</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/></svg>
              </div>
              <strong>{{ t.feat2Title }}</strong>
              <span>{{ t.feat2Desc }}</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4M12 2a6 6 0 00-4 10.5c.6.5 1 1.3 1 2.1V16h6v-1.4c0-.8.4-1.6 1-2.1A6 6 0 0012 2z"/></svg>
              </div>
              <strong>{{ t.feat3Title }}</strong>
              <span>{{ t.feat3Desc }}</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v5h5M3.05 13a9 9 0 106.16-8.44"/><path d="M12 7v5l3 2"/></svg>
              </div>
              <strong>{{ t.feat4Title }}</strong>
              <span>{{ t.feat4Desc }}</span>
            </div>
          </div>
        </section>

        <!-- IOS FLOW -->
        <section class="install-flow" *ngIf="os === 'ios'">
          <div class="ios-wrapper">
            <div class="ios-header text-center">
              <h2>{{ t.iosTitle }}</h2>
              <p class="text-secondary">
                {{ t.iosDesc }}
              </p>
            </div>

            <!-- Phone Frame -->
            <div class="phone-mockup">
              <div class="phone-bezel">
                <div class="phone-notch"></div>
                <div class="phone-screen">
                  <iframe
                    src="https://www.youtube-nocookie.com/embed/2YHPMk_xHAs"
                    title="QuizSolver iOS Setup"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen>
                  </iframe>
                </div>
              </div>
            </div>

            <div class="ios-actions text-center">
              <a href="https://youtube.com/shorts/2YHPMk_xHAs" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                <span>{{ t.iosBtn }}</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </qs-shell>
  `,
  styles: [`
    .mobile-install-page {
      padding-bottom: 6rem;
    }
    .utility-hero {
      padding: 4.5rem 0 2.5rem;
    }
    .text-center { text-align: center; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .hero-title {
      font-size: clamp(2.2rem, 5vw, 3.2rem);
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-top: 0.6rem;
    }
    .hero-subtitle {
      font-size: 1.15rem;
      margin: 1rem auto 2rem;
      max-width: 44rem;
      line-height: 1.6;
    }

    /* OS Toggle Selector */
    .os-selector {
      display: inline-flex;
      background: rgba(255, 255, 255, 0.04);
      padding: 0.4rem;
      border-radius: 16px;
      border: 1px solid var(--border);
      gap: 0.5rem;
    }
    .os-btn {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.75rem 1.75rem;
      border-radius: 12px;
      background: transparent;
      color: var(--text-secondary);
      border: 1px solid transparent;
      transition: all 0.25s var(--ease-out);
      cursor: pointer;
    }
    .os-btn svg {
      transition: transform 0.2s;
    }
    .os-btn-content {
      display: flex;
      flex-direction: column;
      text-align: left;
    }
    .os-btn-content strong {
      font-size: 0.95rem;
      color: var(--text-primary);
    }
    .os-btn-content span {
      font-size: 0.75rem;
      color: var(--text-tertiary);
    }
    .os-btn:hover {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-primary);
    }
    .os-btn.active {
      background: var(--bg-surface-solid);
      border-color: var(--accent-cyan);
      box-shadow: 0 4px 20px rgba(14, 165, 233, 0.15);
      color: var(--text-primary);
    }
    .os-btn.active svg {
      color: var(--accent-cyan);
      transform: scale(1.05);
    }

    /* Main Container */
    .install-flow {
      max-width: 820px;
      margin: 0 auto;
    }

    /* Trust bar */
    .trust-bar {
      display: flex;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }
    .trust-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.4rem 0.9rem;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border);
      color: var(--text-secondary);
      font-size: 0.8rem;
      font-weight: 600;
    }
    .trust-pill svg {
      color: #34d399;
      flex-shrink: 0;
    }

    /* Summary Card */
    .summary-card {
      padding: 2rem;
      border-radius: 20px;
      margin-bottom: 1.75rem;
      border: 1px solid rgba(14, 165, 233, 0.25);
      background: linear-gradient(135deg, rgba(14, 165, 233, 0.06), rgba(124, 92, 252, 0.04));
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .summary-top {
      display: flex;
      gap: 1.25rem;
      align-items: flex-start;
    }
    .summary-icon {
      flex-shrink: 0;
      width: 52px;
      height: 52px;
      border-radius: 14px;
      object-fit: contain;
      box-shadow: 0 6px 22px rgba(14, 165, 233, 0.35);
    }
    .summary-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--accent-cyan);
      margin-bottom: 0.5rem;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent-cyan);
      box-shadow: 0 0 10px var(--accent-cyan);
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }
    .summary-main h2 {
      font-size: 1.45rem;
      margin-bottom: 0.5rem;
    }
    .summary-main p {
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.6;
    }
    .summary-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    /* Compare strip */
    .compare-strip {
      display: flex;
      align-items: stretch;
      gap: 0;
      border-radius: 18px;
      border: 1px solid var(--border);
      margin-bottom: 2.5rem;
      overflow: hidden;
    }
    .compare-col {
      flex: 1;
      padding: 1.5rem 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }
    .compare-bad {
      background: rgba(248, 113, 113, 0.04);
    }
    .compare-good {
      background: rgba(52, 211, 153, 0.05);
    }
    .compare-head {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 700;
      font-size: 0.9rem;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }
    .compare-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #f87171;
      flex-shrink: 0;
    }
    .compare-dot.good {
      background: #34d399;
    }
    .compare-row {
      display: flex;
      align-items: flex-start;
      gap: 0.6rem;
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.4;
    }
    .mark {
      flex-shrink: 0;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: 900;
      margin-top: 0.05rem;
    }
    .mark.bad {
      background: rgba(248, 113, 113, 0.15);
      color: #f87171;
    }
    .mark.good {
      background: rgba(52, 211, 153, 0.18);
      color: #34d399;
    }
    .compare-vs {
      flex-shrink: 0;
      width: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-surface-solid);
      border-left: 1px solid var(--border);
      border-right: 1px solid var(--border);
    }
    .compare-vs span {
      font-size: 0.7rem;
      font-weight: 900;
      letter-spacing: 0.05em;
      color: var(--text-tertiary);
      writing-mode: vertical-rl;
    }

    /* Timeline Stepper */
    .flow-steps {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .flow-card {
      display: flex;
      padding: 1.75rem 2rem;
      border-radius: 18px;
      gap: 1.75rem;
      border: 1px solid var(--border);
      transition: border-color 0.25s var(--ease-out), transform 0.25s var(--ease-out), box-shadow 0.25s var(--ease-out);
    }
    .flow-card:hover {
      border-color: rgba(14, 165, 233, 0.35);
      transform: translateY(-2px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
    }
    .flow-side {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }
    .flow-num {
      width: 38px;
      height: 38px;
      border-radius: 11px;
      background: linear-gradient(135deg, rgba(14, 165, 233, 0.18), rgba(124, 92, 252, 0.14));
      border: 1px solid rgba(14, 165, 233, 0.35);
      color: var(--accent-cyan);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 0.95rem;
      flex-shrink: 0;
    }
    .flow-num-final {
      background: linear-gradient(135deg, rgba(52, 211, 153, 0.22), rgba(14, 165, 233, 0.14));
      border-color: rgba(52, 211, 153, 0.4);
      color: #34d399;
    }
    .flow-line {
      width: 2px;
      flex: 1;
      background: linear-gradient(to bottom, rgba(14, 165, 233, 0.3), transparent);
      min-height: 30px;
    }
    .flow-body {
      flex: 1;
      min-width: 0;
    }
    .flow-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }
    .flow-header h3 {
      font-size: 1.2rem;
      margin: 0;
      color: var(--text-primary);
    }
    .flow-tag {
      flex-shrink: 0;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .flow-body > p {
      font-size: 0.925rem;
      line-height: 1.55;
      margin-bottom: 1.25rem;
    }

    /* Step content boxes */
    .flow-box {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1rem 1.25rem;
    }
    .app-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }
    .app-icon-wrap {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: rgba(14, 165, 233, 0.12);
      color: var(--accent-cyan);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .app-meta {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .app-meta strong {
      font-size: 0.95rem;
    }
    .app-meta span {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }

    /* Mini browser mockup (used in steps 2 & 3) */
    .mini-browser {
      padding: 0;
      overflow: hidden;
    }
    .mini-browser-bar {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.6rem 0.85rem;
      background: rgba(255, 255, 255, 0.03);
      border-bottom: 1px solid var(--border);
    }
    .mb-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--text-tertiary);
      opacity: 0.4;
      flex-shrink: 0;
    }
    .mb-url {
      flex: 1;
      margin-left: 0.5rem;
      font-family: monospace;
      font-size: 0.72rem;
      color: var(--text-secondary);
      background: rgba(0, 0, 0, 0.35);
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .mb-menu-dots {
      color: var(--text-tertiary);
      font-weight: 900;
      padding: 0 0.2rem;
      flex-shrink: 0;
    }
    .mini-browser-body {
      padding: 1rem 1.1rem;
    }
    .mb-store-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .mb-store-icon {
      width: 34px;
      height: 34px;
      border-radius: 9px;
      object-fit: contain;
      flex-shrink: 0;
    }
    .mb-store-meta {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 120px;
    }
    .mb-store-meta strong {
      font-size: 0.88rem;
    }
    .mb-store-meta span {
      font-size: 0.72rem;
      color: var(--text-tertiary);
    }
    .mb-add-btn {
      font-size: 0.75rem;
      font-weight: 700;
      color: #030712;
      background: var(--accent-cyan);
      padding: 0.4rem 0.9rem;
      border-radius: 8px;
      flex-shrink: 0;
    }

    .url-buttons {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-top: 0.85rem;
    }

    .menu-snippet {
      display: flex;
      flex-direction: column;
      font-size: 0.825rem;
      padding: 0.75rem 1.1rem 1rem;
    }
    .menu-row {
      padding: 0.35rem 0;
      color: var(--text-secondary);
    }
    .menu-row.muted {
      opacity: 0.5;
    }
    .menu-divider {
      height: 1px;
      background: var(--border);
      margin: 0.4rem 0;
    }
    .menu-row.highlight {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      background: rgba(14, 165, 233, 0.12);
      border: 1px solid rgba(14, 165, 233, 0.3);
      padding: 0.6rem 0.85rem;
      border-radius: 8px;
      color: var(--text-primary);
    }
    .qs-badge-icon {
      width: 22px;
      height: 22px;
      border-radius: 4px;
      object-fit: contain;
    }
    .badge-ready {
      margin-left: auto;
      font-size: 0.65rem;
      font-weight: 800;
      background: rgba(52, 211, 153, 0.15);
      border: 1px solid rgba(52, 211, 153, 0.35);
      color: #34d399;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
    }

    /* Platform chips (step 4) */
    .platform-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.1rem;
    }
    .chip {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-secondary);
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border);
      padding: 0.3rem 0.75rem;
      border-radius: 999px;
    }

    .quiz-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.25rem;
      flex-wrap: wrap;
    }
    .quiz-tip {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      flex: 1;
      min-width: 240px;
    }
    .quiz-check {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: rgba(52, 211, 153, 0.2);
      color: #34d399;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: 900;
      flex-shrink: 0;
      margin-top: 0.1rem;
    }
    .quiz-tip strong {
      display: block;
      font-size: 0.95rem;
      margin-bottom: 0.2rem;
    }
    .quiz-tip span {
      font-size: 0.85rem;
      line-height: 1.4;
    }

    /* Feature grid */
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-top: 2.5rem;
    }
    .feature-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1.35rem 1.15rem;
      border-radius: 14px;
      border: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.02);
      transition: border-color 0.2s var(--ease-out), transform 0.2s var(--ease-out);
    }
    .feature-item:hover {
      border-color: rgba(14, 165, 233, 0.35);
      transform: translateY(-2px);
    }
    .feature-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: rgba(14, 165, 233, 0.12);
      color: var(--accent-cyan);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.15rem;
    }
    .feature-item strong {
      font-size: 0.88rem;
      color: var(--text-primary);
    }
    .feature-item span {
      font-size: 0.78rem;
      line-height: 1.4;
      color: var(--text-secondary);
    }

    /* iOS Phone Frame */
    .ios-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }
    .ios-header h2 {
      font-size: 1.6rem;
      margin-bottom: 0.4rem;
    }
    .phone-mockup {
      width: 100%;
      display: flex;
      justify-content: center;
    }
    .phone-bezel {
      width: min(290px, 85vw);
      height: min(510px, 58vh);
      aspect-ratio: 9 / 16;
      background: #05070a;
      border: 2px solid rgba(255, 255, 255, 0.15);
      border-radius: 28px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.75), 0 0 30px rgba(14, 165, 233, 0.1);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .phone-notch {
      width: 70px;
      height: 16px;
      background: #000;
      border-radius: 0 0 10px 10px;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
    }
    .phone-screen {
      width: 100%;
      height: 100%;
      position: relative;
    }
    .phone-screen iframe {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }

    @media (max-width: 640px) {
      .os-selector {
        width: 100%;
        display: flex;
      }
      .os-btn {
        flex: 1;
        justify-content: center;
        padding: 0.65rem 0.75rem;
      }
      .trust-bar {
        gap: 0.5rem;
      }
      .summary-top {
        flex-direction: column;
      }
      .compare-strip {
        flex-direction: column;
      }
      .compare-vs {
        width: 100%;
        padding: 0.4rem 0;
        border-left: none;
        border-right: none;
        border-top: 1px solid var(--border);
        border-bottom: 1px solid var(--border);
      }
      .compare-vs span {
        writing-mode: horizontal-tb;
      }
      .flow-card {
        padding: 1.25rem;
        gap: 1rem;
      }
      .flow-side {
        display: none;
      }
      .app-row {
        flex-direction: column;
        align-items: stretch;
      }
      .mb-store-row {
        flex-direction: column;
        align-items: stretch;
        text-align: center;
      }
      .quiz-box {
        flex-direction: column;
        align-items: stretch;
      }
      .feature-grid {
        grid-template-columns: 1fr 1fr;
      }
    }
  `]
})
export class MobileInstallComponent implements OnInit {
  locale: Locale = 'en';
  c = contentFor(this.locale);
  data: any;
  os: 'android' | 'ios' = 'android';
  copied = signal(false);

  protected readonly pathFor = pathFor;
  protected readonly storeUrl = CHROME_WEB_STORE_URL;
  protected readonly kiwiPlayStoreUrl = 'https://play.google.com/store/apps/details?id=com.novabrowser.kiwiweb&pcampaignid=web_share';

  private route = inject(ActivatedRoute);
  private seo = inject(SeoService);
  private platformId = inject(PLATFORM_ID);

  get isPl(): boolean {
    return this.locale === 'pl';
  }

  get t() {
    const texts: Record<string, any> = {
      en: {
        eyebrow: 'Mobile Extension',
        title: 'QuizSolver on Your Phone',
        subtitle: 'Solve quizzes and tests directly from your smartphone. Choose your operating system below for step-by-step instructions.',
        trustFree: '100% free',
        trustTime: '~3 minutes',
        trustRoot: 'No root needed',
        reqKiwi: 'Requires Kiwi Browser',
        step4TitleSummary: 'Android Installation in 4 Steps',
        kiwiDesc: 'Standard Chrome on Android blocks extensions. The fix? Kiwi Browser — a fast browser built on Chromium that supports full Chrome Web Store extensions.',
        getKiwi: 'Get Kiwi Browser',
        copied: 'Copied Link!',
        copyLink: 'Copy Extension URL',
        copyLinkShort: 'Copy link',
        copiedShort: '✓ Copied',
        chromeAndroid: 'Android Chrome',
        noExt: 'No extension support',
        noStore: 'No Web Store access',
        vs: 'VS',
        fullStore: 'Full Chrome Web Store support',
        sameEngine: 'Same engine as Chrome — fast & stable',
        step1: 'Step 1',
        step1Title: 'Install Kiwi Browser from Google Play',
        step1Desc: 'Open Google Play on your phone and install the free Kiwi Browser application.',
        install: 'Install',
        step2: 'Step 2',
        step2Title: 'Open Chrome Web Store in Kiwi',
        step2Desc: 'Launch Kiwi Browser on your device, paste the extension URL into the address bar and tap "Add to Chrome".',
        addToChrome: 'Add to Chrome',
        openStore: 'Open Web Store',
        step3: 'Step 3',
        step3Title: 'Open Extension from the 3-Dots Menu',
        step3Desc: 'Tap the three dots (⋮) in the top-right corner of Kiwi and scroll to the bottom. Tap QuizSolver and log in with your email to access your credits.',
        step4: 'Ready',
        step4Title: 'Solve Quizzes Directly on Mobile',
        step4Desc: 'Open any quiz in Kiwi. Open Kiwi menu -> QuizSolver -> tap "Solve current page" or use FocusScan.',
        worksSame: 'Works exactly like the desktop version',
        worksSameDesc: 'Automatic detection, hint mode, FocusScan and study history are fully supported.',
        tryDemo: 'Try Free Demo',
        feat1Title: 'Auto question detection',
        feat1Desc: 'Finds quiz questions on the page automatically',
        feat2Title: 'FocusScan',
        feat2Desc: 'Scan and solve a selected part of the screen',
        feat3Title: 'Hint mode',
        feat3Desc: 'Gentle nudges instead of full answers',
        feat4Title: 'Question history',
        feat4Desc: 'Everything saved for exam revision',
        iosTitle: 'Video Tutorial for iOS (iPhone / iPad)',
        iosDesc: 'Watch this 40-second video demonstrating the setup process on Apple devices.',
        iosBtn: 'Open in YouTube app',
        newTab: 'New tab',
        settings: 'Settings',
        active: 'ACTIVE',
        qsTitle: 'QuizSolver — AI Quiz Solver'
      },
      pl: {
        eyebrow: 'Aplikacja Mobilna',
        title: 'QuizSolver na Twoim Telefonie',
        subtitle: 'Rozwiązuj testy, kolokwia i quizy bezpośrednio ze smartfona. Wybierz swój system, aby zobaczyć instrukcję instalacji krok po kroku.',
        trustFree: '100% za darmo',
        trustTime: '~3 minuty',
        trustRoot: 'Bez roota',
        reqKiwi: 'Wymaga Kiwi Browser',
        step4TitleSummary: 'Instalacja na Androidzie w 4 krokach',
        kiwiDesc: 'Standardowy mobilny Chrome nie pozwala instalować rozszerzeń. Rozwiązanie? Kiwi Browser — lekka przeglądarka na tym samym silniku Chromium, która obsługuje wtyczki z Chrome Web Store.',
        getKiwi: 'Pobierz Kiwi Browser',
        copied: 'Skopiowano link!',
        copyLink: 'Skopiuj link wtyczki',
        copyLinkShort: 'Kopiuj link',
        copiedShort: '✓ Skopiowano',
        chromeAndroid: 'Chrome na Androidzie',
        noExt: 'Nie obsługuje rozszerzeń',
        noStore: 'Brak dostępu do Web Store',
        vs: 'KONTRA',
        fullStore: 'Pełne wsparcie Chrome Web Store',
        sameEngine: 'Ten sam silnik co Chrome — szybka i stabilna',
        step1: 'Krok 1',
        step1Title: 'Pobierz Kiwi Browser z Google Play',
        step1Desc: 'Wejdź do sklepu Google Play na swoim telefonie i zainstaluj darmową przeglądarkę Kiwi Browser.',
        install: 'Zainstaluj',
        step2: 'Krok 2',
        step2Title: 'Otwórz Chrome Web Store wewnątrz Kiwi',
        step2Desc: 'Uruchom Kiwi Browser na telefonie, wklej link do paska adresu i kliknij niebieski przycisk „Dodaj do Chrome".',
        addToChrome: 'Dodaj do Chrome',
        openStore: 'Otwórz stronę wtyczki',
        step3: 'Krok 3',
        step3Title: 'Włącz wtyczkę z menu Kiwi (3 kropki)',
        step3Desc: 'Kliknij menu w prawym górnym rogu Kiwi (trzy kropki ⋮), zjedź na sam dół listy i stuknij QuizSolver. Zaloguj się tym samym adresem e-mail, aby mieć dostęp do swoich kredytów.',
        step4: 'Gotowe',
        step4Title: 'Rozwiązuj testy bezpośrednio na telefonie',
        step4Desc: 'Otwórz dowolny test w Kiwi. Otwórz menu Kiwi -> QuizSolver -> kliknij „Rozwiąż obecną stronę" lub użyj FocusScan.',
        worksSame: 'Wszystko działa dokładnie tak jak na komputerze',
        worksSameDesc: 'Wykrywanie pytań, tryb podpowiedzi, FocusScan i historia pytań są w 100% dostępne.',
        tryDemo: 'Przetestuj na darmowym Demo',
        feat1Title: 'Auto-wykrywanie pytań',
        feat1Desc: 'Wtyczka sama znajduje pytania na stronie',
        feat2Title: 'FocusScan',
        feat2Desc: 'Skanuj i rozwiązuj wybrany fragment ekranu',
        feat3Title: 'Tryb podpowiedzi',
        feat3Desc: 'Wskazówki zamiast gotowych odpowiedzi',
        feat4Title: 'Historia pytań',
        feat4Desc: 'Wszystko zapisane do nauki przed egzaminem',
        iosTitle: 'Wideo Poradnik dla iOS (iPhone / iPad)',
        iosDesc: 'Zobacz 40-sekundowe nagranie pokazujące instalację rozszerzenia na urządzeniach Apple.',
        iosBtn: 'Otwórz na YouTube',
        newTab: 'Nowa karta',
        settings: 'Ustawienia',
        active: 'AKTYWNY',
        qsTitle: 'QuizSolver — AI Quiz Solver'
      },
      de: {
        eyebrow: 'Mobile Erweiterung',
        title: 'QuizSolver auf Ihrem Handy',
        subtitle: 'Lösen Sie Tests und Quizze direkt von Ihrem Smartphone aus. Wählen Sie unten Ihr Betriebssystem für eine Schritt-für-Schritt-Anleitung.',
        trustFree: '100% kostenlos',
        trustTime: '~3 Minuten',
        trustRoot: 'Kein Root nötig',
        reqKiwi: 'Benötigt Kiwi Browser',
        step4TitleSummary: 'Android-Installation in 4 Schritten',
        kiwiDesc: 'Standard Chrome auf Android blockiert Erweiterungen. Die Lösung? Kiwi Browser — ein schneller Browser basierend auf Chromium, der alle Chrome Web Store-Erweiterungen unterstützt.',
        getKiwi: 'Kiwi Browser herunterladen',
        copied: 'Link kopiert!',
        copyLink: 'Erweiterungs-Link kopieren',
        copyLinkShort: 'Link kopieren',
        copiedShort: '✓ Kopiert',
        chromeAndroid: 'Android Chrome',
        noExt: 'Keine Erweiterungen unterstützt',
        noStore: 'Kein Web Store-Zugriff',
        vs: 'VS',
        fullStore: 'Volle Chrome Web Store-Unterstützung',
        sameEngine: 'Gleiche Engine wie Chrome — schnell & stabil',
        step1: 'Schritt 1',
        step1Title: 'Kiwi Browser bei Google Play installieren',
        step1Desc: 'Öffnen Sie Google Play auf Ihrem Telefon und installieren Sie die kostenlose Kiwi Browser App.',
        install: 'Installieren',
        step2: 'Schritt 2',
        step2Title: 'Chrome Web Store im Kiwi öffnen',
        step2Desc: 'Starten Sie den Kiwi Browser, fügen Sie die Erweiterungs-URL in die Adressleiste ein und tippen Sie auf "Hinzufügen".',
        addToChrome: 'Hinzufügen',
        openStore: 'Web Store öffnen',
        step3: 'Schritt 3',
        step3Title: 'Erweiterung über das 3-Punkte-Menü öffnen',
        step3Desc: 'Tippen Sie auf die drei Punkte (⋮) oben rechts im Kiwi und scrollen Sie nach unten. Tippen Sie auf QuizSolver und melden Sie sich an.',
        step4: 'Fertig',
        step4Title: 'Quizze direkt auf dem Handy lösen',
        step4Desc: 'Öffnen Sie ein beliebiges Quiz in Kiwi. Öffnen Sie das Kiwi-Menü -> QuizSolver -> tippen Sie auf "Aktuelle Seite lösen".',
        worksSame: 'Funktioniert genau wie die Desktop-Version',
        worksSameDesc: 'Automatische Erkennung, Hinweismodus, FocusScan und Lernhistorie werden voll unterstützt.',
        tryDemo: 'Kostenlose Demo testen',
        feat1Title: 'Automatische Fragenerkennung',
        feat1Desc: 'Findet Quizfragen automatisch auf der Seite',
        feat2Title: 'FocusScan',
        feat2Desc: 'Scannen und lösen Sie einen Teil des Bildschirms',
        feat3Title: 'Hinweis-Modus',
        feat3Desc: 'Sanfte Hinweise statt voller Antworten',
        feat4Title: 'Fragenverlauf',
        feat4Desc: 'Alles für die Prüfungswiederholung gespeichert',
        iosTitle: 'Video-Tutorial für iOS (iPhone / iPad)',
        iosDesc: 'Sehen Sie sich dieses 40-sekündige Video an, das die Einrichtung auf Apple-Geräten zeigt.',
        iosBtn: 'In YouTube-App öffnen',
        newTab: 'Neuer Tab',
        settings: 'Einstellungen',
        active: 'AKTIV',
        qsTitle: 'QuizSolver — AI Quiz Solver'
      },
      es: {
        eyebrow: 'Extensión móvil',
        title: 'QuizSolver en tu teléfono',
        subtitle: 'Resuelve cuestionarios y pruebas directamente desde tu teléfono inteligente. Elige tu sistema operativo para las instrucciones.',
        trustFree: '100% gratis',
        trustTime: '~3 minutos',
        trustRoot: 'Sin root',
        reqKiwi: 'Requiere Kiwi Browser',
        step4TitleSummary: 'Instalación en Android en 4 pasos',
        kiwiDesc: 'Chrome en Android bloquea las extensiones. ¿La solución? Kiwi Browser — un navegador basado en Chromium que admite extensiones del Chrome Web Store.',
        getKiwi: 'Obtener Kiwi Browser',
        copied: '¡Enlace copiado!',
        copyLink: 'Copiar enlace',
        copyLinkShort: 'Copiar enlace',
        copiedShort: '✓ Copiado',
        chromeAndroid: 'Chrome en Android',
        noExt: 'Sin soporte de extensiones',
        noStore: 'Sin acceso a Web Store',
        vs: 'VS',
        fullStore: 'Soporte completo de Web Store',
        sameEngine: 'Mismo motor que Chrome — rápido y estable',
        step1: 'Paso 1',
        step1Title: 'Instalar Kiwi Browser desde Google Play',
        step1Desc: 'Abre Google Play en tu teléfono e instala la aplicación gratuita Kiwi Browser.',
        install: 'Instalar',
        step2: 'Paso 2',
        step2Title: 'Abrir Chrome Web Store en Kiwi',
        step2Desc: 'Inicia Kiwi Browser, pega la URL de la extensión en la barra de direcciones y toca "Añadir a Chrome".',
        addToChrome: 'Añadir',
        openStore: 'Abrir Web Store',
        step3: 'Paso 3',
        step3Title: 'Abrir extensión desde el menú (3 puntos)',
        step3Desc: 'Toca los tres puntos (⋮) en la esquina superior derecha de Kiwi y desplázate hasta abajo. Toca QuizSolver e inicia sesión.',
        step4: 'Listo',
        step4Title: 'Resuelve cuestionarios en el móvil',
        step4Desc: 'Abre cualquier cuestionario en Kiwi. Menú Kiwi -> QuizSolver -> "Resolver página actual".',
        worksSame: 'Funciona exactamente como en PC',
        worksSameDesc: 'Detección automática, modo pistas, FocusScan e historial de estudio.',
        tryDemo: 'Probar demostración',
        feat1Title: 'Detección automática',
        feat1Desc: 'Encuentra las preguntas de la página',
        feat2Title: 'FocusScan',
        feat2Desc: 'Escanea y resuelve una parte de la pantalla',
        feat3Title: 'Modo pistas',
        feat3Desc: 'Sutiles pistas en lugar de respuestas',
        feat4Title: 'Historial de preguntas',
        feat4Desc: 'Todo guardado para el examen',
        iosTitle: 'Tutorial en video para iOS (iPhone / iPad)',
        iosDesc: 'Mira este video de 40 segundos que demuestra el proceso en dispositivos Apple.',
        iosBtn: 'Abrir en YouTube',
        newTab: 'Nueva pestaña',
        settings: 'Configuración',
        active: 'ACTIVO',
        qsTitle: 'QuizSolver — AI Quiz Solver'
      },
      fr: {
        eyebrow: 'Extension Mobile',
        title: 'QuizSolver sur votre téléphone',
        subtitle: 'Résolvez des quiz et des tests depuis votre smartphone. Choisissez votre système d\'exploitation ci-dessous.',
        trustFree: '100% gratuit',
        trustTime: '~3 minutes',
        trustRoot: 'Pas de root',
        reqKiwi: 'Kiwi Browser requis',
        step4TitleSummary: 'Installation Android en 4 étapes',
        kiwiDesc: 'Chrome sur Android bloque les extensions. La solution ? Kiwi Browser — un navigateur basé sur Chromium qui supporte le Chrome Web Store.',
        getKiwi: 'Télécharger Kiwi Browser',
        copied: 'Lien copié !',
        copyLink: 'Copier le lien',
        copyLinkShort: 'Copier le lien',
        copiedShort: '✓ Copié',
        chromeAndroid: 'Chrome Android',
        noExt: 'Pas d\'extensions',
        noStore: 'Pas de Web Store',
        vs: 'VS',
        fullStore: 'Support complet du Web Store',
        sameEngine: 'Même moteur que Chrome — rapide & stable',
        step1: 'Étape 1',
        step1Title: 'Installer Kiwi Browser (Google Play)',
        step1Desc: 'Ouvrez Google Play sur votre téléphone et installez l\'application gratuite Kiwi Browser.',
        install: 'Installer',
        step2: 'Étape 2',
        step2Title: 'Ouvrir le Web Store dans Kiwi',
        step2Desc: 'Lancez Kiwi Browser, collez l\'URL de l\'extension dans la barre d\'adresse et appuyez sur "Ajouter à Chrome".',
        addToChrome: 'Ajouter',
        openStore: 'Ouvrir le Web Store',
        step3: 'Étape 3',
        step3Title: 'Ouvrir l\'extension (Menu ⋮)',
        step3Desc: 'Appuyez sur les trois points (⋮) en haut à droite de Kiwi, descendez tout en bas. Appuyez sur QuizSolver et connectez-vous.',
        step4: 'Prêt',
        step4Title: 'Résolvez des quiz sur mobile',
        step4Desc: 'Ouvrez un quiz dans Kiwi. Menu Kiwi -> QuizSolver -> "Résoudre la page".',
        worksSame: 'Fonctionne comme sur ordinateur',
        worksSameDesc: 'Détection automatique, mode indice, FocusScan et historique de révision.',
        tryDemo: 'Essayer la démo',
        feat1Title: 'Détection automatique',
        feat1Desc: 'Trouve les questions automatiquement',
        feat2Title: 'FocusScan',
        feat2Desc: 'Analysez et résolvez une partie de l\'écran',
        feat3Title: 'Mode indice',
        feat3Desc: 'Des indices au lieu des réponses complètes',
        feat4Title: 'Historique des questions',
        feat4Desc: 'Tout est sauvegardé pour vos révisions',
        iosTitle: 'Tutoriel vidéo pour iOS (iPhone / iPad)',
        iosDesc: 'Regardez cette vidéo de 40 secondes expliquant la configuration sur les appareils Apple.',
        iosBtn: 'Ouvrir dans YouTube',
        newTab: 'Nouvel onglet',
        settings: 'Paramètres',
        active: 'ACTIF',
        qsTitle: 'QuizSolver — AI Quiz Solver'
      },
      it: {
        eyebrow: 'Estensione Mobile',
        title: 'QuizSolver sul tuo telefono',
        subtitle: 'Risolvi quiz e test direttamente dallo smartphone. Scegli il tuo sistema operativo per le istruzioni.',
        trustFree: '100% gratis',
        trustTime: '~3 minuti',
        trustRoot: 'Nessun root',
        reqKiwi: 'Richiede Kiwi Browser',
        step4TitleSummary: 'Installazione Android in 4 passi',
        kiwiDesc: 'Chrome su Android blocca le estensioni. La soluzione? Kiwi Browser — un browser basato su Chromium che supporta il Chrome Web Store.',
        getKiwi: 'Scarica Kiwi Browser',
        copied: 'Link copiato!',
        copyLink: 'Copia link',
        copyLinkShort: 'Copia link',
        copiedShort: '✓ Copiato',
        chromeAndroid: 'Android Chrome',
        noExt: 'Nessuna estensione',
        noStore: 'Nessun Web Store',
        vs: 'VS',
        fullStore: 'Supporto completo Web Store',
        sameEngine: 'Stesso motore di Chrome — veloce',
        step1: 'Passo 1',
        step1Title: 'Installa Kiwi Browser da Google Play',
        step1Desc: 'Apri Google Play sul telefono e installa l\'app gratuita Kiwi Browser.',
        install: 'Installa',
        step2: 'Passo 2',
        step2Title: 'Apri Chrome Web Store in Kiwi',
        step2Desc: 'Avvia Kiwi Browser, incolla l\'URL dell\'estensione e tocca "Aggiungi a Chrome".',
        addToChrome: 'Aggiungi',
        openStore: 'Apri Web Store',
        step3: 'Passo 3',
        step3Title: 'Apri l\'estensione dal menu (⋮)',
        step3Desc: 'Tocca i tre puntini (⋮) in alto a destra su Kiwi e scorri in basso. Tocca QuizSolver e accedi.',
        step4: 'Pronto',
        step4Title: 'Risolvi i quiz sul cellulare',
        step4Desc: 'Apri qualsiasi quiz in Kiwi. Menu Kiwi -> QuizSolver -> tocca "Risolvi pagina".',
        worksSame: 'Funziona esattamente come su PC',
        worksSameDesc: 'Rilevamento automatico, modalità suggerimento, FocusScan e cronologia studio.',
        tryDemo: 'Prova la Demo',
        feat1Title: 'Rilevamento automatico',
        feat1Desc: 'Trova le domande automaticamente',
        feat2Title: 'FocusScan',
        feat2Desc: 'Scansiona e risolvi una parte dello schermo',
        feat3Title: 'Modalità Suggerimento',
        feat3Desc: 'Piccoli aiuti al posto delle risposte',
        feat4Title: 'Cronologia domande',
        feat4Desc: 'Tutto salvato per il ripasso',
        iosTitle: 'Video Tutorial per iOS (iPhone / iPad)',
        iosDesc: 'Guarda questo video di 40 secondi che mostra l\'installazione sui dispositivi Apple.',
        iosBtn: 'Apri in YouTube',
        newTab: 'Nuova scheda',
        settings: 'Impostazioni',
        active: 'ATTIVO',
        qsTitle: 'QuizSolver — AI Quiz Solver'
      },
      uk: {
        eyebrow: 'Мобільне розширення',
        title: 'QuizSolver на вашому телефоні',
        subtitle: 'Вирішуйте тести та вікторини прямо зі смартфона. Виберіть операційну систему нижче.',
        trustFree: '100% безкоштовно',
        trustTime: '~3 хвилини',
        trustRoot: 'Root не потрібен',
        reqKiwi: 'Потрібен Kiwi Browser',
        step4TitleSummary: 'Встановлення на Android за 4 кроки',
        kiwiDesc: 'Стандартний Chrome на Android блокує розширення. Рішення? Kiwi Browser — швидкий браузер, який підтримує Chrome Web Store.',
        getKiwi: 'Завантажити Kiwi Browser',
        copied: 'Посилання скопійовано!',
        copyLink: 'Копіювати посилання',
        copyLinkShort: 'Копіювати',
        copiedShort: '✓ Скопійовано',
        chromeAndroid: 'Android Chrome',
        noExt: 'Немає розширень',
        noStore: 'Немає доступу до Web Store',
        vs: 'ПРОТИ',
        fullStore: 'Повна підтримка Chrome Web Store',
        sameEngine: 'Той самий рушій, що й у Chrome',
        step1: 'Крок 1',
        step1Title: 'Встановіть Kiwi Browser з Google Play',
        step1Desc: 'Відкрийте Google Play на своєму телефоні та встановіть безкоштовний Kiwi Browser.',
        install: 'Встановити',
        step2: 'Крок 2',
        step2Title: 'Відкрийте Chrome Web Store в Kiwi',
        step2Desc: 'Запустіть Kiwi Browser, вставте URL-адресу розширення та натисніть "Додати".',
        addToChrome: 'Додати',
        openStore: 'Відкрити Web Store',
        step3: 'Крок 3',
        step3Title: 'Відкрийте розширення з меню (⋮)',
        step3Desc: 'Натисніть на три крапки (⋮) у верхньому правому куті Kiwi. Натисніть QuizSolver та увійдіть.',
        step4: 'Готово',
        step4Title: 'Вирішуйте тести на мобільному',
        step4Desc: 'Відкрийте будь-який тест у Kiwi. Меню Kiwi -> QuizSolver -> натисніть "Вирішити сторінку".',
        worksSame: 'Працює так само, як і на ПК',
        worksSameDesc: 'Автоматичне виявлення, режим підказок, FocusScan та історія навчання.',
        tryDemo: 'Спробувати демо',
        feat1Title: 'Авто-виявлення питань',
        feat1Desc: 'Знаходить питання на сторінці',
        feat2Title: 'FocusScan',
        feat2Desc: 'Сканує та вирішує частину екрана',
        feat3Title: 'Режим підказок',
        feat3Desc: 'Підказки замість повних відповідей',
        feat4Title: 'Історія питань',
        feat4Desc: 'Все збережено для повторення',
        iosTitle: 'Відео-інструкція для iOS (iPhone / iPad)',
        iosDesc: 'Перегляньте це 40-секундне відео, що демонструє налаштування на пристроях Apple.',
        iosBtn: 'Відкрити в YouTube',
        newTab: 'Нова вкладка',
        settings: 'Налаштування',
        active: 'АКТИВНИЙ',
        qsTitle: 'QuizSolver — AI Quiz Solver'
      }
    };
    return texts[this.locale] || texts['en'];
  }

  copyLink(e?: Event) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.storeUrl);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2500);
    }
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