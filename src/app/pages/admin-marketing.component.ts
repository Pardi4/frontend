import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-admin-marketing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-marketing glass" style="padding: 2rem; border-radius: 12px;">
      <h2 style="margin-bottom: 0.5rem;">Marketing Campaign</h2>
      <p class="text-secondary" style="margin-bottom: 2rem;">Send emails to users who opted in to marketing.</p>
      
      <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="margin-bottom: 0.5rem;">Stats</h3>
        <p>Total opted-in users: <strong style="font-size: 1.2rem; color: var(--accent-cyan);">{{ totalOptIn() }}</strong></p>
        <button class="btn btn-outline" style="margin-top: 1rem;" (click)="loadStats()">Refresh Stats</button>
      </div>

      <form (ngSubmit)="sendCampaign()" style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 600px;">
        <label style="display: flex; flex-direction: column; gap: 0.5rem;">
          <span>Subject</span>
          <input type="text" class="input" [(ngModel)]="subject" name="subject" required placeholder="Flash Sale! 50% off!" style="padding: 0.75rem; background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: 8px; color: white;" />
        </label>
        
        <label style="display: flex; flex-direction: column; gap: 0.5rem;">
          <span>HTML Content (Body)</span>
          <textarea class="input" [(ngModel)]="html" name="html" required rows="6" placeholder="<h1>Hello!</h1>..." style="padding: 0.75rem; background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: 8px; color: white; resize: vertical;"></textarea>
          <small class="text-secondary">Do not include standard footer or unsubscribe link, it is added automatically.</small>
        </label>
        
        <label style="display: flex; flex-direction: column; gap: 0.5rem;">
          <span>Target Count (Leave empty to send to ALL)</span>
          <input type="number" class="input" [(ngModel)]="targetCount" name="targetCount" placeholder="e.g. 100 for a random subset" style="padding: 0.75rem; background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: 8px; color: white; width: 300px;" />
          <small class="text-secondary">Useful for A/B testing or limited discounts.</small>
        </label>
        
        <div *ngIf="error()" class="form-error" style="color: #ef4444;">{{ error() }}</div>
        <div *ngIf="success()" class="form-success" style="color: #22c55e;">{{ success() }}</div>

        <button class="btn btn-primary" type="submit" [disabled]="loading()" style="align-self: flex-start; padding: 0.75rem 2rem;">
          {{ loading() ? 'Sending...' : 'Send Campaign' }}
        </button>
      </form>
    </div>
  `
})
export class AdminMarketingComponent {
  totalOptIn = signal<number>(0);
  
  subject = '';
  html = '';
  targetCount: number | null = null;
  
  loading = signal(false);
  error = signal('');
  success = signal('');

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadStats();
  }

  async loadStats() {
    const res = await this.api.request('/api/admin/marketing/stats');
    if (res.success) {
      this.totalOptIn.set(res.totalOptIn);
    }
  }

  async sendCampaign() {
    if (!confirm('Are you sure you want to send this email campaign?')) return;
    this.loading.set(true);
    this.error.set('');
    this.success.set('');
    
    const body: any = { subject: this.subject, html: this.html };
    if (this.targetCount) body.targetCount = this.targetCount;
    
    const res = await this.api.request('/api/admin/marketing/send', {
      method: 'POST',
      body: JSON.stringify(body)
    });
    
    if (res.success) {
      this.success.set(`Successfully sent ${res.count} emails!`);
      this.subject = '';
      this.html = '';
      this.targetCount = null;
    } else {
      this.error.set(res.error || 'Failed to send campaign');
    }
    this.loading.set(false);
  }
}
