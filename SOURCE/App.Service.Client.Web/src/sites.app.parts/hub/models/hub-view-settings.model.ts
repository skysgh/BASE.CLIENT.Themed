/**
 * Hub View Settings Model
 * 
 * Tiered settings for how the Hub displays widgets.
 * Follows: Service (defaults) → Account (org overrides) → User (personal)
 * 
 * Higher tiers can lock settings to prevent lower tiers from changing.
 */

/**
 * Individual widget visibility/order in Hub
 */
export interface HubWidgetSetting {
  /** Widget ID */
  id: string;
  
  /** Whether widget is visible */
  visible: boolean;
}

/**
 * Hub view settings at a specific tier
 */
export interface HubViewSettings {
  /** Display mode for widgets */
  displayMode: HubDisplayMode;
  
  /** Ordered list of widget settings (order = position in array) */
  widgets: HubWidgetSetting[];
  
  /** Which fields are locked (cannot be changed by lower tiers) */
  locked?: HubViewSettingsLock;
}

/**
 * Display modes for hub widgets
 */
export type HubDisplayMode = 'tiles' | 'grid' | 'list' | 'compact';

/**
 * Lock settings - prevents lower tiers from changing
 */
export interface HubViewSettingsLock {
  /** Lock display mode */
  displayMode?: boolean;
  
  /** Lock widget order */
  widgetOrder?: boolean;
  
  /** Lock widget visibility */
  widgetVisibility?: boolean;
  
  /** Lock specific widgets (by ID) */
  lockedWidgets?: string[];
}

/**
 * Full tiered settings structure
 */
export interface TieredHubViewSettings {
  /** Service-level defaults */
  service: HubViewSettings;
  
  /** Account-level overrides (if any) */
  account?: Partial<HubViewSettings>;
  
  /** User-level overrides (if any) */
  user?: Partial<HubViewSettings>;
}

/**
 * Default hub view settings
 */
export const DEFAULT_HUB_VIEW_SETTINGS: HubViewSettings = {
  displayMode: 'tiles',
  widgets: [],
  locked: undefined,
};

/**
 * Merge tiered settings (service → account → user)
 * Respects locks from higher tiers
 */
export function mergeHubViewSettings(tiered: TieredHubViewSettings): HubViewSettings {
  const { service, account, user } = tiered;
  
  // Start with service defaults
  let result: HubViewSettings = { ...service };
  
  // Apply account overrides (if not locked by service)
  if (account) {
    if (account.displayMode && !service.locked?.displayMode) {
      result.displayMode = account.displayMode;
    }
    if (account.widgets && !service.locked?.widgetOrder) {
      result.widgets = mergeWidgetSettings(result.widgets, account.widgets, service.locked?.lockedWidgets);
    }
    // Account can add its own locks
    result.locked = { ...result.locked, ...account.locked };
  }
  
  // Apply user overrides (if not locked by service or account)
  if (user) {
    if (user.displayMode && !result.locked?.displayMode) {
      result.displayMode = user.displayMode;
    }
    if (user.widgets && !result.locked?.widgetOrder) {
      result.widgets = mergeWidgetSettings(result.widgets, user.widgets, result.locked?.lockedWidgets);
    }
  }
  
  return result;
}

/**
 * Merge widget settings arrays, respecting locked widgets
 */
function mergeWidgetSettings(
  base: HubWidgetSetting[],
  override: HubWidgetSetting[],
  lockedWidgetIds?: string[]
): HubWidgetSetting[] {
  const lockedSet = new Set(lockedWidgetIds || []);
  const baseMap = new Map(base.map(w => [w.id, w]));
  
  // Start with override order
  const result: HubWidgetSetting[] = [];
  
  for (const widget of override) {
    if (lockedSet.has(widget.id)) {
      // Use base setting for locked widgets
      const baseWidget = baseMap.get(widget.id);
      if (baseWidget) {
        result.push(baseWidget);
      }
    } else {
      result.push(widget);
    }
  }
  
  // Add any base widgets not in override
  for (const widget of base) {
    if (!result.find(w => w.id === widget.id)) {
      result.push(widget);
    }
  }
  
  return result;
}
