/**
 * AccountService Tests (CORE TIER)
 * 
 * ✅ TIER ISOLATION: This test file only imports from core tier
 * 
 * Tests:
 * - Account loading from JSON files
 * - Multi-account switching
 * - Configuration value retrieval
 * - Observable state management
 * - Error handling
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

// ✅ CORE TIER IMPORTS ONLY
import { AccountService } from './account.service';
import { 
  setupCoreTestBed, 
  mockDefaultAccount, 
  mockFooAccount, 
  mockBarAccount 
} from '../testing/core-test-helpers';

describe('AccountService (Core Tier)', () => {
  let service: AccountService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // ✅ Use core-specific test bed setup
    setupCoreTestBed([], {
      providers: [AccountService]
    });

    service = TestBed.inject(AccountService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify no outstanding HTTP requests
    httpMock.verify();
  });

  // ============================================================================
  // BASIC TESTS
  // ============================================================================

  describe('service creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have currentAccount$ observable', () => {
      expect(service.currentAccount$).toBeDefined();
    });

    it('should initially have no account loaded', () => {
      expect(service.getCurrentAccount()).toBeNull();
    });
  });

  // ============================================================================
  // ACCOUNT LOADING TESTS
  // ============================================================================

  describe('loadAccountBySubdomain', () => {
    it('should load default account for empty subdomain', (done) => {
      service.loadAccountBySubdomain('').subscribe(account => {
        expect(account).toEqual(mockDefaultAccount);
        expect(account.subdomain).toBe('default');
        done();
      });

      const req = httpMock.expectOne('/assets/data/accounts/default.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockDefaultAccount);
    });

    it('should load foo account for "foo" subdomain', (done) => {
      service.loadAccountBySubdomain('foo').subscribe(account => {
        expect(account).toEqual(mockFooAccount);
        expect(account.subdomain).toBe('foo');
        expect(account.name).toBe('Foo Account');
        done();
      });

      const req = httpMock.expectOne('/assets/data/accounts/foo.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockFooAccount);
    });

    it('should load bar account for "bar" subdomain', (done) => {
      service.loadAccountBySubdomain('bar').subscribe(account => {
        expect(account).toEqual(mockBarAccount);
        expect(account.subdomain).toBe('bar');
        expect(account.name).toBe('Bar Account');
        done();
      });

      const req = httpMock.expectOne('/assets/data/accounts/bar.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockBarAccount);
    });

    it('should fallback to default for unknown subdomain', (done) => {
      service.loadAccountBySubdomain('unknown').subscribe(account => {
        // First request fails, then fallback to default succeeds
        expect(account).toEqual(mockDefaultAccount);
        expect(account.subdomain).toBe('default');
        done();
      });

      // First request for 'unknown' fails
      const req1 = httpMock.expectOne('/assets/data/accounts/unknown.json');
      req1.flush('Not Found', { status: 404, statusText: 'Not Found' });

      // Fallback request for 'default' succeeds
      const req2 = httpMock.expectOne('/assets/data/accounts/default.json');
      req2.flush(mockDefaultAccount);
    });

    it('should handle JSON parse errors gracefully', (done) => {
      service.loadAccountBySubdomain('invalid').subscribe(
        account => {
          // Should fallback to default on error
          expect(account).toEqual(mockDefaultAccount);
          done();
        },
        error => {
          fail('Should not error, should fallback to default');
        }
      );

      // Invalid JSON response
      const req1 = httpMock.expectOne('/assets/data/accounts/invalid.json');
      req1.flush('{ invalid json }', { status: 200, statusText: 'OK' });

      // Fallback to default
      const req2 = httpMock.expectOne('/assets/data/accounts/default.json');
      req2.flush(mockDefaultAccount);
    });
  });

  // ============================================================================
  // CURRENT ACCOUNT TESTS
  // ============================================================================

  describe('getCurrentAccount', () => {
    it('should return null when no account loaded', () => {
      expect(service.getCurrentAccount()).toBeNull();
    });

    it('should return current account after loading', (done) => {
      service.loadAccountBySubdomain('foo').subscribe(() => {
        const current = service.getCurrentAccount();
        expect(current).toEqual(mockFooAccount);
        expect(current?.subdomain).toBe('foo');
        done();
      });

      const req = httpMock.expectOne('/assets/data/accounts/foo.json');
      req.flush(mockFooAccount);
    });
  });

  // ============================================================================
  // CONFIGURATION VALUE TESTS
  // ============================================================================

  describe('getConfigValue', () => {
    beforeEach((done) => {
      // Load foo account for these tests
      service.loadAccountBySubdomain('foo').subscribe(() => done());
      const req = httpMock.expectOne('/assets/data/accounts/foo.json');
      req.flush(mockFooAccount);
    });

    it('should get top-level config value', () => {
      const value = service.getConfigValue('name');
      expect(value).toBe('Foo Account');
    });

    it('should get nested config value by path', () => {
      const logo = service.getConfigValue('branding.logo.light');
      expect(logo).toBe('/assets/media/open/accounts/foo/logo-light.svg');
    });

    it('should get deep nested config value', () => {
      const primary = service.getConfigValue('branding.colors.primary');
      expect(primary).toBe('#28a745');
    });

    it('should return undefined for invalid path', () => {
      const value = service.getConfigValue('invalid.path.here');
      expect(value).toBeUndefined();
    });

    it('should handle null account gracefully', () => {
      // Create new service instance (no account loaded)
      const newService = new AccountService(TestBed.inject(HttpClientTestingModule) as any);
      const value = newService.getConfigValue('name');
      expect(value).toBeUndefined();
    });

    it('should return undefined for partial invalid path', () => {
      const value = service.getConfigValue('branding.invalid.path');
      expect(value).toBeUndefined();
    });
  });

  // ============================================================================
  // OBSERVABLE STATE TESTS
  // ============================================================================

  describe('currentAccount$ observable', () => {
    it('should emit null initially', (done) => {
      service.currentAccount$.subscribe(account => {
        expect(account).toBeNull();
        done();
      });
    });

    it('should emit when account loads', (done) => {
      let emitCount = 0;
      
      service.currentAccount$.subscribe(account => {
        emitCount++;
        
        if (emitCount === 1) {
          // First emit: null (initial)
          expect(account).toBeNull();
        } else if (emitCount === 2) {
          // Second emit: foo account loaded
          expect(account).toEqual(mockFooAccount);
          done();
        }
      });

      // Load account (triggers second emit)
      service.loadAccountBySubdomain('foo').subscribe();
      const req = httpMock.expectOne('/assets/data/accounts/foo.json');
      req.flush(mockFooAccount);
    });

    it('should emit when account switches', (done) => {
      let emitCount = 0;
      const emissions: any[] = [];
      
      service.currentAccount$.subscribe(account => {
        emissions.push(account);
        emitCount++;
        
        if (emitCount === 3) {
          // First emit: null
          expect(emissions[0]).toBeNull();
          // Second emit: foo account
          expect(emissions[1]?.subdomain).toBe('foo');
          // Third emit: bar account
          expect(emissions[2]?.subdomain).toBe('bar');
          done();
        }
      });

      // Load foo account
      service.loadAccountBySubdomain('foo').subscribe(() => {
        // Then load bar account
        service.loadAccountBySubdomain('bar').subscribe();
        const req2 = httpMock.expectOne('/assets/data/accounts/bar.json');
        req2.flush(mockBarAccount);
      });
      
      const req1 = httpMock.expectOne('/assets/data/accounts/foo.json');
      req1.flush(mockFooAccount);
    });
  });

  // ============================================================================
  // ERROR HANDLING TESTS
  // ============================================================================

  describe('error handling', () => {
    it('should handle HTTP 404 errors', (done) => {
      service.loadAccountBySubdomain('missing').subscribe(account => {
        // Should fallback to default
        expect(account).toEqual(mockDefaultAccount);
        done();
      });

      const req1 = httpMock.expectOne('/assets/data/accounts/missing.json');
      req1.flush('Not Found', { status: 404, statusText: 'Not Found' });

      const req2 = httpMock.expectOne('/assets/data/accounts/default.json');
      req2.flush(mockDefaultAccount);
    });

    it('should handle HTTP 500 errors', (done) => {
      service.loadAccountBySubdomain('error').subscribe(account => {
        // Should fallback to default
        expect(account).toEqual(mockDefaultAccount);
        done();
      });

      const req1 = httpMock.expectOne('/assets/data/accounts/error.json');
      req1.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

      const req2 = httpMock.expectOne('/assets/data/accounts/default.json');
      req2.flush(mockDefaultAccount);
    });

    it('should handle network errors', (done) => {
      service.loadAccountBySubdomain('network').subscribe(account => {
        // Should fallback to default
        expect(account).toEqual(mockDefaultAccount);
        done();
      });

      const req1 = httpMock.expectOne('/assets/data/accounts/network.json');
      req1.error(new ErrorEvent('Network error'));

      const req2 = httpMock.expectOne('/assets/data/accounts/default.json');
      req2.flush(mockDefaultAccount);
    });
  });

  // ============================================================================
  // EDGE CASES
  // ============================================================================

  describe('edge cases', () => {
    it('should handle subdomain with special characters', (done) => {
      service.loadAccountBySubdomain('foo-bar_123').subscribe(account => {
        expect(account).toEqual(mockDefaultAccount);
        done();
      });

      const req1 = httpMock.expectOne('/assets/data/accounts/foo-bar_123.json');
      req1.flush('Not Found', { status: 404, statusText: 'Not Found' });

      const req2 = httpMock.expectOne('/assets/data/accounts/default.json');
      req2.flush(mockDefaultAccount);
    });

    it('should handle very long subdomain', (done) => {
      const longSubdomain = 'a'.repeat(100);
      service.loadAccountBySubdomain(longSubdomain).subscribe(account => {
        expect(account).toEqual(mockDefaultAccount);
        done();
      });

      const req1 = httpMock.expectOne(`/assets/data/accounts/${longSubdomain}.json`);
      req1.flush('Not Found', { status: 404, statusText: 'Not Found' });

      const req2 = httpMock.expectOne('/assets/data/accounts/default.json');
      req2.flush(mockDefaultAccount);
    });

    it('should handle null subdomain as empty string', (done) => {
      service.loadAccountBySubdomain(null as any).subscribe(account => {
        expect(account).toEqual(mockDefaultAccount);
        done();
      });

      const req = httpMock.expectOne('/assets/data/accounts/default.json');
      req.flush(mockDefaultAccount);
    });
  });
});
