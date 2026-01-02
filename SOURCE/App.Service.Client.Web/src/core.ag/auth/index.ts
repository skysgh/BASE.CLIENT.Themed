/**
 * Core.ag Auth Module
 * 
 * Angular-specific authentication components and services.
 * 
 * ARCHITECTURE:
 * - core/auth/models/ → Angular-agnostic models (stay in core)
 * - core/auth/providers/ → Provider interfaces (stay in core)
 * - core.ag/auth/ui/widgets/ → Angular components (HERE)
 * - core.ag/auth/services/ → Angular services (HERE)
 * 
 * Components:
 * - AuthProviderListComponent: Shows enabled identity providers
 * - EmailLoginFormComponent: Email/password form
 * - AuthCallbackComponent: OIDC redirect handler
 * 
 * Services:
 * - OidcService: OIDC authentication service
 */

// Components
export * from './components';

// Services  
export * from './services';
