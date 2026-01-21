/**
 * Responsive Panel Shell Module
 * 
 * Provides the shell/container for responsive panels that work across all viewports:
 * - Desktop/Tablet: Slide-in panel (offcanvas)
 * - Mobile: Full-page navigation (via ResponsivePanelPage in separate module)
 * 
 * Components:
 * - ResponsivePanelShellComponent: Container that handles mode switching
 * - ResponsivePanelContentDirective: Template marker for content
 * 
 * See also: responsive-panel-page for the mobile route target component.
 */
export { 
  ResponsivePanelShellComponent, 
  ResponsivePanelConfig,
  // Backward compatibility aliases
  ResponsiveEditorHostComponent,
  ResponsiveEditorConfig
} from './component';

export { 
  ResponsivePanelContentDirective,
  ResponsiveEditorContentDirective 
} from './content.directive';

// Re-export from separate module for convenience
export { 
  ResponsivePanelPageComponent,
  ResponsiveEditorPageComponent 
} from '../responsive-panel-page';
