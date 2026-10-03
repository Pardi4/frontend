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

  <!-- ── Summary cards ── -->
  <div class="a-card" *ngIf="health()">
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
        <select class="a-select" [(ngModel)]="zipVersion" style="max-width:150px" title="Wersja rozszerzenia do raportu ZIP">
          <option value="">Wszystkie wersje</option>
          <option *ngFor="let v of versions(); let i = index" [value]="v">{{ v }}{{ i === 0 ? ' (najnowsza)' : '' }}</option>
        </select>
        <button class="a-btn a-btn-primary a-btn-sm" (click)="downloadZip()" [disabled]="zipLoading()">⬇ Raport ZIP</button>
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

  <!-- ── Platforms table (click to expand) ── -->
  <div class="a-card" *ngIf="health().platforms?.length">
    <div class="a-card-header">
      <div class="a-card-title">📊 Analityka platform</div>
      <span class="xs t3">Kliknij platformę, żeby zobaczyć szczegóły</span>
    </div>
    <div class="a-table-wrap">
      <table class="a-table">
        <thead>
          <tr>
            <th>Platforma</th>
            <th>Łącznie</th>
            <th>Sukces</th>
            <th>Częściowe</th>
            <th>Błędy</th>
            <th>Failure %</th>
            <th>Confidence</th>
            <th>Ostatnio</th>
          </tr>
        </thead>
        <tbody>
          <ng-container *ngFor="let pl of health().platforms">
            <!-- Row -->
            <tr style="cursor:pointer" (click)="togglePlatform(pl.platform)"
              [style.background]="selectedPlatform() === pl.platform ? 'var(--accent-bg)' : ''">
              <td>
                <div style="display:flex;align-items:center;gap:8px">
                  <span style="font-size:11px;color:var(--text-3);transition:transform .15s"
                    [style.transform]="selectedPlatform() === pl.platform ? 'rotate(90deg)' : 'none'">▶</span>
                  <strong [class]="selectedPlatform() === pl.platform ? 'ta' : ''">{{ pl.platform }}</strong>
                </div>
              </td>
              <td>{{ pl.count }}</td>
              <td class="ts">{{ pl.success }}</td>
              <td class="tw">{{ pl.partial || 0 }}</td>
              <td class="td">{{ pl.failed }}</td>
              <td>
                <span class="a-badge" [class]="pl.failureRate > .3 ? 'a-badge-danger' : pl.failureRate > .1 ? 'a-badge-warning' : 'a-badge-success'">
                  {{ (pl.failureRate * 100).toFixed(1) }}%
                </span>
              </td>
              <td class="ta">{{ (pl.avgConfidence * 100).toFixed(0) }}%</td>
              <td class="xs t3">{{ p.formatDate(pl.lastSeenAt) }}</td>
            </tr>

            <!-- Expanded platform detail -->
            <tr *ngIf="selectedPlatform() === pl.platform">
              <td colspan="8" style="padding:0;background:var(--surface-2)">
                <div style="padding:16px 20px;animation:aSlideUp 180ms ease">
                  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;margin-bottom:14px">
                    <div class="a-hcard">
                      <div class="a-hcard-label">Success rate</div>
                      <div class="a-hcard-value ok">{{ pl.count ? ((pl.success/pl.count)*100).toFixed(1) : 0 }}%</div>
                    </div>
                    <div class="a-hcard">
                      <div class="a-hcard-label">Avg Questions</div>
                      <div class="a-hcard-value">{{ (pl.avgQuestions || 0).toFixed(1) }}</div>
                    </div>
                    <div class="a-hcard">
                      <div class="a-hcard-label">Empty</div>
                      <div class="a-hcard-value" [class]="(pl.empty||0)>0?'warn':''">{{ pl.empty || 0 }}</div>
                    </div>
                    <div class="a-hcard">
                      <div class="a-hcard-label">Weak</div>
                      <div class="a-hcard-value" [class]="(pl.weak||0)>0?'warn':''">{{ pl.weak || 0 }}</div>
                    </div>
                    <div class="a-hcard">
                      <div class="a-hcard-label">Error</div>
                      <div class="a-hcard-value" [class]="(pl.error||0)>0?'err':''">{{ pl.error || 0 }}</div>
                    </div>
                    <div class="a-hcard">
                      <div class="a-hcard-label">Reported</div>
                      <div class="a-hcard-value">{{ pl.reported || 0 }}</div>
                    </div>
                  </div>

                  <!-- Problem groups for this platform -->
                  <ng-container *ngIf="platformProblems(pl.platform) as problems">
                    <div *ngIf="problems.length" style="margin-top:4px">
                      <div class="xs t3 bold" style="text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">
                        ⚠️ Grupy problemów ({{ problems.length }})
                      </div>
                      <div style="display:flex;flex-direction:column;gap:4px">
                        <div *ngFor="let pg of problems"
                          style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:var(--surface-3);border-radius:var(--radius-sm);font-size:12px;flex-wrap:wrap">
                          <span class="a-badge" [class]="outcomeClass(pg.outcome)">{{ pg.outcome }}</span>
                          <span class="mono t2">{{ pg.hostname || '—' }}</span>
                          <span class="t3 flex-1" *ngIf="pg.reason">{{ pg.reason }}</span>
                          <span class="bold td">{{ pg.count }}×</span>
                          <span class="xs t3">{{ p.formatDate(pg.lastSeenAt) }}</span>
                        </div>
                      </div>
                    </div>
                  </ng-container>

                  <!-- Quick filter button -->
                  <div style="margin-top:12px">
                    <button class="a-btn a-btn-secondary a-btn-sm" (click)="filterByPlatform(pl.platform)">
                      📋 Pokaż eventy tej platformy →
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </ng-container>
        </tbody>
      </table>
    </div>
  </div>

  <!-- ── Problem groups ── -->
  <div class="a-card" *ngIf="health().problemGroups?.length">
    <div class="a-card-header">
      <div class="a-card-title">⚠️ Grupy problemów</div>
      <div class="a-card-subtitle">Najczęstsze wzorce błędów</div>
    </div>
    <div class="a-table-wrap">
      <table class="a-table">
        <thead>
          <tr><th>Hostname</th><th>Platforma</th><th>Wynik</th><th>Powód</th><th>Liczba</th><th>Ostatnio</th><th></th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let pg of health().problemGroups" style="cursor:pointer" (click)="filterByHostname(pg)">
            <td class="xs mono t2">{{ pg.hostname || '—' }}</td>
            <td><span class="a-badge a-badge-muted">{{ pg.platform }}</span></td>
            <td><span class="a-badge" [class]="outcomeClass(pg.outcome)">{{ pg.outcome }}</span></td>
            <td class="xs t2" style="max-width:200px">{{ pg.reason || '—' }}</td>
            <td><strong class="td">{{ pg.count }}</strong></td>
            <td class="xs t3">{{ p.formatDate(pg.lastSeenAt) }}</td>
            <td><button class="a-btn a-btn-ghost a-btn-sm" title="Szukaj eventów">→</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- ── Events log ── -->
  <div class="a-card">
    <div class="a-card-header">
      <div>
        <div class="a-card-title">📋 Dziennik eventów</div>
        <div class="a-card-subtitle">Kliknij event, żeby zobaczyć wszystkie dane</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="a-filters">
      <div class="a-search-wrap" style="flex:1;min-width:180px">
        <span class="a-search-ico">🔍</span>
        <input class="a-input" [(ngModel)]="evSearch" (keyup.enter)="loadEvents()" placeholder="URL, hostname, powód...">
      </div>
      <select class="a-select" [(ngModel)]="evOutcome" (ngModelChange)="loadEvents()" style="max-width:130px">
        <option value="">Wszystkie wyniki</option>
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
      <button class="a-btn a-btn-ghost a-btn-sm" *ngIf="evSearch || evOutcome || evPlatform" (click)="clearFilters()">✕ Reset</button>
      <button class="a-btn a-btn-danger a-btn-sm" (click)="clearFilteredEvents()" *ngIf="evSearch || evOutcome || evPlatform" [disabled]="evLoading()">🗑 Usuń filtr</button>
    </div>

    <!-- Events -->
    <div *ngIf="evLoading()" style="padding:32px;text-align:center;color:var(--text-3)">Ładowanie...</div>

    <div *ngIf="!evLoading() && !events().length" class="a-table-empty">Brak eventów dla tych filtrów.</div>

    <div *ngIf="!evLoading() && events().length" style="display:flex;flex-direction:column">
      <div *ngFor="let ev of events()"
        class="a-err-item"
        style="cursor:pointer"
        [style.border-left]="selectedEvent()?.id === ev.id ? '3px solid var(--accent)' : '3px solid transparent'"
        [style.background]="selectedEvent()?.id === ev.id ? 'rgba(99,102,241,.06)' : ''"
        (click)="toggleEvent(ev)">

        <!-- Summary row -->
        <div class="a-err-meta">
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px">
              <span style="font-size:11px;color:var(--text-3);transition:transform .15s"
                [style.transform]="selectedEvent()?.id === ev.id ? 'rotate(90deg)' : 'none'">▶</span>
              <span class="a-badge" [class]="outcomeClass(ev.outcome)">{{ ev.outcome }}</span>
              <strong class="sm">{{ ev.platform || 'universal' }}</strong>
              <span class="xs t3" *ngIf="ev.detectorPlatform && ev.detectorPlatform !== ev.platform">→ {{ ev.detectorPlatform }}</span>
              <span class="a-badge a-badge-muted" *ngIf="ev.confidence !== undefined">{{ (ev.confidence * 100).toFixed(0) }}%</span>
              <span class="a-badge a-badge-cyan" *ngIf="ev.questionCount">{{ ev.questionCount }} pytań</span>
            </div>
            <div class="xs t3 trunc" *ngIf="ev.url">🔗 {{ ev.url }}</div>
            <div class="xs t2 mt-3" *ngIf="ev.reason">Powód: {{ ev.reason }}</div>
          </div>
          <div style="text-align:right;flex-shrink:0">
            <div class="xs t3">{{ p.formatDate(ev.createdAt) }}</div>
            <div class="xs t3 mt-3" *ngIf="ev.email">{{ ev.email }}</div>
          </div>
        </div>

        <!-- Expanded detail -->
        <div *ngIf="selectedEvent()?.id === ev.id" class="a-q-expand" (click)="$event.stopPropagation()">
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:14px">
            <div class="a-hcard">
              <div class="a-hcard-label">Wynik</div>
              <span class="a-badge" [class]="outcomeClass(ev.outcome)">{{ ev.outcome }}</span>
            </div>
            <div class="a-hcard">
              <div class="a-hcard-label">Platforma</div>
              <div class="a-hcard-value">{{ ev.platform || '—' }}</div>
            </div>
            <div class="a-hcard" *ngIf="ev.detectorPlatform">
              <div class="a-hcard-label">Detector platform</div>
              <div class="a-hcard-value">{{ ev.detectorPlatform }}</div>
            </div>
            <div class="a-hcard" *ngIf="ev.confidence !== undefined">
              <div class="a-hcard-label">Confidence</div>
              <div class="a-hcard-value" [class]="ev.confidence < .4 ? 'err' : ev.confidence < .7 ? 'warn' : 'ok'">
                {{ (ev.confidence * 100).toFixed(1) }}%
              </div>
            </div>
            <div class="a-hcard" *ngIf="ev.questionCount">
              <div class="a-hcard-label">Pytań wykrytych</div>
              <div class="a-hcard-value ok">{{ ev.questionCount }}</div>
            </div>
            <div class="a-hcard" *ngIf="ev.extensionVersion">
              <div class="a-hcard-label">Wersja ext.</div>
              <div class="a-hcard-value">v{{ ev.extensionVersion }}</div>
            </div>
          </div>

          <!-- URL -->
          <div *ngIf="ev.url" style="margin-bottom:12px">
            <div class="a-label" style="margin-bottom:5px">URL strony</div>
            <a [href]="ev.url" target="_blank" rel="noopener" class="a-source-link">🔗 {{ ev.url }}</a>
          </div>

          <!-- Hostname + reason -->
          <div *ngIf="ev.hostname || ev.reason" style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px">
            <div *ngIf="ev.hostname" style="flex:1;min-width:140px">
              <div class="a-label" style="margin-bottom:4px">Hostname</div>
              <div class="xs mono t2">{{ ev.hostname }}</div>
            </div>
            <div *ngIf="ev.reason" style="flex:2;min-width:200px">
              <div class="a-label" style="margin-bottom:4px">Powód błędu</div>
              <div class="sm t2" style="line-height:1.5">{{ ev.reason }}</div>
            </div>
          </div>

          <!-- User info -->
          <div *ngIf="ev.email || ev.userId" style="margin-bottom:12px;padding:10px 14px;background:var(--surface-3);border-radius:var(--radius-sm)">
            <div class="xs t3 bold" style="text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px">Użytkownik</div>
            <div style="display:flex;gap:12px;flex-wrap:wrap;font-size:12px">
              <span *ngIf="ev.email">📧 {{ ev.email }}</span>
              <span *ngIf="ev.userId" class="t3 mono">ID: {{ ev.userId }}</span>
            </div>
          </div>

          <!-- HTML snippet -->
          <div *ngIf="ev.htmlSnippet" style="margin-bottom:10px">
            <div class="a-label" style="margin-bottom:5px">HTML Snippet</div>
            <div class="a-stack" style="max-height:180px">{{ ev.htmlSnippet }}</div>
          </div>

          <!-- Raw body text -->
          <details class="a-det" *ngIf="ev.bodyText" style="margin-bottom:10px">
            <summary>Body text ({{ ev.bodyText.length }} znaków)</summary>
            <div class="a-stack" style="margin-top:8px;max-height:200px">{{ ev.bodyText | slice:0:3000 }}</div>
          </details>

          <!-- Timestamps -->
          <div style="display:flex;gap:16px;font-size:11px;color:var(--text-3);flex-wrap:wrap;margin-top:4px">
            <div>Kiedy: <strong>{{ p.formatDate(ev.createdAt, true) }}</strong></div>
            <div *ngIf="ev.processingTimeMs">Czas parsowania: <strong>{{ ev.processingTimeMs }}ms</strong></div>
          </div>

          <!-- Actions -->
          <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
            <button class="a-btn a-btn-secondary a-btn-sm" (click)="copyUrl(ev)" *ngIf="ev.url">
              📋 Kopiuj URL
            </button>
            <button class="a-btn a-btn-secondary a-btn-sm" (click)="filterByPlatform(ev.platform)" *ngIf="ev.platform">
              Filtruj: {{ ev.platform }}
            </button>
            <button class="a-btn a-btn-ghost a-btn-sm" (click)="filterByHostname(ev)">
              Szukaj: {{ ev.hostname }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="a-pager" *ngIf="evTotal() > evPageSize">
      <span class="t3 sm">Strona {{ evPage() }} z {{ Math.ceil(evTotal() / evPageSize) }} · łącznie {{ evTotal() }}</span>
      <div class="a-pager-btns">
        <button class="a-btn a-btn-secondary a-btn-sm" [disabled]="evPage() <= 1" (click)="evPage.update(n => n-1); selectedEvent.set(null); loadEvents()">←</button>
        <button class="a-btn a-btn-secondary a-btn-sm" [disabled]="evPage() * evPageSize >= evTotal()" (click)="evPage.update(n => n+1); selectedEvent.set(null); loadEvents()">→</button>
      </div>
    </div>
  </div>
</div>
  `
})
export class AdminParserComponent implements OnInit {
  @Input() p!: AdminComponent;

  loading        = signal(false);
  evLoading      = signal(false);
  zipLoading     = signal(false);
  zipVersion     = '';
  health         = signal<any>({});
  events         = signal<any[]>([]);
  evTotal        = signal(0);
  evPage         = signal(1);
  evPageSize     = 25;
  windowDays     = signal(7);

  selectedPlatform = signal<string | null>(null);
  selectedEvent    = signal<any>(null);

  days       = '7';
  evSearch   = '';
  evOutcome  = '';
  evPlatform = '';

  readonly Math = Math;

  versions = signal<string[]>([]);

  ngOnInit() { this.load(); this.loadVersions(); }

  async loadVersions() {
    try {
      const token = localStorage.getItem('qs_admin_token') || localStorage.getItem('qs_token') || '';
      const res = await fetch('/api/admin/parser/versions', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const data = await res.json();
      this.versions.set(Array.isArray(data.versions) ? data.versions : []);
    } catch { /* silent */ }
  }

  async downloadZip() {
    this.zipLoading.set(true);
    try {
      const token = localStorage.getItem('qs_admin_token') || localStorage.getItem('qs_token') || '';
      const v = this.zipVersion.trim();
      const verParam = v ? `&version=${encodeURIComponent(v)}` : '';
      const res = await fetch(`/api/admin/parser/analysis-zip?days=${this.days}${verParam}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Błąd pobierania raportu');
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fileSuffix = v ? `-${v}` : '';
      a.download = `parser-analysis-${this.days}d${fileSuffix}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
      this.p.toast('Pobrano raport', 'success');
    } catch (err: any) {
      this.p.toast(err.message || 'Błąd', 'error');
    }
    this.zipLoading.set(false);
  }

  async load() {
    this.loading.set(true);
    const res = await this.p.api(`/api/admin/parser/health?days=${this.days}`);
    if (res) {
      this.health.set(res); if (res.error) this.p.toast(res.error + (res.details ? " " + res.details : ""), "error");
      this.windowDays.set(res.windowDays || 7);
    }
    this.loading.set(false);
    this.loadEvents();
  }

  async loadEvents() {
    this.evLoading.set(true);
    this.selectedEvent.set(null);
    const params = new URLSearchParams({ page: String(this.evPage()), limit: String(this.evPageSize) });
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

  // ── Interact ──────────────────────────────────────
  togglePlatform(name: string) {
    this.selectedPlatform.set(this.selectedPlatform() === name ? null : name);
  }

  toggleEvent(ev: any) {
    this.selectedEvent.set(this.selectedEvent()?.id === ev.id ? null : ev);
  }

  filterByPlatform(platform: string) {
    this.evPlatform = platform;
    this.selectedPlatform.set(null);
    this.evPage.set(1);
    this.loadEvents();
    // Scroll to events log
    setTimeout(() => document.querySelector('.a-filters')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }

  filterByHostname(item: any) {
    const hn = item.hostname || item.url;
    if (!hn) return;
    this.evSearch = hn;
    if (item.platform) this.evPlatform = item.platform;
    this.evPage.set(1);
    this.loadEvents();
  }

  clearFilters() {
    this.evSearch = ''; this.evOutcome = ''; this.evPlatform = '';
    this.evPage.set(1); this.loadEvents();
  }

  async clearFilteredEvents() {
    if (!confirm('Usunąć eventy parsera pasujące do filtrów?')) return;
    const params = new URLSearchParams();
    if (this.evOutcome)  params.set('outcome', this.evOutcome);
    if (this.evPlatform) params.set('platform', this.evPlatform);
    if (this.evSearch)   params.set('q', this.evSearch);
    const res = await this.p.api(`/api/admin/parser/events?${params}`, { method: 'DELETE' });
    if (res.success) { this.p.toast(`Usunięto ${res.deleted} eventów`, 'success'); this.loadEvents(); }
    else this.p.toast(res.error || 'Błąd', 'error');
  }

  copyUrl(ev: any) {
    navigator.clipboard.writeText(ev.url).then(() => this.p.toast('Skopiowano URL', 'success'));
  }

  // ── Helpers ───────────────────────────────────────
  platformProblems(platform: string) {
    return (this.health().problemGroups || []).filter((pg: any) => pg.platform === platform);
  }

  successRate() {
    const s = this.health().summary;
    if (!s || !s.total) return 0;
    return ((s.success / s.total) * 100).toFixed(1);
  }

  outcomeClass(outcome: string): string {
    return ({ error: 'a-badge-danger', empty: 'a-badge-warning', weak: 'a-badge-warning', reported: 'a-badge-accent', success: 'a-badge-success', partial: 'a-badge-cyan' } as any)[outcome] || 'a-badge-muted';
  }
}

