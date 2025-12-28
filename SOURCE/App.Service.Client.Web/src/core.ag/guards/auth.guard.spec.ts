/**
 * AuthGuard Tests (CORE.AG TIER)
 * 
 * ✅ LOCATION: core.ag (Angular-specific)
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

// ✅ CORE.AG IMPORTS
import { AuthGuard } from './auth.guard';

// ✅ CORE TIER IMPORTS (Angular-agnostic services)
import { AuthenticationService } from '../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../core/services/authfake.service';
import { ConfigRegistryService } from '../../core/services/config-registry.service';
import { setupCoreTestBed } from '../../core/testing/core-test-helpers';

describe('AuthGuard (Core.Ag Tier)', () => {
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
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAuthService = jasmine.createSpyObj('AuthenticationService', ['currentUser']);
    mockAuthFakeService = jasmine.createSpyObj('AuthfakeauthenticationService', [], {
      currentUserValue: null
    });

    mockConfigRegistry = new ConfigRegistryService();
    mockConfigRegistry.register('apps', mockAppsConfig);

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
    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/protected/page' } as RouterStateSnapshot;
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

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

  describe('canActivate - authenticated', () => {
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

  describe('canActivate - not authenticated', () => {
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
  });

  describe('session storage auth', () => {
    beforeEach(() => {
      Object.defineProperty(mockAuthFakeService, 'currentUserValue', {
        get: () => null,
        configurable: true
      });
    });

    it('should return true when currentUser in session storage', () => {
      sessionStorage.setItem('currentUser', JSON.stringify({ id: '1' }));
      const result = guard.canActivate(mockRoute, mockState);
      expect(result).toBe(true);
    });

    it('should redirect when session storage is empty', () => {
      const result = guard.canActivate(mockRoute, mockState);
      expect(result).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalled();
    });
  });
});
