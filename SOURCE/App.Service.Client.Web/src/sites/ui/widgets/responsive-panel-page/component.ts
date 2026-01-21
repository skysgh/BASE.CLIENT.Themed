/**
 * Responsive Panel Page Component
 * 
 * Full-page wrapper for content when in mobile/route mode.
 * Provides consistent header with back navigation and customizable actions.
 * 
 * This component is used as the route target when ResponsivePanelShell
 * navigates to a child route on mobile devices.
 * 
 * Usage:
 * ```html
 * <!-- Basic usage -->
 * <app-responsive-panel-page title="Message Details" [showActions]="false">
 *   <app-message-viewer [message]="message"></app-message-viewer>
 * </app-responsive-panel-page>
 * 
 * <!-- With custom header actions (e.g., Next/Prev) -->
 * <app-responsive-panel-page title="Message" [showActions]="false">
 *   <ng-container headerActions>
 *     <button class="btn btn-sm btn-outline-secondary" (click)="onPrev()">
 *       <i class="bx bx-chevron-left"></i>
 *     </button>
 *     <button class="btn btn-sm btn-outline-secondary" (click)="onNext()">
 *       <i class="bx bx-chevron-right"></i>
 *     </button>
 *   </ng-container>
 *   <app-message-detail [message]="message"></app-message-detail>
 * </app-responsive-panel-page>
 * ```
 */
import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * @deprecated Use ResponsivePanelPageComponent instead
 */
export { ResponsivePanelPageComponent as ResponsiveEditorPageComponent };

@Component({
  selector: 'app-responsive-panel-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="responsive-panel-page">
      <!-- Header -->
      <div class="panel-header">
        <button type="button" class="btn btn-link text-muted p-0 me-3" (click)="onBack()">
          <i class="bx bx-arrow-back fs-4"></i>
        </button>
        <h5 class="mb-0 flex-grow-1 text-truncate">{{ title }}</h5>
        
        <!-- Custom header actions (via content projection) -->
        <div class="header-actions">
          <ng-content select="[headerActions]"></ng-content>
        </div>
        
        <!-- Default save/cancel actions -->
        @if (showActions) {
          <div class="header-actions ms-2">
            <button type="button" class="btn btn-outline-secondary btn-sm me-2" (click)="onCancel()">
              {{ cancelLabel }}
            </button>
            <button type="button" class="btn btn-primary btn-sm" (click)="onSave()">
              {{ saveLabel }}
            </button>
          </div>
        }
      </div>
      
      <!-- Content -->
      <div class="panel-content">
        <ng-content></ng-content>
      </div>
      
      <!-- Optional Footer (via content projection) -->
      <div class="panel-footer" *ngIf="hasFooter">
        <ng-content select="[panelFooter]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .responsive-panel-page {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: var(--vz-body-bg);
    }
    
    .panel-header {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      background-color: var(--vz-card-bg);
      border-bottom: 1px solid var(--vz-border-color);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .panel-content {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
    }
    
    .panel-footer {
      padding: 0.75rem 1rem;
      background-color: var(--vz-card-bg);
      border-top: 1px solid var(--vz-border-color);
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
  `]
})
export class ResponsivePanelPageComponent {
  @Input() title = 'Details';
  @Input() showActions = false;  // Default false - most panels just view content
  @Input() saveLabel = 'Save';
  @Input() cancelLabel = 'Cancel';
  @Input() hasFooter = false;
  
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
