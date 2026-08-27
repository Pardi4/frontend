import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'qs-qr-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="qr-login-page">
      <div class="qr-login-card glass">
        
        <div *ngIf="state === 'loading'" class="qr-state">
          <div class="qr-spinner"></div>
          <p>Verifying QR session...</p>
        </div>

        
        <div *ngIf="state === 'confirm'" class="qr-state">
          <div class="qr-icon">🔐</div>
          <h1>Quick Login</h1>
          <p class="qr-desc">Do you want to log in to <strong>QuizSolver Extension</strong> on another device?</p>
          <p class="qr-warn">⚠️ WARNING: Only confirm if YOU just scanned this code from the extension. Never confirm codes sent by others.</p>
          <button class="qr-btn qr-btn-primary" (click)="confirm()" [disabled]="confirming">
            {{ confirming ? 'Confirming...' : 'Confirm Login' }}
          </button>
          <button class="qr-btn qr-btn-secondary" (click)="cancel()">Cancel</button>
        </div>

        
        <div *ngIf="state === 'needLogin'" class="qr-state">
          <div class="qr-icon">👤</div>
          <h1>Login Required</h1>
          <p class="qr-desc">You need to be logged in to confirm this QR login.</p>
          <button class="qr-btn qr-btn-primary" (click)="goToLogin()">Log in first</button>
        </div>

        
        <div *ngIf="state === 'success'" class="qr-state">
          <div class="qr-icon qr-icon-success">✅</div>
          <h1>Login Confirmed!</h1>
          <p class="qr-desc">The extension is now logging in as <strong>{{ confirmedName }}</strong>.</p>
          <p class="qr-hint">You can close this page.</p>
        </div>

        
        <div *ngIf="state === 'error'" class="qr-state">
          <div class="qr-icon">❌</div>
          <h1>Something went wrong</h1>
          <p class="qr-desc">{{ errorMessage }}</p>
          <button class="qr-btn qr-btn-secondary" (click)="cancel()">Go back</button>
        </div>

        
        <div *ngIf="state === 'expired'" class="qr-state">
          <div class="qr-icon">⏰</div>
          <h1>QR Code Expired</h1>
          <p class="qr-desc">This QR code has expired. Please generate a new one in the extension.</p>
          <button class="qr-btn qr-btn-secondary" (click)="cancel()">Go to homepage</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .qr-login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      background: var(--bg-primary, #030712);
    }
    .qr-login-card {
      max-width: 420px;
      width: 100%;
      padding: 2.5rem;
      border-radius: 20px;
      text-align: center;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
    }
    .qr-state { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
    .qr-icon { font-size: 3rem; margin-bottom: 0.5rem; }
    .qr-icon-success { animation: pop 0.4s ease; }
    @keyframes pop { 0% { transform: scale(0.5); } 60% { transform: scale(1.2); } 100% { transform: scale(1); } }
    h1 { font-size: 1.5rem; font-weight: 700; color: #f1f5f9; margin: 0; }
    .qr-desc { color: #94a3b8; font-size: 0.95rem; line-height: 1.5; margin: 0; }
    .qr-desc strong { color: #e2e8f0; }
    .qr-warn { color: #fbbf24; font-size: 0.85rem; background: rgba(251,191,36,0.08); padding: 0.6rem 1rem; border-radius: 8px; border: 1px solid rgba(251,191,36,0.15); }
    .qr-hint { color: #64748b; font-size: 0.85rem; }
    .qr-btn {
      width: 100%;
      padding: 0.85rem;
      border-radius: 12px;
      border: none;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .qr-btn-primary {
      background: linear-gradient(135deg, #06b6d4, #8b5cf6);
      color: white;
    }
    .qr-btn-primary:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
    .qr-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .qr-btn-secondary {
      background: rgba(255,255,255,0.06);
      color: #94a3b8;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .qr-btn-secondary:hover { background: rgba(255,255,255,0.1); color: #e2e8f0; }
    .qr-spinner {
      width: 40px; height: 40px;
      border: 3px solid rgba(255,255,255,0.1);
      border-top-color: #06b6d4;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class QrLoginComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  state: 'loading' | 'confirm' | 'needLogin' | 'success' | 'error' | 'expired' = 'loading';
  confirming = false;
  errorMessage = '';
  confirmedName = '';

  private sessionId = '';
  private secret = '';
  private apiBase = '';

  ngOnInit() {
    this.apiBase = (typeof window !== 'undefined' && (window as any).__QS_API_BASE) || '/api';
    this.sessionId = this.route.snapshot.paramMap.get('sessionId') || '';
    this.secret = this.route.snapshot.queryParamMap.get('s') || '';

    if (!this.sessionId || !this.secret) {
      this.state = 'expired';
      this.cdr.detectChanges();
      return;
    }

    let token = null;
    try { token = typeof localStorage !== 'undefined' ? localStorage.getItem('qs_token') : null; } catch(e) {}
    
    if (!token) {
      this.state = 'needLogin';
      this.cdr.detectChanges();
      return;
    }

    this.checkSession(token);
  }

  async checkSession(token: string) {
    try {
      const res = await fetch(`${this.apiBase}/auth/qr/status/${this.sessionId}`);
      const data = await res.json();
      if (data.status === 'expired') {
        this.state = 'expired';
      } else if (data.status === 'confirmed') {
        this.state = 'expired';
      } else {
        this.state = 'confirm';
      }
    } catch {
      this.state = 'confirm';
    }
    this.cdr.detectChanges();
  }

  async confirm() {
    this.confirming = true;
    this.cdr.detectChanges();
    try {
      let token = '';
      try { token = localStorage.getItem('qs_token') || ''; } catch(e) {}
      const res = await fetch(`${this.apiBase}/auth/qr/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sessionId: this.sessionId, secret: this.secret })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        this.confirmedName = data.displayName || 'your account';
        this.state = 'success';
      } else if (res.status === 401) {
        this.state = 'needLogin';
      } else if (res.status === 410) {
        this.state = 'expired';
      } else {
        this.errorMessage = data.error || 'Confirmation failed.';
        this.state = 'error';
      }
    } catch (e: any) {
      this.errorMessage = 'Network error. Please try again.';
      this.state = 'error';
    }
    this.confirming = false;
    this.cdr.detectChanges();
  }

  goToLogin() {
    const returnUrl = `/qr-login/${this.sessionId}?s=${this.secret}`;
    this.router.navigate(['/'], { fragment: `auth=login&redirect=${encodeURIComponent(returnUrl)}` });
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
