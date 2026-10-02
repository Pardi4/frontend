import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './admin.component';

@Component({
  selector: 'app-admin-cache',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="a-card anim-in">

  <!-- Filters -->
  <div class="a-filters">
    <div class="a-search-wrap" style="flex:1;min-width:200px">
      <span class="a-search-ico">🔍</span>
      <input class="a-input" [(ngModel)]="search" (keyup.enter)="load()" placeholder="Szukaj treści pytania...">
    </div>
    <select class="a-select" [(ngModel)]="filterType" (ngModelChange)="load()" style="max-width:140px">
      <option value="">Wszystkie typy</option>
      <option value="radio">radio</option>
      <option value="checkbox">checkbox</option>
      <option value="text">text</option>
      <option value="matching">matching</option>
      <option value="matrix">matrix</option>
    </select>
    <button class="a-btn a-btn-primary a-btn-sm" (click)="load()" [disabled]="loading()">Szukaj</button>
    <button class="a-btn a-btn-ghost a-btn-sm" *ngIf="search || filterType" (click)="search='';filterType='';load()">✕ Wyczyść</button>
    <button class="a-btn a-btn-danger a-btn-sm" (click)="clearAll()" [disabled]="loading()">🗑 Wyczyść wszystko</button>
  </div>

  <!-- Stats strip -->
  <div style="padding:10px 20px;border-bottom:1px solid var(--border);display:flex;gap:24px;font-size:12px;color:var(--text-3)">
    <span>Łącznie w cache: <strong class="ta">{{ totalCached() }}</strong></span>
    <span>Pasuje: <strong class="tc">{{ totalMatching() }}</strong></span>
    <span class="t3" style="margin-left:auto">Kliknij wiersz, żeby zobaczyć szczegóły</span>
  </div>

  <!-- List (not table) — allows inline expand without colspan tricks -->
  <div *ngIf="loading()" style="padding:40px;text-align:center;color:var(--text-3)">Ładowanie...</div>
  <div *ngIf="!loading() && !entries().length" class="a-table-empty">{{ search ? 'Brak wyników.' : 'Cache jest pusty.' }}</div>

  <div *ngIf="!loading() && entries().length" style="display:flex;flex-direction:column">
    <div *ngFor="let e of entries()"
      class="a-err-item"
      style="cursor:pointer"
      [style.border-left]="selectedEntry()?.id === e.id ? '3px solid var(--accent)' : '3px solid transparent'"
      [style.background]="selectedEntry()?.id === e.id ? 'rgba(99,102,241,.06)' : ''"
      (click)="toggleEntry(e)">

      <!-- Summary row -->
      <div class="a-err-meta">
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap">
            <span style="font-size:11px;color:var(--text-3);transition:transform .15s"
              [style.transform]="selectedEntry()?.id === e.id ? 'rotate(90deg)' : 'none'">▶</span>
            <span class="a-badge a-badge-muted">{{ e.questionType }}</span>
            <span class="a-badge a-badge-cyan" *ngIf="(e.hitCount||0) > 0">🔥 {{ e.hitCount }} trafień</span>
            <span class="a-badge a-badge-muted" *ngIf="e.options?.length">{{ e.options.length }} opcji</span>
            <span class="a-badge a-badge-success" *ngIf="e.explanation">+ wyjaśnienie</span>
          </div>
          <div class="sm trunc bold" style="max-width:100%">{{ e.questionText }}</div>
          <div class="xs t3 mt-3" *ngIf="e.answerText">→ {{ e.answerText | slice:0:100 }}</div>
        </div>
        <div style="text-align:right;flex-shrink:0">
          <div class="xs t3">Utw. {{ p.formatDate(e.createdAt) }}</div>
          <div class="xs t3 mt-3">Użyte {{ p.formatDate(e.lastUsedAt) }}</div>
        </div>
      </div>

      <!-- Expanded detail -->
      <div *ngIf="selectedEntry()?.id === e.id" class="a-q-expand" (click)="$event.stopPropagation()">

        <!-- Full question text -->
        <div style="margin-bottom:14px">
          <div class="a-label" style="margin-bottom:5px">Treść pytania</div>
          <div class="sm" style="line-height:1.7;color:var(--text-2);white-space:pre-wrap">{{ e.questionText }}</div>
        </div>

        <!-- Answer -->
        <div *ngIf="e.answerText" class="a-answer-box" style="margin-bottom:12px">
          <div class="a-answer-box-label">Odpowiedź</div>
          <div class="sm bold">{{ e.answerText }}</div>
        </div>

        <!-- Options -->
        <div *ngIf="e.options?.length" style="margin-bottom:14px">
          <div class="a-label" style="margin-bottom:6px">Opcje ({{ e.options.length }})</div>
          <div class="a-opt-list">
            <div *ngFor="let opt of e.options; let i = index"
              class="a-opt"
              [class.correct]="isCorrectOption(e, i)">
              <strong>{{ i + 1 }}.</strong> {{ opt }}
              <strong *ngIf="isCorrectOption(e, i)"> ✓</strong>
            </div>
          </div>
        </div>

        <!-- Prompts (matching) -->
        <div *ngIf="e.prompts?.length" style="margin-bottom:14px">
          <div class="a-label" style="margin-bottom:6px">Prompts (matching)</div>
          <div style="display:flex;flex-direction:column;gap:3px">
            <div *ngFor="let pr of e.prompts; let i = index"
              style="display:flex;gap:8px;font-size:12px;padding:4px 8px;background:var(--surface-3);border-radius:4px">
              <span class="t3">{{ i + 1 }}.</span>
              <span class="t2 flex-1">{{ pr }}</span>
              <span class="ts" *ngIf="e.options?.[getAnswer(e, i)]">→ {{ e.options[getAnswer(e, i)] }}</span>
            </div>
          </div>
        </div>

        <!-- Explanation -->
        <details class="a-det" *ngIf="e.explanation" style="margin-bottom:12px">
          <summary>Wyjaśnienie</summary>
          <div class="sm t2" style="margin-top:8px;line-height:1.6;padding-left:12px">{{ e.explanation }}</div>
        </details>

        <!-- Metadata grid -->
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;margin-bottom:12px">
          <div class="a-hcard">
            <div class="a-hcard-label">Trafień</div>
            <div class="a-hcard-value tc">{{ e.hitCount || 0 }}</div>
          </div>
          <div class="a-hcard">
            <div class="a-hcard-label">Typ</div>
            <div class="a-hcard-value">{{ e.questionType }}</div>
          </div>
          <div class="a-hcard" *ngIf="e.platform">
            <div class="a-hcard-label">Platforma</div>
            <div class="a-hcard-value">{{ e.platform }}</div>
          </div>
          <div class="a-hcard" *ngIf="e.model">
            <div class="a-hcard-label">Model AI</div>
            <div class="a-hcard-value accent">{{ e.model }}</div>
          </div>
          <div class="a-hcard" *ngIf="e.tokensUsed">
            <div class="a-hcard-label">Tokeny</div>
            <div class="a-hcard-value">{{ e.tokensUsed }}</div>
          </div>
          <div class="a-hcard" *ngIf="e.confidence !== undefined">
            <div class="a-hcard-label">Confidence</div>
            <div class="a-hcard-value" [class]="e.confidence < .4 ? 'err' : e.confidence < .7 ? 'warn' : 'ok'">
              {{ (e.confidence * 100).toFixed(0) }}%
            </div>
          </div>
        </div>

        <!-- Timestamps -->
        <div style="display:flex;gap:20px;font-size:11px;color:var(--text-3);margin-bottom:12px;flex-wrap:wrap">
          <div>Utworzono: <strong>{{ p.formatDate(e.createdAt, true) }}</strong></div>
          <div>Ostatnio użyte: <strong>{{ p.formatDate(e.lastUsedAt, true) }}</strong></div>
        </div>

        <!-- Technical (hash) -->
        <details class="a-det" style="margin-bottom:12px">
          <summary>Dane techniczne</summary>
          <div class="a-stack" style="margin-top:8px;max-height:80px">id: {{ e._id || e.id }}
questionHash: {{ e.questionHash || '—' }}</div>
        </details>

        <!-- Actions -->
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="a-btn a-btn-ghost a-btn-sm" (click)="copyText(e.questionText)">📋 Kopiuj pytanie</button>
          <button class="a-btn a-btn-ghost a-btn-sm" (click)="copyText(e.answerText || '')" *ngIf="e.answerText">📋 Kopiuj odpowiedź</button>
          <button class="a-btn a-btn-danger a-btn-sm" (click)="deleteEntry(e)">🗑 Usuń z cache</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Pagination -->
  <div class="a-pager">
    <span class="t3 sm">Strona {{ page() }} z {{ pages() }} · łącznie {{ totalMatching() }}</span>
    <div class="a-pager-btns">
      <button class="a-btn a-btn-secondary a-btn-sm" [disabled]="page() <= 1 || loading()" (click)="page.update(n => n-1); selectedEntry.set(null); load()">←</button>
      <button class="a-btn a-btn-secondary a-btn-sm" [disabled]="page() >= pages() || loading()" (click)="page.update(n => n+1); selectedEntry.set(null); load()">→</button>
    </div>
  </div>
</div>
  `
})
export class AdminCacheComponent implements OnInit {
  @Input() p!: AdminComponent;

  loading       = signal(false);
  entries       = signal<any[]>([]);
  totalCached   = signal(0);
  totalMatching = signal(0);
  page          = signal(1);
  pages         = signal(1);
  selectedEntry = signal<any>(null);

  search     = '';
  filterType = '';

  ngOnInit() { this.load(); }

  async load() {
    this.loading.set(true);
    this.selectedEntry.set(null);
    const q  = this.search     ? `&q=${encodeURIComponent(this.search)}`         : '';
    const qt = this.filterType ? `&type=${encodeURIComponent(this.filterType)}`  : '';
    const res = await this.p.api(`/api/admin/cache/stats?page=${this.page()}&limit=20${q}${qt}`);
    if (res.topHits !== undefined) {
      this.entries.set(res.topHits);
      this.totalCached.set(res.totalCached || 0);
      this.totalMatching.set(res.totalMatching || 0);
      const pag = res.pagination || {};
      this.pages.set(pag.pages || 1);
    }
    this.loading.set(false);
  }

  toggleEntry(e: any) {
    this.selectedEntry.set(this.selectedEntry()?.id === e.id ? null : e);
  }

  // ── Answer helpers ────────────────────────────────
  isCorrectOption(e: any, idx: number): boolean {
    if (!e.answer && e.answer !== 0) return false;
    const ans = e.answer;
    if (e.questionType === 'radio') return ans === idx;
    if (e.questionType === 'checkbox' && Array.isArray(ans)) return ans.includes(idx);
    return false;
  }

  getAnswer(e: any, promptIdx: number): number {
    if (!Array.isArray(e.answer)) return -1;
    return e.answer[promptIdx] ?? -1;
  }

  copyText(text: string) {
    navigator.clipboard.writeText(text).then(() => this.p.toast('Skopiowano do schowka', 'success'));
  }

  async deleteEntry(e: any) {
    if (!confirm('Usunąć ten wpis z cache?')) return;
    const id = e._id || e.id;
    const res = await this.p.api(`/api/admin/cache/${id}`, { method: 'DELETE' });
    if (res.success) {
      this.entries.update(list => list.filter(x => (x._id || x.id) !== id));
      this.selectedEntry.set(null);
      this.totalMatching.update(n => n - 1);
      this.totalCached.update(n => n - 1);
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
