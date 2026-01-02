/**
 * Category Browse Component (Admin)
 * 
 * BREAD: Browse view for FAQ categories.
 * Allows admins to view, reorder, enable/disable categories.
 */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { FaqCategoryService } from '../../../../services';
import { FaqCategoryViewModel } from '../../../../models';

@Component({
  selector: 'app-category-browse',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="category-browse">
      <!-- Top Navigation Bar -->
      <div class="top-nav-bar mb-4 d-flex justify-content-between align-items-center">
        <a routerLink="../.." class="btn btn-primary">
          <i class="bx bx-arrow-back me-1"></i>
          Back to FAQs
        </a>
        
        <a routerLink="add" class="btn btn-success">
          <i class="bx bx-plus me-1"></i>
          Add Category
        </a>
      </div>

      <!-- Header -->
      <div class="browse-header mb-4">
        <h4 class="mb-1">
          <i class="bx bx-folder me-2"></i>
          Manage FAQ Categories
        </h4>
        <p class="text-muted mb-0">
          {{ categoryService.categories().length }} categories
        </p>
      </div>

      <!-- Tabs -->
      <ul class="nav nav-tabs mb-4">
        <li class="nav-item">
          <a 
            class="nav-link active"
            style="cursor: pointer;">
            Categories ({{ categoryService.categories().length }})
          </a>
        </li>
        <li class="nav-item">
          <a 
            routerLink="../items"
            class="nav-link"
            style="cursor: pointer;">
            FAQ Items
          </a>
        </li>
      </ul>

      <!-- Loading -->
      @if (categoryService.loading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>
      }

      <!-- Categories List -->
      @if (!categoryService.loading()) {
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th style="width: 50px;">Order</th>
                <th>Category</th>
                <th style="width: 100px;">Items</th>
                <th style="width: 100px;">Status</th>
                <th style="width: 150px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (category of categoryService.categories(); track category.id) {
                <tr [class.table-secondary]="!category.enabled">
                  <td>
                    <span class="badge bg-light text-dark">{{ category.order }}</span>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="category-icon me-3">
                        <i class="{{ category.iconClass }} fs-20 text-primary"></i>
                      </div>
                      <div>
                        <h6 class="mb-0">{{ category.title }}</h6>
                        @if (category.description) {
                          <small class="text-muted">{{ category.description }}</small>
                        }
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge bg-info-subtle text-info">
                      {{ category.itemCount }} items
                    </span>
                  </td>
                  <td>
                    <span 
                      class="badge"
                      [class.bg-success-subtle]="category.enabled"
                      [class.text-success]="category.enabled"
                      [class.bg-secondary-subtle]="!category.enabled"
                      [class.text-secondary]="!category.enabled">
                      {{ category.enabled ? 'Enabled' : 'Disabled' }}
                    </span>
                  </td>
                  <td>
                    <div class="d-flex gap-1">
                      <a 
                        [routerLink]="[category.id, 'edit']" 
                        class="btn btn-sm btn-outline-primary"
                        title="Edit">
                        <i class="bx bx-edit"></i>
                      </a>
                      <button 
                        type="button"
                        class="btn btn-sm"
                        [class.btn-outline-success]="!category.enabled"
                        [class.btn-outline-secondary]="category.enabled"
                        (click)="toggleEnabled(category)"
                        [title]="category.enabled ? 'Disable' : 'Enable'">
                        <i class="bx" [class.bx-show]="!category.enabled" [class.bx-hide]="category.enabled"></i>
                      </button>
                      <button 
                        type="button"
                        class="btn btn-sm btn-outline-danger"
                        (click)="confirmDelete(category)"
                        [disabled]="category.itemCount > 0"
                        title="Delete">
                        <i class="bx bx-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        @if (categoryService.categories().length === 0) {
          <div class="text-center py-5 text-muted">
            <i class="bx bx-folder display-4"></i>
            <p class="mt-3">No categories yet.</p>
            <a routerLink="add" class="btn btn-primary">
              <i class="bx bx-plus me-1"></i>
              Create First Category
            </a>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .category-browse {
      padding: 1.5rem;
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .category-icon {
      width: 40px;
      height: 40px;
      background: var(--vz-primary-bg-subtle);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class CategoryBrowseComponent implements OnInit {
  categoryService = inject(FaqCategoryService);
  private router = inject(Router);

  ngOnInit(): void {
    this.categoryService.refresh();
  }

  toggleEnabled(category: FaqCategoryViewModel): void {
    this.categoryService.toggleEnabled(category.id).subscribe();
  }

  confirmDelete(category: FaqCategoryViewModel): void {
    if (category.itemCount > 0) {
      alert('Cannot delete category with items. Move or delete items first.');
      return;
    }
    
    if (confirm(`Are you sure you want to delete "${category.title}"?`)) {
      this.categoryService.delete(category.id).subscribe();
    }
  }
}
