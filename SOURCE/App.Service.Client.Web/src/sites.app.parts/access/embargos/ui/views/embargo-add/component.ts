/**
 * Embargo Add Component (Add)
 * 
 * Form to create a new embargo.
 * D-BREAST: Add
 * 
 * Route: /system/access/embargos/add
 */
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmbargoService } from '../../../services/embargo.service';
import { CreateEmbargoDto, COMMON_EMBARGO_COUNTRIES } from '../../../models/embargo.dto';

@Component({
  selector: 'app-embargo-add',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid" style="max-width: 800px; padding: 1.5rem;">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a routerLink="/apps/system/access">Access</a></li>
          <li class="breadcrumb-item"><a routerLink="/apps/system/access/embargos">Embargoes</a></li>
          <li class="breadcrumb-item active">Add</li>
        </ol>
      </nav>

      <!-- Header -->
      <div class="d-flex align-items-center gap-3 mb-4">
        <div class="avatar-sm">
          <div class="avatar-title bg-success-subtle text-success rounded">
            <i class="ri-add-line fs-20"></i>
          </div>
        </div>
        <div>
          <h4 class="mb-0">Add Embargo</h4>
          <p class="text-muted mb-0">Block service access for a country</p>
        </div>
      </div>

      <!-- Quick Add Suggestions -->
      <div class="card mb-4 bg-light border-0">
        <div class="card-body">
          <h6 class="mb-2"><i class="ri-lightbulb-line me-1"></i> Common Embargoed Countries</h6>
          <div class="d-flex flex-wrap gap-2">
            @for (country of commonCountries; track country.code) {
              <button 
                type="button" 
                class="btn btn-sm btn-outline-secondary"
                [disabled]="isAlreadyEmbargoed(country.code)"
                (click)="prefillCountry(country)">
                {{ countryCodeToFlag(country.code) }} {{ country.name }}
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="card">
        <div class="card-body">
          <form [formGroup]="form" (ngSubmit)="save()">
            
            <!-- Country -->
            <div class="row mb-3">
              <div class="col-md-4">
                <label class="form-label">Country Code <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  formControlName="countryCode" 
                  class="form-control text-uppercase"
                  placeholder="e.g., KP"
                  maxlength="2">
                @if (form.get('countryCode')?.invalid && form.get('countryCode')?.touched) {
                  <small class="text-danger">2-letter ISO code required</small>
                }
              </div>
              <div class="col-md-8">
                <label class="form-label">Country Name <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  formControlName="countryName" 
                  class="form-control"
                  placeholder="e.g., North Korea">
              </div>
            </div>

            <!-- Reason -->
            <div class="mb-3">
              <label class="form-label">Reason <span class="text-danger">*</span></label>
              <textarea 
                formControlName="reason" 
                class="form-control" 
                rows="3"
                placeholder="Why is this country being embargoed?"></textarea>
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
                placeholder="e.g., OFAC SDN List, UN Resolution 1718, EAR Part 746">
            </div>

            <!-- Dates -->
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">Effective From</label>
                <input 
                  type="date" 
                  formControlName="effectiveFrom" 
                  class="form-control">
                <small class="text-muted">Defaults to today if blank</small>
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
                  Activate immediately
                </label>
              </div>
            </div>

            <!-- Actions -->
            <div class="d-flex gap-2">
              <button 
                type="submit" 
                class="btn btn-success"
                [disabled]="form.invalid || saving()">
                @if (saving()) {
                  <span class="spinner-border spinner-border-sm me-1"></span>
                }
                <i class="ri-add-line me-1"></i> Add Embargo
              </button>
              <a routerLink="../" class="btn btn-outline-secondary">
                Cancel
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class EmbargoAddComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private embargoService = inject(EmbargoService);
  
  saving = signal(false);
  commonCountries = COMMON_EMBARGO_COUNTRIES;
  
  form: FormGroup = this.fb.group({
    countryCode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
    countryName: ['', Validators.required],
    reason: ['', Validators.required],
    legalReference: [''],
    effectiveFrom: [''],
    effectiveTo: [''],
    enabled: [true]
  });
  
  isAlreadyEmbargoed(code: string): boolean {
    return this.embargoService.embargos().some(e => e.countryCode === code);
  }
  
  prefillCountry(country: { code: string; name: string; reason: string }): void {
    this.form.patchValue({
      countryCode: country.code,
      countryName: country.name,
      reason: `${country.reason.charAt(0).toUpperCase() + country.reason.slice(1)} restrictions`
    });
  }
  
  countryCodeToFlag(code: string): string {
    const codePoints = [...code.toUpperCase()]
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }
  
  save(): void {
    if (this.form.invalid) return;
    
    this.saving.set(true);
    
    const dto: CreateEmbargoDto = {
      countryCode: this.form.value.countryCode.toUpperCase(),
      countryName: this.form.value.countryName,
      reason: this.form.value.reason,
      legalReference: this.form.value.legalReference || undefined,
      effectiveFrom: this.form.value.effectiveFrom || undefined,
      effectiveTo: this.form.value.effectiveTo || undefined,
      enabled: this.form.value.enabled
    };
    
    this.embargoService.create(dto).subscribe({
      next: (vm) => {
        this.saving.set(false);
        this.router.navigate(['/apps/system/access/embargos', vm.id]);
      },
      error: () => {
        this.saving.set(false);
      }
    });
  }
}
