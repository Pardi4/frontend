import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '../seo.service';
import { Locale, contentFor, pageData, pathFor } from '../site-content';
import { ShellComponent } from './shell.component';

@Component({
  standalone: true,
  imports: [CommonModule, ShellComponent],
  template: `
    <qs-shell [locale]="locale" pageKey="terms">
      <div class="container terms-page">

        <!-- ================= HERO SECTION ================= -->
        <header class="terms-hero">
          <div class="terms-hero-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>{{ data.badge }}</span>
          </div>

          <h1 class="hero-title">
            {{ data.title }}
          </h1>

          <p class="hero-subtitle text-secondary">
            {{ data.subtitle }}
          </p>

          <!-- Action bar & Metadata -->
          <div class="hero-meta-bar">
            <div class="meta-pill">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>{{ data.effective }}</span>
            </div>

            <a class="meta-pill hoverable" href="mailto:support@getquizsolver.com">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>support&#64;getquizsolver.com</span>
            </a>

            <div class="meta-actions">
              <button class="action-btn" type="button" (click)="printTerms()" [title]="locale === 'pl' ? 'Drukuj lub zapisz jako PDF' : 'Print or save to PDF'">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9"/>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                  <rect x="6" y="14" width="12" height="8"/>
                </svg>
                <span>{{ locale === 'pl' ? 'Drukuj / PDF' : 'Print / PDF' }}</span>
              </button>

              <button class="action-btn" type="button" (click)="copyPageLink()" [title]="locale === 'pl' ? 'Kopiuj link do regulaminu' : 'Copy terms URL'">
                <svg *ngIf="!linkCopied" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                <svg *ngIf="linkCopied" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>{{ linkCopied ? (locale === 'pl' ? 'Skopiowano!' : 'Copied!') : (locale === 'pl' ? 'Kopiuj link' : 'Copy link') }}</span>
              </button>
            </div>
          </div>
        </header>

        <!-- ================= EXECUTIVE HIGHLIGHTS ================= -->
        <section class="highlights-section">
          <div class="highlights-header">
            <span class="eyebrow">{{ locale === 'pl' ? 'W skrócie' : 'At a glance' }}</span>
            <h2 class="highlights-title">{{ locale === 'pl' ? 'Najważniejsze zasady serwisu' : 'Key principles of our terms' }}</h2>
          </div>

          <div class="highlights-grid">
            <div class="highlight-card glass glass-hover" *ngFor="let card of summaryCards">
              <div class="hc-icon" [ngClass]="card.iconClass">
                <svg *ngIf="card.icon === 'building'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 21h18"/>
                  <path d="M9 8h1"/>
                  <path d="M9 12h1"/>
                  <path d="M9 16h1"/>
                  <path d="M14 8h1"/>
                  <path d="M14 12h1"/>
                  <path d="M14 16h1"/>
                  <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/>
                </svg>
                <svg *ngIf="card.icon === 'zap'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                <svg *ngIf="card.icon === 'credit-card'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                <svg *ngIf="card.icon === 'shield-check'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </div>
              <h3 class="hc-title">{{ card.title }}</h3>
              <p class="hc-desc text-secondary">{{ card.desc }}</p>
            </div>
          </div>
        </section>

        <!-- ================= SEARCH BAR ================= -->
        <div class="terms-search-wrapper">
          <div class="search-input-box glass">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              class="search-input"
              [placeholder]="locale === 'pl' ? 'Szukaj w regulaminie (np. zwroty, dpay, reklamacja, kredyty)...' : 'Search terms (e.g. refund, dpay, complaints, credits)...'"
              [value]="searchQuery"
              (input)="onSearchInput($event)"
            />
            <button *ngIf="searchQuery" class="clear-btn" type="button" (click)="clearSearch()">
              ✕
            </button>
          </div>
          <div *ngIf="searchQuery.trim()" class="search-status text-secondary">
            <span>{{ locale === 'pl' ? 'Pasujące sekcje: ' : 'Matching sections: ' }} <strong>{{ matchingCount() }} / {{ data.sections.length }}</strong></span>
          </div>
        </div>

        <!-- ================= MOBILE STICKY NAV ================= -->
        <nav class="mobile-section-nav" aria-label="Nawigacja po sekcjach">
          <div class="mobile-nav-scroller">
            <button
              *ngFor="let s of data.sections; let i = index"
              type="button"
              class="mobile-nav-chip"
              [class.active]="activeSection === i + 1"
              (click)="scrollToSection(i + 1)"
            >
              § {{ i + 1 }}
            </button>
          </div>
        </nav>

        <!-- ================= MAIN TWO-COLUMN CONTENT ================= -->
        <div class="terms-main-grid">

          <!-- STICKY TABLE OF CONTENTS -->
          <aside class="terms-sidebar">
            <div class="sidebar-sticky-wrapper">
              <div class="toc-card glass">
                <div class="toc-header">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6"/>
                    <line x1="8" y1="12" x2="21" y2="12"/>
                    <line x1="8" y1="18" x2="21" y2="18"/>
                    <line x1="3" y1="6" x2="3.01" y2="6"/>
                    <line x1="3" y1="12" x2="3.01" y2="12"/>
                    <line x1="3" y1="18" x2="3.01" y2="18"/>
                  </svg>
                  <span>{{ locale === 'pl' ? 'Spis treści' : 'Table of Contents' }}</span>
                </div>

                <nav class="toc-nav">
                  <button
                    *ngFor="let section of data.sections; let i = index"
                    type="button"
                    class="toc-item"
                    [class.active]="activeSection === i + 1"
                    [class.search-matched]="searchQuery && isSectionMatching(section)"
                    (click)="scrollToSection(i + 1)"
                  >
                    <span class="toc-num">§ {{ i + 1 }}</span>
                    <span class="toc-title">{{ getSectionShortTitle(section.title) }}</span>
                  </button>
                </nav>
              </div>

              <!-- Sidebar Support Callout -->
              <div class="support-card glass">
                <div class="sc-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  <span>{{ locale === 'pl' ? 'Centrum pomocy' : 'Need assistance?' }}</span>
                </div>
                <h4 class="sc-title">{{ locale === 'pl' ? 'Masz pytania do umowy?' : 'Questions about our terms?' }}</h4>
                <p class="sc-desc text-secondary">
                  {{ locale === 'pl' ? 'Nasz zespół odpowiada na zgłoszenia w ciągu maksymalnie 24 godzin.' : 'Our team answers all technical and billing inquiries within 24 hours.' }}
                </p>
                <div class="sc-links">
                  <a class="btn btn-primary btn-sm" [href]="contactPath()">
                    <span>{{ locale === 'pl' ? 'Formularz kontaktowy' : 'Contact form' }}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </a>
                  <a class="sc-sublink highlight" [href]="complaintsPath()">
                    <span>{{ locale === 'pl' ? 'Procedura Reklamacyjna' : 'Complaints Procedure' }}</span>
                  </a>
                  <a class="sc-sublink" [href]="privacyPath()">
                    <span>{{ locale === 'pl' ? 'Polityka Prywatności' : 'Privacy Policy' }}</span>
                  </a>
                </div>
              </div>
            </div>
          </aside>

          <!-- SECTIONS LIST -->
          <main class="terms-sections-list">
            <article
              *ngFor="let section of data.sections; let i = index"
              [id]="'section-' + (i + 1)"
              class="terms-section-card glass"
              [class.highlight-search]="searchQuery && isSectionMatching(section)"
              [class.dimmed-search]="searchQuery && !isSectionMatching(section)"
            >
              <!-- Card Header -->
              <header class="section-card-header">
                <div class="section-pill-tag">
                  <span>§ {{ i + 1 }}</span>
                </div>
                <h2 class="section-title">
                  {{ section.title }}
                </h2>
                <button
                  type="button"
                  class="anchor-btn"
                  (click)="copySectionAnchor(i + 1)"
                  [title]="locale === 'pl' ? 'Kopiuj bezpośredni link do tego paragrafu' : 'Copy link to this section'"
                >
                  <svg *ngIf="copiedSection !== i + 1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                  <span *ngIf="copiedSection === i + 1" class="anchor-copied">{{ locale === 'pl' ? 'Link skopiowany' : 'Copied' }}</span>
                </button>
              </header>

              <!-- Unified Numbered Clauses List: 1., 2., 3., 4. -->
              <div *ngIf="section.items && section.items.length > 0" class="clauses-container">
                <div
                  *ngFor="let item of section.items"
                  class="clause-row"
                  [ngClass]="{
                    'clause-numbered': parseClause(item).type === 'numbered',
                    'clause-sub': parseClause(item).type === 'subclause'
                  }"
                >
                  <!-- Number column: 1., 2., 3. or a), b) -->
                  <div class="clause-num-col">
                    <span class="clause-num">{{ parseClause(item).num }}</span>
                  </div>

                  <!-- Text content column -->
                  <div class="clause-content-col">
                    <strong *ngIf="parseClause(item).prefix" class="clause-prefix">{{ parseClause(item).prefix }}</strong>
                    <span *ngIf="parseClause(item).text" class="clause-text">{{ parseClause(item).prefix ? ' ' + parseClause(item).text : parseClause(item).text }}</span>
                  </div>
                </div>
              </div>

              <!-- Card Bottom Utility -->
              <footer class="section-card-footer">
                <button type="button" class="back-to-top-btn" (click)="scrollToTop()">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5"/>
                    <polyline points="5 12 12 5 19 12"/>
                  </svg>
                  <span>{{ locale === 'pl' ? 'Wróć na górę strony' : 'Back to top' }}</span>
                </button>
              </footer>
            </article>
          </main>

        </div>

        <!-- ================= BOTTOM CONTACT CALLOUT ================= -->
        <section class="terms-bottom-banner glass">
          <div class="tbb-content">
            <span class="eyebrow">{{ locale === 'pl' ? 'Wsparcie prawne i techniczne' : 'Legal & Technical Support' }}</span>
            <h2 class="tbb-title">{{ locale === 'pl' ? 'Potrzebujesz dodatkowych informacji lub faktury?' : 'Need invoice details or custom assistance?' }}</h2>
            <p class="tbb-desc text-secondary">
              {{ locale === 'pl'
                ? 'Nasz dział pomocy chętnie odpowie na wszelkie pytania dotyczące regulaminu, doładowań konta oraz integracji rozszerzenia.'
                : 'Our support team is happy to answer any questions regarding our terms of service, billing policies, and platform features.' }}
            </p>
          </div>
          <div class="tbb-actions">
            <a class="btn btn-primary" [href]="contactPath()">
              <span>{{ locale === 'pl' ? 'Przejdź do formularza kontaktu' : 'Contact Support' }}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
            <a class="btn btn-ghost" [href]="privacyPath()">
              <span>{{ locale === 'pl' ? 'Polityka Prywatności (RODO)' : 'Privacy Policy (GDPR)' }}</span>
            </a>
          </div>
        </section>

      </div>
    </qs-shell>
  `,
  styles: [`
    /* ============================================================
       QuizSolver — Premium Legal Terms Styling
       ============================================================ */
    .terms-page {
      padding-top: 3.5rem;
      padding-bottom: 6rem;
    }

    /* ---------- HERO SECTION ---------- */
    .terms-hero {
      text-align: center;
      max-width: 860px;
      margin: 0 auto 3.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .terms-hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 1rem;
      border-radius: var(--radius-full);
      background: rgba(124, 92, 252, 0.12);
      border: 1px solid rgba(124, 92, 252, 0.35);
      color: #c4b5fd;
      font-size: 0.825rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 1.25rem;
    }

    .hero-title {
      font-size: clamp(2.25rem, 5vw, 3.4rem);
      font-weight: 900;
      line-height: 1.15;
      letter-spacing: -0.03em;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #ffffff 40%, var(--accent-cyan) 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .hero-subtitle {
      font-size: 1.15rem;
      line-height: 1.65;
      max-width: 680px;
      margin-bottom: 2rem;
    }

    .hero-meta-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
    }

    .meta-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.45rem 0.95rem;
      border-radius: var(--radius-full);
      background: var(--bg-surface);
      border: 1px solid var(--border);
      color: var(--text-secondary);
      font-size: 0.85rem;
      font-weight: 500;
      transition: all 0.25s ease;
    }

    .meta-pill.hoverable:hover {
      border-color: var(--accent-cyan);
      color: var(--text-primary);
    }

    .meta-actions {
      display: inline-flex;
      gap: 0.5rem;
    }

    .action-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.45rem 0.95rem;
      border-radius: var(--radius-full);
      background: rgba(14, 165, 233, 0.08);
      border: 1px solid rgba(14, 165, 233, 0.3);
      color: var(--accent-cyan);
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s var(--ease-out);
    }

    .action-btn:hover {
      background: rgba(14, 165, 233, 0.18);
      border-color: var(--accent-cyan);
      transform: translateY(-1px);
    }

    /* ---------- EXECUTIVE HIGHLIGHTS ---------- */
    .highlights-section {
      margin-bottom: 3.5rem;
    }

    .highlights-header {
      text-align: center;
      margin-bottom: 1.75rem;
    }

    .highlights-title {
      font-size: 1.5rem;
      font-weight: 800;
      margin-top: 0.35rem;
    }

    .highlights-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
    }

    .highlight-card {
      padding: 1.5rem;
      border-radius: var(--radius-lg);
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      position: relative;
      overflow: hidden;
    }

    .hc-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.25rem;
    }

    .hc-icon.violet {
      background: rgba(124, 92, 252, 0.15);
      color: #a78bfa;
      border: 1px solid rgba(124, 92, 252, 0.3);
    }

    .hc-icon.amber {
      background: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }

    .hc-icon.cyan {
      background: rgba(14, 165, 233, 0.15);
      color: #38bdf8;
      border: 1px solid rgba(14, 165, 233, 0.3);
    }

    .hc-icon.emerald {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .hc-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .hc-desc {
      font-size: 0.875rem;
      line-height: 1.55;
    }

    /* ---------- SEARCH BAR ---------- */
    .terms-search-wrapper {
      max-width: 680px;
      margin: 0 auto 3rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.6rem;
    }

    .search-input-box {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.75rem 1.25rem;
      border-radius: var(--radius-full);
      border: 1px solid var(--border);
      background: var(--bg-surface);
      transition: all 0.25s ease;
    }

    .search-input-box:focus-within {
      border-color: var(--accent-cyan);
      box-shadow: 0 0 20px rgba(14, 165, 233, 0.18);
    }

    .search-icon {
      color: var(--text-tertiary);
      flex-shrink: 0;
    }

    .search-input {
      flex: 1;
      background: none;
      border: none;
      color: var(--text-primary);
      font-size: 0.95rem;
      outline: none;
    }

    .search-input::placeholder {
      color: var(--text-tertiary);
    }

    .clear-btn {
      color: var(--text-tertiary);
      font-size: 0.95rem;
      cursor: pointer;
      padding: 0 0.25rem;
      transition: color 0.2s;
    }

    .clear-btn:hover {
      color: var(--text-primary);
    }

    .search-status {
      font-size: 0.85rem;
    }

    /* ---------- MOBILE SECTION CHIPS ---------- */
    .mobile-section-nav {
      display: none;
      margin-bottom: 2rem;
      position: sticky;
      top: 72px;
      z-index: 20;
      background: rgba(16, 19, 24, 0.92);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--border);
    }

    .mobile-nav-scroller {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      padding-bottom: 0.25rem;
      scrollbar-width: none;
    }

    .mobile-nav-scroller::-webkit-scrollbar {
      display: none;
    }

    .mobile-nav-chip {
      flex-shrink: 0;
      padding: 0.4rem 0.85rem;
      border-radius: var(--radius-full);
      background: var(--bg-surface);
      border: 1px solid var(--border);
      color: var(--text-secondary);
      font-size: 0.825rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .mobile-nav-chip.active {
      background: var(--grad-primary);
      color: #fff;
      border-color: transparent;
    }

    /* ---------- MAIN TWO-COLUMN GRID ---------- */
    .terms-main-grid {
      display: grid;
      grid-template-columns: 290px minmax(0, 1fr);
      gap: 3rem;
      align-items: start;
    }

    /* ---------- STICKY SIDEBAR ---------- */
    .terms-sidebar {
      position: sticky;
      top: 92px;
    }

    .sidebar-sticky-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      max-height: calc(100vh - 110px);
      overflow-y: auto;
      padding-right: 0.5rem;
      scrollbar-width: thin;
      scrollbar-color: var(--border) transparent;
    }

    .toc-card {
      padding: 1.5rem;
      border-radius: var(--radius-lg);
    }

    .toc-header {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-weight: 700;
      font-size: 1rem;
      color: var(--text-primary);
      padding-bottom: 0.85rem;
      border-bottom: 1px solid var(--border);
      margin-bottom: 0.85rem;
    }

    .toc-nav {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .toc-item {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.55rem 0.75rem;
      border-radius: var(--radius-md);
      font-size: 0.865rem;
      text-align: left;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
      background: none;
      border: 1px solid transparent;
      width: 100%;
    }

    .toc-item:hover {
      background: rgba(255, 255, 255, 0.04);
      color: var(--text-primary);
    }

    .toc-item.active {
      background: rgba(14, 165, 233, 0.12);
      border-color: rgba(14, 165, 233, 0.35);
      color: #38bdf8;
      font-weight: 600;
    }

    .toc-item.search-matched {
      border-left: 3px solid var(--accent-amber);
    }

    .toc-num {
      font-family: var(--font-heading);
      font-weight: 700;
      font-size: 0.8rem;
      color: var(--accent-violet);
      flex-shrink: 0;
      background: rgba(124, 92, 252, 0.15);
      padding: 0.15rem 0.45rem;
      border-radius: var(--radius-sm);
    }

    .toc-item.active .toc-num {
      background: rgba(14, 165, 233, 0.25);
      color: #38bdf8;
    }

    .toc-title {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Support Callout Card in sidebar */
    .support-card {
      padding: 1.5rem;
      border-radius: var(--radius-lg);
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }

    .sc-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--accent-cyan);
      font-size: 0.775rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .sc-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .sc-desc {
      font-size: 0.825rem;
      line-height: 1.5;
    }

    .sc-links {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .btn-sm {
      padding: 0.55rem 1rem;
      font-size: 0.85rem;
    }

    .sc-sublink {
      font-size: 0.825rem;
      color: var(--text-tertiary);
      text-align: center;
      transition: color 0.2s;
    }

    .sc-sublink:hover {
      color: var(--text-primary);
    }

    /* ---------- TERMS SECTIONS LIST ---------- */
    .terms-sections-list {
      display: flex;
      flex-direction: column;
      gap: 2.25rem;
    }

    .terms-section-card {
      padding: 2.5rem;
      border-radius: var(--radius-xl);
      scroll-margin-top: 100px;
      transition: border-color 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
      position: relative;
    }

    .terms-section-card.highlight-search {
      border-color: rgba(245, 158, 11, 0.6);
      box-shadow: 0 0 25px rgba(245, 158, 11, 0.12);
    }

    .terms-section-card.dimmed-search {
      opacity: 0.35;
    }

    .section-card-header {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1.5rem;
      position: relative;
    }

    .section-pill-tag {
      flex-shrink: 0;
      padding: 0.3rem 0.65rem;
      border-radius: var(--radius-sm);
      background: var(--grad-primary);
      color: #fff;
      font-family: var(--font-heading);
      font-weight: 800;
      font-size: 0.85rem;
      letter-spacing: 0.05em;
      box-shadow: 0 2px 10px rgba(124, 92, 252, 0.35);
      margin-top: 0.15rem;
    }

    .section-title {
      flex: 1;
      font-size: clamp(1.25rem, 3vw, 1.6rem);
      font-weight: 800;
      line-height: 1.3;
      color: var(--text-primary);
    }

    .anchor-btn {
      color: var(--text-tertiary);
      padding: 0.4rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.3rem;
      margin-top: 0.15rem;
    }

    .anchor-btn:hover {
      color: var(--accent-cyan);
      background: rgba(14, 165, 233, 0.1);
    }

    .anchor-copied {
      font-size: 0.75rem;
      color: #10b981;
      font-weight: 600;
    }

    /* ---------- UNIFIED CLAUSES LIST: 1., 2., 3., 4. ---------- */
    .clauses-container {
      display: flex;
      flex-direction: column;
      gap: 1.15rem;
    }

    .clause-row {
      display: flex;
      align-items: baseline;
      gap: 0.85rem;
      padding: 0.2rem 0;
    }

    .clause-row.clause-sub {
      margin-left: 2.25rem;
      gap: 0.75rem;
    }

    .clause-num-col {
      flex-shrink: 0;
      min-width: 1.6rem;
      text-align: right;
    }

    .clause-row.clause-sub .clause-num-col {
      min-width: 1.4rem;
    }

    .clause-num {
      font-family: var(--font-heading);
      font-weight: 800;
      font-size: 1.05rem;
      color: var(--accent-cyan);
      display: inline-block;
    }

    .clause-row.clause-sub .clause-num {
      color: #c4b5fd;
      font-size: 0.95rem;
      font-weight: 700;
    }

    .clause-content-col {
      flex: 1;
      font-size: 1rem;
      line-height: 1.7;
    }

    .clause-prefix {
      color: #f8fafc;
      font-weight: 700;
    }

    .clause-text {
      color: #cbd5e1;
    }

    /* ---------- SECTION FOOTER ---------- */
    .section-card-footer {
      display: flex;
      justify-content: flex-end;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .back-to-top-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--text-tertiary);
      font-size: 0.825rem;
      cursor: pointer;
      transition: color 0.2s;
    }

    .back-to-top-btn:hover {
      color: var(--text-primary);
    }

    /* ---------- BOTTOM CONTACT BANNER ---------- */
    .terms-bottom-banner {
      margin-top: 4.5rem;
      padding: 3rem;
      border-radius: var(--radius-2xl);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2.5rem;
      border: 1px solid var(--border);
      background: linear-gradient(135deg, rgba(23, 28, 36, 0.95), rgba(124, 92, 252, 0.08));
    }

    .tbb-content {
      max-width: 640px;
    }

    .tbb-title {
      font-size: 1.75rem;
      font-weight: 800;
      margin: 0.5rem 0 0.75rem;
    }

    .tbb-desc {
      font-size: 0.975rem;
      line-height: 1.6;
    }

    .tbb-actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      flex-shrink: 0;
    }

    /* ---------- RESPONSIVE BREAKPOINTS ---------- */
    @media (max-width: 1100px) {
      .highlights-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 992px) {
      .terms-main-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .terms-sidebar {
        display: none;
      }

      .mobile-section-nav {
        display: block;
      }

      .terms-bottom-banner {
        flex-direction: column;
        align-items: flex-start;
        padding: 2rem;
      }

      .tbb-actions {
        width: 100%;
        flex-direction: row;
      }
    }

    @media (max-width: 768px) {
      .terms-section-card {
        padding: 1.75rem 1.25rem;
      }

      .highlights-grid {
        grid-template-columns: 1fr;
      }

      .clause-row.clause-sub {
        margin-left: 1.25rem;
      }

      .tbb-actions {
        flex-direction: column;
      }
    }

    /* ---------- PRINT STYLES ---------- */
    @media print {
      body {
        background: #fff !important;
        color: #000 !important;
      }

      .terms-sidebar,
      .terms-search-wrapper,
      .mobile-section-nav,
      .highlights-section,
      .terms-bottom-banner,
      .meta-actions,
      .back-to-top-btn,
      .anchor-btn {
        display: none !important;
      }

      .terms-main-grid {
        display: block !important;
      }

      .terms-section-card {
        border: 1px solid #ccc !important;
        box-shadow: none !important;
        background: #fff !important;
        color: #000 !important;
        margin-bottom: 2rem !important;
        page-break-inside: avoid;
      }

      .clause-text {
        color: #222 !important;
      }
    }
  `]
})
export class TermsComponent implements OnInit, AfterViewInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);

  protected locale: Locale = 'en';
  protected c = contentFor('en');
  protected data = pageData('terms', 'en');

  protected activeSection = 1;
  protected searchQuery = '';
  protected linkCopied = false;
  protected copiedSection: number | null = null;

  ngOnInit(): void {
    this.locale = (this.route.snapshot.data['locale'] || 'en') as Locale;
    this.c = contentFor(this.locale);
    this.data = pageData('terms', this.locale);
    this.seo.applyPage('terms', this.locale);
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;

    // Observe active section when scrolling
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          if (id && id.startsWith('section-')) {
            const num = parseInt(id.replace('section-', ''), 10);
            if (!isNaN(num)) {
              this.activeSection = num;
            }
          }
        }
      }
    }, {
      rootMargin: '-90px 0px -60% 0px',
      threshold: 0
    });

    document.querySelectorAll('.terms-section-card').forEach((el) => {
      observer.observe(el);
    });
  }

  protected get summaryCards(): Array<{ icon: string; iconClass: string; title: string; desc: string }> {
    if (this.locale === 'pl') {
      return [
        {
          icon: 'building',
          iconClass: 'emerald',
          title: 'Dane Usługodawcy',
          desc: 'Kamil Pardała (działalność nierejestrowana), ul. Drukarska 7/15, Kraków. 100% jawności i bezpośredni kontakt.'
        },
        {
          icon: 'zap',
          iconClass: 'amber',
          title: 'Brak Subskrypcji',
          desc: '100% jednorazowe pakiety kredytów, które nigdy nie wygasają. Zero automatycznych obciążeń karty.'
        },
        {
          icon: 'credit-card',
          iconClass: 'cyan',
          title: 'Płatności dpay & Lemon',
          desc: 'BLIK i przelewy PLN przez licencjonowane Payments Lab (KNF MIP 85/2020) oraz Lemon Squeezy (karty, Apple Pay).'
        },
        {
          icon: 'shield-check',
          iconClass: 'violet',
          title: 'Zwroty i Reklamacje',
          desc: 'Natychmiastowe świadczenie cyfrowe (art. 38). Ustawowa gwarancja rozpatrzenia reklamacji w 14 dni.'
        }
      ];
    }
    return [
      {
        icon: 'building',
        iconClass: 'emerald',
        title: 'Verified Merchant',
        desc: 'Kamil Pardała (unregistered business), ul. Drukarska 7/15, Krakow, Poland. Full legal identity and direct support.'
      },
      {
        icon: 'zap',
        iconClass: 'amber',
        title: 'No Subscriptions',
        desc: 'One-time credit top-ups with lifetime validity. Zero recurring charges or auto-renewals.'
      },
      {
        icon: 'credit-card',
        iconClass: 'cyan',
        title: 'Licensed Gateways',
        desc: 'dpay (BLIK & PLN transfers, KNF MIP 85/2020) and Lemon Squeezy (global cards, Apple Pay, Google Pay).'
      },
      {
        icon: 'shield-check',
        iconClass: 'violet',
        title: 'Digital Waiver & Claims',
        desc: 'Instant digital supply waiver (Art. 38). Statutory 14-day complaints resolution guarantee.'
      }
    ];
  }

  protected getSectionShortTitle(title: string): string {
    return title.replace(/^§\s*\d+\.\s*/, '').trim();
  }

  protected parseClause(item: string): {
    type: 'numbered' | 'subclause' | 'plain';
    num: string;
    prefix?: string;
    text: string;
  } {
    const trimmed = item.trim();

    // 1) Match numbered clause: e.g. "1. ", "2. ", "10. "
    const numMatch = trimmed.match(/^(\d+\.)\s*(.*)$/);
    if (numMatch) {
      const num = numMatch[1];
      const rest = numMatch[2];

      const colonIdx = rest.indexOf(':');
      if (colonIdx > 0 && colonIdx < 40) {
        const prefix = rest.substring(0, colonIdx + 1);
        const text = rest.substring(colonIdx + 1).trim();
        return { type: 'numbered', num, prefix, text };
      }

      return { type: 'numbered', num, text: rest };
    }

    // 2) Match subclause: e.g. "a) ", "b) "
    const subMatch = trimmed.match(/^([a-z]\))\s*(.*)$/i);
    if (subMatch) {
      const num = subMatch[1];
      const rest = subMatch[2];

      const colonIdx = rest.indexOf(':');
      if (colonIdx > 0 && colonIdx < 40) {
        const prefix = rest.substring(0, colonIdx + 1);
        const text = rest.substring(colonIdx + 1).trim();
        return { type: 'subclause', num, prefix, text };
      }

      return { type: 'subclause', num, text: rest };
    }

    return { type: 'plain', num: '', text: trimmed };
  }

  protected onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target?.value || '';
  }

  protected clearSearch(): void {
    this.searchQuery = '';
  }

  protected isSectionMatching(section: any): boolean {
    if (!this.searchQuery || !this.searchQuery.trim()) return true;
    const q = this.searchQuery.toLowerCase().trim();
    if (section.title && section.title.toLowerCase().includes(q)) return true;
    if (section.text && section.text.toLowerCase().includes(q)) return true;
    if (section.items && Array.isArray(section.items)) {
      return section.items.some((item: string) => item.toLowerCase().includes(q));
    }
    return false;
  }

  protected matchingCount(): number {
    if (!this.searchQuery.trim()) return 0;
    return this.data.sections.filter((s: any) => this.isSectionMatching(s)).length;
  }

  protected scrollToSection(index: number): void {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    const el = document.getElementById(`section-${index}`);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      this.activeSection = index;
    }
  }

  protected scrollToTop(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  protected printTerms(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }

  protected copyPageLink(): void {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      this.linkCopied = true;
      setTimeout(() => {
        this.linkCopied = false;
      }, 2500);
    }
  }

  protected copySectionAnchor(index: number): void {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      const url = `${window.location.origin}${window.location.pathname}#section-${index}`;
      navigator.clipboard.writeText(url);
      this.copiedSection = index;
      setTimeout(() => {
        if (this.copiedSection === index) {
          this.copiedSection = null;
        }
      }, 2000);
    }
  }

  protected contactPath(): string {
    return pathFor('contact', this.locale);
  }

  protected complaintsPath(): string {
    return pathFor('complaints', this.locale);
  }

  protected privacyPath(): string {
    return pathFor('privacy', this.locale);
  }
}
