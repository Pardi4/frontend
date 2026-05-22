import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
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
            <a class="nav-link" [href]="pathFor('credits')" [class.active]="pageKey === 'credits'">{{ copy.nav.pricing }}</a>
            <a class="nav-link" [href]="pathFor('demo')" [class.active]="pageKey === 'demo'">
              {{ locale === 'pl' ? 'Demo' : 'Demo' }}
            </a>
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
              <a class="btn btn-outline btn-sm auth-action auth-login" [href]="authHref('login')" (click)="openAuthLink($event, 'login')">{{ copy.nav.login }}</a>
              <a class="btn btn-primary btn-sm auth-action auth-register" [href]="authHref('register')" (click)="openAuthLink($event, 'register')">{{ copy.nav.signup }}</a>
            </ng-container>

            <ng-template #userMenu>
              <button class="btn btn-outline btn-sm" type="button" (click)="goToCredits()">
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
                  <button class="btn btn-ghost btn-block" type="button" (click)="goToCredits()">
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
            <a class="nav-link" [href]="pathFor('credits')" [class.active]="pageKey === 'credits'" (click)="mobileMenuOpen.set(false)">{{ copy.nav.pricing }}</a>
            <a class="nav-link" [href]="pathFor('demo')" (click)="mobileMenuOpen.set(false)">Demo</a>
            <a class="nav-link" [href]="pathFor('quiz')" (click)="mobileMenuOpen.set(false)">
              {{ locale === 'pl' ? 'Historia i quiz' : 'History & quiz' }}
            </a>
            <div class="mobile-utility">
              <div class="mobile-lang-row" aria-label="Language">
                <a class="lang-option" [class.active]="locale === 'en'" [href]="alternatePath('en')" (click)="mobileMenuOpen.set(false)">EN</a>
                <a class="lang-option" [class.active]="locale === 'pl'" [href]="alternatePath('pl')" (click)="mobileMenuOpen.set(false)">PL</a>
              </div>

              <ng-container *ngIf="api.currentUser(); else mobileGuestActions">
                <div class="mobile-user-card">
                  <span class="avatar-btn">{{ userInitial(api.currentUser()) }}</span>
                  <div>
                    <strong>{{ api.currentUser()?.displayName || 'User' }}</strong>
                    <span>{{ api.currentUser()?.email }}</span>
                  </div>
                </div>
                <div class="mobile-actions">
                  <button class="btn btn-outline" type="button" (click)="goToDashboard()">{{ copy.common.dashboard }}</button>
                  <button class="btn btn-outline" type="button" (click)="goToCredits()">
                    {{ api.currentUser()?.role === 'admin' ? 'Unlimited' : (api.currentUser()?.credits || 0) + ' ' + copy.common.credits }}
                  </button>
                  <button class="btn btn-ghost" type="button" (click)="logout()">{{ copy.common.logout }}</button>
                </div>
              </ng-container>

              <ng-template #mobileGuestActions>
                <div class="mobile-actions">
                  <a class="btn btn-outline auth-action auth-login" [href]="authHref('login')" (click)="openAuthLink($event, 'login')">{{ copy.nav.login }}</a>
                  <a class="btn btn-primary auth-action auth-register" [href]="authHref('register')" (click)="openAuthLink($event, 'register')">{{ copy.nav.signup }}</a>
                </div>
              </ng-template>
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
                <a class="btn btn-outline btn-lg auth-action" [href]="authHref('register')" (click)="openAuthLink($event, 'register')">
                  {{ copy.common.createAccount }}
                </a>
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
              <a class="nav-link" [href]="pathFor('credits')">{{ copy.common.buyCredits }}</a>
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

    .auth-action {
      min-height: 2.45rem;
      border-radius: var(--radius-full);
      position: relative;
      isolation: isolate;
    }
    .auth-login {
      background: rgba(255, 255, 255, 0.035);
      border-color: rgba(255, 255, 255, 0.16);
    }
    .auth-login:hover {
      background: rgba(6, 182, 212, 0.09);
      border-color: var(--accent-cyan);
      color: var(--text-primary);
    }
    .auth-register {
      border: 1px solid rgba(255, 255, 255, 0.16);
      box-shadow: 0 6px 24px rgba(6, 182, 212, 0.18);
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
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      max-height: calc(100dvh - 5rem);
      background: rgba(3, 7, 18, 0.985);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
      z-index: 49;
      padding: 0.75rem 1rem 1rem;
      animation: fade-in 0.2s var(--ease-out);
      overflow-y: auto;
      overscroll-behavior: contain;
    }
    .mobile-menu-inner {
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
      max-width: 36rem;
      margin: 0 auto;
    }
    .mobile-menu .nav-link {
      display: flex;
      align-items: center;
      min-height: 3rem;
      padding: 0.75rem 1rem;
      border: 1px solid rgba(148, 163, 184, 0.14);
      border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.035);
      color: var(--text-primary);
      font-size: 1rem;
      font-weight: 750;
      line-height: 1.25;
      text-align: left;
    }
    .mobile-menu .nav-link::after {
      display: none;
    }
    .mobile-menu .nav-link:hover,
    .mobile-menu .nav-link.active {
      border-color: rgba(6, 182, 212, 0.35);
      background: rgba(6, 182, 212, 0.08);
      color: var(--accent-cyan);
    }
    .mobile-actions {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      margin-top: 0.35rem;
    }
    .mobile-actions .btn {
      min-height: 3rem;
      border-radius: var(--radius-md);
    }
    .mobile-utility {
      display: grid;
      gap: 0.75rem;
      margin-top: 0.35rem;
      padding-top: 0.75rem;
      border-top: 1px solid rgba(148, 163, 184, 0.14);
    }
    .mobile-lang-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
    }
    .mobile-lang-row .lang-option {
      min-height: 2.75rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(148, 163, 184, 0.14);
      border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.035);
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
    .mobile-lang-row .lang-option.active {
      background: rgba(6, 182, 212, 0.12);
      color: var(--accent-cyan);
      border-color: rgba(6, 182, 212, 0.35);
    }
    .mobile-user-card {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: 0.8rem;
      align-items: center;
      padding: 0.85rem 1rem;
      border: 1px solid rgba(148, 163, 184, 0.14);
      border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.035);
    }
    .mobile-user-card .avatar-btn {
      pointer-events: none;
      width: 2.5rem;
      height: 2.5rem;
      min-width: 2.5rem;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      align-self: center;
      line-height: 1;
    }
    .mobile-user-card strong,
    .mobile-user-card span {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .mobile-user-card strong {
      color: var(--text-primary);
      font-size: 0.95rem;
    }
    .mobile-user-card div > span {
      color: var(--text-tertiary);
      font-size: 0.8rem;
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
      .nav-container {
        height: 4.5rem;
      }
      .nav-brand {
        font-size: 1.25rem;
      }
      .nav-logo-icon {
        width: 2.25rem;
        height: 2.25rem;
      }
      .mobile-menu {
        max-height: calc(100dvh - 4.5rem);
      }
      .mobile-menu-inner {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.5rem;
      }
      .mobile-menu .nav-link {
        min-height: 2.65rem;
        padding: 0.65rem 0.75rem;
        font-size: 0.92rem;
      }
      .mobile-utility {
        grid-column: 1 / -1;
        gap: 0.6rem;
        padding-top: 0.6rem;
      }
      .mobile-actions {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .mobile-actions .btn {
        min-height: 2.65rem;
      }
      .mobile-actions .btn:only-child,
      .mobile-actions .btn:nth-child(3) {
        grid-column: 1 / -1;
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
export class ShellComponent implements OnInit, AfterViewInit, OnDestroy {
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
  private routerEventsSub?: Subscription;

  ngOnInit(): void {
    void this.api.restoreSession();

    if (!isPlatformBrowser(this.platformId)) return;

    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref && !this.referralCode) this.referralCode = ref.trim();

    if (this.shouldRedirectToPolish()) {
      this.markLanguageRedirected();
      void this.router.navigate(['/pl'], { queryParams: Object.fromEntries(params.entries()) });
      return;
    }

    this.openModalFromAuthQuery(params);
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.initScrollReveal();
    this.queueRevealScan();
    this.routerEventsSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.openModalFromAuthQuery(new URLSearchParams(window.location.search));
        this.queueRevealScan();
      }
    });
  }

  ngOnDestroy(): void {
    this.revealObserver?.disconnect();
    this.routerEventsSub?.unsubscribe();
  }

  private initScrollReveal(): void {
    if (typeof IntersectionObserver === 'undefined') {
      this.revealAll();
      return;
    }

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
    if (!this.revealObserver) {
      this.revealAll();
      return;
    }
    const elements = document.querySelectorAll('.reveal:not(.revealed)');
    elements.forEach((el) => {
      this.revealObserver?.observe(el);
    });
  }

  private queueRevealScan(): void {
    window.requestAnimationFrame(() => {
      this.scanAndObserveReveals();
      window.setTimeout(() => this.scanAndObserveReveals(), 150);
    });
  }

  private revealAll(): void {
    document.querySelectorAll('.reveal:not(.revealed)').forEach((el) => {
      el.classList.add('revealed');
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

  protected authHref(type: 'login' | 'register'): string {
    return `${pathFor(this.pageKey, this.locale)}?auth=${type}`;
  }

  protected userInitial(user: any): string {
    return (user?.displayName || user?.email || '?').charAt(0).toUpperCase();
  }

  protected openAuthLink(event: MouseEvent, type: 'login' | 'register'): void {
    event.preventDefault();
    this.openModal(type);
    this.stripAuthQueryParam();
  }

  openModal(type: 'login' | 'register'): void {
    this.authError.set('');
    this.mobileMenuOpen.set(false);
    this.activeModal.set(type);
  }

  closeModal(): void {
    this.activeModal.set(null);
  }

  private openModalFromAuthQuery(params: URLSearchParams): void {
    const auth = params.get('auth');
    if (auth !== 'login' && auth !== 'register') return;
    this.openModal(auth);
    this.stripAuthQueryParam();
  }

  private stripAuthQueryParam(): void {
    const url = new URL(window.location.href);
    if (!url.searchParams.has('auth')) return;
    url.searchParams.delete('auth');
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  }

  private shouldRedirectToPolish(): boolean {
    return this.pageKey === 'home'
      && window.location.pathname === '/'
      && navigator.language.toLowerCase().startsWith('pl')
      && !this.hasLanguageRedirected();
  }

  private hasLanguageRedirected(): boolean {
    try {
      return sessionStorage.getItem('lang_redirected') === 'true';
    } catch {
      return false;
    }
  }

  private markLanguageRedirected(): void {
    try {
      sessionStorage.setItem('lang_redirected', 'true');
    } catch {
      // Redirect still works; this only prevents repeated redirects on root.
    }
  }

  protected async goToDashboard(hash?: string): Promise<void> {
    this.dropdownOpen.set(false);
    this.mobileMenuOpen.set(false);
    const url = pathFor('dashboard', this.locale);
    await this.router.navigateByUrl(hash ? `${url}#${hash}` : url);
  }

  protected async goToCredits(): Promise<void> {
    this.dropdownOpen.set(false);
    this.mobileMenuOpen.set(false);
    await this.router.navigateByUrl(pathFor('credits', this.locale));
  }

  protected logout(): void {
    this.api.clearSession();
    this.dropdownOpen.set(false);
    this.mobileMenuOpen.set(false);
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
