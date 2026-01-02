/**
 * FAQ Viewer Component
 * 
 * Reusable standalone component for displaying FAQs in accordion format.
 * Can be used by:
 * - sites.anon landing page
 * - sites.app help section
 * - Any other module needing FAQ display
 * 
 * Now loads categories dynamically from FaqCategoryService.
 */
import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { FaqCategoryService, FaqItemService } from '../../../sites.app.parts/faq/services';
import { FaqCategoryViewModel, FaqItemViewModel } from '../../../sites.app.parts/faq/models';

/**
 * FAQ Category definition (legacy - for backward compatibility)
 * @deprecated Use FaqCategoryViewModel from faq/models instead
 */
export interface FaqCategoryConfig {
  id: string;
  name: string;
  icon?: string;
  iconClass?: string;
}

@Component({
  selector: 'app-faq-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbAccordionModule],
  template: `
    <div class="faq-viewer">
      <!-- Header (optional) -->
      @if (showHeader) {
        <div class="faq-header text-center mb-5">
          <h3 class="mb-3 fw-semibold">{{ title }}</h3>
          @if (description) {
            <p class="text-muted mb-4">{{ description }}</p>
          }
        </div>
      }

      <!-- Loading State -->
      @if (categoryService.loading() || itemService.loading()) {
        <div class="text-center py-4">
          <div class="spinner-border spinner-border-sm text-primary"></div>
          <p class="text-muted small mt-2">Loading FAQs...</p>
        </div>
      }

      <!-- Error State -->
      @if (categoryService.error() || itemService.error()) {
        <div class="alert alert-warning">
          <i class="bx bx-error-circle me-2"></i>
          {{ categoryService.error() || itemService.error() }}
        </div>
      }

      <!-- FAQs Content -->
      @if (!categoryService.loading() && !itemService.loading()) {
        <!-- Category View (dynamic categories) -->
        @if (showCategories) {
          <div class="row g-lg-5 g-4">
            @for (category of displayCategories; track category.id) {
              <div [class]="getCategoryColClass()">
                <div class="d-flex align-items-center mb-2">
                  <div class="flex-shrink-0 me-1">
                    <i [class]="category.iconClass + ' fs-24 align-middle text-success me-1'"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h5 class="mb-0 fw-semibold">{{ category.title }}</h5>
                  </div>
                </div>
                
                <div class="custom-accordion-border">
                  <div ngbAccordion [closeOthers]="true">
                    @for (faq of getItemsForCategory(category.id); track faq.id; let i = $index) {
                      <div ngbAccordionItem [id]="'faq-' + category.id + '-' + i">
                        <h2 ngbAccordionHeader class="accordion-header border-0 bg-transparent">
                          <button ngbAccordionButton>{{ faq.question }}</button>
                        </h2>
                        <div ngbAccordionCollapse>
                          <div ngbAccordionBody>
                            <ng-template>
                              <div class="accordion-body ff-secondary">
                                {{ faq.answer }}
                              </div>
                            </ng-template>
                          </div>
                        </div>
                      </div>
                    }
                    @if (getItemsForCategory(category.id).length === 0) {
                      <p class="text-muted small py-2">No FAQs in this category.</p>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        }

        <!-- Flat View (all FAQs) -->
        @if (!showCategories) {
          <div class="custom-accordion-border">
            <div ngbAccordion [closeOthers]="true">
              @for (faq of itemService.enabledItems(); track faq.id; let i = $index) {
                <div ngbAccordionItem [id]="'faq-' + i">
                  <h2 ngbAccordionHeader class="accordion-header border-0 bg-transparent">
                    <button ngbAccordionButton>{{ faq.question }}</button>
                  </h2>
                  <div ngbAccordionCollapse>
                    <div ngbAccordionBody>
                      <ng-template>
                        <div class="accordion-body ff-secondary">
                          {{ faq.answer }}
                        </div>
                      </ng-template>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <!-- Empty State -->
        @if (itemService.enabledItems().length === 0) {
          <div class="text-center py-5 text-muted">
            <i class="bx bx-help-circle display-4"></i>
            <p class="mt-3">No FAQs available yet.</p>
          </div>
        }
      }

      <!-- Footer (optional) -->
      @if (showContactLink) {
        <div class="faq-footer text-center mt-5 pt-4 border-top">
          <p class="text-muted mb-3">Can't find what you're looking for?</p>
          <a [routerLink]="contactLink" class="btn btn-outline-primary">
            <i class="bx bx-support me-1"></i>
            Contact Support
          </a>
        </div>
      }
    </div>
  `,
  styles: [`
    .faq-viewer { }
    
    .custom-accordion-border {
      border: 1px solid var(--vz-border-color);
      border-radius: 0.5rem;
      padding: 0.5rem;
    }
    
    .accordion-header {
      background: transparent;
    }
    
    :host ::ng-deep .accordion-button {
      background: transparent;
      box-shadow: none;
      font-weight: 500;
    }
    
    :host ::ng-deep .accordion-button:not(.collapsed) {
      color: var(--vz-primary);
      background: transparent;
    }
    
    :host ::ng-deep .accordion-body {
      padding-top: 0;
    }
  `]
})
export class FaqViewerComponent implements OnInit {
  categoryService = inject(FaqCategoryService);
  itemService = inject(FaqItemService);

  /** Show section header */
  @Input() showHeader = true;
  
  /** Header title */
  @Input() title = 'Frequently Asked Questions';
  
  /** Header description */
  @Input() description = 'Find answers to common questions below.';
  
  /** Show FAQs grouped by category */
  @Input() showCategories = true;
  
  /** 
   * Override categories (legacy support).
   * If provided, uses these instead of dynamic categories.
   */
  @Input() categories: FaqCategoryConfig[] = [];
  
  /** Number of columns for categories (2, 3, or 4) */
  @Input() columns: 2 | 3 | 4 = 2;
  
  /** Maximum FAQs per category (0 = unlimited) */
  @Input() maxPerCategory = 0;
  
  /** Show contact support link at bottom */
  @Input() showContactLink = false;
  
  /** Contact link destination */
  @Input() contactLink = '/system/support';

  ngOnInit(): void {
    // Trigger refresh to ensure data is loaded
    this.categoryService.refresh();
    this.itemService.refresh();
  }

  /**
   * Get categories to display.
   * Uses dynamic categories from service, unless overridden by input.
   */
  get displayCategories(): FaqCategoryViewModel[] {
    // If legacy categories provided, map them
    if (this.categories.length > 0) {
      return this.categories.map(c => ({
        id: c.id,
        title: c.name,
        description: '',
        icon: c.icon || 'bx-help-circle',
        iconClass: c.iconClass || `bx ${c.icon || 'bx-help-circle'}`,
        order: 0,
        enabled: true,
        cultureCode: 'en',
        createdAt: new Date(),
        updatedAt: new Date(),
        itemCount: 0,
        displayLabel: c.name,
      }));
    }
    
    // Use dynamic categories from service
    return this.categoryService.enabledCategories();
  }

  /**
   * Get items for a category
   */
  getItemsForCategory(categoryId: string): FaqItemViewModel[] {
    const items = this.itemService.getByCategory(categoryId);
    if (this.maxPerCategory > 0) {
      return items.slice(0, this.maxPerCategory);
    }
    return items;
  }

  getCategoryColClass(): string {
    switch (this.columns) {
      case 2: return 'col-lg-6';
      case 3: return 'col-lg-4';
      case 4: return 'col-lg-3';
      default: return 'col-lg-6';
    }
  }
}
