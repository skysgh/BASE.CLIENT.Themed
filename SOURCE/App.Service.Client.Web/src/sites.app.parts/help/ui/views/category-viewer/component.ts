/**
 * Category Viewer Component
 * 
 * Displays articles within a specific category.
 */
import { Component, inject, OnInit, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { HelpService } from '../../../services/help.service';
import { HelpCategory } from '../../../models';

@Component({
  selector: 'app-category-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="category-viewer">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <a routerLink="../..">
              <i class="bx bx-help-circle me-1"></i>
              Help
            </a>
          </li>
          @if (category()) {
            <li class="breadcrumb-item active">{{ category()!.name }}</li>
          }
        </ol>
      </nav>

      @if (category(); as cat) {
        <!-- Category Header -->
        <div class="category-header mb-4">
          <div class="d-flex align-items-center mb-3">
            <div class="category-icon me-3">
              <i class="bx {{ cat.icon || 'bx-folder' }} fs-32"></i>
            </div>
            <div>
              <h2 class="mb-1">{{ cat.name }}</h2>
              @if (cat.description) {
                <p class="text-muted mb-0">{{ cat.description }}</p>
              }
            </div>
          </div>
        </div>

        <!-- Articles List -->
        <div class="articles-list">
          @if (categoryArticles().length === 0) {
            <div class="text-center py-5 text-muted">
              <i class="bx bx-file display-1"></i>
              <p class="mt-3">No articles in this category yet.</p>
              <a routerLink="../.." class="btn btn-outline-primary">
                Back to Help
              </a>
            </div>
          } @else {
            <div class="list-group">
              @for (article of categoryArticles(); track article.id) {
                <a 
                  [routerLink]="['../../article', article.id]"
                  class="list-group-item list-group-item-action">
                  <div class="d-flex align-items-center">
                    <div class="article-icon me-3">
                      <i class="bx {{ article.icon || 'bx-file' }} fs-20 text-primary"></i>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="mb-1">{{ article.title }}</h6>
                      @if (article.description) {
                        <p class="text-muted small mb-0">{{ article.description }}</p>
                      }
                    </div>
                    @if (article.tags && article.tags.length > 0) {
                      <div class="article-tags me-3 d-none d-md-block">
                        @for (tag of article.tags.slice(0, 2); track tag) {
                          <span class="badge bg-light text-secondary me-1">{{ tag }}</span>
                        }
                      </div>
                    }
                    <i class="bx bx-chevron-right text-muted"></i>
                  </div>
                </a>
              }
            </div>
          }
        </div>
      }

      <!-- Footer -->
      <div class="mt-4">
        <a routerLink="../.." class="btn btn-outline-secondary">
          <i class="bx bx-arrow-back me-1"></i>
          Back to Help
        </a>
      </div>
    </div>
  `,
  styles: [`
    .category-viewer {
      padding: 1.5rem;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .category-icon {
      width: 60px;
      height: 60px;
      background: var(--vz-primary-bg-subtle);
      color: var(--vz-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .article-icon {
      width: 40px;
      height: 40px;
      background: var(--vz-light);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .list-group-item:hover .article-icon {
      background: var(--vz-primary-bg-subtle);
    }
  `]
})
export class CategoryViewerComponent implements OnInit, OnDestroy {
  helpService = inject(HelpService);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  private categoryId = '';

  category = computed(() => {
    return this.helpService.categories().find(c => c.id === this.categoryId);
  });

  categoryArticles = computed(() => {
    return this.helpService.getArticlesByCategory(this.categoryId);
  });

  ngOnInit(): void {
    // Load article index if not already loaded
    this.helpService.loadArticleIndex();
    
    // Watch for category changes
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.categoryId = params.get('categoryId') || '';
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
