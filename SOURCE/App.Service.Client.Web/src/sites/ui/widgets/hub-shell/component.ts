/**
 * Hub Shell Component
 * 
 * A reusable container for any hub (System Hub, Applet Hub, etc.).
 * Provides:
 * - Standard PageHeader with back button, title, icon
 * - Gear icon for configuration
 * - Pullout panel for tile ordering/visibility
 * - Content projection for tiles
 * 
 * Usage:
 * ```html
 * <app-hub-shell 
 *   title="Astronomy" 
 *   icon="bx-planet"
 *   hubId="astronomy-hub"
 *   [tiles]="entityTiles">
 *   <ng-container subtitle>Explore star systems and planets</ng-container>
 *   
 *   <!-- Tiles rendered via content projection or [tiles] input -->
 * </app-hub-shell>
 * ```
 */
import { Component, Input, Output, EventEmitter, inject, signal, TemplateRef, ViewChild, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbOffcanvas, NgbOffcanvasModule } from '@ng-bootstrap/ng-bootstrap';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

import { PageHeaderComponent } from '../page-header';

/**
 * Tile configuration for hub display
 */
export interface HubTileConfig {
  id: string;
  title: string;
  icon: string;
  iconColor: string;        // e.g., 'warning', 'info', 'primary'
  route: string;
  count?: number | (() => number);
  subtitle?: string;
  visible: boolean;
  locked?: boolean;
}

@Component({
  selector: 'app-hub-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbOffcanvasModule, DragDropModule, PageHeaderComponent],
  template: `
    <div class="hub-shell">
      <!-- Standard Page Header with back button -->
      <app-page-header 
        [title]="title"
        [icon]="icon"
        [iconBackground]="iconBackground"
        [iconClass]="iconClass"
        [showBack]="showBack">
        <ng-container subtitle>
          <ng-content select="[subtitle]"></ng-content>
        </ng-container>
        <ng-container actions>
          <!-- Config Button in header actions -->
          @if (showConfig) {
            <button class="btn btn-outline-secondary btn-sm" 
                    (click)="openConfigPanel()"
                    title="Configure hub tiles">
              <i class="bx bx-cog"></i>
            </button>
          }
        </ng-container>
      </app-page-header>

      <!-- Tile Grid (content projection or rendered from [tiles]) -->
      <div class="row g-3">
        @if (tiles && tiles.length > 0) {
          @for (tile of visibleTiles(); track tile.id) {
            <div class="col-md-4">
              <a [routerLink]="tile.route" class="entity-tile card h-100">
                <div class="card-body">
                  <div class="d-flex align-items-center">
                    <div class="tile-icon me-3" [class]="'bg-' + tile.iconColor + '-subtle'">
                      <i class="bx {{ tile.icon }}" [class]="'text-' + tile.iconColor"></i>
                    </div>
                    <div class="flex-grow-1">
                      <div class="d-flex align-items-baseline gap-2">
                        <h5 class="mb-0">{{ tile.title }}</h5>
                        @if (getTileCount(tile) !== undefined) {
                          <span class="badge" [class]="'bg-' + tile.iconColor + '-subtle text-' + tile.iconColor">
                            {{ getTileCount(tile) }}
                          </span>
                        }
                      </div>
                      @if (tile.subtitle) {
                        <p class="text-muted mb-0 small">{{ tile.subtitle }}</p>
                      }
                    </div>
                    <i class="bx bx-chevron-right text-muted"></i>
                  </div>
                </div>
              </a>
            </div>
          }
        } @else {
          <!-- Content projection for custom tile rendering -->
          <ng-content></ng-content>
        }
      </div>

      <!-- Empty state -->
      @if (visibleTiles().length === 0 && !hasContent) {
        <div class="alert alert-info text-center mt-4">
          <i class="bx bx-info-circle me-2"></i>
          No tiles configured for this hub.
        </div>
      }
    </div>

    <!-- Config Panel (Offcanvas) -->
    <ng-template #configPanel let-offcanvas>
      <div class="offcanvas-header border-bottom">
        <h5 class="offcanvas-title">
          <i class="bx bx-slider me-2"></i>
          Configure {{ title }}
        </h5>
        <button type="button" class="btn-close" aria-label="Close" (click)="offcanvas.dismiss()"></button>
      </div>
      <div class="offcanvas-body">
        <p class="text-muted small mb-3">
          Drag to reorder. Toggle visibility for each tile.
        </p>
        <div class="tile-config-list" cdkDropList (cdkDropListDropped)="onTileDrop($event)">
          @for (tile of configTiles(); track tile.id) {
            <div class="tile-config-item d-flex align-items-center gap-3 p-2 border rounded mb-2" 
                 cdkDrag 
                 [cdkDragDisabled]="tile.locked">
              <i class="bx bx-grid-vertical drag-handle" 
                 [class.text-muted]="!tile.locked"
                 [class.text-secondary]="tile.locked"
                 cdkDragHandle></i>
              <div class="tile-icon-sm" [class]="'bg-' + tile.iconColor + '-subtle'">
                <i class="bx {{ tile.icon }}" [class]="'text-' + tile.iconColor"></i>
              </div>
              <div class="flex-grow-1">
                <span class="fw-medium">{{ tile.title }}</span>
                @if (tile.locked) {
                  <i class="bx bx-lock-alt text-warning ms-1" title="Locked by administrator"></i>
                }
              </div>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" 
                       [checked]="tile.visible"
                       [disabled]="tile.locked"
                       (change)="toggleTileVisibility(tile.id)">
              </div>
            </div>
          }
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    .hub-shell {
      padding: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .entity-tile {
      text-decoration: none;
      color: inherit;
      transition: all 0.2s ease;
      border: 1px solid var(--vz-border-color);
      
      &:hover {
        border-color: var(--vz-primary);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        
        .tile-icon {
          transform: scale(1.05);
        }
      }
    }
    
    .tile-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      transition: transform 0.2s ease;
    }
    
    .tile-icon-sm {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }
    
    .tile-config-item {
      background: var(--vz-card-bg);
      transition: all 0.2s;
      
      &:hover {
        background: var(--vz-light);
      }
      
      &.cdk-drag-preview {
        box-shadow: 0 5px 5px -3px rgba(0,0,0,.2);
      }
    }
    
    .tile-config-list.cdk-drop-list-dragging .tile-config-item:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
    
    .drag-handle {
      cursor: grab;
      
      &:active {
        cursor: grabbing;
      }
    }
  `]
})
export class HubShellComponent {
  private offcanvasService = inject(NgbOffcanvas);

  @ViewChild('configPanel') configPanelTemplate!: TemplateRef<any>;

  /** Hub identifier for saving preferences */
  @Input() hubId = '';
  
  /** Hub title */
  @Input() title = '';
  
  /** Hub icon (BoxIcons class, e.g., 'bx-planet') */
  @Input() icon = 'bx-grid-alt';
  
  /** Icon background class (e.g., 'bg-primary-subtle') */
  @Input() iconBackground = 'bg-primary-subtle';
  
  /** Icon CSS class (e.g., 'text-primary') */
  @Input() iconClass = 'text-primary';
  
  /** Show back button in header */
  @Input() showBack = true;
  
  /** Show config gear icon */
  @Input() showConfig = true;
  
  /** Tile configurations */
  @Input() tiles: HubTileConfig[] = [];
  
  /** Emits when tile order changes */
  @Output() tilesReordered = new EventEmitter<string[]>();
  
  /** Emits when tile visibility changes */
  @Output() tileVisibilityChanged = new EventEmitter<{ id: string; visible: boolean }>();

  // Internal state for config panel
  configTiles = signal<HubTileConfig[]>([]);
  
  // Check if content was projected
  hasContent = false;

  /** Get visible tiles in order */
  visibleTiles = signal<HubTileConfig[]>([]);

  ngOnChanges(): void {
    this.updateVisibleTiles();
  }

  private updateVisibleTiles(): void {
    this.visibleTiles.set(this.tiles.filter(t => t.visible));
  }

  /** Get tile count (supports both static number and function) */
  getTileCount(tile: HubTileConfig): number | undefined {
    if (tile.count === undefined) return undefined;
    return typeof tile.count === 'function' ? tile.count() : tile.count;
  }

  /** Open configuration panel */
  openConfigPanel(): void {
    this.configTiles.set([...this.tiles]);
    this.offcanvasService.open(this.configPanelTemplate, {
      position: 'end',
      panelClass: 'hub-config-offcanvas'
    });
  }

  /** Handle drag-drop reorder */
  onTileDrop(event: CdkDragDrop<HubTileConfig[]>): void {
    const tiles = [...this.configTiles()];
    moveItemInArray(tiles, event.previousIndex, event.currentIndex);
    this.configTiles.set(tiles);
    
    // Update main tiles and emit
    this.tiles = tiles;
    this.updateVisibleTiles();
    this.tilesReordered.emit(tiles.map(t => t.id));
  }

  /** Toggle tile visibility */
  toggleTileVisibility(tileId: string): void {
    const tiles = this.configTiles().map(t => 
      t.id === tileId ? { ...t, visible: !t.visible } : t
    );
    this.configTiles.set(tiles);
    
    // Update main tiles and emit
    this.tiles = tiles;
    this.updateVisibleTiles();
    
    const tile = tiles.find(t => t.id === tileId);
    if (tile) {
      this.tileVisibilityChanged.emit({ id: tileId, visible: tile.visible });
    }
  }
}
