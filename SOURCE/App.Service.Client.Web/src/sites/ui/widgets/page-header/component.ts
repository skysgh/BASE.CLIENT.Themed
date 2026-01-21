/**
 * Page Header Component
 * 
 * Provides consistent page-level header with:
 * - Breadcrumb trail (optional)
 * - Back button (left) - uses NavigationService.back()
 * - Icon + Title + Subtitle (center-left)
 * - Actions slot (right) - for page-specific buttons
 * 
 * Icon can be specified as:
 * - Font icon class: icon="bx-trash" (BoxIcons) or icon="ri-delete-bin-line" (RemixIcons)
 * - Image URL: iconUrl="/assets/icons/custom.svg"
 */
import { Component, Input, Output, EventEmitter, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavigationService } from '../../../../core/services/navigation.service';
import { NavigationTreeService } from '../../../../core/navigation/navigation-tree.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
selector: 'app-page-header',
standalone: true,
imports: [CommonModule, RouterModule],
templateUrl: './component.html',
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
    
        .breadcrumb-nav {
          font-size: 0.875rem;
        }
    
        .breadcrumb {
          background: transparent;
          padding: 0;
        }
    
        .breadcrumb-item a {
          color: var(--vz-secondary);
          text-decoration: none;
        }
    
        .breadcrumb-item a:hover {
          color: var(--vz-primary);
        }
    
        .breadcrumb-item.active {
          color: var(--vz-body-color);
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
      
          .breadcrumb-nav {
            font-size: 0.75rem;
          }
        }
      `]
    })
    export class PageHeaderComponent {
      private navService = inject(NavigationService);
      private navTreeService = inject(NavigationTreeService);

      // Reactive breadcrumbs from navigation service
      breadcrumbs = toSignal(this.navTreeService.getBreadcrumbs$(), { initialValue: [] });

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
  
  /** Whether to show the breadcrumb trail */
  @Input() showBreadcrumb = true;
  
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
   * Get icon classes for breadcrumb items
   * Similar to getIconClasses but for breadcrumb icons
   */
  getBreadcrumbIconClasses(icon: string): string {
    const classes: string[] = [];
    
    // Determine icon library and add base class if needed
    if (icon.startsWith('bx-') || icon.startsWith('bxs-') || icon.startsWith('bxl-')) {
      classes.push('bx');
    } else if (icon.startsWith('bx ')) {
      // Already has base class
      return icon + ' me-1';
    } else if (icon.startsWith('ri-')) {
      // RemixIcons don't need a base class
    } else if (icon.startsWith('mdi-')) {
      classes.push('mdi');
    }
    
    classes.push(icon);
    classes.push('me-1');
    
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
