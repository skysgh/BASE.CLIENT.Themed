/**
 * Card Broker Infrastructure
 * 
 * Brokers transform entity DTOs into the universal card format.
 * Each entity type has its own broker that knows how to map fields.
 * 
 * ARCHITECTURE:
 * 
 * ┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
 * │ User DTO     │────▶│ UserCardBroker   │────▶│              │
 * ├──────────────┤     └──────────────────┘     │              │
 * │ Order DTO    │────▶│ OrderCardBroker  │────▶│  UNIVERSAL   │
 * ├──────────────┤     └──────────────────┘     │  CARD FORMAT │
 * │ Log DTO      │────▶│ LogCardBroker    │────▶│              │
 * ├──────────────┤     └──────────────────┘     │              │
 * │ Embargo DTO  │────▶│ EmbargoCardBroker│────▶│              │
 * └──────────────┘     └──────────────────┘     └──────────────┘
 * 
 * USAGE:
 * 
 * ```typescript
 * // Register broker at module init
 * brokerRegistry.register(new UserCardBroker());
 * 
 * // Use in component
 * const cards = brokerRegistry.toCards('user', users);
 * ```
 */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IUniversalCardData, ICardAction } from './universal-card.model';
import { IColumnDefinition } from './presentation-profile.model';
import { ChartDefinition } from '../query/chart-definition.model';

// ─────────────────────────────────────────────────────────────────────────────
// BROKER INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Card Broker Interface
 * 
 * Each entity type implements this to transform DTOs into universal cards.
 */
export interface ICardBroker<TEntity = unknown> {
  /** Entity type identifier (e.g., 'user', 'order') */
  readonly entityType: string;
  
  /** Display name for this entity type */
  readonly entityLabel: string;
  
  /** Icon for this entity type */
  readonly entityIcon: string;
  
  // ─────────────────────────────────────────────────────────────
  // Card transformation
  // ─────────────────────────────────────────────────────────────
  
  /**
   * Transform a single entity to universal card format
   */
  toCard(entity: TEntity): IUniversalCardData;
  
  /**
   * Transform multiple entities (with potential optimizations)
   */
  toCards(entities: TEntity[]): IUniversalCardData[];
  
  // ─────────────────────────────────────────────────────────────
  // Table/Column support (for Excelists)
  // ─────────────────────────────────────────────────────────────
  
  /**
   * Get all available columns for table display
   * This is the "escape hatch" for users who want specific columns.
   */
  getAvailableColumns(): IColumnDefinition[];
  
  /**
   * Get the default columns for card display
   */
  getDefaultColumns(): IColumnDefinition[];
  
  /**
   * Extract a field value from an entity
   * Supports dot notation: 'address.city'
   */
  getFieldValue(entity: TEntity, field: string): unknown;
  
  // ─────────────────────────────────────────────────────────────
  // Chart support
  // ─────────────────────────────────────────────────────────────
  
  /**
   * Get available chart definitions for this entity type
   * Returns "canned" charts the user can select from
   */
  getAvailableCharts?(): ChartDefinition[];
  
  // ─────────────────────────────────────────────────────────────
  // Action support
  // ─────────────────────────────────────────────────────────────
  
  /**
   * Get available actions for this entity type
   */
  getAvailableActions(entity: TEntity): ICardAction[];
  
  /**
   * Get the primary navigation action
   */
  getPrimaryAction(entity: TEntity): ICardAction | undefined;
  
  // ─────────────────────────────────────────────────────────────
  // Lifecycle actions (for Trash support)
  // ─────────────────────────────────────────────────────────────
  
  /**
   * Get deleted items for this entity type
   * Used by Trash to aggregate deleted items across all brokers
   */
  getDeletedItems?(): Observable<TEntity[]>;
  
  /**
   * Restore a deleted entity
   * @returns Observable<boolean> true if restore succeeded
   */
  restore?(entityId: string): Observable<boolean>;
  
  /**
   * Permanently delete an entity (hard delete)
   * @returns Observable<boolean> true if delete succeeded
   */
  deletePermanently?(entityId: string): Observable<boolean>;
  
  /**
   * Check if this broker supports trash operations
   */
  supportsTrash?(): boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// BASE BROKER (for extension)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Base Card Broker
 * 
 * Provides default implementations that can be overridden.
 */
export abstract class BaseCardBroker<TEntity> implements ICardBroker<TEntity> {
  abstract readonly entityType: string;
  abstract readonly entityLabel: string;
  abstract readonly entityIcon: string;
  
  /**
   * Subclass must implement single-entity transformation
   */
  abstract toCard(entity: TEntity): IUniversalCardData;
  
  /**
   * Default bulk transform - can be overridden for optimization
   */
  toCards(entities: TEntity[]): IUniversalCardData[] {
    return entities.map(e => this.toCard(e));
  }
  
  /**
   * Subclass should override with entity-specific columns
   */
  abstract getAvailableColumns(): IColumnDefinition[];
  
  /**
   * Default: first 5 columns
   */
  getDefaultColumns(): IColumnDefinition[] {
    return this.getAvailableColumns().slice(0, 5);
  }
  
  /**
   * Extract nested field value using dot notation
   */
  getFieldValue(entity: TEntity, field: string): unknown {
    const parts = field.split('.');
    let value: unknown = entity;
    
    for (const part of parts) {
      if (value == null) return undefined;
      value = (value as Record<string, unknown>)[part];
    }
    
    return value;
  }
  
  /**
   * Subclass should override with entity-specific actions
   */
  abstract getAvailableActions(entity: TEntity): ICardAction[];
  
  /**
   * Default: no charts - subclass can override
   */
  getAvailableCharts(): ChartDefinition[] {
    return [];
  }
  
  /**
   * Default: first action marked as primary, or first action
   */
  getPrimaryAction(entity: TEntity): ICardAction | undefined {
    const actions = this.getAvailableActions(entity);
    return actions.find(a => a.isPrimary) || actions[0];
  }
  
  /**
   * Subclass should override with entity-specific lifecycle methods
   */
  getDeletedItems?(): Observable<TEntity[]> {
    return of([]);
  }
  
  restore?(entityId: string): Observable<boolean> {
    return of(false);
  }
  
  deletePermanently?(entityId: string): Observable<boolean> {
    return of(false);
  }
  
  supportsTrash?(): boolean {
    return false;
  }
  
  // ─────────────────────────────────────────────────────────────
  // Helper methods for subclasses
  // ─────────────────────────────────────────────────────────────
  
  /**
   * Generate initials from a name
   */
  protected getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
  
  /**
   * Truncate text with ellipsis
   */
  protected truncate(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }
  
  /**
   * Format date for display
   */
  protected formatDate(date: string | Date | null | undefined): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString();
  }
  
  /**
   * Format money for display
   */
  protected formatMoney(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// BROKER REGISTRY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Card Broker Registry
 * 
 * Central registry for all entity type brokers.
 * Inject this service to transform entities to cards.
 */
@Injectable({ providedIn: 'root' })
export class CardBrokerRegistry {
  private brokers = new Map<string, ICardBroker<unknown>>();
  
  /**
   * Register a broker for an entity type
   */
  register<T>(broker: ICardBroker<T>): void {
    this.brokers.set(broker.entityType, broker as ICardBroker<unknown>);
  }
  
  /**
   * Get broker for an entity type
   */
  getBroker<T>(entityType: string): ICardBroker<T> | undefined {
    return this.brokers.get(entityType) as ICardBroker<T> | undefined;
  }
  
  /**
   * Check if a broker exists for an entity type
   */
  hasBroker(entityType: string): boolean {
    return this.brokers.has(entityType);
  }
  
  /**
   * Get all registered entity types
   */
  getRegisteredTypes(): string[] {
    return Array.from(this.brokers.keys());
  }
  
  /**
   * Get all registered brokers
   */
  getAllBrokers(): ICardBroker<unknown>[] {
    return Array.from(this.brokers.values());
  }
  
  /**
   * Get brokers that support trash operations
   */
  getTrashSupportingBrokers(): ICardBroker<unknown>[] {
    return this.getAllBrokers().filter(b => b.supportsTrash?.() ?? false);
  }
  
  /**
   * Transform a single entity to card
   */
  toCard<T>(entityType: string, entity: T): IUniversalCardData {
    const broker = this.getBroker<T>(entityType);
    if (!broker) {
      throw new Error(`No broker registered for entity type: ${entityType}`);
    }
    return broker.toCard(entity);
  }
  
  /**
   * Transform multiple entities to cards
   */
  toCards<T>(entityType: string, entities: T[]): IUniversalCardData[] {
    const broker = this.getBroker<T>(entityType);
    if (!broker) {
      throw new Error(`No broker registered for entity type: ${entityType}`);
    }
    return broker.toCards(entities);
  }
  
  /**
   * Get available columns for an entity type (for table display)
   */
  getColumns(entityType: string): IColumnDefinition[] {
    const broker = this.getBroker(entityType);
    if (!broker) {
      throw new Error(`No broker registered for entity type: ${entityType}`);
    }
    return broker.getAvailableColumns();
  }
  
  /**
   * Get field value from an entity
   */
  getFieldValue<T>(entityType: string, entity: T, field: string): unknown {
    const broker = this.getBroker<T>(entityType);
    if (!broker) {
      throw new Error(`No broker registered for entity type: ${entityType}`);
    }
    return broker.getFieldValue(entity, field);
  }
  
  /**
   * Get available charts for an entity type
   */
  getCharts(entityType: string): ChartDefinition[] {
    const broker = this.getBroker(entityType);
    if (!broker || !broker.getAvailableCharts) {
      return [];
    }
    return broker.getAvailableCharts();
  }
  
  // ─────────────────────────────────────────────────────────────
  // Trash operations
  // ─────────────────────────────────────────────────────────────
  
  /**
   * Restore an entity via its broker
   */
  restore(entityType: string, entityId: string): Observable<boolean> {
    const broker = this.getBroker(entityType);
    if (!broker) {
      console.error(`No broker registered for entity type: ${entityType}`);
      return of(false);
    }
    if (!broker.restore) {
      console.error(`Broker for ${entityType} does not support restore`);
      return of(false);
    }
    return broker.restore(entityId);
  }
  
  /**
   * Permanently delete an entity via its broker
   */
  deletePermanently(entityType: string, entityId: string): Observable<boolean> {
    const broker = this.getBroker(entityType);
    if (!broker) {
      console.error(`No broker registered for entity type: ${entityType}`);
      return of(false);
    }
    if (!broker.deletePermanently) {
      console.error(`Broker for ${entityType} does not support permanent delete`);
      return of(false);
    }
    return broker.deletePermanently(entityId);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// EXAMPLE BROKER (for reference)
// ─────────────────────────────────────────────────────────────────────────────

/*
 * Example: User Card Broker
 * 
 * ```typescript
 * @Injectable({ providedIn: 'root' })
 * export class UserCardBroker extends BaseCardBroker<UserDto> {
 *   readonly entityType = 'user';
 *   readonly entityLabel = 'User';
 *   readonly entityIcon = 'ri-user-line';
 *   
 *   constructor() {
 *     super();
 *   }
 *   
 *   toCard(user: UserDto): IUniversalCardData {
 *     return {
 *       id: user.id,
 *       entityType: this.entityType,
 *       image: user.avatarUrl,
 *       icon: this.entityIcon,
 *       initials: this.getInitials(user.displayName),
 *       title: user.displayName,
 *       subtitle: user.email,
 *       status: {
 *         label: user.status,
 *         variant: user.status === 'Active' ? 'success' : 'neutral',
 *       },
 *       cells: [
 *         createBadgeCell('Role', user.role, 'info'),
 *         createCell('Last Login', user.lastLoginAt, 'date'),
 *         createSparkCell('Activity', user.activityLast7Days),
 *       ],
 *       payload: {
 *         phoneNumber: user.phoneNumber,
 *         email: user.email,
 *         canDelete: user.role !== 'Admin',
 *       },
 *       primaryAction: createNavAction('view', 'View', ['/system/users', user.id]),
 *       actions: [
 *         createAction('edit', 'Edit', { icon: 'ri-edit-line', routerLink: ['/system/users', user.id, 'edit'] }),
 *         createAction('email', 'Send Email', { icon: 'ri-mail-line', handler: (p) => window.open(`mailto:${p.email}`) }),
 *       ],
 *     };
 *   }
 *   
 *   getAvailableColumns(): IColumnDefinition[] {
 *     return [
 *       createColumn('displayName', 'Name', 'text'),
 *       createColumn('email', 'Email', 'text'),
 *       createColumn('role', 'Role', 'badge', { badgeMapping: { Admin: 'danger', User: 'info' } }),
 *       createColumn('status', 'Status', 'badge', { badgeMapping: { Active: 'success', Inactive: 'neutral' } }),
 *       createColumn('lastLoginAt', 'Last Login', 'date'),
 *       createColumn('createdAt', 'Created', 'date'),
 *     ];
 *   }
 *   
 *   getAvailableActions(user: UserDto): ICardAction[] {
 *     const actions: ICardAction[] = [
 *       createNavAction('view', 'View', ['/system/users', user.id], 'ri-eye-line'),
 *       createAction('edit', 'Edit', { icon: 'ri-edit-line', routerLink: ['/system/users', user.id, 'edit'] }),
 *     ];
 *     
 *     if (user.phoneNumber) {
 *       actions.push(createAction('call', 'Call', { 
 *         icon: 'ri-phone-line', 
 *         requiredPayload: ['phoneNumber'],
 *         handler: (p) => window.open(`tel:${p.phoneNumber}`)
 *       }));
 *     }
 *     
 *     return actions;
 *   }
 * }
 * ```
 */
