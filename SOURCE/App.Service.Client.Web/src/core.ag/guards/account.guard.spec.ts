/**
 * AccountGuard Tests (CORE.AG TIER)
 * 
 * ✅ LOCATION: core.ag (Angular-specific)
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

// ✅ CORE.AG IMPORTS
import { AccountGuard } from './account.guard';

// ✅ CORE TIER IMPORTS (Angular-agnostic services)
import { AccountService } from '../../core/services/account.service';
import { setupCoreTestBed } from '../../core/testing/core-test-helpers';

describe('AccountGuard (Core.Ag Tier)', () => {
  let guard: AccountGuard;
  let mockAccountService: jasmine.SpyObj<AccountService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    mockAccountService = jasmine.createSpyObj('AccountService', [
      'isAccountNotFound',
      'getAccountId'
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    setupCoreTestBed([], {
      providers: [
        AccountGuard,
        { provide: AccountService, useValue: mockAccountService },
        { provide: Router, useValue: mockRouter }
      ]
    });

    guard = TestBed.inject(AccountGuard);
    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/foo/pages' } as RouterStateSnapshot;
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
  });

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
  });

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
  });

  describe('integration scenarios', () => {
    it('should simulate user navigating to missing account', () => {
      mockAccountService.isAccountNotFound.and.returnValue(true);
      mockAccountService.getAccountId.and.returnValue('xyz');
      
      const canNavigate = guard.canActivate(mockRoute, mockState);
      
      expect(canNavigate).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/errors/404-account-not-found']);
      expect(sessionStorage.getItem('accountNotFoundId')).toBe('xyz');
    });

    it('should simulate user navigating to valid account', () => {
      mockAccountService.isAccountNotFound.and.returnValue(false);
      mockAccountService.getAccountId.and.returnValue('foo');
      
      const canNavigate = guard.canActivate(mockRoute, mockState);
      
      expect(canNavigate).toBe(true);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      expect(sessionStorage.getItem('accountNotFoundId')).toBeNull();
    });
  });
});
