import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { AdminComponent } from './admin.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="a-section anim-in">

  <!-- Priority Queue + Stats row -->
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
        <div class="a-pq" *ngIf="priorityItems().length; else noItems">
          <button *ngFor="let item of priorityItems()" class="a-pq-item" [class]="item.tone" type="button" (click)="p.navTo(item.tab)">
            <span class="a-pq-ico">{{ item.icon }}</span>
            <div class="a-pq-body">
              <div class="a-pq-lbl">{{ item.label }}</div>
              <div class="a-pq-note">{{ item.note }}</div>
            </div>
            <div class="a-pq-val">{{ item.value }}</div>
          </button>
        </div>
        <ng-template #noItems>
          <div class="a-pq-empty">
            <strong>✅ Wszystko spokojne</strong>
            Brak pilnych spraw do sprawdzenia.
          </div>
        </ng-template>
      </div>
    </div>

    <!-- Platform snapshot -->
    <div class="a-card">
      <div class="a-card-header">
        <div>
          <div class="a-card-title">📊 Stan platformy</div>
          <div class="a-card-subtitle">Kluczowe liczby</div>
        </div>
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

  <!-- System health row -->
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
        <div class="a-card-subtitle">10 najnowszych użytkowników</div>
      </div>
      <button class="a-btn a-btn-ghost a-btn-sm" (click)="p.navTo('users')">Wszyscy →</button>
    </div>
    <div class="a-table-wrap">
      <table class="a-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Rola</th>
            <th>Kredyty</th>
            <th>Pytania</th>
            <th>Zarejestrowany</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let u of recentUsers()">
            <td>
              <div class="bold trunc" style="max-width:200px">{{ u.displayName || u.email }}</div>
              <div class="xs t3" *ngIf="u.displayName">{{ u.email }}</div>
            </td>
            <td>
              <span class="a-badge" [class]="u.role === 'admin' ? 'a-badge-accent' : 'a-badge-muted'">{{ u.role }}</span>
            </td>
            <td class="tc bold">{{ u.credits }}</td>
            <td class="t2">{{ u.stats?.totalQuestionsSolved || 0 }}</td>
            <td class="xs t3">{{ p.formatDate(u.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

</div>
  `
})
export class AdminDashboardComponent implements OnInit {
  @Input() p!: AdminComponent;

  loading = signal(false);
  recentUsers = signal<any[]>([]);

  ngOnInit() { this.load(); }

  async load() {
    this.loading.set(true);
    try {
      const [statsRes, healthRes] = await Promise.all([
        this.p.api('/api/admin/stats'),
        this.p.api('/api/admin/system/health')
      ]);
      if (statsRes.stats) {
        this.p.stats.set(statsRes.stats);
        this.recentUsers.set(statsRes.recentUsers || []);
      }
      if (healthRes.health) this.p.health.set(healthRes.health);
    } catch { /* silent */ }
    this.loading.set(false);
  }

  statsCards() {
    const s = this.p.stats();
    if (!s || !Object.keys(s).length) return [];
    return [
      { label: 'Użytkownicy',    value: (s.totalUsers || 0).toLocaleString(),          cls: '' },
      { label: 'Przychód łączny',value: this.p.formatMoney(s.totalRevenue || 0),       cls: 'cyan', note: `${this.p.formatMoney(s.monthRevenue || 0)} w tym miesiącu` },
      { label: 'Cache AI',       value: (s.cachedAnswers || 0).toLocaleString(),        cls: '' },
      { label: 'Pytania łącznie',value: (s.totalQuestions || 0).toLocaleString(),       cls: '' },
      { label: 'Zakupy dziś',    value: (s.todayPurchases || 0).toString(),             cls: s.todayPurchases ? 'success' : '' },
      { label: 'Zbanowane konta',value: (s.bannedUsers || 0).toString(),               cls: s.bannedUsers > 0 ? 'warning' : 'success' },
      { label: 'Bug-raporty nowe',value: (s.unreadBugReports || 0).toString(),         cls: s.unreadBugReports > 0 ? 'danger' : 'success' },
      { label: 'Support nieodcz.',value: (s.unreadSupportMessages || 0).toString(),    cls: s.unreadSupportMessages > 0 ? 'warning' : 'success' },
    ];
  }

  healthCards() {
    const h = this.p.health();
    if (!h || !Object.keys(h).length) return [{ label: 'Status', value: 'Ładowanie...', cls: '' }];
    const uptime = h.uptime ? `${Math.floor(h.uptime / 3600)}h ${Math.floor((h.uptime % 3600) / 60)}m` : '?';
    return [
      { label: 'Baza danych', value: h.database || '?', cls: h.database === 'connected' ? 'ok' : 'err' },
      { label: 'Uptime',      value: uptime,             cls: 'ok' },
      { label: 'RAM (heap)',  value: h.memory?.heapUsed || '?', cls: '' },
      { label: 'RAM (RSS)',   value: h.memory?.rss || '?',      cls: '' },
      { label: 'Node',        value: h.nodeVersion || '?',      cls: '' },
      { label: 'Środowisko',  value: h.env || '?',              cls: h.env === 'production' ? 'ok' : 'warn' },
    ];
  }

  priorityItems() {
    const s = this.p.stats();
    if (!s || !Object.keys(s).length) return [];
    const items: any[] = [];

    if ((s.unreadBugReports || 0) > 0) {
      items.push({
        icon: '🐛', tone: 'danger', tab: 'errors',
        label: 'Nowe zgłoszenia błędów',
        note: 'Kliknij, żeby przejść do Centrum Błędów',
        value: s.unreadBugReports
      });
    }
    if ((s.unreadSupportMessages || 0) > 0) {
      items.push({
        icon: '📬', tone: 'warn', tab: 'support',
        label: 'Nieodczytany support',
        note: 'Kliknij, żeby przejść do Supportu',
        value: s.unreadSupportMessages
      });
    }
    if ((s.openSupportMessages || 0) > 5) {
      items.push({
        icon: '📮', tone: 'warn', tab: 'support',
        label: 'Otwarte wątki supportu',
        note: 'Warto przejrzeć',
        value: s.openSupportMessages
      });
    }
    if (items.length === 0 && s.totalUsers > 0) {
      items.push({
        icon: '✅', tone: 'ok', tab: 'dashboard',
        label: 'Wszystko spokojne',
        note: 'Brak pilnych spraw',
        value: '0'
      });
    }
    return items;
  }
}
