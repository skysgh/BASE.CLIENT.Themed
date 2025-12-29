import { Injectable, signal, computed } from '@angular/core';
import { 
  ViewAction, 
  ViewPreference, 
  ViewRendererDefinition,
  DEFAULT_RENDERERS,
  getRenderersForAction,
  getDefaultRenderer 
} from './view-renderer.model';
import { SystemDiagnosticsTraceService } from '../services/system.diagnostics-trace.service';

/**
 * View Preference Service
 * 
 * Manages user preferences for how data is rendered.
 * Persists to localStorage, could sync to API later.
 * 
 * Usage:
 * ```typescript
 * // Get preferred renderer for spike browse
 * const renderer = viewPrefService.getPreferredRenderer('spike', 'browse');
 * 
 * // Set preference
 * viewPrefService.setPreference('spike', 'browse', 'browse-table');
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ViewPreferenceService {
  private readonly STORAGE_KEY = 'view_preferences';
  
  /** All available renderers */
  renderers = signal<ViewRendererDefinition[]>([...DEFAULT_RENDERERS]);
  
  /** User preferences */
  preferences = signal<ViewPreference[]>([]);

  constructor(private logger: SystemDiagnosticsTraceService) {
    this.loadPreferences();
    this.logger.debug(`${this.constructor.name} initialized`);
  }

  /**
   * Get available renderers for an action
   */
  getAvailableRenderers(action: ViewAction): ViewRendererDefinition[] {
    return this.renderers().filter(r => 
      r.supportedActions.includes(action) && r.available
    );
  }

  /**
   * Get preferred renderer for entity + action
   */
  getPreferredRenderer(entityType: string, action: ViewAction): ViewRendererDefinition {
    // Check user preference first
    const pref = this.preferences().find(p => 
      p.entityType === entityType && p.action === action
    );
    
    if (pref) {
      const renderer = this.renderers().find(r => r.id === pref.rendererId);
      if (renderer && renderer.available) {
        return renderer;
      }
    }
    
    // Check for global preference (entityType = '*')
    const globalPref = this.preferences().find(p => 
      p.entityType === '*' && p.action === action
    );
    
    if (globalPref) {
      const renderer = this.renderers().find(r => r.id === globalPref.rendererId);
      if (renderer && renderer.available) {
        return renderer;
      }
    }
    
    // Return default
    return getDefaultRenderer(action) || this.getAvailableRenderers(action)[0];
  }

  /**
   * Get preferred renderer ID
   */
  getPreferredRendererId(entityType: string, action: ViewAction): string {
    return this.getPreferredRenderer(entityType, action)?.id || '';
  }

  /**
   * Set preference
   */
  setPreference(entityType: string, action: ViewAction, rendererId: string): void {
    const current = this.preferences();
    const existing = current.findIndex(p => 
      p.entityType === entityType && p.action === action
    );
    
    const pref: ViewPreference = { entityType, action, rendererId };
    
    if (existing >= 0) {
      current[existing] = pref;
    } else {
      current.push(pref);
    }
    
    this.preferences.set([...current]);
    this.savePreferences();
    
    this.logger.debug(`Set view preference: ${entityType}/${action} → ${rendererId}`);
  }

  /**
   * Set global preference (applies to all entities)
   */
  setGlobalPreference(action: ViewAction, rendererId: string): void {
    this.setPreference('*', action, rendererId);
  }

  /**
   * Clear preference (reset to default)
   */
  clearPreference(entityType: string, action: ViewAction): void {
    const filtered = this.preferences().filter(p => 
      !(p.entityType === entityType && p.action === action)
    );
    this.preferences.set(filtered);
    this.savePreferences();
  }

  /**
   * Clear all preferences
   */
  clearAllPreferences(): void {
    this.preferences.set([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Register a custom renderer
   */
  registerRenderer(renderer: ViewRendererDefinition): void {
    const current = this.renderers();
    const existing = current.findIndex(r => r.id === renderer.id);
    
    if (existing >= 0) {
      current[existing] = renderer;
    } else {
      current.push(renderer);
    }
    
    this.renderers.set([...current]);
    this.logger.debug(`Registered renderer: ${renderer.id}`);
  }

  // Private methods
  
  private loadPreferences(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.preferences.set(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }

  private savePreferences(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.preferences()));
  }
}
