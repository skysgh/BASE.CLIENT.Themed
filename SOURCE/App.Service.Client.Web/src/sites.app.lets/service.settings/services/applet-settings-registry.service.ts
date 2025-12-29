import { Injectable, Type } from '@angular/core';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

/**
 * Applet Settings Schema
 * Defines what settings an applet provides
 */
export interface AppletSettingsSchema {
  /** Unique applet identifier (e.g., 'products', 'commerce') */
  appletId: string;
  
  /** Display name for settings sidebar */
  displayName: string;
  
  /** Icon class (boxicons, e.g., 'bx-package') */
  icon: string;
  
  /** Settings sections within this applet */
  sections: AppletSettingsSection[];
  
  /** Required permission to view these settings */
  requiredPermission?: string;
}

export interface AppletSettingsSection {
  /** Section key for routing */
  key: string;
  
  /** Display label */
  label: string;
  
  /** Component to render for this section */
  component: Type<any>;
  
  /** Required permission for this section */
  requiredPermission?: string;
}

/**
 * Applet Settings Registry Service
 * 
 * Central registry for applet-specific settings.
 * Applets register their settings schemas here, and the
 * settings hub dynamically renders them based on permissions.
 * 
 * Usage:
 * ```typescript
 * // In products applet
 * constructor(registry: AppletSettingsRegistryService) {
 *   registry.register({
 *     appletId: 'products',
 *     displayName: 'Products',
 *     icon: 'bx-package',
 *     sections: [
 *       { key: 'inventory', label: 'Inventory', component: InventorySettingsComponent }
 *     ]
 *   });
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class AppletSettingsRegistryService {
  private registry = new Map<string, AppletSettingsSchema>();

  constructor(private logger: SystemDiagnosticsTraceService) {
    this.logger.debug(`${this.constructor.name} initialized`);
  }

  /**
   * Register an applet's settings schema
   */
  register(schema: AppletSettingsSchema): void {
    if (this.registry.has(schema.appletId)) {
      this.logger.warn(`Applet '${schema.appletId}' settings already registered, overwriting`);
    }
    this.registry.set(schema.appletId, schema);
    this.logger.debug(`Registered settings for applet '${schema.appletId}'`);
  }

  /**
   * Unregister an applet's settings
   */
  unregister(appletId: string): void {
    this.registry.delete(appletId);
    this.logger.debug(`Unregistered settings for applet '${appletId}'`);
  }

  /**
   * Get settings schema for a specific applet
   */
  get(appletId: string): AppletSettingsSchema | undefined {
    return this.registry.get(appletId);
  }

  /**
   * Get all registered applet settings schemas
   */
  getAll(): AppletSettingsSchema[] {
    return Array.from(this.registry.values());
  }

  /**
   * Get applet IDs that have settings registered
   */
  getRegisteredAppletIds(): string[] {
    return Array.from(this.registry.keys());
  }

  /**
   * Check if an applet has settings registered
   */
  has(appletId: string): boolean {
    return this.registry.has(appletId);
  }

  /**
   * Get count of registered applet settings
   */
  get count(): number {
    return this.registry.size;
  }
}
