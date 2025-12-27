/**
 * SystemDiagnosticsTraceService Tests (CORE TIER)
 * 
 * ✅ TIER ISOLATION: This test file only imports from core tier
 * 
 * Tests:
 * - Logging at different levels (debug, verbose, info, warn, error)
 * - Debug level filtering
 * - Message formatting (strings, objects, errors, null/undefined)
 * - Log queue management (max 50 entries)
 * - Observable log stream
 * - Console output verification
 */

import { TestBed } from '@angular/core/testing';

// ✅ CORE TIER IMPORTS ONLY
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
import { SystemEnvironmentService } from './system.environment.service';
import { setupCoreTestBed } from '../testing/core-test-helpers';

describe('SystemDiagnosticsTraceService (Core Tier)', () => {
  let service: SystemDiagnosticsTraceService;
  let mockEnvironmentService: jasmine.SpyObj<SystemEnvironmentService>;
  let consoleLogSpy: jasmine.Spy;
  let consoleWarnSpy: jasmine.Spy;
  let consoleErrorSpy: jasmine.Spy;

  beforeEach(() => {
    // Create spy for environment service
    mockEnvironmentService = jasmine.createSpyObj('SystemEnvironmentService', ['getDebugLevel']);
    mockEnvironmentService.getDebugLevel.and.returnValue(5); // Verbose by default

    // Spy on console methods
    consoleLogSpy = spyOn(console, 'log');
    consoleWarnSpy = spyOn(console, 'warn');
    consoleErrorSpy = spyOn(console, 'error');

    // Setup test bed
    setupCoreTestBed([], {
      providers: [
        SystemDiagnosticsTraceService,
        { provide: SystemEnvironmentService, useValue: mockEnvironmentService }
      ]
    });

    service = TestBed.inject(SystemDiagnosticsTraceService);
  });

  // ============================================================================
  // BASIC TESTS
  // ============================================================================

  describe('service creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize debug level from environment service', () => {
      expect(mockEnvironmentService.getDebugLevel).toHaveBeenCalled();
      expect(service.debugLevel).toBe(5);
    });

    it('should have empty log queue initially', () => {
      expect(service.log).toEqual([]);
    });

    it('should have default log length of 50', () => {
      expect(service.logLength).toBe(50);
    });
  });

  // ============================================================================
  // DEBUG LEVEL TESTS
  // ============================================================================

  describe('debug() - level 5', () => {
    it('should log when debug level is 5', () => {
      service.debugLevel = 5;
      service.debug('test message');
      
      expect(service.log.length).toBe(1);
      expect(service.log[0]).toContain('DEBUG');
      expect(service.log[0]).toContain('test message');
    });

    it('should NOT log when debug level is 4', () => {
      service.debugLevel = 4;
      service.debug('test message');
      
      expect(service.log.length).toBe(0);
    });

    it('should call console.log', () => {
      service.debug('test message');
      
      expect(consoleLogSpy).toHaveBeenCalledWith(jasmine.stringContaining('DEBUG'));
      expect(consoleLogSpy).toHaveBeenCalledWith(jasmine.stringContaining('test message'));
    });
  });

  describe('verbose() - level 4', () => {
    it('should log when debug level is 4 or higher', () => {
      service.debugLevel = 4;
      service.verbose('verbose message');
      
      expect(service.log.length).toBe(1);
      expect(service.log[0]).toContain('VERBOSE');
    });

    it('should NOT log when debug level is 3', () => {
      service.debugLevel = 3;
      service.verbose('verbose message');
      
      expect(service.log.length).toBe(0);
    });

    it('should call console.log', () => {
      service.verbose('verbose message');
      
      expect(consoleLogSpy).toHaveBeenCalledWith(jasmine.stringContaining('VERBOSE'));
    });
  });

  describe('info() - level 3', () => {
    it('should log when debug level is 3 or higher', () => {
      service.debugLevel = 3;
      service.info('info message');
      
      expect(service.log.length).toBe(1);
      expect(service.log[0]).toContain('INFO');
    });

    it('should NOT log when debug level is 2', () => {
      service.debugLevel = 2;
      service.info('info message');
      
      expect(service.log.length).toBe(0);
    });

    it('should call console.log', () => {
      service.info('info message');
      
      expect(consoleLogSpy).toHaveBeenCalledWith(jasmine.stringContaining('INFO'));
    });
  });

  describe('warn() - level 2', () => {
    it('should log when debug level is 2 or higher', () => {
      service.debugLevel = 2;
      service.warn('warning message');
      
      expect(service.log.length).toBe(1);
      expect(service.log[0]).toContain('WARN');
    });

    it('should NOT log when debug level is 1', () => {
      service.debugLevel = 1;
      service.warn('warning message');
      
      expect(service.log.length).toBe(0);
    });

    it('should call console.warn', () => {
      service.warn('warning message');
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(jasmine.stringContaining('WARN'));
    });
  });

  describe('error() - level 1', () => {
    it('should log when debug level is 1 or higher', () => {
      service.debugLevel = 1;
      service.error('error message');
      
      expect(service.log.length).toBe(1);
      expect(service.log[0]).toContain('ERROR');
    });

    it('should NOT log when debug level is 0', () => {
      service.debugLevel = 0;
      service.error('error message');
      
      expect(service.log.length).toBe(0);
    });

    it('should call console.error', () => {
      service.error('error message');
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(jasmine.stringContaining('ERROR'));
    });
  });

  // ============================================================================
  // MESSAGE FORMATTING TESTS
  // ============================================================================

  describe('message formatting', () => {
    it('should format string messages', () => {
      service.debug('simple string');
      
      expect(service.log[0]).toContain('simple string');
    });

    it('should format number messages', () => {
      service.debug(42);
      
      expect(service.log[0]).toContain('42');
    });

    it('should format boolean messages', () => {
      service.debug(true);
      
      expect(service.log[0]).toContain('true');
    });

    it('should format null messages', () => {
      service.debug(null);
      
      expect(service.log[0]).toContain('null');
    });

    it('should format undefined messages', () => {
      service.debug(undefined);
      
      expect(service.log[0]).toContain('undefined');
    });

    it('should format object messages as JSON', () => {
      service.debug({ key: 'value', number: 123 });
      
      expect(service.log[0]).toContain('key');
      expect(service.log[0]).toContain('value');
    });

    it('should format array messages as JSON', () => {
      service.debug([1, 2, 3, 'test']);
      
      expect(service.log[0]).toContain('1');
      expect(service.log[0]).toContain('test');
    });

    it('should format Error objects', () => {
      const error = new Error('Test error message');
      service.error(error);
      
      expect(service.log[0]).toContain('Test error message');
    });

    it('should handle circular references gracefully', () => {
      const circular: any = { name: 'test' };
      circular.self = circular;
      
      service.debug(circular);
      
      // Should not throw, should log something
      expect(service.log.length).toBe(1);
    });
  });

  // ============================================================================
  // LOG QUEUE MANAGEMENT TESTS
  // ============================================================================

  describe('log queue management', () => {
    it('should add messages to log queue', () => {
      service.debug('message 1');
      service.info('message 2');
      service.warn('message 3');
      
      expect(service.log.length).toBe(3);
    });

    it('should maintain max 50 entries', () => {
      // Add 60 messages
      for (let i = 0; i < 60; i++) {
        service.debug(`message ${i}`);
      }
      
      expect(service.log.length).toBe(50);
    });

    it('should remove oldest entries when exceeding 50', () => {
      // Add 60 messages
      for (let i = 0; i < 60; i++) {
        service.debug(`message ${i}`);
      }
      
      // First 10 messages should be gone
      expect(service.log[0]).not.toContain('message 0');
      expect(service.log[0]).toContain('message 10');
      
      // Last message should still be there
      expect(service.log[49]).toContain('message 59');
    });

    it('should handle custom log length', () => {
      service.logLength = 5;
      
      // Add 10 messages
      for (let i = 0; i < 10; i++) {
        service.debug(`message ${i}`);
      }
      
      expect(service.log.length).toBe(5);
      expect(service.log[0]).toContain('message 5');
      expect(service.log[4]).toContain('message 9');
    });
  });

  // ============================================================================
  // OBSERVABLE LOG STREAM TESTS
  // ============================================================================

  describe('getLog() observable', () => {
    it('should emit log updates', (done) => {
      let emitCount = 0;
      
      service.getLog().subscribe(log => {
        emitCount++;
        
        if (emitCount === 1) {
          // Initial emit: empty
          expect(log).toEqual([]);
        } else if (emitCount === 2) {
          // After first message
          expect(log.length).toBe(1);
          done();
        }
      });
      
      service.debug('test message');
    });

    it('should emit latest log state', (done) => {
      service.debug('message 1');
      service.info('message 2');
      
      service.getLog().subscribe(log => {
        expect(log.length).toBe(2);
        done();
      });
    });

    it('should emit when log queue is trimmed', (done) => {
      service.logLength = 2;
      
      let emissions = 0;
      service.getLog().subscribe(log => {
        emissions++;
        
        if (emissions === 4) {
          // After 3 messages (2 max + 1 trimmed)
          expect(log.length).toBe(2);
          expect(log[0]).toContain('message 1');
          expect(log[1]).toContain('message 2');
          done();
        }
      });
      
      service.debug('message 0');
      service.debug('message 1');
      service.debug('message 2');
    });
  });

  // ============================================================================
  // INTEGRATION SCENARIOS
  // ============================================================================

  describe('integration scenarios', () => {
    it('should simulate typical debugging session', () => {
      service.debug('Application starting...');
      service.info('Loading configuration...');
      service.verbose('Config: { debug: true }');
      service.info('Configuration loaded');
      service.warn('Deprecated API used');
      service.error('Failed to connect to server');
      
      expect(service.log.length).toBe(6);
      expect(service.log[0]).toContain('Application starting');
      expect(service.log[5]).toContain('Failed to connect');
    });

    it('should filter by debug level in production', () => {
      service.debugLevel = 2; // Warn and Error only
      
      service.debug('Debug message'); // Skipped
      service.verbose('Verbose message'); // Skipped
      service.info('Info message'); // Skipped
      service.warn('Warning message'); // Logged
      service.error('Error message'); // Logged
      
      expect(service.log.length).toBe(2);
      expect(service.log[0]).toContain('Warning');
      expect(service.log[1]).toContain('Error');
    });

    it('should handle rapid logging', () => {
      for (let i = 0; i < 100; i++) {
        service.debug(`Rapid message ${i}`);
      }
      
      expect(service.log.length).toBe(50);
      expect(service.log[0]).toContain('message 50');
      expect(service.log[49]).toContain('message 99');
    });
  });

  // ============================================================================
  // EDGE CASES
  // ============================================================================

  describe('edge cases', () => {
    it('should handle empty string', () => {
      service.debug('');
      
      expect(service.log.length).toBe(1);
    });

    it('should handle very long messages', () => {
      const longMessage = 'a'.repeat(10000);
      service.debug(longMessage);
      
      expect(service.log[0]).toContain(longMessage);
    });

    it('should handle special characters', () => {
      service.debug('Message with 你好 こんにちは مرحبا');
      
      expect(service.log[0]).toContain('你好');
    });

    it('should handle multiple log level changes', () => {
      service.debugLevel = 5;
      service.debug('Level 5 message');
      
      service.debugLevel = 3;
      service.debug('Should not appear');
      service.info('Level 3 message');
      
      service.debugLevel = 1;
      service.info('Should not appear');
      service.error('Level 1 message');
      
      expect(service.log.length).toBe(3);
    });
  });
});
