/**
 * Category Edit Component (Admin)
 * 
 * BREAD: Edit view for FAQ categories.
 * Also used for Add (when no ID provided).
 */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FaqCategoryService } from '../../../services';
import { FaqCategoryViewModel } from '../../../models';
import { FAQ_CATEGORY_ICONS } from '../../../constants';

@Component({
  selector: 'app-category-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="category-edit">
      <!-- Top Navigation Bar -->
      <div class="top-nav-bar mb-4 d-flex justify-content-between align-items-center">
        <a routerLink=".." class="btn btn-primary">
          <i class="bx bx-arrow-back me-1"></i>
          Back to Categories
        </a>
      </div>

      <!-- Header -->
      <div class="edit-header mb-4">
        <h4 class="mb-1">
          <i class="bx {{ isEditMode ? 'bx-edit' : 'bx-plus' }} me-2"></i>
          {{ isEditMode ? 'Edit Category' : 'Add Category' }}
        </h4>
        <p class="text-muted mb-0">
          {{ isEditMode ? 'Update category details' : 'Create a new FAQ category' }}
        </p>
      </div>

      <!-- Loading -->
      @if (categoryService.loading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>
      }

      <!-- Form -->
      @if (!categoryService.loading()) {
        <div class="card">
          <div class="card-body">
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <!-- Title -->
              <div class="mb-3">
                <label class="form-label">Title <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control"
                  formControlName="title"
                  placeholder="e.g., General Questions"
                  [class.is-invalid]="form.get('title')?.invalid && form.get('title')?.touched">
                @if (form.get('title')?.invalid && form.get('title')?.touched) {
                  <div class="invalid-feedback">Title is required</div>
                }
              </div>

              <!-- Description -->
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea
                  class="form-control"
                  formControlName="description"
                  rows="2"
                  placeholder="Brief description of this category">
                </textarea>
              </div>

              <!-- Icon -->
              <div class="mb-3">
                <label class="form-label">Icon</label>
                <div class="icon-picker">
                  <div class="d-flex flex-wrap gap-2">
                    @for (icon of icons; track icon.id) {
                      <button 
                        type="button"
                        class="btn icon-btn"
                        [class.btn-primary]="form.get('icon')?.value === icon.id"
                        [class.btn-outline-secondary]="form.get('icon')?.value !== icon.id"
                        (click)="selectIcon(icon.id)"
                        [title]="icon.name">
                        <i class="{{ icon.class }}"></i>
                      </button>
                    }
                  </div>
                </div>
              </div>

              <!-- Order -->
              <div class="mb-3">
                <label class="form-label">Display Order</label>
                <input 
                  type="number" 
                  class="form-control"
                  formControlName="order"
                  min="0"
                  style="max-width: 150px;">
                <div class="form-text">Lower numbers appear first</div>
              </div>

              <!-- Enabled -->
              <div class="mb-4">
                <div class="form-check form-switch">
                  <input 
                    type="checkbox" 
                    class="form-check-input"
                    formControlName="enabled"
                    id="enabled">
                  <label class="form-check-label" for="enabled">
                    Enabled (visible to users)
                  </label>
                </div>
              </div>

              <!-- Actions -->
              <div class="d-flex justify-content-between align-items-center pt-3 border-top">
                <a routerLink=".." class="btn btn-outline-secondary">
                  Cancel
                </a>
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  [disabled]="form.invalid || categoryService.saving()">
                  @if (categoryService.saving()) {
                    <span class="spinner-border spinner-border-sm me-1"></span>
                    Saving...
                  } @else {
                    <i class="bx bx-save me-1"></i>
                    {{ isEditMode ? 'Update' : 'Create' }} Category
                  }
                </button>
              </div>
            </form>

            <!-- Error -->
            @if (categoryService.error()) {
              <div class="alert alert-danger mt-3">
                {{ categoryService.error() }}
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .category-edit {
      padding: 1.5rem;
      max-width: 700px;
      margin: 0 auto;
    }
    
    .icon-btn {
      width: 42px;
      height: 42px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }
  `]
})
export class CategoryEditComponent implements OnInit {
  categoryService = inject(FaqCategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form!: FormGroup;
  isEditMode = false;
  categoryId?: string;
  icons = FAQ_CATEGORY_ICONS;

  ngOnInit(): void {
    // Initialize form
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      icon: ['bx-help-circle'],
      order: [0],
      enabled: [true],
    });

    // Check if edit mode
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id && id !== 'add') {
        this.isEditMode = true;
        this.categoryId = id;
        this.loadCategory(id);
      }
    });
  }

  loadCategory(id: string): void {
    this.categoryService.loadCategory(id).subscribe(category => {
      if (category) {
        this.form.patchValue({
          title: category.title,
          description: category.description,
          icon: category.icon,
          order: category.order,
          enabled: category.enabled,
        });
      }
    });
  }

  selectIcon(iconId: string): void {
    this.form.patchValue({ icon: iconId });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data = this.form.value;

    if (this.isEditMode && this.categoryId) {
      this.categoryService.update(this.categoryId, data).subscribe(result => {
        if (result) {
          this.router.navigate(['..'], { relativeTo: this.route });
        }
      });
    } else {
      this.categoryService.create(data).subscribe(result => {
        if (result) {
          this.router.navigate(['..'], { relativeTo: this.route });
        }
      });
    }
  }
}
