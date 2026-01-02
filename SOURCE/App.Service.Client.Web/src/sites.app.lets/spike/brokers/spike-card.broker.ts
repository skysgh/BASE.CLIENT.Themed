/**
 * Spike Card Broker
 * 
 * Transforms Spike entities into Universal Card format.
 * This is part of the Universal Search infrastructure.
 */
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseCardBroker } from '../../../core/models/presentation/card-broker.model';
import { 
  IUniversalCardData, 
  ICardAction, 
  ICardCell,
  createCell,
  createBadgeCell,
  createAction,
  createNavAction
} from '../../../core/models/presentation/universal-card.model';
import { IColumnDefinition, BadgeVariant } from '../../../core/models/presentation/presentation-profile.model';
import { ChartDefinition, createCountByChart } from '../../../core/models/query/chart-definition.model';
import { SpikeViewModel } from '../models/view-models/spike.view-model';
import { SpikeService } from '../services/spike.service';

/**
 * Spike Card Broker
 * 
 * Transforms SpikeViewModel → IUniversalCardData
 */
@Injectable({ providedIn: 'root' })
export class SpikeCardBroker extends BaseCardBroker<SpikeViewModel> {
  readonly entityType = 'spike';
  readonly entityLabel = 'Spike';
  readonly entityIcon = 'bx bx-bulb';
  
  private spikeService = inject(SpikeService);
  
  // ─────────────────────────────────────────────────────────────
  // Trash Support
  // ─────────────────────────────────────────────────────────────
  
  /**
   * Indicates this broker supports trash operations
   */
  override supportsTrash(): boolean {
    return true;
  }
  
  /**
   * Get deleted spikes
   * TODO: Implement actual soft-delete filter when backend supports it
   */
  override getDeletedItems(): Observable<SpikeViewModel[]> {
    // For now, return empty - would filter by isDeleted flag when available
    return of([]);
  }
  
  /**
   * Restore a deleted spike
   * TODO: Implement actual restore when backend supports it
   */
  override restore(entityId: string): Observable<boolean> {
    console.log(`[SpikeCardBroker] Restoring spike: ${entityId}`);
    // Would call spikeService.restore(entityId) when available
    return of(true);
  }
  
  /**
   * Permanently delete a spike
   */
  override deletePermanently(entityId: string): Observable<boolean> {
    console.log(`[SpikeCardBroker] Permanently deleting spike: ${entityId}`);
    return this.spikeService.delete(entityId);
  }
  
  // ─────────────────────────────────────────────────────────────
  // Card Transformation
  // ─────────────────────────────────────────────────────────────
  
  /**
   * Transform a single Spike to Universal Card format
   */
  override toCard(spike: SpikeViewModel): IUniversalCardData {
    return {
      // Identity
      id: spike.id,
      entityType: this.entityType,
      
      // Visual
      icon: this.entityIcon,
      iconBackground: 'bg-primary-subtle',
      initials: this.getInitials(spike.displayLabel),
      
      // Content
      title: spike.title,
      subtitle: spike.displayLabel,
      description: spike.description,
      status: this.getSpikeStatus(spike),
      
      // Data cells
      cells: this.buildCells(spike),
      
      // Hidden payload for actions
      payload: {
        id: spike.id,
        title: spike.title,
      },
      
      // Actions
      primaryAction: this.getPrimaryAction(spike),
      actions: this.getAvailableActions(spike),
      
      // Selection
      selectable: true,
      selected: false,
      
      // Metadata
      timestamp: undefined,
      tags: [],
    };
  }
  
  /**
   * Get status badge for spike
   */
  private getSpikeStatus(spike: SpikeViewModel): { label: string; variant: BadgeVariant } {
    return {
      label: 'Draft',
      variant: 'neutral'
    };
  }
  
  /**
   * Build cells for card display
   * Note: cells are also used for chart aggregation
   */
  private buildCells(spike: SpikeViewModel): ICardCell[] {
    const cells: ICardCell[] = [];
    
    // First letter of title (for chart grouping)
    const firstLetter = spike.title.charAt(0).toUpperCase();
    cells.push(createBadgeCell('firstLetter', firstLetter, 'info'));
    
    // Has description (for chart grouping)
    const hasDescription = spike.description ? 'Yes' : 'No';
    cells.push(createCell('hasDescription', hasDescription, 'text'));
    
    // Description (truncated) - use inherited truncate method
    if (spike.description) {
      cells.push(createCell('Description', this.truncate(spike.description, 50), 'text'));
    }
    
    // Display label
    cells.push(createCell('Label', spike.displayLabel, 'text'));
    
    return cells;
  }
  
  /**
   * Get available columns for table display
   */
  override getAvailableColumns(): IColumnDefinition[] {
    return [
      {
        field: 'title',
        label: 'Title',
        type: 'text',
        visible: true,
        sortable: true,
        filterable: true,
      },
      {
        field: 'displayLabel',
        label: 'Label',
        type: 'text',
        visible: true,
        sortable: true,
        filterable: true,
      },
      {
        field: 'description',
        label: 'Description',
        type: 'text',
        visible: true,
        sortable: false,
        filterable: true,
      },
      {
        field: 'status',
        label: 'Status',
        type: 'badge',
        visible: true,
        sortable: true,
        filterable: true,
      },
    ];
  }
  
  /**
   * Get available charts for spikes
   * These are "canned" chart definitions users can select
   * Note: Using displayLabel since we don't have category/status in the model yet
   */
  override getAvailableCharts(): ChartDefinition[] {
    return [
      // Group by first letter of title (simulated category)
      {
        id: 'by-first-letter',
        label: 'By First Letter',
        type: 'pie',
        categoryField: 'firstLetter',
        aggregation: 'count',
        showDataLabels: true,
        icon: 'bx bx-pie-chart-alt-2',
      },
      // Group by status (currently all "Draft" but ready for real data)
      createCountByChart('by-status', 'By Status', 'status', 'donut'),
      // Group by description length (has/doesn't have)
      {
        id: 'by-has-description',
        label: 'Has Description',
        type: 'bar',
        categoryField: 'hasDescription',
        aggregation: 'count',
        showDataLabels: true,
        icon: 'bx bx-bar-chart-alt-2',
      },
    ];
  }
  
  /**
   * Get available actions for a spike
   */
  override getAvailableActions(spike: SpikeViewModel): ICardAction[] {
    return [
      createNavAction('view', 'View', ['/apps/spike', spike.id], 'bx bx-show'),
      createAction('edit', 'Edit', { 
        icon: 'bx bx-edit', 
        routerLink: ['/apps/spike/edit', spike.id] 
      }),
      createAction('delete', 'Delete', { 
        icon: 'bx bx-trash', 
        variant: 'danger',
        requiresConfirmation: true,
        confirmationMessage: `Are you sure you want to delete "${spike.title}"?`,
        showInMenu: true,
      }),
    ];
  }
  
  /**
   * Get primary action (click on card)
   */
  override getPrimaryAction(spike: SpikeViewModel): ICardAction | undefined {
    return createNavAction('view', 'View Details', ['/apps/spike', spike.id], 'bx bx-show');
  }
}
