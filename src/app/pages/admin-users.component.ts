import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './admin.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="a-section anim-in">
  <div class="a-card">

    <!-- Filters -->
    <div class="a-filters">
      <div class="a-search-wrap" style="flex:1;min-width:200px">
        <span class="a-search-ico">🔍</span>
        <input class="a-input" [(ngModel)]="search" (keyup.enter)="load()" placeholder="Szukaj email lub nazwy...">
      </div>
      <select class="a-select" [(ngModel)]="sort" (ngModelChange)="load()" style="max-width:180px">
        <option value="createdAt_desc">Najnowsi</option>
        <option value="createdAt_asc">Najstarsi</option>
        <option value="credits_desc">Najwięcej kredytów</option>
        <option value="credits_asc">Najmniej kredytów</option>
        <option value="lastOnline_desc">Ostatnio online</option>
        <option value="lastOnline_asc">Najdłużej offline</option>
        <option value="questions_desc">Najwięcej pytań</option>
        <option value="streak_desc">Najwyższa seria</option>
      </select>
      <button class="a-btn a-btn-primary a-btn-sm" (click)="load()" [disabled]="loading()">Szukaj</button>
      <button class="a-btn a-btn-ghost a-btn-sm" *ngIf="search" (click)="search='';load()">✕ Wyczyść</button>
      <button class="a-btn a-btn-ghost a-btn-sm" (click)="exportCsv()" title="Eksport CSV">⬇ CSV</button>
    </div>

    <!-- Stats strip -->
    <div style="padding:10px 20px;border-bottom:1px solid var(--border);display:flex;gap:20px;font-size:12px;color:var(--text-3)">
      <span>Łącznie: <strong class="ta">{{ pagination().total }}</strong></span>
      <span>Strona: <strong>{{ pagination().page }}/{{ pagination().pages }}</strong></span>
      <span>Aktywnych: <strong class="ts">{{ activeCount() }}</strong></span>
    </div>

    <!-- Table -->
    <div class="a-table-wrap" *ngIf="!loading() || users().length">
      <table class="a-table">
        <thead>
          <tr>
            <th>Użytkownik</th>
            <th>Rola</th>
            <th>Kredyty</th>
            <th>Pytania</th>
            <th>Seria</th>
            <th>Status</th>
            <th>Ostatnio</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let u of users()">
            <td>
              <div style="display:flex;align-items:center;gap:10px">
                <div style="width:34px;height:34px;border-radius:50%;background:var(--accent-bg);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;color:var(--accent-h);flex-shrink:0">
                  {{ initials(u) }}
                </div>
                <div style="min-width:0">
                  <div class="bold trunc" style="max-width:180px">{{ u.displayName || u.email }}</div>
                  <div class="xs t3 trunc" *ngIf="u.displayName">{{ u.email }}</div>
                  <div class="xs t3" *ngIf="!u.displayName">&nbsp;</div>
                </div>
              </div>
            </td>
            <td>
              <span class="a-badge" [class]="u.role === 'admin' ? 'a-badge-accent' : 'a-badge-muted'">{{ u.role }}</span>
            </td>
            <td class="bold tc">{{ u.credits }}</td>
            <td class="t2">{{ u.stats?.totalQuestionsSolved || 0 }}</td>
            <td class="t2">{{ u.streak?.current || 0 }}</td>
            <td>
              <span class="a-badge" [class]="statusClass(u)">{{ statusLabel(u) }}</span>
            </td>
            <td class="xs t3">{{ p.formatDate(u.extensionLastSeenAt) }}</td>
            <td>
              <div style="display:flex;gap:4px;flex-wrap:wrap">
                <button class="a-btn a-btn-secondary a-btn-sm" (click)="openHistory(u)" title="Historia pytań">📋</button>
                <button class="a-btn a-btn-success a-btn-sm" (click)="openGrant(u)" title="Dodaj kredyty">+</button>
                <button class="a-btn a-btn-danger a-btn-sm" *ngIf="!u.isBanned" (click)="banUser(u)" title="Zbanuj">Ban</button>
                <button class="a-btn a-btn-secondary a-btn-sm" *ngIf="u.isBanned" (click)="unbanUser(u)" title="Odbanuj">Unban</button>
                <button class="a-btn a-btn-danger a-btn-sm" (click)="deleteUser(u)" title="Usuń">🗑</button>
              </div>
            </td>
          </tr>
          <tr *ngIf="!loading() && !users().length">
            <td colspan="8" class="a-table-empty">Brak użytkowników.</td>
          </tr>
          <tr *ngIf="loading() && !users().length">
            <td colspan="8" class="a-table-empty">Ładowanie...</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="a-pager">
      <span class="t3 sm">Strona {{ pagination().page }} z {{ pagination().pages }} · łącznie {{ pagination().total }}</span>
      <div class="a-pager-btns">
        <button class="a-btn a-btn-secondary a-btn-sm" [disabled]="pagination().page <= 1 || loading()" (click)="prevPage()">←</button>
        <button class="a-btn a-btn-secondary a-btn-sm" [disabled]="pagination().page >= pagination().pages || loading()" (click)="nextPage()">→</button>
      </div>
    </div>
  </div>
</div>

<!-- ── GRANT MODAL ── -->
<div class="a-backdrop" *ngIf="grantUser()" (click)="closeModals()">
  <div class="a-modal" (click)="$event.stopPropagation()">
    <div class="a-modal-header">
      <div class="a-modal-title">➕ Dodaj kredyty — {{ grantUser()?.email }}</div>
      <button class="a-modal-x" (click)="closeModals()">✕</button>
    </div>
    <div class="a-modal-body">
      <p class="t2 sm mb-4">Aktualne kredyty: <strong class="tc">{{ grantUser()?.credits }}</strong></p>

      <!-- Quick grant -->
      <div class="a-label mb-3">Szybkie granty</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px">
        <button *ngFor="let amt of [50,100,200,500]" class="a-btn a-btn-secondary" (click)="quickGrant(amt)" [disabled]="modalLoading()">
          +{{ amt }}
        </button>
      </div>

      <!-- Manual grant -->
      <div class="a-label mb-3">Ręczne dodanie</div>
      <div class="a-input-row mb-3">
        <input class="a-input" type="number" [(ngModel)]="grantAmount" min="1" max="10000" placeholder="Ilość kredytów">
      </div>
      <input class="a-input mb-3" [(ngModel)]="grantReason" placeholder="Powód (opcjonalnie)">
    </div>
    <div class="a-modal-footer">
      <button class="a-btn a-btn-ghost" (click)="closeModals()">Anuluj</button>
      <button class="a-btn a-btn-primary" (click)="submitGrant()" [disabled]="modalLoading() || !grantAmount">
        {{ modalLoading() ? 'Dodawanie...' : 'Dodaj kredyty' }}
      </button>
    </div>
  </div>
</div>

<!-- ── HISTORY MODAL ── -->
<div class="a-backdrop" *ngIf="historyUser()" (click)="closeModals()">
  <div class="a-modal a-modal-xl" (click)="$event.stopPropagation()">
    <div class="a-modal-header">
      <div class="a-modal-title">📋 Historia pytań — {{ historyUser()?.email }}</div>
      <button class="a-modal-x" (click)="closeModals()">✕</button>
    </div>
    <div style="padding:0">
      <div *ngIf="historyLoading()" style="padding:32px;text-align:center;color:var(--text-3)">Ładowanie...</div>
      <div class="a-table-wrap" *ngIf="!historyLoading()">
        <table class="a-table">
          <thead>
            <tr><th>Pytanie</th><th>Typ</th><th>Platforma</th><th>Seen</th><th>Ostatnio</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let q of historyQuestions()">
              <td style="max-width:280px">
                <div class="trunc sm">{{ q.questionText }}</div>
                <div class="xs t3 mt-3" *ngIf="q.answerText">→ {{ q.answerText | slice:0:80 }}</div>
              </td>
              <td><span class="a-badge a-badge-muted">{{ q.questionType }}</span></td>
              <td class="xs t3">{{ q.platform || '—' }}</td>
              <td class="t2">{{ q.seenCount }}</td>
              <td class="xs t3">{{ p.formatDate(q.lastSeenAt) }}</td>
            </tr>
            <tr *ngIf="!historyQuestions().length">
              <td colspan="5" class="a-table-empty">Brak historii pytań.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- History pagination -->
      <div class="a-pager" *ngIf="historyPag().pages > 1">
        <span class="t3 sm">{{ historyPag().page }}/{{ historyPag().pages }} · łącznie {{ historyPag().total }}</span>
        <div class="a-pager-btns">
          <button class="a-btn a-btn-secondary a-btn-sm" [disabled]="historyPag().page <= 1" (click)="historyPageChange(-1)">←</button>
          <button class="a-btn a-btn-secondary a-btn-sm" [disabled]="historyPag().page >= historyPag().pages" (click)="historyPageChange(1)">→</button>
        </div>
      </div>
    </div>
  </div>
</div>
  `
})
export class AdminUsersComponent implements OnInit {
  @Input() p!: AdminComponent;

  loading       = signal(false);
  modalLoading  = signal(false);
  historyLoading = signal(false);

  users      = signal<any[]>([]);
  pagination = signal({ page: 1, pages: 1, total: 0, limit: 50 });
  activeCount = signal(0);

  search = '';
  sort   = 'createdAt_desc';
  page   = 1;

  // Modals
  grantUser   = signal<any>(null);
  grantAmount = 0;
  grantReason = '';

  historyUser      = signal<any>(null);
  historyQuestions = signal<any[]>([]);
  historyPag       = signal({ page: 1, pages: 1, total: 0 });

  ngOnInit() { this.load(); }

  async load() {
    this.loading.set(true);
    const q = this.search ? `&search=${encodeURIComponent(this.search)}` : '';
    const res = await this.p.api(`/api/admin/users?page=${this.page}&limit=50&sort=${this.sort}${q}`);
    if (res.users) {
      this.users.set(res.users);
      this.pagination.set(res.pagination || { page: 1, pages: 1, total: 0, limit: 50 });
      const now = Date.now();
      this.activeCount.set(res.users.filter((u: any) => u.isExtensionActive || (u.extensionLastSeenAt && now - new Date(u.extensionLastSeenAt).getTime() < 90000)).length);
    }
    this.loading.set(false);
  }

  prevPage() { if (this.page > 1) { this.page--; this.load(); } }
  nextPage() { this.page++; this.load(); }

  initials(u: any): string {
    if (u.displayName) return u.displayName.charAt(0).toUpperCase();
    return u.email?.charAt(0).toUpperCase() || '?';
  }

  statusLabel(u: any): string {
    if (u.isBanned) return 'Zbanowany';
    if (u.isExtensionActive) return 'Aktywny';
    if (u.extensionLastSeenAt) return 'Widziany';
    return 'Offline';
  }

  statusClass(u: any): string {
    if (u.isBanned) return 'a-badge-danger';
    if (u.isExtensionActive) return 'a-badge-success';
    if (u.extensionLastSeenAt) return 'a-badge-cyan';
    return 'a-badge-muted';
  }

  openGrant(u: any) {
    this.grantUser.set(u);
    this.grantAmount = 0;
    this.grantReason = '';
  }

  async quickGrant(amount: number) {
    this.modalLoading.set(true);
    const u = this.grantUser();
    const res = await this.p.api(`/api/admin/users/${u.id}/quick-grant`, {
      method: 'POST', body: JSON.stringify({ amount })
    });
    if (res.success) {
      this.p.toast(`+${amount} kredytów → ${u.email}`, 'success');
      this.closeModals();
      this.load();
    } else {
      this.p.toast(res.error || 'Błąd', 'error');
    }
    this.modalLoading.set(false);
  }

  async submitGrant() {
    if (!this.grantAmount || this.grantAmount <= 0) return;
    this.modalLoading.set(true);
    const u = this.grantUser();
    const res = await this.p.api(`/api/admin/users/${u.id}/grant-credits`, {
      method: 'POST', body: JSON.stringify({ credits: this.grantAmount, reason: this.grantReason })
    });
    if (res.success) {
      this.p.toast(`+${this.grantAmount} kredytów → ${u.email}`, 'success');
      this.closeModals();
      this.load();
    } else {
      this.p.toast(res.error || 'Błąd', 'error');
    }
    this.modalLoading.set(false);
  }

  async banUser(u: any) {
    if (!confirm(`Zbanować użytkownika ${u.email}?`)) return;
    const res = await this.p.api(`/api/admin/users/${u.id}/ban`, { method: 'POST' });
    if (res.success) { this.p.toast(`Zbanowano ${u.email}`, 'warning'); this.load(); }
    else this.p.toast(res.error || 'Błąd', 'error');
  }

  async unbanUser(u: any) {
    const res = await this.p.api(`/api/admin/users/${u.id}/unban`, { method: 'POST' });
    if (res.success) { this.p.toast(`Odbanowano ${u.email}`, 'success'); this.load(); }
    else this.p.toast(res.error || 'Błąd', 'error');
  }

  async deleteUser(u: any) {
    if (!confirm(`Usunąć konto ${u.email}? Tej operacji nie można cofnąć!`)) return;
    const res = await this.p.api(`/api/admin/users/${u.id}`, { method: 'DELETE' });
    if (res.success) { this.p.toast(`Usunięto ${u.email}`, 'warning'); this.load(); }
    else this.p.toast(res.error || 'Błąd', 'error');
  }

  async openHistory(u: any) {
    this.historyUser.set(u);
    this.historyLoading.set(true);
    await this.loadHistory(u, 1);
    this.historyLoading.set(false);
  }

  async loadHistory(u: any, page: number) {
    const res = await this.p.api(`/api/admin/users/${u.id}/questions?page=${page}&limit=20`);
    if (res.questions) {
      this.historyQuestions.set(res.questions);
      this.historyPag.set(res.pagination || { page: 1, pages: 1, total: 0 });
    }
  }

  historyPageChange(dir: number) {
    const u = this.historyUser();
    const np = this.historyPag().page + dir;
    this.historyLoading.set(true);
    this.loadHistory(u, np).then(() => this.historyLoading.set(false));
  }

  closeModals() {
    this.grantUser.set(null);
    this.historyUser.set(null);
  }

  exportCsv() {
    const rows = this.users();
    if (!rows.length) return;
    const header = 'email,displayName,role,credits,questions,streak,status,lastSeen,createdAt';
    const lines = rows.map(u =>
      [u.email, u.displayName, u.role, u.credits, u.stats?.totalQuestionsSolved || 0,
       u.streak?.current || 0, this.statusLabel(u), u.extensionLastSeenAt || '', u.createdAt || ''].join(',')
    );
    const csv = [header, ...lines].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    this.p.toast('Eksport gotowy', 'success');
  }
}
