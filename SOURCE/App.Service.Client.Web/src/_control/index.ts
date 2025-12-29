/**
 * _control Configuration Index
 * 
 * This module provides re-exports and documentation for configuration files.
 * It does NOT contain the actual config - those remain in their Angular-standard locations.
 * 
 * PURPOSE:
 * - Centralized documentation for developers
 * - Type-safe re-exports
 * - Redirect to actual locations
 * 
 * ACTUAL LOCATIONS:
 * - Environment: src/environments/
 * - System: src/core/assets/data/system/
 * - Account: src/core/assets/data/accounts/
 */

// Re-export environment (if needed at runtime)
// Note: Usually accessed via import { environment } from '../environments/environment';

/**
 * Configuration paths for reference
 */
export const CONFIG_PATHS = {
  /** Environment configuration */
  environment: 'src/environments/',
  
  /** System settings (JSON) */
  systemSettings: 'assets/data/system/',
  
  /** Account configurations (JSON) */
  accountConfigs: 'assets/data/accounts/',
  
  /** Form definitions (YAML/JSON) */
  formDefinitions: 'assets/data/forms/',
  
  /** Mock data for development */
  mockData: '_custom/json-server/',
} as const;

/**
 * Get path to a configuration resource
 */
export function getConfigPath(type: keyof typeof CONFIG_PATHS): string {
  return CONFIG_PATHS[type];
}
