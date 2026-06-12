import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ADMIN_PANEL_URL } from '../admin-path';

type AdminTab = 'users' | 'purchases' | 'bugs' | 'support' | 'cache' | 'leaderboard' | 'system';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="admin-page">
      <section class="admin-login" *ngIf="!isAuthed(); else adminPanel">
        <div class="admin-login-card glass anim-glow">
          <a class="admin-brand" href="/" aria-label="QuizSolver home">
            <span>QS</span>
            <strong>QuizSolver Admin</strong>
          </a>
          <h1>Admin console</h1>
          <p class="text-secondary" style="margin-top: 0.5rem; margin-bottom: 2rem;">
            Operational control for credits, users, cache and platform health.
          </p>
          <button class="btn btn-outline btn-block google-auth-btn" type="button" (click)="startGoogleLogin()">
            <span>G</span>
            Continue with Google
          </button>
          <div class="auth-divider"><span>or</span></div>
          <form (ngSubmit)="login()">
            <label class="form-label">
              <span>Email</span>
              <input class="form-input" type="email" name="email" [(ngModel)]="email" autocomplete="email">
            </label>
            <label class="form-label" style="margin-top: 1.25rem; display: block;">
              <span>Password</span>
              <input class="form-input" type="password" name="password" [(ngModel)]="password" autocomplete="current-password">
            </label>
            <div class="form-error" *ngIf="error()" style="margin-top: 1.25rem;">{{ error() }}</div>
            <button class="btn btn-primary btn-block" type="submit" [disabled]="loading()" style="margin-top: 2rem;">
              {{ loading() ? 'Signing in...' : 'Sign in' }}
            </button>
          </form>
        </div>
      </section>

      <ng-template #adminPanel>
        <section class="admin-shell">
          <aside class="admin-sidebar">
            <div>
              <a class="admin-brand" href="/">
                <span>QS</span>
                <strong>Admin</strong>
              </a>
              <nav class="admin-tabs" aria-label="Admin sections">
                <button type="button" *ngFor="let tab of tabs" [class.active]="activeTab() === tab.id" (click)="activeTab.set(tab.id)">
                  <span>{{ tab.short }}</span>
                  {{ tab.label }}
                </button>
              </nav>
            </div>
            <div class="admin-sidebar-foot">
              <button class="btn btn-outline btn-block" type="button" (click)="refresh()">Refresh</button>
              <button class="btn btn-ghost btn-block" type="button" (click)="logout()">Logout</button>
            </div>
          </aside>

          <section class="admin-main">
            <header class="admin-header">
              <div>
                <p class="eyebrow">Live operations</p>
                <h1>QuizSolver control room</h1>
                <p class="text-secondary" style="margin-top: 0.25rem;">Keep user access, credits, cache and system health visible in one place.</p>
              </div>
              <div class="admin-header-actions">
                <a class="btn btn-outline" href="/dashboard">Dashboard</a>
                <a class="btn btn-primary" href="/">Public site</a>
              </div>
            </header>

            <div class="admin-alert anim-slide-up" *ngIf="error()">{{ error() }}</div>

            <section class="admin-stats">
              <article class="glass" *ngFor="let card of statsCards()">
                <span>{{ card.label }}</span>
                <strong [class.revenue]="card.revenue">{{ card.value }}</strong>
              </article>
            </section>

            <section class="admin-panel glass" *ngIf="activeTab() === 'users'">
              <div class="panel-head">
                <div>
                  <p class="eyebrow">Users</p>
                  <h2>Accounts and credits</h2>
                </div>
                <form class="admin-search" (ngSubmit)="loadUsers(1)">
                  <input class="form-input" type="search" name="search" [(ngModel)]="userSearch" placeholder="Search email or name">
                  <button class="btn btn-primary" type="submit">Search</button>
                </form>
              </div>

              <div class="table-scroll">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Credits</th>
                      <th>Questions</th>
                      <th>Streak</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let user of users()">
                      <td>
                        <strong>{{ user.email }}</strong>
                        <span style="font-size: 0.8rem; margin-top: 0.15rem;">{{ user.displayName || 'No display name' }}</span>
                      </td>
                      <td style="text-transform: capitalize;">{{ user.role }}</td>
                      <td>{{ user.role === 'admin' ? 'unlimited' : user.credits }}</td>
                      <td>{{ user.stats?.totalQuestionsSolved || 0 }}</td>
                      <td>{{ user.streak?.current || 0 }}</td>
                      <td>
                        <span class="status-pill" [class.danger]="user.isBanned">
                          {{ user.isBanned ? 'Banned' : 'Active' }}
                        </span>
                      </td>
                      <td>
                        <div class="row-actions">
                          <button type="button" (click)="quickGrant(user.id, 50)">+50</button>
                          <button type="button" (click)="quickGrant(user.id, 100)">+100</button>
                          <button type="button" (click)="quickGrant(user.id, 200)">+200</button>
                          <button type="button" (click)="user.isBanned ? unbanUser(user.id) : banUser(user.id)">
                            {{ user.isBanned ? 'Unban' : 'Ban' }}
                          </button>
                          <button type="button" (click)="toggleLeaderboard(user.id, !user.excludeFromLeaderboard)">
                            {{ user.excludeFromLeaderboard ? 'Show LB' : 'Hide LB' }}
                          </button>
                          <button type="button" class="danger" *ngIf="user.role !== 'admin'" (click)="deleteUser(user.id, user.email)">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr *ngIf="!users().length">
                      <td colspan="7" class="empty-cell" style="text-align: center; padding: 3rem;">No users found.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="pagination" *ngIf="pagination().pages > 1">
                <button type="button" *ngFor="let page of pageNumbers()" [class.active]="page === pagination().page" (click)="loadUsers(page)">
                  {{ page }}
                </button>
              </div>
            </section>

            <section class="admin-panel glass" *ngIf="activeTab() === 'purchases'">
              <div class="panel-head">
                <div>
                  <p class="eyebrow">Revenue</p>
                  <h2>Purchases and grants</h2>
                </div>
              </div>
              <div class="table-scroll">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Pack</th>
                      <th>Credits</th>
                      <th>Price</th>
                      <th>Provider</th>
                      <th>Reason</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let purchase of purchases()">
                      <td><strong>{{ purchase.user || 'Unknown' }}</strong></td>
                      <td>{{ purchase.pack }}</td>
                      <td>{{ purchase.credits }}</td>
                      <td><span style="font-weight: 600; color: var(--accent-cyan);">{{ purchase.priceUsd ? formatMoney(purchase.priceUsd) : '-' }}</span></td>
                      <td style="text-transform: uppercase; font-size: 0.85rem;">{{ purchase.provider }}</td>
                      <td>{{ purchase.reason || '-' }}</td>
                      <td>{{ formatDate(purchase.date) }}</td>
                    </tr>
                    <tr *ngIf="!purchases().length">
                      <td colspan="7" class="empty-cell" style="text-align: center; padding: 3rem;">No purchases yet.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="admin-panel glass" *ngIf="activeTab() === 'bugs'">
              <div class="panel-head">
                <div>
                  <p class="eyebrow">Reports</p>
                  <h2>Bug reports</h2>
                </div>
              </div>
              <div class="bug-list">
                <article class="glass" *ngFor="let bug of bugs()">
                  <div class="bug-meta">
                    <strong>{{ bug.user || 'Unknown user' }}</strong>
                    <span class="text-secondary" style="font-size: 0.8rem;">{{ formatDate(bug.date) }}</span>
                  </div>
                  <a [href]="bug.url" target="_blank" rel="noopener" style="word-break: break-all;">{{ bug.url }}</a>
                  <p class="text-secondary" *ngIf="bug.description" style="margin-top: 0.75rem; color: var(--text-primary);">
                    {{ bug.description }}
                  </p>
                </article>
                <div class="empty-panel" style="text-align: center; padding: 2rem;" *ngIf="!bugs().length">
                  <p class="text-secondary">No bug reports.</p>
                </div>
              </div>
            </section>

            <section class="admin-panel glass" *ngIf="activeTab() === 'support'">
              <div class="panel-head">
                <div>
                  <p class="eyebrow">Inbox</p>
                  <h2>Support mail</h2>
                </div>
                <form class="admin-search" (ngSubmit)="loadSupportMessages()">
                  <select class="form-select" name="supportStatusFilter" [(ngModel)]="supportStatusFilter">
                    <option value="">All messages</option>
                    <option value="open">Open</option>
                    <option value="pending">Pending</option>
                    <option value="closed">Closed</option>
                  </select>
                  <button class="btn btn-primary" type="submit">Filter</button>
                </form>
              </div>

              <div class="support-layout">
                <div class="support-list">
                  <button class="support-item" type="button" *ngFor="let message of supportMessages()" [class.active]="selectedSupportMessage()?.id === message.id" [class.unread]="!message.isRead" (click)="selectSupportMessage(message)">
                    <span class="status-pill" [class.danger]="message.status === 'open'">{{ message.status }}</span>
                    <strong>{{ message.subject || '(No subject)' }}</strong>
                    <span>{{ message.fromName || message.fromEmail }}</span>
                    <small>{{ formatDate(message.receivedAt) }}</small>
                  </button>
                  <div class="empty-panel" *ngIf="!supportMessages().length">
                    <p class="text-secondary">No support messages.</p>
                  </div>
                </div>

                <article class="support-detail" *ngIf="selectedSupportMessage(); else supportEmpty">
                  <header>
                    <div>
                      <p class="eyebrow">{{ selectedSupportMessage()?.source || 'support' }}</p>
                      <h3>{{ selectedSupportMessage()?.subject || '(No subject)' }}</h3>
                      <p class="text-secondary">
                        {{ selectedSupportMessage()?.fromName || 'Sender' }} &lt;{{ selectedSupportMessage()?.fromEmail }}&gt;
                      </p>
                    </div>
                    <div class="row-actions">
                      <button type="button" (click)="updateSupportStatus(selectedSupportMessage(), 'open')">Open</button>
                      <button type="button" (click)="updateSupportStatus(selectedSupportMessage(), 'pending')">Pending</button>
                      <button type="button" (click)="updateSupportStatus(selectedSupportMessage(), 'closed')">Close</button>
                    </div>
                  </header>

                  <pre class="support-body">{{ selectedSupportMessage()?.text || 'No message body.' }}</pre>

                  <div class="support-replies" *ngIf="(selectedSupportMessage()?.replies || []).length">
                    <h4>Replies</h4>
                    <article *ngFor="let reply of selectedSupportMessage()?.replies">
                      <strong>{{ reply.admin }}</strong>
                      <small>{{ formatDate(reply.sentAt) }} | {{ reply.delivery }}</small>
                      <p>{{ reply.text }}</p>
                    </article>
                  </div>

                  <form class="support-reply-form" (ngSubmit)="replySupportMessage()">
                    <label class="form-label">
                      <span>Reply</span>
                      <textarea name="supportReplyText" [(ngModel)]="supportReplyText" rows="7" placeholder="Write a helpful answer..."></textarea>
                    </label>
                    <button class="btn btn-primary" type="submit" [disabled]="!supportReplyText.trim()">Send reply</button>
                  </form>
                </article>

                <ng-template #supportEmpty>
                  <div class="support-detail support-empty">
                    <p class="text-secondary">Select a message to read and reply.</p>
                  </div>
                </ng-template>
              </div>
            </section>

            <section class="admin-panel glass" *ngIf="activeTab() === 'cache'">
              <div class="panel-head">
                <div>
                  <p class="eyebrow">AI cache</p>
                  <h2>Cached answers</h2>
                </div>
                <button class="btn btn-outline" type="button" (click)="clearCache()">Clear cache</button>
              </div>
              <div class="cache-summary">
                <strong>{{ cache().totalCached || 0 }}</strong>
                <span class="text-secondary">Total cached answers</span>
              </div>
              <div class="cache-list">
                <article class="glass" *ngFor="let hit of cache().topHits || []">
                  <p style="font-weight: 500;">{{ hit.questionText }}</p>
                  <span class="badge badge-outline" style="text-transform: capitalize;">
                    {{ hit.questionType }} | {{ hit.hitCount }} hits
                  </span>
                </article>
                <div class="empty-panel" style="text-align: center; padding: 2rem;" *ngIf="!(cache().topHits || []).length">
                  <p class="text-secondary">No cache hits yet.</p>
                </div>
              </div>
            </section>

            <section class="admin-panel glass" *ngIf="activeTab() === 'leaderboard'">
              <div class="panel-head">
                <div>
                  <p class="eyebrow">Community</p>
                  <h2>Leaderboard</h2>
                </div>
              </div>
              <div class="leaderboard-admin">
                <article class="glass" *ngFor="let entry of leaderboard()" style="margin-bottom: 0.5rem; border-radius: var(--radius-md);">
                  <strong style="color: var(--accent-cyan);">#{{ entry.rank }}</strong>
                  <span style="font-weight: 600;">{{ entry.name }}</span>
                  <span class="text-secondary">{{ entry.questionsSolved }} questions</span>
                  <span class="badge badge-outline">Streak: {{ entry.streak }}</span>
                </article>
                <div class="empty-panel" style="text-align: center; padding: 2rem;" *ngIf="!leaderboard().length">
                  <p class="text-secondary">No leaderboard data.</p>
                </div>
              </div>
            </section>

            <section class="admin-panel glass" *ngIf="activeTab() === 'system'">
              <div class="panel-head">
                <div>
                  <p class="eyebrow">System</p>
                  <h2>Health check</h2>
                </div>
              </div>
              <div class="health-grid">
                <article class="glass" *ngFor="let item of healthCards()">
                  <span class="text-secondary" style="font-size: 0.75rem; text-transform: uppercase;">{{ item.label }}</span>
                  <strong [class.ok]="item.ok" style="font-size: 1.35rem; margin-top: 0.25rem;">{{ item.value }}</strong>
                </article>
              </div>
            </section>
          </section>
        </section>
      </ng-template>
    </main>
  `,
  styles: [`
    .admin-page {
      min-height: 100vh;
      color: var(--text-primary);
      display: flex;
      flex-direction: column;
    }

    /* Login section */
    .admin-login {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 1.5rem;
    }
    .admin-login-card {
      width: 100%;
      max-width: 440px;
      padding: 3rem 2.5rem;
      text-align: center;
    }
    .admin-brand {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      font-family: var(--font-heading);
      margin-bottom: 2rem;
    }
    .admin-brand span {
      width: 2.35rem;
      height: 2.35rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #101318 url('/logo-512.png?v=20260531') center / cover no-repeat;
      color: transparent;
      font-size: 0;
      font-weight: 800;
      padding: 0;
      border-radius: var(--radius-sm);
      box-shadow: 0 10px 24px rgba(14, 165, 233, 0.22);
    }
    .admin-brand strong {
      font-size: 1.25rem;
      color: var(--text-primary);
    }
    .admin-login-card h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    .admin-login-card label span {
      display: block;
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
      font-weight: 600;
      text-align: left;
    }

    /* Shell & Sidebar */
    .admin-shell {
      display: grid;
      grid-template-columns: 260px 1fr;
      min-height: 100vh;
    }
    .admin-sidebar {
      background: rgba(10, 12, 22, 0.6);
      border-right: 1px solid var(--border);
      padding: 2rem 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      backdrop-filter: blur(20px);
    }
    .admin-tabs {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin: 2.5rem 0;
    }
    .admin-tabs button {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.85rem 1rem;
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      font-size: 0.95rem;
      font-weight: 500;
      transition: all 0.2s var(--ease-out);
      width: 100%;
      text-align: left;
      border: 1px solid transparent;
    }
    .admin-tabs button span {
      background: rgba(255, 255, 255, 0.05);
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.15rem 0.4rem;
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
    }
    .admin-tabs button:hover {
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-primary);
    }
    .admin-tabs button.active {
      background: rgba(6, 182, 212, 0.08);
      color: var(--accent-cyan);
      border: 1px solid rgba(6, 182, 212, 0.2);
    }
    .admin-tabs button.active span {
      background: var(--accent-cyan);
      color: var(--bg-deep);
    }

    .admin-sidebar-foot {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    /* Main content */
    .admin-main {
      padding: 3rem;
      overflow-y: auto;
      max-height: 100vh;
    }
    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
      margin-bottom: 3rem;
    }
    .admin-header h1 {
      font-size: 2.25rem;
    }
    .admin-header-actions {
      display: flex;
      gap: 0.75rem;
    }

    /* Stats */
    .admin-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      margin-bottom: 3rem;
    }
    .admin-stats article {
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .admin-stats article span {
      font-size: 0.8rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
    }
    .admin-stats article strong {
      font-size: 2rem;
      font-weight: 800;
      font-family: var(--font-heading);
      color: var(--text-primary);
    }
    .admin-stats article strong.revenue {
      color: var(--accent-emerald);
    }

    /* Admin panels */
    .admin-panel {
      padding: 2.5rem;
      margin-bottom: 2rem;
    }
    .panel-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .panel-head h2 {
      font-size: 1.75rem;
    }
    .admin-search {
      display: flex;
      gap: 0.5rem;
      width: 100%;
      max-width: 400px;
    }

    /* Data Tables */
    .table-scroll {
      overflow-x: auto;
      margin: 1.5rem -2.5rem -2.5rem;
      border-top: 1px solid var(--border);
    }
    .admin-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.95rem;
    }
    .admin-table th {
      padding: 1.25rem 2.5rem;
      font-family: var(--font-heading);
      font-weight: 600;
      color: var(--text-secondary);
      border-bottom: 1px solid var(--border);
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .admin-table td {
      padding: 1.25rem 2.5rem;
      border-bottom: 1px solid var(--border);
      vertical-align: middle;
    }
    .admin-table tr:last-child td {
      border-bottom: none;
    }
    .admin-table td strong {
      display: block;
      color: var(--text-primary);
    }
    .admin-table td span {
      display: block;
      font-size: 0.8rem;
      color: var(--text-secondary);
    }

    /* Row Actions */
    .row-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .row-actions button {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border);
      padding: 0.35rem 0.75rem;
      border-radius: var(--radius-sm);
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-primary);
      transition: all 0.2s;
    }
    .row-actions button:hover {
      background: rgba(6, 182, 212, 0.1);
      border-color: var(--accent-cyan);
      color: var(--accent-cyan);
    }
    .row-actions button.danger {
      color: var(--accent-rose);
    }
    .row-actions button.danger:hover {
      background: rgba(244, 63, 94, 0.1);
      border-color: var(--accent-rose);
      color: var(--accent-rose);
    }

    /* Pagination */
    .pagination {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 2.5rem;
    }
    .pagination button {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border);
      width: 2.25rem;
      height: 2.25rem;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-secondary);
      transition: all 0.2s;
    }
    .pagination button:hover,
    .pagination button.active {
      background: var(--grad-primary);
      border-color: transparent;
      color: #fff;
    }

    /* Bug reports */
    .bug-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .bug-list article {
      border: 1px solid var(--border);
      padding: 1.5rem;
      border-radius: var(--radius-lg);
      background: rgba(255, 255, 255, 0.01);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .bug-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .bug-list article a {
      color: var(--accent-cyan);
      font-size: 0.85rem;
    }

    /* Support inbox */
    .support-layout {
      display: grid;
      grid-template-columns: minmax(260px, 0.85fr) minmax(0, 1.65fr);
      gap: 1.5rem;
      align-items: start;
    }
    .support-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-height: 720px;
      overflow-y: auto;
      padding-right: 0.25rem;
    }
    .support-item {
      display: grid;
      gap: 0.35rem;
      padding: 1rem;
      text-align: left;
      color: var(--text-secondary);
      background: rgba(255, 255, 255, 0.025);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      transition: border-color 0.2s, background 0.2s, transform 0.2s;
    }
    .support-item:hover,
    .support-item.active {
      border-color: rgba(6, 182, 212, 0.35);
      background: rgba(6, 182, 212, 0.07);
      transform: translateY(-1px);
    }
    .support-item.unread strong {
      color: var(--accent-cyan);
    }
    .support-item strong {
      color: var(--text-primary);
      line-height: 1.25;
    }
    .support-item small {
      color: var(--text-tertiary);
      font-size: 0.75rem;
    }
    .support-detail {
      min-height: 420px;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.025);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
    }
    .support-detail header {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: flex-start;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border);
      margin-bottom: 1rem;
    }
    .support-detail h3 {
      font-size: 1.35rem;
      line-height: 1.2;
      margin-bottom: 0.35rem;
    }
    .support-body {
      white-space: pre-wrap;
      word-break: break-word;
      margin: 0 0 1.5rem;
      padding: 1rem;
      border-radius: var(--radius-md);
      background: rgba(3, 7, 18, 0.38);
      border: 1px solid rgba(148, 163, 184, 0.12);
      color: var(--text-primary);
      font-family: var(--font-body);
      line-height: 1.6;
    }
    .support-replies {
      display: grid;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }
    .support-replies h4 {
      font-size: 1rem;
      color: var(--text-secondary);
    }
    .support-replies article {
      padding: 1rem;
      border-radius: var(--radius-md);
      background: rgba(139, 92, 246, 0.07);
      border: 1px solid rgba(139, 92, 246, 0.16);
    }
    .support-replies small {
      display: block;
      color: var(--text-tertiary);
      margin: 0.25rem 0 0.5rem;
    }
    .support-reply-form {
      display: grid;
      gap: 1rem;
    }
    .support-reply-form .btn {
      justify-self: end;
    }
    .support-empty {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    /* Cache panel */
    .cache-summary {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-bottom: 2rem;
      background: rgba(6, 182, 212, 0.04);
      border: 1px dashed var(--accent-cyan);
      padding: 1.5rem;
      border-radius: var(--radius-lg);
      text-align: center;
    }
    .cache-summary strong {
      font-size: 2.5rem;
      font-family: var(--font-heading);
      color: var(--accent-cyan);
    }
    .cache-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .cache-list article {
      padding: 1.25rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    /* Leaderboard admin */
    .leaderboard-admin {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .leaderboard-admin article {
      display: grid;
      grid-template-columns: 80px 1.5fr 1fr 1fr;
      align-items: center;
      padding: 1.25rem 1.5rem;
    }

    /* Health System */
    .health-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }
    .health-grid article {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .health-grid article span {
      font-size: 0.8rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .health-grid article strong {
      color: var(--text-primary);
    }
    .health-grid article strong.ok {
      color: var(--accent-emerald);
    }

    .admin-alert {
      padding: 1rem 1.5rem;
      background: rgba(244, 63, 94, 0.08);
      border: 1px solid rgba(244, 63, 94, 0.2);
      color: var(--accent-rose);
      border-radius: var(--radius-md);
      margin-bottom: 2rem;
    }

    @media (max-width: 1200px) {
      .admin-stats {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 992px) {
      .admin-shell {
        grid-template-columns: 1fr;
      }
      .admin-sidebar {
        border-right: none;
        border-bottom: 1px solid var(--border);
        padding: 1.5rem;
      }
      .admin-tabs {
        flex-direction: row;
        overflow-x: auto;
        margin: 1.5rem 0;
      }
      .admin-tabs button {
        width: auto;
        white-space: nowrap;
      }
      .admin-sidebar-foot {
        flex-direction: row;
      }
      .admin-main {
        padding: 1.5rem;
      }
      .health-grid {
        grid-template-columns: 1fr;
      }
      .support-layout {
        grid-template-columns: 1fr;
      }
    }
    @media (max-width: 768px) {
      .admin-login {
        padding: 1rem;
        align-items: flex-start;
      }
      .admin-login-card {
        padding: 1.5rem;
        margin-top: 1rem;
      }
      .admin-login-card h1 {
        font-size: 1.6rem;
      }
      .admin-sidebar {
        position: sticky;
        top: 0;
        z-index: 20;
        padding: 0.85rem;
        background: rgba(5, 9, 16, 0.94);
        backdrop-filter: blur(18px);
      }
      .admin-sidebar .admin-brand {
        margin-bottom: 0.75rem;
      }
      .admin-sidebar .admin-brand strong {
        font-size: 1rem;
      }
      .admin-tabs {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 0.4rem;
        margin: 0 0 0.75rem;
        overflow: visible;
      }
      .admin-tabs button {
        justify-content: center;
        gap: 0.3rem;
        min-width: 0;
        padding: 0.55rem 0.35rem;
        border-radius: 10px;
        font-size: 0.68rem;
        line-height: 1.1;
        text-align: center;
        white-space: normal;
        flex-direction: column;
      }
      .admin-tabs button span {
        font-size: 0.62rem;
        padding: 0.12rem 0.3rem;
      }
      .admin-sidebar-foot {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
      }
      .admin-main {
        max-height: none;
        overflow: visible;
        padding: 1rem;
      }
      .admin-header {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      .admin-header h1 {
        font-size: 1.55rem;
      }
      .admin-header-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
      }
      .admin-stats {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
        margin-bottom: 1rem;
      }
      .admin-stats article {
        padding: 1rem;
      }
      .admin-stats article span {
        font-size: 0.66rem;
      }
      .admin-stats article strong {
        font-size: 1.35rem;
        overflow-wrap: anywhere;
      }
      .admin-panel {
        padding: 1rem;
        margin-bottom: 1rem;
      }
      .panel-head {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      .panel-head h2 {
        font-size: 1.25rem;
      }
      .admin-search {
        max-width: 100%;
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
      }
      .table-scroll {
        margin: 1rem -1rem -1rem;
        -webkit-overflow-scrolling: touch;
      }
      .admin-table {
        min-width: 760px;
        font-size: 0.85rem;
      }
      .admin-table th,
      .admin-table td {
        padding: 0.9rem 1rem;
      }
      .row-actions button {
        padding: 0.45rem 0.65rem;
      }
      .support-layout {
        gap: 1rem;
      }
      .support-list {
        max-height: 280px;
        padding-right: 0;
      }
      .support-detail {
        min-height: auto;
        padding: 1rem;
      }
      .support-detail header,
      .bug-meta,
      .cache-list article {
        flex-direction: column;
        align-items: stretch;
      }
      .support-reply-form .btn {
        justify-self: stretch;
      }
      .leaderboard-admin article {
        grid-template-columns: 48px 1fr;
        gap: 0.5rem;
      }
      .cache-summary,
      .bug-list article,
      .cache-list article,
      .health-grid article {
        padding: 1rem;
      }
    }

    @media (max-width: 430px) {
      .admin-tabs {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
      .admin-search,
      .admin-header-actions,
      .admin-sidebar-foot {
        grid-template-columns: 1fr;
      }
      .admin-stats {
        grid-template-columns: 1fr 1fr;
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  protected readonly tabs: Array<{ id: AdminTab; label: string; short: string }> = [
    { id: 'users', label: 'Users', short: 'US' },
    { id: 'purchases', label: 'Purchases', short: 'PY' },
    { id: 'bugs', label: 'Bugs', short: 'BG' },
    { id: 'support', label: 'Support', short: 'SP' },
    { id: 'cache', label: 'Cache', short: 'CA' },
    { id: 'leaderboard', label: 'Leaderboard', short: 'LB' },
    { id: 'system', label: 'System', short: 'SY' }
  ];

  protected readonly activeTab = signal<AdminTab>('users');
  protected readonly isAuthed = signal(false);
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly stats = signal<any>({});
  protected readonly users = signal<any[]>([]);
  protected readonly purchases = signal<any[]>([]);
  protected readonly bugs = signal<any[]>([]);
  protected readonly supportMessages = signal<any[]>([]);
  protected readonly selectedSupportMessage = signal<any | null>(null);
  protected readonly cache = signal<any>({});
  protected readonly leaderboard = signal<any[]>([]);
  protected readonly health = signal<any>({});
  protected readonly pagination = signal<any>({ page: 1, pages: 1, total: 0 });

  protected email = '';
  protected password = '';
  protected userSearch = '';
  protected supportStatusFilter = '';
  protected supportReplyText = '';

  private token = '';
  private readonly isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private readonly title: Title,
    private readonly meta: Meta
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async ngOnInit(): Promise<void> {
    this.title.setTitle('Admin Console | QuizSolver');
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    if (!this.isBrowser) return;
    this.token = localStorage.getItem('qs_admin_token') || localStorage.getItem('qs_token') || '';
    if (!this.token) return;

    const me = await this.api('/api/auth/me');
    if (me.success && me.user?.role === 'admin') {
      this.isAuthed.set(true);
      await this.refresh();
      return;
    }

    this.logout();
  }

  protected async login(): Promise<void> {
    this.error.set('');
    if (!this.email || !this.password) {
      this.error.set('Email and password are required.');
      return;
    }

    this.loading.set(true);
    const result = await this.api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: this.email, password: this.password, rememberMe: true })
    }, false);
    this.loading.set(false);

    if (!result.success || !result.token) {
      this.error.set(result.error || 'Login failed.');
      return;
    }

    if (result.user?.role !== 'admin') {
      this.error.set('Admin access required.');
      return;
    }

    this.token = result.token;
    localStorage.setItem('qs_admin_token', this.token);
    localStorage.setItem('qs_token', this.token);
    this.isAuthed.set(true);
    await this.refresh();
  }

  protected logout(): void {
    if (this.token) void this.api('/api/auth/logout', { method: 'POST' });
    this.token = '';
    this.isAuthed.set(false);
    if (this.isBrowser) localStorage.removeItem('qs_admin_token');
  }

  protected startGoogleLogin(): void {
    if (!this.isBrowser) return;
    window.location.href = `/api/auth/google/start?redirect=${encodeURIComponent(ADMIN_PANEL_URL)}`;
  }

  protected async refresh(): Promise<void> {
    this.error.set('');
    await Promise.all([
      this.loadStats(),
      this.loadUsers(this.pagination().page || 1),
      this.loadPurchases(),
      this.loadBugs(),
      this.loadSupportMessages(),
      this.loadCache(),
      this.loadLeaderboard(),
      this.loadHealth()
    ]);
  }

  protected async loadUsers(page = 1): Promise<void> {
    const params = new URLSearchParams({ page: String(page), limit: '25' });
    if (this.userSearch.trim()) params.set('search', this.userSearch.trim());
    const result = await this.api(`/api/admin/users?${params.toString()}`);
    if (result.success) {
      this.users.set(result.users || []);
      this.pagination.set(result.pagination || { page, pages: 1, total: 0 });
    }
  }

  protected async quickGrant(userId: string, amount: number): Promise<void> {
    const result = await this.api(`/api/admin/users/${userId}/quick-grant`, {
      method: 'POST',
      body: JSON.stringify({ amount })
    });
    if (result.success) {
      await Promise.all([this.loadUsers(this.pagination().page), this.loadStats()]);
      return;
    }
    this.error.set(result.error || 'Could not grant credits.');
  }

  protected async banUser(userId: string): Promise<void> {
    if (!this.confirm('Ban this user?')) return;
    const result = await this.api(`/api/admin/users/${userId}/ban`, { method: 'POST' });
    if (result.success) {
      await this.loadUsers(this.pagination().page);
      return;
    }
    this.error.set(result.error || 'Could not ban user.');
  }

  protected async unbanUser(userId: string): Promise<void> {
    const result = await this.api(`/api/admin/users/${userId}/unban`, { method: 'POST' });
    if (result.success) {
      await this.loadUsers(this.pagination().page);
      return;
    }
    this.error.set(result.error || 'Could not unban user.');
  }

  protected async toggleLeaderboard(userId: string, exclude: boolean): Promise<void> {
    const result = await this.api(`/api/admin/users/${userId}/leaderboard`, {
      method: 'PATCH',
      body: JSON.stringify({ exclude })
    });
    if (result.success) {
      await Promise.all([this.loadUsers(this.pagination().page), this.loadLeaderboard()]);
      return;
    }
    this.error.set(result.error || 'Could not update leaderboard setting.');
  }

  protected async deleteUser(userId: string, email: string): Promise<void> {
    if (!this.confirm(`Delete ${email}? This cannot be undone.`)) return;
    const result = await this.api(`/api/admin/users/${userId}`, { method: 'DELETE' });
    if (result.success) {
      await Promise.all([this.loadUsers(this.pagination().page), this.loadStats()]);
      return;
    }
    this.error.set(result.error || 'Could not delete user.');
  }

  protected async clearCache(): Promise<void> {
    if (!this.confirm('Clear all cached answers?')) return;
    const result = await this.api('/api/admin/cache/clear', { method: 'DELETE' });
    if (result.success) {
      await Promise.all([this.loadCache(), this.loadStats()]);
      return;
    }
    this.error.set(result.error || 'Could not clear cache.');
  }

  protected statsCards(): Array<{ label: string; value: string; revenue?: boolean }> {
    const s = this.stats();
    return [
      { label: 'Users', value: this.formatNumber(s.totalUsers) },
      { label: 'Questions', value: this.formatNumber(s.totalQuestions) },
      { label: 'Cached answers', value: this.formatNumber(s.cachedAnswers) },
      { label: 'Revenue', value: this.formatMoney(s.totalRevenue || 0), revenue: true },
      { label: 'Month revenue', value: this.formatMoney(s.monthRevenue || 0), revenue: true },
      { label: 'Purchases today', value: this.formatNumber(s.todayPurchases) },
      { label: 'Bug reports', value: this.formatNumber(s.totalBugReports) },
      { label: 'Open support', value: this.formatNumber(s.openSupportMessages) },
      { label: 'Banned', value: this.formatNumber(s.bannedUsers) }
    ];
  }

  protected healthCards(): Array<{ label: string; value: string; ok?: boolean }> {
    const h = this.health();
    const uptime = Number(h.uptime || 0);
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    return [
      { label: 'Database', value: h.database || 'unknown', ok: h.database === 'connected' },
      { label: 'Uptime', value: `${hours}h ${minutes}m` },
      { label: 'Memory RSS', value: h.memory?.rss || '-' },
      { label: 'Heap used', value: h.memory?.heapUsed || '-' },
      { label: 'Node', value: h.nodeVersion || '-' },
      { label: 'Environment', value: h.env || '-' }
    ];
  }

  protected pageNumbers(): number[] {
    const pages = Number(this.pagination().pages || 1);
    return Array.from({ length: pages }, (_, index) => index + 1);
  }

  protected formatNumber(value: unknown): string {
    const number = Number(value || 0);
    return new Intl.NumberFormat('en-US').format(number);
  }

  protected formatMoney(value: unknown): string {
    const number = Number(value || 0);
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number);
  }

  protected formatDate(value: unknown): string {
    if (!value) return '-';
    const date = new Date(String(value));
    if (Number.isNaN(date.getTime())) return '-';
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  }

  private async loadStats(): Promise<void> {
    const result = await this.api('/api/admin/stats');
    if (result.success) this.stats.set(result.stats || {});
  }

  private async loadPurchases(): Promise<void> {
    const result = await this.api('/api/admin/purchases');
    if (result.success) this.purchases.set(result.purchases || []);
  }

  private async loadBugs(): Promise<void> {
    const result = await this.api('/api/admin/bug-reports');
    if (result.success) this.bugs.set(result.reports || []);
  }

  protected async loadSupportMessages(): Promise<void> {
    const params = new URLSearchParams();
    if (this.supportStatusFilter) params.set('status', this.supportStatusFilter);
    const result = await this.api(`/api/admin/support/messages${params.toString() ? `?${params.toString()}` : ''}`);
    if (!result.success) return;
    const messages = result.messages || [];
    this.supportMessages.set(messages);
    const selectedId = this.selectedSupportMessage()?.id;
    const nextSelected = messages.find((message: any) => message.id === selectedId) || messages[0] || null;
    this.selectedSupportMessage.set(nextSelected);
  }

  protected async selectSupportMessage(message: any): Promise<void> {
    this.selectedSupportMessage.set(message);
    this.supportReplyText = '';
    if (!message?.isRead) {
      await this.updateSupportStatus(message, message.status || 'open', true);
    }
  }

  protected async updateSupportStatus(message: any, status: 'open' | 'pending' | 'closed', markRead = false): Promise<void> {
    if (!message?.id) return;
    const result = await this.api(`/api/admin/support/messages/${message.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, isRead: markRead ? true : message.isRead })
    });
    if (!result.success) return;
    await this.loadSupportMessages();
  }

  protected async replySupportMessage(): Promise<void> {
    const message = this.selectedSupportMessage();
    const text = this.supportReplyText.trim();
    if (!message?.id || !text) return;
    const result = await this.api(`/api/admin/support/messages/${message.id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ text })
    });
    if (result.success) {
      this.supportReplyText = '';
      await Promise.all([this.loadSupportMessages(), this.loadStats()]);
      return;
    }
    this.error.set(result.error || 'Could not send support reply.');
  }

  private async loadCache(): Promise<void> {
    const result = await this.api('/api/admin/cache/stats');
    if (result.success) this.cache.set(result);
  }

  private async loadLeaderboard(): Promise<void> {
    const result = await this.api('/api/admin/leaderboard');
    if (result.success) this.leaderboard.set(result.leaderboard || []);
  }

  private async loadHealth(): Promise<void> {
    const result = await this.api('/api/admin/system/health');
    if (result.success) this.health.set(result.health || {});
  }

  private confirm(message: string): boolean {
    if (!this.isBrowser) return false;
    return window.confirm(message);
  }

  private async api(endpoint: string, options: RequestInit = {}, withToken = true): Promise<any> {
    if (!this.isBrowser) return { success: false, error: 'Browser unavailable.' };
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };
    if (withToken && this.token) headers.Authorization = `Bearer ${this.token}`;

    try {
      const response = await fetch(endpoint, { ...options, headers });
      const data = await response.json().catch(() => ({}));
      if (response.status === 401) {
        this.token = '';
        this.isAuthed.set(false);
        localStorage.removeItem('qs_admin_token');
        const message = data.error || 'Session expired.';
        this.error.set(message);
        return { success: false, error: message };
      }
      if (!response.ok) {
        const message = data.clientIp
          ? `${data.error || `HTTP ${response.status}`} Detected IP: ${data.clientIp}`
          : (data.error || `HTTP ${response.status}`);
        this.error.set(message);
        return { success: false, error: message };
      }
      return data;
    } catch {
      this.error.set('Network error.');
      return { success: false, error: 'Network error.' };
    }
  }
}
