/**
 * Child Summary Component
 * 
 * Reusable component for displaying a summary of child entities on parent views.
 * Part of the I-S-BREAD-T pattern where S = Summary.
 * 
 * Features:
 * - Count display (total, by status)
 * - Quick stats (totals, averages)
 * - Navigation to full Browse view
 * - Add new action
 * - Configurable display (S/M/L sizes, single-line variant)
 * 
 * Usage:
 * ```html
 * <app-child-summary
 *   title="Sub-Spikes"
 *   icon="bx-layer"
 *   [items]="subSpikes"
 *   [loading]="loading"
 *   browseRoute="../subspikes"
 *   addRoute="../subspikes/add"
 *   (onAdd)="onAddSubSpike()"
 *   (onBrowse)="onBrowseSubSpikes()">
 * </app-child-summary>
 * ```
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

export interface SummaryItem {
  id: string;
  title: string;
  statusId?: string;
  statusName?: string;
  statusColor?: string;
}

export interface SummaryStats {
  label: string;
  value: number | string;
  icon?: string;
  color?: string;
}

export type SummarySize = 'sm' | 'md' | 'lg' | 'single-line';

@Component({
  selector: 'app-child-summary',
  templateUrl: './child-summary.component.html',
  styleUrls: ['./child-summary.component.scss']
})
export class ChildSummaryComponent {
  /**
   * Title for the summary section
   */
  @Input() title: string = 'Items';
  
  /**
   * Icon class (boxicons)
   */
  @Input() icon: string = 'bx-list-ul';
  
  /**
   * Items to summarize
   */
  @Input() items: SummaryItem[] = [];
  
  /**
   * Loading state
   */
  @Input() loading: boolean = false;
  
  /**
   * Additional stats to display
   */
  @Input() stats: SummaryStats[] = [];
  
  /**
   * Route for Browse action
   */
  @Input() browseRoute?: string;
  
  /**
   * Route for Add action
   */
  @Input() addRoute?: string;
  
  /**
   * Display size: 'sm' | 'md' | 'lg' | 'single-line'
   */
  @Input() size: SummarySize = 'md';
  
  /**
   * Whether to show the add button
   */
  @Input() showAdd: boolean = true;
  
  /**
   * Whether to show status breakdown
   */
  @Input() showStatusBreakdown: boolean = true;
  
  /**
   * Event: Add button clicked
   */
  @Output() onAdd = new EventEmitter<void>();
  
  /**
   * Event: Browse/View All clicked
   */
  @Output() onBrowse = new EventEmitter<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  /**
   * Total count of items
   */
  get totalCount(): number {
    return this.items?.length || 0;
  }

  /**
   * Group items by status
   */
  get statusBreakdown(): { status: string; color: string; count: number }[] {
    if (!this.items || this.items.length === 0) {
      return [];
    }
    
    const grouped = this.items.reduce((acc, item) => {
      const status = item.statusName || 'Unknown';
      const color = item.statusColor || '#6c757d';
      
      if (!acc[status]) {
        acc[status] = { status, color, count: 0 };
      }
      acc[status].count++;
      return acc;
    }, {} as Record<string, { status: string; color: string; count: number }>);
    
    return Object.values(grouped);
  }

  /**
   * Handle add action
   */
  handleAdd(): void {
    if (this.addRoute) {
      this.router.navigate([this.addRoute], { relativeTo: this.route });
    }
    this.onAdd.emit();
  }

  /**
   * Handle browse action
   */
  handleBrowse(): void {
    if (this.browseRoute) {
      this.router.navigate([this.browseRoute], { relativeTo: this.route });
    }
    this.onBrowse.emit();
  }

  /**
   * Check if single-line mode
   */
  get isSingleLine(): boolean {
    return this.size === 'single-line';
  }

  /**
   * Check if small mode
   */
  get isSmall(): boolean {
    return this.size === 'sm';
  }
}
