/**
 * FAQ Hub Component
 * 
 * Main entry point for the FAQ module.
 * Shows all enabled categories with their FAQ items.
 */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { FaqCategoryService, FaqItemService } from '../../../services';

@Component({
  selector: 'app-faq-hub',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbAccordionModule],
  template: `
    <div class="faq-hub">
      <!-- Top Navigation Bar -->
      <div class="top-nav-bar mb-4 d-flex justify-content-between align-items-center">
        <button type="button" class="btn btn-primary" (click)="goBack()">
          <i class="bx bx-arrow-back me-1"></i>
          Back
        </button>
        
        <!-- Admin Link (future: role-gated) -->
        <a routerLink="admin/categories" class="btn btn-outline-secondary btn-sm">
          <i class="bx bx-cog me-1"></i>
          Manage FAQs
        </a>
      </div>

      <!-- Header -->
      <div class="faq-header text-center mb-5">
        <div class="faq-icon-large mb-3">
          <i class="bx bx-help-circle"></i>
        </div>
        <h2 class="mb-2">Frequently Asked Questions</h2>
        <p class="text-muted mb-0">
          Find answers to common questions about our platform.
        </p>
      </div>

      <!-- Loading -->
      @if (categoryService.loading() || itemService.loading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>
      }

      <!-- Error -->
      @if (categoryService.error() || itemService.error()) {
        <div class="alert alert-warning">
          {{ categoryService.error() || itemService.error() }}
        </div>
      }

      <!-- Categories & FAQs -->
      @if (!categoryService.loading() && !itemService.loading()) {
        <div class="row g-lg-5 g-4">
          @for (category of categoryService.enabledCategories(); track category.id) {
            <div class="col-lg-6">
              <!-- Category Header -->
              <div class="d-flex align-items-center mb-3">
                <div class="category-icon me-2">
                  <i class="{{ category.iconClass }} fs-24 text-primary"></i>
                </div>
                <div class="flex-grow-1">
                  <h5 class="mb-0 fw-semibold">{{ category.title }}</h5>
                  @if (category.description) {
                    <p class="text-muted small mb-0">{{ category.description }}</p>
                  }
                </div>
                <span class="badge bg-light text-secondary">
                  {{ category.itemCount }} items
                </span>
              </div>

              <!-- FAQ Accordion -->
              <div class="faq-accordion">
                <div ngbAccordion [closeOthers]="true">
                  @for (item of itemService.getByCategory(category.id); track item.id; let i = $index) {
                    <div ngbAccordionItem [id]="'faq-' + category.id + '-' + i">
                      <h2 ngbAccordionHeader class="accordion-header">
                        <button ngbAccordionButton>{{ item.question }}</button>
                      </h2>
                      <div ngbAccordionCollapse>
                        <div ngbAccordionBody>
                          <ng-template>
                            <div class="accordion-body text-muted">
                              {{ item.answer }}
                            </div>
                          </ng-template>
                        </div>
                      </div>
                    </div>
                  }
                  @if (itemService.getByCategory(category.id).length === 0) {
                    <p class="text-muted small py-2">No FAQs in this category.</p>
                  }
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Empty State -->
        @if (categoryService.enabledCategories().length === 0) {
          <div class="text-center py-5 text-muted">
            <i class="bx bx-help-circle display-4"></i>
            <p class="mt-3">No FAQ categories available yet.</p>
          </div>
        }
      }

      <!-- Still Need Help -->
      <div class="help-footer text-center mt-5 pt-4 border-top">
        <p class="text-muted mb-3">Can't find what you're looking for?</p>
        <div class="d-flex justify-content-center gap-3 flex-wrap">
          <a routerLink="/system/support" class="btn btn-primary">
            <i class="bx bx-support me-1"></i>
            Contact Support
          </a>
          <a routerLink="/system/help" class="btn btn-outline-secondary">
            <i class="bx bx-book-open me-1"></i>
            Browse Documentation
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .faq-hub {
      padding: 2rem;
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .faq-icon-large {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, var(--vz-primary), #667eea);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      font-size: 2.5rem;
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
    
    .faq-accordion {
      border: 1px solid var(--vz-border-color);
      border-radius: 0.5rem;
      overflow: hidden;
    }
    
    :host ::ng-deep .accordion-button {
      background: transparent;
      box-shadow: none;
      font-weight: 500;
    }
    
    :host ::ng-deep .accordion-button:not(.collapsed) {
      color: var(--vz-primary);
      background: var(--vz-primary-bg-subtle);
    }
  `]
})
export class FaqHubComponent implements OnInit {
  categoryService = inject(FaqCategoryService);
  itemService = inject(FaqItemService);
  private location = inject(Location);

  ngOnInit(): void {
    // Services auto-load data in constructors
    // Trigger refresh if needed
    this.categoryService.refresh();
    this.itemService.refresh();
  }

  goBack(): void {
    this.location.back();
  }
}
