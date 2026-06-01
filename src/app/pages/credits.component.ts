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

        <section class="credit-unit-card glass">
          <div>
            <p class="eyebrow">{{ copy.unitBadge }}</p>
            <h2>{{ copy.unitTitle }}</h2>
            <p class="text-secondary">{{ copy.unitText }}</p>
          </div>
          <ul>
            <li *ngFor="let item of copy.unitItems">{{ item }}</li>
          </ul>
        </section>

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
    .credit-unit-card {
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
      gap: 1.5rem;
      align-items: center;
      padding: 1.5rem 1.75rem;
      margin-bottom: 1rem;
      background: rgba(23, 28, 36, 0.72);
    }
    .credit-unit-card h2 {
      font-size: clamp(1.35rem, 3vw, 2rem);
      margin: 0.35rem 0 0.5rem;
    }
    .credit-unit-card p {
      margin: 0;
    }
    .credit-unit-card ul {
      display: grid;
      gap: 0.6rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .credit-unit-card li {
      position: relative;
      padding-left: 1.35rem;
      color: var(--text-secondary);
      font-weight: 650;
    }
    .credit-unit-card li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0.55em;
      width: 0.45rem;
      height: 0.45rem;
      border-radius: 999px;
      background: var(--accent-cyan);
      box-shadow: 0 0 12px rgba(6, 182, 212, 0.45);
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
      .credit-unit-card {
        grid-template-columns: 1fr;
        padding: 1.25rem;
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
    unitBadge: 'How credits work',
    unitTitle: '1 credit = 1 AI answer',
    unitText: 'A credit is the usage unit for QuizSolver. One visible quiz question sent to AI uses one credit and returns the suggested answer.',
    unitItems: ['Saved history and notes do not cost credits.', 'Kahoot Quiz ID mode does not use AI credits.', 'Extra follow-ups, explanations, or FocusScan requests count as new AI answers.'],
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
    unitBadge: 'Jak działają kredyty',
    unitTitle: '1 kredyt = 1 odpowiedź AI',
    unitText: 'Kredyt to jednostka użycia QuizSolvera. Jedno widoczne pytanie wysłane do AI zużywa jeden kredyt i zwraca sugerowaną odpowiedź.',
    unitItems: ['Zapisana historia i notatki nie zużywają kredytów.', 'Tryb Kahoot Quiz ID nie zużywa kredytów AI.', 'Dodatkowe follow-upy, wyjaśnienia lub FocusScan liczą się jako nowe odpowiedzi AI.'],
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
  unitBadge: 'So funktionieren Credits',
  unitTitle: '1 Credit = 1 KI-Antwort',
  unitText: 'Ein Credit ist die Nutzungseinheit von QuizSolver. Eine sichtbare Quizfrage, die an die KI gesendet wird, verbraucht einen Credit und liefert einen Antwortvorschlag.',
  unitItems: ['Gespeicherte Historie und Notizen kosten keine Credits.', 'Der Kahoot Quiz-ID-Modus verbraucht keine KI-Credits.', 'Zusätzliche Rückfragen, Erklärungen oder FocusScan-Anfragen zählen als neue KI-Antworten.'],
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
  unitBadge: 'Cómo funcionan los créditos',
  unitTitle: '1 crédito = 1 respuesta AI',
  unitText: 'Un crédito es la unidad de uso de QuizSolver. Una pregunta visible enviada a la IA consume un crédito y devuelve una respuesta sugerida.',
  unitItems: ['El historial y las notas guardadas no consumen créditos.', 'El modo Kahoot Quiz ID no usa créditos de IA.', 'Los seguimientos, explicaciones o FocusScan adicionales cuentan como nuevas respuestas de IA.'],
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
  unitBadge: 'Fonctionnement des crédits',
  unitTitle: '1 crédit = 1 réponse IA',
  unitText: 'Un crédit est l’unité d’utilisation de QuizSolver. Une question visible envoyée à l’IA consomme un crédit et renvoie une réponse suggérée.',
  unitItems: ['L’historique et les notes enregistrées ne consomment pas de crédits.', 'Le mode Kahoot Quiz ID n’utilise pas de crédits IA.', 'Les suivis, explications ou FocusScan supplémentaires comptent comme de nouvelles réponses IA.'],
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
  unitBadge: 'Come funzionano i crediti',
  unitTitle: '1 credito = 1 risposta AI',
  unitText: 'Un credito è l’unità di utilizzo di QuizSolver. Una domanda visibile inviata all’AI consuma un credito e restituisce una risposta suggerita.',
  unitItems: ['Cronologia e note salvate non consumano crediti.', 'La modalità Kahoot Quiz ID non usa crediti AI.', 'Follow-up, spiegazioni o FocusScan aggiuntivi contano come nuove risposte AI.'],
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
  unitBadge: 'Як працюють кредити',
  unitTitle: '1 кредит = 1 AI-відповідь',
  unitText: 'Кредит — це одиниця використання QuizSolver. Одне видиме питання, надіслане до AI, витрачає один кредит і повертає запропоновану відповідь.',
  unitItems: ['Збережена історія і нотатки не витрачають кредити.', 'Режим Kahoot Quiz ID не використовує AI-кредити.', 'Додаткові follow-up, пояснення або FocusScan рахуються як нові AI-відповіді.'],
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
