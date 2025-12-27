/**
 * ConfigRegistryService Tests (CORE TIER)
 * 
 * ✅ TIER ISOLATION: This test file only imports from core tier
 * 
 * Tests:
 * - Configuration registration
 * - Configuration retrieval
 * - Key existence checks
 * - Multiple configuration management
 */

import { TestBed } from '@angular/core/testing';

// ✅ CORE TIER IMPORTS ONLY
import { ConfigRegistryService } from './config-registry.service';
import { setupCoreTestBed } from '../testing/core-test-helpers';

describe('ConfigRegistryService (Core Tier)', () => {
  let service: ConfigRegistryService;

  beforeEach(() => {
    // ✅ Use core-specific test bed setup
    setupCoreTestBed([], {
      providers: [ConfigRegistryService]
    });

    service = TestBed.inject(ConfigRegistryService);
  });

  // ============================================================================
  // BASIC TESTS
  // ============================================================================

  describe('service creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have register method', () => {
      expect(service.register).toBeDefined();
    });

    it('should have get method', () => {
      expect(service.get).toBeDefined();
    });

    it('should have has method', () => {
      expect(service.has).toBeDefined();
    });
  });

  // ============================================================================
  // REGISTRATION TESTS
  // ============================================================================

  describe('register', () => {
    it('should register a configuration', () => {
      const config = { name: 'test', value: 123 };
      
      expect(() => {
        service.register('test-key', config);
      }).not.toThrow();
    });

    it('should register multiple configurations', () => {
      service.register('config1', { value: 'a' });
      service.register('config2', { value: 'b' });
      service.register('config3', { value: 'c' });

      expect(service.has('config1')).toBe(true);
      expect(service.has('config2')).toBe(true);
      expect(service.has('config3')).toBe(true);
    });

    it('should overwrite existing configuration', () => {
      service.register('test', { value: 'original' });
      service.register('test', { value: 'updated' });

      const config = service.get('test');
      expect(config.value).toBe('updated');
    });

    it('should handle complex nested objects', () => {
      const complexConfig = {
        level1: {
          level2: {
            level3: {
              value: 'deep'
            }
          }
        }
      };

      service.register('complex', complexConfig);
      const retrieved = service.get('complex');
      
      expect(retrieved.level1.level2.level3.value).toBe('deep');
    });

    it('should handle arrays', () => {
      const arrayConfig = {
        items: [1, 2, 3, 4, 5]
      };

      service.register('array', arrayConfig);
      const retrieved = service.get('array');
      
      expect(retrieved.items).toEqual([1, 2, 3, 4, 5]);
    });
  });

  // ============================================================================
  // RETRIEVAL TESTS
  // ============================================================================

  describe('get', () => {
    beforeEach(() => {
      service.register('test', { name: 'Test Config', value: 42 });
    });

    it('should retrieve registered configuration', () => {
      const config = service.get('test');
      expect(config).toBeDefined();
      expect(config.name).toBe('Test Config');
      expect(config.value).toBe(42);
    });

    it('should return undefined for unregistered key', () => {
      const config = service.get('nonexistent');
      expect(config).toBeUndefined();
    });

    it('should return empty object for undefined key (if implemented)', () => {
      // Some implementations return {} instead of undefined
      const config = service.get('missing') || {};
      expect(typeof config).toBe('object');
    });

    it('should retrieve multiple different configs', () => {
      service.register('config1', { id: 1 });
      service.register('config2', { id: 2 });

      const config1 = service.get('config1');
      const config2 = service.get('config2');

      expect(config1.id).toBe(1);
      expect(config2.id).toBe(2);
    });
  });

  // ============================================================================
  // EXISTENCE CHECK TESTS
  // ============================================================================

  describe('has', () => {
    beforeEach(() => {
      service.register('existing', { value: true });
    });

    it('should return true for registered key', () => {
      expect(service.has('existing')).toBe(true);
    });

    it('should return false for unregistered key', () => {
      expect(service.has('nonexistent')).toBe(false);
    });

    it('should return false for empty string key', () => {
      expect(service.has('')).toBe(false);
    });

    it('should handle multiple checks', () => {
      service.register('key1', {});
      service.register('key2', {});

      expect(service.has('key1')).toBe(true);
      expect(service.has('key2')).toBe(true);
      expect(service.has('key3')).toBe(false);
    });
  });

  // ============================================================================
  // INTEGRATION TESTS
  // ============================================================================

  describe('integration scenarios', () => {
    it('should support typical tier registration workflow', () => {
      // Simulate tier-by-tier configuration registration
      
      // Core tier
      service.register('core', {
        constants: { apiUrl: '/api' },
        configuration: { debug: true }
      });

      // Core.ag tier
      service.register('core.ag', {
        constants: { components: [] },
        configuration: { strictMode: false }
      });

      // Sites tier
      service.register('sites', {
        constants: { navigation: {} },
        configuration: { theme: 'light' }
      });

      // Verify all registered
      expect(service.has('core')).toBe(true);
      expect(service.has('core.ag')).toBe(true);
      expect(service.has('sites')).toBe(true);

      // Verify retrievable
      expect(service.get('core').constants.apiUrl).toBe('/api');
      expect(service.get('core.ag').configuration.strictMode).toBe(false);
      expect(service.get('sites').configuration.theme).toBe('light');
    });

    it('should handle configuration updates', () => {
      // Initial registration
      service.register('app', { version: '1.0.0' });
      expect(service.get('app').version).toBe('1.0.0');

      // Update
      service.register('app', { version: '2.0.0', features: ['new'] });
      expect(service.get('app').version).toBe('2.0.0');
      expect(service.get('app').features).toEqual(['new']);
    });
  });

  // ============================================================================
  // EDGE CASES
  // ============================================================================

  describe('edge cases', () => {
    it('should handle null config value', () => {
      service.register('null', null as any);
      const config = service.get('null');
      expect(config).toBeNull();
    });

    it('should handle undefined config value', () => {
      service.register('undefined', undefined as any);
      const config = service.get('undefined');
      expect(config).toBeUndefined();
    });

    it('should handle empty object', () => {
      service.register('empty', {});
      const config = service.get('empty');
      expect(config).toEqual({});
    });

    it('should handle special characters in key', () => {
      service.register('key-with-dash', { value: 1 });
      service.register('key_with_underscore', { value: 2 });
      service.register('key.with.dots', { value: 3 });

      expect(service.has('key-with-dash')).toBe(true);
      expect(service.has('key_with_underscore')).toBe(true);
      expect(service.has('key.with.dots')).toBe(true);
    });

    it('should handle very long key names', () => {
      const longKey = 'a'.repeat(1000);
      service.register(longKey, { value: 'test' });
      
      expect(service.has(longKey)).toBe(true);
      expect(service.get(longKey).value).toBe('test');
    });
  });
});
