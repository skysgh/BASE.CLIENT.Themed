/**
 * Auth Provider Interface
 * 
 * Defines the contract that provider-specific implementations must follow.
 * This allows the OidcService to work with any IdP without knowing the details.
 * 
 * Implementations:
 * - MsalAuthProvider (Microsoft) - uses @azure/msal-browser
 * - GoogleAuthProvider - uses Google Identity Services
 * - Auth0Provider - uses @auth0/auth0-angular
 * 
 * To add a new provider:
 * 1. Create a class that implements IAuthProvider
 * 2. Register it in the AuthModule
 * 3. Add configuration to OidcConfiguration
 */
import { Observable } from 'rxjs';
import { AuthenticatedUser, TokenSet, AuthRequestState } from '../models/auth-state.model';
import { OidcProviderConfig } from '../models/oidc-config.model';

/**
 * Auth provider interface
 */
export interface IAuthProvider {
  /**
   * Provider identifier (must match OidcProvider type)
   */
  readonly providerId: string;

  /**
   * Initialize the provider with configuration
   */
  initialize(config: OidcProviderConfig): Promise<void>;

  /**
   * Check if provider is initialized and ready
   */
  isInitialized(): boolean;

  /**
   * Initiate login flow
   * Returns the URL to redirect to, or null if provider handles redirect internally
   */
  initiateLogin(state: AuthRequestState): Promise<string | null>;

  /**
   * Handle the callback after IdP redirects back
   * Exchange authorization code for tokens
   */
  handleCallback(code: string, state: string): Promise<{ user: AuthenticatedUser; tokens: TokenSet }>;

  /**
   * Silently acquire a new access token (if refresh token available)
   */
  silentRefresh(): Promise<TokenSet>;

  /**
   * Logout and clear provider-specific state
   * Returns logout URL if redirect needed, null otherwise
   */
  logout(): Promise<string | null>;

  /**
   * Get the current access token
   */
  getAccessToken(): Promise<string | null>;

  /**
   * Parse an ID token and extract user claims
   */
  parseIdToken(idToken: string): AuthenticatedUser;

  /**
   * Validate an ID token
   * Returns true if valid, throws error if invalid
   */
  validateIdToken(idToken: string, nonce: string): Promise<boolean>;
}

/**
 * Abstract base class for auth providers
 * Provides common functionality
 */
export abstract class BaseAuthProvider implements IAuthProvider {
  abstract readonly providerId: string;
  
  protected config: OidcProviderConfig | null = null;
  protected initialized = false;

  async initialize(config: OidcProviderConfig): Promise<void> {
    this.config = config;
    await this.doInitialize(config);
    this.initialized = true;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Provider-specific initialization
   */
  protected abstract doInitialize(config: OidcProviderConfig): Promise<void>;

  abstract initiateLogin(state: AuthRequestState): Promise<string | null>;
  abstract handleCallback(code: string, state: string): Promise<{ user: AuthenticatedUser; tokens: TokenSet }>;
  abstract silentRefresh(): Promise<TokenSet>;
  abstract logout(): Promise<string | null>;
  abstract getAccessToken(): Promise<string | null>;
  
  /**
   * Parse JWT without validation (for extracting claims)
   * WARNING: Always validate tokens before trusting claims!
   */
  parseIdToken(idToken: string): AuthenticatedUser {
    const parts = idToken.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid ID token format');
    }

    const payload = JSON.parse(atob(parts[1]));
    
    return {
      id: payload.oid || payload.sub,
      email: payload.email || payload.preferred_username,
      displayName: payload.name || `${payload.given_name} ${payload.family_name}`.trim(),
      firstName: payload.given_name,
      lastName: payload.family_name,
      picture: payload.picture,
      emailVerified: payload.email_verified ?? true,
      provider: this.providerId,
      providerId: payload.sub,
      claims: payload
    };
  }

  /**
   * Basic token validation
   * Subclasses should override for proper cryptographic validation
   */
  async validateIdToken(idToken: string, nonce: string): Promise<boolean> {
    const parts = idToken.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid ID token format');
    }

    const payload = JSON.parse(atob(parts[1]));

    // Check expiry
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      throw new Error('ID token has expired');
    }

    // Check nonce
    if (payload.nonce && payload.nonce !== nonce) {
      throw new Error('Invalid nonce in ID token');
    }

    // Check issuer
    if (this.config && payload.iss) {
      // Provider-specific issuer validation
      // Subclasses should implement proper validation
    }

    // Check audience
    if (this.config && payload.aud !== this.config.clientId) {
      // Note: aud can be an array
      const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
      if (!audiences.includes(this.config.clientId)) {
        throw new Error('Invalid audience in ID token');
      }
    }

    return true;
  }
}

/**
 * Factory function type for creating auth providers
 */
export type AuthProviderFactory = (config: OidcProviderConfig) => IAuthProvider;
