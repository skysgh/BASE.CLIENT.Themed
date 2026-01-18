/**
 * Sites Tier - Public API
 * 
 * This is the foundational tier for all site implementations.
 * It sits between core infrastructure and specific site implementations:
 * 
 * Architecture:
 *   core        -> Pure TypeScript (no Angular)
 *   core.ag     -> Angular infrastructure (guards, pipes, base widgets)
 *   themes      -> Visual chrome (layout, topbar, sidebar, footer)
 *   sites       -> THIS TIER: Shared site-level patterns & components
 *   sites.anon  -> Anonymous/public pages
 *   sites.app   -> Authenticated app shell
 *   sites.app.* -> Feature modules
 * 
 * This tier provides:
 * - Common page patterns (headers, shells, states)
 * - Shared UI widgets used across all sites
 * - Site-level services and utilities
 * 
 * Usage:
 *   import { SitesModule } from '../sites';
 *   // or for standalone components:
 *   import { PageHeaderComponent } from '../sites/ui/widgets';
 */

// Module
export * from './module';

// Future exports (when components are added):
// export * from './ui/widgets/page-header';
// export * from './ui/widgets/empty-state';
// export * from './ui/widgets/loading-state';
