/**
 * Trash Service
 * 
 * Aggregates deleted items from all CardBrokers that support trash operations.
 * Provides unified restore and permanent delete functionality.
 */
import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, forkJoin, of, map, catchError } from 'rxjs';

import { CardBrokerRegistry } from '../../../core/models/presentation/card-broker.model';
import { IUniversalCardData } from '../../../core/models/presentation/universal-card.model';

/**
 * Deleted item with metadata
 */
export interface IDeletedItem {
  /** The card representation */
  card: IUniversalCardData;
  
  /** Entity type (for routing restore/delete) */
  entityType: string;
  
  /** Entity type display label */
  entityLabel: string;
  
  /** When item was deleted (if available) */
  deletedAt?: Date;
  
  /** Days until auto-permanent-delete (if applicable) */
  daysUntilExpiry?: number;
}

@Injectable({ providedIn: 'root' })
export class TrashService {
  private brokerRegistry = inject(CardBrokerRegistry);
  
  // ─────────────────────────────────────────────────────────────
  // Signals
  // ─────────────────────────────────────────────────────────────
  
  /** All deleted items */
  deletedItems = signal<IDeletedItem[]>([]);
  
  /** Loading state */
  loading = signal(false);
  
  /** Error message */
  error = signal<string | null>(null);
  
  /** Count of deleted items */
  count = computed(() => this.deletedItems().length);
  
  /** Whether trash is empty */
  isEmpty = computed(() => this.deletedItems().length === 0);
  
  // ─────────────────────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────────────────────
  
  /**
   * Load all deleted items from all brokers
   */
  loadDeletedItems(): void {
    this.loading.set(true);
    this.error.set(null);
    
    const brokers = this.brokerRegistry.getTrashSupportingBrokers();
    
    if (brokers.length === 0) {
      this.deletedItems.set([]);
      this.loading.set(false);
      return;
    }
    
    const observables = brokers.map(broker => {
      if (!broker.getDeletedItems) {
        return of([]);
      }
      
      return broker.getDeletedItems().pipe(
        map(entities => {
          const cards = broker.toCards(entities);
          return cards.map(card => ({
            card,
            entityType: broker.entityType,
            entityLabel: broker.entityLabel,
          } as IDeletedItem));
        }),
        catchError(err => {
          console.error(`[TrashService] Error loading deleted ${broker.entityType}:`, err);
          return of([]);
        })
      );
    });
    
    forkJoin(observables).subscribe({
      next: (results) => {
        const allItems = results.flat();
        this.deletedItems.set(allItems);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('[TrashService] Error loading trash:', err);
        this.error.set('Failed to load deleted items');
        this.loading.set(false);
      }
    });
  }
  
  /**
   * Restore a deleted item
   */
  restore(item: IDeletedItem): Observable<boolean> {
    return this.brokerRegistry.restore(item.entityType, item.card.id).pipe(
      map(success => {
        if (success) {
          // Remove from local list
          this.deletedItems.update(items => 
            items.filter(i => !(i.entityType === item.entityType && i.card.id === item.card.id))
          );
        }
        return success;
      })
    );
  }
  
  /**
   * Permanently delete an item
   */
  deletePermanently(item: IDeletedItem): Observable<boolean> {
    return this.brokerRegistry.deletePermanently(item.entityType, item.card.id).pipe(
      map(success => {
        if (success) {
          // Remove from local list
          this.deletedItems.update(items => 
            items.filter(i => !(i.entityType === item.entityType && i.card.id === item.card.id))
          );
        }
        return success;
      })
    );
  }
  
  /**
   * Restore all items in trash
   */
  restoreAll(): Observable<boolean> {
    const items = this.deletedItems();
    if (items.length === 0) return of(true);
    
    const observables = items.map(item => this.restore(item));
    
    return forkJoin(observables).pipe(
      map(results => results.every(r => r))
    );
  }
  
  /**
   * Empty trash (permanently delete all)
   * Note: This should be Admin-only in production
   */
  emptyTrash(): Observable<boolean> {
    const items = this.deletedItems();
    if (items.length === 0) return of(true);
    
    const observables = items.map(item => this.deletePermanently(item));
    
    return forkJoin(observables).pipe(
      map(results => results.every(r => r))
    );
  }
  
  /**
   * Refresh trash contents
   */
  refresh(): void {
    this.loadDeletedItems();
  }
}
