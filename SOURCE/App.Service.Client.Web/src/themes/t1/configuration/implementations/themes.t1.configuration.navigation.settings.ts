import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TThemesT1ConfigurationNavigationSettings } from "../t.themes.t1.configuration.navigation.settings";
import { ROUTE_SEGMENTS, SETTINGS_SEGMENTS } from "../../../../core/constants/navigation.constants";

export const NAV_ROOT = StringService.replaceTemplate(environment.custom.urls.navigation.section, ROUTE_SEGMENTS.SETTINGS);

/**
 * Settings Navigation Configuration
 * 
 * Uses core constants for route segments - no hardcoded strings.
 * These paths are used by:
 * - Left sidebar navigation (menu.ts)
 * - Settings hub sidebar
 * - Gear icon
 */
export const themesT1ConfigurationNavigationSettings: TThemesT1ConfigurationNavigationSettings = {
 
  root: `${NAV_ROOT}`,

  /** Platform-wide settings (super admin only) */
  system: `${NAV_ROOT}${SETTINGS_SEGMENTS.SERVICE}`,
  
  /** Per-tenant settings (account admin) 
   * @deprecated Use 'account' instead
   */
  tenancy: `${NAV_ROOT}${SETTINGS_SEGMENTS.ACCOUNT}`,

  /** Per-tenant settings (account admin) */
  account: `${NAV_ROOT}${SETTINGS_SEGMENTS.ACCOUNT}`,
  
  /** Group-level settings (future) */
  group: `${NAV_ROOT}groups`,
  
  /** Per-user preferences (all users) */
  user: `${NAV_ROOT}${SETTINGS_SEGMENTS.USER}`,
}
