/**
 * OIDC/OAuth Configuration Models
 * 
 * Defines configuration for identity providers (Microsoft, Google, etc.)
 * 
 * OAUTH2/OIDC FLOW OVERVIEW:
 * 
 * 1. User clicks "Sign in with Microsoft/Google"
 * 2. Redirect to IdP authorization endpoint with:
 *    - client_id (your app's ID)
 *    - redirect_uri (where to come back)
 *    - scope (what permissions)
 *    - response_type (code for authorization code flow)
 *    - state (CSRF protection)
 *    - nonce (replay protection)
 * 
 * 3. User authenticates at IdP
 * 4. IdP redirects back to redirect_uri with authorization code
 * 5. Your app exchanges code for tokens (access_token, id_token, refresh_token)
 * 6. Validate id_token, extract user info
 * 7. Create/update user in your system
 * 8. Store tokens securely
 * 
 * SECURITY NOTES:
 * - NEVER store client_secret in frontend code
 * - Use PKCE (Proof Key for Code Exchange) for public clients
 * - Validate id_token signature, issuer, audience, expiry
 * - Use secure, httpOnly cookies or in-memory storage for tokens
 */

/**
 * Supported identity providers
 */
export type OidcProvider = 'microsoft' | 'google' | 'auth0' | 'okta' | 'custom';

/**
 * OAuth response type
 */
export type OAuthResponseType = 'code' | 'token' | 'id_token' | 'code id_token';

/**
 * OAuth grant type
 */
export type OAuthGrantType = 'authorization_code' | 'refresh_token' | 'client_credentials';

/**
 * Provider-specific configuration
 */
export interface OidcProviderConfig {
  /**
   * Provider identifier
   */
  provider: OidcProvider;

  /**
   * Whether this provider is enabled
   */
  enabled: boolean;

  /**
   * Application/Client ID (from provider's developer console)
   * 
   * Microsoft: "Application (client) ID" from Azure AD App Registration
   * Google: "Client ID" from Google Cloud Console
   */
  clientId: string;

  /**
   * Authorization endpoint URL
   * 
   * Microsoft: https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize
   * Google: https://accounts.google.com/o/oauth2/v2/auth
   */
  authorizeUrl: string;

  /**
   * Token endpoint URL (for exchanging code for tokens)
   * 
   * Microsoft: https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token
   * Google: https://oauth2.googleapis.com/token
   * 
   * Note: For public clients (SPA), token exchange should happen server-side
   * or use PKCE flow
   */
  tokenUrl: string;

  /**
   * User info endpoint (optional, info usually in id_token)
   */
  userInfoUrl?: string;

  /**
   * Logout/end session endpoint
   */
  logoutUrl?: string;

  /**
   * Token revocation endpoint (RFC 7009)
   * 
   * Microsoft: Not standard - use logout endpoint
   * Google: https://oauth2.googleapis.com/revoke
   * Auth0: https://{domain}/oauth/revoke
   * 
   * Used to invalidate access/refresh tokens server-side
   */
  revocationUrl?: string;

  /**
   * OAuth scopes to request
   * 
   * Microsoft: "openid profile email User.Read"
   * Google: "openid profile email"
   */
  scopes: string[];

  /**
   * Response type
   * Use "code" for authorization code flow (recommended)
   */
  responseType: OAuthResponseType;

  /**
   * Redirect URI after authentication
   * Must match exactly what's registered in provider's console
   */
  redirectUri: string;

  /**
   * Post-logout redirect URI
   */
  postLogoutRedirectUri?: string;

  /**
   * Use PKCE (Proof Key for Code Exchange)
   * Required for public clients (SPAs)
   */
  usePkce: boolean;

  /**
   * Additional parameters to include in authorization request
   */
  additionalParams?: Record<string, string>;

  /**
   * Display name for UI buttons
   */
  displayName: string;

  /**
   * Icon class for UI buttons
   */
  icon: string;

  /**
   * Button color/style
   */
  buttonClass: string;
}

/**
 * Microsoft-specific configuration
 */
export interface MicrosoftOidcConfig extends OidcProviderConfig {
  provider: 'microsoft';
  
  /**
   * Azure AD tenant ID
   * Use "common" for multi-tenant, "consumers" for personal accounts only,
   * "organizations" for work/school only, or specific tenant ID
   */
  tenantId: string;

  /**
   * Authority URL
   * https://login.microsoftonline.com/{tenantId}
   */
  authority: string;
}

/**
 * Google-specific configuration
 */
export interface GoogleOidcConfig extends OidcProviderConfig {
  provider: 'google';

  /**
   * Google Cloud project ID (for reference)
   */
  projectId?: string;
}

/**
 * Complete OIDC configuration
 */
export interface OidcConfiguration {
  /**
   * Available providers
   */
  providers: OidcProviderConfig[];

  /**
   * Default provider (for single sign-on scenarios)
   */
  defaultProvider?: OidcProvider;

  /**
   * Whether to allow local username/password login
   * Set to false to force OIDC-only authentication
   */
  allowLocalLogin: boolean;

  /**
   * Token storage strategy
   * - 'memory': Most secure, lost on refresh (use with refresh tokens)
   * - 'session': Cleared when browser closes
   * - 'local': Persists across sessions (least secure)
   */
  tokenStorage: 'memory' | 'session' | 'local';

  /**
   * Token refresh threshold in seconds
   * Refresh tokens this many seconds before expiry
   */
  refreshThresholdSeconds: number;

  /**
   * Callback route path (e.g., "/auth/callback")
   */
  callbackRoute: string;

  /**
   * Silent refresh route (for iframe-based token refresh)
   */
  silentRefreshRoute?: string;
}

/**
 * Default configurations for providers
 */
export const DEFAULT_MICROSOFT_CONFIG: Partial<MicrosoftOidcConfig> = {
  provider: 'microsoft',
  authorizeUrl: 'https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/authorize',
  tokenUrl: 'https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token',
  logoutUrl: 'https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/logout',
  // Microsoft doesn't have a standard revocation endpoint - use logout
  revocationUrl: undefined,
  scopes: ['openid', 'profile', 'email', 'User.Read'],
  responseType: 'code',
  usePkce: true,
  displayName: 'Microsoft',
  icon: 'ri-microsoft-fill',
  buttonClass: 'btn-microsoft'
};

export const DEFAULT_GOOGLE_CONFIG: Partial<GoogleOidcConfig> = {
  provider: 'google',
  authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  userInfoUrl: 'https://openidconnect.googleapis.com/v1/userinfo',
  logoutUrl: 'https://accounts.google.com/logout',
  // Google supports token revocation via RFC 7009
  revocationUrl: 'https://oauth2.googleapis.com/revoke',
  scopes: ['openid', 'profile', 'email'],
  responseType: 'code',
  usePkce: true,
  displayName: 'Google',
  icon: 'ri-google-fill',
  buttonClass: 'btn-google'
};
