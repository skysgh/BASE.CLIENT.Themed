/**
 * Breakpoint Service
 * 
 * Provides reactive breakpoint detection for responsive UI decisions.
 * Uses Bootstrap 5 breakpoints by default but can be customized.
 * 
 * Usage:
 *   breakpointService.isMobile$  → Observable<boolean>
 *   breakpointService.isTablet$  → Observable<boolean>
 *   breakpointService.isDesktop$ → Observable<boolean>
 *   breakpointService.current$   → Observable<'mobile' | 'tablet' | 'desktop'>
 * 
 * Breakpoints (Bootstrap 5):
 *   - Mobile: < 768px (xs, sm)
 *   - Tablet: 768px - 1199px (md, lg)
 *   - Desktop: >= 1200px (xl, xxl)
 */
import { Injectable, Inject, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable, fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

export type BreakpointMode = 'mobile' | 'tablet' | 'desktop';

export interface BreakpointConfig {
  /** Max width for mobile (default: 767) */
  mobileMax: number;
  /** Max width for tablet (default: 1199) */
  tabletMax: number;
}

const DEFAULT_CONFIG: BreakpointConfig = {
  mobileMax: 767,
  tabletMax: 1199,
};

@Injectable({
  providedIn: 'root'
})
export class BreakpointService implements OnDestroy {
  private config: BreakpointConfig = DEFAULT_CONFIG;
  private currentMode$ = new BehaviorSubject<BreakpointMode>(this.detectMode());
  private resizeSub?: Subscription;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.setupResizeListener();
  }

  ngOnDestroy(): void {
    this.resizeSub?.unsubscribe();
  }

  /**
   * Current breakpoint mode as observable
   */
  get current$(): Observable<BreakpointMode> {
    return this.currentMode$.asObservable().pipe(distinctUntilChanged());
  }

  /**
   * Current breakpoint mode (synchronous)
   */
  get current(): BreakpointMode {
    return this.currentMode$.value;
  }

  /**
   * True when viewport is mobile-sized
   */
  get isMobile$(): Observable<boolean> {
    return this.current$.pipe(map(mode => mode === 'mobile'));
  }

  /**
   * True when viewport is tablet-sized
   */
  get isTablet$(): Observable<boolean> {
    return this.current$.pipe(map(mode => mode === 'tablet'));
  }

  /**
   * True when viewport is desktop-sized
   */
  get isDesktop$(): Observable<boolean> {
    return this.current$.pipe(map(mode => mode === 'desktop'));
  }

  /**
   * True when viewport is mobile OR tablet (not desktop)
   */
  get isMobileOrTablet$(): Observable<boolean> {
    return this.current$.pipe(map(mode => mode !== 'desktop'));
  }

  /**
   * True when viewport is tablet OR desktop (not mobile)
   */
  get isTabletOrDesktop$(): Observable<boolean> {
    return this.current$.pipe(map(mode => mode !== 'mobile'));
  }

  /**
   * Synchronous check for mobile
   */
  get isMobile(): boolean {
    return this.current === 'mobile';
  }

  /**
   * Synchronous check for tablet
   */
  get isTablet(): boolean {
    return this.current === 'tablet';
  }

  /**
   * Synchronous check for desktop
   */
  get isDesktop(): boolean {
    return this.current === 'desktop';
  }

  /**
   * Configure custom breakpoint thresholds
   */
  configure(config: Partial<BreakpointConfig>): void {
    this.config = { ...this.config, ...config };
    this.currentMode$.next(this.detectMode());
  }

  private setupResizeListener(): void {
    if (typeof window === 'undefined') return;

    this.resizeSub = fromEvent(window, 'resize').pipe(
      debounceTime(100),
      startWith(null)
    ).subscribe(() => {
      const mode = this.detectMode();
      if (mode !== this.currentMode$.value) {
        this.currentMode$.next(mode);
      }
    });
  }

  private detectMode(): BreakpointMode {
    if (typeof window === 'undefined') return 'desktop';

    const width = window.innerWidth;

    if (width <= this.config.mobileMax) {
      return 'mobile';
    } else if (width <= this.config.tabletMax) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }
}
