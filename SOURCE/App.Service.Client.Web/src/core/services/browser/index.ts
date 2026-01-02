/**
 * Browser Services
 * 
 * Wrappers around browser APIs for:
 * - Testability (can mock in unit tests)
 * - SSR Safety (graceful handling when APIs don't exist)
 * - Logging (centralized logging of operations)
 * - Error Handling (graceful fallbacks)
 * - Type Safety (generic typed methods)
 * 
 * USAGE:
 * ```typescript
 * import { LocalStorageService, SessionStorageService, ConsoleService } from '@core/services/browser';
 * 
 * constructor(
 *   private localStorage: LocalStorageService,
 *   private sessionStorage: SessionStorageService,
 *   private console: ConsoleService
 * ) {}
 * ```
 */

export * from './local-storage.service';
export * from './session-storage.service';
export * from './console.service';
