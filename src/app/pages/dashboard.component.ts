import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { SeoService } from '../seo.service';
import { Locale, pageData } from '../site-content';
import { ShellComponent } from './shell.component';

@Component({
  standalone: true,
  imports: [CommonModule, ShellComponent],
  template: `
    <qs-shell #shell [locale]="locale" pageKey="dashboard">
      <main class="container dashboard-main">
        <section *ngIf="!api.currentUser(); else dashboardContent" class="section unauthorized-section-wrapper">
          <!-- Inactive dashboard mockup (blurred) -->
          <div class="unauthorized-blur-bg" aria-hidden="true">
            <header class="dashboard-header" style="padding-top: 1rem;">
              <p class="eyebrow">DASHBOARD</p>
              <h1>{{ locale === 'pl' ? 'Witaj, Użytkowniku' : 'Welcome, User' }}</h1>
              <p class="desc text-secondary">
                {{ locale === 'pl' ? 'Kredyty, historia zakupów i kod polecający w jednym miejscu.' : 'Credits, purchase history, and your referral code in one place.' }}
              </p>
            </header>

            <div class="stats-grid">
              <div class="stat-card glass">
                <div class="stat-num text-gradient-strong">750</div>
                <div class="stat-label">{{ copy.credits }}</div>
              </div>
              <div class="stat-card glass">
                <div class="stat-num">142</div>
                <div class="stat-label">{{ locale === 'pl' ? 'Rozwiązane pytania' : 'Questions solved' }}</div>
              </div>
              <div class="stat-card glass">
                <div class="stat-num">35</div>
                <div class="stat-label">{{ locale === 'pl' ? 'Bonus z poleceń' : 'Referral bonus' }}</div>
              </div>
            </div>

            <div class="referral-card glass" style="margin-bottom: 2rem;">
              <div class="referral-grid">
                <div class="referral-info">
                  <p class="eyebrow">{{ locale === 'pl' ? 'Kod polecający' : 'Referral code' }}</p>
                  <h2 style="margin: 0.5rem 0;">{{ locale === 'pl' ? 'Polecaj i odbieraj 5% kredytów' : 'Refer users and earn 5%' }}</h2>
                  <div class="copy-box" style="max-width: 300px;"><code class="ref-link">https://getquizsolver.com/?ref=demo123</code></div>
                </div>
                <div class="referral-stats" style="grid-template-columns: repeat(2, 1fr); gap: 0.5rem;">
                  <div class="glass stat-box" style="padding: 0.5rem;"><strong style="font-size: 1.2rem;">12</strong><span style="font-size: 0.65rem;">Signups</span></div>
                  <div class="glass stat-box" style="padding: 0.5rem;"><strong style="font-size: 1.2rem;">3</strong><span style="font-size: 0.65rem;">Purchases</span></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Floating Glass Card Login Panel -->
          <div class="login-panel glass floating-panel">
            <div class="padlock-wrapper">
              <svg class="padlock-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <div class="padlock-glow"></div>
            </div>
            <p class="eyebrow">{{ copy.dashboard }}</p>
            <h2>{{ data.loginTitle }}</h2>
            <p class="desc text-secondary">{{ data.loginText }}</p>
            <button class="btn btn-primary btn-lg" type="button" (click)="shell.openModal('login')">
              {{ data.loginButton }}
            </button>
          </div>
        </section>

        <ng-template #dashboardContent>
          <header class="dashboard-header">
            <p class="eyebrow">{{ copy.dashboard }}</p>
            <h1>{{ locale === 'pl' ? 'Cześć,' : 'Hi,' }} {{ api.currentUser()?.displayName || 'User' }}</h1>
            <p class="desc text-secondary">
              {{ locale === 'pl' ? 'Kredyty, historia zakupów i kod polecający w jednym miejscu.' : 'Credits, purchase history, and your referral code in one place.' }}
            </p>
          </header>

          <!-- Stats Grid -->
          <section class="stats-grid">
            <article class="stat-card glass glass-hover">
              <div class="stat-num text-gradient-strong">
                {{ api.currentUser()?.role === 'admin' ? '∞' : (api.currentUser()?.credits || 0) }}
              </div>
              <div class="stat-label">{{ copy.credits }}</div>
            </article>
            <article class="stat-card glass glass-hover">
              <div class="stat-num">
                {{ api.currentUser()?.stats?.totalQuestionsSolved || 0 }}
              </div>
              <div class="stat-label">{{ locale === 'pl' ? 'Rozwiązane pytania' : 'Questions solved' }}</div>
            </article>
            <article class="stat-card glass glass-hover">
              <div class="stat-num">
                {{ referral().referralCredits || 0 }}
              </div>
              <div class="stat-label">{{ locale === 'pl' ? 'Bonus z poleceń' : 'Referral bonus' }}</div>
            </article>
          </section>

          <!-- Referral Widget -->
          <section class="referral-section">
            <div class="referral-card glass">
              <div class="referral-grid">
                <div class="referral-info">
                  <p class="eyebrow">{{ locale === 'pl' ? 'Kod polecający' : 'Referral code' }}</p>
                  <h2>{{ locale === 'pl' ? 'Polecaj i odbieraj 5% kupionych kredytów' : 'Refer users and earn 5% of bought credits' }}</h2>
                  <p class="text-secondary">
                    {{ locale === 'pl' ? 'Gdy ktoś zarejestruje się z Twojego linku i kupi kredyty, dostajesz bonus równy 5% tej liczby kredytów. Kupujący nic nie traci.' : 'When someone signs up from your link and buys credits, you receive a bonus equal to 5% of those credits. The buyer keeps the full purchase.' }}
                  </p>
                  <div class="copy-box">
                    <code class="ref-link">{{ referral().referralLink || 'Loading...' }}</code>
                    <button class="btn btn-primary btn-sm" type="button" (click)="copyReferral()">
                      {{ copied ? (locale === 'pl' ? 'Skopiowano' : 'Copied') : (locale === 'pl' ? 'Kopiuj' : 'Copy') }}
                    </button>
                  </div>
                </div>
                <div class="referral-stats">
                  <div class="glass stat-box">
                    <strong class="stat-val">{{ referral().referredUsers || 0 }}</strong>
                    <span class="stat-lbl text-secondary">{{ locale === 'pl' ? 'Rejestracje' : 'Signups' }}</span>
                  </div>
                  <div class="glass stat-box">
                    <strong class="stat-val">{{ referral().referralPurchases || 0 }}</strong>
                    <span class="stat-lbl text-secondary">{{ locale === 'pl' ? 'Zakupy' : 'Purchases' }}</span>
                  </div>
                  <div class="glass stat-box">
                    <strong class="stat-val">{{ referral().referralCredits || 0 }}</strong>
                    <span class="stat-lbl text-secondary">{{ locale === 'pl' ? 'Kredyty bonusowe' : 'Bonus credits' }}</span>
                  </div>
                  <div class="glass stat-box highlight-box">
                    <strong class="stat-val text-gradient-strong">5%</strong>
                    <span class="stat-lbl text-secondary">{{ locale === 'pl' ? 'Od zakupu' : 'Of purchase' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Credit Packages -->
          <section class="packages-section" id="credits">
            <div class="section-header">
              <p class="eyebrow">{{ copy.credits }}</p>
              <h2>{{ locale === 'pl' ? 'Doładuj konto' : 'Top up your account' }}</h2>
              <p class="text-secondary">{{ locale === 'pl' ? 'Wybierz jednorazowy pakiet kredytów.' : 'Choose a one-time credit pack.' }}</p>
            </div>
            <div class="packages-deck">
              <article class="package-card glass glass-hover" *ngFor="let pack of packs" [class.featured]="pack.id === 'popular'">
                <span *ngIf="pack.id === 'popular'" class="featured-badge">
                  {{ locale === 'pl' ? 'Popularne' : 'Popular' }}
                </span>
                <h3 class="pack-name">{{ pack.name[locale] }}</h3>
                <div class="pack-price">{{ pack.price }}</div>
                <p class="pack-caption text-secondary">{{ pack.caption[locale] }}</p>
                <button class="btn btn-block" [class.btn-primary]="pack.id === 'popular'" [class.btn-outline]="pack.id !== 'popular'" type="button" (click)="buyPack(pack.id)">
                  {{ pack.button[locale] }}
                </button>
              </article>
            </div>
          </section>

          <!-- Purchase History -->
          <section class="history-section">
            <div class="history-header">
              <p class="eyebrow">{{ locale === 'pl' ? 'Historia' : 'History' }}</p>
              <h2>{{ locale === 'pl' ? 'Zakupy i bonusy' : 'Purchases and bonuses' }}</h2>
            </div>
            <div class="history-list glass" *ngIf="purchases().length; else noPurchases">
              <div class="history-item" *ngFor="let purchase of purchases()">
                <div class="item-details">
                  <strong class="pack-title">{{ purchase.pack }}</strong>
                  <p class="credits-count text-secondary">{{ purchase.credits }} {{ copy.credits }}</p>
                </div>
                <div class="price-val">
                  {{ purchase.priceUsd ? ('$' + purchase.priceUsd) : (purchase.paymentProvider === 'referral' ? 'bonus' : '') }}
                </div>
              </div>
            </div>
            <ng-template #noPurchases>
              <div class="no-purchases glass">
                <p class="text-secondary">{{ locale === 'pl' ? 'Nie ma jeszcze zakupów.' : 'No purchases yet.' }}</p>
              </div>
            </ng-template>
          </section>
        </ng-template>
      </main>
    </qs-shell>
  `,
  styles: [`
    .dashboard-main {
      padding-bottom: 5rem;
    }

    /* Unauthorized view */
    .unauthorized-section-wrapper {
      position: relative;
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 2rem 0;
    }
    .unauthorized-blur-bg {
      width: 100%;
      pointer-events: none;
      user-select: none;
      filter: blur(10px);
      opacity: 0.25;
      transition: filter 0.3s;
    }
    .login-panel.floating-panel {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 95%;
      max-width: 500px;
      padding: 3.5rem 2.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      z-index: 10;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(139, 92, 246, 0.15);
      animation: float-centered 6s ease-in-out infinite;
    }
    @keyframes float-centered {
      0%, 100% { transform: translate(-50%, -50%) translateY(0); }
      50% { transform: translate(-50%, -50%) translateY(-12px); }
    }
    .login-panel h2 {
      font-size: 2.25rem;
      margin: 1rem 0;
      line-height: 1.25;
    }
    .login-panel .desc {
      margin-bottom: 2rem;
      font-size: 1rem;
      line-height: 1.6;
    }
    .padlock-wrapper {
      position: relative;
      width: 80px;
      height: 80px;
      margin: 0 auto 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .padlock-svg {
      width: 48px;
      height: 48px;
      color: var(--accent-violet);
      filter: drop-shadow(0 0 8px var(--glow-violet));
      animation: padlock-pulse 2s ease-in-out infinite alternate;
      z-index: 2;
    }
    .padlock-glow {
      position: absolute;
      width: 60px;
      height: 60px;
      background: radial-gradient(circle, var(--glow-violet) 0%, transparent 70%);
      border-radius: 50%;
      z-index: 1;
      animation: glow-pulse-inner 2s ease-in-out infinite alternate;
    }
    @keyframes padlock-pulse {
      0% {
        transform: scale(0.95);
        color: var(--accent-violet);
        filter: drop-shadow(0 0 8px var(--glow-violet));
      }
      100% {
        transform: scale(1.05);
        color: var(--accent-cyan);
        filter: drop-shadow(0 0 15px var(--glow-cyan));
      }
    }
    @keyframes glow-pulse-inner {
      0% {
        transform: scale(0.8);
        opacity: 0.5;
      }
      100% {
        transform: scale(1.2);
        opacity: 1;
      }
    }

    /* Dashboard Header */
    .dashboard-header {
      padding: 4rem 0 2rem;
    }
    .dashboard-header h1 {
      font-size: 2.75rem;
      margin: 0.5rem 0;
    }

    /* Stats Row */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-bottom: 3.5rem;
    }
    .stat-card {
      padding: 2.5rem 1.5rem;
      text-align: center;
    }
    .stat-num {
      font-size: 3rem;
      font-weight: 800;
      line-height: 1.1;
      font-family: var(--font-heading);
    }
    .stat-label {
      color: var(--text-secondary);
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-top: 0.75rem;
    }

    /* Referral Widget */
    .referral-card {
      padding: 3rem;
      margin-bottom: 3.5rem;
    }
    .referral-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 3.5rem;
      align-items: center;
    }
    .referral-info h2 {
      font-size: 1.75rem;
      margin: 0.75rem 0 1rem;
      line-height: 1.3;
    }
    .referral-info p {
      font-size: 0.95rem;
      line-height: 1.6;
      margin-bottom: 1.75rem;
    }
    .copy-box {
      display: flex;
      gap: 0.5rem;
      background: rgba(0, 0, 0, 0.4);
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
      align-items: center;
    }
    .ref-link {
      font-family: monospace;
      color: var(--accent-cyan);
      font-size: 0.9rem;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .referral-stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem;
    }
    .stat-box {
      padding: 1.25rem;
      text-align: center;
      background: rgba(255, 255, 255, 0.02);
    }
    .highlight-box {
      border: 1px solid var(--border-hover);
      background: rgba(6, 182, 212, 0.05);
    }
    .stat-val {
      display: block;
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .stat-lbl {
      font-size: 0.75rem;
      margin-top: 0.25rem;
      display: block;
    }

    /* Credit Packages */
    .packages-section {
      padding: 3rem 0;
    }
    .packages-deck {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      margin-top: 2.5rem;
    }
    .package-card {
      padding: 3rem 2rem;
      text-align: center;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .package-card.featured {
      border: 1.5px solid var(--accent-cyan);
      box-shadow: 0 0 25px var(--glow-cyan), var(--shadow-md);
      transform: scale(1.02);
    }
    .featured-badge {
      position: absolute;
      top: -0.75rem;
      left: 50%;
      transform: translateX(-50%);
      background: var(--accent-cyan);
      color: var(--bg-deep);
      padding: 0.3rem 0.9rem;
      border-radius: var(--radius-full);
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .pack-name {
      font-size: 1.35rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    .pack-price {
      font-family: var(--font-heading);
      font-size: 2.75rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }
    .pack-caption {
      font-size: 0.9rem;
      margin-bottom: 2rem;
    }

    /* Purchase History */
    .history-section {
      padding: 3rem 0 1rem;
    }
    .history-header h2 {
      font-size: 2rem;
      margin: 0.5rem 0 1.5rem;
    }
    .history-list {
      background: rgba(15, 18, 35, 0.4);
      padding: 1rem 1.5rem;
    }
    .history-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 0;
      border-bottom: 1px solid var(--border);
    }
    .history-item:last-child {
      border-bottom: none;
    }
    .pack-title {
      font-size: 1.05rem;
      color: var(--text-primary);
    }
    .credits-count {
      font-size: 0.85rem;
      margin-top: 0.15rem;
    }
    .price-val {
      font-family: var(--font-heading);
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--accent-cyan);
    }
    .no-purchases {
      padding: 3rem;
      text-align: center;
    }

    /* Responsive */
    @media (max-width: 992px) {
      .referral-grid {
        grid-template-columns: 1fr;
        gap: 2.5rem;
      }
      .packages-deck {
        grid-template-columns: 1fr;
        gap: 1.5rem;
        max-width: 450px;
        margin-left: auto;
        margin-right: auto;
      }
      .package-card.featured {
        transform: scale(1);
      }
    }
    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
        gap: 1.25rem;
      }
      .referral-card {
        padding: 1.75rem;
      }
      .dashboard-header h1 {
        font-size: 2.25rem;
      }
    }
    @media (max-width: 480px) {
      .dashboard-header {
        padding: 3rem 0 1.5rem;
      }
      .copy-box {
        flex-direction: column;
        align-items: stretch;
      }
      .copy-box .btn {
        width: 100%;
      }
      .referral-stats {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  protected readonly route = inject(ActivatedRoute);
  protected readonly seo = inject(SeoService);
  protected readonly api = inject(ApiService);
  protected readonly purchases = signal<any[]>([]);
  protected readonly referral = signal<any>({});

  protected locale: Locale = 'en';
  protected data = pageData('dashboard', 'en');
  protected copied = false;
  protected copy = {
    dashboard: 'Dashboard',
    credits: 'Credits'
  };

  protected readonly packs = [
    {
      id: 'starter',
      price: '$1.99',
      name: { en: '100 credits', pl: '100 kredytów' },
      caption: { en: 'Small one-time top-up', pl: 'Małe jednorazowe doładowanie' },
      button: { en: 'Buy 100 credits', pl: 'Kup 100 kredytów' }
    },
    {
      id: 'popular',
      price: '$4.99',
      name: { en: '500 credits', pl: '500 kredytów' },
      caption: { en: 'Best for regular use', pl: 'Najlepsze do regularnego użycia' },
      button: { en: 'Buy 500 credits', pl: 'Kup 500 kredytów' }
    },
    {
      id: 'pro',
      price: '$9.99',
      name: { en: '2000 credits', pl: '2000 kredytów' },
      caption: { en: 'Large sessions and sharing', pl: 'Większe sesje i udostępnianie' },
      button: { en: 'Buy 2000 credits', pl: 'Kup 2000 kredytów' }
    }
  ];

  async ngOnInit(): Promise<void> {
    this.locale = (this.route.snapshot.data['locale'] || 'en') as Locale;
    this.copy = this.locale === 'pl'
      ? { dashboard: 'Panel', credits: 'Kredyty' }
      : { dashboard: 'Dashboard', credits: 'Credits' };
    this.data = pageData('dashboard', this.locale);
    this.seo.applyPage('dashboard', this.locale);
    await this.api.restoreSession();
    await Promise.all([this.loadHistory(), this.loadReferral()]);
  }

  protected async loadHistory(): Promise<void> {
    if (!this.api.token()) return;
    const result = await this.api.request('/api/credits/history');
    if (result.success && Array.isArray(result.purchases)) this.purchases.set(result.purchases);
  }

  protected async loadReferral(): Promise<void> {
    if (!this.api.token()) return;
    const result = await this.api.request('/api/credits/referrals');
    if (result.success) this.referral.set(result);
  }

  protected async buyPack(pack: string): Promise<void> {
    const result = await this.api.request('/api/credits/buy', {
      method: 'POST',
      body: JSON.stringify({ pack })
    });
    if (result.success && result.checkoutUrl) window.location.href = result.checkoutUrl;
  }

  protected async copyReferral(): Promise<void> {
    const link = this.referral().referralLink;
    if (!link || !navigator.clipboard) return;
    await navigator.clipboard.writeText(link);
    this.copied = true;
    setTimeout(() => this.copied = false, 1800);
  }
}
