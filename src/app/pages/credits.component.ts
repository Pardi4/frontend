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
      <div class="container credits-main">
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

          <section class="payment-error glass" *ngIf="buyError()">
            {{ buyError() }}
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
      </div>
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
    .payment-error {
      padding: 1rem 1.25rem;
      margin-bottom: 2rem;
      border-color: rgba(244, 63, 94, 0.35);
      background: rgba(244, 63, 94, 0.08);
      color: var(--accent-rose);
      font-weight: 700;
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
  protected readonly buyError = signal('');

  protected locale: Locale = 'en';
  protected data = pageData('credits', 'en');
  protected copy = CREDITS_COPY.en;

  protected readonly packs = [
    {
      id: 'starter',
      price: '$1.99',
      name: { en: '100 credits', pl: '100 kredytów', de: '100 Credits', es: '100 créditos', fr: '100 crédits', it: '100 crediti', uk: '100 кредитів' },
      caption: { en: 'Small one-time top-up', pl: 'Małe jednorazowe doładowanie', de: 'Kleine einmalige Aufladung', es: 'Recarga pequeña', fr: 'Petite recharge unique', it: 'Piccola ricarica una tantum', uk: 'Мале одноразове поповнення' },
      button: { en: 'Buy 100 credits', pl: 'Kup 100 kredytów', de: '100 Credits kaufen', es: 'Comprar 100 créditos', fr: 'Acheter 100 crédits', it: 'Compra 100 crediti', uk: 'Купити 100 кредитів' }
    },
    {
      id: 'popular',
      price: '$4.99',
      name: { en: '500 credits', pl: '500 kredytów', de: '500 Credits', es: '500 créditos', fr: '500 crédits', it: '500 crediti', uk: '500 кредитів' },
      caption: { en: 'Best for regular use', pl: 'Najlepsze do regularnego użycia', de: 'Am besten für regelmäßige Nutzung', es: 'Ideal para uso regular', fr: 'Idéal pour usage régulier', it: 'Ideale per uso regolare', uk: 'Найкраще для регулярного використання' },
      button: { en: 'Buy 500 credits', pl: 'Kup 500 kredytów', de: '500 Credits kaufen', es: 'Comprar 500 créditos', fr: 'Acheter 500 crédits', it: 'Compra 500 crediti', uk: 'Купити 500 кредитів' }
    },
    {
      id: 'pro',
      price: '$9.99',
      name: { en: '2000 credits', pl: '2000 kredytów', de: '2000 Credits', es: '2000 créditos', fr: '2000 crédits', it: '2000 crediti', uk: '2000 кредитів' },
      caption: { en: 'Large sessions and sharing', pl: 'Większe sesje i udostępnianie', de: 'Große Lernsessions und Teilen', es: 'Sesiones grandes y compartir', fr: 'Grandes sessions et partage', it: 'Sessioni grandi e condivisione', uk: 'Великі сесії та спільний доступ' },
      button: { en: 'Buy 2000 credits', pl: 'Kup 2000 kredytów', de: '2000 Credits kaufen', es: 'Comprar 2000 créditos', fr: 'Acheter 2000 crédits', it: 'Compra 2000 crediti', uk: 'Купити 2000 кредитів' }
    }
  ];

  async ngOnInit(): Promise<void> {
    this.locale = (this.route.snapshot.data['locale'] || 'en') as Locale;
    this.data = pageData('credits', this.locale);
    this.copy = CREDITS_COPY[this.locale] || CREDITS_COPY.en;
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
    this.buyError.set('');
    this.buying.set(pack);
    const result = await this.api.request('/api/credits/buy', {
      method: 'POST',
      body: JSON.stringify({ pack })
    });
    this.buying.set('');
    if (result.success && result.checkoutUrl) window.location.href = result.checkoutUrl;
    else this.buyError.set(result.error || this.copy.paymentError);
  }
}

const CREDITS_COPY: Partial<Record<Locale, any>> & { en: any; pl: any } = {
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
    loading: 'Redirecting...',
    paymentError: 'Payments are temporarily unavailable. Try again later.'
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
    loading: 'Przekierowanie...',
    paymentError: 'Płatności są chwilowo niedostępne. Spróbuj ponownie później.'
  }
};

CREDITS_COPY.de = {
  badge: 'Credits',
  subtitle: 'Wähle ein einmaliges Credit-Paket. Kein Abo und keine versteckten Gebühren.',
  loginTitle: 'Einloggen, um Credits zu kaufen',
  loginText: 'Nutze dasselbe Konto wie in der Chrome-Erweiterung und wähle dann ein Paket.',
  loginButton: 'Einloggen / Registrieren',
  balanceLabel: 'Aktuelles Guthaben',
  balanceText: 'Credits werden für KI-Antworten, Erklärungen, Rückfragen und FocusScan verwendet.',
  dashboardCta: 'Zurück zum Dashboard',
  lowTitle: 'Wenig Credits',
  lowText: 'Deine Credits sind fast aufgebraucht. Kaufe mehr, damit sie im Quiz nicht ausgehen.',
  packagesBadge: 'Einmalpakete',
  packagesTitle: 'Aufladen, wenn du es brauchst',
  packagesText: 'Gespeicherte Fragen und Lernhistorie bleiben verfügbar, auch wenn du keine neuen Credits kaufst.',
  popular: 'Beliebt',
  loading: 'Weiterleitung...',
  paymentError: 'Zahlungen sind vorübergehend nicht verfügbar. Versuche es später erneut.'
};
CREDITS_COPY.es = {
  badge: 'Créditos',
  subtitle: 'Elige un paquete único de créditos. Sin suscripción ni cargos ocultos.',
  loginTitle: 'Inicia sesión para comprar créditos',
  loginText: 'Usa la misma cuenta que en la extensión Chrome y elige un paquete.',
  loginButton: 'Entrar / Registrarse',
  balanceLabel: 'Saldo actual',
  balanceText: 'Los créditos se usan para respuestas AI, explicaciones, preguntas extra y FocusScan.',
  dashboardCta: 'Volver al panel',
  lowTitle: 'Pocos créditos',
  lowText: 'Tus créditos están por terminarse. Compra más para no quedarte sin ellos durante un quiz.',
  packagesBadge: 'Paquetes únicos',
  packagesTitle: 'Recarga cuando lo necesites',
  packagesText: 'Tus preguntas guardadas y el historial siguen disponibles aunque no compres créditos.',
  popular: 'Popular',
  loading: 'Redirigiendo...',
  paymentError: 'Los pagos no están disponibles temporalmente. Inténtalo más tarde.'
};
CREDITS_COPY.fr = {
  badge: 'Crédits',
  subtitle: 'Choisissez un pack de crédits unique. Sans abonnement ni frais cachés.',
  loginTitle: 'Connectez-vous pour acheter des crédits',
  loginText: 'Utilisez le même compte que dans l’extension Chrome, puis choisissez un pack.',
  loginButton: 'Connexion / Inscription',
  balanceLabel: 'Solde actuel',
  balanceText: 'Les crédits servent aux réponses IA, explications, suivis et FocusScan.',
  dashboardCta: 'Retour au tableau',
  lowTitle: 'Solde faible',
  lowText: 'Vos crédits sont presque épuisés. Achetez-en pour ne pas manquer pendant un quiz.',
  packagesBadge: 'Packs uniques',
  packagesTitle: 'Rechargez quand nécessaire',
  packagesText: 'Vos questions sauvegardées et votre historique restent disponibles.',
  popular: 'Populaire',
  loading: 'Redirection...',
  paymentError: 'Les paiements sont temporairement indisponibles. Réessayez plus tard.'
};
CREDITS_COPY.it = {
  badge: 'Crediti',
  subtitle: 'Scegli un pacchetto di crediti una tantum. Nessun abbonamento o costo nascosto.',
  loginTitle: 'Accedi per comprare crediti',
  loginText: 'Usa lo stesso account dell’estensione Chrome e scegli un pacchetto.',
  loginButton: 'Accedi / Registrati',
  balanceLabel: 'Saldo attuale',
  balanceText: 'I crediti servono per risposte AI, spiegazioni, follow-up e FocusScan.',
  dashboardCta: 'Torna alla dashboard',
  lowTitle: 'Pochi crediti',
  lowText: 'I tuoi crediti stanno per finire. Comprane altri per non restare senza durante un quiz.',
  packagesBadge: 'Pacchetti una tantum',
  packagesTitle: 'Ricarica quando serve',
  packagesText: 'Domande salvate e cronologia restano disponibili anche senza nuovi acquisti.',
  popular: 'Popolare',
  loading: 'Reindirizzamento...',
  paymentError: 'I pagamenti sono temporaneamente non disponibili. Riprova più tardi.'
};
CREDITS_COPY.uk = {
  badge: 'Кредити',
  subtitle: 'Обери одноразовий пакет кредитів. Без підписки і прихованих платежів.',
  loginTitle: 'Увійди, щоб купити кредити',
  loginText: 'Використай той самий акаунт, що й у Chrome-розширенні, і вибери пакет.',
  loginButton: 'Увійти / Зареєструватися',
  balanceLabel: 'Поточний баланс',
  balanceText: 'Кредити використовуються для AI-відповідей, пояснень, follow-up і FocusScan.',
  dashboardCta: 'Назад до панелі',
  lowTitle: 'Мало кредитів',
  lowText: 'Кредити майже закінчилися. Купи більше, щоб їх вистачило під час квізу.',
  packagesBadge: 'Одноразові пакети',
  packagesTitle: 'Поповнюй, коли потрібно',
  packagesText: 'Збережені питання та історія навчання залишаються доступними.',
  popular: 'Популярне',
  loading: 'Переадресація...',
  paymentError: 'Платежі тимчасово недоступні. Спробуй пізніше.'
};
