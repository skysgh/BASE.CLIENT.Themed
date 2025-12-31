/**
 * Microsoft Authentication Provider (MSAL)
 * 
 * PLACEHOLDER: This is a skeleton that will work once you:
 * 1. Install @azure/msal-browser: npm install @azure/msal-browser
 * 2. Register an app in Azure AD: https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps
 * 3. Configure the app with your client ID and redirect URIs
 * 
 * AZURE AD APP REGISTRATION STEPS:
 * 
 * 1. Go to Azure Portal → Azure Active Directory → App registrations
 * 2. Click "New registration"
 * 3. Name: "Your App Name"
 * 4. Supported account types:
 *    - "Personal Microsoft accounts only" for consumer apps
 *    - "Accounts in any organizational directory and personal Microsoft accounts" for both
 * 5. Redirect URI: 
 *    - Type: "Single-page application (SPA)"
 *    - URI: http://localhost:4200/auth/callback (for dev)
 *    - Add production URLs too
 * 6. After creation, note the:
 *    - Application (client) ID → This is your clientId
 *    - Directory (tenant) ID → Use "common" or "consumers" for personal accounts
 * 7. Under "Authentication":
 *    - Enable "Access tokens" and "ID tokens" under Implicit grant
 *    - (Or keep them off if using PKCE only - recommended)
 * 8. Under "API permissions":
 *    - Add: Microsoft Graph → User.Read (delegated)
 *    - Grant admin consent if needed
 * 
 * CONFIGURATION EXAMPLE:
 * ```typescript
 * {
 *   provider: 'microsoft',
 *   enabled: true,
 *   clientId: 'YOUR-CLIENT-ID-FROM-AZURE',
 *   tenantId: 'consumers', // or 'common' or specific tenant ID
 *   authority: 'https://login.microsoftonline.com/consumers',
 *   redirectUri: 'http://localhost:4200/auth/callback',
 *   scopes: ['openid', 'profile', 'email', 'User.Read'],
 *   // ... other config
 * }
 * ```
 */
import { BaseAuthProvider } from './auth-provider.interface';
import { OidcProviderConfig, MicrosoftOidcConfig } from '../models/oidc-config.model';
import { AuthenticatedUser, TokenSet, AuthRequestState } from '../models/auth-state.model';

/**
 * Microsoft/MSAL Auth Provider
 * 
 * TODO: Uncomment MSAL code when you install @azure/msal-browser
 */
export class MicrosoftAuthProvider extends BaseAuthProvider {
  readonly providerId = 'microsoft';

  // TODO: Uncomment when MSAL is installed
  // private msalInstance: msal.PublicClientApplication | null = null;

  protected async doInitialize(config: OidcProviderConfig): Promise<void> {
    const msConfig = config as MicrosoftOidcConfig;
    
    console.log('[MicrosoftAuthProvider] Initializing with config:', {
      clientId: msConfig.clientId,
      tenantId: msConfig.tenantId,
      authority: msConfig.authority
    });

    // TODO: Initialize MSAL when library is installed
    /*
    const msalConfig: msal.Configuration = {
      auth: {
        clientId: msConfig.clientId,
        authority: msConfig.authority || `https://login.microsoftonline.com/${msConfig.tenantId}`,
        redirectUri: msConfig.redirectUri,
        postLogoutRedirectUri: msConfig.postLogoutRedirectUri
      },
      cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false
      }
    };

    this.msalInstance = new msal.PublicClientApplication(msalConfig);
    await this.msalInstance.initialize();
    */
  }

  async initiateLogin(state: AuthRequestState): Promise<string | null> {
    // TODO: Use MSAL's loginRedirect when installed
    /*
    const loginRequest: msal.RedirectRequest = {
      scopes: this.config!.scopes,
      state: state.state,
      nonce: state.nonce,
      redirectUri: this.config!.redirectUri
    };

    await this.msalInstance!.loginRedirect(loginRequest);
    return null; // MSAL handles the redirect
    */

    // Placeholder: Build URL manually (without MSAL)
    console.warn('[MicrosoftAuthProvider] MSAL not installed - using manual redirect');
    return null; // OidcService will build the URL
  }

  async handleCallback(code: string, state: string): Promise<{ user: AuthenticatedUser; tokens: TokenSet }> {
    // TODO: Use MSAL's handleRedirectPromise when installed
    /*
    const result = await this.msalInstance!.handleRedirectPromise();
    if (!result) {
      throw new Error('No authentication result');
    }

    const user = this.parseIdToken(result.idToken);
    const tokens: TokenSet = {
      accessToken: result.accessToken,
      idToken: result.idToken,
      tokenType: result.tokenType,
      expiresIn: (result.expiresOn!.getTime() - Date.now()) / 1000,
      expiresAt: result.expiresOn!,
      scope: result.scopes.join(' ')
    };

    return { user, tokens };
    */

    throw new Error('MSAL not installed. Run: npm install @azure/msal-browser');
  }

  async silentRefresh(): Promise<TokenSet> {
    // TODO: Use MSAL's acquireTokenSilent when installed
    throw new Error('MSAL not installed. Run: npm install @azure/msal-browser');
  }

  async logout(): Promise<string | null> {
    // TODO: Use MSAL's logout when installed
    /*
    const logoutRequest: msal.EndSessionRequest = {
      postLogoutRedirectUri: this.config!.postLogoutRedirectUri
    };
    await this.msalInstance!.logoutRedirect(logoutRequest);
    return null;
    */

    throw new Error('MSAL not installed. Run: npm install @azure/msal-browser');
  }

  async getAccessToken(): Promise<string | null> {
    // TODO: Use MSAL's acquireTokenSilent when installed
    return null;
  }
}
