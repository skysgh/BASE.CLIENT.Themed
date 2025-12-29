import { Injectable } from '@angular/core';
import { NavigationItem, NavigationData, ThemeMenuItem } from '../../../core/navigation/navigation.model';
import { NavigationDataService } from '../../../core/navigation/navigation-data.service';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { IHasMenuItem } from '../../../core/models/contracts/IHasMenuItem';

/**
 * Theme Navigation Adapter - T1 Theme
 * 
 * Transforms canonical NavigationData to theme-specific format.
 * 
 * This adapter handles:
 * - Icon prefix (e.g., adding 'bx-' for BoxIcons)
 * - Collapse IDs for Bootstrap
 * - Converting routes to links
 * - Flattening/restructuring as needed
 * 
 * EACH THEME HAS ITS OWN ADAPTER.
 */
@Injectable({ providedIn: 'root' })
export class ThemeT1NavigationAdapter {
  
  private idCounter = 0;

  constructor(
    private navigationDataService: NavigationDataService,
    private logger: SystemDiagnosticsTraceService
  ) {}

  /**
   * Get menu items in T1 theme format (IHasMenuItem[])
   */
  getMenuItems(): IHasMenuItem[] {
    const navData = this.navigationDataService.getNavigationDataSync();
    this.idCounter = 0;
    
    const menuItems: IHasMenuItem[] = [];

    for (const section of navData.sections) {
      // Add section title if present
      if (section.title) {
        menuItems.push({
          id: this.nextId(),
          title: section.title,
          description: '',
          isTitle: true
        });
      }

      // Add section items
      for (const item of section.items) {
        menuItems.push(this.convertToThemeFormat(item));
      }
    }

    // Add footer items
    if (navData.footer) {
      for (const item of navData.footer) {
        menuItems.push(this.convertToThemeFormat(item));
      }
    }

    this.logger.debug(`Theme adapter: ${menuItems.length} menu items generated`);
    return menuItems;
  }

  /**
   * Convert canonical NavigationItem to theme format
   */
  private convertToThemeFormat(item: NavigationItem, parentId?: number): IHasMenuItem {
    const id = this.nextId();
    
    const themeItem: IHasMenuItem = {
      id,
      parentId,
      title: item.label,
      description: item.description || '',
      icon: this.mapIcon(item.icon),
      link: item.route,
      isTitle: item.isTitle,
      badge: item.badge ? {
        variant: `bg-${item.badgeVariant || 'primary'}`,
        text: item.badge
      } : undefined
    };

    // Convert children
    if (item.children && item.children.length > 0) {
      themeItem.subItems = item.children
        .filter(child => !child.hidden)
        .sort((a, b) => (a.order || 99) - (b.order || 99))
        .map(child => this.convertToThemeFormat(child, id));
    }

    return themeItem;
  }

  /**
   * Map theme-neutral icon to T1 theme icon
   * T1 uses BoxIcons, so add 'bx-' prefix
   */
  private mapIcon(icon?: string): string | undefined {
    if (!icon) return undefined;
    
    // If already has bx- prefix, return as-is
    if (icon.startsWith('bx-') || icon.startsWith('bx ')) {
      return icon;
    }
    
    // Map common icons to BoxIcons
    const iconMap: Record<string, string> = {
      'home': 'home',
      'search': 'search',
      'grid': 'grid-alt',
      'cog': 'cog',
      'settings': 'cog',
      'user': 'user',
      'lock': 'lock-alt',
      'file': 'file',
      'help-circle': 'help-circle',
      'log-out': 'log-out',
      'plus': 'plus',
      'info': 'info-circle',
    };

    const mapped = iconMap[icon] || icon;
    return mapped;
  }

  private nextId(): number {
    return ++this.idCounter;
  }
}
