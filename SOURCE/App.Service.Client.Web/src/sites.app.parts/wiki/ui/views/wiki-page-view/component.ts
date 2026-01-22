/**
 * Wiki Page View Component
 * 
 * Container component for displaying a wiki page.
 * Shows content, table of contents, and page metadata.
 * Uses standard PageHeader for consistent navigation.
 */
import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { WikiService } from '../../../services/wiki.service';
import { WikiViewerComponent } from '../../widgets/wiki-viewer/component';
import { WikiSidebarComponent } from '../../widgets/wiki-sidebar/component';
import { PageHeaderComponent } from '../../../../../sites/ui/widgets/page-header';

@Component({
  selector: 'app-wiki-page-view',
  standalone: true,
  imports: [CommonModule, RouterModule, WikiViewerComponent, WikiSidebarComponent, PageHeaderComponent],
  template: `
    <div class="wiki-page-view">
      <!-- Standard Page Header -->
      <app-page-header 
        [title]="wikiService.currentPage()?.title || 'Wiki Page'"
        icon="bx-file-blank"
        iconBackground="bg-primary-subtle"
        iconClass="text-primary"
        [showBack]="true"
        [showBreadcrumb]="true">
        <ng-container subtitle>
          @if (wikiService.currentPage(); as page) {
            {{ getNamespaceName(page.namespace) }}
          }
        </ng-container>
        <ng-container actions>
          @if (wikiService.currentPage(); as page) {
            @if (wikiService.canEditPage(page)) {
              <a 
                [routerLink]="['../../edit', page.namespace, page.slug]"
                class="btn btn-outline-primary btn-sm">
                <i class="bx bx-edit me-1"></i>
                Edit
              </a>
            }
          }
        </ng-container>
      </app-page-header>

      <div class="row">
        <!-- Sidebar -->
        <div class="col-lg-3 d-none d-lg-block">
          <app-wiki-sidebar
            [namespace]="currentNamespace()"
            [currentSlug]="currentSlug()"
            (pageSelected)="onPageSelected($event)">
          </app-wiki-sidebar>
        </div>

        <!-- Main Content -->
        <div class="col-lg-9">
          <!-- Loading -->
          @if (wikiService.loading()) {
            <div class="text-center py-5">
              <div class="spinner-border text-primary"></div>
              <p class="text-muted mt-2">Loading page...</p>
            </div>
          }

          <!-- Error -->
          @if (wikiService.error()) {
            <div class="alert alert-warning">
              <i class="bx bx-error-circle me-2"></i>
              {{ wikiService.error() }}
              <div class="mt-3">
                <a routerLink="../" class="btn btn-outline-primary btn-sm">
                  <i class="bx bx-arrow-back me-1"></i>
                  Back to Wiki
                </a>
              </div>
            </div>
          }

          <!-- Page Content -->
          @if (wikiService.currentPage(); as page) {
            <article class="wiki-page">
              <!-- Meta info -->
              <div class="page-meta mb-4 d-flex gap-3 flex-wrap text-muted small">
                @if (page.authorName) {
                  <span>
                    <i class="bx bx-user me-1"></i>
                    {{ page.authorName }}
                  </span>
                }
                @if (page.updatedUtc) {
                  <span>
                    <i class="bx bx-calendar me-1"></i>
                    Updated {{ page.updatedUtc | date }}
                  </span>
                }
                @if (page.readingTime) {
                  <span>
                    <i class="bx bx-time me-1"></i>
                    {{ page.readingTime }} min read
                  </span>
                }
                <span class="badge bg-{{ getStatusBadge(page.status) }}">
                  {{ page.status }}
                </span>
              </div>

              <!-- Tags -->
              @if (page.tags && page.tags.length > 0) {
                <div class="page-tags mb-4">
                  @for (tag of page.tags; track tag) {
                    <span class="badge bg-light text-secondary me-1">
                      <i class="bx bx-tag-alt me-1"></i>
                      {{ tag }}
                    </span>
                  }
                </div>
              }

              <!-- Table of Contents (if exists) -->
              @if (page.toc && page.toc.length > 2) {
                <div class="toc-card card mb-4">
                  <div class="card-header bg-transparent py-2">
                    <i class="bx bx-list-ol me-2"></i>
                    Table of Contents
                  </div>
                  <div class="card-body py-2">
                    <ul class="toc-list list-unstyled mb-0">
                      @for (entry of page.toc; track entry.id) {
                        <li [style.padding-left.rem]="(entry.level - 1) * 0.75">
                          <a 
                            [href]="'#' + entry.id" 
                            class="text-body small"
                            (click)="scrollToSection($event, entry.id)">
                            {{ entry.title }}
                          </a>
                        </li>
                      }
                    </ul>
                  </div>
                </div>
              }

              <!-- Content -->
              <div class="page-content card">
                <div class="card-body">
                  <app-wiki-viewer 
                    [content]="page.content"
                    [loading]="wikiService.loading()"
                    [enableSyntaxHighlight]="true">
                  </app-wiki-viewer>
                </div>
              </div>

              <!-- Footer -->
              <div class="page-footer mt-4 pt-3 border-top">
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <a routerLink="../" class="btn btn-outline-secondary btn-sm">
                    <i class="bx bx-arrow-back me-1"></i>
                    Back to Namespace
                  </a>
                  <div class="d-flex gap-2 align-items-center">
                    <span class="text-muted small me-2">Was this helpful?</span>
                    <button class="btn btn-outline-success btn-sm" (click)="onFeedback(true)">
                      <i class="bx bx-like"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm" (click)="onFeedback(false)">
                      <i class="bx bx-dislike"></i>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .wiki-page-view {
      padding: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .toc-list li {
      padding: 0.25rem 0;
    }

    .toc-list a:hover {
      color: var(--vz-primary) !important;
    }

    .page-content {
      min-height: 300px;
    }
  `]
})
export class WikiPageViewComponent implements OnInit, OnDestroy {
  wikiService = inject(WikiService);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  currentNamespace = signal('');
  currentSlug = signal('');

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const namespace = params.get('namespace') || '';
      const slug = params.get('slug') || '';

      this.currentNamespace.set(namespace);
      this.currentSlug.set(slug);

      if (namespace && slug) {
        this.wikiService.loadPage(namespace, slug).subscribe();
      } else if (namespace) {
        // Just namespace, load namespace index
        this.wikiService.loadPagesForNamespace(namespace).subscribe();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.wikiService.clearCurrentPage();
  }

  getNamespaceName(namespaceId: string): string {
    const config = this.wikiService.getNamespaceConfig(namespaceId);
    return config?.name || namespaceId;
  }

  getStatusBadge(status: string): string {
    const badges: Record<string, string> = {
      'draft': 'secondary',
      'pending': 'warning',
      'published': 'success',
      'archived': 'dark',
    };
    return badges[status] || 'secondary';
  }

  scrollToSection(event: Event, sectionId: string): void {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  onPageSelected(path: string): void {
    // Navigation handled by router
  }

  onFeedback(helpful: boolean): void {
    console.log('[Wiki] Page feedback:', helpful ? 'helpful' : 'not helpful');
    // TODO: Send to analytics
  }
}
