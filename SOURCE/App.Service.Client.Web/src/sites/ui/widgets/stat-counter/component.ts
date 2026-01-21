/**
 * Stat Counter Component
 * 
 * A reusable animated counter for displaying statistics.
 * Uses CountUp animation for numeric values.
 * 
 * Usage:
 * ```html
 * <!-- Simple count -->
 * <app-stat-counter [value]="42"></app-stat-counter>
 * 
 * <!-- With label -->
 * <app-stat-counter [value]="42" label="Total items"></app-stat-counter>
 * 
 * <!-- Custom styling -->
 * <app-stat-counter [value]="1234" label="Users" size="large"></app-stat-counter>
 * ```
 * 
 * Features:
 * - CountUp animation from 0 to target
 * - Optional label/description
 * - Size variants (small, medium, large)
 * - Consistent styling across the app
 * - Supports decimal places
 */
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountUpModule } from 'ngx-countup';
import { CountUpOptions } from 'countup.js';

export type StatCounterSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-stat-counter',
  standalone: true,
  imports: [CommonModule, CountUpModule],
  template: `
    <div class="stat-counter" [class]="'stat-counter--' + size">
      @if (isNumeric) {
        <span 
          class="stat-counter__value" 
          [countUp]="numericValue" 
          [options]="countUpOptions">
        </span>
      } @else {
        <span class="stat-counter__value">{{ value }}</span>
      }
      @if (label) {
        <span class="stat-counter__label">{{ label }}</span>
      }
    </div>
  `,
  styles: [`
    .stat-counter {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }
    
    .stat-counter__value {
      font-weight: 600;
      color: var(--vz-heading-color);
      line-height: 1.2;
    }
    
    .stat-counter__label {
      color: var(--vz-secondary-color);
      line-height: 1.3;
    }
    
    /* Size: Small */
    .stat-counter--small {
      .stat-counter__value {
        font-size: 1rem;
        font-weight: 600;
      }
      .stat-counter__label {
        font-size: 0.6875rem;
      }
    }
    
    /* Size: Medium (default) */
    .stat-counter--medium {
      .stat-counter__value {
        font-size: 1.25rem;
        font-weight: 600;
      }
      .stat-counter__label {
        font-size: 0.75rem;
      }
    }
    
    /* Size: Large */
    .stat-counter--large {
      .stat-counter__value {
        font-size: 1.5rem;
        font-weight: 700;
      }
      .stat-counter__label {
        font-size: 0.8125rem;
      }
    }
  `]
})
export class StatCounterComponent implements OnChanges {
  /**
   * The value to display (number or string)
   */
  @Input() value: number | string = 0;

  /**
   * Label/description shown below the value
   */
  @Input() label?: string;

  /**
   * Size variant
   */
  @Input() size: StatCounterSize = 'medium';

  /**
   * Animation duration in seconds
   */
  @Input() duration = 1.5;

  /**
   * Number of decimal places
   */
  @Input() decimalPlaces = 0;

  /**
   * Prefix to show before number (e.g., '$')
   */
  @Input() prefix = '';

  /**
   * Suffix to show after number (e.g., '%')
   */
  @Input() suffix = '';

  /**
   * Whether to use thousand separators
   */
  @Input() useGrouping = true;

  /**
   * CountUp options (computed)
   */
  countUpOptions: CountUpOptions = {};

  /**
   * Check if value is numeric
   */
  get isNumeric(): boolean {
    return typeof this.value === 'number';
  }

  /**
   * Get numeric value for CountUp
   */
  get numericValue(): number {
    return typeof this.value === 'number' ? this.value : 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['duration'] || changes['decimalPlaces'] || changes['prefix'] || changes['suffix'] || changes['useGrouping']) {
      this.updateCountUpOptions();
    }
  }

  private updateCountUpOptions(): void {
    this.countUpOptions = {
      startVal: 0,
      duration: this.duration,
      useEasing: true,
      useGrouping: this.useGrouping,
      decimalPlaces: this.decimalPlaces,
      prefix: this.prefix,
      suffix: this.suffix,
    };
  }

  constructor() {
    this.updateCountUpOptions();
  }
}
