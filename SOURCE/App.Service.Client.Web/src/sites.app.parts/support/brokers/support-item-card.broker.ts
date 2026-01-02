/**
 * Support Item Card Broker
 * 
 * Transforms SupportItemViewModel into IUniversalCardData
 * for display in Universal Search and Browse views.
 */
import { Injectable } from '@angular/core';
import { BaseCardBroker, IUniversalCardData, ICardAction, ICardCell, createCell, createBadgeCell } from '../../../core/models/presentation';
import { IColumnDefinition, BadgeVariant } from '../../../core/models/presentation/presentation-profile.model';
import { SupportItemViewModel } from '../models';
import { SUPPORT_ROUTES } from '../constants';

@Injectable({ providedIn: 'root' })
export class SupportItemCardBroker extends BaseCardBroker<SupportItemViewModel> {
  
  /** Entity type identifier */
  readonly entityType = 'support-item';

  /** Display name for this entity type */
  readonly entityLabel = 'Support Items';

  /** Icon for this entity type */
  readonly entityIcon = 'bx-support';

  /**
   * Transform ViewModel to Card
   */
  toCard(item: SupportItemViewModel): IUniversalCardData {
    return {
      id: item.id,
      entityType: this.entityType,
      title: item.title,
      subtitle: `${item.typeName} • ${item.statusName}`,
      description: item.description,
      icon: item.typeIcon,
      iconBackground: this.getIconBackground(item),
      status: {
        label: item.statusName,
        variant: this.getStatusVariant(item.status) as BadgeVariant,
      },
      cells: this.getCells(item),
      actions: this.getAvailableActions(item),
      primaryAction: {
        id: 'view',
        label: 'View Details',
        routerLink: [SUPPORT_ROUTES.item(item.id)],
        isPrimary: true,
      },
      payload: item as unknown as Record<string, unknown>,
      timestamp: item.createdAt,
      tags: [item.type, item.status, item.priority],
    };
  }

  /**
   * Get available columns for table view
   */
  getAvailableColumns(): IColumnDefinition[] {
    return [
      { field: 'title', label: 'Title', type: 'text', sortable: true },
      { field: 'typeName', label: 'Type', type: 'badge', sortable: true },
      { field: 'statusName', label: 'Status', type: 'badge', sortable: true },
      { field: 'priorityName', label: 'Priority', type: 'badge', sortable: true },
      { field: 'ageLabel', label: 'Submitted', type: 'text', sortable: false },
      { field: 'category', label: 'Category', type: 'text', sortable: true },
    ];
  }

  /**
   * Get available actions for an item
   */
  getAvailableActions(item: SupportItemViewModel): ICardAction[] {
    const actions: ICardAction[] = [
      {
        id: 'view',
        label: 'View',
        icon: 'bx-show',
        routerLink: [SUPPORT_ROUTES.item(item.id)],
        isPrimary: true,
      },
    ];

    // External link if available
    if (item.externalUrl) {
      actions.push({
        id: 'external',
        label: 'View in Tracker',
        icon: 'bx-link-external',
        externalUrl: item.externalUrl,
      });
    }

    return actions;
  }

  /**
   * Get cell data for card display
   */
  private getCells(item: SupportItemViewModel): ICardCell[] {
    const cells: ICardCell[] = [
      createBadgeCell('Priority', item.priorityName, this.getPriorityVariant(item.priority) as BadgeVariant),
      createCell('Submitted', item.ageLabel, 'text'),
    ];

    if (item.category) {
      cells.push(createCell('Category', item.category, 'text'));
    }

    // Progress indicator
    cells.push(createCell('Progress', `${item.progressPercent}%`, 'text'));

    return cells;
  }

  /**
   * Get icon background class
   */
  private getIconBackground(item: SupportItemViewModel): string {
    return item.type === 'issue' 
      ? 'bg-danger-subtle' 
      : 'bg-primary-subtle';
  }

  /**
   * Map status to Bootstrap variant
   */
  private getStatusVariant(status: string): string {
    switch (status) {
      case 'new': return 'secondary';
      case 'triaged': return 'info';
      case 'in-progress': return 'warning';
      case 'resolved': return 'success';
      case 'closed': return 'dark';
      default: return 'secondary';
    }
  }

  /**
   * Map priority to Bootstrap variant
   */
  private getPriorityVariant(priority: string): string {
    switch (priority) {
      case 'low': return 'secondary';
      case 'medium': return 'info';
      case 'high': return 'warning';
      case 'critical': return 'danger';
      default: return 'secondary';
    }
  }
}
