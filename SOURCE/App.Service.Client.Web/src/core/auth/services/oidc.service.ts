/**
 * OIDC Service
 * 
 * Provider-agnostic authentication service.
 * Abstracts the complexity of OAuth2/OIDC flows.
 * 
 * USAGE:
 * 1. Configure providers in environment or config.json
 * 2. Inject OidcService
 * 3. Call login('microsoft') or login('google')
 * 4. Handle callback in AuthCallbackComponent
 * 5. Access user via currentUser$ observable
 * 
 * This is a FACADE that delegates to provider-specific implementations
 * when you add the actual MSAL/Google libraries.
 * 
 * TOKEN REVOCATION (OIDC Spec):
 * When logging out properly, we should:
 * 1. Revoke access token (if IdP supports RFC 7009)
 * 2. Revoke refresh token
 * 3. Clear local session
 * 4. Redirect to IdP logout endpoint (for SSO logout)
 */
import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { 
  OidcConfiguration, 
  OidcProviderConfig,
  OidcProvider,
  DEFAULT_MICROSOFT_CONFIG,
  DEFAULT_GOOGLE_CONFIG
} from '../models/oidc-config.model';
import {
  AuthenticatedUser,
  AuthSession,
  TokenSet,
  AuthRequestState,
  PkceParams,
  INITIAL_AUTH_SESSION
} from '../models/auth-state.model';
import { SystemDiagnosticsTraceService } from '../../services/system.diagnostics-trace.service';
import { SessionStorageService } from '../../services/browser/session-storage.service';

/**
 * OIDC Service - Facade for authentication
 */
@Injectable({ providedIn: 'root' })
export class OidcService {
  
  // ============================================
  // Dependencies
  // ============================================
  private router = inject(Router);
  private diagnostics = inject(SystemDiagnosticsTraceService);
  private sessionStorage = inject(SessionStorageService);

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

  // Storage keys (used via SessionStorageService)
  private readonly STORAGE_KEY_STATE = 'oidc_auth_state';
  private readonly STORAGE_KEY_SESSION = 'oidc_session';

  constructor() {
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
      this.sessionStorage.setObject(this.STORAGE_KEY_STATE, authState);

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
      const storedState = this.sessionStorage.getObject<AuthRequestState>(this.STORAGE_KEY_STATE);
      if (!storedState) {
        throw new Error('No authentication state found. Please try again.');
      }
      
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

      // Exchange authorization code for tokens
      const tokens = await this.exchangeCodeForTokens(code, config, storedState.pkce);
      
      // Parse user info from ID token or call userinfo endpoint
      const user = await this.getUserInfo(tokens, config);

      // Update session
      this._session.set({
        isAuthenticated: true,
        user,
        tokens,
        loading: false,
        error: null,
        sessionStartedAt: new Date(),
        lastActivityAt: new Date()
      });

      // Persist session
      this.persistSession();

      // Clean up auth state
      this.sessionStorage.remove(this.STORAGE_KEY_STATE);

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
   * 
   * OIDC Logout Flow:
   * 1. Revoke tokens with IdP (if supported)
   * 2. Clear local session state
   * 3. Optionally redirect to IdP logout endpoint
   */
  async logout(redirectToIdp: boolean = false): Promise<void> {
    this.diagnostics.info(`${this.constructor.name}.logout()`);
    
    const currentProvider = this._session().user?.provider;
    const tokens = this._session().tokens;

    // Step 1: Revoke tokens with IdP (if supported)
    if (tokens && currentProvider) {
      await this.revokeTokens(tokens, currentProvider as OidcProvider);
    }

    // Step 2: Clear local session
    this._session.set(INITIAL_AUTH_SESSION);
    this.sessionStorage.remove(this.STORAGE_KEY_SESSION);
    this.sessionStorage.remove(this.STORAGE_KEY_STATE);

    // Step 3: Optionally redirect to IdP logout
    if (redirectToIdp && currentProvider) {
      const config = this.getProviderConfig(currentProvider as OidcProvider);
      if (config?.logoutUrl) {
        const logoutUrl = this.buildLogoutUrl(config, tokens?.idToken);
        window.location.href = logoutUrl;
        return;
      }
    }

    // Navigate to signed-out landing page
    this.router.navigate(['/pages/signed-out']);
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
   * Get current ID token (for logout, etc.)
   */
  getIdToken(): string | null {
    return this._session().tokens?.idToken || null;
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
   * Refresh access token using refresh token
   * 
   * IMPLEMENTATION NOTES:
   * - This should ideally be done server-side to protect client_secret
   * - For public clients, use PKCE and no client_secret
   * - Automatic refresh should be handled by an HTTP interceptor
   */
  async refreshToken(): Promise<TokenSet> {
    this.diagnostics.info(`${this.constructor.name}.refreshToken()`);
    
    const tokens = this._session().tokens;
    if (!tokens?.refreshToken) {
      throw new Error('No refresh token available');
    }

    const provider = this._session().user?.provider as OidcProvider;
    const config = this.getProviderConfig(provider);
    if (!config) {
      throw new Error('Provider configuration not found');
    }

    // TODO: Implement actual token refresh
    // This would POST to config.tokenUrl with:
    // - grant_type: 'refresh_token'
    // - refresh_token: tokens.refreshToken
    // - client_id: config.clientId
    // - (optionally) client_secret if confidential client
    
    this.diagnostics.warn('TODO: Implement actual token refresh via backend proxy');
    throw new Error('Token refresh not yet implemented - requires backend proxy');
  }

  // ============================================
  // Token Operations (Private)
  // ============================================

  /**
   * Exchange authorization code for tokens
   * 
   * SECURITY NOTE:
   * In production, this MUST be done server-side to protect client_secret.
   * The frontend should POST to your backend, which then calls the IdP.
   * 
   * For public clients (SPAs), use PKCE and no client_secret.
   */
  private async exchangeCodeForTokens(
    code: string, 
    config: OidcProviderConfig,
    pkce?: PkceParams
  ): Promise<TokenSet> {
    this.diagnostics.info(`${this.constructor.name}.exchangeCodeForTokens()`);

    // TODO: Implement actual token exchange
    // For now, simulate success for development
    
    this.diagnostics.warn('TODO: Implement token exchange via backend proxy');
    this.diagnostics.debug(`Would exchange code at: ${config.tokenUrl}`);
    this.diagnostics.debug(`With PKCE verifier: ${pkce?.codeVerifier ? 'Yes' : 'No'}`);

    /*
    IMPLEMENTATION WHEN READY:
    
    // Build token request
    const tokenRequest = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: config.redirectUri,
      client_id: config.clientId,
      // client_secret: should NOT be in frontend - use backend proxy!
    });

    if (pkce) {
      tokenRequest.set('code_verifier', pkce.codeVerifier);
    }

    // For security, POST to YOUR backend, not directly to IdP
    const response = await fetch('/api/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenRequest.toString()
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`);
    }

    const tokenResponse = await response.json();
    
    return {
      accessToken: tokenResponse.access_token,
      idToken: tokenResponse.id_token,
      refreshToken: tokenResponse.refresh_token,
      tokenType: tokenResponse.token_type || 'Bearer',
      expiresAt: new Date(Date.now() + tokenResponse.expires_in * 1000),
      scopes: tokenResponse.scope?.split(' ') || config.scopes
    };
    */

    // Simulated tokens for development
    return {
      accessToken: 'simulated-access-token',
      idToken: 'simulated-id-token',
      refreshToken: 'simulated-refresh-token',
      tokenType: 'Bearer',
      expiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour
      scopes: config.scopes
    };
  }

  /**
   * Get user info from ID token or userinfo endpoint
   */
  private async getUserInfo(
    tokens: TokenSet, 
    config: OidcProviderConfig
  ): Promise<AuthenticatedUser> {
    this.diagnostics.info(`${this.constructor.name}.getUserInfo()`);

    // TODO: Parse ID token JWT and/or call userinfo endpoint
    
    this.diagnostics.warn('TODO: Parse ID token claims or call userinfo endpoint');

    /*
    IMPLEMENTATION WHEN READY:

    // Option 1: Parse ID token (JWT)
    if (tokens.idToken) {
      const claims = this.parseJwt(tokens.idToken);
      return {
        id: claims.sub,
        email: claims.email,
        displayName: claims.name || `${claims.given_name} ${claims.family_name}`,
        firstName: claims.given_name,
        lastName: claims.family_name,
        emailVerified: claims.email_verified,
        provider: config.provider,
        providerId: claims.sub,
        picture: claims.picture
      };
    }

    // Option 2: Call userinfo endpoint
    const response = await fetch(config.userInfoUrl!, {
      headers: { 'Authorization': `Bearer ${tokens.accessToken}` }
    });
    const userInfo = await response.json();
    // ... map to AuthenticatedUser
    */

    // Simulated user for development
    return {
      id: 'simulated-user-id',
      email: 'user@example.com',
      displayName: 'Simulated User',
      firstName: 'Simulated',
      lastName: 'User',
      emailVerified: true,
      provider: config.provider,
      providerId: 'simulated-provider-id'
    };
  }

  /**
   * Revoke tokens with IdP
   * 
   * RFC 7009 - OAuth 2.0 Token Revocation
   * https://tools.ietf.org/html/rfc7009
   * 
   * Not all IdPs support token revocation:
   * - Microsoft: Yes (via /oauth2/v2.0/logout or revocation endpoint)
   * - Google: Yes (via /o/oauth2/revoke)
   * - Auth0: Yes (via /oauth/revoke)
   * 
   * Even without revocation, tokens will expire naturally.
   * Revocation is "best effort" - don't fail logout if revocation fails.
   */
  private async revokeTokens(tokens: TokenSet, provider: OidcProvider): Promise<void> {
    this.diagnostics.info(`${this.constructor.name}.revokeTokens()`);

    const config = this.getProviderConfig(provider);
    if (!config?.revocationUrl) {
      this.diagnostics.debug('No revocation URL configured - skipping token revocation');
      return;
    }

    try {
      // Revoke refresh token first (more important)
      if (tokens.refreshToken) {
        await this.revokeToken(tokens.refreshToken, 'refresh_token', config);
      }

      // Then revoke access token
      if (tokens.accessToken) {
        await this.revokeToken(tokens.accessToken, 'access_token', config);
      }

      this.diagnostics.info('Tokens revoked successfully');
    } catch (error) {
      // Don't fail logout if revocation fails
      this.diagnostics.warn(`Token revocation failed (non-fatal): ${error}`);
    }
  }

  /**
   * Revoke a single token
   */
  private async revokeToken(
    token: string, 
    tokenTypeHint: 'access_token' | 'refresh_token',
    config: OidcProviderConfig
  ): Promise<void> {
    this.diagnostics.debug(`Revoking ${tokenTypeHint}`);

    /*
    IMPLEMENTATION WHEN READY:

    // For security, revocation should go through your backend
    const response = await fetch('/api/auth/revoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        token,
        token_type_hint: tokenTypeHint,
        client_id: config.clientId
      }).toString()
    });

    if (!response.ok) {
      throw new Error(`Revocation failed: ${response.statusText}`);
    }
    */

    this.diagnostics.warn(`TODO: Implement token revocation via backend proxy`);
  }

  /**
   * Build IdP logout URL
   * 
   * OIDC RP-Initiated Logout:
   * https://openid.net/specs/openid-connect-rpinitiated-1_0.html
   */
  private buildLogoutUrl(config: OidcProviderConfig, idToken?: string): string {
    const url = new URL(config.logoutUrl!);
    
    // id_token_hint helps IdP identify which session to end
    if (idToken) {
      url.searchParams.set('id_token_hint', idToken);
    }
    
    // Where to redirect after logout
    if (config.postLogoutRedirectUri) {
      url.searchParams.set('post_logout_redirect_uri', config.postLogoutRedirectUri);
    }
    
    // State for CSRF protection on logout callback
    url.searchParams.set('state', this.generateRandomString(16));
    
    return url.toString();
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
      const session = this.sessionStorage.getObject<AuthSession>(this.STORAGE_KEY_SESSION);
      if (session) {
        // Restore dates
        if (session.sessionStartedAt) {
          session.sessionStartedAt = new Date(session.sessionStartedAt);
        }
        if (session.lastActivityAt) {
          session.lastActivityAt = new Date(session.lastActivityAt);
        }
        if (session.tokens?.expiresAt) {
          session.tokens.expiresAt = new Date(session.tokens.expiresAt);
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
      this.sessionStorage.setObject(this.STORAGE_KEY_SESSION, this._session());
    } catch (error) {
      this.diagnostics.warn(`Failed to persist session: ${error}`);
    }
  }
}
