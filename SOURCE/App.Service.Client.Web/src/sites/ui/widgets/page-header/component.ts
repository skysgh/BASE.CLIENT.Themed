/**
 * Page Header Component
 * 
 * Provides consistent page-level header with:
 * - Back button (left) - uses NavigationService.back()
 * - Icon + Title + Subtitle (center-left)
 * - Actions slot (right) - for page-specific buttons
 * 
 * Icon can be specified as:
 * - Font icon class: icon="bx-trash" (BoxIcons) or icon="ri-delete-bin-line" (RemixIcons)
 * - Image URL: iconUrl="/assets/icons/custom.svg"
 */
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
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
          
          <!-- Icon (font-based or image URL) -->
          @if (icon || iconUrl) {
            <div class="type-icon {{ iconBackground }}">
              @if (iconUrl) {
                <img [src]="iconUrl" [alt]="title" class="icon-img">
              } @else {
                <i class="{{ getIconClasses() }}"></i>
              }
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
      width: 40px;
      height: 40px;
      min-width: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }
    
    .icon-img {
      width: 24px;
      height: 24px;
      object-fit: contain;
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
        width: 36px;
        height: 36px;
        min-width: 36px;
        font-size: 1.125rem;
      }
      
      .icon-img {
        width: 22px;
        height: 22px;
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
  
  /** 
   * Font icon class (e.g., 'bx-trash', 'ri-settings-line')
   * Supports BoxIcons (bx-), RemixIcons (ri-), and others
   */
  @Input() icon = '';
  
  /** Image URL for custom icons (alternative to font icon) */
  @Input() iconUrl = '';
  
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
   * Emitted when back button is clicked.
   * If a handler is attached, it takes precedence over default navigation.
   * Use this for in-component mode changes (e.g., detail → browse within same page)
   */
  @Output() backClick = new EventEmitter<void>();

  /**
   * Get the full icon class string
   * Handles different icon font libraries
   */
  getIconClasses(): string {
    const classes: string[] = [];
    
    // Determine icon library and add base class if needed
    if (this.icon.startsWith('bx-') || this.icon.startsWith('bxs-') || this.icon.startsWith('bxl-')) {
      classes.push('bx');
    } else if (this.icon.startsWith('ri-')) {
      // RemixIcons don't need a base class
    } else if (this.icon.startsWith('mdi-')) {
      classes.push('mdi');
    }
    
    classes.push(this.icon);
    classes.push(this.iconClass);
    
    return classes.join(' ');
  }

  /**
     * Navigate back using smart navigation
     * If backClick has observers, emit event instead of navigating
     */
    goBack(): void {
      if (this.backClick.observed) {
        this.backClick.emit();
      } else {
        this.navService.back(this.backFallback);
      }
    }
  }
