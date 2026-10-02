import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './admin.component';

type ErrorTab = 'client' | 'bugs' | 'parser';

@Component({
  selector: 'app-admin-errors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="a-card anim-in">

  <!-- Tab bar -->
  <div class="a-tabs">
    <button class="a-tab" [class.active]="tab() === 'bugs'" (click)="tab.set('bugs')">
      🐛 Zgłoszenia użytkowników
      <span class="a-tab-cnt" *ngIf="bugList().length">{{ bugList().length }}</span>
    </button>
    <button class="a-tab" [class.active]="tab() === 'client'" (click)="tab.set('client')">
      ⚡ Błędy klienta
      <span class="a-tab-cnt" *ngIf="clientTotal() > 0">{{ clientTotal() }}</span>
    </button>
    <button class="a-tab" [class.active]="tab() === 'parser'" (click)="tab.set('parser')">
      🔍 Błędy parsera
      <span class="a-tab-cnt" *ngIf="parserList().length">{{ parserList().length }}</span>
    </button>
  </div>

  <!-- Filters / actions bar -->
  <div class="a-filters">
    <div class="a-search-wrap">
      <span class="a-search-ico">🔍</span>
      <input class="a-input" [(ngModel)]="search" (ngModelChange)="onSearch()" placeholder="Szukaj..." style="padding-left:34px">
    </div>

    <!-- Bug filters -->
    <ng-container *ngIf="tab() === 'bugs'">
      <button class="a-btn a-btn-secondary a-btn-sm" (click)="markAllBugsRead()" *ngIf="unreadBugCount() > 0" [disabled]="loading()">
        ✓ Oznacz wszystkie ({{ unreadBugCount() }})
      </button>
    </ng-container>

    <!-- Client error filters -->
    <ng-container *ngIf="tab() === 'client'">
      <span class="t3 sm">łącznie: {{ clientTotal() }}</span>
    </ng-container>

    <!-- Parser filters -->
    <ng-container *ngIf="tab() === 'parser'">
      <select class="a-select" style="max-width:140px" [(ngModel)]="parserOutcomeFilter" (ngModelChange)="loadParser()">
        <option value="">Wszystkie</option>
        <option value="empty">empty</option>
        <option value="weak">weak</option>
        <option value="error">error</option>
        <option value="reported">reported</option>
      </select>
      <button class="a-btn a-btn-danger a-btn-sm" (click)="clearAllParser()" *ngIf="parserList().length" [disabled]="loading()">
        🗑 Wyczyść wszystko
      </button>
    </ng-container>

    <button class="a-btn a-btn-ghost a-btn-sm" (click)="loadAll()" [disabled]="loading()">🔄</button>
  </div>

  <!-- ── BUG REPORTS ── -->
  <div *ngIf="tab() === 'bugs'">
    <div *ngIf="loading() && !bugList().length" style="padding:40px;text-align:center;color:var(--text-3)">Ładowanie...</div>

    <div class="a-error-list" *ngIf="filteredBugs().length; else noBugs">
      <div *ngFor="let bug of filteredBugs()" class="a-err-item" [class.unread]="!bug.isRead">
        <div class="a-err-meta">
          <div>
            <div class="a-err-title">
              {{ bug.user || 'Nieznany użytkownik' }}
              <span class="a-badge a-badge-danger" *ngIf="!bug.isRead" style="margin-left:6px">Nowe</span>
              <span class="a-badge a-badge-warning" *ngIf="bug.source === 'parser-auto'" style="margin-left:6px">Auto-parser</span>
            </div>
            <a *ngIf="bug.url" [href]="bug.url" target="_blank" rel="noopener" class="xs t3 break" style="margin-top:3px;display:block;text-decoration:none;color:var(--cyan)">{{ bug.url }}</a>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:5px;flex-shrink:0">
            <span class="a-err-time">{{ p.formatDate(bug.date) }}</span>
            <button *ngIf="!bug.isRead" class="a-btn a-btn-secondary a-btn-sm" (click)="markBugRead(bug)" [disabled]="loading()">Oznacz</button>
          </div>
        </div>
        <div class="a-err-sub" *ngIf="bug.description">{{ bug.description }}</div>
        <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap">
          <span class="a-badge a-badge-outline" *ngIf="bug.platform">{{ bug.platform }}</span>
          <span class="a-badge a-badge-outline" *ngIf="bug.parserDiagnostics?.outcome">{{ bug.parserDiagnostics.outcome }}</span>
          <span class="a-badge a-badge-muted" *ngIf="bug.hasPageCode">📄 Ma kod strony</span>
        </div>
        <details class="a-det mt-3" *ngIf="bug.parserSnapshot?.bodyText || bug.parserSnapshot?.fullHtmlFile?.id">
          <summary>Snapshot strony</summary>
          <button class="a-btn a-btn-secondary a-btn-sm mt-3" *ngIf="bug.parserSnapshot?.fullHtmlFile?.id" (click)="downloadSnapshot(bug.parserSnapshot.fullHtmlFile)">
            ⬇ Pobierz HTML ({{ p.formatBytes(bug.parserSnapshot.fullHtmlFile.bytes) }})
          </button>
          <div class="a-stack mt-3" *ngIf="bug.parserSnapshot?.bodyText">{{ bug.parserSnapshot.bodyText | slice:0:1500 }}</div>
        </details>
      </div>
    </div>
    <ng-template #noBugs>
      <div class="a-table-empty">{{ search ? 'Brak wyników dla "' + search + '"' : 'Brak zgłoszeń błędów.' }}</div>
    </ng-template>
  </div>

  <!-- ── CLIENT ERRORS ── -->
  <div *ngIf="tab() === 'client'">
    <div *ngIf="loading() && !clientList().length" style="padding:40px;text-align:center;color:var(--text-3)">Ładowanie...</div>

    <div class="a-error-list" *ngIf="filteredClients().length; else noClient">
      <div *ngFor="let err of filteredClients()" class="a-err-item">
        <div class="a-err-meta">
          <div style="flex:1;min-width:0">
            <div class="a-err-title bold trunc">{{ err.message }}</div>
            <div class="xs t3 mt-3">
              {{ err.user?.email || err.user?.id || 'Anonimowy' }}
              <span *ngIf="err.version"> · v{{ err.version }}</span>
              <span *ngIf="err.source"> · {{ err.source }}</span>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:5px;flex-shrink:0">
            <span class="a-err-time">{{ p.formatDate(err.createdAt) }}</span>
            <button class="a-btn a-btn-danger a-btn-sm" (click)="deleteClientError(err)" [disabled]="loading()">🗑</button>
          </div>
        </div>
        <div class="xs t3 trunc" *ngIf="err.url" style="margin-top:4px">{{ err.url }}</div>
        <details class="a-det mt-3" *ngIf="err.stack">
          <summary>Stack trace</summary>
          <div class="a-stack">{{ err.stack }}</div>
        </details>
      </div>
    </div>
    <ng-template #noClient>
      <div class="a-table-empty">{{ search ? 'Brak wyników.' : 'Brak błędów klienta. 🎉' }}</div>
    </ng-template>

    <!-- Pagination -->
    <div class="a-pager" *ngIf="clientTotal() > clientPageSize">
      <span class="t3 sm">{{ clientPage() * clientPageSize - clientPageSize + 1 }}–{{ [clientPage() * clientPageSize, clientTotal()].min() }} z {{ clientTotal() }}</span>
      <div class="a-pager-btns">
        <button class="a-btn a-btn-secondary a-btn-sm" [disabled]="clientPage() <= 1" (click)="clientPage.update(p => p - 1); loadClients()">←</button>
        <button class="a-btn a-btn-secondary a-btn-sm" [disabled]="clientPage() * clientPageSize >= clientTotal()" (click)="clientPage.update(p => p + 1); loadClients()">→</button>
      </div>
    </div>
  </div>

  <!-- ── PARSER ERRORS ── -->
  <div *ngIf="tab() === 'parser'">
    <div *ngIf="loading() && !parserList().length" style="padding:40px;text-align:center;color:var(--text-3)">Ładowanie...</div>

    <div class="a-error-list" *ngIf="filteredParser().length; else noParser">
      <div *ngFor="let ev of filteredParser()" class="a-err-item">
        <div class="a-err-meta">
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
              <span class="a-badge" [class]="outcomeClass(ev.outcome)">{{ ev.outcome }}</span>
              <span class="bold">{{ ev.platform || 'universal' }}</span>
              <span class="t3 sm" *ngIf="ev.detectorPlatform">→ {{ ev.detectorPlatform }}</span>
            </div>
            <div class="xs t3 break mt-3" *ngIf="ev.url">{{ ev.url }}</div>
          </div>
          <span class="a-err-time">{{ p.formatDate(ev.createdAt) }}</span>
        </div>
        <div class="a-err-sub mt-3" *ngIf="ev.reason">Powód: {{ ev.reason }}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
          <span class="a-badge a-badge-muted" *ngIf="ev.confidence !== undefined">Confidence: {{ (ev.confidence * 100).toFixed(0) }}%</span>
          <span class="a-badge a-badge-muted" *ngIf="ev.questionCount">{{ ev.questionCount }} pytań</span>
          <span class="a-badge a-badge-muted" *ngIf="ev.email">{{ ev.email }}</span>
          <span class="a-badge a-badge-muted" *ngIf="ev.extensionVersion">v{{ ev.extensionVersion }}</span>
        </div>
      </div>
    </div>
    <ng-template #noParser>
      <div class="a-table-empty">{{ search ? 'Brak wyników.' : 'Brak błędów parsera dla tych filtrów.' }}</div>
    </ng-template>

    <!-- Parser pagination -->
    <div class="a-pager" *ngIf="parserTotal() > parserPageSize">
      <span class="t3 sm">Strona {{ parserPage() }} z {{ Math.ceil(parserTotal() / parserPageSize) }}</span>
      <div class="a-pager-btns">
        <button class="a-btn a-btn-secondary a-btn-sm" [disabled]="parserPage() <= 1" (click)="parserPage.update(p => p - 1); loadParser()">←</button>
        <button class="a-btn a-btn-secondary a-btn-sm" [disabled]="parserPage() * parserPageSize >= parserTotal()" (click)="parserPage.update(p => p + 1); loadParser()">→</button>
      </div>
    </div>
  </div>

</div>
  `
})
export class AdminErrorsComponent implements OnInit {
  @Input() p!: AdminComponent;

  tab      = signal<ErrorTab>('bugs');
  loading  = signal(false);
  search   = '';

  // Bug reports
  bugList  = signal<any[]>([]);
  unreadBugCount = signal(0);

  // Client errors
  clientList  = signal<any[]>([]);
  clientTotal = signal(0);
  clientPage  = signal(1);
  clientPageSize = 50;

  // Parser errors
  parserList  = signal<any[]>([]);
  parserTotal = signal(0);
  parserPage  = signal(1);
  parserPageSize = 25;
  parserOutcomeFilter = 'error';

  readonly Math = Math;

  ngOnInit() { this.loadAll(); }

  async loadAll() {
    this.loading.set(true);
    await Promise.all([this.loadBugs(), this.loadClients(), this.loadParser()]);
    this.loading.set(false);
  }

  async loadBugs() {
    const res = await this.p.api('/api/admin/bug-reports');
    if (res.reports) {
      this.bugList.set(res.reports);
      this.unreadBugCount.set(res.reports.filter((r: any) => !r.isRead).length);
      this.p.bugCount.set(this.unreadBugCount());
    }
  }

  async loadClients() {
    const url = `/api/admin/client-errors?page=${this.clientPage()}&limit=${this.clientPageSize}`;
    const res = await this.p.api(url);
    if (res.errors) {
      this.clientList.set(res.errors);
      this.clientTotal.set(res.pagination?.total || 0);
      this.p.clientErrorCount.set(res.pagination?.total || 0);
    }
  }

  async loadParser() {
    const outcome = this.parserOutcomeFilter ? `&outcome=${this.parserOutcomeFilter}` : '';
    const q = this.search ? `&q=${encodeURIComponent(this.search)}` : '';
    const url = `/api/admin/parser/events?page=${this.parserPage()}&limit=${this.parserPageSize}${outcome}${q}`;
    const res = await this.p.api(url);
    if (res.events) {
      this.parserList.set(res.events);
      this.parserTotal.set(res.pagination?.total || 0);
    }
  }

  onSearch() {
    if (this.tab() === 'parser') this.loadParser();
  }

  filteredBugs() {
    const s = this.search.toLowerCase();
    if (!s) return this.bugList();
    return this.bugList().filter(b =>
      (b.user || '').toLowerCase().includes(s) ||
      (b.url || '').toLowerCase().includes(s) ||
      (b.description || '').toLowerCase().includes(s)
    );
  }

  filteredClients() {
    const s = this.search.toLowerCase();
    if (!s) return this.clientList();
    return this.clientList().filter(e =>
      (e.message || '').toLowerCase().includes(s) ||
      (e.user?.email || '').toLowerCase().includes(s)
    );
  }

  filteredParser() { return this.parserList(); }

  async markBugRead(bug: any) {
    this.loading.set(true);
    const res = await this.p.api(`/api/admin/bug-reports/${bug.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isRead: true })
    });
    if (res.success) {
      bug.isRead = true;
      this.unreadBugCount.update(n => Math.max(0, n - 1));
      this.p.bugCount.update(n => Math.max(0, n - 1));
      this.p.toast('Oznaczono jako przeczytane', 'success');
    } else {
      this.p.toast(res.error || 'Błąd', 'error');
    }
    this.loading.set(false);
  }

  async markAllBugsRead() {
    if (!confirm('Oznaczyć wszystkie zgłoszenia jako przeczytane?')) return;
    this.loading.set(true);
    const res = await this.p.api('/api/admin/bug-reports/mark-all-read', { method: 'POST' });
    if (res.success) {
      this.bugList.update(bugs => bugs.map(b => ({ ...b, isRead: true })));
      this.unreadBugCount.set(0);
      this.p.bugCount.set(0);
      this.p.toast(`Oznaczono ${res.modified} zgłoszeń`, 'success');
    } else {
      this.p.toast(res.error || 'Błąd', 'error');
    }
    this.loading.set(false);
  }

  async deleteClientError(err: any) {
    const res = await this.p.api(`/api/admin/client-errors/${err.id}`, { method: 'DELETE' });
    if (res.success) {
      this.clientList.update(list => list.filter(e => e.id !== err.id));
      this.clientTotal.update(n => n - 1);
      this.p.toast('Usunięto błąd', 'success');
    }
  }

  async clearAllParser() {
    if (!confirm('Usunąć wszystkie eventy parsera? Zgłoszenia użytkowników zostaną.')) return;
    this.loading.set(true);
    const res = await this.p.api('/api/admin/parser/events/all', { method: 'DELETE' });
    if (res.success) {
      this.parserList.set([]);
      this.parserTotal.set(0);
      this.p.toast(`Usunięto ${res.deleted} eventów`, 'success');
    } else {
      this.p.toast(res.error || 'Błąd', 'error');
    }
    this.loading.set(false);
  }

  async downloadSnapshot(file: any) {
    try {
      const res = await fetch(`/api/admin/parser/snapshot-file/${file.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('qs_admin_token') || localStorage.getItem('qs_token') || ''}` }
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `snapshot-${file.id}.html`; a.click();
      URL.revokeObjectURL(url);
    } catch { this.p.toast('Błąd pobierania', 'error'); }
  }

  outcomeClass(outcome: string): string {
    const map: Record<string, string> = {
      error: 'a-badge-danger', empty: 'a-badge-warning',
      weak: 'a-badge-warning', reported: 'a-badge-accent',
      success: 'a-badge-success', partial: 'a-badge-cyan'
    };
    return map[outcome] || 'a-badge-muted';
  }
}
