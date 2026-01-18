import { Injectable, Type } from '@angular/core';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

/**
 * Settings Level - determines context (service, account, or user)
 */
export type SettingsLevel = 'service' | 'account' | 'user';

/**
 * Setting Field Definition
 * Defines a single setting field with editability per level
 */
export interface SettingFieldSchema {
  /** Unique field key */
  key: string;
  
  /** i18n key for label */
  labelKey: string;
  
  /** Field type */
  type: 'text' | 'number' | 'boolean' | 'select' | 'color';
  
  /** Default value */
  defaultValue?: any;
  
  /** Options for select type */
  options?: { value: any; labelKey: string }[];
  
  /** Which levels can edit this field (others see lock icon) */
  editableAt: SettingsLevel[];
  
  /** i18n key for description/help text */
  descriptionKey?: string;
}

/**
 * Applet Settings Section
 * A group of related settings within an applet
 */
export interface AppletSettingsSection {
  /** Section key for routing */
  key: string;
  
  /** i18n key for section label */
  labelKey?: string;
  
  /** Component to render for this section */
  component?: Type<any>;
  
  /** Or define fields inline (for universal rendering with lock indicators) */
  fields?: SettingFieldSchema[];
}

/**
 * Applet Settings Schema
 * Defines what settings an applet provides
 */
export interface AppletSettingsSchema {
  /** Unique applet identifier (e.g., 'spike', 'products') */
  appletId: string;
  
  /** i18n key for display name */
  displayNameKey: string;
  
  /** Icon class (boxicons, e.g., 'bx-target-lock') */
  icon: string;
  
  /** i18n keys for search hints (allows finding via search) */
  searchHintKeys: string[];
  
  /** Settings sections within this applet */
  sections: AppletSettingsSection[];
  
  /** Category: 'platform' (Parts) or 'app' (Applets) */
  category: 'platform' | 'app';
  
  /** Sort order within category */
  order?: number;
}

/**
 * Applet Settings Registry Service
 * 
 * Central registry for applet-specific settings.
 * Applets register their settings schemas here.
 * 
 * Supports:
 * - Search by i18n hints
 * - Per-field editableAt for lock indicators
 * - Categorization (Platform vs App)
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
    this.logger.debug(`Registered settings for applet '${schema.appletId}' (${schema.category})`);
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
   * Check if an applet has settings registered
   */
  has(appletId: string): boolean {
    return this.registry.has(appletId);
  }

  /**
   * Check if a field is locked at a given level
   * Returns which higher level locked it (if any)
   */
  isFieldLocked(field: SettingFieldSchema, currentLevel: SettingsLevel): { locked: boolean; lockedBy?: SettingsLevel } {
    if (field.editableAt.includes(currentLevel)) {
      return { locked: false };
    }
    
    // Hierarchy: service > account > user
    const hierarchy: SettingsLevel[] = ['service', 'account', 'user'];
    const currentIndex = hierarchy.indexOf(currentLevel);
    
    // Find which higher level locked it
    for (let i = 0; i < currentIndex; i++) {
      if (field.editableAt.includes(hierarchy[i])) {
        return { locked: true, lockedBy: hierarchy[i] };
      }
    }
    
    return { locked: true };
  }
}
