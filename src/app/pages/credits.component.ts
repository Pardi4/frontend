import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, AfterViewInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { SeoService } from '../seo.service';
import { CurrencyService } from '../currency.service';
import { Locale, pageData, pathFor } from '../site-content';
import { ShellComponent, trackGa4Event } from './shell.component';

@Component({
  standalone: true,
  imports: [CommonModule, ShellComponent],
  template: `
    <qs-shell #shell [locale]="locale" pageKey="credits">
      <div class="container credits-main">
        
        <!-- Hero Header: Compact & above-the-fold -->
        <header class="credits-hero">
          <div class="hero-top-row">
            <p class="eyebrow">{{ copy.badge }}</p>

            <!-- Compact Balance Badge for logged in users -->
            <div *ngIf="api.currentUser()" class="balance-pill glass">
              <span class="balance-dot"></span>
              <span class="balance-pill-label">{{ copy.balanceLabel }}:</span>
              <strong class="balance-pill-val text-gradient-strong">
                {{ api.currentUser()?.role === 'admin' ? '∞' : (api.currentUser()?.credits || 0) }}
              </strong>
              <a class="balance-dash-link" [href]="dashboardPath()" [title]="copy.dashboardCta">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </div>
          </div>

          <h1>{{ copy.pageHeading || data.title }}</h1>
          <p class="desc text-secondary">{{ copy.subtitle }}</p>

          <!-- Inline Low Credit Alert -->
          <div class="low-credit-chip glass" *ngIf="lowCredits()">
            <span class="warning-icon">⚠️</span>
            <span><strong>{{ copy.lowTitle }}:</strong> {{ copy.lowText }}</span>
          </div>
        </header>

        <!-- Trust Ribbon: 3 core guarantees right below header -->
        <section class="trust-ribbon glass">
          <div class="trust-item" *ngFor="let badge of trustBadges">
            <span class="trust-icon" [innerHTML]="badge.icon"></span>
            <span class="trust-text">{{ badge.text }}</span>
          </div>
        </section>

        <!-- FIRST TOP-UP PROMO BANNER with Countdown Timer (Only for users who never topped up) -->
        <section class="first-topup-banner glass" *ngIf="isFirstPurchasePromoEligible">
          <div class="promo-glow"></div>
          <div class="promo-content">
            <div class="promo-left">
              <div class="promo-badge-pill">
                <span class="fire-icon">🔥</span>
                <span>{{ promoCopy.badge }}</span>
              </div>
              <div class="promo-text-block">
                <h3 class="promo-headline">{{ promoCopy.title }}</h3>
                <p class="promo-sub">{{ promoCopy.subtitle }}</p>
              </div>
            </div>

            <div class="promo-right">
              <!-- Interactive Click-to-copy code button -->
              <button type="button" class="promo-code-btn" (click)="copyPromoCode()" [title]="promoCopy.clickToCopy">
                <span class="code-label">{{ promoCopy.codeLabel }}</span>
                <span class="code-val">WELCOME10</span>
                <span class="code-action-tag" [class.copied]="codeCopied()">
                  {{ codeCopied() ? promoCopy.copied : promoCopy.copyBtn }}
                </span>
              </button>

              <!-- Real-time FOMO Countdown Timer -->
              <div class="promo-timer-box">
                <span class="timer-label">{{ promoCopy.timerLabel }}</span>
                <div class="timer-digits">
                  <span class="digit-chunk">{{ timerMinutes }}</span>
                  <span class="digit-sep">:</span>
                  <span class="digit-chunk">{{ timerSeconds }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Payment Error Alert (if any) -->
        <section class="payment-error glass" *ngIf="buyError()">
          {{ buyError() }}
        </section>

        <!-- MAIN PRICING DECK: Front & center, immediately visible without scrolling! -->
        <section id="pricing" class="packages-section">
          <div class="packages-deck">
            <article class="package-card glass glass-hover" *ngFor="let pack of packs" [class.featured]="pack.id === 'popular'">
              <span *ngIf="pack.badge" class="featured-badge">{{ pack.badge[locale] || pack.badge['en'] }}</span>

              <!-- Package Role Title -->
              <h3 class="pack-role-title">{{ pack.name[locale] }}</h3>

              <!-- Clear Credit Count as Hero of Card -->
              <div class="pack-credits-header">
                <div class="pack-credits-number text-gradient-strong">{{ pack.credits }}</div>
                <div class="pack-credits-label">{{ copy.creditsUnitLabel }}</div>
              </div>

              <!-- Price & Unit Rate Calculation -->
              <div class="pack-pricing-block">
                <div class="pack-price-row">
                  <span class="pack-price">{{ pack.price }}</span>
                  <span *ngIf="getApproxCurrencyPrice(pack.price)" class="pack-price-approx">{{ getApproxCurrencyPrice(pack.price) }}</span>
                </div>
                <div class="pack-rate text-secondary" [class.highlight]="pack.id === 'popular' || pack.id === 'pro'">
                  {{ pack.rateInfo[locale] }}
                </div>
              </div>

              <!-- Tangible Academic Outcome: Passed Exams & Peace of Mind -->
              <p class="pack-outcome">
                {{ pack.outcome[locale] }}
              </p>

              <!-- Relatable Global Cost Comparison Chip -->
              <div class="pack-comparison-chip">
                {{ pack.comparison[locale] }}
              </div>

              <div class="pack-social-proof" *ngIf="pack.socialText">
                <span class="pulse-dot"></span> {{ pack.socialText[locale] }}
              </div>

              <button class="btn btn-block" 
                      [class.btn-primary]="pack.id === 'popular'" 
                      [class.btn-outline]="pack.id !== 'popular'" 
                      type="button" 
                      (click)="confirmPack(pack.id, shell)" 
                      [disabled]="buying() === pack.id">
                {{ buying() === pack.id ? copy.loading : pack.button[locale] }}
              </button>
            </article>
          </div>

          <!-- Live Currency Conversion Footnote -->
          <p class="currency-note text-secondary" *ngIf="currencyNote">
            {{ currencyNote }}
          </p>

          <!-- Guest reassurance if not logged in -->
          <div class="guest-reassurance-bar glass" *ngIf="!api.currentUser()">
            <span>{{ copy.guestReassurance }}</span>
            <button class="btn btn-primary btn-sm" type="button" (click)="shell.openModal('register')">
              {{ copy.guestRegisterLink }}
            </button>
          </div>
        </section>

        <!-- Value Comparison: Persuasive framing vs expensive tutoring -->
        <section class="value-comparison glass">
          <p class="eyebrow">{{ valueComp.badge }}</p>
          <h2>{{ valueComp.title }}</h2>
          <div class="value-grid">
            <div class="value-item">
              <span class="value-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"/></svg></span>
              <div class="value-details">
                <strong>{{ valueComp.tutor }}</strong>
                <span class="text-secondary">{{ valueComp.tutorPrice }}</span>
              </div>
            </div>
            <div class="value-item value-vs">
              <span class="vs-badge">vs</span>
            </div>
            <div class="value-item value-highlight">
              <span class="value-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></span>
              <div class="value-details">
                <strong>{{ valueComp.qs }}</strong>
                <span class="text-gradient-strong">{{ valueComp.qsPrice }}</span>
              </div>
            </div>
          </div>
          <p class="value-note text-secondary">{{ valueComp.note }}</p>
        </section>

        <!-- Credit Unit Card: Transparent consumption rules -->
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

        <!-- Referral Banner -->
        <section class="referral-banner glass" *ngIf="api.currentUser()">
          <div class="referral-banner-content">
            <div class="referral-banner-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div class="referral-banner-text">
              <h3>{{ referralCopy.title }}</h3>
              <p class="text-secondary">{{ referralCopy.text }}</p>
            </div>
            <a class="btn btn-outline btn-sm" [href]="pathFor('dashboard', locale)">{{ referralCopy.button }}</a>
          </div>
        </section>

        <!-- FAQ Section -->
        <section class="credits-faq" *ngIf="faqItems().length">
          <div class="section-header compact">
            <p class="eyebrow">FAQ</p>
            <h2>{{ label('faqTitle') }}</h2>
          </div>
          <div class="faq-grid">
            <article class="faq-item glass" *ngFor="let item of faqItems()">
              <h3>{{ item.question }}</h3>
              <p class="text-secondary">{{ item.answer }}</p>
            </article>
          </div>
        </section>

        <!-- Checkout Confirmation Modal with Payment Provider & Mandatory Digital Consent -->
        <div class="checkout-confirm-backdrop" *ngIf="pendingPack()" (click)="cancelCheckout()">
          <section class="checkout-confirm glass" (click)="$event.stopPropagation()">
            <p class="eyebrow">{{ label('confirmBadge') }}</p>
            <h2>{{ label('confirmTitle') }}</h2>
            <p class="text-secondary">{{ label('confirmText') }}</p>

            <!-- Selected Pack Header Summary -->
            <div class="confirm-pack-summary glass" *ngIf="selectedPackDetails as pack">
              <div class="summary-pack-title">
                <strong>{{ pack.name[locale] || pack.name.en }}</strong>
                <span class="summary-pack-credits">{{ pack.credits }} {{ copy.creditsUnitLabel || 'credits' }}</span>
              </div>
              <div class="summary-pack-price">
                <span class="price-usd">{{ pack.price }}</span>
                <span class="price-local" *ngIf="getApproxCurrencyPrice(pack.price)">({{ getApproxCurrencyPrice(pack.price) }})</span>
              </div>
            </div>

            <div class="confirm-email">
              <span>{{ label('confirmEmailLabel') }}</span>
              <code>{{ api.currentUser()?.email }}</code>
            </div>

            <!-- First purchase promo chip if eligible -->
            <div class="confirm-promo-applied" *ngIf="isFirstPurchasePromoEligible">
              <span class="promo-badge">WELCOME10</span>
              <span>{{ promoCopy.checkoutApplied }}</span>
            </div>

            <!-- Payment Provider Selector (DPay vs Lemon Squeezy) -->
            <div class="provider-selector-wrap">
              <span class="selector-title">{{ checkoutProviderCopy.title }}</span>
              <div class="provider-cards-grid">
                <!-- DPay Option -->
                <button
                  type="button"
                  class="provider-card glass"
                  [class.active]="selectedProvider() === 'dpay'"
                  (click)="selectedProvider.set('dpay')"
                >
                  <div class="provider-radio">
                    <span class="radio-dot" *ngIf="selectedProvider() === 'dpay'"></span>
                  </div>
                  <div class="provider-info">
                    <div class="provider-heading">
                      <strong>{{ checkoutProviderCopy.dpayTitle }}</strong>
                      <span class="provider-badge-tag" *ngIf="locale === 'pl'">{{ checkoutProviderCopy.dpayBadge }}</span>
                    </div>
                    <span class="provider-sub">{{ checkoutProviderCopy.dpaySubtitle }}</span>
                  </div>
                </button>

                <!-- Lemon Squeezy Option -->
                <button
                  type="button"
                  class="provider-card glass"
                  [class.active]="selectedProvider() === 'lemonsqueezy'"
                  (click)="selectedProvider.set('lemonsqueezy')"
                >
                  <div class="provider-radio">
                    <span class="radio-dot" *ngIf="selectedProvider() === 'lemonsqueezy'"></span>
                  </div>
                  <div class="provider-info">
                    <div class="provider-heading">
                      <strong>{{ checkoutProviderCopy.lemonTitle }}</strong>
                    </div>
                    <span class="provider-sub">{{ checkoutProviderCopy.lemonSubtitle }}</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- Mandatory Legal Digital Waiver Checkbox -->
            <div class="legal-consent-card glass" [class.checked]="digitalConsent()">
              <label class="consent-checkbox-row">
                <input
                  type="checkbox"
                  class="consent-native-check"
                  [checked]="digitalConsent()"
                  (change)="digitalConsent.set(!digitalConsent())"
                />
                <span class="consent-text-flow">
                  <strong>{{ checkoutProviderCopy.consentTitle }}</strong>
                  {{ checkoutProviderCopy.consentStatement }}
                  <a [href]="pathFor('terms', locale)" target="_blank" class="terms-inline-link" (click)="$event.stopPropagation()">{{ checkoutProviderCopy.consentTermsLink }}</a>.
                </span>
              </label>
            </div>

            <div class="consent-warning" *ngIf="!digitalConsent()">
              {{ checkoutProviderCopy.consentRequiredNote }}
            </div>

            <div class="confirm-error-banner" *ngIf="buyError()">
              {{ buyError() }}
            </div>

            <div class="confirm-actions">
              <button class="btn btn-outline" type="button" (click)="cancelCheckout()">{{ label('confirmBack') }}</button>
              <button
                class="btn btn-primary"
                type="button"
                (click)="continueCheckout()"
                [disabled]="!digitalConsent() || !!buying()"
              >
                {{ buying() ? copy.loading : label('confirmContinue') }}
              </button>
            </div>
          </section>
        </div>

      </div>
    </qs-shell>
  `,
  styles: [`
    .credits-main {
      padding-bottom: 5rem;
    }
    .credits-hero {
      padding: 2.75rem 0 1.25rem;
      text-align: center;
    }
    .hero-top-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 0.25rem;
      flex-wrap: wrap;
    }
    .hero-top-row .eyebrow {
      margin: 0;
    }
    .balance-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.35rem 0.85rem;
      border-radius: var(--radius-full);
      font-size: 0.85rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .balance-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--accent-cyan);
      box-shadow: 0 0 8px var(--accent-cyan);
    }
    .balance-pill-label {
      color: var(--text-secondary);
      font-weight: 600;
    }
    .balance-pill-val {
      font-family: var(--font-heading);
      font-weight: 850;
      font-size: 1.05rem;
    }
    .balance-dash-link {
      display: flex;
      align-items: center;
      color: var(--text-secondary);
      transition: color 0.2s ease;
      margin-left: 0.15rem;
    }
    .balance-dash-link:hover {
      color: var(--accent-cyan);
    }
    .credits-hero h1 {
      font-size: clamp(2.2rem, 5vw, 3.4rem);
      margin: 0.4rem 0 0.5rem;
      line-height: 1.15;
    }
    .credits-hero .desc {
      max-width: 650px;
      margin: 0 auto;
      font-size: 1.05rem;
      line-height: 1.5;
    }
    .low-credit-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.45rem 1rem;
      border-radius: var(--radius-full);
      margin-top: 1rem;
      border-color: rgba(245, 158, 11, 0.35);
      background: rgba(245, 158, 11, 0.1);
      color: var(--text-primary);
      font-size: 0.88rem;
    }
    .low-credit-chip strong {
      color: var(--accent-amber);
    }

    /* Trust Ribbon */
    .trust-ribbon {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2.25rem;
      flex-wrap: wrap;
      padding: 0.85rem 1.5rem;
      margin: 1.25rem auto 2.25rem;
      border-radius: var(--radius-lg);
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      max-width: 900px;
    }
    .trust-item {
      display: flex;
      align-items: center;
      gap: 0.55rem;
      font-size: 0.88rem;
      font-weight: 650;
      color: var(--text-secondary);
    }
    .trust-icon {
      display: flex;
      align-items: center;
      color: var(--accent-cyan);
      flex-shrink: 0;
    }

    /* First Top-up Promo Banner */
    .first-topup-banner {
      position: relative;
      margin: 1.5rem auto 2.25rem;
      max-width: 1100px;
      padding: 1.35rem 2rem;
      border-radius: var(--radius-xl);
      border: 1px solid rgba(245, 158, 11, 0.4);
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.09) 0%, rgba(139, 92, 246, 0.09) 100%);
      box-shadow: 0 10px 30px -10px rgba(245, 158, 11, 0.25);
      overflow: hidden;
    }
    .promo-glow {
      position: absolute;
      top: -50%;
      left: -20%;
      width: 60%;
      height: 200%;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%);
      pointer-events: none;
    }
    .promo-content {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .promo-left {
      flex: 1;
      min-width: 260px;
    }
    .promo-badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.75rem;
      font-weight: 850;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #fbbf24;
      background: rgba(245, 158, 11, 0.16);
      border: 1px solid rgba(245, 158, 11, 0.3);
      padding: 0.2rem 0.65rem;
      border-radius: var(--radius-full);
      margin-bottom: 0.35rem;
    }
    .promo-headline {
      font-family: var(--font-heading);
      font-size: 1.25rem;
      font-weight: 850;
      margin: 0.2rem 0 0.25rem;
      color: var(--text-primary);
    }
    .promo-sub {
      margin: 0;
      font-size: 0.88rem;
      color: var(--text-secondary);
      line-height: 1.45;
    }
    .promo-right {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .promo-code-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.65rem;
      background: rgba(0, 0, 0, 0.45);
      border: 1.5px dashed rgba(245, 158, 11, 0.65);
      border-radius: var(--radius-lg);
      padding: 0.55rem 0.95rem;
      cursor: pointer;
      color: var(--text-primary);
      transition: all 0.2s ease;
    }
    .promo-code-btn:hover {
      background: rgba(245, 158, 11, 0.15);
      border-color: #fbbf24;
      transform: translateY(-1px);
    }
    .code-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-secondary);
      font-weight: 700;
    }
    .code-val {
      font-family: var(--font-mono, monospace);
      font-weight: 900;
      font-size: 1.05rem;
      color: #fbbf24;
      letter-spacing: 0.05em;
    }
    .code-action-tag {
      font-size: 0.72rem;
      font-weight: 800;
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-sm);
      background: rgba(255, 255, 255, 0.08);
      color: var(--text-secondary);
      transition: all 0.2s ease;
    }
    .code-action-tag.copied {
      background: rgba(16, 185, 129, 0.25);
      color: #34d399;
    }
    .promo-timer-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: var(--radius-lg);
      padding: 0.45rem 0.85rem;
      min-width: 90px;
    }
    .timer-label {
      font-size: 0.68rem;
      font-weight: 750;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-secondary);
      margin-bottom: 0.15rem;
    }
    .timer-digits {
      display: flex;
      align-items: center;
      gap: 0.2rem;
      font-family: var(--font-mono, monospace);
      font-size: 1.15rem;
      font-weight: 900;
      color: #f43f5e;
      line-height: 1;
    }
    .digit-chunk {
      background: rgba(244, 63, 94, 0.12);
      padding: 0.15rem 0.35rem;
      border-radius: var(--radius-sm);
      border: 1px solid rgba(244, 63, 94, 0.25);
    }
    .digit-sep {
      animation: blink 1s infinite;
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    .confirm-promo-applied {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.65rem 0.95rem;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: var(--radius-md);
      color: #34d399;
      font-size: 0.86rem;
      font-weight: 650;
      margin: 0.85rem 0;
    }
    .confirm-promo-applied .promo-badge {
      font-family: var(--font-mono, monospace);
      font-weight: 850;
      background: rgba(16, 185, 129, 0.25);
      padding: 0.15rem 0.45rem;
      border-radius: var(--radius-sm);
    }

    /* Packages Deck */
    .packages-section {
      padding: 0 0 2rem;
    }
    .packages-deck {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1.5rem;
      max-width: 1100px;
      margin: 0 auto;
      align-items: stretch;
    }
    .package-card {
      position: relative;
      display: flex;
      flex-direction: column;
      padding: 2.5rem 1.85rem 2rem;
      text-align: center;
      border-radius: var(--radius-xl);
      background: rgba(18, 22, 30, 0.72);
      border: 1px solid rgba(255, 255, 255, 0.08);
      transition: transform 0.25s var(--ease-spring), border-color 0.25s ease, box-shadow 0.25s ease;
    }
    .package-card:hover {
      transform: translateY(-4px);
    }
    .package-card.featured {
      border-color: rgba(6, 182, 212, 0.55);
      background: linear-gradient(180deg, rgba(6, 182, 212, 0.06) 0%, rgba(18, 22, 30, 0.85) 100%);
      box-shadow: 0 0 35px rgba(6, 182, 212, 0.16), var(--shadow-lg);
    }
    .featured-badge {
      position: absolute;
      top: -0.75rem;
      left: 50%;
      transform: translateX(-50%);
      padding: 0.35rem 0.95rem;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, var(--accent-cyan), #38bdf8);
      color: #030712;
      font-size: 0.72rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;
      box-shadow: 0 4px 12px rgba(6, 182, 212, 0.35);
    }
    .pack-credits-header {
      margin-bottom: 0.25rem;
    }
    .pack-credits-number {
      font-size: clamp(3rem, 4.5vw, 3.8rem);
      font-weight: 900;
      font-family: var(--font-heading);
      line-height: 1;
      margin-bottom: 0.25rem;
    }
    .pack-credits-label {
      font-size: 0.95rem;
      font-weight: 750;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .pack-pricing-block {
      margin: 1.25rem 0 1rem;
      padding: 0.95rem 1rem;
      border-radius: var(--radius-lg);
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
    }
    .pack-price-row {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 0.55rem;
      flex-wrap: wrap;
    }
    .pack-price {
      font-family: var(--font-heading);
      font-size: 2.35rem;
      font-weight: 850;
      color: var(--text-primary);
      line-height: 1;
    }
    .pack-price-approx {
      font-size: 0.95rem;
      font-weight: 750;
      color: var(--accent-cyan);
      background: rgba(6, 182, 212, 0.12);
      border: 1px solid rgba(6, 182, 212, 0.25);
      padding: 0.15rem 0.55rem;
      border-radius: var(--radius-full);
      white-space: nowrap;
      letter-spacing: -0.01em;
    }
    .pack-rate {
      font-size: 0.84rem;
      font-weight: 700;
      margin-top: 0.35rem;
    }
    .pack-role-title {
      font-family: var(--font-heading);
      font-size: 1.35rem;
      font-weight: 850;
      color: var(--text-primary);
      margin: 0.25rem 0 0.85rem;
      letter-spacing: -0.02em;
    }
    .package-card.featured .pack-role-title {
      color: var(--accent-cyan);
    }
    .pack-outcome {
      font-size: 0.94rem;
      line-height: 1.5;
      margin: 0.4rem 0 0.85rem;
      font-weight: 600;
      color: var(--text-primary);
      min-height: 2.8em;
    }
    .pack-comparison-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.35rem;
      font-size: 0.82rem;
      font-weight: 750;
      color: var(--accent-amber);
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.25);
      border-radius: var(--radius-full);
      padding: 0.35rem 0.75rem;
      margin: 0 auto 1.15rem;
      width: fit-content;
    }
    .pack-social-proof {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.45rem;
      font-size: 0.8rem;
      font-weight: 650;
      color: var(--text-primary);
      background: rgba(139, 92, 246, 0.12);
      border: 1px solid rgba(139, 92, 246, 0.25);
      padding: 0.35rem 0.75rem;
      border-radius: var(--radius-full);
      margin: 0 auto 1.25rem;
      width: fit-content;
    }
    .pulse-dot {
      width: 7px;
      height: 7px;
      background-color: var(--accent-cyan);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.5); }
      70% { box-shadow: 0 0 0 6px rgba(6, 182, 212, 0); }
      100% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0); }
    }
    .package-card .btn {
      margin-top: auto;
      padding: 0.85rem;
      font-size: 0.95rem;
      font-weight: 750;
    }
    .currency-note {
      text-align: center;
      font-size: 0.82rem;
      margin: 1.15rem auto 0;
      color: var(--text-secondary);
      opacity: 0.85;
      max-width: 650px;
      line-height: 1.5;
    }

    /* Guest reassurance bar */
    .guest-reassurance-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.25rem;
      flex-wrap: wrap;
      padding: 0.85rem 1.5rem;
      margin: 2rem auto 0;
      max-width: 780px;
      border-radius: var(--radius-full);
      font-size: 0.92rem;
      color: var(--text-secondary);
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(255, 255, 255, 0.02);
    }

    /* Value Comparison */
    .value-comparison {
      padding: 2.25rem 2rem;
      margin: 2rem auto 1.5rem;
      max-width: 1040px;
      text-align: center;
      border-radius: var(--radius-xl);
    }
    .value-comparison h2 {
      font-size: clamp(1.4rem, 3vw, 2rem);
      margin: 0.4rem 0 1.5rem;
    }
    .value-grid {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.75rem;
      flex-wrap: wrap;
      margin-bottom: 1.25rem;
    }
    .value-item {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }
    .value-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent-cyan);
    }
    .value-details {
      display: grid;
      gap: 0.15rem;
      text-align: left;
    }
    .value-details strong {
      font-size: 1.05rem;
    }
    .value-highlight {
      background: rgba(6, 182, 212, 0.08);
      border: 1px solid rgba(6, 182, 212, 0.28);
      padding: 0.85rem 1.35rem;
      border-radius: var(--radius-md);
    }
    .vs-badge {
      font-weight: 900;
      font-size: 0.85rem;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .value-note {
      margin: 0;
      font-weight: 600;
      font-size: 0.95rem;
    }

    /* Credit Unit Card */
    .credit-unit-card {
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
      gap: 1.75rem;
      align-items: center;
      padding: 2rem 2.25rem;
      margin: 0 auto 1.5rem;
      max-width: 1040px;
      border-radius: var(--radius-xl);
      background: rgba(23, 28, 36, 0.72);
    }
    .credit-unit-card h2 {
      font-size: clamp(1.35rem, 3vw, 2rem);
      margin: 0.35rem 0 0.5rem;
    }
    .credit-unit-card p {
      margin: 0;
      line-height: 1.55;
    }
    .credit-unit-card ul {
      display: grid;
      gap: 0.65rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .credit-unit-card li {
      position: relative;
      padding-left: 1.35rem;
      color: var(--text-secondary);
      font-weight: 650;
      line-height: 1.45;
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

    /* Referral Banner */
    .referral-banner {
      padding: 1.75rem 2.25rem;
      margin: 0 auto 1.5rem;
      max-width: 1040px;
      border-radius: var(--radius-xl);
    }
    .referral-banner-content {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .referral-banner-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      border-radius: var(--radius-md);
      background: rgba(6, 182, 212, 0.1);
      color: var(--accent-cyan);
      flex-shrink: 0;
    }
    .referral-banner-text {
      flex: 1;
      min-width: 200px;
    }
    .referral-banner-text h3 {
      font-size: 1.15rem;
      margin: 0 0 0.25rem;
    }
    .referral-banner-text p {
      margin: 0;
      font-size: 0.92rem;
    }

    /* FAQ */
    .credits-faq {
      max-width: 1040px;
      margin: 3.5rem auto 0;
    }
    .section-header {
      text-align: center;
      max-width: 680px;
      margin: 0 auto;
    }
    .section-header.compact h2 {
      font-size: clamp(1.8rem, 3vw, 2.4rem);
      margin: 0.35rem 0 0;
    }
    .faq-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1.25rem;
      margin-top: 2rem;
    }
    .faq-item {
      padding: 1.5rem 1.75rem;
      border-radius: var(--radius-lg);
    }
    .faq-item h3 {
      font-size: 1.05rem;
      line-height: 1.35;
      margin-bottom: 0.55rem;
    }
    .faq-item p {
      margin: 0;
      line-height: 1.6;
    }

    /* Payment error */
    .payment-error {
      padding: 1rem 1.25rem;
      margin: 0 auto 1.5rem;
      max-width: 800px;
      border-color: rgba(244, 63, 94, 0.35);
      background: rgba(244, 63, 94, 0.08);
      color: var(--accent-rose);
      font-weight: 700;
      border-radius: var(--radius-md);
      text-align: center;
    }

    /* Checkout Modal */
    .checkout-confirm-backdrop {
      position: fixed;
      inset: 0;
      z-index: 100;
      display: grid;
      place-items: center;
      padding: 1rem;
      background: rgba(3, 7, 18, 0.75);
      backdrop-filter: blur(12px);
    }
    .checkout-confirm {
      width: min(520px, 100%);
      padding: 2.25rem;
      border-radius: var(--radius-xl);
    }
    .checkout-confirm h2 {
      font-size: clamp(1.55rem, 4vw, 2rem);
      margin: 0.35rem 0 0.75rem;
    }
    .confirm-email {
      display: grid;
      gap: 0.45rem;
      margin: 1.25rem 0;
    }
    .confirm-email span {
      color: var(--text-secondary);
      font-size: 0.85rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .confirm-email code {
      border: 1px solid rgba(148, 163, 184, 0.28);
      border-radius: var(--radius-sm);
      background: rgba(3, 7, 18, 0.42);
      color: var(--text-primary);
      font-family: var(--font-body);
      font-weight: 800;
      padding: 0.55rem 0.75rem;
      word-break: break-all;
    }
    .confirm-note {
      border-left: 3px solid var(--accent-amber);
      color: var(--text-primary);
      margin: 0 0 1.5rem;
      padding-left: 0.85rem;
      line-height: 1.55;
      font-size: 0.92rem;
    }
    .confirm-pack-summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.95rem 1.25rem;
      border-radius: var(--radius-md);
      background: rgba(6, 182, 212, 0.08);
      border: 1px solid rgba(6, 182, 212, 0.25);
      margin: 0.75rem 0 1rem;
    }
    .summary-pack-title {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      text-align: left;
    }
    .summary-pack-title strong {
      font-size: 1.05rem;
      color: var(--text-primary);
    }
    .summary-pack-credits {
      font-size: 0.85rem;
      color: var(--accent-cyan);
      font-weight: 700;
    }
    .summary-pack-price {
      text-align: right;
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }
    .price-usd {
      font-size: 1.25rem;
      font-weight: 900;
      color: var(--text-primary);
    }
    .price-local {
      font-size: 0.85rem;
      color: var(--text-secondary);
      font-weight: 600;
    }
    .provider-selector-wrap {
      margin: 1.25rem 0;
      text-align: left;
    }
    .selector-title {
      display: block;
      font-size: 0.85rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-secondary);
      margin-bottom: 0.65rem;
    }
    .provider-cards-grid {
      display: grid;
      gap: 0.75rem;
    }
    .provider-card {
      display: flex;
      align-items: center;
      gap: 0.95rem;
      padding: 0.85rem 1.15rem;
      border-radius: var(--radius-md);
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(15, 23, 42, 0.55);
      color: var(--text-primary);
      cursor: pointer;
      text-align: left;
      width: 100%;
      font-family: inherit;
      transition: all 0.2s ease;
    }
    .provider-card:hover {
      border-color: rgba(6, 182, 212, 0.4);
      background: rgba(15, 23, 42, 0.8);
    }
    .provider-card.active {
      border-color: var(--accent-cyan);
      background: rgba(6, 182, 212, 0.1);
      box-shadow: 0 0 16px rgba(6, 182, 212, 0.18);
    }
    .provider-radio {
      width: 20px;
      height: 20px;
      border-radius: 999px;
      border: 2px solid rgba(255, 255, 255, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: border-color 0.2s ease;
    }
    .provider-card.active .provider-radio {
      border-color: var(--accent-cyan);
    }
    .radio-dot {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: var(--accent-cyan);
    }
    .provider-info {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      flex: 1;
    }
    .provider-heading {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .provider-heading strong {
      font-size: 0.95rem;
    }
    .provider-badge-tag {
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      padding: 0.15rem 0.45rem;
      border-radius: 999px;
      background: rgba(16, 185, 129, 0.18);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.35);
    }
    .provider-sub {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }
    .legal-consent-card {
      margin: 1.25rem 0 0.5rem;
      padding: 0.95rem 1.15rem;
      border-radius: var(--radius-md);
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(15, 23, 42, 0.6);
      text-align: left;
      transition: border-color 0.2s ease, background 0.2s ease;
    }
    .legal-consent-card.checked {
      border-color: rgba(6, 182, 212, 0.4);
      background: rgba(6, 182, 212, 0.06);
    }
    .consent-checkbox-row {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      cursor: pointer;
    }
    .consent-native-check {
      margin-top: 0.25rem;
      width: 18px;
      height: 18px;
      accent-color: var(--accent-cyan);
      cursor: pointer;
      flex-shrink: 0;
    }
    .consent-text-flow {
      font-size: 0.82rem;
      line-height: 1.48;
      color: var(--text-secondary);
    }
    .consent-text-flow strong {
      color: var(--text-primary);
      display: block;
      margin-bottom: 0.2rem;
    }
    .terms-inline-link {
      color: var(--accent-cyan);
      text-decoration: underline;
      font-weight: 700;
    }
    .terms-inline-link:hover {
      color: #38bdf8;
    }
    .consent-warning {
      font-size: 0.78rem;
      color: #fbbf24;
      text-align: left;
      margin-bottom: 1rem;
      font-weight: 600;
    }
    .confirm-error-banner {
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.35);
      color: #fca5a5;
      font-size: 0.88rem;
      text-align: left;
      margin-bottom: 1rem;
      line-height: 1.45;
    }
    .confirm-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    /* Responsive */
    @media (max-width: 960px) {
      .first-topup-banner {
        padding: 1.25rem 1.35rem;
      }
      .promo-content {
        flex-direction: column;
        align-items: stretch;
        text-align: center;
      }
      .promo-badge-pill {
        margin: 0 auto 0.35rem;
      }
      .promo-right {
        justify-content: center;
      }
      .packages-deck {
        grid-template-columns: 1fr;
        max-width: 440px;
      }
      .faq-grid {
        grid-template-columns: 1fr;
      }
    }
    @media (max-width: 640px) {
      .credits-hero {
        padding: 2rem 0 1rem;
      }
      .trust-ribbon {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 1.25rem;
      }
      .credit-unit-card {
        grid-template-columns: 1fr;
        padding: 1.35rem;
      }
      .package-card,
      .checkout-confirm {
        padding: 1.5rem;
      }
      .value-grid {
        flex-direction: column;
      }
      .referral-banner-content {
        flex-direction: column;
        text-align: center;
      }
      .confirm-actions {
        display: grid;
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CreditsComponent implements OnInit, OnDestroy, AfterViewInit {
  ngAfterViewInit() {
    this.route.fragment.subscribe(frag => {
      if (frag) {
        setTimeout(() => {
          const el = document.getElementById(frag);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      }
    });
  }

  protected readonly route = inject(ActivatedRoute);
  protected readonly seo = inject(SeoService);
  protected readonly api = inject(ApiService);
  protected readonly buying = signal('');
  protected readonly buyError = signal('');
  protected readonly pendingPack = signal('');
  protected readonly selectedProvider = signal<'dpay' | 'lemonsqueezy'>('dpay');
  protected readonly digitalConsent = signal(false);
  protected readonly pathFor = pathFor;
  protected readonly currency = inject(CurrencyService);

  protected get selectedPackDetails() {
    const pId = this.pendingPack();
    return this.packs.find(p => p.id === pId);
  }

  protected get currencyNote(): string {
    return this.currency.getCurrencyNote(this.locale);
  }

  protected getApproxCurrencyPrice(usdPriceStr: string): string {
    return this.currency.getApproxPrice(usdPriceStr, this.locale);
  }

  protected locale: Locale = 'en';
  protected data = pageData('credits', 'en');
  protected copy = CREDITS_COPY.en;
  protected readonly codeCopied = signal(false);
  protected readonly timerRemainingSeconds = signal(15 * 60);
  private promoTimerInterval?: any;

  protected get timerMinutes(): string {
    const m = Math.floor(this.timerRemainingSeconds() / 60);
    return m.toString().padStart(2, '0');
  }

  protected get timerSeconds(): string {
    const s = this.timerRemainingSeconds() % 60;
    return s.toString().padStart(2, '0');
  }

  protected copyPromoCode(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('WELCOME10').then(() => {
        this.codeCopied.set(true);
        setTimeout(() => this.codeCopied.set(false), 2200);
      }).catch(() => {
        this.codeCopied.set(true);
        setTimeout(() => this.codeCopied.set(false), 2200);
      });
    } else {
      this.codeCopied.set(true);
      setTimeout(() => this.codeCopied.set(false), 2200);
    }
  }

  protected get isFirstPurchasePromoEligible(): boolean {
    const user = this.api.currentUser();
    // Guests who haven't logged in are always eligible for the first-purchase promo
    if (!user) return true;
    // If user has ever purchased credits, they are NOT eligible
    if (user.hasPurchasedCredits) return false;
    if (user.stats?.totalCreditsPurchased && user.stats.totalCreditsPurchased > 0) return false;
    if (user.appliedCreditPurchases && user.appliedCreditPurchases.length > 0) return false;
    return true;
  }

  protected get promoCopy() {
    const data: Record<Locale, {
      badge: string;
      title: string;
      subtitle: string;
      codeLabel: string;
      copyBtn: string;
      copied: string;
      clickToCopy: string;
      timerLabel: string;
      checkoutApplied: string;
    }> = {
      pl: {
        badge: 'Limitowana oferta na start',
        title: '10% zniżki na Twoje pierwsze doładowanie',
        subtitle: 'Wpisz kod w koszyku lub wybierz pakiet — rabat naliczy się automatycznie!',
        codeLabel: 'Kod rabatowy',
        copyBtn: 'Kopiuj',
        copied: 'Skopiowano!',
        clickToCopy: 'Kliknij, aby skopiować kod',
        timerLabel: 'Wygasa za',
        checkoutApplied: 'Kod WELCOME10 (-10%) zostanie naliczony przy płatności'
      },
      en: {
        badge: 'First Top-Up Exclusive',
        title: 'Get 10% OFF your first package',
        subtitle: 'Use code at checkout or choose any package below — discount applies automatically!',
        codeLabel: 'Promo code',
        copyBtn: 'Copy',
        copied: 'Copied!',
        clickToCopy: 'Click to copy code',
        timerLabel: 'Expires in',
        checkoutApplied: 'Code WELCOME10 (-10%) will be applied at checkout'
      },
      de: {
        badge: 'Exklusiv für Erstaufladung',
        title: '10% Rabatt auf dein erstes Paket',
        subtitle: 'Code an der Kasse eingeben oder Paket wählen — Rabatt wird automatisch aktiviert!',
        codeLabel: 'Gutscheincode',
        copyBtn: 'Kopieren',
        copied: 'Kopiert!',
        clickToCopy: 'Klicken zum Kopieren',
        timerLabel: 'Endet in',
        checkoutApplied: 'Code WELCOME10 (-10%) wird automatisch eingelöst'
      },
      es: {
        badge: 'Exclusivo primera recarga',
        title: '10% de descuento en tu primer paquete',
        subtitle: 'Usa el código en el checkout o elige un paquete — ¡el descuento se aplica solo!',
        codeLabel: 'Código promo',
        copyBtn: 'Copiar',
        copied: '¡Copiado!',
        clickToCopy: 'Haz clic para copiar',
        timerLabel: 'Expira en',
        checkoutApplied: 'Código WELCOME10 (-10%) aplicado a tu compra'
      },
      fr: {
        badge: 'Offre premier achat',
        title: '10% de réduction sur votre premier pack',
        subtitle: 'Entrez le code au paiement ou choisissez un pack — la remise s’applique automatiquement !',
        codeLabel: 'Code promo',
        copyBtn: 'Copier',
        copied: 'Copié !',
        clickToCopy: 'Cliquez pour copier',
        timerLabel: 'Expire dans',
        checkoutApplied: 'Code promo WELCOME10 (-10%) sera appliqué au paiement'
      },
      it: {
        badge: 'Offerta prima ricarica',
        title: '10% di sconto sul tuo primo pacchetto',
        subtitle: 'Inserisci il codice al checkout o scegli un pacchetto — sconto applicato in automatico!',
        codeLabel: 'Codice promo',
        copyBtn: 'Copia',
        copied: 'Copiato!',
        clickToCopy: 'Clicca per copiare',
        timerLabel: 'Scade tra',
        checkoutApplied: 'Il codice WELCOME10 (-10%) sarà applicato al pagamento'
      },
      uk: {
        badge: 'Знижка на перший пакет',
        title: '10% знижки на твоє перше поповнення',
        subtitle: 'Введи промокод при оплаті або обери будь-який пакет — знижка активується автоматично!',
        codeLabel: 'Промокод',
        copyBtn: 'Копіювати',
        copied: 'Скопійовано!',
        clickToCopy: 'Натисни, щоб скопіювати',
        timerLabel: 'Діє ще',
        checkoutApplied: 'Промокод WELCOME10 (-10%) буде додано до оплати'
      }
    };
    return data[this.locale] || data.en;
  }

  protected get referralCopy() {
    const data: Record<Locale, { title: string; text: string; button: string }> = {
      en: { title: 'Share & earn 10%', text: 'Invite friends with your referral link. When they buy credits, you get 10% bonus credits.', button: 'Get your link' },
      pl: { title: 'Poleć i zyskaj 10%', text: 'Zaproś znajomych swoim linkiem polecającym. Gdy kupią kredyty, dostajesz 10% bonusu.', button: 'Pobierz swój link' },
      de: { title: 'Teilen & 10% verdienen', text: 'Lade Freunde mit deinem Empfehlungslink ein. Bei ihrem Kauf erhältst du 10% Bonuscredits.', button: 'Link holen' },
      es: { title: 'Comparte y gana 10%', text: 'Invita amigos con tu enlace de referido. Cuando compren créditos, recibes un 10% de bonificación.', button: 'Obtener enlace' },
      fr: { title: 'Partagez et gagnez 10%', text: 'Invitez vos amis avec votre lien de parrainage. Quand ils achètent, vous recevez 10% de bonus.', button: 'Obtenir le lien' },
      it: { title: 'Condividi e guadagna 10%', text: 'Invita amici con il tuo link referral. Quando acquistano crediti, ricevi il 10% di bonus.', button: 'Ottieni il link' },
      uk: { title: 'Поділись і отримай 10%', text: 'Запроси друзів через реферальне посилання. Коли вони куплять кредити, ти отримаєш 10% бонусу.', button: 'Отримати посилання' }
    };
    return data[this.locale] || data.en;
  }

  protected get trustBadges() {
    const data: Record<Locale, Array<{ icon: string; text: string }>> = {
      en: [
        { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z"/></svg>', text: 'Credits never expire' },
        { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>', text: 'No recurring subscriptions' },
        { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>', text: 'Instant delivery after payment' }
      ],
      pl: [
        { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z"/></svg>', text: 'Kredyty nigdy nie wygasają' },
        { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>', text: 'Zero abonamentów i ukrytych opłat' },
        { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>', text: 'Natychmiastowe doładowanie konta' }
      ],
      de: [
        { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z"/></svg>', text: 'Credits verfallen nie' },
        { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>', text: 'Keine monatlichen Abonnements' },
        { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>', text: 'Sofortige Aktivierung im Account' }
      ],
      es: [
        { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z"/></svg>', text: 'Los créditos nunca caducan' },
        { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>', text: 'Sin suscripciones recurrentes' },
        { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>', text: 'Recarga instantánea en tu cuenta' }
      ],
      fr: [
        { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z"/></svg>', text: 'Les crédits n\'expirent jamais' },
        { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>', text: 'Aucun abonnement récurrent' },
        { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>', text: 'Activation immédiate sur le compte' }
      ],
      it: [
        { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z"/></svg>', text: 'I crediti non scadono mai' },
        { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>', text: 'Nessun abbonamento ricorrente' },
        { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>', text: 'Ricarica istantanea sull\'account' }
      ],
      uk: [
        { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z"/></svg>', text: 'Кредити ніколи не згорають' },
        { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>', text: 'Жодних регулярних підписок' },
        { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>', text: 'Миттєве поповнення акаунту' }
      ]
    };
    return data[this.locale] || data.en;
  }

  protected readonly packs = [
    {
      id: 'starter',
      credits: 100,
      price: '$1.99',
      name: {
        en: 'Rescue Pack',
        pl: 'Pakiet Ratunkowy',
        de: 'Rettungs-Paket',
        es: 'Pack Rescate',
        fr: 'Pack Sauvetage',
        it: 'Pacchetto Soccorso',
        uk: 'Рятувальний пакет'
      },
      rateInfo: {
        en: '~$0.02 / answer',
        pl: '~$0.02 za odpowiedź',
        de: '~$0.02 pro Antwort',
        es: '~$0.02 por respuesta',
        fr: '~$0.02 par réponse',
        it: '~$0.02 per risposta',
        uk: '~$0.02 за відповідь'
      },
      outcome: {
        en: '100 answers = Peace of mind for 3–5 full tests or exams',
        pl: '100 odpowiedzi = Spokój na 3–5 pełnych kolokwiów lub testów',
        de: '100 Antworten = Sicherheit für 3–5 komplette Tests & Klausuren',
        es: '100 respuestas = Tranquilidad para 3–5 exámenes o parciales',
        fr: '100 réponses = Sérénité pour 3–5 examens ou partiels complets',
        it: '100 risposte = Serenità per 3–5 verifiche o esami completi',
        uk: '100 відповідей = Спокій на 3–5 повних модулів або тестів'
      },
      comparison: {
        en: '⚡ Less than an energy drink or coffee',
        pl: '⚡ Mniej niż energy drink lub kawa',
        de: '⚡ Günstiger als ein Energy-Drink oder Kaffee',
        es: '⚡ Menos que una bebida energética o café',
        fr: '⚡ Moins cher qu\'un café ou energy drink',
        it: '⚡ Meno di un caffè o un energy drink',
        uk: '⚡ Дешевше ніж енергетик або кава'
      },
      button: {
        en: 'Get Rescue Pack',
        pl: 'Wybierz Pakiet Ratunkowy',
        de: 'Rettungs-Paket wählen',
        es: 'Elegir Pack Rescate',
        fr: 'Prendre le Pack Sauvetage',
        it: 'Prendi Pacchetto Soccorso',
        uk: 'Обрати Рятувальний пакет'
      }
    },
    {
      id: 'popular',
      credits: 500,
      price: '$4.99',
      badge: {
        en: 'Most Popular',
        pl: 'Najchętniej Wybierany',
        de: 'Am Beliebtesten',
        es: 'Más Popular',
        fr: 'Le Plus Populaire',
        it: 'Più Popolare',
        uk: 'Найпопулярніший'
      },
      name: {
        en: 'Semester Pack',
        pl: 'Pakiet Semestralny',
        de: 'Semester-Paket',
        es: 'Pack Semestral',
        fr: 'Pack Semestre',
        it: 'Pacchetto Semestrale',
        uk: 'Семестровий пакет'
      },
      socialText: {
        en: 'Chosen by 84% of students',
        pl: 'Wybierane przez 84% studentów',
        de: 'Von 84% der Studenten gewählt',
        es: 'Elegido por el 84% de los estudiantes',
        fr: 'Choisi par 84% des étudiants',
        it: 'Scelto dall\'84% degli studenti',
        uk: 'Обрано 84% студентів'
      },
      rateInfo: {
        en: '~$0.01 / answer (Save 50%)',
        pl: '~$0.01 za odpowiedź (50% taniej)',
        de: '~$0.01 pro Antwort (50% Ersparnis)',
        es: '~$0.01 por respuesta (Ahorra 50%)',
        fr: '~$0.01 par réponse (50% d\'économie)',
        it: '~$0.01 per risposta (Risparmi il 50%)',
        uk: '~$0.01 за відповідь (50% дешевше)'
      },
      outcome: {
        en: '500 answers = Stress-free studying, midterms & finals all semester',
        pl: '500 odpowiedzi = Bezstresowa nauka, kolokwia i sesja przez cały semestr',
        de: '500 Antworten = Stressfreie Hausaufgaben, Tests & Klausuren das ganze Semester',
        es: '500 respuestas = Tareas, parciales y exámenes sin estrés todo el semestre',
        fr: '500 réponses = Devoirs, partiels et examens sans stress tout le semestre',
        it: '500 risposte = Compiti, prove ed esami senza stress per tutto il semestre',
        uk: '500 відповідей = Домашки, модулі та сесія без стресу на весь семестр'
      },
      comparison: {
        en: '🍕 Less than a pizza (Save 50%)',
        pl: '🍕 Mniej niż pizza (50% taniej)',
        de: '🍕 Günstiger als eine Pizza (50% Ersparnis)',
        es: '🍕 Menos de lo que cuesta una pizza (Ahorra 50%)',
        fr: '🍕 Moins cher qu\'une pizza (50% d\'économie)',
        it: '🍕 Meno del costo di una pizza (Risparmi il 50%)',
        uk: '🍕 Менше ніж одна піца (50% дешевше)'
      },
      button: {
        en: 'Get Semester Pack',
        pl: 'Wybierz Pakiet Semestralny',
        de: 'Semester-Paket wählen',
        es: 'Elegir Pack Semestral',
        fr: 'Prendre le Pack Semestre',
        it: 'Prendi Pacchetto Semestrale',
        uk: 'Обрати Семестровий пакет'
      }
    },
    {
      id: 'pro',
      credits: 2000,
      price: '$14.99',
      badge: {
        en: 'Best Value',
        pl: 'Najlepsza Cena',
        de: 'Bester Preis',
        es: 'Mejor Precio',
        fr: 'Meilleur Prix',
        it: 'Miglior Prezzo',
        uk: 'Найкраща ціна'
      },
      name: {
        en: 'Annual & Group Pack',
        pl: 'Pakiet Roczny / Na spółkę',
        de: 'Jahres- & Lerngruppen-Paket',
        es: 'Pack Anual o Compartido',
        fr: 'Pack Annuel & Groupe',
        it: 'Pacchetto Annuale & Gruppo',
        uk: 'Річний / Спільний пакет'
      },
      rateInfo: {
        en: '<$0.008 / answer (Lowest rate)',
        pl: '<$0.008 za odpowiedź (Największy rabat)',
        de: '<$0.008 pro Antwort (Bester Rabatt)',
        es: '<$0.008 por respuesta (Mayor ahorro)',
        fr: '<$0.008 par réponse (Plus grosse remise)',
        it: '<$0.008 per risposta (Massimo sconto)',
        uk: '<$0.008 за відповідь (Найбільша знижка)'
      },
      outcome: {
        en: '2000 answers = Massive supply for the entire year or to split with friends',
        pl: '2000 odpowiedzi = Zapas na cały rok lub do podziału ze znajomymi ze studiów',
        de: '2000 Antworten = Riesiger Vorrat fürs ganze Studienjahr oder zum Teilen mit Freunden',
        es: '2000 respuestas = Gran reserva para todo el año o para compartir con compañeros',
        fr: '2000 réponses = Réserve massive pour toute l\'année ou à partager entre amis',
        it: '2000 risposte = Riserva enorme per tutto l\'anno o da dividere con compagni',
        uk: '2000 відповідей = Величезний запас на весь рік або для спільного користування з друзями'
      },
      comparison: {
        en: '💎 Lowest price per answer (<$0.008)',
        pl: '💎 Najniższy koszt za odpowiedź (<$0.008)',
        de: '💎 Tiefster Preis pro Antwort (<$0.008)',
        es: '💎 Precio más bajo por respuesta (<$0.008)',
        fr: '💎 Prix le plus bas par réponse (<$0.008)',
        it: '💎 Prezzo più basso per risposta (<$0.008)',
        uk: '💎 Найнижча ціна за відповідь (<$0.008)'
      },
      button: {
        en: 'Get Annual Pack',
        pl: 'Wybierz Pakiet Roczny',
        de: 'Jahres-Paket wählen',
        es: 'Elegir Pack Anual',
        fr: 'Prendre le Pack Annuel',
        it: 'Prendi Pacchetto Annuale',
        uk: 'Обрати Річний пакет'
      }
    }
  ];

  protected get valueComp() {
    const data: Record<Locale, { badge: string; title: string; tutor: string; tutorPrice: string; qs: string; qsPrice: string; note: string }> = {
      en: { badge: 'Smart investment', title: 'How QuizSolver compares', tutor: 'Private tutoring', tutorPrice: '$30–50 / hour', qs: 'QuizSolver 500 credits', qsPrice: '$4.99 for ~500 answers', note: 'Credits never expire. No subscription. Pay once, use whenever you need.' },
      pl: { badge: 'Mądra inwestycja', title: 'Jak QuizSolver wypada na tle alternatyw', tutor: 'Korepetycje', tutorPrice: '80–150 zł / godzina', qs: 'QuizSolver 500 kredytów', qsPrice: '$4.99 za ~500 odpowiedzi', note: 'Kredyty nigdy nie wygasają. Bez abonamentu. Płacisz raz, używasz kiedy potrzebujesz.' },
      de: { badge: 'Kluge Investition', title: 'QuizSolver im Vergleich', tutor: 'Nachhilfe', tutorPrice: '25–40 € / Stunde', qs: 'QuizSolver 500 Credits', qsPrice: '$4.99 für ~500 Antworten', note: 'Credits verfallen nie. Kein Abo. Einmal bezahlen, jederzeit nutzen.' },
      es: { badge: 'Inversión inteligente', title: 'Cómo se compara QuizSolver', tutor: 'Tutorías privadas', tutorPrice: '20–35 € / hora', qs: 'QuizSolver 500 créditos', qsPrice: '$4.99 por ~500 respuestas', note: 'Los créditos nunca caducan. Sin suscripción. Paga una vez, usa cuando quieras.' },
      fr: { badge: 'Investissement malin', title: 'QuizSolver en comparaison', tutor: 'Cours particuliers', tutorPrice: '25–45 € / heure', qs: 'QuizSolver 500 crédits', qsPrice: '$4.99 pour ~500 réponses', note: 'Les crédits n\'expirent jamais. Sans abonnement. Payez une fois, utilisez quand vous voulez.' },
      it: { badge: 'Investimento intelligente', title: 'Come si confronta QuizSolver', tutor: 'Ripetizioni private', tutorPrice: '20–35 € / ora', qs: 'QuizSolver 500 crediti', qsPrice: '$4.99 per ~500 risposte', note: 'I crediti non scadono mai. Nessun abbonamento. Paga una volta, usa quando vuoi.' },
      uk: { badge: 'Розумна інвестиція', title: 'Як QuizSolver порівняно з альтернативами', tutor: 'Репетитор', tutorPrice: '300–600 грн / година', qs: 'QuizSolver 500 кредитів', qsPrice: '$4.99 за ~500 відповідей', note: 'Кредити ніколи не закінчуються. Без підписки. Плати раз, використовуй коли потрібно.' }
    };
    return data[this.locale] || data.en;
  }

  async ngOnInit(): Promise<void> {
    this.locale = (this.route.snapshot.data['locale'] || 'en') as Locale;
    this.data = pageData('credits', this.locale);
    this.copy = CREDITS_COPY[this.locale] || CREDITS_COPY.en;
    this.seo.applyPage('credits', this.locale);
    this.currency.init(this.locale);
    await this.api.restoreSession();

    // Check for pending pack from before login
    if (typeof window !== 'undefined') {
      const pending = sessionStorage.getItem('qs_pending_pack');
      if (pending && this.api.token() && this.packs.some(p => p.id === pending)) {
        sessionStorage.removeItem('qs_pending_pack');
        setTimeout(() => this.confirmPack(pending), 200);
      }
    }

    // Deep link package auto-selection
    const packParam = this.route.snapshot.queryParamMap.get('pack');
    if (packParam && this.api.token() && this.packs.some(p => p.id === packParam)) {
      setTimeout(() => this.confirmPack(packParam), 100);
    }
    this.initPromoCountdown();
    trackGa4Event('credits_page_view', { locale: this.locale, from: this.route.snapshot.queryParamMap.get('from') || '' });
  }

  ngOnDestroy(): void {
    if (this.promoTimerInterval) clearInterval(this.promoTimerInterval);
  }

  private initPromoCountdown(): void {
    if (typeof window === 'undefined') return;
    const STORAGE_KEY = 'qs_welcome10_timer_end';
    let endTime = Number(localStorage.getItem(STORAGE_KEY));
    const now = Date.now();

    if (!endTime || isNaN(endTime) || endTime <= now) {
      endTime = now + 15 * 60 * 1000;
      try { localStorage.setItem(STORAGE_KEY, String(endTime)); } catch {}
    }

    const update = () => {
      const diffSec = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      this.timerRemainingSeconds.set(diffSec);
      if (diffSec <= 0 && this.promoTimerInterval) {
        endTime = Date.now() + 15 * 60 * 1000;
        try { localStorage.setItem(STORAGE_KEY, String(endTime)); } catch {}
      }
    };

    update();
    this.promoTimerInterval = setInterval(update, 1000);
  }

  protected lowCredits(): boolean {
    const user = this.api.currentUser();
    return !!user && user.role !== 'admin' && Number(user.credits || 0) < 20;
  }

  protected dashboardPath(): string {
    return pathFor('dashboard', this.locale);
  }

  protected label(key: string): string {
    return this.copy?.[key] || CREDITS_COPY.en[key] || key;
  }

  protected faqItems(): Array<{ question: string; answer: string }> {
    return this.copy?.faq || CREDITS_COPY.en.faq || [];
  }

  protected get checkoutProviderCopy() {
    const data: Record<Locale, {
      title: string;
      dpayTitle: string;
      dpaySubtitle: string;
      dpayBadge: string;
      lemonTitle: string;
      lemonSubtitle: string;
      consentTitle: string;
      consentStatement: string;
      consentTermsLink: string;
      consentRequiredNote: string;
      selectedPackLabel: string;
    }> = {
      pl: {
        title: 'Wybierz metodę płatności:',
        dpayTitle: 'BLIK i szybki przelew (DPay)',
        dpaySubtitle: 'Płatność w PLN • Polski operator KNF',
        dpayBadge: 'Polecane w Polsce',
        lemonTitle: 'Karta, Apple Pay, Google Pay',
        lemonSubtitle: 'Visa, Mastercard, Revolut (Lemon Squeezy)',
        consentTitle: 'Zgoda na natychmiastowe świadczenie:',
        consentStatement: 'Zgadzam się na natychmiastowe udostępnienie usługi cyfrowej (dostępu do konta / pakietu kredytów AI) przed upływem 14 dni na odstąpienie od umowy i przyjmuję do wiadomości, że wraz z realizacją zamówienia i wykorzystaniem choćby jednego kredytu tracę prawo do odstąpienia od umowy. Akceptuję również ',
        consentTermsLink: 'Regulamin serwisu',
        consentRequiredNote: '* Zaznaczenie powyższej zgody jest wymagane prawnie do przejścia do płatności.',
        selectedPackLabel: 'Wybrany pakiet:'
      },
      en: {
        title: 'Select payment method:',
        dpayTitle: 'BLIK & Polish Online Transfer (DPay)',
        dpaySubtitle: 'Pay in PLN • Polish licensed payment provider',
        dpayBadge: 'Popular in Poland',
        lemonTitle: 'Cards, Apple Pay, Google Pay',
        lemonSubtitle: 'Visa, Mastercard, Revolut (Lemon Squeezy)',
        consentTitle: 'Immediate digital supply waiver:',
        consentStatement: 'I agree to the immediate delivery of digital service (account access / AI credits) before the 14-day withdrawal period expires, and acknowledge that upon order fulfillment and use of even one credit, I lose the right of withdrawal. I also accept the ',
        consentTermsLink: 'Terms of Service',
        consentRequiredNote: '* Agreeing to immediate digital delivery is legally required to proceed to payment.',
        selectedPackLabel: 'Selected pack:'
      },
      de: {
        title: 'Zahlungsmethode wählen:',
        dpayTitle: 'BLIK & Sofortüberweisung (DPay)',
        dpaySubtitle: 'Zahlung in PLN • Lizenziertes polnisches Zahlungsinstitut',
        dpayBadge: 'Beliebt in Polen',
        lemonTitle: 'Kreditkarte, Apple Pay, Google Pay',
        lemonSubtitle: 'Visa, Mastercard, Revolut (Lemon Squeezy)',
        consentTitle: 'Sofortige Bereitstellung digitaler Inhalte:',
        consentStatement: 'Ich stimme der sofortigen Bereitstellung der digitalen Dienstleistung (Credits) vor Ablauf der 14-tägigen Widerrufsfrist zu und nehme zur Kenntnis, dass ich mit Nutzung von mindestens einem Credit mein Widerrufsrecht verliere. Ich akzeptiere auch die ',
        consentTermsLink: 'AGB',
        consentRequiredNote: '* Diese Zustimmung ist gesetzlich erforderlich, um fortzufahren.',
        selectedPackLabel: 'Gewähltes Paket:'
      },
      es: {
        title: 'Elige método de pago:',
        dpayTitle: 'BLIK y Transferencia bancaria (DPay)',
        dpaySubtitle: 'Pago en PLN • Entidad de pago autorizada',
        dpayBadge: 'Popular en Polonia',
        lemonTitle: 'Tarjetas, Apple Pay, Google Pay',
        lemonSubtitle: 'Visa, Mastercard, Revolut (Lemon Squeezy)',
        consentTitle: 'Consentimiento de suministro digital:',
        consentStatement: 'Acepto el suministro inmediato del servicio digital (créditos IA) antes de que venza el plazo de 14 días y reconozco que una vez consumido al menos un crédito, pierdo el derecho de desistimiento. Acepto también los ',
        consentTermsLink: 'Términos de servicio',
        consentRequiredNote: '* Aceptar este consentimiento es un requisito legal para continuar.',
        selectedPackLabel: 'Paquete seleccionado:'
      },
      fr: {
        title: 'Choisissez votre moyen de paiement :',
        dpayTitle: 'BLIK & Virement bancaire (DPay)',
        dpaySubtitle: 'Paiement en PLN • Établissement de paiement agréé',
        dpayBadge: 'Populaire en Pologne',
        lemonTitle: 'Cartes, Apple Pay, Google Pay',
        lemonSubtitle: 'Visa, Mastercard, Revolut (Lemon Squeezy)',
        consentTitle: 'Renonciation au droit de rétractation :',
        consentStatement: 'J\'accepte la fourniture immédiate du service numérique avant l\'expiration du délai de rétractation de 14 jours et je reconnais qu\'après utilisation d\'au moins un crédit, je perds mon droit de rétractation. J\'accepte également les ',
        consentTermsLink: 'Conditions d\'utilisation',
        consentRequiredNote: '* Cette acceptation est requise par la loi pour poursuivre.',
        selectedPackLabel: 'Pack sélectionné :'
      },
      it: {
        title: 'Scegli il metodo di pagamento:',
        dpayTitle: 'BLIK e Bonifico bancario (DPay)',
        dpaySubtitle: 'Pagamento in PLN • Istituto di pagamento autorizzato',
        dpayBadge: 'Popolare in Polonia',
        lemonTitle: 'Carte, Apple Pay, Google Pay',
        lemonSubtitle: 'Visa, Mastercard, Revolut (Lemon Squeezy)',
        consentTitle: 'Consenso fornitura digitale immediata:',
        consentStatement: 'Acconsento alla fornitura immediata del servizio digitale prima della scadenza del recesso di 14 giorni e prendo atto che consumando almeno un credito perdo il diritto di recesso. Accetto anche i ',
        consentTermsLink: 'Termini di servizio',
        consentRequiredNote: '* Questo consenso è richiesto dalla legge per procedere.',
        selectedPackLabel: 'Pacchetto selezionato:'
      },
      uk: {
        title: 'Оберіть спосіб оплати:',
        dpayTitle: 'BLIK та банківський переказ (DPay)',
        dpaySubtitle: 'Оплата в PLN • Польський ліцензований оператор',
        dpayBadge: 'Популярно в Польщі',
        lemonTitle: 'Картки, Apple Pay, Google Pay',
        lemonSubtitle: 'Visa, Mastercard, Revolut (Lemon Squeezy)',
        consentTitle: 'Згода на негайне надання послуги:',
        consentStatement: 'Я погоджуюсь на негайне надання цифрової послуги (кредитів AI) до закінчення 14 днів і підтверджую, що з використанням хоча б 1 кредиту я втрачаю право на відмову від договору. Я також приймаю ',
        consentTermsLink: 'Правила сервісу',
        consentRequiredNote: '* Підтвердження згоди є обов\'язковою вимогою закону для продовження.',
        selectedPackLabel: 'Обраний пакет:'
      }
    };
    return data[this.locale] || data.en;
  }

  protected confirmPack(pack: string, shell?: ShellComponent): void {
    if (!this.api.currentUser()) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('qs_pending_pack', pack);
      }
      if (shell) {
        shell.openModal('login');
      }
      return;
    }
    this.buyError.set('');
    this.digitalConsent.set(false);
    this.selectedProvider.set(this.locale === 'pl' ? 'dpay' : 'lemonsqueezy');
    this.pendingPack.set(pack);
    trackGa4Event('checkout_initiated', { pack, locale: this.locale });
  }

  protected cancelCheckout(): void {
    if (this.buying()) return;
    this.pendingPack.set('');
    this.digitalConsent.set(false);
  }

  protected async continueCheckout(): Promise<void> {
    if (!this.digitalConsent()) return;
    trackGa4Event('checkout_confirmed', {
      pack: this.pendingPack(),
      provider: this.selectedProvider(),
      locale: this.locale
    });
    const pack = this.pendingPack();
    if (!pack) return;
    await this.buyPack(pack);
  }

  protected async buyPack(pack: string): Promise<void> {
    if (!this.api.token()) return;
    this.buyError.set('');
    this.buying.set(pack);
    const result = await this.api.request('/api/credits/buy', {
      method: 'POST',
      body: JSON.stringify({
        pack,
        provider: this.selectedProvider(),
        discountCode: this.isFirstPurchasePromoEligible ? 'WELCOME10' : undefined
      })
    });
    this.buying.set('');
    if (result.success && result.checkoutUrl) {
      this.pendingPack.set('');
      window.location.href = result.checkoutUrl;
    } else {
      this.buyError.set(result.error || this.copy.paymentError);
    }
  }
}

const CREDITS_COPY: Record<Locale, any> = {
  en: {
    badge: 'Simple Pricing',
    pageHeading: 'Choose your credits pack',
    subtitle: 'One-time top-up. No subscription, no hidden recurring fees. Credits never expire.',
    creditsUnitLabel: 'credits',
    loginTitle: 'Sign in to buy credits',
    loginText: 'Use the same account as the Chrome extension, then pick a top-up package.',
    loginButton: 'Sign in / Sign up',
    guestReassurance: 'Don’t have an account yet? Registration takes 10 seconds and includes free credits!',
    guestRegisterLink: 'Create free account',
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
    popular: 'Most Popular',
    bestValue: 'Best Value',
    loading: 'Redirecting...',
    paymentError: 'Payments are temporarily unavailable. Try again later.',
    emailWarningTitle: 'Use your QuizSolver account email',
    emailWarningText: 'Credits are assigned to the account email shown here. Keep this email in checkout and do not replace it with a different one.',
    confirmBadge: 'Before checkout',
    confirmTitle: 'Confirm your account email',
    confirmText: 'A secure checkout page will open. Keep the same email so credits land on the correct QuizSolver account.',
    confirmEmailLabel: 'QuizSolver account email',
    confirmNote: 'If you change this email at checkout, the credit top-up may be delayed or require support to attach it manually.',
    confirmBack: 'Go back',
    confirmContinue: 'Continue to checkout',
    faqTitle: 'Frequently asked questions',
    faq: [
      { question: 'How are credits delivered?', answer: 'After payment confirmation, credits are automatically added to the QuizSolver account you are logged into.' },
      { question: 'Do credits expire?', answer: 'No! Purchased credits are permanent. Your credits never expire, and your study history stays accessible forever.' },
      { question: 'Can I change the checkout email?', answer: 'Do not change it. Use the same email as your QuizSolver account so the top-up can be matched immediately.' }
    ]
  },
  pl: {
    badge: 'Prosty Cennik',
    pageHeading: 'Wybierz pakiet dla siebie',
    subtitle: 'Jednorazowe doładowanie. Bez subskrypcji i ukrytych opłat. Kredyty nigdy nie wygasają.',
    creditsUnitLabel: 'kredytów',
    loginTitle: 'Zaloguj się, żeby kupić kredyty',
    loginText: 'Użyj tego samego konta co w rozszerzeniu Chrome, a potem wybierz pakiet doładowania.',
    loginButton: 'Zaloguj się / Załóż konto',
    guestReassurance: 'Nie masz jeszcze konta? Rejestracja zajmuje 10 sekund i daje darmowe kredyty na start!',
    guestRegisterLink: 'Załóż darmowe konto',
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
    popular: 'Najchętniej Wybierany',
    bestValue: 'Najlepsza Cena',
    loading: 'Przekierowanie...',
    paymentError: 'Płatności są chwilowo niedostępne. Spróbuj ponownie później.',
    emailWarningTitle: 'Użyj e-maila z konta QuizSolver',
    emailWarningText: 'Kredyty są przypisywane do konta z e-mailem pokazanym tutaj. Nie zmieniaj tego e-maila w checkoutcie.',
    confirmBadge: 'Przed płatnością',
    confirmTitle: 'Potwierdź e-mail konta',
    confirmText: 'Za chwilę otworzy się bezpieczna strona płatności. Zostaw ten sam e-mail, żeby kredyty trafiły na poprawne konto QuizSolver.',
    confirmEmailLabel: 'E-mail konta QuizSolver',
    confirmNote: 'Jeśli zmienisz e-mail w checkoutcie, doładowanie może się opóźnić albo będzie wymagać ręcznego dopięcia przez support.',
    confirmBack: 'Wróć',
    confirmContinue: 'Przejdź do płatności',
    faqTitle: 'Pytania o kredyty i płatności',
    faq: [
      { question: 'Jak szybko dostanę kredyty?', answer: 'Po potwierdzeniu płatności kredyty automatycznie i natychmiast trafiają na Twoje konto QuizSolver.' },
      { question: 'Czy kredyty wygasają?', answer: 'Nie! Kupione kredyty nigdy nie wygasają. Możesz ich użyć za tydzień, miesiąc lub w kolejnym semestrze.' },
      { question: 'Czy mogę zmienić e-mail w checkoutcie?', answer: 'Nie zmieniaj go. Użyj tego samego e-maila co na koncie QuizSolver, żeby doładowanie zostało przypisane automatycznie.' }
    ]
  },
  de: {
    badge: 'Einfache Preise',
    pageHeading: 'Wähle dein Credit-Paket',
    subtitle: 'Einmaliges Aufladen. Kein Abonnement, keine laufenden Kosten. Credits verfallen nie.',
    creditsUnitLabel: 'Credits',
    loginTitle: 'Einloggen, um Credits zu kaufen',
    loginText: 'Nutze dasselbe Konto wie in der Chrome-Erweiterung und wähle dann ein Paket.',
    loginButton: 'Einloggen / Registrieren',
    guestReassurance: 'Noch kein Konto? Die Registrierung dauert 10 Sekunden und schenkt dir Start-Credits!',
    guestRegisterLink: 'Kostenloses Konto erstellen',
    balanceLabel: 'Aktuelles Guthaben',
    balanceText: 'Credits werden für KI-Antworten, Erklärungen, Rückfragen und FocusScan verwendet.',
    unitBadge: 'So funktionieren Credits',
    unitTitle: '1 Credit = 1 KI-Antwort',
    unitText: 'Ein Credit ist die Nutzungseinheit von QuizSolver. Eine sichtbare Frage an die KI verbraucht 1 Credit.',
    unitItems: ['Gespeicherte Historie und Notizen kosten keine Credits.', 'Der Kahoot Quiz-ID-Modus verbraucht keine KI-Credits.', 'Zusätzliche Rückfragen oder FocusScan zählen als neue Antworten.'],
    dashboardCta: 'Zurück zum Dashboard',
    lowTitle: 'Wenig Credits',
    lowText: 'Deine Credits sind fast aufgebraucht. Kaufe mehr, damit sie im Quiz nicht ausgehen.',
    packagesBadge: 'Einmalpakete',
    packagesTitle: 'Aufladen nach Bedarf',
    packagesText: 'Gespeicherte Fragen und Lernhistorie bleiben immer kostenlos verfügbar.',
    popular: 'Am Beliebtesten',
    bestValue: 'Bester Preis',
    loading: 'Weiterleitung...',
    paymentError: 'Zahlungen sind vorübergehend nicht verfügbar. Versuche es später erneut.',
    emailWarningTitle: 'Verwende deine QuizSolver-E-Mail',
    emailWarningText: 'Credits werden dem hier gezeigten Konto gutgeschrieben. Ändere die E-Mail im Checkout nicht.',
    confirmBadge: 'Vor dem Checkout',
    confirmTitle: 'Konto-E-Mail bestätigen',
    confirmText: 'Es öffnet sich ein sicherer Checkout. Behalte dieselbe E-Mail-Adresse bei.',
    confirmEmailLabel: 'QuizSolver-Konto-E-Mail',
    confirmNote: 'Wenn du die E-Mail im Checkout änderst, kann sich die Gutschrift verzögern.',
    confirmBack: 'Zurück',
    confirmContinue: 'Weiter zur Zahlung',
    faqTitle: 'Fragen zu Credits & Zahlung',
    faq: [
      { question: 'Wie schnell erhalte ich die Credits?', answer: 'Nach der Zahlungsbestätigung werden die Credits sofort automatisch deinem Konto gutgeschrieben.' },
      { question: 'Verfallen meine Credits?', answer: 'Nein! Gekaufte Credits verfallen niemals. Du kannst sie jederzeit in kommenden Semestern nutzen.' },
      { question: 'Darf ich die E-Mail im Checkout ändern?', answer: 'Nein, bitte behalte die E-Mail deines QuizSolver-Kontos bei, damit die Zuordnung sofort klappt.' }
    ]
  },
  es: {
    badge: 'Precios Claros',
    pageHeading: 'Elige tu paquete de créditos',
    subtitle: 'Recarga única. Sin suscripciones ni cobros recurrentes. Los créditos nunca caducan.',
    creditsUnitLabel: 'créditos',
    loginTitle: 'Inicia sesión para comprar créditos',
    loginText: 'Usa la misma cuenta que en la extensión Chrome y elige un paquete.',
    loginButton: 'Entrar / Registrarse',
    guestReassurance: '¿Aún no tienes cuenta? ¡El registro toma 10 segundos e incluye créditos gratis!',
    guestRegisterLink: 'Crear cuenta gratis',
    balanceLabel: 'Saldo actual',
    balanceText: 'Los créditos se usan para respuestas IA, explicaciones y FocusScan.',
    unitBadge: 'Cómo funcionan los créditos',
    unitTitle: '1 crédito = 1 respuesta IA',
    unitText: 'Un crédito es la unidad de uso. Una pregunta enviada a la IA consume un crédito.',
    unitItems: ['El historial y las notas guardadas no consumen créditos.', 'El modo Kahoot Quiz ID no usa créditos de IA.', 'Las explicaciones o FocusScan adicionales cuentan como nuevas respuestas.'],
    dashboardCta: 'Volver al panel',
    lowTitle: 'Pocos créditos',
    lowText: 'Tus créditos están por agotarse. Recarga para no quedarte sin ellos.',
    packagesBadge: 'Paquetes únicos',
    packagesTitle: 'Recarga cuando lo necesites',
    packagesText: 'Tus preguntas guardadas y el historial siguen disponibles para siempre.',
    popular: 'Más Popular',
    bestValue: 'Mejor Precio',
    loading: 'Redirigiendo...',
    paymentError: 'Los pagos no están disponibles temporalmente. Inténtalo más tarde.',
    emailWarningTitle: 'Usa el correo de tu cuenta QuizSolver',
    emailWarningText: 'Los créditos se asignan a este correo. Mantén el mismo correo en el checkout.',
    confirmBadge: 'Antes del pago',
    confirmTitle: 'Confirma tu correo',
    confirmText: 'Se abrirá la pasarela segura de pago. Mantén el mismo correo electrónico.',
    confirmEmailLabel: 'Correo de QuizSolver',
    confirmNote: 'Si cambias el correo en el checkout, la recarga puede tardar en asignarse.',
    confirmBack: 'Volver',
    confirmContinue: 'Continuar al pago',
    faqTitle: 'Preguntas sobre créditos',
    faq: [
      { question: '¿Cómo recibo los créditos?', answer: 'Tras la confirmación del pago, los créditos se añaden al instante a tu cuenta.' },
      { question: '¿Los créditos caducan?', answer: '¡No! Los créditos comprados nunca caducan. Puedes usarlos cuando quieras.' },
      { question: '¿Puedo cambiar el email en el checkout?', answer: 'No lo cambies. Usa el mismo email que en QuizSolver para que los créditos se asignen de inmediato.' }
    ]
  },
  fr: {
    badge: 'Tarifs Simples',
    pageHeading: 'Choisissez votre pack de crédits',
    subtitle: 'Recharge unique. Sans abonnement ni prélèvement automatique. Les crédits n\'expirent jamais.',
    creditsUnitLabel: 'crédits',
    loginTitle: 'Connectez-vous pour acheter des crédits',
    loginText: 'Utilisez le même compte que dans l’extension Chrome, puis choisissez un pack.',
    loginButton: 'Connexion / Inscription',
    guestReassurance: 'Pas encore de compte ? L’inscription prend 10 secondes avec des crédits offerts !',
    guestRegisterLink: 'Créer un compte gratuit',
    balanceLabel: 'Solde actuel',
    balanceText: 'Les crédits servent aux réponses IA, explications et FocusScan.',
    unitBadge: 'Fonctionnement des crédits',
    unitTitle: '1 crédit = 1 réponse IA',
    unitText: 'Un crédit est l’unité de QuizSolver. Une question envoyée à l’IA consomme 1 crédit.',
    unitItems: ['L’historique et les notes enregistrées ne consomment pas de crédits.', 'Le mode Kahoot Quiz ID n’utilise pas de crédits IA.', 'Les explications et FocusScan comptent comme de nouvelles réponses IA.'],
    dashboardCta: 'Retour au tableau',
    lowTitle: 'Solde faible',
    lowText: 'Vos crédits sont presque épuisés. Rechargez pour ne pas en manquer.',
    packagesBadge: 'Packs uniques',
    packagesTitle: 'Rechargez quand nécessaire',
    packagesText: 'Vos questions sauvegardées et votre historique restent disponibles.',
    popular: 'Le Plus Populaire',
    bestValue: 'Meilleur Prix',
    loading: 'Redirection...',
    paymentError: 'Les paiements sont temporairement indisponibles. Réessayez plus tard.',
    emailWarningTitle: 'Utilisez l\'email de votre compte',
    emailWarningText: 'Les crédits sont attribués à cet email. Gardez-le identique lors du paiement.',
    confirmBadge: 'Avant le paiement',
    confirmTitle: 'Confirmez votre email',
    confirmText: 'Une page de paiement sécurisée va s’ouvrir. Conservez la même adresse email.',
    confirmEmailLabel: 'Email du compte QuizSolver',
    confirmNote: 'Si vous changez d\'email au paiement, la recharge peut être retardée.',
    confirmBack: 'Retour',
    confirmContinue: 'Procéder au paiement',
    faqTitle: 'Questions fréquentes sur les crédits',
    faq: [
      { question: 'Quand reçois-je mes crédits ?', answer: 'Dès la confirmation du paiement, les crédits sont ajoutés automatiquement et instantanément à votre compte.' },
      { question: 'Les crédits expirent-ils ?', answer: 'Non ! Vos crédits achetés n\'expirent jamais et restent valables pour tous vos examens.' },
      { question: 'Puis-je changer d’email lors du paiement ?', answer: 'Ne le changez pas. Utilisez le même email que votre compte QuizSolver pour une attribution instantanée.' }
    ]
  },
  it: {
    badge: 'Prezzi Trasparenti',
    pageHeading: 'Scegli il tuo pacchetto crediti',
    subtitle: 'Ricarica una tantum. Nessun abbonamento né costi nascosti. I crediti non scadono mai.',
    creditsUnitLabel: 'crediti',
    loginTitle: 'Accedi per comprare crediti',
    loginText: 'Usa lo stesso account dell’estensione Chrome e scegli un pacchetto.',
    loginButton: 'Accedi / Registrati',
    guestReassurance: 'Non hai ancora un account? Registrati in 10 secondi e ottieni crediti gratis!',
    guestRegisterLink: 'Crea account gratuito',
    balanceLabel: 'Saldo actual',
    balanceText: 'I crediti servono per risposte AI, spiegazioni e FocusScan.',
    unitBadge: 'Come funzionano i crediti',
    unitTitle: '1 credito = 1 risposta AI',
    unitText: 'Un credito è l’unità di utilizzo. Una domanda inviata all’AI consuma 1 credito.',
    unitItems: ['Cronologia e note salvate non consumano crediti.', 'La modalità Kahoot Quiz ID non usa crediti AI.', 'Spiegazioni e FocusScan contano come nuove risposte AI.'],
    dashboardCta: 'Torna alla dashboard',
    lowTitle: 'Pochi crediti',
    lowText: 'I tuoi crediti stanno per finire. Ricarica per non restare senza durante un quiz.',
    packagesBadge: 'Pacchetti una tantum',
    packagesTitle: 'Ricarica quando serve',
    packagesText: 'Le domande salvate e la cronologia restano sempre disponibili.',
    popular: 'Più Popolare',
    bestValue: 'Miglior Prezzo',
    loading: 'Reindirizzamento...',
    paymentError: 'I pagamenti sono temporaneamente non disponibili. Riprova più tardi.',
    emailWarningTitle: 'Usa l\'email del tuo account QuizSolver',
    emailWarningText: 'I crediti sono associati a questa email. Non cambiarla al checkout.',
    confirmBadge: 'Prima del pagamento',
    confirmTitle: 'Conferma la tua email',
    confirmText: 'Si aprirà la pagina di pagamento sicuro. Mantieni la stessa email dell\'account.',
    confirmEmailLabel: 'Email account QuizSolver',
    confirmNote: 'Se modifichi l\'email al checkout, l\'accredito potrebbe richiedere assistenza manuale.',
    confirmBack: 'Indietro',
    confirmContinue: 'Procedi al pagamento',
    faqTitle: 'Domande frequenti sui crediti',
    faq: [
      { question: 'Quando ricevo i crediti acquistati?', answer: 'Subito dopo la conferma del pagamento, i crediti vengono accreditati all\'istante sul tuo account.' },
      { question: 'I crediti hanno una scadenza?', answer: 'No! I crediti acquistati non scadono mai. Puoi usarli in qualsiasi sessione d\'esame.' },
      { question: 'Posso cambiare l\'email al checkout?', answer: 'No, lascia la stessa email di QuizSolver per un accredito automatico e immediato.' }
    ]
  },
  uk: {
    badge: 'Прості Тарифи',
    pageHeading: 'Обери свій пакет кредитів',
    subtitle: 'Одноразове поповнення. Без підписки та прихованих платежів. Кредити ніколи не згорають.',
    creditsUnitLabel: 'кредитів',
    loginTitle: 'Увійди, щоб купити кредити',
    loginText: 'Використай той самий акаунт, що й у Chrome-розширенні, і вибери пакет.',
    loginButton: 'Увійти / Зареєструватися',
    guestReassurance: 'Ще немає акаунту? Реєстрація займає 10 секунд і дає безкоштовні стартові кредити!',
    guestRegisterLink: 'Створити безкоштовний акаунт',
    balanceLabel: 'Поточний баланс',
    balanceText: 'Кредити використовуються для AI-відповідей, пояснень та FocusScan.',
    unitBadge: 'Як працюють кредити',
    unitTitle: '1 кредит = 1 AI-відповідь',
    unitText: 'Кредит — це одиниця використання. Одне питання до AI витрачає 1 кредит.',
    unitItems: ['Збережена історія і нотатки не витрачають кредити.', 'Режим Kahoot Quiz ID не використовує AI-кредити.', 'Додаткові пояснення або FocusScan рахуються як нові відповіді.'],
    dashboardCta: 'Назад до панелі',
    lowTitle: 'Мало кредитів',
    lowText: 'Кредити майже закінчилися. Поповни зараз, щоб не переривати тест.',
    packagesBadge: 'Одноразові пакети',
    packagesTitle: 'Поповнюй, коли потрібно',
    packagesText: 'Збережені питання та історія залишаються доступними назавжди.',
    popular: 'Найпопулярніший',
    bestValue: 'Найкраща ціна',
    loading: 'Переадресація...',
    paymentError: 'Платежі тимчасово недоступні. Спробуй пізніше.',
    emailWarningTitle: 'Використовуй email свого акаунту',
    emailWarningText: 'Кредити нараховуються на цей email. Не змінюй його під час оплати.',
    confirmBadge: 'Перед оплатою',
    confirmTitle: 'Підтвердь свій email',
    confirmText: 'Зараз відкриється безпечна сторінка оплати. Залиш той самий email.',
    confirmEmailLabel: 'Email акаунту QuizSolver',
    confirmNote: 'Якщо змінити email під час оплати, зарахування кредитів може затриматися.',
    confirmBack: 'Назад',
    confirmContinue: 'Перейти до оплати',
    faqTitle: 'Поширені запитання',
    faq: [
      { question: 'Як швидко нараховуються кредити?', answer: 'Після підтвердження платежу кредити нараховуються автоматично та миттєво.' },
      { question: 'Чи згорають кредити?', answer: 'Ні! Куплені кредити ніколи не закінчуються і залишаються на твоїй сесії назавжди.' },
      { question: 'Чи можна змінити email на сторінці оплати?', answer: 'Не змінюй його. Залиш email твого акаунту QuizSolver для автоматичного поповнення.' }
    ]
  }
};
