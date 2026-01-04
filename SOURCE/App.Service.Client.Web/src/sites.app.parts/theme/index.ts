/**
 * Theme Part - Public API
 * 
 * Provides theme customization functionality including:
 * - Color palette selection (primary color)
 * - Layout preferences (sidebar, topbar)
 * - Dark/Light mode
 * - User preference persistence
 * 
 * Architecture:
 * - ThemeService: Manages preferences with localStorage + AccountService cascade
 * - Color Palette Widget: UI for selecting primary color
 * - Theme Settings View: Full settings page
 */

// Module
export * from './module';

// Services
export * from './services';

// Models
export * from './models';
