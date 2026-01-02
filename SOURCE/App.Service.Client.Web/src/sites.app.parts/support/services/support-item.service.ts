/**
 * Support Item Service
 * 
 * Signal-based service for managing support items.
 * Provides reactive state for user's support items.
 */
import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, tap, catchError, of, map } from 'rxjs';

import { SupportItemRepository } from '../repositories/support-item.repository';
import { SupportItemDto, SupportCommentDto } from '../models';
import { SupportItemViewModel, SupportCommentViewModel, SupportStatsViewModel } from '../models';
import { mapSupportItemDtosToViewModels, mapSupportItemDtoToViewModel, mapSupportCommentDtoToViewModel } from '../mappers';
import { 
  DEFAULT_SUPPORT_CONFIG, 
  SupportConfiguration,
  SupportItemType,
  SupportPriority,
} from '../constants';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import { AccountService } from '../../../core/services/account.service';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class SupportItemService {
  private repository = inject(SupportItemRepository);
  private tokenStorage = inject(TokenStorageService);
  private accountService = inject(AccountService);
  private logger = inject(SystemDiagnosticsTraceService);

  // ─────────────────────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────────────────────
  
  private _config = signal<SupportConfiguration>(DEFAULT_SUPPORT_CONFIG);
  private _items = signal<SupportItemViewModel[]>([]);
  private _currentItem = signal<SupportItemViewModel | null>(null);
  private _comments = signal<SupportCommentViewModel[]>([]);
  private _loading = signal(false);
  private _saving = signal(false);
  private _error = signal<string | null>(null);

  // Public signals
  readonly config = this._config.asReadonly();
  readonly items = this._items.asReadonly();
  readonly currentItem = this._currentItem.asReadonly();
  readonly comments = this._comments.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly saving = this._saving.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed
  readonly isEnabled = computed(() => this._config().enabled);
  readonly isExternal = computed(() => this._config().mode === 'external');
  readonly externalUrl = computed(() => this._config().externalUrl);
  readonly allowIssues = computed(() => this._config().allowIssues);
  readonly allowIdeas = computed(() => this._config().allowIdeas);

  /** Open (non-closed) items */
  readonly openItems = computed(() => 
    this._items().filter(i => i.isOpen)
  );

  /** Issues only */
  readonly issues = computed(() => 
    this._items().filter(i => i.type === 'issue')
  );

  /** Ideas only */
  readonly ideas = computed(() => 
    this._items().filter(i => i.type === 'idea')
  );

  /** Stats for dashboard */
  readonly stats = computed<SupportStatsViewModel>(() => {
    const all = this._items();
    return {
      totalItems: all.length,
      openItems: all.filter(i => i.isOpen).length,
      resolvedItems: all.filter(i => i.status === 'resolved').length,
      closedItems: all.filter(i => i.status === 'closed').length,
      issueCount: all.filter(i => i.type === 'issue').length,
      ideaCount: all.filter(i => i.type === 'idea').length,
    };
  });

  constructor() {
    this.loadConfig();
    this.loadMyItems();
  }

  // ─────────────────────────────────────────────────────────────
  // Configuration
  // ─────────────────────────────────────────────────────────────

  private loadConfig(): void {
    this.accountService.getConfigValue<Partial<SupportConfiguration>>('support')
      .subscribe(config => {
        if (config) {
          this._config.set({
            ...DEFAULT_SUPPORT_CONFIG,
            ...config,
          });
        }
      });
  }

  // ─────────────────────────────────────────────────────────────
  // Data Loading
  // ─────────────────────────────────────────────────────────────

  /**
   * Load current user's support items
   */
  loadMyItems(): void {
    const user = this.tokenStorage.getUser();
    if (!user?.id) {
      this.logger.warn('[SupportService] No user ID, cannot load items');
      return;
    }

    this._loading.set(true);
    this._error.set(null);

    this.repository.getByUserId(user.id).pipe(
      tap(dtos => {
        const viewModels = mapSupportItemDtosToViewModels(dtos);
        this._items.set(viewModels);
        this._loading.set(false);
        this.logger.debug(`[SupportService] Loaded ${viewModels.length} items`);
      }),
      catchError(err => {
        this._error.set('Failed to load support items');
        this._loading.set(false);
        return of([]);
      })
    ).subscribe();
  }

  /**
   * Load single item by ID
   */
  loadItem(id: string): Observable<SupportItemViewModel | null> {
    this._loading.set(true);
    this._error.set(null);

    return this.repository.getById(id).pipe(
      map(dto => {
        if (dto) {
          const vm = mapSupportItemDtoToViewModel(dto);
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
   * Load comments for current item
   */
  loadComments(itemId: string): void {
    this.repository.getComments(itemId).pipe(
      tap(dtos => {
        const viewModels = dtos.map(mapSupportCommentDtoToViewModel);
        this._comments.set(viewModels);
      }),
      catchError(() => of([]))
    ).subscribe();
  }

  /**
   * Get item by ID from local state
   */
  getById(id: string): SupportItemViewModel | undefined {
    return this._items().find(i => i.id === id);
  }

  // ─────────────────────────────────────────────────────────────
  // Actions
  // ─────────────────────────────────────────────────────────────

  /**
   * Submit new support item
   */
  submit(
    type: SupportItemType,
    title: string,
    description: string,
    priority: SupportPriority = 'medium',
    category?: string
  ): Observable<SupportItemViewModel | null> {
    const user = this.tokenStorage.getUser();
    if (!user?.id) {
      this._error.set('You must be logged in to submit');
      return of(null);
    }

    this._saving.set(true);
    this._error.set(null);

    const dto: Partial<SupportItemDto> = {
      type,
      title,
      description,
      priority,
      category,
      submittedBy: user.id,
      submittedByName: user.name || user.email || 'You',
    };

    return this.repository.create(dto).pipe(
      map(created => {
        const vm = mapSupportItemDtoToViewModel(created);
        // Add to local state
        this._items.update(items => [vm, ...items]);
        this._saving.set(false);
        this.logger.info(`[SupportService] Created ${type}: ${created.id}`);
        return vm;
      }),
      catchError(err => {
        this._error.set('Failed to submit');
        this._saving.set(false);
        return of(null);
      })
    );
  }

  /**
   * Add comment to current item
   */
  addComment(itemId: string, content: string): Observable<SupportCommentViewModel | null> {
    const user = this.tokenStorage.getUser();
    if (!user?.id) {
      this._error.set('You must be logged in to comment');
      return of(null);
    }

    this._saving.set(true);

    return this.repository.addComment(
      itemId, 
      content, 
      user.id, 
      user.name || user.email || 'You'
    ).pipe(
      map(dto => {
        const vm = mapSupportCommentDtoToViewModel(dto);
        this._comments.update(comments => [...comments, vm]);
        this._saving.set(false);
        return vm;
      }),
      catchError(err => {
        this._error.set('Failed to add comment');
        this._saving.set(false);
        return of(null);
      })
    );
  }

  /**
   * Clear current item
   */
  clearCurrentItem(): void {
    this._currentItem.set(null);
    this._comments.set([]);
  }

  /**
   * Refresh items
   */
  refresh(): void {
    this.loadMyItems();
  }
}
