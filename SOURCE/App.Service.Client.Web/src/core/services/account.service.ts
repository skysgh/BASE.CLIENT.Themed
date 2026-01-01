import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { 
  AccountConfig, 
  DEFAULT_ACCOUNT_CONFIG, 
  DEFAULT_ACCOUNT_URL_PATTERNS,
  AccountUrlPattern 
} from '../models/account-config.model';
import { ServiceAccountService } from './service.account.service';

/**
 * AccountService - Multi-Account Configuration Management
 * 
 * Responsibilities:
 * 1. Detect account from URL (subdomain or path)
 * 2. Load account-specific configuration from JSON
 * 3. Cascade configuration (default → account override)
 * 4. Provide reactive access to account config
 * 5. Handle account switching at runtime
 * 
 * Architecture:
 * - Initialized via APP_INITIALIZER before app starts
 * - Provides BehaviorSubject for reactive config access
 * - Supports both path-based (/foo) and subdomain (foo.example.com) accounts
 * - Falls back to default account if detection fails
 * 
 * Note: This is a ServiceAccount (organizational), not a PersonAccount.
 * It identifies which organization/account is being accessed, not which user.
 * 
 * Usage:
 * ```typescript
 * // In component
 * constructor(private accountService: AccountService) {
 *   this.logoUrl$ = this.accountService.getConfigValue('branding.logo');
 *   this.accountName$ = this.accountService.getConfigValue('name');
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly CONFIG_BASE_PATH = '/assets/core/data/accounts';
  private readonly ACCOUNTS_CONFIG_BASE_PATH = '/assets/core/data/accounts';
  
  /** Current account configuration (reactive) */
  private config$ = new BehaviorSubject<AccountConfig | null>(null);
  
  /** Current account ID (string identifier like 'foo', 'bar') */
  private currentAccountId: string = 'default';
  
  /** URL patterns for account detection */
  private urlPatterns: AccountUrlPattern[] = DEFAULT_ACCOUNT_URL_PATTERNS;

  constructor(
    private http: HttpClient,
    private serviceAccountService: ServiceAccountService
  ) {}

  /**
   * Initialize account configuration
   * Called by APP_INITIALIZER before app starts
   * 
   * @param url Optional URL override (for testing)
   * @returns Promise that resolves when config is loaded
   */
  async initialize(url?: string): Promise<void> {
    const detectedUrl = url || window.location.href;
    const accountId = this.detectAccountIdentifierFromUrl(detectedUrl);
    
    console.log(`[AccountService] Detected account: ${accountId} from URL: ${detectedUrl}`);
    
    await this.loadAccountConfig(accountId);
  }

  /**
   * Detect account identifier from URL
   * Supports both path-based and subdomain-based accounts
   * 
   * ✅ FIXED: Simplified logic - check FIRST segment only
   * 
   * Examples:
   * - http://localhost:4200/foo/pages → 'foo' (account ID)
   * - http://localhost:4200/pages → 'default' (reserved route)
   * - http://localhost:4200/foot/ → 'foot' (account ID, even though trailing slash)
   * - http://foo.example.com → 'foo' (subdomain)
   * 
   * @param url Full URL to parse
   * @returns Detected account identifier (e.g., 'foo', 'bar', 'default')
   */
  detectAccountIdentifierFromUrl(url: string): string {
    const urlObj = new URL(url);
    
    // Try path-based detection first
    // Pattern: /^\/([^\/]+)/ matches first segment after /
    const pathPattern = this.urlPatterns.find(p => p.type === 'path');
    if (pathPattern) {
      const pathMatch = urlObj.pathname.match(pathPattern.pattern);
      if (pathMatch && pathMatch[1]) {
        const firstSegment = pathMatch[1];
        
        // ✅ FIXED: Only check if FIRST segment is a known app route
        // If it's 'pages', 'apps', 'auth' etc., it's NOT an account ID
        if (this.isReservedRoute(firstSegment)) {
          console.log(`[AccountService] First segment '${firstSegment}' is reserved route, using default account`);
          return pathPattern.defaultAccountId || 'default';
        }
        
        // Otherwise, first segment IS the account ID
        console.log(`[AccountService] Detected account ID '${firstSegment}' from path`);
        return firstSegment;
      }
    }
    
    // Try subdomain-based detection
    const subdomainPattern = this.urlPatterns.find(p => p.type === 'subdomain');
    if (subdomainPattern) {
      const subdomainMatch = urlObj.hostname.match(subdomainPattern.pattern);
      if (subdomainMatch && subdomainMatch[1]) {
        const subdomain = subdomainMatch[1];
        // Exclude common subdomains
        if (!this.isReservedSubdomain(subdomain)) {
          console.log(`[AccountService] Detected account ID '${subdomain}' from subdomain`);
          return subdomain;
        }
      }
    }
    
    // Fall back to default account
    console.log('[AccountService] No account detected, using default');
    return pathPattern?.defaultAccountId || 'default';
  }

  /**
   * Load account configuration from JSON files
   * Cascades: default.json → {accountId}.json
   * 
   * @param accountId Account identifier
   */
  async loadAccountConfig(accountId: string): Promise<void> {
    try {
      // ✅ Set current account ID immediately
      this.currentAccountId = accountId;
      
      // Load default config first
      const defaultConfig = await this.http
        .get<Partial<AccountConfig>>(`${this.CONFIG_BASE_PATH}/default.json`)
        .pipe(
          catchError(() => {
            console.warn('[AccountService] Default config not found, using hardcoded defaults');
            return of(DEFAULT_ACCOUNT_CONFIG);
          })
        )
        .toPromise();

      // Only load account-specific config if accountId is NOT 'default'
      let accountConfig: Partial<AccountConfig> = {};
      let accountNotFound = false;
      
      if (accountId !== 'default') {
        accountConfig = await this.http
          .get<Partial<AccountConfig>>(`${this.ACCOUNTS_CONFIG_BASE_PATH}/${accountId}.json`)
          .pipe(
            catchError((error) => {
              console.warn(`[AccountService] Account config not found for '${accountId}', using defaults only`, error);
              accountNotFound = true;
              return of({} as Partial<AccountConfig>);
            })
          )
          .toPromise() || {};
      } else {
        console.log('[AccountService] Using default account, no account-specific overrides loaded');
      }

      // Deep merge: default → account (account overrides default)
      const mergedConfig = this.deepMerge(defaultConfig || {}, accountConfig) as AccountConfig;
      
      // Ensure accountId is set
      mergedConfig.accountId = accountId;
      
      // ✅ Mark if account was not found (so components can redirect to error page)
      if (accountNotFound) {
        mergedConfig._accountNotFound = true;
        console.warn(`[AccountService] Account '${accountId}' not found - config marked for error handling`);
      }

      // ✅ Populate ServiceAccountService with GUID for repository queries
      if (mergedConfig.accountGuid) {
        this.serviceAccountService.setAccountGuid(mergedConfig.accountGuid);
        console.log(`[AccountService] Set account GUID: ${mergedConfig.accountGuid}`);
      }
      
      // ✅ Publish config to BehaviorSubject
      this.config$.next(mergedConfig);
      
      console.log('[AccountService] Configuration loaded:', mergedConfig);
    } catch (error) {
      console.error('[AccountService] Failed to load account configuration:', error);
      
      // Fall back to default config
      const fallbackConfig = { ...DEFAULT_ACCOUNT_CONFIG, accountId } as AccountConfig;
      this.config$.next(fallbackConfig);
    }
  }

  /**
   * Get current account configuration (reactive)
   * @returns Observable of account config
   */
  getConfig(): Observable<AccountConfig> {
    return this.config$.asObservable().pipe(
      map(config => {
        if (!config) {
          throw new Error('Account configuration not initialized');
        }
        return config;
      })
    );
  }

  /**
   * Get current account configuration (synchronous)
   * @returns Current account config or null if not loaded
   */
  getCurrentConfig(): AccountConfig | null {
    return this.config$.value;
  }

  /**
   * Get current account ID (string identifier)
   * @returns Current account ID (e.g., 'foo', 'bar', 'default')
   */
  getAccountId(): string {
    return this.currentAccountId;
  }

  /**
   * Get account GUID (for database queries)
   * @returns Account GUID or undefined
   */
  getAccountGuid(): string | undefined {
    return this.config$.value?.accountGuid;
  }

  /**
   * Check if current account was not found (404)
   * @returns True if account ID was detected but config was not found
   */
  isAccountNotFound(): boolean {
    return this.config$.value?._accountNotFound === true;
  }
  /**
   * Get specific configuration value by path
   * Example: getConfigValue('branding.logo')
   * 
   * @param path Dot-notation path to config value
   * @returns Observable of config value
   */
  getConfigValue<T = any>(path: string): Observable<T | undefined> {
    console.log(`[AccountService] getConfigValue('${path}') called`);
    
    return this.getConfig().pipe(
      map(config => {
        const value = this.getNestedValue(config, path);
        console.log(`[AccountService] getConfigValue('${path}') = `, value);
        return value;
      })
    );
  }

  /**
   * Switch to different account at runtime
   * @param accountId New account ID
   */
  async switchAccount(accountId: string): Promise<void> {
    await this.loadAccountConfig(accountId);
  }

  /**
   * Deep merge two objects (account config cascading)
   * @param target Base object
   * @param source Override object
   * @returns Merged object
   */
  private deepMerge(target: any, source: any): any {
    const output = { ...target };
    
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (this.isObject(source[key])) {
          if (!(key in target)) {
            output[key] = source[key];
          } else {
            output[key] = this.deepMerge(target[key], source[key]);
          }
        } else {
          output[key] = source[key];
        }
      });
    }
    
    return output;
  }

  /**
   * Get nested object value by dot-notation path
   * @param obj Object to search
   * @param path Dot-notation path (e.g., 'branding.logo')
   * @returns Value at path or undefined
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Check if value is a plain object
   */
  private isObject(item: any): boolean {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  /**
   * Check if route segment is reserved (not an account ID)
   * 
   * These are root-level routes that exist without an account prefix.
   * If the first URL segment matches any of these, it's NOT an account ID.
   */
  private isReservedRoute(segment: string): boolean {
    const reservedRoutes = [
      // Core routes
      'pages',
      'apps', 
      'auth',
      'errors',
      'assets',
      'api',
      // Dashboard routes
      'dashboards',
      // Developer tools
      'dev',
      // System routes
      'system',
      // Landing/marketing
      'landing',
      'information'
    ];
    return reservedRoutes.includes(segment);
  }

  /**
   * Check if subdomain is reserved (not an account ID)
   */
  private isReservedSubdomain(subdomain: string): boolean {
    const reservedSubdomains = ['www', 'api', 'cdn', 'localhost'];
    return reservedSubdomains.includes(subdomain);
  }
}
