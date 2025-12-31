/**
 * Core Auth Module
 * 
 * OIDC/OAuth2 authentication for the application.
 * 
 * USAGE:
 * 1. Configure providers in environment.ts or config.json
 * 2. Set environment.defaultauth = 'oidc'
 * 3. Register AuthModule in your app
 * 4. Add callback route to routing
 * 5. Use OidcService.login('microsoft') or OidcService.login('google')
 * 
 * EXPORTS:
 * - Models: OidcConfiguration, AuthenticatedUser, TokenSet, etc.
 * - Services: OidcService
 * - Providers: IAuthProvider, MicrosoftAuthProvider, GoogleAuthProvider
 * - Components: AuthCallbackComponent
 */

// Models
export * from './models';

// Services
export * from './services';

// Providers
export * from './providers';

// Components
export * from './components';
