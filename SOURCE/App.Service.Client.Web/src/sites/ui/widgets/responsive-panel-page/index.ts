/**
 * Responsive Panel Page - Public API
 * 
 * Full-page wrapper for content when in mobile/route mode.
 * Used as the route target when ResponsivePanelShell navigates on mobile.
 * 
 * Features:
 * - Back navigation
 * - Custom header actions (via [headerActions] content projection)
 * - Optional save/cancel buttons
 * - Optional footer (via [panelFooter] content projection)
 */
export { 
  ResponsivePanelPageComponent,
  ResponsiveEditorPageComponent  // backward compat
} from './component';
