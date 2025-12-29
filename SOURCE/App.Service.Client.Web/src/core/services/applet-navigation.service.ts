import { Injectable, signal, computed } from '@angular/core';
import { AccountService } from './account.service';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
import { 
  APPLET_IDS, 
  APPLET_REGISTRY, 
  AppletId, 
  AppletMetadata,
  getAppletRoutePath 
} from '../constants/applet.constants';
import { ROUTE_SEGMENTS } from '../constants/navigation.constants';

/**
 * Navigation item for menu
 */
export interface AppletNavItem {
  id: AppletId;
  label: string;
  icon: string;
  color: string;
  route: string;
  order: number;
  isActive: boolean;
}

/**
 * Applet config from account.json
 */
interface AccountAppletConfig {
  enabled?: boolean;
  showInNav?: boolean;
  navOrder?: number;
  features?: Record<string, boolean>;
}

/**
 * Applet Navigation Wiring Service
 * 
 * Wires applets to navigation based on:
 * 1. APPLET_REGISTRY (static metadata)
 * 2. Account config (enabled, showInNav, navOrder)
 * 
 * This service is the bridge between:
 * - Static applet definitions (constants)
 * - Dynamic account configuration (JSON)
 * - UI navigation menus
 * 
 * Usage:
 * ```typescript
 * // Get nav items for sidebar
 * const navItems = appletNavService.getNavigationItems();
 * 
 * // Check if applet is enabled
 * const isEnabled = appletNavService.isAppletEnabled('spike');
 * ```
 */
@Injectable({ providedIn: 'root' })
export class AppletNavigationService {
  
  /** Cached navigation items */
  private navItems = signal<AppletNavItem[]>([]);
  
  /** Computed: visible nav items */
  visibleNavItems = computed(() => 
    this.navItems().filter(item => item.isActive).sort((a, b) => a.order - b.order)
  );

  constructor(
    private accountService: AccountService,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
    this.loadNavigation();
  }

  /**
   * Load navigation from account config
   */
  private loadNavigation(): void {
    // Get applets config from account
    this.accountService.getConfigValue<Record<string, AccountAppletConfig>>('applets')
      .subscribe(appletsConfig => {
        if (!appletsConfig) {
          this.logger.debug('No applets config found, using defaults');
          this.buildNavFromDefaults();
          return;
        }

        this.buildNavFromConfig(appletsConfig);
      });
  }

  /**
   * Build navigation from account config
   */
  private buildNavFromConfig(appletsConfig: Record<string, AccountAppletConfig>): void {
    const items: AppletNavItem[] = [];

    // Process each registered applet
    for (const [appletId, metadata] of Object.entries(APPLET_REGISTRY)) {
      const accountConfig = appletsConfig[appletId] || {};
      
      // Determine if enabled (account config overrides default)
      const isEnabled = accountConfig.enabled ?? metadata.defaultEnabled;
      
      // Determine if should show in nav
      const showInNav = accountConfig.showInNav ?? !metadata.isService;
      
      if (isEnabled && showInNav) {
        items.push({
          id: appletId as AppletId,
          label: metadata.displayName,
          icon: metadata.icon,
          color: metadata.color,
          route: `/${ROUTE_SEGMENTS.APPS}/${metadata.routeSegment}`,
          order: accountConfig.navOrder ?? 99,
          isActive: true,
        });
      }
    }

    this.navItems.set(items);
    this.logger.debug(`Navigation built: ${items.length} applets`);
  }

  /**
   * Build navigation from defaults (no account config)
   */
  private buildNavFromDefaults(): void {
    const items: AppletNavItem[] = [];

    for (const metadata of Object.values(APPLET_REGISTRY)) {
      if (metadata.defaultEnabled && !metadata.isService) {
        items.push({
          id: metadata.id,
          label: metadata.displayName,
          icon: metadata.icon,
          color: metadata.color,
          route: `/${ROUTE_SEGMENTS.APPS}/${metadata.routeSegment}`,
          order: 99,
          isActive: true,
        });
      }
    }

    this.navItems.set(items);
  }

  /**
   * Get navigation items for menu
   */
  getNavigationItems(): AppletNavItem[] {
    return this.visibleNavItems();
  }

  /**
   * Check if an applet is enabled
   */
  isAppletEnabled(appletId: AppletId): boolean {
    return this.navItems().some(item => item.id === appletId && item.isActive);
  }

  /**
   * Get applet metadata (static)
   */
  getAppletMetadata(appletId: AppletId): AppletMetadata | undefined {
    return APPLET_REGISTRY[appletId];
  }

  /**
   * Get route for an applet
   */
  getAppletRoute(appletId: AppletId): string {
    return getAppletRoutePath(appletId);
  }

  /**
   * Get default applet ID from account config
   */
  getDefaultAppletId(): AppletId {
    // This would come from account config 'applets.default'
    return APPLET_IDS.SPIKE;
  }

  /**
   * Refresh navigation (call after account changes)
   */
  refresh(): void {
    this.loadNavigation();
  }
}
