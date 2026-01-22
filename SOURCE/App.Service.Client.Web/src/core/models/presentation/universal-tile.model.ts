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
// TILE DISPLAY STYLES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Display style for tiles
 * 
 * - 'standard': Default tile with icon, title, description, value (e.g., hub tiles)
 * - 'compact': Smaller tile, condensed layout (e.g., settings navigation)
 * - 'list': Horizontal list-item style with icon and text
 * - 'card': Full card style with more detailed content area
 */
export type TileDisplayStyle = 'standard' | 'compact' | 'list' | 'card';

// ─────────────────────────────────────────────────────────────────────────────
// TILE GROUPING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Group definition for organizing tiles
 * 
 * Groups allow tiles to be categorized and rendered in sections
 * (e.g., "System" vs "Apps" in settings, or "Entities" vs "Tools" in a hub)
 */
export interface ITileGroup {
  /** Unique group identifier */
  id: string;
  
  /** Display label for the group header */
  label: string;
  
  /** Optional translation key for the label */
  labelKey?: string;
  
  /** Optional icon for the group header */
  icon?: string;
  
  /** Order for sorting groups (lower = first) */
  order?: number;
  
  /** Optional CSS class for group-specific styling */
  cssClass?: string;
  
  /** Optional description shown under the group header */
  description?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// TILE FILTERING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Filter definition for hub tile filtering
 * 
 * Filters allow showing/hiding tiles based on tag matching.
 * Used for things like Service/Account/User level switching in Settings.
 */
export interface IHubFilter {
  /** Unique filter identifier */
  id: string;
  
  /** Display label for the filter button */
  label: string;
  
  /** Optional translation key for the label */
  labelKey?: string;
  
  /** Optional icon for the filter button */
  icon?: string;
  
  /** 
   * Criteria to match against tile.config.filterTags
   * All criteria must match (AND logic)
   * Values can be string or string[] (OR within a key)
   */
  match: Record<string, string | string[]>;
  
  /** Optional CSS class for the filter button */
  buttonClass?: string;
  
  /** Order for sorting filters (lower = first) */
  order?: number;
}

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
  
  /** 
   * Display style for this tile
   * If not set, hub's defaultDisplayStyle is used
   */
  displayStyle?: TileDisplayStyle;
  
  /** Badges to display in tile header (max 4) */
  badges?: ITileBadge[];
  
  /**
   * Filter tags for tile filtering
   * Keys are filter dimensions, values are what to match
   * e.g., { level: 'user', category: 'platform' }
   * or { level: ['service', 'account', 'user'] } for multiple matches
   */
  filterTags?: Record<string, string | string[]>;
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
// HUB CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hub-level configuration for tile display
 * 
 * Controls how the hub renders tiles collectively - styles, grouping, config panel visibility.
 */
export interface IHubDisplayConfig {
  /** 
   * Default display style for tiles in this hub
   * Individual tiles can override with their own displayStyle
   */
  defaultDisplayStyle?: TileDisplayStyle;
  
  /**
   * Enable grouping of tiles by their groupId
   * When true, tiles are rendered in sections with group headers
   */
  enableGrouping?: boolean;
  
  /**
   * Group definitions for this hub
   * Defines available groups with labels, icons, order
   */
  groups?: ITileGroup[];
  
  /**
   * Label for tiles that have no groupId (ungrouped section)
   * Only used when enableGrouping is true
   */
  ungroupedLabel?: string;
  
  /**
   * Show configuration button (gear icon) in hub header
   * Default: true
   */
  showConfigButton?: boolean;
  
  /**
   * Grid column class for tiles (Bootstrap grid class)
   * Default: 'col-md-6 col-lg-4' for 3 columns on large screens
   * Compact: 'col-md-6 col-lg-4 col-xl-3' for 4 columns
   */
  tileColumnClass?: string;
  
  // ─────────────────────────────────────────────────────────────
  // Filtering
  // ─────────────────────────────────────────────────────────────
  
  /**
   * Filter definitions for this hub
   * When provided, tiles can be filtered by matching their filterTags
   */
  filters?: IHubFilter[];
  
  /**
   * Show filter buttons in hub header
   * Default: true (when filters are defined)
   */
  showFilterButtons?: boolean;
  
  /**
   * Default active filter ID
   * If not set, first filter is active by default
   */
  defaultFilterId?: string;
  
  /**
   * Filter button style
   * - 'segmented': Bootstrap btn-group with segmented buttons (default)
   * - 'pills': Pill-style nav buttons
   * - 'tabs': Tab-style buttons
   */
  filterButtonStyle?: 'segmented' | 'pills' | 'tabs';
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
 * A grouped set of tiles with group metadata
 */
export interface ITileGroupedSet {
  /** The group definition (null for ungrouped tiles) */
  group: ITileGroup | null;
  
  /** Tiles in this group, sorted by order */
  tiles: IUniversalTile[];
}

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

// ─────────────────────────────────────────────────────────────────────────────
// GROUPING UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Group tiles by their groupId property
 * 
 * @param tiles - Array of tiles to group
 * @param groups - Available group definitions
 * @param ungroupedLabel - Label for tiles without a groupId
 * @returns Array of grouped tile sets, sorted by group order
 */
export function groupTiles(
  tiles: IUniversalTile[],
  groups: ITileGroup[] = [],
  ungroupedLabel = 'Other'
): ITileGroupedSet[] {
  // Create a map of group IDs to group definitions
  const groupMap = new Map(groups.map(g => [g.id, g]));
  
  // Group tiles by their groupId
  const grouped = new Map<string | null, IUniversalTile[]>();
  
  tiles.forEach(tile => {
    const groupId = tile.config.groupId ?? null;
    if (!grouped.has(groupId)) {
      grouped.set(groupId, []);
    }
    grouped.get(groupId)!.push(tile);
  });
  
  // Convert to ITileGroupedSet array
  const result: ITileGroupedSet[] = [];
  
  // Add defined groups in order
  groups
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .forEach(group => {
      const tilesInGroup = grouped.get(group.id);
      if (tilesInGroup && tilesInGroup.length > 0) {
        result.push({
          group,
          tiles: tilesInGroup.sort((a, b) => (a.config.order ?? 0) - (b.config.order ?? 0))
        });
        grouped.delete(group.id);
      }
    });
  
  // Add any tiles with undefined group IDs or group IDs not in definitions
  const remainingTiles: IUniversalTile[] = [];
  grouped.forEach((tiles, groupId) => {
    if (groupId === null) {
      remainingTiles.push(...tiles);
    } else {
      // GroupId exists but no definition - create ad-hoc group
      result.push({
        group: { id: groupId, label: groupId, order: 999 },
        tiles: tiles.sort((a, b) => (a.config.order ?? 0) - (b.config.order ?? 0))
      });
    }
  });
  
  // Add ungrouped tiles at the end if any
  if (remainingTiles.length > 0) {
    result.push({
      group: { id: '__ungrouped__', label: ungroupedLabel, order: 9999 },
      tiles: remainingTiles.sort((a, b) => (a.config.order ?? 0) - (b.config.order ?? 0))
    });
  }
  
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// FILTERING UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if a tile matches a filter's criteria
 * 
 * @param tile - The tile to check
 * @param filter - The filter with match criteria
 * @returns true if tile matches all filter criteria
 */
export function tileMatchesFilter(tile: IUniversalTile, filter: IHubFilter): boolean {
  const tileTags = tile.config.filterTags;
  
  // If tile has no filter tags, it doesn't match any filter
  if (!tileTags) {
    return false;
  }
  
  // All filter criteria must match (AND logic between keys)
  for (const [key, filterValue] of Object.entries(filter.match)) {
    const tileValue = tileTags[key];
    
    // If tile doesn't have this tag, no match
    if (tileValue === undefined) {
      return false;
    }
    
    // Normalize to arrays for comparison
    const filterValues = Array.isArray(filterValue) ? filterValue : [filterValue];
    const tileValues = Array.isArray(tileValue) ? tileValue : [tileValue];
    
    // Check if any tile value matches any filter value (OR within a key)
    const hasMatch = tileValues.some(tv => filterValues.includes(tv));
    
    if (!hasMatch) {
      return false;
    }
  }
  
  return true;
}

/**
 * Filter tiles based on active filter
 * 
 * @param tiles - Array of tiles to filter
 * @param filter - Active filter to apply (or null for no filtering)
 * @returns Filtered array of tiles
 */
export function filterTiles(
  tiles: IUniversalTile[],
  filter: IHubFilter | null
): IUniversalTile[] {
  // No filter = show all tiles
  if (!filter) {
    return tiles;
  }
  
  return tiles.filter(tile => tileMatchesFilter(tile, filter));
}

/**
 * Get filter by ID from filter array
 * 
 * @param filters - Available filters
 * @param filterId - Filter ID to find
 * @returns The filter or null if not found
 */
export function getFilterById(
  filters: IHubFilter[],
  filterId: string | undefined
): IHubFilter | null {
  if (!filterId || !filters.length) {
    return null;
  }
  return filters.find(f => f.id === filterId) ?? null;
}
