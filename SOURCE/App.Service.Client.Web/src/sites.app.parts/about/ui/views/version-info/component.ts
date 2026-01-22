/**
 * Version Info Component
 * 
 * Displays version, build, and environment information.
 * Uses standard PageHeader for consistent navigation.
 */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AboutService } from '../../../services/about.service';
import { PageHeaderComponent } from '../../../../../sites/ui/widgets/page-header';

@Component({
    selector: 'app-version-info',
    standalone: true,
    imports: [CommonModule, RouterModule, PageHeaderComponent],
    template: `
    <div class="version-page">
      <!-- Standard Page Header -->
      <app-page-header 
        title="Version Information"
        icon="bx-chip"
        iconBackground="bg-primary-subtle"
        iconClass="text-primary"
        [showBack]="true"
        [showBreadcrumb]="true">
        <ng-container subtitle>Build, version, and environment details</ng-container>
      </app-page-header>
    
      @if (aboutService.version(); as version) {
        <div>
          <!-- Main Version Card -->
          <div class="card mb-4">
            <div class="card-body text-center py-5">
              <div class="version-badge mb-3">
                <span class="version-number">v{{ version.version }}</span>
              </div>
              <span class="badge fs-14"
                [class.bg-success]="version.environment === 'production'"
                [class.bg-warning]="version.environment !== 'production'">
                <i class="bx bx-server me-1"></i>
                {{ version.environment | titlecase }}
              </span>
            </div>
          </div>
          <!-- Build Details -->
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bx bx-wrench me-2"></i>
                Build Details
              </h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <table class="table table-borderless mb-0">
                    <tbody>
                      <tr>
                        <td class="text-muted">Build Number</td>
                        <td class="fw-semibold">{{ version.buildNumber || 'N/A' }}</td>
                      </tr>
                      <tr>
                        <td class="text-muted">Build Date</td>
                        <td class="fw-semibold">{{ formatDate(version.buildDate) }}</td>
                      </tr>
                      <tr>
                        <td class="text-muted">Commit Hash</td>
                        <td class="fw-semibold font-monospace">
                          {{ version.commitHash ? version.commitHash.substring(0, 8) : 'N/A' }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="col-md-6">
                  <table class="table table-borderless mb-0">
                    <tbody>
                      <tr>
                        <td class="text-muted">Angular Version</td>
                        <td class="fw-semibold">{{ version.angularVersion || 'N/A' }}</td>
                      </tr>
                      <tr>
                        <td class="text-muted">Node Version</td>
                        <td class="fw-semibold">{{ version.nodeVersion || 'N/A' }}</td>
                      </tr>
                      <tr>
                        <td class="text-muted">Environment</td>
                        <td>
                          <span class="badge"
                            [class.bg-success]="version.environment === 'production'"
                            [class.bg-warning]="version.environment !== 'production'">
                            {{ version.environment }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <!-- Browser Info -->
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bx bx-globe me-2"></i>
                Browser Information
              </h5>
            </div>
            <div class="card-body">
              <table class="table table-borderless mb-0">
                <tbody>
                  <tr>
                    <td class="text-muted" style="width: 200px;">User Agent</td>
                    <td class="font-monospace small">{{ userAgent }}</td>
                  </tr>
                  <tr>
                    <td class="text-muted">Language</td>
                    <td>{{ language }}</td>
                  </tr>
                  <tr>
                    <td class="text-muted">Platform</td>
                    <td>{{ platform }}</td>
                  </tr>
                  <tr>
                    <td class="text-muted">Screen Resolution</td>
                    <td>{{ screenResolution }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }
    </div>
    `,
    styles: [`
    .version-page { padding: 1.5rem; max-width: 1000px; margin: 0 auto; }
    
    .version-badge {
      display: inline-block;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 1rem 2rem;
      border-radius: 1rem;
    }
    .version-number { font-size: 2rem; font-weight: 700; }
    
    .font-monospace { font-family: 'Courier New', monospace; }
  `]
})
export class VersionInfoComponent {
  aboutService = inject(AboutService);

  get userAgent(): string {
    return navigator.userAgent;
  }

  get language(): string {
    return navigator.language;
  }

  get platform(): string {
    return (navigator as any).userAgentData?.platform || navigator.platform || 'Unknown';
  }

  get screenResolution(): string {
    return `${screen.width} x ${screen.height}`;
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  }
}
