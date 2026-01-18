import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { SettingsNavigationService, SettingsNavItem } from '../../../services/settings-navigation.service';
import { SystemDiagnosticsTraceService } from '../../../../../core/services/system.diagnostics-trace.service';
import { BaseCoreAgPipesModule } from '../../../../../core.ag/pipes/module';

interface SettingsNavItemWithRoute extends SettingsNavItem {
  route: string;
}

/**
 * Settings Hub Component
 * 
 * Unified settings view with inline level selector.
 * 
 * KEY BEHAVIOR: When switching levels (Service/Account/User), 
 * the component preserves the current sub-path (e.g., /appearance)
 * so users stay on the same settings panel.
 */
@Component({
    selector: 'app-settings-hub',
    imports: [RouterModule, BaseCoreAgPipesModule],
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
})
export class SettingsHubComponent implements OnInit, OnDestroy {
  // Core settings sections (from navigation service)
  coreNavItems: SettingsNavItemWithRoute[] = [];
  
  // Current level and sub-path tracking
  currentLevel: string = 'user';
  currentSubPath: string = '';
  
  private routeSub?: Subscription;

  constructor(
    private router: Router,
    private settingsNav: SettingsNavigationService,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
  }

  ngOnInit(): void {
    this.buildNavigation();
    this.trackCurrentRoute();
  }
  
  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  private buildNavigation(): void {
    this.coreNavItems = this.settingsNav.getNavItemsWithPaths();
    this.logger.debug(`Settings nav built: ${this.coreNavItems.length} levels`);
  }
  
  /**
   * Track the current route to determine:
   * 1. Which level is active (service/account/user)
   * 2. What sub-path is active (e.g., /appearance, /apps/spike)
   */
  private trackCurrentRoute(): void {
    // Parse initial route
    this.parseCurrentUrl(this.router.url);
    
    // Subscribe to route changes
    this.routeSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.parseCurrentUrl(event.urlAfterRedirects);
    });
  }
  
  /**
   * Parse URL to extract level and sub-path
   * URL format: /system/settings/{level}/{sub-path}
   */
  private parseCurrentUrl(url: string): void {
    // Remove query params and fragments
    const cleanUrl = url.split('?')[0].split('#')[0];
    
    // Match pattern: /system/settings/{level}/{optional-sub-path}
    const match = cleanUrl.match(/\/system\/settings\/([^\/]+)(\/.*)?/);
    
    if (match) {
      this.currentLevel = match[1] || 'user';
      this.currentSubPath = match[2] || '';
    } else {
      this.currentLevel = 'user';
      this.currentSubPath = '';
    }
    
    this.logger.debug(`Settings route parsed: level=${this.currentLevel}, subPath=${this.currentSubPath}`);
  }
  
  /**
   * Switch to a different settings level while preserving the current sub-path
   */
  switchLevel(level: string): void {
    if (level === this.currentLevel) return;
    
    // Navigate to new level with same sub-path
    const newPath = `/system/settings/${level}${this.currentSubPath}`;
    this.router.navigateByUrl(newPath);
  }
  
  /**
   * Check if a level is currently active
   */
  isLevelActive(level: string): boolean {
    return this.currentLevel === level;
  }

  get visibleCoreItems(): SettingsNavItemWithRoute[] {
    return this.coreNavItems.filter(i => i.visible);
  }
}
