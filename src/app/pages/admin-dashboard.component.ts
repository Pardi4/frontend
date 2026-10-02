import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { AdminComponent } from './admin.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="a-section anim-in">

  <!-- Top row: Priority Queue + Platform stats -->
  <div class="a-grid-2">

    <!-- Priority Queue -->
    <div class="a-card">
      <div class="a-card-header">
        <div>
          <div class="a-card-title">🎯 Priorytety</div>
          <div class="a-card-subtitle">Rzeczy do sprawdzenia teraz</div>
        </div>
        <button class="a-btn a-btn-ghost a-btn-sm" (click)="load()" [disabled]="loading()">🔄</button>
      </div>
      <div class="a-card-body">
        <div *ngIf="loading() && !priorityItems().length" style="color:var(--text-3);font-size:13px;text-align:center;padding:20px">Ładowanie...</div>
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
        <div *ngIf="!loading() && !priorityItems().length" class="a-pq-empty">
          <strong>✅ Wszystko spokojne</strong>
          Brak pilnych spraw.
        </div>
      </div>
    </div>

    <!-- Platform snapshot -->
    <div class="a-card">
      <div class="a-card-header">
        <div>
          <div class="a-card-title">📊 Stan platformy</div>
          <div class="a-card-subtitle">Kluczowe wskaźniki</div>
        </div>
      </div>
      <div class="a-card-body">
        <div *ngIf="loading() && !statsCards().length" style="color:var(--text-3);font-size:13px;text-align:center;padding:20px">Ładowanie...</div>
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

  <!-- Chart row -->
  <div class="a-card">
    <div class="a-card-header">
      <div>
        <div class="a-card-title">📈 Przychód i rejestracje (30 dni)</div>
        <div class="a-card-subtitle">Revenue w USD · Signupy</div>
      </div>
      <div style="display:flex;gap:6px">
        <button class="a-btn a-btn-ghost a-btn-sm" (click)="chartMode = chartMode === 'revenue' ? 'signups' : 'revenue'; renderChart()" [disabled]="chartLoading()">
          {{ chartMode === 'revenue' ? '👥 Rejestracje' : '💰 Przychód' }}
        </button>
        <button class="a-btn a-btn-ghost a-btn-sm" (click)="loadChart()" [disabled]="chartLoading()">🔄</button>
      </div>
    </div>
    <div class="a-card-body" style="padding:16px">
      <div *ngIf="chartLoading()" style="height:220px;display:flex;align-items:center;justify-content:center;color:var(--text-3)">Ładowanie wykresu...</div>
      <div *ngIf="!chartLoading() && !chartData()" style="height:220px;display:flex;align-items:center;justify-content:center;color:var(--text-3)">
        Brak danych do wykresu.
      </div>
      <div [style.display]="!chartLoading() && chartData() ? 'block' : 'none'" style="position:relative;height:220px">
        <canvas #chartCanvas></canvas>
      </div>
    </div>
  </div>

  <!-- System health -->
  <div class="a-card">
    <div class="a-card-header">
      <div>
        <div class="a-card-title">🖥️ Stan systemu</div>
        <div class="a-card-subtitle">Serwer i baza danych</div>
      </div>
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

  <!-- Recent users -->
  <div class="a-card" *ngIf="recentUsers().length">
    <div class="a-card-header">
      <div>
        <div class="a-card-title">🆕 Ostatnio zarejestrowane konta</div>
        <div class="a-card-subtitle">Najnowsi użytkownicy platformy</div>
      </div>
      <button class="a-btn a-btn-ghost a-btn-sm" (click)="p.navTo('users')">Wszyscy →</button>
    </div>
    <div class="a-table-wrap">
      <table class="a-table">
        <thead>
          <tr>
            <th>Użytkownik</th>
            <th>Logowanie przez</th>
            <th>Kredyty</th>
            <th>Pytania</th>
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
              <div style="display:flex;gap:4px;flex-wrap:wrap">
                <span *ngFor="let pr of (u.authProviders || [])" class="a-badge a-badge-muted" style="font-size:10px">{{ providerIcon(pr) }} {{ pr }}</span>
              </div>
            </td>
            <td class="tc bold">{{ u.credits }}</td>
            <td class="t2">{{ u.stats?.totalQuestionsSolved || 0 }}</td>
            <td>
              <span class="a-badge" [class]="u.emailVerified ? 'a-badge-success' : 'a-badge-warning'" style="font-size:10px">
                {{ u.emailVerified ? '✓ OK' : '⚠ Niezweryfik.' }}
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

  loading     = signal(false);
  chartLoading = signal(false);
  recentUsers = signal<any[]>([]);
  chartData   = signal<any>(null);
  chartMode: 'revenue' | 'signups' = 'revenue';

  private chartInstance: any;
  private chartLib: any;

  ngOnInit()      { this.load(); }
  ngAfterViewInit() { this.loadChart(); }
  ngOnDestroy()   { this.chartInstance?.destroy(); }

  async load() {
    this.loading.set(true);
    try {
      const [statsRes, healthRes] = await Promise.all([
        this.p.api('/api/admin/stats'),
        this.p.api('/api/admin/system/health')
      ]);
      if (statsRes.stats)    { this.p.stats.set(statsRes.stats); }
      if (statsRes.recentUsers) { this.recentUsers.set(statsRes.recentUsers); }
      if (healthRes.health)  { this.p.health.set(healthRes.health); }
    } catch { /* silent */ }
    this.loading.set(false);
  }

  async loadChart() {
    this.chartLoading.set(true);
    try {
      const res = await this.p.api('/api/admin/chart-stats');
      if (res.purchases !== undefined) {
        this.chartData.set(res);
        setTimeout(() => this.renderChart(), 50);
      }
    } catch { /* silent */ }
    this.chartLoading.set(false);
  }

  renderChart() {
    const data = this.chartData();
    const canvas = this.chartCanvas?.nativeElement;
    if (!data || !canvas) return;

    this.destroyChart();

    // Build 30-day date labels
    const labels: string[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      labels.push(d.toISOString().slice(0, 10));
    }

    const datasetValues = labels.map(day => {
      if (this.chartMode === 'revenue') {
        const found = (data.purchases || []).find((p: any) => p._id === day);
        return found ? Number(found.revenue.toFixed(2)) : 0;
      } else {
        const found = (data.users || []).find((u: any) => u._id === day);
        return found ? found.signups : 0;
      }
    });

    const shortLabels = labels.map(d => {
      const dt = new Date(d);
      return dt.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
    });

    const isRevenue = this.chartMode === 'revenue';
    const color     = isRevenue ? '#22d3ee' : '#6366f1';
    const colorBg   = isRevenue ? 'rgba(34,211,238,0.1)' : 'rgba(99,102,241,0.1)';

    const config = {
      type: 'line' as const,
      data: {
        labels: shortLabels,
        datasets: [{
          label: isRevenue ? 'Revenue (USD)' : 'Rejestracje',
          data: datasetValues,
          borderColor: color,
          backgroundColor: colorBg,
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2,
          pointBackgroundColor: color,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1a1a24',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            titleColor: '#94a3b8',
            bodyColor: '#f1f5f9',
            callbacks: {
              label: (ctx: any) => isRevenue ? ` $${ctx.parsed.y.toFixed(2)}` : ` ${ctx.parsed.y} signups`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: '#64748b', font: { size: 10 }, maxTicksLimit: 10 }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: {
              color: '#64748b', font: { size: 10 },
              callback: (v: any) => isRevenue ? `$${v}` : v
            },
            beginAtZero: true
          }
        }
      }
    };

    // Load Chart.js dynamically
    if (this.chartLib) {
      this.chartInstance = new this.chartLib.Chart(canvas, config);
    } else {
      import('chart.js/auto').then(m => {
        this.chartLib = m;
        this.chartInstance = new m.Chart(canvas, config);
      }).catch(() => { /* chart.js not available */ });
    }
  }

  private destroyChart() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  }

  // ── Stats helpers ──────────────────────────────────
  statsCards() {
    const s = this.p.stats();
    if (!s || !Object.keys(s).length) return [];
    return [
      { label: 'Użytkownicy',    value: (s.totalUsers   || 0).toLocaleString('pl-PL'), cls: '' },
      { label: 'Przychód łączny',value: this.p.formatMoney(s.totalRevenue || 0),       cls: 'cyan',    note: `${this.p.formatMoney(s.monthRevenue || 0)} w tym miesiącu` },
      { label: 'Zakupy dziś',    value: (s.todayPurchases || 0).toString(),             cls: s.todayPurchases ? 'success' : '' },
      { label: 'Cache AI',       value: (s.cachedAnswers || 0).toLocaleString('pl-PL'), cls: '' },
      { label: 'Pytania łącznie',value: (s.totalQuestions|| 0).toLocaleString('pl-PL'), cls: '' },
      { label: 'Kredyty w obiegu',value:(s.totalCreditsInSystem||0).toLocaleString('pl-PL'), cls: 'accent' },
      { label: 'Bug-raporty nowe',value:(s.unreadBugReports||0).toString(),             cls: s.unreadBugReports > 0 ? 'danger' : 'success' },
      { label: 'Zbanowane konta',value: (s.bannedUsers   || 0).toString(),             cls: s.bannedUsers > 0 ? 'warning' : '' },
    ];
  }

  healthCards() {
    const h = this.p.health();
    if (!h || !Object.keys(h).length) return [{ label: 'Status', value: 'Ładowanie...', cls: '' }];
    const uptime = h.uptime ? `${Math.floor(h.uptime/3600)}h ${Math.floor((h.uptime%3600)/60)}m` : '?';
    return [
      { label: 'Baza danych', value: h.database     || '?', cls: h.database === 'connected' ? 'ok' : 'err' },
      { label: 'Uptime',      value: uptime,                 cls: 'ok'  },
      { label: 'Heap used',   value: h.memory?.heapUsed || '?', cls: '' },
      { label: 'RSS',         value: h.memory?.rss || '?',   cls: '' },
      { label: 'Node.js',     value: h.nodeVersion || '?',   cls: '' },
      { label: 'Środowisko',  value: h.env || '?',           cls: h.env === 'production' ? 'ok' : 'warn' },
    ];
  }

  priorityItems() {
    const s = this.p.stats();
    if (!s || !Object.keys(s).length) return [];
    const items: any[] = [];
    if ((s.unreadBugReports || 0) > 0) {
      items.push({ icon: '🐛', tone: 'danger', tab: 'errors',
        label: 'Nowe zgłoszenia błędów', note: 'Otwórz Centrum Błędów', value: s.unreadBugReports });
    }
    if ((s.unreadSupportMessages || 0) > 0) {
      items.push({ icon: '📬', tone: 'warn', tab: 'support',
        label: 'Nieodczytany support', note: 'Ktoś czeka na odpowiedź', value: s.unreadSupportMessages });
    }
    if ((s.openSupportMessages || 0) > 5) {
      items.push({ icon: '📮', tone: 'warn', tab: 'support',
        label: 'Otwarte wątki supportu', note: 'Warto przejrzeć', value: s.openSupportMessages });
    }
    if (items.length === 0 && s.totalUsers > 0) {
      items.push({ icon: '✅', tone: 'ok', tab: 'dashboard',
        label: 'Wszystko spokojne', note: 'Brak pilnych spraw', value: '0' });
    }
    return items;
  }

  providerIcon(pr: string): string {
    return ({ google: '🔵', email: '✉️', facebook: '🔷', github: '⬛', apple: '🍎' } as any)[pr] || '🔑';
  }

  avatarStyle(u: any): string {
    const colors = [
      ['rgba(99,102,241,.2)','#818cf8'], ['rgba(34,211,238,.15)','#22d3ee'],
      ['rgba(34,197,94,.15)','#22c55e'], ['rgba(245,158,11,.15)','#f59e0b'],
    ];
    const hash = (u.email || '').split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0);
    const [bg, color] = colors[hash % colors.length];
    return `background:${bg};color:${color}`;
  }
}
