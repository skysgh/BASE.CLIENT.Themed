/**
 * Wiki Hub Component
 * 
 * Main entry point for the wiki - shows available namespaces
 * and recent/featured pages.
 */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { WikiService } from '../../../services/wiki.service';

@Component({
  selector: 'app-wiki-hub',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="wiki-hub">
      <!-- Header -->
      <div class="hub-header mb-4">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <h4 class="mb-1">
              <i class="bx bx-book-open me-2 text-primary"></i>
              Wiki
            </h4>
            <p class="text-muted mb-0">Browse documentation and knowledge base articles.</p>
          </div>
          @if (wikiService.editingEnabled()) {
            <a routerLink="edit/public" class="btn btn-primary btn-sm">
              <i class="bx bx-plus me-1"></i>
              New Page
            </a>
          }
        </div>
      </div>

      <!-- Search -->
      <div class="search-section mb-4">
        <div class="input-group">
          <span class="input-group-text bg-transparent">
            <i class="bx bx-search"></i>
          </span>
          <input 
            type="text" 
            class="form-control"
            placeholder="Search wiki pages..."
            [(ngModel)]="searchQuery"
            (input)="onSearch()">
          @if (searchQuery) {
            <button class="btn btn-outline-secondary" type="button" (click)="clearSearch()">
              <i class="bx bx-x"></i>
            </button>
          }
        </div>
      </div>

      <!-- Search Results -->
      @if (searchQuery && searchResults.length > 0) {
        <div class="search-results mb-4">
          <h6 class="text-muted mb-3">
            <i class="bx bx-search me-1"></i>
            Search Results ({{ searchResults.length }})
          </h6>
          <div class="list-group">
            @for (result of searchResults; track result.page.id) {
              <a 
                [routerLink]="[result.page.namespace, result.page.slug]"
                class="list-group-item list-group-item-action">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <i class="bx {{ result.page.icon || 'bx-file-blank' }} me-2 text-muted"></i>
                    <strong>{{ result.page.title }}</strong>
                    <span class="text-muted ms-2 small">{{ result.page.namespace }}</span>
                  </div>
                  <span class="badge bg-light text-secondary">
                    {{ result.score }} pts
                  </span>
                </div>
                @if (result.excerpt) {
                  <p class="text-muted small mb-0 mt-1">{{ result.excerpt }}</p>
                }
              </a>
            }
          </div>
        </div>
      }

      @if (searchQuery && searchResults.length === 0) {
        <div class="text-center py-4 text-muted mb-4">
          <i class="bx bx-search-alt display-4"></i>
          <p class="mt-2">No pages found matching "{{ searchQuery }}"</p>
        </div>
      }

      <!-- Loading -->
      @if (wikiService.loading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary"></div>
          <p class="text-muted mt-2">Loading...</p>
        </div>
      }

      <!-- Namespaces -->
      @if (!wikiService.loading() && !searchQuery) {
        <div class="namespaces-section">
          <h6 class="text-muted mb-3">
            <i class="bx bx-folder me-1"></i>
            Browse by Namespace
          </h6>
          <div class="row">
            @for (ns of wikiService.namespaces(); track ns.id) {
              <div class="col-md-6 col-lg-4 mb-4">
                <a 
                  [routerLink]="[ns.id]"
                  class="card h-100 namespace-card text-decoration-none">
                  <div class="card-body">
                    <div class="d-flex align-items-center mb-2">
                      <i class="bx {{ ns.icon || 'bx-folder' }} fs-24 text-primary me-2"></i>
                      <h6 class="mb-0 text-body">{{ ns.name }}</h6>
                    </div>
                    @if (ns.description) {
                      <p class="text-muted small mb-2">{{ ns.description }}</p>
                    }
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="badge bg-light text-secondary">
                        {{ ns.pageCount }} pages
                      </span>
                      <i class="bx bx-chevron-right text-muted"></i>
                    </div>
                  </div>
                </a>
              </div>
            }

            @if (wikiService.namespaces().length === 0) {
              <div class="col-12">
                <div class="text-center py-5 text-muted">
                  <i class="bx bx-book-open display-4"></i>
                  <p class="mt-3">No namespaces available.</p>
                  @if (wikiService.editingEnabled()) {
                    <a routerLink="edit/public" class="btn btn-outline-primary">
                      <i class="bx bx-plus me-1"></i>
                      Create First Page
                    </a>
                  }
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Quick Links / Recent Pages -->
        @if (recentPages.length > 0) {
          <div class="recent-section mt-4">
            <h6 class="text-muted mb-3">
              <i class="bx bx-time me-1"></i>
              Recently Updated
            </h6>
            <div class="list-group">
              @for (page of recentPages; track page.id) {
                <a 
                  [routerLink]="[page.namespace, page.slug]"
                  class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                  <div>
                    <i class="bx {{ page.icon || 'bx-file-blank' }} me-2 text-muted"></i>
                    {{ page.title }}
                    <span class="text-muted ms-2 small">{{ page.namespace }}</span>
                  </div>
                  <span class="text-muted small">
                    {{ page.updatedUtc | date:'short' }}
                  </span>
                </a>
              }
            </div>
          </div>
        }
      }

      <!-- Help tip -->
      <div class="mt-4 pt-3 border-top">
        <p class="text-muted small mb-0">
          <i class="bx bx-info-circle me-1"></i>
          Tip: Use the search above to find pages across all namespaces, or browse by namespace below.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .wiki-hub {
      padding: 1.5rem;
      max-width: 1000px;
      margin: 0 auto;
    }

    .namespace-card {
      transition: all 0.2s ease;
      border: 1px solid var(--vz-border-color);
    }

    .namespace-card:hover {
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      border-color: var(--vz-primary);
    }
  `]
})
export class WikiHubComponent implements OnInit {
  wikiService = inject(WikiService);

  searchQuery = '';
  searchResults: any[] = [];
  recentPages: any[] = [];

  ngOnInit(): void {
    this.wikiService.loadNamespaces().subscribe(() => {
      this.loadRecentPages();
    });
  }

  onSearch(): void {
    if (this.searchQuery.length >= 2) {
      this.wikiService.searchPages(this.searchQuery).subscribe(results => {
        this.searchResults = results;
      });
    } else {
      this.searchResults = [];
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
  }

  private loadRecentPages(): void {
    // Load pages from all namespaces and get recent ones
    const namespaces = this.wikiService.namespaces();
    if (namespaces.length > 0) {
      // For now, just use the first namespace's pages as mock recent
      this.wikiService.loadPagesForNamespace(namespaces[0].id).subscribe(() => {
        const pages = this.wikiService.pages();
        this.recentPages = pages
          .sort((a, b) => new Date(b.updatedUtc).getTime() - new Date(a.updatedUtc).getTime())
          .slice(0, 5);
      });
    }
  }
}
