import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-admin-errors',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="admin-panel glass">
      <div class="panel-head">
        <div>
          <p class="eyebrow">Errors</p>
          <h2>Client Errors</h2>
        </div>
        <button class="btn btn-outline" type="button" (click)="loadErrors()">Refresh</button>
      </div>
      
      <div class="table-scroll">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>User</th>
              <th>Version</th>
              <th>Message</th>
              <th>Stack</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let err of errors()">
              <td>{{ formatDate(err.createdAt || err.date) }}</td>
              <td>{{ err.userId || err.email || 'Anonymous' }}</td>
              <td>{{ err.version || '-' }}</td>
              <td><strong>{{ err.message }}</strong></td>
              <td><pre style="font-size: 0.75rem; max-height: 100px; overflow: auto; max-width: 400px; white-space: pre-wrap;">{{ err.stack || '-' }}</pre></td>
            </tr>
            <tr *ngIf="!errors().length">
              <td colspan="5" class="empty-cell" style="text-align: center; padding: 3rem;">No client errors.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `
})
export class AdminErrorsComponent implements OnInit {
  @Input() api!: (endpoint: string, options?: RequestInit) => Promise<any>;
  
  errors = signal<any[]>([]);

  ngOnInit() {
    this.loadErrors();
  }

  async loadErrors() {
    if (!this.api) return;
    const res = await this.api('/api/admin/client-errors');
    if (res && res.success !== false) {
      this.errors.set(Array.isArray(res) ? res : (res.errors || []));
    }
  }
  
  formatDate(dateStr: string) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString();
  }
}
