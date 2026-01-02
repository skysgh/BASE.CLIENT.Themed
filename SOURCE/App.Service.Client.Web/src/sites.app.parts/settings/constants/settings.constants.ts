import { ROUTE_SEGMENTS, SETTINGS_SEGMENTS } from '../../../core/constants/navigation.constants';

/**
 * Settings Navigation Constants
 * 
 * Settings-specific navigation configuration.
 * Builds on core constants to define settings paths.
 */

/**
 * Settings base path (relative to site root)
 * Note: Settings is under /system/settings, not /apps/settings
 */
export const SETTINGS_BASE_PATH = `${ROUTE_SEGMENTS.SYSTEM}/${ROUTE_SEGMENTS.SETTINGS}`;

/**
 * Settings navigation item definitions
 */
export const SETTINGS_NAV_ITEMS = {
  SERVICE: {
    id: 'service',
    label: 'Service Settings',
    icon: 'bx-server',
    segment: SETTINGS_SEGMENTS.SERVICE,
    permission: 'settings:service:view',
  },
  ACCOUNT: {
    id: 'account',
    label: 'Account Settings',
    icon: 'bx-buildings',
    segment: SETTINGS_SEGMENTS.ACCOUNT,
    permission: 'settings:account:view',
  },
  USER: {
    id: 'user',
    label: 'User Preferences',
    icon: 'bx-user',
    segment: SETTINGS_SEGMENTS.USER,
    permission: undefined, // All users can access
  },
} as const;

/**
 * Applet settings path builder
 */
export const APPLET_SETTINGS_PATH = (appletId: string) => 
  `${SETTINGS_SEGMENTS.APPLETS}/${appletId}`;
