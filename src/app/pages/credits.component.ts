import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { SeoService } from '../seo.service';
import { Locale, pageData, pathFor } from '../site-content';
import { ShellComponent } from './shell.component';

@Component({
  standalone: true,
  imports: [CommonModule, ShellComponent],
  template: `
    <qs-shell #shell [locale]="locale" pageKey="credits">
      <main class="container credits-main">
        <header class="credits-hero">
          <p class="eyebrow">{{ copy.badge }}</p>
          <h1>{{ data.title }}</h1>
          <p class="desc text-secondary">{{ copy.subtitle }}</p>
        </header>

        <section *ngIf="!api.currentUser(); else creditsContent" class="login-card glass">
          <h2>{{ copy.loginTitle }}</h2>
          <p class="text-secondary">{{ copy.loginText }}</p>
          <button class="btn btn-primary btn-lg" type="button" (click)="shell.openModal('login')">
            {{ copy.loginButton }}
          </button>
        </section>

        <ng-template #creditsContent>
          <section class="balance-card glass">
            <div>
              <p class="eyebrow">{{ copy.balanceLabel }}</p>
              <div class="balance-value text-gradient-strong">
                {{ api.currentUser()?.role === 'admin' ? '∞' : (api.currentUser()?.credits || 0) }}
              </div>
              <p class="text-secondary">{{ copy.balanceText }}</p>
            </div>
            <a class="btn btn-outline" [href]="dashboardPath()">{{ copy.dashboardCta }}</a>
          </section>

          <section class="low-credit-alert glass" *ngIf="lowCredits()">
            <strong>{{ copy.lowTitle }}</strong>
            <span>{{ copy.lowText }}</span>
          </section>

          <section class="packages-section">
            <div class="section-header">
              <p class="eyebrow">{{ copy.packagesBadge }}</p>
              <h2>{{ copy.packagesTitle }}</h2>
              <p class="text-secondary">{{ copy.packagesText }}</p>
            </div>

            <div class="packages-deck">
              <article class="package-card glass glass-hover" *ngFor="let pack of packs" [class.featured]="pack.id === 'popular'">
                <span *ngIf="pack.id === 'popular'" class="featured-badge">{{ copy.popular }}</span>
                <h3>{{ pack.name[locale] }}</h3>
                <div class="pack-price">{{ pack.price }}</div>
                <p class="text-secondary">{{ pack.caption[locale] }}</p>
                <button class="btn btn-block" [class.btn-primary]="pack.id === 'popular'" [class.btn-outline]="pack.id !== 'popular'" type="button" (click)="buyPack(pack.id)" [disabled]="buying() === pack.id">
                  {{ buying() === pack.id ? copy.loading : pack.button[locale] }}
                </button>
              </article>
            </div>
          </section>
        </ng-template>
      </main>
    </qs-shell>
  `,
  styles: [`
    .credits-main {
      padding-bottom: 5rem;
    }
    .credits-hero {
      padding: 4rem 0 2rem;
      text-align: center;
    }
    .credits-hero h1 {
      font-size: clamp(2.4rem, 6vw, 4rem);
      margin: 0.5rem 0;
    }
    .credits-hero .desc {
      max-width: 680px;
      margin: 0 auto;
      font-size: 1.05rem;
    }
    .login-card {
      max-width: 520px;
      margin: 2rem auto 4rem;
      padding: 2.5rem;
      text-align: center;
    }
    .login-card h2 {
      font-size: 1.75rem;
      margin-bottom: 0.75rem;
    }
    .login-card p {
      margin-bottom: 1.75rem;
    }
    .balance-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      padding: 2rem;
      margin-bottom: 1rem;
    }
    .balance-value {
      font-family: var(--font-heading);
      font-size: clamp(2.5rem, 7vw, 4.5rem);
      font-weight: 850;
      line-height: 1;
      margin: 0.35rem 0;
    }
    .low-credit-alert {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      padding: 1rem 1.25rem;
      margin-bottom: 2rem;
      border-color: rgba(245, 158, 11, 0.35);
      background: rgba(245, 158, 11, 0.08);
      color: var(--text-primary);
    }
    .low-credit-alert strong {
      color: var(--accent-amber);
      white-space: nowrap;
    }
    .packages-section {
      padding: 2.5rem 0 0;
    }
    .section-header {
      text-align: center;
      max-width: 680px;
      margin: 0 auto;
    }
    .section-header h2 {
      font-size: clamp(2rem, 4vw, 3rem);
      margin: 0.5rem 0;
    }
    .packages-deck {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1.5rem;
      margin-top: 2.5rem;
      align-items: stretch;
    }
    .package-card {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 2.25rem;
      text-align: center;
    }
    .package-card.featured {
      border-color: rgba(6, 182, 212, 0.58);
      box-shadow: 0 0 28px rgba(6, 182, 212, 0.18), var(--shadow-md);
    }
    .featured-badge {
      position: absolute;
      top: -0.8rem;
      left: 50%;
      transform: translateX(-50%);
      padding: 0.35rem 0.8rem;
      border-radius: var(--radius-full);
      background: var(--accent-cyan);
      color: var(--bg-deep);
      font-size: 0.7rem;
      font-weight: 850;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .package-card h3 {
      font-size: 1.35rem;
    }
    .pack-price {
      font-family: var(--font-heading);
      font-size: 2.75rem;
      font-weight: 850;
      color: var(--text-primary);
      line-height: 1.05;
    }
    .package-card .btn {
      margin-top: auto;
    }
    @media (max-width: 900px) {
      .packages-deck {
        grid-template-columns: 1fr;
        max-width: 460px;
        margin-left: auto;
        margin-right: auto;
      }
    }
    @media (max-width: 640px) {
      .credits-hero {
        padding: 2.5rem 0 1.5rem;
      }
      .balance-card {
        align-items: stretch;
        flex-direction: column;
        padding: 1.35rem;
      }
      .low-credit-alert {
        align-items: flex-start;
        flex-direction: column;
      }
      .package-card,
      .login-card {
        padding: 1.5rem;
      }
    }
  `]
})
export class CreditsComponent implements OnInit {
  protected readonly route = inject(ActivatedRoute);
  protected readonly seo = inject(SeoService);
  protected readonly api = inject(ApiService);
  protected readonly buying = signal('');

  protected locale: Locale = 'en';
  protected data = pageData('credits', 'en');
  protected copy = CREDITS_COPY.en;

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
    this.data = pageData('credits', this.locale);
    this.copy = CREDITS_COPY[this.locale];
    this.seo.applyPage('credits', this.locale);
    await this.api.restoreSession();
  }

  protected lowCredits(): boolean {
    const user = this.api.currentUser();
    return !!user && user.role !== 'admin' && Number(user.credits || 0) < 20;
  }

  protected dashboardPath(): string {
    return pathFor('dashboard', this.locale);
  }

  protected async buyPack(pack: string): Promise<void> {
    if (!this.api.token()) return;
    this.buying.set(pack);
    const result = await this.api.request('/api/credits/buy', {
      method: 'POST',
      body: JSON.stringify({ pack })
    });
    this.buying.set('');
    if (result.success && result.checkoutUrl) window.location.href = result.checkoutUrl;
  }
}

const CREDITS_COPY: Record<Locale, any> = {
  en: {
    badge: 'Credits',
    subtitle: 'Choose a one-time credit package. No subscription, no hidden recurring charge.',
    loginTitle: 'Sign in to buy credits',
    loginText: 'Use the same account as the Chrome extension, then pick a top-up package.',
    loginButton: 'Sign in / Sign up',
    balanceLabel: 'Current balance',
    balanceText: 'Credits are used for AI answers, explanations, follow-ups, and FocusScan.',
    dashboardCta: 'Back to dashboard',
    lowTitle: 'Low balance',
    lowText: 'Your credits are almost gone. Buy more so you do not run out during a quiz.',
    packagesBadge: 'One-time packages',
    packagesTitle: 'Top up when you need it',
    packagesText: 'Your saved questions and study history stay available even when you are not buying new credits.',
    popular: 'Popular',
    loading: 'Redirecting...'
  },
  pl: {
    badge: 'Kredyty',
    subtitle: 'Wybierz jednorazowy pakiet kredytów. Bez abonamentu i bez ukrytych cyklicznych opłat.',
    loginTitle: 'Zaloguj się, żeby kupić kredyty',
    loginText: 'Użyj tego samego konta co w rozszerzeniu Chrome, a potem wybierz pakiet doładowania.',
    loginButton: 'Zaloguj się / Załóż konto',
    balanceLabel: 'Aktualne saldo',
    balanceText: 'Kredyty zużywają odpowiedzi AI, wyjaśnienia, follow-upy i FocusScan.',
    dashboardCta: 'Wróć do panelu',
    lowTitle: 'Mało kredytów',
    lowText: 'Twoje kredyty zaraz się skończą. Kup więcej, aby nie zabrakło ich podczas quizu.',
    packagesBadge: 'Pakiety jednorazowe',
    packagesTitle: 'Doładuj wtedy, gdy potrzebujesz',
    packagesText: 'Zapisane pytania i historia nauki zostają dostępne nawet wtedy, gdy nie kupujesz nowych kredytów.',
    popular: 'Popularne',
    loading: 'Przekierowanie...'
  }
};
