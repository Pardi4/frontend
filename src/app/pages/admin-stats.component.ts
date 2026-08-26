import { CommonModule } from '@angular/common';
import { Component, Input, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-admin-stats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
            <section class="admin-panel glass">
              <div class="panel-head">
                <div>
                  <p class="eyebrow">{{ p.tr('system') }}</p>
                  <h2>{{ p.tr('healthCheck') }}</h2>
                </div>
              </div>
              <div class="health-grid">
                <article class="glass" *ngFor="let item of p.healthCards()">
                  <span class="text-secondary" style="font-size: 0.75rem; text-transform: uppercase;">{{ item.label }}</span>
                  <strong [class.ok]="item.ok" style="font-size: 1.35rem; margin-top: 0.25rem;">{{ item.value }}</strong>
                </article>
              </div>

              <!-- CHART START -->
              <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border);">
                <div class="panel-head" style="margin-bottom: 1rem;">
                  <div>
                    <h3 style="margin: 0.25rem 0 0; font-family: var(--font-heading); font-size: 1.15rem;">{{ p.tr('purchasesTitle') || 'Revenue & Signups (30 Days)' }}</h3>
                  </div>
                  <button class="btn btn-outline" type="button" (click)="loadChart()">Refresh</button>
                </div>
                <div class="glass" style="padding: 1rem; height: 350px;">
                  <canvas #chartCanvas></canvas>
                </div>
              </div>
              <!-- CHART END -->


              <div id="admin-billing-safety" style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border);">
                <div class="panel-head" style="margin-bottom: 1rem;">
                  <div>
                    <p class="eyebrow">{{ p.tr('billingSafety') }}</p>
                    <h3 style="margin: 0.25rem 0 0; font-family: var(--font-heading); font-size: 1.15rem;">{{ p.tr('creditDedupeMonitor') }}</h3>
                  </div>
                  <button class="btn btn-outline" type="button" (click)="p.loadBillingSafety()">{{ p.tr('refreshBilling') }}</button>
                </div>
                <div class="health-grid">
                  <article class="glass" *ngFor="let item of p.billingSafetyCards()">
                    <span class="text-secondary" style="font-size: 0.75rem; text-transform: uppercase;">{{ item.label }}</span>
                    <strong [class.ok]="item.ok" style="font-size: 1.35rem; margin-top: 0.25rem;">{{ item.value }}</strong>
                  </article>
                </div>

                <div class="admin-alert" *ngIf="(p.billingSafety().duplicateGroups || []).length" style="margin-top: 1rem;">
                  {{ p.tr('duplicateWarning') }}
                </div>

                <div class="table-scroll" *ngIf="(p.billingSafety().duplicateGroups || []).length" style="margin-top: 1rem;">
                  <table class="admin-table">
                    <thead>
                      <tr>
                        <th>{{ p.tr('user') }}</th>
                        <th>{{ p.tr('questionText') }}</th>
                        <th>{{ p.tr('questionHash') }}</th>
                        <th>{{ p.tr('charges') }}</th>
                        <th>{{ p.tr('actions') }}</th>
                        <th>{{ p.tr('lastCharged') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let group of p.billingSafety().duplicateGroups">
                        <td>
                          <button class="link-button primary-link" type="button" *ngIf="group.userId" (click)="p.openUserHistory({ id: group.userId, email: group.email || group.userId })" style="font-weight: bold; text-align: left;">
                            {{ group.email || group.userId }}
                          </button>
                          <strong *ngIf="!group.userId">{{ group.email || p.tr('unknownUser') }}</strong>
                        </td>
                        <td class="question-audit-cell">
                          <strong>{{ group.questionText || p.shortHash(group.questionHash) }}</strong>
                          <span *ngIf="group.answerText">{{ p.tr('answerSummary') }}: {{ group.answerText }}</span>
                          <span>{{ p.tr('duplicateReason') }}</span>
                        </td>
                        <td>{{ p.shortHash(group.questionHash) }}</td>
                        <td>
                          <strong>{{ group.count }} / {{ group.credits }} credits</strong>
                          <span>{{ p.tr('timeSpan') }}: {{ p.formatDurationMs(group.spanMs) }}</span>
                        </td>
                        <td>
                          <strong>{{ group.action || (group.actions || []).join(', ') }}</strong>
                          <span>{{ p.tr('firstCharged') }}: {{ p.formatDate(group.firstChargedAt) }}</span>
                        </td>
                        <td>
                          <strong>{{ p.formatDate(group.lastChargedAt) }}</strong>
                          <div class="row-actions" style="margin-top: 0.5rem;">
                            <button type="button" (click)="p.reviewDuplicateGroup(group)">{{ p.tr('reviewInLog') }}</button>
                            <button type="button" *ngIf="group.userId" (click)="p.openGrantModal({ id: group.userId, email: group.email || group.userId }, p.tr('possibleRefund'))">{{ p.tr('possibleRefund') }}</button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="empty-panel" *ngIf="!(p.billingSafety().duplicateGroups || []).length" style="text-align: center; padding: 1.25rem; margin-top: 1rem;">
                  <p class="text-secondary">{{ p.tr('noDuplicateGroups') }}</p>
                </div>

                <div class="credit-usage-panel">
                  <div class="panel-head" style="margin-bottom: 1rem;">
                    <div>
                      <p class="eyebrow">{{ p.tr('creditEvent') }}</p>
                      <h3 style="margin: 0.25rem 0 0; font-family: var(--font-heading); font-size: 1.15rem;">{{ p.tr('creditUsageLog') }}</h3>
                      <p class="text-secondary" style="margin: 0.4rem 0 0;">{{ p.tr('creditUsageDescription') }}</p>
                    </div>
                    <button class="btn btn-outline" type="button" (click)="p.loadBillingUsage(1)">{{ p.tr('refresh') }}</button>
                  </div>

                  <form class="admin-search credit-usage-filters" (ngSubmit)="p.loadBillingUsage(1)">
                    <input type="text" [(ngModel)]="p.billingUsageSearch" name="billingUsageSearch" [placeholder]="p.tr('searchCreditUsage')">
                    <select [(ngModel)]="p.billingUsageStatus" name="billingUsageStatus">
                      <option value="">{{ p.tr('allStatuses') }}</option>
                      <option value="charged">{{ p.tr('charged') }}</option>
                      <option value="claimed">{{ p.tr('claimed') }}</option>
                      <option value="waived">{{ p.tr('waived') }}</option>
                      <option value="aborted">{{ p.tr('aborted') }}</option>
                      <option value="declined">{{ p.tr('declined') }}</option>
                    </select>
                    <select [(ngModel)]="p.billingUsageAction" name="billingUsageAction">
                      <option value="">{{ p.tr('allActions') }}</option>
                      <option value="solve">solve</option>
                      <option value="solve-snapshot">solve-snapshot</option>
                      <option value="explain">explain</option>
                      <option value="follow-up">follow-up</option>
                    </select>
                    <button class="btn btn-primary" type="submit">{{ p.tr('search') }}</button>
                  </form>

                  <div class="health-grid credit-usage-summary">
                    <article class="glass">
                      <span>{{ p.tr('visibleEntries') }}</span>
                      <strong>{{ p.formatNumber(p.billingUsagePagination().total || 0) }}</strong>
                    </article>
                    <article class="glass">
                      <span>{{ p.tr('charged') }}</span>
                      <strong class="ok">{{ p.formatNumber(p.billingUsageSummary().chargedRecords || 0) }}</strong>
                    </article>
                    <article class="glass">
                      <span>{{ p.tr('chargedCredits') }}</span>
                      <strong class="ok">{{ p.formatNumber(p.billingUsageSummary().chargedCredits || 0) }}</strong>
                    </article>
                    <article class="glass">
                      <span>{{ p.tr('status') }}</span>
                      <strong>{{ p.billingUsageStatus ? p.creditUsageStatusLabel(p.billingUsageStatus) : p.tr('allStatuses') }}</strong>
                    </article>
                  </div>

                  <div class="table-scroll" style="margin-top: 1rem;">
                    <table class="admin-table credit-usage-table">
                      <thead>
                        <tr>
                          <th>{{ p.tr('questionText') }}</th>
                          <th>{{ p.tr('user') }}</th>
                          <th>{{ p.tr('creditEvent') }}</th>
                          <th>{{ p.tr('chargedCredits') }}</th>
                          <th>{{ p.tr('date') }}</th>
                          <th>{{ p.tr('actions') }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let item of p.billingUsageRows()">
                          <td class="question-audit-cell">
                            <strong>{{ item.questionText }}</strong>
                            <span *ngIf="item.answerText">{{ p.tr('answerSummary') }}: {{ item.answerText }}</span>
                            <span>{{ item.questionType || item.action }} - {{ p.shortHash(item.questionHash) }}</span>
                          </td>
                          <td>
                            <button type="button" class="link-button primary-link" *ngIf="item.userId" (click)="p.openUserHistory({ id: item.userId, email: item.email })" style="font-weight: bold; text-align: left;">
                              {{ item.email }}
                            </button>
                            <strong *ngIf="!item.userId">{{ item.email }}</strong>
                            <span></span>
                          </td>
                          <td>
                            <span class="status-pill" [class.ok]="p.creditUsageStatusClass(item.status) === 'ok'" [class.pending]="p.creditUsageStatusClass(item.status) === 'pending'" [class.danger]="p.creditUsageStatusClass(item.status) === 'danger'">
                              {{ p.creditUsageStatusLabel(item.status) }}
                            </span>
                            <span>{{ item.action }}</span>
                            <span *ngIf="item.waivedReason">{{ item.waivedReason }}</span>
                          </td>
                          <td>
                            <strong class="metric-value">{{ item.creditsCharged || 0 }}</strong>
                            <span>{{ p.tr('billableCredits') }}: {{ item.credits || 0 }}</span>
                          </td>
                          <td>{{ p.formatDate(item.time) }}</td>
                          <td>
                            <div class="row-actions">
                              <button type="button" (click)="p.showQuestionDetails(item)">{{ p.tr('viewQuestion') }}</button>
                            </div>
                          </td>
                        </tr>
                        <tr *ngIf="!p.billingUsageRows().length">
                          <td colspan="6" class="empty-cell">{{ p.tr('noCreditUsage') }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div class="pagination" *ngIf="p.billingUsagePagination().pages > 1">
                    <button type="button" *ngFor="let page of p.billingUsagePageNumbers()" [class.active]="page === p.billingUsagePagination().page" (click)="p.loadBillingUsage(page)">
                      {{ page }}
                    </button>
                  </div>
                </div>
              </div>
            </section>
  `
})
export class AdminStatsComponent implements AfterViewInit, OnDestroy {
  @Input() p!: any;
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart: Chart | null = null;

  ngAfterViewInit() {
    // Delay load chart slightly to allow view to settle
    setTimeout(() => this.loadChart(), 500);
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  async loadChart() {
    try {
      const res = await this.p.api('/api/admin/chart-stats');
      if (res.success) {
        this.renderChart(res.purchases || [], res.users || []);
      }
    } catch (err) {
      console.error('Failed to load chart stats', err);
    }
  }

  renderChart(purchases: any[], users: any[]) {
    if (this.chart) {
      this.chart.destroy();
    }

    if (!this.chartCanvas || !this.chartCanvas.nativeElement) return;
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Create a 30-day map
    const dates = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }

    const revenueMap = new Map(purchases.map((p: any) => [p._id, p.revenue]));
    const signupsMap = new Map(users.map((u: any) => [u._id, u.signups]));

    const revenueData = dates.map(d => revenueMap.get(d) || 0);
    const signupsData = dates.map(d => signupsMap.get(d) || 0);

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates.map(d => d.slice(5)), // MM-DD
        datasets: [
          {
            label: 'Revenue ($)',
            data: revenueData,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            yAxisID: 'y',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Signups',
            data: signupsData,
            borderColor: '#8b5cf6',
            backgroundColor: 'transparent',
            yAxisID: 'y1',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            labels: { color: '#9ca3af' }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#9ca3af' }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#9ca3af' }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: { color: '#9ca3af' }
          }
        }
      }
    });
  }
}
