/**
 * Hub Service
 * 
 * Manages widgets displayed on the Hub page.
 * Provides a registry for applets to register their widgets.
 * 
 * View Settings follow tiered pattern:
 * - Service: Default widget order/visibility
 * - Account: Organization overrides (can lock for users)
 * - User: Personal preferences (respects locks)
 * 
 * Uses HubSettingsService for loading/saving settings across tiers.
 */
import { Injectable, inject, signal, computed, Type } from '@angular/core';

import { HubWidgetConfig, HubWidgetData, HubViewSettings, HubWidgetSetting, TieredHubViewSettings, mergeHubViewSettings, DEFAULT_HUB_VIEW_SETTINGS, HubDisplayMode } from '../models';
import { DEFAULT_WIDGET_IDS, WIDGET_SIZE_CLASSES, WidgetSize } from '../constants';
import { AccountService } from '../../../core/services/account.service';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { HubSettingsService } from './hub-settings.service';

@Injectable({ providedIn: 'root' })
export class HubService {
  private accountService = inject(AccountService);
  private hubSettingsService = inject(HubSettingsService);
  private logger = inject(SystemDiagnosticsTraceService);

  // ─────────────────────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────────────────────
  
  /** Registry of all widgets (keyed by ID) */
  private _registeredWidgets = signal<Map<string, HubWidgetConfig>>(new Map());
  
  /** Tiered view settings */
  private _viewSettings = signal<TieredHubViewSettings>({
    service: DEFAULT_HUB_VIEW_SETTINGS,
    account: undefined,
    user: undefined,
  });
  
  private _loading = signal(false);
  private _settingsLoaded = signal(false);
  
  // Public signals
  readonly loading = this._loading.asReadonly();
  readonly settingsLoaded = this._settingsLoaded.asReadonly();
  
  /** Merged view settings (service → account → user) */
  readonly viewSettings = computed(() => mergeHubViewSettings(this._viewSettings()));
  
  /**
   * Get all widgets for enabled applets, ordered by view settings
   */
  readonly appletWidgets = computed(() => {
    const registry = this._registeredWidgets();
    const accountConfig = this.accountService.getCurrentConfig();
    const settings = this.viewSettings();
    
    // Get enabled applet IDs from account config
    const enabledAppletIds = new Set<string>();
    if (accountConfig?.applets) {
      for (const [appletId, appletConfig] of Object.entries(accountConfig.applets)) {
        if (typeof appletConfig === 'object' && appletConfig && (appletConfig as any).enabled) {
          enabledAppletIds.add(appletId);
        }
      }
    }
    
    // Get all widgets whose applet is enabled
    const availableWidgets = Array.from(registry.values())
      .filter(w => enabledAppletIds.has(w.appletId));
    
    // Apply view settings for order and visibility
    const widgetMap = new Map(availableWidgets.map(w => [w.id, w]));
    const orderedWidgets: HubWidgetConfig[] = [];
    
    // First, add widgets in the order specified by settings
    for (const setting of settings.widgets) {
      const widget = widgetMap.get(setting.id);
      if (widget && setting.visible) {
        orderedWidgets.push(widget);
        widgetMap.delete(setting.id);
      }
    }
    
    // Then, add any remaining widgets not in settings (new widgets)
    for (const widget of widgetMap.values()) {
      orderedWidgets.push(widget);
    }
    
    return orderedWidgets;
  });

  constructor() {
    this.loadViewSettings();
  }

  // ─────────────────────────────────────────────────────────────
  // Widget Registration
  // ─────────────────────────────────────────────────────────────

  /**
   * Register a widget from an applet
   */
  registerWidget(config: HubWidgetConfig): void {
    this._registeredWidgets.update(registry => {
      const updated = new Map(registry);
      updated.set(config.id, config);
      return updated;
    });
    this.logger.debug(`[HubService] Registered widget: ${config.id}`);
  }

  /**
   * Register multiple widgets
   */
  registerWidgets(configs: HubWidgetConfig[]): void {
    configs.forEach(c => this.registerWidget(c));
  }

  /**
   * Unregister a widget
   */
  unregisterWidget(widgetId: string): void {
    this._registeredWidgets.update(registry => {
      const updated = new Map(registry);
      updated.delete(widgetId);
      return updated;
    });
  }

  /**
   * Get all registered widgets
   */
  getRegisteredWidgets(): HubWidgetConfig[] {
    return Array.from(this._registeredWidgets().values());
  }

  /**
   * Get a specific widget config
   */
  getWidget(widgetId: string): HubWidgetConfig | undefined {
    return this._registeredWidgets().get(widgetId);
  }

  // ─────────────────────────────────────────────────────────────
  // View Settings (Tiered: Service → Account → User)
  // ─────────────────────────────────────────────────────────────

  /**
   * Load view settings from all tiers using HubSettingsService
   */
  private loadViewSettings(): void {
    this.logger.debug('[HubService] Loading view settings via HubSettingsService');
    this._loading.set(true);
    
    this.hubSettingsService.loadAllSettings().subscribe({
      next: (tieredSettings) => {
        this._viewSettings.set(tieredSettings);
        this._settingsLoaded.set(true);
        this._loading.set(false);
        this.logger.debug('[HubService] View settings loaded successfully');
      },
      error: (error) => {
        this.logger.warn('[HubService] Failed to load settings, using defaults');
        this._loading.set(false);
        this._settingsLoaded.set(true);
      }
    });
  }

  /**
   * Update user's view settings (order and visibility)
   */
  updateUserViewSettings(widgets: HubWidgetSetting[]): void {
    const settings = this.viewSettings();
    
    // Check if locked by higher tier
    if (settings.locked?.widgetOrder) {
      this.logger.warn('[HubService] Widget order is locked by account/service');
      return;
    }
    
    this._viewSettings.update(current => ({
      ...current,
      user: {
        ...current.user,
        widgets,
      },
    }));
    
    this.saveUserViewSettings();
  }

  /**
   * Reorder widgets (user preference)
   */
  reorderWidgets(widgetIds: string[]): void {
    const currentSettings = this.viewSettings();
    
    // Check if locked
    if (currentSettings.locked?.widgetOrder) {
      this.logger.warn('[HubService] Widget order is locked');
      return;
    }
    
    // Build new widget settings maintaining visibility
    const currentWidgetMap = new Map(
      currentSettings.widgets.map(w => [w.id, w])
    );
    
    const newWidgets: HubWidgetSetting[] = widgetIds.map(id => ({
      id,
      visible: currentWidgetMap.get(id)?.visible ?? true,
    }));
    
    this.updateUserViewSettings(newWidgets);
    this.logger.debug(`[HubService] Reordered widgets: ${widgetIds.join(', ')}`);
  }

  /**
   * Toggle widget visibility (user preference)
   */
  toggleWidgetVisibility(widgetId: string): void {
    const currentSettings = this.viewSettings();
    
    // Check if this specific widget is locked
    if (currentSettings.locked?.widgetVisibility || 
        currentSettings.locked?.lockedWidgets?.includes(widgetId)) {
      this.logger.warn(`[HubService] Widget '${widgetId}' visibility is locked`);
      return;
    }
    
    const newWidgets = currentSettings.widgets.map(w => 
      w.id === widgetId ? { ...w, visible: !w.visible } : w
    );
    
    // If widget not in list, add it as visible
    if (!newWidgets.find(w => w.id === widgetId)) {
      newWidgets.push({ id: widgetId, visible: true });
    }
    
    this.updateUserViewSettings(newWidgets);
  }

  /**
   * Check if a setting is locked
   */
  isSettingLocked(setting: 'displayMode' | 'widgetOrder' | 'widgetVisibility', widgetId?: string): boolean {
    const settings = this.viewSettings();
    
    if (setting === 'displayMode') return settings.locked?.displayMode ?? false;
    if (setting === 'widgetOrder') return settings.locked?.widgetOrder ?? false;
    if (setting === 'widgetVisibility') {
      if (settings.locked?.widgetVisibility) return true;
      if (widgetId && settings.locked?.lockedWidgets?.includes(widgetId)) return true;
    }
    return false;
  }

  /**
   * Save user view settings via HubSettingsService
   */
  private saveUserViewSettings(): void {
    const userSettings = this._viewSettings().user;
    
    if (userSettings) {
      this.hubSettingsService.saveUserSettings('current-user', userSettings).subscribe({
        next: () => this.logger.debug('[HubService] User settings saved'),
        error: (e) => this.logger.warn(`[HubService] Failed to save user settings: ${e}`),
      });
    }
  }

  /**
   * Save account-level settings (for account admins)
   */
  saveAccountSettings(settings: Partial<HubViewSettings>): void {
    const accountId = this.accountService.getAccountId() || 'default';
    
    this.hubSettingsService.saveAccountSettings(accountId, settings).subscribe({
      next: () => {
        this._viewSettings.update(current => ({
          ...current,
          account: settings,
        }));
        this.logger.debug('[HubService] Account settings saved');
      },
      error: (e) => this.logger.warn(`[HubService] Failed to save account settings: ${e}`),
    });
  }

  /**
   * Save service-level settings (for sysadmins)
   */
  saveServiceSettings(settings: HubViewSettings): void {
    this.hubSettingsService.saveServiceSettings(settings).subscribe({
      next: () => {
        this._viewSettings.update(current => ({
          ...current,
          service: settings,
        }));
        this.logger.debug('[HubService] Service settings saved');
      },
      error: (e) => this.logger.warn(`[HubService] Failed to save service settings: ${e}`),
    });
  }

  // ─────────────────────────────────────────────────────────────
  // Config Panel Methods
  // ─────────────────────────────────────────────────────────────

  /**
   * Get all widgets for config panel (ordered by current settings)
   */
  getAllWidgets(): { widget: HubWidgetConfig; visible: boolean; locked: boolean }[] {
    const registry = this._registeredWidgets();
    const settings = this.viewSettings();
    
    // Build ordered list with visibility info
    const result: { widget: HubWidgetConfig; visible: boolean; locked: boolean }[] = [];
    const processedIds = new Set<string>();
    
    // First, add widgets in settings order
    for (const setting of settings.widgets) {
      const widget = registry.get(setting.id);
      if (widget) {
        result.push({
          widget,
          visible: setting.visible,
          locked: this.isSettingLocked('widgetVisibility', setting.id),
        });
        processedIds.add(setting.id);
      }
    }
    
    // Then add any new widgets not in settings
    for (const widget of registry.values()) {
      if (!processedIds.has(widget.id)) {
        result.push({
          widget,
          visible: true,
          locked: false,
        });
      }
    }
    
    return result;
  }

  /**
   * Toggle widget enabled state (legacy - now uses toggleWidgetVisibility)
   * @deprecated Use toggleWidgetVisibility instead
   */
  toggleWidgetEnabled(widgetId: string): void {
    this.toggleWidgetVisibility(widgetId);
  }

  // ─────────────────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────────────────

     /**
      * Get CSS class for widget size
      */
     getWidgetSizeClass(size: WidgetSize): string {
       return WIDGET_SIZE_CLASSES[size];
     }
   }
