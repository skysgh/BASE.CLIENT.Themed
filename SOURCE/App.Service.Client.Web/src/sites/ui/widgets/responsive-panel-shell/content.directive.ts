/**
 * Responsive Panel Content Directive
 * 
 * Marks the content template that should be displayed inside the responsive panel.
 * Used by ResponsivePanelShellComponent to identify the content to render.
 * 
 * Usage:
 * ```html
 * <app-responsive-panel-shell ...>
 *   <ng-template responsivePanelContent>
 *     <app-my-content></app-my-content>
 *   </ng-template>
 * </app-responsive-panel-shell>
 * ```
 */
import { Directive } from '@angular/core';

/**
 * @deprecated Use ResponsivePanelContentDirective instead
 */
export { ResponsivePanelContentDirective as ResponsiveEditorContentDirective };

@Directive({
  selector: '[responsivePanelContent]',
  standalone: true
})
export class ResponsivePanelContentDirective {}
