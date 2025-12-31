/**
 * Licenses Component
 * 
 * Displays open source license attributions for third-party libraries.
 * Grouped by license type with search capability.
 */
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AboutService } from '../../services/about.service';
import { LicenseDto } from '../../models/about.dto';

@Component({
    selector: 'app-licenses',
    imports: [CommonModule, RouterModule, FormsModule],
    template: `
    <div class="licenses-page">
      <div class="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <a routerLink="../" class="btn btn-outline-secondary btn-sm me-3">
            <i class="bx bx-arrow-back"></i>
          </a>
          <h4 class="d-inline-block mb-0">
            <i class="bx bx-file me-2 text-info"></i>
            Open Source Licenses
          </h4>
        </div>
        <span class="badge bg-info">{{ filteredLicenses().length }} packages</span>
      </div>

      <p class="text-muted mb-4">
        This application uses the following open source software. 
        We are grateful to the developers and maintainers of these projects.
      </p>

      <!-- Search -->
      <div class="mb-4">
        <div class="input-group">
          <span class="input-group-text">
            <i class="bx bx-search"></i>
          </span>
          <input type="text" 
                 class="form-control" 
                 placeholder="Search packages..."
                 [(ngModel)]="searchQuery"
                 (ngModelChange)="onSearch($event)">
          <button *ngIf="searchQuery()" 
                  class="btn btn-outline-secondary" 
                  type="button"
                  (click)="clearSearch()">
            <i class="bx bx-x"></i>
          </button>
        </div>
      </div>

      <!-- License Type Filter -->
      <div class="mb-4 d-flex gap-2 flex-wrap">
        <button class="btn btn-sm"
                [class.btn-primary]="!selectedType()"
                [class.btn-outline-secondary]="selectedType()"
                (click)="filterByType(null)">
          All
        </button>
        <button *ngFor="let type of licenseTypes()"
                class="btn btn-sm"
                [class.btn-primary]="selectedType() === type"
                [class.btn-outline-secondary]="selectedType() !== type"
                (click)="filterByType(type)">
          {{ type }} ({{ getCountByType(type) }})
        </button>
      </div>

      <!-- Licenses List -->
      <div class="licenses-list">
        <div *ngFor="let license of filteredLicenses()" class="card mb-3 license-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h5 class="mb-1">
                  <a *ngIf="license.repository" 
                     [href]="license.repository" 
                     target="_blank"
                     class="text-decoration-none">
                    {{ license.name }}
                    <i class="bx bx-link-external fs-12 text-muted"></i>
                  </a>
                  <span *ngIf="!license.repository">{{ license.name }}</span>
                </h5>
                <p class="text-muted small mb-2" *ngIf="license.description">
                  {{ license.description }}
                </p>
                <p class="text-muted small mb-0" *ngIf="license.author">
                  <i class="bx bx-user me-1"></i>
                  {{ license.author }}
                </p>
              </div>
              <div class="text-end">
                <span class="badge" [class]="getLicenseBadgeClass(license.license)">
                  {{ license.license }}
                </span>
                <div class="text-muted small mt-1">v{{ license.version }}</div>
              </div>
            </div>
            <div *ngIf="license.licenseUrl" class="mt-2">
              <a [href]="license.licenseUrl" target="_blank" class="text-muted small">
                <i class="bx bx-link me-1"></i>
                View License
              </a>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredLicenses().length === 0" class="text-center py-5">
          <i class="bx bx-search fs-48 text-muted"></i>
          <p class="text-muted mt-2">No packages found matching "{{ searchQuery() }}"</p>
        </div>
      </div>

      <!-- Back Button -->
      <div class="mt-4">
        <a routerLink="../" class="btn btn-outline-secondary">
          <i class="bx bx-arrow-back me-1"></i>
          Back to About
        </a>
      </div>
    </div>
  `,
    styles: [`
    .licenses-page { padding: 1.5rem; max-width: 900px; margin: 0 auto; }
    .license-card { transition: all 0.2s; }
    .license-card:hover { 
      transform: translateX(4px); 
      border-left: 3px solid var(--vz-primary);
    }
  `]
})
export class LicensesComponent {
  aboutService = inject(AboutService);
  
  searchQuery = signal('');
  selectedType = signal<string | null>(null);

  licenseTypes = computed(() => {
    const types = new Set(this.aboutService.licenses().map(l => l.license));
    return Array.from(types).sort();
  });

  filteredLicenses = computed(() => {
    let licenses = this.aboutService.licenses();
    
    // Filter by search
    const query = this.searchQuery().toLowerCase();
    if (query) {
      licenses = licenses.filter(l => 
        l.name.toLowerCase().includes(query) ||
        l.license.toLowerCase().includes(query) ||
        l.author?.toLowerCase().includes(query)
      );
    }
    
    // Filter by type
    const type = this.selectedType();
    if (type) {
      licenses = licenses.filter(l => l.license === type);
    }
    
    return licenses;
  });

  onSearch(query: string): void {
    this.searchQuery.set(query);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  filterByType(type: string | null): void {
    this.selectedType.set(type);
  }

  getCountByType(type: string): number {
    return this.aboutService.licenses().filter(l => l.license === type).length;
  }

  getLicenseBadgeClass(license: string): string {
    switch (license) {
      case 'MIT': return 'bg-success';
      case 'Apache-2.0': return 'bg-info';
      case 'ISC': return 'bg-primary';
      case 'BSD-3-Clause': return 'bg-warning text-dark';
      default: return 'bg-secondary';
    }
  }
}
