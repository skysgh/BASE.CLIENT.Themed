/**
 * Responsive Editor Module
 * 
 * Provides infrastructure for responsive editing that works across all viewports:
 * - Desktop/Tablet: Slide-in panel
 * - Mobile: Full-page navigation
 * 
 * Components:
 * - ResponsiveEditorHostComponent: Container that handles mode switching
 * - ResponsiveEditorPageComponent: Full-page wrapper for mobile mode
 * - ResponsiveEditorContentDirective: Template marker for content
 * 
 * Services:
 * - BreakpointService: Reactive viewport detection (from core/services)
 */
export { ResponsiveEditorHostComponent } from './responsive-editor-host.component';
export { ResponsiveEditorPageComponent } from './responsive-editor-page.component';
export { ResponsiveEditorContentDirective } from './responsive-editor-content.directive';

// Re-export breakpoint service for convenience
export { BreakpointService, BreakpointMode, BreakpointConfig } from '../../../../core/services/breakpoint.service';
