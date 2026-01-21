/**
 * Hub Shell Config Panel Component
 * 
 * A reusable panel for configuring hub shell tiles (order and visibility).
 * Typically shown in an offcanvas/flyout panel from HubShellComponent.
 * 
 * Features:
 * - Drag-and-drop reordering
 * - Visibility toggle for each tile
 * - Lock indicator for non-configurable tiles
 * - Save/Reset/Cancel actions
 * 
 * Usage:
 * ```html
 * <app-hub-shell-config-panel
 *   [tiles]="hubTiles"
 *   (tilesChange)="onTilesChange($event)"
 *   (save)="onSave($event)"
 *   (cancel)="onCancel()">
 * </app-hub-shell-config-panel>
 * ```
 */
import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { IUniversalTile } from '../../../../core/models/presentation';

/**
 * Re-export for backward compatibility
 * @deprecated Use HubShellConfigPanelComponent instead
 */
export { HubShellConfigPanelComponent as HubTileConfigPanelComponent };

@Component({
  selector: 'app-hub-shell-config-panel',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './component.html',
  styles: [`
    .config-panel {
      padding: 1rem;
    }
    
    .config-header {
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--vz-border-color);
      margin-bottom: 1rem;
    }
    
    .config-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0;
    }
    
    .config-subtitle {
      font-size: 0.875rem;
      color: var(--vz-secondary-color);
      margin: 0.25rem 0 0;
    }
    
    .tile-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .tile-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: var(--vz-card-bg);
      border: 1px solid var(--vz-border-color);
      border-radius: 0.375rem;
      margin-bottom: 0.5rem;
      cursor: move;
      transition: all 0.2s ease;
      
      &:hover:not(.tile-item--locked) {
        border-color: var(--vz-primary);
        background: var(--vz-light);
      }
      
      &--locked {
        cursor: not-allowed;
        opacity: 0.7;
        background: var(--vz-light);
      }
      
      &--hidden {
        opacity: 0.5;
      }
    }
    
    .drag-handle {
      color: var(--vz-secondary-color);
      cursor: grab;
      
      &:active {
        cursor: grabbing;
      }
    }
    
    .tile-icon-mini {
      width: 32px;
      height: 32px;
      min-width: 32px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }
    
    .tile-info {
      flex: 1;
      min-width: 0;
    }
    
    .tile-name {
      font-weight: 500;
      margin: 0;
      font-size: 0.875rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .tile-desc {
      font-size: 0.75rem;
      color: var(--vz-secondary-color);
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .tile-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .visibility-toggle {
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
      border-radius: 0.25rem;
      border: 1px solid var(--vz-border-color);
      background: var(--vz-card-bg);
      cursor: pointer;
      transition: all 0.15s ease;
      
      &:hover:not(:disabled) {
        border-color: var(--vz-primary);
      }
      
      &--visible {
        color: var(--vz-success);
      }
      
      &--hidden {
        color: var(--vz-secondary-color);
      }
      
      &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
    }
    
    .lock-indicator {
      font-size: 0.875rem;
      color: var(--vz-secondary-color);
    }
    
    .config-footer {
      padding-top: 1rem;
      border-top: 1px solid var(--vz-border-color);
      margin-top: 1rem;
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
    }
    
    .btn-group-end {
      display: flex;
      gap: 0.5rem;
    }
    
    /* CDK Drag styles */
    .cdk-drag-preview {
      box-sizing: border-box;
      border-radius: 0.375rem;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
    
    .cdk-drag-placeholder {
      opacity: 0.3;
    }
    
    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
    
    .tile-list.cdk-drop-list-dragging .tile-item:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `]
})
export class HubShellConfigPanelComponent implements OnInit {
  /**
   * The tiles to configure
   */
  @Input({ required: true }) tiles: IUniversalTile[] = [];

  /**
   * Panel title
   */
  @Input() title = 'Configure Tiles';

  /**
   * Panel subtitle/description
   */
  @Input() subtitle = 'Drag to reorder, toggle visibility';

  /**
   * Show reset button
   */
  @Input() showReset = true;

  /**
   * Emitted when tiles are changed (for live preview)
   */
  @Output() tilesChange = new EventEmitter<IUniversalTile[]>();

  /**
   * Emitted when save is clicked
   */
  @Output() save = new EventEmitter<IUniversalTile[]>();

  /**
   * Emitted when cancel is clicked
   */
  @Output() cancel = new EventEmitter<void>();

  /**
   * Emitted when reset is clicked
   */
  @Output() reset = new EventEmitter<void>();

  /**
   * Working copy of tiles for editing
   */
  editingTiles = signal<IUniversalTile[]>([]);

  /**
   * Original tiles for reset functionality
   */
  private originalTiles: IUniversalTile[] = [];

  ngOnInit(): void {
    // Deep copy tiles for editing
    this.originalTiles = this.deepCopyTiles(this.tiles);
    this.editingTiles.set(this.deepCopyTiles(this.tiles));
  }

  /**
   * Deep copy tiles array
   */
  private deepCopyTiles(tiles: IUniversalTile[]): IUniversalTile[] {
    return tiles.map(tile => ({
      ...tile,
      config: { ...tile.config },
    }));
  }

  /**
   * Handle drag-drop reorder
   */
  onDrop(event: CdkDragDrop<IUniversalTile[]>): void {
    const tiles = [...this.editingTiles()];
    moveItemInArray(tiles, event.previousIndex, event.currentIndex);
    
    // Update order values
    tiles.forEach((tile, index) => {
      tile.config.order = index;
    });
    
    this.editingTiles.set(tiles);
    this.tilesChange.emit(tiles);
  }

  /**
   * Toggle tile visibility
   */
  toggleVisibility(tile: IUniversalTile): void {
    if (tile.config.locked) return;
    
    const tiles = this.editingTiles().map(t => {
      if (t.id === tile.id) {
        return {
          ...t,
          config: {
            ...t.config,
            visible: !t.config.visible,
          },
        };
      }
      return t;
    });
    
    this.editingTiles.set(tiles);
    this.tilesChange.emit(tiles);
  }

  /**
   * Get icon background class for tile
   */
  getIconBackgroundClass(tile: IUniversalTile): string {
    if (tile.iconBackground) {
      return tile.iconBackground;
    }
    const color = tile.iconColor || 'secondary';
    return `bg-${color}-subtle`;
  }

  /**
   * Get icon text class for tile
   */
  getIconTextClass(tile: IUniversalTile): string {
    const color = tile.iconColor || 'secondary';
    return `text-${color}`;
  }

  /**
   * Get full icon classes for tile
   */
  getIconClasses(tile: IUniversalTile): string {
    const icon = tile.icon;
    const classes: string[] = [this.getIconTextClass(tile)];
    
    if (icon.startsWith('bx-') || icon.startsWith('bxs-') || icon.startsWith('bxl-')) {
      classes.push('bx');
    } else if (icon.startsWith('mdi-')) {
      classes.push('mdi');
    }
    
    classes.push(icon);
    return classes.join(' ');
  }

  /**
   * Handle save action
   */
  onSave(): void {
    this.save.emit(this.editingTiles());
  }

  /**
   * Handle cancel action
   */
  onCancel(): void {
    this.cancel.emit();
  }

  /**
   * Handle reset action
   */
  onReset(): void {
    this.editingTiles.set(this.deepCopyTiles(this.originalTiles));
    this.tilesChange.emit(this.editingTiles());
    this.reset.emit();
  }

  /**
   * Check if a tile can be dragged
   */
  canDrag(tile: IUniversalTile): boolean {
    return !tile.config.locked;
  }
}
