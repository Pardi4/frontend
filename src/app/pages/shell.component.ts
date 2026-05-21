import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Input, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { ApiService } from '../api.service';
import { CHROME_WEB_STORE_URL, Locale, PageKey, contentFor, pathFor } from '../site-content';

@Component({
  selector: 'qs-shell',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="site-shell" [attr.data-locale]="locale">
      <header class="site-header" role="banner">
        <div class="container nav-container">
          <a class="nav-brand" [href]="pathFor('home')" aria-label="QuizSolver home">
            <span class="nav-logo-icon" aria-hidden="true">QS</span>
            <span>QuizSolver</span>
          </a>

          <nav class="nav-links" aria-label="Main navigation">
            <a class="nav-link" [href]="homeHash('how-it-works')">{{ copy.nav.how }}</a>
            <a class="nav-link" [href]="homeHash('features')">{{ copy.nav.features }}</a>
            <a class="nav-link" [href]="homeHash('credits')">{{ copy.nav.pricing }}</a>
            <a class="nav-link" [href]="pathFor('quiz')" [class.active]="pageKey === 'quiz'">
              {{ locale === 'pl' ? 'Historia i quiz' : 'History & quiz' }}
            </a>
          </nav>

          <div class="nav-actions">
            <div class="nav-lang-switch" aria-label="Language">
              <a class="lang-option" [class.active]="locale === 'en'" [href]="alternatePath('en')">EN</a>
              <a class="lang-option" [class.active]="locale === 'pl'" [href]="alternatePath('pl')">PL</a>
            </div>

            <ng-container *ngIf="!api.currentUser(); else userMenu">
              <button class="btn btn-ghost btn-sm" type="button" (click)="openModal('login')">{{ copy.nav.login }}</button>
              <button class="btn btn-primary btn-sm" type="button" (click)="openModal('register')">{{ copy.nav.signup }}</button>
            </ng-container>

            <ng-template #userMenu>
              <button class="btn btn-outline btn-sm" type="button" (click)="goToDashboard('credits')">
                {{ api.currentUser()?.role === 'admin' ? '∞' : (api.currentUser()?.credits || 0) }} {{ copy.common.credits }}
              </button>
              <div class="user-menu-container">
                <button class="avatar-btn" type="button" (click)="dropdownOpen.set(!dropdownOpen())" aria-label="Account menu">
                  {{ userInitial(api.currentUser()) }}
                </button>
                <div class="dropdown-menu" *ngIf="dropdownOpen()">
                  <div class="dropdown-user">
                    <strong>{{ api.currentUser()?.displayName || 'User' }}</strong>
                    <span>{{ api.currentUser()?.email }}</span>
                  </div>
                  <button class="btn btn-ghost btn-block" type="button" (click)="goToDashboard()">
                    {{ copy.common.dashboard }}
                  </button>
                  <button class="btn btn-ghost btn-block" type="button" (click)="goToDashboard('credits')">
                    {{ copy.common.buyCredits }}
                  </button>
                  <button class="btn btn-ghost btn-block" type="button" (click)="logout()">
                    {{ copy.common.logout }}
                  </button>
                </div>
              </div>
            </ng-template>
          </div>

          <button class="hamburger" [class.open]="mobileMenuOpen()" type="button" (click)="mobileMenuOpen.set(!mobileMenuOpen())" [attr.aria-label]="copy.nav.toggle">
            <span></span><span></span><span></span>
          </button>
        </div>

        <nav class="mobile-menu" *ngIf="mobileMenuOpen()" aria-label="Mobile navigation">
          <div class="mobile-menu-inner">
            <a class="nav-link" [href]="homeHash('how-it-works')" (click)="mobileMenuOpen.set(false)">{{ copy.nav.how }}</a>
            <a class="nav-link" [href]="homeHash('features')" (click)="mobileMenuOpen.set(false)">{{ copy.nav.features }}</a>
            <a class="nav-link" [href]="homeHash('credits')" (click)="mobileMenuOpen.set(false)">{{ copy.nav.pricing }}</a>
            <a class="nav-link" [href]="pathFor('quiz')" (click)="mobileMenuOpen.set(false)">
              {{ locale === 'pl' ? 'Historia i quiz' : 'History & quiz' }}
            </a>
            <div class="mobile-actions" *ngIf="!api.currentUser()">
              <button class="btn btn-outline" type="button" (click)="openModal('login')">{{ copy.nav.login }}</button>
              <button class="btn btn-primary" type="button" (click)="openModal('register')">{{ copy.nav.signup }}</button>
            </div>
          </div>
        </nav>
      </header>

      <ng-content></ng-content>

      <section class="cta-section" *ngIf="pageKey !== 'dashboard' && pageKey !== 'quiz' && pageKey !== 'success'">
        <div class="container">
          <div class="cta-card">
            <div class="cta-glow"></div>
            <div class="relative z-10">
              <p class="eyebrow cta-eyebrow">{{ locale === 'pl' ? 'Gotowy do instalacji?' : 'Ready to install?' }}</p>
              <h2 class="cta-title">
                {{ locale === 'pl' ? 'Dodaj QuizSolver do Chrome i zacznij od pierwszego quizu.' : 'Add QuizSolver to Chrome and start with your first quiz.' }}
              </h2>
              <p class="cta-desc text-secondary">
                {{ locale === 'pl' ? 'Rozszerzenie, historia pytań, notatki i quiz z historii działają na jednym koncie.' : 'The extension, question history, notes, and history quiz all work from one account.' }}
              </p>
              <div class="cta-buttons">
                <a class="btn btn-primary btn-lg" [href]="storeUrl" target="_blank" rel="noopener">
                  {{ locale === 'pl' ? 'Otwórz Chrome Web Store' : 'Open Chrome Web Store' }}
                </a>
                <button class="btn btn-outline btn-lg" type="button" (click)="openModal('register')">
                  {{ copy.common.createAccount }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer class="site-footer" role="contentinfo">
        <div class="container footer-grid">
          <div class="footer-col">
            <a class="nav-brand" [href]="pathFor('home')">
              <span class="nav-logo-icon" aria-hidden="true">QS</span>
              <span>QuizSolver</span>
            </a>
            <p class="text-secondary footer-logo-desc">
              {{ locale === 'pl' ? 'Rozszerzenie Chrome do sugestii odpowiedzi, wyjaśnień, notatek i powtórek z historii pytań.' : 'Chrome extension for answer suggestions, explanations, notes, and practice from question history.' }}
            </p>
          </div>
          <div class="footer-col">
            <h4>{{ copy.footer.product }}</h4>
            <div class="footer-links">
              <a class="nav-link" [href]="homeHash('features')">{{ copy.nav.features }}</a>
              <a class="nav-link" [href]="pathFor('quiz')">{{ locale === 'pl' ? 'Historia i quiz' : 'History & quiz' }}</a>
              <a class="nav-link" [href]="pathFor('dashboard')">{{ copy.common.dashboard }}</a>
            </div>
          </div>
          <div class="footer-col">
            <h4>{{ copy.footer.seoPages }}</h4>
            <div class="footer-links">
              <a class="nav-link" [href]="pathFor('testportal')">Testportal</a>
              <a class="nav-link" [href]="pathFor('moodle')">Moodle</a>
              <a class="nav-link" [href]="pathFor('googleForms')">Google Forms</a>
              <a class="nav-link" [href]="pathFor('quizSolverAi')">AI quiz solver</a>
            </div>
          </div>
          <div class="footer-col">
            <h4>{{ copy.footer.legal }}</h4>
            <div class="footer-links">
              <a class="nav-link" [href]="pathFor('privacy')">{{ copy.footer.privacy }}</a>
              <span class="nav-link">support&#64;getquizsolver.com</span>
            </div>
          </div>
        </div>
        <div class="container footer-bottom">
          {{ copy.footer.rights }}
        </div>
      </footer>

      <div class="modal-overlay" *ngIf="activeModal()" (click)="closeModal()">
        <section class="modal-content" (click)="$event.stopPropagation()">
          <button class="modal-close" type="button" (click)="activeModal.set(null)" [attr.aria-label]="copy.common.close">×</button>

          <ng-container *ngIf="activeModal() === 'login'">
            <header class="modal-header">
              <h2>{{ copy.auth.loginTitle }}</h2>
              <p>{{ copy.auth.loginSubtitle }}</p>
            </header>
            <form (ngSubmit)="login()">
              <div class="form-group">
                <input class="form-input" type="email" name="email" [(ngModel)]="loginEmail" [placeholder]="copy.common.email" autocomplete="email" required>
              </div>
              <div class="form-group">
                <input class="form-input" type="password" name="password" [(ngModel)]="loginPassword" [placeholder]="copy.common.password" autocomplete="current-password" required>
              </div>
              <label class="check-row">
                <input type="checkbox" name="remember" [(ngModel)]="rememberMe">
                <span>{{ copy.common.rememberMe }}</span>
              </label>
              <div class="form-error" *ngIf="authError()">{{ authError() }}</div>
              <button class="btn btn-primary btn-block" type="submit" [disabled]="authLoading()">
                {{ authLoading() ? copy.common.loading : copy.common.signIn }}
              </button>
              <div class="form-switch">
                {{ copy.auth.showRegister }}
                <button type="button" (click)="openModal('register')">{{ copy.auth.showRegisterLink }}</button>
              </div>
            </form>
          </ng-container>

          <ng-container *ngIf="activeModal() === 'register'">
            <header class="modal-header">
              <h2>{{ copy.auth.registerTitle }}</h2>
              <p>
                {{ locale === 'pl' ? 'Kod polecenia jest opcjonalny. Osoba polecająca dostaje 5% kupionych przez Ciebie kredytów jako bonus.' : 'Referral code is optional. The referrer receives 5% of the credits you buy as a bonus.' }}
              </p>
            </header>
            <form (ngSubmit)="register()">
              <div class="form-group">
                <input class="form-input" type="text" name="name" [(ngModel)]="registerName" [placeholder]="copy.common.displayName" autocomplete="name" required>
              </div>
              <div class="form-group">
                <input class="form-input" type="email" name="email" [(ngModel)]="registerEmail" [placeholder]="copy.common.email" autocomplete="email" required>
              </div>
              <div class="form-group">
                <input class="form-input" type="password" name="password" [(ngModel)]="registerPassword" [placeholder]="copy.common.password" autocomplete="new-password" required>
              </div>
              <div class="form-group">
                <input class="form-input" type="text" name="referralCode" [(ngModel)]="referralCode" [placeholder]="copy.common.referralCode">
              </div>
              <div class="form-error" *ngIf="authError()">{{ authError() }}</div>
              <button class="btn btn-primary btn-block" type="submit" [disabled]="authLoading()">
                {{ authLoading() ? copy.common.loading : copy.common.createAccount }}
              </button>
              <div class="form-switch">
                {{ copy.auth.showLogin }}
                <button type="button" (click)="openModal('login')">{{ copy.auth.showLoginLink }}</button>
              </div>
            </form>
          </ng-container>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .site-shell {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .site-header {
      position: sticky;
      top: 0;
      z-index: 50;
      background: rgba(3, 7, 18, 0.75);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
      transition: all 0.3s;
    }

    .nav-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 5rem;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-family: var(--font-heading);
      font-size: 1.5rem;
      font-weight: 850;
      color: var(--text-primary);
      text-decoration: none;
    }
    .nav-logo-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: var(--radius-md);
      background: var(--grad-primary);
      box-shadow: 0 0 15px rgba(6, 182, 212, 0.4);
      color: #fff;
      font-weight: 800;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    /* Language switch */
    .nav-lang-switch {
      display: flex;
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-full);
      overflow: hidden;
      background: rgba(255,255,255,0.03);
    }
    .lang-option {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.25rem 0.625rem;
      color: var(--text-secondary);
      transition: all 0.2s;
    }
    .lang-option:hover {
      color: var(--text-primary);
    }
    .lang-option.active {
      background: var(--grad-primary);
      color: #fff;
    }

    /* User Menu & Dropdown */
    .user-menu-container {
      position: relative;
    }
    .avatar-btn {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: var(--radius-full);
      background: rgba(6, 182, 212, 0.1);
      border: 1px solid var(--border-hover);
      color: var(--accent-cyan);
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s var(--ease-out);
    }
    .avatar-btn:hover {
      box-shadow: 0 0 12px var(--glow-cyan);
      border-color: var(--accent-cyan);
    }
    .dropdown-menu {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      width: 260px;
      padding: 1.25rem;
      background: var(--bg-surface-solid);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg), 0 0 20px rgba(0,0,0,0.4);
      animation: scale-in 0.25s var(--ease-spring);
      z-index: 60;
    }
    .dropdown-user {
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border);
      text-align: left;
    }
    .dropdown-user strong {
      display: block;
      color: var(--text-primary);
      font-size: 0.95rem;
    }
    .dropdown-user span {
      display: block;
      color: var(--text-tertiary);
      font-size: 0.8rem;
      word-break: break-all;
    }
    .dropdown-menu .btn-ghost {
      text-align: left;
      justify-content: flex-start;
      margin-bottom: 0.25rem;
      font-size: 0.9rem;
    }

    /* Hamburger & Mobile Menu */
    .hamburger {
      display: none;
      flex-direction: column;
      gap: 5px;
      width: 24px;
      background: none;
      border: none;
      cursor: pointer;
      z-index: 51;
    }
    .hamburger span {
      display: block;
      width: 100%;
      height: 2px;
      background: var(--text-primary);
      border-radius: 1px;
      transition: all 0.3s;
    }
    .hamburger.open span:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }
    .hamburger.open span:nth-child(2) {
      opacity: 0;
    }
    .hamburger.open span:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }

    .mobile-menu {
      position: fixed;
      top: 5rem;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(3, 7, 18, 0.97);
      backdrop-filter: blur(15px);
      z-index: 49;
      padding: 2rem 1.5rem;
      animation: fade-in 0.3s;
      overflow-y: auto;
    }
    .mobile-menu-inner {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .mobile-menu .nav-link {
      font-size: 1.25rem;
      padding: 0.5rem 0;
      text-align: left;
    }
    .mobile-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 2rem;
    }

    /* CTA Section */
    .cta-section {
      padding: var(--section-py) 0;
    }
    .cta-card {
      position: relative;
      padding: 4.5rem 3rem;
      text-align: center;
      border-radius: var(--radius-2xl);
      overflow: hidden;
      border: 1px solid var(--border-strong);
      background: radial-gradient(circle at top right, rgba(6, 182, 212, 0.12), transparent 60%), var(--bg-surface);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }
    .cta-glow {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at center, rgba(139, 92, 246, 0.08) 0%, transparent 60%);
      pointer-events: none;
    }
    .cta-eyebrow {
      margin-bottom: 0.75rem;
    }
    .cta-title {
      font-size: clamp(1.75rem, 3.5vw, 2.5rem);
      font-weight: 800;
      margin-bottom: 1rem;
      line-height: 1.2;
    }
    .cta-desc {
      font-size: 1.125rem;
      max-width: 600px;
      margin: 0 auto 2.25rem;
    }
    .cta-buttons {
      display: flex;
      gap: 1.25rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    /* Footer */
    .site-footer {
      background: rgba(3, 7, 18, 0.9);
      border-top: 1px solid var(--border);
      padding: 5rem 0 2.5rem;
      margin-top: auto;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 2fr repeat(3, 1fr);
      gap: 3rem;
      margin-bottom: 4rem;
    }
    .footer-col h4 {
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 1.5rem;
      color: var(--text-primary);
    }
    .footer-logo-desc {
      max-width: 280px;
      font-size: 0.9rem;
      margin-top: 1rem;
      text-align: left;
    }
    .footer-links {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      text-align: left;
    }
    .footer-links .nav-link {
      font-size: 0.9rem;
      display: inline-block;
      width: fit-content;
    }
    .footer-bottom {
      border-top: 1px solid var(--border);
      padding-top: 2rem;
      text-align: center;
      font-size: 0.85rem;
      color: var(--text-tertiary);
    }

    /* Responsive */
    @media (max-width: 992px) {
      .footer-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 768px) {
      .nav-links, .nav-actions {
        display: none;
      }
      .hamburger {
        display: flex;
      }
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      .cta-card {
        padding: 3rem 1.5rem;
      }
    }
  `]
})
export class ShellComponent implements OnInit {
  @Input() locale: Locale = 'en';
  @Input() pageKey: PageKey = 'home';

  protected readonly storeUrl = CHROME_WEB_STORE_URL;
  protected readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  protected mobileMenuOpen = signal(false);
  protected dropdownOpen = signal(false);
  protected activeModal = signal<'login' | 'register' | null>(null);
  protected authLoading = signal(false);
  protected authError = signal('');

  protected loginEmail = '';
  protected loginPassword = '';
  protected rememberMe = true;
  protected registerName = '';
  protected registerEmail = '';
  protected registerPassword = '';
  protected referralCode = '';

  get copy(): any {
    return contentFor(this.locale);
  }

  private revealObserver?: IntersectionObserver;

  async ngOnInit(): Promise<void> {
    await this.api.restoreSession();

    if (!isPlatformBrowser(this.platformId)) return;

    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref && !this.referralCode) this.referralCode = ref.trim();

    if (this.pageKey === 'home' && window.location.pathname === '/' && navigator.language.startsWith('pl') && !sessionStorage.getItem('lang_redirected')) {
      sessionStorage.setItem('lang_redirected', 'true');
      await this.router.navigate(['/pl']);
    }

    // Scroll reveal initialization
    this.initScrollReveal();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => this.scanAndObserveReveals(), 200);
      }
    });
  }

  private initScrollReveal(): void {
    if (typeof IntersectionObserver === 'undefined') return;

    this.revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          this.revealObserver?.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -40px 0px'
    });

    this.scanAndObserveReveals();
  }

  private scanAndObserveReveals(): void {
    if (!this.revealObserver) return;
    const elements = document.querySelectorAll('.reveal:not(.revealed)');
    elements.forEach((el) => {
      this.revealObserver?.observe(el);
    });
  }

  protected pathFor(key: PageKey): string {
    return pathFor(key, this.locale);
  }

  protected alternatePath(targetLocale: Locale): string {
    return pathFor(this.pageKey, targetLocale);
  }

  protected homeHash(hash: string): string {
    return `${pathFor('home', this.locale)}#${hash}`;
  }

  protected userInitial(user: any): string {
    return (user?.displayName || user?.email || '?').charAt(0).toUpperCase();
  }

  openModal(type: 'login' | 'register'): void {
    this.authError.set('');
    this.mobileMenuOpen.set(false);
    this.activeModal.set(type);
  }

  closeModal(): void {
    this.activeModal.set(null);
  }

  protected async goToDashboard(hash?: string): Promise<void> {
    this.dropdownOpen.set(false);
    const url = pathFor('dashboard', this.locale);
    await this.router.navigateByUrl(hash ? `${url}#${hash}` : url);
  }

  protected logout(): void {
    this.api.clearSession();
    this.dropdownOpen.set(false);
    this.router.navigateByUrl(pathFor('home', this.locale));
  }

  protected async login(): Promise<void> {
    this.authError.set('');
    this.authLoading.set(true);
    const result = await this.api.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: this.loginEmail, password: this.loginPassword, rememberMe: this.rememberMe })
    });
    this.authLoading.set(false);

    if (result.success && result.token) {
      this.api.setSession(result.token, result.user);
      this.closeModal();
      if (this.pageKey === 'home') await this.goToDashboard();
      return;
    }

    this.authError.set(result.error || (this.locale === 'pl' ? 'Logowanie nie powiodło się.' : 'Login failed.'));
  }

  protected async register(): Promise<void> {
    this.authError.set('');
    this.authLoading.set(true);
    const result = await this.api.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: this.registerEmail,
        password: this.registerPassword,
        displayName: this.registerName,
        referralCode: this.referralCode || undefined
      })
    });
    this.authLoading.set(false);

    if (result.success && result.token) {
      this.api.setSession(result.token, result.user);
      this.closeModal();
      await this.goToDashboard();
      return;
    }

    this.authError.set(result.error || (this.locale === 'pl' ? 'Rejestracja nie powiodło się.' : 'Registration failed.'));
  }
}
