/**
 * FAQ Category Service
 * 
 * Signal-based service for managing FAQ categories.
 */
import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, tap, catchError, of, map } from 'rxjs';

import { FaqCategoryRepository } from '../repositories/faq-category.repository';
import { FaqCategoryDto } from '../models';
import { FaqCategoryViewModel } from '../models';
import { mapFaqCategoryDtosToViewModels, mapFaqCategoryDtoToViewModel, mapFaqCategoryViewModelToDto } from '../mappers';
import { DEFAULT_FAQ_CONFIG, FaqConfiguration } from '../constants';
import { AccountService } from '../../../core/services/account.service';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class FaqCategoryService {
  private repository = inject(FaqCategoryRepository);
  private accountService = inject(AccountService);
  private logger = inject(SystemDiagnosticsTraceService);

  // ─────────────────────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────────────────────
  
  private _config = signal<FaqConfiguration>(DEFAULT_FAQ_CONFIG);
  private _categories = signal<FaqCategoryViewModel[]>([]);
  private _currentCategory = signal<FaqCategoryViewModel | null>(null);
  private _loading = signal(false);
  private _saving = signal(false);
  private _error = signal<string | null>(null);
  private _currentCulture = signal('en');

  // Public signals
  readonly config = this._config.asReadonly();
  readonly categories = this._categories.asReadonly();
  readonly currentCategory = this._currentCategory.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly saving = this._saving.asReadonly();
  readonly error = this._error.asReadonly();
  readonly currentCulture = this._currentCulture.asReadonly();

  // Computed
  readonly isEnabled = computed(() => this._config().enabled);
  readonly enabledCategories = computed(() => 
    this._categories().filter(c => c.enabled)
  );

  constructor() {
    this.loadConfig();
    this.loadCategories();
  }

  // ─────────────────────────────────────────────────────────────
  // Configuration
  // ─────────────────────────────────────────────────────────────

  private loadConfig(): void {
    this.accountService.getConfigValue<Partial<FaqConfiguration>>('faq')
      .subscribe(config => {
        if (config) {
          this._config.set({
            ...DEFAULT_FAQ_CONFIG,
            ...config,
          });
          if (config.defaultCulture) {
            this._currentCulture.set(config.defaultCulture);
          }
        }
      });
  }

  /**
   * Set current culture
   */
  setCulture(cultureCode: string): void {
    const config = this._config();
    if (config.availableCultures.includes(cultureCode)) {
      this._currentCulture.set(cultureCode);
      this.loadCategories();
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Data Loading
  // ─────────────────────────────────────────────────────────────

  /**
   * Load all categories
   */
  loadCategories(): void {
    const culture = this._currentCulture();
    this._loading.set(true);
    this._error.set(null);

    this.repository.getAll(culture).pipe(
      tap(dtos => {
        const viewModels = mapFaqCategoryDtosToViewModels(dtos);
        this._categories.set(viewModels);
        this._loading.set(false);
        this.logger.debug(`[FaqCategoryService] Loaded ${viewModels.length} categories`);
      }),
      catchError(err => {
        this._error.set('Failed to load categories');
        this._loading.set(false);
        return of([]);
      })
    ).subscribe();
  }

  /**
   * Load single category by ID
   */
  loadCategory(id: string): Observable<FaqCategoryViewModel | null> {
    this._loading.set(true);
    this._error.set(null);

    return this.repository.getById(id).pipe(
      map(dto => {
        if (dto) {
          const vm = mapFaqCategoryDtoToViewModel(dto);
          this._currentCategory.set(vm);
          this._loading.set(false);
          return vm;
        }
        this._error.set('Category not found');
        this._loading.set(false);
        return null;
      }),
      catchError(err => {
        this._error.set('Failed to load category');
        this._loading.set(false);
        return of(null);
      })
    );
  }

  /**
   * Get category by ID from local state
   */
  getById(id: string): FaqCategoryViewModel | undefined {
    return this._categories().find(c => c.id === id);
  }

  /**
   * Update item counts for categories
   */
  updateItemCounts(counts: Record<string, number>): void {
    const updated = this._categories().map(c => ({
      ...c,
      itemCount: counts[c.id] || 0,
    }));
    this._categories.set(updated);
  }

  // ─────────────────────────────────────────────────────────────
  // CRUD Operations (Admin)
  // ─────────────────────────────────────────────────────────────

  /**
   * Create new category
   */
  create(data: Partial<FaqCategoryViewModel>): Observable<FaqCategoryViewModel | null> {
    this._saving.set(true);
    this._error.set(null);

    const dto = mapFaqCategoryViewModelToDto({
      ...data,
      cultureCode: this._currentCulture(),
    });

    return this.repository.create(dto).pipe(
      map(created => {
        const vm = mapFaqCategoryDtoToViewModel(created);
        this._categories.update(categories => [...categories, vm].sort((a, b) => a.order - b.order));
        this._saving.set(false);
        this.logger.info(`[FaqCategoryService] Created category: ${created.id}`);
        return vm;
      }),
      catchError(err => {
        this._error.set('Failed to create category');
        this._saving.set(false);
        return of(null);
      })
    );
  }

  /**
   * Update existing category
   */
  update(id: string, data: Partial<FaqCategoryViewModel>): Observable<FaqCategoryViewModel | null> {
    this._saving.set(true);
    this._error.set(null);

    const dto = mapFaqCategoryViewModelToDto(data);

    return this.repository.update(id, dto).pipe(
      map(updated => {
        const vm = mapFaqCategoryDtoToViewModel(updated);
        this._categories.update(categories => 
          categories.map(c => c.id === id ? vm : c).sort((a, b) => a.order - b.order)
        );
        this._currentCategory.set(vm);
        this._saving.set(false);
        this.logger.info(`[FaqCategoryService] Updated category: ${id}`);
        return vm;
      }),
      catchError(err => {
        this._error.set('Failed to update category');
        this._saving.set(false);
        return of(null);
      })
    );
  }

  /**
   * Delete category
   */
  delete(id: string): Observable<boolean> {
    this._saving.set(true);
    this._error.set(null);

    return this.repository.delete(id).pipe(
      map(success => {
        if (success) {
          this._categories.update(categories => categories.filter(c => c.id !== id));
          this.logger.info(`[FaqCategoryService] Deleted category: ${id}`);
        }
        this._saving.set(false);
        return success;
      }),
      catchError(err => {
        this._error.set('Failed to delete category');
        this._saving.set(false);
        return of(false);
      })
    );
  }

  /**
   * Toggle category enabled state
   */
  toggleEnabled(id: string): Observable<FaqCategoryViewModel | null> {
    const category = this.getById(id);
    if (!category) return of(null);
    
    return this.update(id, { enabled: !category.enabled });
  }

  /**
   * Clear current category
   */
  clearCurrentCategory(): void {
    this._currentCategory.set(null);
  }

  /**
   * Refresh categories
   */
  refresh(): void {
    this.loadCategories();
  }
}
