import { environment } from "../../../../environments/environment";
import { StringService } from "../../../../core/services/string.service";
import { themesT1Constants } from "../../constants/implementations/themes.t1.constants";
import { ThemesT1ConfigurationType } from "../contracts/t.themes.t1.configuration.type______________";
import { themesT1ConfigurationNavigation } from "./themes.t1.configuration.navigation";
import { themesT1ConfigurationOthers } from "./themes.t1.configuration.others";
import { TThemesT1Configuration } from "../t.themes.t1.configuration";

const ROOT_THEMES_T1 = 'Themes/T1'
/**
 * Constants specific to this theme.
 */

export const NAV_ROOT = StringService.replaceTemplate(environment.custom.urls.navigation.root, '');

/**
 * Theme T1 Configuration.
 * 
 * This is the implementation that provides actual values for the theme configuration.
 * Values defined here can be overridden at runtime via config.json (see EnvConfigService).
 */
export const themesT1Configuration: TThemesT1Configuration /*: ThemesT1ConfigurationType*/ = {

  description: 'Began as Velzone',

  constants: themesT1Constants,

  navigation: themesT1ConfigurationNavigation,

  others: themesT1ConfigurationOthers,

  /**
   * Default post-login redirect destination.
   * 
   * Why '/dashboards/main/': Most authenticated users need to see their dashboard first.
   * 
   * Override in config.json if your deployment needs different behavior:
   * - Redirect to user profile for first-time users
   * - Redirect to pending tasks view
   * - Redirect to custom landing page
   * 
   * Note: Individual login attempts can still override this via returnUrl query param.
   * Example: /auth/signin?returnUrl=/specific-page will go to /specific-page after login.
   */
  postLoginRedirect: '/dashboards/main/',

  /**
   * Branding metadata (hardcoded defaults).
   * 
   * ✅ FIXED: Hardcode instead of importing appsConfiguration (avoids circular dependency).
   * 
   * Pattern: These are theme defaults. Components can still use tierConfig.branding.
   * EnvConfigService can override these at runtime via config.json.
   * 
   * Trade-off:
   * ✅ No circular dependency (theme doesn't import app)
   * ⚠️ Hardcoded paths (but same as app defaults anyway)
   * ✅ Can override via config.json
   * 
   * Used By: Auth pages (login, signin, logout), layout components (topbar, sidebar).
   * 
   * Override in config.json:
   * {
   *   "branding": {
   *     "logoPath": "/media/custom/images/logos/",
   *     "appTitle": "Custom Title",
   *     "appDescription": "Custom Description"
   *   }
   * }
   */
  branding: {
    // ✅ Hardcoded defaults (same as app would provide, but no circular dependency)
    // Note: These paths follow the standard convention:
    //   /media/{tier}/images/logos/
    // where tier = 'apps' for application-level branding
    logoPath: '/media/apps/images/logos/',
    
    // TODO: Load these from environment or config.json
    appTitle: '[TODO:Title]',  // Same as appsConfiguration.description.title
    appDescription: '[TODO:Description]',  // Same as appsConfiguration.description.description
  }
}


