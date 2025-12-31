/**
 * Authentication State Models
 * 
 * Defines the authenticated user and session state.
 */

/**
 * Authenticated user from OIDC provider
 */
export interface AuthenticatedUser {
  /**
   * Unique identifier from the provider
   * Microsoft: "oid" claim (object ID)
   * Google: "sub" claim (subject)
   */
  id: string;

  /**
   * User's email address
   */
  email: string;

  /**
   * Display name
   */
  displayName: string;

  /**
   * First name (given_name claim)
   */
  firstName?: string;

  /**
   * Last name (family_name claim)
   */
  lastName?: string;

  /**
   * Profile picture URL
   */
  picture?: string;

  /**
   * Whether email is verified
   */
  emailVerified: boolean;

  /**
   * Provider that authenticated this user
   */
  provider: string;

  /**
   * Provider-specific user ID (for linking accounts)
   */
  providerId: string;

  /**
   * Raw claims from the id_token (for debugging/advanced use)
   */
  claims?: Record<string, unknown>;
}

/**
 * Token set returned from authentication
 */
export interface TokenSet {
  /**
   * Access token for API calls
   */
  accessToken: string;

  /**
   * ID token containing user claims (JWT)
   */
  idToken: string;

  /**
   * Refresh token for getting new access tokens
   * May not be present for all providers/configs
   */
  refreshToken?: string;

  /**
   * Token type (usually "Bearer")
   */
  tokenType: string;

  /**
   * Access token expiry (seconds from now)
   */
  expiresIn: number;

  /**
   * Actual expiry timestamp
   */
  expiresAt: Date;

  /**
   * Scopes that were granted
   */
  scope: string;
}

/**
 * Authentication session state
 */
export interface AuthSession {
  /**
   * Whether user is authenticated
   */
  isAuthenticated: boolean;

  /**
   * Authenticated user (null if not authenticated)
   */
  user: AuthenticatedUser | null;

  /**
   * Current tokens (null if not authenticated)
   * Note: In production, consider NOT storing full tokens in state
   */
  tokens: TokenSet | null;

  /**
   * Whether authentication is in progress
   */
  loading: boolean;

  /**
   * Last authentication error
   */
  error: string | null;

  /**
   * Session start time
   */
  sessionStartedAt: Date | null;

  /**
   * Last activity time (for idle timeout)
   */
  lastActivityAt: Date | null;
}

/**
 * Initial/empty auth session
 */
export const INITIAL_AUTH_SESSION: AuthSession = {
  isAuthenticated: false,
  user: null,
  tokens: null,
  loading: false,
  error: null,
  sessionStartedAt: null,
  lastActivityAt: null
};

/**
 * PKCE parameters for authorization code flow
 */
export interface PkceParams {
  /**
   * Code verifier (random string, stored locally)
   */
  codeVerifier: string;

  /**
   * Code challenge (SHA256 hash of verifier, sent to IdP)
   */
  codeChallenge: string;

  /**
   * Challenge method (always "S256")
   */
  codeChallengeMethod: 'S256';
}

/**
 * Authorization request state (stored during redirect)
 */
export interface AuthRequestState {
  /**
   * CSRF protection state parameter
   */
  state: string;

  /**
   * Nonce for replay protection
   */
  nonce: string;

  /**
   * PKCE parameters
   */
  pkce?: PkceParams;

  /**
   * Where to redirect after successful auth
   */
  returnUrl: string;

  /**
   * Provider being used
   */
  provider: string;

  /**
   * Request timestamp
   */
  timestamp: number;
}
