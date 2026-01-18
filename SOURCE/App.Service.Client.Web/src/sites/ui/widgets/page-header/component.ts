/**
 * Page Header Component
 * 
 * Provides consistent page-level header with:
 * - Back button (left) - uses NavigationService.back()
 * - Icon + Title + Subtitle (center-left)
 * - Actions slot (right) - for page-specific buttons
 * 
 * Usage:
 * ```html
 * <app-page-header 
 *   title="Trash"
 *   icon="bx-trash"
 *   [subtitle]="trashService.count() + ' deleted items'">
 *   <ng-container actions>
 *     <button class="btn btn-danger" (click)="emptyTrash()">Empty Trash</button>
 *   </ng-container>
 * </app-page-header>
 * ```
 * 
 * Or with dynamic subtitle via template:
 * ```html
 * <app-page-header title="Trash" icon="bx-trash">
 *   <ng-container subtitle>{{ count }} deleted items</ng-container>
 *   <ng-container actions>...</ng-container>
 * </app-page-header>
 * ```
 */
import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../../../core/services/navigation.service';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header mb-4">
      <div class="d-flex justify-content-between align-items-start">
        <!-- Left side: Back + Icon + Title -->
        <div class="d-flex align-items-center gap-3">
          <!-- Back button -->
          @if (showBack) {
            <button 
              type="button" 
              class="btn btn-soft-primary rounded-circle back-btn"
              (click)="goBack()"
              [title]="backLabel">
              <i class="bx bx-arrow-back"></i>
            </button>
          }
          
          <!-- Icon -->
          @if (icon) {
            <div class="type-icon" [class]="iconBackground">
              <i class="bx {{ icon }}" [class]="iconClass"></i>
            </div>
          }
          
          <!-- Title & Subtitle -->
          <div>
            <h4 class="mb-1">{{ title }}</h4>
            @if (subtitle) {
              <p class="text-muted mb-0">{{ subtitle }}</p>
            } @else {
              <p class="text-muted mb-0">
                <ng-content select="[subtitle]"></ng-content>
              </p>
            }
          </div>
        </div>
        
        <!-- Right side: Actions -->
        <div class="d-flex gap-2 align-items-center page-actions">
          <ng-content select="[actions]"></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      padding: 0;
    }
    
    .back-btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      transition: all 0.2s ease;
      
      &:hover {
        transform: translateX(-2px);
      }
    }
    
    .type-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.75rem;
    }
    
    .page-actions {
      flex-wrap: wrap;
    }
    
    /* Responsive adjustments */
    @media (max-width: 576px) {
      .page-header > div {
        flex-direction: column;
        align-items: flex-start !important;
        gap: 1rem;
      }
      
      .page-actions {
        width: 100%;
        justify-content: flex-start;
      }
      
      .type-icon {
        width: 48px;
        height: 48px;
        font-size: 1.5rem;
      }
    }
  `]
})
export class PageHeaderComponent {
  private navService = inject(NavigationService);

  /** Page title */
  @Input() title = '';
  
  /** Page subtitle (or use <ng-container subtitle> for dynamic content) */
  @Input() subtitle = '';
  
  /** BoxIcons icon class (without 'bx-' prefix is fine, we add it) */
  @Input() icon = '';
  
  /** Icon background class (e.g., 'bg-primary-subtle', 'bg-danger-subtle') */
  @Input() iconBackground = 'bg-secondary-subtle';
  
  /** Icon color class (e.g., 'text-primary', 'text-danger') */
  @Input() iconClass = 'text-secondary';
  
  /** Whether to show the back button */
  @Input() showBack = true;
  
  /** Label for back button (tooltip/accessibility) */
  @Input() backLabel = 'Back';
  
  /** Fallback route if no history (passed to NavigationService.back()) */
  @Input() backFallback = 'system/hub';

  /**
   * Navigate back using smart navigation
   * - Uses browser history if available
   * - Falls back to specified route if deep-linked
   */
  goBack(): void {
    this.navService.back(this.backFallback);
  }
}
