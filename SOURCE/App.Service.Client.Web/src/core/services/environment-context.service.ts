/**
 * Environment Context Service
 * 
 * Combines device detection with runtime context for adaptive UI decisions.
 * 
 * USAGE:
 * - Determine pagination mode (infinite for touch, paged for desktop)
 * - Determine tap target sizes (larger for coarse pointers)
 * - Determine animation behavior (reduce for accessibility)
 * - Determine color scheme (dark mode support)
 * 
 * This service provides a unified API for context-aware UI adaptations.
 */

import { Injectable, signal, computed } from '@angular/core';
import { SystemEnvironmentService, DeviceContext, InputType } from './system.environment.service';

/**
 * UI Adaptation hints based on current context
 */
export interface UIAdaptationHints {
  /** Use larger touch targets? */
  useLargeTouchTargets: boolean;
  
  /** Prefer infinite scroll over pagination? */
  preferInfiniteScroll: boolean;
  
  /** Reduce animations? */
  reduceMotion: boolean;
  
  /** Use dark color scheme? */
  useDarkMode: boolean;
  
  /** Compact layout (mobile)? */
  useCompactLayout: boolean;
  
  /** Show keyboard shortcuts in tooltips? */
  showKeyboardShortcuts: boolean;
  
  /** Optimal items per row for cards */
  optimalCardsPerRow: number;
  
  /** Optimal page size */
  optimalPageSize: number;
}

/**
 * Environment Context Service
 * 
 * Provides context-aware UI adaptation hints.
 */
@Injectable({ providedIn: 'root' })
export class EnvironmentContextService {
  
  private envService: SystemEnvironmentService;
  
  /** Current device context */
  readonly deviceContext = signal<DeviceContext | null>(null);
  
  /** UI adaptation hints (computed from device context) */
  readonly hints = computed<UIAdaptationHints>(() => {
    const ctx = this.deviceContext();
    if (!ctx) {
      return this.getDefaultHints();
    }
    return this.computeHints(ctx);
  });
  
  constructor(envService: SystemEnvironmentService) {
    this.envService = envService;
    
    // Initialize with current context
    this.deviceContext.set(this.envService.deviceContext);
    
    // Subscribe to device context changes
    this.envService.deviceContext$.subscribe(ctx => {
      this.deviceContext.set(ctx);
    });
  }
  
  // ─────────────────────────────────────────────────────────────────────────────
  // DEVICE CONTEXT (delegated to SystemEnvironmentService)
  // ─────────────────────────────────────────────────────────────────────────────
  
  /** Is touch device? */
  get isTouchDevice(): boolean {
    return this.deviceContext()?.isTouchDevice ?? false;
  }
  
  /** Is coarse pointer (finger)? */
  get isCoarsePointer(): boolean {
    return this.deviceContext()?.isCoarsePointer ?? false;
  }
  
  /** Can hover? */
  get canHover(): boolean {
    return this.deviceContext()?.canHover ?? true;
  }
  
  /** Last input type */
  get lastInputType(): InputType {
    return this.deviceContext()?.lastInputType ?? 'unknown';
  }
  
  /** Is mobile viewport? */
  get isMobile(): boolean {
    return this.deviceContext()?.isMobileViewport ?? false;
  }
  
  /** Is tablet viewport? */
  get isTablet(): boolean {
    return this.deviceContext()?.isTabletViewport ?? false;
  }
  
  /** Is desktop viewport? */
  get isDesktop(): boolean {
    return this.deviceContext()?.isDesktopViewport ?? true;
  }
  
  /** Prefers reduced motion? */
  get prefersReducedMotion(): boolean {
    return this.deviceContext()?.prefersReducedMotion ?? false;
  }
  
  /** Prefers dark mode? */
  get prefersDarkMode(): boolean {
    return this.deviceContext()?.prefersDarkMode ?? false;
  }
  
  // ─────────────────────────────────────────────────────────────────────────────
  // UI ADAPTATION HINTS
  // ─────────────────────────────────────────────────────────────────────────────
  
  /**
   * Get pagination mode for current context
   */
  getPaginationMode(): 'paged' | 'infinite' {
    // Touch devices prefer infinite scroll
    if (this.isCoarsePointer || this.isTouchDevice) {
      return 'infinite';
    }
    // Desktop with hover prefers paged
    return 'paged';
  }
  
  /**
   * Get optimal page size based on viewport
   */
  getOptimalPageSize(): number {
    const ctx = this.deviceContext();
    if (!ctx) return 25;
    
    if (ctx.isMobileViewport) return 10;
    if (ctx.isTabletViewport) return 20;
    return 25;
  }
  
  /**
   * Get optimal cards per row based on viewport
   */
  getCardsPerRow(): number {
    const ctx = this.deviceContext();
    if (!ctx) return 4;
    
    if (ctx.isMobileViewport) return 1;
    if (ctx.isTabletViewport) return 2;
    if (ctx.viewportWidth < 1400) return 3;
    return 4;
  }
  
  /**
   * Should show feature based on device capabilities?
   */
  shouldShow(feature: 'keyboardShortcuts' | 'hoverEffects' | 'tooltips' | 'animations'): boolean {
    const ctx = this.deviceContext();
    if (!ctx) return true;
    
    switch (feature) {
      case 'keyboardShortcuts':
        return !ctx.isTouchDevice && ctx.lastInputType !== 'touch';
      case 'hoverEffects':
        return ctx.canHover;
      case 'tooltips':
        return ctx.canHover; // No tooltips on touch
      case 'animations':
        return !ctx.prefersReducedMotion;
      default:
        return true;
    }
  }
  
  /**
   * Get CSS class for responsive adaptations
   */
  getAdaptiveClasses(): string[] {
    const classes: string[] = [];
    const ctx = this.deviceContext();
    if (!ctx) return classes;
    
    if (ctx.isTouchDevice) classes.push('is-touch');
    if (ctx.isCoarsePointer) classes.push('is-coarse-pointer');
    if (!ctx.canHover) classes.push('no-hover');
    if (ctx.isMobileViewport) classes.push('is-mobile');
    if (ctx.isTabletViewport) classes.push('is-tablet');
    if (ctx.isDesktopViewport) classes.push('is-desktop');
    if (ctx.prefersReducedMotion) classes.push('reduce-motion');
    if (ctx.prefersDarkMode) classes.push('prefers-dark');
    
    return classes;
  }
  
  // ─────────────────────────────────────────────────────────────────────────────
  // PRIVATE HELPERS
  // ─────────────────────────────────────────────────────────────────────────────
  
  private getDefaultHints(): UIAdaptationHints {
    return {
      useLargeTouchTargets: false,
      preferInfiniteScroll: false,
      reduceMotion: false,
      useDarkMode: false,
      useCompactLayout: false,
      showKeyboardShortcuts: true,
      optimalCardsPerRow: 4,
      optimalPageSize: 25,
    };
  }
  
  private computeHints(ctx: DeviceContext): UIAdaptationHints {
    return {
      useLargeTouchTargets: ctx.isCoarsePointer || ctx.isTouchDevice,
      preferInfiniteScroll: ctx.isCoarsePointer || ctx.isTouchDevice,
      reduceMotion: ctx.prefersReducedMotion,
      useDarkMode: ctx.prefersDarkMode,
      useCompactLayout: ctx.isMobileViewport,
      showKeyboardShortcuts: !ctx.isTouchDevice && ctx.lastInputType !== 'touch',
      optimalCardsPerRow: this.computeCardsPerRow(ctx),
      optimalPageSize: this.computePageSize(ctx),
    };
  }
  
  private computeCardsPerRow(ctx: DeviceContext): number {
    if (ctx.isMobileViewport) return 1;
    if (ctx.isTabletViewport) return 2;
    if (ctx.viewportWidth < 1400) return 3;
    return 4;
  }
  
  private computePageSize(ctx: DeviceContext): number {
    if (ctx.isMobileViewport) return 10;
    if (ctx.isTabletViewport) return 20;
    return 25;
  }
}
