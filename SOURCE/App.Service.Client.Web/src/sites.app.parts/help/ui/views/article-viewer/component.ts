/**
 * Article Viewer Component
 * 
 * Displays a single help article with markdown rendering.
 */
import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { HelpService } from '../../../services/help.service';

@Component({
  selector: 'app-article-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="article-viewer">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <a routerLink="../../..">
              <i class="bx bx-help-circle me-1"></i>
              Help
            </a>
          </li>
          <li class="breadcrumb-item">
            <a routerLink="..">Wiki</a>
          </li>
          @if (helpService.currentArticle(); as article) {
            <li class="breadcrumb-item">
              <a [routerLink]="['../category', article.category]">
                {{ article.category | titlecase }}
              </a>
            </li>
            <li class="breadcrumb-item active">{{ article.title }}</li>
          }
        </ol>
      </nav>

      <!-- Loading -->
      @if (helpService.loading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary"></div>
          <p class="text-muted mt-2">Loading article...</p>
        </div>
      }

      <!-- Error -->
      @if (helpService.error()) {
        <div class="alert alert-warning">
          <i class="bx bx-error-circle me-2"></i>
          {{ helpService.error() }}
          <div class="mt-3">
            <a routerLink=".." class="btn btn-outline-primary btn-sm">
              <i class="bx bx-arrow-back me-1"></i>
              Back to Wiki
            </a>
          </div>
        </div>
      }

      <!-- Article Content -->
      @if (helpService.currentArticle(); as article) {
        <article class="help-article">
          <!-- Header -->
          <header class="article-header mb-4">
            <h1 class="article-title mb-3">{{ article.title }}</h1>
            @if (article.description) {
              <p class="lead text-muted">{{ article.description }}</p>
            }
            <div class="article-meta d-flex gap-3 flex-wrap text-muted small">
              @if (article.author) {
                <span>
                  <i class="bx bx-user me-1"></i>
                  {{ article.author }}
                </span>
              }
              @if (article.updatedAt) {
                <span>
                  <i class="bx bx-calendar me-1"></i>
                  Updated {{ article.updatedAt | date }}
                </span>
              }
              @if (article.readingTime) {
                <span>
                  <i class="bx bx-time me-1"></i>
                  {{ article.readingTime }} min read
                </span>
              }
            </div>
          </header>

          <!-- Tags -->
          @if (article.tags && article.tags.length > 0) {
            <div class="article-tags mb-4">
              @for (tag of article.tags; track tag) {
                <span class="badge bg-light text-secondary me-2">
                  {{ tag }}
                </span>
              }
            </div>
          }

          <!-- Content Body -->
          <div class="article-content card">
            <div class="card-body">
              <!-- Simple markdown display - in production, use a markdown library -->
              <div class="markdown-body" [innerHTML]="renderedContent()"></div>
            </div>
          </div>

          <!-- Related Articles -->
          @if (article.relatedArticles && article.relatedArticles.length > 0) {
            <div class="related-articles mt-5">
              <h5 class="mb-3">
                <i class="bx bx-link me-2"></i>
                Related Articles
              </h5>
              <div class="list-group">
                @for (relatedId of article.relatedArticles; track relatedId) {
                  <a 
                    [routerLink]="['..', 'article', relatedId]"
                    class="list-group-item list-group-item-action">
                    <i class="bx bx-file me-2"></i>
                    {{ relatedId }}
                  </a>
                }
              </div>
            </div>
          }

          <!-- Footer Navigation -->
          <div class="article-footer mt-5 pt-4 border-top">
            <div class="d-flex justify-content-between align-items-center">
              <a routerLink=".." class="btn btn-outline-secondary">
                <i class="bx bx-arrow-back me-1"></i>
                Back to Wiki
              </a>
              <div class="d-flex gap-2">
                <span class="text-muted small me-2">Was this helpful?</span>
                <button class="btn btn-outline-success btn-sm" (click)="onHelpful(true)">
                  <i class="bx bx-like"></i>
                </button>
                <button class="btn btn-outline-danger btn-sm" (click)="onHelpful(false)">
                  <i class="bx bx-dislike"></i>
                </button>
              </div>
            </div>
          </div>
        </article>
      }
    </div>
  `,
  styles: [`
    .article-viewer {
      padding: 1.5rem;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .article-title {
      font-size: 2rem;
      font-weight: 600;
    }
    
    .markdown-body {
      line-height: 1.8;
    }
    .markdown-body h2 {
      margin-top: 2rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--vz-border-color);
    }
    .markdown-body h3 {
      margin-top: 1.5rem;
    }
    .markdown-body p {
      margin-bottom: 1rem;
    }
    .markdown-body code {
      background: var(--vz-light);
      padding: 0.2em 0.4em;
      border-radius: 4px;
      font-size: 0.9em;
    }
    .markdown-body pre {
      background: var(--vz-dark);
      color: var(--vz-light);
      padding: 1rem;
      border-radius: 8px;
      overflow-x: auto;
    }
    .markdown-body ul, .markdown-body ol {
      margin-bottom: 1rem;
      padding-left: 1.5rem;
    }
    .markdown-body li {
      margin-bottom: 0.5rem;
    }
    .markdown-body blockquote {
      border-left: 4px solid var(--vz-primary);
      margin: 1rem 0;
      padding: 0.5rem 1rem;
      background: var(--vz-light);
      font-style: italic;
    }
  `]
})
export class ArticleViewerComponent implements OnInit, OnDestroy {
  helpService = inject(HelpService);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  renderedContent = signal('');

  ngOnInit(): void {
    // Load article when route param changes
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const articleId = params.get('articleId');
        if (articleId) {
          this.loadArticle(articleId);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.helpService.clearCurrentArticle();
  }

  private loadArticle(articleId: string): void {
    this.helpService.loadArticle(articleId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(article => {
        if (article) {
          // Simple markdown-to-HTML conversion
          // In production, use a proper markdown library like marked or ngx-markdown
          this.renderedContent.set(this.simpleMarkdownToHtml(article.content));
        }
      });
  }

  /**
   * Very simple markdown to HTML conversion
   * For production, use a proper library like 'marked' or 'ngx-markdown'
   */
  private simpleMarkdownToHtml(markdown: string): string {
    if (!markdown) return '';
    
    let html = markdown
      // Headers
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      // Inline code
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
      // Blockquotes
      .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
      // Unordered lists
      .replace(/^\- (.*$)/gm, '<li>$1</li>')
      // Paragraphs (simple)
      .replace(/\n\n/g, '</p><p>')
      // Line breaks
      .replace(/\n/g, '<br>');
    
    return `<p>${html}</p>`;
  }

  onHelpful(helpful: boolean): void {
    // TODO: Send feedback to analytics
    console.log('[Help] Article feedback:', helpful ? 'helpful' : 'not helpful');
  }
}
