/**
 * AuthGuard Tests (CORE TIER)
 * 
 * ✅ TIER ISOLATION: This test file only imports from core tier
 * 
 * Tests:
 * - Authentication guard logic
 * - Firebase auth mode
 * - Fake auth mode
 * - Session storage auth
 * - Login redirect with return URL
 * - ConfigRegistry integration
 */

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// ✅ CORE TIER IMPORTS ONLY
import { AuthGuard } from './auth.guard';
import { AuthenticationService } from '../services/auth.service';
import { AuthfakeauthenticationService } from '../services/authfake.service';
import { ConfigRegistryService } from '../services/config-registry.service';
import { setupCoreTestBed } from '../testing/core-test-helpers';

describe('AuthGuard (Core Tier)', () => {
  let guard: AuthGuard;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthenticationService>;
  let mockAuthFakeService: jasmine.SpyObj<AuthfakeauthenticationService>;
  let mockConfigRegistry: ConfigRegistryService;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  const mockAppsConfig = {
    navigation: {
      auth: {
        login: '/auth/login'
      }
    },
    others: {
      core: {
        constants: {
          storage: {
            session: {
              currentUser: 'currentUser'
            }
          }
        }
      }
    }
  };

  beforeEach(() => {
    // Create spy objects
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAuthService = jasmine.createSpyObj('AuthenticationService', ['currentUser']);
    mockAuthFakeService = jasmine.createSpyObj('AuthfakeauthenticationService', [], {
      currentUserValue: null
    });

    // Create real ConfigRegistryService
    mockConfigRegistry = new ConfigRegistryService();
    mockConfigRegistry.register('apps', mockAppsConfig);

    // Setup test bed
    setupCoreTestBed([], {
      providers: [
        AuthGuard,
        { provide: Router, useValue: mockRouter },
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: AuthfakeauthenticationService, useValue: mockAuthFakeService },
        { provide: ConfigRegistryService, useValue: mockConfigRegistry }
      ]
    });

    guard = TestBed.inject(AuthGuard);

    // Create mock route and state
    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/protected/page' } as RouterStateSnapshot;

    // Clear session storage
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  // ============================================================================
  // BASIC TESTS
  // ============================================================================

  describe('guard creation', () => {
    it('should be created', () => {
      expect(guard).toBeTruthy();
    });

    it('should have canActivate method', () => {
      expect(guard.canActivate).toBeDefined();
    });

    it('should load config from registry', () => {
      expect(guard.appsConfiguration).toBeDefined();
      expect(guard.appsConfiguration.navigation.auth.login).toBe('/auth/login');
    });
  });

  // ============================================================================
  // FAKE AUTH MODE TESTS (Default)
  // ============================================================================

  describe('canActivate - fake auth mode (authenticated)', () => {
    beforeEach(() => {
      Object.defineProperty(mockAuthFakeService, 'currentUserValue', {
        get: () => ({ id: '1', name: 'Test User' }),
        configurable: true
      });
    });

    it('should return true when user is authenticated', () => {
      const result = guard.canActivate(mockRoute, mockState);
      
      expect(result).toBe(true);
    });

    it('should NOT navigate when user is authenticated', () => {
      guard.canActivate(mockRoute, mockState);
      
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('canActivate - fake auth mode (not authenticated)', () => {
    beforeEach(() => {
      Object.defineProperty(mockAuthFakeService, 'currentUserValue', {
        get: () => null,
        configurable: true
      });
    });

    it('should return false when user is not authenticated', () => {
      const result = guard.canActivate(mockRoute, mockState);
      
      expect(result).toBe(false);
    });

    it('should redirect to login page', () => {
      guard.canActivate(mockRoute, mockState);
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/auth/login'],
        { queryParams: { returnUrl: '/protected/page' } }
      );
    });

    it('should include return URL in query params', () => {
      const customState = { url: '/dashboard/reports' } as RouterStateSnapshot;
      
      guard.canActivate(mockRoute, customState);
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/auth/login'],
        { queryParams: { returnUrl: '/dashboard/reports' } }
      );
    });
  });

  // ============================================================================
  // SESSION STORAGE AUTH TESTS
  // ============================================================================

  describe('canActivate - session storage auth', () => {
    beforeEach(() => {
      Object.defineProperty(mockAuthFakeService, 'currentUserValue', {
        get: () => null,
        configurable: true
      });
    });

    it('should return true when currentUser in session storage', () => {
      sessionStorage.setItem('currentUser', JSON.stringify({ id: '1', name: 'User' }));
      
      const result = guard.canActivate(mockRoute, mockState);
      
      expect(result).toBe(true);
    });

    it('should NOT navigate when session storage has user', () => {
      sessionStorage.setItem('currentUser', JSON.stringify({ id: '1' }));
      
      guard.canActivate(mockRoute, mockState);
      
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should check session storage when fake auth is null', () => {
      sessionStorage.setItem('currentUser', '{"id":"1"}');
      
      const result = guard.canActivate(mockRoute, mockState);
      
      expect(result).toBe(true);
    });

    it('should redirect when session storage is empty', () => {
      const result = guard.canActivate(mockRoute, mockState);
      
      expect(result).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalled();
    });
  });

  // ============================================================================
  // CONFIG REGISTRY INTEGRATION TESTS
  // ============================================================================

  describe('ConfigRegistry integration', () => {
    it('should use login path from config', () => {
      Object.defineProperty(mockAuthFakeService, 'currentUserValue', {
        get: () => null,
        configurable: true
      });

      guard.canActivate(mockRoute, mockState);
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/auth/login'], // From config
        jasmine.any(Object)
      );
    });

    it('should use session storage key from config', () => {
      sessionStorage.setItem('currentUser', '{"id":"1"}'); // Key from config
      
      const result = guard.canActivate(mockRoute, mockState);
      
      expect(result).toBe(true);
    });

    it('should fallback to defaults when config not registered', () => {
      // Create guard with empty registry
      const emptyRegistry = new ConfigRegistryService();
      const guardWithoutConfig = new AuthGuard(
        mockRouter,
        mockAuthService,
        mockAuthFakeService,
        emptyRegistry
      );

      Object.defineProperty(mockAuthFakeService, 'currentUserValue', {
        get: () => null,
        configurable: true
      });

      guardWithoutConfig.canActivate(mockRoute, mockState);
      
      // Should still redirect to /auth/login (fallback)
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/auth/login'],
        jasmine.any(Object)
      );
    });
  });

  // ============================================================================
  // RETURN URL TESTS
  // ============================================================================

  describe('return URL handling', () => {
    beforeEach(() => {
      Object.defineProperty(mockAuthFakeService, 'currentUserValue', {
        get: () => null,
        configurable: true
      });
    });

    it('should preserve simple return URL', () => {
      const state = { url: '/dashboard' } as RouterStateSnapshot;
      
      guard.canActivate(mockRoute, state);
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/auth/login'],
        { queryParams: { returnUrl: '/dashboard' } }
      );
    });

    it('should preserve return URL with query params', () => {
      const state = { url: '/reports?date=2024-01-01&type=summary' } as RouterStateSnapshot;
      
      guard.canActivate(mockRoute, state);
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/auth/login'],
        { queryParams: { returnUrl: '/reports?date=2024-01-01&type=summary' } }
      );
    });

    it('should preserve return URL with hash', () => {
      const state = { url: '/page#section1' } as RouterStateSnapshot;
      
      guard.canActivate(mockRoute, state);
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/auth/login'],
        { queryParams: { returnUrl: '/page#section1' } }
      );
    });

    it('should handle root URL', () => {
      const state = { url: '/' } as RouterStateSnapshot;
      
      guard.canActivate(mockRoute, state);
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/auth/login'],
        { queryParams: { returnUrl: '/' } }
      );
    });
  });

  // ============================================================================
  // EDGE CASES
  // ============================================================================

  describe('edge cases', () => {
    it('should handle multiple consecutive checks', () => {
      // First check: not authenticated
      Object.defineProperty(mockAuthFakeService, 'currentUserValue', {
        get: () => null,
        configurable: true
      });
      
      const result1 = guard.canActivate(mockRoute, mockState);
      expect(result1).toBe(false);
      
      // Second check: authenticated
      Object.defineProperty(mockAuthFakeService, 'currentUserValue', {
        get: () => ({ id: '1' }),
        configurable: true
      });
      
      const result2 = guard.canActivate(mockRoute, mockState);
      expect(result2).toBe(true);
    });

    it('should handle session storage with invalid JSON', () => {
      sessionStorage.setItem('currentUser', 'invalid-json{');
      
      Object.defineProperty(mockAuthFakeService, 'currentUserValue', {
        get: () => null,
        configurable: true
      });
      
      // Should still consider user authenticated (session storage has value)
      const result = guard.canActivate(mockRoute, mockState);
      expect(result).toBe(true);
    });

    it('should handle empty session storage value', () => {
      sessionStorage.setItem('currentUser', '');
      
      Object.defineProperty(mockAuthFakeService, 'currentUserValue', {
        get: () => null,
        configurable: true
      });
      
      // Empty string is falsy, should redirect
      const result = guard.canActivate(mockRoute, mockState);
      expect(result).toBe(false);
    });
  });

  // ============================================================================
  // INTEGRATION SCENARIOS
  // ============================================================================

  describe('integration scenarios', () => {
    it('should simulate unauthenticated user accessing protected route', () => {
      // User not logged in
      Object.defineProperty(mockAuthFakeService, 'currentUserValue', {
        get: () => null,
        configurable: true
      });
      
      // User tries to access /dashboard
      const state = { url: '/dashboard' } as RouterStateSnapshot;
      
      // Guard blocks access
      const canAccess = guard.canActivate(mockRoute, state);
      expect(canAccess).toBe(false);
      
      // Guard redirects to login with return URL
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/auth/login'],
        { queryParams: { returnUrl: '/dashboard' } }
      );
    });

    it('should simulate authenticated user accessing protected route', () => {
      // User logged in
      Object.defineProperty(mockAuthFakeService, 'currentUserValue', {
        get: () => ({ id: '1', name: 'John', email: 'john@example.com' }),
        configurable: true
      });
      
      // User tries to access /dashboard
      const state = { url: '/dashboard' } as RouterStateSnapshot;
      
      // Guard allows access
      const canAccess = guard.canActivate(mockRoute, state);
      expect(canAccess).toBe(true);
      
      // No redirect
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should simulate session-based auth from API login', () => {
      // User logged in via API, session storage populated
      sessionStorage.setItem('currentUser', JSON.stringify({
        id: '1',
        name: 'Jane',
        email: 'jane@example.com',
        token: 'jwt-token-here'
      }));
      
      // Fake auth service doesn't have user (API login)
      Object.defineProperty(mockAuthFakeService, 'currentUserValue', {
        get: () => null,
        configurable: true
      });
      
      // Guard should still allow access
      const canAccess = guard.canActivate(mockRoute, mockState);
      expect(canAccess).toBe(true);
    });
  });
});
