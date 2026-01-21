/**
 * Hub Tile Header Component
 * 
 * A reusable header section for tiles/widgets across all hubs.
 * Provides consistent layout for icon, title, description, stats, and badges.
 * 
 * Usage:
 * ```html
 * <!-- Basic usage -->
 * <app-hub-tile-header
 *   icon="bx-planet"
 *   iconBackground="bg-warning-subtle text-warning"
 *   title="Astronomy"
 *   subtitle="Star systems & planets"
 *   [value]="3"
 *   valueLabel="Star systems"
 *   [badges]="[{ text: '0 planets', class: 'bg-info-subtle text-info' }]">
 * </app-hub-tile-header>
 * 
 * <!-- With tile data -->
 * <app-hub-tile-header [tile]="universalTile"></app-hub-tile-header>
 * 
 * <!-- With custom content below -->
 * <app-hub-tile-header [tile]="tile">
 *   <div class="custom-content">...</div>
 * </app-hub-tile-header>
 * ```
 * 
 * Features:
 * - Icon with customizable background
 * - Title and subtitle
 * - Animated value counter (via StatCounterComponent)
 * - Up to 4 badges displayed beside the value
 * - Content projection for custom additions
 * - Can accept IUniversalTile directly
 */
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IUniversalTile, ITileBadge } from '../../../../core/models/presentation';
import { StatCounterComponent } from '../stat-counter';

/**
 * Badge configuration for tile header
 * @deprecated Use ITileBadge from core/models/presentation instead
 */
export type ITileHeaderBadge = ITileBadge;

/**
 * Re-export for backward compatibility
 * @deprecated Use HubTileHeaderComponent instead
 */
export { HubTileHeaderComponent as TileHeaderComponent };

@Component({
  selector: 'app-hub-tile-header',
  standalone: true,
  imports: [CommonModule, StatCounterComponent],
  templateUrl: './component.html',
  styles: [`
    .tile-header {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .tile-header__top {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
    }
    
    .tile-header__icon {
      width: 40px;
      height: 40px;
      min-width: 40px;
      border-radius: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      transition: transform 0.2s ease;
    }
    
    .tile-header__text {
      flex: 1;
      min-width: 0;
    }
    
    .tile-header__title {
      font-weight: 600;
      margin-bottom: 0.125rem;
      color: var(--vz-heading-color);
      font-size: 0.9375rem;
      line-height: 1.3;
    }
    
    .tile-header__subtitle {
      font-size: 0.8125rem;
      color: var(--vz-secondary-color);
      margin: 0;
      line-height: 1.4;
    }
    
    .tile-header__stats {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 0.5rem;
    }
    
    .tile-header__badges {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.25rem;
    }
    
    .tile-header__badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
    }
  `]
})
export class HubTileHeaderComponent implements OnChanges {
  // ?????????????????????????????????????????????????????????????
  // Inputs - Individual properties
  // ?????????????????????????????????????????????????????????????
  
  /** Icon class (e.g., 'bx-planet', 'bxs-star') */
  @Input() icon = '';
  
  /** Icon background classes (e.g., 'bg-warning-subtle text-warning') */
  @Input() iconBackground = 'bg-primary-subtle text-primary';
  
  /** Title text */
  @Input() title = '';
  
  /** Subtitle/description text */
  @Input() subtitle = '';
  
  /** Main value to display (uses CountUp animation) */
  @Input() value?: number | string;
  
  /** Label below the value */
  @Input() valueLabel = '';
  
  /** Array of badges (max 4) to display beside the value */
  @Input() badges: ITileHeaderBadge[] = [];
  
  /** Whether to show the value/stats row (default: true) */
  @Input() showValue = true;
  
  // ?????????????????????????????????????????????????????????????
  // Input - IUniversalTile (alternative to individual props)
  // ?????????????????????????????????????????????????????????????
  
  /** Universal tile data (can be used instead of individual inputs) */
  @Input() tile?: IUniversalTile;

  // ?????????????????????????????????????????????????????????????
  // Resolved values (tile data takes precedence if provided)
  // ?????????????????????????????????????????????????????????????
  
  resolvedIcon = '';
  resolvedIconBackground = '';
  resolvedTitle = '';
  resolvedSubtitle = '';
  resolvedValue?: number | string;
  resolvedValueLabel = '';
  resolvedBadges: ITileHeaderBadge[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.resolveValues();
  }

  private resolveValues(): void {
    // Icon
    const tileIcon = this.tile?.icon ?? '';
    this.resolvedIcon = this.icon || tileIcon;
    
    // Icon background
    const tileIconBg = this.tile?.iconBackground ?? 
      (this.tile?.iconColor ? `bg-${this.tile.iconColor}-subtle text-${this.tile.iconColor}` : '');
    this.resolvedIconBackground = this.iconBackground !== 'bg-primary-subtle text-primary' 
      ? this.iconBackground 
      : (tileIconBg || this.iconBackground);
    
    // Title
    this.resolvedTitle = this.title || this.tile?.title || '';
    
    // Subtitle
    this.resolvedSubtitle = this.subtitle || this.tile?.subtitle || this.tile?.description || '';
    
    // Value
    this.resolvedValue = this.value ?? this.tile?.value;
    
    // Value label
    this.resolvedValueLabel = this.valueLabel || this.tile?.valueLabel || '';
    
    // Badges (individual input takes precedence, limit to 4)
    this.resolvedBadges = (this.badges.length > 0 ? this.badges : []).slice(0, 4);
  }

  /** Get formatted icon classes (handles bx- prefix) */
  get iconClasses(): string {
    if (!this.resolvedIcon) return '';
    if (this.resolvedIcon.startsWith('bx-') || this.resolvedIcon.startsWith('bxs-')) {
      return `bx ${this.resolvedIcon}`;
    }
    return this.resolvedIcon;
  }

  /** Check if we have a value to display */
  get hasValue(): boolean {
    return this.showValue && this.resolvedValue !== undefined && this.resolvedValue !== null;
  }

  /** Check if we have badges to display */
  get hasBadges(): boolean {
    return this.showValue && this.resolvedBadges.length > 0;
  }

  /** Check if we should show the stats row */
  get hasStats(): boolean {
    return this.showValue && (this.hasValue || this.hasBadges);
  }
}
