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
          <span class="eyebrow">{{ isPl ? 'Aplikacja Mobilna' : 'Mobile Extension' }}</span>
          <h1 class="hero-title">{{ isPl ? 'QuizSolver na Twoim Telefonie' : 'QuizSolver on Your Phone' }}</h1>
          <p class="hero-subtitle text-secondary mx-auto">
            {{ isPl ? 'Rozwiązuj testy, kolokwia i quizy bezpośrednio ze smartfona. Wybierz swój system, aby zobaczyć instrukcję instalacji krok po kroku.' : 'Solve quizzes and tests directly from your smartphone. Choose your operating system below for step-by-step instructions.' }}
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
              <span>{{ isPl ? '100% za darmo' : '100% free' }}</span>
            </div>
            <div class="trust-pill">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>
              <span>{{ isPl ? '~3 minuty' : '~3 minutes' }}</span>
            </div>
            <div class="trust-pill">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z"/></svg>
              <span>{{ isPl ? 'Bez roota' : 'No root needed' }}</span>
            </div>
          </div>

          <!-- Quick summary banner -->
          <div class="summary-card glass">
            <div class="summary-top">
              <div class="summary-icon">QS</div>
              <div class="summary-main">
                <div class="summary-badge">
                  <span class="pulse-dot"></span>
                  <span>{{ isPl ? 'Wymaga Kiwi Browser' : 'Requires Kiwi Browser' }}</span>
                </div>
                <h2>{{ isPl ? 'Instalacja na Androidzie w 4 krokach' : 'Android Installation in 4 Steps' }}</h2>
                <p class="text-secondary">
                  {{ isPl
                    ? 'Standardowy mobilny Chrome nie pozwala instalować rozszerzeń. Rozwiązanie? Kiwi Browser — lekka przeglądarka na tym samym silniku Chromium, która obsługuje wtyczki z Chrome Web Store.'
                    : 'Standard Chrome on Android blocks extensions. The fix? Kiwi Browser — a fast browser built on Chromium that supports full Chrome Web Store extensions.' }}
                </p>
              </div>
            </div>
            <div class="summary-actions">
              <a [href]="kiwiPlayStoreUrl" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a1.597 1.597 0 0 1-.22-.843V2.657c0-.317.078-.612.219-.843zm11.235 11.238l2.569-2.57-11.83-6.83 9.261 9.4zm0 1.896l-9.26 9.4 11.829-6.83-2.569-2.57zm1.053-1.053l2.844 1.642a1.6 1.6 0 0 0 1.604 0l-4.448-2.57 4.448-2.57a1.6 1.6 0 0 0-1.604 0l-2.844 1.642z"/></svg>
                <span>{{ isPl ? 'Pobierz Kiwi Browser' : 'Get Kiwi Browser' }}</span>
              </a>
              <button class="btn btn-outline" type="button" (click)="copyLink($event)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                <span>{{ copied() ? (isPl ? 'Skopiowano link!' : 'Copied Link!') : (isPl ? 'Skopiuj link wtyczki' : 'Copy Extension URL') }}</span>
              </button>
            </div>
          </div>

          <!-- Why Kiwi Browser compare strip -->
          <div class="compare-strip glass">
            <div class="compare-col compare-bad">
              <div class="compare-head">
                <span class="compare-dot"></span>
                <span>{{ isPl ? 'Chrome na Androidzie' : 'Android Chrome' }}</span>
              </div>
              <div class="compare-row"><span class="mark bad">✕</span>{{ isPl ? 'Nie obsługuje rozszerzeń' : 'No extension support' }}</div>
              <div class="compare-row"><span class="mark bad">✕</span>{{ isPl ? 'Brak dostępu do Web Store' : 'No Web Store access' }}</div>
            </div>
            <div class="compare-vs"><span>{{ isPl ? 'KONTRA' : 'VS' }}</span></div>
            <div class="compare-col compare-good">
              <div class="compare-head">
                <span class="compare-dot good"></span>
                <span>Kiwi Browser</span>
              </div>
              <div class="compare-row"><span class="mark good">✓</span>{{ isPl ? 'Pełne wsparcie Chrome Web Store' : 'Full Chrome Web Store support' }}</div>
              <div class="compare-row"><span class="mark good">✓</span>{{ isPl ? 'Ten sam silnik co Chrome — szybka i stabilna' : 'Same engine as Chrome — fast & stable' }}</div>
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
                  <h3>{{ isPl ? 'Pobierz Kiwi Browser z Google Play' : 'Install Kiwi Browser from Google Play' }}</h3>
                  <span class="flow-tag">{{ isPl ? 'Krok 1' : 'Step 1' }}</span>
                </div>
                <p class="text-secondary">
                  {{ isPl
                    ? 'Wejdź do sklepu Google Play na swoim telefonie i zainstaluj darmową przeglądarkę Kiwi Browser.'
                    : 'Open Google Play on your phone and install the free Kiwi Browser application.' }}
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
                      {{ isPl ? 'Zainstaluj' : 'Install' }}
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
                  <h3>{{ isPl ? 'Otwórz Chrome Web Store wewnątrz Kiwi' : 'Open Chrome Web Store in Kiwi' }}</h3>
                  <span class="flow-tag">{{ isPl ? 'Krok 2' : 'Step 2' }}</span>
                </div>
                <p class="text-secondary">
                  {{ isPl
                    ? 'Uruchom Kiwi Browser na telefonie, wklej link do paska adresu i kliknij niebieski przycisk „Dodaj do Chrome".'
                    : 'Launch Kiwi Browser on your device, paste the extension URL into the address bar and tap "Add to Chrome".' }}
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
                      <div class="mb-store-icon">QS</div>
                      <div class="mb-store-meta">
                        <strong>QuizSolver — AI Quiz Solver</strong>
                        <span>chrome.google.com/webstore</span>
                      </div>
                      <span class="mb-add-btn">{{ isPl ? 'Dodaj do Chrome' : 'Add to Chrome' }}</span>
                    </div>
                  </div>
                </div>
                <div class="url-buttons">
                  <button class="btn btn-sm btn-outline" type="button" (click)="copyLink($event)">
                    {{ copied() ? (isPl ? '✓ Skopiowano' : '✓ Copied') : (isPl ? 'Kopiuj link' : 'Copy link') }}
                  </button>
                  <a [href]="storeUrl" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary">
                    {{ isPl ? 'Otwórz stronę wtyczki' : 'Open Web Store' }}
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
                  <h3>{{ isPl ? 'Włącz wtyczkę z menu Kiwi (3 kropki)' : 'Open Extension from the 3-Dots Menu' }}</h3>
                  <span class="flow-tag">{{ isPl ? 'Krok 3' : 'Step 3' }}</span>
                </div>
                <p class="text-secondary">
                  {{ isPl
                    ? 'Kliknij menu w prawym górnym rogu Kiwi (trzy kropki ⋮), zjedź na sam dół listy i stuknij QuizSolver. Zaloguj się tym samym adresem e-mail, aby mieć dostęp do swoich kredytów.'
                    : 'Tap the three dots (⋮) in the top-right corner of Kiwi and scroll to the bottom. Tap QuizSolver and log in with your email to access your credits.' }}
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
                      <span>{{ isPl ? 'Nowa karta' : 'New tab' }}</span>
                    </div>
                    <div class="menu-row muted">
                      <span>{{ isPl ? 'Ustawienia' : 'Settings' }}</span>
                    </div>
                    <div class="menu-divider"></div>
                    <div class="menu-row highlight">
                      <div class="qs-badge-icon">QS</div>
                      <strong>QuizSolver — AI Quiz Solver</strong>
                      <span class="badge-ready">{{ isPl ? 'AKTYWNY' : 'ACTIVE' }}</span>
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
                  <h3>{{ isPl ? 'Rozwiązuj testy bezpośrednio na telefonie' : 'Solve Quizzes Directly on Mobile' }}</h3>
                  <span class="flow-tag">{{ isPl ? 'Gotowe' : 'Ready' }}</span>
                </div>
                <p class="text-secondary">
                  {{ isPl
                    ? 'Otwórz dowolny test w Kiwi. Otwórz menu Kiwi -> QuizSolver -> kliknij „Rozwiąż obecną stronę" lub użyj FocusScan.'
                    : 'Open any quiz in Kiwi. Open Kiwi menu -> QuizSolver -> tap "Solve current page" or use FocusScan.' }}
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
                      <strong>{{ isPl ? 'Wszystko działa dokładnie tak jak na komputerze' : 'Works exactly like the desktop version' }}</strong>
                      <span class="text-secondary">{{ isPl ? 'Wykrywanie pytań, tryb podpowiedzi, FocusScan i historia pytań są w 100% dostępne.' : 'Automatic detection, hint mode, FocusScan and study history are fully supported.' }}</span>
                    </div>
                  </div>
                  <div class="quiz-cta">
                    <a [href]="pathFor('demo', locale)" class="btn btn-sm btn-outline">
                      {{ isPl ? 'Przetestuj na darmowym Demo' : 'Try Free Demo' }}
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
              <strong>{{ isPl ? 'Auto-wykrywanie pytań' : 'Auto question detection' }}</strong>
              <span>{{ isPl ? 'Wtyczka sama znajduje pytania na stronie' : 'Finds quiz questions on the page automatically' }}</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/></svg>
              </div>
              <strong>{{ isPl ? 'FocusScan' : 'FocusScan' }}</strong>
              <span>{{ isPl ? 'Skanuj i rozwiązuj wybrany fragment ekranu' : 'Scan and solve a selected part of the screen' }}</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4M12 2a6 6 0 00-4 10.5c.6.5 1 1.3 1 2.1V16h6v-1.4c0-.8.4-1.6 1-2.1A6 6 0 0012 2z"/></svg>
              </div>
              <strong>{{ isPl ? 'Tryb podpowiedzi' : 'Hint mode' }}</strong>
              <span>{{ isPl ? 'Wskazówki zamiast gotowych odpowiedzi' : 'Gentle nudges instead of full answers' }}</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v5h5M3.05 13a9 9 0 106.16-8.44"/><path d="M12 7v5l3 2"/></svg>
              </div>
              <strong>{{ isPl ? 'Historia pytań' : 'Question history' }}</strong>
              <span>{{ isPl ? 'Wszystko zapisane do nauki przed egzaminem' : 'Everything saved for exam revision' }}</span>
            </div>
          </div>
        </section>

        <!-- IOS FLOW -->
        <section class="install-flow" *ngIf="os === 'ios'">
          <div class="ios-wrapper">
            <div class="ios-header text-center">
              <h2>{{ isPl ? 'Wideo Poradnik dla iOS (iPhone / iPad)' : 'Video Tutorial for iOS (iPhone / iPad)' }}</h2>
              <p class="text-secondary">
                {{ isPl ? 'Zobacz 40-sekundowe nagranie pokazujące instalację rozszerzenia na urządzeniach Apple.' : 'Watch this 40-second video demonstrating the setup process on Apple devices.' }}
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
                <span>{{ isPl ? 'Otwórz na YouTube' : 'Open in YouTube app' }}</span>
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
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 1.05rem;
      color: #030712;
      background: linear-gradient(135deg, var(--accent-cyan), #7c5cfc);
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
      background: linear-gradient(135deg, var(--accent-cyan), #7c5cfc);
      color: #030712;
      font-weight: 900;
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
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
      font-size: 0.7rem;
      font-weight: 900;
      background: var(--accent-cyan);
      color: #030712;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
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