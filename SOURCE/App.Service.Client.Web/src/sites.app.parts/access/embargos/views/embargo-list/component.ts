/**
 * Embargo List Component (Browse)
 * 
 * Lists all embargoes with filtering and sorting.
 * D-BREAST: Browse
 * 
 * Route: /system/access/embargos
 */
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmbargoService } from '../../services/embargo.service';
import { EmbargoViewModel } from '../../models/embargo.view-model';

type FilterType = 'all' | 'active' | 'inactive' | 'scheduled';

@Component({
  selector: 'app-embargo-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container-fluid" style="max-width: 1200px; padding: 1.5rem;">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a routerLink="/apps/system/access">Access</a></li>
          <li class="breadcrumb-item active">Embargoes</li>
        </ol>
      </nav>

      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center gap-3">
          <div class="avatar-sm">
            <div class="avatar-title bg-danger-subtle text-danger rounded">
              <i class="ri-forbid-line fs-20"></i>
            </div>
          </div>
          <div>
            <h4 class="mb-0">Embargo List</h4>
            <p class="text-muted mb-0">{{ filteredEmbargos().length }} embargoes</p>
          </div>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-soft-primary" (click)="refresh()">
            <i class="ri-refresh-line"></i>
          </button>
          <a routerLink="add" class="btn btn-success">
            <i class="ri-add-line me-1"></i> Add Embargo
          </a>
        </div>
      </div>

      <!-- Filters -->
      <div class="card mb-4">
        <div class="card-body py-2">
          <div class="row align-items-center">
            <div class="col-md-6">
              <div class="input-group">
                <span class="input-group-text"><i class="ri-search-line"></i></span>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Search by country name or code..."
                  [(ngModel)]="searchTerm"
                  (ngModelChange)="applyFilters()">
              </div>
            </div>
            <div class="col-md-6">
              <div class="btn-group w-100">
                <button 
                  class="btn" 
                  [class.btn-primary]="filter() === 'all'"
                  [class.btn-outline-secondary]="filter() !== 'all'"
                  (click)="setFilter('all')">
                  All ({{ embargoService.embargos().length }})
                </button>
                <button 
                  class="btn" 
                  [class.btn-danger]="filter() === 'active'"
                  [class.btn-outline-secondary]="filter() !== 'active'"
                  (click)="setFilter('active')">
                  Active ({{ embargoService.stats().active }})
                </button>
                <button 
                  class="btn" 
                  [class.btn-secondary]="filter() === 'inactive'"
                  [class.btn-outline-secondary]="filter() !== 'inactive'"
                  (click)="setFilter('inactive')">
                  Inactive ({{ embargoService.stats().inactive }})
                </button>
                <button 
                  class="btn" 
                  [class.btn-warning]="filter() === 'scheduled'"
                  [class.btn-outline-secondary]="filter() !== 'scheduled'"
                  (click)="setFilter('scheduled')">
                  Scheduled ({{ embargoService.stats().scheduled }})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- List -->
      @if (embargoService.loading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary"></div>
          <p class="text-muted mt-2">Loading embargoes...</p>
        </div>
      } @else if (filteredEmbargos().length === 0) {
        <div class="card">
          <div class="card-body text-center py-5">
            <i class="ri-checkbox-circle-line fs-48 text-success"></i>
            <h5 class="mt-3">No embargoes found</h5>
            <p class="text-muted">
              @if (filter() === 'all' && !searchTerm) {
                No embargoes have been defined yet.
              } @else {
                No embargoes match your current filter.
              }
            </p>
            <a routerLink="add" class="btn btn-success">
              <i class="ri-add-line me-1"></i> Add First Embargo
            </a>
          </div>
        </div>
      } @else {
        <div class="card">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Country</th>
                  <th>Reason</th>
                  <th>Effective</th>
                  <th>Status</th>
                  <th class="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (embargo of filteredEmbargos(); track embargo.id) {
                  <tr>
                    <td>
                      <span class="fs-20 me-2">{{ embargo.flagEmoji }}</span>
                      <strong>{{ embargo.displayName }}</strong>
                    </td>
                    <td>
                      <span class="text-truncate d-inline-block" style="max-width: 200px;">
                        {{ embargo.reason }}
                      </span>
                      @if (embargo.legalReference) {
                        <small class="text-muted d-block">{{ embargo.legalReference }}</small>
                      }
                    </td>
                    <td>
                      <span>{{ embargo.effectiveFrom | date:'mediumDate' }}</span>
                      <small class="text-muted d-block">{{ embargo.durationDisplay }}</small>
                    </td>
                    <td>
                      <span class="badge bg-{{ embargo.statusColor }}-subtle text-{{ embargo.statusColor }}">
                        {{ embargo.status | titlecase }}
                      </span>
                    </td>
                    <td class="text-end">
                      <div class="btn-group btn-group-sm">
                        <a [routerLink]="[embargo.id]" class="btn btn-soft-primary" title="View">
                          <i class="ri-eye-line"></i>
                        </a>
                        <a [routerLink]="[embargo.id, 'edit']" class="btn btn-soft-warning" title="Edit">
                          <i class="ri-pencil-line"></i>
                        </a>
                        <button 
                          class="btn btn-soft-secondary" 
                          [title]="embargo.enabled ? 'Disable' : 'Enable'"
                          (click)="toggleEmbargo(embargo)">
                          <i [class]="embargo.enabled ? 'ri-toggle-line' : 'ri-toggle-fill'"></i>
                        </button>
                        <button 
                          class="btn btn-soft-danger" 
                          title="Delete"
                          (click)="deleteEmbargo(embargo)">
                          <i class="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `
})
export class EmbargoListComponent {
  embargoService = inject(EmbargoService);
  
  filter = signal<FilterType>('all');
  searchTerm = '';
  
  filteredEmbargos = signal<EmbargoViewModel[]>([]);
  
  constructor() {
    this.applyFilters();
  }
  
  setFilter(f: FilterType): void {
    this.filter.set(f);
    this.applyFilters();
  }
  
  applyFilters(): void {
    let result = this.embargoService.embargos();
    
    // Apply status filter
    if (this.filter() !== 'all') {
      result = result.filter(e => e.status === this.filter());
    }
    
    // Apply search
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(e => 
        e.countryName.toLowerCase().includes(term) ||
        e.countryCode.toLowerCase().includes(term) ||
        e.reason.toLowerCase().includes(term)
      );
    }
    
    this.filteredEmbargos.set(result);
  }
  
  refresh(): void {
    this.embargoService.refresh();
    setTimeout(() => this.applyFilters(), 500);
  }
  
  toggleEmbargo(embargo: EmbargoViewModel): void {
    this.embargoService.toggle(embargo.id).subscribe(() => {
      this.applyFilters();
    });
  }
  
  deleteEmbargo(embargo: EmbargoViewModel): void {
    if (confirm(`Remove ${embargo.countryName} from embargo list?`)) {
      this.embargoService.delete(embargo.id).subscribe(() => {
        this.applyFilters();
      });
    }
  }
}
