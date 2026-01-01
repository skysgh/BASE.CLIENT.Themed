// Rx:
//
// Ag:
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
// Etc:
//

// Services//
//import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
import { environment } from '../../environments/environment';
//import { appsConfiguration } from '../../sites.app/configuration/implementations/apps.configuration';

/**
 * Input type detected from user interaction
 */
export type InputType = 'mouse' | 'touch' | 'pen' | 'keyboard' | 'unknown';

/**
 * Device context information
 */
export interface DeviceContext {
  /** Is this a touch-capable device? */
  isTouchDevice: boolean;
  
  /** Is the primary pointer coarse (finger) vs fine (mouse)? */
  isCoarsePointer: boolean;
  
  /** Can the device hover? (mice can, fingers can't) */
  canHover: boolean;
  
  /** Last detected input type */
  lastInputType: InputType;
  
  /** Viewport width in pixels */
  viewportWidth: number;
  
  /** Viewport height in pixels */
  viewportHeight: number;
  
  /** Is viewport considered mobile-width? (<768px) */
  isMobileViewport: boolean;
  
  /** Is viewport considered tablet-width? (768-1024px) */
  isTabletViewport: boolean;
  
  /** Is viewport considered desktop-width? (>1024px) */
  isDesktopViewport: boolean;
  
  /** Device pixel ratio (for high-DPI detection) */
  devicePixelRatio: number;
  
  /** Prefers reduced motion (accessibility) */
  prefersReducedMotion: boolean;
  
  /** Prefers dark color scheme */
  prefersDarkMode: boolean;
}

// Describe the service:

/**
* Injectable service to describe current environment
* Indirectly (via DiagnosticsTraceService) part of the
* SystemDefaultServicesService.
 */
@Injectable({ providedIn: 'root' })

export class SystemEnvironmentService {

  //// Expose public property of
  //// system environment.
  //// From there, can get access to base service url.
  //public environment: any;

  private _lastInputType: InputType = 'unknown';
  private _deviceContext$ = new BehaviorSubject<DeviceContext>(this.buildDeviceContext());

  /**
   * Constructor
   */
  constructor(
  /*NEVER: private diagnosticsTraceService:DiagnosticsTraceService*/
    /*NEVER: private defaultServces:SystemDefaultServices*/
              ) {
    // Make system/env variables avaiable to view template (via singleton or service):
    
    //this.environment = importedSystemConst.environment;
    //this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)
    
    this.initInputTracking();
    this.initViewportTracking();
  }

  public isJsonServerContext: boolean = true;

  public getDebugLevel() {
    return environment.custom.diagnostics.level;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // DEVICE DETECTION
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Observable of device context (updates on viewport/input changes)
   */
  get deviceContext$(): Observable<DeviceContext> {
    return this._deviceContext$.asObservable();
  }

  /**
   * Current device context (synchronous)
   */
  get deviceContext(): DeviceContext {
    return this._deviceContext$.value;
  }

  /**
   * Is this a touch-capable device?
   * Uses multiple detection methods for reliability.
   */
  isTouchDevice(): boolean {
    if (typeof window === 'undefined') return false;
    
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches
    );
  }

  /**
   * Is the primary pointer coarse (finger/stylus) vs fine (mouse)?
   * Coarse pointers need larger tap targets.
   */
  isCoarsePointer(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(pointer: coarse)').matches;
  }

  /**
   * Can the primary input hover? (mouse can, touch can't)
   */
  canHover(): boolean {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(hover: hover)').matches;
  }

  /**
   * Get the last detected input type
   */
  getLastInputType(): InputType {
    return this._lastInputType;
  }

  /**
   * Is viewport in mobile range? (<768px)
   */
  isMobileViewport(): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }

  /**
   * Is viewport in tablet range? (768-1024px)
   */
  isTabletViewport(): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= 768 && window.innerWidth <= 1024;
  }

  /**
   * Is viewport in desktop range? (>1024px)
   */
  isDesktopViewport(): boolean {
    if (typeof window === 'undefined') return true;
    return window.innerWidth > 1024;
  }

  /**
   * Does user prefer reduced motion? (accessibility)
   */
  prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Does user prefer dark color scheme?
   */
  prefersDarkMode(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PRIVATE HELPERS
  // ─────────────────────────────────────────────────────────────────────────────

  private buildDeviceContext(): DeviceContext {
    if (typeof window === 'undefined') {
      // SSR fallback
      return {
        isTouchDevice: false,
        isCoarsePointer: false,
        canHover: true,
        lastInputType: 'unknown',
        viewportWidth: 1024,
        viewportHeight: 768,
        isMobileViewport: false,
        isTabletViewport: false,
        isDesktopViewport: true,
        devicePixelRatio: 1,
        prefersReducedMotion: false,
        prefersDarkMode: false,
      };
    }

    return {
      isTouchDevice: this.isTouchDevice(),
      isCoarsePointer: this.isCoarsePointer(),
      canHover: this.canHover(),
      lastInputType: this._lastInputType,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      isMobileViewport: this.isMobileViewport(),
      isTabletViewport: this.isTabletViewport(),
      isDesktopViewport: this.isDesktopViewport(),
      devicePixelRatio: window.devicePixelRatio || 1,
      prefersReducedMotion: this.prefersReducedMotion(),
      prefersDarkMode: this.prefersDarkMode(),
    };
  }

  private initInputTracking(): void {
    if (typeof window === 'undefined') return;

    // Track pointer events for input type detection
    window.addEventListener('pointerdown', (e: PointerEvent) => {
      this._lastInputType = e.pointerType as InputType;
      this.updateDeviceContext();
    }, { passive: true });

    // Track keyboard events
    window.addEventListener('keydown', () => {
      this._lastInputType = 'keyboard';
      this.updateDeviceContext();
    }, { passive: true });
  }

  private initViewportTracking(): void {
    if (typeof window === 'undefined') return;

    // Update on resize
    window.addEventListener('resize', () => {
      this.updateDeviceContext();
    }, { passive: true });

    // Update on media query changes
    const mediaQueries = [
      '(prefers-reduced-motion: reduce)',
      '(prefers-color-scheme: dark)',
      '(pointer: coarse)',
      '(hover: hover)',
    ];

    mediaQueries.forEach(query => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', () => this.updateDeviceContext());
    });
  }

  private updateDeviceContext(): void {
    this._deviceContext$.next(this.buildDeviceContext());
  }

//  public getApiBaseUrl() : string {
//    return appsConfiguration.constants.apis.root;
//  }
////  public getRestApiBaseUrl() : string {
//    return this.system.apis.baseRestUrl;
//  }
}
