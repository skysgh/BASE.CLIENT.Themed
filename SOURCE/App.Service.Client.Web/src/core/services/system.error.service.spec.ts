/**
 * SystemErrorService Tests (CORE TIER)
 * 
 * ✅ TIER ISOLATION: This test file only imports from core tier
 * 
 * Tests:
 * - Error reporting (client-side errors)
 * - Error reporting (server-side errors)
 * - Error message formatting
 * - Integration with diagnostics trace service
 */

import { TestBed } from '@angular/core/testing';

// ✅ CORE TIER IMPORTS ONLY
import { SystemErrorService } from './system.error.service';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
import { setupCoreTestBed } from '../testing/core-test-helpers';

describe('SystemErrorService (Core Tier)', () => {
  let service: SystemErrorService;
  let mockDiagnosticsService: jasmine.SpyObj<SystemDiagnosticsTraceService>;

  beforeEach(() => {
    // Create spy for diagnostics service
    mockDiagnosticsService = jasmine.createSpyObj('SystemDiagnosticsTraceService', [
      'debug',
      'error'
    ]);

    // Setup test bed
    setupCoreTestBed([], {
      providers: [
        SystemErrorService,
        { provide: SystemDiagnosticsTraceService, useValue: mockDiagnosticsService }
      ]
    });

    service = TestBed.inject(SystemErrorService);
  });

  // ============================================================================
  // BASIC TESTS
  // ============================================================================

  describe('service creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should call diagnostics service on construction', () => {
      expect(mockDiagnosticsService.debug).toHaveBeenCalledWith(
        jasmine.stringContaining('SystemErrorService.constructor')
      );
    });

    it('should have report method', () => {
      expect(service.report).toBeDefined();
    });
  });

  // ============================================================================
  // CLIENT-SIDE ERROR TESTS
  // ============================================================================

  describe('report() - client-side errors', () => {
    it('should handle ErrorEvent (client-side)', () => {
      const clientError = {
        error: new ErrorEvent('network error', {
          message: 'Network connection lost'
        })
      };

      const result = service.report(clientError);

      expect(result).toBe('Network connection lost');
      expect(mockDiagnosticsService.error).toHaveBeenCalledWith('Network connection lost');
    });

    it('should extract message from ErrorEvent', () => {
      const clientError = {
        error: new ErrorEvent('error', {
          message: 'Failed to fetch data'
        })
      };

      service.report(clientError);

      expect(mockDiagnosticsService.error).toHaveBeenCalledWith('Failed to fetch data');
    });

    it('should handle empty ErrorEvent message', () => {
      const clientError = {
        error: new ErrorEvent('error', {
          message: ''
        })
      };

      const result = service.report(clientError);

      expect(result).toBe('');
    });

    it('should handle ErrorEvent with special characters', () => {
      const clientError = {
        error: new ErrorEvent('error', {
          message: 'Error: Connection failed (timeout: 5000ms)'
        })
      };

      const result = service.report(clientError);

      expect(result).toContain('Connection failed');
      expect(result).toContain('5000ms');
    });
  });

  // ============================================================================
  // SERVER-SIDE ERROR TESTS
  // ============================================================================

  describe('report() - server-side errors', () => {
    it('should handle HTTP 404 error', () => {
      const serverError = {
        status: 404,
        message: 'Not Found',
        error: {} // Not an ErrorEvent
      };

      const result = service.report(serverError);

      expect(result).toContain('Error Code: 404');
      expect(result).toContain('Message: Not Found');
    });

    it('should handle HTTP 500 error', () => {
      const serverError = {
        status: 500,
        message: 'Internal Server Error',
        error: {}
      };

      const result = service.report(serverError);

      expect(result).toContain('Error Code: 500');
      expect(result).toContain('Internal Server Error');
    });

    it('should handle HTTP 401 unauthorized', () => {
      const serverError = {
        status: 401,
        message: 'Unauthorized',
        error: {}
      };

      service.report(serverError);

      expect(mockDiagnosticsService.error).toHaveBeenCalledWith(
        jasmine.stringContaining('401')
      );
      expect(mockDiagnosticsService.error).toHaveBeenCalledWith(
        jasmine.stringContaining('Unauthorized')
      );
    });

    it('should handle HTTP 403 forbidden', () => {
      const serverError = {
        status: 403,
        message: 'Forbidden: Insufficient permissions',
        error: {}
      };

      const result = service.report(serverError);

      expect(result).toContain('403');
      expect(result).toContain('Insufficient permissions');
    });

    it('should format server error message', () => {
      const serverError = {
        status: 503,
        message: 'Service Unavailable',
        error: {}
      };

      const result = service.report(serverError);

      expect(result).toMatch(/Error Code: \d+\nMessage: .+/);
    });
  });

  // ============================================================================
  // ERROR MESSAGE FORMATTING TESTS
  // ============================================================================

  describe('error message formatting', () => {
    it('should return formatted string for client error', () => {
      const error = {
        error: new ErrorEvent('error', { message: 'Test error' })
      };

      const result = service.report(error);

      expect(typeof result).toBe('string');
      expect(result).toBe('Test error');
    });

    it('should return formatted string for server error', () => {
      const error = {
        status: 404,
        message: 'Not Found',
        error: {}
      };

      const result = service.report(error);

      expect(typeof result).toBe('string');
      expect(result).toContain('Error Code');
      expect(result).toContain('\n');
    });

    it('should handle multiline error messages', () => {
      const error = {
        status: 400,
        message: 'Bad Request\nInvalid parameter: userId',
        error: {}
      };

      const result = service.report(error);

      expect(result).toContain('Bad Request');
      expect(result).toContain('Invalid parameter');
    });
  });

  // ============================================================================
  // DIAGNOSTICS INTEGRATION TESTS
  // ============================================================================

  describe('diagnostics service integration', () => {
    it('should call diagnostics.error() for client errors', () => {
      const error = {
        error: new ErrorEvent('error', { message: 'Client error' })
      };

      service.report(error);

      expect(mockDiagnosticsService.error).toHaveBeenCalledTimes(1);
      expect(mockDiagnosticsService.error).toHaveBeenCalledWith('Client error');
    });

    it('should call diagnostics.error() for server errors', () => {
      const error = {
        status: 500,
        message: 'Server error',
        error: {}
      };

      service.report(error);

      expect(mockDiagnosticsService.error).toHaveBeenCalledTimes(1);
    });

    it('should pass full error message to diagnostics', () => {
      const error = {
        status: 404,
        message: 'Resource not found',
        error: {}
      };

      service.report(error);

      const errorMessage = mockDiagnosticsService.error.calls.argsFor(0)[0];
      expect(errorMessage).toContain('404');
      expect(errorMessage).toContain('Resource not found');
    });
  });

  // ============================================================================
  // EDGE CASES
  // ============================================================================

  describe('edge cases', () => {
    it('should handle error with missing status', () => {
      const error = {
        message: 'Unknown error',
        error: {}
      };

      const result = service.report(error);

      expect(result).toContain('Error Code: undefined');
    });

    it('should handle error with missing message', () => {
      const error = {
        status: 500,
        error: {}
      };

      const result = service.report(error);

      expect(result).toContain('Message: undefined');
    });

    it('should handle null error', () => {
      const result = service.report(null);

      // Should not throw, should handle gracefully
      expect(typeof result).toBe('string');
    });

    it('should handle undefined error', () => {
      const result = service.report(undefined);

      // Should not throw, should handle gracefully
      expect(typeof result).toBe('string');
    });

    it('should handle error with status 0 (network failure)', () => {
      const error = {
        status: 0,
        message: 'Network connection failed',
        error: {}
      };

      const result = service.report(error);

      expect(result).toContain('Error Code: 0');
      expect(result).toContain('Network connection failed');
    });

    it('should handle very long error messages', () => {
      const longMessage = 'Error: ' + 'x'.repeat(5000);
      const error = {
        status: 500,
        message: longMessage,
        error: {}
      };

      const result = service.report(error);

      expect(result).toContain(longMessage);
      expect(mockDiagnosticsService.error).toHaveBeenCalled();
    });
  });

  // ============================================================================
  // INTEGRATION SCENARIOS
  // ============================================================================

  describe('integration scenarios', () => {
    it('should simulate HTTP request failure', () => {
      const httpError = {
        status: 404,
        message: 'Http failure response for /api/users/123: 404 Not Found',
        error: {}
      };

      const result = service.report(httpError);

      expect(result).toContain('404');
      expect(mockDiagnosticsService.error).toHaveBeenCalled();
    });

    it('should simulate network timeout', () => {
      const timeoutError = {
        error: new ErrorEvent('error', {
          message: 'Timeout of 30000ms exceeded'
        })
      };

      const result = service.report(timeoutError);

      expect(result).toContain('Timeout');
      expect(result).toContain('30000ms');
    });

    it('should simulate CORS error', () => {
      const corsError = {
        error: new ErrorEvent('error', {
          message: 'CORS error: Request blocked by CORS policy'
        })
      };

      const result = service.report(corsError);

      expect(result).toContain('CORS');
    });

    it('should handle multiple errors in sequence', () => {
      service.report({ error: new ErrorEvent('error', { message: 'Error 1' }) });
      service.report({ status: 500, message: 'Error 2', error: {} });
      service.report({ error: new ErrorEvent('error', { message: 'Error 3' }) });

      expect(mockDiagnosticsService.error).toHaveBeenCalledTimes(3);
    });
  });
});
