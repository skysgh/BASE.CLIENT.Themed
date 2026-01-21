/**
 * Breadcrumbs Component
 * 
 * A reusable breadcrumb trail component that can be:
 * - Auto-populated from NavigationTreeService (default)
 * - Manually provided via [items] input
 * 
 * Usage:
 * ```html
 * <!-- Auto-populate from navigation service -->
 * <app-breadcrumbs></app-breadcrumbs>
 * 
 * <!-- Manual items -->
 * <app-breadcrumbs [items]="myBreadcrumbs"></app-breadcrumbs>
 * ```
 */
import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationTreeService } from '../../../../core/navigation/navigation-tree.service';

/**
 * Breadcrumb item model
 */
export interface BreadcrumbItem {
  /** Display label */
  label: string;
  /** Route path (array or string) */
  path?: string | string[];
  /** Icon class (optional) */
  icon?: string;
  /** Is this the active/current page? */
  active?: boolean;
}

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './component.html',
  styles: [`
    .breadcrumb-nav {
      font-size: 0.875rem;
    }
    
    .breadcrumb {
      background: transparent;
      padding: 0;
      margin-bottom: 0;
    }
    
    .breadcrumb-item a {
      color: var(--vz-secondary);
      text-decoration: none;
      transition: color 0.15s ease;
    }
    
    .breadcrumb-item a:hover {
      color: var(--vz-primary);
    }
    
    .breadcrumb-item.active {
      color: var(--vz-body-color);
    }
    
    .breadcrumb-icon {
      margin-right: 0.25rem;
    }

    /* Responsive adjustments */
    @media (max-width: 576px) {
      .breadcrumb-nav {
        font-size: 0.75rem;
      }
    }
  `]
})
export class BreadcrumbsComponent {
  private navTreeService = inject(NavigationTreeService);

  /**
   * Manually provided breadcrumb items.
   * If provided, these take precedence over auto-generated breadcrumbs.
   */
  @Input() items?: BreadcrumbItem[];

  /**
   * Minimum number of items to show breadcrumbs.
   * Default is 2 (only show if more than just the current page).
   */
  @Input() minItems = 2;

  /**
   * Auto-generated breadcrumbs from navigation service.
   * Only used when [items] is not provided.
   */
  private autoBreadcrumbs = toSignal(this.navTreeService.getBreadcrumbs$(), { initialValue: [] });

  /**
   * Get the breadcrumb items to display.
   * Returns manual items if provided, otherwise auto-generated.
   */
  get breadcrumbs(): BreadcrumbItem[] {
    return this.items ?? this.autoBreadcrumbs() ?? [];
  }

  /**
   * Check if breadcrumbs should be displayed
   */
  get shouldShow(): boolean {
    return this.breadcrumbs.length >= this.minItems;
  }

  /**
   * Get icon classes for a breadcrumb item.
   * Handles different icon font libraries.
   */
  getIconClasses(icon: string): string {
    const classes: string[] = ['breadcrumb-icon'];
    
    // Determine icon library and add base class if needed
    if (icon.startsWith('bx-') || icon.startsWith('bxs-') || icon.startsWith('bxl-')) {
      classes.push('bx');
    } else if (icon.startsWith('bx ')) {
      // Already has base class, just add the icon
      return icon + ' breadcrumb-icon';
    } else if (icon.startsWith('ri-')) {
      // RemixIcons don't need a base class
    } else if (icon.startsWith('mdi-')) {
      classes.push('mdi');
    }
    
    classes.push(icon);
    
    return classes.join(' ');
  }
}
