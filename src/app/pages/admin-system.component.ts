import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './admin.component';

@Component({
  selector: 'app-admin-system',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="a-section anim-in">

  <div class="a-card">
    <div class="a-card-header">
      <div class="a-card-title">🖥️ Stan systemu</div>
      <button class="a-btn a-btn-ghost a-btn-sm" (click)="loadHealth()" [disabled]="loading()">🔄</button>
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

  <div class="a-card">
    <div class="a-card-header" style="flex-wrap:wrap;gap:10px">
      <div>
        <div class="a-card-title">🤖 Bot Telegram (@getQuizSolverbot)</div>
        <div class="a-card-subtitle">Automatyczny raport dzienny o 08:00 rano + auto-odpowiedź dla użytkowników z linkiem do strony</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <button class="a-btn a-btn-primary a-btn-sm" (click)="sendTestReport(false)" [disabled]="telegramLoading()">
          {{ telegramLoading() ? 'Wysyłanie...' : '📨 Wyślij raport (Wczoraj)' }}
        </button>
        <button class="a-btn a-btn-secondary a-btn-sm" (click)="sendTestReport(true)" [disabled]="telegramLoading()">
          🔴 Stan z dziś
        </button>
        <button class="a-btn a-btn-ghost a-btn-sm" (click)="loadTelegram()" [disabled]="telegramLoading()" title="Odśwież">🔄</button>
      </div>
    </div>
    <div class="a-card-body">
      <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;padding:12px 16px;background:var(--surface-2);border-radius:var(--radius-sm);border:1px solid var(--border)">
        <div>
          <span class="xs t3">Nazwa bota:</span>
          <div class="bold"><a href="https://t.me/getQuizSolverbot" target="_blank" rel="noopener" style="color:var(--cyan)">@getQuizSolverbot ↗</a></div>
        </div>
        <div style="width:1px;height:30px;background:var(--border)"></div>
        <div>
          <span class="xs t3">Status powiązania Admina:</span>
          <div>
            <span class="a-badge" [class.a-badge-success]="telegram().isBound" [class.a-badge-warning]="!telegram().isBound">
              {{ telegram().isBound ? '✓ Powiązany (Chat ID: ' + telegram().adminChatId + ')' : 'Oczekuje na kontakt z Adminem' }}
            </span>
          </div>
        </div>
        <div style="width:1px;height:30px;background:var(--border)"></div>
        <div>
          <span class="xs t3">Harmonogram:</span>
          <div class="bold" style="color:var(--warning)">Codziennie o 08:00 (Europe/Warsaw)</div>
        </div>
      </div>

      <div *ngIf="!telegram().isBound" style="margin-top:14px;padding:12px 16px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.25);border-radius:var(--radius-sm);font-size:13px;line-height:1.5">
        💡 <strong>Jak aktywować raporty na swoim telefonie:</strong><br>
        1. Otwórz aplikację Telegram i wyszukaj <a href="https://t.me/getQuizSolverbot" target="_blank" rel="noopener" class="bold tc">@getQuizSolverbot</a>.<br>
        2. Napisz cokolwiek ze swojego konta <b>@kam567122</b> (np. kliknij <b>Rozpocznij (Start)</b> lub wyślij <code>/raport</code>).<br>
        3. Bot natychmiast zweryfikuje Twój profil i powiąże Twój prywatny czat jako odbiorcę codziennych raportów o 8:00.<br>
        <i>Gdy ktokolwiek inny napisze do bota, bot automatycznie odeśle mu zaproszenie z linkiem do https://getquizsolver.com.</i>
      </div>
    </div>
  </div>

  <div class="a-card">
    <div class="a-card-header">
      <div>
        <div class="a-card-title">🔐 Bezpieczeństwo billingowe</div>
        <div class="a-card-subtitle">Monitor deduplikacji kredytów</div>
      </div>
      <button class="a-btn a-btn-ghost a-btn-sm" (click)="loadBilling()" [disabled]="billingLoading()">🔄</button>
    </div>
    <div class="a-card-body">
      <div class="a-health-grid" *ngIf="billing().totalClaims !== undefined">
        <div class="a-hcard">
          <div class="a-hcard-label">Łącznie Claims</div>
          <div class="a-hcard-value">{{ billing().totalClaims }}</div>
        </div>
        <div class="a-hcard">
          <div class="a-hcard-label">Naliczone</div>
          <div class="a-hcard-value ok">{{ billing().chargedRecords }}</div>
        </div>
        <div class="a-hcard">
          <div class="a-hcard-label">Umorzone</div>
          <div class="a-hcard-value">{{ billing().waivedRecords }}</div>
        </div>
        <div class="a-hcard">
          <div class="a-hcard-label">Aktywne (świeże)</div>
          <div class="a-hcard-value" [class]="billing().activeClaims > 0 ? 'warn' : ''">{{ billing().activeClaims }}</div>
        </div>
        <div class="a-hcard">
          <div class="a-hcard-label">Stale Claims</div>
          <div class="a-hcard-value" [class]="billing().staleClaims > 10 ? 'err' : ''">{{ billing().staleClaims }}</div>
        </div>
        <div class="a-hcard">
          <div class="a-hcard-label">Naliczone 24h</div>
          <div class="a-hcard-value ok">{{ billing().chargedLast24h }}</div>
        </div>
      </div>
    </div>

    <div *ngIf="billing().duplicateGroups?.length" style="border-top:1px solid var(--border)">
      <div style="padding:12px 20px;background:var(--danger-bg);display:flex;align-items:center;gap:10px">
        <span style="font-size:20px">⚠️</span>
        <div>
          <div class="bold td">Wykryto potencjalnie podwójne naliczenia!</div>
          <div class="xs t3">Sprawdź poniższe grupy i rozważ zwrot.</div>
        </div>
      </div>
      <div class="a-table-wrap">
        <table class="a-table">
          <thead>
            <tr><th>Email</th><th>Akcja</th><th>Hash pytania</th><th>Nalic.</th><th>Kredyty</th><th>Odstęp (ms)</th><th>Pierwsze</th><th>Ostatnie</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let g of billing().duplicateGroups">
              <td class="xs">{{ g.email || 'Unknown' }}</td>
              <td><span class="a-badge a-badge-muted">{{ g.action }}</span></td>
              <td class="xs mono t3">{{ (g.questionHash || '').slice(0, 12) }}...</td>
              <td class="bold td">{{ g.count }}</td>
              <td class="tc">{{ g.credits }}</td>
              <td class="xs t3">{{ g.spanMs }}</td>
              <td class="xs t3">{{ p.formatDate(g.firstChargedAt) }}</td>
              <td class="xs t3">{{ p.formatDate(g.lastChargedAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div *ngIf="billing().duplicateGroups?.length === 0" style="padding:16px 20px;display:flex;align-items:center;gap:10px;border-top:1px solid var(--border)">
      <span>✅</span> <span class="sm ts">Brak wykrytych podwójnych naliczeń.</span>
    </div>
  </div>

  <div class="a-card">
    <div class="a-card-header">
      <div>
        <div class="a-card-title">📊 Log kredytów</div>
        <div class="a-card-subtitle">Co zostało naliczone, umorzone lub odrzucone</div>
      </div>
    </div>

    <div class="a-filters">
      <div class="a-search-wrap" style="flex:1;min-width:180px">
        <span class="a-search-ico">🔍</span>
        <input class="a-input" [(ngModel)]="usageSearch" (keyup.enter)="loadUsage()" placeholder="Email, treść pytania, hash...">
      </div>
      <select class="a-select" [(ngModel)]="usageStatus" (ngModelChange)="loadUsage()" style="max-width:130px">
        <option value="">Wszystkie statusy</option>
        <option value="charged">charged</option>
        <option value="claimed">claimed</option>
        <option value="waived">waived</option>
        <option value="aborted">aborted</option>
        <option value="declined">declined</option>
      </select>
      <select class="a-select" [(ngModel)]="usageAction" (ngModelChange)="loadUsage()" style="max-width:140px">
        <option value="">Wszystkie akcje</option>
        <option value="solve">solve</option>
        <option value="explain">explain</option>
        <option value="follow-up">follow-up</option>
      </select>
      <button class="a-btn a-btn-secondary a-btn-sm" (click)="loadUsage()" [disabled]="usageLoading()">Szukaj</button>
    </div>

    <div *ngIf="usageLoading()" style="padding:32px;text-align:center;color:var(--text-3)">Ładowanie...</div>

    <div class="a-table-wrap" *ngIf="!usageLoading()">
      <table class="a-table">
        <thead>
          <tr><th>Email</th><th>Akcja</th><th>Typ</th><th>Status</th><th>Kredyty</th><th>Pytanie</th><th>Kiedy</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let u of usageList()">
            <td class="xs">{{ u.email }}</td>
            <td><span class="a-badge a-badge-muted">{{ u.action }}</span></td>
            <td>
              <span class="a-badge" [class]="u.wasPaid || u.creditType === 'paid' ? 'a-badge-accent' : 'a-badge-muted'" style="font-size:10px">
                {{ (u.wasPaid || u.creditType === 'paid') ? 'Płatny' : 'Darmowy' }}
              </span>
              <span *ngIf="u.afterPurchase" class="a-badge a-badge-success" style="font-size:9px;margin-left:4px" title="Zużycie po doładowaniu">po zakupie</span>
            </td>
            <td><span class="a-badge" [class]="usageStatusClass(u.status)">{{ u.status }}</span></td>
            <td class="bold tc">{{ u.credits }}</td>
            <td style="max-width:200px"><div class="xs t3 trunc">{{ u.questionText | slice:0:60 }}</div></td>
            <td class="xs t3">{{ p.formatDate(u.time) }}</td>
          </tr>
          <tr *ngIf="!usageList().length">
            <td colspan="7" class="a-table-empty">Brak rekordów dla tych filtrów.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="a-pager" *ngIf="usageTotal() > usagePageSize">
      <span class="t3 sm">Strona {{ usagePage() }} z {{ Math.ceil(usageTotal() / usagePageSize) }} · łącznie {{ usageTotal() }}</span>
      <div class="a-pager-btns">
        <button class="a-btn a-btn-secondary a-btn-sm" [disabled]="usagePage() <= 1" (click)="usagePage.update(n=>n-1); loadUsage()">←</button>
        <button class="a-btn a-btn-secondary a-btn-sm" [disabled]="usagePage() * usagePageSize >= usageTotal()" (click)="usagePage.update(n=>n+1); loadUsage()">→</button>
      </div>
    </div>
  </div>
</div>
  `
})
export class AdminSystemComponent implements OnInit {
  @Input() p!: AdminComponent;

  loading        = signal(false);
  billingLoading = signal(false);
  usageLoading   = signal(false);

  billing  = signal<any>({});
  usageList = signal<any[]>([]);
  usageTotal = signal(0);
  usagePage  = signal(1);
  usagePageSize = 25;

  usageSearch = '';
  usageStatus = '';
  usageAction = '';

  telegram = signal<any>({ hasToken: true, botUsername: 'getQuizSolverbot', adminChatId: null, isBound: false });
  telegramLoading = signal(false);

  readonly Math = Math;

  ngOnInit() {
    this.loadHealth();
    this.loadTelegram();
    this.loadBilling();
    this.loadUsage();
  }

  async loadTelegram() {
    try {
      const res = await this.p.api('/api/admin/telegram/status');
      if (res.success) this.telegram.set(res);
    } catch {  }
  }

  async sendTestReport(isToday = false) {
    this.telegramLoading.set(true);
    try {
      const res = await this.p.api('/api/admin/telegram/test-report', {
        method: 'POST',
        body: JSON.stringify({ isToday })
      });
      if (res.success) {
        this.p.toast(res.message || 'Raport wysłany na Telegram!', 'success');
        await this.loadTelegram();
      } else {
        this.p.toast(res.error || 'Błąd wysyłania', 'error');
      }
    } catch {
      this.p.toast('Błąd połączenia z serwerem', 'error');
    }
    this.telegramLoading.set(false);
  }

  async loadHealth() {
    this.loading.set(true);
    const res = await this.p.api('/api/admin/system/health');
    if (res.health) this.p.health.set(res.health);
    this.loading.set(false);
  }

  async loadBilling() {
    this.billingLoading.set(true);
    const res = await this.p.api('/api/admin/billing/safety');
    if (res.billing) this.billing.set(res.billing);
    this.billingLoading.set(false);
  }

  async loadUsage() {
    this.usageLoading.set(true);
    const params = new URLSearchParams({
      page: String(this.usagePage()), limit: String(this.usagePageSize)
    });
    if (this.usageStatus) params.set('status', this.usageStatus);
    if (this.usageAction) params.set('action', this.usageAction);
    if (this.usageSearch) params.set('q', this.usageSearch);
    const res = await this.p.api(`/api/admin/billing/usage?${params}`);
    if (res.usage) {
      this.usageList.set(res.usage);
      this.usageTotal.set(res.pagination?.total || 0);
    }
    this.usageLoading.set(false);
  }

  healthCards() {
    const h = this.p.health();
    if (!h || !Object.keys(h).length) return [{ label: 'Status', value: 'Ładowanie...', cls: '' }];
    const uptime = h.uptime ? `${Math.floor(h.uptime / 3600)}h ${Math.floor((h.uptime % 3600) / 60)}m` : '?';
    return [
      { label: 'Baza danych',    value: h.database || '?',          cls: h.database === 'connected' ? 'ok' : 'err' },
      { label: 'Uptime',         value: uptime,                      cls: 'ok'  },
      { label: 'Heap used',      value: h.memory?.heapUsed || '?',  cls: ''    },
      { label: 'Heap total',     value: h.memory?.heapTotal || '?', cls: ''    },
      { label: 'RSS',            value: h.memory?.rss || '?',       cls: ''    },
      { label: 'Node.js',        value: h.nodeVersion || '?',       cls: ''    },
      { label: 'Środowisko',     value: h.env || '?',               cls: h.env === 'production' ? 'ok' : 'warn' },
    ];
  }

  usageStatusClass(s: string) {
    return ({ charged: 'a-badge-danger', claimed: 'a-badge-warning', waived: 'a-badge-success', aborted: 'a-badge-muted', declined: 'a-badge-muted' } as any)[s] || 'a-badge-muted';
  }
}
