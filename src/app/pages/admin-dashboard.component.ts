import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './admin.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="a-section anim-in">

  <!-- ── Priority Queue + Stats ── -->
  <div class="a-grid-2">
    <div class="a-card">
      <div class="a-card-header">
        <div>
          <div class="a-card-title">🎯 Priorytety</div>
          <div class="a-card-subtitle">Rzeczy do sprawdzenia teraz</div>
        </div>
        <button class="a-btn a-btn-ghost a-btn-sm" (click)="load()" [disabled]="loading()">🔄</button>
      </div>
      <div class="a-card-body">
        <div class="a-pq" *ngIf="priorityItems().length">
          <button *ngFor="let item of priorityItems()" class="a-pq-item" [class]="item.tone" type="button" (click)="p.navTo(item.tab)">
            <span class="a-pq-ico">{{ item.icon }}</span>
            <div class="a-pq-body">
              <div class="a-pq-lbl">{{ item.label }}</div>
              <div class="a-pq-note">{{ item.note }}</div>
            </div>
            <div class="a-pq-val">{{ item.value }}</div>
          </button>
        </div>
        <div *ngIf="!priorityItems().length && !loading()" class="a-pq-empty">
          <strong>✅ Wszystko spokojne</strong>Brak pilnych spraw.
        </div>
        <div *ngIf="loading()" style="color:var(--text-3);font-size:13px;text-align:center;padding:20px">Ładowanie...</div>
      </div>
    </div>

    <div class="a-card">
      <div class="a-card-header">
        <div class="a-card-title">📊 Platforma</div>
      </div>
      <div class="a-card-body">
        <div class="a-stats-grid">
          <div *ngFor="let card of statsCards()" class="a-stat">
            <div class="a-stat-label">{{ card.label }}</div>
            <div class="a-stat-value" [class]="card.cls">{{ card.value }}</div>
            <div class="a-stat-note" *ngIf="card.note">{{ card.note }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════
       CHART CARD
       ══════════════════════════════════════════ -->
  <div class="a-card">
    <!-- Chart header -->
    <div class="a-card-header" style="flex-wrap:wrap;gap:10px">
      <div>
        <div class="a-card-title">📈 Analityka przychodów i rejestracji</div>
        <div class="a-card-subtitle" *ngIf="!chartLoading()">
          {{ periodLabel() }} · Łącznie: <strong class="tc">{{ periodRevenue() }}</strong> przychodu · <strong class="ta">{{ periodSignups() }}</strong> nowych kont
        </div>
      </div>
      <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
        <!-- Range selector -->
        <div class="a-chart-toggle">
          <button *ngFor="let r of ranges" [class.on]="chartRange === r.value" (click)="setRange(r.value)">{{ r.label }}</button>
        </div>
        <!-- Type toggle -->
        <div class="a-chart-toggle">
          <button [class.on]="chartType === 'line'" (click)="setType('line')">〰 Linia</button>
          <button [class.on]="chartType === 'bar'"  (click)="setType('bar')">▊ Słupki</button>
        </div>
        <button class="a-btn a-btn-ghost a-btn-sm" (click)="loadChart()" [disabled]="chartLoading()" title="Odśwież">🔄</button>
      </div>
    </div>

    <!-- Period summary mini-cards -->
    <div *ngIf="!chartLoading() && chartData()" style="padding:0 20px 12px;display:flex;gap:10px;flex-wrap:wrap">
      <div *ngFor="let s of periodSummary()" style="flex:1;min-width:120px;padding:10px 14px;background:var(--surface-2);border-radius:var(--radius-sm);border:1px solid var(--border)">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-3);margin-bottom:4px">{{ s.label }}</div>
        <div class="bold" style="font-size:16px" [class]="s.cls">{{ s.value }}</div>
        <div *ngIf="s.sub" style="font-size:11px;color:var(--text-3);margin-top:2px">{{ s.sub }}</div>
      </div>
    </div>

    <!-- Dataset toggles -->
    <div *ngIf="!chartLoading() && chartData()" style="padding:0 20px 10px;display:flex;gap:8px;align-items:center;flex-wrap:wrap">
      <button class="a-ds-toggle" [class.on-rev]="showRevenue" (click)="toggleDataset('revenue')">
        <span class="a-ds-dot" style="background:#22d3ee"></span> Przychód (USD)
      </button>
      <button class="a-ds-toggle" [class.on-sig]="showSignups" (click)="toggleDataset('signups')">
        <span class="a-ds-dot" style="background:#6366f1"></span> Rejestracje
      </button>
      <button class="a-ds-toggle" [class.on-credits]="showCredits" (click)="toggleDataset('credits')">
        <span class="a-ds-dot" style="background:#f59e0b"></span> Kredyty sprzedane
      </button>
    </div>

    <!-- Canvas -->
    <div class="a-card-body" style="padding:0 16px 16px">
      <div *ngIf="chartLoading()" style="height:280px;display:flex;align-items:center;justify-content:center;color:var(--text-3)">
        <div style="text-align:center">
          <div style="font-size:24px;margin-bottom:8px;animation:aFadeIn .8s ease infinite alternate">📈</div>
          <div>Ładowanie danych wykresu...</div>
        </div>
      </div>
      <div *ngIf="!chartLoading() && !chartData()" style="height:280px;display:flex;align-items:center;justify-content:center;color:var(--text-3)">
        Brak danych do wykresu.
      </div>
      <div [style.display]="!chartLoading() && chartData() ? 'block' : 'none'" style="position:relative;height:280px">
        <canvas #chartCanvas></canvas>
      </div>
    </div>

    <!-- Hover tooltip (custom day detail) -->
    <div *ngIf="hoveredDay()" style="padding:10px 20px;border-top:1px solid var(--border);display:flex;gap:24px;font-size:12px;flex-wrap:wrap">
      <span class="bold t2">{{ hoveredDay()?.label }}</span>
      <span class="tc" *ngIf="showRevenue">💰 {{ hoveredDay()?.revenue }}</span>
      <span class="ta" *ngIf="showSignups">👥 {{ hoveredDay()?.signups }} rejestracji</span>
      <span class="tw" *ngIf="showCredits">🎟 {{ hoveredDay()?.credits }} kredytów</span>
    </div>
  </div>

  <!-- ── System health ── -->
  <div class="a-card">
    <div class="a-card-header">
      <div class="a-card-title">🖥️ Stan systemu</div>
      <button class="a-btn a-btn-ghost a-btn-sm" (click)="p.navTo('system')">Szczegóły →</button>
    </div>
    <div class="a-card-body">
      <div class="a-health-grid">
        <div *ngFor="let hc of healthCards()" class="a-hcard">
          <div class="a-hcard-label">{{ hc.label }}</div>
          <div class="a-hcard-value" [class]="hc.cls">{{ hc.value }}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- ── Recent users ── -->
  <div class="a-card" *ngIf="recentUsers().length">
    <div class="a-card-header">
      <div class="a-card-title">🆕 Ostatnio zarejestrowane konta</div>
      <button class="a-btn a-btn-ghost a-btn-sm" (click)="p.navTo('users')">Wszyscy →</button>
    </div>
    <div class="a-table-wrap">
      <table class="a-table">
        <thead>
          <tr>
            <th>Użytkownik</th>
            <th>Logowanie</th>
            <th>Kredyty</th>
            <th>Email</th>
            <th>Zarejestrowany</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let u of recentUsers()">
            <td>
              <div style="display:flex;align-items:center;gap:10px">
                <div [style]="avatarStyle(u)" style="width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;flex-shrink:0">
                  {{ (u.displayName || u.email || '?').charAt(0).toUpperCase() }}
                </div>
                <div>
                  <div class="bold sm trunc" style="max-width:160px">{{ u.displayName || u.email }}</div>
                  <div class="xs t3 trunc" *ngIf="u.displayName">{{ u.email }}</div>
                </div>
              </div>
            </td>
            <td>
              <span *ngFor="let pr of (u.authProviders || [])" class="a-badge a-badge-muted" style="font-size:10px;margin-right:3px">{{ providerIcon(pr) }} {{ pr }}</span>
            </td>
            <td class="tc bold">{{ u.credits }}</td>
            <td>
              <span class="a-badge" style="font-size:10px" [class]="u.emailVerified ? 'a-badge-success' : 'a-badge-warning'">
                {{ u.emailVerified ? '✓ OK' : '⚠ Nie' }}
              </span>
            </td>
            <td class="xs t3">{{ p.formatDate(u.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

</div>
  `
})
export class AdminDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() p!: AdminComponent;
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  loading      = signal(false);
  chartLoading = signal(false);
  recentUsers  = signal<any[]>([]);
  chartData    = signal<any>(null);
  hoveredDay   = signal<any>(null);

  chartType: 'line' | 'bar' = 'line';
  chartRange = 30;
  showRevenue = true;
  showSignups = true;
  showCredits = false;

  ranges = [
    { label: '7 dni',  value: 7  },
    { label: '14 dni', value: 14 },
    { label: '30 dni', value: 30 },
  ];

  private chartInstance: any;
  private chartLib:      any;
  private rawLabels:     string[]  = [];
  private rawRevenue:    number[]  = [];
  private rawSignups:    number[]  = [];
  private rawCredits:    number[]  = [];

  ngOnInit()       { this.load(); }
  ngAfterViewInit(){ this.loadChart(); }
  ngOnDestroy()    { this.destroyChart(); }

  // ── Data loaders ──────────────────────────────────
  async load() {
    this.loading.set(true);
    const [statsRes, healthRes] = await Promise.all([
      this.p.api('/api/admin/stats'),
      this.p.api('/api/admin/system/health'),
    ]);
    if (statsRes.stats)      this.p.stats.set(statsRes.stats);
    if (statsRes.recentUsers) this.recentUsers.set(statsRes.recentUsers);
    if (healthRes.health)    this.p.health.set(healthRes.health);
    this.loading.set(false);
  }

  async loadChart() {
    this.chartLoading.set(true);
    try {
      const res = await this.p.api('/api/admin/chart-stats');
      if (res.purchases !== undefined) {
        this.chartData.set(res);
        this.buildRaw(res);
        setTimeout(() => this.renderChart(), 50);
      }
    } catch { /* silent */ }
    this.chartLoading.set(false);
  }

  // ── Controls ──────────────────────────────────────
  setRange(n: number)        { this.chartRange = n; this.renderChart(); }
  setType(t: 'line' | 'bar') { this.chartType  = t; this.renderChart(); }

  toggleDataset(ds: 'revenue' | 'signups' | 'credits') {
    if (ds === 'revenue') this.showRevenue = !this.showRevenue;
    if (ds === 'signups') this.showSignups = !this.showSignups;
    if (ds === 'credits') this.showCredits = !this.showCredits;
    this.updateDatasets();
  }

  // ── Period stats ──────────────────────────────────
  periodLabel() {
    return `Ostatnie ${this.chartRange} dni`;
  }

  private sliced() {
    const n = this.chartRange;
    return {
      labels:  this.rawLabels.slice(-n),
      revenue: this.rawRevenue.slice(-n),
      signups: this.rawSignups.slice(-n),
      credits: this.rawCredits.slice(-n),
    };
  }

  periodRevenue() {
    const total = this.sliced().revenue.reduce((a, b) => a + b, 0);
    return this.p.formatMoney(total);
  }

  periodSignups() {
    return this.sliced().signups.reduce((a, b) => a + b, 0);
  }

  periodSummary() {
    const s = this.sliced();
    const n = this.chartRange;
    const totalRev = s.revenue.reduce((a, b) => a + b, 0);
    const totalSig = s.signups.reduce((a, b) => a + b, 0);
    const totalCrd = s.credits.reduce((a, b) => a + b, 0);
    const maxRevIdx = s.revenue.indexOf(Math.max(...s.revenue));
    const maxSigIdx = s.signups.indexOf(Math.max(...s.signups));
    const avgRev = totalRev / n;
    const avgSig = totalSig / n;

    return [
      {
        label: 'Przychód łączny',
        value: this.p.formatMoney(totalRev),
        sub: `śr. ${this.p.formatMoney(avgRev)}/dzień`,
        cls: 'cyan',
      },
      {
        label: 'Najlepszy dzień ($)',
        value: s.labels[maxRevIdx] ? `${this.p.formatMoney(s.revenue[maxRevIdx])}` : '—',
        sub: s.labels[maxRevIdx] ? this.shortDate(s.labels[maxRevIdx]) : '',
        cls: 'success',
      },
      {
        label: 'Rejestracje',
        value: totalSig.toString(),
        sub: `śr. ${avgSig.toFixed(1)}/dzień`,
        cls: 'accent',
      },
      {
        label: 'Szczytowy dzień (reg.)',
        value: s.labels[maxSigIdx] ? `${s.signups[maxSigIdx]} os.` : '—',
        sub: s.labels[maxSigIdx] ? this.shortDate(s.labels[maxSigIdx]) : '',
        cls: '',
      },
      {
        label: 'Kredyty sprzedane',
        value: totalCrd.toLocaleString('pl-PL'),
        sub: `śr. ${Math.round(totalCrd / n)}/dzień`,
        cls: 'warning',
      },
    ];
  }

  // ── Build raw data ─────────────────────────────────
  private buildRaw(data: any) {
    // Always build full 30-day spine
    const today = new Date();
    this.rawLabels  = [];
    this.rawRevenue = [];
    this.rawSignups = [];
    this.rawCredits = [];

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      this.rawLabels.push(key);

      const pur = (data.purchases || []).find((p: any) => p._id === key);
      this.rawRevenue.push(pur ? Number((pur.revenue || 0).toFixed(2)) : 0);
      this.rawCredits.push(pur ? (pur.credits || 0) : 0);

      const usr = (data.users || []).find((u: any) => u._id === key);
      this.rawSignups.push(usr ? usr.signups : 0);
    }
  }

  // ── Render ─────────────────────────────────────────
  renderChart() {
    if (!this.chartData()) return;
    const canvas = this.chartCanvas?.nativeElement;
    if (!canvas) return;
    this.destroyChart();

    const s = this.sliced();
    const shortLabels = s.labels.map(l => this.shortDate(l));
    const isBar = this.chartType === 'bar';

    const datasets: any[] = [];

    if (this.showRevenue) {
      datasets.push({
        label: 'Przychód (USD)',
        data: s.revenue,
        yAxisID: 'yRev',
        borderColor: '#22d3ee',
        backgroundColor: isBar ? 'rgba(34,211,238,0.45)' : 'rgba(34,211,238,0.08)',
        fill: !isBar,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: isBar ? 0 : 3,
        pointHoverRadius: 5,
        pointBackgroundColor: '#22d3ee',
        order: 1,
      });
    }

    if (this.showSignups) {
      datasets.push({
        label: 'Rejestracje',
        data: s.signups,
        yAxisID: 'ySig',
        borderColor: '#6366f1',
        backgroundColor: isBar ? 'rgba(99,102,241,0.45)' : 'rgba(99,102,241,0.08)',
        fill: !isBar,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: isBar ? 0 : 3,
        pointHoverRadius: 5,
        pointBackgroundColor: '#6366f1',
        order: 2,
      });
    }

    if (this.showCredits) {
      datasets.push({
        label: 'Kredyty sprzedane',
        data: s.credits,
        yAxisID: 'yRev',
        borderColor: '#f59e0b',
        backgroundColor: isBar ? 'rgba(245,158,11,0.35)' : 'rgba(245,158,11,0.06)',
        fill: !isBar,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: isBar ? 0 : 3,
        pointHoverRadius: 5,
        pointBackgroundColor: '#f59e0b',
        borderDash: [5, 3],
        order: 3,
      });
    }

    const chartType: 'bar' | 'line' = isBar ? 'bar' : 'line';
    const config = {
      type: chartType,
      data: { labels: shortLabels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index' as const, intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#14141e',
            borderColor: 'rgba(255,255,255,0.12)',
            borderWidth: 1,
            titleColor: '#94a3b8',
            bodyColor: '#f1f5f9',
            padding: 12,
            callbacks: {
              title: (items: any[]) => {
                const idx = items[0]?.dataIndex;
                if (idx !== undefined) {
                  const day = s.labels[idx];
                  const d = new Date(day);
                  const label = d.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' });
                  // Update hovered day signal
                  setTimeout(() => this.hoveredDay.set({
                    label,
                    revenue: this.p.formatMoney(s.revenue[idx] || 0),
                    signups: s.signups[idx] || 0,
                    credits: s.credits[idx] || 0,
                  }), 0);
                }
                return items[0]?.label || '';
              },
              label: (ctx: any) => {
                const v = ctx.parsed.y;
                if (ctx.dataset.label?.includes('USD')) return ` Przychód: $${v.toFixed(2)}`;
                if (ctx.dataset.label?.includes('Rejestr')) return ` Rejestracje: ${v}`;
                if (ctx.dataset.label?.includes('Kredyt')) return ` Kredyty: ${v}`;
                return ` ${v}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: {
              color: '#475569', font: { size: 10 },
              maxTicksLimit: this.chartRange <= 7 ? 7 : this.chartRange <= 14 ? 7 : 10,
              maxRotation: 0,
            },
          },
          yRev: {
            type: 'linear' as const,
            position: 'left' as const,
            display: this.showRevenue || this.showCredits,
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: {
              color: '#22d3ee', font: { size: 10 },
              callback: (v: any) => `$${v}`,
            },
            beginAtZero: true,
          },
          ySig: {
            type: 'linear' as const,
            position: 'right' as const,
            display: this.showSignups,
            grid: { drawOnChartArea: false },
            ticks: {
              color: '#6366f1', font: { size: 10 },
              stepSize: 1,
            },
            beginAtZero: true,
          },
        },
        onHover: (_: any, elements: any[]) => {
          if (!elements.length) this.hoveredDay.set(null);
        },
      },
    };

    if (this.chartLib) {
      this.chartInstance = new this.chartLib.Chart(canvas, config);
    } else {
      import('chart.js/auto').then(m => {
        this.chartLib = m;
        this.chartInstance = new m.Chart(canvas, config);
      }).catch(() => {});
    }
  }

  private updateDatasets() {
    // Faster than full re-render — just toggle visibility
    if (!this.chartInstance) { this.renderChart(); return; }
    const meta0 = this.chartInstance.getDatasetMeta(0);
    this.destroyChart();
    this.renderChart();
  }

  private destroyChart() {
    if (this.chartInstance) { this.chartInstance.destroy(); this.chartInstance = null; }
  }

  // ── Helpers ───────────────────────────────────────
  shortDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
  }

  statsCards() {
    const s = this.p.stats();
    if (!s || !Object.keys(s).length) return [];
    return [
      { label: 'Użytkownicy',      value: (s.totalUsers    || 0).toLocaleString('pl-PL'), cls: '' },
      { label: 'Przychód łączny',  value: this.p.formatMoney(s.totalRevenue || 0),        cls: 'cyan',    note: `${this.p.formatMoney(s.monthRevenue || 0)} w tym miesiącu` },
      { label: 'Zakupy dziś',      value: (s.todayPurchases|| 0).toString(),              cls: s.todayPurchases ? 'success' : '' },
      { label: 'Cache AI',         value: (s.cachedAnswers || 0).toLocaleString('pl-PL'), cls: '' },
      { label: 'Bug-raporty nowe', value: (s.unreadBugReports || 0).toString(),           cls: s.unreadBugReports > 0 ? 'danger' : 'success' },
      { label: 'Zbanowane konta',  value: (s.bannedUsers   || 0).toString(),              cls: s.bannedUsers > 0 ? 'warning' : '' },
    ];
  }

  healthCards() {
    const h = this.p.health();
    if (!h || !Object.keys(h).length) return [{ label: 'Status', value: 'Ładowanie...', cls: '' }];
    const uptime = h.uptime ? `${Math.floor(h.uptime/3600)}h ${Math.floor((h.uptime%3600)/60)}m` : '?';
    return [
      { label: 'Baza danych', value: h.database      || '?',  cls: h.database === 'connected' ? 'ok' : 'err' },
      { label: 'Uptime',      value: uptime,                   cls: 'ok' },
      { label: 'Heap used',   value: h.memory?.heapUsed || '?', cls: '' },
      { label: 'RSS',         value: h.memory?.rss || '?',    cls: '' },
      { label: 'Node.js',     value: h.nodeVersion   || '?',  cls: '' },
      { label: 'Środowisko',  value: h.env           || '?',  cls: h.env === 'production' ? 'ok' : 'warn' },
    ];
  }

  priorityItems() {
    const s = this.p.stats();
    if (!s || !Object.keys(s).length) return [];
    const items: any[] = [];
    if ((s.unreadBugReports || 0) > 0)
      items.push({ icon: '🐛', tone: 'danger', tab: 'errors',  label: 'Nowe zgłoszenia błędów', note: 'Centrum Błędów', value: s.unreadBugReports });
    if ((s.unreadSupportMessages || 0) > 0)
      items.push({ icon: '📬', tone: 'warn',   tab: 'support', label: 'Nieodczytany support',   note: 'Ktoś czeka',    value: s.unreadSupportMessages });
    if ((s.openSupportMessages || 0) > 5)
      items.push({ icon: '📮', tone: 'warn',   tab: 'support', label: 'Otwarte wątki supportu', note: 'Warto przejrzeć', value: s.openSupportMessages });
    return items;
  }

  providerIcon(pr: string): string {
    return ({ google: '🔵', email: '✉️', facebook: '🔷', github: '⬛', apple: '🍎' } as any)[pr] || '🔑';
  }

  avatarStyle(u: any): string {
    const colors = [['rgba(99,102,241,.2)','#818cf8'],['rgba(34,211,238,.15)','#22d3ee'],['rgba(34,197,94,.15)','#22c55e'],['rgba(245,158,11,.15)','#f59e0b']];
    const hash = (u.email || '').split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0);
    const [bg, color] = colors[hash % colors.length];
    return `background:${bg};color:${color}`;
  }
}
