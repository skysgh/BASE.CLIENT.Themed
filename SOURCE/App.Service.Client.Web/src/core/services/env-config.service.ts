import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppReadinessService } from './app-readiness.service';
import { environment } from '../../environments/environment';

/**
 * Environment Configuration (loaded at runtime)
 * 
 * Defines the shape of configuration that can be loaded from:
 * 1. environment.ts (deployed/build-time)
 * 2. /assets/data/env-config.json (mock/file-based)
 * 3. Backend API (runtime/server-based)
 */
export interface EnvConfig {
  version: string;
  timestamp: string;
  app: {
    name: string;         // ← Can override "BASE" with "BUMS" etc.
    title: string;
    description: string;
    version: string;
  };
  backend: {
    available: boolean;
    apiBaseUrl: string;
    timeout: number;
  };
  features: {
    authentication: boolean;
    uploads: boolean;
    telemetry: boolean;
  };
  i18n: {
    defaultLanguage: string;
    supportedLanguages: string[];
    translations: any;    // Language pack inline
  };
  endpoints: any;         // API endpoints
  
  /**
   * Post-login redirect destination.
   * 
   * Why: Different deployments may need to redirect users to different places after login.
   * 
   * Default: '/dashboards/main/' (from themesT1Configuration)
   * Override: Set in config.json to redirect to custom location
   * 
   * Examples:
   * - Dev: '/dashboards/main/' (developer dashboard)
   * - Customer A: '/welcome-wizard/' (onboarding for new users)
   * - Customer B: '/tasks/pending/' (task management focus)
   * 
   * Note: This is a FALLBACK. Individual login URLs can still use returnUrl query param:
   * /auth/signin?returnUrl=/specific-page will override this setting.
   */
  postLoginRedirect?: string;
}

/**
 * Environment Configuration Service (Cascading Config)
 * 
 * Purpose:
 * Load configuration from multiple sources with cascading overrides.
 * 
 * ✅ NEW: Cascading Configuration Strategy
 * 
 * Config Sources (in order of precedence):
 * 1. **Deployed Config** (Build Time)
 *    - From environment.ts (baked into bundle)
 *    - Always available (fallback)
 * 
 * 2. **Mock JSON** (Runtime - File System)
 *    - From /assets/data/env-config.json
 *    - Can override deployed config
 *    - Works without backend (dev mode)
 * 
 * 3. **Backend API** (Runtime - HTTP)
 *    - From GET /api/env-config
 *    - Can override mock config
 *    - Highest priority (prod mode)
 * 
 * Flow:
 * ```
 * Deployed Config (environment.ts)
 *    ↓ (merge & override)
 * Mock JSON (/assets/data/env-config.json) [if available]
 *    ↓ (merge & override)
 * Backend API (GET /api/env-config) [if available]
 *    ↓
 * Final Config (used by app)
 * ```
 * 
 * Benefits:
 * - ✅ No redeploy needed (update JSON file)
 * - ✅ Works offline (mock JSON)
 * - ✅ Backend controls final config (prod)
 * - ✅ Emergency fixes (update JSON without API deploy)
 * 
 * Example:
 * ```typescript
 * // Deployed: app.name = "BASE"
 * // Mock JSON: app.name = "BUMS-DEV"
 * // Backend API: app.name = "BUMS-PROD"
 * // Final: app.name = "BUMS-PROD" (backend wins!)
 * ```
 */
@Injectable({ providedIn: 'root' })
export class EnvConfigService {
  
  private config$ = new BehaviorSubject<EnvConfig | null>(null);
  private backendAvailable = false;
  
  constructor(
    private http: HttpClient,
    private appReadiness: AppReadinessService
  ) {}
  
  /**
   * Initialize environment configuration (Cascading)
   * 
   * Called once at app startup (APP_INITIALIZER).
   * 
   * ✅ Cascading Strategy
   * 
   * Flow:
   * 1. Start with deployed config (environment.ts)
   * 2. Try to load mock JSON, merge if available
   * 3. Try to load backend API, merge if available
   * 4. Mark app ready with final merged config
   * 
   * URLs:
   * - Mock JSON: /assets/data/env-config.json (served by Angular at :4200)
   * - Backend API: Determined by environment.production
   *   - Dev: http://localhost:4202/api/rest/env-config (json-server)
   *   - Prod: https://api.production.com/api/env-config (real backend)
   * 
   * Note: Mock JSON and Backend API are separate sources!
   * - Mock JSON (:4200/assets/) = Local file served by Angular
   * - Backend API (:4202/api/) = json-server simulating backend
   */
  async initialize(): Promise<void> {
    console.log('🔄 [EnvConfig] === STARTING INITIALIZATION ===');
    
    try {
      // ✅ Step 1: Start with DEPLOYED config (fallback)
      let config = this.getDeployedConfig();
      console.log('📦 [EnvConfig] Deployed config loaded (fallback)');
      console.log('   App name:', config.app.name);
      
      // ✅ Step 2: Try MOCK JSON (override deployed)
      try {
        console.log('📄 [EnvConfig] Attempting to load mock JSON...');
        const mockConfig = await this.http.get<Partial<EnvConfig>>(
          '/assets/data/env-config.json'
        ).toPromise();
        
        if (mockConfig) {
          config = this.deepMerge(config, mockConfig);
          console.log('📄 [EnvConfig] ✅ Mock JSON loaded and merged!');
          console.log('   App name:', config.app.name);
        }
      } catch (error) {
        console.log('⚠️ [EnvConfig] Mock JSON not available (using deployed)');
        console.log('   Error:', error);
      }
      
      // ✅ Step 3: Try BACKEND API (override mock)
      const backendUrl = environment.production 
        ? 'https://api.production.com/api/env-config'
        : '/api/rest/env-config';
      
      try {
        console.log('🌐 [EnvConfig] Attempting backend API...');
        console.log('   URL:', backendUrl);
        
        const backendConfig = await Promise.race([
          this.http.get<Partial<EnvConfig>>(backendUrl).toPromise(),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout after 3s')), 3000)
          )
        ]);
        
        if (backendConfig) {
          config = this.deepMerge(config, backendConfig);
          this.backendAvailable = true;
          console.log('🌐 [EnvConfig] ✅ Backend API loaded!');
          console.log('   App name:', config.app.name);
        }
      } catch (error) {
        console.log('⚠️ [EnvConfig] Backend API not available (timeout or error)');
        console.log('   Tried:', backendUrl);
        console.log('   Error:', error);
      }
      
      // ✅ Final: Publish merged config
      this.config$.next(config);
      
      // Mark app ready
      this.appReadiness.markReady('config');
      this.appReadiness.markReady('i18n');
      
      console.log('✅ [EnvConfig] === INITIALIZATION COMPLETE ===');
      console.log('   Final app name:', config.app.name);
      console.log('   Backend available:', this.backendAvailable);
      console.log('   Config:', config);
      
    } catch (error) {
      console.error('❌ [EnvConfig] === FATAL ERROR IN INITIALIZATION ===');
      console.error('   Error:', error);
      console.error('   Stack:', (error as Error).stack);
      
      // Ultimate fallback
      try {
        console.log('🔄 [EnvConfig] Attempting fallback to deployed config...');
        const fallbackConfig = this.getDeployedConfig();
        this.config$.next(fallbackConfig);
        console.log('✅ [EnvConfig] Fallback successful');
      } catch (fallbackError) {
        console.error('❌ [EnvConfig] EVEN FALLBACK FAILED!');
        console.error('   Fallback error:', fallbackError);
      }
      
      // Mark ready anyway (don't block app!)
      this.appReadiness.markReady('config');
      this.appReadiness.markReady('i18n');
      
      console.log('⚠️ [EnvConfig] App marked ready despite errors (non-blocking)');
    }
  }
  
  /**
   * ✅ Get deployed configuration (from environment.ts)
   * 
   * This is baked into the bundle at build time.
   * Always available as ultimate fallback.
   * 
   * Note on postLoginRedirect default:
   * - Hardcoded here as '/dashboards/main/' (same as theme default)
   * - Can be overridden via config.json
   * - Avoids circular dependency (env-config → themes)
   * - Theme config also has same default for consistency
   */
  private getDeployedConfig(): EnvConfig {
    return {
      version: '1.0.0-deployed',
      timestamp: new Date().toISOString(),
      app: {
        name: environment.production ? 'BASE-PROD' : 'BASE-DEV',
        title: 'BASE Application',
        description: 'Deployed configuration (build time)',
        version: '1.0.0'
      },
      backend: {
        available: false,
        apiBaseUrl: environment.production 
          ? 'https://api.production.com' 
          : 'http://localhost:4022',
        timeout: 5000
      },
      features: {
        authentication: environment.production,
        uploads: environment.production,
        telemetry: environment.production
      },
      i18n: {
        defaultLanguage: 'en',
        supportedLanguages: ['en'],
        translations: { en: {} }
      },
      endpoints: {
        sites: {
          brochure: '/api/sites/brochure',
          persons: '/api/sites/persons'
        }
      },
      // Hardcoded default (same as theme's default)
      // Override via config.json if needed
      postLoginRedirect: '/dashboards/main/'
    };
  }
  
  /**
   * ✅ NEW: Deep merge configurations (cascading)
   * 
   * Merges source into target recursively.
   * Source properties override target properties.
   * 
   * Example:
   * ```typescript
   * target = { app: { name: 'BASE', title: 'App' } }
   * source = { app: { name: 'BUMS' } }
   * result = { app: { name: 'BUMS', title: 'App' } }  // Merged!
   * ```
   */
  private deepMerge<T>(target: T, source: Partial<T>): T {
    const output = { ...target };
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        const sourceValue = source[key];
        const targetValue = output[key];
        
        // If both are objects, merge recursively
        if (
          sourceValue && 
          typeof sourceValue === 'object' && 
          !Array.isArray(sourceValue) &&
          targetValue &&
          typeof targetValue === 'object' &&
          !Array.isArray(targetValue)
        ) {
          output[key] = this.deepMerge(targetValue, sourceValue) as any;
        } else {
          // Otherwise, source overrides target
          output[key] = sourceValue as any;
        }
      }
    }
    
    return output;
  }
  
  /**
   * ✅ NEW: Get summary of config sources used
   */
  private getSourcesSummary(): string {
    const sources = ['deployed'];
    // You could track which sources were actually used
    // For now, just indicate what we checked
    return sources.join(' → ');
  }
  
  /**
   * Get current configuration
   * 
   * Blocks until config is loaded.
   */
  getConfig$(): Observable<EnvConfig> {
    return this.config$.pipe(
      filter(config => config !== null)
    ) as Observable<EnvConfig>;
  }
  
  /**
   * Get current configuration (synchronous)
   * 
   * Only call after initialization!
   */
  get(): EnvConfig {
    const config = this.config$.value;
    if (!config) {
      throw new Error('EnvConfig not initialized! Call initialize() first.');
    }
    return config;
  }
  
  /**
   * Check if backend is available
   */
  isBackendAvailable(): boolean {
    return this.backendAvailable;
  }
  
  /**
   * Get translation
   * 
   * Example:
   * ```typescript
   * const appName = this.envConfig.getTranslation('app.name');  // "BUMS"
   * ```
   */
  getTranslation(key: string): string {
    const config = this.get();
    const lang = config.i18n.defaultLanguage;
    const translations = config.i18n.translations[lang];
    
    // Navigate nested keys (e.g., 'app.name' → translations.app.name)
    const parts = key.split('.');
    let value: any = translations;
    for (const part of parts) {
      value = value?.[part];
    }
    
    return value || key;  // Return key if translation not found
  }
}
