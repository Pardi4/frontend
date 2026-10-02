import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './admin.component';

@Component({
  selector: 'app-admin-parser',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="a-section anim-in">

  <!-- Summary cards -->
  <div class="a-card" *ngIf="health().summary">
    <div class="a-card-header">
      <div>
        <div class="a-card-title">🔍 Zdrowie parsera</div>
        <div class="a-card-subtitle">Ostatnie {{ windowDays() }} dni</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <select class="a-select" [(ngModel)]="days" (ngModelChange)="load()" style="max-width:100px">
          <option value="7">7 dni</option>
          <option value="14">14 dni</option>
          <option value="30">30 dni</option>
          <option value="90">90 dni</option>
        </select>
        <button class="a-btn a-btn-ghost a-btn-sm" (click)="load()" [disabled]="loading()">🔄</button>
      </div>
    </div>
    <div class="a-card-body">
      <div class="a-stats-grid">
        <div class="a-stat">
          <div class="a-stat-label">Łącznie</div>
          <div class="a-stat-value">{{ health().summary?.total || 0 }}</div>
        </div>
        <div class="a-stat">
          <div class="a-stat-label">Sukces</div>
          <div class="a-stat-value success">{{ health().summary?.success || 0 }}</div>
        </div>
        <div class="a-stat">
          <div class="a-stat-label">Błędy</div>
          <div class="a-stat-value danger">{{ health().summary?.failed || 0 }}</div>
          <div class="a-stat-note">{{ successRate() }}% sukcesu</div>
        </div>
        <div class="a-stat">
          <div class="a-stat-label">Avg Confidence</div>
          <div class="a-stat-value accent">{{ ((health().summary?.avgConfidence || 0) * 100).toFixed(0) }}%</div>
        </div>
        <div class="a-stat">
          <div class="a-stat-label">Częściowe</div>
          <div class="a-stat-value warning">{{ health().summary?.partial || 0 }}</div>
        </div>
        <div class="a-stat">
          <div class="a-stat-label">Zgłoszone</div>
          <div class="a-stat-value">{{ health().summary?.reported || 0 }}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Platforms table -->
  <div class="a-card" *ngIf="health().platforms?.length">
    <div class="a-card-header">
      <div class="a-card-title">📊 Analityka platform</div>
    </div>
    <div class="a-table-wrap">
      <table class="a-table">
        <thead>
          <tr>
            <th>Platforma</th>
            <th>Łącznie</th>
            <th>Sukces</th>
            <th>Błędy</th>
            <th>Failure %</th>
            <th>Confidence</th>
            <th>Ostatnio</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let pl of health().platforms">
            <td><strong>{{ pl.platform }}</strong></td>
            <td>{{ pl.count }}</td>
            <td class="ts">{{ pl.success }}</td>
            <td class="td">{{ pl.failed }}</td>
            <td>
              <span class="a-badge" [class]="pl.failureRate > .3 ? 'a-badge-danger' : pl.failureRate > .1 ? 'a-badge-warning' : 'a-badge-success'">
                {{ (pl.failureRate * 100).toFixed(1) }}%
              </span>
            </td>
            <td class="ta">{{ (pl.avgConfidence * 100).toFixed(0) }}%</td>
            <td class="xs t3">{{ p.formatDate(pl.lastSeenAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Problem groups -->
  <div class="a-card" *ngIf="health().problemGroups?.length">
    <div class="a-card-header">
      <div class="a-card-title">⚠️ Grupy problemów</div>
      <div class="a-card-subtitle">Najczęstsze wzorce błędów</div>
    </div>
    <div class="a-table-wrap">
      <table class="a-table">
        <thead>
          <tr><th>Hostname</th><th>Platforma</th><th>Wynik</th><th>Powód</th><th>Liczba</th><th>Ostatnio</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let pg of health().problemGroups">
            <td class="xs mono t2">{{ pg.hostname || '—' }}</td>
            <td><span class="a-badge a-badge-muted">{{ pg.platform }}</span></td>
            <td><span class="a-badge" [class]="outcomeClass(pg.outcome)">{{ pg.outcome }}</span></td>
            <td class="xs t2" style="max-width:200px">{{ pg.reason || '—' }}</td>
            <td><strong class="td">{{ pg.count }}</strong></td>
            <td class="xs t3">{{ p.formatDate(pg.lastSeenAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Events log -->
  <div class="a-card">
    <div class="a-card-header">
      <div class="a-card-title">📋 Dziennik eventów</div>
    </div>

    <!-- Filters -->
    <div class="a-filters">
      <div class="a-search-wrap" style="flex:1;min-width:180px">
        <span class="a-search-ico">🔍</span>
        <input class="a-input" [(ngModel)]="evSearch" (keyup.enter)="loadEvents()" placeholder="URL, hostname, powód...">
      </div>
      <select class="a-select" [(ngModel)]="evOutcome" (ngModelChange)="loadEvents()" style="max-width:130px">
        <option value="">Wszystkie</option>
        <option value="success">success</option>
        <option value="partial">partial</option>
        <option value="empty">empty</option>
        <option value="weak">weak</option>
        <option value="error">error</option>
        <option value="reported">reported</option>
      </select>
      <select class="a-select" [(ngModel)]="evPlatform" (ngModelChange)="loadEvents()" style="max-width:130px">
        <option value="">Wszystkie platformy</option>
        <option *ngFor="let pl of health().platforms" [value]="pl.platform">{{ pl.platform }}</option>
      </select>
      <button class="a-btn a-btn-secondary a-btn-sm" (click)="loadEvents()" [disabled]="evLoading()">Filtruj</button>
      <button class="a-btn a-btn-danger a-btn-sm" (click)="clearFilteredEvents()" *ngIf="evSearch || evOutcome || evPlatform" [disabled]="evLoading()">🗑 Wyczyść filtr</button>
    </div>

    <div *ngIf="evLoading()" style="padding:32px;text-align:center;color:var(--text-3)">Ładowanie...</div>

    <div class="a-table-wrap" *ngIf="!evLoading()">
      <table class="a-table">
        <thead>
          <tr><th>Wynik</th><th>Platforma</th><th>URL</th><th>Powód</th><th>Conf.</th><th>User</th><th>Kiedy</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let ev of events()">
            <td><span class="a-badge" [class]="outcomeClass(ev.outcome)">{{ ev.outcome }}</span></td>
            <td class="xs">{{ ev.platform }}</td>
            <td style="max-width:220px"><div class="xs t3 trunc">{{ ev.url || ev.hostname }}</div></td>
            <td class="xs t2" style="max-width:160px">{{ ev.reason || '—' }}</td>
            <td class="xs ta">{{ ev.confidence ? (ev.confidence * 100).toFixed(0) + '%' : '—' }}</td>
            <td class="xs t3">{{ ev.email || '—' }}</td>
            <td class="xs t3">{{ p.formatDate(ev.createdAt) }}</td>
          </tr>
          <tr *ngIf="!events().length">
            <td colspan="7" class="a-table-empty">Brak eventów dla tych filtrów.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="a-pager" *ngIf="evTotal() > evPageSize">
      <span class="t3 sm">Strona {{ evPage() }} z {{ Math.ceil(evTotal() / evPageSize) }} · łącznie {{ evTotal() }}</span>
      <div class="a-pager-btns">
        <button class="a-btn a-btn-secondary a-btn-sm" [disabled]="evPage() <= 1" (click)="evPage.update(n => n-1); loadEvents()">←</button>
        <button class="a-btn a-btn-secondary a-btn-sm" [disabled]="evPage() * evPageSize >= evTotal()" (click)="evPage.update(n => n+1); loadEvents()">→</button>
      </div>
    </div>
  </div>
</div>
  `
})
export class AdminParserComponent implements OnInit {
  @Input() p!: AdminComponent;

  loading   = signal(false);
  evLoading = signal(false);
  health    = signal<any>({});
  events    = signal<any[]>([]);
  evTotal   = signal(0);
  evPage    = signal(1);
  evPageSize = 25;
  windowDays = signal(7);

  days       = '7';
  evSearch   = '';
  evOutcome  = '';
  evPlatform = '';

  readonly Math = Math;

  ngOnInit() { this.load(); }

  async load() {
    this.loading.set(true);
    const res = await this.p.api(`/api/admin/parser/health?days=${this.days}`);
    if (res.summary !== undefined) {
      this.health.set(res);
      this.windowDays.set(res.windowDays || 7);
    }
    this.loading.set(false);
    this.loadEvents();
  }

  async loadEvents() {
    this.evLoading.set(true);
    const params = new URLSearchParams({
      page: String(this.evPage()), limit: String(this.evPageSize)
    });
    if (this.evOutcome)  params.set('outcome', this.evOutcome);
    if (this.evPlatform) params.set('platform', this.evPlatform);
    if (this.evSearch)   params.set('q', this.evSearch);
    const res = await this.p.api(`/api/admin/parser/events?${params}`);
    if (res.events) {
      this.events.set(res.events);
      this.evTotal.set(res.pagination?.total || 0);
    }
    this.evLoading.set(false);
  }

  async clearFilteredEvents() {
    if (!confirm('Usunąć eventy parsera pasujące do filtrów? Zgłoszenia użytkowników zostaną.')) return;
    const params = new URLSearchParams();
    if (this.evOutcome)  params.set('outcome', this.evOutcome);
    if (this.evPlatform) params.set('platform', this.evPlatform);
    if (this.evSearch)   params.set('q', this.evSearch);
    const res = await this.p.api(`/api/admin/parser/events?${params}`, { method: 'DELETE' });
    if (res.success) {
      this.p.toast(`Usunięto ${res.deleted} eventów`, 'success');
      this.loadEvents();
    } else {
      this.p.toast(res.error || 'Błąd', 'error');
    }
  }

  successRate() {
    const s = this.health().summary;
    if (!s || !s.total) return 0;
    return ((s.success / s.total) * 100).toFixed(1);
  }

  outcomeClass(outcome: string) {
    return ({ error: 'a-badge-danger', empty: 'a-badge-warning', weak: 'a-badge-warning', reported: 'a-badge-accent', success: 'a-badge-success', partial: 'a-badge-cyan' } as any)[outcome] || 'a-badge-muted';
  }
}
