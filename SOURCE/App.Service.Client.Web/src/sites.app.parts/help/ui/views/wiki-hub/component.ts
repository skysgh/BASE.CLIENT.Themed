/**
 * Wiki Hub Component
 * 
 * Documentation hub - shows categories and articles.
 * This is the "wiki" subsection of Help.
 * Uses standard PageHeader for consistent navigation.
 * 
 * Culture-aware: /help/wiki/{culture}/...
 */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HelpService } from '../../../services/help.service';
import { PageHeaderComponent } from '../../../../../sites/ui/widgets/page-header';

@Component({
  selector: 'app-wiki-hub',
  standalone: true,
  imports: [CommonModule, RouterModule, PageHeaderComponent],
  template: `
    <div class="wiki-hub">
      <!-- Standard Page Header -->
      <app-page-header 
        title="Documentation & Guides"
        icon="bx-book-open"
        iconBackground="bg-info-subtle"
        iconClass="text-info"
        [showBack]="true"
        [showBreadcrumb]="true">
        <ng-container subtitle>Browse our knowledge base for detailed guides and tutorials</ng-container>
        <ng-container actions>
          <!-- Culture Selector (future) -->
          <span class="badge bg-light text-secondary">
            <i class="bx bx-globe me-1"></i>
            {{ helpService.currentCulture() }}
          </span>
        </ng-container>
      </app-page-header>

      <!-- Loading -->
      @if (helpService.loading()) {
        <div class="text-center py-4">
          <div class="spinner-border text-primary"></div>
        </div>
      }

      <!-- Categories & Articles -->
      @if (!helpService.loading()) {
        <div class="categories-section">
          <div class="row">
            @for (category of helpService.categories(); track category.id) {
              <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 category-card">
                  <div class="card-header bg-transparent d-flex align-items-center">
                    <i class="bx {{ category.icon || 'bx-folder' }} fs-20 text-info me-2"></i>
                    <h6 class="mb-0">{{ category.name }}</h6>
                  </div>
                  <div class="card-body">
                    @if (category.description) {
                      <p class="text-muted small mb-3">{{ category.description }}</p>
                    }
                    <ul class="list-unstyled mb-0">
                      @for (article of getArticlesForCategory(category.id).slice(0, 5); track article.id) {
                        <li class="mb-2">
                          <a [routerLink]="['article', article.id]" class="text-body">
                            <i class="bx bx-file-blank me-1 text-muted"></i>
                            {{ article.title }}
                          </a>
                        </li>
                      }
                      @if (getArticlesForCategory(category.id).length === 0) {
                        <li class="text-muted small">No articles yet</li>
                      }
                      @if (getArticlesForCategory(category.id).length > 5) {
                        <li class="mt-2">
                          <a [routerLink]="['category', category.id]" class="text-info small">
                            View all {{ getArticlesForCategory(category.id).length }} articles →
                          </a>
                        </li>
                      }
                    </ul>
                  </div>
                </div>
              </div>
            }
          </div>

          @if (helpService.categories().length === 0) {
            <div class="text-center py-5 text-muted">
              <i class="bx bx-book-open display-4"></i>
              <p class="mt-3">No documentation available yet.</p>
            </div>
          }
        </div>
      }

      <!-- Tip: Use Universal Search -->
      <div class="mt-4 pt-3 border-top">
        <p class="text-muted small mb-0">
          <i class="bx bx-info-circle me-1"></i>
          Tip: Use the search in the toolbar to find articles across all documentation.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .wiki-hub {
      padding: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .category-card {
      transition: all 0.2s ease;
    }
    .category-card:hover {
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
  `]
})
export class WikiHubComponent implements OnInit {
  helpService = inject(HelpService);

  ngOnInit(): void {
    this.helpService.loadArticleIndex();
  }

  getArticlesForCategory(categoryId: string) {
    return this.helpService.getArticlesByCategory(categoryId);
  }
}
