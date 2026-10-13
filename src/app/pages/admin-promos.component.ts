import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './admin.component';

export interface PromoItem {
  _id: string;
  code: string;
  discountPercent: number;
  description?: string;
  platforms: string[];
  maxUses: number;
  usedCount: number;
  usedCountDpay: number;
  usedCountLemon: number;
  expiresAt: string | null;
  active: boolean;
  firstPurchaseOnly: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-admin-promos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="a-section anim-in">

  <!-- Header Card -->
  <div class="a-card">
    <div class="a-card-header">
      <div>
        <div class="a-card-title">🎟️ Zarządzanie kodami promocyjnymi</div>
        <div class="a-card-subtitle">Twórz i kontroluj kody rabatowe ze wspólnym limitem użyć dla BLIK (dPay) i Lemon Squeezy</div>
      </div>
      <button class="a-btn a-btn-ghost a-btn-sm" (click)="load()" [disabled]="loading()">🔄 Odśwież</button>
    </div>

    <!-- Stats strip -->
    <div style="padding:10px 20px;border-bottom:1px solid var(--border);display:flex;gap:24px;font-size:12px;color:var(--text-3);flex-wrap:wrap">
      <span>Łącznie kodów: <strong>{{ promos().length }}</strong></span>
      <span>Aktywne: <strong class="tc">{{ activeCount() }}</strong></span>
      <span>Łączne użycia: <strong class="ts">{{ totalRedemptions() }}</strong> (BLIK: <strong>{{ totalBlikRedemptions() }}</strong>, Lemon: <strong>{{ totalLemonRedemptions() }}</strong>)</span>
    </div>
  </div>

  <!-- Create Promo Form Card -->
  <div class="a-card">
    <div class="a-card-header">
      <div class="a-card-title">➕ Nowy kod rabatowy</div>
    </div>
    <div class="a-card-body">
      <div style="display:flex;flex-direction:column;gap:14px">

        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <div class="a-input-group" style="flex:1;min-width:180px">
            <label class="a-label">Kod rabatowy</label>
            <div style="display:flex;gap:6px">
              <input class="a-input" [(ngModel)]="newCode" placeholder="np. SESJA20" style="text-transform:uppercase;font-family:var(--font-mono)">
              <button class="a-btn a-btn-secondary a-btn-sm" type="button" (click)="generateCode()" title="Wygeneruj losowy kod">🎲 Losuj</button>
            </div>
          </div>

          <div class="a-input-group" style="width:120px">
            <label class="a-label">Zniżka %</label>
            <input class="a-input" type="number" [(ngModel)]="newPercent" min="1" max="50">
          </div>

          <div class="a-input-group" style="width:140px">
            <label class="a-label">Limit użyć (0=∞)</label>
            <input class="a-input" type="number" [(ngModel)]="newMaxUses" min="0" placeholder="0 = bez limitu">
          </div>

          <div class="a-input-group" style="min-width:160px">
            <label class="a-label">Data wygaśnięcia</label>
            <input class="a-input" type="date" [(ngModel)]="newExpiresDate">
          </div>
        </div>

        <div class="a-input-group">
          <label class="a-label">Opis / Kampania (opcjonalnie)</label>
          <input class="a-input" [(ngModel)]="newDescription" placeholder="np. Promocja jesienna dla studentów">
        </div>

        <!-- Platform checkboxes (WYBÓR PLATFORM) -->
        <div style="padding:12px;background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-sm)">
          <div class="a-label" style="margin-bottom:8px">Platformy płatności (wybierz gdzie kod ma obowiązywać):</div>
          <div style="display:flex;gap:20px;flex-wrap:wrap">
            <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
              <input type="checkbox" [(ngModel)]="platformBlik">
              <span class="bold">🔵 BLIK & Szybki Przelew (dPay)</span>
            </label>
            <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
              <input type="checkbox" [(ngModel)]="platformLemon">
              <span class="bold">🍋 Lemon Squeezy (Karty, Apple Pay, Google Pay)</span>
            </label>
          </div>
          <div class="xs t3" style="margin-top:6px">
            💡 Jeśli kod ma ograniczony limit użyć, transakcje z BLIK i Lemon Squeezy <strong>liczą się wspólnie</strong> do tego samego limitu.
          </div>
        </div>

        <!-- Additional options -->
        <div style="display:flex;gap:16px;align-items:center">
          <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
            <input type="checkbox" [(ngModel)]="newFirstPurchaseOnly">
            <span>Tylko na pierwsze doładowanie (nowi użytkownicy)</span>
          </label>
        </div>

        <!-- Action button -->
        <div style="display:flex;justify-content:flex-end">
          <button
            class="a-btn a-btn-primary"
            (click)="createPromo()"
            [disabled]="creating() || (!platformBlik && !platformLemon)">
            {{ creating() ? 'Tworzenie...' : '💾 Utwórz kod rabatowy' }}
          </button>
        </div>

      </div>
    </div>
  </div>

  <!-- Promos Table Card -->
  <div class="a-card">
    <div class="a-card-header">
      <div class="a-card-title">📋 Lista kodów rabatowych</div>
    </div>

    <div *ngIf="loading()" style="padding:40px;text-align:center;color:var(--text-3)">Ładowanie kodów...</div>

    <div class="a-table-wrap" *ngIf="!loading()">
      <table class="a-table">
        <thead>
          <tr>
            <th>Kod</th>
            <th>Rabat</th>
            <th>Platformy</th>
            <th>Wykorzystania (Wspólny limit)</th>
            <th>Ważność</th>
            <th>Status</th>
            <th>Opis</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let promo of promos()">
            <td>
              <div style="display:flex;align-items:center;gap:6px">
                <span class="a-badge" style="font-family:var(--font-mono);font-size:12px;font-weight:700;letter-spacing:0.05em">
                  {{ promo.code }}
                </span>
                <button
                  class="a-btn a-btn-ghost a-btn-sm"
                  style="padding:2px 6px"
                  (click)="copyCode(promo.code)"
                  title="Kopiuj kod">
                  📋
                </button>
              </div>
            </td>
            <td>
              <span class="bold tc" style="font-size:13px">-{{ promo.discountPercent }}%</span>
            </td>
            <td>
              <div style="display:flex;gap:4px;flex-wrap:wrap">
                <span class="a-badge a-badge-cyan" *ngIf="hasPlatform(promo, 'dpay')" style="font-size:10px">BLIK</span>
                <span class="a-badge" *ngIf="hasPlatform(promo, 'lemonsqueezy')" style="font-size:10px;background:rgba(234,179,8,.15);color:#facc15;border:1px solid rgba(234,179,8,.3)">Lemon</span>
              </div>
            </td>
            <td>
              <div class="sm">
                <strong [class.ta]="isExhausted(promo)">{{ promo.usedCount }}</strong>
                <span class="t3"> / {{ promo.maxUses > 0 ? promo.maxUses : '∞' }}</span>
              </div>
              <div class="xs t3" *ngIf="promo.usedCount > 0" style="margin-top:2px">
                BLIK: {{ promo.usedCountDpay || 0 }} • Lemon: {{ promo.usedCountLemon || 0 }}
              </div>
            </td>
            <td class="xs t2">
              <span *ngIf="promo.expiresAt">{{ p.formatDate(promo.expiresAt) }}</span>
              <span *ngIf="!promo.expiresAt" class="t3">Bezterminowo</span>
            </td>
            <td>
              <span class="a-badge" [class]="statusBadgeClass(promo)">
                {{ statusLabel(promo) }}
              </span>
            </td>
            <td class="xs t3" style="max-width:180px">
              <div class="trunc">{{ promo.description || '—' }}</div>
            </td>
            <td>
              <div style="display:flex;gap:6px">
                <button
                  class="a-btn a-btn-sm"
                  [class.a-btn-ghost]="promo.active"
                  [class.a-btn-secondary]="!promo.active"
                  (click)="toggleActive(promo)">
                  {{ promo.active ? 'Wyłącz' : 'Włącz' }}
                </button>
                <button
                  class="a-btn a-btn-danger a-btn-sm"
                  (click)="deletePromo(promo)">
                  🗑️
                </button>
              </div>
            </td>
          </tr>
          <tr *ngIf="!promos().length">
            <td colspan="8" class="a-table-empty">Brak kodów rabatowych. Utwórz pierwszy powyżej!</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

</div>
  `
})
export class AdminPromosComponent implements OnInit {
  @Input() p!: AdminComponent;

  loading   = signal(false);
  creating  = signal(false);
  promos    = signal<PromoItem[]>([]);

  // Form fields
  newCode              = '';
  newPercent           = 10;
  newMaxUses           = 0;
  newExpiresDate       = '';
  newDescription       = '';
  platformBlik         = true;
  platformLemon        = true;
  newFirstPurchaseOnly = false;

  ngOnInit() {
    this.load();
  }

  async load() {
    this.loading.set(true);
    const res = await this.p.api('/api/admin/promos');
    if (res && res.promos) {
      this.promos.set(res.promos);
    }
    this.loading.set(false);
  }

  generateCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'PROMO';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.newCode = code;
  }

  hasPlatform(promo: PromoItem, platform: string): boolean {
    return Array.isArray(promo.platforms) && promo.platforms.includes(platform);
  }

  isExhausted(promo: PromoItem): boolean {
    return promo.maxUses > 0 && promo.usedCount >= promo.maxUses;
  }

  isExpired(promo: PromoItem): boolean {
    return !!promo.expiresAt && new Date(promo.expiresAt).getTime() < Date.now();
  }

  statusLabel(promo: PromoItem): string {
    if (!promo.active) return 'Wyłączony';
    if (this.isExpired(promo)) return 'Wygasł';
    if (this.isExhausted(promo)) return 'Limit wyczerpany';
    return 'Aktywny';
  }

  statusBadgeClass(promo: PromoItem): string {
    if (!promo.active) return 'a-badge-danger';
    if (this.isExpired(promo)) return '';
    if (this.isExhausted(promo)) return 'a-badge-warning';
    return 'a-badge-success';
  }

  activeCount(): number {
    return this.promos().filter(p => p.active && !this.isExpired(p) && !this.isExhausted(p)).length;
  }

  totalRedemptions(): number {
    return this.promos().reduce((acc, p) => acc + (p.usedCount || 0), 0);
  }

  totalBlikRedemptions(): number {
    return this.promos().reduce((acc, p) => acc + (p.usedCountDpay || 0), 0);
  }

  totalLemonRedemptions(): number {
    return this.promos().reduce((acc, p) => acc + (p.usedCountLemon || 0), 0);
  }

  copyCode(code: string) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        this.p.toast(`Skopiowano kod: ${code}`, 'success');
      });
    }
  }

  async createPromo() {
    if (!this.platformBlik && !this.platformLemon) {
      this.p.toast('Wybierz przynajmniej jedną platformę!', 'error');
      return;
    }

    const platforms = [];
    if (this.platformBlik) platforms.push('dpay');
    if (this.platformLemon) platforms.push('lemonsqueezy');

    this.creating.set(true);
    const body = {
      code: this.newCode.trim().toUpperCase(),
      discountPercent: this.newPercent,
      maxUses: this.newMaxUses,
      expiresAt: this.newExpiresDate ? new Date(this.newExpiresDate).toISOString() : null,
      description: this.newDescription,
      platforms,
      firstPurchaseOnly: this.newFirstPurchaseOnly,
      autoGenerate: !this.newCode.trim()
    };

    const res = await this.p.api('/api/admin/promos', {
      method: 'POST',
      body: JSON.stringify(body)
    });

    if (res && res.success) {
      this.p.toast(`Utworzono kod: ${res.promo.code}`, 'success');
      this.newCode = '';
      this.newDescription = '';
      this.newExpiresDate = '';
      this.newMaxUses = 0;
      await this.load();
    } else {
      this.p.toast(res?.error || 'Błąd podczas tworzenia kodu', 'error');
    }
    this.creating.set(false);
  }

  async toggleActive(promo: PromoItem) {
    const res = await this.p.api(`/api/admin/promos/${promo._id}/toggle`, { method: 'PATCH' });
    if (res && res.success) {
      this.p.toast(promo.active ? `Wyłączono kod ${promo.code}` : `Włączono kod ${promo.code}`, 'info');
      await this.load();
    } else {
      this.p.toast(res?.error || 'Błąd aktualizacji', 'error');
    }
  }

  async deletePromo(promo: PromoItem) {
    if (!confirm(`Czy na pewno chcesz usunąć kod ${promo.code}?`)) return;
    const res = await this.p.api(`/api/admin/promos/${promo._id}`, { method: 'DELETE' });
    if (res && res.success) {
      this.p.toast(`Usunięto kod ${promo.code}`, 'success');
      await this.load();
    } else {
      this.p.toast(res?.error || 'Błąd podczas usuwania', 'error');
    }
  }
}
