/**
 * Hub Shell Component
 * 
 * A reusable container for any hub (Main Hub, Applet Hub, etc.).
 * Provides:
 * - Standard PageHeader with back button, title, icon
 * - Gear icon for configuration
 * - Pullout panel for tile ordering/visibility
 * - Support for default tiles OR custom tile components
 * 
 * Usage with default HubTile rendering:
 * ```html
 * <app-hub-shell 
 *   title="Astronomy" 
 *   icon="bx-planet"
 *   hubId="astronomy-hub"
 *   [tiles]="entityTiles"
 *   (tilesChange)="onTilesSaved($event)">
 *   <ng-container subtitle>Explore star systems and planets</ng-container>
 * </app-hub-shell>
 * ```
 * 
 * Usage with custom tile component:
 * ```html
 * <app-hub-shell 
 *   title="Hub" 
 *   icon="bx-home-alt"
 *   hubId="main-hub"
 *   [tiles]="mainHubTiles"
 *   [tileComponents]="widgetComponentMap"
 *   [showBack]="false">
 *   <ng-container subtitle>Welcome back!</ng-container>
 * </app-hub-shell>
 * ```
 */
import { Component, Input, Output, EventEmitter, inject, signal, TemplateRef, ViewChild, OnChanges, SimpleChanges, Type, Injector } from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbOffcanvas, NgbOffcanvasModule } from '@ng-bootstrap/ng-bootstrap';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

import { PageHeaderComponent } from '../page-header';
import { HubTileComponent } from '../hub-tile';
import { HubShellConfigPanelComponent } from '../hub-shell-config-panel';
import { IUniversalTile, IHubTilePreferences, applyTilePreferences, extractTilePreferences, HUB_TILE_DATA } from '../../../../core/models/presentation';

/**
 * Legacy tile configuration for backward compatibility
 * @deprecated Use IUniversalTile instead
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

/**
 * Map of tile IDs to custom component types
 * Used when tiles need custom rendering (e.g., main hub widgets)
 */
export type TileComponentMap = Map<string, Type<any>>;

/**
 * Convert legacy HubTileConfig to IUniversalTile
 */
function convertLegacyTile(legacy: HubTileConfig): IUniversalTile {
  return {
    id: legacy.id,
    title: legacy.title,
    icon: legacy.icon,
    iconColor: legacy.iconColor,
    subtitle: legacy.subtitle,
    value: typeof legacy.count === 'function' ? legacy.count() : legacy.count,
    config: {
      route: legacy.route,
      visible: legacy.visible,
      locked: legacy.locked,
    },
  };
}

@Component({
selector: 'app-hub-shell',
standalone: true,
imports: [
  CommonModule, 
  RouterModule, 
  NgComponentOutlet,
  NgbOffcanvasModule, 
  DragDropModule, 
  PageHeaderComponent,
  HubTileComponent,
  HubShellConfigPanelComponent
],
templateUrl: './component.html',
styles: [`
    .hub-shell {
      padding: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .tiles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
    }
    
    /* Legacy tile styling (backward compatibility) */
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
  `]
})
export class HubShellComponent implements OnChanges {
private offcanvasService = inject(NgbOffcanvas);
private injector = inject(Injector);

@ViewChild('configPanel') configPanelTemplate!: TemplateRef<any>;

/** Hub identifier for saving preferences */
@Input() hubId = '';
  
/** Hub title */
@Input() title = '';
  
/** Hub subtitle (alternative to content projection) */
@Input() subtitle = '';
  
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
  
/** Show breadcrumbs (default true, set false for main hub) */
@Input() showBreadcrumbs = true;
  
/** Tiles using new IUniversalTile model */
@Input() tiles: IUniversalTile[] = [];
  
/**
 * Map of tile IDs to custom component types
 * When provided, tiles matching an ID use the custom component instead of HubTileComponent
 * Custom components receive IUniversalTile via HUB_TILE_DATA injection token
 */
@Input() tileComponents?: TileComponentMap;
  
/** 
 * Grid column class for tiles (Bootstrap grid class)
 * Default: 'col-md-6 col-lg-4' for 3 columns on large screens
 */
@Input() tileColumnClass = 'col-md-6 col-lg-4';
  
/** 
 * Legacy tile configurations (backward compatibility)
 * @deprecated Use [tiles] with IUniversalTile instead
 */
@Input() legacyTiles: HubTileConfig[] = [];
  
/** Emits when tiles are saved (after config panel save) */
@Output() tilesChange = new EventEmitter<IUniversalTile[]>();
  
/** Emits tile preferences for persistence */
@Output() preferencesChange = new EventEmitter<IHubTilePreferences>();
  
/** 
 * Legacy: Emits when tile order changes 
 * @deprecated Use tilesChange or preferencesChange instead
 */
@Output() tilesReordered = new EventEmitter<string[]>();
  
/** 
 * Legacy: Emits when tile visibility changes 
 * @deprecated Use tilesChange or preferencesChange instead
 */
@Output() tileVisibilityChanged = new EventEmitter<{ id: string; visible: boolean }>();

// Internal state
private offcanvasRef: any;
workingTiles = signal<IUniversalTile[]>([]);
  
// Check if content was projected
hasContent = false;

/** Get visible tiles in order */
visibleTiles = signal<IUniversalTile[]>([]);
  
/** Cache of injectors for custom components */
private tileInjectorCache = new Map<string, Injector>();

/** Use legacy mode if legacyTiles provided but tiles empty */
get isLegacyMode(): boolean {
  return this.legacyTiles.length > 0 && this.tiles.length === 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tiles'] || changes['legacyTiles']) {
      this.clearInjectorCache();
      this.initializeTiles();
    }
  }

  private initializeTiles(): void {
    let allTiles: IUniversalTile[];
    
    if (this.isLegacyMode) {
      // Convert legacy tiles
      allTiles = this.legacyTiles.map(convertLegacyTile);
    } else {
      allTiles = [...this.tiles];
    }
    
    this.workingTiles.set(allTiles);
    this.updateVisibleTiles();
  }

  private updateVisibleTiles(): void {
    const visible = this.workingTiles()
      .filter(t => t.config.visible)
      .sort((a, b) => (a.config.order ?? 0) - (b.config.order ?? 0));
    this.visibleTiles.set(visible);
  }

  /** 
   * Get tile count (supports both static number and function) 
   * Legacy support for HubTileConfig
   */
  getTileCount(tile: HubTileConfig): number | undefined {
    if (tile.count === undefined) return undefined;
    return typeof tile.count === 'function' ? tile.count() : tile.count;
  }

  /** Open configuration panel */
  openConfigPanel(): void {
    this.offcanvasRef = this.offcanvasService.open(this.configPanelTemplate, {
      position: 'end',
      panelClass: 'hub-config-offcanvas'
    });
  }

  /** Handle tiles changed from config panel (live preview) */
  onConfigTilesChange(tiles: IUniversalTile[]): void {
    this.workingTiles.set(tiles);
    this.updateVisibleTiles();
  }

  /** Handle save from config panel */
  onConfigSave(tiles: IUniversalTile[]): void {
    this.workingTiles.set(tiles);
    this.updateVisibleTiles();
    
    // Emit events
    this.tilesChange.emit(tiles);
    this.preferencesChange.emit(extractTilePreferences(this.hubId, tiles));
    
    // Legacy events
    this.tilesReordered.emit(tiles.map(t => t.id));
    
    // Close panel
    this.offcanvasRef?.close();
  }

  /** Handle cancel from config panel */
  onConfigCancel(): void {
    // Reset to original
    this.initializeTiles();
    this.offcanvasRef?.close();
  }

  /** Handle reset from config panel */
  onConfigReset(): void {
    // Tiles already reset by the config panel component
  }

  // ─────────────────────────────────────────────────────────────────────
  // Custom Component Rendering Support
  // ─────────────────────────────────────────────────────────────────────

  /**
   * Check if a tile has a custom component
   */
  hasCustomComponent(tile: IUniversalTile): boolean {
    return this.tileComponents?.has(tile.id) ?? false;
  }

  /**
   * Get the custom component type for a tile
   */
  getCustomComponent(tile: IUniversalTile): Type<any> | null {
    return this.tileComponents?.get(tile.id) ?? null;
  }

  /**
   * Get injector for a tile that provides HUB_TILE_DATA
   * Caches injectors to avoid recreation on each render
   */
  getTileInjector(tile: IUniversalTile): Injector {
    let tileInjector = this.tileInjectorCache.get(tile.id);
    
    if (!tileInjector) {
      tileInjector = Injector.create({
        providers: [
          { provide: HUB_TILE_DATA, useValue: tile }
        ],
        parent: this.injector
      });
      this.tileInjectorCache.set(tile.id, tileInjector);
    }
    
    return tileInjector;
  }

  /**
   * Clear injector cache (call when tiles change significantly)
   */
  private clearInjectorCache(): void {
    this.tileInjectorCache.clear();
  }
}
