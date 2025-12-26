import { Injectable } from '@angular/core';

/**
 * Configuration Registry Service
 * 
 * Purpose:
 * Central registry where modules register their configuration.
 * Provides unified access with autocomplete while maintaining loose coupling.
 * 
 * Why This Pattern:
 * Instead of hardcoding all config in Bootstrap (tight coupling),
 * modules register themselves when they load (loose coupling).
 * 
 * Architecture:
 * - Bootstrap provides registry (knows nothing about tiers)
 * - Modules register themselves (self-contained)
 * - Components request what they need (explicit dependencies)
 * 
 * Benefits:
 * 1. **Zero Coupling** - Bootstrap doesn't import from Sites/Apps/Applets
 * 2. **Lazy-Load Friendly** - Modules register when loaded (not before)
 * 3. **Provider Extensible** - New applets just register (no Bootstrap changes)
 * 4. **Still Great Autocomplete** - Typed interface provides IntelliSense
 * 
 * For Junior Developers:
 * Think of this like a phone book:
 * - Each person (module) adds their own entry when they arrive
 * - Anyone can look up any entry
 * - But the phone book doesn't need to know everyone in advance
 * 
 * Example Usage:
 * ```typescript
 * // Module registers itself:
 * export class SitesModule {
 *   constructor(configRegistryService: ConfigRegistryService) {
 *     configRegistryService.register('sites', {
 *       navigation: { landing: { pricing: '/pricing' } }
 *     });
 *   }
 * }
 * 
 * // Component requests config:
 * export class LandingComponent {
 *   constructor(configRegistryService: ConfigRegistryService) {
 *     const sitesConfig = configRegistryService.get<SitesConfig>('sites');
 *     const url = sitesConfig.navigation.landing.pricing;
 *   }
 * }
 * 
 * // Or get everything (autocomplete!):
 * const config = configRegistryService.getAll();
 * const url = config.sites.navigation.landing.pricing;
 * ```
 * 
 * Related:
 * @see ADR-003-configuration-registry-pattern.md
 * @see AppConfig interface for typed access
 */
@Injectable({ providedIn: 'root' })
export class ConfigRegistryService {
  
  /**
   * Internal registry map
   * 
   * Key: namespace (e.g., 'sites', 'apps', 'applets.education')
   * Value: config object (any shape)
   * 
   * Why Map:
   * - Fast lookups O(1)
   * - Easy to check if registered
   * - No prototype pollution
   */
  private registry = new Map<string, any>();
  
  /**
   * Register configuration for a namespace
   * 
   * Called by modules when they load (usually in constructor).
   * 
   * Idempotent: If already registered, silently ignores duplicate.
   * This handles hot-reload scenarios where modules reload.
   * 
   * Namespace Convention:
   * - Tier: 'sites', 'apps', 'applets'
   * - Applet: 'applets.education', 'applets.scheduling'
   * - Sub-module: 'sites.landing', 'apps.dashboards'
   * 
   * Example:
   * ```typescript
   * // Sites module:
   * configRegistryService.register('sites', {
   *   navigation: { ... },
   *   apis: { ... }
   * });
   * 
   * // Education applet (lazy loaded):
   * configRegistryService.register('applets.education', {
   *   navigation: { courses: '/courses' }
   * });
   * ```
   * 
   * @param namespace - Unique identifier for this config
   * @param config - Configuration object (any shape)
   */
  register(namespace: string, config: any): void {
    // ✅ Idempotent: If already registered, skip silently
    // (Handles hot-reload and multiple module imports)
    if (this.registry.has(namespace)) {
      // Don't warn - this is normal during hot-reload
      // Just skip and keep existing config
      return;
    }
    
    // Register config
    this.registry.set(namespace, config);
    
    console.log(`✅ [ConfigRegistryService] Registered: ${namespace}`);
  }
  
  /**
   * Get configuration for a namespace
   * 
   * Returns undefined if not registered (check before using!).
   * 
   * Generic Type Parameter:
   * Use `<T>` to get type safety and autocomplete:
   * ```typescript
   * const sitesConfig = configRegistryService.get<SitesConfig>('sites');
   * // sitesConfig is typed! Autocomplete works!
   * ```
   * 
   * Example:
   * ```typescript
   * // Get sites config:
   * const sitesConfig = configRegistryService.get<SitesConfig>('sites');
   * if (sitesConfig) {
   *   const url = sitesConfig.navigation.landing.pricing;
   * }
   * 
   * // Get applet config:
   * const eduConfig = configRegistryService.get<EducationConfig>('applets.education');
   * ```
   * 
   * @param namespace - Namespace to retrieve
   * @returns Config object or undefined if not registered
   */
  get<T>(namespace: string): T | undefined {
    const config = this.registry.get(namespace);
    
    if (!config) {
      console.warn(
        `[ConfigRegistryService] Namespace '${namespace}' not found. ` +
        `Make sure the module has loaded and registered itself.`
      );
    }
    
    return config as T;
  }
  
  /**
   * Get all configuration as typed composite
   * 
   * Returns AppConfig interface with all registered configs.
   * Provides full autocomplete for entire app!
   * 
   * Why This Method:
   * - Convenience: Get everything in one call
   * - Type Safety: AppConfig interface provides IntelliSense
   * - Backwards Compatibility: Works like old uber config
   * 
   * Example:
   * ```typescript
   * const config = configRegistryService.getAll();
   * 
   * // Full autocomplete:
   * config.sites.navigation.landing.pricing       ← IntelliSense!
   * config.apps.navigation.dashboards.main        ← IntelliSense!
   * config.applets.education.courses              ← IntelliSense!
   * ```
   * 
   * Note:
   * Properties may be undefined if module hasn't loaded yet.
   * Always check before using:
   * ```typescript
   * const config = configRegistryService.getAll();
   * if (config.sites) {
   *   // Sites module has loaded
   * }
   * ```
   * 
   * @returns Composite config object with all registered configs
   */
  getAll(): AppConfig {
    return {
      sites: this.get('sites'),
      apps: this.get('apps'),
      applets: {
        education: this.get('applets.education'),
        scheduling: this.get('applets.scheduling'),
        demos: this.get('applets.demos'),
        spike: this.get('applets.spike'),
        system: this.get('applets.system')
      }
    } as AppConfig;
  }
  
  /**
   * Check if namespace is registered
   * 
   * Useful for conditional logic based on module loading.
   * 
   * Example:
   * ```typescript
   * if (configRegistryService.has('applets.education')) {
   *   // Education applet is loaded
   *   const config = configRegistryService.get('applets.education');
   * } else {
   *   // Education applet not available
   * }
   * ```
   * 
   * @param namespace - Namespace to check
   * @returns True if registered, false otherwise
   */
  has(namespace: string): boolean {
    return this.registry.has(namespace);
  }
  
  /**
   * Get list of all registered namespaces
   * 
   * Useful for debugging or dynamic UI generation.
   * 
   * Example:
   * ```typescript
   * const namespaces = configRegistryService.getRegisteredNamespaces();
   * console.log('Loaded modules:', namespaces);
   * // ['sites', 'apps', 'applets.education']
   * ```
   * 
   * @returns Array of registered namespace strings
   */
  getRegisteredNamespaces(): string[] {
    return Array.from(this.registry.keys());
  }
  
  /**
   * Unregister a namespace (rarely needed)
   * 
   * Removes config from registry.
   * Use case: Hot module replacement, testing, or dynamic module unloading.
   * 
   * Example:
   * ```typescript
   * // Unload applet:
   * configRegistryService.unregister('applets.education');
   * ```
   * 
   * @param namespace - Namespace to remove
   * @returns True if was registered, false if didn't exist
   */
  unregister(namespace: string): boolean {
    const existed = this.registry.has(namespace);
    this.registry.delete(namespace);
    
    if (existed) {
      console.log(`🗑️ [ConfigRegistryService] Unregistered: ${namespace}`);
    }
    
    return existed;
  }
}

/**
 * App Configuration Type
 * 
 * Composite interface of all module configs.
 * Provides IntelliSense for entire app.
 * 
 * Why This Type:
 * Even though modules register separately, this type gives
 * autocomplete everywhere (like old uber config).
 * 
 * Usage:
 * ```typescript
 * const config: AppConfig = configRegistryService.getAll();
 * config.sites?.navigation?.landing?.pricing  // Full autocomplete!
 * ```
 * 
 * Note:
 * All properties are optional (?) because modules might
 * not be loaded yet (lazy loading).
 */
export interface AppConfig {
  sites?: any;      // TODO: Import SitesConfig type when available
  apps?: any;       // TODO: Import AppsConfig type when available
  applets?: {
    education?: any;   // TODO: Import EducationConfig type when available
    scheduling?: any;
    demos?: any;
    spike?: any;
    system?: any;
  };
}
