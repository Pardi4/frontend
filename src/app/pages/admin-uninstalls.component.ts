import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './admin.component';

export interface UninstallItem {
  _id: string;
  reasons: string[];
  customReason?: string;
  feedback?: string;
  platformUsed?: string;
  email?: string;
  extensionVersion?: string;
  lang?: string;
  userAgent?: string;
  createdAt: string;
}

export interface UninstallStats {
  totalAllTime: number;
  last7d: number;
  last30d: number;
  reasonCounts: Record<string, number>;
}

@Component({
  selector: 'app-admin-uninstalls',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="a-section anim-in">

  <!-- Header Card with Stats -->
  <div class="a-card">
    <div class="a-card-header">
      <div>
        <div class="a-card-title">📉 Ankiety odinstalowań rozszerzenia</div>
        <div class="a-card-subtitle">Analiza powodów odejścia użytkowników i feedback bezpośrednio z ankiety deinstalacyjnej</div>
      </div>
      <button class="a-btn a-btn-ghost a-btn-sm" (click)="load(1)" [disabled]="loading()">🔄 Odśwież</button>
    </div>

    <!-- Health / KPI Strip -->
    <div class="a-health-grid">
      <div class="a-hcard">
        <div class="a-hcard-label">Wszystkie ankiety</div>
        <div class="a-hcard-value">{{ stats()?.totalAllTime ?? total() }}</div>
      </div>
      <div class="a-hcard">
        <div class="a-hcard-label">Ostatnie 7 dni</div>
        <div class="a-hcard-value" [class.warn]="(stats()?.last7d ?? 0) > 10">{{ stats()?.last7d ?? 0 }}</div>
      </div>
      <div class="a-hcard">
        <div class="a-hcard-label">Ostatnie 30 dni</div>
        <div class="a-hcard-value">{{ stats()?.last30d ?? 0 }}</div>
      </div>
      <div class="a-hcard">
        <div class="a-hcard-label">Zostawiono e-mail</div>
        <div class="a-hcard-value ok">{{ countWithEmail() }}</div>
      </div>
    </div>
  </div>

  <!-- Reasons Breakdown Card -->
  <div class="a-card" *ngIf="topReasons().length > 0">
    <div class="a-card-header">
      <div class="a-card-title">📊 Rozkład powodów odinstalowania</div>
    </div>
    <div class="a-card-body">
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:12px">
        <div *ngFor="let r of topReasons()" style="padding:12px 14px;background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-sm)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <span class="bold sm">{{ formatReasonLabel(r.key) }}</span>
            <span class="xs tc bold">{{ r.count }} ({{ r.percent }}%)</span>
          </div>
          <div style="height:6px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden">
            <div [style.width.%]="r.percent" style="height:100%;background:linear-gradient(90deg, var(--cyan), var(--purple));border-radius:3px"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Filters & List Card -->
  <div class="a-card">
    <div class="a-filters">
      <div class="a-search-wrap" style="flex:1;min-width:200px">
        <span class="a-search-ico">🔍</span>
        <input
          class="a-input"
          [(ngModel)]="searchQuery"
          (keyup.enter)="load(1)"
          placeholder="Szukaj w komentarzach, e-mailach, platformach...">
      </div>

      <select class="a-select" [(ngModel)]="selectedReasonFilter" (ngModelChange)="load(1)" style="max-width:240px">
        <option value="">Wszystkie powody</option>
        <option value="not_working">Nie działało na teście</option>
        <option value="too_expensive">Za mało kredytów / drogo</option>
        <option value="hard_to_use">Skomplikowane w obsłudze</option>
        <option value="exams_finished">Koniec sesji / egzaminów</option>
        <option value="inaccurate_ai">Błędne odpowiedzi AI</option>
        <option value="alternative_found">Inne narzędzie</option>
        <option value="privacy_concern">Obawy o prywatność</option>
        <option value="other">Inny powód</option>
      </select>

      <button class="a-btn a-btn-secondary a-btn-sm" (click)="load(1)" [disabled]="loading()">Szukaj</button>
      <button class="a-btn a-btn-ghost a-btn-sm" *ngIf="searchQuery || selectedReasonFilter" (click)="clearFilters()">Wyczyść</button>
    </div>

    <!-- Loading State -->
    <div *ngIf="loading()" style="padding:40px;text-align:center;color:var(--text-3)">
      Ładowanie ankiet...
    </div>

    <!-- Empty State -->
    <div *ngIf="!loading() && items().length === 0" style="padding:48px;text-align:center">
      <div style="font-size:36px;margin-bottom:8px">🎉</div>
      <div class="bold sm">Brak zgłoszeń odinstalowań</div>
      <div class="xs t3" style="margin-top:4px">Nikt jeszcze nie przesłał feedbacku z takimi kryteriami.</div>
    </div>

    <!-- Table -->
    <div class="a-table-wrap" *ngIf="!loading() && items().length > 0">
      <table class="a-table">
        <thead>
          <tr>
            <th style="width:140px">Data</th>
            <th>Powody</th>
            <th>Komentarz użytkownika</th>
            <th>Platforma</th>
            <th>Wersja</th>
            <th>Kontakt</th>
            <th style="width:70px">Akcja</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of items()">
            <!-- Date -->
            <td class="xs t3">
              {{ p.formatDate(item.createdAt) }}
            </td>

            <!-- Reasons Badges -->
            <td>
              <div style="display:flex;gap:4px;flex-wrap:wrap">
                <span
                  *ngFor="let r of item.reasons"
                  class="a-badge"
                  [ngClass]="getReasonBadgeClass(r)">
                  {{ formatReasonLabel(r) }}
                </span>
                <span *ngIf="!item.reasons || item.reasons.length === 0" class="xs t3">—</span>
              </div>
            </td>

            <!-- Comments / Feedback -->
            <td>
              <div *ngIf="item.feedback" style="max-width:380px;white-space:pre-wrap;line-height:1.4" class="sm">
                {{ item.feedback }}
              </div>
              <div *ngIf="item.customReason" class="xs t3" style="margin-top:4px">
                Inny powód: {{ item.customReason }}
              </div>
              <span *ngIf="!item.feedback && !item.customReason" class="xs t3 italic">Brak komentarza</span>
            </td>

            <!-- Platform -->
            <td>
              <span *ngIf="item.platformUsed" class="bold xs tc">{{ item.platformUsed }}</span>
              <span *ngIf="!item.platformUsed" class="xs t3">—</span>
            </td>

            <!-- Extension Version -->
            <td class="xs mono t3">
              {{ item.extensionVersion || '—' }}
            </td>

            <!-- Email -->
            <td>
              <span *ngIf="item.email" class="xs mono td bold" style="color:var(--cyan)">{{ item.email }}</span>
              <span *ngIf="!item.email" class="xs t3">Anonim</span>
            </td>

            <!-- Actions -->
            <td>
              <button
                class="a-btn a-btn-danger a-btn-xs"
                type="button"
                title="Usuń wpis"
                (click)="deleteItem(item._id)">
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="a-card-foot" *ngIf="pages() > 1">
      <span class="xs t3">Strona {{ page() }} z {{ pages() }} (łącznie {{ total() }})</span>
      <div style="display:flex;gap:8px">
        <button class="a-btn a-btn-secondary a-btn-sm" [disabled]="page() <= 1" (click)="load(page() - 1)">« Poprzednia</button>
        <button class="a-btn a-btn-secondary a-btn-sm" [disabled]="page() >= pages()" (click)="load(page() + 1)">Następna »</button>
      </div>
    </div>

  </div>

</div>
`
})
export class AdminUninstallsComponent implements OnInit {
  @Input({ required: true }) p!: AdminComponent;

  loading = signal(false);
  items = signal<UninstallItem[]>([]);
  stats = signal<UninstallStats | null>(null);

  total = signal(0);
  page = signal(1);
  pages = signal(1);

  searchQuery = '';
  selectedReasonFilter = '';

  readonly REASON_NAMES: Record<string, string> = {
    not_working: 'Nie działało na teście',
    too_expensive: 'Za drogo / za mało kredytów',
    hard_to_use: 'Skomplikowane w obsłudze',
    exams_finished: 'Koniec sesji / egzaminów',
    inaccurate_ai: 'Błędne odpowiedzi AI',
    alternative_found: 'Inne narzędzie',
    privacy_concern: 'Obawy o prywatność',
    other: 'Inny powód'
  };

  ngOnInit() {
    this.load(1);
  }

  async load(targetPage = 1) {
    this.loading.set(true);
    this.page.set(targetPage);

    try {
      const params = new URLSearchParams({
        page: String(targetPage),
        limit: '25'
      });
      if (this.searchQuery.trim()) params.append('search', this.searchQuery.trim());
      if (this.selectedReasonFilter) params.append('reason', this.selectedReasonFilter);

      const res = await this.p.api(`/api/admin/uninstall-feedback?${params.toString()}`);
      if (res && res.success) {
        this.items.set(res.items || []);
        this.total.set(res.total || 0);
        this.pages.set(res.pages || 1);
        if (res.stats) this.stats.set(res.stats);
      }
    } catch (err: any) {
      this.p.toast('Błąd pobierania ankiet: ' + (err.message || ''), 'error');
    } finally {
      this.loading.set(false);
    }
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedReasonFilter = '';
    this.load(1);
  }

  formatReasonLabel(key: string): string {
    return this.REASON_NAMES[key] || key;
  }

  getReasonBadgeClass(key: string): string {
    switch (key) {
      case 'not_working': return 'a-badge-danger';
      case 'inaccurate_ai': return 'a-badge-danger';
      case 'too_expensive': return 'a-badge-warning';
      case 'exams_finished': return 'a-badge-info';
      case 'hard_to_use': return 'a-badge-muted';
      case 'alternative_found': return 'a-badge-muted';
      default: return 'a-badge-muted';
    }
  }

  topReasons(): Array<{ key: string; count: number; percent: number }> {
    const s = this.stats();
    if (!s || !s.reasonCounts) return [];
    const totalCount = Object.values(s.reasonCounts).reduce((a, b) => a + b, 0) || 1;

    return Object.entries(s.reasonCounts)
      .map(([key, count]) => ({
        key,
        count,
        percent: Math.round((count / totalCount) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  }

  countWithEmail(): number {
    return this.items().filter(i => Boolean(i.email)).length;
  }

  async deleteItem(id: string) {
    if (!confirm('Czy na pewno chcesz usunąć tę ankietę?')) return;
    try {
      const res = await this.p.api(`/api/admin/uninstall-feedback/${id}`, { method: 'DELETE' });
      if (res && res.success) {
        this.p.toast('Usunięto wpis.', 'success');
        this.items.update(list => list.filter(i => i._id !== id));
        this.total.update(n => Math.max(0, n - 1));
      }
    } catch (err: any) {
      this.p.toast('Błąd usuwania wpisu: ' + (err.message || ''), 'error');
    }
  }
}
