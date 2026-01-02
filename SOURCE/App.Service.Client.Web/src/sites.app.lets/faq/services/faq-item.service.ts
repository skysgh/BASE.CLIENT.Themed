/**
 * FAQ Item Service
 * 
 * Signal-based service for managing FAQ items.
 */
import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, tap, catchError, of, map, forkJoin } from 'rxjs';

import { FaqItemRepository } from '../repositories/faq-item.repository';
import { FaqCategoryService } from './faq-category.service';
import { FaqItemDto, FaqItemViewModel } from '../models';
import { mapFaqItemDtosToViewModels, mapFaqItemDtoToViewModel, mapFaqItemViewModelToDto } from '../mappers';
import { DEFAULT_FAQ_CONFIG } from '../constants';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class FaqItemService {
  private repository = inject(FaqItemRepository);
  private categoryService = inject(FaqCategoryService);
  private logger = inject(SystemDiagnosticsTraceService);

  // ─────────────────────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────────────────────
  
  private _items = signal<FaqItemViewModel[]>([]);
  private _currentItem = signal<FaqItemViewModel | null>(null);
  private _loading = signal(false);
  private _saving = signal(false);
  private _error = signal<string | null>(null);

  // Public signals
  readonly items = this._items.asReadonly();
  readonly currentItem = this._currentItem.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly saving = this._saving.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed
  readonly enabledItems = computed(() => 
    this._items().filter(i => i.enabled)
  );

  constructor() {
    this.loadItems();
  }

  // ─────────────────────────────────────────────────────────────
  // Data Loading
  // ─────────────────────────────────────────────────────────────

  /**
   * Load all items
   */
  loadItems(): void {
    const culture = this.categoryService.currentCulture();
    this._loading.set(true);
    this._error.set(null);

    // Build category title lookup
    const categoryTitles: Record<string, string> = {};
    this.categoryService.categories().forEach(c => {
      categoryTitles[c.id] = c.title;
    });

    this.repository.getAll(culture).pipe(
      tap(dtos => {
        const viewModels = mapFaqItemDtosToViewModels(dtos, categoryTitles);
        this._items.set(viewModels);
        this._loading.set(false);
        
        // Update category item counts
        const counts: Record<string, number> = {};
        viewModels.filter(i => i.enabled).forEach(item => {
          counts[item.categoryId] = (counts[item.categoryId] || 0) + 1;
        });
        this.categoryService.updateItemCounts(counts);
        
        this.logger.debug(`[FaqItemService] Loaded ${viewModels.length} items`);
      }),
      catchError(err => {
        this._error.set('Failed to load FAQ items');
        this._loading.set(false);
        return of([]);
      })
    ).subscribe();
  }

  /**
   * Get items by category
   */
  getByCategory(categoryId: string): FaqItemViewModel[] {
    return this._items()
      .filter(i => i.categoryId === categoryId && i.enabled)
      .sort((a, b) => a.order - b.order);
  }

  /**
   * Load single item by ID
   */
  loadItem(id: string): Observable<FaqItemViewModel | null> {
    this._loading.set(true);
    this._error.set(null);

    const categoryTitles: Record<string, string> = {};
    this.categoryService.categories().forEach(c => {
      categoryTitles[c.id] = c.title;
    });

    return this.repository.getById(id).pipe(
      map(dto => {
        if (dto) {
          const vm = mapFaqItemDtoToViewModel(dto, categoryTitles[dto.categoryId]);
          this._currentItem.set(vm);
          this._loading.set(false);
          return vm;
        }
        this._error.set('Item not found');
        this._loading.set(false);
        return null;
      }),
      catchError(err => {
        this._error.set('Failed to load item');
        this._loading.set(false);
        return of(null);
      })
    );
  }

  /**
   * Get item by ID from local state
   */
  getById(id: string): FaqItemViewModel | undefined {
    return this._items().find(i => i.id === id);
  }

  /**
   * Search items
   */
  search(query: string): FaqItemViewModel[] {
    if (!query || query.length < 2) return [];
    
    const normalizedQuery = query.toLowerCase();
    return this.enabledItems().filter(item => 
      item.question.toLowerCase().includes(normalizedQuery) ||
      item.answer.toLowerCase().includes(normalizedQuery) ||
      item.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
    );
  }

  // ─────────────────────────────────────────────────────────────
  // CRUD Operations (Admin)
  // ─────────────────────────────────────────────────────────────

  /**
   * Create new item
   */
  create(data: Partial<FaqItemViewModel>): Observable<FaqItemViewModel | null> {
    this._saving.set(true);
    this._error.set(null);

    const dto = mapFaqItemViewModelToDto({
      ...data,
      cultureCode: this.categoryService.currentCulture(),
    });

    return this.repository.create(dto).pipe(
      map(created => {
        const category = this.categoryService.getById(created.categoryId);
        const vm = mapFaqItemDtoToViewModel(created, category?.title);
        this._items.update(items => [...items, vm].sort((a, b) => a.order - b.order));
        this._saving.set(false);
        this.logger.info(`[FaqItemService] Created item: ${created.id}`);
        return vm;
      }),
      catchError(err => {
        this._error.set('Failed to create item');
        this._saving.set(false);
        return of(null);
      })
    );
  }

  /**
   * Update existing item
   */
  update(id: string, data: Partial<FaqItemViewModel>): Observable<FaqItemViewModel | null> {
    this._saving.set(true);
    this._error.set(null);

    const dto = mapFaqItemViewModelToDto(data);

    return this.repository.update(id, dto).pipe(
      map(updated => {
        const category = this.categoryService.getById(updated.categoryId);
        const vm = mapFaqItemDtoToViewModel(updated, category?.title);
        this._items.update(items => 
          items.map(i => i.id === id ? vm : i).sort((a, b) => a.order - b.order)
        );
        this._currentItem.set(vm);
        this._saving.set(false);
        this.logger.info(`[FaqItemService] Updated item: ${id}`);
        return vm;
      }),
      catchError(err => {
        this._error.set('Failed to update item');
        this._saving.set(false);
        return of(null);
      })
    );
  }

  /**
   * Delete item
   */
  delete(id: string): Observable<boolean> {
    this._saving.set(true);
    this._error.set(null);

    return this.repository.delete(id).pipe(
      map(success => {
        if (success) {
          this._items.update(items => items.filter(i => i.id !== id));
          this.logger.info(`[FaqItemService] Deleted item: ${id}`);
        }
        this._saving.set(false);
        return success;
      }),
      catchError(err => {
        this._error.set('Failed to delete item');
        this._saving.set(false);
        return of(false);
      })
    );
  }

  /**
   * Toggle item enabled state
   */
  toggleEnabled(id: string): Observable<FaqItemViewModel | null> {
    const item = this.getById(id);
    if (!item) return of(null);
    
    return this.update(id, { enabled: !item.enabled });
  }

  /**
   * Clear current item
   */
  clearCurrentItem(): void {
    this._currentItem.set(null);
  }

  /**
   * Refresh items
   */
  refresh(): void {
    this.loadItems();
  }
}
