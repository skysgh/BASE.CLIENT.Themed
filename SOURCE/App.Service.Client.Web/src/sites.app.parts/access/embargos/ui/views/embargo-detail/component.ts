/**
 * Embargo Detail Component (Read)
 * 
 * Displays full details of a single embargo.
 * D-BREAST: Read
 * 
 * Route: /system/access/embargos/:id
 */
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { EmbargoService } from '../../../services/embargo.service';
import { EmbargoViewModel } from '../../../models/embargo.view-model';

@Component({
  selector: 'app-embargo-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid" style="max-width: 900px; padding: 1.5rem;">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a routerLink="/apps/system/access">Access</a></li>
          <li class="breadcrumb-item"><a routerLink="/apps/system/access/embargos">Embargoes</a></li>
          <li class="breadcrumb-item active">Detail</li>
        </ol>
      </nav>

      @if (loading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>
      } @else if (!embargo()) {
        <div class="card">
          <div class="card-body text-center py-5">
            <i class="ri-error-warning-line fs-48 text-warning"></i>
            <h5 class="mt-3">Embargo Not Found</h5>
            <a routerLink="../" class="btn btn-primary mt-3">Back to List</a>
          </div>
        </div>
      } @else {
        <!-- Header -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <span class="fs-48 me-3">{{ embargo()!.flagEmoji }}</span>
              <div class="flex-grow-1">
                <h3 class="mb-1">{{ embargo()!.countryName }}</h3>
                <p class="text-muted mb-0">
                  <span class="badge bg-secondary me-2">{{ embargo()!.countryCode }}</span>
                  <span class="badge bg-{{ embargo()!.statusColor }}-subtle text-{{ embargo()!.statusColor }}">
                    {{ embargo()!.status | titlecase }}
                  </span>
                </p>
              </div>
              <div class="d-flex gap-2">
                <button 
                  class="btn btn-soft-secondary"
                  (click)="toggle()">
                  <i [class]="embargo()!.enabled ? 'ri-toggle-line' : 'ri-toggle-fill'" class="me-1"></i>
                  {{ embargo()!.enabled ? 'Disable' : 'Enable' }}
                </button>
                <a [routerLink]="['edit']" class="btn btn-warning">
                  <i class="ri-pencil-line me-1"></i> Edit
                </a>
                <button class="btn btn-danger" (click)="delete()">
                  <i class="ri-delete-bin-line me-1"></i> Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Details -->
        <div class="row">
          <div class="col-md-8">
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">Embargo Details</h5>
              </div>
              <div class="card-body">
                <table class="table table-borderless">
                  <tbody>
                    <tr>
                      <td class="text-muted" style="width: 150px;">Reason</td>
                      <td>{{ embargo()!.reason }}</td>
                    </tr>
                    @if (embargo()!.legalReference) {
                      <tr>
                        <td class="text-muted">Legal Reference</td>
                        <td>{{ embargo()!.legalReference }}</td>
                      </tr>
                    }
                    <tr>
                      <td class="text-muted">Effective From</td>
                      <td>{{ embargo()!.effectiveFrom | date:'fullDate' }}</td>
                    </tr>
                    <tr>
                      <td class="text-muted">Effective To</td>
                      <td>
                        @if (embargo()!.effectiveTo) {
                          {{ embargo()!.effectiveTo | date:'fullDate' }}
                        } @else {
                          <span class="text-muted">Indefinite</span>
                        }
                      </td>
                    </tr>
                    <tr>
                      <td class="text-muted">Duration</td>
                      <td>{{ embargo()!.durationDisplay }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div class="col-md-4">
            <!-- Status Card -->
            <div class="card mb-4" [class.border-danger]="embargo()!.isCurrentlyActive" [class.border-secondary]="!embargo()!.isCurrentlyActive">
              <div class="card-body text-center">
                @if (embargo()!.isCurrentlyActive) {
                  <i class="ri-forbid-line fs-48 text-danger"></i>
                  <h5 class="mt-2 text-danger">BLOCKED</h5>
                  <p class="text-muted mb-0">Service unavailable in this country</p>
                } @else {
                  <i class="ri-checkbox-circle-line fs-48 text-secondary"></i>
                  <h5 class="mt-2 text-secondary">NOT ACTIVE</h5>
                  <p class="text-muted mb-0">Embargo is disabled or expired</p>
                }
              </div>
            </div>
            
            <!-- Metadata -->
            <div class="card">
              <div class="card-header">
                <h6 class="mb-0">Metadata</h6>
              </div>
              <div class="card-body">
                <small class="text-muted d-block">
                  <strong>Created:</strong><br>
                  {{ embargo()!.createdAt | date:'medium' }}
                </small>
                <small class="text-muted d-block mt-2">
                  <strong>Updated:</strong><br>
                  {{ embargo()!.updatedAt | date:'medium' }}
                </small>
                <small class="text-muted d-block mt-2">
                  <strong>ID:</strong><br>
                  <code>{{ embargo()!.id }}</code>
                </small>
              </div>
            </div>
          </div>
        </div>

        <!-- Back -->
        <div class="mt-4">
          <a routerLink="../" class="btn btn-outline-secondary">
            <i class="ri-arrow-left-line me-1"></i> Back to List
          </a>
        </div>
      }
    </div>
  `
})
export class EmbargoDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private embargoService = inject(EmbargoService);
  
  loading = signal(true);
  embargo = signal<EmbargoViewModel | null>(null);
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.embargoService.loadById(id).subscribe(vm => {
        this.embargo.set(vm);
        this.loading.set(false);
      });
    }
  }
  
  toggle(): void {
    const e = this.embargo();
    if (e) {
      this.embargoService.toggle(e.id).subscribe(vm => {
        if (vm) this.embargo.set(vm);
      });
    }
  }
  
  delete(): void {
    const e = this.embargo();
    if (e && confirm(`Remove ${e.countryName} from embargo list?`)) {
      this.embargoService.delete(e.id).subscribe(success => {
        if (success) {
          this.router.navigate(['../'], { relativeTo: this.route });
        }
      });
    }
  }
}
