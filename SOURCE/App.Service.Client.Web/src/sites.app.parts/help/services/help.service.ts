/**
 * Help Service
 * 
 * Provides access to help articles, categories, and search.
 * Supports culture-aware article loading and external URL mode.
 */
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map, tap } from 'rxjs';

import { AccountService } from '../../../core/services/account.service';
import { HELP_CONSTANTS, HelpConfiguration, HelpMode } from '../constants';
import { HelpArticle, HelpArticleMeta, HelpCategory, HelpSearchResult } from '../models';

@Injectable({ providedIn: 'root' })
export class HelpService {
  private http = inject(HttpClient);
  private accountService = inject(AccountService);

  // ─────────────────────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────────────────────
  
  private _config = signal<HelpConfiguration>(HELP_CONSTANTS.defaultConfig);
  private _categories = signal<HelpCategory[]>([]);
  private _articles = signal<HelpArticleMeta[]>([]);
  private _currentArticle = signal<HelpArticle | null>(null);
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  private _currentCulture = signal('en');

  // Public signals
  readonly config = this._config.asReadonly();
  readonly categories = this._categories.asReadonly();
  readonly articles = this._articles.asReadonly();
  readonly currentArticle = this._currentArticle.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly currentCulture = this._currentCulture.asReadonly();

  // Computed
  readonly isExternal = computed(() => this._config().mode === 'external');
  readonly isEnabled = computed(() => this._config().enabled);
  readonly externalUrl = computed(() => this._config().externalUrl);

  constructor() {
    this.loadConfig();
    this.loadCategories();
  }

  // ─────────────────────────────────────────────────────────────
  // Configuration
  // ─────────────────────────────────────────────────────────────

  /**
   * Load help configuration from account settings
   */
  private loadConfig(): void {
    this.accountService.getConfigValue<Partial<HelpConfiguration>>('help')
      .subscribe(config => {
        if (config) {
          this._config.set({
            ...HELP_CONSTANTS.defaultConfig,
            ...config,
          });
        }
      });
  }

  /**
   * Get effective help URL (for external mode or article deep-link)
   */
  getHelpUrl(articleId?: string): string {
    const config = this._config();
    
    if (config.mode === 'external' && config.externalUrl) {
      return articleId 
        ? `${config.externalUrl}/${articleId}`
        : config.externalUrl;
    }
    
    // Internal mode - return route
    return articleId
      ? `${HELP_CONSTANTS.routes.article}/${articleId}`
      : HELP_CONSTANTS.routes.hub;
  }

  /**
   * Set current culture for article loading
   */
  setCulture(cultureCode: string): void {
    const config = this._config();
    if (config.availableCultures.includes(cultureCode)) {
      this._currentCulture.set(cultureCode);
      // Reload articles for new culture
      this.loadArticleIndex();
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Categories
  // ─────────────────────────────────────────────────────────────

  /**
   * Load category list
   */
  private loadCategories(): void {
    const basePath = this._config().assetsBasePath;
    const culture = this._currentCulture();
    
    this.http.get<HelpCategory[]>(`${basePath}/${culture}/categories.json`)
      .pipe(
        catchError(() => of(this.getDefaultCategories()))
      )
      .subscribe(categories => {
        this._categories.set(categories);
      });
  }

  /**
   * Get default categories (fallback)
   */
  private getDefaultCategories(): HelpCategory[] {
    return [
      { id: 'getting-started', name: 'Getting Started', icon: 'bx-rocket', order: 1 },
      { id: 'user-guide', name: 'User Guide', icon: 'bx-book-open', order: 2 },
      { id: 'faq', name: 'FAQ', icon: 'bx-help-circle', order: 3 },
      { id: 'troubleshooting', name: 'Troubleshooting', icon: 'bx-wrench', order: 4 },
    ];
  }

  /**
   * Get articles by category
   */
  getArticlesByCategory(categoryId: string): HelpArticleMeta[] {
    return this._articles().filter(a => a.category === categoryId);
  }

  // ─────────────────────────────────────────────────────────────
  // Articles
  // ─────────────────────────────────────────────────────────────

  /**
   * Load article index (metadata only)
   */
  loadArticleIndex(): void {
    const basePath = this._config().assetsBasePath;
    const culture = this._currentCulture();
    
    this._loading.set(true);
    
    this.http.get<HelpArticleMeta[]>(`${basePath}/${culture}/index.json`)
      .pipe(
        catchError(() => of([])),
        tap(() => this._loading.set(false))
      )
      .subscribe(articles => {
        this._articles.set(articles.filter(a => a.published !== false));
      });
  }

  /**
   * Load a single article by ID
   */
  loadArticle(articleId: string): Observable<HelpArticle | null> {
    const basePath = this._config().assetsBasePath;
    const culture = this._currentCulture();
    
    this._loading.set(true);
    this._error.set(null);
    
    return this.http.get<HelpArticle>(`${basePath}/${culture}/articles/${articleId}.json`)
      .pipe(
        tap(article => {
          this._currentArticle.set(article);
          this._loading.set(false);
        }),
        catchError(err => {
          this._error.set(`Article not found: ${articleId}`);
          this._loading.set(false);
          return of(null);
        })
      );
  }

  /**
   * Clear current article
   */
  clearCurrentArticle(): void {
    this._currentArticle.set(null);
  }

  // ─────────────────────────────────────────────────────────────
  // Search
  // ─────────────────────────────────────────────────────────────

  /**
   * Search articles by query
   */
  searchArticles(query: string): HelpSearchResult[] {
    if (!query || query.length < 2) {
      return [];
    }
    
    const normalizedQuery = query.toLowerCase();
    const articles = this._articles();
    
    return articles
      .map(article => {
        let score = 0;
        
        // Title match (highest weight)
        if (article.title.toLowerCase().includes(normalizedQuery)) {
          score += 10;
        }
        
        // Description match
        if (article.description?.toLowerCase().includes(normalizedQuery)) {
          score += 5;
        }
        
        // Tag match
        if (article.tags?.some(tag => tag.toLowerCase().includes(normalizedQuery))) {
          score += 3;
        }
        
        return { article, score, excerpt: article.description };
      })
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score);
  }

  // ─────────────────────────────────────────────────────────────
  // Utility
  // ─────────────────────────────────────────────────────────────

  /**
   * Get featured/pinned articles
   */
  getFeaturedArticles(limit = 5): HelpArticleMeta[] {
    return this._articles()
      .filter(a => a.order !== undefined && a.order <= limit)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .slice(0, limit);
  }

  /**
   * Get recent articles
   */
  getRecentArticles(limit = 5): HelpArticleMeta[] {
    return this._articles()
      .filter(a => a.updatedAt)
      .sort((a, b) => {
        const dateA = new Date(a.updatedAt || 0);
        const dateB = new Date(b.updatedAt || 0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, limit);
  }
}
