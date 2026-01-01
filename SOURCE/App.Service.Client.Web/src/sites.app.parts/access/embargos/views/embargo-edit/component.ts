/**
 * Embargo Edit Component (Edit)
 * 
 * Form to edit an existing embargo.
 * D-BREAST: Edit
 * 
 * Route: /system/access/embargos/:id/edit
 */
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmbargoService } from '../../services/embargo.service';
import { EmbargoViewModel } from '../../models/embargo.view-model';
import { UpdateEmbargoDto } from '../../models/embargo.dto';

@Component({
  selector: 'app-embargo-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid" style="max-width: 800px; padding: 1.5rem;">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a routerLink="/apps/system/access">Access</a></li>
          <li class="breadcrumb-item"><a routerLink="/apps/system/access/embargos">Embargoes</a></li>
          <li class="breadcrumb-item active">Edit</li>
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
            <a routerLink="../../" class="btn btn-primary mt-3">Back to List</a>
          </div>
        </div>
      } @else {
        <!-- Header -->
        <div class="d-flex align-items-center gap-3 mb-4">
          <span class="fs-32">{{ embargo()!.flagEmoji }}</span>
          <div>
            <h4 class="mb-0">Edit Embargo: {{ embargo()!.countryName }}</h4>
            <p class="text-muted mb-0">{{ embargo()!.countryCode }}</p>
          </div>
        </div>

        <!-- Form -->
        <div class="card">
          <div class="card-body">
            <form [formGroup]="form" (ngSubmit)="save()">
              
              <!-- Reason -->
              <div class="mb-3">
                <label class="form-label">Reason <span class="text-danger">*</span></label>
                <textarea 
                  formControlName="reason" 
                  class="form-control" 
                  rows="3"
                  placeholder="Why is this country embargoed?"></textarea>
                @if (form.get('reason')?.invalid && form.get('reason')?.touched) {
                  <small class="text-danger">Reason is required</small>
                }
              </div>

              <!-- Legal Reference -->
              <div class="mb-3">
                <label class="form-label">Legal Reference</label>
                <input 
                  type="text" 
                  formControlName="legalReference" 
                  class="form-control"
                  placeholder="e.g., OFAC SDN List, UN Resolution 1718">
              </div>

              <!-- Dates -->
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">Effective From <span class="text-danger">*</span></label>
                  <input 
                    type="date" 
                    formControlName="effectiveFrom" 
                    class="form-control">
                </div>
                <div class="col-md-6">
                  <label class="form-label">Effective To</label>
                  <input 
                    type="date" 
                    formControlName="effectiveTo" 
                    class="form-control">
                  <small class="text-muted">Leave blank for indefinite</small>
                </div>
              </div>

              <!-- Enabled -->
              <div class="mb-4">
                <div class="form-check form-switch">
                  <input 
                    type="checkbox" 
                    formControlName="enabled" 
                    class="form-check-input" 
                    id="enabled">
                  <label class="form-check-label" for="enabled">
                    Embargo is active
                  </label>
                </div>
              </div>

              <!-- Actions -->
              <div class="d-flex gap-2">
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  [disabled]="form.invalid || saving()">
                  @if (saving()) {
                    <span class="spinner-border spinner-border-sm me-1"></span>
                  }
                  Save Changes
                </button>
                <a routerLink="../../{{ embargo()!.id }}" class="btn btn-outline-secondary">
                  Cancel
                </a>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class EmbargoEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private embargoService = inject(EmbargoService);
  
  loading = signal(true);
  saving = signal(false);
  embargo = signal<EmbargoViewModel | null>(null);
  
  form: FormGroup = this.fb.group({
    reason: ['', Validators.required],
    legalReference: [''],
    effectiveFrom: ['', Validators.required],
    effectiveTo: [''],
    enabled: [true]
  });
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.embargoService.loadById(id).subscribe(vm => {
        this.embargo.set(vm);
        if (vm) {
          this.form.patchValue({
            reason: vm.reason,
            legalReference: vm.legalReference || '',
            effectiveFrom: vm.effectiveFrom.toISOString().split('T')[0],
            effectiveTo: vm.effectiveTo ? vm.effectiveTo.toISOString().split('T')[0] : '',
            enabled: vm.enabled
          });
        }
        this.loading.set(false);
      });
    }
  }
  
  save(): void {
    if (this.form.invalid) return;
    
    const e = this.embargo();
    if (!e) return;
    
    this.saving.set(true);
    
    const dto: UpdateEmbargoDto = {
      reason: this.form.value.reason,
      legalReference: this.form.value.legalReference || undefined,
      effectiveFrom: this.form.value.effectiveFrom,
      effectiveTo: this.form.value.effectiveTo || null,
      enabled: this.form.value.enabled
    };
    
    this.embargoService.update(e.id, dto).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['../../', e.id], { relativeTo: this.route });
      },
      error: () => {
        this.saving.set(false);
      }
    });
  }
}
