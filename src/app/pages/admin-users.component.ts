import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
            <section class="admin-panel glass">
              <div class="panel-head">
                <div>
                  <p class="eyebrow">{{ p.tr('users') }}</p>
                  <h2>{{ p.tr('accountsCredits') }}</h2>
                  <small class="panel-status" *ngIf="p.usersLoading()">{{ p.tr('loadingUsers') }}</small>
                </div>
                <form class="admin-search user-toolbar" (ngSubmit)="p.loadUsers(1)">
                  <input class="form-input" type="search" name="search" [(ngModel)]="p.userSearch" [placeholder]="p.tr('searchEmailName')">
                  <select class="form-select" name="userSort" [(ngModel)]="p.userSort" (ngModelChange)="p.loadUsers(1)" [attr.aria-label]="p.tr('sortUsers')">
                    <option *ngFor="let option of p.userSortOptions()" [value]="option.value">{{ option.label }}</option>
                  </select>
                  <button class="btn btn-primary" type="submit">{{ p.tr('search') }}</button>
                  <button class="btn btn-outline" type="button" *ngIf="p.hasUserFilters()" (click)="p.resetUserFilters()">{{ p.tr('clearUsersFilters') }}</button>
                  <button class="btn btn-outline" type="button" [disabled]="!p.users().length" (click)="p.exportVisibleUsersCsv()">{{ p.tr('exportVisibleUsers') }}</button>
                </form>
              </div>

              <div class="insight-grid">
                <article *ngFor="let card of p.usersSummaryCards()">
                  <span>{{ card.label }}</span>
                  <strong [class.ok]="card.ok" [class.warn]="card.warn">{{ card.value }}</strong>
                  <small>{{ card.note }}</small>
                </article>
              </div>

              <div class="table-scroll">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>{{ p.tr('user') }}</th>
                      <th>{{ p.tr('role') }}</th>
                      <th [attr.aria-sort]="p.userSortAria('credits')">
                        <button type="button" class="sort-header" [class.active]="p.userSortDirection('credits')" (click)="p.cycleUserSort('credits')">
                          <span>{{ p.tr('credits') }}</span>
                          <span class="sort-indicator" aria-hidden="true">{{ p.userSortIndicator('credits') }}</span>
                        </button>
                      </th>
                      <th [attr.aria-sort]="p.userSortAria('questions')">
                        <button type="button" class="sort-header" [class.active]="p.userSortDirection('questions')" (click)="p.cycleUserSort('questions')">
                          <span>{{ p.tr('questions') }}</span>
                          <span class="sort-indicator" aria-hidden="true">{{ p.userSortIndicator('questions') }}</span>
                        </button>
                      </th>
                      <th [attr.aria-sort]="p.userSortAria('streak')">
                        <button type="button" class="sort-header" [class.active]="p.userSortDirection('streak')" (click)="p.cycleUserSort('streak')">
                          <span>{{ p.tr('streak') }}</span>
                          <span class="sort-indicator" aria-hidden="true">{{ p.userSortIndicator('streak') }}</span>
                        </button>
                      </th>
                      <th [attr.aria-sort]="p.userSortAria('status')">
                        <button type="button" class="sort-header" [class.active]="p.userSortDirection('status')" (click)="p.cycleUserSort('status')">
                          <span>{{ p.tr('status') }}</span>
                          <span class="sort-indicator" aria-hidden="true">{{ p.userSortIndicator('status') }}</span>
                        </button>
                      </th>
                      <th>{{ p.tr('actions') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let user of p.users()" [class.user-active-row]="p.isUserExtensionActive(user)" [class.user-banned-row]="user.isBanned" [class.user-muted-row]="!user.isBanned && !p.isUserExtensionActive(user)">
                      <td class="user-cell">
                        <button type="button" class="link-button primary-link" (click)="p.openUserHistory(user)">{{ user.email }}</button>
                        <span>{{ user.email }}</span>
                      </td>
                      <td><span class="badge badge-outline role-badge">{{ user.role }}</span></td>
                      <td><strong class="metric-value">{{ user.role === 'admin' ? p.tr('unlimited') : user.credits }}</strong></td>
                      <td><strong class="metric-value">{{ user.stats?.totalQuestionsSolved || 0 }}</strong></td>
                      <td><strong class="metric-value">{{ user.streak?.current || 0 }}</strong></td>
                      <td>
                        <span class="status-pill" [class.danger]="user.isBanned" [class.pending]="!user.isBanned && !user.isExtensionActive">
                          {{ p.userStatusLabel(user) }}
                        </span>
                        <small class="muted-line">
                          {{ p.userExtensionLastSeen(user) }}
                        </small>
                      </td>
                      <td>
                        <div class="row-actions">
                          <button type="button" (click)="p.openUserHistory(user)" style="color: var(--accent-cyan);">{{ p.tr('history') }}</button>
                          <button type="button" (click)="p.copyUserEmail(user)">{{ p.tr('copyEmail') }}</button>
                          <button type="button" (click)="p.quickGrant(user.id, 50)">+50</button>
                          <button type="button" (click)="p.quickGrant(user.id, 100)">+100</button>
                          <button type="button" (click)="p.quickGrant(user.id, 200)">+200</button>
                          <button type="button" (click)="p.openGrantModal(user)">{{ p.tr('grant') }}</button>
                          <button type="button" (click)="user.isBanned ? p.unbanUser(user.id) : p.banUser(user.id)">
                            {{ user.isBanned ? p.tr('unban') : p.tr('ban') }}
                          </button>
                          <button type="button" class="danger" *ngIf="user.role !== 'admin'" (click)="p.deleteUser(user.id, user.email)">
                            {{ p.tr('delete') }}
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr *ngIf="!p.users().length">
                      <td colspan="7" class="empty-cell" style="text-align: center; padding: 3rem;">{{ p.tr('noUsers') }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="pagination" *ngIf="p.pagination().pages > 1">
                <button type="button" *ngFor="let page of p.pageNumbers()" [class.active]="page === p.pagination().page" (click)="p.loadUsers(page)">
                  {{ page }}
                </button>
              </div>
            </section>
  `
})
export class AdminUsersComponent {
  @Input() p!: any;
}
