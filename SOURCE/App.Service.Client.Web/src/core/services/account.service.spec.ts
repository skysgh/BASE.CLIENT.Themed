/**
 * AccountService Tests (CORE TIER)
 * 
 * ✅ TIER ISOLATION: This test file only imports from core tier
 * 
 * Tests:
 * - Account loading from JSON files
 * - Account detection from URL
 * - Configuration value retrieval
 * - Observable state management
 * - Error handling
 */

import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

// ✅ CORE TIER IMPORTS ONLY
import { AccountService } from './account.service';
import { ServiceAccountService } from './service.account.service';
import { 
  setupCoreTestBed, 
  mockDefaultAccount, 
  mockFooAccount, 
  mockBarAccount 
} from '../testing/core-test-helpers';

describe('AccountService (Core Tier)', () => {
  let service: AccountService;
  let httpMock: HttpTestingController;
  let serviceAccountService: ServiceAccountService;

  beforeEach(() => {
    // ✅ Use core-specific test bed setup
    setupCoreTestBed([], {
      providers: [
        AccountService,
        {
          provide: ServiceAccountService,
          useValue: { setAccountGuid: jasmine.createSpy('setAccountGuid') }
        }
      ]
    });

    service = TestBed.inject(AccountService);
    httpMock = TestBed.inject(HttpTestingController);
    serviceAccountService = TestBed.inject(ServiceAccountService);
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

    it('should have getConfig method', () => {
      expect(service.getConfig).toBeDefined();
    });

    it('should have getCurrentConfig method', () => {
      expect(service.getCurrentConfig).toBeDefined();
    });

    it('should have loadAccountConfig method', () => {
      expect(service.loadAccountConfig).toBeDefined();
    });
  });

  // ============================================================================
  // URL DETECTION TESTS
  // ============================================================================

  describe('detectAccountIdentifierFromUrl', () => {
    it('should detect account from path', () => {
      const accountId = service.detectAccountIdentifierFromUrl('http://localhost:4200/foo/pages');
      expect(accountId).toBe('foo');
    });

    it('should detect account from subdomain', () => {
      const accountId = service.detectAccountIdentifierFromUrl('http://foo.example.com/pages');
      expect(accountId).toBe('foo');
    });

    it('should return default for reserved routes', () => {
      const accountId = service.detectAccountIdentifierFromUrl('http://localhost:4200/pages/home');
      expect(accountId).toBe('default');
    });

    it('should return default for apps route', () => {
      const accountId = service.detectAccountIdentifierFromUrl('http://localhost:4200/apps/dashboard');
      expect(accountId).toBe('default');
    });

    it('should detect bar account', () => {
      const accountId = service.detectAccountIdentifierFromUrl('http://localhost:4200/bar/pages');
      expect(accountId).toBe('bar');
    });
  });

  // ============================================================================
  // ACCOUNT LOADING TESTS
  // ============================================================================

  describe('loadAccountConfig', () => {
    it('should load default account', async () => {
      const promise = service.loadAccountConfig('default');

      // Expect request for default config
      const req = httpMock.expectOne('/assets/core/data/accounts/default.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockDefaultAccount);

      await promise;

      const config = service.getCurrentConfig();
      expect(config?.accountId).toBe('default');
    });

    it('should load foo account', async () => {
      const promise = service.loadAccountConfig('foo');

      // First request: default config
      const req1 = httpMock.expectOne('/assets/core/data/accounts/default.json');
      req1.flush(mockDefaultAccount);

      // Second request: foo config
      const req2 = httpMock.expectOne('/assets/core/data/accounts/foo.json');
      req2.flush(mockFooAccount);

      await promise;

      const config = service.getCurrentConfig();
      expect(config?.accountId).toBe('foo');
      expect(config?.name).toBe('Foo Account');
    });

    it('should handle missing account config gracefully', async () => {
      const promise = service.loadAccountConfig('missing');

      // Default config loads
      const req1 = httpMock.expectOne('/assets/core/data/accounts/default.json');
      req1.flush(mockDefaultAccount);

      // Missing account config fails
      const req2 = httpMock.expectOne('/assets/core/data/accounts/missing.json');
      req2.flush('Not Found', { status: 404, statusText: 'Not Found' });

      await promise;

      const config = service.getCurrentConfig();
      expect(config?.accountId).toBe('missing');
      expect(config?._accountNotFound).toBe(true);
    });

    it('should set account GUID in ServiceAccountService', async () => {
      const promise = service.loadAccountConfig('foo');

      const req1 = httpMock.expectOne('/assets/core/data/accounts/default.json');
      req1.flush(mockDefaultAccount);

      const req2 = httpMock.expectOne('/assets/core/data/accounts/foo.json');
      req2.flush(mockFooAccount);

      await promise;

      expect(serviceAccountService.setAccountGuid).toHaveBeenCalledWith(mockFooAccount.accountGuid as string);
    });
  });

  // ============================================================================
  // CURRENT CONFIG TESTS
  // ============================================================================

  describe('getCurrentConfig', () => {
    it('should return null when no account loaded', () => {
      expect(service.getCurrentConfig()).toBeNull();
    });

    it('should return current config after loading', async () => {
      const promise = service.loadAccountConfig('foo');

      const req1 = httpMock.expectOne('/assets/core/data/accounts/default.json');
      req1.flush(mockDefaultAccount);

      const req2 = httpMock.expectOne('/assets/core/data/accounts/foo.json');
      req2.flush(mockFooAccount);

      await promise;

      const config = service.getCurrentConfig();
      expect(config).toBeTruthy();
      expect(config?.accountId).toBe('foo');
    });
  });

  // ============================================================================
  // CONFIGURATION VALUE TESTS
  // ============================================================================

  describe('getConfigValue', () => {
    beforeEach(async () => {
      // Load foo account for these tests
      const promise = service.loadAccountConfig('foo');

      const req1 = httpMock.expectOne('/assets/core/data/accounts/default.json');
      req1.flush(mockDefaultAccount);

      const req2 = httpMock.expectOne('/assets/core/data/accounts/foo.json');
      req2.flush(mockFooAccount);

      await promise;
    });

    it('should get top-level config value', (done) => {
      service.getConfigValue('name').subscribe(value => {
        expect(value).toBe('Foo Account');
        done();
      });
    });

    it('should get nested config value by path', (done) => {
      service.getConfigValue('branding.logo').subscribe(logo => {
        expect(logo).toBe('/assets/media/open/accounts/foo/logo-light.svg');
        done();
      });
    });

    it('should get deep nested config value', (done) => {
      service.getConfigValue('branding.theme.primaryColor').subscribe(color => {
        expect(color).toBe('#28a745');
        done();
      });
    });

    it('should return undefined for invalid path', (done) => {
      service.getConfigValue('invalid.path.here').subscribe(value => {
        expect(value).toBeUndefined();
        done();
      });
    });
  });

  // ============================================================================
  // OBSERVABLE STATE TESTS
  // ============================================================================

  describe('getConfig (observable)', () => {
    it('should emit config when loaded', (done) => {
      const promise = service.loadAccountConfig('foo');

      const req1 = httpMock.expectOne('/assets/core/data/accounts/default.json');
      req1.flush(mockDefaultAccount);

      const req2 = httpMock.expectOne('/assets/core/data/accounts/foo.json');
      req2.flush(mockFooAccount);

      promise.then(() => {
        service.getConfig().subscribe(config => {
          expect(config.accountId).toBe('foo');
          done();
        });
      });
    });

    it('should throw error when not initialized', (done) => {
      service.getConfig().subscribe(
        () => {
          fail('Should have thrown error');
        },
        (error: Error) => {
          expect(error.message).toContain('not initialized');
          done();
        }
      );
    });
  });

  // ============================================================================
  // ACCOUNT ID TESTS
  // ============================================================================

  describe('getAccountId', () => {
    it('should return default initially', () => {
      expect(service.getAccountId()).toBe('default');
    });

    it('should return current account ID after loading', async () => {
      const promise = service.loadAccountConfig('foo');

      const req1 = httpMock.expectOne('/assets/core/data/accounts/default.json');
      req1.flush(mockDefaultAccount);

      const req2 = httpMock.expectOne('/assets/core/data/accounts/foo.json');
      req2.flush(mockFooAccount);

      await promise;

      expect(service.getAccountId()).toBe('foo');
    });
  });

  // ============================================================================
  // ACCOUNT NOT FOUND TESTS
  // ============================================================================

  describe('isAccountNotFound', () => {
    it('should return false when account found', async () => {
      const promise = service.loadAccountConfig('foo');

      const req1 = httpMock.expectOne('/assets/core/data/accounts/default.json');
      req1.flush(mockDefaultAccount);

      const req2 = httpMock.expectOne('/assets/core/data/accounts/foo.json');
      req2.flush(mockFooAccount);

      await promise;

      expect(service.isAccountNotFound()).toBe(false);
    });

    it('should return true when account not found', async () => {
      const promise = service.loadAccountConfig('missing');

      const req1 = httpMock.expectOne('/assets/core/data/accounts/default.json');
      req1.flush(mockDefaultAccount);

      const req2 = httpMock.expectOne('/assets/core/data/accounts/missing.json');
      req2.flush('Not Found', { status: 404, statusText: 'Not Found' });

      await promise;

      expect(service.isAccountNotFound()).toBe(true);
    });
  });

  // ============================================================================
  // ERROR HANDLING TESTS
  // ============================================================================

  describe('error handling', () => {
    it('should handle HTTP 404 errors', async () => {
      const promise = service.loadAccountConfig('missing');

      const req1 = httpMock.expectOne('/assets/core/data/accounts/default.json');
      req1.flush(mockDefaultAccount);

      const req2 = httpMock.expectOne('/assets/core/data/accounts/missing.json');
      req2.flush('Not Found', { status: 404, statusText: 'Not Found' });

      await promise;

      const config = service.getCurrentConfig();
      expect(config?._accountNotFound).toBe(true);
    });

    it('should fallback to default on error', async () => {
      const promise = service.loadAccountConfig('error');

      const req1 = httpMock.expectOne('/assets/core/data/accounts/default.json');
      req1.flush('Invalid JSON', { status: 500, statusText: 'Server Error' });

      await promise;

      const config = service.getCurrentConfig();
      expect(config?.accountId).toBe('error');
    });
  });
});
