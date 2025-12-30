import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
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
   * Get menu items as Observable (reactive - updates when navigation changes)
   */
  getMenuItems$(): Observable<IHasMenuItem[]> {
    return this.navigationDataService.getNavigationData().pipe(
      map(navData => this.convertNavigationData(navData))
    );
  }

  /**
   * Get menu items synchronously (for initial render - may be stale)
   * @deprecated Use getMenuItems$() for reactive updates
   */
  getMenuItems(): IHasMenuItem[] {
    const navData = this.navigationDataService.getNavigationDataSync();
    return this.convertNavigationData(navData);
  }

  /**
   * Convert NavigationData to theme menu items
   */
  private convertNavigationData(navData: NavigationData): IHasMenuItem[] {
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
   * T1 sidebar uses Feather icons (angular-feather)
   * 
   * Valid Feather icon names: https://feathericons.com/
   */
  private mapIcon(icon?: string): string | undefined {
    if (!icon) return undefined;
    
    // Map common/canonical icons to valid Feather icon names
    // See: https://feathericons.com/ for all available icons
    const iconMap: Record<string, string> = {
      // Navigation
      'home': 'home',
      'search': 'search',
      'grid': 'grid',                // NOT 'grid-alt' - that's BoxIcons
      'menu': 'menu',
      
      // Actions
      'plus': 'plus',
      'edit': 'edit',
      'trash': 'trash-2',
      'delete': 'trash-2',
      'save': 'save',
      
      // Settings/Config
      'cog': 'settings',             // 'cog' is not valid Feather - use 'settings'
      'settings': 'settings',
      'gear': 'settings',
      
      // User/Auth
      'user': 'user',
      'users': 'users',
      'lock': 'lock',                // NOT 'lock-alt' - that's BoxIcons
      'unlock': 'unlock',
      'log-out': 'log-out',
      'log-in': 'log-in',
      
      // Content
      'file': 'file',
      'file-text': 'file-text',
      'folder': 'folder',
      'book': 'book',
      'book-open': 'book-open',
      
      // Communication
      'message': 'message-square',
      'mail': 'mail',
      'bell': 'bell',
      
      // Status/Info
      'info': 'info',
      'info-circle': 'info',
      'help': 'help-circle',
      'help-circle': 'help-circle',
      'alert': 'alert-circle',
      'check': 'check',
      'x': 'x',
      
      // Ideas/Innovation
      'bulb': 'zap',                 // 'bulb' is not valid Feather - use 'zap' (lightning)
      'lightbulb': 'zap',
      'idea': 'zap',
      
      // Layout/View
      'list': 'list',
      'layers': 'layers',
      'layout': 'layout',
      'eye': 'eye',
      
      // Analytics
      'chart': 'bar-chart-2',
      'bar-chart': 'bar-chart-2',
      'pie-chart': 'pie-chart',
      'trending-up': 'trending-up',
      
      // Data
      'database': 'database',
      'box': 'box',
      'package': 'package',
      'archive': 'archive',
      
      // Calendar/Time
      'calendar': 'calendar',
      'clock': 'clock',
      
      // Misc
      'star': 'star',
      'heart': 'heart',
      'tag': 'tag',
      'map': 'map',
      'map-pin': 'map-pin',
      'compass': 'compass',
      'globe': 'globe',
      'link': 'link',
      'external-link': 'external-link',
      'download': 'download',
      'upload': 'upload',
      'share': 'share-2',
      'copy': 'copy',
      'clipboard': 'clipboard',
      'tool': 'tool',
      'terminal': 'terminal',
      'code': 'code',
      'cpu': 'cpu',
      'server': 'server',
      'shield': 'shield',
      'activity': 'activity',
      'zap': 'zap',
    };

    // If already a valid feather icon (lowercase with optional hyphens), return as-is
    if (/^[a-z][a-z0-9-]*$/.test(icon) && !iconMap[icon]) {
      return icon;
    }

    return iconMap[icon] || icon;
  }

  private nextId(): number {
    return ++this.idCounter;
  }
}
