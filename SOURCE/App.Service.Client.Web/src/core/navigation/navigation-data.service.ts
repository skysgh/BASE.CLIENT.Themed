import { Injectable, signal, computed, effect } from '@angular/core';
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
 * 
 * Themes then ADAPT this data to their specific format.
 */
@Injectable({ providedIn: 'root' })
export class NavigationDataService {
  
  /** Navigation data subject */
  private navigationData$ = new BehaviorSubject<NavigationData>({
    sections: [],
    footer: [],
    userMenu: [],
    quickActions: []
  });

  constructor(
    private accountService: AccountService,
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
    const navData: NavigationData = {
      sections: [
        this.buildMainSection(appletItems),
        this.buildInformationSection(),
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
   */
  private buildMainSection(appletItems: AppletNavItem[]): NavigationSection {
    const items: NavigationItem[] = [
      // Dashboard
      {
        id: 'dashboard',
        label: 'BASE.DASHBOARDS.PLURAL',
        description: 'BASE.DASHBOARD.DESCRIPTION',
        icon: 'home',
        route: '/dashboards/main'
      },
      // Search
      {
        id: 'search',
        label: 'BASE.SEARCH.SINGULAR',
        description: 'BASE.SEARCH.DESCRIPTION',
        icon: 'search',
        route: `/${ROUTE_SEGMENTS.APPS}/${ROUTE_SEGMENTS.SEARCH}`
      },
      // Dynamic Applets
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
   * Build information section
   */
  private buildInformationSection(): NavigationSection {
    return {
      id: 'information',
      title: 'BASE.INFORMATIONS.SINGULAR',
      items: [
        {
          id: 'privacy',
          label: 'BASE.POLICIES.PRIVACY',
          icon: 'lock',
          route: `/${ROUTE_SEGMENTS.APPS}/compliance/privacy`
        },
        {
          id: 'terms',
          label: 'BASE.TERMS.TERMS_AND_CONDITIONS',
          icon: 'file',
          route: `/${ROUTE_SEGMENTS.APPS}/compliance/terms`
        },
        {
          id: 'support',
          label: 'BASE.SUPPORT.SINGULAR',
          icon: 'help-circle',
          route: '/pages/information/support'
        }
      ],
      order: 2
    };
  }

  /**
   * Build footer navigation items
   */
  private buildFooterItems(): NavigationItem[] {
    return [
      {
        id: 'settings',
        label: 'BASE.SETTINGS.PLURAL',
        icon: 'cog',
        route: `/${ROUTE_SEGMENTS.APPS}/${ROUTE_SEGMENTS.SETTINGS}`
      }
    ];
  }

  /**
   * Build user menu items
   */
  private buildUserMenuItems(): NavigationItem[] {
    return [
      {
        id: 'profile',
        label: 'BASE.PROFILE.SINGULAR',
        icon: 'user',
        route: '/apps/profile'
      },
      {
        id: 'user-settings',
        label: 'BASE.SETTINGS.USER',
        icon: 'cog',
        route: `/${ROUTE_SEGMENTS.APPS}/${ROUTE_SEGMENTS.SETTINGS}/user`
      },
      {
        id: 'signout',
        label: 'BASE.AUTH.SIGNOUT',
        icon: 'log-out',
        route: '/auth/signout'
      }
    ];
  }

  /**
   * Build quick action items
   */
  private buildQuickActions(): NavigationItem[] {
    return [
      {
        id: 'new-spike',
        label: 'New Spike',
        icon: 'plus',
        route: `/${ROUTE_SEGMENTS.APPS}/spike/add`,
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
      route: applet.route,
      order: applet.order,
      meta: {
        color: applet.color
      }
    };
  }
}
