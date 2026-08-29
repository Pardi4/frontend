import { Component, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-admin-marketing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-marketing glass" style="padding: 2rem; border-radius: 12px; max-width: 900px;">
      <h2 style="margin-bottom: 0.5rem;">Marketing Campaign</h2>
      <p class="text-secondary" style="margin-bottom: 2rem;">Zarządzaj mailingiem promocyjnym i wysyłaj wiadomości do użytkowników.</p>
      
      <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; display: flex; gap: 2rem;">
        <div>
          <h3 style="margin-bottom: 0.5rem;">Statystyki</h3>
          <p>Użytkownicy zapisani na marketing: <strong style="font-size: 1.2rem; color: var(--accent-cyan);">{{ totalOptIn() }}</strong></p>
          <button class="btn btn-outline" style="margin-top: 1rem;" (click)="loadStats()">Odśwież Statystyki</button>
        </div>
        
        <div style="flex: 1;">
          <h4 style="margin-bottom: 0.5rem; font-size: 0.9rem;">Zapisani Użytkownicy</h4>
          <div style="max-height: 120px; overflow-y: auto; background: rgba(0,0,0,0.3); padding: 0.5rem; border-radius: 8px; font-size: 0.85rem; color: #a1a1aa; border: 1px solid var(--border);">
            <div *ngIf="usersLoading()" style="padding: 0.5rem;">Ładowanie...</div>
            <div *ngIf="!usersLoading() && users().length === 0" style="padding: 0.5rem;">Brak użytkowników.</div>
            <div *ngFor="let u of users()" style="padding: 0.2rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);">{{ u }}</div>
          </div>
        </div>
      </div>

      <form (ngSubmit)="sendCampaign()" style="display: flex; flex-direction: column; gap: 1.5rem;">
        
        <div style="display:flex; gap:1rem; flex-wrap: wrap;">
          <label style="flex:1; min-width: 250px; display: flex; flex-direction: column; gap: 0.5rem;">
            <span>Temat Maila</span>
            <input type="text" class="input" [(ngModel)]="subject" name="subject" required placeholder="Flash Sale! -50%!" style="padding: 0.75rem; background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: 8px; color: white;" />
          </label>
          <label style="display: flex; flex-direction: column; gap: 0.5rem; min-width: 150px;">
            <span>Losowa pula (zostaw puste by wysłać do wszystkich)</span>
            <input type="number" class="input" [(ngModel)]="targetCount" name="targetCount" placeholder="np. 100" style="padding: 0.75rem; background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: 8px; color: white;" />
          </label>
          <label style="display: flex; align-items: center; gap: 0.5rem; min-width: 200px; color: #ef4444; background: rgba(239, 68, 68, 0.1); padding: 0.75rem; border-radius: 8px; cursor: pointer;">
            <input type="checkbox" [(ngModel)]="ignoreConsent" name="ignoreConsent" style="width: 18px; height: 18px;" />
            <span>Ignoruj zgody (Wyślij WSZYSTKIM)</span>
          </label>
          <label style="flex:1; min-width: 250px; display: flex; flex-direction: column; gap: 0.5rem; position: relative;">
            <span>Wyślij do jednej osoby (wpisz Email)</span>
            <input type="email" class="input" [(ngModel)]="targetEmail" name="targetEmail" placeholder="user@example.com (nadpisuje resztę opcji)" autocomplete="off" (focus)="showEmailSuggestions = true" (blur)="hideSuggestions()" style="padding: 0.75rem; background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: 8px; color: white;" />
            <div *ngIf="showEmailSuggestions && filteredEmails.length > 0" style="position: absolute; top: 100%; left: 0; right: 0; background: #1e293b; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; margin-top: 0.25rem; z-index: 50; max-height: 200px; overflow-y: auto; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
              <div *ngFor="let u of filteredEmails" (mousedown)="selectEmail(u)" style="padding: 0.75rem 1rem; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.05); color: #cbd5e1; font-size: 0.9rem;" onmouseover="this.style.background='rgba(6,182,212,0.1)'; this.style.color='white'" onmouseout="this.style.background='transparent'; this.style.color='#cbd5e1'">
                {{ u }}
              </div>
            </div>
          </label>
        </div>
        
        <!-- Discount Section -->
        <div style="background: rgba(6, 182, 212, 0.05); border: 1px solid rgba(6, 182, 212, 0.2); padding: 1.5rem; border-radius: 8px;">
          <h4 style="color: var(--accent-cyan); margin-bottom: 1rem;">Kody Rabatowe (LemonSqueezy)</h4>
          
          <label style="display:flex; gap:0.5rem; align-items:center; margin-bottom: 1rem;">
            <span style="min-width: 150px;">Tryb Kodów:</span>
            <select class="input" [(ngModel)]="discountType" name="discountType" style="padding: 0.5rem; background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: 8px; color: white; flex:1;">
              <option value="none">Brak (Zwykły mail)</option>
              <option value="global">Opcja 1: Jeden globalny kod dla wszystkich</option>
              <option value="unique">Opcja 2: Unikalny, 1-razowy kod dla KAŻDEGO z osobna</option>
            </select>
          </label>

          <div *ngIf="discountType !== 'none'" style="display:flex; gap:1rem; flex-wrap: wrap;">
            <label style="display: flex; flex-direction: column; gap: 0.5rem;">
              <span>Prefix (lub dokładny kod)</span>
              <input type="text" class="input" [(ngModel)]="discountPrefix" name="discountPrefix" placeholder="PROMO" style="padding: 0.5rem; background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: 8px; color: white; width: 150px;" />
            </label>
            <label *ngIf="discountType === 'global'" style="display: flex; flex-direction: column; gap: 0.5rem; justify-content: flex-end; padding-bottom: 0.5rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                <input type="checkbox" [(ngModel)]="discountExactCode" name="discountExactCode" style="width: 16px; height: 16px;" />
                <span style="font-size: 0.85rem; color: #cbd5e1;">Dokładny kod (bez losowych znaków)</span>
              </div>
            </label>
            <label style="display: flex; flex-direction: column; gap: 0.5rem;">
              <span>Zniżka %</span>
              <input type="number" class="input" [(ngModel)]="discountPercent" name="discountPercent" style="padding: 0.5rem; background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: 8px; color: white; width: 120px;" />
            </label>
            <label style="display: flex; flex-direction: column; gap: 0.5rem;">
              <span>Wygasa za (Dni)</span>
              <input type="number" class="input" [(ngModel)]="discountExpiresDays" name="discountExpiresDays" style="padding: 0.5rem; background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: 8px; color: white; width: 150px;" />
            </label>
            <label *ngIf="discountType === 'global'" style="display: flex; flex-direction: column; gap: 0.5rem;">
              <span>Limit Użyć (0 = bez limitu)</span>
              <input type="number" class="input" [(ngModel)]="discountMaxUses" name="discountMaxUses" style="padding: 0.5rem; background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: 8px; color: white; width: 150px;" />
            </label>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-end;">
            <span>Treść Maila (HTML)</span>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: flex-end;">
              <button type="button" class="btn btn-outline" style="padding: 0.25rem 0.75rem; font-size: 0.8rem;" (click)="insertTag('{{DISCOUNT_CODE}}')">Wstaw Kod Zniżkowy</button>
              <button type="button" class="btn btn-outline" style="padding: 0.25rem 0.75rem; font-size: 0.8rem;" (click)="insertTag('{{DISCOUNT_PERCENT}}')">Wstaw % Zniżki</button>
              <button type="button" class="btn btn-outline" style="padding: 0.25rem 0.75rem; font-size: 0.8rem;" (click)="insertTag('{{DISCOUNT_EXPIRES}}')">Wstaw Dni Ważności</button>
              <button type="button" class="btn btn-outline" style="padding: 0.25rem 0.75rem; font-size: 0.8rem;" (click)="insertTag('{{EMAIL}}')">Wstaw Email</button>
              <button type="button" class="btn btn-primary" style="padding: 0.25rem 0.75rem; font-size: 0.8rem;" (click)="loadBackToSchoolTemplate()">Szablon: Back to School</button>
            </div>
          </div>
          <textarea #htmlEditor class="input" [(ngModel)]="html" name="html" required rows="10" placeholder="<h1>Cześć!</h1><p>Twój kod to: {{'{{'}}DISCOUNT_CODE{{'}}'}}</p>" style="padding: 0.75rem; background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: 8px; color: white; resize: vertical;"></textarea>
          <small class="text-secondary">Stopka oraz link do wypisania się z newslettera zostaną dodane automatycznie na samym dole.</small>
        </div>
        
        <div *ngIf="error()" class="form-error" style="color: #ef4444;">{{ error() }}</div>
        <div *ngIf="success()" class="form-success" style="color: #22c55e;">{{ success() }}</div>

        <button class="btn btn-primary" type="submit" [disabled]="loading()" style="align-self: flex-start; padding: 0.75rem 2rem;">
          {{ loading() ? 'Wysyłanie...' : 'Wyślij Kampanię' }}
        </button>
      </form>
    </div>
  `
})
export class AdminMarketingComponent {
  @ViewChild('htmlEditor') htmlEditor!: ElementRef<HTMLTextAreaElement>;

  totalOptIn = signal<number>(0);
  users = signal<string[]>([]);
  usersLoading = signal(false);
  
  subject = '';
  html = '';
  targetCount: number | null = null;
      targetEmail = '';
  showEmailSuggestions = false;

  get filteredEmails() {
    if (!this.targetEmail) return [];
    const search = this.targetEmail.toLowerCase();
    return this.allEmails().filter(e => e.toLowerCase().includes(search)).slice(0, 8);
  }

  selectEmail(email: string) {
    this.targetEmail = email;
    this.showEmailSuggestions = false;
  }

  hideSuggestions() {
    setTimeout(() => this.showEmailSuggestions = false, 150);
  }
  
  // Discount Fields
  discountType: 'none' | 'global' | 'unique' = 'none';
  discountPrefix = 'PROMO';
  discountPercent = 10;
  discountExpiresDays = 7;
  discountMaxUses = 100;
  ignoreConsent = false;
  discountExactCode = false;

  loading = signal(false);
  error = signal('');
  success = signal('');

  constructor(private api: ApiService) {}

  allEmails = signal<string[]>([]);

  ngOnInit() {
    this.loadStats();
    this.loadUsers();
    this.loadAllEmails();
  }

  async loadAllEmails() {
    const res = await this.api.request('/api/admin/marketing/all-emails');
    if (res.success) {
      this.allEmails.set(res.emails);
    }
  }

  async loadStats() {
    const res = await this.api.request('/api/admin/marketing/stats');
    if (res.success) {
      this.totalOptIn.set(res.totalOptIn);
    }
  }

  async loadUsers() {
    this.usersLoading.set(true);
    const res = await this.api.request('/api/admin/marketing/users');
    if (res.success) {
      this.users.set(res.users);
    }
    this.usersLoading.set(false);
  }

  loadBackToSchoolTemplate() {
    this.subject = 'Crush this semester! 🎒 50% OFF QuizSolver';
    this.discountType = 'global';
    this.discountPrefix = 'SCHOOL';
    this.discountExactCode = true;
    this.discountPercent = 50;
    this.discountExpiresDays = 7;
    this.html = `
<div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 20px; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); color: #f8fafc; border: 1px solid rgba(255, 255, 255, 0.1);">
  <div style="text-align: center; margin-bottom: 30px;">
    <div style="display: inline-block; background: rgba(6, 182, 212, 0.2); padding: 10px 20px; border-radius: 50px; border: 1px solid rgba(6, 182, 212, 0.4); margin-bottom: 20px;">
      <span style="color: #22d3ee; font-weight: 700; letter-spacing: 1px; font-size: 13px; text-transform: uppercase;">BACK TO SCHOOL SALE 🎒</span>
    </div>
    <h1 style="color: #ffffff; font-size: 32px; font-weight: 800; margin: 0; line-height: 1.2;">Crush this semester<br>with <span style="color: #22d3ee;">QuizSolver</span>.</h1>
  </div>
  
  <div style="background: rgba(255, 255, 255, 0.05); padding: 30px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05);">
    <p style="font-size: 16px; line-height: 1.6; margin-top: 0; color: #cbd5e1;">Hey {{EMAIL}},</p>
    <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1;">Starting a new school year can be tough. We want to give you an unfair advantage. Grab your credits for half the price and never get stuck on a question again.</p>
    
    <div style="background: linear-gradient(to right, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.1)); border: 1px dashed #22d3ee; border-radius: 8px; padding: 25px; text-align: center; margin: 30px 0;">
      <p style="margin: 0 0 10px 0; font-size: 14px; color: #94a3b8; text-transform: uppercase; font-weight: 600;">Use promo code at checkout</p>
      <div style="display: inline-block; background: #0ea5e9; color: white; font-size: 28px; font-weight: 900; padding: 12px 30px; border-radius: 8px; letter-spacing: 3px; box-shadow: 0 10px 15px -3px rgba(14, 165, 233, 0.4);">
        {{DISCOUNT_CODE}}
      </div>
      <p style="margin: 15px 0 0 0; font-size: 18px; color: #f8fafc;">for <strong style="color: #22d3ee;">{{DISCOUNT_PERCENT}}% OFF</strong></p>
    </div>
    
    <p style="font-size: 14px; color: #64748b; text-align: center; margin-bottom: 0;"><em>Hurry up, this code expires in {{DISCOUNT_EXPIRES}} days!</em></p>
  </div>
  
  <div style="text-align: center; margin-top: 30px;">
    <a href="https://quizsolver.com/dashboard" style="display: inline-block; background: #0ea5e9; color: white; text-decoration: none; font-weight: 600; padding: 14px 32px; border-radius: 8px; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(14, 165, 233, 0.3);">Go to Dashboard</a>
  </div>
</div>`;
  }

  insertTag(tag: string) {
    if (!this.htmlEditor) {
      this.html += tag;
      return;
    }
    
    const textarea = this.htmlEditor.nativeElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    this.html = this.html.substring(0, start) + tag + this.html.substring(end);
    
    // Move cursor after the inserted tag
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + tag.length;
      textarea.selectionEnd = start + tag.length;
    }, 0);
  }

  async sendCampaign() {
    if (!confirm('Na pewno chcesz rozpocząć tę wysyłkę?')) return;
    this.loading.set(true);
    this.error.set('');
    this.success.set('');
    
    const body: any = { 
      subject: this.subject, 
      html: this.html,
      discountType: this.discountType,
      discountPrefix: this.discountPrefix,
      discountPercent: this.discountPercent,
      discountExactCode: this.discountExactCode,
      discountExpiresDays: this.discountExpiresDays,
      discountMaxUses: this.discountMaxUses
    };
    
    if (this.targetCount) body.targetCount = this.targetCount;
    if (this.targetEmail) body.targetEmail = this.targetEmail;
    if (this.ignoreConsent) body.ignoreConsent = this.ignoreConsent;
    
    const res = await this.api.request('/api/admin/marketing/send', {
      method: 'POST',
      body: JSON.stringify(body)
    });
    
    if (res.success) {
      this.success.set(`Sukces! Wysłano \${res.count} wiadomości.`);
      this.subject = '';
      this.html = '';
      this.targetCount = null;
      this.targetEmail = '';
    } else {
      this.error.set(res.error || 'Błąd podczas wysyłania');
    }
    this.loading.set(false);
  }
}

