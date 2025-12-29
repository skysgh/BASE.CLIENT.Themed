import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';

/**
 * Settings Navigation Item
 */
export interface SettingsNavItem {
  id: string;
  label: string;
  icon: string;
  /** Relative path segment (e.g., 'service', 'account', 'user') */
  segment: string;
  /** Required permission to view this item */
  permission?: string;
  /** Is this visible by default? */
  visible: boolean;
}

/**
 * Settings Navigation Service
 * 
 * Single source of truth for settings navigation.
 * Used by:
 * - Gear icon (topbar) → navigates to settings root
 * - Settings hub sidebar → builds nav items
 * - Any component needing settings URLs
 * 
 * Handles account-aware path building automatically.
 */
@Injectable({ providedIn: 'root' })
export class SettingsNavigationService {
  
  /** Base path for settings (relative to app root) */
  private readonly SETTINGS_BASE = 'apps/settings';

  /** Core navigation items - the single source of truth */
  readonly coreNavItems: SettingsNavItem[] = [
    {
      id: 'service',
      label: 'Service Settings',
      icon: 'bx-server',
      segment: 'service',
      permission: 'settings:service:view',
      visible: true
    },
    {
      id: 'account',
      label: 'Account Settings',
      icon: 'bx-buildings',
      segment: 'account',
      permission: 'settings:account:view',
      visible: true
    },
    {
      id: 'user',
      label: 'User Preferences',
      icon: 'bx-user',
      segment: 'user',
      visible: true
    }
  ];

  constructor(
    private router: Router,
    private accountService: AccountService
  ) {}

  /**
   * Get the base settings path (account-aware)
   * @returns '/apps/settings' or '/{accountId}/apps/settings'
   */
  getSettingsBasePath(): string {
    const accountId = this.accountService.getAccountId();
    if (accountId && accountId !== 'default') {
      return `/${accountId}/${this.SETTINGS_BASE}`;
    }
    return `/${this.SETTINGS_BASE}`;
  }

  /**
   * Get full path for a settings section
   * @param segment Section segment (e.g., 'user', 'account', 'service')
   */
  getSectionPath(segment: string): string {
    return `${this.getSettingsBasePath()}/${segment}`;
  }

  /**
   * Get full path for an applet's settings
   * @param appletId Applet identifier
   */
  getAppletSettingsPath(appletId: string): string {
    return `${this.getSettingsBasePath()}/applets/${appletId}`;
  }

  /**
   * Navigate to settings root (used by gear icon)
   */
  navigateToSettings(): void {
    this.router.navigate([this.getSettingsBasePath()]);
  }

  /**
   * Navigate to a specific settings section
   */
  navigateToSection(segment: string): void {
    this.router.navigate([this.getSectionPath(segment)]);
  }

  /**
   * Get navigation items with full paths resolved
   * @param filterByPermission Optional: filter by user permissions
   */
  getNavItemsWithPaths(filterByPermission?: (permission: string) => boolean): Array<SettingsNavItem & { route: string }> {
    return this.coreNavItems
      .filter(item => {
        if (!item.visible) return false;
        if (item.permission && filterByPermission) {
          return filterByPermission(item.permission);
        }
        return true;
      })
      .map(item => ({
        ...item,
        route: this.getSectionPath(item.segment)
      }));
  }
}
