import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { SeoService } from '../seo.service';
import { Locale, pageData, pathFor } from '../site-content';
import { ShellComponent } from './shell.component';

type DashboardUi = {
  dashboard: string;
  credits: string;
  welcomeUser: string;
  dashboardIntro: string;
  questionsSolved: string;
  referralBonus: string;
  referralCode: string;
  referralMockTitle: string;
  greeting: string;
  lowCreditsTitle: string;
  lowCreditsText: string;
  buyCredits: string;
  referralTitle: string;
  referralText: string;
  copied: string;
  copy: string;
  signups: string;
  purchases: string;
  bonusCredits: string;
  ofPurchase: string;
  history: string;
  historyTitle: string;
  noPurchases: string;
};

const DASHBOARD_UI: Record<Locale, DashboardUi> = {
  en: {
    dashboard: 'Dashboard',
    credits: 'Credits',
    welcomeUser: 'Welcome, User',
    dashboardIntro: 'Credits, purchase history, and your referral code in one place.',
    questionsSolved: 'Questions solved',
    referralBonus: 'Referral bonus',
    referralCode: 'Referral code',
    referralMockTitle: 'Refer users and earn 5%',
    greeting: 'Hi,',
    lowCreditsTitle: 'Your credits are running low',
    lowCreditsText: 'Buy more so you do not run out during a quiz.',
    buyCredits: 'Buy credits',
    referralTitle: 'Refer users and earn 5% of bought credits',
    referralText: 'When someone signs up from your link and buys credits, you receive a bonus equal to 5% of those credits. The buyer keeps the full purchase.',
    copied: 'Copied',
    copy: 'Copy',
    signups: 'Signups',
    purchases: 'Purchases',
    bonusCredits: 'Bonus credits',
    ofPurchase: 'Of purchase',
    history: 'History',
    historyTitle: 'Purchases and bonuses',
    noPurchases: 'No purchases yet.'
  },
  pl: {
    dashboard: 'Panel',
    credits: 'Kredyty',
    welcomeUser: 'Witaj, Użytkowniku',
    dashboardIntro: 'Kredyty, historia zakupów i kod polecający w jednym miejscu.',
    questionsSolved: 'Rozwiązane pytania',
    referralBonus: 'Bonus z poleceń',
    referralCode: 'Kod polecający',
    referralMockTitle: 'Polecaj i odbieraj 5% kredytów',
    greeting: 'Cześć,',
    lowCreditsTitle: 'Twoje kredyty zaraz się skończą',
    lowCreditsText: 'Kup więcej, aby nie zabrakło ich podczas quizu.',
    buyCredits: 'Kup kredyty',
    referralTitle: 'Polecaj i odbieraj 5% kupionych kredytów',
    referralText: 'Gdy ktoś zarejestruje się z Twojego linku i kupi kredyty, dostajesz bonus równy 5% tej liczby kredytów. Kupujący nic nie traci.',
    copied: 'Skopiowano',
    copy: 'Kopiuj',
    signups: 'Rejestracje',
    purchases: 'Zakupy',
    bonusCredits: 'Kredyty bonusowe',
    ofPurchase: 'Od zakupu',
    history: 'Historia',
    historyTitle: 'Zakupy i bonusy',
    noPurchases: 'Nie ma jeszcze zakupów.'
  },
  de: {
    dashboard: 'Dashboard',
    credits: 'Credits',
    welcomeUser: 'Willkommen, Nutzer',
    dashboardIntro: 'Credits, Kaufhistorie und dein Empfehlungscode an einem Ort.',
    questionsSolved: 'Gelöste Fragen',
    referralBonus: 'Empfehlungsbonus',
    referralCode: 'Empfehlungscode',
    referralMockTitle: 'Empfehlen und 5% Credits erhalten',
    greeting: 'Hallo,',
    lowCreditsTitle: 'Deine Credits werden knapp',
    lowCreditsText: 'Kaufe mehr, damit sie während eines Quiz nicht ausgehen.',
    buyCredits: 'Credits kaufen',
    referralTitle: 'Empfehle Nutzer und erhalte 5% gekaufter Credits',
    referralText: 'Wenn sich jemand über deinen Link registriert und Credits kauft, erhältst du 5% dieser Credits als Bonus. Der Käufer behält den vollen Kauf.',
    copied: 'Kopiert',
    copy: 'Kopieren',
    signups: 'Registrierungen',
    purchases: 'Käufe',
    bonusCredits: 'Bonus-Credits',
    ofPurchase: 'Vom Kauf',
    history: 'Historie',
    historyTitle: 'Käufe und Boni',
    noPurchases: 'Noch keine Käufe.'
  },
  es: {
    dashboard: 'Panel',
    credits: 'Créditos',
    welcomeUser: 'Bienvenido, usuario',
    dashboardIntro: 'Créditos, historial de compras y código de referido en un solo lugar.',
    questionsSolved: 'Preguntas resueltas',
    referralBonus: 'Bono de referido',
    referralCode: 'Código de referido',
    referralMockTitle: 'Recomienda y recibe 5% de créditos',
    greeting: 'Hola,',
    lowCreditsTitle: 'Tus créditos están por acabarse',
    lowCreditsText: 'Compra más para no quedarte sin créditos durante un quiz.',
    buyCredits: 'Comprar créditos',
    referralTitle: 'Recomienda usuarios y gana 5% de los créditos comprados',
    referralText: 'Cuando alguien se registra con tu enlace y compra créditos, recibes un bono equivalente al 5% de esos créditos. El comprador conserva toda su compra.',
    copied: 'Copiado',
    copy: 'Copiar',
    signups: 'Registros',
    purchases: 'Compras',
    bonusCredits: 'Créditos de bono',
    ofPurchase: 'De la compra',
    history: 'Historial',
    historyTitle: 'Compras y bonos',
    noPurchases: 'Todavía no hay compras.'
  },
  fr: {
    dashboard: 'Tableau de bord',
    credits: 'Crédits',
    welcomeUser: 'Bienvenue, utilisateur',
    dashboardIntro: 'Crédits, historique d’achat et code de parrainage au même endroit.',
    questionsSolved: 'Questions résolues',
    referralBonus: 'Bonus de parrainage',
    referralCode: 'Code de parrainage',
    referralMockTitle: 'Parraine et reçois 5% de crédits',
    greeting: 'Bonjour,',
    lowCreditsTitle: 'Tes crédits sont presque épuisés',
    lowCreditsText: 'Achète-en davantage pour ne pas en manquer pendant un quiz.',
    buyCredits: 'Acheter des crédits',
    referralTitle: 'Parraine des utilisateurs et gagne 5% des crédits achetés',
    referralText: 'Quand quelqu’un s’inscrit avec ton lien et achète des crédits, tu reçois un bonus égal à 5% de ces crédits. L’acheteur garde tout son achat.',
    copied: 'Copié',
    copy: 'Copier',
    signups: 'Inscriptions',
    purchases: 'Achats',
    bonusCredits: 'Crédits bonus',
    ofPurchase: 'De l’achat',
    history: 'Historique',
    historyTitle: 'Achats et bonus',
    noPurchases: 'Aucun achat pour l’instant.'
  },
  it: {
    dashboard: 'Dashboard',
    credits: 'Crediti',
    welcomeUser: 'Benvenuto, utente',
    dashboardIntro: 'Crediti, cronologia acquisti e codice referral in un unico posto.',
    questionsSolved: 'Domande risolte',
    referralBonus: 'Bonus referral',
    referralCode: 'Codice referral',
    referralMockTitle: 'Invita e ricevi il 5% di crediti',
    greeting: 'Ciao,',
    lowCreditsTitle: 'I tuoi crediti stanno finendo',
    lowCreditsText: 'Acquistane altri per non rimanere senza durante un quiz.',
    buyCredits: 'Compra crediti',
    referralTitle: 'Invita utenti e guadagna il 5% dei crediti acquistati',
    referralText: 'Quando qualcuno si registra dal tuo link e compra crediti, ricevi un bonus pari al 5% di quei crediti. Chi compra mantiene l’intero acquisto.',
    copied: 'Copiato',
    copy: 'Copia',
    signups: 'Registrazioni',
    purchases: 'Acquisti',
    bonusCredits: 'Crediti bonus',
    ofPurchase: 'Dell’acquisto',
    history: 'Cronologia',
    historyTitle: 'Acquisti e bonus',
    noPurchases: 'Ancora nessun acquisto.'
  },
  uk: {
    dashboard: 'Панель',
    credits: 'Кредити',
    welcomeUser: 'Вітаємо, користувачу',
    dashboardIntro: 'Кредити, історія покупок і реферальний код в одному місці.',
    questionsSolved: 'Розв’язані питання',
    referralBonus: 'Реферальний бонус',
    referralCode: 'Реферальний код',
    referralMockTitle: 'Запрошуй і отримуй 5% кредитів',
    greeting: 'Привіт,',
    lowCreditsTitle: 'Кредити скоро закінчаться',
    lowCreditsText: 'Купи більше, щоб їх вистачило під час вікторини.',
    buyCredits: 'Купити кредити',
    referralTitle: 'Запрошуй користувачів і отримуй 5% куплених кредитів',
    referralText: 'Коли хтось реєструється за твоїм посиланням і купує кредити, ти отримуєш бонус 5% від цих кредитів. Покупець нічого не втрачає.',
    copied: 'Скопійовано',
    copy: 'Копіювати',
    signups: 'Реєстрації',
    purchases: 'Покупки',
    bonusCredits: 'Бонусні кредити',
    ofPurchase: 'Від покупки',
    history: 'Історія',
    historyTitle: 'Покупки та бонуси',
    noPurchases: 'Покупок поки немає.'
  }
};

@Component({
  standalone: true,
  imports: [CommonModule, ShellComponent],
  template: `
    <qs-shell #shell [locale]="locale" pageKey="dashboard">
      <div class="container dashboard-main">
        <section *ngIf="!api.currentUser(); else dashboardContent" class="section unauthorized-section-wrapper">
          <!-- Inactive dashboard mockup (blurred) -->
          <div class="unauthorized-blur-bg" aria-hidden="true">
            <header class="dashboard-header" style="padding-top: 1rem;">
              <p class="eyebrow">DASHBOARD</p>
              <h1>{{ ui.welcomeUser }}</h1>
              <p class="desc text-secondary">
                {{ ui.dashboardIntro }}
              </p>
            </header>

            <div class="stats-grid">
              <div class="stat-card glass">
                <div class="stat-num text-gradient-strong">750</div>
                <div class="stat-label">{{ copy.credits }}</div>
              </div>
              <div class="stat-card glass">
                <div class="stat-num">142</div>
                <div class="stat-label">{{ ui.questionsSolved }}</div>
              </div>
              <div class="stat-card glass">
                <div class="stat-num">35</div>
                <div class="stat-label">{{ ui.referralBonus }}</div>
              </div>
            </div>

            <div class="referral-card glass" style="margin-bottom: 2rem;">
              <div class="referral-grid">
                <div class="referral-info">
                  <p class="eyebrow">{{ ui.referralCode }}</p>
                  <h2 style="margin: 0.5rem 0;">{{ ui.referralMockTitle }}</h2>
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
            <h1>{{ ui.greeting }} {{ api.currentUser()?.displayName || 'User' }}</h1>
            <p class="desc text-secondary">
              {{ ui.dashboardIntro }}
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
              <div class="stat-label">{{ ui.questionsSolved }}</div>
            </article>
            <article class="stat-card glass glass-hover">
              <div class="stat-num">
                {{ referral().referralCredits || 0 }}
              </div>
              <div class="stat-label">{{ ui.referralBonus }}</div>
            </article>
          </section>

          <section class="credit-warning glass" *ngIf="lowCredits()">
            <div>
              <p class="eyebrow">{{ copy.credits }}</p>
              <h2>{{ ui.lowCreditsTitle }}</h2>
              <p class="text-secondary">
                {{ ui.lowCreditsText }}
              </p>
            </div>
            <a class="btn btn-primary" [href]="creditsPath()">
              {{ ui.buyCredits }}
            </a>
          </section>

          <!-- Referral Widget -->
          <section class="referral-section">
            <div class="referral-card glass">
              <div class="referral-grid">
                <div class="referral-info">
                  <p class="eyebrow">{{ ui.referralCode }}</p>
                  <h2>{{ ui.referralTitle }}</h2>
                  <p class="text-secondary">
                    {{ ui.referralText }}
                  </p>
                  <div class="copy-box">
                    <code class="ref-link">{{ referral().referralLink || 'Loading...' }}</code>
                    <button class="btn btn-primary btn-sm" type="button" (click)="copyReferral()">
                      {{ copied ? ui.copied : ui.copy }}
                    </button>
                  </div>
                </div>
                <div class="referral-stats">
                  <div class="glass stat-box">
                    <strong class="stat-val">{{ referral().referredUsers || 0 }}</strong>
                    <span class="stat-lbl text-secondary">{{ ui.signups }}</span>
                  </div>
                  <div class="glass stat-box">
                    <strong class="stat-val">{{ referral().referralPurchases || 0 }}</strong>
                    <span class="stat-lbl text-secondary">{{ ui.purchases }}</span>
                  </div>
                  <div class="glass stat-box">
                    <strong class="stat-val">{{ referral().referralCredits || 0 }}</strong>
                    <span class="stat-lbl text-secondary">{{ ui.bonusCredits }}</span>
                  </div>
                  <div class="glass stat-box highlight-box">
                    <strong class="stat-val text-gradient-strong">5%</strong>
                    <span class="stat-lbl text-secondary">{{ ui.ofPurchase }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Purchase History -->
          <section class="history-section">
            <div class="history-header">
              <p class="eyebrow">{{ ui.history }}</p>
              <h2>{{ ui.historyTitle }}</h2>
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
                <p class="text-secondary">{{ ui.noPurchases }}</p>
              </div>
            </ng-template>
          </section>
        </ng-template>
      </div>
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
    .credit-warning {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.25rem;
      padding: 1.5rem;
      margin: -1rem 0 3.5rem;
      border-color: rgba(245, 158, 11, 0.35);
      background: rgba(245, 158, 11, 0.08);
    }
    .credit-warning h2 {
      margin: 0.35rem 0;
      font-size: 1.35rem;
    }
    .credit-warning p:last-child {
      margin: 0;
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
    }
    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
        gap: 1.25rem;
      }
      .referral-card {
        padding: 1.75rem;
      }
      .credit-warning {
        align-items: stretch;
        flex-direction: column;
        margin-top: 0;
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
  protected ui = DASHBOARD_UI.en;
  protected copy = { dashboard: DASHBOARD_UI.en.dashboard, credits: DASHBOARD_UI.en.credits };

  async ngOnInit(): Promise<void> {
    this.locale = (this.route.snapshot.data['locale'] || 'en') as Locale;
    this.ui = DASHBOARD_UI[this.locale] || DASHBOARD_UI.en;
    this.copy = { dashboard: this.ui.dashboard, credits: this.ui.credits };
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

  protected lowCredits(): boolean {
    const user = this.api.currentUser();
    return !!user && user.role !== 'admin' && Number(user.credits || 0) < 20;
  }

  protected creditsPath(): string {
    return pathFor('credits', this.locale);
  }

  protected async copyReferral(): Promise<void> {
    const link = this.referral().referralLink;
    if (!link || !navigator.clipboard) return;
    await navigator.clipboard.writeText(link);
    this.copied = true;
    setTimeout(() => this.copied = false, 1800);
  }
}
