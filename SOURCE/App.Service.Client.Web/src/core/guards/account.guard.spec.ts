/**
 * AccountGuard Tests (CORE TIER)
 * 
 * ✅ TIER ISOLATION: This test file only imports from core tier
 * 
 * Tests:
 * - Account validation guard logic
 * - Redirect to 404-A when account not found
 * - Allow navigation when account exists
 * - Session storage handling
 */

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// ✅ CORE TIER IMPORTS ONLY
import { AccountGuard } from './account.guard';
import { AccountService } from '../services/account.service';
import { setupCoreTestBed } from '../testing/core-test-helpers';

describe('AccountGuard (Core Tier)', () => {
  let guard: AccountGuard;
  let mockAccountService: jasmine.SpyObj<AccountService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    // Create spy objects
    mockAccountService = jasmine.createSpyObj('AccountService', [
      'isAccountNotFound',
      'getAccountId'
    ]);

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Setup test bed
    setupCoreTestBed([], {
      providers: [
        AccountGuard,
        { provide: AccountService, useValue: mockAccountService },
        { provide: Router, useValue: mockRouter }
      ]
    });

    guard = TestBed.inject(AccountGuard);

    // Create mock route and state
    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/foo/pages' } as RouterStateSnapshot;

    // Clear session storage before each test
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
  });

  // ============================================================================
  // VALID ACCOUNT TESTS
  // ============================================================================

  describe('canActivate - valid account', () => {
    beforeEach(() => {
      mockAccountService.isAccountNotFound.and.returnValue(false);
      mockAccountService.getAccountId.and.returnValue('foo');
    });

    it('should return true when account is valid', () => {
      const result = guard.canActivate(mockRoute, mockState);
      
      expect(result).toBe(true);
      expect(mockAccountService.isAccountNotFound).toHaveBeenCalled();
    });

    it('should NOT navigate when account is valid', () => {
      guard.canActivate(mockRoute, mockState);
      
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should NOT set session storage when account is valid', () => {
      guard.canActivate(mockRoute, mockState);
      
      expect(sessionStorage.getItem('accountNotFoundId')).toBeNull();
    });

    it('should allow navigation for default account', () => {
      mockAccountService.getAccountId.and.returnValue('default');
      
      const result = guard.canActivate(mockRoute, mockState);
      
      expect(result).toBe(true);
    });

    it('should allow navigation for foo account', () => {
      mockAccountService.getAccountId.and.returnValue('foo');
      
      const result = guard.canActivate(mockRoute, mockState);
      
      expect(result).toBe(true);
    });

    it('should allow navigation for bar account', () => {
      mockAccountService.getAccountId.and.returnValue('bar');
      
      const result = guard.canActivate(mockRoute, mockState);
      
      expect(result).toBe(true);
    });
  });

  // ============================================================================
  // ACCOUNT NOT FOUND TESTS
  // ============================================================================

  describe('canActivate - account not found', () => {
    beforeEach(() => {
      mockAccountService.isAccountNotFound.and.returnValue(true);
    });

    it('should return false when account not found', () => {
      mockAccountService.getAccountId.and.returnValue('missing');
      
      const result = guard.canActivate(mockRoute, mockState);
      
      expect(result).toBe(false);
    });

    it('should redirect to 404-A error page', () => {
      mockAccountService.getAccountId.and.returnValue('missing');
      
      guard.canActivate(mockRoute, mockState);
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/errors/404-account-not-found']);
    });

    it('should store account ID in session storage', () => {
      const accountId = 'missing-account';
      mockAccountService.getAccountId.and.returnValue(accountId);
      
      guard.canActivate(mockRoute, mockState);
      
      expect(sessionStorage.getItem('accountNotFoundId')).toBe(accountId);
    });

    it('should handle unknown account ID', () => {
      mockAccountService.getAccountId.and.returnValue('unknown-xyz');
      
      guard.canActivate(mockRoute, mockState);
      
      expect(mockRouter.navigate).toHaveBeenCalled();
      expect(sessionStorage.getItem('accountNotFoundId')).toBe('unknown-xyz');
    });

    it('should check isAccountNotFound first', () => {
      mockAccountService.getAccountId.and.returnValue('test');
      
      guard.canActivate(mockRoute, mockState);
      
      expect(mockAccountService.isAccountNotFound).toHaveBeenCalledBefore(
        mockAccountService.getAccountId as any
      );
    });
  });

  // ============================================================================
  // SESSION STORAGE TESTS
  // ============================================================================

  describe('session storage handling', () => {
    beforeEach(() => {
      mockAccountService.isAccountNotFound.and.returnValue(true);
    });

    it('should overwrite existing session storage value', () => {
      sessionStorage.setItem('accountNotFoundId', 'old-value');
      mockAccountService.getAccountId.and.returnValue('new-value');
      
      guard.canActivate(mockRoute, mockState);
      
      expect(sessionStorage.getItem('accountNotFoundId')).toBe('new-value');
    });

    it('should handle empty account ID', () => {
      mockAccountService.getAccountId.and.returnValue('');
      
      guard.canActivate(mockRoute, mockState);
      
      expect(sessionStorage.getItem('accountNotFoundId')).toBe('');
    });

    it('should handle special characters in account ID', () => {
      const specialId = 'account-with-dash_underscore.dot';
      mockAccountService.getAccountId.and.returnValue(specialId);
      
      guard.canActivate(mockRoute, mockState);
      
      expect(sessionStorage.getItem('accountNotFoundId')).toBe(specialId);
    });
  });

  // ============================================================================
  // EDGE CASES
  // ============================================================================

  describe('edge cases', () => {
    it('should handle multiple consecutive guard checks', () => {
      // First check: account not found
      mockAccountService.isAccountNotFound.and.returnValue(true);
      mockAccountService.getAccountId.and.returnValue('missing1');
      
      const result1 = guard.canActivate(mockRoute, mockState);
      expect(result1).toBe(false);
      
      // Second check: account valid
      mockAccountService.isAccountNotFound.and.returnValue(false);
      mockAccountService.getAccountId.and.returnValue('foo');
      
      const result2 = guard.canActivate(mockRoute, mockState);
      expect(result2).toBe(true);
    });

    it('should work with different route snapshots', () => {
      mockAccountService.isAccountNotFound.and.returnValue(false);
      mockAccountService.getAccountId.and.returnValue('foo');
      
      const route1 = { url: [{ path: 'foo' }] } as any;
      const route2 = { url: [{ path: 'bar' }] } as any;
      
      expect(guard.canActivate(route1, mockState)).toBe(true);
      expect(guard.canActivate(route2, mockState)).toBe(true);
    });

    it('should work with different state URLs', () => {
      mockAccountService.isAccountNotFound.and.returnValue(false);
      mockAccountService.getAccountId.and.returnValue('foo');
      
      const state1 = { url: '/foo/pages' } as RouterStateSnapshot;
      const state2 = { url: '/bar/dashboard' } as RouterStateSnapshot;
      
      expect(guard.canActivate(mockRoute, state1)).toBe(true);
      expect(guard.canActivate(mockRoute, state2)).toBe(true);
    });
  });

  // ============================================================================
  // INTEGRATION SCENARIOS
  // ============================================================================

  describe('integration scenarios', () => {
    it('should simulate user navigating to missing account', () => {
      // Scenario: User types /xyz/pages in URL
      // App initializes, detects 'xyz', fails to load config
      mockAccountService.isAccountNotFound.and.returnValue(true);
      mockAccountService.getAccountId.and.returnValue('xyz');
      
      // Router tries to activate route, guard runs
      const canNavigate = guard.canActivate(mockRoute, mockState);
      
      // Guard blocks navigation
      expect(canNavigate).toBe(false);
      
      // Guard redirects to error page
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/errors/404-account-not-found']);
      
      // Error page can retrieve account ID
      expect(sessionStorage.getItem('accountNotFoundId')).toBe('xyz');
    });

    it('should simulate user navigating to valid account', () => {
      // Scenario: User types /foo/pages in URL
      // App initializes, detects 'foo', loads config successfully
      mockAccountService.isAccountNotFound.and.returnValue(false);
      mockAccountService.getAccountId.and.returnValue('foo');
      
      // Router tries to activate route, guard runs
      const canNavigate = guard.canActivate(mockRoute, mockState);
      
      // Guard allows navigation
      expect(canNavigate).toBe(true);
      
      // No redirect
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      
      // No session storage set
      expect(sessionStorage.getItem('accountNotFoundId')).toBeNull();
    });
  });
});
