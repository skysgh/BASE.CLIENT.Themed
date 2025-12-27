/**
 * Core Tokens Barrel Export
 * 
 * Centralizes all DI tokens defined in the core tier.
 * 
 * Architecture:
 * - Core tier defines token interfaces and default factories
 * - Higher tiers (apps.bootstrap, sites.app) can override with providers
 * - Consumer tiers (themes, sites) inject tokens without knowing source
 */

export * from './resource.tokens';
