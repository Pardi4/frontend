import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './admin.component';

type ProfileTab = 'overview' | 'security' | 'questions';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="a-section anim-in">
  <div class="a-card">

    <!-- Filters -->
    <div class="a-filters">
      <div class="a-search-wrap" style="flex:1;min-width:200px">
        <span class="a-search-ico">🔍</span>
        <input class="a-input" [(ngModel)]="search" (keyup.enter)="load()" placeholder="Szukaj email lub nazwy...">
      </div>
      <select class="a-select" [(ngModel)]="sort" (ngModelChange)="load()" style="max-width:180px">
        <option value="createdAt_desc">Najnowsi</option>
        <option value="createdAt_asc">Najstarsi</option>
        <option value="credits_desc">Najwięcej kredytów</option>
        <option value="credits_asc">Najmniej kredytów</option>
        <option value="lastOnline_desc">Ostatnio online</option>
        <option value="lastOnline_asc">Najdłużej offline</option>
        <option value="questions_desc">Najwięcej pytań</option>
        <option value="streak_desc">Najwyższa seria</option>
      </select>
      <button class="a-btn a-btn-primary a-btn-sm" (click)="load()" [disabled]="loading()">Szukaj</button>
      <button class="a-btn a-btn-ghost a-btn-sm" *ngIf="search" (click)="search='';load()">✕ Wyczyść</button>
      <button class="a-btn a-btn-ghost a-btn-sm" (click)="exportCsv()" title="Eksport CSV">⬇ CSV</button>
    </div>

    <!-- Stats strip -->
    <div style="padding:10px 20px;border-bottom:1px solid var(--border);display:flex;gap:20px;font-size:12px;color:var(--text-3)">
      <span>Łącznie: <strong class="ta">{{ pagination().total }}</strong></span>
      <span>Strona: <strong>{{ pagination().page }}/{{ pagination().pages }}</strong></span>
      <span>Aktywnych: <strong class="ts">{{ activeCount() }}</strong></span>
    </div>

    <!-- Table -->
    <div class="a-table-wrap" *ngIf="!loading() || users().length">
      <table class="a-table">
        <thead>
          <tr>
            <th>Użytkownik</th>
            <th>Rola</th>
            <th>Kredyty</th>
            <th>Pytania</th>
            <th>Seria</th>
            <th>Status</th>
            <th>Ostatnio</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let u of users()" style="cursor:pointer" (click)="openProfile(u)">
            <td>
              <div style="display:flex;align-items:center;gap:10px">
                <div [style]="avatarStyle(u)" style="width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0">
                  {{ initials(u) }}
                </div>
                <div style="min-width:0">
                  <div class="bold trunc" style="max-width:180px">{{ u.displayName || u.email }}</div>
                  <div class="xs t3 trunc" *ngIf="u.displayName">{{ u.email }}</div>
                  <div class="xs" style="display:flex;gap:4px;margin-top:2px">
                    <span *ngFor="let pr of (u.authProviders || [])" class="a-badge a-badge-muted" style="font-size:9px;padding:1px 5px">{{ providerIcon(pr) }} {{ pr }}</span>
                  </div>
                </div>
              </div>
            </td>
            <td>
              <span class="a-badge" [class]="u.role === 'admin' ? 'a-badge-accent' : 'a-badge-muted'">{{ u.role }}</span>
            </td>
            <td class="bold tc">{{ u.credits }}</td>
            <td class="t2">{{ u.stats?.totalQuestionsSolved || 0 }}</td>
            <td class="t2">{{ u.streak?.current || 0 }}</td>
            <td>
              <span class="a-badge" [class]="statusClass(u)">{{ statusLabel(u) }}</span>
            </td>
            <td class="xs t3">{{ p.formatDate(u.extensionLastSeenAt) }}</td>
            <td>
              <div style="display:flex;gap:4px;flex-wrap:wrap" (click)="$event.stopPropagation()">
                <button class="a-btn a-btn-success a-btn-sm" (click)="openGrant(u)" title="Dodaj kredyty">+</button>
                <button class="a-btn a-btn-danger a-btn-sm" *ngIf="!u.isBanned" (click)="banUser(u)" title="Zbanuj">Ban</button>
                <button class="a-btn a-btn-secondary a-btn-sm" *ngIf="u.isBanned" (click)="unbanUser(u)" title="Odbanuj">Unban</button>
                <button class="a-btn a-btn-danger a-btn-sm" (click)="deleteUser(u)" title="Usuń">🗑</button>
              </div>
            </td>
          </tr>
          <tr *ngIf="!loading() && !users().length">
            <td colspan="8" class="a-table-empty">Brak użytkowników.</td>
          </tr>
          <tr *ngIf="loading() && !users().length">
            <td colspan="8" class="a-table-empty">Ładowanie...</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="a-pager">
      <span class="t3 sm">Strona {{ pagination().page }} z {{ pagination().pages }} · łącznie {{ pagination().total }}</span>
      <div class="a-pager-btns">
        <button class="a-btn a-btn-secondary a-btn-sm" [disabled]="pagination().page <= 1 || loading()" (click)="prevPage()">←</button>
        <button class="a-btn a-btn-secondary a-btn-sm" [disabled]="pagination().page >= pagination().pages || loading()" (click)="nextPage()">→</button>
      </div>
    </div>
  </div>
</div>

<!-- ══════════════════════════════════════════
     USER PROFILE PANEL (full-screen modal)
     ══════════════════════════════════════════ -->
<div class="a-backdrop" *ngIf="profileUser()" (click)="closeProfile()" style="align-items:stretch;padding:0">
  <div class="a-modal a-modal-xl" (click)="$event.stopPropagation()"
    style="max-width:900px;width:100%;border-radius:var(--radius-lg);margin:auto;max-height:96vh;display:flex;flex-direction:column">

    <!-- Profile header -->
    <div class="a-modal-header" style="flex-shrink:0">
      <div style="display:flex;align-items:center;gap:14px">
        <div [style]="avatarStyle(profileUser())" style="width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:18px;flex-shrink:0">
          {{ initials(profileUser()) }}
        </div>
        <div>
          <div class="bold" style="font-size:16px">{{ profileUser()?.displayName || profileUser()?.email }}</div>
          <div class="xs t3" *ngIf="profileUser()?.displayName">{{ profileUser()?.email }}</div>
          <div style="display:flex;gap:5px;margin-top:4px;flex-wrap:wrap">
            <span class="a-badge" [class]="profileUser()?.role === 'admin' ? 'a-badge-accent' : 'a-badge-muted'">{{ profileUser()?.role }}</span>
            <span class="a-badge" [class]="statusClass(profileUser())">{{ statusLabel(profileUser()) }}</span>
            <span *ngFor="let pr of (profileUser()?.authProviders || [])" class="a-badge a-badge-outline">{{ providerIcon(pr) }} {{ pr }}</span>
            <span class="a-badge a-badge-success" *ngIf="profileUser()?.emailVerified">✓ Email zweryfikowany</span>
            <span class="a-badge a-badge-warning" *ngIf="!profileUser()?.emailVerified">⚠ Email niezweryfikowany</span>
          </div>
        </div>
      </div>
      <div style="display:flex;gap:6px;align-items:center;flex-shrink:0">
        <button class="a-btn a-btn-success a-btn-sm" (click)="openGrant(profileUser())">➕ Kredyty</button>
        <button class="a-btn a-btn-danger a-btn-sm" *ngIf="!profileUser()?.isBanned" (click)="banUser(profileUser())">Ban</button>
        <button class="a-btn a-btn-secondary a-btn-sm" *ngIf="profileUser()?.isBanned" (click)="unbanUser(profileUser())">Unban</button>
        <button class="a-modal-x" (click)="closeProfile()">✕</button>
      </div>
    </div>

    <!-- Profile tabs -->
    <div class="a-tabs" style="flex-shrink:0">
      <button class="a-tab" [class.active]="profileTab() === 'overview'"  (click)="profileTab.set('overview')">📋 Profil</button>
      <button class="a-tab" [class.active]="profileTab() === 'security'"  (click)="profileTab.set('security')">🔐 Bezpieczeństwo</button>
      <button class="a-tab" [class.active]="profileTab() === 'questions'" (click)="switchToQuestions()">
        📚 Historia pytań
        <span class="a-tab-cnt" *ngIf="historyPag().total > 0">{{ historyPag().total }}</span>
      </button>
    </div>

    <!-- Tab content -->
    <div style="flex:1;overflow-y:auto;min-height:0">

      <!-- ── OVERVIEW TAB ── -->
      <div *ngIf="profileTab() === 'overview'" style="padding:20px;display:flex;flex-direction:column;gap:16px">

        <!-- Stats row -->
        <div class="a-stats-grid">
          <div class="a-stat">
            <div class="a-stat-label">Kredyty</div>
            <div class="a-stat-value cyan">{{ profileUser()?.credits }}</div>
          </div>
          <div class="a-stat">
            <div class="a-stat-label">Pytania rozwiązane</div>
            <div class="a-stat-value">{{ profileUser()?.stats?.totalQuestionsSolved || 0 }}</div>
          </div>
          <div class="a-stat">
            <div class="a-stat-label">Seria (obecna)</div>
            <div class="a-stat-value accent">{{ profileUser()?.streak?.current || 0 }}</div>
          </div>
          <div class="a-stat">
            <div class="a-stat-label">Seria (rekord)</div>
            <div class="a-stat-value">{{ profileUser()?.streak?.longest || 0 }}</div>
          </div>
        </div>

        <!-- Two-column details -->
        <div class="a-grid-2" style="gap:12px">

          <!-- Account info -->
          <div class="a-card">
            <div class="a-card-header" style="padding:12px 16px">
              <div class="a-card-title" style="font-size:13px">Informacje o koncie</div>
            </div>
            <div style="padding:0">
              <table style="width:100%;font-size:13px;border-collapse:collapse">
                <tr *ngFor="let row of accountRows()">
                  <td style="padding:8px 16px;color:var(--text-3);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--border);width:40%;white-space:nowrap">{{ row.label }}</td>
                  <td style="padding:8px 16px;border-bottom:1px solid var(--border)">
                    <span [class]="row.cls || ''">{{ row.value }}</span>
                  </td>
                </tr>
              </table>
            </div>
          </div>

          <!-- Extension info -->
          <div class="a-card">
            <div class="a-card-header" style="padding:12px 16px">
              <div class="a-card-title" style="font-size:13px">Aktywność rozszerzenia</div>
            </div>
            <div style="padding:0">
              <table style="width:100%;font-size:13px;border-collapse:collapse">
                <tr *ngFor="let row of extensionRows()">
                  <td style="padding:8px 16px;color:var(--text-3);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--border);width:40%;white-space:nowrap">{{ row.label }}</td>
                  <td style="padding:8px 16px;border-bottom:1px solid var(--border)">
                    <a *ngIf="row.isLink && row.value !== '—'" [href]="row.value" target="_blank" rel="noopener" class="tc xs break">{{ row.value }}</a>
                    <span *ngIf="!row.isLink" [class]="row.cls || ''">{{ row.value }}</span>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>

        <!-- Pending changes warning -->
        <div *ngIf="profileUser()?.pendingNewEmail" style="padding:12px 16px;background:var(--warning-bg);border:1px solid rgba(245,158,11,.3);border-radius:var(--radius);display:flex;gap:10px;align-items:flex-start">
          <span style="font-size:18px;flex-shrink:0">⏳</span>
          <div>
            <div class="bold tw">Oczekująca zmiana emaila</div>
            <div class="xs t2 mt-3">Nowy email: <strong>{{ profileUser()?.pendingNewEmail }}</strong> — jeszcze niezweryfikowany</div>
          </div>
        </div>

        <!-- Deletion scheduled warning -->
        <div *ngIf="profileUser()?.accountDeletionScheduledAt" style="padding:12px 16px;background:var(--danger-bg);border:1px solid rgba(239,68,68,.3);border-radius:var(--radius);display:flex;gap:10px;align-items:flex-start">
          <span style="font-size:18px;flex-shrink:0">🗑️</span>
          <div>
            <div class="bold td">Konto zaplanowane do usunięcia</div>
            <div class="xs t2 mt-3">Usunięcie: <strong>{{ p.formatDate(profileUser()?.accountDeletionScheduledAt, true) }}</strong></div>
          </div>
        </div>

      </div>

      <!-- ── SECURITY TAB ── -->
      <div *ngIf="profileTab() === 'security'" style="padding:20px">

        <!-- Auth providers -->
        <div class="a-card" style="margin-bottom:16px">
          <div class="a-card-header" style="padding:12px 16px">
            <div class="a-card-title" style="font-size:13px">Metody logowania</div>
          </div>
          <div style="padding:16px;display:flex;flex-direction:column;gap:10px">
            <div *ngFor="let pr of (profileUser()?.authProviders || [])"
              style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--surface-2);border-radius:var(--radius-sm);border:1px solid var(--border)">
              <span style="font-size:20px">{{ providerIcon(pr) }}</span>
              <div>
                <div class="bold">{{ providerName(pr) }}</div>
                <div class="xs t3">{{ pr === 'email' ? profileUser()?.email : 'Połączone z kontem zewnętrznym' }}</div>
              </div>
              <span class="a-badge a-badge-success" style="margin-left:auto">Aktywne</span>
            </div>
            <div *ngIf="!profileUser()?.authProviders?.length" class="xs t3">Brak zarejestrowanych metod logowania.</div>
          </div>
        </div>

        <!-- Security logs -->
        <div class="a-card">
          <div class="a-card-header" style="padding:12px 16px">
            <div class="a-card-title" style="font-size:13px">Historia zmian bezpieczeństwa</div>
            <span class="xs t3">{{ (profileUser()?.securityLogs || []).length }} wpisów</span>
          </div>
          <div *ngIf="!(profileUser()?.securityLogs?.length)" style="padding:32px;text-align:center;color:var(--text-3);font-size:13px">
            Brak historii zmian bezpieczeństwa.
          </div>
          <div *ngIf="profileUser()?.securityLogs?.length" style="padding:0">
            <div *ngFor="let log of (profileUser()?.securityLogs || [])"
              style="display:flex;align-items:flex-start;gap:14px;padding:12px 16px;border-bottom:1px solid var(--border)">
              <div style="width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0"
                [style.background]="securityLogBg(log.event)">
                {{ securityLogIcon(log.event) }}
              </div>
              <div style="flex:1;min-width:0">
                <div class="bold sm">{{ securityLogLabel(log.event) }}</div>
                <div class="xs t3 mt-3" *ngIf="log.ip">IP: {{ log.ip }}</div>
                <div class="xs t3" *ngIf="log.details">{{ log.details }}</div>
                <div class="xs t3" *ngIf="log.newEmail">Nowy email: <strong>{{ log.newEmail }}</strong></div>
              </div>
              <span class="xs t3" style="flex-shrink:0;white-space:nowrap">{{ p.formatDate(log.at, true) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── QUESTIONS TAB ── -->
      <div *ngIf="profileTab() === 'questions'">

        <!-- Search questions -->
        <div class="a-filters" style="border-top:none">
          <div class="a-search-wrap" style="flex:1;min-width:180px">
            <span class="a-search-ico">🔍</span>
            <input class="a-input" [(ngModel)]="qSearch" (keyup.enter)="loadQuestions(1)" placeholder="Szukaj treści pytania...">
          </div>
          <button class="a-btn a-btn-secondary a-btn-sm" (click)="loadQuestions(1)" [disabled]="historyLoading()">Szukaj</button>
          <span class="xs t3">Łącznie: {{ historyPag().total }}</span>
        </div>

        <div *ngIf="historyLoading()" style="padding:40px;text-align:center;color:var(--text-3)">Ładowanie...</div>

        <!-- Questions list -->
        <div *ngIf="!historyLoading() && historyQuestions().length === 0" style="padding:40px;text-align:center;color:var(--text-3)">
          Brak historii pytań.
        </div>

        <div *ngIf="!historyLoading() && historyQuestions().length">
          <div *ngFor="let q of historyQuestions()"
            class="a-err-item"
            [class.unread]="selectedQuestion()?.id === q.id"
            style="cursor:pointer"
            (click)="selectQuestion(q)">
            <div class="a-err-meta">
              <div style="flex:1;min-width:0">
                <div class="bold sm trunc" style="max-width:100%">{{ q.questionText }}</div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:5px">
                  <span class="a-badge a-badge-muted">{{ q.questionType }}</span>
                  <span class="a-badge a-badge-outline" *ngIf="q.platform">{{ q.platform }}</span>
                  <span class="a-badge a-badge-cyan" *ngIf="q.seenCount > 1">{{ q.seenCount }}× seen</span>
                </div>
              </div>
              <div style="text-align:right;flex-shrink:0">
                <div class="xs t3">{{ p.formatDate(q.lastSeenAt) }}</div>
                <div class="xs ta bold mt-3" *ngIf="q.answerText">✓ Odpowiedź dostępna</div>
              </div>
            </div>

            <!-- Expanded question detail -->
            <div *ngIf="selectedQuestion()?.id === q.id" style="margin-top:12px;padding:14px;background:var(--surface-2);border-radius:var(--radius);border:1px solid var(--border)"
              (click)="$event.stopPropagation()">

              <!-- Full question text -->
              <div class="a-label" style="margin-bottom:6px">Treść pytania</div>
              <div class="sm" style="line-height:1.7;color:var(--text-2);white-space:pre-wrap;margin-bottom:12px">{{ q.questionText }}</div>

              <!-- Answer -->
              <div *ngIf="q.answerText" style="padding:10px 14px;background:var(--success-bg);border:1px solid rgba(34,197,94,.2);border-radius:var(--radius-sm);margin-bottom:12px">
                <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--success);margin-bottom:4px">Odpowiedź</div>
                <div class="sm bold">{{ q.answerText }}</div>
              </div>

              <!-- Options -->
              <div *ngIf="q.options?.length" style="margin-bottom:12px">
                <div class="a-label" style="margin-bottom:6px">Opcje ({{ q.options.length }})</div>
                <div style="display:flex;flex-direction:column;gap:3px">
                  <div *ngFor="let opt of q.options; let i = index"
                    style="padding:5px 10px;border-radius:4px;font-size:12px"
                    [style.background]="q.answerText?.includes(opt) ? 'var(--success-bg)' : 'var(--surface-3)'"
                    [style.color]="q.answerText?.includes(opt) ? 'var(--success)' : 'var(--text-2)'">
                    {{ i + 1 }}. {{ opt }}
                    <strong *ngIf="q.answerText?.includes(opt)"> ✓</strong>
                  </div>
                </div>
              </div>

              <!-- Explanation -->
              <details class="a-det" *ngIf="q.explanation" style="margin-bottom:12px">
                <summary>Wyjaśnienie</summary>
                <div class="sm t2" style="margin-top:8px;line-height:1.6;padding-left:14px">{{ q.explanation }}</div>
              </details>

              <!-- Metadata row -->
              <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
                <span class="a-badge a-badge-muted">Typ: {{ q.questionType }}</span>
                <span class="a-badge a-badge-muted" *ngIf="q.platform">Platforma: {{ q.platform }}</span>
                <span class="a-badge a-badge-cyan">Seen: {{ q.seenCount }}</span>
                <span class="a-badge a-badge-muted" *ngIf="q.explainCount">Explain: {{ q.explainCount }}</span>
                <span class="a-badge a-badge-accent" *ngIf="q.cachedAnswerId">Zakeszowane</span>
              </div>

              <!-- Source URL -->
              <div *ngIf="q.sourceUrl" style="margin-bottom:10px">
                <div class="a-label" style="margin-bottom:4px">Źródło (URL pytania)</div>
                <a [href]="q.sourceUrl" target="_blank" rel="noopener"
                  style="font-size:12px;color:var(--cyan);text-decoration:none;word-break:break-all;display:block;padding:6px 10px;background:var(--surface-3);border-radius:4px">
                  🔗 {{ q.sourceUrl }}
                </a>
              </div>

              <!-- Timestamps -->
              <div style="display:flex;gap:20px;font-size:11px;color:var(--text-3);margin-bottom:10px;flex-wrap:wrap">
                <div>Pierwsza sesja: <strong>{{ p.formatDate(q.createdAt, true) }}</strong></div>
                <div>Ostatnia sesja: <strong>{{ p.formatDate(q.lastSeenAt, true) }}</strong></div>
                <div *ngIf="q.lastExplainedAt">Ostatnie wyjaśnienie: <strong>{{ p.formatDate(q.lastExplainedAt, true) }}</strong></div>
              </div>

              <!-- Snapshot / code section -->
              <div *ngIf="q.htmlSnippet || q.parserSnapshot" style="margin-top:4px">
                <div class="a-label" style="margin-bottom:6px">Kod strony (snapshot)</div>
                <div class="a-stack" style="max-height:200px">{{ q.htmlSnippet || q.parserSnapshot?.htmlSnippet || '(brak)' }}</div>
              </div>

              <!-- Hash (diagnostic) -->
              <details class="a-det" style="margin-top:8px">
                <summary>Dane techniczne</summary>
                <div class="a-stack" style="margin-top:8px;max-height:100px">questionHash: {{ q.questionHash }}
cachedAnswerId: {{ q.cachedAnswerId || '—' }}
id: {{ q.id }}</div>
              </details>
            </div>
          </div>
        </div>

        <!-- Questions pagination -->
        <div class="a-pager" *ngIf="historyPag().pages > 1">
          <span class="t3 sm">Strona {{ historyPag().page }}/{{ historyPag().pages }} · łącznie {{ historyPag().total }}</span>
          <div class="a-pager-btns">
            <button class="a-btn a-btn-secondary a-btn-sm" [disabled]="historyPag().page <= 1" (click)="loadQuestions(historyPag().page - 1)">←</button>
            <button class="a-btn a-btn-secondary a-btn-sm" [disabled]="historyPag().page >= historyPag().pages" (click)="loadQuestions(historyPag().page + 1)">→</button>
          </div>
        </div>
      </div>

    </div><!-- end tab content -->
  </div>
</div>

<!-- ── GRANT MODAL ── -->
<div class="a-backdrop" *ngIf="grantUser()" (click)="grantUser.set(null)">
  <div class="a-modal" (click)="$event.stopPropagation()">
    <div class="a-modal-header">
      <div class="a-modal-title">➕ Dodaj kredyty — {{ grantUser()?.email }}</div>
      <button class="a-modal-x" (click)="grantUser.set(null)">✕</button>
    </div>
    <div class="a-modal-body">
      <p class="t2 sm mb-4">Aktualne kredyty: <strong class="tc">{{ grantUser()?.credits }}</strong></p>
      <div class="a-label mb-3">Szybkie granty</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px">
        <button *ngFor="let amt of [50,100,200,500]" class="a-btn a-btn-secondary" (click)="quickGrant(amt)" [disabled]="modalLoading()">
          +{{ amt }}
        </button>
      </div>
      <div class="a-label mb-3">Ręczne dodanie</div>
      <div class="a-input-row mb-3">
        <input class="a-input" type="number" [(ngModel)]="grantAmount" min="1" max="10000" placeholder="Ilość kredytów">
      </div>
      <input class="a-input mb-3" [(ngModel)]="grantReason" placeholder="Powód (opcjonalnie)">
    </div>
    <div class="a-modal-footer">
      <button class="a-btn a-btn-ghost" (click)="grantUser.set(null)">Anuluj</button>
      <button class="a-btn a-btn-primary" (click)="submitGrant()" [disabled]="modalLoading() || !grantAmount">
        {{ modalLoading() ? 'Dodawanie...' : 'Dodaj kredyty' }}
      </button>
    </div>
  </div>
</div>
  `
})
export class AdminUsersComponent implements OnInit {
  @Input() p!: AdminComponent;

  loading       = signal(false);
  modalLoading  = signal(false);
  historyLoading = signal(false);

  users       = signal<any[]>([]);
  pagination  = signal({ page: 1, pages: 1, total: 0, limit: 50 });
  activeCount = signal(0);

  search = '';
  sort   = 'createdAt_desc';
  page   = 1;

  // User profile panel
  profileUser     = signal<any>(null);
  profileTab      = signal<ProfileTab>('overview');
  selectedQuestion = signal<any>(null);

  // Questions history
  historyQuestions = signal<any[]>([]);
  historyPag       = signal({ page: 1, pages: 1, total: 0 });
  qSearch          = '';

  // Grant modal
  grantUser   = signal<any>(null);
  grantAmount = 0;
  grantReason = '';

  ngOnInit() { this.load(); }

  // ── List ──────────────────────────────────────────
  async load() {
    this.loading.set(true);
    const q = this.search ? `&search=${encodeURIComponent(this.search)}` : '';
    const res = await this.p.api(`/api/admin/users?page=${this.page}&limit=50&sort=${this.sort}${q}`);
    if (res.users) {
      this.users.set(res.users);
      this.pagination.set(res.pagination || { page: 1, pages: 1, total: 0, limit: 50 });
      const now = Date.now();
      this.activeCount.set(res.users.filter((u: any) =>
        u.isExtensionActive || (u.extensionLastSeenAt && now - new Date(u.extensionLastSeenAt).getTime() < 90000)
      ).length);
    }
    this.loading.set(false);
  }

  prevPage() { if (this.page > 1) { this.page--; this.load(); } }
  nextPage() { this.page++; this.load(); }

  // ── Profile panel ─────────────────────────────────
  async openProfile(u: any) {
    // fetch full user details
    const res = await this.p.api(`/api/admin/users/${u.id}`);
    this.profileUser.set(res.user || u);
    this.profileTab.set('overview');
    this.historyQuestions.set([]);
    this.historyPag.set({ page: 1, pages: 1, total: 0 });
    this.selectedQuestion.set(null);
    this.qSearch = '';
  }

  closeProfile() { this.profileUser.set(null); this.selectedQuestion.set(null); }

  switchToQuestions() {
    this.profileTab.set('questions');
    if (!this.historyQuestions().length && !this.historyLoading()) {
      this.loadQuestions(1);
    }
  }

  async loadQuestions(page: number) {
    const u = this.profileUser();
    if (!u) return;
    this.historyLoading.set(true);
    this.selectedQuestion.set(null);
    const q = this.qSearch ? `&q=${encodeURIComponent(this.qSearch)}` : '';
    const res = await this.p.api(`/api/admin/users/${u.id}/questions?page=${page}&limit=15${q}`);
    if (res.questions) {
      this.historyQuestions.set(res.questions);
      this.historyPag.set(res.pagination || { page: 1, pages: 1, total: 0 });
    }
    this.historyLoading.set(false);
  }

  selectQuestion(q: any) {
    this.selectedQuestion.set(this.selectedQuestion()?.id === q.id ? null : q);
  }

  // ── Computed info rows ────────────────────────────
  accountRows() {
    const u = this.profileUser();
    if (!u) return [];
    return [
      { label: 'ID',              value: u.id || u._id || '—' },
      { label: 'Email',           value: u.email },
      { label: 'Wyświetlana nazwa', value: u.displayName || '—' },
      { label: 'Rola',            value: u.role, cls: u.role === 'admin' ? 'ta bold' : '' },
      { label: 'Email weryfik.',  value: u.emailVerified ? '✓ Tak' : '✗ Nie', cls: u.emailVerified ? 'ts' : 'tw' },
      { label: 'Marketing opt-in', value: u.marketingConsent ? '✓ Tak' : 'Nie', cls: u.marketingConsent ? 'ts' : 't3' },
      { label: 'Konto założone',  value: this.p.formatDate(u.createdAt, true) },
      { label: 'Status konta',    value: u.isBanned ? 'ZBANOWANY' : 'Aktywne', cls: u.isBanned ? 'td bold' : 'ts' },
    ];
  }

  extensionRows() {
    const u = this.profileUser();
    if (!u) return [];
    return [
      { label: 'Aktywna teraz',   value: u.isExtensionActive ? '✓ Tak' : 'Nie', cls: u.isExtensionActive ? 'ts bold' : 't3' },
      { label: 'Ostatnio widziany', value: this.p.formatDate(u.extensionLastSeenAt, true) },
      { label: 'Ostatni URL',     value: u.extensionLastSeenUrl || '—', isLink: true },
      { label: 'Platforma',       value: u.extensionLastSeenPlatform || '—' },
      { label: 'Powód wyślij.',   value: u.extensionLastSeenReason || '—' },
    ];
  }

  // ── Security helpers ──────────────────────────────
  securityLogIcon(event: string): string {
    const map: Record<string, string> = {
      'email-changed': '✉️', 'password-changed': '🔑', 'password-reset': '🔓',
      'login-google': '🔵', 'login-email': '🔐', 'two-fa-enabled': '🛡️',
      'two-fa-disabled': '⚠️', 'account-created': '🆕', 'email-verified': '✅',
    };
    return map[event] || '📝';
  }

  securityLogBg(event: string): string {
    if (event?.includes('password')) return 'rgba(99,102,241,.15)';
    if (event?.includes('email'))    return 'rgba(34,211,238,.12)';
    if (event?.includes('login'))    return 'rgba(34,197,94,.12)';
    if (event?.includes('two-fa'))   return 'rgba(245,158,11,.12)';
    return 'var(--surface-3)';
  }

  securityLogLabel(event: string): string {
    const map: Record<string, string> = {
      'email-changed':     'Zmiana adresu email',
      'password-changed':  'Zmiana hasła',
      'password-reset':    'Reset hasła',
      'login-google':      'Logowanie przez Google',
      'login-email':       'Logowanie emailem/hasłem',
      'two-fa-enabled':    'Włączono weryfikację 2FA',
      'two-fa-disabled':   'Wyłączono weryfikację 2FA',
      'account-created':   'Konto założone',
      'email-verified':    'Email zweryfikowany',
    };
    return map[event] || event || 'Zdarzenie';
  }

  // ── Provider helpers ──────────────────────────────
  providerIcon(pr: string): string {
    return { google: '🔵', email: '✉️', facebook: '🔷', github: '⬛', apple: '🍎' }[pr] || '🔑';
  }

  providerName(pr: string): string {
    return { google: 'Google', email: 'Email + hasło', facebook: 'Facebook', github: 'GitHub', apple: 'Apple' }[pr] || pr;
  }

  // ── User helpers ──────────────────────────────────
  initials(u: any): string {
    if (!u) return '?';
    if (u.displayName) return u.displayName.charAt(0).toUpperCase();
    return u.email?.charAt(0).toUpperCase() || '?';
  }

  avatarStyle(u: any): string {
    if (!u) return '';
    const colors = [
      ['rgba(99,102,241,.25)', '#818cf8'],
      ['rgba(34,211,238,.2)',  '#22d3ee'],
      ['rgba(34,197,94,.2)',   '#22c55e'],
      ['rgba(245,158,11,.2)',  '#f59e0b'],
      ['rgba(239,68,68,.2)',   '#ef4444'],
    ];
    const hash = (u.email || '').split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0);
    const [bg, color] = colors[hash % colors.length];
    return `background:${bg};color:${color}`;
  }

  statusLabel(u: any): string {
    if (!u) return '';
    if (u.isBanned) return 'Zbanowany';
    if (u.isExtensionActive) return 'Aktywny';
    if (u.extensionLastSeenAt) return 'Widziany';
    return 'Offline';
  }

  statusClass(u: any): string {
    if (!u) return '';
    if (u.isBanned) return 'a-badge-danger';
    if (u.isExtensionActive) return 'a-badge-success';
    if (u.extensionLastSeenAt) return 'a-badge-cyan';
    return 'a-badge-muted';
  }

  // ── Grant ─────────────────────────────────────────
  openGrant(u: any) {
    this.grantUser.set(u);
    this.grantAmount = 0;
    this.grantReason = '';
  }

  async quickGrant(amount: number) {
    this.modalLoading.set(true);
    const u = this.grantUser();
    const res = await this.p.api(`/api/admin/users/${u.id}/quick-grant`, {
      method: 'POST', body: JSON.stringify({ amount })
    });
    if (res.success) {
      this.p.toast(`+${amount} kredytów → ${u.email}`, 'success');
      this.grantUser.set(null);
      this.load();
      // Update profile if open
      if (this.profileUser()?.id === u.id) {
        this.profileUser.update(pu => pu ? { ...pu, credits: (pu.credits || 0) + amount } : pu);
      }
    } else {
      this.p.toast(res.error || 'Błąd', 'error');
    }
    this.modalLoading.set(false);
  }

  async submitGrant() {
    if (!this.grantAmount || this.grantAmount <= 0) return;
    this.modalLoading.set(true);
    const u = this.grantUser();
    const res = await this.p.api(`/api/admin/users/${u.id}/grant-credits`, {
      method: 'POST', body: JSON.stringify({ credits: this.grantAmount, reason: this.grantReason })
    });
    if (res.success) {
      this.p.toast(`+${this.grantAmount} kredytów → ${u.email}`, 'success');
      this.grantUser.set(null);
      this.load();
      if (this.profileUser()?.id === u.id) {
        this.profileUser.update(pu => pu ? { ...pu, credits: (pu.credits || 0) + this.grantAmount } : pu);
      }
    } else {
      this.p.toast(res.error || 'Błąd', 'error');
    }
    this.modalLoading.set(false);
  }

  // ── Ban / Delete ──────────────────────────────────
  async banUser(u: any) {
    if (!confirm(`Zbanować użytkownika ${u.email}?`)) return;
    const res = await this.p.api(`/api/admin/users/${u.id}/ban`, { method: 'POST' });
    if (res.success) {
      this.p.toast(`Zbanowano ${u.email}`, 'warning');
      if (this.profileUser()?.id === u.id) this.profileUser.update(pu => pu ? { ...pu, isBanned: true } : pu);
      this.load();
    } else this.p.toast(res.error || 'Błąd', 'error');
  }

  async unbanUser(u: any) {
    const res = await this.p.api(`/api/admin/users/${u.id}/unban`, { method: 'POST' });
    if (res.success) {
      this.p.toast(`Odbanowano ${u.email}`, 'success');
      if (this.profileUser()?.id === u.id) this.profileUser.update(pu => pu ? { ...pu, isBanned: false } : pu);
      this.load();
    } else this.p.toast(res.error || 'Błąd', 'error');
  }

  async deleteUser(u: any) {
    if (!confirm(`Usunąć konto ${u.email}? Tej operacji nie można cofnąć!`)) return;
    const res = await this.p.api(`/api/admin/users/${u.id}`, { method: 'DELETE' });
    if (res.success) {
      this.p.toast(`Usunięto ${u.email}`, 'warning');
      this.closeProfile();
      this.load();
    } else this.p.toast(res.error || 'Błąd', 'error');
  }

  closeModals() { this.grantUser.set(null); }

  // ── CSV ───────────────────────────────────────────
  exportCsv() {
    const rows = this.users();
    if (!rows.length) return;
    const header = 'email,displayName,role,credits,questions,streak,status,lastSeen,createdAt';
    const lines = rows.map(u =>
      [u.email, u.displayName, u.role, u.credits, u.stats?.totalQuestionsSolved || 0,
       u.streak?.current || 0, this.statusLabel(u), u.extensionLastSeenAt || '', u.createdAt || ''].join(',')
    );
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([[header, ...lines].join('\n')], { type: 'text/csv' }));
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    this.p.toast('Eksport gotowy', 'success');
  }
}
