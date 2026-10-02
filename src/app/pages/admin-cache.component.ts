import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './admin.component';

@Component({
  selector: 'app-admin-cache',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="a-section anim-in">
  <div class="a-card">

    <!-- Filters -->
    <div class="a-filters">
      <div class="a-search-wrap" style="flex:1;min-width:200px">
        <span class="a-search-ico">🔍</span>
        <input class="a-input" [(ngModel)]="search" (keyup.enter)="load()" placeholder="Szukaj treści pytania...">
      </div>
      <button class="a-btn a-btn-primary a-btn-sm" (click)="load()" [disabled]="loading()">Szukaj</button>
      <button class="a-btn a-btn-ghost a-btn-sm" *ngIf="search" (click)="search='';load()">✕</button>
      <button class="a-btn a-btn-danger a-btn-sm" (click)="clearAll()" [disabled]="loading()">🗑 Wyczyść wszystko</button>
    </div>

    <!-- Stats strip -->
    <div style="padding:10px 20px;border-bottom:1px solid var(--border);display:flex;gap:24px;font-size:12px;color:var(--text-3)">
      <span>Łącznie w cache: <strong class="ta">{{ totalCached() }}</strong></span>
      <span *ngIf="search">Pasuje: <strong class="tc">{{ totalMatching() }}</strong></span>
    </div>

    <!-- Table -->
    <div class="a-table-wrap">
      <table class="a-table">
        <thead>
          <tr>
            <th>Pytanie</th>
            <th>Typ</th>
            <th>Trafień</th>
            <th>Opcji</th>
            <th>Utworzono</th>
            <th>Ostatnio użyte</th>
            <th>Akcja</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let entry of entries()">
            <td style="max-width:320px">
              <div class="sm trunc" style="cursor:pointer" (click)="openDetail(entry)" title="Szczegóły">
                {{ entry.questionText }}
              </div>
            </td>
            <td><span class="a-badge a-badge-muted">{{ entry.questionType }}</span></td>
            <td class="bold tc">{{ entry.hitCount || 0 }}</td>
            <td class="t2">{{ entry.options?.length || 0 }}</td>
            <td class="xs t3">{{ p.formatDate(entry.createdAt) }}</td>
            <td class="xs t3">{{ p.formatDate(entry.lastUsedAt) }}</td>
            <td>
              <div style="display:flex;gap:4px">
                <button class="a-btn a-btn-secondary a-btn-sm" (click)="openDetail(entry)" title="Szczegóły">👁</button>
                <button class="a-btn a-btn-danger a-btn-sm" (click)="deleteEntry(entry)" [disabled]="loading()" title="Usuń">🗑</button>
              </div>
            </td>
          </tr>
          <tr *ngIf="!loading() && !entries().length">
            <td colspan="7" class="a-table-empty">{{ search ? 'Brak wyników.' : 'Cache jest pusty.' }}</td>
          </tr>
          <tr *ngIf="loading()">
            <td colspan="7" class="a-table-empty">Ładowanie...</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="a-pager">
      <span class="t3 sm">Strona {{ page() }} z {{ pages() }} · łącznie {{ totalMatching() }}</span>
      <div class="a-pager-btns">
        <button class="a-btn a-btn-secondary a-btn-sm" [disabled]="page() <= 1 || loading()" (click)="page.update(n => n-1); load()">←</button>
        <button class="a-btn a-btn-secondary a-btn-sm" [disabled]="page() >= pages() || loading()" (click)="page.update(n => n+1); load()">→</button>
      </div>
    </div>
  </div>
</div>

<!-- Detail modal -->
<div class="a-backdrop" *ngIf="detailEntry()" (click)="detailEntry.set(null)">
  <div class="a-modal a-modal-lg" (click)="$event.stopPropagation()">
    <div class="a-modal-header">
      <div class="a-modal-title">📋 Szczegóły cache</div>
      <button class="a-modal-x" (click)="detailEntry.set(null)">✕</button>
    </div>
    <div class="a-modal-body" *ngIf="detailEntry() as e">
      <div class="a-section" style="gap:12px">
        <div>
          <div class="a-label">Pytanie</div>
          <div class="sm mt-3" style="line-height:1.6">{{ e.questionText }}</div>
        </div>
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <div>
            <div class="a-label">Typ</div>
            <span class="a-badge a-badge-muted mt-3">{{ e.questionType }}</span>
          </div>
          <div>
            <div class="a-label">Trafień</div>
            <div class="bold tc mt-3">{{ e.hitCount || 0 }}</div>
          </div>
          <div>
            <div class="a-label">Opcji</div>
            <div class="t2 mt-3">{{ e.options?.length || 0 }}</div>
          </div>
        </div>
        <div *ngIf="e.options?.length">
          <div class="a-label">Opcje odpowiedzi</div>
          <div class="mt-3" style="display:flex;flex-direction:column;gap:4px">
            <div *ngFor="let opt of e.options; let i = index" class="sm" style="padding:4px 8px;background:var(--surface-2);border-radius:4px">
              {{ i + 1 }}. {{ opt }}
            </div>
          </div>
        </div>
        <div style="display:flex;gap:20px;font-size:12px;color:var(--text-3)">
          <div>Utworzono: <strong>{{ p.formatDate(e.createdAt, true) }}</strong></div>
          <div>Ostatnio: <strong>{{ p.formatDate(e.lastUsedAt, true) }}</strong></div>
        </div>
      </div>
    </div>
    <div class="a-modal-footer">
      <button class="a-btn a-btn-ghost" (click)="detailEntry.set(null)">Zamknij</button>
      <button class="a-btn a-btn-danger" (click)="deleteEntry(detailEntry()!); detailEntry.set(null)">🗑 Usuń z cache</button>
    </div>
  </div>
</div>
  `
})
export class AdminCacheComponent implements OnInit {
  @Input() p!: AdminComponent;

  loading      = signal(false);
  entries      = signal<any[]>([]);
  totalCached  = signal(0);
  totalMatching = signal(0);
  page         = signal(1);
  pages        = signal(1);
  detailEntry  = signal<any>(null);

  search = '';

  ngOnInit() { this.load(); }

  async load() {
    this.loading.set(true);
    const q = this.search ? `&q=${encodeURIComponent(this.search)}` : '';
    const res = await this.p.api(`/api/admin/cache/stats?page=${this.page()}&limit=25${q}`);
    if (res.topHits) {
      this.entries.set(res.topHits);
      this.totalCached.set(res.totalCached || 0);
      this.totalMatching.set(res.totalMatching || 0);
      const pag = res.pagination || {};
      this.pages.set(pag.pages || 1);
    }
    this.loading.set(false);
  }

  openDetail(e: any) { this.detailEntry.set(e); }

  async deleteEntry(e: any) {
    if (!confirm('Usunąć ten wpis z cache?')) return;
    const res = await this.p.api(`/api/admin/cache/${e._id || e.id}`, { method: 'DELETE' });
    if (res.success) {
      this.entries.update(list => list.filter(x => (x._id || x.id) !== (e._id || e.id)));
      this.p.toast('Usunięto wpis z cache', 'success');
    } else {
      this.p.toast(res.error || 'Błąd', 'error');
    }
  }

  async clearAll() {
    if (!confirm('Wyczyścić CAŁY cache odpowiedzi AI? Tej operacji nie można cofnąć!')) return;
    this.loading.set(true);
    const res = await this.p.api('/api/admin/cache/clear', { method: 'DELETE' });
    if (res.success) {
      this.p.toast(`Wyczyszczono ${res.deleted} wpisów`, 'success');
      this.load();
    } else {
      this.p.toast(res.error || 'Błąd', 'error');
    }
    this.loading.set(false);
  }
}
