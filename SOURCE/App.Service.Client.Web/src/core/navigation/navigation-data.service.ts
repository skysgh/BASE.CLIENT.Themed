import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';
import { NavigationItem, NavigationSection, NavigationData } from './navigation.model';
import { AccountService } from '../services/account.service';
import { AppletNavigationService, AppletNavItem } from '../services/applet-navigation.service';
import { SystemDiagnosticsTraceService } from '../services/system.diagnostics-trace.service';
import { ROUTE_SEGMENTS } from '../constants/navigation.constants';

/**
 * Navigation Data Service
 * 
 * Central service for navigation data that is THEME-AGNOSTIC.
 * 
 * This service:
 * 1. Loads static navigation from config
 * 2. Merges dynamic applet navigation
 * 3. Applies permissions/feature flags
 * 4. Provides canonical NavigationData format
 * 5. Builds account-aware routes (adds account prefix when needed)
 * 
 * Themes then ADAPT this data to their specific format.
 */
@Injectable({ providedIn: 'root' })
export class NavigationDataService {
  
  private accountService = inject(AccountService);
  
  /** Navigation data subject */
  private navigationData$ = new BehaviorSubject<NavigationData>({
    sections: [],
    footer: [],
    userMenu: [],
    quickActions: []
  });

  constructor(
    private appletNavService: AppletNavigationService,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    
    // ✅ React to applet navigation changes using effect
    // When visibleNavItems signal changes, rebuild navigation
    effect(() => {
      const appletItems = this.appletNavService.visibleNavItems();
      this.logger.debug(`Applet nav changed: ${appletItems.length} items`);
      this.buildNavigationWithApplets(appletItems);
    });
  }

  // ─────────────────────────────────────────────────────────────
  // Route Building - Account-Aware
  // ─────────────────────────────────────────────────────────────

  /**
   * Build account-aware route
   * 
   * Routes are built relative to account context:
   * - Default account (no prefix in URL): /apps/system/hub
   * - Named account (with prefix): /foo/apps/system/hub
   * 
   * @param path Path segments after account prefix
   */
  private buildRoute(...segments: string[]): string {
    const path = segments.filter(s => s).join('/');
    
    // Check if we're in an account context
    const accountId = this.accountService.getAccountId();
    const hasAccountPrefix = this.isPathBasedAccountUrl();
    
    if (hasAccountPrefix && accountId !== 'default') {
      return `/${accountId}/${path}`;
    }
    
    return `/${path}`;
  }

  /**
   * Check if current URL has account prefix
   */
  private isPathBasedAccountUrl(): boolean {
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const segments = pathname.split('/').filter(s => s.length > 0);
    if (segments.length === 0) return false;
    
    const firstSegment = segments[0];
    
    // Reserved routes are not account prefixes
    // These are top-level routes that don't have an account prefix
    const reservedRoutes = [
      'pages',        // Public pages (sites.anon)
      'apps',         // Domain applets (sites.app.lets)
      'system',       // Platform parts (sites.app.parts)
      'auth',         // Authentication flows
      'errors',       // Error pages
      'dev',          // Developer tools
      'assets',       // Static assets
      'api',          // API endpoints
      'dashboards',   // Legacy - redirects to system/hub
      'landing',      // Convenience redirect to pages/landing
      'information'   // Convenience redirect to pages/information
    ];
    
    return !reservedRoutes.includes(firstSegment);
  }

  // ─────────────────────────────────────────────────────────────
  // Navigation Data
  // ─────────────────────────────────────────────────────────────

  /**
   * Get navigation data as observable
   */
  getNavigationData(): Observable<NavigationData> {
    return this.navigationData$.asObservable().pipe(
      distinctUntilChanged((prev, curr) => 
        JSON.stringify(prev) === JSON.stringify(curr)
      )
    );
  }

  /**
   * Get navigation data synchronously (current value)
   */
  getNavigationDataSync(): NavigationData {
    return this.navigationData$.getValue();
  }

  /**
   * Refresh navigation (call after login, account change, etc.)
   */
  refresh(): void {
    const appletItems = this.appletNavService.getNavigationItems();
    this.buildNavigationWithApplets(appletItems);
  }

  /**
   * Build navigation with provided applet items
   */
  private buildNavigationWithApplets(appletItems: AppletNavItem[]): void {
    // Build canonical navigation structure
    // Note: Information section removed - Privacy/Terms/Support/Settings 
    // are accessible via other means (compliance module, support module, topbar gear icon)
    const navData: NavigationData = {
      sections: [
        this.buildMainSection(appletItems),
        // Information section removed to clean up sidebar
      ],
      footer: this.buildFooterItems(),
      userMenu: this.buildUserMenuItems(),
      quickActions: this.buildQuickActions()
    };

    this.navigationData$.next(navData);
    this.logger.debug(`Navigation built: ${navData.sections.length} sections, ${appletItems.length} applets`);
  }

  /**
   * Build main navigation section
   * 
   * Route structure:
   * - /apps/*   → Domain applets (sites.app.lets/)
   * - /system/* → Platform parts (sites.app.parts/)
   */
  private buildMainSection(appletItems: AppletNavItem[]): NavigationSection {
    const items: NavigationItem[] = [
      // Hub (central landing page) - now under /system/
      {
        id: 'hub',
        label: 'BASE.HUBS.OBJECTS.INCLUSIVE.SINGULAR',
        description: 'BASE.HUBS.PHRASES.DESCRIPTION',
        icon: 'home',
        route: this.buildRoute(ROUTE_SEGMENTS.SYSTEM, ROUTE_SEGMENTS.HUB)
      },
      // Dynamic Applets - under /apps/
      {
        id: 'apps',
        label: 'BASE.APPS.PLURAL',
        description: 'APPS.DESCRIPTION',
        icon: 'grid',
        children: appletItems.map(applet => this.mapAppletToNavItem(applet))
      },
    ];

    return {
      id: 'main',
      title: 'BASE.MENU.MAIN',
      items,
      order: 1
    };
  }

  /**
   * Build footer navigation items
   * 
   * NOTE: Settings removed from sidebar footer.
   * Settings is accessible via the gear icon in the topbar.
   */
  private buildFooterItems(): NavigationItem[] {
    return [
      // Settings removed - accessible via topbar gear icon
    ];
  }

  /**
   * Build user menu items
   * 
   * Route structure:
   * - /system/* → Platform parts (profile, settings)
   * - /auth/* → Authentication (signout)
   */
  private buildUserMenuItems(): NavigationItem[] {
    return [
      {
        id: 'profile',
        label: 'BASE.PROFILE.SINGULAR',
        icon: 'user',
        route: this.buildRoute(ROUTE_SEGMENTS.SYSTEM, 'authentication', 'profile')
      },
      {
        id: 'user-settings',
        label: 'BASE.SETTINGS.USER',
        icon: 'cog',
        route: this.buildRoute(ROUTE_SEGMENTS.SYSTEM, ROUTE_SEGMENTS.SETTINGS, 'user')
      },
      {
        id: 'signout',
        label: 'BASE.AUTH.SIGNOUT',
        icon: 'log-out',
        route: this.buildRoute('auth', 'signout')
      }
    ];
  }

  /**
   * Build quick action items
   * 
   * Quick actions route to domain applets under /apps/
   */
  private buildQuickActions(): NavigationItem[] {
    return [
      {
        id: 'new-spike',
        label: 'New Spike',
        icon: 'plus',
        route: this.buildRoute(ROUTE_SEGMENTS.APPS, 'spike', 'add'),
        ariaLabel: 'Create a new spike'
      }
    ];
  }

  /**
   * Map AppletNavItem to canonical NavigationItem
   */
  private mapAppletToNavItem(applet: AppletNavItem): NavigationItem {
    return {
      id: applet.id,
      label: applet.label,
      icon: applet.icon.replace('bx-', ''), // Normalize icon
      route: applet.route, // Applet routes are already account-aware from AppletNavigationService
      order: applet.order,
      meta: {
        color: applet.color
      }
    };
  }
}
