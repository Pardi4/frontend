import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './admin.component';

@Component({
  selector: 'app-admin-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="a-card anim-in" style="overflow:hidden">

  <!-- Filters -->
  <div class="a-filters">
    <div class="a-search-wrap" style="flex:1;min-width:180px">
      <span class="a-search-ico">🔍</span>
      <input class="a-input" [(ngModel)]="search" (ngModelChange)="applyFilter()" placeholder="Szukaj nadawcy, tematu...">
    </div>
    <select class="a-select" [(ngModel)]="statusFilter" (ngModelChange)="load()" style="max-width:130px">
      <option value="">Wszystkie</option>
      <option value="open">Otwarte</option>
      <option value="closed">Zamknięte</option>
    </select>
    <button class="a-btn a-btn-ghost a-btn-sm" (click)="load()" [disabled]="loading()">🔄</button>
    <span class="t3 sm">Łącznie: {{ filtered().length }}</span>
  </div>

  <!-- Inbox split layout -->
  <div class="a-inbox">

    <!-- Message list -->
    <div class="a-inbox-list">
      <div *ngIf="loading() && !filtered().length" style="padding:24px;text-align:center;color:var(--text-3)">Ładowanie...</div>
      <div *ngIf="!loading() && !filtered().length" style="padding:24px;text-align:center;color:var(--text-3)">Brak wiadomości.</div>
      <div
        *ngFor="let msg of filtered()"
        class="a-inbox-msg"
        [class.sel]="selected()?.id === msg.id"
        [class.unread]="!msg.isRead"
        (click)="selectMsg(msg)">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
          <div class="a-inbox-from">{{ msg.fromName || msg.fromEmail }}</div>
          <span class="xs t3" style="flex-shrink:0">{{ p.formatDate(msg.receivedAt) }}</span>
        </div>
        <div class="a-inbox-subject">{{ msg.subject || '(Brak tematu)' }}</div>
        <div class="a-inbox-prev">{{ msg.text | slice:0:80 }}</div>
        <div style="margin-top:5px;display:flex;gap:5px">
          <span class="a-badge a-badge-warning" *ngIf="!msg.isRead" style="font-size:10px">Nowe</span>
          <span class="a-badge" [class]="statusClass(msg.status)" style="font-size:10px">{{ msg.status }}</span>
        </div>
      </div>
    </div>

    <!-- Detail view -->
    <div class="a-inbox-detail">
      <div class="a-inbox-none" *ngIf="!selected()">
        <div>
          <div style="font-size:32px;margin-bottom:8px">📬</div>
          <div>Wybierz wiadomość, żeby ją przeczytać</div>
        </div>
      </div>

      <ng-container *ngIf="selected() as msg">
        <!-- Message header -->
        <div style="padding:16px 20px;border-bottom:1px solid var(--border)">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
            <div>
              <div class="bold" style="font-size:15px">{{ msg.subject || '(Brak tematu)' }}</div>
              <div class="xs t3 mt-3">
                Od: <strong class="t2">{{ msg.fromName || msg.fromEmail }}</strong>
                &lt;{{ msg.fromEmail }}&gt;
              </div>
              <div class="xs t3">{{ p.formatDate(msg.receivedAt, true) }}</div>
            </div>
            <div style="display:flex;gap:6px;flex-shrink:0;flex-wrap:wrap">
              <button class="a-btn a-btn-secondary a-btn-sm" (click)="copyEmail(msg)">📋 Kopiuj email</button>
              <button class="a-btn a-btn-secondary a-btn-sm" *ngIf="msg.status !== 'closed'" (click)="closeMsg(msg)">✓ Zamknij</button>
              <button class="a-btn a-btn-danger a-btn-sm" (click)="deleteMsg(msg)">🗑</button>
            </div>
          </div>
        </div>

        <!-- Linked account -->
        <div style="padding:12px 20px;border-bottom:1px solid var(--border);background:var(--surface-2)" *ngIf="msg.linkedUser">
          <div class="xs t3 mb-3">Powiązane konto</div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
            <div>
              <span class="bold sm">{{ msg.linkedUser.displayName || msg.linkedUser.email }}</span>
              <span class="xs t3"> · {{ msg.linkedUser.email }}</span>
              <div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap">
                <span class="a-badge" [class]="msg.linkedUser.isBanned ? 'a-badge-danger' : 'a-badge-success'">
                  {{ msg.linkedUser.isBanned ? 'Zbanowany' : 'Aktywny' }}
                </span>
                <span class="a-badge a-badge-cyan">{{ msg.linkedUser.credits }} kredytów</span>
                <span class="a-badge a-badge-muted">{{ msg.linkedUser.stats?.totalQuestionsSolved || 0 }} pytań</span>
              </div>
            </div>
            <button class="a-btn a-btn-success a-btn-sm" (click)="grantFromSupport(msg.linkedUser)">
              ➕ Kredyty
            </button>
          </div>
        </div>

        <!-- Message body -->
        <div style="padding:16px 20px;flex:1;overflow-y:auto;max-height:260px">
          <div class="sm" style="white-space:pre-wrap;line-height:1.7;color:var(--text-2)">{{ msg.text || '(Brak treści)' }}</div>
        </div>

        <!-- Replies -->
        <div *ngIf="msg.replies?.length" style="border-top:1px solid var(--border)">
          <div style="padding:10px 20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-3)">
            Odpowiedzi ({{ msg.replies.length }})
          </div>
          <div *ngFor="let r of msg.replies" style="padding:10px 20px;border-top:1px solid var(--border);background:var(--surface-2)">
            <div style="display:flex;justify-content:space-between;margin-bottom:5px">
              <span class="bold xs">{{ r.admin }}</span>
              <span class="xs t3">{{ p.formatDate(r.sentAt) }}</span>
            </div>
            <div class="sm t2" style="white-space:pre-wrap">{{ r.text }}</div>
          </div>
        </div>

        <!-- Reply form -->
        <div style="padding:14px 20px;border-top:1px solid var(--border)">
          <div class="a-label mb-3">Odpowiedz</div>
          <textarea class="a-input" [(ngModel)]="replyText" rows="3" placeholder="Napisz odpowiedź..." style="resize:vertical;margin-bottom:10px"></textarea>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer">
              <input type="checkbox" [(ngModel)]="generateDiscount">
              <span>Generuj kod -10% (LemonSqueezy)</span>
            </label>
            <div style="flex:1"></div>
            <button class="a-btn a-btn-ghost a-btn-sm" (click)="replyText='';generateDiscount=false">Wyczyść</button>
            <button class="a-btn a-btn-primary a-btn-sm" (click)="sendReply(msg)" [disabled]="!replyText.trim() || replyLoading()">
              {{ replyLoading() ? 'Wysyłanie...' : '📨 Wyślij' }}
            </button>
          </div>
        </div>
      </ng-container>
    </div>
  </div>
</div>

<!-- Grant credits from support modal -->
<div class="a-backdrop" *ngIf="grantTarget()" (click)="grantTarget.set(null)">
  <div class="a-modal" (click)="$event.stopPropagation()">
    <div class="a-modal-header">
      <div class="a-modal-title">➕ Kredyty dla {{ grantTarget()?.email }}</div>
      <button class="a-modal-x" (click)="grantTarget.set(null)">✕</button>
    </div>
    <div class="a-modal-body">
      <div class="a-input-row mb-3">
        <input class="a-input" type="number" [(ngModel)]="grantAmount" min="1" placeholder="Ilość kredytów">
      </div>
      <input class="a-input" [(ngModel)]="grantReason" placeholder="Powód (np. korekta supportu)">
    </div>
    <div class="a-modal-footer">
      <button class="a-btn a-btn-ghost" (click)="grantTarget.set(null)">Anuluj</button>
      <button class="a-btn a-btn-primary" (click)="submitGrant()" [disabled]="!grantAmount || grantLoading()">
        {{ grantLoading() ? 'Dodawanie...' : 'Dodaj' }}
      </button>
    </div>
  </div>
</div>
  `
})
export class AdminSupportComponent implements OnInit {
  @Input() p!: AdminComponent;

  loading      = signal(false);
  replyLoading = signal(false);
  grantLoading = signal(false);

  messages     = signal<any[]>([]);
  selected     = signal<any>(null);
  grantTarget  = signal<any>(null);

  search        = '';
  statusFilter  = '';
  replyText     = '';
  generateDiscount = false;
  grantAmount   = 0;
  grantReason   = 'Korekta supportu';

  ngOnInit() { this.load(); }

  async load() {
    this.loading.set(true);
    const status = this.statusFilter ? `&status=${this.statusFilter}` : '';
    const q = this.search ? `&q=${encodeURIComponent(this.search)}` : '';
    const res = await this.p.api(`/api/admin/support/messages?${status}${q}`);
    if (res.messages) {
      this.messages.set(res.messages);
      const unread = res.messages.filter((m: any) => !m.isRead).length;
      this.p.supportCount.set(unread);
    }
    this.loading.set(false);
  }

  applyFilter() { /* reactive via filtered() */ }

  filtered() {
    const s = this.search.toLowerCase();
    if (!s) return this.messages();
    return this.messages().filter(m =>
      (m.fromEmail || '').toLowerCase().includes(s) ||
      (m.fromName || '').toLowerCase().includes(s) ||
      (m.subject || '').toLowerCase().includes(s) ||
      (m.text || '').toLowerCase().includes(s)
    );
  }

  selectMsg(msg: any) {
    this.selected.set(msg);
    this.replyText = '';
    this.generateDiscount = false;
    if (!msg.isRead) this.markRead(msg);
  }

  async markRead(msg: any) {
    await this.p.api(`/api/admin/support/messages/${msg.id}`, {
      method: 'PATCH', body: JSON.stringify({ isRead: true })
    });
    msg.isRead = true;
    this.p.supportCount.update(n => Math.max(0, n - 1));
  }

  async closeMsg(msg: any) {
    const res = await this.p.api(`/api/admin/support/messages/${msg.id}`, {
      method: 'PATCH', body: JSON.stringify({ status: 'closed' })
    });
    if (res.success) { msg.status = 'closed'; this.p.toast('Zamknięto', 'success'); }
  }

  async deleteMsg(msg: any) {
    if (!confirm(`Usunąć wiadomość od ${msg.fromEmail}?`)) return;
    const res = await this.p.api(`/api/admin/support/messages/${msg.id}`, { method: 'DELETE' });
    if (res.success) {
      this.messages.update(list => list.filter(m => m.id !== msg.id));
      this.selected.set(null);
      this.p.toast('Usunięto wiadomość', 'success');
    }
  }

  async sendReply(msg: any) {
    if (!this.replyText.trim()) return;
    this.replyLoading.set(true);
    const res = await this.p.api(`/api/admin/support/messages/${msg.id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ text: this.replyText, generateDiscount: this.generateDiscount })
    });
    if (res.success) {
      this.p.toast('Odpowiedź wysłana', 'success');
      this.replyText = '';
      this.generateDiscount = false;
      await this.load();
      const updated = this.messages().find(m => m.id === msg.id);
      if (updated) this.selected.set(updated);
    } else {
      this.p.toast(res.error || 'Błąd wysyłania', 'error');
    }
    this.replyLoading.set(false);
  }

  copyEmail(msg: any) {
    navigator.clipboard.writeText(msg.fromEmail).then(() => this.p.toast('Email skopiowany', 'success'));
  }

  grantFromSupport(user: any) {
    this.grantTarget.set(user);
    this.grantAmount = 0;
    this.grantReason = 'Korekta supportu';
  }

  async submitGrant() {
    if (!this.grantAmount) return;
    this.grantLoading.set(true);
    const u = this.grantTarget();
    const res = await this.p.api(`/api/admin/users/${u.id}/grant-credits`, {
      method: 'POST', body: JSON.stringify({ credits: this.grantAmount, reason: this.grantReason })
    });
    if (res.success) {
      this.p.toast(`+${this.grantAmount} kredytów → ${u.email}`, 'success');
      this.grantTarget.set(null);
    } else {
      this.p.toast(res.error || 'Błąd', 'error');
    }
    this.grantLoading.set(false);
  }

  statusClass(status: string) {
    return { open: 'a-badge-warning', closed: 'a-badge-muted', pending: 'a-badge-accent' }[status] || 'a-badge-muted';
  }
}
