import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './admin.component';

@Component({
  selector: 'app-admin-dataset',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="a-card anim-in">
  <div class="a-card-header">
    <div>
      <div class="a-card-title">📄 Dataset parsera</div>
      <div class="a-card-subtitle">Plik parser_dataset.jsonl ({{ entries().length }} wpisów)</div>
    </div>
    <div style="display:flex;gap:8px;align-items:center">
      <div class="a-search-wrap" style="min-width:200px">
        <span class="a-search-ico">🔍</span>
        <input class="a-input" [(ngModel)]="search" placeholder="Szukaj..." style="padding-left:34px">
      </div>
      <button class="a-btn a-btn-ghost a-btn-sm" (click)="load()" [disabled]="loading()">🔄</button>
    </div>
  </div>

  <div *ngIf="loading()" style="padding:48px;text-align:center;color:var(--text-3)">Ładowanie datasetu...</div>

  <div class="a-table-wrap" *ngIf="!loading()">
    <table class="a-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Platforma</th>
          <th>Wynik</th>
          <th>Pytania</th>
          <th>Confidence</th>
          <th>Kiedy</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let e of filtered(); let i = index">
          <td class="xs t3">{{ i + 1 }}</td>
          <td class="xs">{{ e.platform || 'universal' }}</td>
          <td>
            <span class="a-badge" [class]="outcomeClass(e.outcome || e.result)">{{ e.outcome || e.result || '?' }}</span>
          </td>
          <td class="t2">{{ e.questionCount || e.questions?.length || 0 }}</td>
          <td class="ta">{{ e.confidence !== undefined ? (e.confidence * 100).toFixed(0) + '%' : '—' }}</td>
          <td class="xs t3">{{ p.formatDate(e.createdAt || e.timestamp) }}</td>
          <td>
            <button class="a-btn a-btn-ghost a-btn-sm" (click)="toggle(i)">{{ expanded() === i ? '▲' : '▼' }}</button>
          </td>
        </tr>
        <!-- Expanded row -->
        <ng-container *ngFor="let e of filtered(); let i = index">
          <tr *ngIf="expanded() === i">
            <td colspan="7" style="padding:0">
              <div style="padding:16px;background:var(--surface-2);border-top:1px solid var(--border)">
                <pre class="a-stack" style="max-height:300px">{{ formatJson(e) }}</pre>
              </div>
            </td>
          </tr>
        </ng-container>
        <tr *ngIf="!loading() && !filtered().length">
          <td colspan="7" class="a-table-empty">{{ entries().length ? 'Brak wyników dla "' + search + '"' : 'Dataset jest pusty lub nie istnieje.' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
  `
})
export class AdminDatasetComponent implements OnInit {
  @Input() p!: AdminComponent;

  loading  = signal(false);
  entries  = signal<any[]>([]);
  expanded = signal(-1);
  search   = '';

  ngOnInit() { this.load(); }

  async load() {
    this.loading.set(true);
    const res = await this.p.api('/api/admin/dataset');
    if (Array.isArray(res)) this.entries.set(res);
    this.loading.set(false);
  }

  filtered() {
    const s = this.search.toLowerCase();
    if (!s) return this.entries();
    return this.entries().filter(e =>
      JSON.stringify(e).toLowerCase().includes(s)
    );
  }

  toggle(i: number) { this.expanded.set(this.expanded() === i ? -1 : i); }

  formatJson(e: any) {
    try { return JSON.stringify(e, null, 2); } catch { return String(e); }
  }

  outcomeClass(o: string) {
    return ({ success: 'a-badge-success', partial: 'a-badge-cyan', empty: 'a-badge-warning', weak: 'a-badge-warning', error: 'a-badge-danger' } as any)[o] || 'a-badge-muted';
  }
}
