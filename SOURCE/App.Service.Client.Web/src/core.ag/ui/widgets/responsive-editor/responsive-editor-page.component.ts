/**
 * Responsive Editor Page Component
 * 
 * Full-page wrapper for editor content when in mobile/route mode.
 * Provides consistent header with back navigation and action buttons.
 * 
 * This component is used as the route target when ResponsiveEditorHost
 * navigates to a child route on mobile devices.
 * 
 * Usage in routes:
 * ```typescript
 * {
 *   path: 'colors/:tier',
 *   component: ResponsiveEditorPageComponent,
 *   data: { 
 *     title: 'Edit Color',
 *     editorComponent: ColorPickerComponent 
 *   }
 * }
 * ```
 * 
 * Or with dynamic content:
 * ```html
 * <app-responsive-editor-page 
 *   [title]="'Edit Color'"
 *   (saved)="onSaved()"
 *   (cancelled)="onBack()">
 *   <app-color-picker [color]="color"></app-color-picker>
 * </app-responsive-editor-page>
 * ```
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
selector: 'app-responsive-editor-page',
standalone: true,
imports: [CommonModule, RouterModule],
templateUrl: './responsive-editor-page.component.html',
styles: [`
    .responsive-editor-page {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: var(--vz-body-bg);
    }
    
    .editor-header {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      background-color: var(--vz-card-bg);
      border-bottom: 1px solid var(--vz-border-color);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .editor-content {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
    }
    
    .header-actions {
      display: flex;
      align-items: center;
    }
  `]
})
export class ResponsiveEditorPageComponent {
  @Input() title = 'Edit';
  @Input() showActions = true;
  @Input() saveLabel = 'Save';
  @Input() cancelLabel = 'Cancel';
  
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  constructor(private location: Location) {}

  onBack(): void {
    this.back.emit();
    this.location.back();
  }

  onSave(): void {
    this.saved.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
    this.location.back();
  }
}
