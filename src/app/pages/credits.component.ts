import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, AfterViewInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { SeoService } from '../seo.service';
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

        <!-- Payment Error Alert (if any) -->
        <section class="payment-error glass" *ngIf="buyError()">
          {{ buyError() }}
        </section>

        <!-- MAIN PRICING DECK: Front & center, immediately visible without scrolling! -->
        <section id="pricing" class="packages-section">
          <div class="packages-deck">
            <article class="package-card glass glass-hover" *ngFor="let pack of packs" [class.featured]="pack.id === 'popular'">
              <span *ngIf="pack.badge" class="featured-badge">{{ pack.badge[locale] || pack.badge['en'] }}</span>

              <!-- Clear Credit Count as Hero of Card -->
              <div class="pack-credits-header">
                <div class="pack-credits-number text-gradient-strong">{{ pack.credits }}</div>
                <div class="pack-credits-label">{{ copy.creditsUnitLabel }}</div>
              </div>

              <!-- Price & Unit Rate Calculation -->
              <div class="pack-pricing-block">
                <div class="pack-price">{{ pack.price }}</div>
                <div class="pack-rate text-secondary" [class.highlight]="pack.id === 'popular' || pack.id === 'pro'">
                  {{ pack.rateInfo[locale] }}
                </div>
              </div>

              <!-- Clear, Honest Recommendation of Pack Size -->
              <p class="pack-use-case text-secondary">{{ pack.useCase[locale] }}</p>

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

        <!-- Checkout Email Confirmation Modal -->
        <div class="checkout-confirm-backdrop" *ngIf="pendingPack()" (click)="cancelCheckout()">
          <section class="checkout-confirm glass" (click)="$event.stopPropagation()">
            <p class="eyebrow">{{ label('confirmBadge') }}</p>
            <h2>{{ label('confirmTitle') }}</h2>
            <p class="text-secondary">{{ label('confirmText') }}</p>
            <div class="confirm-email">
              <span>{{ label('confirmEmailLabel') }}</span>
              <code>{{ api.currentUser()?.email }}</code>
            </div>
            <p class="confirm-note">{{ label('confirmNote') }}</p>
            <div class="confirm-actions">
              <button class="btn btn-outline" type="button" (click)="cancelCheckout()">{{ label('confirmBack') }}</button>
              <button class="btn btn-primary" type="button" (click)="continueCheckout()" [disabled]="!!buying()">
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
    .pack-price {
      font-family: var(--font-heading);
      font-size: 2.35rem;
      font-weight: 850;
      color: var(--text-primary);
      line-height: 1;
    }
    .pack-rate {
      font-size: 0.84rem;
      font-weight: 700;
      margin-top: 0.35rem;
    }
    .pack-rate.highlight {
      color: var(--accent-cyan);
    }
    .pack-use-case {
      font-size: 0.92rem;
      margin: 0.25rem 0 1.25rem;
      min-height: 2.8em;
      line-height: 1.45;
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
    .confirm-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    /* Responsive */
    @media (max-width: 960px) {
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
  protected readonly pathFor = pathFor;

  protected locale: Locale = 'en';
  protected data = pageData('credits', 'en');
  protected copy = CREDITS_COPY.en;

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
      rateInfo: {
        en: '~$0.02 / answer',
        pl: '~$0.02 za odpowiedź',
        de: '~$0.02 pro Antwort',
        es: '~$0.02 por respuesta',
        fr: '~$0.02 par réponse',
        it: '~$0.02 per risposta',
        uk: '~$0.02 за відповідь'
      },
      useCase: {
        en: 'Great for a quick test or 1–2 homework assignments',
        pl: 'Na szybkie sprawdzenie lub 1–2 mniejsze testy',
        de: 'Ideal für einen schnellen Test oder 1–2 Aufgaben',
        es: 'Ideal para una prueba rápida o 1–2 tareas cortas',
        fr: 'Idéal pour un test rapide ou 1–2 devoirs',
        it: 'Ideale per un test veloce o 1–2 singoli compiti',
        uk: 'На швидку перевірку або 1–2 короткі тести'
      },
      button: { en: 'Buy 100 credits', pl: 'Kup 100 kredytów', de: '100 Credits kaufen', es: 'Comprar 100 créditos', fr: 'Acheter 100 crédits', it: 'Compra 100 crediti', uk: 'Купити 100 кредитів' }
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
      useCase: {
        en: 'Best for weekly homework, tests & midterm prep',
        pl: 'Świetne na regularne kolokwia i prace domowe',
        de: 'Optimal für wöchentliche Tests und Aufgaben',
        es: 'Ideal para exámenes semanales y tareas',
        fr: 'Idéal pour examens réguliers et devoirs',
        it: 'Perfetto per prove settimanali ed esami',
        uk: 'Ідеально для щотижневих тестів та завдань'
      },
      button: { en: 'Buy 500 credits', pl: 'Kup 500 kredytów', de: '500 Credits kaufen', es: 'Comprar 500 créditos', fr: 'Acheter 500 crédits', it: 'Compra 500 crediti', uk: 'Купити 500 кредитів' }
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
      rateInfo: {
        en: '<$0.008 / answer (Lowest rate)',
        pl: '<$0.008 za odpowiedź (Największy rabat)',
        de: '<$0.008 pro Antwort (Bester Rabatt)',
        es: '<$0.008 por respuesta (Mayor ahorro)',
        fr: '<$0.008 par réponse (Plus grosse remise)',
        it: '<$0.008 per risposta (Massimo sconto)',
        uk: '<$0.008 за відповідь (Найбільша знижка)'
      },
      useCase: {
        en: 'Massive supply for midterms, finals & exam seasons',
        pl: 'Zapas na całą sesję egzaminacyjną lub cały semestr',
        de: 'Großer Vorrat für Prüfungsphasen & das ganze Semester',
        es: 'Gran reserva para exámenes parciales y finales',
        fr: 'Grande réserve pour partiels et période d\'examens',
        it: 'Scorta abbondante per sessioni d\'esame e semestre',
        uk: 'Великий запас на модулі, сесію та цілий семестр'
      },
      button: { en: 'Buy 2000 credits', pl: 'Kup 2000 kredytów', de: '2000 Credits kaufen', es: 'Comprar 2000 créditos', fr: 'Acheter 2000 crédits', it: 'Compra 2000 crediti', uk: 'Купити 2000 кредитів' }
    }
  ];

  protected get valueComp() {
    const data: Record<Locale, { badge: string; title: string; tutor: string; tutorPrice: string; qs: string; qsPrice: string; note: string }> = {
      en: { badge: 'Smart investment', title: 'How QuizSolver compares', tutor: 'Private tutoring', tutorPrice: '$30–50 / hour', qs: 'QuizSolver 500 credits', qsPrice: '$4.99 for ~500 answers', note: 'Credits never expire. No subscription. Pay once, use whenever you need.' },
      pl: { badge: 'Mądra inwestycja', title: 'Jak QuizSolver wypada na tle alternatyw', tutor: 'Korepetycje', tutorPrice: '80–150 zł / godzina', qs: 'QuizSolver 500 kredytów', qsPrice: '$4.99 za ~500 odpowiedzi', note: 'Kredyty nigdy nie wygasają. Bez abonamentu. Płacisz raz, używasz kiedy potrzebujesz.' },
      de: { badge: 'Kluge Investition', title: 'QuizSolver im Vergleich', tutor: 'Nachhilfe', tutorPrice: '25–40 € / Stunde', qs: 'QuizSolver 500 Credits', qsPrice: '$4.99 für ~500 Antworten', note: 'Credits verfallen nie. Kein Abo. Einmal bezahlen, jederzeit nutzen.' },
      es: { badge: 'Inversión inteligente', title: 'Cómo se compara QuizSolver', tutor: 'Tutorías privadas', tutorPrice: '$20–40 / hora', qs: 'QuizSolver 500 créditos', qsPrice: '$4.99 por ~500 respuestas', note: 'Los créditos nunca caducan. Sin suscripción. Paga una vez, usa cuando quieras.' },
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
    trackGa4Event('credits_page_view', { locale: this.locale, from: this.route.snapshot.queryParamMap.get('from') || '' });
  }

  ngOnDestroy(): void {}

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
    this.pendingPack.set(pack);
    trackGa4Event('checkout_initiated', { pack, locale: this.locale });
  }

  protected cancelCheckout(): void {
    if (this.buying()) return;
    this.pendingPack.set('');
  }

  protected async continueCheckout(): Promise<void> {
    trackGa4Event('checkout_confirmed', { pack: this.pendingPack(), locale: this.locale });
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
      body: JSON.stringify({ pack })
    });
    this.buying.set('');
    this.pendingPack.set('');
    if (result.success && result.checkoutUrl) window.location.href = result.checkoutUrl;
    else this.buyError.set(result.error || this.copy.paymentError);
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
