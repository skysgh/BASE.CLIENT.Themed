/**
 * Hub Tile Component
 * 
 * A reusable tile component for hub displays.
 * Renders a single tile based on IUniversalTile model.
 * 
 * Usage:
 * ```html
 * <app-hub-tile [tile]="starSystemTile" (tileClick)="onNavigate($event)"></app-hub-tile>
 * ```
 * 
 * Features:
 * - Consistent styling across all hubs
 * - Icon with customizable color
 * - Optional value/count display with CountUp animation (via StatCounterComponent)
 * - Hover animation
 * - Click handler for navigation
 */
import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IUniversalTile, ITileBadge } from '../../../../core/models/presentation';
import { HubTileHeaderComponent } from '../hub-tile-header';

@Component({
  selector: 'app-hub-tile',
  standalone: true,
  imports: [CommonModule, RouterModule, HubTileHeaderComponent],
  templateUrl: './component.html',
  styles: [`
    :host {
      display: block;
    }
    
    .hub-tile {
    display: block;
    text-decoration: none;
    color: inherit;
    transition: all 0.2s ease;
    border: 1px solid var(--vz-border-color);
    border-radius: 0.25rem;  /* Matches theme $border-radius */
    padding: 1rem;
    background: var(--vz-card-bg);
    height: 100%;
    position: relative;
      
    &:hover {
      border-color: var(--vz-primary);
      transform: translateY(-2px);
      /* Colored shadow matching primary - same as main hub widgets */
      box-shadow: 0 4px 12px rgba(var(--vz-primary-rgb), 0.15);
        
      .tile-icon {
        transform: scale(1.05);
      }
        
      .tile-arrow {
        opacity: 1;
        transform: translateX(0);
      }
    }
      
    &--locked {
      opacity: 0.85;
    }
  }
    
  /* TileHeader icon scaling on hover */
  .hub-tile:hover ::ng-deep .tile-header__icon {
    transform: scale(1.05);
  }
    
  .tile-lock-indicator {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    font-size: 0.75rem;
    color: var(--vz-secondary-color);
    opacity: 0.5;
  }
    
  /* Arrow indicator on hover - like main hub */
  .tile-arrow {
    position: absolute;
    right: 0.75rem;
    bottom: 0.75rem;
    opacity: 0;
    transition: all 0.2s ease;
    color: var(--vz-secondary-color);
    font-size: 1rem;
  }

  /* Size variants */
  :host(.tile-small) .hub-tile {
    padding: 0.75rem;
      
    .tile-icon {
      width: 32px;
      height: 32px;
      min-width: 32px;
      font-size: 1rem;
    }
  }
    
  :host(.tile-large) .hub-tile {
    padding: 1.25rem;
      
    .tile-icon {
      width: 48px;
      height: 48px;
      min-width: 48px;
      font-size: 1.75rem;
    }
  }
  `]
})
export class HubTileComponent {
  /**
   * The tile data to display
   */
  @Input({ required: true }) tile!: IUniversalTile;

  /**
   * Emitted when tile is clicked (for custom handling)
   */
  @Output() tileClick = new EventEmitter<IUniversalTile>();

  /**
   * Add size class to host element based on tile config
   */
  @HostBinding('class.tile-small')
  get isSmall(): boolean {
    return this.tile?.config?.size === 'small';
  }

  @HostBinding('class.tile-medium')
  get isMedium(): boolean {
    return this.tile?.config?.size === 'medium' || !this.tile?.config?.size;
  }

  @HostBinding('class.tile-large')
  get isLarge(): boolean {
    return this.tile?.config?.size === 'large';
  }

  /**
   * Get the icon background class
   */
  getIconBackgroundClass(): string {
    if (this.tile.iconBackground) {
      return this.tile.iconBackground;
    }
    // Generate from iconColor if available
    const color = this.tile.iconColor || 'secondary';
    return `bg-${color}-subtle`;
  }

  /**
   * Get the icon text color class
   */
  getIconTextClass(): string {
    const color = this.tile.iconColor || 'secondary';
    return `text-${color}`;
  }

  /**
   * Get full icon classes
   */
  getIconClasses(): string {
    const icon = this.tile.icon;
    const classes: string[] = [this.getIconTextClass()];
    
    // Determine icon library and add base class if needed
    if (icon.startsWith('bx-') || icon.startsWith('bxs-') || icon.startsWith('bxl-')) {
      classes.push('bx');
    } else if (icon.startsWith('mdi-')) {
      classes.push('mdi');
    }
    // RemixIcons (ri-) don't need a base class
    
    classes.push(icon);
    
    return classes.join(' ');
  }

  /**
   * Get the router link for navigation
   */
  getRouterLink(): string | string[] {
    return this.tile.config?.route || '/';
  }

  /**
   * Get query params if any
   */
  getQueryParams(): Record<string, string> | null {
    return this.tile.config?.queryParams || null;
  }

  /**
   * Handle click event
   */
  onClick(event: Event): void {
    if (this.tileClick.observed) {
      event.preventDefault();
      this.tileClick.emit(this.tile);
    }
    // Otherwise, let the routerLink handle navigation
  }

  /**
   * Check if tile is locked
   */
  get isLocked(): boolean {
    return this.tile.config?.locked === true;
  }

  /**
   * Check if tile has a value to display
   */
  get hasValue(): boolean {
    return this.tile.value !== undefined && this.tile.value !== null;
  }

  /**
   * Get badges from tile config (if any)
   */
  get badges(): ITileBadge[] {
    return this.tile.config?.badges || [];
  }
}
