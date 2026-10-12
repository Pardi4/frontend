import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { SeoService } from '../seo.service';
import { Locale, contentFor, pageData, pathFor } from '../site-content';
import { ShellComponent } from './shell.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ShellComponent],
  template: `
    <qs-shell [locale]="locale" pageKey="contact">
      <div class="container contact-page">
        <!-- Hero Section -->
        <section class="utility-hero">
          <div class="utility-hero-grid">
            <div>
              <span class="eyebrow">{{ data.badge }}</span>
              <h1 class="hero-title">{{ data.title }}</h1>
              <p class="hero-subtitle text-secondary">{{ data.subtitle }}</p>
              <div class="utility-meta">
                <span class="meta-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {{ data.responseTime }}
                </span>
                <span class="meta-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  contact&#64;getquizsolver.com
                </span>
              </div>
            </div>
            <aside class="utility-callout glass">
              <span class="callout-pill">{{ locale === 'pl' ? 'Wsparcie online' : 'Live Support Desk' }}</span>
              <h2>{{ c.common.brand }} Support</h2>
              <p class="text-secondary">{{ data.companyInfo?.desc || c.footer.description }}</p>
              <div class="callout-details">
                <div class="detail-row">
                  <span class="detail-label">{{ locale === 'pl' ? 'Godziny pracy:' : 'Working hours:' }}</span>
                  <span class="detail-val">{{ data.companyInfo?.hours || 'Mon–Fri 9:00–18:00 CET' }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">{{ locale === 'pl' ? 'Operatorzy płatności:' : 'Payment Gateways:' }}</span>
                  <span class="detail-val">DPay (BLIK), Lemon Squeezy</span>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <!-- Department Contact Cards -->
        <section class="departments-section">
          <div class="cards-grid">
            <article class="dept-card glass glass-hover" *ngFor="let card of data.cards">
              <div class="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <h3>{{ card.title }}</h3>
              <p class="text-secondary">{{ card.desc }}</p>
              <a class="dept-email" [href]="'mailto:' + card.email">
                <span>{{ card.email }}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </a>
            </article>
          </div>
        </section>

        <!-- Direct Contact Form & Company Details -->
        <section class="form-section">
          <div class="form-layout">
            <!-- Left: Interactive Form -->
            <div class="form-card glass">
              <div class="form-card-header">
                <h2>{{ data.form.title }}</h2>
                <p class="text-secondary">{{ data.form.subtitle }}</p>
              </div>

              <!-- Success Notification -->
              <div class="alert-success glass" *ngIf="sentSuccess()">
                <div class="alert-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <strong>{{ locale === 'pl' ? 'Wiadomość wysłana!' : 'Message sent successfully!' }}</strong>
                  <p>{{ data.form.successMsg }}</p>
                </div>
                <button type="button" class="btn btn-sm btn-outline" (click)="resetForm()">
                  {{ locale === 'pl' ? 'Wyślij kolejną' : 'Send another' }}
                </button>
              </div>

              <!-- Form Element -->
              <form (ngSubmit)="sendMessage()" *ngIf="!sentSuccess()" class="contact-form">
                <div class="form-row">
                  <div class="form-group">
                    <label for="c-name">{{ data.form.nameLabel }}</label>
                    <input
                      id="c-name"
                      class="form-input"
                      type="text"
                      name="name"
                      [(ngModel)]="name"
                      [placeholder]="data.form.namePlaceholder"
                      maxlength="100"
                    />
                  </div>
                  <div class="form-group">
                    <label for="c-email">{{ data.form.emailLabel }} <span class="req-star">*</span></label>
                    <input
                      id="c-email"
                      class="form-input"
                      type="email"
                      name="email"
                      [(ngModel)]="email"
                      [placeholder]="data.form.emailPlaceholder"
                      required
                      maxlength="200"
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label for="c-subject">{{ data.form.subjectLabel }}</label>
                  <select id="c-subject" class="form-input form-select" name="subject" [(ngModel)]="subject">
                    <option value="" disabled selected>{{ data.form.subjectPlaceholder }}</option>
                    <option *ngFor="let s of data.form.subjects" [value]="s">{{ s }}</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="c-message">{{ data.form.messageLabel }} <span class="req-star">*</span></label>
                  <textarea
                    id="c-message"
                    class="form-input form-textarea"
                    name="message"
                    rows="5"
                    [(ngModel)]="message"
                    [placeholder]="data.form.messagePlaceholder"
                    required
                    maxlength="4000"
                  ></textarea>
                </div>

                <div class="form-error" *ngIf="errorMessage()">
                  {{ errorMessage() }}
                </div>

                <button class="btn btn-primary btn-block submit-btn" type="submit" [disabled]="sending() || !email || !message">
                  <span *ngIf="!sending()">{{ data.form.submitBtn }}</span>
                  <span *ngIf="sending()">{{ data.form.sendingBtn }}</span>
                </button>
              </form>
            </div>

            <!-- Right: Service & Legal Summary (Crucial for DPay Verification) -->
            <aside class="legal-summary-card glass">
              <h3>{{ data.companyInfo.title }}</h3>
              <p class="summary-desc text-secondary">{{ data.companyInfo.desc }}</p>

              <div class="info-list">
                <div class="info-item">
                  <span class="info-label">{{ locale === 'pl' ? 'Serwis internetowy:' : 'Service domain:' }}</span>
                  <a class="info-value" href="https://getquizsolver.com">getquizsolver.com</a>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ locale === 'pl' ? 'Oficjalny e-mail:' : 'Official email:' }}</span>
                  <a class="info-value" href="mailto:contact@getquizsolver.com">contact&#64;getquizsolver.com</a>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ locale === 'pl' ? 'Wsparcie i reklamacje:' : 'Support & claims:' }}</span>
                  <a class="info-value" href="mailto:support@getquizsolver.com">support&#64;getquizsolver.com</a>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ locale === 'pl' ? 'Rozpatrywanie reklamacji:' : 'Complaint resolution:' }}</span>
                  <span class="info-value-text">{{ locale === 'pl' ? 'Do 14 dni kalendarzowych drogą mailową' : 'Within 14 calendar days via email' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ locale === 'pl' ? 'Dostępne płatności:' : 'Accepted payments:' }}</span>
                  <span class="info-value-text">DPay (BLIK, Przelewy w PLN), Lemon Squeezy (Karty, Apple Pay, Google Pay)</span>
                </div>
              </div>

              <div class="legal-links-block">
                <a class="legal-link" [href]="pathFor('terms', locale)">
                  <span>{{ data.companyInfo.termsLinkText }}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
                <a class="legal-link" [href]="pathFor('privacy', locale)">
                  <span>{{ data.companyInfo.privacyLinkText }}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </qs-shell>
  `,
  styles: [`
    .contact-page {
      padding-bottom: 5rem;
    }
    .utility-hero {
      padding: 5rem 0 3rem;
    }
    .utility-hero-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(20rem, 0.8fr);
      gap: 3rem;
      align-items: center;
    }
    .hero-title {
      font-size: clamp(2rem, 5vw, 3.2rem);
      margin-top: 0.5rem;
      font-weight: 900;
      letter-spacing: -0.02em;
    }
    .hero-subtitle {
      font-size: 1.15rem;
      margin: 1rem 0 1.5rem;
      max-width: 44rem;
      line-height: 1.6;
    }
    .utility-meta {
      display: flex;
      gap: 1.75rem;
      font-size: 0.9rem;
      color: var(--text-secondary);
      flex-wrap: wrap;
    }
    .meta-item {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--accent-cyan);
      font-weight: 600;
    }
    .utility-callout {
      padding: 2.25rem;
      border-radius: var(--radius-xl);
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(15, 23, 42, 0.6);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
    }
    .callout-pill {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--accent-cyan);
      background: rgba(6, 182, 212, 0.12);
      border: 1px solid rgba(6, 182, 212, 0.28);
      padding: 0.25rem 0.65rem;
      border-radius: 999px;
      margin-bottom: 0.75rem;
    }
    .utility-callout h2 {
      font-size: 1.45rem;
      margin: 0 0 0.5rem;
    }
    .utility-callout p {
      font-size: 0.92rem;
      line-height: 1.55;
      margin: 0 0 1.25rem;
    }
    .callout-details {
      display: grid;
      gap: 0.6rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      gap: 0.75rem;
      font-size: 0.85rem;
      flex-wrap: wrap;
    }
    .detail-label {
      color: var(--text-secondary);
    }
    .detail-val {
      color: var(--text-primary);
      font-weight: 700;
    }

    /* Department Cards */
    .departments-section {
      padding: 1.5rem 0 3rem;
    }
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
    }
    .dept-card {
      padding: 2rem;
      border-radius: var(--radius-xl);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .dept-card:hover {
      transform: translateY(-3px);
      border-color: rgba(6, 182, 212, 0.35);
    }
    .card-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      background: rgba(6, 182, 212, 0.12);
      color: var(--accent-cyan);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.25rem;
    }
    .dept-card h3 {
      font-size: 1.2rem;
      margin: 0;
    }
    .dept-card p {
      font-size: 0.92rem;
      line-height: 1.5;
      margin: 0;
      flex: 1;
    }
    .dept-email {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--accent-cyan);
      font-size: 0.88rem;
      font-weight: 700;
      text-decoration: none;
      margin-top: 0.5rem;
      transition: gap 0.2s ease;
    }
    .dept-email:hover {
      gap: 0.65rem;
      text-decoration: underline;
    }

    /* Form & Legal Section */
    .form-section {
      padding: 1rem 0 2rem;
    }
    .form-layout {
      display: grid;
      grid-template-columns: minmax(0, 1.4fr) minmax(20rem, 0.8fr);
      gap: 2.5rem;
      align-items: start;
    }
    .form-card {
      padding: 2.75rem;
      border-radius: var(--radius-xl);
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(15, 23, 42, 0.5);
    }
    .form-card-header h2 {
      font-size: 1.65rem;
      margin: 0 0 0.5rem;
    }
    .form-card-header p {
      margin: 0 0 2rem;
      font-size: 0.95rem;
    }
    .contact-form {
      display: grid;
      gap: 1.25rem;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
    }
    .form-group {
      display: grid;
      gap: 0.45rem;
    }
    .form-group label {
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--text-secondary);
    }
    .req-star {
      color: #ef4444;
    }
    .form-input {
      width: 100%;
      padding: 0.85rem 1.15rem;
      background: rgba(3, 7, 18, 0.55);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: var(--radius-md);
      color: var(--text-primary);
      font-family: inherit;
      font-size: 0.95rem;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      box-sizing: border-box;
    }
    .form-input:focus {
      outline: none;
      border-color: var(--accent-cyan);
      box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.2);
    }
    .form-select {
      cursor: pointer;
    }
    .form-textarea {
      resize: vertical;
      min-height: 120px;
    }
    .submit-btn {
      padding: 1rem 1.5rem;
      font-size: 1.05rem;
      font-weight: 800;
      margin-top: 0.5rem;
    }
    .form-error {
      color: #f87171;
      font-size: 0.9rem;
      font-weight: 600;
      padding: 0.5rem 0.75rem;
      background: rgba(239, 68, 68, 0.1);
      border-radius: var(--radius-sm);
      border: 1px solid rgba(239, 68, 68, 0.3);
    }
    .alert-success {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.75rem;
      border-radius: var(--radius-lg);
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.25);
      margin-bottom: 1.5rem;
    }
    .alert-success p {
      margin: 0.25rem 0 1rem;
      font-size: 0.92rem;
      color: var(--text-secondary);
    }

    /* Right: Legal Summary Box */
    .legal-summary-card {
      padding: 2.5rem;
      border-radius: var(--radius-xl);
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(15, 23, 42, 0.5);
    }
    .legal-summary-card h3 {
      font-size: 1.35rem;
      margin: 0 0 0.5rem;
    }
    .summary-desc {
      font-size: 0.92rem;
      margin: 0 0 1.5rem;
      line-height: 1.5;
    }
    .info-list {
      display: grid;
      gap: 1.15rem;
      padding-bottom: 1.75rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      margin-bottom: 1.75rem;
    }
    .info-item {
      display: grid;
      gap: 0.25rem;
    }
    .info-label {
      font-size: 0.8rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-secondary);
    }
    .info-value {
      font-size: 0.95rem;
      color: var(--accent-cyan);
      text-decoration: none;
      font-weight: 700;
      word-break: break-all;
    }
    .info-value:hover {
      text-decoration: underline;
    }
    .info-value-text {
      font-size: 0.92rem;
      color: var(--text-primary);
      line-height: 1.45;
    }
    .legal-links-block {
      display: grid;
      gap: 0.75rem;
    }
    .legal-link {
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.85rem 1.15rem;
      border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: var(--text-primary);
      font-size: 0.9rem;
      font-weight: 700;
      text-decoration: none;
      transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
    }
    .legal-link:hover {
      background: rgba(6, 182, 212, 0.1);
      border-color: rgba(6, 182, 212, 0.35);
      color: var(--accent-cyan);
    }

    @media (max-width: 960px) {
      .utility-hero-grid,
      .form-layout {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      .form-row {
        grid-template-columns: 1fr;
      }
      .form-card,
      .legal-summary-card {
        padding: 1.75rem;
      }
    }
  `]
})
export class ContactComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly api = inject(ApiService);

  protected locale: Locale = 'en';
  protected c = contentFor('en');
  protected data = pageData('contact', 'en');
  protected readonly pathFor = pathFor;

  protected name = '';
  protected email = '';
  protected subject = '';
  protected message = '';
  protected readonly sending = signal(false);
  protected readonly sentSuccess = signal(false);
  protected readonly errorMessage = signal('');

  ngOnInit(): void {
    this.locale = (this.route.snapshot.data['locale'] || 'en') as Locale;
    this.c = contentFor(this.locale);
    this.data = pageData('contact', this.locale);
    this.seo.applyPage('contact', this.locale);

    // Pre-fill email if user is logged in
    const user = this.api.currentUser();
    if (user?.email) {
      this.email = user.email;
      if (user.displayName) this.name = user.displayName;
    }
  }

  protected async sendMessage(): Promise<void> {
    if (!this.email || !this.message) return;
    this.errorMessage.set('');
    this.sending.set(true);

    try {
      const res = await this.api.request('/api/support/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: this.name.trim() || undefined,
          email: this.email.trim(),
          subject: this.subject.trim() || (this.locale === 'pl' ? 'Wiadomość z formularza kontaktowego' : 'Website contact request'),
          message: this.message.trim()
        })
      });

      this.sending.set(false);

      if (res && res.success) {
        this.sentSuccess.set(true);
      } else {
        this.errorMessage.set(res?.error || this.data.form.errorMsg);
      }
    } catch {
      this.sending.set(false);
      this.errorMessage.set(this.data.form.errorMsg);
    }
  }

  protected resetForm(): void {
    this.sentSuccess.set(false);
    this.message = '';
    this.subject = '';
    this.errorMessage.set('');
  }
}
