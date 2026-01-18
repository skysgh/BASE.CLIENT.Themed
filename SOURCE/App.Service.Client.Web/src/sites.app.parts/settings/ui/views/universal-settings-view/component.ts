/**
 * Universal Settings View Component
 * 
 * A navigation hub that shows links to settings pages.
 * 
 * Architecture:
 * - Reads level from route data (service/account/user)
 * - Shows card grid of available settings destinations
 * - Links to applet-specific settings pages (e.g., /app/spike/settings)
 * - No dynamic module loading - just reads config and shows links
 * 
 * Routes:
 * - /system/settings/service → level = 'service'
 * - /system/settings/account → level = 'account'  
 * - /system/settings/user    → level = 'user'
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SettingsLevel } from '../../../services/applet-settings-registry.service';
import { AccountService } from '../../../../../core/services/account.service';
import { SystemDiagnosticsTraceService } from '../../../../../core/services/system.diagnostics-trace.service';
import { BaseCoreAgPipesModule } from '../../../../../core.ag/pipes/module';

interface SettingsLink {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  route: string;
  category: 'platform' | 'app';
}

@Component({
  selector: 'app-universal-settings-view',
  standalone: true,
  imports: [CommonModule, RouterModule, BaseCoreAgPipesModule],
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class UniversalSettingsViewComponent implements OnInit, OnDestroy {
  /** Current settings level from route data */
  level: SettingsLevel = 'user';
  
  /** Level display info */
  levelInfo = {
    service: { 
      titleKey: 'BASE.SETTINGS.SERVICE.TITLE', 
      descriptionKey: 'BASE.SETTINGS.SERVICE.DESCRIPTION',
      icon: 'bx-server'
    },
    account: { 
      titleKey: 'BASE.SETTINGS.ACCOUNT.TITLE', 
      descriptionKey: 'BASE.SETTINGS.ACCOUNT.DESCRIPTION',
      icon: 'bx-buildings'
    },
    user: { 
      titleKey: 'BASE.SETTINGS.USER.TITLE', 
      descriptionKey: 'BASE.SETTINGS.USER.DESCRIPTION',
      icon: 'bx-user'
    }
  };
  
  /** Platform settings links */
  platformLinks: SettingsLink[] = [];
  
  /** App settings links */
  appLinks: SettingsLink[] = [];
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
  }

  ngOnInit(): void {
    // Read level from route data
    this.route.data
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.level = data['level'] || 'user';
        this.logger.debug(`Settings level: ${this.level}`);
        this.buildLinks();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Build links from account config
   */
  private buildLinks(): void {
    const config = this.accountService.getCurrentConfig();
    
    // Platform settings - include level in route
    this.platformLinks = [
      {
        id: 'appearance',
        titleKey: 'BASE.APPEARANCE.TITLE',
        descriptionKey: 'BASE.APPEARANCE.DESCRIPTION',
        icon: 'bx-palette',
        route: `/system/settings/${this.level}/appearance`,
        category: 'platform'
      }
    ];
    
    // App settings from enabled applets - include level in route
    this.appLinks = [];
    
    if (config?.applets) {
      // Get enabled applets that have settings
      const appletConfigs = this.getEnabledApplets(config.applets);
      
      appletConfigs.forEach(applet => {
        this.appLinks.push({
          id: applet.id,
          titleKey: `APPS.${applet.id.toUpperCase()}.SINGULAR`,
          descriptionKey: `${applet.id.toUpperCase()}.SETTINGS.DESCRIPTION`,
          icon: this.getAppletIcon(applet.id),
          route: `/system/settings/${this.level}/apps/${applet.id}`,
          category: 'app'
        });
      });
    }
    
    this.logger.debug(`Built ${this.platformLinks.length} platform links, ${this.appLinks.length} app links for level: ${this.level}`);
  }

  /**
   * Get enabled applets from config
   */
  private getEnabledApplets(applets: any): { id: string; config: any }[] {
    return Object.entries(applets)
      .filter(([key, value]) => {
        if (key === 'default' || key.startsWith('_')) return false;
        if (typeof value === 'object' && value !== null) {
          return (value as any).enabled === true;
        }
        return false;
      })
      .map(([key, value]) => ({ id: key, config: value }));
  }

  /**
   * Get icon for applet (can be extended with registry lookup)
   */
  private getAppletIcon(appletId: string): string {
    const icons: Record<string, string> = {
      'spike': 'bx-target-lock',
      'surveys': 'bx-list-check',
      'faq': 'bx-help-circle',
      'wiki': 'bx-book-open',
      'billing': 'bx-credit-card',
    };
    return icons[appletId] || 'bx-cog';
  }

  /**
   * Get current level info
   */
  get currentLevelInfo() {
    return this.levelInfo[this.level];
  }
  
  /**
   * Check if there are any links to show
   */
  get hasLinks(): boolean {
    return this.platformLinks.length > 0 || this.appLinks.length > 0;
  }
}
