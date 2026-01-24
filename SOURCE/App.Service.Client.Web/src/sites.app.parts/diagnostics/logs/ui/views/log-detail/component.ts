/**
 * Log Detail Component (Read)
 * 
 * Shows detailed view of a single log entry.
 * D-BREAST: Read (read-only detail view)
 * 
 * Route: /system/diagnostics/logs/:id
 */
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { LogService } from '../../../services/log.service';
import { LogEntryViewModel } from '../../../models/log-entry.view-model';
import { PageHeaderComponent } from '../../../../../../sites/ui/widgets/page-header';

@Component({
  selector: 'app-log-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, PageHeaderComponent],
  template: `
    <div class="container-fluid" style="max-width: 1000px; padding: 1.5rem;">
      @if (log()) {
        <!-- Standard Page Header -->
        <app-page-header 
          [title]="log()!.levelLabel + ' Log'"
          icon="bx-file"
          [iconBackground]="'bg-' + log()!.levelColor + '-subtle'"
          [iconClass]="'text-' + log()!.levelColor"
          [showBack]="true"
          [showBreadcrumb]="true">
          <ng-container subtitle>{{ log()!.source }} • {{ log()!.timestampDisplay }}</ng-container>
        </app-page-header>

        <!-- Log Details -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bx bx-info-circle me-2"></i>
              Log Details
            </h5>
          </div>
          <div class="card-body">
            <dl class="row mb-0">
              <dt class="col-sm-3">ID</dt>
              <dd class="col-sm-9"><code>{{ log()!.id }}</code></dd>
              
              <dt class="col-sm-3">Timestamp</dt>
              <dd class="col-sm-9">{{ log()!.timestamp | date:'medium' }} ({{ log()!.relativeTime }})</dd>
              
              <dt class="col-sm-3">Level</dt>
              <dd class="col-sm-9">
                <span class="badge bg-{{ log()!.levelColor }}-subtle text-{{ log()!.levelColor }}">
                  <i [class]="log()!.levelIcon + ' me-1'"></i>
                  {{ log()!.levelLabel }}
                </span>
              </dd>
              
              <dt class="col-sm-3">Source</dt>
              <dd class="col-sm-9"><code>{{ log()!.source }}</code></dd>
              
              @if (log()!.correlationId) {
                <dt class="col-sm-3">Correlation ID</dt>
                <dd class="col-sm-9"><code>{{ log()!.correlationId }}</code></dd>
              }
              
              @if (log()!.userId) {
                <dt class="col-sm-3">User ID</dt>
                <dd class="col-sm-9"><code>{{ log()!.userId }}</code></dd>
              }
              
              @if (log()!.accountId) {
                <dt class="col-sm-3">Account ID</dt>
                <dd class="col-sm-9"><code>{{ log()!.accountId }}</code></dd>
              }
            </dl>
          </div>
        </div>

        <!-- Message -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bx bx-message-detail me-2"></i>
              Message
            </h5>
          </div>
          <div class="card-body">
            <p class="mb-0">{{ log()!.message }}</p>
          </div>
        </div>

        <!-- Details (if any) -->
        @if (log()!.hasDetails) {
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bx bx-code-block me-2"></i>
                Additional Data
              </h5>
            </div>
            <div class="card-body">
              <pre class="bg-dark text-light p-3 rounded mb-0"><code>{{ log()!.details | json }}</code></pre>
            </div>
          </div>
        }

        <!-- Stack Trace (if any) -->
        @if (log()!.hasStackTrace) {
          <div class="card mb-4">
            <div class="card-header bg-danger-subtle">
              <h5 class="mb-0 text-danger">
                <i class="bx bx-bug me-2"></i>
                Stack Trace
              </h5>
            </div>
            <div class="card-body">
              <pre class="bg-dark text-danger p-3 rounded mb-0" style="font-size: 0.8em;"><code>{{ log()!.stackTrace }}</code></pre>
            </div>
          </div>
        }

        <!-- User Agent (if any) -->
        @if (log()!.userAgent) {
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bx bx-desktop me-2"></i>
                User Agent
              </h5>
            </div>
            <div class="card-body">
              <code class="small">{{ log()!.userAgent }}</code>
            </div>
          </div>
        }
      } @else {
        <!-- Not Found -->
        <div class="text-center py-5">
          <i class="bx bx-error-circle display-1 text-warning"></i>
          <h4 class="mt-3">Log Not Found</h4>
          <p class="text-muted">The requested log entry could not be found.</p>
          <a routerLink=".." class="btn btn-primary">
            <i class="bx bx-arrow-back me-1"></i>
            Back to Logs
          </a>
        </div>
      }
    </div>
  `
})
export class LogDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private logService = inject(LogService);
  
  log = signal<LogEntryViewModel | undefined>(undefined);
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        const foundLog = this.logService.getLog(id);
        this.log.set(foundLog);
      }
    });
  }
}
