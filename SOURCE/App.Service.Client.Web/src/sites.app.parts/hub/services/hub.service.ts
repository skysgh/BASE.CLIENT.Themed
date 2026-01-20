/**
 * Hub Service
 * 
 * Manages widgets displayed on the Hub page.
 * Provides a registry for applets to register their widgets.
 */
import { Injectable, inject, signal, computed, Type } from '@angular/core';

import { HubWidgetConfig, HubWidgetData } from '../models';
import { DEFAULT_WIDGET_IDS, WIDGET_SIZE_CLASSES, WidgetSize } from '../constants';
import { AccountService } from '../../../core/services/account.service';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class HubService {
  private accountService = inject(AccountService);
  private logger = inject(SystemDiagnosticsTraceService);

  // ─────────────────────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────────────────────
  
  private _registeredWidgets = signal<Map<string, HubWidgetConfig>>(new Map());
  private _enabledWidgetIds = signal<string[]>(DEFAULT_WIDGET_IDS);
  private _loading = signal(false);
  
  // Public signals
  readonly loading = this._loading.asReadonly();
  
  // Computed - filters by both widget enabled AND applet enabled in account
  readonly enabledWidgets = computed(() => {
    const registry = this._registeredWidgets();
    const enabledIds = this._enabledWidgetIds();
    const accountConfig = this.accountService.getCurrentConfig();
    
    // Get enabled applet IDs from account config
    const enabledAppletIds = new Set<string>();
    if (accountConfig?.applets) {
      for (const [appletId, appletConfig] of Object.entries(accountConfig.applets)) {
        if (typeof appletConfig === 'object' && appletConfig && (appletConfig as any).enabled) {
          enabledAppletIds.add(appletId);
        }
      }
    }
    
    return enabledIds
      .map(id => registry.get(id))
      .filter((w): w is HubWidgetConfig => {
        if (!w || !w.enabled) return false;
        // Also check if the widget's applet is enabled in account config
        return enabledAppletIds.has(w.appletId);
      })
      .sort((a, b) => a.order - b.order);
  });
  
  /**
   * Get all widgets for enabled applets (for dynamic rendering)
   */
  readonly appletWidgets = computed(() => {
    const registry = this._registeredWidgets();
    const accountConfig = this.accountService.getCurrentConfig();
    
    // Get enabled applet IDs from account config
    const enabledAppletIds = new Set<string>();
    if (accountConfig?.applets) {
      for (const [appletId, appletConfig] of Object.entries(accountConfig.applets)) {
        if (typeof appletConfig === 'object' && appletConfig && (appletConfig as any).enabled) {
          enabledAppletIds.add(appletId);
        }
      }
    }
    
    return Array.from(registry.values())
      .filter(w => w.enabled && enabledAppletIds.has(w.appletId))
      .sort((a, b) => a.order - b.order);
  });

  constructor() {
    this.loadUserPreferences();
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
  // Widget Preferences
  // ─────────────────────────────────────────────────────────────

  /**
   * Load user's widget preferences
   */
  private loadUserPreferences(): void {
    this.accountService.getConfigValue<string[]>('hub.widgets')
      .subscribe(widgetIds => {
        if (widgetIds && widgetIds.length > 0) {
          this._enabledWidgetIds.set(widgetIds);
        }
      });
  }

  /**
   * Enable a widget
   */
  enableWidget(widgetId: string): void {
    this._enabledWidgetIds.update(ids => {
      if (ids.includes(widgetId)) return ids;
      return [...ids, widgetId];
    });
    this.savePreferences();
  }

  /**
   * Disable a widget
   */
  disableWidget(widgetId: string): void {
    this._enabledWidgetIds.update(ids => ids.filter(id => id !== widgetId));
    this.savePreferences();
  }

  /**
   * Reorder widgets
   */
  reorderWidgets(widgetIds: string[]): void {
    this._enabledWidgetIds.set(widgetIds);
    this.savePreferences();
  }

  /**
   * Save preferences to account
   */
  private savePreferences(): void {
    // In real impl, save to account service
    this.logger.debug(`[HubService] Saving widget preferences: ${this._enabledWidgetIds().join(', ')}`);
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
