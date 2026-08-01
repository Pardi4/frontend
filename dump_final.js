const fs = require('fs');
const path = require('path');

const adminFilePath = path.join(__dirname, 'src', 'app', 'pages', 'admin.component.ts');
let adminCode = fs.readFileSync(adminFilePath, 'utf-8');

const tStart = adminCode.indexOf('  template: `');
const sStart = adminCode.indexOf('  styles: [`');
const sEnd = adminCode.indexOf('\`]\n})');

if (tStart === -1 || sStart === -1 || sEnd === -1) {
  console.error("Could not find template or styles block boundaries!");
  
}

// --------------------------------------------------------
// NEW HTML TEMPLATE
// --------------------------------------------------------
const newTemplate = `  template: \`
    <main class="admin-page-container" [class.is-auth]="isAuthed()">
      <!-- LOGIN VIEW -->
      <section class="admin-login-wrapper" *ngIf="!isAuthed(); else adminApp">
        <div class="login-card glass-morphism anim-fade-in-up">
          <a class="brand-logo" href="/" aria-label="QuizSolver home">
            <div class="logo-box">QS</div>
            <span class="logo-text">QuizSolver Admin</span>
          </a>
          <h1 class="login-title">{{ tr('adminConsole') }}</h1>
          <p class="login-subtitle">{{ tr('loginIntro') }}</p>
          
          <button class="btn-oauth" type="button" (click)="startGoogleLogin()">
            <svg class="google-icon" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            {{ tr('continueGoogle') }}
          </button>
          
          <div class="divider"><span>{{ tr('or') }}</span></div>
          
          <form class="login-form" (ngSubmit)="login()">
            <div class="form-group">
              <label>{{ tr('email') }}</label>
              <input type="email" name="email" [(ngModel)]="email" autocomplete="email" class="glass-input">
            </div>
            <div class="form-group">
              <label>{{ tr('password') }}</label>
              <input type="password" name="password" [(ngModel)]="password" autocomplete="current-password" class="glass-input">
            </div>
            <div class="error-msg" *ngIf="error()">{{ error() }}</div>
            <button class="btn-primary-glow" type="submit" [disabled]="loading()">
              {{ loading() ? tr('signingIn') : tr('signIn') }}
            </button>
          </form>
        </div>
      </section>

      <!-- ADMIN APP VIEW -->
      <ng-template #adminApp>
        <div class="admin-shell">
          
          <!-- SIDEBAR -->
          <aside class="sidebar glass-panel">
            <div class="sidebar-top">
              <a class="brand-logo compact" href="/">
                <div class="logo-box">QS</div>
                <span class="logo-text">Admin</span>
              </a>
              
              <div class="quick-status-grid">
                <button type="button" class="status-btn" [class.alert]="supportBadgeCount()" (click)="setActiveTab('support')">
                  <span class="icon">📫</span>
                  <div class="info">
                    <span class="label">{{ tr('support') }}</span>
                    <strong class="value">{{ supportBadgeCount() || 0 }}</strong>
                  </div>
                </button>
                <button type="button" class="status-btn" [class.alert]="bugBadgeCount()" (click)="setActiveTab('bugs')">
                  <span class="icon">🐞</span>
                  <div class="info">
                    <span class="label">{{ tr('bugs') }}</span>
                    <strong class="value">{{ bugBadgeCount() || 0 }}</strong>
                  </div>
                </button>
                <button type="button" class="status-btn" [class.alert]="(parserHealth().summary?.failed || 0) > 0" (click)="setActiveTab('parser')">
                  <span class="icon">⚙️</span>
                  <div class="info">
                    <span class="label">{{ tr('parser') }}</span>
                    <strong class="value">{{ parserHealth().summary?.failed || 0 }}</strong>
                  </div>
                </button>
              </div>

              <nav class="nav-menu">
                <div class="nav-group" *ngFor="let group of tabGroups()">
                  <span class="group-title">{{ group.label }}</span>
                  <button class="nav-item" *ngFor="let tab of group.tabs" [class.active]="activeTab() === tab.id" (click)="setActiveTab(tab.id)">
                    <span class="nav-icon">{{ tab.short }}</span>
                    <span class="nav-label">{{ tabLabel(tab.id) }}</span>
                    <span class="nav-badge" *ngIf="tab.id === 'bugs' && bugBadgeCount()">{{ bugBadgeCount() }}</span>
                    <span class="nav-badge" *ngIf="tab.id === 'support' && supportBadgeCount()">{{ supportBadgeCount() }}</span>
                  </button>
                </div>
              </nav>
            </div>
            
            <div class="sidebar-bottom">
              <div class="lang-switch">
                <a [class.active]="adminLocale() === 'en'" [href]="adminLocaleUrl('en')">EN</a>
                <a [class.active]="adminLocale() === 'pl'" [href]="adminLocaleUrl('pl')">PL</a>
              </div>
              <button class="btn-ghost" type="button" (click)="refresh()">
                <span class="icon">🔄</span> {{ tr('refresh') }}
              </button>
              <button class="btn-ghost danger" type="button" (click)="logout()">
                <span class="icon">🚪</span> {{ tr('logout') }}
              </button>
            </div>
          </aside>

          <!-- MAIN CONTENT -->
          <main class="content-area">
            
            <!-- HEADER -->
            <header class="top-header glass-panel">
              <div class="header-titles">
                <span class="eyebrow">{{ tr('liveOperations') }}</span>
                <h2>{{ activeTabTitle() }}</h2>
                <p class="subtitle">{{ activeTabDescription() }}</p>
              </div>
              <div class="header-actions">
                <button class="btn-glass" type="button" (click)="refresh()" [disabled]="loading()">{{ tr('refresh') }}</button>
                <a class="btn-glass" [href]="adminLocale() === 'pl' ? '/pl/dashboard' : '/dashboard'">{{ tr('dashboard') }}</a>
                <a class="btn-primary-glow small" [href]="adminLocale() === 'pl' ? '/pl' : '/'">{{ tr('publicSite') }}</a>
              </div>
            </header>

            <!-- ALERTS -->
            <div class="global-alerts">
              <div class="alert-box error anim-fade-in-up" *ngIf="error()">{{ error() }}</div>
              <div class="alert-box success anim-fade-in-up" *ngIf="notice()">{{ notice() }}</div>
            </div>

            <!-- DASHBOARD WIDGETS -->
            <div class="dashboard-widgets">
              
              <!-- Priority Notices -->
              <section class="widget-card glass-panel priority-widget">
                <header class="widget-header">
                  <div>
                    <h3>{{ adminLocale() === 'pl' ? 'Kolejka Priorytetowa' : 'Priority Queue' }}</h3>
                    <p>{{ adminLocale() === 'pl' ? 'Zadania wymagające uwagi.' : 'Tasks needing attention.' }}</p>
                  </div>
                </header>
                <div class="widget-content">
                  <div class="notices-grid" *ngIf="adminNoticeCards().length; else noAdminNotices">
                    <button class="notice-card anim-hover-lift" *ngFor="let notice of adminNoticeCards()" [class.tone-warn]="notice.tone === 'warn'" [class.tone-ok]="notice.tone === 'ok'" (click)="openAdminNotice(notice)">
                      <div class="notice-value">{{ notice.value }}</div>
                      <div class="notice-label">{{ notice.label }}</div>
                      <div class="notice-note">{{ notice.note }}</div>
                    </button>
                  </div>
                  <ng-template #noAdminNotices>
                    <div class="empty-state">
                      <span class="empty-icon">✅</span>
                      <strong>{{ adminLocale() === 'pl' ? 'Wszystko w porządku' : 'All good' }}</strong>
                      <p>{{ adminLocale() === 'pl' ? 'Brak pilnych zadań.' : 'No urgent tasks.' }}</p>
                    </div>
                  </ng-template>
                </div>
              </section>

              <!-- Stats Grid -->
              <section class="widget-card glass-panel stats-widget">
                <header class="widget-header">
                  <div>
                    <h3>{{ adminLocale() === 'pl' ? 'Stan Platformy' : 'Platform Snapshot' }}</h3>
                    <p>{{ adminLocale() === 'pl' ? 'Główne wskaźniki.' : 'Key metrics overview.' }}</p>
                  </div>
                </header>
                <div class="widget-content">
                  <div class="stats-grid">
                    <div class="stat-card" *ngFor="let card of statsCards()">
                      <span class="stat-label">{{ card.label }}</span>
                      <strong class="stat-value" [class.text-revenue]="card.revenue">{{ card.value }}</strong>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <!-- TAB CONTENT: USERS -->
            <section class="tab-content anim-fade-in" *ngIf="activeTab() === 'users'">
              <div class="section-card glass-panel">
                <div class="section-header">
                  <div>
                    <h3>{{ tr('accountsCredits') }}</h3>
                    <span class="loading-spinner" *ngIf="usersLoading()"></span>
                  </div>
                  <form class="action-bar" (ngSubmit)="loadUsers(1)">
                    <div class="search-box">
                      <span class="search-icon">🔍</span>
                      <input type="search" name="search" [(ngModel)]="userSearch" [placeholder]="tr('searchEmailName')" class="glass-input">
                    </div>
                    <select class="glass-select" name="userSort" [(ngModel)]="userSort" (ngModelChange)="loadUsers(1)">
                      <option *ngFor="let option of userSortOptions()" [value]="option.value">{{ option.label }}</option>
                    </select>
                    <button class="btn-glass" type="submit">{{ tr('search') }}</button>
                    <button class="btn-ghost" type="button" *ngIf="hasUserFilters()" (click)="resetUserFilters()">{{ tr('clearUsersFilters') }}</button>
                    <button class="btn-primary-glow small" type="button" [disabled]="!users().length" (click)="exportVisibleUsersCsv()">CSV</button>
                  </form>
                </div>

                <div class="mini-stats-row">
                  <div class="mini-stat" *ngFor="let card of usersSummaryCards()">
                    <span class="label">{{ card.label }}</span>
                    <strong class="val" [class.text-ok]="card.ok" [class.text-warn]="card.warn">{{ card.value }}</strong>
                  </div>
                </div>

                <div class="table-container">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>{{ tr('user') }}</th>
                        <th>{{ tr('role') }}</th>
                        <th><button class="sort-btn" [class.active]="userSortDirection('credits')" (click)="cycleUserSort('credits')">{{ tr('credits') }} <span class="indicator">{{ userSortIndicator('credits') }}</span></button></th>
                        <th><button class="sort-btn" [class.active]="userSortDirection('questions')" (click)="cycleUserSort('questions')">{{ tr('questions') }} <span class="indicator">{{ userSortIndicator('questions') }}</span></button></th>
                        <th><button class="sort-btn" [class.active]="userSortDirection('streak')" (click)="cycleUserSort('streak')">{{ tr('streak') }} <span class="indicator">{{ userSortIndicator('streak') }}</span></button></th>
                        <th><button class="sort-btn" [class.active]="userSortDirection('status')" (click)="cycleUserSort('status')">{{ tr('status') }} <span class="indicator">{{ userSortIndicator('status') }}</span></button></th>
                        <th class="text-right">{{ tr('actions') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let user of users()" class="table-row anim-hover" [class.banned]="user.isBanned" [class.inactive]="!user.isBanned && !isUserExtensionActive(user)">
                        <td>
                          <div class="user-identity">
                            <button class="link-btn primary" (click)="openUserHistory(user)">{{ user.email }}</button>
                            <span class="user-name">{{ user.displayName || tr('noDisplayName') }}</span>
                          </div>
                        </td>
                        <td><span class="pill role-pill">{{ user.role }}</span></td>
                        <td><strong class="hl-text">{{ user.role === 'admin' ? tr('unlimited') : user.credits }}</strong></td>
                        <td><strong class="hl-text">{{ user.stats?.totalQuestionsSolved || 0 }}</strong></td>
                        <td><strong class="hl-text">{{ user.streak?.current || 0 }}</strong></td>
                        <td>
                          <div class="status-cell">
                            <span class="pill status-pill" [class.danger]="user.isBanned" [class.pending]="!user.isBanned && !user.isExtensionActive">{{ userStatusLabel(user) }}</span>
                            <small class="sub-text">{{ userExtensionLastSeen(user) }}</small>
                          </div>
                        </td>
                        <td class="text-right">
                          <div class="action-buttons">
                            <button class="btn-icon" (click)="openUserHistory(user)" title="History">🕒</button>
                            <button class="btn-icon" (click)="copyUserEmail(user)" title="Copy Email">📋</button>
                            <button class="btn-tiny" (click)="quickGrant(user.id, 50)">+50</button>
                            <button class="btn-tiny" (click)="quickGrant(user.id, 100)">+100</button>
                            <button class="btn-icon text-accent" (click)="openGrantModal(user)" title="Grant">🎁</button>
                            <button class="btn-icon" [class.text-danger]="!user.isBanned" [class.text-success]="user.isBanned" (click)="user.isBanned ? unbanUser(user.id) : banUser(user.id)" [title]="user.isBanned ? tr('unban') : tr('ban')">
                              {{ user.isBanned ? '✅' : '🚫' }}
                            </button>
                            <button class="btn-icon text-danger" *ngIf="user.role !== 'admin'" (click)="deleteUser(user.id, user.email)" title="Delete">🗑️</button>
                          </div>
                        </td>
                      </tr>
                      <tr *ngIf="!users().length">
                        <td colspan="7">
                          <div class="empty-state">{{ tr('noUsers') }}</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div class="pagination-bar" *ngIf="pagination().pages > 1">
                  <button class="page-btn" *ngFor="let page of pageNumbers()" [class.active]="page === pagination().page" (click)="loadUsers(page)">{{ page }}</button>
                </div>
              </div>
            </section>

            <!-- TAB CONTENT: PURCHASES -->
            <section class="tab-content anim-fade-in" *ngIf="activeTab() === 'purchases'">
              <div class="section-card glass-panel">
                <div class="section-header">
                  <h3>{{ tr('purchasesTitle') }}</h3>
                </div>
                <div class="table-container">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>{{ tr('user') }}</th>
                        <th>{{ tr('pack') }}</th>
                        <th>{{ tr('credits') }}</th>
                        <th>{{ tr('price') }}</th>
                        <th>{{ tr('provider') }}</th>
                        <th>{{ tr('applied') }}</th>
                        <th>{{ tr('reason') }}</th>
                        <th>{{ tr('date') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let purchase of purchases()" class="table-row anim-hover">
                        <td><strong>{{ purchase.user || tr('unknownUser') }}</strong></td>
                        <td><span class="pill">{{ purchase.pack }}</span></td>
                        <td><strong class="hl-text">+{{ purchase.credits }}</strong></td>
                        <td><strong class="text-success">{{ purchase.priceUsd ? formatMoney(purchase.priceUsd) : '-' }}</strong></td>
                        <td><span class="sub-text uppercase">{{ purchase.provider }}</span></td>
                        <td>
                          <div class="status-cell">
                            <span class="pill status-pill" [class.pending]="!purchase.creditsApplied">{{ purchase.creditsApplied ? tr('applied') : tr('pending') }}</span>
                            <button class="link-btn primary small" *ngIf="!purchase.creditsApplied" (click)="applyPurchaseCredits(purchase.id)">{{ tr('apply') }}</button>
                          </div>
                        </td>
                        <td>{{ purchase.reason || '-' }}</td>
                        <td><span class="sub-text">{{ formatDate(purchase.date) }}</span></td>
                      </tr>
                      <tr *ngIf="!purchases().length">
                        <td colspan="8"><div class="empty-state">{{ tr('noPurchases') }}</div></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <!-- TAB CONTENT: BUGS -->
            <section class="tab-content anim-fade-in" *ngIf="activeTab() === 'bugs'">
              <div class="section-card glass-panel">
                <div class="section-header">
                  <h3>{{ tr('bugsTitle') }}</h3>
                  <button class="btn-glass" *ngIf="bugBadgeCount()" (click)="markAllBugReportsRead()">{{ tr('markAllRead') }}</button>
                </div>
                <div class="list-grid">
                  <article class="report-card glass-card anim-hover-lift" *ngFor="let bug of bugs()" [class.unread]="!bug.isRead">
                    <div class="card-head">
                      <div class="card-title">
                        <strong>{{ bug.user || tr('unknownUser') }}</strong>
                        <span class="pill danger" *ngIf="!bug.isRead">{{ tr('unreadBugs') }}</span>
                        <span class="pill pending" *ngIf="bug.source === 'parser-auto'">{{ tr('parserAutoReport') }}</span>
                      </div>
                      <div class="card-actions">
                        <span class="sub-text">{{ formatDate(bug.date) }}</span>
                        <button class="btn-tiny" *ngIf="!bug.isRead" (click)="markBugReportRead(bug)">{{ tr('markRead') }}</button>
                      </div>
                    </div>
                    <a class="report-url primary-link" [href]="bug.url" target="_blank" rel="noopener">{{ bug.url }}</a>
                    <p class="report-desc" *ngIf="bug.description">{{ bug.description }}</p>
                    
                    <div class="chips-row" *ngIf="bug.platform || bug.parserDiagnostics?.outcome || bug.hasPageCode">
                      <span class="chip" *ngIf="bug.platform">{{ bug.platform }}</span>
                      <span class="chip" *ngIf="bug.parserDiagnostics?.outcome">{{ bug.parserDiagnostics.outcome }}</span>
                      <span class="chip success" *ngIf="bug.hasPageCode">{{ tr('parserPageCode') }}</span>
                    </div>

                    <details class="code-details" *ngIf="bug.parserSnapshot?.bodyText || bug.parserSnapshot?.htmlSnippet || bug.parserSnapshot?.fullHtmlFile?.id">
                      <summary class="link-btn primary">{{ tr('parserPageSnapshot') }}</summary>
                      <div class="code-blocks">
                        <button class="btn-glass small download-btn" *ngIf="bug.parserSnapshot?.fullHtmlFile?.id" (click)="downloadParserSnapshotFile(bug.parserSnapshot.fullHtmlFile)">
                          ⬇️ {{ tr('parserDownloadPageCode') }} ({{ formatBytes(bug.parserSnapshot.fullHtmlFile.bytes) }})
                        </button>
                        <div class="code-pane" *ngIf="bug.parserSnapshot?.bodyText">
                          <strong>{{ tr('parserPageText') }}</strong>
                          <pre>{{ bug.parserSnapshot.bodyText }}</pre>
                        </div>
                        <div class="code-pane" *ngIf="bug.parserSnapshot?.htmlSnippet">
                          <strong>{{ tr('parserPageCode') }}</strong>
                          <pre>{{ bug.parserSnapshot.htmlSnippet }}</pre>
                        </div>
                      </div>
                    </details>
                  </article>
                  <div class="empty-state" *ngIf="!bugs().length">{{ tr('noBugReports') }}</div>
                </div>
              </div>
            </section>

            <!-- TAB CONTENT: SUPPORT -->
            <section class="tab-content anim-fade-in support-tab" *ngIf="activeTab() === 'support'">
              
              <div class="support-stats-row">
                <div class="mini-stat glass-panel" *ngFor="let item of supportSummaryCards()" [class.tone-warn]="item.tone === 'warn'" [class.tone-ok]="item.tone === 'ok'">
                  <span class="label">{{ item.label }}</span>
                  <strong class="val">{{ item.value }}</strong>
                </div>
              </div>

              <div class="support-layout">
                <!-- Inbox List -->
                <div class="inbox-list glass-panel">
                  <form class="inbox-search" (ngSubmit)="loadSupportMessages()">
                    <input type="search" name="supportSearch" [(ngModel)]="supportSearch" [placeholder]="tr('searchSupport')" class="glass-input">
                    <select name="supportStatusFilter" [(ngModel)]="supportStatusFilter" class="glass-select">
                      <option value="">{{ tr('allMessages') }}</option>
                      <option value="open">{{ tr('open') }}</option>
                      <option value="pending">{{ tr('pending') }}</option>
                      <option value="closed">{{ tr('closed') }}</option>
                    </select>
                    <button class="btn-glass" type="submit">🔍</button>
                  </form>
                  <div class="messages-scroll">
                    <button class="msg-item anim-hover" *ngFor="let message of filteredSupportMessages()" [class.active]="selectedSupportMessage()?.id === message.id" [class.unread]="!message.isRead" (click)="selectSupportMessage(message)">
                      <div class="msg-avatar">{{ supportInitials(message) }}</div>
                      <div class="msg-content">
                        <div class="msg-row">
                          <strong class="msg-subject">{{ message.subject || tr('noSubject') }}</strong>
                          <span class="pill status-pill tiny" [class.danger]="message.status === 'open'" [class.pending]="message.status === 'pending'">{{ supportStatusLabel(message.status) }}</span>
                        </div>
                        <span class="msg-sender">{{ supportSender(message) }}</span>
                        <span class="msg-preview">{{ supportPreview(message) }}</span>
                        <div class="msg-meta">
                          <span class="chip tiny" *ngIf="message.linkedUser">{{ message.linkedUser.credits }} cr</span>
                          <small>{{ formatDate(message.receivedAt) }}</small>
                        </div>
                      </div>
                    </button>
                    <div class="empty-state" *ngIf="!filteredSupportMessages().length">{{ tr('noSupport') }}</div>
                  </div>
                </div>

                <!-- Inbox Detail -->
                <div class="inbox-detail glass-panel" *ngIf="selectedSupportMessage(); else emptyInboxDetail">
                  <header class="detail-header">
                    <div class="header-main">
                      <span class="pill source-pill">{{ supportSourceLabel(selectedSupportMessage()?.source) }}</span>
                      <h3>{{ selectedSupportMessage()?.subject || tr('noSubject') }}</h3>
                      <div class="meta-grid">
                        <div class="meta-item"><span>{{ tr('from') }}</span> <strong>{{ supportSender(selectedSupportMessage()) }} &lt;{{ selectedSupportMessage()?.fromEmail || '-' }}&gt;</strong></div>
                        <div class="meta-item"><span>{{ tr('to') }}</span> <strong>{{ selectedSupportMessage()?.toEmail || 'support@getquizsolver.com' }}</strong></div>
                        <div class="meta-item"><span>{{ tr('received') }}</span> <strong>{{ formatDate(selectedSupportMessage()?.receivedAt) }}</strong></div>
                      </div>
                    </div>
                    <div class="header-actions">
                      <a class="btn-icon" [href]="supportMailto(selectedSupportMessage())" title="Email">📧</a>
                      <button class="btn-icon" (click)="copySupportEmail(selectedSupportMessage())" title="Copy">📋</button>
                      <div class="btn-group">
                        <button class="btn-glass small" (click)="updateSupportStatus(selectedSupportMessage(), 'open')">{{ tr('open') }}</button>
                        <button class="btn-glass small" (click)="updateSupportStatus(selectedSupportMessage(), 'pending')">{{ tr('pending') }}</button>
                        <button class="btn-glass small" (click)="updateSupportStatus(selectedSupportMessage(), 'closed')">{{ tr('close') }}</button>
                      </div>
                      <button class="btn-icon text-danger" (click)="deleteSupportMessage(selectedSupportMessage())" title="Delete">🗑️</button>
                    </div>
                  </header>

                  <div class="linked-user-card" *ngIf="selectedSupportMessage()?.linkedUser as linkedUser; else noLinkedSupportUser">
                    <div class="user-info">
                      <span class="sub-text">{{ tr('linkedAccount') }}</span>
                      <button class="link-btn primary large" (click)="openUserHistory(linkedUser)">{{ linkedUser.email }}</button>
                      <div class="user-badges">
                        <span class="pill">{{ linkedUser.role }}</span>
                        <span class="pill success">{{ linkedUser.credits }} {{ tr('credits') }}</span>
                        <span class="pill info">{{ linkedUser.stats?.totalQuestionsSolved || 0 }} {{ tr('questions') }}</span>
                      </div>
                    </div>
                    <div class="user-actions">
                      <button class="btn-primary-glow small" (click)="openGrantModal(linkedUser, tr('supportAdjustment'))">{{ tr('grantCredits') }}</button>
                      <button class="btn-ghost small" [class.text-danger]="!linkedUser.isBanned" [class.text-success]="linkedUser.isBanned" (click)="linkedUser.isBanned ? unbanUser(linkedUser.id) : banUser(linkedUser.id)">
                        {{ linkedUser.isBanned ? tr('unban') : tr('ban') }}
                      </button>
                    </div>
                  </div>
                  <ng-template #noLinkedSupportUser>
                    <div class="linked-user-card empty">
                      <div class="user-info">
                        <span class="sub-text">{{ tr('noLinkedAccount') }}</span>
                        <strong class="text-danger">{{ selectedSupportMessage()?.fromEmail || tr('unknownEmail') }}</strong>
                        <p class="sub-text">{{ tr('noLinkedAccountNote') }}</p>
                      </div>
                    </div>
                  </ng-template>

                  <div class="message-body">
                    <p *ngFor="let paragraph of supportParagraphs(selectedSupportMessage()?.text)">{{ paragraph }}</p>
                  </div>

                  <div class="replies-section" *ngIf="(selectedSupportMessage()?.replies || []).length">
                    <h4>{{ tr('replies') }}</h4>
                    <div class="reply-card" *ngFor="let reply of selectedSupportMessage()?.replies">
                      <div class="reply-head">
                        <strong>{{ reply.admin }}</strong>
                        <span class="sub-text">{{ formatDate(reply.sentAt) }} • {{ reply.delivery }}</span>
                      </div>
                      <div class="reply-body">
                        <p *ngFor="let p of supportParagraphs(reply.text)">{{ p }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="reply-composer">
                    <h4>{{ tr('reply') }}</h4>
                    <textarea class="glass-input" rows="4" [placeholder]="tr('replyPlaceholder')" [(ngModel)]="supportReplyText"></textarea>
                    <button class="btn-primary-glow" [disabled]="!supportReplyText.trim()" (click)="sendSupportReply(selectedSupportMessage())">{{ tr('sendReply') }}</button>
                  </div>
                </div>
                <ng-template #emptyInboxDetail>
                  <div class="inbox-detail glass-panel flex-center">
                    <div class="empty-state">
                      <span class="empty-icon">✉️</span>
                      <p>{{ tr('selectMessage') }}</p>
                    </div>
                  </div>
                </ng-template>
              </div>
            </section>

            <!-- TAB CONTENT: CACHE -->
            <section class="tab-content anim-fade-in cache-tab" *ngIf="activeTab() === 'cache'">
              <div class="section-card glass-panel">
                <div class="section-header">
                  <h3>{{ tr('cacheTitle') }}</h3>
                </div>
                <div class="mini-stats-row">
                  <div class="mini-stat">
                    <span class="label">{{ tr('allStoredCacheRecords') }}</span>
                    <strong class="val text-accent">{{ formatNumber(cachePagination().total || 0) }}</strong>
                  </div>
                  <div class="mini-stat">
                    <span class="label">{{ tr('matchingCurrentSearch') }}</span>
                    <strong class="val text-accent">{{ formatNumber(cachePagination().filteredTotal || 0) }}</strong>
                  </div>
                  <div class="mini-stat">
                    <span class="label">{{ tr('currentCachePageTotal') }}</span>
                    <strong class="val">{{ formatNumber(cacheEntries().length) }}</strong>
                  </div>
                  <div class="mini-stat">
                    <span class="label">{{ tr('hitsOnPage') }}</span>
                    <strong class="val">{{ formatNumber(cacheHitsOnPage()) }}</strong>
                  </div>
                </div>
                
                <form class="action-bar" (ngSubmit)="loadCache(1)">
                  <div class="search-box stretch">
                    <span class="search-icon">🔍</span>
                    <input type="search" name="cacheSearch" [(ngModel)]="cacheSearch" [placeholder]="tr('searchCache')" class="glass-input">
                  </div>
                  <select name="cacheSort" [(ngModel)]="cacheSort" (ngModelChange)="loadCache(1)" class="glass-select">
                    <option value="newest">{{ tr('newest') }}</option>
                    <option value="oldest">{{ tr('oldest') }}</option>
                    <option value="hits_desc">{{ tr('mostHits') }}</option>
                    <option value="weak">{{ tr('weakEntries') }}</option>
                  </select>
                  <button class="btn-primary-glow small" type="submit">{{ tr('search') }}</button>
                  <button class="btn-ghost text-danger" type="button" (click)="clearCache()">{{ tr('clearAll') }}</button>
                </form>

                <div class="grid-list">
                  <article class="grid-card glass-card anim-hover-lift" *ngFor="let entry of cacheEntries()">
                    <div class="card-head">
                      <span class="pill type-pill uppercase">{{ entry.questionType }}</span>
                      <div class="card-actions">
                        <span class="chip success">🔥 {{ entry.hitCount || 0 }}</span>
                        <button class="btn-icon text-danger" (click)="deleteCacheEntry(entry)" title="Delete">🗑️</button>
                      </div>
                    </div>
                    <strong class="card-title">{{ entry.questionText }}</strong>
                    <div class="meta-row">
                      <span class="hash-text">{{ shortHash(entry.questionHash) }}</span>
                      <span class="date-text">{{ formatDate(entry.createdAt) }}</span>
                    </div>
                    <div class="answer-box">
                      <span class="answer-label">A:</span>
                      <span class="answer-text">{{ entry.answerText }}</span>
                    </div>
                  </article>
                  <div class="empty-state" *ngIf="!cacheEntries().length">{{ tr('noCacheEntries') }}</div>
                </div>

                <div class="pagination-bar" *ngIf="cachePagination().pages > 1">
                  <button class="page-btn" *ngFor="let page of cachePageNumbers()" [class.active]="page === cachePagination().page" (click)="loadCache(page)">{{ page }}</button>
                </div>
              </div>
            </section>

            <!-- TAB CONTENT: PARSER -->
            <section class="tab-content anim-fade-in parser-tab" *ngIf="activeTab() === 'parser'">
              
              <div class="section-card glass-panel">
                <div class="section-header">
                  <h3>{{ tr('parserHealthTitle') }}</h3>
                  <button class="btn-glass" (click)="clearParserEvents()">{{ tr('clearAll') }}</button>
                </div>
                <div class="mini-stats-row">
                  <div class="mini-stat" *ngFor="let s of parserHealthCards()">
                    <span class="label">{{ s.label }}</span>
                    <strong class="val" [class.text-ok]="s.ok" [class.text-warn]="s.warn" [class.text-danger]="s.danger">{{ s.value }}</strong>
                  </div>
                </div>

                <form class="action-bar" (ngSubmit)="loadParserEvents(1)">
                  <select name="parserPlatform" [(ngModel)]="parserFilterPlatform" (ngModelChange)="loadParserEvents(1)" class="glass-select stretch">
                    <option value="">{{ tr('parserAllPlatforms') }}</option>
                    <option *ngFor="let p of parserPlatforms()" [value]="p">{{ p }}</option>
                  </select>
                  <select name="parserOutcome" [(ngModel)]="parserFilterOutcome" (ngModelChange)="loadParserEvents(1)" class="glass-select stretch">
                    <option value="">{{ tr('parserAllOutcomes') }}</option>
                    <option value="ok">{{ tr('parserOutcomeOk') }}</option>
                    <option value="weak">{{ tr('parserOutcomeWeak') }}</option>
                    <option value="empty">{{ tr('parserOutcomeEmpty') }}</option>
                    <option value="error">{{ tr('parserOutcomeError') }}</option>
                  </select>
                  <button class="btn-primary-glow small" type="submit">{{ tr('filter') }}</button>
                </form>

                <div class="list-grid single-col">
                  <article class="report-card glass-card anim-hover" *ngFor="let event of parserEvents()">
                    <div class="card-head">
                      <div class="card-title">
                        <strong class="uppercase text-accent">{{ event.platform || 'unknown' }}</strong>
                        <span class="sub-text ml-2">{{ parserHost(event) }}</span>
                      </div>
                      <span class="pill status-pill" [class.ok]="parserOutcomeTone(event.outcome) === 'ok'" [class.pending]="parserOutcomeTone(event.outcome) === 'pending'" [class.danger]="parserOutcomeTone(event.outcome) === 'danger'">{{ event.outcome || '-' }}</span>
                    </div>
                    <p class="report-desc text-warn" *ngIf="event.reason">{{ event.reason }}</p>
                    <p class="report-desc">{{ parserEventPreview(event) }}</p>
                    
                    <div class="chips-row">
                      <span class="chip">{{ formatPercent(event.confidence || 0) }} conf</span>
                      <span class="chip">{{ formatNumber(event.questionCount || 0) }} q's</span>
                      <span class="chip">{{ formatNumber(event.optionCount || 0) }} opts</span>
                      <span class="chip success" *ngIf="event.hasPageCode">HTML</span>
                      <span class="chip">{{ formatDate(event.createdAt) }}</span>
                      <a class="primary-link parser-url" [href]="event.url" target="_blank" rel="noopener">{{ shortUrl(event.url) }}</a>
                    </div>

                    <details class="code-details mt-3" *ngIf="event.snapshot?.bodyText || event.snapshot?.htmlSnippet || event.snapshot?.fullHtmlFile?.id">
                      <summary class="link-btn primary">{{ tr('parserPageSnapshot') }}</summary>
                      <div class="code-blocks">
                        <button class="btn-glass small download-btn" *ngIf="event.snapshot?.fullHtmlFile?.id" (click)="downloadParserSnapshotFile(event.snapshot.fullHtmlFile)">
                          ⬇️ {{ tr('parserDownloadPageCode') }} ({{ formatBytes(event.snapshot.fullHtmlFile.bytes) }})
                        </button>
                        <div class="code-pane" *ngIf="event.snapshot?.bodyText">
                          <strong>{{ tr('parserPageText') }}</strong>
                          <pre>{{ event.snapshot.bodyText }}</pre>
                        </div>
                        <div class="code-pane" *ngIf="event.snapshot?.htmlSnippet">
                          <strong>{{ tr('parserPageCode') }}</strong>
                          <pre>{{ event.snapshot.htmlSnippet }}</pre>
                        </div>
                      </div>
                    </details>
                  </article>
                  <div class="empty-state" *ngIf="!parserEvents().length">{{ tr('parserNoEvents') }}</div>
                </div>
                
                <div class="pagination-bar" *ngIf="parserEventsPagination().pages > 1">
                  <button class="page-btn" *ngFor="let page of parserEventPageNumbers()" [class.active]="page === parserEventsPagination().page" (click)="loadParserEvents(page)">{{ page }}</button>
                </div>
              </div>

              <!-- Parser Reports (Bugs) -->
              <div class="section-card glass-panel" *ngIf="(parserHealth().recentBugReports || []).length">
                <div class="section-header">
                  <h3>{{ tr('parserRecentReports') }}</h3>
                </div>
                <div class="list-grid single-col">
                  <article class="report-card glass-card anim-hover" *ngFor="let report of parserHealth().recentBugReports">
                    <p class="report-desc bold">{{ report.parserSnapshot?.questionTexts?.[0] || report.parserDiagnostics?.reason || report.url }}</p>
                    <div class="chips-row">
                      <span class="chip uppercase">{{ report.platform || 'unknown' }}</span>
                      <span class="chip pending" *ngIf="report.source === 'parser-auto'">{{ tr('parserAutoReport') }}</span>
                      <span class="chip">{{ formatPercent(report.parserDiagnostics?.confidence || 0) }} conf</span>
                      <span class="chip success" *ngIf="report.hasPageCode">HTML</span>
                      <span class="chip">{{ formatDate(report.date) }}</span>
                    </div>
                    <a class="primary-link parser-url" [href]="report.url" target="_blank" rel="noopener">{{ shortUrl(report.url) }}</a>
                  </article>
                </div>
              </div>
            </section>

            <!-- TAB CONTENT: SYSTEM -->
            <section class="tab-content anim-fade-in system-tab" *ngIf="activeTab() === 'system'">
              
              <div class="section-card glass-panel">
                <div class="section-header">
                  <h3>{{ tr('healthCheck') }}</h3>
                </div>
                <div class="stats-grid large">
                  <div class="stat-card" *ngFor="let item of healthCards()">
                    <span class="stat-label uppercase">{{ item.label }}</span>
                    <strong class="stat-value text-accent" [class.text-ok]="item.ok">{{ item.value }}</strong>
                  </div>
                </div>
              </div>

              <div class="section-card glass-panel mt-4">
                <div class="section-header">
                  <div>
                    <h3>{{ tr('creditDedupeMonitor') }}</h3>
                    <p class="subtitle">{{ tr('billingSafety') }}</p>
                  </div>
                  <button class="btn-glass" (click)="loadBillingSafety()">{{ tr('refreshBilling') }}</button>
                </div>

                <div class="stats-grid">
                  <div class="stat-card" *ngFor="let item of billingSafetyCards()">
                    <span class="stat-label uppercase">{{ item.label }}</span>
                    <strong class="stat-value" [class.text-ok]="item.ok">{{ item.value }}</strong>
                  </div>
                </div>

                <div class="alert-box error mt-4" *ngIf="(billingSafety().duplicateGroups || []).length">
                  {{ tr('duplicateWarning') }}
                </div>

                <div class="table-container mt-4" *ngIf="(billingSafety().duplicateGroups || []).length">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>{{ tr('user') }}</th>
                        <th>{{ tr('questionText') }}</th>
                        <th>{{ tr('charges') }}</th>
                        <th>{{ tr('actions') }}</th>
                        <th>{{ tr('lastCharged') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let group of billingSafety().duplicateGroups" class="table-row">
                        <td>
                          <button class="link-btn primary" *ngIf="group.userId" (click)="openUserHistory({ id: group.userId, email: group.email || group.userId })">{{ group.email || group.userId }}</button>
                          <strong *ngIf="!group.userId">{{ group.email || tr('unknownUser') }}</strong>
                        </td>
                        <td>
                          <strong>{{ group.questionText || shortHash(group.questionHash) }}</strong>
                          <span class="sub-text block" *ngIf="group.answerText">A: {{ group.answerText }}</span>
                          <span class="sub-text block text-warn">Hash: {{ shortHash(group.questionHash) }}</span>
                        </td>
                        <td>
                          <strong class="hl-text text-danger">{{ group.count }} / {{ group.credits }} cr</strong>
                          <span class="sub-text block">{{ tr('timeSpan') }}: {{ formatDurationMs(group.spanMs) }}</span>
                        </td>
                        <td>
                          <strong>{{ group.action || (group.actions || []).join(', ') }}</strong>
                        </td>
                        <td>
                          <strong>{{ formatDate(group.lastChargedAt) }}</strong>
                          <div class="action-buttons mt-2">
                            <button class="btn-glass small" (click)="reviewDuplicateGroup(group)">{{ tr('reviewInLog') }}</button>
                            <button class="btn-primary-glow small" *ngIf="group.userId" (click)="openGrantModal({ id: group.userId, email: group.email || group.userId }, tr('possibleRefund'))">Refund</button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Credit Usage Log -->
              <div class="section-card glass-panel mt-4">
                <div class="section-header">
                  <div>
                    <h3>{{ tr('creditUsageLog') }}</h3>
                    <p class="subtitle">{{ tr('creditEvent') }}</p>
                  </div>
                  <button class="btn-glass" (click)="loadBillingUsage(1)">{{ tr('refresh') }}</button>
                </div>
                
                <form class="action-bar" (ngSubmit)="loadBillingUsage(1)">
                  <div class="search-box stretch">
                    <span class="search-icon">🔍</span>
                    <input type="search" [(ngModel)]="billingUsageSearch" name="billingUsageSearch" [placeholder]="tr('searchCreditUsage')" class="glass-input">
                  </div>
                  <select [(ngModel)]="billingUsageStatus" name="billingUsageStatus" class="glass-select stretch">
                    <option value="">{{ tr('allStatuses') }}</option>
                    <option value="charged">{{ tr('charged') }}</option>
                    <option value="claimed">{{ tr('claimed') }}</option>
                    <option value="waived">{{ tr('waived') }}</option>
                    <option value="aborted">{{ tr('aborted') }}</option>
                    <option value="declined">{{ tr('declined') }}</option>
                  </select>
                  <select [(ngModel)]="billingUsageAction" name="billingUsageAction" class="glass-select stretch">
                    <option value="">{{ tr('allActions') }}</option>
                    <option value="solve">solve</option>
                    <option value="solve-snapshot">solve-snapshot</option>
                    <option value="explain">explain</option>
                    <option value="follow-up">follow-up</option>
                  </select>
                  <button class="btn-primary-glow small" type="submit">{{ tr('search') }}</button>
                </form>

                <div class="mini-stats-row">
                  <div class="mini-stat"><span class="label">{{ tr('visibleEntries') }}</span><strong class="val">{{ formatNumber(billingUsagePagination().total || 0) }}</strong></div>
                  <div class="mini-stat"><span class="label">{{ tr('charged') }}</span><strong class="val text-ok">{{ formatNumber(billingUsageSummary().chargedRecords || 0) }}</strong></div>
                  <div class="mini-stat"><span class="label">{{ tr('chargedCredits') }}</span><strong class="val text-ok">{{ formatNumber(billingUsageSummary().chargedCredits || 0) }}</strong></div>
                </div>

                <div class="table-container mt-4">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>{{ tr('questionText') }}</th>
                        <th>{{ tr('user') }}</th>
                        <th>{{ tr('creditEvent') }}</th>
                        <th>{{ tr('chargedCredits') }}</th>
                        <th>{{ tr('date') }}</th>
                        <th>{{ tr('actions') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let item of billingUsageRows()" class="table-row">
                        <td>
                          <strong>{{ item.questionText }}</strong>
                          <span class="sub-text block" *ngIf="item.answerText">A: {{ item.answerText }}</span>
                          <span class="sub-text block text-warn">{{ item.questionType || item.action }} - {{ shortHash(item.questionHash) }}</span>
                        </td>
                        <td>
                          <button class="link-btn primary block text-left" *ngIf="item.userId" (click)="openUserHistory({ id: item.userId, email: item.email })">{{ item.email }}</button>
                          <strong *ngIf="!item.userId">{{ item.email }}</strong>
                          <span class="sub-text block" *ngIf="item.displayName">{{ item.displayName }}</span>
                        </td>
                        <td>
                          <span class="pill status-pill" [class.ok]="creditUsageStatusClass(item.status) === 'ok'" [class.pending]="creditUsageStatusClass(item.status) === 'pending'" [class.danger]="creditUsageStatusClass(item.status) === 'danger'">{{ creditUsageStatusLabel(item.status) }}</span>
                          <span class="block mt-1">{{ item.action }}</span>
                          <span class="sub-text block text-danger" *ngIf="item.waivedReason">{{ item.waivedReason }}</span>
                        </td>
                        <td>
                          <strong class="hl-text text-accent">{{ item.creditsCharged || 0 }}</strong>
                          <span class="sub-text block">{{ tr('billableCredits') }}: {{ item.credits || 0 }}</span>
                        </td>
                        <td>{{ formatDate(item.time) }}</td>
                        <td>
                          <button class="btn-glass small" (click)="showQuestionDetails(item)">{{ tr('viewQuestion') }}</button>
                        </td>
                      </tr>
                      <tr *ngIf="!billingUsageRows().length">
                        <td colspan="6"><div class="empty-state">{{ tr('noCreditUsage') }}</div></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="pagination-bar" *ngIf="billingUsagePagination().pages > 1">
                  <button class="page-btn" *ngFor="let page of billingUsagePageNumbers()" [class.active]="page === billingUsagePagination().page" (click)="loadBillingUsage(page)">{{ page }}</button>
                </div>
              </div>
            </section>

          </main>
        </div>
      </ng-template>

      <!-- OVERLAYS & MODALS -->
      <!-- Question Detail Modal -->
      <div class="modal-backdrop" *ngIf="selectedQuestion()" (click)="selectedQuestion.set(null)">
        <div class="modal-card glass-panel anim-zoom-in" (click)="$event.stopPropagation()">
          <header class="modal-header">
            <h3>{{ tr('questionDetails') }}</h3>
            <div class="action-buttons">
              <button class="btn-icon text-danger" *ngIf="selectedQuestion()?.cacheId" (click)="deleteCacheEntry(selectedQuestion())" title="Delete from Cache">🗑️</button>
              <button class="btn-icon" (click)="selectedQuestion.set(null)">❌</button>
            </div>
          </header>
          <div class="modal-body">
            <div class="detail-row">
              <span class="label">{{ tr('type') }}</span>
              <span class="pill uppercase">{{ selectedQuestion()?.questionType }}</span>
            </div>
            <div class="detail-row" *ngIf="selectedQuestion()?.hitCount != null">
              <span class="label">{{ tr('cacheHits') }}</span>
              <strong class="val text-accent">{{ selectedQuestion()?.hitCount }}</strong>
            </div>
            <div class="detail-row">
              <span class="label">{{ tr('questionText') }}</span>
              <div class="detail-box">{{ selectedQuestion()?.questionText }}</div>
            </div>
            <div class="detail-row" *ngIf="selectedQuestion()?.answerText">
              <span class="label">{{ tr('answerText') }}</span>
              <div class="detail-box highlight">{{ selectedQuestion()?.answerText }}</div>
            </div>
            <div class="detail-row" *ngIf="(selectedQuestion()?.options || []).length">
              <span class="label">{{ tr('options') }}</span>
              <ul class="options-list">
                <li *ngFor="let opt of selectedQuestion()?.options">{{ opt }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- User History Modal -->
      <div class="modal-backdrop" *ngIf="selectedHistoryUser()" (click)="selectedHistoryUser.set(null)">
        <div class="modal-card large glass-panel anim-zoom-in" (click)="$event.stopPropagation()">
          <header class="modal-header">
            <h3>{{ tr('historyFor') }} <span class="text-accent">{{ selectedHistoryUser()?.email }}</span></h3>
            <button class="btn-icon" (click)="selectedHistoryUser.set(null)">❌</button>
          </header>
          <div class="modal-body">
            <div class="loading-spinner center" *ngIf="userHistoryLoading()"></div>
            
            <ng-container *ngIf="!userHistoryLoading()">
              <h4 class="mt-0">{{ tr('questionHistory') }}</h4>
              <div class="table-container" style="max-height: 300px;">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>{{ tr('date') }}</th>
                      <th>{{ tr('questionText') }}</th>
                      <th>{{ tr('type') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let q of userQuestions()">
                      <td style="white-space:nowrap">{{ formatDate(q.createdAt) }}</td>
                      <td>{{ q.questionText }}</td>
                      <td><span class="pill tiny">{{ q.questionType }}</span></td>
                    </tr>
                    <tr *ngIf="!(userQuestions() || []).length">
                      <td colspan="3"><div class="empty-state tiny">{{ tr('noSolvedQuestions') }}</div></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h4 class="mt-4">{{ 'Transactions' }}</h4>
              <div class="table-container" style="max-height: 250px;">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>{{ tr('date') }}</th>
                      <th>{{ tr('credits') }}</th>
                      <th>{{ tr('reason') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let t of []">
                      <td style="white-space:nowrap">{{ formatDate(t.createdAt) }}</td>
                      <td><strong [class.text-success]="t.amount > 0" [class.text-danger]="t.amount < 0">{{ t.amount > 0 ? '+' : '' }}{{ t.amount }}</strong></td>
                      <td>{{ t.reason }}</td>
                    </tr>
                    <tr *ngIf="!([] || []).length">
                      <td colspan="3"><div class="empty-state tiny">{{ 'No Transactions' }}</div></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </ng-container>
          </div>
        </div>
      </div>

      <!-- Grant Credits Modal -->
      <div class="modal-backdrop" *ngIf="selectedGrantUser()" (click)="closeGrantModal()">
        <div class="modal-card small glass-panel anim-zoom-in" (click)="$event.stopPropagation()">
          <header class="modal-header">
            <h3>{{ tr('grantCredits') }}</h3>
            <button class="btn-icon" (click)="closeGrantModal()">❌</button>
          </header>
          <div class="modal-body">
            <p class="sub-text text-center">{{ selectedGrantUser()?.email }}</p>
            <form class="grant-form mt-4" (ngSubmit)="grantCustomCredits()">
              <div class="form-group">
                <label>{{ 'Amount' }}</label>
                <input type="number" name="amount" [(ngModel)]="grantAmount" class="glass-input" required min="1">
              </div>
              <div class="form-group">
                <label>{{ tr('reason') }}</label>
                <input type="text" name="reason" [(ngModel)]="grantReason" class="glass-input" required>
              </div>
              <button class="btn-primary-glow full-width mt-4" type="submit" [disabled]="loading()">
                {{ loading() ? '...' : tr('grantCredits') }}
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Admin Notice Modal -->
      <div class="modal-backdrop" *ngIf="selectedNotice()" (click)="selectedNotice.set(null)">
        <div class="modal-card small glass-panel anim-zoom-in" (click)="$event.stopPropagation()">
          <header class="modal-header">
            <h3>{{ selectedNotice()?.label }}</h3>
            <button class="btn-icon" (click)="selectedNotice.set(null)">❌</button>
          </header>
          <div class="modal-body flex-center col">
            <strong class="mega-val" [class.text-warn]="selectedNotice()?.tone === 'warn'" [class.text-ok]="selectedNotice()?.tone === 'ok'">{{ selectedNotice()?.value }}</strong>
            <p class="text-center mt-3">{{ selectedNotice()?.note }}</p>
            <button class="btn-glass mt-4" (click)="handleNoticeAction(selectedNotice()!); selectedNotice.set(null)">
              {{ '' }}
            </button>
          </div>
        </div>
      </div>

    </main>
  \`,`;

// --------------------------------------------------------
// NEW CSS STYLES
// --------------------------------------------------------
const newStyles = `  styles: [\`
    /* 
      QuizSolver Admin Redesign
      Theme: Dark Glassmorphism
    */
    :host {
      --bg-color: #0b0f19;
      --bg-glass: rgba(18, 25, 43, 0.6);
      --bg-glass-hover: rgba(28, 38, 63, 0.8);
      --border-glass: rgba(255, 255, 255, 0.08);
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --accent: #38bdf8;
      --accent-glow: rgba(56, 189, 248, 0.4);
      --success: #10b981;
      --danger: #ef4444;
      --warning: #f59e0b;
      
      display: block;
      min-height: 100vh;
      background-color: var(--bg-color);
      background-image: 
        radial-gradient(circle at 15% 50%, rgba(56, 189, 248, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.05) 0%, transparent 50%);
      background-attachment: fixed;
      color: var(--text-main);
      font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    }

    * { box-sizing: border-box; }
    
    a { color: var(--accent); text-decoration: none; transition: 0.2s; }
    a:hover { filter: brightness(1.2); }
    
    button { cursor: pointer; border: none; background: none; color: inherit; font: inherit; transition: 0.2s; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }

    /* UTILITIES */
    .mt-0 { margin-top: 0; }
    .mt-1 { margin-top: 0.25rem; }
    .mt-2 { margin-top: 0.5rem; }
    .mt-3 { margin-top: 1rem; }
    .mt-4 { margin-top: 1.5rem; }
    .ml-2 { margin-left: 0.5rem; }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .text-left { text-align: left; }
    .uppercase { text-transform: uppercase; letter-spacing: 0.05em; }
    .flex-center { display: flex; align-items: center; justify-content: center; }
    .col { flex-direction: column; }
    .full-width { width: 100%; }
    .block { display: block; }
    
    .text-accent { color: var(--accent); }
    .text-success { color: var(--success); }
    .text-danger { color: var(--danger); }
    .text-warn { color: var(--warning); }
    .text-ok { color: var(--success); }
    
    .hl-text { font-weight: 700; letter-spacing: -0.02em; }
    .sub-text { color: var(--text-muted); font-size: 0.85rem; }

    /* ANIMATIONS */
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes zoomIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    
    .anim-fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .anim-fade-in { animation: fadeIn 0.3s ease forwards; }
    .anim-zoom-in { animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .anim-hover { transition: all 0.2s ease; }
    .anim-hover:hover { background-color: var(--bg-glass-hover); }
    .anim-hover-lift { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
    .anim-hover-lift:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0,0,0,0.3); background-color: var(--bg-glass-hover); border-color: rgba(255,255,255,0.15); }

    /* GLASS COMPONENTS */
    .glass-panel, .glass-card {
      background: var(--bg-glass);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--border-glass);
      border-radius: 16px;
    }
    
    .glass-input, .glass-select {
      background: rgba(0,0,0,0.2);
      border: 1px solid var(--border-glass);
      border-radius: 8px;
      color: var(--text-main);
      padding: 0.6rem 1rem;
      font-size: 0.9rem;
      transition: 0.2s;
      outline: none;
    }
    .glass-input:focus, .glass-select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }
    .glass-select option { background: var(--bg-color); }

    /* BUTTONS */
    .btn-primary-glow {
      background: var(--accent);
      color: #000;
      font-weight: 600;
      border-radius: 8px;
      padding: 0.6rem 1.25rem;
      box-shadow: 0 0 15px var(--accent-glow);
    }
    .btn-primary-glow:hover { box-shadow: 0 0 25px var(--accent-glow); transform: scale(1.02); }
    .btn-primary-glow.small { padding: 0.4rem 0.8rem; font-size: 0.85rem; }
    
    .btn-glass {
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border-glass);
      border-radius: 8px;
      padding: 0.6rem 1.2rem;
      font-weight: 500;
    }
    .btn-glass:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }
    .btn-glass.small { padding: 0.4rem 0.8rem; font-size: 0.85rem; }
    
    .btn-ghost { padding: 0.6rem 1rem; border-radius: 8px; font-weight: 500; color: var(--text-muted); }
    .btn-ghost:hover { background: rgba(255,255,255,0.05); color: var(--text-main); }
    .btn-ghost.danger:hover { background: rgba(239, 68, 68, 0.1); color: var(--danger); }
    .btn-ghost.small { padding: 0.4rem 0.8rem; font-size: 0.85rem; }
    
    .btn-icon { width: 32px; height: 32px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.03); border: 1px solid transparent; }
    .btn-icon:hover { background: rgba(255,255,255,0.1); border-color: var(--border-glass); transform: scale(1.1); }
    .btn-tiny { font-size: 0.75rem; padding: 0.2rem 0.4rem; background: rgba(255,255,255,0.1); border-radius: 4px; font-weight: 600; }
    .btn-tiny:hover { background: rgba(255,255,255,0.2); }
    
    .link-btn { color: var(--accent); font-weight: 500; }
    .link-btn:hover { text-decoration: underline; }
    .link-btn.large { font-size: 1.1rem; }

    /* PILLS & CHIPS */
    .pill {
      display: inline-flex; align-items: center; padding: 0.25rem 0.6rem; 
      border-radius: 999px; font-size: 0.75rem; font-weight: 600;
      background: rgba(255,255,255,0.1); border: 1px solid var(--border-glass);
    }
    .pill.tiny { padding: 0.15rem 0.4rem; font-size: 0.7rem; }
    .pill.success { background: rgba(16, 185, 129, 0.15); color: #34d399; border-color: rgba(16,185,129,0.3); }
    .pill.danger { background: rgba(239, 68, 68, 0.15); color: #f87171; border-color: rgba(239,68,68,0.3); }
    .pill.pending { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border-color: rgba(245,158,11,0.3); }
    .pill.info { background: rgba(56, 189, 248, 0.15); color: #7dd3fc; border-color: rgba(56,189,248,0.3); }
    
    .chip {
      display: inline-flex; align-items: center; padding: 0.2rem 0.5rem;
      border-radius: 6px; font-size: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border-glass);
      color: var(--text-muted);
    }
    .chip.success { color: #34d399; border-color: rgba(16,185,129,0.3); }

    /* LAYOUT: SHELL */
    .admin-page-container { min-height: 100vh; display: flex; }
    .admin-shell { display: flex; width: 100%; height: 100vh; overflow: hidden; }
    
    /* LOGIN */
    .admin-login-wrapper { width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1rem; }
    .login-card { width: 100%; max-width: 400px; padding: 2.5rem 2rem; display: flex; flex-direction: column; align-items: center; }
    .brand-logo { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
    .logo-box { width: 40px; height: 40px; background: var(--accent); color: #000; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.2rem; }
    .logo-text { font-size: 1.25rem; font-weight: 700; color: #fff; letter-spacing: -0.02em; }
    .login-title { font-size: 1.5rem; margin: 0 0 0.5rem; }
    .login-subtitle { color: var(--text-muted); margin: 0 0 2rem; text-align: center; }
    .btn-oauth { display: flex; align-items: center; justify-content: center; gap: 0.75rem; width: 100%; padding: 0.75rem; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-glass); font-weight: 500; }
    .btn-oauth:hover { background: rgba(255,255,255,0.1); }
    .google-icon { width: 20px; height: 20px; }
    .divider { display: flex; align-items: center; width: 100%; margin: 1.5rem 0; color: var(--text-muted); font-size: 0.85rem; }
    .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--border-glass); }
    .divider span { padding: 0 1rem; }
    .login-form { width: 100%; display: flex; flex-direction: column; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
    .form-group label { font-size: 0.85rem; font-weight: 500; color: var(--text-muted); }
    
    /* SIDEBAR */
    .sidebar { width: 260px; height: 100vh; flex-shrink: 0; display: flex; flex-direction: column; justify-content: space-between; border-right: 1px solid var(--border-glass); border-radius: 0; }
    .sidebar-top { padding: 1.5rem 1rem; display: flex; flex-direction: column; gap: 1.5rem; overflow-y: auto; }
    .sidebar-bottom { padding: 1rem; border-top: 1px solid var(--border-glass); display: flex; flex-direction: column; gap: 0.5rem; }
    
    .brand-logo.compact .logo-box { width: 32px; height: 32px; font-size: 1rem; }
    
    .quick-status-grid { display: grid; grid-template-columns: 1fr; gap: 0.5rem; }
    .status-btn { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border-radius: 10px; background: rgba(0,0,0,0.2); border: 1px solid var(--border-glass); text-align: left; }
    .status-btn:hover { background: rgba(255,255,255,0.05); }
    .status-btn.alert { border-color: rgba(245, 158, 11, 0.4); background: rgba(245, 158, 11, 0.05); }
    .status-btn .icon { font-size: 1.25rem; }
    .status-btn .info { display: flex; flex-direction: column; }
    .status-btn .label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .status-btn .value { font-size: 1.1rem; font-weight: 700; color: var(--text-main); }
    .status-btn.alert .value { color: var(--warning); }
    
    .nav-group { margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.25rem; }
    .group-title { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); padding: 0 0.75rem 0.5rem; font-weight: 600; }
    .nav-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem; border-radius: 8px; color: var(--text-muted); position: relative; }
    .nav-item:hover { background: rgba(255,255,255,0.05); color: var(--text-main); }
    .nav-item.active { background: rgba(56, 189, 248, 0.1); color: var(--accent); font-weight: 600; }
    .nav-item.active::before { content: ''; position: absolute; left: -1rem; top: 20%; bottom: 20%; width: 4px; background: var(--accent); border-radius: 0 4px 4px 0; }
    .nav-icon { width: 20px; font-weight: bold; text-align: center; opacity: 0.7; }
    .nav-badge { margin-left: auto; background: var(--danger); color: #fff; font-size: 0.7rem; font-weight: 700; padding: 0.1rem 0.4rem; border-radius: 99px; }
    
    .lang-switch { display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 0.5rem; }
    .lang-switch a { padding: 0.25rem 0.5rem; font-size: 0.75rem; font-weight: 600; color: var(--text-muted); border-radius: 4px; }
    .lang-switch a.active { background: var(--accent); color: #000; }

    /* CONTENT AREA */
    .content-area { flex: 1; display: flex; flex-direction: column; height: 100vh; overflow-y: auto; padding: 0 2rem 2rem; }
    
    .top-header { position: sticky; top: 0; z-index: 10; margin: 0 -2rem 1.5rem; padding: 1.5rem 2rem; border-radius: 0; border-left: none; border-right: none; border-top: none; display: flex; justify-content: space-between; align-items: center; }
    .header-titles .eyebrow { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent); font-weight: 600; }
    .header-titles h2 { margin: 0.25rem 0 0; font-size: 1.75rem; font-weight: 700; letter-spacing: -0.02em; }
    .header-titles .subtitle { margin: 0.25rem 0 0; color: var(--text-muted); }
    .header-actions { display: flex; gap: 0.75rem; align-items: center; }
    
    .global-alerts { margin-bottom: 1.5rem; }
    .alert-box { padding: 1rem 1.25rem; border-radius: 8px; font-weight: 500; }
    .alert-box.error { background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239,68,68,0.3); color: #fca5a5; }
    .alert-box.success { background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16,185,129,0.3); color: #6ee7b7; }

    /* DASHBOARD WIDGETS */
    .dashboard-widgets { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }
    .widget-card { display: flex; flex-direction: column; }
    .widget-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border-glass); }
    .widget-header h3 { margin: 0; font-size: 1.1rem; }
    .widget-header p { margin: 0.25rem 0 0; font-size: 0.85rem; color: var(--text-muted); }
    .widget-content { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; }
    
    .notices-grid { display: grid; gap: 0.75rem; }
    .notice-card { display: flex; flex-direction: column; align-items: flex-start; padding: 1rem; border-radius: 12px; background: rgba(0,0,0,0.2); border: 1px solid var(--border-glass); text-align: left; }
    .notice-card.tone-warn { border-left: 4px solid var(--warning); }
    .notice-card.tone-ok { border-left: 4px solid var(--success); }
    .notice-value { font-size: 1.5rem; font-weight: 800; line-height: 1; margin-bottom: 0.25rem; }
    .notice-label { font-weight: 600; font-size: 0.9rem; }
    .notice-note { font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem; }
    
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; }
    .stats-grid.large { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
    .stat-card { display: flex; flex-direction: column; gap: 0.25rem; }
    .stat-label { font-size: 0.8rem; color: var(--text-muted); }
    .stat-value { font-size: 1.5rem; font-weight: 700; }
    .stat-value.text-revenue { color: var(--success); }

    /* SECTIONS & TABLES */
    .section-card { display: flex; flex-direction: column; margin-bottom: 1.5rem; }
    .section-header { padding: 1.5rem; border-bottom: 1px solid var(--border-glass); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
    .section-header h3 { margin: 0; font-size: 1.25rem; display: flex; align-items: center; gap: 0.75rem; }
    
    .action-bar { display: flex; gap: 0.75rem; padding: 1rem 1.5rem; border-bottom: 1px solid var(--border-glass); align-items: center; flex-wrap: wrap; background: rgba(0,0,0,0.1); }
    .search-box { position: relative; display: flex; align-items: center; }
    .search-box.stretch { flex: 1; }
    .search-box .search-icon { position: absolute; left: 0.75rem; opacity: 0.5; font-size: 0.9rem; }
    .search-box input { padding-left: 2.25rem; width: 100%; }
    
    .mini-stats-row { display: flex; gap: 2rem; padding: 1rem 1.5rem; border-bottom: 1px solid var(--border-glass); flex-wrap: wrap; }
    .mini-stat { display: flex; flex-direction: column; gap: 0.15rem; }
    .mini-stat .label { font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em; font-weight: 600; }
    .mini-stat .val { font-size: 1.1rem; }

    .table-container { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; text-align: left; }
    .data-table th { padding: 1rem 1.5rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 600; border-bottom: 1px solid var(--border-glass); white-space: nowrap; }
    .data-table td { padding: 1rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); vertical-align: middle; }
    .table-row.banned { background: rgba(239, 68, 68, 0.05); }
    .table-row.inactive { opacity: 0.7; }
    .table-row:last-child td { border-bottom: none; }
    
    .sort-btn { display: inline-flex; align-items: center; gap: 0.25rem; font-weight: inherit; text-transform: inherit; color: inherit; letter-spacing: inherit; }
    .sort-btn:hover { color: var(--text-main); }
    .sort-btn.active { color: var(--accent); }
    
    .user-identity { display: flex; flex-direction: column; gap: 0.15rem; }
    .user-name { font-size: 0.8rem; color: var(--text-muted); }
    .status-cell { display: flex; flex-direction: column; gap: 0.25rem; align-items: flex-start; }
    .action-buttons { display: flex; gap: 0.5rem; align-items: center; justify-content: flex-end; }
    
    .pagination-bar { padding: 1rem 1.5rem; border-top: 1px solid var(--border-glass); display: flex; justify-content: center; gap: 0.5rem; }
    .page-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-weight: 600; border: 1px solid var(--border-glass); background: rgba(0,0,0,0.2); }
    .page-btn:hover { background: rgba(255,255,255,0.1); }
    .page-btn.active { background: var(--accent); color: #000; border-color: var(--accent); }
    
    .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem 1rem; color: var(--text-muted); text-align: center; gap: 0.5rem; }
    .empty-state .empty-icon { font-size: 2rem; opacity: 0.5; margin-bottom: 0.5rem; }
    .empty-state.tiny { padding: 1.5rem 1rem; }
    
    /* LISTS & GRIDS (Bugs, Parser, Cache) */
    .list-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; padding: 1.5rem; }
    .list-grid.single-col { grid-template-columns: 1fr; }
    .report-card, .grid-card { display: flex; flex-direction: column; padding: 1.25rem; gap: 0.75rem; }
    .card-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
    .card-title { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; font-size: 1.1rem; }
    .card-actions { display: flex; gap: 0.5rem; align-items: center; }
    .report-url { font-size: 0.85rem; word-break: break-all; }
    .report-desc { color: var(--text-main); line-height: 1.5; margin: 0; font-size: 0.95rem; }
    .report-desc.bold { font-weight: 600; font-size: 1rem; }
    .chips-row { display: flex; flex-wrap: wrap; gap: 0.4rem; }
    
    .code-details { background: rgba(0,0,0,0.2); border-radius: 8px; border: 1px solid var(--border-glass); overflow: hidden; }
    .code-details summary { padding: 0.75rem 1rem; cursor: pointer; user-select: none; font-size: 0.85rem; font-weight: 600; background: rgba(255,255,255,0.02); }
    .code-details summary:hover { background: rgba(255,255,255,0.05); }
    .code-blocks { padding: 1rem; display: flex; flex-direction: column; gap: 1rem; border-top: 1px solid var(--border-glass); }
    .code-pane strong { display: block; margin-bottom: 0.5rem; font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); }
    .code-pane pre { margin: 0; padding: 1rem; background: #000; border-radius: 6px; font-family: monospace; font-size: 0.8rem; overflow-x: auto; color: #a5b4fc; }
    
    .hash-text { font-family: monospace; color: var(--accent); background: rgba(56,189,248,0.1); padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.8rem; }
    .date-text { font-size: 0.8rem; color: var(--text-muted); }
    .meta-row { display: flex; justify-content: space-between; align-items: center; }
    .answer-box { background: rgba(16,185,129,0.1); border-left: 3px solid var(--success); padding: 0.75rem; border-radius: 0 6px 6px 0; display: flex; gap: 0.5rem; }
    .answer-label { font-weight: 800; color: var(--success); }
    .answer-text { color: #f8fafc; font-weight: 500; word-break: break-word; }

    /* SUPPORT INBOX */
    .support-tab { display: flex; flex-direction: column; height: calc(100vh - 180px); }
    .support-stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1rem; }
    .support-stats-row .mini-stat { padding: 1rem; display: flex; flex-direction: column; gap: 0.25rem; border-radius: 12px; }
    .support-stats-row .mini-stat.tone-warn { border-bottom: 3px solid var(--warning); }
    .support-stats-row .mini-stat.tone-ok { border-bottom: 3px solid var(--success); }
    
    .support-layout { display: flex; gap: 1rem; flex: 1; min-height: 0; }
    .inbox-list { width: 350px; display: flex; flex-direction: column; flex-shrink: 0; }
    .inbox-search { display: flex; padding: 1rem; gap: 0.5rem; border-bottom: 1px solid var(--border-glass); background: rgba(0,0,0,0.1); }
    .inbox-search input { flex: 1; min-width: 0; }
    .messages-scroll { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
    .msg-item { display: flex; gap: 1rem; padding: 1rem; border-bottom: 1px solid var(--border-glass); text-align: left; }
    .msg-item.active { background: rgba(56,189,248,0.1); border-left: 3px solid var(--accent); }
    .msg-item.unread .msg-subject { font-weight: 800; color: #fff; }
    .msg-avatar { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
    .msg-content { display: flex; flex-direction: column; gap: 0.25rem; min-width: 0; flex: 1; }
    .msg-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; }
    .msg-subject { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .msg-sender { font-size: 0.8rem; color: var(--text-muted); }
    .msg-preview { font-size: 0.85rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .msg-meta { display: flex; justify-content: space-between; align-items: center; margin-top: 0.25rem; }
    
    .inbox-detail { flex: 1; display: flex; flex-direction: column; overflow-y: auto; }
    .detail-header { padding: 1.5rem; border-bottom: 1px solid var(--border-glass); display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
    .header-main { display: flex; flex-direction: column; gap: 0.5rem; }
    .header-main h3 { margin: 0; font-size: 1.5rem; }
    .source-pill { align-self: flex-start; background: var(--accent-glow); color: var(--accent); }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 0.5rem; }
    .meta-item { display: flex; flex-direction: column; font-size: 0.85rem; }
    .meta-item span { color: var(--text-muted); text-transform: uppercase; font-size: 0.7rem; }
    
    .linked-user-card { margin: 1.5rem; padding: 1.25rem; background: rgba(56,189,248,0.05); border: 1px solid rgba(56,189,248,0.2); border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }
    .linked-user-card.empty { background: rgba(239,68,68,0.05); border-color: rgba(239,68,68,0.2); justify-content: flex-start; }
    .user-info { display: flex; flex-direction: column; gap: 0.25rem; }
    .user-badges { display: flex; gap: 0.5rem; margin-top: 0.25rem; }
    .user-actions { display: flex; flex-direction: column; gap: 0.5rem; }
    
    .message-body { padding: 0 1.5rem 1.5rem; font-size: 0.95rem; line-height: 1.6; }
    .message-body p { margin: 0 0 1rem; }
    
    .replies-section { padding: 1.5rem; border-top: 1px solid var(--border-glass); }
    .replies-section h4 { margin: 0 0 1rem; font-size: 0.9rem; text-transform: uppercase; color: var(--text-muted); }
    .reply-card { background: rgba(255,255,255,0.03); border-radius: 8px; padding: 1rem; margin-bottom: 1rem; border-left: 3px solid var(--accent); }
    .reply-head { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
    .reply-body p { margin: 0 0 0.5rem; font-size: 0.9rem; line-height: 1.5; }
    
    .reply-composer { padding: 1.5rem; border-top: 1px solid var(--border-glass); background: rgba(0,0,0,0.1); }
    .reply-composer h4 { margin: 0 0 0.75rem; font-size: 0.9rem; }
    .reply-composer textarea { width: 100%; resize: vertical; margin-bottom: 1rem; }

    /* MODALS */
    .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; }
    .modal-card { width: 100%; max-width: 600px; display: flex; flex-direction: column; max-height: 90vh; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
    .modal-card.small { max-width: 400px; }
    .modal-card.large { max-width: 800px; }
    .modal-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border-glass); display: flex; justify-content: space-between; align-items: center; }
    .modal-header h3 { margin: 0; font-size: 1.25rem; }
    .modal-body { padding: 1.5rem; overflow-y: auto; }
    
    .detail-row { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.25rem; }
    .detail-row .label { font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; }
    .detail-box { background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-glass); line-height: 1.5; font-family: monospace; white-space: pre-wrap; word-break: break-all; }
    .detail-box.highlight { border-color: var(--success); color: var(--success); background: rgba(16,185,129,0.05); }
    .options-list { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
    .options-list li { background: rgba(255,255,255,0.05); padding: 0.75rem 1rem; border-radius: 6px; border: 1px solid var(--border-glass); }
    
    .mega-val { font-size: 3rem; line-height: 1; }
    
    /* SPINNERS */
    .loading-spinner { width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.1); border-top-color: var(--accent); border-radius: 50%; animation: spin 1s linear infinite; }
    .loading-spinner.center { margin: 2rem auto; width: 40px; height: 40px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    
    /* SCROLLBARS */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
  \`]
})`;

// REPLACE LOGIC
const updatedCode = adminCode.substring(0, tStart) + 
                    newTemplate + 
                    newStyles +
                    adminCode.substring(sEnd + 5);

fs.writeFileSync('admin_template.html', newTemplate); fs.writeFileSync('admin_styles.css', newStyles);
console.log("Admin rewrite applied successfully.");
