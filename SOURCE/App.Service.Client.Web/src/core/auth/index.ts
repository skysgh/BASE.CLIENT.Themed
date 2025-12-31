/**
 * Core Auth Module (Angular-Agnostic)
 * 
 * Contains only Angular-agnostic code:
 * - Models (types, interfaces)
 * - Provider interfaces (abstract definitions)
 * 
 * Angular-specific code is in core.ag/auth/:
 * - Components (AuthProviderListComponent, etc.)
 * - Services (OidcService)
 * 
 * ARCHITECTURE:
 * ┌─────────────────────────────────────────────────────────┐
 * │  core/auth/           (Angular-agnostic)               │
 * │  ├── models/          Types, interfaces                │
 * │  └── providers/       Provider interface definitions   │
 * ├─────────────────────────────────────────────────────────┤
 * │  core.ag/auth/        (Angular-specific)               │
 * │  ├── components/      UI components                    │
 * │  └── services/        OidcService, etc.                │
 * └─────────────────────────────────────────────────────────┘
 */

// Models (Angular-agnostic)
export * from './models';

// Provider interfaces (Angular-agnostic)
export * from './providers';
