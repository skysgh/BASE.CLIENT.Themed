/**
 * CORE TIER - Test Helpers
 * 
 * ✅ TIER ISOLATION RULES:
 * - Only imports from 'core/' directory
 * - No imports from core.ag, themes, sites, or apps
 * - Mocks HTTP responses (no real API calls)
 * - Provides core-specific test utilities
 * 
 * Why Tier Isolation?
 * - Core tests must be rock-solid foundation
 * - Higher tiers depend on core working correctly
 * - Core changes shouldn't break if higher tiers change
 * - Tests are reusable if core extracted as library
 * 
 * Usage:
 * ```typescript
 * import { setupCoreTestBed, mockHttpClient } from '../../testing/core-test-helpers';
 * 
 * describe('CoreService', () => {
 *   beforeEach(async () => {
 *     await setupCoreTestBed([]).compileComponents();
 *   });
 * });
 * ```
 */

import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

// ============================================================================
// CORE TIER IMPORTS ONLY
// ============================================================================

// ✅ OK: Importing from core tier
import { AccountConfig } from '../models/account-config.model';

// ❌ NOT OK: Don't import from higher tiers!
// import { sitesConfiguration } from '../../sites.anon/...';  // ❌ WRONG!
// import { appsConfiguration } from '../../sites.app/...';    // ❌ WRONG!

// ============================================================================
// MOCK HTTP CLIENT
// ============================================================================

/**
 * Mock HttpClient for testing core services
 * 
 * Use HttpClientTestingModule + HttpTestingController instead of mocking HttpClient directly.
 * This is Angular's recommended approach.
 * 
 * Example:
 * ```typescript
 * it('should load account', () => {
 *   service.loadAccount('foo');
 *   
 *   const req = httpMock.expectOne('/assets/data/accounts/foo.json');
 *   expect(req.request.method).toBe('GET');
 *   req.flush(mockFooAccount);
 * });
 * ```
 */
export function getMockHttpClient() {
  return {
    get: jasmine.createSpy('get').and.returnValue(of({})),
    post: jasmine.createSpy('post').and.returnValue(of({})),
    put: jasmine.createSpy('put').and.returnValue(of({})),
    delete: jasmine.createSpy('delete').and.returnValue(of({}))
  };
}

// ============================================================================
// MOCK ACCOUNT DATA (CORE TIER ONLY)
// ============================================================================

/**
 * Mock default account configuration
 * 
 * This is core-tier data - no higher-tier specifics!
 */
export const mockDefaultAccount: AccountConfig = {
  id: 'default',
  subdomain: 'default',
  name: 'Default Account',
  branding: {
    logo: {
      light: '/assets/media/open/accounts/default/logo-light.svg',
      dark: '/assets/media/open/accounts/default/logo-dark.svg'
    },
    colors: {
      primary: '#007bff',
      secondary: '#6c757d'
    },
    theme: 'light'
  },
  i18n: {
    defaultLanguage: 'en',
    supportedLanguages: ['en'],
    namespaces: ['common']
  },
  features: {
    authentication: true,
    multiLanguage: false
  }
};

/**
 * Mock foo account configuration
 */
export const mockFooAccount: AccountConfig = {
  id: 'foo',
  subdomain: 'foo',
  name: 'Foo Account',
  branding: {
    logo: {
      light: '/assets/media/open/accounts/foo/logo-light.svg',
      dark: '/assets/media/open/accounts/foo/logo-dark.svg'
    },
    colors: {
      primary: '#28a745',
      secondary: '#17a2b8'
    },
    theme: 'dark'
  },
  i18n: {
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'es'],
    namespaces: ['common', 'foo']
  },
  features: {
    authentication: true,
    multiLanguage: true
  }
};

/**
 * Mock bar account configuration
 */
export const mockBarAccount: AccountConfig = {
  id: 'bar',
  subdomain: 'bar',
  name: 'Bar Account',
  branding: {
    logo: {
      light: '/assets/media/open/accounts/bar/logo-light.svg',
      dark: '/assets/media/open/accounts/bar/logo-dark.svg'
    },
    colors: {
      primary: '#dc3545',
      secondary: '#ffc107'
    },
    theme: 'light'
  },
  i18n: {
    defaultLanguage: 'mi',
    supportedLanguages: ['en', 'mi'],
    namespaces: ['common', 'bar']
  },
  features: {
    authentication: true,
    multiLanguage: true
  }
};

// ============================================================================
// SETUP HELPERS (CORE TIER)
// ============================================================================

/**
 * Setup test bed for CORE tier tests
 * 
 * Only includes core-tier dependencies.
 * Higher tiers should use their own setupTestBed functions.
 * 
 * @param declarations - Core components/directives/pipes to test
 * @param additionalConfig - Additional test configuration
 */
export function setupCoreTestBed(
  declarations: any[] = [],
  additionalConfig: Partial<TestModuleMetadata> = {}
): typeof TestBed {
  
  const baseConfig: TestModuleMetadata = {
    declarations: [...declarations],
    imports: [
      HttpClientTestingModule,
      ...(additionalConfig.imports || [])
    ],
    providers: [
      // Core services (no mocks needed - testing them directly!)
      ...(additionalConfig.providers || [])
    ],
    schemas: additionalConfig.schemas || []
  };

  return TestBed.configureTestingModule(baseConfig);
}

// ============================================================================
// COMMON TEST UTILITIES
// ============================================================================

/**
 * Wait for async operations to complete
 * 
 * Useful for testing observables and promises.
 */
export function waitForAsync(ms: number = 0): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Trigger change detection and wait
 * 
 * Useful for testing component rendering.
 */
export async function detectChanges(fixture: any): Promise<void> {
  fixture.detectChanges();
  await waitForAsync();
  fixture.detectChanges();
}

// ============================================================================
// TIER ISOLATION VALIDATION
// ============================================================================

/**
 * Validate that a test file doesn't import from higher tiers
 * 
 * Call this in your test setup to enforce tier boundaries.
 * 
 * Example:
 * ```typescript
 * describe('CoreService', () => {
 *   beforeAll(() => {
 *     validateCoreTierIsolation();
 *   });
 * });
 * ```
 */
export function validateCoreTierIsolation(): void {
  // This is a runtime check that can be extended
  // For now, it's a placeholder for future validation logic
  
  // Could check:
  // - No imports from sites.anon/
  // - No imports from sites.app/
  // - No imports from themes/
  // - No imports from apps.bootstrap/
  
  // Implementation would require build-time analysis
  // or runtime stack trace inspection
}

// ============================================================================
// DOCUMENTATION
// ============================================================================

/**
 * TIER ISOLATION RULES FOR CORE TESTS:
 * 
 * ✅ ALLOWED IMPORTS:
 * - import { X } from '../services/...';           (core services)
 * - import { X } from '../models/...';             (core models)
 * - import { X } from '../guards/...';             (core guards)
 * - import { X } from '@angular/...';              (Angular framework)
 * - import { X } from 'rxjs/...';                  (RxJS library)
 * - import { X } from './core-test-helpers';       (core test helpers)
 * 
 * ❌ FORBIDDEN IMPORTS:
 * - import { X } from '../../core.ag/...';         (higher tier)
 * - import { X } from '../../themes/...';          (higher tier)
 * - import { X } from '../../sites.anon/...';      (higher tier)
 * - import { X } from '../../sites.app/...';       (higher tier)
 * - import { X } from '../../apps.bootstrap/...';  (higher tier)
 * 
 * WHY?
 * - Core is the foundation - must be rock-solid
 * - Core tests verify core works in isolation
 * - Higher tiers depend on core, not vice versa
 * - Core should be extractable as standalone library
 * - Test failures should pinpoint exact tier with issue
 */
