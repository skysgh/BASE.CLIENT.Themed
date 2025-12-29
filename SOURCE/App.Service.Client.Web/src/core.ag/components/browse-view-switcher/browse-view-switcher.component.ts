import { Component, Input, Output, EventEmitter, TemplateRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SummaryItemVTO } from '../../../core/models/SummaryItem.vto.model';
import { ViewPreferenceService } from '../../../core/views/view-preference.service';
import { BrowseRendererType } from '../../../core/views/view-renderer.model';

/**
 * Browse View Switcher Component
 * 
 * Allows switching between different browse views:
 * - Cards (default) - Grid of cards
 * - Table - Traditional table view
 * - List - Compact list view
 * - Chart - Data visualization (future)
 * 
 * Usage:
 * ```html
 * <app-browse-view-switcher
 *   [entityType]="'spike'"
 *   [items]="summaryItems"
 *   [customCardTemplate]="customCard"
 *   [customTableTemplate]="customTable"
 *   (itemClick)="onItemClick($event)"
 *   (operationClick)="onOperation($event)">
 * </app-browse-view-switcher>
 * ```
 */
@Component({
  selector: 'app-browse-view-switcher',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './browse-view-switcher.component.html',
  styleUrls: ['./browse-view-switcher.component.scss']
})
export class BrowseViewSwitcherComponent implements OnInit, OnChanges {
  /** Entity type (e.g., 'spike') */
  @Input() entityType: string = '';
  
  /** Items to display */
  @Input() items: SummaryItemVTO[] = [];
  
  /** Custom card template */
  @Input() customCardTemplate?: TemplateRef<any>;
  
  /** Custom table template */
  @Input() customTableTemplate?: TemplateRef<any>;
  
  /** Custom list template */
  @Input() customListTemplate?: TemplateRef<any>;
  
  /** Show renderer toggle UI */
  @Input() showToggle: boolean = true;
  
  /** Allow user to change renderer */
  @Input() allowChange: boolean = true;
  
  /** Columns for table view */
  @Input() tableColumns: { key: string; label: string; width?: string }[] = [];
  
  /** Item clicked */
  @Output() itemClick = new EventEmitter<SummaryItemVTO>();
  
  /** Operation clicked */
  @Output() operationClick = new EventEmitter<{ item: SummaryItemVTO; action: string }>();
  
  /** Renderer changed */
  @Output() rendererChanged = new EventEmitter<string>();

  // Internal state
  currentRenderer: string = 'browse-cards';
  
  // Available renderers
  availableRenderers: { id: string; name: string; icon: string }[] = [];

  constructor(private viewPrefService: ViewPreferenceService) {}

  ngOnInit(): void {
    this.initializeRenderer();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entityType']) {
      this.initializeRenderer();
    }
  }

  private initializeRenderer(): void {
    // Get available renderers for browse
    this.availableRenderers = this.viewPrefService
      .getAvailableRenderers('browse')
      .map(r => ({ id: r.id, name: r.name, icon: r.icon }));
    
    // Get preferred renderer
    const preferred = this.viewPrefService.getPreferredRenderer(this.entityType, 'browse');
    this.currentRenderer = preferred.id;
  }

  /**
   * Get current renderer type
   */
  get rendererType(): BrowseRendererType {
    if (this.currentRenderer.includes('cards')) return 'cards';
    if (this.currentRenderer.includes('table')) return 'table';
    if (this.currentRenderer.includes('list')) return 'list';
    if (this.currentRenderer.includes('chart')) return 'chart';
    return 'cards';
  }

  /**
   * Switch renderer
   */
  switchRenderer(rendererId: string): void {
    if (!this.allowChange) return;
    
    this.currentRenderer = rendererId;
    this.viewPrefService.setPreference(this.entityType, 'browse', rendererId);
    this.rendererChanged.emit(rendererId);
  }

  /**
   * Handle item click
   */
  onItemClick(item: SummaryItemVTO): void {
    this.itemClick.emit(item);
  }

  /**
   * Handle operation click
   */
  onOperationClick(item: SummaryItemVTO, action: string, event: Event): void {
    event.stopPropagation();
    this.operationClick.emit({ item, action });
  }

  /**
   * Get value from item for table column
   */
  getColumnValue(item: SummaryItemVTO, key: string): any {
    // Check direct properties first
    if (key in item) {
      return (item as any)[key];
    }
    
    // Check values array
    const valueItem = item.values?.find(v => v.title === key);
    return valueItem?.value || '';
  }
}
