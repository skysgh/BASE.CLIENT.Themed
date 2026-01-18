/**
 * Responsive Editor Content Directive
 * 
 * Marks the content template that should be displayed inside the responsive editor.
 * Used by ResponsiveEditorHostComponent to identify the content to render.
 * 
 * Usage:
 * ```html
 * <app-responsive-editor-host ...>
 *   <ng-template responsiveEditorContent>
 *     <app-my-editor></app-my-editor>
 *   </ng-template>
 * </app-responsive-editor-host>
 * ```
 */
import { Directive } from '@angular/core';

@Directive({
  selector: '[responsiveEditorContent]',
  standalone: true
})
export class ResponsiveEditorContentDirective {}
