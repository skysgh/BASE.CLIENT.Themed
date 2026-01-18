/**
 * Responsive Editor Page Component
 * 
 * Full-page wrapper for editor content when in mobile/route mode.
 * Provides consistent header with back navigation and action buttons.
 * 
 * This component is used as the route target when ResponsiveEditorHost
 * navigates to a child route on mobile devices.
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-responsive-editor-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="responsive-editor-page">
      <!-- Header -->
      <div class="editor-header">
        <button type="button" class="btn btn-link text-muted p-0 me-3" (click)="onBack()">
          <i class="bx bx-arrow-back fs-4"></i>
        </button>
        <h5 class="mb-0 flex-grow-1">{{ title }}</h5>
        <div class="header-actions" *ngIf="showActions">
          <button type="button" class="btn btn-outline-secondary btn-sm me-2" (click)="onCancel()">
            {{ cancelLabel }}
          </button>
          <button type="button" class="btn btn-primary btn-sm" (click)="onSave()">
            {{ saveLabel }}
          </button>
        </div>
      </div>
      
      <!-- Content -->
      <div class="editor-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
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
