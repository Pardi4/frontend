import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { AdminDashboardComponent }  from './admin-dashboard.component';
import { AdminErrorsComponent }     from './admin-errors.component';
import { AdminUsersComponent }      from './admin-users.component';
import { AdminSupportComponent }    from './admin-support.component';
import { AdminParserComponent }     from './admin-parser.component';
import { AdminCacheComponent }      from './admin-cache.component';
import { AdminPurchasesComponent }  from './admin-purchases.component';
import { AdminSystemComponent }     from './admin-system.component';
import { AdminMarketingComponent }  from './admin-marketing.component';
import { AdminDatasetComponent }    from './admin-dataset.component';

import { ADMIN_PANEL_ROUTE_PATH } from '../admin-path';

export type AdminTab = 'dashboard' | 'errors' | 'users' | 'support' | 'parser' | 'cache' | 'purchases' | 'system' | 'marketing' | 'dataset';

export interface AdminToast {
  id: number;
  msg: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface NavItem { id: AdminTab; label: string; icon: string; }
interface NavGroup { label: string; items: NavItem[]; }

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Przegląd',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: '⬛' },
      { id: 'errors',    label: 'Centrum Błędów', icon: '⚠️' },
    ]
  },
  {
    label: 'Użytkownicy',
    items: [
      { id: 'users',     label: 'Użytkownicy', icon: '👤' },
      { id: 'support',   label: 'Support',     icon: '📬' },
      { id: 'purchases', label: 'Zakupy',       icon: '💳' },
    ]
  },
  {
    label: 'Platforma',
    items: [
      { id: 'parser',    label: 'Parser',    icon: '🔍' },
      { id: 'cache',     label: 'Cache',     icon: '💾' },
      { id: 'system',    label: 'System',    icon: '🖥️' },
    ]
  },
  {
    label: 'Narzędzia',
    items: [
      { id: 'marketing', label: 'Marketing', icon: '📣' },
      { id: 'dataset',   label: 'Dataset',   icon: '📄' },
    ]
  }
];

const TAB_TITLES: Record<AdminTab, string> = {
  dashboard:  'Dashboard',
  errors:     'Centrum Błędów',
  users:      'Użytkownicy',
  support:    'Support',
  purchases:  'Zakupy',
  parser:     'Parser',
  cache:      'Cache',
  system:     'System',
  marketing:  'Marketing',
  dataset:    'Dataset',
};

const TAB_DESCRIPTIONS: Record<AdminTab, string> = {
  dashboard:  'Statystyki platformy, priorytety i wykres przychodów.',
  errors:     'Błędy klienta, zgłoszenia użytkowników i błędy parsera w jednym miejscu.',
  users:      'Zarządzaj kontami, kredytami, banami i historią pytań.',
  support:    'Skrzynka supportu — czytaj, odpowiadaj i przydzielaj kredyty.',
  purchases:  'Przeglądaj płatności i zastosuj oczekujące kredyty.',
  parser:     'Zdrowie parsera, analityka platform i dziennik eventów.',
  cache:      'Przeglądaj i zarządzaj cache odpowiedzi AI.',
  system:     'Stan serwera, bezpieczeństwo billingowe i log kredytów.',
  marketing:  'Kampanie email i kody rabatowe LemonSqueezy.',
  dataset:    'Przeglądarka datasetu parsera (JSONL).',
};

@Component({
  selector: 'app-admin',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FormsModule,
    AdminDashboardComponent,
    AdminErrorsComponent,
    AdminUsersComponent,
    AdminSupportComponent,
    AdminParserComponent,
    AdminCacheComponent,
    AdminPurchasesComponent,
    AdminSystemComponent,
    AdminMarketingComponent,
    AdminDatasetComponent,
  ],
  styleUrls: ['./admin-new.css'],
  template: `
<div class="admin-root">
  <!-- ══════════ LOGIN ══════════ -->
  <ng-container *ngIf="!isAuthed(); else shell">
    <div class="a-login-wrap">
      <div class="a-login-card anim-in">
        <a class="a-login-brand" href="/">
          <div class="a-brand-icon">QS</div>
          <div class="a-brand-text">
            <strong>QuizSolver</strong>
            <small>Panel Admina</small>
          </div>
        </a>

        <h1 style="font-size:22px;font-weight:800;margin-bottom:6px">Zaloguj się</h1>
        <p class="t2" style="font-size:13px;margin-bottom:28px">Dostęp tylko dla administratorów platformy.</p>

        <button class="a-btn a-btn-secondary a-btn-block a-btn-lg" type="button" (click)="googleLogin()" [disabled]="loading()">
          <span style="font-weight:800;font-size:15px">G</span> Kontynuuj z Google
        </button>

        <div class="a-divider">lub</div>

        <form (ngSubmit)="login()">
          <div class="a-input-group mb-4">
            <label class="a-label">Email</label>
            <input class="a-input" type="email" name="email" [(ngModel)]="email" autocomplete="email" placeholder="admin@example.com">
          </div>
          <div class="a-input-group mb-4">
            <label class="a-label">Hasło</label>
            <input class="a-input" type="password" name="password" [(ngModel)]="password" autocomplete="current-password" placeholder="••••••••">
          </div>
          <div *ngIf="loginError()" style="font-size:12px;color:var(--danger);margin-bottom:12px;padding:8px 12px;background:var(--danger-bg);border-radius:var(--radius-sm)">
            {{ loginError() }}
          </div>
          <button class="a-btn a-btn-primary a-btn-block a-btn-lg" type="submit" [disabled]="loading()">
            {{ loading() ? 'Logowanie...' : 'Zaloguj się' }}
          </button>
        </form>
      </div>
    </div>
  </ng-container>

  <!-- ══════════ SHELL ══════════ -->
  <ng-template #shell>
    <!-- Sidebar overlay (mobile) -->
    <div class="a-overlay" [class.on]="mobileSidebarOpen()" (click)="mobileSidebarOpen.set(false)"></div>

    <div class="a-shell">
      <!-- ── Sidebar ── -->
      <aside class="a-sidebar" [class.mob-open]="mobileSidebarOpen()">

        <!-- Brand -->
        <a class="a-sidebar-brand" href="/">
          <div class="a-brand-icon">QS</div>
          <div class="a-brand-text">
            <strong>Admin Panel</strong>
            <small>QuizSolver</small>
          </div>
        </a>

        <!-- Quick alert badges -->
        <div class="a-sidebar-badges">
          <button class="a-qbadge" [class.hot]="bugCount() > 0 || clientErrorCount() > 0" (click)="navTo('errors')">
            <span class="a-qbadge-icon">⚠️</span>
            <span class="a-qbadge-lbl">Błędy</span>
            <span class="a-qbadge-count">{{ bugCount() + clientErrorCount() }}</span>
          </button>
          <button class="a-qbadge" [class.hot]="supportCount() > 0" (click)="navTo('support')">
            <span class="a-qbadge-icon">📬</span>
            <span class="a-qbadge-lbl">Support</span>
            <span class="a-qbadge-count">{{ supportCount() }}</span>
          </button>
          <button class="a-qbadge" [class.hot]="parserFailCount() > 0" (click)="navTo('parser')">
            <span class="a-qbadge-icon">🔍</span>
            <span class="a-qbadge-lbl">Parser</span>
            <span class="a-qbadge-count">{{ parserFailCount() }}</span>
          </button>
        </div>

        <!-- Nav groups -->
        <nav class="a-nav" aria-label="Admin navigation">
          <ng-container *ngFor="let group of navGroups">
            <div class="a-nav-group-lbl">{{ group.label }}</div>
            <button
              *ngFor="let item of group.items"
              class="a-nav-btn"
              [class.active]="activeTab() === item.id"
              [attr.aria-current]="activeTab() === item.id ? 'page' : null"
              type="button"
              (click)="navTo(item.id)">
              <span class="a-nav-icon">{{ item.icon }}</span>
              <span class="a-nav-label">{{ item.label }}</span>
              <span class="a-nav-badge" *ngIf="item.id === 'errors' && (bugCount() + clientErrorCount()) > 0">
                {{ bugCount() + clientErrorCount() }}
              </span>
              <span class="a-nav-badge" *ngIf="item.id === 'support' && supportCount() > 0">{{ supportCount() }}</span>
            </button>
          </ng-container>
        </nav>

        <!-- Footer -->
        <div class="a-sidebar-foot">
          <div class="a-sidebar-foot-row">
            <button class="a-locale-btn" [class.active]="locale() === 'pl'" (click)="setLocale('pl')">PL</button>
            <button class="a-locale-btn" [class.active]="locale() === 'en'" (click)="setLocale('en')">EN</button>
          </div>
          <button class="a-btn a-btn-secondary a-btn-sm a-btn-block" type="button" (click)="refresh()" [disabled]="loading()">
            🔄 Odśwież
          </button>
          <button class="a-btn a-btn-ghost a-btn-sm a-btn-block" type="button" (click)="logout()">
            Wyloguj
          </button>
        </div>
      </aside>

      <!-- ── Main ── -->
      <main class="a-main">
        <!-- Header -->
        <header class="a-header">
          <div class="a-header-left">
            <button class="a-hamburger" type="button" (click)="mobileSidebarOpen.set(!mobileSidebarOpen())" aria-label="Menu">
              ☰
            </button>
            <div>
              <div class="a-header-title">{{ tabTitle() }}</div>
              <div class="a-header-sub">{{ tabDescription() }}</div>
            </div>
          </div>
          <div class="a-header-actions">
            <button class="a-btn a-btn-secondary a-btn-sm" type="button" (click)="refresh()" [disabled]="loading()">
              🔄
            </button>
            <a class="a-btn a-btn-ghost a-btn-sm" [href]="locale() === 'pl' ? '/pl/dashboard' : '/dashboard'">Dashboard</a>
            <a class="a-btn a-btn-primary a-btn-sm" [href]="locale() === 'pl' ? '/pl' : '/'">Strona ↗</a>
          </div>
        </header>

        <!-- Content -->
        <div class="a-content">
          <app-admin-dashboard  *ngIf="activeTab() === 'dashboard'"  [p]="this"></app-admin-dashboard>
          <app-admin-errors     *ngIf="activeTab() === 'errors'"     [p]="this"></app-admin-errors>
          <app-admin-users      *ngIf="activeTab() === 'users'"      [p]="this"></app-admin-users>
          <app-admin-support    *ngIf="activeTab() === 'support'"    [p]="this"></app-admin-support>
          <app-admin-parser     *ngIf="activeTab() === 'parser'"     [p]="this"></app-admin-parser>
          <app-admin-cache      *ngIf="activeTab() === 'cache'"      [p]="this"></app-admin-cache>
          <app-admin-purchases  *ngIf="activeTab() === 'purchases'"  [p]="this"></app-admin-purchases>
          <app-admin-system     *ngIf="activeTab() === 'system'"     [p]="this"></app-admin-system>
          <app-admin-marketing  *ngIf="activeTab() === 'marketing'"  [p]="this"></app-admin-marketing>
          <app-admin-dataset    *ngIf="activeTab() === 'dataset'"    [p]="this"></app-admin-dataset>
        </div>
      </main>
    </div>

    <!-- ── Mobile Bottom Nav ── -->
    <nav class="a-bnav" aria-label="Mobile navigation">
      <div class="a-bnav-inner">
        <button class="a-bnav-btn" [class.active]="activeTab() === 'dashboard'" (click)="navTo('dashboard')">
          <span class="a-bnav-ico">⬛</span>
          <span class="a-bnav-lbl">Home</span>
        </button>
        <button class="a-bnav-btn" [class.active]="activeTab() === 'errors'" (click)="navTo('errors')">
          <span class="a-bnav-ico">⚠️</span>
          <span class="a-bnav-lbl">Błędy</span>
          <span class="a-bnav-dot" *ngIf="bugCount() + clientErrorCount() > 0"></span>
        </button>
        <button class="a-bnav-btn" [class.active]="activeTab() === 'users'" (click)="navTo('users')">
          <span class="a-bnav-ico">👤</span>
          <span class="a-bnav-lbl">Użytkownicy</span>
        </button>
        <button class="a-bnav-btn" [class.active]="activeTab() === 'support'" (click)="navTo('support')">
          <span class="a-bnav-ico">📬</span>
          <span class="a-bnav-lbl">Support</span>
          <span class="a-bnav-dot" *ngIf="supportCount() > 0"></span>
        </button>
        <button class="a-bnav-btn" [class.active]="activeTab() === 'system' || activeTab() === 'parser' || activeTab() === 'cache' || activeTab() === 'purchases' || activeTab() === 'marketing' || activeTab() === 'dataset'"
          (click)="mobileSidebarOpen.set(true)">
          <span class="a-bnav-ico">☰</span>
          <span class="a-bnav-lbl">Więcej</span>
        </button>
      </div>
    </nav>
  </ng-template>

  <!-- ── Toast notifications ── -->
  <div class="a-toasts" aria-live="polite">
    <div *ngFor="let t of toasts()" class="a-toast" [class]="t.type">
      <span class="a-toast-ico">
        <ng-container [ngSwitch]="t.type">
          <ng-container *ngSwitchCase="'success'">✓</ng-container>
          <ng-container *ngSwitchCase="'error'">✗</ng-container>
          <ng-container *ngSwitchCase="'warning'">⚠</ng-container>
          <ng-container *ngSwitchDefault>ℹ</ng-container>
        </ng-container>
      </span>
      <span class="a-toast-msg">{{ t.msg }}</span>
    </div>
  </div>
</div>
  `
})
export class AdminComponent implements OnInit, OnDestroy {

  // ── State ──────────────────────────────────────────
  isAuthed      = signal(false);
  loading       = signal(false);
  loginError    = signal('');
  activeTab     = signal<AdminTab>('dashboard');
  mobileSidebarOpen = signal(false);
  toasts        = signal<AdminToast[]>([]);
  locale        = signal<'pl'|'en'>('pl');

  // Global badge counts
  bugCount         = signal(0);
  supportCount     = signal(0);
  clientErrorCount = signal(0);
  parserFailCount  = signal(0);

  // Global stats (shared with dashboard)
  stats    = signal<any>({});
  health   = signal<any>({});
  billing  = signal<any>({});

  // Login form fields
  email    = '';
  password = '';

  // Nav definition
  readonly navGroups = NAV_GROUPS;

  private toastCounter = 0;
  private isBrowser: boolean;
  private refreshInterval: any;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private route: ActivatedRoute,
    private title: Title,
    private meta: Meta
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // ── Lifecycle ─────────────────────────────────────
  ngOnInit() {
    this.title.setTitle('Admin — QuizSolver');
    if (!this.isBrowser) return;

    const token = localStorage.getItem('qs_admin_token') || localStorage.getItem('qs_token');
    if (token) this.checkAuth(token);

    // Restore last tab
    const savedTab = localStorage.getItem('qs_admin_tab') as AdminTab;
    if (savedTab && TAB_TITLES[savedTab]) this.activeTab.set(savedTab);

    // Auto-refresh badge counts every 2 min
    this.refreshInterval = setInterval(() => this.loadBadges(), 120_000);
  }

  ngOnDestroy() {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
  }

  // ── Auth ──────────────────────────────────────────
  async checkAuth(token: string) {
    try {
      const res = await this.rawApi('/api/auth/me', { token });
      if (res.user?.role === 'admin') {
        this.isAuthed.set(true);
        await this.loadBadges();
        await this.loadStats();
      } else {
        localStorage.removeItem('qs_admin_token');
        localStorage.removeItem('qs_token');
      }
    } catch { /* not authed */ }
  }

  async login() {
    if (!this.email || !this.password) {
      this.loginError.set('Podaj email i hasło.');
      return;
    }
    this.loading.set(true);
    this.loginError.set('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.email, password: this.password })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('qs_admin_token', data.token);
        localStorage.setItem('qs_token', data.token);
        if (data.user?.role !== 'admin') {
          this.loginError.set('Brak uprawnień administratora.');
          localStorage.removeItem('qs_admin_token');
        } else {
          this.isAuthed.set(true);
          this.password = '';
          await this.loadBadges();
          await this.loadStats();
        }
      } else {
        this.loginError.set(data.error || 'Logowanie nie powiodło się.');
      }
    } catch {
      this.loginError.set('Błąd połączenia z serwerem.');
    }
    this.loading.set(false);
  }

  googleLogin() {
    const base = window.location.origin;
    const redirect = encodeURIComponent(`${base}/${ADMIN_PANEL_ROUTE_PATH}`);
    window.location.href = `/api/auth/google?redirectUrl=${redirect}`;
  }

  logout() {
    localStorage.removeItem('qs_admin_token');
    localStorage.removeItem('qs_token');
    this.isAuthed.set(false);
    this.stats.set({});
    this.health.set({});
  }

  // ── API helper ────────────────────────────────────
  async api(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = localStorage.getItem('qs_admin_token') || localStorage.getItem('qs_token') || '';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> || {})
    };
    try {
      const res = await fetch(endpoint, { ...options, headers });
      if (res.status === 401) { this.logout(); return {}; }
      return await res.json();
    } catch {
      return { error: 'Błąd sieci.' };
    }
  }

  private async rawApi(endpoint: string, opts: { token?: string } = {}) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (opts.token) headers['Authorization'] = `Bearer ${opts.token}`;
    const res = await fetch(endpoint, { headers });
    return res.json();
  }

  // ── Data loading ──────────────────────────────────
  async loadBadges() {
    try {
      const [statsRes, errorsRes] = await Promise.all([
        this.api('/api/admin/stats'),
        this.api('/api/admin/client-errors?limit=1')
      ]);
      if (statsRes.stats) {
        const s = statsRes.stats;
        this.bugCount.set(s.unreadBugReports || 0);
        this.supportCount.set(s.unreadSupportMessages || 0);
        this.parserFailCount.set(s.failedParserEvents || 0);
        this.stats.set(s);
      }
      if (errorsRes.pagination) {
        this.clientErrorCount.set(errorsRes.pagination.total || 0);
      }
    } catch { /* silent */ }
  }

  async loadStats() {
    try {
      const [statsRes, healthRes] = await Promise.all([
        this.api('/api/admin/stats'),
        this.api('/api/admin/system/health')
      ]);
      if (statsRes.stats) this.stats.set(statsRes.stats);
      if (healthRes.health) this.health.set(healthRes.health);
    } catch { /* silent */ }
  }

  async refresh() {
    this.loading.set(true);
    await Promise.all([this.loadBadges(), this.loadStats()]);
    this.toast('Dane odświeżone', 'success');
    this.loading.set(false);
  }

  // ── Navigation ────────────────────────────────────
  navTo(tab: AdminTab) {
    this.activeTab.set(tab);
    this.mobileSidebarOpen.set(false);
    if (this.isBrowser) localStorage.setItem('qs_admin_tab', tab);
  }

  tabTitle() { return TAB_TITLES[this.activeTab()]; }
  tabDescription() { return TAB_DESCRIPTIONS[this.activeTab()]; }

  setLocale(l: 'pl' | 'en') {
    this.locale.set(l);
    if (this.isBrowser) localStorage.setItem('qs_admin_locale', l);
  }

  // ── Toasts ────────────────────────────────────────
  toast(msg: string, type: AdminToast['type'] = 'info') {
    const id = ++this.toastCounter;
    this.toasts.update(t => [...t.slice(-2), { id, msg, type }]);
    setTimeout(() => this.toasts.update(t => t.filter(x => x.id !== id)), 4000);
  }

  // ── Formatting helpers (shared with sub-components) ──
  formatDate(d: string | Date | undefined, full = false): string {
    if (!d) return '—';
    const date = new Date(d);
    if (isNaN(date.getTime())) return '—';
    if (full) return date.toLocaleString('pl-PL');
    const now = Date.now();
    const diff = (now - date.getTime()) / 1000;
    if (diff < 60) return 'przed chwilą';
    if (diff < 3600) return `${Math.floor(diff / 60)} min temu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} h temu`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} dni temu`;
    return date.toLocaleDateString('pl-PL');
  }

  formatMoney(n: number): string {
    if (!n) return '$0';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
  }

  formatBytes(b: number): string {
    if (!b) return '0 B';
    const k = 1024;
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(b) / Math.log(k));
    return `${(b / Math.pow(k, i)).toFixed(1)} ${units[i]}`;
  }
}
