/**
 * OIDC Service
 * 
 * Provider-agnostic authentication service.
 * Abstracts the complexity of OAuth2/OIDC flows.
 * 
 * LOCATION: core.ag (Angular-specific service using Router, signals)
 * 
 * USAGE:
 * 1. Configure providers in environment or config.json
 * 2. Inject OidcService
 * 3. Call login('microsoft') or login('google')
 * 4. Handle callback in AuthCallbackComponent
 * 5. Access user via currentUser$ observable
 */
import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
// Models from core (Angular-agnostic)
import { 
  OidcConfiguration, 
  OidcProviderConfig,
  OidcProvider,
  DEFAULT_MICROSOFT_CONFIG,
  DEFAULT_GOOGLE_CONFIG
} from '../../../core/auth/models/oidc-config.model';
import {
  AuthenticatedUser,
  AuthSession,
  TokenSet,
  AuthRequestState,
  PkceParams,
  INITIAL_AUTH_SESSION
} from '../../../core/auth/models/auth-state.model';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

/**
 * OIDC Service - Facade for authentication
 */
@Injectable({ providedIn: 'root' })
export class OidcService {
  
  // ============================================
  // State (Signals)
  // ============================================
  
  private _session = signal<AuthSession>(INITIAL_AUTH_SESSION);
  
  // Public readonly
  readonly session = this._session.asReadonly();
  readonly isAuthenticated = computed(() => this._session().isAuthenticated);
  readonly currentUser = computed(() => this._session().user);
  readonly loading = computed(() => this._session().loading);
  readonly error = computed(() => this._session().error);

  // Configuration
  private config: OidcConfiguration | null = null;

  // Storage keys
  private readonly STORAGE_KEY_STATE = 'oidc_auth_state';
  private readonly STORAGE_KEY_SESSION = 'oidc_session';

  constructor(
    private router: Router,
    private diagnostics: SystemDiagnosticsTraceService
  ) {
    this.diagnostics.debug(`${this.constructor.name}.constructor()`);
    
    // Restore session from storage on startup
    this.restoreSession();
  }

  // ============================================
  // Configuration
  // ============================================

  /**
   * Initialize with configuration
   * Call this from APP_INITIALIZER or root module
   */
  initialize(config: OidcConfiguration): void {
    this.diagnostics.info(`${this.constructor.name}.initialize()`);
    this.config = config;
    
    // Log enabled providers
    const enabled = config.providers.filter(p => p.enabled);
    this.diagnostics.debug(`Enabled providers: ${enabled.map(p => p.provider).join(', ')}`);
  }

  /**
   * Get configuration for a provider
   */
  getProviderConfig(provider: OidcProvider): OidcProviderConfig | undefined {
    return this.config?.providers.find(p => p.provider === provider && p.enabled);
  }

  /**
   * Get all enabled providers (for login UI)
   */
  getEnabledProviders(): OidcProviderConfig[] {
    return this.config?.providers.filter(p => p.enabled) || [];
  }

  // ============================================
  // Authentication Flow
  // ============================================

  /**
   * Initiate login with specified provider
   * Redirects to provider's authorization endpoint
   */
  async login(provider: OidcProvider, returnUrl?: string): Promise<void> {
    this.diagnostics.info(`${this.constructor.name}.login('${provider}')`);
    
    const config = this.getProviderConfig(provider);
    if (!config) {
      throw new Error(`Provider '${provider}' not configured or not enabled`);
    }

    this._session.update(s => ({ ...s, loading: true, error: null }));

    try {
      // Generate state and nonce for security
      const state = this.generateRandomString(32);
      const nonce = this.generateRandomString(32);
      
      // Generate PKCE if enabled
      let pkce: PkceParams | undefined;
      if (config.usePkce) {
        pkce = await this.generatePkce();
      }

      // Store state for validation on callback
      const authState: AuthRequestState = {
        state,
        nonce,
        pkce,
        returnUrl: returnUrl || '/',
        provider,
        timestamp: Date.now()
      };
      sessionStorage.setItem(this.STORAGE_KEY_STATE, JSON.stringify(authState));

      // Build authorization URL
      const authUrl = this.buildAuthorizationUrl(config, state, nonce, pkce);
      
      this.diagnostics.debug(`Redirecting to: ${authUrl}`);
      
      // Redirect to IdP
      window.location.href = authUrl;
      
    } catch (error: any) {
      this._session.update(s => ({ 
        ...s, 
        loading: false, 
        error: error.message || 'Login failed' 
      }));
      throw error;
    }
  }

  /**
   * Handle OAuth callback (authorization code exchange)
   * Called from AuthCallbackComponent
   */
  async handleCallback(code: string, state: string): Promise<void> {
    this.diagnostics.info(`${this.constructor.name}.handleCallback()`);
    
    this._session.update(s => ({ ...s, loading: true, error: null }));

    try {
      // Retrieve and validate stored state
      const storedStateJson = sessionStorage.getItem(this.STORAGE_KEY_STATE);
      if (!storedStateJson) {
        throw new Error('No authentication state found. Please try again.');
      }

      const storedState: AuthRequestState = JSON.parse(storedStateJson);
      
      // Validate state parameter (CSRF protection)
      if (storedState.state !== state) {
        throw new Error('Invalid state parameter. Possible CSRF attack.');
      }

      // Check timestamp (state should be recent)
      const maxAge = 10 * 60 * 1000; // 10 minutes
      if (Date.now() - storedState.timestamp > maxAge) {
        throw new Error('Authentication request expired. Please try again.');
      }

      // Get provider config
      const config = this.getProviderConfig(storedState.provider as OidcProvider);
      if (!config) {
        throw new Error('Provider configuration not found');
      }

      // TODO: Exchange code for tokens
      // In production, this should be done SERVER-SIDE to protect client_secret
      // For now, we'll simulate a successful login
      
      this.diagnostics.warn('TODO: Implement token exchange - currently simulating success');
      
      // Simulated user (replace with real token exchange)
      const user: AuthenticatedUser = {
        id: 'simulated-user-id',
        email: 'user@example.com',
        displayName: 'Simulated User',
        firstName: 'Simulated',
        lastName: 'User',
        emailVerified: true,
        provider: storedState.provider,
        providerId: 'simulated-provider-id'
      };

      // Update session
      this._session.set({
        isAuthenticated: true,
        user,
        tokens: null, // Would be real tokens
        loading: false,
        error: null,
        sessionStartedAt: new Date(),
        lastActivityAt: new Date()
      });

      // Persist session
      this.persistSession();

      // Clean up auth state
      sessionStorage.removeItem(this.STORAGE_KEY_STATE);

      // Navigate to return URL
      this.router.navigateByUrl(storedState.returnUrl);

    } catch (error: any) {
      this._session.update(s => ({ 
        ...s, 
        loading: false, 
        error: error.message || 'Authentication failed' 
      }));
      throw error;
    }
  }

  /**
   * Logout and clear session
   */
  async logout(redirectToIdp: boolean = false): Promise<void> {
    this.diagnostics.info(`${this.constructor.name}.logout()`);
    
    const currentProvider = this._session().user?.provider;
    
    // Clear session
    this._session.set(INITIAL_AUTH_SESSION);
    sessionStorage.removeItem(this.STORAGE_KEY_SESSION);
    sessionStorage.removeItem(this.STORAGE_KEY_STATE);

    // Optionally redirect to IdP logout
    if (redirectToIdp && currentProvider) {
      const config = this.getProviderConfig(currentProvider as OidcProvider);
      if (config?.logoutUrl) {
        const logoutUrl = new URL(config.logoutUrl);
        if (config.postLogoutRedirectUri) {
          logoutUrl.searchParams.set('post_logout_redirect_uri', config.postLogoutRedirectUri);
        }
        window.location.href = logoutUrl.toString();
        return;
      }
    }

    // Navigate to login
    this.router.navigate(['/auth/signin']);
  }

  // ============================================
  // Token Management
  // ============================================

  /**
   * Get current access token (for API calls)
   */
  getAccessToken(): string | null {
    return this._session().tokens?.accessToken || null;
  }

  /**
   * Check if token is expired or expiring soon
   */
  isTokenExpiringSoon(thresholdSeconds: number = 60): boolean {
    const tokens = this._session().tokens;
    if (!tokens) return true;
    
    const expiresAt = new Date(tokens.expiresAt).getTime();
    const threshold = thresholdSeconds * 1000;
    return Date.now() > expiresAt - threshold;
  }

  /**
   * Refresh access token
   * TODO: Implement when adding real OIDC
   */
  async refreshToken(): Promise<void> {
    this.diagnostics.warn('TODO: Implement token refresh');
    throw new Error('Token refresh not implemented');
  }

  // ============================================
  // Private Helpers
  // ============================================

  /**
   * Build the authorization URL with all parameters
   */
  private buildAuthorizationUrl(
    config: OidcProviderConfig, 
    state: string, 
    nonce: string,
    pkce?: PkceParams
  ): string {
    const url = new URL(config.authorizeUrl);
    
    url.searchParams.set('client_id', config.clientId);
    url.searchParams.set('redirect_uri', config.redirectUri);
    url.searchParams.set('response_type', config.responseType);
    url.searchParams.set('scope', config.scopes.join(' '));
    url.searchParams.set('state', state);
    url.searchParams.set('nonce', nonce);
    
    if (pkce) {
      url.searchParams.set('code_challenge', pkce.codeChallenge);
      url.searchParams.set('code_challenge_method', pkce.codeChallengeMethod);
    }

    // Add any additional provider-specific params
    if (config.additionalParams) {
      Object.entries(config.additionalParams).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    return url.toString();
  }

  /**
   * Generate a cryptographically secure random string
   */
  private generateRandomString(length: number): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generate PKCE code verifier and challenge
   */
  private async generatePkce(): Promise<PkceParams> {
    // Generate code verifier (43-128 characters)
    const codeVerifier = this.generateRandomString(64);
    
    // Generate code challenge (SHA256 hash of verifier, base64url encoded)
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = new Uint8Array(hashBuffer);
    const codeChallenge = this.base64UrlEncode(hashArray);
    
    return {
      codeVerifier,
      codeChallenge,
      codeChallengeMethod: 'S256'
    };
  }

  /**
   * Base64 URL encode (no padding, URL-safe characters)
   */
  private base64UrlEncode(buffer: Uint8Array): string {
    const base64 = btoa(String.fromCharCode(...buffer));
    return base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  /**
   * Restore session from storage
   */
  private restoreSession(): void {
    try {
      const sessionJson = sessionStorage.getItem(this.STORAGE_KEY_SESSION);
      if (sessionJson) {
        const session: AuthSession = JSON.parse(sessionJson);
        // Restore dates
        if (session.sessionStartedAt) {
          session.sessionStartedAt = new Date(session.sessionStartedAt);
        }
        if (session.lastActivityAt) {
          session.lastActivityAt = new Date(session.lastActivityAt);
        }
        this._session.set(session);
        this.diagnostics.debug('Session restored from storage');
      }
    } catch (error) {
      this.diagnostics.warn(`Failed to restore session: ${error}`);
    }
  }

  /**
   * Persist session to storage
   */
  private persistSession(): void {
    try {
      sessionStorage.setItem(
        this.STORAGE_KEY_SESSION, 
        JSON.stringify(this._session())
      );
    } catch (error) {
      this.diagnostics.warn(`Failed to persist session: ${error}`);
    }
  }
}
