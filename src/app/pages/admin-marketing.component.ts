import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './admin.component';

@Component({
  selector: 'app-admin-marketing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="a-section anim-in">

  <!-- Stats + opt-in list -->
  <div class="a-grid-2">
    <div class="a-card">
      <div class="a-card-header">
        <div class="a-card-title">📣 Statystyki marketingu</div>
        <button class="a-btn a-btn-ghost a-btn-sm" (click)="loadStats()">🔄</button>
      </div>
      <div class="a-card-body">
        <div class="a-stats-grid">
          <div class="a-stat">
            <div class="a-stat-label">Zapisani na marketing</div>
            <div class="a-stat-value accent">{{ totalOptIn() }}</div>
          </div>
        </div>
        <div style="margin-top:14px">
          <div class="a-label">Lista emaili (opt-in)</div>
          <div style="max-height:160px;overflow-y:auto;background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:8px;margin-top:6px;font-size:12px;color:var(--text-2)">
            <div *ngIf="usersLoading()">Ładowanie...</div>
            <div *ngIf="!usersLoading() && !optInUsers().length">Brak zapisanych użytkowników.</div>
            <div *ngFor="let u of optInUsers()" style="padding:2px 4px;border-bottom:1px solid var(--border)">{{ u }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="a-card">
      <div class="a-card-header">
        <div class="a-card-title">⚙️ Ustawienia kampanii</div>
      </div>
      <div class="a-card-body a-section" style="gap:12px">
        <div class="a-input-group">
          <label class="a-label">Temat maila</label>
          <input class="a-input" [(ngModel)]="subject" placeholder="Flash Sale! -50% OFF">
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <div class="a-input-group" style="flex:1;min-width:140px">
            <label class="a-label">Wyślij do jednej osoby</label>
            <input class="a-input" type="email" [(ngModel)]="targetEmail" placeholder="user@example.com">
          </div>
          <div class="a-input-group" style="min-width:120px">
            <label class="a-label">Losowa pula</label>
            <input class="a-input" type="number" [(ngModel)]="targetCount" placeholder="np. 100">
          </div>
        </div>
        <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;background:var(--danger-bg);padding:8px 12px;border-radius:var(--radius-sm);border:1px solid rgba(239,68,68,.3)">
          <input type="checkbox" [(ngModel)]="ignoreConsent">
          <span class="td bold">Ignoruj zgody — wyślij WSZYSTKIM</span>
        </label>
      </div>
    </div>
  </div>

  <!-- Discount codes -->
  <div class="a-card">
    <div class="a-card-header">
      <div class="a-card-title">🎟️ Kody rabatowe (LemonSqueezy)</div>
    </div>
    <div class="a-card-body">
      <div class="a-input-group mb-4" style="max-width:320px">
        <label class="a-label">Tryb kodów</label>
        <select class="a-select" [(ngModel)]="discountType">
          <option value="none">Brak — zwykły mail</option>
          <option value="global">Jeden globalny kod dla wszystkich</option>
          <option value="unique">Unikalny 1-razowy kod dla każdego</option>
        </select>
      </div>
      <div *ngIf="discountType !== 'none'" style="display:flex;gap:12px;flex-wrap:wrap">
        <div class="a-input-group" style="min-width:140px">
          <label class="a-label">Prefix / dokładny kod</label>
          <input class="a-input" [(ngModel)]="discountPrefix" placeholder="PROMO">
        </div>
        <div *ngIf="discountType === 'global'" class="a-input-group">
          <label class="a-label">&nbsp;</label>
          <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;margin-top:6px">
            <input type="checkbox" [(ngModel)]="discountExactCode">
            <span>Dokładny kod (bez losowych znaków)</span>
          </label>
        </div>
        <div class="a-input-group" style="min-width:100px">
          <label class="a-label">Zniżka %</label>
          <input class="a-input" type="number" [(ngModel)]="discountPercent" min="1" max="100">
        </div>
        <div class="a-input-group" style="min-width:120px">
          <label class="a-label">Wygasa za (dni)</label>
          <input class="a-input" type="number" [(ngModel)]="discountExpiresDays" min="1">
        </div>
        <div *ngIf="discountType === 'global'" class="a-input-group" style="min-width:140px">
          <label class="a-label">Limit użyć (0=∞)</label>
          <input class="a-input" type="number" [(ngModel)]="discountMaxUses" min="0">
        </div>
      </div>
    </div>
  </div>

  <!-- HTML editor -->
  <div class="a-card">
    <div class="a-card-header">
      <div class="a-card-title">✏️ Treść maila (HTML)</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="a-btn a-btn-secondary a-btn-sm" (click)="insertTag('{{DISCOUNT_CODE}}')">Kod zniżkowy</button>
        <button class="a-btn a-btn-secondary a-btn-sm" (click)="insertTag('{{DISCOUNT_PERCENT}}')">% zniżki</button>
        <button class="a-btn a-btn-secondary a-btn-sm" (click)="insertTag('{{EMAIL}}')">Email</button>
        <button class="a-btn a-btn-primary a-btn-sm" (click)="loadTemplate()">📋 Szablon Back2School</button>
      </div>
    </div>
    <div class="a-card-body">
      <textarea
        #htmlEditor
        class="a-input"
        [(ngModel)]="html"
        rows="10"
        style="resize:vertical;font-family:var(--font-mono);font-size:12px"
        placeholder="<h1>Cześć {{ '{' }}{{ '{' }}EMAIL{{ '}' }}{{ '}' }}!</h1><p>Twój kod: {{ '{' }}{{ '{' }}DISCOUNT_CODE{{ '}' }}{{ '}' }}</p>">
      </textarea>
      <div class="xs t3 mt-3">Stopka i link wypisania zostaną dodane automatycznie.</div>
    </div>

    <div class="a-card-footer">
      <div *ngIf="error()" style="flex:1;color:var(--danger);font-size:13px">{{ error() }}</div>
      <div *ngIf="successMsg()" style="flex:1;color:var(--success);font-size:13px">{{ successMsg() }}</div>
      <div style="flex:1" *ngIf="!error() && !successMsg()"></div>
      <button class="a-btn a-btn-primary a-btn-lg" (click)="send()" [disabled]="loading() || !subject || !html">
        {{ loading() ? 'Wysyłanie...' : '📨 Wyślij kampanię' }}
      </button>
    </div>
  </div>
</div>
  `
})
export class AdminMarketingComponent implements OnInit {
  @Input() p!: AdminComponent;
  @ViewChild('htmlEditor') htmlEditor!: ElementRef<HTMLTextAreaElement>;

  loading      = signal(false);
  usersLoading = signal(false);
  totalOptIn   = signal(0);
  optInUsers   = signal<string[]>([]);
  error        = signal('');
  successMsg   = signal('');

  subject      = '';
  html         = '';
  targetEmail  = '';
  targetCount: number | null = null;
  ignoreConsent = false;

  discountType: 'none' | 'global' | 'unique' = 'none';
  discountPrefix      = 'PROMO';
  discountPercent     = 10;
  discountExpiresDays = 7;
  discountMaxUses     = 100;
  discountExactCode   = false;

  ngOnInit() { this.loadStats(); this.loadUsers(); }

  async loadStats() {
    const res = await this.p.api('/api/admin/marketing/stats');
    if (res.success) this.totalOptIn.set(res.totalOptIn);
  }

  async loadUsers() {
    this.usersLoading.set(true);
    const res = await this.p.api('/api/admin/marketing/users');
    if (res.success) this.optInUsers.set(res.users || []);
    this.usersLoading.set(false);
  }

  insertTag(tag: string) {
    const ta = this.htmlEditor?.nativeElement;
    if (!ta) { this.html += tag; return; }
    const s = ta.selectionStart, e = ta.selectionEnd;
    this.html = this.html.slice(0, s) + tag + this.html.slice(e);
    setTimeout(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = s + tag.length; }, 0);
  }

  loadTemplate() {
    this.subject = 'Tomorrow it starts again... 🎒 Get 50% OFF QuizSolver';
    this.discountType     = 'global';
    this.discountPrefix   = 'BACK2SCHOOL';
    this.discountExactCode = true;
    this.discountPercent  = 50;
    this.discountExpiresDays = 7;
    this.html = `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:linear-gradient(135deg,#0f172a,#1e293b);padding:40px 20px;border-radius:16px;color:#f8fafc;border:1px solid rgba(255,255,255,.1)">
  <div style="text-align:center;margin-bottom:30px">
    <h1 style="color:#fff;font-size:32px;font-weight:800;margin:0">Tomorrow is<br><span style="color:#22d3ee">September 1st.</span></h1>
  </div>
  <p style="font-size:16px;color:#cbd5e1">Hey {{EMAIL}},</p>
  <p style="font-size:16px;color:#cbd5e1">Summer is over. This semester, you're coming prepared.</p>
  <div style="background:rgba(6,182,212,.1);border:1px dashed #22d3ee;border-radius:8px;padding:25px;text-align:center;margin:30px 0">
    <p style="margin:0 0 10px;font-size:14px;color:#94a3b8;text-transform:uppercase;font-weight:600">Your promo code</p>
    <div style="display:inline-block;background:#0ea5e9;color:white;font-size:28px;font-weight:900;padding:12px 30px;border-radius:8px;letter-spacing:3px">{{DISCOUNT_CODE}}</div>
    <p style="margin:15px 0 0;font-size:18px;color:#f8fafc">for <strong style="color:#22d3ee">{{DISCOUNT_PERCENT}}% OFF</strong></p>
  </div>
  <p style="font-size:14px;color:#64748b;text-align:center"><em>Hurry up, this code expires in {{DISCOUNT_EXPIRES}} days!</em></p>
  <div style="text-align:center;margin-top:30px">
    <a href="https://getquizsolver.com/#pricing" style="display:inline-block;background:#0ea5e9;color:white;text-decoration:none;font-weight:600;padding:14px 32px;border-radius:8px;font-size:16px">Get My Credits Now</a>
  </div>
</div>`;
  }

  async send() {
    if (!confirm('Na pewno wysłać tę kampanię?')) return;
    this.loading.set(true);
    this.error.set('');
    this.successMsg.set('');

    const body: any = {
      subject: this.subject, html: this.html,
      discountType: this.discountType, discountPrefix: this.discountPrefix,
      discountPercent: this.discountPercent, discountExactCode: this.discountExactCode,
      discountExpiresDays: this.discountExpiresDays, discountMaxUses: this.discountMaxUses
    };
    if (this.targetCount)  body.targetCount  = this.targetCount;
    if (this.targetEmail)  body.targetEmail  = this.targetEmail;
    if (this.ignoreConsent) body.ignoreConsent = true;

    const res = await this.p.api('/api/admin/marketing/send', { method: 'POST', body: JSON.stringify(body) });
    if (res.success || res.count) {
      this.successMsg.set(`✅ Wysłano ${res.count} wiadomości!`);
      this.subject = ''; this.html = ''; this.targetEmail = ''; this.targetCount = null;
      this.p.toast(`Kampania wysłana (${res.count} maili)`, 'success');
    } else {
      this.error.set(res.error || 'Błąd podczas wysyłania.');
      this.p.toast(res.error || 'Błąd wysyłania', 'error');
    }
    this.loading.set(false);
  }
}
