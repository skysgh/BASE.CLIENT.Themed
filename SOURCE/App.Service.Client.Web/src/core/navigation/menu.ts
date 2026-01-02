import { IHasMenuItem } from '../models/contracts/IHasMenuItem';
// Constants:
import { appsConfiguration } from '../../sites.app/configuration/implementations/apps.configuration';
import { APPLET_IDS, APPLET_REGISTRY } from '../constants/applet.constants';
import { ROUTE_SEGMENTS } from '../constants/navigation.constants';

/**
 * Static Menu Items
 * 
 * This provides the base menu structure.
 * 
 * APPLETS NOTE:
 * Applet menu items are now dynamically built from account config.
 * The 'Apps' section below will be populated by the sidebar component
 * using AppletNavigationService.
 */

/** Static menu items that don't come from applet config */
export const MENU: IHasMenuItem[] =
  [
    {
      id: 10,
      title: 'BASE.DASHBOARDS.PLURAL',
      description: 'BASE.DASHBOARD.DESCRIPTION',
      icon: 'home',
      link: appsConfiguration.navigation.dashboards.root,
    },
    {
      id: 15,
      title: 'BASE.SEARCH.SINGULAR',
      description: 'BASE.SEARCH.DESCRIPTION',
      icon: 'search',
      link: `/${ROUTE_SEGMENTS.APPS}/${ROUTE_SEGMENTS.SEARCH}`,
    },
    // DYNAMIC APPLETS SECTION - will be populated by sidebar component
    {
      id: 20,
      title: 'BASE.APPS.PLURAL',
      description: 'APPS.DESCRIPTION',
      icon: 'grid-alt',
      // Placeholder - sidebar will add subItems dynamically
      subItems: [],
      isDynamicApplets: true, // Flag for sidebar to identify
    },
  ];

/**
 * Build applet menu items from registry
 * Used by sidebar component to populate the Apps menu
 */
export function buildAppletMenuItems(): IHasMenuItem[] {
  const items: IHasMenuItem[] = [];
  let id = 2000;

  // Get business applets from registry
  for (const [appletId, metadata] of Object.entries(APPLET_REGISTRY)) {
    if (!metadata.isService && metadata.defaultEnabled) {
      items.push({
        id: id++,
        title: `APPS.${appletId.toUpperCase()}.SINGULAR`,
        description: `APPS.${appletId.toUpperCase()}.DESCRIPTION`,
        icon: metadata.icon.replace('bx-', ''), // Remove bx- prefix for menu icons
        link: `/${ROUTE_SEGMENTS.APPS}/${metadata.routeSegment}`,
        parentId: 20,
      });
    }
  }

  return items;
}
