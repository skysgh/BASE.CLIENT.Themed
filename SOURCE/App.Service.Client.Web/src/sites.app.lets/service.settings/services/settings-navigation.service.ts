import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';
import { SETTINGS_BASE_PATH, SETTINGS_NAV_ITEMS, APPLET_SETTINGS_PATH } from '../constants/settings.constants';
import { SETTINGS_SEGMENTS } from '../../../core/constants/navigation.constants';

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
 * Uses constants from settings.constants.ts - no hardcoded strings.
 * 
 * Used by:
 * - Gear icon (topbar) → navigates to settings root
 * - Settings hub sidebar → builds nav items
 * - Any component needing settings URLs
 * 
 * Handles account-aware path building automatically.
 */
@Injectable({ providedIn: 'root' })
export class SettingsNavigationService {

  /** Core navigation items - built from constants */
  readonly coreNavItems: SettingsNavItem[] = [
    {
      ...SETTINGS_NAV_ITEMS.SERVICE,
      visible: true
    },
    {
      ...SETTINGS_NAV_ITEMS.ACCOUNT,
      visible: true
    },
    {
      ...SETTINGS_NAV_ITEMS.USER,
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
      return `/${accountId}/${SETTINGS_BASE_PATH}`;
    }
    return `/${SETTINGS_BASE_PATH}`;
  }

  /**
   * Get full path for a settings section
   * @param segment Section segment (e.g., 'user', 'account', 'service')
   */
  getSectionPath(segment: string): string {
    return `${this.getSettingsBasePath()}/${segment}`;
  }

  /**
   * Get relative path for a settings section (for use within settings hub)
   * @param segment Section segment (e.g., 'user', 'account', 'service')
   */
  getRelativeSectionPath(segment: string): string {
    return `./${segment}`;
  }

  /**
   * Get full path for an applet's settings
   * @param appletId Applet identifier
   */
  getAppletSettingsPath(appletId: string): string {
    return `${this.getSettingsBasePath()}/${APPLET_SETTINGS_PATH(appletId)}`;
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
   * Get navigation items with relative paths for sidebar
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
        // Use relative paths for child route navigation
        route: item.segment
      }));
  }
}
