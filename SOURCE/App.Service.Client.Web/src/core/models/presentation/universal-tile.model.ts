/**
 * Universal Tile Models
 * 
 * Extension of IUniversalCardData specifically for hub tiles.
 * Tiles are interactive cards with navigation and ordering capabilities.
 * 
 * ARCHITECTURE:
 * 
 * ┌─────────────────────────────────────────────────────────────────┐
 * │                     UNIVERSAL TILE                              │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ ┌───────┐  TITLE                                    [Value]    │
 * │ │ Icon  │  Description                                         │
 * │ └───────┘  (Subtitle)                                          │
 * ├─────────────────────────────────────────────────────────────────┤
 * │                     → Navigate to route                        │
 * └─────────────────────────────────────────────────────────────────┘
 * 
 * TILE vs CARD:
 * - Card: Display-focused, complex data cells, typically in lists
 * - Tile: Navigation-focused, simpler content, typically in grids
 * 
 * INHERITANCE:
 * IUniversalCardData (base)
 *   └─ IUniversalTile (adds navigation, ordering, visibility)
 */

import { IUniversalCardData } from './universal-card.model';

// ─────────────────────────────────────────────────────────────────────────────
// TILE CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Badge configuration for tile headers
 */
export interface ITileBadge {
  /** Badge text */
  text: string;
  /** CSS classes for badge (e.g., 'bg-info-subtle text-info') */
  class?: string;
  /** Optional icon class */
  icon?: string;
}

/**
 * Configuration for tile behavior and display
 */
export interface ITileConfig {
  /** Route to navigate to on click (string or array) */
  route: string | string[];
  
  /** Query parameters for the route */
  queryParams?: Record<string, string>;
  
  /** Is this tile visible in the hub? */
  visible: boolean;
  
  /** Order/position in the hub (for sorting) */
  order?: number;
  
  /** Is this tile locked (cannot be hidden or reordered)? */
  locked?: boolean;
  
  /** Group ID for categorizing tiles */
  groupId?: string;
  
  /** Size variant for responsive layouts */
  size?: 'small' | 'medium' | 'large';
  
  /** Badges to display in tile header (max 4) */
  badges?: ITileBadge[];
}

// ─────────────────────────────────────────────────────────────────────────────
// UNIVERSAL TILE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Universal Tile
 * 
 * Extends IUniversalCardData with navigation and hub-specific properties.
 * Used for hub tiles, dashboard widgets, and navigation grids.
 */
export interface IUniversalTile extends Partial<IUniversalCardData> {
  // ─────────────────────────────────────────────────────────────
  // Required Identity (from base, but required here)
  // ─────────────────────────────────────────────────────────────
  
  /** Tile ID (unique within the hub) */
  id: string;
  
  /** Tile type (e.g., 'entity-tile', 'widget-tile', 'custom-tile') */
  entityType?: string;
  
  // ─────────────────────────────────────────────────────────────
  // Required Content (from base, but required here)
  // ─────────────────────────────────────────────────────────────
  
  /** Primary title */
  title: string;
  
  // ─────────────────────────────────────────────────────────────
  // Visual (simplified from base)
  // ─────────────────────────────────────────────────────────────
  
  /** Icon class (e.g., 'bx-planet', 'ri-star-line') */
  icon: string;
  
  /** Icon color variant (e.g., 'primary', 'warning', 'info') */
  iconColor?: string;
  
  /** Icon background class (e.g., 'bg-primary-subtle') */
  iconBackground?: string;
  
  // ─────────────────────────────────────────────────────────────
  // Tile-Specific Content
  // ─────────────────────────────────────────────────────────────
  
  /** Description shown below title */
  description?: string;
  
  /** Subtitle (alternative to description) */
  subtitle?: string;
  
  /** Value/count to display (e.g., number of items) */
  value?: number | string;
  
  /** Value label (e.g., 'items', 'records') */
  valueLabel?: string;
  
  // ─────────────────────────────────────────────────────────────
  // Navigation & Configuration
  // ─────────────────────────────────────────────────────────────
  
  /** Tile configuration (navigation, visibility, ordering) */
  config: ITileConfig;
}

// ─────────────────────────────────────────────────────────────────────────────
// TILE PREFERENCES (persisted state)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * User preferences for a single tile
 */
export interface ITilePreference {
  /** Tile ID */
  id: string;
  
  /** Is visible? */
  visible: boolean;
  
  /** Order position */
  order: number;
}

/**
 * User preferences for a hub's tiles
 */
export interface IHubTilePreferences {
  /** Hub ID (e.g., 'astronomy-hub', 'system-hub') */
  hubId: string;
  
  /** Per-tile preferences */
  tiles: ITilePreference[];
  
  /** Last modified timestamp */
  lastModified?: Date | string;
}

// ─────────────────────────────────────────────────────────────────────────────
// TILE COLLECTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Collection of tiles for a hub
 */
export interface ITileCollection {
  /** All tiles in the collection */
  tiles: IUniversalTile[];
  
  /** Get visible tiles, sorted by order */
  visibleTiles?: IUniversalTile[];
  
  /** Get hidden tiles */
  hiddenTiles?: IUniversalTile[];
}

// ─────────────────────────────────────────────────────────────────────────────
// FACTORY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a simple tile from minimal data
 */
export function createTile(
  id: string,
  title: string,
  icon: string,
  route: string | string[],
  options?: Partial<IUniversalTile>
): IUniversalTile {
  return {
    id,
    title,
    icon,
    config: {
      route,
      visible: true,
      ...options?.config,
    },
    ...options,
  };
}

/**
 * Apply user preferences to a tile collection
 */
export function applyTilePreferences(
  tiles: IUniversalTile[],
  preferences: IHubTilePreferences | null
): IUniversalTile[] {
  if (!preferences || !preferences.tiles?.length) {
    return tiles;
  }
  
  const prefMap = new Map(preferences.tiles.map(p => [p.id, p]));
  
  return tiles
    .map(tile => {
      const pref = prefMap.get(tile.id);
      if (pref) {
        return {
          ...tile,
          config: {
            ...tile.config,
            visible: pref.visible,
            order: pref.order,
          },
        };
      }
      return tile;
    })
    .sort((a, b) => (a.config.order ?? 999) - (b.config.order ?? 999));
}

/**
 * Extract preferences from current tile state
 */
export function extractTilePreferences(
  hubId: string,
  tiles: IUniversalTile[]
): IHubTilePreferences {
  return {
    hubId,
    tiles: tiles.map((tile, index) => ({
      id: tile.id,
      visible: tile.config.visible,
      order: tile.config.order ?? index,
    })),
    lastModified: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HUB TILE RENDERER (for custom tile components)
// ─────────────────────────────────────────────────────────────────────────────

import { InjectionToken } from '@angular/core';

/**
 * Injection token for tile data passed to custom tile components
 */
export const HUB_TILE_DATA = new InjectionToken<IUniversalTile>('HUB_TILE_DATA');

/**
 * Interface for custom tile renderer components
 * 
 * Custom tile components should implement this interface to receive
 * standardized tile data from HubShellComponent.
 * 
 * Usage:
 * ```typescript
 * @Component({...})
 * export class SpikeWidgetComponent implements IHubTileRenderer {
 *   tile = inject(HUB_TILE_DATA);
 *   // Component can use tile.title, tile.icon, tile.value, etc.
 *   // AND add its own custom content (recent items, badges, etc.)
 * }
 * ```
 */
export interface IHubTileRenderer {
  /** 
   * The tile data - injected via HUB_TILE_DATA token
   * Custom components use this for the standard header portion
   */
  tile: IUniversalTile;
}
