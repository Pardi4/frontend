import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { AdminComponent } from './admin.component';

@Component({
  selector: 'app-admin-purchases',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="a-section anim-in">
  <div class="a-card">
    <div class="a-card-header">
      <div>
        <div class="a-card-title">💳 Zakupy i granty</div>
        <div class="a-card-subtitle">Ostatnie 200 transakcji</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <span class="a-badge a-badge-cyan" *ngIf="pendingCount() > 0">{{ pendingCount() }} oczekujących</span>
        <button class="a-btn a-btn-ghost a-btn-sm" (click)="load()" [disabled]="loading()">🔄</button>
      </div>
    </div>

    <!-- Stats strip -->
    <div style="padding:10px 20px;border-bottom:1px solid var(--border);display:flex;gap:20px;font-size:12px;color:var(--text-3);flex-wrap:wrap;align-items:center">
      <span>Łącznie: <strong>{{ purchases().length }}</strong> transakcji</span>
      <span>🍋 Lemon Squeezy: <strong class="tc">{{ lemonRevenue() }}</strong> ({{ lemonCount() }})</span>
      <span>⚡ BLIK: <strong class="ts" style="color:var(--success)">{{ blikRevenue() }}</strong> ({{ blikCount() }})</span>
      <span>Granty manualne: <strong class="ta">{{ manualCount() }}</strong></span>
    </div>

    <div *ngIf="loading()" style="padding:40px;text-align:center;color:var(--text-3)">Ładowanie...</div>

    <div class="a-table-wrap" *ngIf="!loading()">
      <table class="a-table">
        <thead>
          <tr>
            <th>Użytkownik</th>
            <th>Pakiet</th>
            <th>Kredyty</th>
            <th>Cena</th>
            <th>Dostawca</th>
            <th>Status</th>
            <th>Powód</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let pur of purchases()">
            <td>
              <div class="sm trunc" style="max-width:180px">{{ pur.user || 'Nieznany' }}</div>
            </td>
            <td class="xs t2">{{ pur.pack }}</td>
            <td class="bold tc">{{ pur.credits }}</td>
            <td>
              <span class="bold ts" style="color:var(--success)" *ngIf="pur.provider === 'dpay'">{{ p.formatPln(pur.pricePln || (pur.priceUsd ? pur.priceUsd * 4 : 0)) }}</span>
              <span class="bold tc" *ngIf="pur.provider !== 'dpay' && pur.priceUsd">{{ p.formatMoney(pur.priceUsd) }}</span>
              <span class="xs t3" *ngIf="!pur.priceUsd && !pur.pricePln">—</span>
            </td>
            <td>
              <span class="a-badge" [class]="providerClass(pur.provider)" style="text-transform:uppercase;font-size:10px">
                {{ providerLabel(pur.provider) }}
              </span>
            </td>
            <td>
              <span class="a-badge" [class]="pur.creditsApplied ? 'a-badge-success' : 'a-badge-warning'">
                {{ pur.creditsApplied ? 'Zastosowane' : 'Oczekuje' }}
              </span>
              <button
                *ngIf="!pur.creditsApplied"
                class="a-btn a-btn-primary a-btn-sm"
                style="margin-top:5px;display:block"
                (click)="apply(pur)"
                [disabled]="loading()">
                ✓ Zastosuj
              </button>
            </td>
            <td class="xs t3" style="max-width:140px">{{ pur.reason || '—' }}</td>
            <td class="xs t3">{{ p.formatDate(pur.date) }}</td>
          </tr>
          <tr *ngIf="!purchases().length">
            <td colspan="8" class="a-table-empty">Brak zakupów.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
  `
})
export class AdminPurchasesComponent implements OnInit {
  @Input() p!: AdminComponent;

  loading   = signal(false);
  purchases = signal<any[]>([]);

  ngOnInit() { this.load(); }

  async load() {
    this.loading.set(true);
    const res = await this.p.api('/api/admin/purchases');
    if (res.purchases) this.purchases.set(res.purchases);
    this.loading.set(false);
  }

  pendingCount() { return this.purchases().filter(x => !x.creditsApplied).length; }
  manualCount()  { return this.purchases().filter(x => x.provider === 'manual').length; }
  lemonCount()   { return this.purchases().filter(x => ['lemonsqueezy', 'lemon', 'whop'].includes(x.provider)).length; }
  blikCount()    { return this.purchases().filter(x => x.provider === 'dpay').length; }

  lemonRevenue() {
    const total = this.purchases()
      .filter(x => ['lemonsqueezy', 'lemon', 'whop'].includes(x.provider) && x.priceUsd)
      .reduce((s, x) => s + x.priceUsd, 0);
    return this.p.formatMoney(total);
  }

  blikRevenue() {
    const total = this.purchases()
      .filter(x => x.provider === 'dpay')
      .reduce((s, x) => s + (x.pricePln || (x.priceUsd ? x.priceUsd * 4 : 0)), 0);
    return this.p.formatPln(total);
  }

  totalRevenue() {
    const total = this.purchases().filter(x => x.priceUsd).reduce((s, x) => s + x.priceUsd, 0);
    return this.p.formatMoney(total);
  }

  async apply(pur: any) {
    if (!confirm('Zastosować kredyty z tej płatności?')) return;
    this.loading.set(true);
    const res = await this.p.api(`/api/admin/purchases/${pur.id}/apply`, { method: 'POST' });
    if (res.success) {
      pur.creditsApplied = true;
      this.p.toast('Kredyty zastosowane', 'success');
    } else {
      this.p.toast(res.error || 'Błąd', 'error');
    }
    this.loading.set(false);
  }

  providerLabel(p: string) {
    if (p === 'dpay') return '⚡ BLIK';
    if (['lemonsqueezy', 'lemon'].includes(p)) return '🍋 LEMON';
    if (p === 'whop') return 'WHOP';
    if (p === 'manual') return 'MANUAL';
    if (p === 'promo_free') return 'PROMO';
    return p || '—';
  }

  providerClass(p: string) {
    if (['lemonsqueezy', 'lemon'].includes(p)) return 'a-badge-cyan';
    if (p === 'dpay') return 'a-badge-success';
    if (p === 'manual') return 'a-badge-accent';
    if (p === 'whop') return 'a-badge-cyan';
    return 'a-badge-muted';
  }
}
